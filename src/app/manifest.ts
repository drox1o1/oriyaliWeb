import type { MetadataRoute } from "next";

/**
 * The web app manifest.
 *
 * Not because this should be installed as an app — the app is on the App
 * Store — but because it is what Android and Chrome read for the icon, the
 * name and the colour to paint round the page. Without it, a phone that saves
 * this to a home screen invents a grey screenshot and calls it "oriyali.com".
 *
 * The icons are the committed PNGs in /public/brand rather than generated
 * routes, because a manifest needs a URL that survives a redeploy. Regenerate
 * them with `node scripts/build-brand-assets.mjs`.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oriyali — a PMDD companion",
    short_name: "Oriyali",
    description:
      "A private place to work out whether the fortnight you lose each month might be PMDD, and to keep the daily record a doctor will accept.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6ECDB",
    theme_color: "#F6ECDB",
    lang: "en",
    dir: "ltr",
    categories: ["health", "medical", "lifestyle"],
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/brand/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "If you're struggling right now",
        short_name: "Crisis lines",
        url: "/crisis",
      },
    ],
  };
}
