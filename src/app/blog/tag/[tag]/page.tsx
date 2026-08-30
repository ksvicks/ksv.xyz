import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { absolute, alternatesFor } from "@/lib/seo";
import { site } from "@/lib/site";

export function generateStaticParams(): { tag: string }[] {
  return getAllTags().map(({ slug }) => ({ tag: slug }));
}

type Params = { tag: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { tag: slug } = await params;
  const found = getPostsByTag(slug);

  if (!found) return { title: "Tag not found", robots: { index: false } };

  const { tag, posts } = found;
  const description = `${posts.length} ${
    posts.length === 1 ? "post" : "posts"
  } tagged ${tag.label} — by ${site.name}.`;

  return {
    title: `${tag.label} — Writing`,
    description,
    alternates: alternatesFor(`/blog/tag/${tag.slug}`),
    openGraph: {
      type: "website",
      title: `${tag.label} — Writing`,
      description,
      url: `/blog/tag/${tag.slug}`,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { tag: slug } = await params;
  const found = getPostsByTag(slug);

  if (!found) notFound();

  const { tag, posts } = found;

  /* CollectionPage rather than Blog: this is a filtered view of the blog, not
     a second blog. The `Blog` entity itself stays on /blog. */
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tag.label} — Writing`,
    url: absolute(`/blog/tag/${tag.slug}`),
    isPartOf: { "@id": absolute("/blog#blog") },
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: post.title,
        url: absolute(`/blog/${post.slug}`),
      })),
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <JsonLd data={schema} />

      <header className="pt-20 pb-16 md:pt-28 md:pb-20">
        <p className="label text-muted-foreground">
          <Link href="/blog" className="transition-colors hover:text-foreground">
            Writing
          </Link>
        </p>

        <h1 className="mt-6 text-[clamp(2rem,7vw,4.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.035em]">
          {tag.label}
        </h1>

        <p className="mt-8 label text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </header>

      <ul className="pb-12">
        {posts.map((post) => (
          <li key={post.slug} className="border-t border-border">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 py-10 md:flex-row md:gap-10"
            >
              <time
                dateTime={post.date}
                className="label shrink-0 pt-1 text-muted-foreground md:w-40"
              >
                {formatDate(post.date)}
              </time>

              <div className="min-w-0 max-w-2xl">
                <h2 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-muted-foreground md:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {post.summary}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <nav className="border-t border-border pt-8">
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
