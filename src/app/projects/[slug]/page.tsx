import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import JsonLd from "@/components/JsonLd"
import { getPostBySlug } from "@/lib/blog"
import { projects, getProjectBySlug } from "@/lib/projects"
import { absolute, alternatesFor } from "@/lib/seo"
import { site } from "@/lib/site"

export function generateStaticParams(): { slug: string }[] {
  return projects.map(({ slug }) => ({ slug }))
}

type Params = { slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) return { title: "Project not found", robots: { index: false } }

  return {
    title: project.name,
    description: project.summary,
    alternates: alternatesFor(`/projects/${project.slug}`),
    openGraph: {
      type: "website",
      title: `${project.name} — ${site.name}`,
      description: project.summary,
      url: `/projects/${project.slug}`,
    },
  }
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) notFound()

  const { name, summary, detail, stack, status, year, links, post, demo } =
    project
  const url = absolute(`/projects/${slug}`)

  // Only resolve the write-up if the markdown file is really there, so a stale
  // `post:` slug shows nothing rather than linking into a 404.
  const writeUp = post ? getPostBySlug(post) : null
  const source = links?.find((link) => link.href.includes("github.com"))

  const schema = {
    "@context": "https://schema.org",
    // Every entry here is code, so SoftwareSourceCode is the honest type even
    // when the repo is private and there is no link to give.
    "@type": "SoftwareSourceCode",
    name,
    description: detail ?? summary,
    url,
    ...(source ? { codeRepository: source.href } : {}),
    programmingLanguage: stack,
    ...(year ? { dateCreated: year } : {}),
    author: { "@type": "Person", name: site.name, url: site.url },
    ...(writeUp
      ? { subjectOf: { "@type": "BlogPosting", url: absolute(`/blog/${post}`) } }
      : {}),
    // A runnable copy is a different thing from the source, so it is its own
    // node rather than another `url` on this one.
    ...(demo
      ? {
          workExample: {
            "@type": "WebApplication",
            name: `${name} — live demo`,
            applicationCategory: "https://schema.org/BrowserApplication",
            url: absolute(demo),
          },
        }
      : {}),
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: absolute("/projects"),
      },
      { "@type": "ListItem", position: 3, name, item: url },
    ],
  }

  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumb} />

      <article className="pt-20 md:pt-28">
        <header>
          <p className="label text-muted-foreground">
            <Link
              href="/projects"
              className="transition-colors hover:text-foreground"
            >
              Projects
            </Link>
          </p>

          <h1 className="mt-6 text-[clamp(2rem,6vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.035em]">
            {name}
          </h1>

          <p className="mt-6 label text-muted-foreground">
            {status}
            {year && ` · ${year}`}
          </p>

          <p className="mt-8 text-lg leading-relaxed">{summary}</p>
        </header>

        <hr className="my-12 border-border" />

        {detail && (
          <p className="text-lg leading-relaxed text-muted-foreground">
            {detail}
          </p>
        )}

        <section className="mt-12">
          <h2 className="label text-muted-foreground">Stack</h2>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {stack.map((tech) => (
              <li key={tech} className="label">
                {tech}
              </li>
            ))}
          </ul>
        </section>

        {demo && (
          <Link
            href={demo}
            className="mt-12 flex items-baseline justify-between gap-6 border border-border p-6 transition-colors hover:border-foreground"
          >
            <span>
              <span className="label text-muted-foreground">Try it</span>
              <span className="mt-2 block text-lg font-bold tracking-tight">
                Run the search yourself
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Loads in the browser. No sign-up, nothing to install.
              </span>
            </span>
            <span aria-hidden className="text-2xl leading-none">
              →
            </span>
          </Link>
        )}

        {(links?.length || writeUp) && (
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {links?.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="label border-b-2 border-border pb-1 transition-colors hover:border-foreground"
              >
                {label} ↗
              </a>
            ))}
            {writeUp && (
              <Link
                href={`/blog/${post}`}
                className="label border-b-2 border-border pb-1 transition-colors hover:border-foreground"
              >
                Write-up: {writeUp.title}
              </Link>
            )}
          </div>
        )}
      </article>

      <nav className="mt-20 border-t border-border pt-8">
        <Link
          href="/projects"
          className="label text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All projects
        </Link>
      </nav>
    </div>
  )
}
