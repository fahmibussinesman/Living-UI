"use client";

import { motion, useReducedMotion } from "motion/react";
import type { MotionLevel } from "@/lib/tokens/types";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  motionLevel = "subtle",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  motionLevel?: MotionLevel;
}) {
  const prefersReduced = useReducedMotion();
  const still = prefersReduced || motionLevel === "still";
  const cinematic = motionLevel === "cinematic" && !still;

  if (still) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{
        opacity: 0,
        y: cinematic ? 16 : 8,
        filter: cinematic ? "blur(6px)" : "blur(0px)",
      }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: cinematic ? 0.55 : 0.28,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
