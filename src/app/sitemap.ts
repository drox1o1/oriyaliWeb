import type { MetadataRoute } from "next";
import { url } from "@/lib/site";

/**
 * Priority here is an argument about what this site is for, not a ranking
 * lever: the homepage carries the whole story, and the crisis page sits just
 * under it because it is the one page whose usefulness is measured in minutes.
 */
const PAGES: { path: string; priority: number; changes: "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changes: "monthly" },
  { path: "/crisis", priority: 0.9, changes: "yearly" },
  { path: "/faq", priority: 0.8, changes: "monthly" },
  { path: "/manifesto", priority: 0.7, changes: "yearly" },
  { path: "/for-partners", priority: 0.7, changes: "yearly" },
  { path: "/privacy", priority: 0.6, changes: "yearly" },
  { path: "/terms", priority: 0.4, changes: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-06");
  return PAGES.map(({ path, priority, changes }) => ({
    url: url(path),
    lastModified,
    changeFrequency: changes,
    priority,
  }));
}
