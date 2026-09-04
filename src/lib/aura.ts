/**
 * The Aura — Oriyali's signature device, as geometry.
 *
 * A hand-drawn radiating bloom: a day's emotional weather, drawn. A hard day
 * renders as a deep, stormy, dignified bloom, built by exactly the same code
 * and given exactly the same care as a calm one. That is the whole point of it.
 *
 * Every path is generated from a seeded PRNG, so a given input always produces
 * the identical drawing — stable across re-renders, and identical on the server
 * and in the browser (no hydration drift).
 *
 * Pure geometry. No storage, no network, no side effects.
 */

/** mulberry32 — small, fast, deterministic. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface AuraInput {
  /** 0 = the flattest day, 1 = the clearest day. */
  mood: number;
  /** 0 = running on empty, 1 = full tank. */
  energy: number;
  /** 0 = still water, 1 = a storm. Drives how much the strokes churn. */
  turbulence: number;
}

export interface AuraPetal {
  /** The lobe outline — stroked, and softly filled. */
  d: string;
  /** Generous over-estimate of path length, for the draw-in dash. */
  length: number;
  /** CSS custom-property name for this petal's colour. */
  color: string;
  fillOpacity: number;
  strokeWidth: number;
  /** Stagger, in ms, so the bloom sketches itself in rather than snapping on. */
  delay: number;
}

/** Short, detached strokes thrown off by a stormy day. */
export interface AuraSpark {
  d: string;
  length: number;
  color: string;
  delay: number;
}

export interface Aura {
  petals: AuraPetal[];
  sparks: AuraSpark[];
  /** The drawn core, at the centre of the bloom. */
  core: string;
  coreLength: number;
  /** A second, inner arc in the core — the iris. */
  coreInner: string;
  /** Description for assistive technology, in the app's own voice. */
  label: string;
  /** Total draw-in duration, ms. */
  duration: number;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const f2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Colour follows the felt day, not a good/bad axis.
 * Low mood reaches for warm dusk and plum — sheltering, never alarming.
 * There is no red-alert bloom, because there is no red-alert state.
 */
function paletteFor(mood: number, energy: number): string[] {
  if (mood < 0.3) return ["--dusk-deep", "--dusk", "--dusk-deep", "--rose", "--dusk"];
  if (mood < 0.55) return ["--dusk", "--ochre", "--dusk-deep", "--rose", "--ochre"];
  if (mood < 0.78) return ["--ochre", "--sun", "--bloom", "--leaf", "--rose"];
  return energy > 0.55
    ? ["--sun", "--bloom", "--leaf", "--sky", "--sun"]
    : ["--leaf", "--sky", "--bloom", "--leaf", "--sun"];
}

const CX = 100;
const CY = 100;

/**
 * One lobe. `churn` bends the control points off the ideal path — a steady hand
 * at rest, a hand that can't keep still on a hard day.
 */
function lobe(
  rand: () => number,
  angle: number,
  reach: number,
  spread: number,
  churn: number,
): { d: string; length: number } {
  const tipX = CX + Math.cos(angle) * reach;
  const tipY = CY + Math.sin(angle) * reach;

  const wob = () => (rand() - 0.5) * churn;

  const leftA = angle - spread;
  const rightA = angle + spread;
  const midReach = reach * 0.58;

  const c1x = CX + Math.cos(leftA) * midReach + wob();
  const c1y = CY + Math.sin(leftA) * midReach + wob();
  const c2x = CX + Math.cos(angle - spread * 0.34) * reach * 0.92 + wob();
  const c2y = CY + Math.sin(angle - spread * 0.34) * reach * 0.92 + wob();
  const c3x = CX + Math.cos(angle + spread * 0.34) * reach * 0.92 + wob();
  const c3y = CY + Math.sin(angle + spread * 0.34) * reach * 0.92 + wob();
  const c4x = CX + Math.cos(rightA) * midReach + wob();
  const c4y = CY + Math.sin(rightA) * midReach + wob();

  // Start and end don't quite meet — the tell that a hand drew it.
  const gap = 0.9 + rand() * 2.2;
  const sx = CX + Math.cos(angle - spread * 0.5) * gap;
  const sy = CY + Math.sin(angle - spread * 0.5) * gap;

  const d =
    `M${f2(sx)},${f2(sy)} ` +
    `C${f2(c1x)},${f2(c1y)} ${f2(c2x)},${f2(c2y)} ${f2(tipX)},${f2(tipY)} ` +
    `C${f2(c3x)},${f2(c3y)} ${f2(c4x)},${f2(c4y)} ${f2(CX)},${f2(CY)}`;

  return { d, length: Math.ceil(reach * 3.4 + churn * 5 + 44) };
}

export function buildAura(input: AuraInput, seed = 20260904): Aura {
  const mood = clamp01(input.mood);
  const energy = clamp01(input.energy);
  const turbulence = clamp01(input.turbulence);

  const rand = seededRandom(seed);

  // A quiet day is a smaller, denser bloom; a high-energy day reaches further.
  const petalCount = Math.round(13 + energy * 7);
  const baseReach = 34 + energy * 34 + mood * 8;
  // Storminess churns the strokes and splays the lobes.
  const churn = 2.5 + turbulence * 15;
  // Narrow lobes, so the bloom reads as radiating strokes rather than a daisy.
  const lobeWidth = 0.085 + (1 - turbulence) * 0.05 + mood * 0.035;

  // A hard day is drawn deeper and heavier, not paler. It is a real, coloured day.
  const depth = 0.14 + (1 - mood) * 0.18;
  const weight = 1.7 + turbulence * 0.9;

  const palette = paletteFor(mood, energy);
  const petals: AuraPetal[] = [];

  // Outer ring — the reach.
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2 + (rand() - 0.5) * (0.2 + turbulence * 0.5);
    // No two petals the same length — a hand doesn't repeat itself, and a
    // stormy day is more uneven than a calm one.
    const variance = 0.24 + turbulence * 0.4;
    const reach = baseReach * (1 - variance / 2 + rand() * variance);
    const spread = lobeWidth * (0.75 + rand() * 0.6);

    const { d, length } = lobe(rand, angle, reach, spread, churn);
    petals.push({
      d,
      length,
      color: palette[i % palette.length],
      fillOpacity: depth + rand() * 0.07,
      strokeWidth: weight * (0.9 + rand() * 0.25),
      delay: Math.round(i * (560 / petalCount)),
    });
  }

  // Inner ring — offset half a step, shorter and denser, so the bloom radiates
  // rather than reading as a daisy.
  const innerCount = Math.max(7, petalCount - 3);
  for (let i = 0; i < innerCount; i++) {
    const angle =
      (i / innerCount) * Math.PI * 2 + Math.PI / innerCount + (rand() - 0.5) * 0.3;
    const reach = baseReach * (0.38 + rand() * 0.24);
    const spread = (lobeWidth + 0.07) * (0.85 + rand() * 0.45);

    const { d, length } = lobe(rand, angle, reach, spread, churn * 0.6);
    petals.push({
      d,
      length,
      color: palette[(i + 2) % palette.length],
      fillOpacity: depth + 0.12 + rand() * 0.08,
      strokeWidth: weight * 0.85,
      delay: Math.round(120 + i * (460 / innerCount)),
    });
  }

  // Sparks — a stormy day throws off broken strokes. Calm days have none.
  const sparks: AuraSpark[] = [];
  if (turbulence > 0.4) {
    const sparkCount = Math.round((turbulence - 0.4) * 18);
    for (let i = 0; i < sparkCount; i++) {
      const angle = rand() * Math.PI * 2;
      const from = baseReach * (0.95 + rand() * 0.2);
      const len = 5 + rand() * 12 * turbulence;
      const bend = (rand() - 0.5) * 9;

      const x1 = CX + Math.cos(angle) * from;
      const y1 = CY + Math.sin(angle) * from;
      const x2 = CX + Math.cos(angle) * (from + len);
      const y2 = CY + Math.sin(angle) * (from + len);
      const mx = (x1 + x2) / 2 + Math.cos(angle + Math.PI / 2) * bend;
      const my = (y1 + y2) / 2 + Math.sin(angle + Math.PI / 2) * bend;

      sparks.push({
        d: `M${f2(x1)},${f2(y1)} Q${f2(mx)},${f2(my)} ${f2(x2)},${f2(y2)}`,
        length: Math.ceil(len + Math.abs(bend) * 2 + 12),
        color: palette[i % palette.length],
        delay: Math.round(620 + i * 40),
      });
    }
  }

  // The core: a drawn circle that doesn't quite close, plus one inner arc —
  // the iris, for an app about seeing your own pattern.
  const r = 8.5 + energy * 3;
  const core =
    `M${f2(100 + r)},100 ` +
    `C${f2(100 + r)},${f2(100 + r * 0.58)} ${f2(100 + r * 0.58)},${f2(100 + r)} 100,${f2(100 + r)} ` +
    `C${f2(100 - r * 0.58)},${f2(100 + r)} ${f2(100 - r)},${f2(100 + r * 0.55)} ${f2(100 - r)},100 ` +
    `C${f2(100 - r)},${f2(100 - r * 0.58)} ${f2(100 - r * 0.55)},${f2(100 - r)} 100,${f2(100 - r)} ` +
    `C${f2(100 + r * 0.6)},${f2(100 - r)} ${f2(100 + r)},${f2(100 - r * 0.5)} ${f2(100 + r * 0.96)},${f2(100 - 1.4)}`;

  // The pupil: a small filled dot, slightly off-centre, the way an eye is drawn.
  const ir = r * 0.36;
  const coreInner =
    `M${f2(100 - ir)},${f2(100 + 0.6)} ` +
    `C${f2(100 - ir)},${f2(100 - ir * 1.4)} ${f2(100 + ir)},${f2(100 - ir * 1.4)} ${f2(100 + ir)},${f2(100 + 0.6)} ` +
    `C${f2(100 + ir)},${f2(100 + ir * 1.4)} ${f2(100 - ir)},${f2(100 + ir * 1.4)} ${f2(100 - ir)},${f2(100 + 0.6)}`;

  return {
    petals,
    sparks,
    core,
    coreLength: Math.ceil(r * 7),
    coreInner,
    label: describeAura(mood, energy, turbulence),
    duration: 620 + 900,
  };
}

/**
 * The alt text. Plainspoken, never euphemistic — a hard day is named as one.
 */
export function describeAura(mood: number, energy: number, turbulence: number): string {
  const weather =
    mood < 0.3
      ? "a deep plum and dusk bloom, drawn close and sheltering"
      : mood < 0.55
        ? "a warm dusk and ochre bloom"
        : mood < 0.78
          ? "an open bloom in ochre, gold and coral"
          : "a wide bloom in gold, sage and sky";

  const reach =
    energy < 0.34 ? "short, quiet petals" : energy < 0.67 ? "steady petals" : "long petals reaching out";

  const line =
    turbulence < 0.34
      ? "the lines are calm and even"
      : turbulence < 0.67
        ? "the lines churn a little"
        : "the lines churn and break";

  return `A hand-drawn aura: ${weather}, with ${reach}, and ${line}.`;
}

/** The aura for the entry moment — calm, mid-energy, still water. */
export const RESTING_AURA: AuraInput = { mood: 0.72, energy: 0.58, turbulence: 0.22 };
