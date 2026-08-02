import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import type {
  LineageHead,
  TokenSnapshot,
  VersionRecord,
} from "@/lib/tokens/types";
import { computeScore, isHeadEligible } from "./scoring";
import { GENESIS_TOKENS, GENESIS_VERSION } from "./constants";

export { GENESIS_TOKENS, GENESIS_VERSION };

type VoteKey = string; // visitorId::versionId
type StoreSnapshot = {
  versions: VersionRecord[];
  head: LineageHead;
  seq: number;
  votes: Record<VoteKey, -1 | 1>;
  favorites: Record<VoteKey, true>;
  visitors: Record<string, { id: string; createdAt: string }>;
};

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "lineage.json");

function emptySnapshot(): StoreSnapshot {
  return {
    versions: [{ ...GENESIS_VERSION }],
    head: {
      lineageId: "main",
      headVersionId: GENESIS_VERSION.id,
      headLocked: false,
      genesisVersionId: GENESIS_VERSION.id,
    },
    seq: 1,
    votes: {},
    favorites: {},
    visitors: {},
  };
}

function loadSnapshot(): StoreSnapshot {
  try {
    if (!existsSync(DATA_FILE)) return emptySnapshot();
    const raw = readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreSnapshot;
    if (!parsed.versions?.length) return emptySnapshot();
    return {
      ...emptySnapshot(),
      ...parsed,
      versions: parsed.versions.map((v) => ({
        ...GENESIS_VERSION,
        ...v,
        votesUp: v.votesUp ?? 0,
        votesDown: v.votesDown ?? 0,
        favorites: v.favorites ?? 0,
        score: v.score ?? 0,
      })),
    };
  } catch {
    return emptySnapshot();
  }
}

function persist(state: StoreSnapshot) {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
  } catch {
    // Vercel read-only FS — memory only for this instance
  }
}

let state: StoreSnapshot = loadSnapshot();

function versionMap(): Map<string, VersionRecord> {
  return new Map(state.versions.map((v) => [v.id, v]));
}

function saveVersion(v: VersionRecord) {
  const idx = state.versions.findIndex((x) => x.id === v.id);
  if (idx >= 0) state.versions[idx] = v;
  else state.versions.push(v);
  persist(state);
}

function recomputeVersionScore(v: VersionRecord): VersionRecord {
  const score = computeScore({
    votesUp: v.votesUp ?? 0,
    votesDown: v.votesDown ?? 0,
    favorites: v.favorites ?? 0,
    createdAt: v.createdAt,
    status: v.status,
  });
  return { ...v, score };
}

export function getHead(): LineageHead {
  return state.head;
}

export function getVersion(id: string): VersionRecord | undefined {
  return versionMap().get(id);
}

export function getHeadVersion(): VersionRecord {
  return versionMap().get(state.head.headVersionId) ?? GENESIS_VERSION;
}

export function listVersions(): VersionRecord[] {
  return [...state.versions].sort(
    (a, b) =>
      (b.score ?? 0) - (a.score ?? 0) ||
      b.generation - a.generation ||
      b.createdAt.localeCompare(a.createdAt),
  );
}

export function listMainPath(): VersionRecord[] {
  const map = versionMap();
  const path: VersionRecord[] = [];
  let current: VersionRecord | undefined = getHeadVersion();
  const guard = new Set<string>();
  while (current && !guard.has(current.id)) {
    path.push(current);
    guard.add(current.id);
    current = current.parentId ? map.get(current.parentId) : undefined;
  }
  return path.reverse();
}

export function listProposals(): VersionRecord[] {
  return listVersions().filter((v) => v.status === "proposed");
}

export function ensureVisitor(visitorId?: string | null): string {
  const id =
    visitorId && visitorId.length >= 8
      ? visitorId
      : `vis-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  if (!state.visitors[id]) {
    state.visitors[id] = { id, createdAt: new Date().toISOString() };
    persist(state);
  }
  return id;
}

export function commitPersonalBranch(input: {
  parentId: string;
  tokens: TokenSnapshot;
  spellId: string;
  spellLabel: string;
}): VersionRecord {
  const parent = getVersion(input.parentId);
  if (!parent) throw new Error("Parent version not found.");
  if (input.tokens.world !== parent.tokens.world) {
    throw new Error("MVP: same-world mutations only.");
  }

  const id = `v-${state.seq++}-${Date.now().toString(36)}`;
  const record = recomputeVersionScore({
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
    votesUp: 0,
    votesDown: 0,
    favorites: 0,
    score: 0,
  });
  saveVersion(record);
  return record;
}

export function proposeVersion(versionId: string): VersionRecord {
  const v = getVersion(versionId);
  if (!v) throw new Error("Version not found.");
  if (v.tokens.world !== getHeadVersion().tokens.world) {
    throw new Error("MVP: proposals must match Head world.");
  }
  if (v.status === "hidden") throw new Error("Hidden versions cannot propose.");
  const next = recomputeVersionScore({
    ...v,
    status: "proposed",
  });
  saveVersion(next);
  recomputeHead();
  return next;
}

export function setHead(versionId: string, opts?: { force?: boolean }) {
  if (state.head.headLocked && !opts?.force) {
    throw new Error("Head is locked by admin.");
  }
  const v = getVersion(versionId);
  if (!v) throw new Error("Version not found.");
  if (v.tokens.world !== getHeadVersion().tokens.world && !opts?.force) {
    throw new Error("MVP: Head must stay same-world.");
  }
  state.head = { ...state.head, headVersionId: versionId };
  saveVersion(
    recomputeVersionScore({
      ...v,
      status: "featured",
      branchKind: "main",
    }),
  );
  persist(state);
  return state.head;
}

export function lockHead(locked: boolean) {
  state.head = { ...state.head, headLocked: locked };
  persist(state);
  return state.head;
}

export function castVote(input: {
  visitorId: string;
  versionId: string;
  value: -1 | 1;
}): VersionRecord {
  const visitorId = ensureVisitor(input.visitorId);
  const v = getVersion(input.versionId);
  if (!v) throw new Error("Version not found.");
  if (v.status === "hidden") throw new Error("Cannot vote on hidden version.");

  const key = `${visitorId}::${input.versionId}`;
  const prev = state.votes[key];
  let votesUp = v.votesUp ?? 0;
  let votesDown = v.votesDown ?? 0;

  if (prev === 1) votesUp = Math.max(0, votesUp - 1);
  if (prev === -1) votesDown = Math.max(0, votesDown - 1);

  if (prev === input.value) {
    delete state.votes[key];
  } else {
    state.votes[key] = input.value;
    if (input.value === 1) votesUp += 1;
    else votesDown += 1;
  }

  const next = recomputeVersionScore({ ...v, votesUp, votesDown });
  saveVersion(next);
  recomputeHead();
  return next;
}

export function toggleFavorite(input: {
  visitorId: string;
  versionId: string;
}): VersionRecord {
  const visitorId = ensureVisitor(input.visitorId);
  const v = getVersion(input.versionId);
  if (!v) throw new Error("Version not found.");
  const key = `${visitorId}::${input.versionId}`;
  let favorites = v.favorites ?? 0;
  if (state.favorites[key]) {
    delete state.favorites[key];
    favorites = Math.max(0, favorites - 1);
  } else {
    state.favorites[key] = true;
    favorites += 1;
  }
  const next = recomputeVersionScore({ ...v, favorites });
  saveVersion(next);
  recomputeHead();
  return next;
}

export function getVisitorVote(
  visitorId: string | null | undefined,
  versionId: string,
): -1 | 1 | 0 {
  if (!visitorId) return 0;
  return state.votes[`${visitorId}::${versionId}`] ?? 0;
}

export function isFavorited(
  visitorId: string | null | undefined,
  versionId: string,
): boolean {
  if (!visitorId) return false;
  return Boolean(state.favorites[`${visitorId}::${versionId}`]);
}

/** Elect Head from eligible same-world candidates unless locked. */
export function recomputeHead(): LineageHead {
  if (state.head.headLocked) return state.head;

  const headWorld = getHeadVersion().tokens.world;
  const candidates = state.versions
    .map(recomputeVersionScore)
    .filter(
      (v) =>
        isHeadEligible(v.status) &&
        v.tokens.world === headWorld &&
        v.status !== "hidden",
    )
    .sort(
      (a, b) =>
        (b.score ?? 0) - (a.score ?? 0) ||
        b.generation - a.generation ||
        b.createdAt.localeCompare(a.createdAt),
    );

  // refresh scores in store
  for (const c of candidates) {
    const idx = state.versions.findIndex((x) => x.id === c.id);
    if (idx >= 0) state.versions[idx] = c;
  }

  const winner = candidates[0];
  if (winner && winner.id !== state.head.headVersionId) {
    state.head = { ...state.head, headVersionId: winner.id };
    const featured = recomputeVersionScore({
      ...winner,
      status: winner.status === "genesis" ? "genesis" : "featured",
      branchKind: "main",
    });
    saveVersion(featured);
  } else {
    persist(state);
  }
  return state.head;
}

export function resetToGenesis() {
  state = emptySnapshot();
  persist(state);
  return state.head;
}
