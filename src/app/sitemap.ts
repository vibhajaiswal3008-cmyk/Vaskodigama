import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

const routes = [
  "",
  "/platform",
  "/solutions/exporters",
  "/solutions/importers",
  "/solutions/market-research",
  "/solutions/procurement",
  "/industries",
  "/data",
  "/demo",
  "/search-results",
  "/resources",
  "/about",
  "/contact",
  "/login",
  "/register",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
