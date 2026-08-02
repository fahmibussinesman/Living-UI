import { describe, expect, it } from "vitest";
import { GENESIS_TOKENS } from "@/lib/data/constants";
import { applySpell, isSpellCompatible, getSpell } from "./spells";
import { clampMotionForA11y, validateAndApplySpell } from "./engine";

describe("spell compatibility", () => {
  it("rejects monument type on minimal", () => {
    const minimal = { ...GENESIS_TOKENS, world: "minimal" as const, typography: "balanced" as const };
    const spell = getSpell("type-dramatic")!;
    const res = isSpellCompatible(spell, minimal);
    expect(res.ok).toBe(false);
  });

  it("rejects soft material on brutal", () => {
    const brutal = { ...GENESIS_TOKENS, world: "brutal" as const };
    const spell = getSpell("material-soft")!;
    const res = isSpellCompatible(spell, brutal);
    expect(res.ok).toBe(false);
  });

  it("applies crimson signal on obsidian", () => {
    const res = applySpell(GENESIS_TOKENS, "obsidian-crimson-signal");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.tokens.palette).toBe("obsidian-crimson");
      expect(res.tokens.world).toBe("obsidian");
    }
  });

  it("rejects no-op spell", () => {
    const res = applySpell(GENESIS_TOKENS, "obsidian-deepen-iris");
    expect(res.ok).toBe(false);
  });
});

describe("a11y motion clamp", () => {
  it("clamps cinematic when reduced motion", () => {
    const next = clampMotionForA11y(GENESIS_TOKENS, true);
    expect(next.motion).toBe("subtle");
  });

  it("validateAndApplySpell respects reduced motion", () => {
    const parent = {
      ...GENESIS_TOKENS,
      motion: "still" as const,
    };
    const res = validateAndApplySpell(parent, "motion-cinematic", {
      reducedMotion: true,
    });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.tokens.motion).toBe("subtle");
  });
});
