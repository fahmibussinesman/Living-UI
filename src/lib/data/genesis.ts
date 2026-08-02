import type { LineageHead, TokenSnapshot, VersionRecord } from "@/lib/tokens/types";

export const GENESIS_TOKENS: TokenSnapshot = {
  world: "obsidian",
  model: "portfolio",
  palette: "obsidian-iris",
  typography: "dramatic",
  heroLayout: "monument",
  navigation: "dock",
  material: "flat",
  motion: "cinematic",
};

export const GENESIS_VERSION: VersionRecord = {
  id: "v-genesis",
  generation: 0,
  parentId: null,
  tokens: GENESIS_TOKENS,
  spellId: null,
  spellLabel: null,
  status: "genesis",
  branchKind: "main",
  createdAt: "2026-08-02T00:00:00.000Z",
  label: "Genesis · Obsidian Portfolio",
};

/** In-memory lineage until Supabase is wired */
const versions = new Map<string, VersionRecord>([
  [GENESIS_VERSION.id, GENESIS_VERSION],
]);

let head: LineageHead = {
  lineageId: "main",
  headVersionId: GENESIS_VERSION.id,
  headLocked: false,
  genesisVersionId: GENESIS_VERSION.id,
};

let seq = 1;

export function getHead(): LineageHead {
  return head;
}

export function getVersion(id: string): VersionRecord | undefined {
  return versions.get(id);
}

export function getHeadVersion(): VersionRecord {
  const v = versions.get(head.headVersionId);
  if (!v) return GENESIS_VERSION;
  return v;
}

export function listVersions(): VersionRecord[] {
  return [...versions.values()].sort(
    (a, b) => b.generation - a.generation || b.createdAt.localeCompare(a.createdAt),
  );
}

export function listMainPath(): VersionRecord[] {
  const path: VersionRecord[] = [];
  let current: VersionRecord | undefined = getHeadVersion();
  const guard = new Set<string>();
  while (current && !guard.has(current.id)) {
    path.push(current);
    guard.add(current.id);
    current = current.parentId ? versions.get(current.parentId) : undefined;
  }
  return path.reverse();
}

export function commitPersonalBranch(input: {
  parentId: string;
  tokens: TokenSnapshot;
  spellId: string;
  spellLabel: string;
}): VersionRecord {
  const parent = versions.get(input.parentId);
  if (!parent) {
    throw new Error("Parent version not found.");
  }
  if (input.tokens.world !== parent.tokens.world) {
    throw new Error("MVP: same-world mutations only.");
  }

  const id = `v-${seq++}-${Date.now().toString(36)}`;
  const record: VersionRecord = {
    id,
    generation: parent.generation + 1,
    parentId: parent.id,
    tokens: input.tokens,
    spellId: input.spellId,
    spellLabel: input.spellLabel,
    status: "personal",
    branchKind: "personal",
    createdAt: new Date().toISOString(),
    label: `${input.spellLabel} · gen ${parent.generation + 1}`,
  };
  versions.set(id, record);
  return record;
}

export function proposeVersion(versionId: string): VersionRecord {
  const v = versions.get(versionId);
  if (!v) throw new Error("Version not found.");
  if (v.tokens.world !== getHeadVersion().tokens.world) {
    throw new Error("MVP: proposals must match Head world.");
  }
  const next = { ...v, status: "proposed" as const };
  versions.set(versionId, next);
  return next;
}

export function setHead(versionId: string, opts?: { force?: boolean }) {
  if (head.headLocked && !opts?.force) {
    throw new Error("Head is locked by admin.");
  }
  const v = versions.get(versionId);
  if (!v) throw new Error("Version not found.");
  head = { ...head, headVersionId: versionId };
  versions.set(versionId, { ...v, status: "featured", branchKind: "main" });
  return head;
}

export function lockHead(locked: boolean) {
  head = { ...head, headLocked: locked };
  return head;
}
