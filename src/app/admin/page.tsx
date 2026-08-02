import type { Metadata } from "next";
import { ExperienceShell } from "@/components/shell/experience-shell";
import { getHead, getHeadVersion, listVersions, lockHead, setHead } from "@/lib/data/genesis";
import { revalidatePath } from "next/cache";

export const metadata: Metadata = {
  title: "Admin",
  description: "Internal Head controls (local bootstrap — protect in production).",
};

export default function AdminPage() {
  const head = getHeadVersion();
  const lineage = getHead();
  const versions = listVersions();

  async function toggleLock() {
    "use server";
    lockHead(!getHead().headLocked);
    revalidatePath("/");
    revalidatePath("/admin");
  }

  async function makeHead(formData: FormData) {
    "use server";
    const id = String(formData.get("versionId") ?? "");
    if (!id) return;
    try {
      setHead(id, { force: true });
      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/timeline");
    } catch {
      /* ignore invalid */
    }
  }

  return (
    <ExperienceShell version={head}>
      <div className="mx-auto max-w-3xl px-4 pb-32 pt-28 md:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--lu-accent)]">
          Internal
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl">Admin</h1>
        <p className="mt-3 text-sm text-[var(--lu-text-muted)]">
          Local bootstrap controls. Wire Supabase Auth allowlist before production.
        </p>

        <div className="mt-10 rounded-[var(--lu-radius)] border border-[var(--lu-border)] bg-[var(--lu-surface)] p-6">
          <p className="text-sm text-[var(--lu-text)]">
            Head: <span className="font-mono">{lineage.headVersionId}</span>
          </p>
          <p className="mt-2 text-sm text-[var(--lu-text-muted)]">
            Locked: {lineage.headLocked ? "yes" : "no"}
          </p>
          <form action={toggleLock} className="mt-4">
            <button
              type="submit"
              className="rounded-full bg-[var(--lu-inverse)] px-4 py-2 text-sm text-[var(--lu-canvas)]"
            >
              {lineage.headLocked ? "Unlock Head" : "Lock Head"}
            </button>
          </form>
        </div>

        <h2 className="mt-12 text-xl text-[var(--lu-text)]">Set Head</h2>
        <ul className="mt-4 space-y-2">
          {versions.map((v) => (
            <li
              key={v.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--lu-border)] px-4 py-3"
            >
              <span className="text-sm">
                {v.label}{" "}
                <span className="font-mono text-[10px] text-[var(--lu-text-soft)]">
                  {v.id}
                </span>
              </span>
              <form action={makeHead}>
                <input type="hidden" name="versionId" value={v.id} />
                <button
                  type="submit"
                  className="text-xs uppercase tracking-[0.12em] text-[var(--lu-accent)]"
                >
                  Promote
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </ExperienceShell>
  );
}
