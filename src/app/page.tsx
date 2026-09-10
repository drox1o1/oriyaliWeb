import Link from "next/link";
import { BotanicalAura } from "@/components/BotanicalAura";
import { AuraTaste } from "@/components/AuraTaste";
import { CycleExplainer } from "@/components/CycleExplainer";
import { DrspReport } from "@/components/DrspReport";
import { SelfCheck } from "@/components/SelfCheck";
import { Waitlist } from "@/components/Waitlist";
import { Movement, PullQuote, SectionHead, Sidenote } from "@/components/Editorial";
import { Reveal } from "@/components/motion/Reveal";
import { HandUnderline } from "@/components/Illustrations";
import { RESTING_AURA } from "@/lib/aura";
import { HomeStructuredData } from "@/components/StructuredData";
import { Hero } from "@/components/Hero";
import { RecordSketch } from "@/components/RecordSketch";

/**
 * One argument, told in three parts.
 *
 *   WHY   — a fortnight of your life keeps going missing, and there has
 *           never been anything in the room to prove it.
 *   WHAT  — what is actually happening in a month, and what it is called.
 *   HOW   — how you walk into an appointment with something to show.
 *
 * Every section sits on the same four-column grid — rail, body, aside — so
 * the eye moves left to right and down rather than scrolling one long column.
 * The movements between them carry no navigation and no numeral: they are the
 * breath between one part of the argument and the next.
 */
export default function Home() {
  return (
    <>
      <HomeStructuredData />
      <Hero />

      {/* ═══ PART ONE ═══════════════════════════════════════ */}

      <Movement
        id="why"
        n="one"
        word="Why"
        line={
          <>
            Because the hardest fortnight of your month is the one nobody else can see.
          </>
        }
      />

      {/* ── 01 · The pattern ───────────────────────────────── */}
      <section id="pattern" className="ori-grid scroll-mt-20 gap-y-10 pb-20 md:gap-y-12 md:pb-24">
        <SectionHead
          n="01"
          kicker="The pattern"
          title="You are not imagining it."
        />

        <Sidenote hand className="col-rail self-start md:pt-2">
          Somewhere in here, someone told you it was just PMS.
          <HandUnderline className="mt-1 hidden h-2 w-[76%] text-[var(--bloom)] md:block" />
        </Sidenote>

        {/* One `.ori-copy` block, not two: the rhythm between paragraphs is
            `.ori-copy > * + *`, so two sibling blocks would sit flush. */}
        <div className="col-body ori-copy ori-justify text-[1.06rem]" data-reveal="rise">
          <p className="ori-dropcap">
            The fuse that&rsquo;s suddenly an inch long. The fog that makes you read the same
            sentence four times. Crying at something that wouldn&rsquo;t have touched you a week
            ago &mdash; then watching it all lift the day you start bleeding, and wondering
            whether you invented the whole thing.
          </p>
          <p>You didn&rsquo;t. It has a shape, the shape repeats, and it has a name.</p>
        </div>

        <div className="col-aside self-start md:-mt-6" data-reveal="figure">
          <div data-parallax="figure">
            <BotanicalAura
              input={RESTING_AURA}
              className="mx-auto block h-56 w-56 sm:h-72 sm:w-72 md:mx-0 md:h-auto md:w-full"
            />
          </div>
        </div>
      </section>

      {/* ── 02 · The wait ─────────────────────────────────── */}
      <section
        id="believed"
        className="ori-grid scroll-mt-20 gap-y-10 border-t border-[var(--hairline)] bg-[var(--paper-deep)] py-20 md:py-28"
      >
        <SectionHead n="02" kicker="The wait" title="Twelve years." />

        <div className="col-body" data-reveal="rise">
          <p className="ori-copy ori-justify ori-dropcap">
            That is the average wait for an accurate PMDD diagnosis in IAPMD&rsquo;s global
            survey. Twelve years is not a story about careless doctors. It is a story about
            timing: you get the appointment for the week you can face making a phone call,
            which is the week you feel fine.
          </p>

          <PullQuote>
            There is nothing in the room to look at except you, saying it.
          </PullQuote>

          <p className="ori-copy ori-justify">
            The waiting is not harmless. In a 2022 study of 599 people with prospectively
            confirmed PMDD, 34% reported having attempted suicide. We&rsquo;re stating that
            plainly and once, because it is the reason the wait matters. If that is where you
            are right now,{" "}
            <Link href="/crisis" className="text-ink underline decoration-[var(--hairline)] underline-offset-4">
              there are numbers here
            </Link>
            .
          </p>
        </div>

        {/* After the argument, not before it: in one column the aside falls
            where it is written, and a reader should meet the claim before the
            footnote that supports it. */}
        <Sidenote className="col-aside self-start md:mt-2 md:border-l md:border-[var(--hairline)] md:pl-5">
          <span className="ori-kicker mb-2 block">Sources</span>
          Diagnosis delay: IAPMD Global Survey of Premenstrual Disorders &mdash; survey data,
          not a clinical trial.
          <br />
          <br />
          Self-injury: Eisenlohr-Moul et al., <em>BMC Psychiatry</em>, 2022 (n&nbsp;=&nbsp;599,
          prospectively confirmed PMDD).
        </Sidenote>
      </section>

      {/* ═══ PART TWO ═══════════════════════════════════════ */}

      <Movement
        id="what"
        n="two"
        word="What"
        line={<>What is actually happening across a month, and what it is called.</>}
      />

      {/* ── 03 · Your cycle ────────────────────────────────── */}
      <section id="cycle" className="scroll-mt-20 pb-24 md:pb-32">
        <div className="ori-grid gap-y-10">
          <SectionHead
            n="03"
            kicker="Your cycle"
            title="A month, told as a single day."
            deck={
              <>
                Your cycle isn&rsquo;t one weather system, it&rsquo;s five. Most people are
                never taught which one they&rsquo;re standing in, which is why the hard days
                feel like they arrive out of nowhere. They don&rsquo;t &mdash; they arrive on
                a schedule, and a schedule is something you can plan around.
              </>
            }
          />
          <Sidenote hand className="col-rail self-start md:pt-2">
            Scroll, and watch the light move.
          </Sidenote>
        </div>

        <div className="mt-12">
          <CycleExplainer />
        </div>
      </section>

      {/* ── 04 · The self-check ────────────────────────────── */}
      <section
        id="self-check"
        className="ori-grid scroll-mt-20 gap-y-10 border-t border-[var(--hairline)] bg-[var(--paper-deep)] py-20 md:py-28"
      >
        <SectionHead
          n="04"
          kicker="The self-check"
          title="The questions a doctor would ask."
          deck={
            <>
              Four minutes, without having to get the appointment first. It won&rsquo;t
              diagnose you &mdash; nothing can, in four minutes. It will tell you whether what
              you live through each month is the kind of thing this instrument was built to
              catch, and give you language for it.
            </>
          }
        />

        <Sidenote className="col-rail md:pt-2">
          The PSST &mdash; Steiner, Macdougall &amp; Brown, <em>Archives of Women&rsquo;s
          Mental Health</em>, 2003. Reproduced as written: nothing invented, nothing
          re-weighted.
        </Sidenote>

        <Reveal className="col-wide mt-4" variant="figure">
          <SelfCheck />
        </Reveal>
      </section>

      {/* ═══ PART THREE ═════════════════════════════════════ */}

      <Movement
        id="how"
        n="three"
        word="How"
        line={<>How you walk in with something to show them, instead of something to say.</>}
      />

      {/* ── 05 · The record ────────────────────────────────── */}
      <section id="record" className="ori-grid scroll-mt-20 gap-y-10 pb-20 md:pb-28">
        <SectionHead
          n="05"
          kicker="The record"
          title="Bring evidence, not a memory."
          deck={
            <>
              A DSM-5 diagnosis of PMDD needs two cycles of daily ratings &mdash; made on the
              day, not remembered afterwards. The standard form is the DRSP. It looks like
              this.
            </>
          }
        />

        <div className="col-body self-center" data-reveal="figure">
          <div data-parallax="figure">
            <RecordSketch variant="journal" />
          </div>
        </div>

        <Reveal className="col-wide mt-2" variant="figure">
          <DrspReport />
        </Reveal>

        {/* Three things to do with it, once you have it. */}
        <div className="col-wide mt-12">
          <div className="ori-folio mb-8" data-reveal="line">
            <span className="ori-kicker">Taking it to a doctor</span>
          </div>

          <ul className="grid gap-x-10 gap-y-9 md:grid-cols-3" data-reveal="stagger">
            {[
              {
                t: "Lead with the timing.",
                d: "“These symptoms start about ten days before my period and are gone within two days of bleeding” is a clinical observation. “I’ve been really struggling” is a feeling. Both are true; only one is diagnostic.",
              },
              {
                t: "Hand the record over.",
                d: "Two cycles of daily ratings, on paper or on a phone. Put it in their hands rather than describing it. It moves you from someone reporting a mood to someone presenting data.",
              },
              {
                t: "Book while you still feel bad.",
                d: "By the follicular phase you will feel fine and quietly decide you were exaggerating. Make the appointment before that happens.",
              },
            ].map((s) => (
              <li key={s.t} className="border-t-2 border-[var(--ink)] pt-4">
                <p className="text-[1.05rem] font-semibold leading-snug text-ink">{s.t}</p>
                <p className="ori-sidenote mt-2">{s.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 06 · The daily check-in ────────────────────────── */}
      <section
        id="aura"
        className="ori-grid scroll-mt-20 gap-y-10 border-t border-[var(--hairline)] bg-[var(--paper-deep)] py-20 md:py-28"
      >
        <SectionHead
          n="06"
          kicker="The check-in"
          title="Thirty seconds a day."
          deck={
            <>
              That is the whole ritual. Three sliders, and the day gets drawn. Two cycles of
              them is the record above.
            </>
          }
        />

        <Reveal className="col-wide" variant="figure">
          <AuraTaste />
        </Reveal>
      </section>

      {/* ── 07 · The app ───────────────────────────────────── */}
      <section id="oriyali" className="ori-grid scroll-mt-20 gap-y-12 py-20 md:py-28">
        <SectionHead
          n="07"
          kicker="The app"
          title="Oriyali does the record-keeping part."
          deck={
            <>
              An iPhone app, built by one person. Thirty seconds a day becomes a warning
              before your next hard week, something to hold onto during it, and two cycles of
              DRSP a doctor will accept. That is the whole product.
            </>
          }
        />

        {/* The refusals, as a specimen band — the colophon at the back of a
            magazine, where a publication states plainly what it stands for. */}
        <div className="col-wide">
          <div className="ori-folio mb-9" data-reveal="line">
            <span className="ori-kicker">And what it refuses to do</span>
          </div>

          <ul
            className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
            data-reveal="stagger"
          >
            {[
              {
                t: "Never sold",
                d: "Not to advertisers, brokers or insurers. No acquisition offer changes that.",
              },
              {
                t: "No trackers",
                d: "There isn’t one in the app, and there won’t be. No third-party analytics near a symptom.",
              },
              {
                t: "No account",
                d: "It works with none at all. Sign in with Apple exists only if you want sync.",
              },
              {
                t: "Nothing to lose",
                d: "Your entries live on your phone. One tap deletes everything, and it actually deletes.",
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

        <div className="col-wide">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] md:items-start md:gap-14">
            <div data-reveal="rise">
              <p className="ori-copy ori-justify max-w-[34rem] text-[1.06rem]">
                It isn&rsquo;t finished yet. If you want to know when it is, leave an email
                &mdash; that is the one thing on this whole site that gets sent anywhere, and
                it is used for exactly one message.
              </p>
              <Link
                href="/privacy"
                className="mt-6 inline-block text-[1rem] text-ink underline decoration-[var(--hairline)] underline-offset-4 hover:decoration-[var(--ink)]"
              >
                Read the whole promise
              </Link>
            </div>

            <Reveal variant="figure">
              <Waitlist />
            </Reveal>
          </div>
        </div>

        <p className="col-main border-t border-[var(--hairline)] pt-5 text-[0.86rem] leading-relaxed text-ink-soft">
          Everything on this page is educational &mdash; not a medical device, and not a
          diagnosis.
        </p>
      </section>
    </>
  );
}
