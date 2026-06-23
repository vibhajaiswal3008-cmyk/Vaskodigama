import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

// Preview deployments block ALL crawling so the work-in-progress site never
// appears in search results. Production keeps the normal rules.
const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "true";

export default function robots(): MetadataRoute.Robots {
  if (isPreview) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The demo application area is illustrative; keep it out of indexes.
        disallow: ["/dashboard"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
