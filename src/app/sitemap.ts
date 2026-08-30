import type { MetadataRoute } from "next"
import { getAllPosts, getAllTags, getPostsByTag } from "@/lib/blog"
import { projects } from "@/lib/projects"
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
    ...projects.map((project) => ({
      url: absolute(`/projects/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // A live demo is a destination in its own right, and ranks above the
    // detail page that describes it.
    ...projects
      .filter((project) => project.demo)
      .map((project) => ({
        url: absolute(project.demo!),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    // A tag page changes only when a post carrying that tag does, so its date
    // is the newest post in the tag — not the newest post on the site.
    ...getAllTags().map((tag) => {
      const tagged = getPostsByTag(tag.slug)?.posts ?? []
      const latest = tagged[0]
      return {
        url: absolute(`/blog/tag/${tag.slug}`),
        lastModified: latest
          ? new Date(latest.updated ?? latest.date)
          : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }
    }),
  ]
}
