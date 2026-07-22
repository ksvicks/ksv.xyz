// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { formatDate, readingTime } from "@/lib/format";
import { site } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/* Static generation                                                          */
/* -------------------------------------------------------------------------- */
export function generateStaticParams(): { slug: string }[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

type Params = { slug: string };

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

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [site.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
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

  const { title, date, content, tags } = post;

  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10">
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
                <span key={tag} className="label text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <hr className="my-12 border-border" />

        <div className="article">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>

      <nav className="mt-20 border-t border-border pt-8">
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
