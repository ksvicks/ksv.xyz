import { getAllPosts } from "@/lib/blog"
import { absolute } from "@/lib/seo"
import { site } from "@/lib/site"

export const dynamic = "force-static"

/** XML has exactly five entities. Titles come from frontmatter, so escape all. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/** RSS 2.0 requires RFC-822 dates, not ISO. */
function rfc822(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? "" : d.toUTCString()
}

export function GET(): Response {
  const posts = getAllPosts()
  const feedUrl = absolute("/feed.xml")
  const title = `${site.name} — Writing`
  const description =
    "Notes on backend systems, debugging, self-hosting and the occasional detour."

  const items = posts
    .map((post) => {
      const url = absolute(`/blog/${post.slug}`)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.updated ?? post.date)}</pubDate>
      <description>${escapeXml(post.summary)}</description>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${absolute("/blog")}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
