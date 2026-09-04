import { CRISIS_RESOURCES, IAPMD_SUPPORT } from "@/lib/crisis";

/**
 * The one place the soft aesthetic deliberately breaks.
 *
 * High contrast, plain layout, obvious actions, no decorative motion, no aura,
 * nothing soft to get lost in. The break is the message: this experience knows
 * the difference between a hard day and an emergency.
 *
 * Static markup — it works with JavaScript disabled and with Reduce Motion on,
 * because that is exactly when it must not fail.
 */
export function CrisisBlock({
  heading,
  lead,
  /** h1 when this block is the page; h2 when it is surfaced inside the self-check. */
  level = "h2",
}: {
  heading?: string;
  lead?: string;
  level?: "h1" | "h2";
}) {
  const Heading = level;
  return (
    <section
      aria-labelledby="crisis-heading"
      className="bg-crisis-bg text-crisis-ink"
      style={{ colorScheme: "dark" }}
    >
      <div className="mx-auto w-full max-w-[52rem] px-5 py-14 md:px-8 md:py-16">
        <Heading id="crisis-heading" className="text-[1.6rem] font-semibold leading-tight md:text-[1.85rem]">
          {heading ?? "If you are thinking about ending your life, talk to someone now."}
        </Heading>

        <p className="mt-4 max-w-[38rem] text-[1.05rem] leading-relaxed text-crisis-soft">
          {lead ??
            "These are free, they are confidential, and the people answering have heard this before. You do not have to be certain, and you do not have to explain it well."}
        </p>

        <ul className="mt-9 space-y-0 border-t border-crisis-line">
          {CRISIS_RESOURCES.map((r) => (
            <li
              key={`${r.region}-${r.name}`}
              className="flex flex-col gap-2 border-b border-crisis-line py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <div className="min-w-0">
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-crisis-soft">
                  {r.region}
                </p>
                <p className="mt-1 text-[1.08rem] font-semibold">{r.name}</p>
                {r.note ? (
                  <p className="mt-1 max-w-[34rem] text-[0.95rem] leading-relaxed text-crisis-soft">{r.note}</p>
                ) : null}
                <p className="mt-1 text-[0.9rem] text-crisis-soft">{r.hours}</p>
              </div>

              <div className="shrink-0">
                {r.href ? (
                  <a
                    href={r.href}
                    rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    target={r.href.startsWith("http") ? "_blank" : undefined}
                    className="inline-block rounded-md border-2 border-white bg-white px-5 py-3 text-[1.15rem] font-bold text-crisis-bg no-underline hover:bg-crisis-bg hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                  >
                    {r.contact}
                  </a>
                ) : (
                  <span className="text-[1.15rem] font-bold">{r.contact}</span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-9 border border-crisis-line p-5">
          <p className="text-[1rem] font-semibold">{IAPMD_SUPPORT.full}</p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-crisis-soft">{IAPMD_SUPPORT.note}</p>
          <a
            href={IAPMD_SUPPORT.href}
            rel="noopener noreferrer"
            target="_blank"
            className="mt-3 inline-block font-semibold text-white underline underline-offset-4"
          >
            iapmd.org
          </a>
        </div>

        <p className="mt-8 text-[0.92rem] leading-relaxed text-crisis-soft">
          If someone is in immediate physical danger, call your local emergency number.
          This site cannot contact anyone for you &mdash; nothing you type here is sent anywhere.
        </p>
      </div>
    </section>
  );
}
