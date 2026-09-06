import Image from "next/image";
import Link from "next/link";

const IMAGE = "-z-20 object-cover object-[68%_center] md:object-[center_38%]";

/**
 * The full-screen opening.
 *
 * Two skies: a day one and a night one, swapped with the theme rather than
 * dimmed, because a daylight photograph dimmed to 25% is neither daylight nor
 * night. Behind the type is a soft ellipse of paper — light falling on the
 * page rather than a curtain drawn across the picture.
 *
 * Contrast was measured against the artwork itself. The daylight sky is
 * mid-toned, which is the hardest possible ground, so the hero carries a
 * slightly deeper ink (`--hero-ink`); that lets the field stay at 48% and
 * still read 5.3:1 across 99.9% of the text area.
 */
export function Hero() {
  // Top-anchored, not vertically centred: centring makes the whole block
  // re-centre when the display webfont swaps, which measured as 0.08 CLS.
  return (
    <section
      data-hero
      className="ori-under-masthead relative isolate flex min-h-[100svh] items-start overflow-hidden"
    >
      <Image
        src="/illustrations/header.png"
        alt=""
        fill
        priority
        quality={78}
        sizes="100vw"
        className={`hero-day ${IMAGE}`}
      />
      <Image
        src="/illustrations/header-dark.png"
        alt=""
        fill
        /* Both skies are prioritised: which one is visible depends on the
           theme, which the server cannot know, so preloading only one leaves
           half of all visitors waiting on a lazy hero. */
        priority
        quality={78}
        sizes="100vw"
        className={`hero-night ${IMAGE}`}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "var(--hero-field)" }}
      />
      {/* A last breath of paper at the foot, so the hero hands over to the
          page instead of stopping on a hard edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-28"
        style={{ background: "linear-gradient(to bottom, transparent, var(--paper))" }}
      />

      <div className="ori-grid w-full pb-[clamp(4rem,14vh,8rem)] pt-[calc(var(--masthead)+clamp(2rem,8vh,5rem))]">
        <div
          className="col-wide md:col-[rail-start/body-end]"
          style={{ color: "var(--hero-ink)" }}
        >
          {/* The opening line is written, not set — the same hand as the
              wordmark above it, so the first thing the page does is speak
              rather than announce. */}
          <h1 className="ori-display max-w-[13ch]" style={{ color: "inherit" }}>
            See your next hard week before it arrives.
          </h1>

          <p
            className="mt-8 max-w-[38ch] text-[1.08rem] leading-[1.6]"
            style={{ color: "inherit" }}
          >
            For a fortnight each month you stop being yourself. Then you&rsquo;re fine, and
            then it comes back.
          </p>

          {/* Into the argument, not past it. The page below is one story in
              three parts, and the button that opens it should say so — the
              self-check is a stop along the way, not the door. */}
          <div className="mt-9">
            <Link
              href="#why"
              className="inline-flex min-h-[54px] items-center gap-3 rounded-full bg-[var(--ink)] px-8 text-[1.02rem] font-semibold text-[var(--paper)] no-underline transition-opacity hover:opacity-90"
            >
              Start here
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3.5v13M4.5 11.5 10 17l5.5-5.5" />
              </svg>
            </Link>
          </div>

          <p className="mt-5 text-[0.9rem]" style={{ color: "inherit" }}>
            Nothing you do here leaves your device.
          </p>
        </div>
      </div>
    </section>
  );
}
