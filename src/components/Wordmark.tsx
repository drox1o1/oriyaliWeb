import { Monogram } from "./Monogram";

/**
 * The wordmark: the drawn mark, and the name in the hand.
 *
 * The name is set in Over the Rainbow — the same hand the sidenotes and the
 * check-in are written in, so the brand and the asides speak with one voice.
 * It runs larger than the text beside it because handwriting has a small
 * x-height; at body size it would read as a caption rather than a name.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2.5 ${className ?? ""}`}>
      <Monogram className="h-[21px] w-auto shrink-0 translate-y-[3px]" />
      <span className="ori-hand-mark text-[1.7rem]">Oriyali</span>
    </span>
  );
}
