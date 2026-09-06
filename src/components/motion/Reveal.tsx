import type { CSSProperties, ElementType, ReactNode } from "react";

type Variant = "rise" | "fade" | "figure" | "line" | "stagger";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /**
   * rise    a short settle upward (the default)
   * fade    no travel, for things anchored to something already on the page
   * figure  a longer fall and a slower landing, for drawings and figures
   * line    a rule that draws itself from the left
   * stagger hands the reveal to its own children, each a beat behind
   */
  variant?: Variant;
  /** Milliseconds. Use to offset a whole block, not to stagger siblings. */
  delay?: number;
  id?: string;
  style?: CSSProperties;
}

/**
 * Opt an element into the page's one reveal.
 *
 * This renders nothing of its own and runs no JavaScript: it marks the element,
 * and the single observer in `PageMotion` does the work — arming only what is
 * below the fold, never replaying, and standing down entirely under Reduce
 * Motion or with no script at all. The markup the server sends is visible.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  variant = "rise",
  delay,
  id,
  style,
}: RevealProps) {
  return (
    <Tag
      id={id}
      className={className}
      data-reveal={variant}
      style={
        delay
          ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties)
          : style
      }
    >
      {children}
    </Tag>
  );
}
