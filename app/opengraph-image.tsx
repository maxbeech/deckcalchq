import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "80px", background: "#fafaf9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#d97706", color: "white",
            fontSize: 40, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>D</div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: "#1c1917" }}>
            <span>DeckCalc</span><span style={{ color: "#d97706" }}>HQ</span>
          </div>
        </div>
        <div style={{ marginTop: 36, fontSize: 60, fontWeight: 800, color: "#1c1917", lineHeight: 1.1, maxWidth: 980 }}>
          Free deck building code calculator
        </div>
        <div style={{ marginTop: 24, fontSize: 30, color: "#57534e", maxWidth: 940 }}>
          Joists, beams, footings, posts &amp; stairs sized to the IRC R507 deck code — with the real span tables.
        </div>
      </div>
    ),
    { ...size },
  );
}
