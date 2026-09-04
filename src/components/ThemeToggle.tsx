"use client";

import { useEffect, useState } from "react";

type Choice = "light" | "dark";

/**
 * Light or twilight. The choice lives in this browser and nowhere else —
 * it is never sent anywhere, and it is the only thing this site stores.
 */
export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("oriyali-theme");
    } catch {
      /* private browsing, blocked storage — the system preference still works */
    }
    if (saved === "dark" || saved === "light") {
      setChoice(saved);
    } else {
      setChoice(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
  }, []);

  function toggle() {
    const next: Choice = choice === "dark" ? "light" : "dark";
    setChoice(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("oriyali-theme", next);
    } catch {
      /* nothing to do — the page still looks right for this visit */
    }
  }

  // Before hydration we don't know which way round it is; render a stable shell.
  const isDark = choice === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className="grid h-11 w-11 place-items-center rounded-full border border-[var(--hairline)] text-ink transition-colors hover:bg-[var(--well)]"
      aria-pressed={choice === null ? undefined : isDark}
      aria-label={
        choice === null
          ? "Switch between light and twilight"
          : isDark
            ? "Switch to light"
            : "Switch to twilight"
      }
      title={isDark ? "Light" : "Twilight"}
    >
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        {isDark ? (
          <path d="M20.1 14.3a8.2 8.2 0 0 1-10.3-10.2 8.5 8.5 0 1 0 10.3 10.2Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.1" />
            <path d="M12 2.6v2M12 19.4v2M4.4 12h-2M21.6 12h-2M6.5 6.5 5.1 5.1M18.9 18.9l-1.4-1.4M17.5 6.5l1.4-1.4M5.1 18.9l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
