import type { TokenSnapshot, VersionRecord } from "@/lib/tokens/types";

export type DbVersion = {
  id: string;
  parent_id: string | null;
  world_id: string;
  model_id: string;
  generation: number;
  token_snapshot: TokenSnapshot;
  spell_id: string | null;
  spell_label: string | null;
  status: VersionRecord["status"];
  branch_kind: VersionRecord["branchKind"];
  created_at: string;
  label: string;
  votes_up: number;
  votes_down: number;
  favorites_count: number;
  score: number;
};

export type DbLineage = {
  id: string;
  head_version_id: string | null;
  genesis_version_id: string | null;
  head_locked: boolean;
};

export function dbVersionToRecord(row: DbVersion): VersionRecord {
  return {
    id: row.id,
    generation: row.generation,
    parentId: row.parent_id,
    tokens: row.token_snapshot,
    spellId: row.spell_id,
    spellLabel: row.spell_label,
    status: row.status,
    branchKind: row.branch_kind,
    createdAt: row.created_at,
    label: row.label,
    votesUp: row.votes_up ?? 0,
    votesDown: row.votes_down ?? 0,
    favorites: row.favorites_count ?? 0,
    score: row.score ?? 0,
  };
}

export function recordToDbInsert(v: VersionRecord) {
  return {
    id: v.id,
    parent_id: v.parentId,
    world_id: v.tokens.world,
    model_id: v.tokens.model,
    generation: v.generation,
    token_snapshot: v.tokens,
    spell_id: v.spellId,
    spell_label: v.spellLabel,
    status: v.status,
    branch_kind: v.branchKind,
    created_at: v.createdAt,
    label: v.label,
    votes_up: v.votesUp ?? 0,
    votes_down: v.votesDown ?? 0,
    favorites_count: v.favorites ?? 0,
    score: v.score ?? 0,
    lineage_id: "main",
  };
}
