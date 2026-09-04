import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The nav stays quiet. No App Store badge, no "Get the app" button —
 * the point of the page is the page.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--hairline)] bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-[6px]">
      <div className="mx-auto flex h-16 w-full max-w-[76rem] items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="rounded-md text-ink no-underline" aria-label="Oriyali — home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#self-check"
            className="hidden rounded-full px-3 py-2 text-[0.94rem] text-ink-soft no-underline transition-colors hover:text-ink sm:inline-block"
          >
            Self-check
          </Link>
          <Link
            href="/#cycle"
            className="hidden rounded-full px-3 py-2 text-[0.94rem] text-ink-soft no-underline transition-colors hover:text-ink md:inline-block"
          >
            Your cycle
          </Link>
          <Link
            href="/manifesto"
            className="hidden rounded-full px-3 py-2 text-[0.94rem] text-ink-soft no-underline transition-colors hover:text-ink md:inline-block"
          >
            Why
          </Link>
          <Link
            href="/privacy"
            className="rounded-full px-3 py-2 text-[0.94rem] text-ink-soft no-underline transition-colors hover:text-ink"
          >
            Privacy
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
