import { ExperienceShell } from "@/components/shell/experience-shell";
import { ExperienceView } from "@/components/experience/experience-view";
import { HeadRitual } from "@/components/experience/head-ritual";
import { EvolvedBanner } from "@/components/shell/evolved-banner";
import { getHeadVersion, listMainPath } from "@/lib/data/store";
import { readSeenHeadId } from "@/lib/visitor";

export const dynamic = "force-dynamic";

const WORLD_LABEL = {
  obsidian: "Obsidian Luxury",
  minimal: "Japanese Minimal",
  brutal: "Neo Brutalism",
} as const;

export default async function HomePage() {
  const head = getHeadVersion();
  const path = listMainPath();
  const spellPath = path
    .map((v) => v.spellLabel)
    .filter((x): x is string => Boolean(x));
  const previousHeadId = await readSeenHeadId();

  return (
    <ExperienceShell version={head}>
      <EvolvedBanner headId={head.id} previousHeadId={previousHeadId} />
      <HeadRitual
        generation={head.generation}
        worldLabel={WORLD_LABEL[head.tokens.world]}
        spellPath={spellPath}
        motionLevel={head.tokens.motion}
      />
      <ExperienceView version={head} />
    </ExperienceShell>
  );
}
