import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceShell } from "@/components/shell/experience-shell";
import { VoteBar } from "@/components/version/vote-bar";
import {
  getHeadVersion,
  getVisitorVote,
  isFavorited,
  listProposals,
  listVersions,
} from "@/lib/data/repo";
import { getOrCreateVisitorId } from "@/lib/visitor";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Evolve",
  description: "Proposal pool and Head race for Living UI.",
};

export default async function EvolvePage() {
  const head = await getHeadVersion();
  const visitorId = await getOrCreateVisitorId();
  const proposals = await listProposals();
  const ranked = (await listVersions()).filter(
    (v) =>
      v.status === "proposed" ||
      v.status === "featured" ||
      v.status === "genesis",
  );

  const voteState = await Promise.all(
    ranked.map(async (v) => ({
      id: v.id,
      vote: await getVisitorVote(visitorId, v.id),
      fav: await isFavorited(visitorId, v.id),
    })),
  );
  const voteMap = new Map(voteState.map((x) => [x.id, x]));

  return (
    <ExperienceShell version={head}>
      <div className="mx-auto max-w-3xl px-4 pb-32 pt-28 md:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--lu-accent)]">
          Collective evolution
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
          Head race
        </h1>
        <p className="mt-4 text-[var(--lu-text-muted)]">
          Same-world proposals compete by windowed score. Head updates unless
          admin-locked. Current Head:{" "}
          <Link href={`/v/${head.id}`} className="text-[var(--lu-accent)] underline">
            {head.label}
          </Link>
          .
        </p>

        <h2 className="mt-12 text-xl text-[var(--lu-text)]">Leaderboard</h2>
        <ul className="mt-6 space-y-4">
          {ranked.map((v, i) => {
            const st = voteMap.get(v.id);
            return (
              <li
                key={v.id}
                className="rounded-[var(--lu-radius)] border border-[var(--lu-border)] bg-[var(--lu-surface)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--lu-text-soft)]">
                      #{i + 1} · Gen {v.generation} · {v.status}
                      {v.id === head.id ? " · HEAD" : ""}
                    </p>
                    <Link
                      href={`/v/${v.id}`}
                      className="mt-1 block text-lg text-[var(--lu-text)] hover:text-[var(--lu-accent)]"
                    >
                      {v.label}
                    </Link>
                  </div>
                  <VoteBar
                    version={v}
                    visitorVote={st?.vote ?? 0}
                    favorited={st?.fav ?? false}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        {proposals.length === 0 ? (
          <p className="mt-10 text-sm text-[var(--lu-text-muted)]">
            No open proposals.{" "}
            <Link href="/mutate" className="text-[var(--lu-accent)] underline">
              Cast a spell
            </Link>{" "}
            and propose your branch.
          </p>
        ) : null}
      </div>
    </ExperienceShell>
  );
}
