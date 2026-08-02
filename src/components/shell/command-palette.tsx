"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const COMMANDS = [
  { id: "head", label: "Open Head", href: "/", hint: "Collective reality" },
  { id: "mutate", label: "Cast a spell", href: "/mutate", hint: "One mutation" },
  { id: "evolve", label: "Head race", href: "/evolve", hint: "Vote proposals" },
  { id: "timeline", label: "Timeline", href: "/timeline", hint: "Phylogeny" },
  { id: "compare", label: "Compare versions", href: "/compare", hint: "Before / after" },
  { id: "worlds", label: "World gallery", href: "/worlds", hint: "Art direction" },
  { id: "about", label: "About Living UI", href: "/about", hint: "Mythos" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q),
    );
  }, [query]);

  const safeActive =
    filtered.length === 0 ? 0 : Math.min(active, filtered.length - 1);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) {
            setQuery("");
            setActive(0);
          }
          return !v;
        });
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  function run(href: string) {
    setOpen(false);
    setQuery("");
    setActive(0);
    router.push(href);
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/50 px-4 pt-[15vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--lu-border)] bg-[var(--lu-surface)] shadow-2xl">
        <label className="sr-only" htmlFor="command-input">
          Command
        </label>
        <input
          id="command-input"
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            }
            if (e.key === "Enter" && filtered[safeActive]) {
              e.preventDefault();
              run(filtered[safeActive].href);
            }
          }}
          placeholder="Jump… (mutations, timeline, worlds)"
          className="w-full border-b border-[var(--lu-border)] bg-transparent px-4 py-3 text-sm text-[var(--lu-text)] outline-none placeholder:text-[var(--lu-text-soft)]"
        />
        <ul className="max-h-72 overflow-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-[var(--lu-text-muted)]">
              No matches
            </li>
          ) : (
            filtered.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => run(c.href)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm",
                    i === safeActive
                      ? "bg-[var(--lu-inverse)] text-[var(--lu-canvas)]"
                      : "text-[var(--lu-text)] hover:bg-[var(--lu-surface-elevated)]",
                  )}
                >
                  <span>{c.label}</span>
                  <span
                    className={cn(
                      "text-[11px]",
                      i === safeActive ? "opacity-70" : "text-[var(--lu-text-soft)]",
                    )}
                  >
                    {c.hint}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <p className="border-t border-[var(--lu-border)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--lu-text-soft)]">
          Esc close · ↑↓ · Enter
        </p>
      </div>
    </div>
  );
}
