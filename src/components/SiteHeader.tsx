"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Wordmark } from "./Wordmark";

/* The three movements of the page, plus the piece behind it. Naming the parts
   rather than the features means the nav tells you the shape of the argument
   before you have read a word of it. */
const links = [
  { href: "/#why", label: "Why", id: "why" },
  { href: "/#what", label: "What", id: "what" },
  { href: "/#how", label: "How", id: "how" },
  /* Not "Why Oriyali" — the first movement is already called Why, and two
     Whys in one bar is a riddle. The manifesto is about who built it. */
  { href: "/manifesto", label: "Who made it", id: "manifesto" },
];

/**
 * The masthead.
 *
 * Two states, and one class between them. Over the opening picture the bar is
 * nothing at all — no ground, no rule — and borrows the hero's own ink. Once
 * the page has moved past the picture it settles: paper comes up behind it, a
 * hairline fades in, and it loses a few pixels of height.
 *
 * Everything that changes is a colour, an opacity or a height, so the bar
 * never triggers layout while the page is scrolling.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [settled, setSettled] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  /* Where we are, and whether the bar is still standing on the picture.
     Both come off the same rAF-throttled scroll pass. */
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    /* Which movement the reader is standing in. Each runs from its own
       opener down to the next one, so the marker tracks the argument rather
       than any single section. */
    const movements = ["why", "what", "how"];
    const ids = pathname === "/" ? movements : [];

    const update = () => {
      setSettled(window.scrollY > 24);

      if (hero) {
        // "Over the hero" while the bar's own band still sits on the artwork.
        const bottom = hero.getBoundingClientRect().bottom;
        setOverHero(bottom > 96);
      } else {
        setOverHero(false);
      }

      if (!ids.length) return;
      const tops = ids.map((id) => ({
        id,
        top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity,
      }));
      // The last movement whose opener the reader has already passed.
      const passed = tops.filter((m) => m.top <= 180);
      setActive(passed.length ? passed[passed.length - 1].id : "");
    };

    if (pathname !== "/") setActive(pathname.slice(1));

    let scheduled = false;
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        update();
        scheduled = false;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  /* The sheet closes on Escape, and never survives a page change. */
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // The sheet covers the page, so the page underneath must not scroll with it.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <header
        className="site-header"
        data-settled={settled}
        data-over-hero={overHero && !open}
      >
        <div className="site-header__inner">
          <Link
            href="/"
            className="site-header__brand"
            aria-label="Oriyali — home"
            onClick={() => setOpen(false)}
          >
            <Wordmark />
          </Link>

          <nav className="site-header__desktop" aria-label="Main">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                aria-current={active === link.id ? "location" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <Link href="/privacy" className="site-header__privacy">
              Private by nature
            </Link>
            <button
              ref={menuButton}
              type="button"
              className="site-header__menu"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Close navigation" : "Open navigation"}
              onClick={() => setOpen(!open)}
            >
              <i aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Rendered always, hidden with visibility rather than `hidden`, so the
          lines can be animated in and out instead of appearing all at once. */}
      <nav
        id="mobile-navigation"
        className="site-header__mobile"
        aria-label="Mobile navigation"
        data-open={open}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        {links.map((link, i) => (
          <Link
            key={link.id}
            href={link.href}
            onClick={() => setOpen(false)}
            aria-current={active === link.id ? "location" : undefined}
            style={{ "--i": i } as CSSProperties}
          >
            {link.label}
            <span aria-hidden="true">0{i + 1}</span>
          </Link>
        ))}
        <Link
          href="/privacy"
          onClick={() => setOpen(false)}
          style={{ "--i": links.length } as CSSProperties}
        >
          Your privacy
          <span aria-hidden="true">0{links.length + 1}</span>
        </Link>
        <p className="ori-hand">A quiet place to understand your cycle.</p>
      </nav>
    </>
  );
}
