import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPostMeta {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  slug: string;
  isFeatured?: boolean; // Optional, for future use
}

const postsDirectory = path.join(process.cwd(), "blog/posts");

// ⬇ list, newest first -------------------------------------------------------
export function getAllPosts(): BlogPostMeta[] {
  return fs
    .readdirSync(postsDirectory)
    .map((filename) => {
      const filePath   = path.join(postsDirectory, filename);
      const file       = fs.readFileSync(filePath, "utf8");
      const { data }   = matter(file);

      return {
        title:   data.title,
        date:    data.date,
        summary: data.summary,
        tags:    data.tags ?? [],
        slug:    filename.replace(/\.md$/, ""),
      };
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

// ⬇ one post -----------------------------------------------------------------
export function getPostBySlug(
  slug: string
): BlogPostMeta & { content: string } {
  const filePath        = path.join(postsDirectory, `${slug}.md`);
  const file            = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);

  return {
    title:   data.title,
    date:    data.date,
    summary: data.summary,
    tags:    data.tags ?? [],
    slug,
    content,
  };
}

// ⬇ all slugs (filenames w/out ".md") ---------------------------------------
export function getAllSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .map((filename) => filename.replace(/\.md$/, ""));
}
