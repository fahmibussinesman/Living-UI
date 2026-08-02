import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceShell } from "@/components/shell/experience-shell";
import { ExperienceView } from "@/components/experience/experience-view";
import { getHeadVersion, getVersion } from "@/lib/data/genesis";
import { proposeVersionAction } from "@/app/actions/mutation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ versionId: string }>;
}): Promise<Metadata> {
  const { versionId } = await params;
  const v = getVersion(versionId);
  if (!v) return { title: "Version" };
  return {
    title: v.label,
    description: `Living UI ${v.id} · generation ${v.generation}`,
  };
}

export default async function VersionPage({
  params,
}: {
  params: Promise<{ versionId: string }>;
}) {
  const { versionId } = await params;
  const version = getVersion(versionId);
  if (!version) notFound();
  const head = getHeadVersion();
  const isHead = version.id === head.id;

  return (
    <ExperienceShell version={version}>
      {!isHead ? (
        <div className="fixed bottom-24 left-1/2 z-40 flex w-[min(100%-2rem,36rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-full border border-[var(--lu-border)] bg-[var(--lu-surface)]/95 px-4 py-2 text-xs backdrop-blur-md md:bottom-28">
          <span className="text-[var(--lu-text-muted)]">
            Branch view · not Head
          </span>
          <Link href="/" className="text-[var(--lu-accent)]">
            Open Head
          </Link>
          <Link
            href={`/compare?a=${head.id}&b=${version.id}`}
            className="text-[var(--lu-text)]"
          >
            Compare
          </Link>
          {version.status === "personal" ? (
            <form
              action={async () => {
                "use server";
                await proposeVersionAction(version.id);
              }}
            >
              <button
                type="submit"
                className="rounded-full bg-[var(--lu-inverse)] px-3 py-1 text-[var(--lu-canvas)]"
              >
                Propose to Main
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
      <ExperienceView version={version} showMutateCta={isHead} />
    </ExperienceShell>
  );
}
