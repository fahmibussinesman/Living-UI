import type { TokenSnapshot, VersionRecord } from "@/lib/tokens/types";

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
  votesUp: 0,
  votesDown: 0,
  favorites: 0,
  score: 0.5,
};
