import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk, Over_the_Rainbow } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";
import { PageMotion } from "@/components/motion/PageMotion";
import { SITE } from "@/lib/site";
import { SiteStructuredData } from "@/components/StructuredData";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE),

  /* Titles are written for a results page, not for a browser tab: the useful
     half first, because Google truncates somewhere around sixty characters
     and the brand is the part a reader can afford to lose. */
  title: {
    default: "PMDD self-check — see your next hard week before it arrives",
    template: "%s · Oriyali",
  },
  description:
    "A private place to work out whether what you live through each month might be PMDD. A four-minute self-check that never leaves your device, a plain explanation of the luteal window, and how to be taken seriously by a doctor.",

  applicationName: "Oriyali",
  authors: [{ name: "Oriyali" }],
  creator: "Oriyali",
  publisher: "Oriyali",
  category: "health",
  keywords: [
    "PMDD",
    "premenstrual dysphoric disorder",
    "PMDD test",
    "PMDD symptoms",
    "PMDD or PMS",
    "luteal phase",
    "premenstrual",
    "PSST",
    "DRSP",
    "cycle tracking",
  ],

  /* Every page names itself, so a link with a tracking parameter on it never
     splits into a second, competing result. */
  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Oriyali",
    locale: "en_GB",
    title: "See your next hard week before it arrives.",
    description:
      "A private PMDD self-check that never leaves your device, and a plain explanation of what's happening across a month.",
  },
  twitter: {
    card: "summary_large_image",
    title: "See your next hard week before it arrives.",
    description:
      "A private PMDD self-check that never leaves your device, and a plain explanation of what's happening across a month.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      /* A card about a mood disorder is worth more as a picture and a
         paragraph than as a favicon and a clipped sentence. */
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  /* No `icons` block: favicon.ico, icon.tsx and apple-icon.tsx are picked up
     by convention and emit their own links. Declaring them here *replaces*
     that set rather than adding to it, which silently drops the generated
     PNG. Android reads the larger sizes from the manifest. */
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
        <SiteStructuredData />
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
