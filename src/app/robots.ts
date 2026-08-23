import type { MetadataRoute } from "next"
import { absolute } from "@/lib/seo"
import { site } from "@/lib/site"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Next's build artefacts. Nothing user-facing lives here, and crawling
      // them only wastes crawl budget.
      disallow: ["/_next/"],
    },
    sitemap: absolute("/sitemap.xml"),
    host: site.url,
  }
}
