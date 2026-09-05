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

export function CycleExplainer() {
  const [mode, setMode] = useState<Mode>("scroll");
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const scrollRange = useRef({ start: 0, end: 1 });
  const lastIndex = useRef(0);
  const phase = PHASES[active];

  const paint = useCallback((progress: number) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const p = Math.max(0, Math.min(1, progress));
    // Phase buttons land on complete drawings; the last stretch settles into night.
    const frame = p <= 0.75 ? p * 4 : 3 + (p - 0.75) * 8;
    const lower = Math.floor(frame);
    const blend = Math.max(0, (frame - lower - 0.78) / 0.22);
    scene.querySelectorAll<HTMLElement>("[data-frame]").forEach((el, index) => {
      // An opaque under-frame avoids dimming while the next pencil drawing develops.
      el.style.opacity =
        index === lower ? "1" : index === lower + 1 ? String(blend) : "0";
    });
    const i = Math.min(4, blend > 0.5 ? lower + 1 : lower);
    if (i !== lastIndex.current) {
      lastIndex.current = i;
      setActive(i);
    }
  }, []);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 1000px) and (min-height: 880px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setMode(query.matches ? "scroll" : "browse");
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

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
          onUpdate: () => paint(driver.progress),
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
      ScrollTrigger.refresh();
      clean = () => ctx.revert();
    })().catch(() => {
      if (!cancelled) setMode("browse");
    });
    return () => {
      cancelled = true;
      clean?.();
    };
  }, [mode, paint]);

  function selectPhase(index: number) {
    const progress = index === 4 ? 0.875 : index / 4;
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
            <h3
              className="ori-headline mt-2.5 italic"
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
                <h3 className="ori-headline">
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
