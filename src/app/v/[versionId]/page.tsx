import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceShell } from "@/components/shell/experience-shell";
import { ExperienceView } from "@/components/experience/experience-view";
import { VoteBar } from "@/components/version/vote-bar";
import {
  getHeadVersion,
  getVersion,
  getVisitorVote,
  isFavorited,
} from "@/lib/data/store";
import { getOrCreateVisitorId } from "@/lib/visitor";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ versionId: string }>;
}): Promise<Metadata> {
  const { versionId } = await params;
  const v = getVersion(versionId);
  if (!v) return { title: "Version" };
  const title = v.label;
  const description = `Living UI ${v.id} · generation ${v.generation}`;
  const og = `/og?v=${encodeURIComponent(v.id)}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
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
  const visitorId = await getOrCreateVisitorId();

  return (
    <ExperienceShell version={version}>
      <div className="fixed bottom-24 left-1/2 z-40 flex w-[min(100%-2rem,40rem)] -translate-x-1/2 flex-col items-center gap-2 md:bottom-28">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-[var(--lu-border)] bg-[var(--lu-surface)]/95 px-4 py-3 backdrop-blur-md">
          {!isHead ? (
            <span className="text-xs text-[var(--lu-text-muted)]">
              Branch · not Head
            </span>
          ) : (
            <span className="text-xs text-[var(--lu-accent)]">Head of Main</span>
          )}
          <Link href="/" className="text-xs text-[var(--lu-text)] underline">
            Open Head
          </Link>
          <Link
            href={`/compare?a=${head.id}&b=${version.id}`}
            className="text-xs text-[var(--lu-text-muted)]"
          >
            Compare
          </Link>
          <VoteBar
            version={version}
            visitorVote={getVisitorVote(visitorId, version.id)}
            favorited={isFavorited(visitorId, version.id)}
          />
        </div>
      </div>
      <ExperienceView version={version} showMutateCta={isHead} />
    </ExperienceShell>
  );
}
