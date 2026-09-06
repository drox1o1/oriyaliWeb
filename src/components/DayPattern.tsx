"use client";

import { useId } from "react";
import type { AuraInput } from "@/lib/aura";
import { pencilNumber as n } from "@/components/CrayonDrawing";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const colour = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(mix(v, b[i], t))).join(" ")})`;

/* Stable identities, so every mark travels and changes shape rather than
   popping in and out as the numbers move. */
const MARKS = Array.from({ length: 49 }, (_, i) => ({
  row: Math.floor(i / 7) - 3,
  col: (i % 7) - 3,
  variation: Math.sin(i * 12.9898),
}));

/* A few marks that have escaped the disc — the ones that make it a drawing
   somebody made rather than a shape a machine filled. */
const STRAYS = [
  { a: -0.42, d: 1.17, s: 0.62 },
  { a: 0.68, d: 1.22, s: 0.5 },
  { a: 2.31, d: 1.14, s: 0.72 },
  { a: 3.62, d: 1.25, s: 0.46 },
  { a: 4.88, d: 1.13, s: 0.66 },
];

/* ------------------------------------------------------------------
   The five hands.

   Energy does not make the marks bigger — it changes what they are.
   The drawing walks a real progression as the day fills up:

     rain → seed → sprout → leaf → bloom

   Each is a closed path drawn around its own origin, sized in the same
   units, so two of them can be laid over one another and cross-faded
   without either one jumping.
   ------------------------------------------------------------------ */

type Motif = (w: number, h: number, bend: number, round: number) => string;

/** Falling water: a point at the top, a full round belly. */
const rain: Motif = (w, h, bend) =>
  `M0 ${n(-h)}C${n(w * 0.42)} ${n(-h * 0.34)} ${n(w)} ${n(-h * 0.06 + bend)} ${n(w)} ${n(h * 0.34)}` +
  `C${n(w)} ${n(h * 0.82)} ${n(w * 0.56)} ${n(h)} 0 ${n(h)}` +
  `C${n(-w * 0.56)} ${n(h)} ${n(-w)} ${n(h * 0.82)} ${n(-w)} ${n(h * 0.34)}` +
  `C${n(-w)} ${n(-h * 0.06)} ${n(-w * 0.42)} ${n(-h * 0.34)} 0 ${n(-h)}Z`;

/** A seed: nearly a circle, deliberately not one. */
const seed: Motif = (w, h, bend) =>
  `M0 ${n(-h * 0.82)}C${n(w * 0.62)} ${n(-h * 0.82)} ${n(w)} ${n(-h * 0.4 + bend)} ${n(w)} 0` +
  `C${n(w)} ${n(h * 0.46)} ${n(w * 0.58)} ${n(h * 0.84)} 0 ${n(h * 0.84)}` +
  `C${n(-w * 0.6)} ${n(h * 0.84)} ${n(-w)} ${n(h * 0.44)} ${n(-w)} ${n(-0.02 * h)}` +
  `C${n(-w)} ${n(-h * 0.42)} ${n(-w * 0.6)} ${n(-h * 0.82)} 0 ${n(-h * 0.82)}Z`;

/** A sprout: an open crescent, the way a first shoot leans out of the soil. */
const sprout: Motif = (w, h, bend) =>
  `M${n(-w * 0.22)} ${n(h)}C${n(-w * 1.05)} ${n(h * 0.3)} ${n(-w * 0.62)} ${n(-h * 0.72 + bend)} ${n(w * 0.5)} ${n(-h)}` +
  `C${n(-w * 0.06)} ${n(-h * 0.42)} ${n(-w * 0.05)} ${n(h * 0.24)} ${n(w * 0.42)} ${n(h * 0.86)}` +
  `C${n(w * 0.06)} ${n(h * 1.02)} ${n(-w * 0.02)} ${n(h * 1.02)} ${n(-w * 0.22)} ${n(h)}Z`;

/** A leaf: pointed at both ends, with the tip carried slightly off-axis. */
const leaf: Motif = (w, h, bend) =>
  `M0 ${n(-h)}C${n(w * 0.72)} ${n(-h * 0.44)} ${n(w)} ${n(bend)} ${n(w * 0.16)} ${n(h)}` +
  `C${n(-w * 0.7)} ${n(h * 0.4)} ${n(-w)} ${n(-h * 0.12)} 0 ${n(-h)}Z`;

/** A bloom: four petals off one centre — the drawing at full light. */
const bloom: Motif = (w, h, bend) => {
  /* One petal, described once around the vertical, then rotated into place.
     Rotating the points rather than the element keeps the whole flower a
     single path, so it fills and cross-fades as one shape. */
  const petal = (rot: number) => {
    const c = Math.cos(rot);
    const sn = Math.sin(rot);
    const at = (x: number, y: number) =>
      `${n(x * c - y * sn)} ${n(x * sn + y * c)}`;
    return (
      `M${at(0, 0)}` +
      `C${at(w * 1.35, -h * 0.16 + bend * 0.2)} ${at(w * 1.1, -h * 0.9)} ${at(0, -h)}` +
      `C${at(-w * 1.1, -h * 0.9)} ${at(-w * 1.35, -h * 0.16)} ${at(0, 0)}Z`
    );
  };
  return [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map(petal).join(" ");
};

const HANDS: Motif[] = [rain, seed, sprout, leaf, bloom];

/**
 * A living block print.
 *
 * Three numbers, three separate jobs, so the drawing answers each slider
 * distinctly instead of everything getting vaguely bigger at once:
 *
 *   energy        what the marks ARE.  rain → seed → sprout → leaf → bloom.
 *                 Two neighbouring hands are drawn at once and cross-faded, so
 *                 dragging the slider morphs the drawing rather than cutting
 *                 between five stills.
 *   mood          the colour, and how much of the ground is filled in.
 *   irritability  the rhythm — how far the marks turn, drift and crowd, and
 *                 how much the silhouette breaks up at the edge.
 *
 * There is no ideal pattern to reach and no score hidden in it. A hard day
 * gets a drawing worth keeping, which is the entire point of the thing.
 */
export function DayPattern({ input }: { input: AuraInput }) {
  const id = useId().replace(/:/g, "");
  const m = clamp(input.mood);
  const e = clamp(input.energy);
  const t = clamp(input.turbulence);

  /* Which two hands are drawing, and how far between them we are. */
  const step = e * (HANDS.length - 1);
  const lower = Math.min(HANDS.length - 2, Math.floor(step));
  const blend = Math.min(1, Math.max(0, step - lower));

  const radius = 152 + e * 46;
  const rx = radius * (0.86 + m * 0.2);
  const ry = radius * (1.09 - m * 0.12);

  /* Cool slate at the bottom of the range, deep leaf at the top. */
  const ground = colour([186, 203, 209], [53, 86, 44], m);
  const ink =
    m < 0.55
      ? colour([36, 68, 116], [26, 122, 144], m / 0.55)
      : colour([26, 122, 144], [222, 208, 77], (m - 0.55) / 0.45);
  const accent =
    m < 0.55
      ? colour([55, 107, 145], [53, 147, 153], m / 0.55)
      : colour([53, 147, 153], [179, 195, 79], (m - 0.55) / 0.45);
  const edge = colour([72, 115, 135], [103, 122, 65], m);

  /* A continuous, slightly uneven silhouette; never a mathematically perfect
     disc. Irritability is what makes the edge lose its composure. */
  const ring = (scale: number, phase: number) =>
    Array.from({ length: 96 }, (_, i) => {
      const a = (i / 96) * Math.PI * 2;
      const ripple =
        1 +
        0.025 * Math.sin(a * 3 + m * 2 + phase) +
        t * 0.055 * Math.sin(a * 6 + e * 2 + phase) +
        0.014 * Math.cos(a * 5 + phase);
      return `${i ? "L" : "M"}${n(Math.cos(a) * rx * scale * ripple)} ${n(
        Math.sin(a) * ry * scale * ripple,
      )}`;
    }).join(" ") + "Z";

  const contour = ring(1, 0);
  /* The second line the hand makes when it goes round a shape twice. */
  const halo = ring(1.075, 0.9);

  /* One mark, drawn in whichever two hands are currently in play. */
  const drawMark = (i: number, row: number, col: number, variation: number) => {
    const spacing = 34 + e * 19;
    const wave = Math.sin(row * 0.9 + col * 0.58 + m * 2);
    const x = col * spacing + (row % 2) * spacing * 0.24 + wave * t * 14;
    const y = row * spacing * 0.93 + Math.sin(col * 1.1 + row * 0.7) * t * 11;
    const angle = (m - 0.5) * 26 + t * (wave * 78 + col * 8);
    const size = 1.02 + e * 0.44 + variation * 0.1;

    /* Proportion still belongs to mood: a low day draws narrow and long, a
       bright one draws round and open. Irritability broadens everything. */
    const w = (6.4 + Math.sin(m * Math.PI) * 4.8 + t * 12) * size;
    const h = (15 - m * 1.8) * size * (1 - t * 0.34);
    const bend = t * wave * 7;
    const round = (1 - m) * 6 * size;

    return (
      <g
        key={i}
        data-pattern-mark
        transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)})`}
      >
        {/* The outgoing hand, and the one taking over from it. */}
        <path
          d={HANDS[lower](w, h, bend, round)}
          fill={i % 4 === 0 ? accent : ink}
          opacity={n(1 - blend)}
        />
        <path
          d={HANDS[lower + 1](w, h, bend, round)}
          fill={i % 4 === 0 ? accent : ink}
          opacity={n(blend)}
        />
        {/* The vein: one stroke of the ground colour back through the mark,
            the way a lino cut is cleared. Only on the settled days — on a
            broken-up one it would read as damage rather than detail. */}
        <path
          d={`M0 ${n(-h * 0.6)}Q${n(bend * 0.3)} 0 0 ${n(h * 0.68)}`}
          stroke={ground}
          strokeWidth={n(1.2 * size)}
          strokeLinecap="round"
          fill="none"
          opacity={n(m * (1 - t * 0.7) * (1 - Math.abs(e - 0.62) * 0.8))}
        />
      </g>
    );
  };

  return (
    <div className="pencil-bloom day-pattern" aria-hidden="true">
      <svg viewBox="0 0 600 500" fill="none" className="botanical-drawing">
        <defs>
          <filter
            id={`${id}-print`}
            x="-14%"
            y="-14%"
            width="128%"
            height="128%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".065"
              numOctaves="3"
              seed="9"
              result="edge"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="edge"
              scale="1.8"
              xChannelSelector="R"
              yChannelSelector="G"
              result="drawing"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".8"
              numOctaves="2"
              seed="12"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .35 0 0 0 .72"
            />
            <feComposite in="drawing" operator="in" />
          </filter>
          <clipPath id={`${id}-field`}>
            <path d={contour} />
          </clipPath>
        </defs>

        <g transform="translate(300 250)">
          <g className="crayon-register" filter={`url(#${id}-print)`}>
            {/* The second time round the shape. Faint, and always there. */}
            <path
              d={halo}
              fill="none"
              stroke={edge}
              strokeWidth="1"
              opacity={n(0.1 + t * 0.14)}
            />

            <path
              data-pattern-contour
              d={contour}
              fill={ground}
              fillOpacity={n(0.34 + Math.pow(m, 1.5) * 0.62)}
            />

            <g clipPath={`url(#${id}-field)`}>
              {MARKS.map(({ row, col, variation }, i) =>
                drawMark(i, row, col, variation),
              )}
            </g>

            {/* Marks that got away. Small, sparse, and always outside the
                clip — the drawing carrying on past its own border. */}
            <g opacity={n(0.5 + e * 0.4)}>
              {STRAYS.map(({ a, d, s }, i) => {
                const w = 4.5 * s;
                const h = 11 * s;
                return (
                  <g
                    key={`stray-${i}`}
                    transform={`translate(${n(Math.cos(a) * rx * d)} ${n(
                      Math.sin(a) * ry * d,
                    )}) rotate(${n((a * 180) / Math.PI + 90)})`}
                  >
                    <path
                      d={HANDS[lower](w, h, 0, 0)}
                      fill={accent}
                      opacity={n((1 - blend) * 0.75)}
                    />
                    <path
                      d={HANDS[lower + 1](w, h, 0, 0)}
                      fill={accent}
                      opacity={n(blend * 0.75)}
                    />
                  </g>
                );
              })}
            </g>

            <path
              d={contour}
              fill="none"
              stroke={edge}
              strokeWidth="1.3"
              opacity={n(0.12 + t * 0.3)}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
