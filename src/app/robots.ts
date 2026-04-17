import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/urls";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // Policy page has noindex meta already. Keeping /policy crawlable so
    // Google actually sees the noindex directive (Disallow would block crawl
    // and Google might index the URL anyway from external links).
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ""),
  };
}
