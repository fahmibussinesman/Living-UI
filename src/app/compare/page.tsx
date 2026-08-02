import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceShell } from "@/components/shell/experience-shell";
import { ExperienceView } from "@/components/experience/experience-view";
import { getHeadVersion, getVersion } from "@/lib/data/repo";
import { tokensToCssVars, cssVarsToStyle } from "@/lib/tokens/css-vars";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compare",
  description: "Before and after two Living UI versions.",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const sp = await searchParams;
  const head = await getHeadVersion();
  const a = (sp.a ? await getVersion(sp.a) : null) ?? head;
  const b = (sp.b ? await getVersion(sp.b) : null) ?? head;

  const styleA = cssVarsToStyle(tokensToCssVars(a.tokens));
  const styleB = cssVarsToStyle(tokensToCssVars(b.tokens));

  return (
    <ExperienceShell version={head} showChip={false}>
      <div className="px-4 pb-28 pt-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--lu-text)]">
            Before / after
          </h1>
          <p className="mt-3 text-sm text-[var(--lu-text-muted)]">
            A: {a.id} · B: {b.id}. Pass{" "}
            <code className="font-mono text-[var(--lu-text)]">?a=&amp;b=</code> query
            params.{" "}
            <Link href="/timeline" className="underline">
              Pick from timeline
            </Link>
            .
          </p>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div
              className="overflow-hidden rounded-[var(--lu-radius)] border border-[var(--lu-border)]"
              style={styleA}
            >
              <div className="border-b border-[var(--lu-border)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--lu-text-soft)]">
                A · Gen {a.generation} · {a.label}
              </div>
              <div className="max-h-[70vh] overflow-auto bg-[var(--lu-canvas)]">
                <ExperienceView version={a} showMutateCta={false} />
              </div>
            </div>
            <div
              className="overflow-hidden rounded-[var(--lu-radius)] border border-[var(--lu-border)]"
              style={styleB}
            >
              <div className="border-b border-[var(--lu-border)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--lu-text-soft)]">
                B · Gen {b.generation} · {b.label}
              </div>
              <div className="max-h-[70vh] overflow-auto bg-[var(--lu-canvas)]">
                <ExperienceView version={b} showMutateCta={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExperienceShell>
  );
}
