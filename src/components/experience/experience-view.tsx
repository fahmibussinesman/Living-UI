import Link from "next/link";
import type { TokenSnapshot, VersionRecord } from "@/lib/tokens/types";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/experience/reveal";

const WORLD_LABEL: Record<TokenSnapshot["world"], string> = {
  obsidian: "Obsidian Luxury",
  minimal: "Japanese Minimal",
  brutal: "Neo Brutalism",
};

const MODEL_LABEL: Record<TokenSnapshot["model"], string> = {
  portfolio: "Creative Portfolio",
  landing: "Product Landing",
  museum: "Digital Museum",
};

const PROOF = [
  { k: "Worlds", v: "03" },
  { k: "Spells", v: "22" },
  { k: "Models", v: "03" },
  { k: "Raw CSS", v: "00" },
];

const GALLERY = [
  { title: "Token snapshots", body: "Every version is a full resolved contract — not a diff of vibes." },
  { title: "Compatibility rules", body: "Japanese Minimal cannot accept glitch. Brutalism rejects soft glass." },
  { title: "Collective Head", body: "The homepage is the tip of Main — voted, locked, or genesis." },
  { title: "Spell, not settings", body: "Named mutations with art direction. Whitelist only." },
];

export function ExperienceView({
  version,
  showMutateCta = true,
}: {
  version: VersionRecord;
  showMutateCta?: boolean;
}) {
  const t = version.tokens;
  const isBrutal = t.world === "brutal";
  const isMinimal = t.world === "minimal";

  const displayClass = cn(
    "font-[family-name:var(--font-display)] text-[length:var(--lu-display-size)] text-[var(--lu-text)]",
    isBrutal && "font-[family-name:var(--font-monument)] uppercase",
  );

  const cardClass = cn(
    "bg-[var(--lu-surface)] p-6 md:p-8",
    t.material === "bordered" && "border border-[var(--lu-border)]",
    t.material === "soft-elevated" && "shadow-[var(--lu-shadow)]",
  );

  const hero =
    t.heroLayout === "monument" ? (
      <section className="relative flex min-h-[88vh] flex-col justify-end px-4 pb-28 pt-28 md:px-8 md:pb-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--lu-accent)]">
          {WORLD_LABEL[t.world]} · {MODEL_LABEL[t.model]}
        </p>
        <h1
          className={cn(displayClass, "mt-4 max-w-[18ch]")}
          style={{ lineHeight: "var(--lu-display-lead)", letterSpacing: isBrutal ? "-0.02em" : "-0.03em" }}
        >
          One visit.
          <br />
          One mutation.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--lu-text-muted)] md:text-lg">
          Living UI is a collective species of interface. You are viewing the{" "}
          <strong className="font-medium text-[var(--lu-text)]">Head of Main</strong> —
          generation {version.generation}. Cast a spell. Leave a branch. Propose evolution.
        </p>
        {showMutateCta ? (
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/mutate"
              className="inline-flex items-center rounded-full bg-[var(--lu-inverse)] px-6 py-3 text-sm font-medium text-[var(--lu-canvas)] transition-transform active:scale-[0.97]"
            >
              Cast a spell
            </Link>
            <Link
              href="/timeline"
              className="inline-flex items-center rounded-full border border-[var(--lu-border)] px-6 py-3 text-sm text-[var(--lu-text)] transition-opacity hover:opacity-80"
            >
              View lineage
            </Link>
          </div>
        ) : null}
        <div
          className="pointer-events-none absolute right-0 top-1/4 hidden h-64 w-64 rounded-full md:block"
          style={{ background: "radial-gradient(circle, var(--lu-glow), transparent 70%)" }}
          aria-hidden
        />
      </section>
    ) : t.heroLayout === "split" ? (
      <section className="grid min-h-[80vh] items-center gap-10 px-4 pb-28 pt-28 md:grid-cols-2 md:px-8 md:pb-32">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--lu-accent)]">
            {WORLD_LABEL[t.world]} · {MODEL_LABEL[t.model]}
          </p>
          <h1
            className={cn(displayClass, "mt-4")}
            style={{ lineHeight: "var(--lu-display-lead)" }}
          >
            Many visits.
            <br />
            One Head.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[var(--lu-text-muted)]">
            A curated mutation engine with art direction, not a theme playground.
          </p>
          {showMutateCta ? (
            <Link
              href="/mutate"
              className="mt-8 inline-flex rounded-full bg-[var(--lu-inverse)] px-6 py-3 text-sm font-medium text-[var(--lu-canvas)]"
            >
              Mutate this reality
            </Link>
          ) : null}
        </div>
        <div
          className={cn(cardClass, "min-h-[280px] rounded-[var(--lu-radius)]")}
          style={{ borderWidth: "var(--lu-border-width)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--lu-text-soft)]">
            Active snapshot
          </p>
          <dl className="mt-6 space-y-3 text-sm">
            {(
              [
                ["World", WORLD_LABEL[t.world]],
                ["Model", MODEL_LABEL[t.model]],
                ["Layout", t.heroLayout],
                ["Motion", t.motion],
                ["Material", t.material],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-[var(--lu-border)] pb-2">
                <dt className="text-[var(--lu-text-soft)]">{k}</dt>
                <dd className="text-[var(--lu-text)]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    ) : t.heroLayout === "editorial" ? (
      <section className="grid min-h-[80vh] gap-8 px-4 pb-28 pt-28 md:grid-cols-12 md:px-8 md:pb-32">
        <div className="md:col-span-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--lu-accent)]">
            Editorial · {WORLD_LABEL[t.world]}
          </p>
          <h1
            className={cn(displayClass, "mt-6")}
            style={{ lineHeight: "var(--lu-display-lead)" }}
          >
            Interface as living organism
          </h1>
        </div>
        <div className="flex flex-col justify-end md:col-span-5">
          <p className="text-base leading-relaxed text-[var(--lu-text-muted)] md:text-lg">
            Spells rewrite tokens. Votes rewrite Head. Compatibility keeps the species beautiful.
          </p>
          {showMutateCta ? (
            <Link
              href="/mutate"
              className="mt-8 inline-flex w-fit rounded-full border border-[var(--lu-border)] px-5 py-2.5 text-sm"
            >
              Open mutation studio
            </Link>
          ) : null}
        </div>
      </section>
    ) : (
      <section className="flex min-h-[80vh] flex-col justify-center px-4 pb-28 pt-28 md:px-8 md:pb-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--lu-accent)]">
          {WORLD_LABEL[t.world]}
        </p>
        <h1
          className={cn(displayClass, "mt-4 max-w-4xl")}
          style={{ lineHeight: "var(--lu-display-lead)" }}
        >
          {isMinimal ? "Quiet systems. Loud craft." : "Stack the story. One beat each."}
        </h1>
        <p className="mt-6 max-w-lg text-[var(--lu-text-muted)]">
          Generation {version.generation} · {version.label}
        </p>
        {showMutateCta ? (
          <Link
            href="/mutate"
            className="mt-8 inline-flex w-fit rounded-full bg-[var(--lu-accent)] px-6 py-3 text-sm font-medium text-[var(--lu-accent-fg)]"
          >
            Cast a spell
          </Link>
        ) : null}
      </section>
    );

  return (
    <div className="pb-24">
      {hero}

      <section className="border-t border-[var(--lu-border)] px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF.map((item, i) => (
            <Reveal key={item.k} delay={i * 0.05} motionLevel={t.motion}>
              <div
                className={cn(cardClass, "rounded-[var(--lu-radius)]")}
                style={{ borderWidth: "var(--lu-border-width)" }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--lu-text-soft)]">
                  {item.k}
                </p>
                <p
                  className={cn(
                    "mt-3 text-4xl text-[var(--lu-text)]",
                    isBrutal
                      ? "font-[family-name:var(--font-monument)]"
                      : "font-[family-name:var(--font-display)]",
                  )}
                >
                  {item.v}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal motionLevel={t.motion}>
            <h2
              className={cn(
                "text-3xl text-[var(--lu-text)] md:text-4xl",
                isBrutal
                  ? "font-[family-name:var(--font-monument)] uppercase"
                  : "font-[family-name:var(--font-display)]",
              )}
            >
              {t.model === "museum"
                ? "Exhibits"
                : t.model === "landing"
                  ? "Why it holds"
                  : "Selected systems"}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {GALLERY.map((g, i) => (
              <Reveal key={g.title} delay={0.04 + i * 0.05} motionLevel={t.motion}>
                <article
                  className={cn(cardClass, "rounded-[var(--lu-radius)] h-full")}
                  style={{ borderWidth: "var(--lu-border-width)" }}
                >
                  <h3 className="text-lg font-medium text-[var(--lu-text)]">{g.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--lu-text-muted)]">
                    {g.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--lu-border)] px-4 py-20 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--lu-accent)]">
              Next move
            </p>
            <h2
              className={cn(
                "mt-3 max-w-xl text-3xl text-[var(--lu-text)] md:text-5xl",
                isBrutal
                  ? "font-[family-name:var(--font-monument)] uppercase"
                  : "font-[family-name:var(--font-display)]",
              )}
              style={{ lineHeight: 1.05 }}
            >
              Leave a branch. Shape the Head.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/mutate"
              className="rounded-full bg-[var(--lu-inverse)] px-6 py-3 text-sm font-medium text-[var(--lu-canvas)]"
            >
              Mutation studio
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-[var(--lu-border)] px-6 py-3 text-sm text-[var(--lu-text)]"
            >
              Read the mythos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
