import { getPostBySlug, getAllSlugs } from "@/lib/blog"
import ReactMarkdown from "react-markdown"
import { Separator } from "@/components/ui/separator"

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

export default function BlogDetail({ params }: { params: { slug: string } }) {
  const { title, date, content, tags } = getPostBySlug(params.slug)

  return (
    <article className="prose dark:prose-invert max-w-3xl mx-auto py-16 px-6 space-y-8">
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          {new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-4xl font-bold text-primary mb-2">{title}</h1>
      </div>
     

      <div className="flex flex-wrap gap-2">
        {tags?.map(tag => (
          <span
            key={tag}
            className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
 <Separator/>
      <div className="prose dark:prose-invert max-w-none pt-6">
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
