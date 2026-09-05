import Link from "next/link";
import { BotanicalAura } from "@/components/BotanicalAura";
import { AuraTaste } from "@/components/AuraTaste";
import { CycleExplainer } from "@/components/CycleExplainer";
import { DrspReport } from "@/components/DrspReport";
import { SelfCheck } from "@/components/SelfCheck";
import { Waitlist } from "@/components/Waitlist";
import { PullQuote, SectionHead, Sidenote } from "@/components/Editorial";
import { Reveal } from "@/components/motion/Reveal";
import { HandUnderline } from "@/components/Illustrations";
import { Illustration } from "@/components/Illustration";
import { RESTING_AURA } from "@/lib/aura";
import { StructuredData } from "@/components/StructuredData";
import { Hero } from "@/components/Hero";
import { RecordSketch } from "@/components/RecordSketch";

/**
 * One continuous spread. Every section sits on the same four-column grid —
 * rail, body, aside — so the eye moves left to right and down, instead of
 * scrolling through one long column.
 */
export default function Home() {
  return (
    <>
      <StructuredData />
      <Hero />

      {/* ── 01 · The pattern ───────────────────────────────── */}
      <section className="ori-grid gap-y-10 pb-20 pt-16 md:gap-y-12 md:pb-24 md:pt-20">
        <div className="col-rail flex items-baseline gap-4 md:block">
          <p className="ori-numeral" aria-hidden="true">01</p>
          <p className="ori-kicker mt-2 md:mt-3">The pattern</p>
        </div>

        <h2 className="ori-display col-main text-ink">
          For one or two weeks a month, you stop being yourself.{" "}
          <span className="text-ink-soft">Then you&rsquo;re fine again.</span>{" "}
          Then it comes back.
        </h2>

        <Sidenote hand className="col-rail self-start md:pt-2">
          You&rsquo;re not imagining it. Let&rsquo;s look, together &mdash; privately.
          <HandUnderline className="mt-1 hidden h-2 w-[76%] text-[var(--bloom)] md:block" />
        </Sidenote>

        <div className="col-body">
          <p className="ori-copy ori-justify ori-dropcap text-[1.06rem]">
            The fuse that&rsquo;s suddenly an inch long. The fog that makes you read the same
            sentence four times. Crying at something that wouldn&rsquo;t have touched you a week
            ago, then watching it all lift the day you start bleeding &mdash; and wondering
            whether you invented the whole thing. Somewhere in there, someone told you it was
            just PMS.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="#self-check"
              className="inline-flex min-h-[54px] items-center gap-3 rounded-full border-[1.5px] border-[var(--ink)] px-7 text-[1.02rem] text-ink no-underline transition-colors hover:bg-[var(--well)]"
            >
              Start with a few quiet questions
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3.5v13M4.5 11.5 10 17l5.5-5.5" />
              </svg>
            </Link>
            <p className="text-[0.9rem] text-ink-soft">
              Four minutes.<br className="hidden sm:block" /> Nothing you answer leaves your device.
            </p>
          </div>
        </div>

        <div className="col-aside self-start md:-mt-6">
          <BotanicalAura
            input={RESTING_AURA}
            className="mx-auto block h-56 w-56 sm:h-72 sm:w-72 md:mx-0 md:h-auto md:w-full"
          />
        </div>
      </section>

      {/* ── 02 · The self-check ────────────────────────────── */}
      <section
        id="self-check"
        className="ori-grid scroll-mt-20 gap-y-10 border-t border-[var(--hairline)] bg-[var(--paper-deep)] py-20 md:py-28"
      >
        <SectionHead
          n="02"
          kicker="The self-check"
          title={<>The questions a doctor would ask, without having to get the appointment first.</>}
          deck={
            <>
              This is the PSST &mdash; a published screening tool for premenstrual disorders,
              reproduced here as written. It won&rsquo;t diagnose you; nothing can, in four minutes.
            </>
          }
        />

        <Sidenote className="col-rail md:pt-2">
          Steiner, Macdougall &amp; Brown, <em>Archives of Women&rsquo;s Mental Health</em>, 2003.
          Fourteen symptom items, five interference items, and the published scoring rule &mdash;
          nothing invented, nothing re-weighted.
        </Sidenote>

        <div className="col-body">
          <p className="ori-copy ori-justify">
            What it will do is tell you whether what you live through each month is the kind of
            thing this instrument was built to catch, and give you language for it.
          </p>
        </div>

        <Reveal className="col-wide mt-4" y={20}>
          <SelfCheck />
        </Reveal>
      </section>

      {/* ── 03 · The check-in ──────────────────────────────── */}
      <section id="aura" className="ori-grid scroll-mt-20 gap-y-10 py-20 md:py-28">
        <div className="col-rail flex items-baseline gap-4 md:block">
          <p className="ori-numeral" aria-hidden="true">03</p>
          <p className="ori-kicker mt-2 md:mt-3">The check-in</p>
        </div>
        <div className="col-main">
          <div className="ori-folio mb-7" aria-hidden="true" />
        </div>
        <Reveal className="col-wide" y={20}>
          <AuraTaste />
        </Reveal>
      </section>

      {/* ── 04 · Your cycle ────────────────────────────────── */}
      <section
        id="cycle"
        className="scroll-mt-20 border-t border-[var(--hairline)] pb-24 pt-20 md:pb-32 md:pt-28"
      >
        <div className="ori-grid gap-y-10">
          <SectionHead
            n="04"
            kicker="Your cycle"
            title="A month, told as a single day."
            deck={
              <>
                Your cycle isn&rsquo;t one weather system, it&rsquo;s five. Most people are never taught
                which one they&rsquo;re standing in, which is why the hard days feel like they arrive
                out of nowhere.
              </>
            }
          />
          <div className="col-body">
            <p className="ori-copy ori-justify">
              They don&rsquo;t. They arrive on a schedule &mdash; and a schedule is something you can
              plan around. Scroll, and watch the light move.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <CycleExplainer />
        </div>
      </section>

      {/* ── 05 · Getting believed ──────────────────────────── */}
      <section
        id="believed"
        className="ori-grid scroll-mt-20 gap-y-10 border-t border-[var(--hairline)] bg-[var(--paper-deep)] py-20 md:py-28"
      >
        <SectionHead
          n="05"
          kicker="Getting believed"
          title="Why a record is the thing that finally works."
        />

        <div className="col-body self-center">
          <RecordSketch variant="journal" />
        </div>

        <Sidenote className="col-aside self-start md:mt-2 md:border-l md:border-[var(--hairline)] md:pl-5">
          <span className="ori-kicker mb-2 block">Sources</span>
          Diagnosis delay: IAPMD Global Survey of Premenstrual Disorders &mdash; survey data,
          not a clinical trial.
          <br />
          <br />
          Self-injury: Eisenlohr-Moul et al., <em>BMC Psychiatry</em>, 2022 (n&nbsp;=&nbsp;599,
          prospectively confirmed PMDD).
        </Sidenote>

        <div className="col-body">
          <p className="ori-copy ori-justify ori-dropcap">
            IAPMD&rsquo;s global survey of people with premenstrual disorders puts the average wait
            for an accurate PMDD diagnosis at around twelve years. Twelve years is not a story
            about incompetent doctors. It&rsquo;s a story about evidence: you turn up in the
            follicular phase, feeling fine, describing a fortnight you can barely remember, and
            there is nothing in the room to look at except you saying it.
          </p>

          <PullQuote>
            There is nothing in the room to look at except you, saying it.
          </PullQuote>

          <p className="ori-copy ori-justify">
            The waiting is not harmless. In a 2022 study of 599 people with prospectively
            confirmed PMDD, 34% reported having attempted suicide. We&rsquo;re stating that plainly
            and once, because it is the reason the wait matters. If that is where you are right
            now,{" "}
            <Link href="/crisis" className="text-ink underline decoration-[var(--hairline)] underline-offset-4">
              there are numbers here
            </Link>
            .
          </p>

          <p className="ori-copy ori-justify mt-5">
            <span className="ori-runin">What changes the conversation</span> is a daily record
            kept before the fact. A DSM-5 diagnosis of PMDD needs two cycles of daily ratings
            &mdash; not a memory, not a summary, but a rating made on the day. The standard form
            for it is the DRSP, the Daily Record of Severity of Problems. It looks like this.
          </p>
        </div>

        <div className="col-aside self-end">
          <RecordSketch variant="cycles" />
        </div>

        <Reveal className="col-wide mt-6" y={20}>
          <DrspReport />
        </Reveal>

        {/* Bounded block — short enough to sit in two columns without making
            anyone scroll back up. */}
        <div className="col-wide mt-16">
          <div className="ori-folio mb-8" aria-hidden="true" />
          <div className="grid gap-8 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-12">
            <div>
              <h3 className="ori-headline text-ink">Taking it to a doctor</h3>
              <p className="ori-sidenote mt-3">
                Useful whether or not you ever install anything.
              </p>
            </div>

            <dl className="ori-columns-2">
              {[
                {
                  t: "Lead with the timing, not the feelings.",
                  d: "“These symptoms start about ten days before my period and are gone within two days of bleeding” is a clinical observation. “I’ve been really struggling” is a feeling. Both are true; only one is diagnostic.",
                },
                {
                  t: "Bring the record, and hand it over.",
                  d: "Two cycles of daily ratings, on paper or on a phone. Put it in their hands rather than describing it. It moves you from someone reporting a mood to someone presenting data.",
                },
                {
                  t: "Say the word PMDD, and say DRSP.",
                  d: "Naming the disorder and the instrument tells a clinician you’ve done the reading. If they aren’t familiar with it, that’s worth knowing in the first five minutes rather than the last.",
                },
                {
                  t: "Ask what would rule it out.",
                  d: "A good question when you’re not being taken seriously. It turns a dismissal into a plan, and it’s hard to answer with “it’s just PMS.”",
                },
                {
                  t: "Book while you still feel bad.",
                  d: "By the follicular phase you will feel fine and quietly decide you were exaggerating. Book the appointment before that happens.",
                },
              ].map((s) => (
                <div key={s.t} className="mt-0 mb-6">
                  <dt className="text-[1.02rem] font-semibold leading-snug text-ink">{s.t}</dt>
                  <dd className="ori-sidenote mt-1.5">{s.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p className="col-main mt-12 border-t border-[var(--hairline)] pt-5 text-[0.86rem] leading-relaxed text-ink-soft">
          Everything on this page is educational &mdash; not a medical device, and not a diagnosis.
        </p>
      </section>

      {/* ── 06 · The app ───────────────────────────────────── */}
      <section id="oriyali" className="ori-grid scroll-mt-20 gap-y-14 py-20 md:py-28">
        <SectionHead
          n="06"
          kicker="And if you want to keep going"
          title="Oriyali does the record-keeping part."
          deck={
            <>
              Thirty seconds a day. Two cycles later you have the one thing the appointment
              has been missing.
            </>
          }
        />

        {/* A short row: the claim on the left, the drawing on the right. */}
        <div className="col-body">
          <p className="ori-copy ori-justify">
            It&rsquo;s an iPhone app, built by one person. Thirty seconds a day of logging becomes
            three things: a warning before your next hard week, something to hold onto during
            it, and two cycles of DRSP a doctor will actually accept. That&rsquo;s the whole
            product &mdash; and everything below is what it will not do to get there.
          </p>
        </div>

        <Illustration
          src="emotional/quietPride.jpg"
          alt="A young woman taping a small drawing of a flower to the wall, standing back to look at it."
          caption="Something kept, where you can see it."
          className="col-aside self-start"
        />

        {/* The refusals, as a specimen band across the full measure — the
            colophon at the back of a magazine, where a publication states
            plainly what it stands for. */}
        <div className="col-wide">
          <div className="ori-folio mb-9">
            <span className="ori-kicker">What it refuses to do</span>
          </div>

          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "Never sold",
                d: "Not to advertisers, not to data brokers, not to insurers. No acquisition offer changes that.",
              },
              {
                t: "No trackers",
                d: "There isn’t one in the app and there won’t be. No third-party analytics anywhere near a symptom.",
              },
              {
                t: "No account",
                d: "It works with none at all. Sign in with Apple exists only if you want sync across devices.",
              },
              {
                t: "No hardware",
                d: "No wearable, no subscription to start, and no login you’ll be quietly logged out of.",
              },
            ].map((r, i) => (
              <li key={r.t} className="border-t-2 border-[var(--ink)] pt-4">
                <p className="ori-kicker mb-2">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-[family-name:var(--font-display)] text-[1.3rem] leading-tight text-ink">
                  {r.t}
                </h3>
                <p className="ori-sidenote mt-2.5">{r.d}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* The closing strip: where the data actually lives, and the one
            quiet place anything ever leaves the device. */}
        <div className="col-wide mt-2">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] md:items-start md:gap-14">
            <div>
              <h3 className="ori-headline text-ink">Where your data actually lives</h3>
              <p className="ori-copy ori-justify mt-4 max-w-[34rem]">
                On your phone. Not on a server we can read, not in a warehouse, not in a
                dataset anyone can buy.
              </p>

              <dl className="mt-7 max-w-[34rem]">
                {[
                  ["Local-first storage", "Your entries are written to your device, and that is the copy that matters."],
                  ["Optional encrypted sync", "Into your own private iCloud database, if you want it. Yours, not ours."],
                  ["One tap to delete everything", "And it actually deletes — a direct answer to the loudest complaint about the app most PMDD patients have already tried."],
                ].map(([t, d]) => (
                  <div key={t} className="border-t border-[var(--hairline)] py-4 first:border-t-0 first:pt-0">
                    <dt className="text-[1rem] font-semibold text-ink">{t}</dt>
                    <dd className="ori-sidenote mt-1">{d}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/privacy"
                className="mt-6 inline-block text-[1rem] text-ink underline decoration-[var(--hairline)] underline-offset-4 hover:decoration-[var(--ink)]"
              >
                Read the whole promise
              </Link>
            </div>

            <Waitlist />
          </div>
        </div>
      </section>

    </>
  );
}
