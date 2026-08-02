"use server";

import { revalidatePath } from "next/cache";
import {
  commitSpellSchema,
  validateAndApplySpell,
} from "@/lib/mutation/engine";
import {
  commitPersonalBranch,
  getVersion,
  proposeVersion,
} from "@/lib/data/genesis";

export type ActionResult =
  | { ok: true; version: { id: string; generation: number } }
  | { ok: false; reason: string };

export async function commitSpellAction(
  raw: unknown,
): Promise<ActionResult> {
  const parsed = commitSpellSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, reason: "Invalid mutation payload." };
  }

  const parent = getVersion(parsed.data.parentVersionId);
  if (!parent) {
    return { ok: false, reason: "Parent version not found." };
  }

  const applied = validateAndApplySpell(parent.tokens, parsed.data.spellId, {
    reducedMotion: parsed.data.reducedMotion,
  });

  if (!applied.ok) {
    return { ok: false, reason: applied.reason };
  }

  try {
    const version = commitPersonalBranch({
      parentId: parent.id,
      tokens: applied.tokens,
      spellId: applied.spell.id,
      spellLabel: applied.spell.label,
    });

    revalidatePath("/");
    revalidatePath("/timeline");
    revalidatePath("/mutate");
    revalidatePath(`/v/${version.id}`);

    return {
      ok: true,
      version: { id: version.id, generation: version.generation },
    };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "Commit failed.",
    };
  }
}

export async function proposeVersionAction(
  versionId: string,
): Promise<ActionResult> {
  try {
    const version = proposeVersion(versionId);
    revalidatePath("/timeline");
    return {
      ok: true,
      version: { id: version.id, generation: version.generation },
    };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "Propose failed.",
    };
  }
}
