import type { ReactNode } from "react";

/**
 * The magazine furniture: the pieces that repeat down a well-set spread.
 * They exist so the grid is legible in the markup — a section reads as
 * rail / body / aside rather than as nested divs.
 */

/**
 * A movement opener.
 *
 * The page is one argument in three parts — why this exists, what is actually
 * happening, and how you get someone to believe you — and this is the beat
 * between them. One word, written very large, and one line under it.
 *
 * It carries no navigation and no numeral. It is a breath: the place where a
 * reader who has been going for a while is told, plainly, where they are and
 * what the next stretch is for.
 */
export function Movement({
  n,
  word,
  line,
  id,
}: {
  /** One, two, three — spelled out, because it is read, not counted. */
  n: string;
  word: string;
  line: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="ori-movement">
      <div className="ori-grid">
        {/* The breath between parts sits a little behind the page, so the
            word drifts up through its own white space as you reach it. */}
        <div className="col-wide" data-parallax="quiet">
          <hr className="ori-movement__rule" data-reveal="line" />
          <p className="ori-kicker mt-6" data-reveal="fade">
            Part {n}
          </p>
          <h2
            className="ori-movement__word"
            data-reveal="rise"
            style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
          >
            {word}
          </h2>
          <p
            className="ori-movement__line"
            data-reveal="rise"
            style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
          >
            {line}
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * A department opener: the numeral and its label in the rail, the headline
 * and deck in the body, ruled off with a hairline.
 */
export function SectionHead({
  n,
  kicker,
  title,
  deck,
  id,
}: {
  n: string;
  kicker: string;
  title: ReactNode;
  deck?: ReactNode;
  id?: string;
}) {
  return (
    <>
      {/* Two elements, because the reveal and the drift both animate
          `transform` and neither should be holding the other's. The outer
          one carries the depth; the inner one arrives. */}
      <div className="col-rail" data-parallax="rail">
        <div
          className="mb-6 flex items-baseline gap-4 md:mb-0 md:block"
          data-reveal="rise"
        >
          <p className="ori-numeral" aria-hidden="true">
            {n}
          </p>
          <p className="ori-kicker mt-2 md:mt-3">{kicker}</p>
        </div>
      </div>

      <div className="col-main">
        {/* The rule draws itself first, then the headline settles under it —
            the order a page is actually ruled up and set. */}
        <div className="ori-folio mb-7" aria-hidden="true" data-reveal="line" />
        <h2 id={id} className="ori-headline text-ink" data-reveal="rise" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
          {title}
        </h2>
        {deck ? (
          <p
            className="ori-deck mt-5 max-w-[38rem] text-balance"
            data-reveal="rise"
            style={{ "--reveal-delay": "210ms" } as React.CSSProperties}
          >
            {deck}
          </p>
        ) : null}
      </div>
    </>
  );
}

/**
 * A marginal note. On a wide screen it sits in the rail beside the paragraph
 * it belongs to; in one column it becomes an indented aside.
 */
export function Sidenote({
  children,
  hand = false,
  className,
}: {
  children: ReactNode;
  /** Set it in the hand when it is an aside from a person, not a footnote. */
  hand?: boolean;
  className?: string;
}) {
  return (
    // The grid classes stay on the `aside` itself — the stylesheet asks for
    // `.ori-sidenote.col-rail` on one element — so the drift goes here and
    // the reveal goes on a wrapper inside it.
    <aside
      className={`ori-sidenote ${hand ? "ori-hand" : ""} ${className ?? ""}`}
      data-parallax={hand ? "note" : "rail"}
      style={hand ? { color: "var(--bloom-ink)" } : undefined}
    >
      <div data-reveal="fade">{children}</div>
    </aside>
  );
}

/**
 * A pull-quote. On a wide screen it hangs left out of the text block and into
 * the rail — the grid-break that stops a page reading as a stack.
 */
export function PullQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="ori-pullquote-hang my-10">
      {/* The rule is its own element so it can draw itself without taking the
          quote with it. */}
      <hr className="ori-quote-rule" data-reveal="line" />
      <div className="pt-5">
        <blockquote
          className="ori-pullquote"
          data-reveal="rise"
          style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
        >
          {children}
        </blockquote>
        {cite ? <figcaption className="ori-kicker mt-4">{cite}</figcaption> : null}
      </div>
    </figure>
  );
}
