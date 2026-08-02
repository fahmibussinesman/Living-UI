import type { PaletteId, WorldId } from "./types";

export type PaletteTokens = {
  canvas: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textMuted: string;
  textSoft: string;
  accent: string;
  accentFg: string;
  inverse: string;
  glow: string;
};

export const PALETTES: Record<PaletteId, PaletteTokens> = {
  "obsidian-iris": {
    canvas: "#0a0a0b",
    surface: "#141416",
    surfaceElevated: "#1c1c1f",
    border: "#2a2a2e",
    text: "#f5f5f7",
    textMuted: "#9f9fa0",
    textSoft: "#6a6b6b",
    accent: "#847dff",
    accentFg: "#0a0a0b",
    inverse: "#ffffff",
    glow: "rgba(132, 125, 255, 0.22)",
  },
  "obsidian-crimson": {
    canvas: "#000000",
    surface: "#0f0f10",
    surfaceElevated: "#171718",
    border: "#2a2a2a",
    text: "#ffffff",
    textMuted: "#cccccc",
    textSoft: "#4c4c4c",
    accent: "#fc1c46",
    accentFg: "#ffffff",
    inverse: "#ffffff",
    glow: "rgba(252, 28, 70, 0.2)",
  },
  "minimal-ink": {
    canvas: "#f7f7f5",
    surface: "#ffffff",
    surfaceElevated: "#ffffff",
    border: "#ebebeb",
    text: "#1a1a1a",
    textMuted: "#6a6a6a",
    textSoft: "#c1c1c1",
    accent: "#1a1a1a",
    accentFg: "#ffffff",
    inverse: "#1a1a1a",
    glow: "rgba(0, 0, 0, 0.04)",
  },
  "minimal-coral": {
    canvas: "#f7f7f5",
    surface: "#ffffff",
    surfaceElevated: "#ffffff",
    border: "#ebebeb",
    text: "#222222",
    textMuted: "#6a6a6a",
    textSoft: "#c1c1c1",
    accent: "#ff385c",
    accentFg: "#ffffff",
    inverse: "#222222",
    glow: "rgba(255, 56, 92, 0.12)",
  },
  "brutal-ember": {
    canvas: "#f8f8f8",
    surface: "#ffffff",
    surfaceElevated: "#ffffff",
    border: "#3c3a3e",
    text: "#3c3a3e",
    textMuted: "#7b7a7c",
    textSoft: "#a2a2a2",
    accent: "#ff6436",
    accentFg: "#161616",
    inverse: "#161616",
    glow: "rgba(255, 100, 54, 0.15)",
  },
  "brutal-mono": {
    canvas: "#161616",
    surface: "#1e1e1e",
    surfaceElevated: "#242424",
    border: "#c9c7cc",
    text: "#f1f1f1",
    textMuted: "#a2a2a2",
    textSoft: "#7b7a7c",
    accent: "#f1f1f1",
    accentFg: "#161616",
    inverse: "#f8f8f8",
    glow: "rgba(241, 241, 241, 0.08)",
  },
};

export const WORLD_DEFAULT_PALETTE: Record<WorldId, PaletteId> = {
  obsidian: "obsidian-iris",
  minimal: "minimal-ink",
  brutal: "brutal-ember",
};

export const WORLD_PALETTES: Record<WorldId, PaletteId[]> = {
  obsidian: ["obsidian-iris", "obsidian-crimson"],
  minimal: ["minimal-ink", "minimal-coral"],
  brutal: ["brutal-ember", "brutal-mono"],
};
