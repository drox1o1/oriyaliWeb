import { Monogram } from "./Monogram";

/**
 * The wordmark: the monogram beside the name, set in the display face.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <Monogram className="h-[22px] w-auto shrink-0" />
      <span className="font-[family-name:var(--font-display)] text-[1.32rem] font-normal tracking-[-0.01em]">
        Oriyali
      </span>
    </span>
  );
}
