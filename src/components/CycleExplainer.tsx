"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { Spot } from "@/components/Illustration";

interface Phase {
  id: string;
  name: string;
  days: string;
  /** What it feels like, not what the textbook calls it. */
  felt: string;
  timeOfDay: string;
  body: string;
  /** Sun centre in the 400×220 scene, and the three sky wash bands. */
  sun: { x: number; y: number; opacity: number };
  sky: [string, string, string];
  ground: string;
  token: string;
  /** A small drawn motif for the phase — the pencil hand, beside the copy. */
  spot: string;
}

const PHASES: Phase[] = [
  {
    id: "menstrual",
    name: "Menstrual",
    days: "Days 1–5",
    felt: "Permission to rest",
    timeOfDay: "First light",
    body:
      "Bleeding starts, and for a lot of people with PMDD the fog lifts within a day or two — sometimes almost the hour it begins. That relief is real, and it is also the clearest evidence you have. Symptoms that stop when bleeding starts are the pattern a doctor is listening for.",
    sun: { x: 48, y: 138, opacity: 0.55 },
    sky: ["#CDD6E0", "#DCE2E8", "#EDE7DC"],
    ground: "var(--leaf-deep)",
    token: "--phase-menstrual",
    spot: "spotMoonStars",
  },
  {
    id: "follicular",
    name: "Follicular",
    days: "Days 6–13",
    felt: "The lift",
    timeOfDay: "Morning",
    body:
      "Oestrogen climbs and, for most people, so does everything else. You feel like yourself. This is the stretch where the last two weeks stop seeming real, and where you quietly decide you were probably overreacting. You weren't. This is also the best week to book the appointment and to write yourself a note for later.",
    sun: { x: 122, y: 86, opacity: 0.85 },
    sky: ["#A7C08E", "#C6D6B4", "#F1EAD9"],
    ground: "var(--leaf-deep)",
    token: "--phase-follicular",
    spot: "spotSeedling",
  },
  {
    id: "ovulation",
    name: "Ovulation",
    days: "Around day 14",
    felt: "Peak radiance",
    timeOfDay: "Noon",
    body:
      "An egg is released, and this is usually the brightest, fullest few days of the month. It's brief. It matters mostly because of what comes next: ovulation is the starting gun for the luteal phase, which means it's the moment your hard days become predictable.",
    sun: { x: 200, y: 48, opacity: 1 },
    sky: ["#F4A93D", "#F6C97F", "#F7EEDA"],
    ground: "var(--ochre)",
    token: "--phase-ovulation",
    spot: "spotSun",
  },
  {
    id: "early-luteal",
    name: "Early luteal",
    days: "Days 15–21",
    felt: "The light starts to slant",
    timeOfDay: "Golden hour",
    body:
      "Progesterone rises. Nothing has gone wrong yet, and for a few days you may not notice anything at all. This is the useful window — the days when you can still cook something, answer the difficult email, and tell the people around you what next week tends to look like.",
    sun: { x: 278, y: 86, opacity: 0.9 },
    sky: ["#D68A3C", "#E3AE79", "#F4E6D2"],
    ground: "var(--ochre)",
    token: "--phase-early-luteal",
    spot: "spotSprig",
  },
  {
    id: "late-luteal",
    name: "Late luteal",
    days: "Days 22–28",
    felt: "The holding",
    timeOfDay: "Dusk",
    body:
      "This is the window. Hormones fall, and if you have PMDD your brain responds to that fall in a way most brains don't. The rage, the fog, the sense of being someone else — it lands here, and it lifts when you bleed. Knowing it is coming does not stop it. It does change what it costs you: you can clear the week, warn the people who need warning, and stop believing it's a verdict on who you are.",
    sun: { x: 352, y: 138, opacity: 0.66 },
    sky: ["#7E6A87", "#A08FA6", "#E4D5CE"],
    ground: "var(--dusk-deep)",
    token: "--phase-late-luteal",
    spot: "spotRainCloud",
  },
];

/* ---------- colour and number interpolation ---------- */

const hex = (c: string): [number, number, number] => [
  parseInt(c.slice(1, 3), 16),
  parseInt(c.slice(3, 5), 16),
  parseInt(c.slice(5, 7), 16),
];

function mixHex(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  const to = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${to(r1, r2)}, ${to(g1, g2)}, ${to(b1, b2)})`;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Where we are between two phases, from a 0–1 scroll progress. */
function at(progress: number) {
  const scaled = Math.min(0.9999, Math.max(0, progress)) * (PHASES.length - 1);
  const i = Math.floor(scaled);
  return { from: PHASES[i], to: PHASES[Math.min(PHASES.length - 1, i + 1)], t: scaled - i, index: i };
}

type Mode = "static" | "scroll";

/**
 * The cycle, told as a single day.
 *
 * With JavaScript and full motion, this is one sticky scene and the sun
 * crosses the sky as you scroll — GSAP ScrollTrigger scrubs it, so the light
 * moves with your thumb rather than performing at you.
 *
 * Without either, it is five drawn states stacked down the page, each with its
 * own copy. Nothing about the cycle is hidden behind a script, and the wordless
 * promise survives in both: dusk is always followed by sunrise.
 */
export function CycleExplainer() {
  const [mode, setMode] = useState<Mode>("static");
  const [active, setActive] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<SVGGElement>(null);
  const skyRefs = useRef<(SVGPathElement | null)[]>([]);
  const lastIndex = useRef(0);

  /** Writes the scene directly — no React state on the scroll path. */
  const paint = useCallback((progress: number) => {
    const { from, to, t } = at(progress);

    if (sunRef.current) {
      const x = lerp(from.sun.x, to.sun.x, t);
      const y = lerp(from.sun.y, to.sun.y, t);
      const o = lerp(from.sun.opacity, to.sun.opacity, t);
      sunRef.current.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      sunRef.current.setAttribute("opacity", o.toFixed(3));
    }

    for (let band = 0; band < 3; band++) {
      const el = skyRefs.current[band];
      if (el) el.setAttribute("fill", mixHex(from.sky[band], to.sky[band], t));
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    setMode("scroll");
  }, []);

  useEffect(() => {
    if (mode !== "scroll") return;
    const track = trackRef.current;
    if (!track) return;

    let kill: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const trigger = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          paint(self.progress);
          const i = Math.round(self.progress * (PHASES.length - 1));
          if (i !== lastIndex.current) {
            lastIndex.current = i;
            setActive(i);
          }
        },
      });

      paint(0);
      kill = () => trigger.kill();
    })();

    return () => {
      cancelled = true;
      kill?.();
    };
  }, [mode, paint]);

  const phase = PHASES[active];

  /* ---------- the drawn scene ---------- */
  const scene = (staticPhase?: Phase) => {
    const p = staticPhase ?? phase;
    return (
      <svg viewBox="0 0 400 220" className="block h-auto w-full" aria-hidden="true" focusable="false">
        {/* Sky, as three drawn wash bands with soft uneven edges. */}
        <path
          ref={staticPhase ? undefined : (el) => { skyRefs.current[0] = el; }}
          d="M0 0 H400 V64 C336 72, 288 58, 224 66 C160 74, 96 60, 0 68 Z"
          fill={p.sky[0]}
          fillOpacity="0.55"
        />
        <path
          ref={staticPhase ? undefined : (el) => { skyRefs.current[1] = el; }}
          d="M0 66 C 96 58, 160 72, 224 64 C 288 56, 336 70, 400 62 V112 C330 120, 268 106, 196 114 C 124 122, 66 110, 0 116 Z"
          fill={p.sky[1]}
          fillOpacity="0.5"
        />
        <path
          ref={staticPhase ? undefined : (el) => { skyRefs.current[2] = el; }}
          d="M0 114 C 66 108, 124 120, 196 112 C 268 104, 330 118, 400 110 V152 H0 Z"
          fill={p.sky[2]}
          fillOpacity="0.5"
        />

        {/* Two drawn clouds, drifting a few pixels and no further. */}
        <g className="ori-boil" opacity={0.6} style={{ transformOrigin: "90px 44px" }}>
          <path
            d="M62 52 C54 52, 51 46, 55 42 C54 36, 61 32, 66 35 C69 30, 79 29, 83 34 C90 31, 99 35, 99 41 C107 41, 110 49, 104 52 Z"
            fill="var(--paper-raised)" fillOpacity="0.66" stroke="var(--paper-raised)" strokeWidth="1.6" strokeLinejoin="round"
          />
        </g>
        <g className="ori-boil" opacity={0.45} style={{ transformOrigin: "300px 74px" }}>
          <path
            d="M278 82 C272 82, 270 77, 273 74 C272 69, 278 66, 282 68 C284 64, 292 64, 295 68 C300 65, 307 68, 307 73 C313 73, 315 79, 311 82 Z"
            fill="var(--paper-raised)" fillOpacity="0.6" stroke="var(--paper-raised)" strokeWidth="1.4" strokeLinejoin="round"
          />
        </g>

        {/* The sun, travelling the arc of the month. */}
        <g
          ref={staticPhase ? undefined : sunRef}
          transform={`translate(${p.sun.x} ${p.sun.y})`}
          opacity={p.sun.opacity}
        >
          <circle cx="0" cy="0" r="14" fill="var(--sun)" fillOpacity="0.3" />
          <path
            d="M14 0 C14 7.7, 7.7 14, 0 14 C-7.7 14, -14 7.7, -14 0 C-14 -7.7, -7.7 -14, 0 -14 C7 -14, 13.4 -8.4, 13.9 -1.6"
            fill="none" stroke="var(--sun)" strokeWidth="2" strokeLinecap="round"
          />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2 + 0.24;
            const r2 = 18.5 + (i % 3 === 0 ? 7 : 5);
            return (
              <path
                key={i}
                d={`M${(Math.cos(a) * 18.5).toFixed(1)} ${(Math.sin(a) * 18.5).toFixed(1)} L${(Math.cos(a) * r2).toFixed(1)} ${(Math.sin(a) * r2).toFixed(1)}`}
                stroke="var(--sun)" strokeWidth="2" strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* The horizon, drawn — a visible line, never an airbrushed fade. */}
        <g style={{ transition: "fill 700ms ease, stroke 700ms ease" }}>
          <path
            d="M0 152 C 52 140, 96 138, 140 150 C 186 163, 224 142, 270 146 C 316 150, 358 164, 400 156 L400 220 L0 220 Z"
            fill={p.ground} fillOpacity="0.22" style={{ transition: "fill 700ms ease" }}
          />
          <path
            d="M0 152 C 52 140, 96 138, 140 150 C 186 163, 224 142, 270 146 C 316 150, 358 164, 400 156"
            fill="none" stroke={p.ground} strokeWidth="2" strokeLinecap="round" style={{ transition: "stroke 700ms ease" }}
          />
          <path
            d="M0 178 C 58 166, 104 182, 158 176 C 214 170, 258 186, 312 180 C 350 176, 376 182, 400 178 L400 220 L0 220 Z"
            fill={p.ground} fillOpacity="0.34" style={{ transition: "fill 700ms ease" }}
          />
          <path
            d="M0 178 C 58 166, 104 182, 158 176 C 214 170, 258 186, 312 180 C 350 176, 376 182, 400 178"
            fill="none" stroke={p.ground} strokeWidth="2" strokeLinecap="round" style={{ transition: "stroke 700ms ease" }}
          />
          {[36, 62, 300, 334, 358].map((x, i) => (
            <path
              key={x}
              d={`M${x} ${191 + (i % 2)} C ${x - 2} ${183}, ${x + 2} ${178}, ${x + (i % 2 ? 2 : -2)} ${172 - (i % 3) * 3}`}
              fill="none" stroke={p.ground} strokeWidth="1.6" strokeLinecap="round" opacity="0.75"
              style={{ transition: "stroke 700ms ease" }}
            />
          ))}
        </g>
      </svg>
    );
  };

  /* ---------- static: five states, stacked ---------- */
  if (mode === "static") {
    return (
      <div className="ori-grid gap-y-16">
        {PHASES.map((p, i) => (
          <article key={p.id} className="col-wide grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-center">
            <div>
              <Spot name={p.spot} className="mb-3 h-16 w-16" />
              <p className="ori-kicker">
                {String(i + 1).padStart(2, "0")} &middot; {p.days} &middot; {p.timeOfDay}
              </p>
              <h3 className="ori-headline mt-3 italic" style={{ fontFamily: "var(--font-display-italic)" }}>
                {p.felt}
              </h3>
              <p className="ori-copy ori-justify mt-4 max-w-[38rem]">{p.body}</p>
            </div>
            <div className="ori-paper-card overflow-hidden">{scene(p)}</div>
          </article>
        ))}
      </div>
    );
  }

  /* ---------- scroll: one sticky scene ---------- */
  return (
    <div ref={trackRef} style={{ height: `${PHASES.length * 62}vh` }} className="relative">
      <div className="sticky top-[calc(4rem+2vh)] ori-grid gap-y-8 pb-8">
        {/* The rail carries the month as a list — and doubles as the legend. */}
        <nav className="col-rail hidden self-start lg:block" aria-label="Phases of the cycle">
          <ol className="space-y-3">
            {PHASES.map((p, i) => (
              <li key={p.id} className="flex items-baseline gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-1 h-2 w-2 shrink-0 rounded-full transition-opacity duration-500"
                  style={{ background: `var(${p.token})`, opacity: i === active ? 1 : 0.3 }}
                />
                <span
                  className="text-[0.82rem] leading-snug transition-colors duration-500"
                  style={{ color: i === active ? "var(--ink)" : "var(--ink-soft)", fontWeight: i === active ? 600 : 400 }}
                >
                  {p.name}
                  {i === active ? <span className="sr-only"> — showing now</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        <div className="col-main">
          <div className="ori-paper-card relative overflow-hidden">
            {scene()}
            <p className="pointer-events-none absolute left-5 top-5 rounded-full bg-[color-mix(in_srgb,var(--paper-raised)_88%,transparent)] px-4 py-1.5 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-ink">
              {phase.timeOfDay}
            </p>
          </div>

          {/* The copy crossfades under the scene. */}
          <div className="mt-7 grid grid-cols-1 grid-rows-1">
            {PHASES.map((p, i) => (
              <div
                key={p.id}
                aria-hidden={i !== active}
                className="col-start-1 row-start-1 transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
              >
                <Spot name={p.spot} className="mb-3 h-16 w-16" />
                <p className="ori-kicker">
                  {String(i + 1).padStart(2, "0")} &middot; {p.days}
                </p>
                <h3
                  className="ori-headline mt-2.5 italic"
                  style={{ fontFamily: "var(--font-display-italic)" }}
                >
                  {p.felt}
                </h3>
                <p className="ori-copy ori-justify mt-4 max-w-[40rem]">{p.body}</p>
              </div>
            ))}
          </div>

          {/* Announced once per phase for anyone not watching the drawing. */}
          <p className="sr-only" role="status">
            {phase.name}. {phase.felt}. {phase.body}
          </p>
        </div>
      </div>
    </div>
  );
}
