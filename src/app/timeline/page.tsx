import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceShell } from "@/components/shell/experience-shell";
import {
  getHead,
  getHeadVersion,
  listMainPath,
  listVersions,
} from "@/lib/data/genesis";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Phylogeny of the Living UI main lineage and personal branches.",
};

export default function TimelinePage() {
  const head = getHeadVersion();
  const lineage = getHead();
  const mainPath = listMainPath();
  const all = listVersions();

  return (
    <ExperienceShell version={head}>
      <div className="mx-auto max-w-4xl px-4 pb-32 pt-28 md:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--lu-accent)]">
          Phylogeny
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--lu-text)] md:text-5xl">
          Timeline
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--lu-text-muted)]">
          Main spine from Genesis to Head
          {lineage.headLocked ? " (locked)" : ""}. Personal branches appear below.
        </p>

        <ol className="mt-12 space-y-0 border-l border-[var(--lu-border)] pl-6">
          {mainPath.map((v, i) => {
            const isHead = v.id === head.id;
            return (
              <li key={v.id} className="relative pb-10">
                <span
                  className="absolute -left-[1.92rem] top-1 size-3 rounded-full border-2 border-[var(--lu-canvas)]"
                  style={{
                    background: isHead ? "var(--lu-accent)" : "var(--lu-text-soft)",
                  }}
                  aria-hidden
                />
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--lu-text-soft)]">
                  Gen {v.generation}
                  {isHead ? " · Head" : ""}
                  {i === 0 ? " · Genesis" : ""}
                </p>
                <Link
                  href={`/v/${v.id}`}
                  className="mt-1 block text-lg text-[var(--lu-text)] hover:text-[var(--lu-accent)]"
                >
                  {v.label}
                </Link>
                <p className="mt-1 text-sm text-[var(--lu-text-muted)]">
                  {v.spellLabel ?? "Origin snapshot"} · {v.tokens.world} /{" "}
                  {v.tokens.model}
                </p>
              </li>
            );
          })}
        </ol>

        <h2 className="mt-8 font-[family-name:var(--font-display)] text-2xl text-[var(--lu-text)]">
          All versions
        </h2>
        <ul className="mt-6 divide-y divide-[var(--lu-border)] border-y border-[var(--lu-border)]">
          {all.map((v) => (
            <li key={v.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <Link href={`/v/${v.id}`} className="text-[var(--lu-text)] hover:text-[var(--lu-accent)]">
                  {v.label}
                </Link>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--lu-text-soft)]">
                  {v.id} · {v.status} · {v.branchKind}
                </p>
              </div>
              <Link
                href={`/compare?a=${head.id}&b=${v.id}`}
                className="text-xs uppercase tracking-[0.12em] text-[var(--lu-text-muted)] hover:text-[var(--lu-text)]"
              >
                Compare to Head
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </ExperienceShell>
  );
}
