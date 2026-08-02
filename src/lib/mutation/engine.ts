import { z } from "zod";
import type { TokenSnapshot } from "@/lib/tokens/types";
import { applySpell, getSpell, isSpellCompatible } from "./spells";

export const commitSpellSchema = z.object({
  spellId: z.string().min(1).max(64),
  parentVersionId: z.string().min(1).max(64),
  reducedMotion: z.boolean().optional(),
});

export type CommitSpellInput = z.infer<typeof commitSpellSchema>;

export function clampMotionForA11y(
  tokens: TokenSnapshot,
  reducedMotion: boolean,
): TokenSnapshot {
  if (!reducedMotion) return tokens;
  if (tokens.motion === "still" || tokens.motion === "subtle") return tokens;
  return { ...tokens, motion: "subtle" };
}

export function validateAndApplySpell(
  current: TokenSnapshot,
  spellId: string,
  opts?: { reducedMotion?: boolean },
) {
  const spell = getSpell(spellId);
  if (!spell) {
    return { ok: false as const, reason: "Unknown spell." };
  }
  const compat = isSpellCompatible(spell, current);
  if (!compat.ok) return compat;

  const applied = applySpell(current, spellId);
  if (!applied.ok) return applied;

  const tokens = clampMotionForA11y(
    applied.tokens,
    Boolean(opts?.reducedMotion),
  );

  return {
    ok: true as const,
    tokens,
    spell: applied.spell,
  };
}
