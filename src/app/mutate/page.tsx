import type { Metadata } from "next";
import { ExperienceShell } from "@/components/shell/experience-shell";
import { SpellStudio } from "@/components/mutate/spell-studio";
import { getHeadVersion } from "@/lib/data/repo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mutate",
  description: "Cast one curated spell against the Head of Main.",
};

export default async function MutatePage() {
  const head = await getHeadVersion();
  return (
    <ExperienceShell version={head} showChip={false}>
      <SpellStudio parent={head} />
    </ExperienceShell>
  );
}
