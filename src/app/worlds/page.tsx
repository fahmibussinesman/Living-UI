import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceShell } from "@/components/shell/experience-shell";
import { getHeadVersion } from "@/lib/data/genesis";
import { WORLD_DEFAULT_PALETTE } from "@/lib/tokens/palettes";
import type { TokenSnapshot, WorldId } from "@/lib/tokens/types";
import { tokensToCssVars, cssVarsToStyle } from "@/lib/tokens/css-vars";

export const metadata: Metadata = {
  title: "Worlds",
  description: "Art direction contracts for Living UI visual worlds.",
};

const WORLDS: {
  id: WorldId;
  name: string;
  thesis: string;
  motion: string;
  banned: string;
}[] = [
  {
    id: "obsidian",
    name: "Obsidian Luxury",
    thesis: "Void gallery. Type as architecture. One chromatic voltage.",
    motion: "Cinematic ease-out; rare entrances",
    banned: "Multi-accent, glass blur soup, gradient spam",
  },
  {
    id: "minimal",
    name: "Japanese Minimal",
    thesis: "Ma as luxury. Quiet white. One bookmark accent.",
    motion: "≤200ms opacity; no bounce",
    banned: "Glitch, neon, monument condensed type",
  },
  {
    id: "brutal",
    name: "Neo Brutalism",
    thesis: "Monument type. Hairline honesty. Ember punctuation only.",
    motion: "Weighted curves; hard cuts allowed",
    banned: "Soft glass, multi-hue, whisper serif body",
  },
];

function sampleTokens(world: WorldId): TokenSnapshot {
  return {
    world,
    model: "portfolio",
    palette: WORLD_DEFAULT_PALETTE[world],
    typography: world === "minimal" ? "quiet" : "dramatic",
    heroLayout: world === "brutal" ? "monument" : world === "minimal" ? "stacked" : "monument",
    navigation: "dock",
    material: world === "brutal" ? "bordered" : "flat",
    motion: world === "minimal" ? "subtle" : "cinematic",
  };
}

export default function WorldsPage() {
  const head = getHeadVersion();

  return (
    <ExperienceShell version={head}>
      <div className="mx-auto max-w-6xl px-4 pb-32 pt-28 md:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--lu-accent)]">
          Art direction
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
          Worlds
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--lu-text-muted)]">
          Structure differs — not just palette. MVP Head stays same-world when evolving.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {WORLDS.map((w) => {
            const tokens = sampleTokens(w.id);
            const style = cssVarsToStyle(tokensToCssVars(tokens));
            const active = head.tokens.world === w.id;
            return (
              <article
                key={w.id}
                className="overflow-hidden rounded-[var(--lu-radius)] border border-[var(--lu-border)]"
                style={style}
              >
                <div className="min-h-[200px] bg-[var(--lu-canvas)] p-6 text-[var(--lu-text)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--lu-accent)]">
                    {active ? "Head world" : "Contract"}
                  </p>
                  <h2
                    className={
                      w.id === "brutal"
                        ? "mt-3 font-[family-name:var(--font-monument)] text-3xl uppercase"
                        : "mt-3 font-[family-name:var(--font-display)] text-3xl"
                    }
                  >
                    {w.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--lu-text-muted)]">
                    {w.thesis}
                  </p>
                </div>
                <div className="space-y-2 border-t border-[var(--lu-border)] bg-[var(--lu-surface)] p-6 text-sm text-[var(--lu-text-muted)]">
                  <p>
                    <span className="text-[var(--lu-text-soft)]">Motion · </span>
                    {w.motion}
                  </p>
                  <p>
                    <span className="text-[var(--lu-text-soft)]">Banned · </span>
                    {w.banned}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-sm text-[var(--lu-text-muted)]">
          Models (Creative Portfolio, Product Landing, Digital Museum) share slots; worlds
          rewrite tokens and motion recipes.{" "}
          <Link href="/mutate" className="text-[var(--lu-accent)] underline">
            Cast a spell
          </Link>
          .
        </p>
      </div>
    </ExperienceShell>
  );
}
