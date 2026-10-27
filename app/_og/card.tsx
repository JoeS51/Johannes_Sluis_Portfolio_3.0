import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Link preview cards: the site's spec-sheet look, black type on white with a thick rule.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type Card = { eyebrow: string; title: string; subtitle?: string };

export async function ogCard({ eyebrow, title, subtitle }: Card) {
  const inter = await readFile(join(process.cwd(), "app/_og/Inter-Bold.ttf"));
  const titleSize = title.length <= 12 ? 150 : title.length <= 24 ? 104 : title.length <= 48 ? 78 : 62;

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "72px 80px", background: "#fff", color: "#0a0a0a", fontFamily: "Inter" }}>
        <div style={{ fontSize: 34, letterSpacing: -0.5 }}>{eyebrow}</div>
        <div style={{ marginTop: 22, fontSize: titleSize, lineHeight: 0.95, letterSpacing: -titleSize * 0.04 }}>{title}</div>
        <div style={{ marginTop: 40, height: 6, background: "#0a0a0a" }} />
        {subtitle && <div style={{ marginTop: 30, fontSize: 32, lineHeight: 1.3, color: "#3a3a3a" }}>{subtitle}</div>}
        <div style={{ marginTop: "auto", fontSize: 28 }}>joesluis.com</div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: "Inter", data: inter, style: "normal", weight: 700 }] },
  );
}
