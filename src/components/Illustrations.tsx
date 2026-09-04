/**
 * One hand, one world.
 *
 * Every drawing here is line-plus-soft-fill on warm paper: 2px stroke for
 * illustration, 1.5px for icons, one wobble character, rounded caps, corners
 * that don't quite meet. No gradients as surfaces, no shadows, no glass.
 *
 * All inline SVG, so they inherit currentColor, cost no request, and are
 * complete finished drawings with JavaScript off.
 */

/* ---------------------------------------------------------------- */

/**
 * Progress as a line being drawn across the journey, not a filling bar.
 * The value is also announced in text next to it — never colour alone.
 */
export function DrawnRule({ progress }: { progress: number }) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <svg viewBox="0 0 400 10" className="h-2.5 w-full" aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <path
        d="M3 6.2 C 70 4.4, 130 7.1, 200 5.2 S 330 4.2, 397 6"
        fill="none"
        stroke="var(--hairline)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M3 6.2 C 70 4.4, 130 7.1, 200 5.2 S 330 4.2, 397 6"
        fill="none"
        stroke="var(--bloom)"
        strokeWidth="2.8"
        strokeLinecap="round"
        style={{
          strokeDasharray: 400,
          strokeDashoffset: 400 - 400 * p,
          transition: "stroke-dashoffset 450ms cubic-bezier(0.22,0.61,0.36,1)",
        }}
      />
    </svg>
  );
}

/* ---------------------------------------------------------------- */

/** The sun: a drawn circle and a dozen detached rays. This passes. */
export function Sun({
  className,
  rays = true,
  color = "var(--sun)",
}: {
  className?: string;
  rays?: boolean;
  color?: string;
}) {
  const rayPaths = [
    "M50 8.5 L50 1.5", "M68.5 13 L72.5 6.5", "M82 25.5 L88.5 21",
    "M87 43 L94 41.5", "M87 57 L94 58.5", "M82 74.5 L88.5 79",
    "M31.5 13 L27.5 6.5", "M18 25.5 L11.5 21", "M13 43 L6 41.5",
    "M13 57 L6 58.5", "M18 74.5 L11.5 79",
  ];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="23" fill={color} fillOpacity="0.28" />
      <path
        d="M73 50 C73 62.5 62.6 73 50 73 C37.4 73 27 62.6 27 50 C27 37.5 37.3 27 50 27 C61.9 27 72.4 36.4 72.9 48.6"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {rays
        ? rayPaths.map((d, i) => (
            <path key={i} d={d} stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
          ))
        : null}
    </svg>
  );
}

/* ---------------------------------------------------------------- */

/**
 * A drawn horizon: two or three overlapping ridgelines with a soft wash.
 * A visible horizon line, never an airbrushed fade.
 */
export function Horizon({ className, tone = "var(--leaf)" }: { className?: string; tone?: string }) {
  return (
    <svg viewBox="0 0 400 90" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <path
        d="M0 46 C 46 30, 88 28, 132 42 C 178 57, 220 34, 268 38 C 316 42, 356 58, 400 50 L400 90 L0 90 Z"
        fill={tone}
        fillOpacity="0.2"
      />
      <path
        d="M0 46 C 46 30, 88 28, 132 42 C 178 57, 220 34, 268 38 C 316 42, 356 58, 400 50"
        fill="none"
        stroke={tone}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M0 68 C 58 56, 104 72, 158 66 C 214 60, 258 76, 312 70 C 350 66, 376 72, 400 68 L400 90 L0 90 Z"
        fill={tone}
        fillOpacity="0.3"
      />
      <path
        d="M0 68 C 58 56, 104 72, 158 66 C 214 60, 258 76, 312 70 C 350 66, 376 72, 400 68"
        fill="none"
        stroke={tone}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------- */

/** The butterfly. Milestones only, and sparingly. */
export function Butterfly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 48" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 12 C22 2, 8 3, 6 13 C4 23, 16 26, 29 24" fill="var(--rose)" fillOpacity="0.24" />
        <path d="M30 12 C38 2, 52 3, 54 13 C56 23, 44 26, 31 24" fill="var(--rose)" fillOpacity="0.24" />
        <path d="M29 25 C18 27, 11 33, 14 40 C17 46, 27 42, 30 31" fill="var(--bloom)" fillOpacity="0.2" />
        <path d="M31 25 C42 27, 49 33, 46 40 C43 46, 33 42, 30 31" fill="var(--bloom)" fillOpacity="0.2" />
        <path d="M30 11 L30 32" />
        <path d="M30 11 C28.5 7, 26 5.5, 23.5 5" />
        <path d="M30 11 C31.5 7, 34 5.5, 36.5 5" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- */

/**
 * The morning-after vignette: the sun drawing itself up over the hill, three
 * irises open on the near ridge, a butterfly through once.
 *
 * The brand's other signature — the lifted face, a figure reclined in the grass
 * looking up — is the hardest asset in the set and belongs to a real
 * illustrator. Empty paper and a well-drawn meadow are on-brand; a badly drawn
 * figure is not. Commission that one, then swap it in here.
 */
export function Meadow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 180" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="meadow-edges" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.14" stopColor="#fff" />
          <stop offset="0.86" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="meadow-fade">
          <rect width="300" height="180" fill="url(#meadow-edges)" />
        </mask>
      </defs>
      {/* No sky block. A drawing sits ON the paper — a filled rectangle
          behind it turns it into a photograph in a frame, which is exactly
          what this world is not. The light comes from the sun itself. */}
      <g opacity="0.5">
        <circle cx="96" cy="84" r="46" fill="var(--sun)" fillOpacity="0.07" />
        <circle cx="96" cy="84" r="33" fill="var(--sun)" fillOpacity="0.09" />
      </g>

      {/* the sun, coming up over the hill */}
      <g transform="translate(96 84)">
        <circle cx="0" cy="0" r="17" fill="var(--sun)" fillOpacity="0.3" />
        <path
          d="M17 0 C17 9.4, 9.4 17, 0 17 C-9.4 17, -17 9.4, -17 0 C-17 -9.4, -9.4 -17, 0 -17 C8.6 -17, 16.3 -10.2, 16.9 -2"
          fill="none"
          stroke="var(--sun)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {Array.from({ length: 9 }, (_, i) => {
          const a = (i / 9) * Math.PI * 2 + 0.3;
          const r2 = 22 + (i % 2 ? 6 : 4);
          return (
            <path
              key={i}
              d={`M${(Math.cos(a) * 22).toFixed(1)} ${(Math.sin(a) * 22).toFixed(1)} L${(Math.cos(a) * r2).toFixed(1)} ${(Math.sin(a) * r2).toFixed(1)}`}
              stroke="var(--sun)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* the far ridge */}
      <g mask="url(#meadow-fade)">
        <path
          d="M0 104 C 44 92, 86 90, 128 102 C 172 114, 214 94, 258 98 C 278 100, 290 106, 300 104 L300 180 L0 180 Z"
          fill="var(--leaf)"
          fillOpacity="0.13"
        />
      </g>
      <path
        d="M0 104 C 44 92, 86 90, 128 102 C 172 114, 214 94, 258 98 C 278 100, 290 106, 300 104"
        fill="none"
        stroke="var(--leaf-deep)"
        strokeWidth="2"
        strokeLinecap="round"
        mask="url(#meadow-fade)"
      />

      {/* the near ridge she's standing on */}
      <g mask="url(#meadow-fade)">
        <path
          d="M0 134 C 56 122, 108 138, 164 132 C 222 126, 262 142, 300 136 L300 180 L0 180 Z"
          fill="var(--leaf)"
          fillOpacity="0.2"
        />
      </g>
      <path
        d="M0 134 C 56 122, 108 138, 164 132 C 222 126, 262 142, 300 136"
        fill="none"
        stroke="var(--leaf-deep)"
        strokeWidth="2"
        strokeLinecap="round"
        mask="url(#meadow-fade)"
      />

      {/* three irises — the brand's flower, and the seed of the mark */}
      {[
        { x: 42, h: 30, c: "var(--rose)" },
        { x: 214, h: 38, c: "var(--bloom)" },
        { x: 246, h: 26, c: "var(--dusk)" },
      ].map((f) => (
        <g key={f.x} transform={`translate(${f.x} 134)`}>
          <path
            d={`M0 22 C -3 ${10 - f.h * 0.2}, 2 ${-f.h * 0.4}, 0 ${-f.h}`}
            fill="none"
            stroke="var(--leaf-deep)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d={`M0 ${4 - f.h * 0.35} C -9 ${-2 - f.h * 0.4}, -13 ${-10 - f.h * 0.35}, -9 ${-16 - f.h * 0.3}`}
            fill="none"
            stroke="var(--leaf-deep)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* three petals, upright and open */}
          <path
            d={`M0 ${-f.h} C -7 ${-f.h - 5}, -8 ${-f.h - 14}, -1 ${-f.h - 16} C 5 ${-f.h - 13}, 5 ${-f.h - 4}, 0 ${-f.h}`}
            fill={f.c}
            fillOpacity="0.34"
            stroke={f.c}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d={`M-1 ${-f.h + 1} C -10 ${-f.h - 1}, -16 ${-f.h - 6}, -14 ${-f.h - 11}`}
            fill="none"
            stroke={f.c}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d={`M1 ${-f.h + 1} C 10 ${-f.h - 1}, 15 ${-f.h - 6}, 13 ${-f.h - 11}`}
            fill="none"
            stroke={f.c}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* a few grasses */}
      {[16, 78, 126, 168, 282].map((x, i) => (
        <path
          key={x}
          d={`M${x} ${152 + (i % 2) * 3} C ${x - 3} ${142}, ${x + 3} ${136}, ${x + (i % 2 ? 4 : -4)} ${128 - (i % 3) * 4}`}
          fill="none"
          stroke="var(--leaf-deep)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.8"
        />
      ))}

      {/* the butterfly, through once */}
      <g transform="translate(258 62) rotate(-12) scale(0.62)" opacity="0.9">
        <path d="M0 0 C-8 -10, -22 -9, -24 1 C-26 11, -14 14, -1 12" fill="var(--rose)" fillOpacity="0.28" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M0 0 C8 -10, 22 -9, 24 1 C26 11, 14 14, 1 12" fill="var(--rose)" fillOpacity="0.28" stroke="var(--ink)" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M0 -1 L0 15" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M0 -1 C-2 -5, -5 -7, -8 -8" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M0 -1 C2 -5, 5 -7, 8 -8" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A drawn line under a phrase — the handwritten underline. */
export function HandUnderline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 8" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="none">
      <path
        d="M2 5.4 C 26 2.6, 52 6.4, 76 3.8 C 94 2, 108 5.2, 118 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
