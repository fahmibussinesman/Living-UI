import { ExperienceShell } from "@/components/shell/experience-shell";
import { ExperienceView } from "@/components/experience/experience-view";
import { HeadRitual } from "@/components/experience/head-ritual";
import { getHeadVersion, listMainPath } from "@/lib/data/genesis";

export const dynamic = "force-dynamic";

const WORLD_LABEL = {
  obsidian: "Obsidian Luxury",
  minimal: "Japanese Minimal",
  brutal: "Neo Brutalism",
} as const;

export default function HomePage() {
  const head = getHeadVersion();
  const path = listMainPath();
  const spellPath = path
    .map((v) => v.spellLabel)
    .filter((x): x is string => Boolean(x));

  return (
    <ExperienceShell version={head}>
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
