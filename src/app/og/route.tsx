import { ImageResponse } from "next/og";
import { getHeadVersion, getVersion } from "@/lib/data/repo";
import { PALETTES } from "@/lib/tokens/palettes";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("v");
    const version = (id ? await getVersion(id) : null) ?? (await getHeadVersion());
    const palette = PALETTES[version.tokens.palette];

    const world =
      version.tokens.world === "obsidian"
        ? "Obsidian Luxury"
        : version.tokens.world === "minimal"
          ? "Japanese Minimal"
          : "Neo Brutalism";

    const inner = (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: "22px",
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: palette.accent,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {`Living UI · Gen ${version.generation}`}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "72px",
            lineHeight: "0.95",
            maxWidth: "900px",
          }}
        >
          {version.spellLabel ?? "Genesis Head"}
        </div>
      </div>
    );

    const footer = (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontFamily: "ui-monospace, monospace",
          fontSize: "20px",
          color: palette.textMuted,
        }}
      >
        <span style={{ display: "flex" }}>
          {world} · {version.tokens.model}
        </span>
        <span style={{ display: "flex", color: palette.accent }}>
          One Visit. One Mutation.
        </span>
      </div>
    );

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: palette.canvas,
            color: palette.text,
            padding: "64px",
            width: "100%",
            height: "100%",
            fontFamily: "Georgia, serif",
          }}
        >
          {inner}
          {footer}
        </div>
      ),
      { width: 1200, height: 630 },
    );
  } catch (err) {
    console.error("OG image generation failed:", err);
    return new Response("Failed to generate image", { status: 500 });
  }
}
