import { getAllPosts } from "@/lib/blog";
import Link from "next/link";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="max-w-4xl mx-auto py-12 px-4 space-y-10">
      <h1 className="text-5xl font-extrabold tracking-tight">Blog</h1>

      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="block border-b pb-6 mb-8 space-y-4 transition-colors hover:bg-muted rounded-md px-4 py-2"
        >
          <p className="text-muted-foreground text-sm">
            {new Date(post.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <h2 className="text-2xl font-bold text-primary">{post.title}</h2>
          <p className="text-muted-foreground text-base">{post.summary}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted px-2 py-1 rounded-full text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </section>
  );
}
