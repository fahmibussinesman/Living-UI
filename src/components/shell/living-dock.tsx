"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GitBranch,
  Info,
  Layers,
  Sparkles,
  Timer,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Head", icon: Sparkles },
  { href: "/mutate", label: "Mutate", icon: Wand2 },
  { href: "/timeline", label: "Timeline", icon: Timer },
  { href: "/worlds", label: "Worlds", icon: Layers },
  { href: "/compare", label: "Compare", icon: GitBranch },
  { href: "/about", label: "About", icon: Info },
];

export function LivingDock({ nav = "dock" }: { nav?: "dock" | "top" | "minimal" }) {
  const pathname = usePathname();

  if (nav === "minimal") {
    return (
      <nav
        aria-label="Primary"
        className="fixed right-4 top-4 z-50 flex gap-2 md:right-6 md:top-6"
      >
        <Link
          href="/mutate"
          className="rounded-full border border-[var(--lu-border)] bg-[var(--lu-surface)]/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--lu-text)] backdrop-blur-sm transition-opacity hover:opacity-80"
        >
          Mutate
        </Link>
      </nav>
    );
  }

  if (nav === "top") {
    return (
      <header className="sticky top-0 z-50 border-b border-[var(--lu-border)] bg-[var(--lu-canvas)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--lu-text-muted)]">
            Living UI
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-1">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs transition-colors",
                    active
                      ? "bg-[var(--lu-inverse)] text-[var(--lu-canvas)]"
                      : "text-[var(--lu-text-muted)] hover:text-[var(--lu-text)]",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    );
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[var(--lu-border)] bg-[var(--lu-surface)]/85 p-1.5 shadow-[var(--lu-shadow)] backdrop-blur-md md:bottom-6"
    >
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex items-center gap-2 rounded-full px-3 py-2 text-[var(--lu-text-muted)] transition-colors",
              active && "bg-[var(--lu-inverse)] text-[var(--lu-canvas)]",
              !active && "hover:text-[var(--lu-text)]",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="sr-only md:not-sr-only md:text-[11px] md:font-medium md:uppercase md:tracking-[0.12em]">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
