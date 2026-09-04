import { buildAura, type AuraInput } from "@/lib/aura";

interface AuraProps {
  input: AuraInput;
  seed?: number;
  /** Draw the strokes in, as if sketched. Ignored under Reduce Motion (CSS). */
  animate?: boolean;
  /** Keep breathing, slowly, for as long as you look at it. */
  breathe?: boolean;
  className?: string;
  /** Decorative auras are hidden from assistive tech; meaningful ones are described. */
  decorative?: boolean;
  /** Multiplier on the drawn line weight, for small or oversized renders. */
  strokeScale?: number;
}

/**
 * The Aura, drawn.
 *
 * Renders as inline SVG so it inherits currentColor, costs nothing to load,
 * and is a complete, finished drawing with JavaScript disabled and with
 * Reduce Motion on. The draw-in and the breath are pure CSS.
 */
export function Aura({
  input,
  seed = 20260904,
  animate = true,
  breathe = true,
  className,
  decorative = false,
  strokeScale = 1,
}: AuraProps) {
  const aura = buildAura(input, seed);

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : aura.label}
      focusable="false"
    >
      <g className={breathe ? "ori-breathe" : undefined} style={{ transformOrigin: "100px 100px" }}>
        <g className={breathe ? "ori-boil" : undefined} style={{ transformOrigin: "100px 100px" }}>
          {aura.petals.map((petal, i) => (
            <path
              key={i}
              d={petal.d}
              fill={`var(${petal.color})`}
              fillOpacity={petal.fillOpacity}
              stroke={`var(${petal.color})`}
              strokeWidth={petal.strokeWidth * strokeScale}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animate ? "ori-draw" : undefined}
              style={
                animate
                  ? ({
                      "--len": petal.length,
                      "--draw-delay": `${petal.delay}ms`,
                      "--draw-dur": "900ms",
                    } as React.CSSProperties)
                  : undefined
              }
            />
          ))}
          {aura.sparks.map((spark, i) => (
            <path
              key={`spark-${i}`}
              d={spark.d}
              fill="none"
              stroke={`var(${spark.color})`}
              strokeWidth={1.6 * strokeScale}
              strokeLinecap="round"
              opacity={0.8}
              className={animate ? "ori-draw" : undefined}
              style={
                animate
                  ? ({
                      "--len": spark.length,
                      "--draw-delay": `${spark.delay}ms`,
                      "--draw-dur": "500ms",
                    } as React.CSSProperties)
                  : undefined
              }
            />
          ))}
          <path
            d={aura.core}
            fill="var(--paper-raised)"
            stroke="var(--ink)"
            strokeWidth={1.9 * strokeScale}
            strokeLinecap="round"
            className={animate ? "ori-draw" : undefined}
            style={
              animate
                ? ({ "--len": aura.coreLength, "--draw-delay": "0ms", "--draw-dur": "700ms" } as React.CSSProperties)
                : undefined
            }
          />
          <path
            d={aura.coreInner}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={1.5 * strokeScale}
            strokeLinecap="round"
            opacity={0.8}
            className={animate ? "ori-draw" : undefined}
            style={
              animate
                ? ({ "--len": aura.coreLength, "--draw-delay": "400ms", "--draw-dur": "600ms" } as React.CSSProperties)
                : undefined
            }
          />
        </g>
      </g>
    </svg>
  );
}
