import { ImageResponse } from "next/og";
import { getHeadVersion, getVersion } from "@/lib/data/store";
import { PALETTES } from "@/lib/tokens/palettes";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("v");
  const version = (id ? getVersion(id) : null) ?? getHeadVersion();
  const palette = PALETTES[version.tokens.palette];

  const world =
    version.tokens.world === "obsidian"
      ? "Obsidian Luxury"
      : version.tokens.world === "minimal"
        ? "Japanese Minimal"
        : "Neo Brutalism";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: palette.canvas,
          color: palette.text,
          padding: 64,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: palette.accent,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Living UI · Gen {version.generation}
          </div>
          <div style={{ fontSize: 72, lineHeight: 0.95, maxWidth: 900 }}>
            {version.spellLabel ?? "Genesis Head"}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "ui-monospace, monospace",
            fontSize: 20,
            color: palette.textMuted,
          }}
        >
          <span>
            {world} · {version.tokens.model}
          </span>
          <span style={{ color: palette.accent }}>
            One Visit. One Mutation.
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
