import Link from "next/link";
import { Aura } from "@/components/Aura";
import { PSST_CITATION, PSST_CITATION_URL, type CyclicalAnswer, type PsstResult } from "@/lib/psst";

interface Props {
  result: PsstResult;
  cyclical: CyclicalAnswer;
  flaggedSafety: boolean;
  onRestart: () => void;
}

/**
 * The result. It reframes; it never diagnoses.
 *
 * Three things, in this order: what you described, what that means, what to do
 * next. The app is mentioned once, at the end, and it is skippable.
 */
export function SelfCheckResult({ result, cyclical, flaggedSafety, onRestart }: Props) {
  const { classification, detail } = result;

  const aura =
    classification === "pmdd"
      ? { mood: 0.24, energy: 0.72, turbulence: 0.82 }
      : classification === "moderate-severe-pms"
        ? { mood: 0.44, energy: 0.6, turbulence: 0.55 }
        : { mood: 0.68, energy: 0.5, turbulence: 0.3 };

  const headline =
    classification === "pmdd"
      ? "What you described lines up closely with PMDD."
      : classification === "moderate-severe-pms"
        ? "What you described lines up with moderate to severe PMS."
        : "What you described didn't reach the screening thresholds today.";

  return (
    <div className="ori-page-in">
      <div className="flex flex-col items-center text-center">
        <Aura input={aura} seed={91} className="h-40 w-40 md:h-48 md:w-48" decorative />

        <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Your answers, read back to you
        </p>

        <h3 className="ori-hand mt-3 max-w-[24ch] text-[1.5rem] text-ink md:text-[1.8rem]">
          {headline}
        </h3>

        <p className="mt-5 max-w-[46ch] text-[1.05rem] leading-relaxed text-ink-soft">
          {classification === "below-threshold"
            ? "That is not the same as nothing being wrong."
            : "That is not a diagnosis. It is a screening result — and it is worth taking to a doctor."}
        </p>
      </div>

      {/* What the answers actually showed. Plain arithmetic, shown openly. */}
      <div className="ori-paper-card mx-auto mt-10 max-w-[38rem] p-6 md:p-7">
        <h4 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          How that was worked out
        </h4>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">
          The PSST looks for three things at once. Here is what your answers did and
          didn&rsquo;t meet — the whole rule, nothing hidden.
        </p>
        <ul className="mt-5 space-y-3">
          {result.metConditions.map((c) => (
            <li key={c} className="flex gap-3 text-[0.98rem] leading-relaxed text-ink">
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-leaf-deep">
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d="M4 10.6 8.2 15 16 5.6" />
                </svg>
              </span>
              <span><span className="sr-only">Met: </span>{c}</span>
            </li>
          ))}
          {result.unmetConditions.map((c) => (
            <li key={c} className="flex gap-3 text-[0.98rem] leading-relaxed text-ink-soft">
              <span aria-hidden="true" className="mt-0.5 shrink-0">
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M4.5 10h11" />
                </svg>
              </span>
              <span><span className="sr-only">Not met: </span>{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-[var(--hairline)] pt-4 text-[0.9rem] leading-relaxed text-ink-soft">
          You marked {detail.moderatePlusCount} of 14 symptoms as moderate or severe.
          The PSST classifies on the pattern above, not on a total score.
        </p>
      </div>

      {/* Timing matters as much as severity. */}
      {cyclical !== "yes" ? (
        <div className="ori-paper-card mx-auto mt-5 max-w-[38rem] border-l-[3px] border-l-[var(--ochre)] p-6">
          <h4 className="text-[1.05rem] font-semibold text-ink">One thing worth knowing about timing</h4>
          <p className="mt-2.5 text-[0.98rem] leading-relaxed text-ink-soft">
            {cyclical === "no"
              ? "You said these don't clear up after your period starts. That matters. PMDD is defined by the pattern — bad in the week or two before, gone within a few days of bleeding. When symptoms stay all month but get sharply worse premenstrually, that's often called PME: premenstrual exacerbation of something else that's already there. It's real, it's common, and it's treated differently. Worth naming to a doctor exactly that way."
              : "You weren't sure whether these clear up after your period starts — which is completely normal, because almost nobody tracks it until someone asks. That timing is the single thing that separates PMDD from everything else it looks like. Two months of daily notes will answer it."}
          </p>
        </div>
      ) : null}

      {/* What PMDD is, for the people who just found the word. */}
      {classification !== "below-threshold" ? (
        <div className="mx-auto mt-10 max-w-[38rem]">
          <h4 className="font-[family-name:var(--font-display)] text-[1.5rem] leading-tight text-ink">
            What PMDD actually is
          </h4>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">
            Premenstrual dysphoric disorder is a cyclical mood disorder tied to the luteal
            phase &mdash; the week or two after ovulation and before your period. It is not
            a hormone imbalance; the current understanding is a sensitivity to the normal
            rise and fall of hormones. It is in the DSM-5. It affects somewhere around
            3&ndash;8% of people who menstruate. It is not PMS with the volume turned up,
            and it is not a personality problem.
          </p>
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-[38rem]">
          <h4 className="font-[family-name:var(--font-display)] text-[1.5rem] leading-tight text-ink">
            Why this might not have caught it
          </h4>
          <ul className="mt-3 space-y-2.5 text-[1.02rem] leading-relaxed text-ink-soft">
            <li>&mdash; Cycles differ. One month is not the pattern.</li>
            <li>&mdash; Where you are right now changes your answers. A screener taken in a good week reads like a good week.</li>
            <li>&mdash; The PSST is deliberately strict, so it under-calls rather than over-calls.</li>
          </ul>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">
            If you know something is wrong, you are still right. Two months of daily notes
            will show a pattern this screener can&rsquo;t.
          </p>
        </div>
      )}

      {/* The next step — the useful part, app or no app. */}
      <div className="mx-auto mt-10 max-w-[38rem]">
        <h4 className="font-[family-name:var(--font-display)] text-[1.5rem] leading-tight text-ink">
          What to do with this
        </h4>
        <ol className="mt-4 space-y-4">
          {[
            {
              t: "Start a daily record today, not next cycle.",
              b: "Rate your mood and your worst few symptoms once a day, and mark the days you bleed. Two full cycles is what a diagnosis needs. Paper is fine. A note on your phone is fine.",
            },
            {
              t: "Book the appointment before you feel better.",
              b: "The follicular phase is when you feel fine and stop believing yourself. Book it while you still remember what this week was like.",
            },
            {
              t: "Bring the record, and say the timing out loud.",
              b: "“These symptoms start about ten days before my period and are gone within two days of bleeding. Here are two cycles of daily records.” That sentence changes the conversation.",
            },
          ].map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <span aria-hidden="true" className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--paper-raised)] text-[0.9rem] font-semibold text-ink">
                {i + 1}
              </span>
              <div>
                <p className="text-[1.02rem] font-semibold text-ink">{s.t}</p>
                <p className="mt-1 text-[1rem] leading-relaxed text-ink-soft">{s.b}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6">
          <Link href="#believed" className="text-ink underline decoration-[var(--hairline)] underline-offset-4">
            How to have that conversation, in more detail
          </Link>
        </p>
      </div>

      {flaggedSafety ? (
        <p className="mx-auto mt-8 max-w-[38rem] rounded-[16px] border-2 border-[var(--ink)] bg-[var(--paper-raised)] p-5 text-[1rem] leading-relaxed text-ink">
          You told us earlier that you&rsquo;ve been having thoughts of harming yourself. That
          part matters more than any of the rest of this page.{" "}
          <Link href="/crisis" className="font-semibold text-ink underline underline-offset-4">
            The numbers are here
          </Link>
          , and they are free.
        </p>
      ) : null}

      <div className="mx-auto mt-10 max-w-[38rem] border-t border-[var(--hairline)] pt-6">
        <p className="text-[0.88rem] leading-relaxed text-ink-soft">
          Educational only. This is a screening questionnaire, not a medical device and not
          a diagnosis. Questions and scoring from the PSST: {PSST_CITATION}{" "}
          <a href={PSST_CITATION_URL} rel="noopener noreferrer" target="_blank" className="text-ink underline decoration-[var(--hairline)] underline-offset-4">
            View the paper
          </a>
          .
        </p>
        <p className="mt-4 text-[0.88rem] text-ink-soft">
          This result was worked out in your browser and was never sent anywhere. Close the
          tab and it is gone &mdash; so if you want it, screenshot it now.
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-6 min-h-11 rounded-full border border-[var(--hairline)] px-6 text-[0.98rem] text-ink transition-colors hover:bg-[var(--well)]"
        >
          Start the questions again
        </button>
      </div>
    </div>
  );
}
