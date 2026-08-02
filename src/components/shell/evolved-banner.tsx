"use client";

import Link from "next/link";
import { useState } from "react";
import { markSeenHeadAction } from "@/app/actions/mutation";

export function EvolvedBanner({
  headId,
  previousHeadId,
}: {
  headId: string;
  previousHeadId: string | null;
}) {
  const shouldShow = Boolean(previousHeadId && previousHeadId !== headId);
  const [dismissed, setDismissed] = useState(false);

  if (!shouldShow || dismissed || !previousHeadId) {
    if (!shouldShow && previousHeadId === headId) {
      // already seen current head — no-op client
    }
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-3"
      role="status"
    >
      <div className="flex max-w-xl flex-wrap items-center justify-center gap-3 rounded-full border border-[var(--lu-border)] bg-[var(--lu-surface)]/95 px-4 py-2 text-sm text-[var(--lu-text)] shadow-lg backdrop-blur-md">
        <span>
          While you were away, the interface{" "}
          <span className="text-[var(--lu-accent)]">evolved</span>.
        </span>
        <Link
          href={`/compare?a=${previousHeadId}&b=${headId}`}
          className="rounded-full bg-[var(--lu-inverse)] px-3 py-1 text-xs font-medium text-[var(--lu-canvas)]"
          onClick={() => {
            void markSeenHeadAction(headId);
          }}
        >
          Compare
        </Link>
        <button
          type="button"
          className="text-xs text-[var(--lu-text-muted)]"
          onClick={() => {
            setDismissed(true);
            void markSeenHeadAction(headId);
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
