import type { CSSProperties } from "react";
import type { AuraInput } from "@/lib/aura";

/** Two hand-drawn exposures per bloom, with continuous energy interpolation. */
export function BotanicalAura({
  input,
  className = "",
}: {
  input: AuraInput;
  className?: string;
}) {
  const openness = input.energy * 2;
  return (
    <div
      className={`pencil-bloom ${className}`}
      aria-hidden="true"
      style={
        {
          "--bloom-scale": 0.84 + input.energy * 0.16,
          "--bloom-hue": `${(input.mood - 0.5) * 22}deg`,
          "--bloom-saturation": 0.85 + input.mood * 0.2,
          "--pencil-shift": `${0.12 + input.turbulence * 0.5}px`,
          "--pencil-tempo": `${1.6 - input.turbulence * 0.65}s`,
        } as CSSProperties
      }
    >
      <div className="pencil-bloom__drawing">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="pencil-bloom__stage"
            style={
              {
                opacity: Math.max(0, 1 - Math.abs(openness - i)),
                "--cell-x": `${i * 50}%`,
              } as CSSProperties
            }
          >
            <div className="pencil-bloom__exposure pencil-bloom__exposure--a" />
            <div className="pencil-bloom__exposure pencil-bloom__exposure--b" />
          </div>
        ))}
      </div>
    </div>
  );
}
