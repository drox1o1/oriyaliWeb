"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { SETTLE, isBelowTheFold, prefersReducedMotion } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds. Stagger siblings by passing 0, 0.08, 0.16… */
  delay?: number;
  /** Travel in px. Kept small — this is a settle, not an entrance. */
  y?: number;
  id?: string;
}

/**
 * A below-the-fold settle, driven by motion.dev.
 *
 * Progressive enhancement, in this order:
 *   no JavaScript      → the content is simply there
 *   Reduce Motion      → the content is simply there
 *   already on screen  → the content is simply there
 *   below the fold     → it fades and rises a few pixels as you reach it
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 16,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !isBelowTheFold(el)) return;

    let stop: (() => void) | undefined;
    let cancelAnimation: (() => void) | undefined;
    let cancelled = false;

    const finishForPause = () => {
      if (document.documentElement.dataset.motion !== "off") return;
      cancelAnimation?.();
      el.style.opacity = "";
      el.style.transform = "";
    };
    window.addEventListener("oriyali:motion", finishForPause);

    void (async () => {
      const { animate, inView } = await import("motion").catch(() => ({
        animate: null,
        inView: null,
      }));
      if (cancelled || !animate || !inView) return;

      stop = inView(
        el,
        () => {
          if (document.documentElement.dataset.motion === "off") return;
          const animation = animate(
            el,
            {
              opacity: [0, 1],
              transform: [`translateY(${y}px)`, "translateY(0px)"],
            },
            { duration: 0.85, delay, ease: [...SETTLE] },
          );
          cancelAnimation = () => animation.stop();
          void animation.then(() => {
            el.style.willChange = "";
          });

          // Once it has arrived it stays arrived.
          return;
        },
        { amount: 0.12 },
      );
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("oriyali:motion", finishForPause);
      cancelAnimation?.();
      stop?.();
      // If the import never resolved, don't leave anything invisible.
      el.style.opacity = "";
      el.style.transform = "";
      el.style.willChange = "";
    };
  }, [delay, y]);

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
