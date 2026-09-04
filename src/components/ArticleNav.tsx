"use client";

import { useEffect, useState } from "react";

interface Entry {
  id: string;
  text: string;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

/**
 * The running contents, set in the margin.
 *
 * Built on the client from the article's own headings, so the copy stays in
 * MDX and there is one place to edit it. Without JavaScript there is simply no
 * contents list — the article is unaffected, which is the right trade for a
 * navigation aid.
 */
export function ArticleNav({ label = "In this piece" }: { label?: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector(".ori-article");
    if (!article) return;

    const headings = [...article.querySelectorAll("h2")];
    const found = headings.map((h) => {
      if (!h.id) h.id = slug(h.textContent ?? "");
      return { id: h.id, text: h.textContent ?? "" };
    });
    setEntries(found);
    if (found.length) setActive(found[0].id);

    const observer = new IntersectionObserver(
      (records) => {
        const onScreen = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (onScreen[0]) setActive(onScreen[0].target.id);
      },
      { rootMargin: "-72px 0px -65% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (entries.length < 3) return null;

  return (
    <nav
      aria-label="Contents"
      className="col-rail sticky top-24 hidden self-start lg:block"
    >
      <p className="ori-kicker mb-4">{label}</p>
      <ol className="space-y-2.5 border-l border-[var(--hairline)]">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              aria-current={active === e.id ? "location" : undefined}
              className="-ml-px block border-l-2 py-0.5 pl-3 text-[0.83rem] leading-snug no-underline transition-colors"
              style={{
                borderColor: active === e.id ? "var(--bloom)" : "transparent",
                color: active === e.id ? "var(--ink)" : "var(--ink-soft)",
                fontWeight: active === e.id ? 600 : 400,
              }}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
