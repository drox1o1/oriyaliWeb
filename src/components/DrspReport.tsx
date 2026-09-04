/**
 * A DRSP-style report mock — the one screen that deliberately drops the warmth.
 *
 * The audience isn't the user. It's a clinician who has, in her experience,
 * dismissed her before. So: crisp, clean, well-structured, quietly
 * authoritative. Clinical-clean, not clinical-ugly. A trace of the brand
 * survives in the header; the body is all clarity.
 *
 * The Daily Record of Severity of Problems (DRSP) is the daily instrument a
 * DSM-5 PMDD diagnosis is built on — two cycles of it. Severity is rated 1–6.
 * The numbers below are an illustration of the format, not anyone's data.
 */

const ITEMS = [
  "Depressed, hopeless",
  "Anxious, on edge",
  "Mood swings, sensitive",
  "Angry, irritable",
  "Less interest in activities",
  "Difficulty concentrating",
];

/* Illustrative pattern: quiet through the follicular phase, climbing across the
   luteal, and dropping the day bleeding starts. 28 days, severity 1–6. */
const GRID: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,2,3,3,4,4,5,5,6,6,5,2,1],
  [1,1,1,1,1,1,1,2,1,1,1,1,2,2,2,2,3,3,4,4,5,5,6,6,5,4,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3,3,4,4,5,5,5,6,5,5,4,1,1],
  [2,1,1,1,1,1,1,1,1,1,2,2,2,3,3,3,4,4,5,5,6,6,6,6,5,4,2,1],
  [2,2,1,1,1,1,1,1,1,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,4,4,2,1],
  [2,1,1,1,1,1,1,1,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,5,4,3,2,1],
];

const SHADES = ["#FFFFFF", "#EFF4F8", "#D8E5EF", "#B4CDE0", "#8AB0CB", "#5D8FB4", "#2F5D7C"];
const SEVERITY_WORDS = ["", "Not at all", "Minimal", "Mild", "Moderate", "Severe", "Extreme"];

export function DrspReport() {
  return (
    <figure className="m-0">
      <div className="ori-scroll-x rounded-[14px] border border-[var(--drsp-line)] bg-drsp-bg" style={{ colorScheme: "light" }}>
        <div className="min-w-[42rem] p-6 md:p-8">
          {/* Header — the one trace of the brand. */}
          <header className="flex items-start justify-between gap-6 border-b-2 border-drsp-accent pb-4">
            <div>
              <h3 className="text-[1.28rem] font-semibold tracking-[-0.01em] text-drsp-ink">
                Daily Record of Severity of Problems
              </h3>
              <p className="mt-1 text-[0.86rem] text-drsp-soft">
                Two consecutive cycles &middot; prospective daily ratings &middot; severity 1&ndash;6
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-drsp-accent">
                Oriyali
              </p>
              <p className="mt-0.5 text-[0.78rem] text-drsp-soft">Cycle 2 of 2</p>
            </div>
          </header>

          <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2 text-[0.86rem] sm:grid-cols-4">
            {[
              ["Cycle length", "28 days"],
              ["Menses onset", "Day 27"],
              ["Days recorded", "28 of 28"],
              ["Ratings missed", "None"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-drsp-soft">{k}</dt>
                <dd className="mt-0.5 font-semibold text-drsp-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[0.86rem] leading-relaxed text-drsp-soft">
            Daily symptom severity across one 28-day cycle. Each of six symptoms is rated
            1&ndash;6 every day. Severity stays near 1 through the follicular phase, climbs
            steadily from about day 15, peaks at 5&ndash;6 across days 21&ndash;26, and drops
            back to 1 on day 27, when bleeding starts. That shape is the diagnosis.
          </p>

          <table className="mt-4 w-full border-collapse text-[0.78rem]" aria-hidden="true">
            <thead>
              <tr>
                <th scope="col" className="w-[13rem] pb-2 pr-3 text-left font-semibold text-drsp-soft">
                  Symptom
                </th>
                {Array.from({ length: 28 }, (_, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="pb-2 text-center text-[0.62rem] font-medium text-drsp-soft"
                  >
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((item, r) => (
                <tr key={item}>
                  <th scope="row" className="border-t border-drsp-line py-1.5 pr-3 text-left font-normal text-drsp-ink">
                    {item}
                  </th>
                  {GRID[r].map((v, c) => (
                    <td key={c} className="border-t border-drsp-line p-0">
                      <span
                        className="mx-auto block h-6 w-full border border-white"
                        style={{ background: SHADES[v] }}
                        title={`Day ${c + 1}: ${SEVERITY_WORDS[v]} (${v})`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* The read a clinician actually wants. */}
          <div className="mt-6 grid gap-4 border-t border-drsp-line pt-5 sm:grid-cols-3">
            {[
              ["Follicular mean (days 4–10)", "1.1"],
              ["Late luteal mean (days 21–26)", "5.0"],
              ["Change, luteal vs follicular", "+355%"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[0.8rem] text-drsp-soft">{k}</p>
                <p className="mt-1 text-[1.5rem] font-semibold leading-none text-drsp-ink">{v}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 border-t border-drsp-line pt-4 text-[0.8rem] leading-relaxed text-drsp-soft">
            Prepared from the patient&rsquo;s own prospective daily ratings. Educational summary
            only &mdash; not a diagnostic instrument and not a medical device. Diagnosis of PMDD
            per DSM-5 requires clinician assessment alongside a minimum of two cycles of
            prospective daily ratings.
          </p>
        </div>
      </div>
      <figcaption className="mt-4 text-[0.92rem] leading-relaxed text-ink-soft">
        An illustration of the format, with sample data. This is what &ldquo;proof&rdquo; looks like
        in a consultation: a pattern, dated, recorded before the fact rather than remembered
        after it.
      </figcaption>
    </figure>
  );
}
