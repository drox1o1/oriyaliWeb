import type { AuraInput } from "@/lib/aura";

// Round generated geometry so server and browser render identical SVG attributes.
export const pencilNumber = (v: number) => Math.round(v * 1000) / 1000;
const n = pencilNumber;

export function CrayonDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter
        id={`${id}-crayon`}
        x="-12%"
        y="-12%"
        width="124%"
        height="124%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency=".72"
          numOctaves="3"
          seed="21"
          result="grain"
        />
        <feColorMatrix
          in="grain"
          type="matrix"
          values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0"
        />
        <feComponentTransfer result="dry">
          <feFuncA type="discrete" tableValues="0 0 .65 1 1 1" />
        </feComponentTransfer>
        <feComposite
          in="SourceGraphic"
          in2="dry"
          operator="in"
          result="pigment"
        />
        <feDisplacementMap
          in="pigment"
          in2="grain"
          scale="1.4"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  );
}

function pigment(from: number[], to: number[], amount: number) {
  return `rgb(${from.map((v, i) => Math.round(v + (to[i] - v) * amount)).join(" ")})`;
}

/** Three deliberately different little drawings, with a shared crayon vocabulary. */
export function CrayonFlower({
  kind,
  energy = 0.6,
  mood = 0.5,
}: {
  kind: "blue" | "sun" | "pink";
  energy?: number;
  mood?: number;
}) {
  const blue = pigment(
    [28, 114, 159],
    [202, 97, 134],
    Math.max(0, (mood - 0.45) / 0.55),
  );
  const pink = pigment([201, 85, 146], [233, 137, 112], mood);
  const yellow = pigment([222, 158, 41], [240, 190, 37], mood);
  if (kind === "pink")
    return (
      <g
        className="crayon-flower-head"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M-25 6C-40-13-36-53-29-50Q-20-52-14-14C-16-40-8-64-2-58Q5-58 7-17C13-49 24-57 28-46Q36-29 22 3Q3 31-25 6Z"
          fill={pink}
          stroke={pink}
          strokeWidth="3"
        />
        <path
          d="M-22-40Q-22-10-9 9M-2-48L1 12M23-38Q15-8 11 12"
          fill="none"
          stroke="#efbd33"
          strokeWidth="4"
        />
        <path
          d="M-28 7Q-8 31 21 7"
          fill="none"
          stroke="#338363"
          strokeWidth="4"
        />
      </g>
    );
  // A single uneven contour keeps the petals connected, like one crayon drawing.
  // Separate outlined petals create an unwanted pinwheel where they overlap.
  const contour =
    kind === "blue"
      ? "M-4-17C-40-74-86-35-33-3C-85 29-40 78-6 28C29 86 81 41 34 9C91-22 43-82-4-17Z"
      : "M0-18C-43-86-72-43-30-10C-101-25-88 34-29 25C-45 88 23 91 20 34C79 72 98 19 38 4C92-44 37-71 11-21Q3-17 0-18Z";
  let coordinate = 0;
  const outline = contour.replace(/-?\d+(?:\.\d+)?/g, (value) =>
    String(
      n(
        Number(value) *
          (coordinate++ % 2 ? 0.62 + energy * 0.46 : 0.66 + energy * 0.38),
      ),
    ),
  );
  return (
    <g
      className="crayon-flower-head"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className="crayon-petal">
        <path
          d={outline}
          fill={kind === "blue" ? blue : yellow}
          stroke={kind === "blue" ? blue : pink}
          strokeWidth={kind === "blue" ? 3 : 3.5}
        />
      </g>
      {[
        [0, -8],
        [-9, -4],
        [8, -2],
        [-5, 5],
        [6, 9],
        [0, 15],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y}l${i % 2 ? 2 : -2} 4`}
          stroke={kind === "blue" ? "#e38a31" : blue}
          strokeWidth="4.5"
        />
      ))}
    </g>
  );
}

export function DayStems({ input }: { input: AuraInput }) {
  const { mood, energy, turbulence } = input;
  const lift = energy * 42;
  const stems = [
    {
      kind: "blue" as const,
      x: 207 - (1 - energy) * 17,
      y: 239 - lift * 0.65,
      base: 275,
      lean: -15 + energy * 8,
    },
    {
      kind: "sun" as const,
      x: 304 + mood * 5,
      y: 191 - lift,
      base: 303,
      lean: 4 - mood * 10,
    },
    {
      kind: "pink" as const,
      x: 385 + (1 - energy) * 9,
      y: 259 - lift * 0.7,
      base: 326,
      lean: 17 - energy * 11,
    },
  ];
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {stems.map(({ kind, x, y, base, lean }) => (
        <g key={kind}>
          <path
            d={`M${base} 397Q${n(x + (base - x) * 0.8)} 309 ${n(x)} ${n(y)}`}
            fill="none"
            stroke="#348263"
            strokeWidth="5.5"
          />
          <path
            d={
              kind === "blue"
                ? "M267 370Q196 355 196 304Q245 316 267 370Z"
                : kind === "sun"
                  ? "M305 355Q348 328 350 292Q311 304 305 355Z"
                  : "M335 375Q390 374 416 326Q362 328 335 375Z"
            }
            fill={kind === "sun" ? "none" : "#378a67"}
            stroke="#348263"
            strokeWidth="4"
          />
          <path
            d={
              kind === "blue"
                ? "M258 358 207 319"
                : kind === "sun"
                  ? "M309 342 342 305"
                  : "M349 365 400 337"
            }
            stroke={kind === "sun" ? "#348263" : "#efbd33"}
            strokeWidth="2.5"
          />
          <g transform={`translate(${n(x)} ${n(y)}) rotate(${n(lean)})`}>
            <CrayonFlower kind={kind} energy={energy} mood={mood} />
          </g>
        </g>
      ))}
      <g className="crayon-feeling-marks" fill="none">
        {Array.from({ length: 12 }, (_, i) => {
          const left = i < 6,
            row = i % 6;
          const x = left ? 125 - Math.sin(row) * 12 : 453 + Math.sin(row) * 12;
          const y = 197 + row * 25;
          return (
            <path
              key={i}
              d={`M${n(x)} ${y}q${left ? -5 : 5} -3 ${left ? -3 : 3} ${n(-6 - turbulence * 7)}`}
              stroke={
                i % 3 === 0 ? "#d07594" : i % 3 === 1 ? "#d99234" : "#2d83a0"
              }
              strokeWidth="3.5"
              opacity={n(
                Math.max(0, Math.min(1, turbulence * 1.6 - row * 0.14)),
              )}
            />
          );
        })}
      </g>
    </g>
  );
}
