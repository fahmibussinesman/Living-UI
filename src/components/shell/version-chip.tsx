import Link from "next/link";
import type { VersionRecord } from "@/lib/tokens/types";

export function VersionChip({
  version,
  headLocked,
}: {
  version: VersionRecord;
  headLocked?: boolean;
}) {
  return (
    <div className="pointer-events-none fixed left-4 top-4 z-50 flex max-w-[min(100%-2rem,24rem)] flex-col gap-1 md:left-6 md:top-6">
      <div className="pointer-events-auto inline-flex flex-wrap items-center gap-2 rounded-full border border-[var(--lu-border)] bg-[var(--lu-surface)]/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--lu-text-muted)] backdrop-blur-sm">
        <span className="text-[var(--lu-accent)]">Gen {version.generation}</span>
        <span aria-hidden>·</span>
        <Link href={`/v/${version.id}`} className="hover:text-[var(--lu-text)]">
          {version.id}
        </Link>
        {headLocked ? (
          <>
            <span aria-hidden>·</span>
            <span>Head locked</span>
          </>
        ) : null}
      </div>
      {version.spellLabel ? (
        <p className="pointer-events-auto max-w-xs text-[11px] text-[var(--lu-text-soft)]">
          Last spell: {version.spellLabel}
        </p>
      ) : (
        <p className="pointer-events-auto max-w-xs text-[11px] text-[var(--lu-text-soft)]">
          Genesis Head · collective main lineage
        </p>
      )}
    </div>
  );
}
