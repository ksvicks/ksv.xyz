import type { Metadata } from "next"
import Link from "next/link"
import { projects } from "@/lib/projects"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Side projects and things I self-host — a Spotify web app, a home server, and this site.",
  openGraph: {
    title: "Projects — Vignesh KS",
    description:
      "Side projects and things I self-host — a Spotify web app, a home server, and this site.",
    url: "/projects",
  },
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <header className="pt-20 pb-16 md:pt-28 md:pb-20">
        <h1 className="text-[clamp(2rem,7vw,4.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.035em]">
          Projects
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Mostly evenings and weekends. Some are running, some are half-finished,
          a couple are parked.
        </p>
      </header>

      <ul>
        {projects.map((p) => (
          <li key={p.index} className="border-t border-border">
            <article className="grid grid-cols-1 gap-6 py-12 md:grid-cols-[4rem_1fr] md:gap-10">
              <p className="label pt-2 text-muted-foreground">{p.index}</p>

              <div className="max-w-2xl">
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {p.name}
                  </h2>
                  <span className="label text-muted-foreground">
                    {p.status}
                    {p.year && ` · ${p.year}`}
                  </span>
                </div>

                <p className="mt-4 text-lg leading-relaxed">{p.summary}</p>

                {p.detail && (
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {p.detail}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {p.stack.map((tech) => (
                    <span key={tech} className="label text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>

                {(p.links?.length || p.post) && (
                  <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                    {p.links?.map(({ label, href }) => (
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
                    {p.post && (
                      <Link
                        href={`/blog/${p.post}`}
                        className="label border-b-2 border-border pb-1 transition-colors hover:border-foreground"
                      >
                        Write-up
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>

      <p className="label border-t border-border py-12 text-muted-foreground">
        More at{" "}
        <a
          href="https://github.com/ksvicks"
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-border pb-0.5 transition-colors hover:border-foreground hover:text-foreground"
        >
          github.com/ksvicks
        </a>
      </p>
    </div>
  )
}
