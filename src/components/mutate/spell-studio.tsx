"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SPELL_CATEGORIES,
  applySpell,
  isSpellCompatible,
  spellsForWorld,
  type SpellCategory,
} from "@/lib/mutation/spells";
import type { TokenSnapshot, VersionRecord } from "@/lib/tokens/types";
import { commitSpellAction } from "@/app/actions/mutation";
import { cn } from "@/lib/utils";
import { ExperienceView } from "@/components/experience/experience-view";
import { tokensToCssVars, cssVarsToStyle } from "@/lib/tokens/css-vars";

const CATEGORY_LABEL: Record<SpellCategory, string> = {
  palette: "Palette",
  typography: "Typography",
  layout: "Layout",
  navigation: "Navigation",
  material: "Material",
  motion: "Motion",
};

export function SpellStudio({
  parent,
}: {
  parent: VersionRecord;
}) {
  const router = useRouter();
  const [category, setCategory] = useState<SpellCategory>("layout");
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [resultId, setResultId] = useState<string | null>(null);

  const spells = useMemo(
    () => spellsForWorld(parent.tokens.world).filter((s) => s.category === category),
    [parent.tokens.world, category],
  );

  const previewTokens: TokenSnapshot = useMemo(() => {
    if (!selected) return parent.tokens;
    const applied = applySpell(parent.tokens, selected);
    return applied.ok ? applied.tokens : parent.tokens;
  }, [parent.tokens, selected]);

  const previewVersion: VersionRecord = {
    ...parent,
    id: "preview",
    tokens: previewTokens,
    spellId: selected,
    spellLabel: selected
      ? spellsForWorld(parent.tokens.world).find((s) => s.id === selected)?.label ?? null
      : null,
    label: "Preview",
  };

  const style = cssVarsToStyle(tokensToCssVars(previewTokens));

  function onCommit() {
    if (!selected) {
      setError("Select a spell first.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await commitSpellAction({
        spellId: selected,
        parentVersionId: parent.id,
        reducedMotion:
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
      if (!res.ok) {
        setError(res.reason);
        return;
      }
      setResultId(res.version.id);
      router.push(`/v/${res.version.id}`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-32 pt-24 md:grid-cols-[minmax(0,22rem)_1fr] md:px-6">
      <aside className="space-y-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--lu-accent)]">
            Mutation studio
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--lu-text)] md:text-4xl">
            Cast one spell
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--lu-text-muted)]">
            Whitelist tokens only. Same world as Head. Preview, then commit a personal branch.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {SPELL_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategory(c);
                setSelected(null);
                setError(null);
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-colors",
                category === c
                  ? "bg-[var(--lu-inverse)] text-[var(--lu-canvas)]"
                  : "border border-[var(--lu-border)] text-[var(--lu-text-muted)] hover:text-[var(--lu-text)]",
              )}
            >
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {spells.map((spell) => {
            const compat = isSpellCompatible(spell, parent.tokens);
            const active = selected === spell.id;
            return (
              <li key={spell.id}>
                <button
                  type="button"
                  disabled={!compat.ok}
                  onClick={() => {
                    setSelected(spell.id);
                    setError(null);
                  }}
                  className={cn(
                    "w-full rounded-[var(--lu-radius)] border px-4 py-3 text-left transition-colors",
                    active
                      ? "border-[var(--lu-accent)] bg-[var(--lu-surface-elevated)]"
                      : "border-[var(--lu-border)] bg-[var(--lu-surface)]",
                    !compat.ok && "cursor-not-allowed opacity-40",
                  )}
                >
                  <span className="block text-sm font-medium text-[var(--lu-text)]">
                    {spell.label}
                  </span>
                  <span className="mt-1 block text-xs text-[var(--lu-text-muted)]">
                    {compat.ok ? spell.description : compat.reason}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onCommit}
            disabled={!selected || pending}
            className="rounded-full bg-[var(--lu-inverse)] px-5 py-2.5 text-sm font-medium text-[var(--lu-canvas)] disabled:opacity-40"
          >
            {pending ? "Committing…" : "Commit branch"}
          </button>
          <Link
            href="/"
            className="rounded-full border border-[var(--lu-border)] px-5 py-2.5 text-sm text-[var(--lu-text)]"
          >
            Back to Head
          </Link>
        </div>

        {resultId ? (
          <p className="text-sm text-[var(--lu-text-muted)]">
            Created{" "}
            <Link href={`/v/${resultId}`} className="text-[var(--lu-accent)] underline">
              {resultId}
            </Link>
          </p>
        ) : null}
      </aside>

      <div
        className="overflow-hidden rounded-[var(--lu-radius)] border border-[var(--lu-border)]"
        style={style}
        data-world={previewTokens.world}
      >
        <div className="border-b border-[var(--lu-border)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--lu-text-soft)]">
          Live preview · {selected ?? "no spell selected"}
        </div>
        <div className="max-h-[80vh] overflow-auto bg-[var(--lu-canvas)] text-[var(--lu-text)]">
          <ExperienceView version={previewVersion} showMutateCta={false} />
        </div>
      </div>
    </div>
  );
}
