import { forwardRef } from "react";

/** Six aligned coloured-pencil keyframes: light, weather and flowers change together. */
export const CycleLandscape = forwardRef<HTMLDivElement>(
  function CycleLandscape(_, ref) {
    return (
      <div ref={ref} className="pencil-landscape" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="pencil-landscape__frame"
            data-frame={i}
            style={{
              backgroundPosition: `${(i % 3) * 50}% ${i < 3 ? 0 : 100}%`,
              opacity: i === 0 ? 1 : 0,
            }}
          />
        ))}
      </div>
    );
  },
);
