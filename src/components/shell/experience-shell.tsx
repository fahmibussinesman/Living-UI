import type { VersionRecord } from "@/lib/tokens/types";
import { getHead } from "@/lib/data/genesis";
import { tokensToCssVars, cssVarsToStyle } from "@/lib/tokens/css-vars";
import { LivingDock } from "@/components/shell/living-dock";
import { VersionChip } from "@/components/shell/version-chip";

export function ExperienceShell({
  version,
  children,
  showChip = true,
}: {
  version: VersionRecord;
  children: React.ReactNode;
  showChip?: boolean;
}) {
  const head = getHead();
  const style = cssVarsToStyle(tokensToCssVars(version.tokens));

  return (
    <div
      className="min-h-full bg-[var(--lu-canvas)] text-[var(--lu-text)] transition-colors duration-200"
      style={style}
      data-world={version.tokens.world}
      data-model={version.tokens.model}
    >
      {showChip ? (
        <VersionChip version={version} headLocked={head.headLocked} />
      ) : null}
      <LivingDock nav={version.tokens.navigation} />
      <main className="flex-1">{children}</main>
      <p className="sr-only">
        Press Control K or Command K to open the command palette.
      </p>
    </div>
  );
}
