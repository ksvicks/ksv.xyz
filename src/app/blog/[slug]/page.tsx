// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import JsonLd from "@/components/JsonLd";
import {
  getPostBySlug,
  getAllSlugs,
  getAdjacentPosts,
  slugifyTag,
} from "@/lib/blog";
import { formatDate, readingTime } from "@/lib/format";
import { absolute, alternatesFor } from "@/lib/seo";
import { site } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/* Static generation                                                          */
/* -------------------------------------------------------------------------- */
export function generateStaticParams(): { slug: string }[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

type Params = { slug: string };

/**
 * Heading anchors.
 *
 * `rehype-slug` gives every heading an id; the autolink plugin wraps the text
 * in a self-link so the heading is shareable and Google can offer a jump link
 * straight into a section. `behavior: "wrap"` keeps the markup clean — no
 * stray "#" character in the reading flow or in the RSS summary.
 */
const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    { behavior: "wrap", properties: { className: "heading-anchor" } },
  ],
] as const;

/* -------------------------------------------------------------------------- */
/* Per-post metadata — this is what makes a shared link render a real card.   */
/* -------------------------------------------------------------------------- */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // A missing post 404s, so keep it out of the index rather than letting the
  // crawler bank a soft-404 under this URL.
  if (!post) return { title: "Post not found", robots: { index: false } };

  const image = `/blog/${post.slug}/og.png`;

  return {
    title: post.title,
    description: post.summary,
    alternates: alternatesFor(`/blog/${post.slug}`),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [site.name],
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [image],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Page component                                                             */
/* -------------------------------------------------------------------------- */
export default async function BlogDetail({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const { title, date, updated, content, tags } = post;
  const { prev, next } = getAdjacentPosts(slug);
  const url = absolute(`/blog/${slug}`);

  /* BlogPosting is what earns the article treatment in search results;
     BreadcrumbList is what turns the URL line into "ksv.xyz › Writing › …". */
  const postSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        headline: title,
        description: post.summary,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        datePublished: date,
        dateModified: updated ?? date,
        keywords: tags,
        wordCount: content.trim().split(/\s+/).length,
        inLanguage: "en",
        image: absolute(`/blog/${slug}/og.png`),
        author: { "@type": "Person", name: site.name, url: site.url },
        publisher: { "@type": "Person", name: site.name, url: site.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Writing",
            item: absolute("/blog"),
          },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10">
      <JsonLd data={postSchema} />

      <article className="pt-20 md:pt-28">
        <header>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <time dateTime={date} className="label text-muted-foreground">
              {formatDate(date)}
            </time>
            <span className="label text-muted-foreground">
              {readingTime(content)}
            </span>
          </div>

          <h1 className="mt-6 text-[clamp(2rem,6vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.035em]">
            {title}
          </h1>

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${slugifyTag(tag)}`}
                  className="label text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <hr className="my-12 border-border" />

        <div className="article">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={rehypePlugins as never}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>

      {(prev || next) && (
        <nav
          aria-label="More posts"
          className="mt-20 grid grid-cols-1 gap-px border-t border-border bg-border sm:grid-cols-2"
        >
          {/* Each cell keeps its background so the 1px grid gap reads as a
              rule between them. An empty cell still holds the column. */}
          <div className="bg-background">
            {prev && (
              <Link href={`/blog/${prev.slug}`} className="group block py-8 pr-6">
                <span className="label text-muted-foreground">← Older</span>
                <span className="mt-3 block text-lg font-bold tracking-tight transition-colors group-hover:text-muted-foreground">
                  {prev.title}
                </span>
              </Link>
            )}
          </div>

          <div className="bg-background sm:text-right">
            {next && (
              <Link href={`/blog/${next.slug}`} className="group block py-8 sm:pl-6">
                <span className="label text-muted-foreground">Newer →</span>
                <span className="mt-3 block text-lg font-bold tracking-tight transition-colors group-hover:text-muted-foreground">
                  {next.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}

      <nav className="mt-8 border-t border-border pt-8">
        <Link
          href="/blog"
          className="label text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All writing
        </Link>
      </nav>
    </div>
  );
}
