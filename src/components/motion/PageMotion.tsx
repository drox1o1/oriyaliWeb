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

  /* ------------------------------------------------------------
     Depth.

     One listener, one frame loop, one write per element per frame.
     Geometry is measured once and cached, so scrolling never reads
     layout — the frame does arithmetic and sets a custom property,
     which is the cheapest thing a scroll handler can do.

     Movement is measured from the viewport's centre line, so every
     element sits exactly where it was designed to when it is the
     thing you are looking at, and drifts only on the way in and out.
     ------------------------------------------------------------ */
  useEffect(() => {
    const scope = root.current;
    if (!scope || paused || quiet) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Furthest-moving first, which is to say furthest away.

       `scale` is the headroom a full-bleed layer is given so it can
       travel without showing its edge; it matches the same number in
       the stylesheet, and such a layer takes its limit from that
       overhang rather than from `max`.

       `max` is how far anything else may drift. These are small on
       purpose: the point is that the margins of the page are not
       quite on the same plane as the column you are reading, not
       that anything performs. A negative speed leads the scroll,
       which reads as nearer to you. */
    const PRESETS: Record<string, { speed: number; scale: number; max: number }> = {
      sky: { speed: 0.16, scale: 1.24, max: 0 },
      figure: { speed: 0.075, scale: 1, max: 40 },
      // A note in the hand is loose on the page and may float. A footnote
      // is set to the column beside it and may not: it is held to a drift
      // small enough that the alignment still reads.
      note: { speed: 0.06, scale: 1, max: 32 },
      rail: { speed: 0.03, scale: 1, max: 18 },
      quiet: { speed: 0.04, scale: 1, max: 24 },
      near: { speed: -0.05, scale: 1, max: 30 },
    };

    type Layer = { el: HTMLElement; speed: number; max: number; centre: number };

    let layers: Layer[] = [];
    let viewportH = window.innerHeight;
    let frame = 0;

    const paint = () => {
      const middle = window.scrollY + viewportH / 2;
      for (const layer of layers) {
        const delta = layer.centre - middle;
        // Beyond a viewport and a bit either way it cannot be seen, so
        // stop asking the compositor to keep a layer for it.
        if (Math.abs(delta) > viewportH * 1.3) {
          if (layer.el.style.willChange) layer.el.style.willChange = "";
          continue;
        }
        const travel = Math.max(-layer.max, Math.min(layer.max, -delta * layer.speed));
        layer.el.style.setProperty("--px-y", `${travel.toFixed(2)}px`);
        if (!layer.el.style.willChange) layer.el.style.willChange = "transform";
      }
    };

    const measure = () => {
      viewportH = window.innerHeight;
      // Small screens get a gentler version of the same idea: less room
      // to travel, and a hand usually closer to the glass.
      const amplitude = window.innerWidth < 768 ? 0.55 : 1;
      const scrolled = window.scrollY;

      const nodes = Array.from(scope.querySelectorAll<HTMLElement>("[data-parallax]"));

      // Read layout, not the transformed picture of it. One flag, one
      // synchronous pass, one reflow — and only when something has
      // actually changed size.
      nodes.forEach((el) => el.setAttribute("data-px-measuring", ""));

      layers = nodes.map(
        (el) => {
          const preset = PRESETS[el.dataset.parallax ?? ""] ?? PRESETS.quiet;
          const box = el.getBoundingClientRect();
          return {
            el,
            speed: preset.speed * amplitude,
            // A scaled backdrop may travel only as far as its own overhang,
            // less a little, so an edge can never walk into frame. Anything
            // else is held to a distance that reads as depth, not drift.
            max:
              preset.scale > 1
                ? ((box.height * (preset.scale - 1)) / 2) * 0.88
                : preset.max * amplitude,
            centre: box.top + scrolled + box.height / 2,
          };
        },
      );

      nodes.forEach((el) => el.removeAttribute("data-px-measuring"));
      paint();
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        paint();
      });
    };

    // Anything that changes the height of the page moves every centre
    // line below it, so re-measure rather than drift out of true.
    let settle = 0;
    const remeasure = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(measure, 120);
    };

    measure();
    void document.fonts?.ready.then(measure);

    const resizeObserver = new ResizeObserver(remeasure);
    resizeObserver.observe(document.body);

    // The hero keeps two skies and shows whichever suits the hour. The one
    // that was hidden when we measured has no size to remember, so when the
    // hour turns it needs measuring again before it can travel.
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", remeasure);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("orientationchange", remeasure);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      resizeObserver.disconnect();
      scheme.removeEventListener("change", remeasure);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("orientationchange", remeasure);
      layers.forEach(({ el }) => {
        el.style.removeProperty("--px-y");
        el.style.willChange = "";
      });
    };
  }, [pathname, paused, quiet]);

  /* ------------------------------------------------------------
     The pointer.

     A few pixels of sky under the cursor — a parallax of the head
     rather than of the page. Only where there is a real pointer:
     on a touch screen there is nothing hovering to answer, and the
     handler would only cost battery.
     ------------------------------------------------------------ */
  useEffect(() => {
    const scope = root.current;
    if (!scope || paused || quiet) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const targets = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-pointer-drift]"),
    );
    if (!targets.length) return;

    let frame = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;

    const paint = () => {
      frame = 0;
      // ±1 either side of centre, then a handful of pixels of it.
      const x = (pointerX - 0.5) * 2;
      const y = (pointerY - 0.5) * 2;
      for (const el of targets) {
        const reach = Number(el.dataset.pointerDrift) || 8;
        el.style.setProperty("--px-x", `${(-x * reach).toFixed(2)}px`);
        el.style.setProperty("--px-y", `${(-y * reach * 0.5).toFixed(2)}px`);
      }
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth;
      pointerY = event.clientY / window.innerHeight;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      targets.forEach((el) => {
        el.style.removeProperty("--px-x");
        el.style.removeProperty("--px-y");
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
          // Below 960px the stylesheet hides the label, and the icon is
          // decorative — so the name has to be said here as well as shown.
          aria-label={paused ? "Motion paused. Resume motion" : "Pause motion"}
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
