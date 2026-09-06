"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CycleLandscape } from "@/components/CycleLandscape";

interface Phase {
  id: string;
  name: string;
  days: string;
  /** What it feels like, not what the textbook calls it. */
  felt: string;
  timeOfDay: string;
  body: string;
  token: string;
}

const PHASES: Phase[] = [
  {
    id: "menstrual",
    name: "Menstrual",
    days: "Days 1–5",
    felt: "Permission to rest",
    timeOfDay: "First light",
    body: "Bleeding starts, and for a lot of people with PMDD the fog lifts within a day or two — sometimes almost the hour it begins. That relief is real, and it is also the clearest evidence you have. Symptoms that stop when bleeding starts are the pattern a doctor is listening for.",
    token: "--phase-menstrual",
  },
  {
    id: "follicular",
    name: "Follicular",
    days: "Days 6–13",
    felt: "The lift",
    timeOfDay: "Morning",
    body: "Oestrogen climbs and, for most people, so does everything else. You feel like yourself. This is the stretch where the last two weeks stop seeming real, and where you quietly decide you were probably overreacting. You weren't. This is also the best week to book the appointment and to write yourself a note for later.",
    token: "--phase-follicular",
  },
  {
    id: "ovulation",
    name: "Ovulation",
    days: "Around day 14",
    felt: "Peak radiance",
    timeOfDay: "Noon",
    body: "An egg is released, and this is usually the brightest, fullest few days of the month. It's brief. It matters mostly because of what comes next: ovulation is the starting gun for the luteal phase, which means it's the moment your hard days become predictable.",
    token: "--phase-ovulation",
  },
  {
    id: "early-luteal",
    name: "Early luteal",
    days: "Days 15–21",
    felt: "The light starts to slant",
    timeOfDay: "Golden hour",
    body: "Progesterone rises. Nothing has gone wrong yet, and for a few days you may not notice anything at all. This is the useful window — the days when you can still cook something, answer the difficult email, and tell the people around you what next week tends to look like.",
    token: "--phase-early-luteal",
  },
  {
    id: "late-luteal",
    name: "Late luteal",
    days: "Days 22–28",
    felt: "The holding",
    timeOfDay: "Dusk",
    body: "This is the window. Hormones fall, and if you have PMDD your brain responds to that fall in a way most brains don't. The rage, the fog, the sense of being someone else — it lands here, and it lifts when you bleed. Knowing it is coming does not stop it. It does change what it costs you: you can clear the week, warn the people who need warning, and stop believing it's a verdict on who you are.",
    token: "--phase-late-luteal",
  },
];

type Mode = "browse" | "scroll";

/* The paper the day is drawn on: daylight cream through to a cool dusk, and —
   on a device set to twilight — the same five hours in deep tones. A bright
   cream plate on a dark page is a lamp in the face, not a drawing. */
const PAPER_DAY = [
  [237, 237, 229],
  [246, 239, 219],
  [250, 240, 211],
  [247, 232, 217],
  [234, 227, 236],
];
const PAPER_NIGHT = [
  [37, 38, 46],
  [42, 40, 44],
  [48, 43, 40],
  [45, 37, 39],
  [37, 33, 45],
];

export function CycleExplainer() {
  const [mode, setMode] = useState<Mode>("scroll");
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const scrollRange = useRef({ start: 0, end: 1 });
  const lastIndex = useRef(0);
  /* Where the day currently stands, so it can be repainted in place when the
     device changes from daylight to twilight under it. */
  const progress0 = useRef(0);
  const phase = PHASES[active];

  const paint = useCallback((progress: number) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const p = Math.max(0, Math.min(1, progress));
    const daylight = Math.sin(p * Math.PI);
    const dusk = Math.max(0, (p - 0.68) / 0.32);
    scene.style.setProperty("--daylight", daylight.toFixed(3));
    scene.style.setProperty("--sun-x", `${180 + p * 660}px`);
    scene.style.setProperty("--sun-y", `${318 - daylight * 226}px`);
    scene.style.setProperty("--sun-opacity", String(1 - dusk));
    scene.style.setProperty("--cloud-x", `${p * 110}px`);
    scene.style.setProperty("--mist", String(0.58 * (1 - daylight)));
    scene.style.setProperty("--mist-x", `${p * -90}px`);
    /* Birds only in the middle of the day, and not for long. */
    scene.style.setProperty(
      "--birds",
      String(Math.max(0, Math.min(1, (daylight - 0.72) / 0.24))),
    );
    scene.style.setProperty("--flower-open", String(0.56 + daylight * 0.44));
    scene.style.setProperty("--flower-rise", `${(1 - daylight) * 13}px`);
    scene.style.setProperty(
      "--flower-lean",
      `${Math.sin(p * Math.PI * 2) * 9}deg`,
    );
    scene.style.setProperty("--stars", String(dusk));

    const night =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const colors = night ? PAPER_NIGHT : PAPER_DAY;
    const frame = p * 4,
      lower = Math.min(3, Math.floor(frame)),
      mix = frame - lower;
    const color = colors[lower].map((v, c) =>
      Math.round(v + (colors[lower + 1][c] - v) * mix),
    );
    scene.style.setProperty("--day-paper", `rgb(${color.join(" ")})`);
    const i = Math.min(4, Math.round(p * 4));
    if (i !== lastIndex.current) {
      lastIndex.current = i;
      setActive(i);
    }
    progress0.current = p;
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => setMode(query.matches ? "scroll" : "browse");
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  /* Sunset on a device that has just gone dark: repaint the paper in place. */
  useEffect(() => {
    const twilight = window.matchMedia("(prefers-color-scheme: dark)");
    const repaint = () => paint(progress0.current);
    repaint();
    twilight.addEventListener("change", repaint);
    return () => twilight.removeEventListener("change", repaint);
  }, [paint]);

  useEffect(() => {
    if (mode !== "scroll" || !trackRef.current) return;
    let cancelled = false;
    let clean: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const driver = { progress: 0 };
      const ctx = gsap.context(() => {
        gsap.to(driver, {
          progress: 1,
          ease: "none",
          onUpdate: () => {
            if (document.documentElement.dataset.motion !== "off")
              paint(driver.progress);
          },
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top 88px",
            end: "bottom bottom",
            scrub: 0.55,
            onRefresh: (self) => {
              scrollRange.current = { start: self.start, end: self.end };
            },
          },
        });
      }, trackRef);
      const resume = () => {
        if (document.documentElement.dataset.motion !== "off")
          paint(driver.progress);
      };
      window.addEventListener("oriyali:motion", resume);
      ScrollTrigger.refresh();
      clean = () => {
        window.removeEventListener("oriyali:motion", resume);
        ctx.revert();
      };
    })().catch(() => {
      if (!cancelled) setMode("browse");
    });
    return () => {
      cancelled = true;
      clean?.();
    };
  }, [mode, paint]);

  function selectPhase(index: number) {
    const progress = index / 4;
    if (document.documentElement.dataset.motion === "off") paint(progress);
    if (mode === "scroll") {
      const { start, end } = scrollRange.current;
      window.scrollTo({
        top: start + (end - start) * progress + (index === 0 ? 1 : 0),
        behavior:
          document.documentElement.dataset.motion === "off"
            ? "instant"
            : "smooth",
      });
    } else {
      paint(progress);
      setActive(index);
    }
  }

  return (
    <div ref={trackRef} className="cycle-track" data-mode={mode}>
      <div className="cycle-sticky ori-grid gap-y-6">
        <nav
          className="cycle-original-legend col-rail"
          aria-label="Phases of the cycle"
        >
          <ol>
            {PHASES.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => selectPhase(i)}
                  aria-pressed={i === active}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      background: `var(${p.token})`,
                      opacity: i === active ? 1 : 0.4,
                    }}
                  />
                  {p.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <div className="col-main">
          <div className="cycle-artwork" data-phase={phase.id}>
            <CycleLandscape ref={sceneRef} />
            <div className="cycle-artwork__caption">
              <span>{phase.timeOfDay}</span>
              <span>0{active + 1} / 05</span>
            </div>
          </div>
          <div className="cycle-caption cycle-caption--original" key={phase.id}>
            <p className="ori-kicker">
              0{active + 1} &middot; {phase.days}
            </p>
            {/* The one place the serif italic speaks: five short phrases that
                have to change under the reader without the drawing above them
                appearing to change font as well. */}
            <h3
              className="ori-subtitle mt-2.5 italic"
              style={{ fontFamily: "var(--font-display-italic)" }}
            >
              {phase.felt}
            </h3>
            <p className="ori-copy ori-justify mt-4 max-w-[40rem]">
              {phase.body}
            </p>
          </div>
          <p className="sr-only" role="status">
            {phase.name}. {phase.felt}.
          </p>
          <noscript>
            {PHASES.slice(1).map((p) => (
              <article key={p.id} className="mt-10">
                <h3 className="ori-subtitle">
                  {p.name}: {p.felt}
                </h3>
                <p className="ori-copy mt-4">
                  {p.days}. {p.body}
                </p>
              </article>
            ))}
          </noscript>
        </div>
      </div>
    </div>
  );
}
