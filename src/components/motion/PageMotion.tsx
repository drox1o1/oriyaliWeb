"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** One motion preference and one scoped animation lifecycle for the whole page. */
export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pathname = usePathname();
  const quiet = pathname === "/crisis";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPaused(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = paused || quiet ? "off" : "on";
    window.dispatchEvent(new Event("oriyali:motion"));
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [paused, quiet]);

  /* ------------------------------------------------------------------
     The reveal.

     Every `[data-reveal]` on the page is armed here, in one pass, by one
     observer. Two rules keep it honest:

       · Nothing already on screen is ever hidden. The server painted it;
         taking it away to animate it back is a flash, not a reveal.
       · Nothing replays. Once a thing has arrived it stays arrived, so
         scrolling back up is not a performance.

     A container marked `data-reveal="stagger"` hands the state to its own
     children instead, each a beat behind the last.
     ------------------------------------------------------------------ */
  useEffect(() => {
    const scope = root.current;
    if (!scope || paused || quiet) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const armed: HTMLElement[] = [];

    scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.dataset.reveal === "stagger") {
        Array.from(el.children).forEach((child, i) => {
          if (!(child instanceof HTMLElement)) return;
          child.style.setProperty("--reveal-delay", `${i * 70}ms`);
          armed.push(child);
        });
        return;
      }
      armed.push(el);
    });

    const viewport = window.innerHeight;
    const waiting = armed.filter((el) => {
      // Only ever hide something the visitor cannot currently see.
      if (el.getBoundingClientRect().top < viewport * 0.9) return false;
      el.dataset.revealState = "hidden";
      return true;
    });

    if (!waiting.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.dataset.revealState = "shown";
          observer.unobserve(el);
          // Once it has landed, stop asking the compositor to hold a layer.
          window.setTimeout(() => {
            el.style.willChange = "";
          }, 1400);
        });
      },
      // A little past the bottom edge, so a thing is already moving by the
      // time it is properly in view rather than starting once it is.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    waiting.forEach((el) => observer.observe(el));

    /* If motion is switched off mid-flight, everything lands at once. */
    const land = () => {
      if (document.documentElement.dataset.motion !== "off") return;
      waiting.forEach((el) => {
        el.dataset.revealState = "shown";
        observer.unobserve(el);
      });
    };
    window.addEventListener("oriyali:motion", land);

    return () => {
      observer.disconnect();
      window.removeEventListener("oriyali:motion", land);
      armed.forEach((el) => {
        delete el.dataset.revealState;
        el.style.removeProperty("--reveal-delay");
        el.style.willChange = "";
      });
    };
  }, [pathname, paused, quiet]);

  useEffect(() => {
    const drawings = root.current?.querySelectorAll(
      ".pencil-bloom, .pencil-landscape",
    );
    if (!drawings) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.target.setAttribute(
            "data-visible",
            String(entry.isIntersecting),
          ),
        );
      },
      { rootMargin: "60px" },
    );
    drawings.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      drawings.forEach((el) => el.removeAttribute("data-visible"));
    };
  }, [pathname]);

  return (
    <div ref={root} className="page-motion">
      {children}
      {!quiet && (
        <button
          type="button"
          className="motion-toggle"
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            {paused ? <path d="M5 3l7 5-7 5Z" /> : <path d="M5 3v10M11 3v10" />}
          </svg>
          <span>{paused ? "Motion paused" : "Pause motion"}</span>
        </button>
      )}
    </div>
  );
}
