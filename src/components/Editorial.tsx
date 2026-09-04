import type { ReactNode } from "react";

/**
 * The magazine furniture: the pieces that repeat down a well-set spread.
 * They exist so the grid is legible in the markup — a section reads as
 * rail / body / aside rather than as nested divs.
 */

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
      <div className="col-rail mb-6 flex items-baseline gap-4 md:mb-0 md:block">
        <p className="ori-numeral" aria-hidden="true">
          {n}
        </p>
        <p className="ori-kicker mt-2 md:mt-3">{kicker}</p>
      </div>

      <div className="col-main">
        <div className="ori-folio mb-7" aria-hidden="true" />
        <h2 id={id} className="ori-headline text-ink">
          {title}
        </h2>
        {deck ? <p className="ori-deck mt-5 max-w-[38rem] text-balance">{deck}</p> : null}
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
    <aside
      className={`ori-sidenote ${className ?? ""}`}
      style={
        hand
          ? { fontFamily: "var(--font-hand)", color: "var(--bloom-ink)", fontSize: "1rem", lineHeight: 1.55 }
          : undefined
      }
    >
      {children}
    </aside>
  );
}

/**
 * A pull-quote. On a wide screen it hangs left out of the text block and into
 * the rail — the grid-break that stops a page reading as a stack.
 */
export function PullQuote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="my-10 md:-ml-[calc(11rem+clamp(1.25rem,2.6vw,2.75rem))] md:pr-10">
      <div className="border-t-2 border-[var(--ink)] pt-5">
        <blockquote className="ori-pullquote">{children}</blockquote>
        {cite ? <figcaption className="ori-kicker mt-4">{cite}</figcaption> : null}
      </div>
    </figure>
  );
}
