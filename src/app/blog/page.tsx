import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on backend systems, debugging, self-hosting and the occasional detour — by Vignesh KS.",
  openGraph: {
    title: "Writing — Vignesh KS",
    description:
      "Notes on backend systems, debugging, self-hosting and the occasional detour.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <header className="pt-20 pb-16 md:pt-28 md:pb-20">
        <h1 className="text-[clamp(2rem,7vw,4.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.035em]">
          Writing
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Debugging, infrastructure, and things I wanted written down before I
          forgot them.
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

                {post.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="label text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
