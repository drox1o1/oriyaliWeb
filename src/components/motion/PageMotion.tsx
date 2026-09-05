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

  useEffect(() => {
    if (
      paused ||
      quiet ||
      !root.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let cancelled = false;
    let clean: (() => void) | undefined;
    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const scope = root.current!;
        scope.querySelectorAll<HTMLElement>(".ori-folio").forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.4,
            ease: "power2.inOut",
            immediateRender: false,
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          });
        });
      }, root);
      clean = () => ctx.revert();
      void document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    })().catch(() => {});
    return () => {
      cancelled = true;
      clean?.();
    };
  }, [paused, quiet, pathname]);

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
          {paused ? "Motion paused" : "Pause motion"}
        </button>
      )}
    </div>
  );
}
