import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface BlogPostMeta {
  title: string
  date: string
  summary: string
  tags: string[]
  slug: string
}

const postsDirectory = path.join(process.cwd(), "blog/posts")

export function getAllPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(postsDirectory)

  return files.map(filename => {
    const filePath = path.join(postsDirectory, filename)
    const fileContent = fs.readFileSync(filePath, "utf8")
    const { data } = matter(fileContent)

    return {
      title: data.title,
      date: data.date,
      summary: data.summary,
      slug: filename.replace(/\\.md$/, ""),
      tags: data.tags || []
    }
  }).sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())
}

export function getPostBySlug(slug: string): BlogPostMeta & { content: string } {
  const filePath = path.join(postsDirectory, `${slug}.md`)
  const fileContent = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContent)

  return {
    title: data.title,
    date: data.date,
    summary: data.summary,
    slug,
    content,
    tags: data.tags || []
  }
}

export function getAllSlugs(): string[] {
  return fs.readdirSync(postsDirectory).map(filename => filename.replace(/\\.md$/, ""))
}
