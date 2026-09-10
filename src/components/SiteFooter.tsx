import Image from "next/image";
import Link from "next/link";
import { BrandLockup } from "./BrandLockup";

const EXPERIENCE = [
  ["/#pattern", "The pattern"],
  ["/#cycle", "Your cycle"],
  ["/#self-check", "The self-check"],
  ["/#record", "The record"],
  ["/#aura", "The daily check-in"],
];

const READING = [
  ["/manifesto", "Why I’m building this"],
  ["/faq", "Questions"],
  ["/for-partners", "For partners"],
  ["/privacy", "Privacy"],
];

export function SiteFooter() {
  return (
    <footer className="site-footer mt-24">
      {/* The closing image, full width and full height. */}
      <div className="site-footer__plate">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/illustrations/footer.png"
            alt=""
            fill
            quality={78}
            sizes="100vw"
            data-parallax="sky"
            className="object-cover object-[38%_center] md:object-center"
          />
        </div>

        <div className="ori-grid w-full py-12 md:py-16">
          <div className="col-wide md:col-[rail-start/body-end]">
            <div className="site-footer__note" data-reveal="figure">
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

      <div className="mx-auto w-full max-w-[76rem] px-[clamp(1.25rem,5vw,2rem)] py-14">
        {/* The calm crisis link. Always here, on every page. */}
        <Link href="/crisis" className="site-footer__crisis mb-14" data-reveal="rise">
          <span className="flex flex-col gap-1">
            <span className="text-[1.05rem] font-semibold text-ink">
              If you&rsquo;re struggling right now
            </span>
            <span className="text-[0.95rem] leading-relaxed text-ink-soft">
              Phone numbers for India, the US, the UK and Ireland, and everywhere else
              &mdash; on one plain page.
            </span>
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3.5 10h13M11 4.5 16.5 10 11 15.5" />
          </svg>
        </Link>

        <div className="grid gap-x-8 gap-y-11 sm:grid-cols-2 md:grid-cols-4" data-reveal="stagger">
          <div className="sm:col-span-2 md:col-span-1">
            <p className="ori-hand text-[1.15rem] text-[var(--bloom-ink)]">Oriyali</p>
            <p className="mt-3 max-w-[26rem] text-[0.95rem] leading-relaxed text-ink-soft">
              A PMDD companion for iPhone, built by one person. Local-first, and never for
              sale.
            </p>
          </div>

          <nav className="site-footer__nav" aria-label="The experience">
            <h2>The experience</h2>
            <ul>
              {EXPERIENCE.map(([href, label]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="site-footer__nav" aria-label="Reading">
            <h2>Reading</h2>
            <ul>
              {READING.map(([href, label]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="site-footer__nav" aria-label="Elsewhere">
            <h2>Elsewhere</h2>
            <ul>
              <li>
                <a href="https://iapmd.org" rel="noopener noreferrer" target="_blank">
                  IAPMD
                </a>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
              <li>
                <a href="mailto:hello@oriyali.com">hello@oriyali.com</a>
              </li>
            </ul>
          </nav>
        </div>

        {/* The sign-off. */}
        <div className="mt-16 border-t border-[var(--hairline)]">
          <BrandLockup />
        </div>

        <div className="border-t border-[var(--hairline)] pt-6">
          <p className="max-w-[46rem] text-[0.87rem] leading-relaxed text-ink-soft">
            Everything here is educational. It is not a medical device, and nothing on this
            site is a diagnosis. Screening tools point at something worth looking into &mdash;
            only a clinician can diagnose PMDD, and doing it properly takes two cycles of
            daily records.
          </p>
          <p className="mt-4 max-w-[46rem] text-[0.87rem] leading-relaxed text-ink-soft">
            Screening questions from the PSST (Steiner, Macdougall &amp; Brown, 2003).
            Premenstrual disorder guidance from{" "}
            <a
              href="https://iapmd.org"
              className="text-ink underline decoration-[var(--hairline)] underline-offset-4"
              rel="noopener noreferrer"
              target="_blank"
            >
              IAPMD
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
