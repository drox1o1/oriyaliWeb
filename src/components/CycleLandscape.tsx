"use client";

import { forwardRef, useId } from "react";
import { CrayonDefs, CrayonFlower } from "@/components/CrayonDrawing";

/* The far tree line. Small enough to read as distance, irregular enough to
   read as trees rather than a saw. */
const TREES = [
  [88, 332, 1.5],
  [122, 336, 1.05],
  [151, 333, 1.75],
  [190, 337, 1.2],
  [221, 334, 1.55],
  [258, 338, 0.95],
  [758, 330, 1.35],
  [791, 334, 1.8],
  [829, 331, 1.1],
  [858, 335, 1.6],
  [896, 332, 1.25],
  [931, 336, 0.9],
] as const;

/* The meadow. Nine stems of different heights and characters behind the three
   drawn flowers, so the ground reads as planted rather than as three lonely
   stalks in a field of nothing. */
const STEMS = [
  { x: 138, h: 82, lean: -9, kind: "bud", hue: "#d07594", s: 1.15 },
  { x: 196, h: 58, lean: 7, kind: "seed", hue: "#7f9c6a", s: 1 },
  { x: 246, h: 108, lean: -5, kind: "spike", hue: "#e0a83f", s: 1.2 },
  { x: 292, h: 66, lean: 8, kind: "bud", hue: "#2d83a0", s: 0.9 },
  { x: 404, h: 74, lean: 10, kind: "seed", hue: "#e0a83f", s: 1.1 },
  { x: 434, h: 52, lean: -6, kind: "spike", hue: "#7f9c6a", s: 0.85 },
  { x: 570, h: 96, lean: -8, kind: "bud", hue: "#2d83a0", s: 1.2 },
  { x: 614, h: 62, lean: 5, kind: "spike", hue: "#7f9c6a", s: 0.95 },
  { x: 726, h: 86, lean: -7, kind: "bud", hue: "#d07594", s: 1.1 },
  { x: 776, h: 60, lean: 9, kind: "seed", hue: "#e0a83f", s: 0.95 },
  { x: 828, h: 102, lean: -4, kind: "spike", hue: "#7f9c6a", s: 1.15 },
  { x: 880, h: 68, lean: 6, kind: "bud", hue: "#2d83a0", s: 0.9 },
] as const;

/* Grass, at the very front, where a drawing needs something close to the eye
   to have any depth at all. */
const TUFTS = [
  [42, 456, 1.35],
  [78, 466, 0.9],
  [186, 449, 1.15],
  [214, 461, 1.5],
  [332, 468, 1.05],
  [468, 452, 1.4],
  [498, 464, 0.85],
  [604, 458, 1.2],
  [706, 468, 1.45],
  [742, 452, 0.95],
  [864, 462, 1.3],
  [902, 451, 1],
  [962, 464, 1.2],
] as const;

/**
 * One small garden, living through one day.
 *
 * Everything that moves is a CSS custom property set by the scroll, so the
 * whole month is a single SVG that never re-renders: the sun climbs and sets,
 * the flowers open and lean, mist gathers in the low hours, stars come up at
 * dusk, and the paper itself warms and then cools.
 *
 * The scene is built in planes — sky, far ridge and tree line, near ridge,
 * meadow, foreground grass — because the thing that made the earlier drawing
 * feel unfinished was not the line quality, it was having nothing between the
 * horizon and the viewer.
 */
export const CycleLandscape = forwardRef<HTMLDivElement>(
  function CycleLandscape(_, ref) {
    const id = useId().replace(/:/g, "");
    return (
      <div ref={ref} className="pencil-landscape" aria-hidden="true">
        <svg viewBox="0 0 1000 480" preserveAspectRatio="xMidYMid meet">
          <CrayonDefs id={id} />

          <g
            filter={`url(#${id}-crayon)`}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* ── Sky ──────────────────────────────────────────── */}

            <g className="cycle-stars" fill="none" stroke="#9d8fb4" strokeWidth="2.5">
              {/* A crescent, drawn the way a crescent is actually drawn: one
                  full curve, and a second one cutting back across it. */}
              <path
                d="M812 74C766 82 758 140 810 151C789 130 787 99 812 74Z"
                fill="#dab762"
                stroke="#cfaa59"
              />
              <path d="M690 96v14m-7-7 14 1M886 158v13m-7-7 14 1M604 60v13m-6-6 13 1M742 178v11m-6-6 12 1M932 92v12m-6-6 12 1" />
              <path
                d="M636 128a2.6 2.6 0 1 0 .1 0M866 68a2.4 2.4 0 1 0 .1 0M556 148a2.2 2.2 0 1 0 .1 0"
                stroke="#c8b7dd"
                strokeWidth="3"
              />
            </g>

            <g className="cycle-sun" fill="none" stroke="#dfa932">
              <path
                d="M-28 0C-30-38 28-37 30-3C36 35-29 39-28 0Z"
                fill="#ecc250"
                strokeWidth="3"
              />
              {Array.from({ length: 9 }, (_, i) => (
                <path
                  key={i}
                  d="M0-44 1-56"
                  transform={`rotate(${i * 40 + 7})`}
                  strokeWidth="4"
                />
              ))}
            </g>

            <g
              className="cycle-clouds"
              fill="none"
              stroke="#a0b8bb"
              strokeWidth="3"
              opacity=".62"
            >
              <path d="M195 150q-20-20 5-25q3-26 30-12q23-17 36 4q24-2 20 20q-35 4-78 1" />
              <path d="M641 102q-13-12 4-17q9-21 26-7q25-8 26 14l-49 3" />
              <path d="M400 68q-16-15 4-20q5-21 25-9q19-13 29 4q19-2 16 16q-28 3-62 1" strokeWidth="2.5" opacity=".7" />
            </g>

            {/* Birds, at the top of the day only. Three strokes each — any
                more and they stop being distance and start being seagulls. */}
            <g className="cycle-birds" fill="none" stroke="#7d8f92" strokeWidth="2.5">
              <path d="M470 128q7-7 13 0M496 118q6-6 11 0M516 133q6-6 11 0" />
              <path d="M318 176q6-6 11 0M340 168q5-5 9 0" opacity=".7" />
            </g>

            {/* ── The far ridge, and the trees on it ───────────── */}

            <g className="cycle-far">
              <path
                d="M0 344Q118 306 236 330T470 336Q604 300 738 328T1000 322V480H0Z"
                fill="var(--land-far)"
                fillOpacity=".62"
                stroke="var(--land-far-line)"
                strokeWidth="2"
              />
              <g fill="none" stroke="var(--land-tree)" strokeWidth="2.6">
                {TREES.map(([x, y, s], i) => (
                  <path
                    key={i}
                    d={`M0 0 0 ${-8 * s}M0 ${-8 * s}l${-6 * s} ${4 * s}M0 ${-8 * s}l${6 * s} ${4 * s}M0 ${-14 * s}l${-5 * s} ${4 * s}M0 ${-14 * s}l${5 * s} ${4 * s}M0 ${-19 * s}l${-3.5 * s} ${3 * s}M0 ${-19 * s}l${3.5 * s} ${3 * s}`}
                    transform={`translate(${x} ${y})`}
                  />
                ))}
              </g>
            </g>

            {/* ── The near ridge ───────────────────────────────── */}

            <path
              className="cycle-near"
              d="M0 392Q160 366 320 386T628 388Q796 364 1000 384V480H0Z"
              fill="var(--land-near)"
              fillOpacity=".55"
              stroke="var(--land-near-line)"
              strokeWidth="2.5"
            />

            {/* ── The ground the flowers stand on ──────────────── */}

            <g className="cycle-ground" fill="none" stroke="var(--land-ground)">
              <path
                d="M63 408Q246 392 409 407T727 404Q845 396 948 408"
                strokeWidth="2.5"
              />
              <path
                d="M115 418Q232 405 355 419M533 421Q703 406 861 420"
                strokeWidth="1.5"
                opacity=".5"
              />
              <path
                d="m174 399-3-18m5 15 8-12m-51 20-5-9m711 5 4-18m4 18 10-11m-109 22 3-11"
                strokeWidth="3"
              />
            </g>

            {/* ── The meadow ───────────────────────────────────── */}

            <g className="cycle-meadow" fill="none" strokeLinecap="round">
              {STEMS.map(({ x, h, lean, kind, hue, s: sc }, i) => (
                /* The placing is on the outer group and the leaning on the
                   inner one: a CSS `transform` replaces the attribute rather
                   than composing with it, so the two cannot share an element. */
                <g key={i} transform={`translate(${x} 406) scale(${sc})`}>
                <g className="cycle-stem" style={{ transformOrigin: "0px 0px" }}>
                  <path
                    d={`M0 0Q${lean * 0.6} ${-h * 0.55} ${lean} ${-h}`}
                    stroke="var(--land-stem)"
                    strokeWidth="2.6"
                  />
                  <path
                    d={`M0 ${-h * 0.42}q${lean < 0 ? -13 : 13} -7 ${lean < 0 ? -16 : 16} -19`}
                    stroke="var(--land-stem)"
                    strokeWidth="2.4"
                  />
                  {kind === "bud" ? (
                    /* A closed bud: a teardrop with one seam down it. */
                    <g>
                      <path
                        d={`M${lean} ${-h - 17}c9 5 10 15 5 21c-4 5-11 5-15 0c-5-6-4-16 10-21Z`}
                        fill={hue}
                        stroke={hue}
                        strokeWidth="2"
                      />
                      <path
                        d={`M${lean + 1} ${-h - 13}q3 8 1 15`}
                        stroke="#f2e6cd"
                        strokeWidth="1.6"
                        opacity=".5"
                      />
                    </g>
                  ) : kind === "seed" ? (
                    <path
                      d={`M${lean} ${-h}m-7 0a7 7.5 0 1 0 14 0a7 7.5 0 1 0-14 0`}
                      fill={hue}
                      stroke={hue}
                      strokeWidth="1.8"
                    />
                  ) : (
                    /* A seed head: little grains stacked up one side. */
                    <path
                      d={`M${lean} ${-h - 24}v26m-5-21 5-6 5 6m-5 7 5-5m-10 5 5-5m-5 8 5-4m-10 4 5-4`}
                      stroke={hue}
                      strokeWidth="2.8"
                    />
                  )}
                </g>
                </g>
              ))}
            </g>

            {/* The three drawn flowers: the ones the whole scene is about. */}
            <g className="crayon-register">
              {[
                { x: 335, y: 402, s: 0.85, kind: "blue" as const, lean: -9 },
                { x: 492, y: 407, s: 1.12, kind: "sun" as const, lean: 3 },
                { x: 662, y: 404, s: 0.86, kind: "pink" as const, lean: 12 },
              ].map(({ x, y, s, kind, lean }) => (
                <g key={kind} transform={`translate(${x} ${y}) scale(${s})`}>
                  <g className="cycle-stem" style={{ transformOrigin: "0px 0px" }}>
                    <path
                      d="M0 0Q-12-91 3-151"
                      fill="none"
                      stroke="#348263"
                      strokeWidth="5"
                    />
                    <path
                      d="M-4-36Q-61-54-54-92Q-14-78-4-36Z"
                      fill={kind === "pink" ? "none" : "#378a67"}
                      stroke="#348263"
                      strokeWidth="4"
                    />
                    <path
                      d="M-6-66Q37-73 44-112Q2-106-6-66Z"
                      fill="none"
                      stroke="#348263"
                      strokeWidth="3.5"
                    />
                    <path d="M-13-48-46-80" stroke="#eabb34" strokeWidth="2.5" />
                    <g transform={`translate(3 -153) rotate(${lean})`}>
                      <CrayonFlower kind={kind} energy={0.8} mood={0.4} />
                    </g>
                  </g>
                </g>
              ))}
            </g>

            {/* ── Foreground grass ─────────────────────────────── */}

            <g className="cycle-tufts" fill="none" stroke="var(--land-grass)" strokeWidth="2.1">
              {TUFTS.map(([x, y, s], i) => (
                <path
                  key={i}
                  d={
                    `M0 0C${-3 * s} ${-14 * s} ${-9 * s} ${-22 * s} ${-17 * s} ${-27 * s}` +
                    `M0 0C${-1 * s} ${-16 * s} ${-2 * s} ${-27 * s} ${-6 * s} ${-38 * s}` +
                    `M0 0C${2 * s} ${-18 * s} ${4 * s} ${-30 * s} ${3 * s} ${-42 * s}` +
                    `M0 0C${5 * s} ${-15 * s} ${11 * s} ${-24 * s} ${19 * s} ${-30 * s}` +
                    `M0 0C${4 * s} ${-10 * s} ${8 * s} ${-16 * s} ${11 * s} ${-21 * s}`
                  }
                  transform={`translate(${x} ${y})`}
                />
              ))}
            </g>

            {/* ── Mist, in the low hours ───────────────────────── */}

            <g className="cycle-mist" fill="none" stroke="#96afbb" strokeWidth="2.5">
              <path d="M209 318Q311 308 411 320M601 331Q703 321 787 330M254 340Q360 330 452 341M472 356Q560 348 642 357" />
            </g>
          </g>
        </svg>
        <span className="cycle-drawing-note ori-hand">a day, in its own time</span>
      </div>
    );
  },
);
