/**
 * Motion is a gift on top, never load-bearing.
 *
 * Both animation libraries are loaded with a dynamic import from inside an
 * effect, so neither one is in the first-load bundle and neither one runs
 * before the page is already readable. If a script never arrives — or the
 * visitor asks for less motion — the page is complete exactly as the server
 * sent it.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Only ever hide something the visitor cannot currently see.
 *
 * A reveal that hides content already on screen produces a flash: the server
 * painted it, then hydration takes it away to animate it back. So an element
 * is armed only when it sits below the fold.
 */
export function isBelowTheFold(el: Element, slack = 0.85): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top > window.innerHeight * slack;
}

/** The house curve: a settle, never a bounce. */
export const SETTLE = [0.22, 0.61, 0.36, 1] as const;
