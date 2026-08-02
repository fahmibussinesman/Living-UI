"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export function HeadRitual({
  generation,
  worldLabel,
  spellPath,
  motionLevel,
}: {
  generation: number;
  worldLabel: string;
  spellPath: string[];
  motionLevel: "still" | "subtle" | "cinematic";
}) {
  const prefersReduced = useReducedMotion();
  const skip =
    prefersReduced || motionLevel === "still" || motionLevel === "subtle";
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;
    const t = window.setTimeout(() => setDone(true), 900);
    return () => window.clearTimeout(t);
  }, [skip]);

  if (done) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--lu-canvas)]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.7, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      onAnimationComplete={() => setDone(true)}
      aria-hidden
    >
      <div className="px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--lu-accent)]">
          Main lineage · Generation {generation}
        </p>
        <p
          className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2rem,8vw,4rem)] leading-none text-[var(--lu-text)]"
          style={{ letterSpacing: "-0.03em" }}
        >
          {worldLabel}
        </p>
        {spellPath.length > 0 ? (
          <p className="mx-auto mt-4 max-w-md text-sm text-[var(--lu-text-muted)]">
            {spellPath.join(" → ")}
          </p>
        ) : (
          <p className="mt-4 text-sm text-[var(--lu-text-muted)]">
            Genesis Head · awaiting first speciation
          </p>
        )}
      </div>
    </motion.div>
  );
}
