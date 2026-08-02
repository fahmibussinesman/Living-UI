import type {
  LineageHead,
  TokenSnapshot,
  VersionRecord,
} from "@/lib/tokens/types";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import {
  dbVersionToRecord,
  recordToDbInsert,
  type DbLineage,
  type DbVersion,
} from "@/lib/supabase/schema";
import { computeScore, isHeadEligible } from "./scoring";
import { GENESIS_TOKENS, GENESIS_VERSION } from "./constants";

function scoreOf(v: VersionRecord): VersionRecord {
  return {
    ...v,
    score: computeScore({
      votesUp: v.votesUp ?? 0,
      votesDown: v.votesDown ?? 0,
      favorites: v.favorites ?? 0,
      createdAt: v.createdAt,
      status: v.status,
    }),
  };
}

async function fetchVersions(): Promise<VersionRecord[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return [];
  const { data, error } = await sb
    .from("versions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as DbVersion[]).map(dbVersionToRecord).map(scoreOf);
}

async function fetchLineage(): Promise<LineageHead> {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return {
      lineageId: "main",
      headVersionId: GENESIS_VERSION.id,
      headLocked: false,
      genesisVersionId: GENESIS_VERSION.id,
    };
  }
  const { data } = await sb.from("lineages").select("*").eq("id", "main").maybeSingle();
  const row = data as DbLineage | null;
  return {
    lineageId: "main",
    headVersionId: row?.head_version_id ?? GENESIS_VERSION.id,
    headLocked: Boolean(row?.head_locked),
    genesisVersionId: row?.genesis_version_id ?? GENESIS_VERSION.id,
  };
}

export async function sbGetHead(): Promise<LineageHead> {
  return fetchLineage();
}

export async function sbGetVersion(
  id: string,
): Promise<VersionRecord | undefined> {
  const sb = getSupabaseAdmin();
  if (!sb) return undefined;
  const { data } = await sb.from("versions").select("*").eq("id", id).maybeSingle();
  if (!data) return undefined;
  return scoreOf(dbVersionToRecord(data as DbVersion));
}

export async function sbGetHeadVersion(): Promise<VersionRecord> {
  const head = await fetchLineage();
  const v = await sbGetVersion(head.headVersionId);
  return v ?? GENESIS_VERSION;
}

export async function sbListVersions(): Promise<VersionRecord[]> {
  const list = await fetchVersions();
  return list.sort(
    (a, b) =>
      (b.score ?? 0) - (a.score ?? 0) ||
      b.generation - a.generation ||
      b.createdAt.localeCompare(a.createdAt),
  );
}

export async function sbListMainPath(): Promise<VersionRecord[]> {
  const map = new Map((await fetchVersions()).map((v) => [v.id, v]));
  const head = await sbGetHeadVersion();
  const path: VersionRecord[] = [];
  let current: VersionRecord | undefined = head;
  const guard = new Set<string>();
  while (current && !guard.has(current.id)) {
    path.push(current);
    guard.add(current.id);
    current = current.parentId ? map.get(current.parentId) : undefined;
  }
  return path.reverse();
}

export async function sbListProposals(): Promise<VersionRecord[]> {
  return (await sbListVersions()).filter((v) => v.status === "proposed");
}

export async function sbEnsureVisitor(visitorId?: string | null): Promise<string> {
  const id =
    visitorId && visitorId.length >= 8
      ? visitorId
      : `vis-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const sb = getSupabaseAdmin();
  if (!sb) return id;
  await sb.from("visitors").upsert(
    { id, last_seen: new Date().toISOString() },
    { onConflict: "id" },
  );
  return id;
}

export async function sbCommitPersonalBranch(input: {
  parentId: string;
  tokens: TokenSnapshot;
  spellId: string;
  spellLabel: string;
}): Promise<VersionRecord> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");
  const parent = await sbGetVersion(input.parentId);
  if (!parent) throw new Error("Parent version not found.");
  if (input.tokens.world !== parent.tokens.world) {
    throw new Error("MVP: same-world mutations only.");
  }

  const record = scoreOf({
    id: `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    generation: parent.generation + 1,
    parentId: parent.id,
    tokens: input.tokens,
    spellId: input.spellId,
    spellLabel: input.spellLabel,
    status: "personal",
    branchKind: "personal",
    createdAt: new Date().toISOString(),
    label: `${input.spellLabel} · gen ${parent.generation + 1}`,
    votesUp: 0,
    votesDown: 0,
    favorites: 0,
    score: 0,
  });

  const { error } = await sb.from("versions").insert(recordToDbInsert(record));
  if (error) throw new Error(error.message);
  return record;
}

export async function sbProposeVersion(versionId: string): Promise<VersionRecord> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");
  const v = await sbGetVersion(versionId);
  if (!v) throw new Error("Version not found.");
  const head = await sbGetHeadVersion();
  if (v.tokens.world !== head.tokens.world) {
    throw new Error("MVP: proposals must match Head world.");
  }
  const next = scoreOf({ ...v, status: "proposed" });
  const { error } = await sb
    .from("versions")
    .update({
      status: "proposed",
      score: next.score,
    })
    .eq("id", versionId);
  if (error) throw new Error(error.message);
  await sbRecomputeHead();
  return next;
}

export async function sbSetHead(
  versionId: string,
  opts?: { force?: boolean },
): Promise<LineageHead> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");
  const lineage = await fetchLineage();
  if (lineage.headLocked && !opts?.force) {
    throw new Error("Head is locked by admin.");
  }
  const v = await sbGetVersion(versionId);
  if (!v) throw new Error("Version not found.");

  await sb
    .from("versions")
    .update({ status: "featured", branch_kind: "main" })
    .eq("id", versionId);
  await sb
    .from("lineages")
    .update({
      head_version_id: versionId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "main");

  return { ...lineage, headVersionId: versionId };
}

export async function sbLockHead(locked: boolean): Promise<LineageHead> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");
  await sb.from("lineages").update({ head_locked: locked }).eq("id", "main");
  return fetchLineage();
}

export async function sbCastVote(input: {
  visitorId: string;
  versionId: string;
  value: -1 | 1;
}): Promise<VersionRecord> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");
  const visitorId = await sbEnsureVisitor(input.visitorId);
  const v = await sbGetVersion(input.versionId);
  if (!v) throw new Error("Version not found.");

  const { data: existing } = await sb
    .from("votes")
    .select("value")
    .eq("visitor_id", visitorId)
    .eq("version_id", input.versionId)
    .maybeSingle();

  let votesUp = v.votesUp ?? 0;
  let votesDown = v.votesDown ?? 0;
  const prev = existing?.value as -1 | 1 | undefined;

  if (prev === 1) votesUp = Math.max(0, votesUp - 1);
  if (prev === -1) votesDown = Math.max(0, votesDown - 1);

  if (prev === input.value) {
    await sb
      .from("votes")
      .delete()
      .eq("visitor_id", visitorId)
      .eq("version_id", input.versionId);
  } else {
    await sb.from("votes").upsert(
      {
        visitor_id: visitorId,
        version_id: input.versionId,
        value: input.value,
      },
      { onConflict: "visitor_id,version_id" },
    );
    if (input.value === 1) votesUp += 1;
    else votesDown += 1;
  }

  const next = scoreOf({ ...v, votesUp, votesDown });
  await sb
    .from("versions")
    .update({
      votes_up: votesUp,
      votes_down: votesDown,
      score: next.score,
    })
    .eq("id", input.versionId);

  await sbRecomputeHead();
  return next;
}

export async function sbToggleFavorite(input: {
  visitorId: string;
  versionId: string;
}): Promise<VersionRecord> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");
  const visitorId = await sbEnsureVisitor(input.visitorId);
  const v = await sbGetVersion(input.versionId);
  if (!v) throw new Error("Version not found.");

  const { data: existing } = await sb
    .from("favorites")
    .select("visitor_id")
    .eq("visitor_id", visitorId)
    .eq("version_id", input.versionId)
    .maybeSingle();

  let favorites = v.favorites ?? 0;
  if (existing) {
    await sb
      .from("favorites")
      .delete()
      .eq("visitor_id", visitorId)
      .eq("version_id", input.versionId);
    favorites = Math.max(0, favorites - 1);
  } else {
    await sb.from("favorites").insert({
      visitor_id: visitorId,
      version_id: input.versionId,
    });
    favorites += 1;
  }

  const next = scoreOf({ ...v, favorites });
  await sb
    .from("versions")
    .update({ favorites_count: favorites, score: next.score })
    .eq("id", input.versionId);
  await sbRecomputeHead();
  return next;
}

export async function sbGetVisitorVote(
  visitorId: string | null | undefined,
  versionId: string,
): Promise<-1 | 1 | 0> {
  if (!visitorId) return 0;
  const sb = getSupabaseAdmin();
  if (!sb) return 0;
  const { data } = await sb
    .from("votes")
    .select("value")
    .eq("visitor_id", visitorId)
    .eq("version_id", versionId)
    .maybeSingle();
  return (data?.value as -1 | 1 | undefined) ?? 0;
}

export async function sbIsFavorited(
  visitorId: string | null | undefined,
  versionId: string,
): Promise<boolean> {
  if (!visitorId) return false;
  const sb = getSupabaseAdmin();
  if (!sb) return false;
  const { data } = await sb
    .from("favorites")
    .select("visitor_id")
    .eq("visitor_id", visitorId)
    .eq("version_id", versionId)
    .maybeSingle();
  return Boolean(data);
}

export async function sbRecomputeHead(): Promise<LineageHead> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");
  const lineage = await fetchLineage();
  if (lineage.headLocked) return lineage;

  const head = await sbGetHeadVersion();
  const all = await fetchVersions();
  const candidates = all
    .map(scoreOf)
    .filter(
      (v) =>
        isHeadEligible(v.status) &&
        v.tokens.world === head.tokens.world &&
        v.status !== "hidden",
    )
    .sort(
      (a, b) =>
        (b.score ?? 0) - (a.score ?? 0) ||
        b.generation - a.generation ||
        b.createdAt.localeCompare(a.createdAt),
    );

  for (const c of candidates) {
    await sb.from("versions").update({ score: c.score }).eq("id", c.id);
  }

  const winner = candidates[0];
  if (winner && winner.id !== lineage.headVersionId) {
    await sb
      .from("versions")
      .update({
        status: winner.status === "genesis" ? "genesis" : "featured",
        branch_kind: "main",
      })
      .eq("id", winner.id);
    await sb
      .from("lineages")
      .update({
        head_version_id: winner.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "main");
    return { ...lineage, headVersionId: winner.id };
  }
  return lineage;
}

export async function sbResetToGenesis(): Promise<LineageHead> {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase not configured");
  await sb.from("votes").delete().neq("version_id", "___none___");
  await sb.from("favorites").delete().neq("version_id", "___none___");
  await sb.from("mutations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await sb.from("versions").delete().neq("id", GENESIS_VERSION.id);
  await sb.from("versions").upsert(recordToDbInsert(GENESIS_VERSION));
  await sb.from("lineages").upsert({
    id: "main",
    head_version_id: GENESIS_VERSION.id,
    genesis_version_id: GENESIS_VERSION.id,
    head_locked: false,
  });
  return fetchLineage();
}

export { GENESIS_TOKENS, GENESIS_VERSION };
