import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk, Over_the_Rainbow } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";
import { PageMotion } from "@/components/motion/PageMotion";

/* Self-hosted at build time by next/font — no runtime request to Google. */
/* Preloaded: the two faces the first screen paints in. 300 for the display
   headline, 400 for the rest. */
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  weight: ["300", "400"],
  style: ["normal"],
  preload: true,
});

/* Not preloaded: italic appears once, in the cycle explainer, well below the
   fold. Making the browser fetch it before the hero text paints costs LCP and
   buys nothing. */
const newsreaderItalic = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader-italic",
  weight: ["400"],
  style: ["italic"],
  preload: false,
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
  // 700 is here for the crisis numbers — that is the one screen that must not
  // fall back to a synthesised bold.
  weight: ["400", "500", "600", "700"],
  preload: true,
});

/* The hand. Over the Rainbow is a genuine handwriting face — thin strokes and
   a small x-height — so it is never used at body size and never carries
   clinical content. `.ori-hand` in the token layer does the optical
   compensation; nothing should set this variable directly. */
const rainbow = Over_the_Rainbow({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rainbow",
  weight: ["400"],
  // The wordmark is set in it, and the wordmark is in the masthead, so unlike
  // the old hand this one is on the critical path.
  preload: true,
});

const SITE = "https://oriyali.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Oriyali — For one or two weeks a month, you stop being yourself",
    template: "%s · Oriyali",
  },
  description:
    "A private, gentle place to work out whether what you live through each month might be PMDD — a self-check that never leaves your device, a plain explanation of the luteal window, and how to be taken seriously by a doctor.",
  keywords: [
    "PMDD",
    "premenstrual dysphoric disorder",
    "luteal phase",
    "premenstrual",
    "PSST",
    "DRSP",
    "mood",
    "cycle tracking",
  ],
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Oriyali",
    title: "For one or two weeks a month, you stop being yourself.",
    description:
      "A private PMDD self-check that never leaves your device, and a plain explanation of what's happening in your cycle.",
  },
  twitter: {
    card: "summary_large_image",
    title: "For one or two weeks a month, you stop being yourself.",
    description:
      "A private PMDD self-check that never leaves your device, and a plain explanation of what's happening in your cycle.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6ECDB" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1A24" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Light or twilight follows the device, and only the device.
 *
 * There is no switch and nothing is remembered: a visitor who keeps their
 * phone on twilight after dark gets the lamp-turned-low register without
 * asking, and this site stores nothing at all in their browser.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${newsreaderItalic.variable} ${hanken.variable} ${rainbow.variable}`}
    >
      <body>
        <a href="#main" className="ori-skip">
          Skip to the main content
        </a>
        <PageMotion>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </PageMotion>
      </body>
    </html>
  );
}
