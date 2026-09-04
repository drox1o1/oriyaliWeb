import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * How the written pages are set.
 *
 * Editorial, generous, and never in the hand — privacy, the manifesto and the
 * FAQ are credibility content. The first paragraph after the title takes a
 * drop cap and the deck size; every paragraph after it is justified with real
 * hyphenation, which is the only way justification is readable.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <>
        <h1 className="ori-display text-ink">{children}</h1>
        <hr className="ori-rule mt-8 border-t-2 border-[var(--ink)]" />
      </>
    ),
    h2: ({ children }) => (
      <h2 className="ori-headline mt-16 border-t border-[var(--hairline)] pt-7 text-ink">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 text-[1.1rem] font-semibold text-ink">{children}</h3>
    ),
    /* `first-of-type` catches the standfirst — the paragraph directly under
       the title — and gives it the deck treatment plus a drop cap. */
    p: ({ children }) => (
      <p className="ori-copy ori-justify mt-6">{children}</p>
    ),
    ul: ({ children }) => <ul className="mt-6 space-y-3">{children}</ul>,
    ol: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-3 pl-5 marker:text-ink-soft">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-[1.02rem] leading-relaxed text-ink-soft">{children}</li>
    ),
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    hr: () => <hr className="ori-rule my-14" />,
    blockquote: ({ children }) => (
      <figure className="my-10 md:-ml-[calc(11rem+clamp(1.25rem,2.6vw,2.75rem))] md:pr-12">
        <div className="border-t-2 border-[var(--ink)] pt-5">
          <blockquote className="ori-pullquote">{children}</blockquote>
        </div>
      </figure>
    ),
    a: ({ href, children }) => {
      const url = String(href ?? "");
      const external = url.startsWith("http") || url.startsWith("mailto:");
      const className =
        "text-ink underline decoration-[var(--hairline)] underline-offset-4 hover:decoration-[var(--ink)]";
      return external ? (
        <a href={url} className={className} rel="noopener noreferrer" target={url.startsWith("http") ? "_blank" : undefined}>
          {children}
        </a>
      ) : (
        <Link href={url} className={className}>
          {children}
        </Link>
      );
    },
    ...components,
  };
}
