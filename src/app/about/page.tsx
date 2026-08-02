import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceShell } from "@/components/shell/experience-shell";
import { getHeadVersion } from "@/lib/data/repo";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "Mythos and engineering of Living UI.",
};

export default async function AboutPage() {
  const head = await getHeadVersion();
  const backend = isSupabaseConfigured() ? "Supabase" : "local file store";

  return (
    <ExperienceShell version={head}>
      <article className="mx-auto max-w-2xl px-4 pb-32 pt-28 md:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl">
          Living UI
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--lu-text-muted)]">
          <strong className="font-medium text-[var(--lu-text)]">
            One Visit. One Mutation.
          </strong>{" "}
          <strong className="font-medium text-[var(--lu-text)]">
            Many Visits. One Head.
          </strong>
        </p>
        <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-[var(--lu-text-muted)]">
          <p>
            Living UI is a high-fidelity frontend showcase built as a{" "}
            <em className="text-[var(--lu-text)]">collective species of interface</em>.
            The homepage serves the Head of Main — shaped by curated spells and
            community pressure.
          </p>
          <p>
            Mutations never accept raw CSS or JavaScript. Visitors cast named spells
            that rewrite design tokens inside art-directed visual worlds. MVP
            evolution stays same-world as Head.
          </p>
          <p>
            Stack: Next.js App Router, TypeScript strict, Tailwind, Motion, Zod.
            Persistence backend: <span className="text-[var(--lu-text)]">{backend}</span>.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/mutate"
            className="rounded-full bg-[var(--lu-inverse)] px-5 py-2.5 text-sm text-[var(--lu-canvas)]"
          >
            Cast a spell
          </Link>
          <Link
            href="https://github.com/fahmibussinesman/Living-UI"
            className="rounded-full border border-[var(--lu-border)] px-5 py-2.5 text-sm"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Link>
        </div>
      </article>
    </ExperienceShell>
  );
}
