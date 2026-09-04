import { ImageResponse } from "next/og";
import { buildAura } from "@/lib/aura";

export const alt =
  "Oriyali — For one or two weeks a month, you stop being yourself. Then you're fine again. Then it comes back.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The card carries the aura, drawn, on warm paper. Token values are inlined
   because the renderer has no CSS custom properties. */
const PAPER = "#F6ECDB";
const INK = "#423A32";
const INK_SOFT = "#6E6358";

const SWATCH: Record<string, string> = {
  "--sun": "#E8A93D",
  "--bloom": "#EC9079",
  "--leaf": "#8AA06B",
  "--sky": "#9FC0D3",
  "--rose": "#D99AA0",
  "--ochre": "#D68A3C",
  "--dusk": "#7E6A87",
  "--dusk-deep": "#574D6C",
};

export default function OpengraphImage() {
  const aura = buildAura({ mood: 0.72, energy: 0.58, turbulence: 0.22 }, 1201);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: PAPER,
          padding: "0 76px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 48 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: INK_SOFT,
              fontWeight: 600,
            }}
          >
            Oriyali
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 60,
              lineHeight: 1.14,
              color: INK,
              letterSpacing: -1.5,
            }}
          >
            For one or two weeks a month, you stop being yourself.
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 30, color: INK_SOFT, lineHeight: 1.4 }}>
            A private PMDD self-check that never leaves your device.
          </div>
        </div>

        <svg width="430" height="430" viewBox="0 0 200 200">
          {aura.petals.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill={SWATCH[p.color] ?? INK_SOFT}
              fillOpacity={p.fillOpacity}
              stroke={SWATCH[p.color] ?? INK_SOFT}
              strokeWidth={p.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          <path d={aura.core} fill="#FBF4E7" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <path d={aura.coreInner} fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
