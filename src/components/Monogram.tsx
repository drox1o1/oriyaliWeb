import { MONOGRAM_PATHS, MONOGRAM_VIEWBOX } from "@/lib/brand";

/**
 * The Oriyali monogram, on the page.
 *
 * The geometry comes from `@/lib/brand`, which is also what the favicons, the
 * app icons and the share cards are drawn from — one mark, one set of paths.
 * Inlined as SVG so it inherits `currentColor` and needs no request.
 */
export function Monogram({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={MONOGRAM_VIEWBOX}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {MONOGRAM_PATHS.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}
