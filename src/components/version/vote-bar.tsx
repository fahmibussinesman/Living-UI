"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { favoriteAction, proposeVersionAction, voteAction } from "@/app/actions/mutation";
import type { VersionRecord } from "@/lib/tokens/types";
import { cn } from "@/lib/utils";

export function VoteBar({
  version,
  visitorVote = 0,
  favorited = false,
}: {
  version: VersionRecord;
  visitorVote?: -1 | 1 | 0;
  favorited?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function run(fn: () => Promise<unknown>) {
    start(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => voteAction(version.id, 1))}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
          visitorVote === 1
            ? "border-[var(--lu-accent)] bg-[var(--lu-accent)] text-[var(--lu-accent-fg)]"
            : "border-[var(--lu-border)] text-[var(--lu-text-muted)]",
        )}
      >
        ▲ {version.votesUp ?? 0}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => voteAction(version.id, -1))}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
          visitorVote === -1
            ? "border-[var(--lu-border)] bg-[var(--lu-surface-elevated)] text-[var(--lu-text)]"
            : "border-[var(--lu-border)] text-[var(--lu-text-muted)]",
        )}
      >
        ▼ {version.votesDown ?? 0}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => favoriteAction(version.id))}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
          favorited
            ? "border-[var(--lu-accent)] text-[var(--lu-accent)]"
            : "border-[var(--lu-border)] text-[var(--lu-text-muted)]",
        )}
      >
        ★ {version.favorites ?? 0}
      </button>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--lu-text-soft)]">
        score {(version.score ?? 0).toFixed(2)}
      </span>
      {version.status === "personal" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => proposeVersionAction(version.id))}
          className="rounded-full bg-[var(--lu-inverse)] px-3 py-1.5 text-xs font-medium text-[var(--lu-canvas)]"
        >
          Propose to Main
        </button>
      ) : null}
      {version.status === "proposed" ? (
        <span className="rounded-full border border-[var(--lu-accent)] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--lu-accent)]">
          In race
        </span>
      ) : null}
    </div>
  );
}
