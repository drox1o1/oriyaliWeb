import Image from "next/image";
import Link from "next/link";
import { Monogram } from "@/components/Monogram";

/**
 * The full-screen opening.
 *
 * The drawing runs edge to edge and the type sits in its sky. Contrast is held
 * by a warm-paper wash across the left — measured against the artwork itself,
 * not guessed: over the darkest sky `--ink` reads at 5.5:1 and over a white
 * cloud at 10:1, so the type is legible wherever it lands. A dark scrim with
 * light type was the other option and needed to be so heavy it drowned the
 * picture.
 */
export function Hero() {
  // Top-anchored, not vertically centred. Centring means the block re-centres
  // when the display webfont swaps in and the text block changes height —
  // measured as 0.08 CLS. Anchored to the top, the swap grows the block
  // downward from a fixed point and nothing above it moves.
  return (
    <section className="relative isolate flex min-h-[86svh] items-start overflow-hidden md:min-h-[calc(100svh-4rem)]">
      <Image
        src="/illustrations/header.png"
        alt=""
        fill
        priority
        quality={78}
        sizes="100vw"
        className="-z-20 object-cover object-[68%_center] md:object-[center_38%]"
      />

      {/* The paper washes in from the left, so the type has ground to stand on
          and the picture stays open on the right where she is. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "var(--hero-wash)" }}
      />
      {/* A last breath of paper at the very bottom, so the hero hands over to
          the page instead of stopping on a hard edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-32"
        style={{ background: "linear-gradient(to bottom, transparent, var(--paper))" }}
      />

      <div className="ori-grid w-full pb-20 pt-[clamp(3.5rem,15vh,9rem)] md:pb-24">
        <div className="col-span-full md:col-[rail-start/body-end]">
          <p className="ori-kicker flex items-center gap-2.5 text-ink">
            <Monogram className="h-4 w-auto" />
            Oriyali &middot; a PMDD companion
          </p>

          <h1 className="ori-display mt-6 max-w-[15ch] text-ink">
            See your next hard week{" "}
            <span
              className="italic"
              style={{ fontFamily: "var(--font-display-italic)", color: "var(--bloom-ink)" }}
            >
              before it arrives.
            </span>
          </h1>

          <p className="ori-copy mt-7 max-w-[44ch] text-[1.06rem] text-ink">
            For one or two weeks a month you stop being yourself, and then you&rsquo;re fine, and
            then it comes back. This is a private place to work out whether that fortnight has
            a name &mdash; and an iPhone app that helps you prove it to a doctor.
          </p>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            <Link
              href="#self-check"
              className="inline-flex min-h-[54px] items-center gap-3 rounded-full bg-[var(--ink)] px-7 text-[1.02rem] font-semibold text-[var(--paper)] no-underline transition-opacity hover:opacity-90"
            >
              Start the questions
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3.5v13M4.5 11.5 10 17l5.5-5.5" />
              </svg>
            </Link>
            <Link
              href="#cycle"
              className="inline-flex min-h-[54px] items-center rounded-full border-[1.5px] border-[var(--ink)] bg-[color-mix(in_srgb,var(--paper)_70%,transparent)] px-6 text-[1.02rem] text-ink no-underline backdrop-blur-[2px] transition-colors hover:bg-[var(--paper)]"
            >
              See how a month moves
            </Link>
          </div>

          <p className="mt-5 text-[0.9rem] text-ink">
            Four minutes &middot; nothing you answer leaves your device
          </p>
        </div>
      </div>
    </section>
  );
}
