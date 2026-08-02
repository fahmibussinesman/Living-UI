import type { VersionRecord } from "@/lib/tokens/types";

export type ScoreInput = {
  votesUp: number;
  votesDown: number;
  favorites: number;
  createdAt: string;
  status: VersionRecord["status"];
  adminBoost?: number;
};

/** Windowed score for Head race. Higher wins. */
export function computeScore(input: ScoreInput): number {
  const ageHours = Math.max(
    0,
    (Date.now() - new Date(input.createdAt).getTime()) / 3_600_000,
  );
  const decay = ageHours * 0.08;
  const base =
    input.votesUp * 1 +
    input.favorites * 2 -
    input.votesDown * 1.5 +
    (input.adminBoost ?? 0);

  // Genesis keeps a floor so empty race never collapses
  const floor = input.status === "genesis" ? 0.5 : 0;
  return base - decay + floor;
}

export function isHeadEligible(status: VersionRecord["status"]): boolean {
  return status === "proposed" || status === "featured" || status === "genesis";
}
