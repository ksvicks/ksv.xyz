import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPostMeta {
  title: string;
  date: string;
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
