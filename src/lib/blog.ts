import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPostMeta {
  title: string;
  date: string;
  /** Optional `updated:` frontmatter. Feeds `dateModified` for search engines
      and `lastModified` in the sitemap; falls back to `date` when absent. */
  updated?: string;
  summary: string;
  tags: string[];
  slug: string;
}

export type BlogPost = BlogPostMeta & { content: string };

const postsDirectory = path.join(process.cwd(), "blog/posts");

function isMarkdown(filename: string): boolean {
  return filename.endsWith(".md") || filename.endsWith(".mdx");
}

function toMeta(filename: string, data: Record<string, unknown>): BlogPostMeta {
  return {
    title: (data.title as string) ?? "Untitled",
    date: (data.date as string) ?? "",
    updated: (data.updated as string) || undefined,
    summary: (data.summary as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    slug: filename.replace(/\.mdx?$/, ""),
  };
}

// ⬇ list, newest first -------------------------------------------------------
export function getAllPosts(): BlogPostMeta[] {
  return fs
    .readdirSync(postsDirectory)
    .filter(isMarkdown)
    .map((filename) => {
      const file = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
      return toMeta(filename, matter(file).data);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ⬇ one post — returns null for unknown slugs so callers can 404 ------------
export function getPostBySlug(slug: string): BlogPost | null {
  // Guard against traversal: slugs come from the URL.
  if (!/^[a-zA-Z0-9._-]+$/.test(slug)) return null;

  const filePath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  return { ...toMeta(`${slug}.md`, data), content };
}

// ⬇ all slugs (filenames w/out extension) -----------------------------------
export function getAllSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter(isMarkdown)
    .map((filename) => filename.replace(/\.mdx?$/, ""));
}

/* -------------------------------------------------------------------------- */
/* Tags                                                                       */
/* -------------------------------------------------------------------------- */

export interface Tag {
  /** The label as written in frontmatter, e.g. "Claude Code". */
  label: string;
  /** URL-safe form, e.g. "claude-code". */
  slug: string;
  count: number;
}

/**
 * Tags are free text in frontmatter, so they can contain anything — spaces,
 * dots, even a slash ("shadcn/ui"). Everything outside a-z0-9 collapses to a
 * single hyphen so the result is always safe in a path segment.
 */
export function slugifyTag(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Every tag in use, most-used first, then alphabetical for a stable order. */
export function getAllTags(): Tag[] {
  const byslug = new Map<string, Tag>();

  for (const post of getAllPosts()) {
    for (const label of post.tags) {
      const slug = slugifyTag(label);
      if (!slug) continue;

      const existing = byslug.get(slug);
      // First spelling wins the display label. Two tags can only land on the
      // same slug if they were near-identical to begin with.
      if (existing) existing.count += 1;
      else byslug.set(slug, { label, slug, count: 1 });
    }
  }

  return [...byslug.values()].sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );
}

/** Posts carrying a tag, newest first. Returns null for an unknown slug. */
export function getPostsByTag(
  slug: string,
): { tag: Tag; posts: BlogPostMeta[] } | null {
  const tag = getAllTags().find((t) => t.slug === slug);
  if (!tag) return null;

  const posts = getAllPosts().filter((post) =>
    post.tags.some((label) => slugifyTag(label) === slug),
  );

  return { tag, posts };
}

/* -------------------------------------------------------------------------- */
/* Adjacent posts                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Neighbours in the reverse-chronological list.
 *
 * "prev" is the older post and "next" the newer one — reading order, not array
 * order, which is why they look reversed against the newest-first sort.
 */
export function getAdjacentPosts(slug: string): {
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
} {
  const posts = getAllPosts();
  const i = posts.findIndex((post) => post.slug === slug);

  if (i === -1) return { prev: null, next: null };

  return {
    prev: posts[i + 1] ?? null,
    next: posts[i - 1] ?? null,
  };
}
