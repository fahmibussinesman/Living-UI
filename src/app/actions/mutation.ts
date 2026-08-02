"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  commitSpellSchema,
  validateAndApplySpell,
} from "@/lib/mutation/engine";
import {
  castVote,
  commitPersonalBranch,
  ensureVisitor,
  getVersion,
  proposeVersion,
  toggleFavorite,
} from "@/lib/data/repo";
import { SEEN_HEAD_COOKIE, VISITOR_COOKIE } from "@/lib/visitor";

export type ActionResult =
  | { ok: true; version: { id: string; generation: number; score?: number } }
  | { ok: false; reason: string };

async function bindVisitorCookie(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(VISITOR_COOKIE)?.value;
  const id = await ensureVisitor(existing);
  jar.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}

function revalidateLineage(versionId?: string) {
  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/mutate");
  revalidatePath("/evolve");
  revalidatePath("/admin");
  if (versionId) revalidatePath(`/v/${versionId}`);
}

export async function commitSpellAction(
  raw: unknown,
): Promise<ActionResult> {
  const parsed = commitSpellSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, reason: "Invalid mutation payload." };
  }

  await bindVisitorCookie();

  const parent = await getVersion(parsed.data.parentVersionId);
  if (!parent) {
    return { ok: false, reason: "Parent version not found." };
  }

  const applied = validateAndApplySpell(parent.tokens, parsed.data.spellId, {
    reducedMotion: parsed.data.reducedMotion,
  });

  if (!applied.ok) {
    return { ok: false, reason: applied.reason };
  }

  try {
    const version = await commitPersonalBranch({
      parentId: parent.id,
      tokens: applied.tokens,
      spellId: applied.spell.id,
      spellLabel: applied.spell.label,
    });

    revalidateLineage(version.id);

    return {
      ok: true,
      version: {
        id: version.id,
        generation: version.generation,
        score: version.score,
      },
    };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "Commit failed.",
    };
  }
}

export async function proposeVersionAction(
  versionId: string,
): Promise<ActionResult> {
  try {
    await bindVisitorCookie();
    const version = await proposeVersion(versionId);
    revalidateLineage(version.id);
    return {
      ok: true,
      version: {
        id: version.id,
        generation: version.generation,
        score: version.score,
      },
    };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "Propose failed.",
    };
  }
}

export async function voteAction(
  versionId: string,
  value: -1 | 1,
): Promise<ActionResult> {
  try {
    const visitorId = await bindVisitorCookie();
    const version = await castVote({ visitorId, versionId, value });
    revalidateLineage(version.id);
    return {
      ok: true,
      version: {
        id: version.id,
        generation: version.generation,
        score: version.score,
      },
    };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "Vote failed.",
    };
  }
}

export async function favoriteAction(
  versionId: string,
): Promise<ActionResult> {
  try {
    const visitorId = await bindVisitorCookie();
    const version = await toggleFavorite({ visitorId, versionId });
    revalidateLineage(version.id);
    return {
      ok: true,
      version: {
        id: version.id,
        generation: version.generation,
        score: version.score,
      },
    };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "Favorite failed.",
    };
  }
}

export async function markSeenHeadAction(headId: string): Promise<void> {
  const jar = await cookies();
  jar.set(SEEN_HEAD_COOKIE, headId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
