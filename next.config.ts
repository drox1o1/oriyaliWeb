import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isDev = process.env.NODE_ENV === "development";

/* Next's dev server compiles with eval-based source maps, so development needs
   'unsafe-eval'. Production does not, and does not get it. */
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  poweredByHeader: false,

  /* The share cards read their two typefaces off disk at build time. File
     tracing cannot see a path built with `join()`, so it is named here — a
     card rendered without them falls back to a system face and stops looking
     like the site. */
  outputFileTracingIncludes: {
    "/**": ["./src/app/_og-fonts/**"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          /* No third-party scripts exist here; this makes that enforceable. */
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "font-src 'self'",
              isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default createMDX({})(nextConfig);
