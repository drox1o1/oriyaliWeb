"use client";

import { useEffect, useRef, useState } from "react";
import { Monogram } from "./Monogram";

/**
 * The sign-off: the mark, drawn, and the name in the hand at the size of a
 * cover.
 *
 * The monogram is five separate petal shapes, so it can be assembled rather
 * than faded in — each petal settles into place a beat after the last, and the
 * long stroke that runs through them draws itself last, the way the mark would
 * actually be made. Then it breathes, slowly, and does not stop.
 *
 * The name arrives letter by letter. Handwriting is made one letter at a time;
 * revealing it as a block would be the one moment on this page where the hand
 * stops looking handwritten.
 */
export function BrandLockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "off";
    if (still) {
      setDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setDrawn(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    // If motion is switched off while it is still waiting, it simply finishes.
    const land = () => {
      if (document.documentElement.dataset.motion === "off") setDrawn(true);
    };
    window.addEventListener("oriyali:motion", land);

    return () => {
      observer.disconnect();
      window.removeEventListener("oriyali:motion", land);
    };
  }, []);

  return (
    <div ref={ref} className="brand-lockup" data-drawn={drawn}>
      <Monogram className="brand-lockup__mark" title="Oriyali" />
      <p className="brand-lockup__name">
        <span className="sr-only">Oriyali</span>
        {"Oriyali".split("").map((letter, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{ transitionDelay: `${520 + i * 70}ms` }}
          >
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
}
