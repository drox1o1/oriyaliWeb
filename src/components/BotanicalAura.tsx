"use client";

import { useId } from "react";
import type { AuraInput } from "@/lib/aura";
import { CrayonDefs, DayStems } from "@/components/CrayonDrawing";

export function BotanicalAura({
  input,
  className = "",
}: {
  input: AuraInput;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`pencil-bloom ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 500" fill="none" className="botanical-drawing">
        <CrayonDefs id={id} />
        <g filter={`url(#${id}-crayon)`} className="crayon-register">
          <DayStems input={input} />
        </g>
      </svg>
    </div>
  );
}
