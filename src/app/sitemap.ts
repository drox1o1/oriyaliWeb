import type { MetadataRoute } from "next";

const SITE = "https://oriyali.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/privacy", "/manifesto", "/faq", "/for-partners", "/crisis", "/terms"];
  return routes.map((route) => ({
    url: `${SITE}${route}`,
    lastModified: new Date("2026-09-04"),
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : route === "/crisis" ? 0.9 : 0.7,
  }));
}
