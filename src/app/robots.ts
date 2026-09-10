import type { MetadataRoute } from "next";
import { url } from "@/lib/site";

/**
 * Everything is crawlable except the waitlist endpoint, which is a POST
 * handler and has nothing to read. There is no analytics, no search and no
 * user-generated content here, so there is nothing else to keep out.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: url("/sitemap.xml"),
    host: url(),
  };
}
