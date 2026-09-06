"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  INTERFERENCE_ITEMS,
  PSST_CITATION,
  PSST_CITATION_URL,
  SEVERITY_LABELS,
  SYMPTOM_ITEMS,
  scorePsst,
  type CyclicalAnswer,
  type Severity,
} from "@/lib/psst";
import { CrisisBlock } from "@/components/CrisisBlock";
import { SelfCheckResult } from "@/components/SelfCheckResult";
import { DrawnRule } from "@/components/Illustrations";

const SEVERITIES: Severity[] = [0, 1, 2, 3];

type Step =
  | { kind: "intro" }
  | { kind: "cyclical" }
  | { kind: "symptom"; index: number }
  | { kind: "safety" }
  | { kind: "interference"; index: number }
  | { kind: "result" };

const STEPS: Step[] = [
  { kind: "intro" },
  { kind: "cyclical" },
  ...SYMPTOM_ITEMS.map((_, index) => ({ kind: "symptom" as const, index })),
  { kind: "safety" },
  ...INTERFERENCE_ITEMS.map((_, index) => ({ kind: "interference" as const, index })),
  { kind: "result" },
];

/** Questions that count toward the progress line (the intro and result don't). */
const ANSWERABLE = STEPS.length - 2;

/**
 * The self-check.
 *
 * Everything here happens in this browser. Answers live in React state and
 * nowhere else — not on a server, not in localStorage, not in an analytics
 * event. Close the tab and they are gone. That is the promise, and the code is
 * the proof: there is no fetch in this file.
 *
 * Before hydration — and forever, if JavaScript never runs — the same questions
 * render as one plain form with the scoring rule printed underneath, so a
 * visitor can read her own answers without us.
 */
export function SelfCheck() {
  const [enhanced, setEnhanced] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [symptoms, setSymptoms] = useState<Record<string, Severity>>({});
  const [interference, setInterference] = useState<Record<string, Severity>>({});
  const [cyclical, setCyclical] = useState<CyclicalAnswer | null>(null);
  const [safety, setSafety] = useState<"none" | "some" | "skipped" | null>(null);

  const headingRef = useRef<HTMLParagraphElement>(null);
  const shouldFocusHeading = useRef(false);

  useEffect(() => setEnhanced(true), []);

  useEffect(() => {
    if (shouldFocusHeading.current) {
      headingRef.current?.focus();
      shouldFocusHeading.current = false;
    }
  }, [stepIndex]);

  const step = STEPS[stepIndex];
  const result = useMemo(() => scorePsst(symptoms, interference), [symptoms, interference]);

  function go(delta: number) {
    shouldFocusHeading.current = true;
    setStepIndex((i) => Math.min(STEPS.length - 1, Math.max(0, i + delta)));
  }

  function restart() {
    setSymptoms({});
    setInterference({});
    setCyclical(null);
    setSafety(null);
    shouldFocusHeading.current = true;
    setStepIndex(0);
  }

  /* ---------- the plain, un-enhanced form ---------- */
  if (!enhanced) {
    return <PlainForm />;
  }

  /* ---------- the guided flow ---------- */

  const answered =
    step.kind === "cyclical"
      ? cyclical !== null
      : step.kind === "symptom"
        ? symptoms[SYMPTOM_ITEMS[step.index].id] !== undefined
        : step.kind === "safety"
          ? safety !== null
          : step.kind === "interference"
            ? interference[INTERFERENCE_ITEMS[step.index].id] !== undefined
            : true;

  const questionNumber = stepIndex; // step 0 is the intro
  const showProgress = step.kind !== "intro" && step.kind !== "result";

  return (
    <div className="ori-paper-card px-5 py-8 md:px-10 md:py-12">
      {/* The promise, kept in view for the whole flow. */}
      <p className="mb-7 flex items-center justify-center gap-2 text-center text-[0.86rem] text-ink-soft">
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="shrink-0">
          <path d="M10 2.6 3.8 5v4.4c0 3.7 2.5 6.9 6.2 8 3.7-1.1 6.2-4.3 6.2-8V5Z" strokeLinejoin="round" />
        </svg>
        Nothing you answer here leaves your device.
      </p>

      {showProgress ? (
        <div className="mb-9">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Question {questionNumber} of {ANSWERABLE}
            </p>
            <p className="text-[0.86rem] text-ink-soft">No timer. Leave whenever you like.</p>
          </div>
          <DrawnRule progress={questionNumber / ANSWERABLE} />
          <p className="sr-only" aria-live="polite">
            Question {questionNumber} of {ANSWERABLE}
          </p>
        </div>
      ) : null}

      {step.kind === "intro" ? (
        <div className="ori-page-in mx-auto max-w-[36rem]">
          <p ref={headingRef} tabIndex={-1} className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-soft outline-none">
            A few quiet questions
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-[1.95rem] leading-[1.15] text-ink md:text-[2.4rem]">
            Twenty-one questions, about four minutes, just for you.
          </h3>
          {/* The text of each line is wrapped, because a flex row treats every
              child — including each run of bare text either side of an <em> —
              as its own item, and then puts the gap between all of them. */}
          <ul className="mt-6 space-y-3 text-[1rem] leading-relaxed text-ink-soft">
            <li className="flex gap-3">
              <Tick />
              <span>Answer for a typical <em>bad</em> week, not today.</span>
            </li>
            <li className="flex gap-3">
              <Tick />
              <span>
                Your answers are worked out in this browser and are never sent, saved or
                stored &mdash; not even here.
              </span>
            </li>
            <li className="flex gap-3">
              <Tick />
              <span>At the end you get a plain explanation, not a diagnosis.</span>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => go(1)}
            className="mt-9 min-h-[52px] w-full rounded-full bg-[var(--ink)] px-8 text-[1.05rem] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90 sm:w-auto"
          >
            Start
          </button>
          <p className="mt-5 text-[0.86rem] leading-relaxed text-ink-soft">
            Educational only &mdash; not a medical device, and not a diagnosis. {PSST_CITATION}{" "}
            <a href={PSST_CITATION_URL} rel="noopener noreferrer" target="_blank" className="text-ink underline decoration-[var(--hairline)] underline-offset-4">
              View the paper
            </a>
            .
          </p>
        </div>
      ) : null}

      {step.kind === "cyclical" ? (
        <div className="ori-page-in mx-auto max-w-[36rem]">
          <Legend ref={headingRef} eyebrow="First, the timing">
            Do these hard weeks start before your period, and ease off within a few days of
            bleeding?
          </Legend>
          <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
            Almost nobody knows this for certain the first time they&rsquo;re asked. A best
            guess is fine.
          </p>
          <fieldset className="mt-7 border-0 p-0">
            <legend className="sr-only">
              Do your symptoms start before your period and ease within a few days of bleeding?
            </legend>
            <div className="space-y-3">
              {(
                [
                  ["yes", "Yes — that's the pattern"],
                  ["no", "No — it's like this most of the month"],
                  ["unsure", "I've never tracked it closely enough to say"],
                ] as [CyclicalAnswer, string][]
              ).map(([value, label]) => (
                <Option
                  key={value}
                  name="cyclical"
                  checked={cyclical === value}
                  label={label}
                  onChange={() => setCyclical(value)}
                />
              ))}
            </div>
          </fieldset>
        </div>
      ) : null}

      {step.kind === "symptom" ? (
        <SeverityQuestion
          ref={headingRef}
          eyebrow="In the week or two before your period"
          question={SYMPTOM_ITEMS[step.index].label}
          aside={SYMPTOM_ITEMS[step.index].aside}
          name={`symptom-${SYMPTOM_ITEMS[step.index].id}`}
          value={symptoms[SYMPTOM_ITEMS[step.index].id]}
          onChange={(v) => setSymptoms((s) => ({ ...s, [SYMPTOM_ITEMS[step.index].id]: v }))}
        />
      ) : null}

      {step.kind === "safety" ? (
        <div className="ori-page-in mx-auto max-w-[36rem]">
          <Legend ref={headingRef} eyebrow="One question that isn't part of the screener">
            In those weeks, have you had thoughts of harming yourself, or of not wanting to
            be here?
          </Legend>
          <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
            We ask because for a lot of people with PMDD the answer is yes, and it deserves
            more than a line in a score. Nothing here is sent anywhere, whatever you pick.
            You can skip it.
          </p>
          <fieldset className="mt-7 border-0 p-0">
            <legend className="sr-only">
              Have you had thoughts of harming yourself, or of not wanting to be here?
            </legend>
            <div className="space-y-3">
              <Option name="safety" checked={safety === "none"} label="No" onChange={() => setSafety("none")} />
              <Option name="safety" checked={safety === "some"} label="Yes — sometimes, or often" onChange={() => setSafety("some")} />
              <Option name="safety" checked={safety === "skipped"} label="I'd rather not answer" onChange={() => setSafety("skipped")} />
            </div>
          </fieldset>

          {/* Surfaced immediately. Not held back behind a result, not softened. */}
          {safety === "some" ? (
            <div className="mt-8 -mx-5 overflow-hidden rounded-[16px] md:-mx-10" role="region" aria-label="Crisis resources">
              <CrisisBlock
                heading="Before anything else — these numbers are free, and they are answered by people who have heard this before."
                lead="You don't have to be in an emergency to call. You don't have to be sure. Wanting it to stop is enough of a reason."
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {step.kind === "interference" ? (
        <SeverityQuestion
          ref={headingRef}
          eyebrow="How much it gets in the way"
          question={`In those weeks, how much do your symptoms interfere with ${INTERFERENCE_ITEMS[step.index].label.toLowerCase()}?`}
          name={`interference-${INTERFERENCE_ITEMS[step.index].id}`}
          value={interference[INTERFERENCE_ITEMS[step.index].id]}
          onChange={(v) =>
            setInterference((s) => ({ ...s, [INTERFERENCE_ITEMS[step.index].id]: v }))
          }
        />
      ) : null}

      {step.kind === "result" ? (
        <div>
          <p ref={headingRef} tabIndex={-1} className="sr-only" role="status">
            Your self-check result is ready.
          </p>
          <SelfCheckResult
            result={result}
            cyclical={cyclical ?? "unsure"}
            flaggedSafety={safety === "some"}
            onRestart={restart}
          />
        </div>
      ) : null}

      {/* Navigation. Back is always available; nothing advances on its own. */}
      {step.kind !== "intro" && step.kind !== "result" ? (
        <div className="mx-auto mt-10 flex max-w-[36rem] items-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="min-h-11 rounded-full px-4 text-[0.98rem] text-ink-soft transition-colors hover:text-ink"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={!answered}
            className="ml-auto min-h-[52px] min-w-[9rem] rounded-full bg-[var(--ink)] px-8 text-[1.02rem] font-semibold text-[var(--paper)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {stepIndex === STEPS.length - 2 ? "See what this means" : "Next"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------- */

function Tick() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-1.5 shrink-0 text-leaf-deep">
      <path d="M4 10.6 8.2 15 16 5.6" />
    </svg>
  );
}

function Legend({
  ref,
  eyebrow,
  children,
}: {
  ref: React.Ref<HTMLParagraphElement>;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <p ref={ref} tabIndex={-1} className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-soft outline-none">
        {eyebrow}
      </p>
      <h3 className="mt-3 font-[family-name:var(--font-display)] text-[1.6rem] leading-[1.2] text-ink md:text-[2rem]">
        {children}
      </h3>
    </>
  );
}

function SeverityQuestion({
  ref,
  eyebrow,
  question,
  aside,
  name,
  value,
  onChange,
}: {
  ref: React.Ref<HTMLParagraphElement>;
  eyebrow: string;
  question: string;
  aside?: string;
  name: string;
  value: Severity | undefined;
  onChange: (v: Severity) => void;
}) {
  return (
    <div className="ori-page-in mx-auto max-w-[36rem]">
      <Legend ref={ref} eyebrow={eyebrow}>
        {question}
      </Legend>
      {aside ? (
        <p className="ori-hand mt-4 text-[1rem] text-[var(--bloom-ink)]">
          {aside}
        </p>
      ) : null}
      <fieldset className="mt-7 border-0 p-0">
        <legend className="sr-only">{question}</legend>
        <div className="space-y-3">
          {SEVERITIES.map((s) => (
            <Option
              key={s}
              name={name}
              checked={value === s}
              label={SEVERITY_LABELS[s]}
              onChange={() => onChange(s)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

/** A clear control on a soft world. Big target, real radio underneath. */
function Option({
  name,
  checked,
  label,
  onChange,
}: {
  name: string;
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex min-h-[56px] cursor-pointer items-center gap-4 rounded-[16px] border-[1.5px] px-5 py-3 transition-colors ${
        checked
          ? "border-[var(--bloom-ink)] bg-[var(--selected-fill)]"
          : "border-[var(--hairline)] hover:bg-[var(--well)]"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px] ${
          checked ? "border-[var(--bloom-ink)]" : "border-[var(--ink-soft)]"
        }`}
      >
        {checked ? <span className="h-3 w-3 rounded-full bg-[var(--bloom-ink)]" /> : null}
      </span>
      <span className="text-[1.05rem] text-ink">{label}</span>
    </label>
  );
}

/**
 * With JavaScript off, the whole instrument renders at once, followed by the
 * scoring rule in plain English — so a visitor can read her own answers
 * herself. Nothing is hidden behind a script.
 */
function PlainForm() {
  return (
    <div className="ori-paper-card px-5 py-8 md:px-10 md:py-12">
      <p className="mb-7 text-center text-[0.86rem] text-ink-soft">
        Nothing you answer here leaves your device.
      </p>

      <div className="mx-auto max-w-[38rem]">
        <h3 className="font-[family-name:var(--font-display)] text-[1.95rem] leading-[1.15] text-ink md:text-[2.4rem]">
          A few quiet questions, just for you.
        </h3>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-ink-soft">
          Answer these for a typical <em>bad</em> week &mdash; the week or two before your
          period &mdash; not for today. The scoring rule is printed at the bottom, so you can
          read your own answers without anyone&rsquo;s help.
        </p>

        <form className="mt-10 space-y-9">
          <fieldset className="border-0 p-0">
            <legend className="font-[family-name:var(--font-display)] text-[1.3rem] text-ink">
              Do these weeks start before your period, and ease within a few days of bleeding?
            </legend>
            <div className="mt-4 space-y-3">
              {["Yes — that's the pattern", "No — it's like this most of the month", "I've never tracked it closely enough to say"].map((l) => (
                <StaticOption key={l} name="cyclical-plain" label={l} />
              ))}
            </div>
          </fieldset>

          <div>
            <h4 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              The symptoms &mdash; questions 1 to 14
            </h4>
            <div className="mt-5 space-y-8">
              {SYMPTOM_ITEMS.map((item, i) => (
                <fieldset key={item.id} className="border-0 p-0">
                  <legend className="text-[1.08rem] font-semibold text-ink">
                    {i + 1}. {item.label}
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {SEVERITIES.map((s) => (
                      <StaticOption key={s} name={`symptom-plain-${item.id}`} label={SEVERITY_LABELS[s]} compact />
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              How much it gets in the way &mdash; A to E
            </h4>
            <div className="mt-5 space-y-8">
              {INTERFERENCE_ITEMS.map((item) => (
                <fieldset key={item.id} className="border-0 p-0">
                  <legend className="text-[1.08rem] font-semibold text-ink">
                    {item.letter}. {item.label}
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {SEVERITIES.map((s) => (
                      <StaticOption key={s} name={`interference-plain-${item.id}`} label={SEVERITY_LABELS[s]} compact />
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>
        </form>

        <div className="mt-12 rounded-[18px] border-[1.5px] border-[var(--hairline)] bg-[var(--paper-deep)] p-6">
          <h4 className="font-[family-name:var(--font-display)] text-[1.35rem] text-ink">
            How to read your own answers
          </h4>
          <p className="mt-3 text-[1rem] leading-relaxed text-ink-soft">
            This is the whole PSST rule, exactly as published. Nothing is weighted and there
            is no total score.
          </p>
          <p className="mt-5 text-[1rem] font-semibold text-ink">Your answers point toward PMDD if all three are true:</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[1rem] leading-relaxed text-ink-soft">
            <li>At least one of questions 1&ndash;4 is <strong className="text-ink">Severe</strong>.</li>
            <li>At least four of questions 1&ndash;14 are <strong className="text-ink">Moderate</strong> or <strong className="text-ink">Severe</strong>.</li>
            <li>At least one of A&ndash;E is <strong className="text-ink">Severe</strong>.</li>
          </ol>
          <p className="mt-5 text-[1rem] font-semibold text-ink">They point toward moderate to severe PMS if all three are true:</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[1rem] leading-relaxed text-ink-soft">
            <li>At least one of questions 1&ndash;4 is Moderate or Severe.</li>
            <li>At least four of questions 1&ndash;14 are Moderate or Severe.</li>
            <li>At least one of A&ndash;E is Moderate or Severe.</li>
          </ol>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-soft">
            Either way it is a screening result, not a diagnosis &mdash; and the timing question
            at the top matters as much as the rest. If your symptoms never clear up after
            your period starts, say exactly that to a doctor.
          </p>
        </div>

        <p className="mt-8 text-[0.88rem] leading-relaxed text-ink-soft">
          {PSST_CITATION}{" "}
          <a href={PSST_CITATION_URL} rel="noopener noreferrer" target="_blank" className="text-ink underline decoration-[var(--hairline)] underline-offset-4">
            View the paper
          </a>
          . If you&rsquo;re struggling right now,{" "}
          <Link href="/crisis" className="text-ink underline decoration-[var(--hairline)] underline-offset-4">
            the crisis numbers are here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function StaticOption({ name, label, compact }: { name: string; label: string; compact?: boolean }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-[14px] border-[1.5px] border-[var(--hairline)] hover:bg-[var(--well)] ${
        compact ? "min-h-11 px-4 py-2" : "min-h-[56px] px-5 py-3"
      }`}
    >
      <input type="radio" name={name} className="h-[18px] w-[18px] accent-[var(--bloom-ink)]" />
      <span className="text-[1rem] text-ink">{label}</span>
    </label>
  );
}
