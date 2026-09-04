import type { Metadata, Viewport } from "next";
import { Newsreader, Hanken_Grotesk, Shantell_Sans } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

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

const shantell = Shantell_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-shantell",
  weight: ["400"],
  // The hand is seasoning, not the meal. It can arrive a moment late.
  preload: false,
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

/* Applies a saved theme choice before first paint, so the page never flashes.
   Reads only a light/dark preference. Nothing else is stored, ever. */
const themeScript = `(function(){try{var t=localStorage.getItem("oriyali-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${newsreaderItalic.variable} ${hanken.variable} ${shantell.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="ori-skip">
          Skip to the main content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
