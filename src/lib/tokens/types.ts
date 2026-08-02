export type WorldId = "obsidian" | "minimal" | "brutal";
export type ModelId = "portfolio" | "landing" | "museum";
export type HeroLayout = "split" | "stacked" | "editorial" | "monument";
export type NavStyle = "top" | "dock" | "minimal";
export type MaterialStyle = "flat" | "bordered" | "soft-elevated";
export type MotionLevel = "still" | "subtle" | "cinematic";
export type TypeScale = "quiet" | "balanced" | "dramatic";
export type PaletteId =
  | "obsidian-iris"
  | "obsidian-crimson"
  | "minimal-ink"
  | "minimal-coral"
  | "brutal-ember"
  | "brutal-mono";

export type TokenSnapshot = {
  world: WorldId;
  model: ModelId;
  palette: PaletteId;
  typography: TypeScale;
  heroLayout: HeroLayout;
  navigation: NavStyle;
  material: MaterialStyle;
  motion: MotionLevel;
};

export type VersionRecord = {
  id: string;
  generation: number;
  parentId: string | null;
  tokens: TokenSnapshot;
  spellId: string | null;
  spellLabel: string | null;
  status: "genesis" | "active" | "proposed" | "personal" | "hidden" | "featured";
  branchKind: "main" | "personal";
  createdAt: string;
  label: string;
};

export type LineageHead = {
  lineageId: "main";
  headVersionId: string;
  headLocked: boolean;
  genesisVersionId: string;
};
