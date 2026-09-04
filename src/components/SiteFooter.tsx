import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--hairline)] bg-[var(--paper-deep)]">
      {/* The closing image, full width and full height.

          The type sits on a piece of paper resting on the picture rather than
          in a wash over it: measured against the artwork, a scrim heavy enough
          to carry text here needed ~50% opacity, which drowns a watercolour.
          A paper panel keeps the picture at full strength and the words at
          5.5:1 or better. */}
      <div className="relative isolate flex min-h-[70svh] items-end overflow-hidden border-b border-[var(--hairline)] md:min-h-[80svh]">
        <Image
          src="/illustrations/footer.png"
          alt=""
          fill
          quality={78}
          sizes="100vw"
          className="-z-10 object-cover object-[38%_center] md:object-center"
        />

        <div className="ori-grid w-full py-12 md:py-16">
          <div className="col-span-full md:col-[rail-start/body-end]">
            <div className="ori-hand-radius max-w-[34rem] border-[1.5px] border-[var(--hairline)] bg-[color-mix(in_srgb,var(--paper)_94%,transparent)] p-7 backdrop-blur-[3px] md:p-9">
              <p className="ori-kicker">A gentle reminder</p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-[1.8rem] font-light leading-snug text-ink md:text-[2.2rem]">
                Every cycle has an end.{" "}
                <span
                  className="italic"
                  style={{ fontFamily: "var(--font-display-italic)", color: "var(--bloom-ink)" }}
                >
                  This part passes.
                </span>
              </h2>
              <p className="ori-copy mt-4 text-[1rem]">
                Keep taking note of your days. Two cycles of them can change every conversation
                you have with a doctor.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[76rem] px-5 py-14 md:px-8">
        {/* The calm crisis link. Always here, on every page. */}
        <Link
          href="/crisis"
          className="mb-12 flex flex-col gap-1 rounded-[18px] border-2 border-[var(--ink)] bg-[var(--paper-raised)] px-6 py-5 no-underline transition-colors hover:bg-[var(--well)]"
        >
          <span className="text-[1.05rem] font-semibold text-ink">
            If you&rsquo;re struggling right now
          </span>
          <span className="text-[0.95rem] text-ink-soft">
            Phone numbers for India, the US, the UK and Ireland, and everywhere else &mdash; on one plain page.
          </span>
        </Link>

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <Wordmark className="text-ink" />
            <p className="mt-4 max-w-[26rem] text-[0.95rem] leading-relaxed text-ink-soft">
              A PMDD companion for iPhone, built by one person. Local-first, and never for sale.
            </p>
          </div>

          <nav aria-label="The experience">
            <h2 className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              The experience
            </h2>
            <ul className="space-y-1 text-[0.95rem]">
              <li><Link href="/#self-check" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink">The self-check</Link></li>
              <li><Link href="/#aura" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink">Try the aura</Link></li>
              <li><Link href="/#cycle" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink">Your cycle</Link></li>
              <li><Link href="/#believed" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink">Getting believed</Link></li>
            </ul>
          </nav>

          <nav aria-label="Reading">
            <h2 className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Reading
            </h2>
            <ul className="space-y-1 text-[0.95rem]">
              <li><Link href="/manifesto" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink">Why I&rsquo;m building this</Link></li>
              <li><Link href="/faq" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink">Questions</Link></li>
              <li><Link href="/for-partners" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink">For partners</Link></li>
              <li><Link href="/privacy" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink">Privacy</Link></li>
            </ul>
          </nav>

          <nav aria-label="Elsewhere">
            <h2 className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Elsewhere
            </h2>
            <ul className="space-y-1 text-[0.95rem]">
              <li>
                <a href="https://iapmd.org" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink" rel="noopener noreferrer" target="_blank">
                  IAPMD
                </a>
              </li>
              <li><Link href="/terms" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink">Terms</Link></li>
              <li>
                <a href="mailto:hello@oriyali.com" className="inline-block py-1.5 text-ink-soft no-underline hover:text-ink">
                  hello@oriyali.com
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-[var(--hairline)] pt-6">
          <p className="max-w-[46rem] text-[0.87rem] leading-relaxed text-ink-soft">
            Everything here is educational. It is not a medical device, and nothing on this
            site is a diagnosis. Screening tools point at something worth looking into &mdash;
            only a clinician can diagnose PMDD, and doing it properly takes two cycles of
            daily records.
          </p>
          <p className="mt-4 text-[0.87rem] text-ink-soft">
            Screening questions from the PSST (Steiner, Macdougall &amp; Brown, 2003). Premenstrual
            disorder guidance from{" "}
            <a href="https://iapmd.org" className="text-ink underline decoration-[var(--hairline)] underline-offset-4" rel="noopener noreferrer" target="_blank">
              IAPMD
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
