import type { CSSProperties } from "react";
import type { TokenSnapshot } from "./types";
import { PALETTES } from "./palettes";

export function tokensToCssVars(tokens: TokenSnapshot): Record<string, string> {
  const p = PALETTES[tokens.palette];
  const typeScale =
    tokens.typography === "dramatic"
      ? { display: "clamp(3.5rem, 12vw, 7.5rem)", lead: "0.9" }
      : tokens.typography === "quiet"
        ? { display: "clamp(2rem, 6vw, 3.25rem)", lead: "1.05" }
        : { display: "clamp(2.75rem, 8vw, 5.5rem)", lead: "0.95" };

  const radius =
    tokens.world === "brutal"
      ? "0px"
      : tokens.world === "minimal"
        ? "12px"
        : "16px";

  const shadow =
    tokens.material === "soft-elevated"
      ? "0 12px 40px rgba(0,0,0,0.25)"
      : "none";

  return {
    "--lu-canvas": p.canvas,
    "--lu-surface": p.surface,
    "--lu-surface-elevated": p.surfaceElevated,
    "--lu-border": p.border,
    "--lu-text": p.text,
    "--lu-text-muted": p.textMuted,
    "--lu-text-soft": p.textSoft,
    "--lu-accent": p.accent,
    "--lu-accent-fg": p.accentFg,
    "--lu-inverse": p.inverse,
    "--lu-glow": p.glow,
    "--lu-radius": radius,
    "--lu-radius-pill": "9999px",
    "--lu-shadow": shadow,
    "--lu-display-size": typeScale.display,
    "--lu-display-lead": typeScale.lead,
    "--lu-border-width": tokens.material === "bordered" ? "1px" : "0px",
  };
}

export function cssVarsToStyle(
  vars: Record<string, string>,
): CSSProperties {
  return vars as CSSProperties;
}
