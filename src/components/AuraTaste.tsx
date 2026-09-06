"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { DayPattern } from "@/components/DayPattern";

const MOOD_WORDS = ["Flat", "Low", "Heavy", "Getting there", "Steady", "Clear"];
const ENERGY_WORDS = ["Empty", "Running low", "Enough", "Steady", "Full"];
const EDGE_WORDS = [
  "Still",
  "A little raw",
  "Short fuse",
  "Everything grates",
  "Storm",
];

const word = (list: string[], v: number) =>
  list[Math.min(list.length - 1, Math.floor(v * list.length))];

/**
 * A taste of the daily check-in.
 *
 * Three sliders, and the aura draws itself in response. The point is felt, not
 * argued: every combination becomes a considered little print of the day.
 * There is no ideal pattern to achieve, and no score hidden in the drawing.
 *
 * Nothing here is submitted, stored or counted.
 */
export function AuraTaste() {
  const [mood, setMood] = useState(0.34);
  const [energy, setEnergy] = useState(0.3);
  const [edge, setEdge] = useState(0.68);
  const [drawn, setDrawn] = useState({
    mood: 0.34,
    energy: 0.3,
    turbulence: 0.68,
  });
  const current = useRef(drawn);
  useEffect(() => {
    const target = { mood, energy, turbulence: edge };
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "off"
    ) {
      current.current = target;
      setDrawn(target);
      return;
    }
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const blend = 1 - Math.exp(-Math.min(now - previous, 64) / 95);
      previous = now;
      const old = current.current;
      const next = {
        mood: old.mood + (mood - old.mood) * blend,
        energy: old.energy + (energy - old.energy) * blend,
        turbulence: old.turbulence + (edge - old.turbulence) * blend,
      };
      const settled =
        Math.abs(next.mood - mood) +
          Math.abs(next.energy - energy) +
          Math.abs(next.turbulence - edge) <
        0.002;
      current.current = settled ? target : next;
      setDrawn(current.current);
      if (!settled) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mood, energy, edge]);

  const moodId = useId();
  const energyId = useId();
  const edgeId = useId();

  const hard = mood < 0.42 || edge > 0.62;

  return (
    <div className="checkin-experience grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center lg:gap-14">
      {/* The drawing */}
      <div className="aura-studio">
        <DayPattern input={drawn} />
        <p className="ori-hand mt-6 text-center text-[1.05rem] text-ink">
          {hard
            ? "This is what a hard day looks like here."
            : "This is what a steadier day looks like here."}
        </p>
        <p aria-live="polite" className="sr-only">
          {`A printed circle of hand-drawn marks: ${
            energy < 0.2
              ? "falling raindrops"
              : energy < 0.4
                ? "round seeds"
                : energy < 0.6
                  ? "small shoots"
                  : energy < 0.8
                    ? "pointed leaves"
                    : "open flowers"
          }, printed in ${
            mood < 0.35 ? "deep blue on cool grey" : mood > 0.7 ? "yellow-green on deep leaf" : "teal on soft green"
          }, ${edge > 0.6 ? "turned at broad angles with a restless, undulating edge" : "upright in a quiet, even rhythm"}.`}
        </p>
      </div>

      {/* The controls */}
      <div>
        <p className="ori-kicker">Move these</p>
        <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">
          Energy changes what the marks are &mdash; rain, seeds, shoots, leaves,
          flowers. Mood changes the colour they&rsquo;re printed in. Irritability
          changes the rhythm they fall into.
        </p>

        <div className="aura-presets" aria-label="Try a day">
          {[
            { name: "A quiet day", m: 0.74, e: 0.58, t: 0.14 },
            { name: "A full day", m: 0.9, e: 0.96, t: 0.28 },
            { name: "A hard day", m: 0.22, e: 0.12, t: 0.85 },
          ].map((p) => (
            <button
              type="button"
              key={p.name}
              aria-pressed={
                Math.abs(mood - p.m) < 0.01 &&
                Math.abs(energy - p.e) < 0.01 &&
                Math.abs(edge - p.t) < 0.01
              }
              onClick={() => {
                setMood(p.m);
                setEnergy(p.e);
                setEdge(p.t);
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="mt-8 space-y-7">
          <Slider
            id={moodId}
            label="Mood"
            value={mood}
            display={word(MOOD_WORDS, mood)}
            onChange={(v) => {
              setMood(v);
            }}
          />
          <Slider
            id={energyId}
            label="Energy"
            value={energy}
            display={word(ENERGY_WORDS, energy)}
            onChange={(v) => {
              setEnergy(v);
            }}
          />
          <Slider
            id={edgeId}
            label="Irritability"
            value={edge}
            display={word(EDGE_WORDS, edge)}
            onChange={(v) => {
              setEdge(v);
            }}
          />
        </div>

        <p className="ori-hand mt-8 text-[1rem] text-[var(--bloom-ink)]">
          A bad day still gets a beautiful drawing. That&rsquo;s deliberate.
        </p>
        <p className="mt-4 text-[0.86rem] text-ink-soft">
          Nothing here is submitted, saved or counted.
        </p>
      </div>
    </div>
  );
}

function Slider({
  id,
  label,
  value,
  display,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[1.02rem] font-semibold text-ink">
          {label}
        </label>
        <span className="text-[0.98rem] text-ink-soft">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(value * 100)}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        style={{ "--slider-fill": `${value * 100}%` } as CSSProperties}
        className="ori-slider h-11 w-full cursor-pointer"
      />
    </div>
  );
}
