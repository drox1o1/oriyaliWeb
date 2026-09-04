/**
 * The Premenstrual Symptoms Screening Tool (PSST).
 *
 * Steiner M, Macdougall M, Brown E. "The premenstrual symptoms screening tool
 * (PSST) for clinicians." Archives of Women's Mental Health, 2003;6(3):203–209.
 * doi:10.1007/s00737-003-0018-4
 *
 * The instrument is reproduced here as published: 14 symptom items, 5
 * functional-interference items, one 4-point severity scale, and the exact
 * three-part scoring rule. Nothing is invented and nothing is re-weighted.
 *
 * Everything in this file is pure. It runs in the browser and returns a value.
 * It never reads or writes storage, and it never touches the network.
 */

export type Severity = 0 | 1 | 2 | 3;

export const SEVERITY_LABELS: Record<Severity, string> = {
  0: "Not at all",
  1: "Mild",
  2: "Moderate",
  3: "Severe",
};

/** The PSST's opening gate: symptoms must be cyclical to count. */
export type CyclicalAnswer = "yes" | "no" | "unsure";

export interface SymptomItem {
  id: string;
  /** The item as published. */
  label: string;
  /** Plain, lived-in phrasing. Same item, said the way a person would say it. */
  aside?: string;
  /** Items 1–4 are the core mood items the scoring rule singles out. */
  core: boolean;
}

/** Domain A — the 14 symptom items, in published order. */
export const SYMPTOM_ITEMS: readonly SymptomItem[] = [
  { id: "anger", label: "Anger or irritability", aside: "The short fuse. Snapping at people you love.", core: true },
  { id: "anxiety", label: "Anxiety or tension", aside: "Wound tight, braced for something.", core: true },
  { id: "tearful", label: "Tearfulness, or increased sensitivity to rejection", aside: "Everything lands harder than it should.", core: true },
  { id: "depressed", label: "Depressed mood or hopelessness", aside: "The flat, heavy, nothing-will-ever-change feeling.", core: true },
  { id: "work", label: "Decreased interest in work activities", core: false },
  { id: "home", label: "Decreased interest in home activities", core: false },
  { id: "social", label: "Decreased interest in social activities", aside: "Cancelling things you'd normally want to do.", core: false },
  { id: "concentration", label: "Difficulty concentrating", aside: "The fog. Reading the same line four times.", core: false },
  { id: "fatigue", label: "Fatigue or lack of energy", core: false },
  { id: "overeating", label: "Overeating or food cravings", core: false },
  { id: "insomnia", label: "Insomnia", aside: "Tired all day, wide awake at 2am.", core: false },
  { id: "hypersomnia", label: "Needing more sleep than usual", core: false },
  { id: "overwhelmed", label: "Feeling overwhelmed, or out of control", core: false },
  {
    id: "physical",
    label: "Physical symptoms — breast tenderness, headaches, joint or muscle pain, bloating, weight gain",
    core: false,
  },
] as const;

export interface InterferenceItem {
  id: string;
  /** Published letter (A–E), kept so the scoring maps back to the paper. */
  letter: string;
  label: string;
}

/** Domain B — the 5 functional-interference items, in published order. */
export const INTERFERENCE_ITEMS: readonly InterferenceItem[] = [
  { id: "productivity", letter: "A", label: "Your work efficiency or productivity" },
  { id: "coworkers", letter: "B", label: "Your relationships with co-workers" },
  { id: "family", letter: "C", label: "Your relationships with family" },
  { id: "sociallife", letter: "D", label: "Your social life activities" },
  { id: "responsibilities", letter: "E", label: "Your home responsibilities" },
] as const;

export type Classification = "pmdd" | "moderate-severe-pms" | "below-threshold";

export interface ScoreDetail {
  /** ≥1 of items 1–4 rated Severe. */
  coreSevere: boolean;
  /** ≥1 of items 1–4 rated Moderate or worse. */
  coreModerate: boolean;
  /** How many of items 1–14 are Moderate or worse. The rule needs 4. */
  moderatePlusCount: number;
  /** ≥1 of A–E rated Severe. */
  interferenceSevere: boolean;
  /** ≥1 of A–E rated Moderate or worse. */
  interferenceModerate: boolean;
  /** Descriptive only. The PSST classifies on the rule above, not on a total. */
  symptomTotal: number;
}

export interface PsstResult {
  classification: Classification;
  detail: ScoreDetail;
  /** Which of the three PMDD conditions were met, in plain English. */
  metConditions: string[];
  unmetConditions: string[];
}

const MODERATE: Severity = 2;
const SEVERE: Severity = 3;
const CORE_ITEM_IDS = SYMPTOM_ITEMS.filter((i) => i.core).map((i) => i.id);

/**
 * Applies the published PSST rule exactly.
 *
 * PMDD requires all three:
 *   1. at least one of items 1–4 is Severe;
 *   2. at least four of items 1–14 are Moderate or Severe;
 *   3. at least one of A–E is Severe.
 *
 * Moderate-to-severe PMS requires the same three shapes at Moderate:
 *   1. at least one of items 1–4 is Moderate or Severe;
 *   2. at least four of items 1–14 are Moderate or Severe;
 *   3. at least one of A–E is Moderate or Severe.
 */
export function scorePsst(
  symptoms: Record<string, Severity>,
  interference: Record<string, Severity>,
): PsstResult {
  const symptomValues = SYMPTOM_ITEMS.map((i) => symptoms[i.id] ?? 0);
  const coreValues = CORE_ITEM_IDS.map((id) => symptoms[id] ?? 0);
  const interferenceValues = INTERFERENCE_ITEMS.map((i) => interference[i.id] ?? 0);

  const detail: ScoreDetail = {
    coreSevere: coreValues.some((v) => v >= SEVERE),
    coreModerate: coreValues.some((v) => v >= MODERATE),
    moderatePlusCount: symptomValues.filter((v) => v >= MODERATE).length,
    interferenceSevere: interferenceValues.some((v) => v >= SEVERE),
    interferenceModerate: interferenceValues.some((v) => v >= MODERATE),
    symptomTotal: symptomValues.reduce<number>((a, b) => a + b, 0),
  };

  const meetsPmdd =
    detail.coreSevere && detail.moderatePlusCount >= 4 && detail.interferenceSevere;

  const meetsPms =
    detail.coreModerate && detail.moderatePlusCount >= 4 && detail.interferenceModerate;

  const classification: Classification = meetsPmdd
    ? "pmdd"
    : meetsPms
      ? "moderate-severe-pms"
      : "below-threshold";

  const conditions: Array<[boolean, string]> = [
    [detail.coreSevere, "At least one of anger, anxiety, tearfulness or low mood was severe."],
    [
      detail.moderatePlusCount >= 4,
      `At least four symptoms were moderate or severe — you marked ${detail.moderatePlusCount}.`,
    ],
    [detail.interferenceSevere, "At least one part of your life was severely affected."],
  ];

  return {
    classification,
    detail,
    metConditions: conditions.filter(([met]) => met).map(([, text]) => text),
    unmetConditions: conditions.filter(([met]) => !met).map(([, text]) => text),
  };
}

export const PSST_CITATION =
  "Steiner M, Macdougall M, Brown E. The premenstrual symptoms screening tool (PSST) for clinicians. Archives of Women's Mental Health. 2003;6(3):203–209.";

export const PSST_CITATION_URL = "https://doi.org/10.1007/s00737-003-0018-4";
