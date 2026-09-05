"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/#self-check", label: "Self-check", id: "self-check" },
  { href: "/#aura", label: "The check-in", id: "aura" },
  { href: "/#cycle", label: "Your cycle", id: "cycle" },
  { href: "/manifesto", label: "Why Oriyali", id: "manifesto" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setActive(pathname.slice(1));
      return;
    }
    const update = () => {
      const ids = ["self-check", "aura", "cycle"];
      const at = ids.find((id) => {
        const box = document.getElementById(id)?.getBoundingClientRect();
        return box && box.top <= 180 && box.bottom > 180;
      });
      setActive(at ?? "");
    };
    let scheduled = false;
    const onScroll = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          update();
          scheduled = false;
        });
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !header.current?.contains(event.target)
      )
        setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  return (
    <header ref={header} className="site-header">
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
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            className="site-header__menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            <svg
              viewBox="0 0 22 22"
              width="21"
              height="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              aria-hidden="true"
            >
              {open ? (
                <path d="M5 5l12 12M17 5L5 17" />
              ) : (
                <path d="M3 7h16M3 14h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className="site-header__mobile"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            onClick={() => setOpen(false)}
            aria-current={active === link.id ? "location" : undefined}
          >
            {link.label}
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
        <Link href="/privacy" onClick={() => setOpen(false)}>
          Your privacy<span aria-hidden="true">↗</span>
        </Link>
        <p>A quiet place to understand your cycle.</p>
      </nav>
    </header>
  );
}
