import type {
  HeroLayout,
  MaterialStyle,
  MotionLevel,
  NavStyle,
  PaletteId,
  TokenSnapshot,
  TypeScale,
  WorldId,
} from "@/lib/tokens/types";
import { WORLD_PALETTES } from "@/lib/tokens/palettes";

export type SpellCategory =
  | "palette"
  | "typography"
  | "layout"
  | "navigation"
  | "material"
  | "motion";

export type Spell = {
  id: string;
  category: SpellCategory;
  label: string;
  description: string;
  worlds: WorldId[] | "all";
  apply: (tokens: TokenSnapshot) => TokenSnapshot;
  /** Human reason when incompatible with current tokens */
  incompatibleWith?: (tokens: TokenSnapshot) => string | null;
};

function set<K extends keyof TokenSnapshot>(
  tokens: TokenSnapshot,
  key: K,
  value: TokenSnapshot[K],
): TokenSnapshot {
  if (tokens[key] === value) return tokens;
  return { ...tokens, [key]: value };
}

export const SPELLS: Spell[] = [
  // —— Palette ——
  {
    id: "obsidian-deepen-iris",
    category: "palette",
    label: "Deepen the Void (Iris)",
    description: "Near-black gallery with a single iris voltage spike.",
    worlds: ["obsidian"],
    apply: (t) => set(t, "palette", "obsidian-iris"),
  },
  {
    id: "obsidian-crimson-signal",
    category: "palette",
    label: "Crimson Signal",
    description: "Void cathedral. One red pulse. Nothing else chromatic.",
    worlds: ["obsidian"],
    apply: (t) => set(t, "palette", "obsidian-crimson"),
  },
  {
    id: "minimal-ink-bookmark",
    category: "palette",
    label: "Ink Bookmark",
    description: "Quiet white gallery; action in near-black only.",
    worlds: ["minimal"],
    apply: (t) => set(t, "palette", "minimal-ink"),
  },
  {
    id: "minimal-coral-bookmark",
    category: "palette",
    label: "Coral Bookmark",
    description: "One coral punctuation on an otherwise achromatic wall.",
    worlds: ["minimal"],
    apply: (t) => set(t, "palette", "minimal-coral"),
  },
  {
    id: "brutal-ember-only",
    category: "palette",
    label: "Ember Only",
    description: "Monochrome system with ember as the sole live signal.",
    worlds: ["brutal"],
    apply: (t) => set(t, "palette", "brutal-ember"),
  },
  {
    id: "brutal-full-mono",
    category: "palette",
    label: "Full Mono Night",
    description: "Onyx field. No ember. Type does all the talking.",
    worlds: ["brutal"],
    apply: (t) => set(t, "palette", "brutal-mono"),
  },

  // —— Typography ——
  {
    id: "type-quiet",
    category: "typography",
    label: "Quieter Type",
    description: "Restrained scale. Hierarchy through space, not volume.",
    worlds: "all",
    apply: (t) => set(t, "typography", "quiet" satisfies TypeScale),
  },
  {
    id: "type-balanced",
    category: "typography",
    label: "Balanced Scale",
    description: "Default editorial rhythm for the active world.",
    worlds: "all",
    apply: (t) => set(t, "typography", "balanced"),
  },
  {
    id: "type-dramatic",
    category: "typography",
    label: "Raise the Monument",
    description: "Extreme display scale. Type becomes architecture.",
    worlds: "all",
    apply: (t) => set(t, "typography", "dramatic"),
    incompatibleWith: (t) =>
      t.world === "minimal"
        ? "Japanese Minimal rejects monument-scale type."
        : null,
  },

  // —— Layout ——
  {
    id: "layout-split",
    category: "layout",
    label: "Split Hero",
    description: "Media and statement share the first viewport.",
    worlds: "all",
    apply: (t) => set(t, "heroLayout", "split" satisfies HeroLayout),
  },
  {
    id: "layout-stacked",
    category: "layout",
    label: "Stacked Hero",
    description: "Vertical procession. One idea at a time.",
    worlds: "all",
    apply: (t) => set(t, "heroLayout", "stacked"),
  },
  {
    id: "layout-editorial",
    category: "layout",
    label: "Editorial Spread",
    description: "Asymmetric columns. Magazine tension.",
    worlds: "all",
    apply: (t) => set(t, "heroLayout", "editorial"),
  },
  {
    id: "layout-monument",
    category: "layout",
    label: "Monument Hero",
    description: "Type fills the viewport. Everything else recedes.",
    worlds: ["obsidian", "brutal"],
    apply: (t) => set(t, "heroLayout", "monument"),
    incompatibleWith: (t) =>
      t.world === "minimal" ? "Minimal cannot carry monument hero." : null,
  },

  // —— Navigation ——
  {
    id: "nav-top",
    category: "navigation",
    label: "Top Bar",
    description: "Quiet horizontal chrome.",
    worlds: "all",
    apply: (t) => set(t, "navigation", "top" satisfies NavStyle),
  },
  {
    id: "nav-dock",
    category: "navigation",
    label: "Floating Dock",
    description: "Bottom dock. App-like presence.",
    worlds: "all",
    apply: (t) => set(t, "navigation", "dock"),
  },
  {
    id: "nav-minimal",
    category: "navigation",
    label: "Hide the Chrome",
    description: "Minimal affordances. Content first.",
    worlds: "all",
    apply: (t) => set(t, "navigation", "minimal"),
  },

  // —— Material ——
  {
    id: "material-flat",
    category: "material",
    label: "Flat Surfaces",
    description: "No elevation theater. Value steps only.",
    worlds: "all",
    apply: (t) => set(t, "material", "flat" satisfies MaterialStyle),
  },
  {
    id: "material-bordered",
    category: "material",
    label: "Hairline Borders",
    description: "Structure through lines. Editorial honesty.",
    worlds: "all",
    apply: (t) => set(t, "material", "bordered"),
  },
  {
    id: "material-soft",
    category: "material",
    label: "Soft Elevation",
    description: "Gentle lift. Never glass blur.",
    worlds: ["obsidian", "minimal"],
    apply: (t) => set(t, "material", "soft-elevated"),
    incompatibleWith: (t) =>
      t.world === "brutal"
        ? "Neo Brutalism rejects soft elevation."
        : null,
  },

  // —— Motion ——
  {
    id: "motion-still",
    category: "motion",
    label: "Still Frame",
    description: "No decorative motion. Instant state.",
    worlds: "all",
    apply: (t) => set(t, "motion", "still" satisfies MotionLevel),
  },
  {
    id: "motion-subtle",
    category: "motion",
    label: "Subtle Breath",
    description: "Short opacity transitions. Respectful of focus.",
    worlds: "all",
    apply: (t) => set(t, "motion", "subtle"),
  },
  {
    id: "motion-cinematic",
    category: "motion",
    label: "Cinematic Enter",
    description: "Rare, weighted entrances for first paint and sections.",
    worlds: ["obsidian", "brutal"],
    apply: (t) => set(t, "motion", "cinematic"),
    incompatibleWith: (t) =>
      t.world === "minimal"
        ? "Japanese Minimal keeps motion subtle or still."
        : null,
  },
];

export function spellsForWorld(world: WorldId): Spell[] {
  return SPELLS.filter(
    (s) => s.worlds === "all" || s.worlds.includes(world),
  );
}

export function getSpell(id: string): Spell | undefined {
  return SPELLS.find((s) => s.id === id);
}

export function isSpellCompatible(
  spell: Spell,
  tokens: TokenSnapshot,
): { ok: true } | { ok: false; reason: string } {
  if (spell.worlds !== "all" && !spell.worlds.includes(tokens.world)) {
    return { ok: false, reason: `Spell is not available in ${tokens.world}.` };
  }
  const reason = spell.incompatibleWith?.(tokens) ?? null;
  if (reason) return { ok: false, reason };

  const next = spell.apply(tokens);
  if (next.palette && !WORLD_PALETTES[tokens.world].includes(next.palette as PaletteId)) {
    return { ok: false, reason: "Palette not allowed for this world." };
  }
  if (next.world !== tokens.world) {
    return { ok: false, reason: "MVP forbids cross-world speciation." };
  }
  return { ok: true };
}

export function applySpell(
  tokens: TokenSnapshot,
  spellId: string,
): { ok: true; tokens: TokenSnapshot; spell: Spell } | { ok: false; reason: string } {
  const spell = getSpell(spellId);
  if (!spell) return { ok: false, reason: "Unknown spell." };
  const compat = isSpellCompatible(spell, tokens);
  if (!compat.ok) return compat;
  const next = spell.apply(tokens);
  const unchanged =
    JSON.stringify(next) === JSON.stringify(tokens);
  if (unchanged) {
    return { ok: false, reason: "Spell would not change the current head." };
  }
  return { ok: true, tokens: next, spell };
}

export const SPELL_CATEGORIES: SpellCategory[] = [
  "palette",
  "typography",
  "layout",
  "navigation",
  "material",
  "motion",
];
