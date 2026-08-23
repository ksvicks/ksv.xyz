import { ImageResponse } from "next/og"
import { getAllSlugs, getPostBySlug } from "@/lib/blog"
import { formatDate, readingTime } from "@/lib/format"
import { ogCard, OG_SIZE } from "@/lib/og-card"
import { site } from "@/lib/site"

export const dynamic = "force-static"

/** One PNG per post, generated during `next build`. */
export function generateStaticParams(): { slug: string }[] {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return new Response("Not found", { status: 404 })

  return new ImageResponse(
    ogCard({
      eyebrow: `${site.domain}/blog`,
      title: post.title,
      footer: `${formatDate(post.date)} · ${readingTime(post.content)}`,
    }),
    OG_SIZE,
  )
}
