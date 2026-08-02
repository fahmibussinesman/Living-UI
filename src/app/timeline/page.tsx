import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceShell } from "@/components/shell/experience-shell";
import { VoteBar } from "@/components/version/vote-bar";
import {
  getHead,
  getHeadVersion,
  getVisitorVote,
  isFavorited,
  listMainPath,
  listVersions,
} from "@/lib/data/repo";
import { getOrCreateVisitorId } from "@/lib/visitor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Phylogeny of the Living UI main lineage and personal branches.",
};

export default async function TimelinePage() {
  const head = await getHeadVersion();
  const lineage = await getHead();
  const mainPath = await listMainPath();
  const all = await listVersions();
  const visitorId = await getOrCreateVisitorId();

  const voteState = await Promise.all(
    all.map(async (v) => ({
      id: v.id,
      vote: await getVisitorVote(visitorId, v.id),
      fav: await isFavorited(visitorId, v.id),
    })),
  );
  const voteMap = new Map(voteState.map((x) => [x.id, x]));

  return (
    <ExperienceShell version={head}>
      <div className="mx-auto max-w-4xl px-4 pb-32 pt-28 md:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--lu-text)] md:text-5xl">
          Timeline
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--lu-text-muted)]">
          Main spine from Genesis to Head
          {lineage.headLocked ? " (locked)" : ""}. Vote on proposals in{" "}
          <Link href="/evolve" className="text-[var(--lu-accent)] underline">
            Evolve
          </Link>
          .
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
                  {" · score "}
                  {(v.score ?? 0).toFixed(2)}
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
          {all.map((v) => {
            const st = voteMap.get(v.id);
            return (
              <li
                key={v.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    href={`/v/${v.id}`}
                    className="text-[var(--lu-text)] hover:text-[var(--lu-accent)]"
                  >
                    {v.label}
                  </Link>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--lu-text-soft)]">
                    {v.id} · {v.status} · {v.branchKind}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <VoteBar
                    version={v}
                    visitorVote={st?.vote ?? 0}
                    favorited={st?.fav ?? false}
                  />
                  <Link
                    href={`/compare?a=${head.id}&b=${v.id}`}
                    className="text-xs uppercase tracking-[0.12em] text-[var(--lu-text-muted)] hover:text-[var(--lu-text)]"
                  >
                    Compare to Head
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </ExperienceShell>
  );
}
