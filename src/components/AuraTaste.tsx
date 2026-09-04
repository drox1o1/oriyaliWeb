"use client";

import { useId, useState } from "react";
import { Aura } from "@/components/Aura";
import { describeAura } from "@/lib/aura";

const MOOD_WORDS = ["Flat", "Low", "Heavy", "Getting there", "Steady", "Clear"];
const ENERGY_WORDS = ["Empty", "Running low", "Enough", "Steady", "Full"];
const EDGE_WORDS = ["Still", "A little raw", "Short fuse", "Everything grates", "Storm"];

const word = (list: string[], v: number) =>
  list[Math.min(list.length - 1, Math.floor(v * list.length))];

/**
 * A taste of the daily check-in.
 *
 * Three sliders, and the aura draws itself in response. The point is felt, not
 * argued: a hard day renders as a deep, stormy, dignified bloom — as carefully
 * drawn as a calm one. A bad day is a real, coloured day, not a shameful spike.
 *
 * Nothing here is submitted, stored or counted.
 */
export function AuraTaste() {
  const [mood, setMood] = useState(0.34);
  const [energy, setEnergy] = useState(0.3);
  const [edge, setEdge] = useState(0.68);
  const [touched, setTouched] = useState(false);

  const moodId = useId();
  const energyId = useId();
  const edgeId = useId();

  const hard = mood < 0.42 || edge > 0.62;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-center md:gap-14">
      {/* The drawing */}
      <div className="ori-paper-card flex flex-col items-center justify-center px-6 py-10 md:py-14">
        <Aura
          input={{ mood, energy, turbulence: edge }}
          seed={4711}
          animate={!touched}
          className="h-56 w-56 md:h-72 md:w-72"
          decorative
        />
        <p className="mt-6 text-center font-[family-name:var(--font-hand)] text-[1.25rem] leading-snug text-ink">
          {hard
            ? "This is what a hard day looks like here."
            : "This is what a steadier day looks like here."}
        </p>
        <p aria-live="polite" className="sr-only">
          {describeAura(mood, energy, edge)}
        </p>
      </div>

      {/* The controls */}
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Try it — thirty seconds
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-[1.75rem] leading-[1.18] text-ink md:text-[2.1rem]">
          Move these, and watch the day get drawn.
        </h3>
        <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">
          This is the check-in from the app, running here in your browser. Nothing is
          submitted, saved or counted.
        </p>

        <div className="mt-8 space-y-7">
          <Slider
            id={moodId}
            label="Mood"
            value={mood}
            display={word(MOOD_WORDS, mood)}
            onChange={(v) => { setMood(v); setTouched(true); }}
          />
          <Slider
            id={energyId}
            label="Energy"
            value={energy}
            display={word(ENERGY_WORDS, energy)}
            onChange={(v) => { setEnergy(v); setTouched(true); }}
          />
          <Slider
            id={edgeId}
            label="Irritability"
            value={edge}
            display={word(EDGE_WORDS, edge)}
            onChange={(v) => { setEdge(v); setTouched(true); }}
          />
        </div>

        <p className="mt-8 font-[family-name:var(--font-hand)] text-[1.1rem] leading-relaxed text-[var(--bloom-ink)]">
          A bad day still gets a beautiful drawing. That&rsquo;s deliberate.
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
        className="ori-slider h-11 w-full cursor-pointer"
      />
    </div>
  );
}
