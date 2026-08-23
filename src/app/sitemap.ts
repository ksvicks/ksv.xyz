import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog"
import { absolute } from "@/lib/seo"
import { site } from "@/lib/site"

/**
 * Posts are read from disk at build time, so the sitemap is static too.
 * Without this, Next treats the `fs` access as dynamic and skips prerendering.
 */
export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  /** Newest post date — the honest "last changed" signal for the two pages
      that list posts. Static pages get no date rather than a fabricated one. */
  const newest = posts[0] ? new Date(posts[0].updated ?? posts[0].date) : undefined

  return [
    {
      // `site.url` rather than absolute("/") so this matches the home page's
      // canonical byte for byte — no trailing slash.
      url: site.url,
      lastModified: newest,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absolute("/blog"),
      lastModified: newest,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absolute("/projects"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absolute("/resume"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: absolute(`/blog/${post.slug}`),
      lastModified: new Date(post.updated ?? post.date),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ]
}
