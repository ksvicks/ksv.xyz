import Image from "next/image"
import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import { projects } from "@/lib/projects"
import { site } from "@/lib/site"
import { formatDate } from "@/lib/format"

const work = [
  {
    company: "Zoho Corporation",
    period: "May 2017 — Present",
    role: "Member Technical Staff. Client Portal platform, and before that a community SaaS product.",
  },
  {
    company: "Tata Consultancy Services",
    period: "Jun 2015 — Apr 2017",
    role: "Assistant System Engineer. Underwriting platform for a US health insurance client.",
  },
]

export default function Home() {
  const posts = getAllPosts().slice(0, 3)
  const selected = projects.slice(0, 3)

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      {/* ---------------------------------------------------------------- */}
      {/* Intro                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="grid grid-cols-1 items-center gap-14 pt-20 pb-20 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16 md:pt-32 md:pb-28">
        <div>
          <h1 className="text-[clamp(2rem,6.5vw,4.75rem)] font-bold uppercase leading-[0.9] tracking-[-0.035em]">
            {site.name}
          </h1>

          <div className="mt-10 max-w-xl space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Software engineer and platform lead. I work on backend systems —
              mostly Java, Kafka, Redis and MySQL — and I&apos;ve spent the last
              nine years at Zoho, currently on a multi-tenant Client Portal
              platform.
            </p>
            <p>
              Outside of that I self-host things on a second-hand thin client
              and write the occasional note about what broke.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/projects"
              className="label border-b-2 border-foreground pb-1"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="label border-b-2 border-transparent pb-1 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              Writing
            </Link>
            <Link
              href="/resume"
              className="label border-b-2 border-transparent pb-1 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              CV
            </Link>
            <a
              href={`mailto:${site.email}`}
              className="label border-b-2 border-transparent pb-1 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              Email
            </a>
          </div>
        </div>

        {/* Fills the empty right half of the hero. Decorative — the h1 above
            already states the name — and hidden on mobile, where the nav mark
            is a few pixels away and the column would just stack awkwardly. */}
        <div className="hidden md:block md:justify-self-end">
          <Image
            src="/ksv.png"
            alt=""
            width={716}
            height={292}
            priority
            className="w-[min(34vw,440px)] logo-adaptive"
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Work                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="rule py-16 md:py-20">
        <h2 className="label text-muted-foreground">Work</h2>

        <dl className="mt-10 space-y-8">
          {work.map(({ company, period, role }) => (
            <div
              key={company}
              className="grid grid-cols-1 gap-1 md:grid-cols-[14rem_1fr] md:gap-10"
            >
              <dt className="label pt-1 text-muted-foreground">{period}</dt>
              <dd>
                <span className="block font-bold tracking-tight">{company}</span>
                <span className="mt-1 block leading-relaxed text-muted-foreground">
                  {role}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Selected projects                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="rule py-16 md:py-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="label text-muted-foreground">Projects</h2>
          <Link
            href="/projects"
            className="label text-muted-foreground transition-colors hover:text-foreground"
          >
            All projects →
          </Link>
        </div>

        <ul className="mt-10">
          {selected.map((p) => (
            <li key={p.index} className="border-t border-border">
              <Link
                href="/projects"
                className="group grid grid-cols-1 gap-2 py-8 md:grid-cols-[14rem_1fr] md:gap-10"
              >
                <span className="label pt-1 text-muted-foreground">
                  {p.status}
                  {p.year && ` · ${p.year}`}
                </span>
                <span className="min-w-0">
                  <span className="block text-xl font-bold tracking-tight transition-colors group-hover:text-muted-foreground md:text-2xl">
                    {p.name}
                  </span>
                  <span className="mt-2 block max-w-2xl leading-relaxed text-muted-foreground">
                    {p.summary}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Recent writing                                                   */}
      {/* ---------------------------------------------------------------- */}
      {posts.length > 0 && (
        <section className="rule py-16 md:py-20">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="label text-muted-foreground">Writing</h2>
            <Link
              href="/blog"
              className="label text-muted-foreground transition-colors hover:text-foreground"
            >
              All posts →
            </Link>
          </div>

          <ul className="mt-10">
            {posts.map((post) => (
              <li key={post.slug} className="border-t border-border">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-1 gap-2 py-8 md:grid-cols-[14rem_1fr] md:gap-10"
                >
                  <time
                    dateTime={post.date}
                    className="label pt-1 text-muted-foreground"
                  >
                    {formatDate(post.date)}
                  </time>
                  <span className="min-w-0">
                    <span className="block text-xl font-bold tracking-tight transition-colors group-hover:text-muted-foreground md:text-2xl">
                      {post.title}
                    </span>
                    <span className="mt-2 block max-w-2xl leading-relaxed text-muted-foreground">
                      {post.summary}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Contact                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="rule py-16 md:py-20">
        <h2 className="label text-muted-foreground">Get in touch</h2>
        <a
          href={`mailto:${site.email}`}
          className="mt-6 inline-block text-xl font-bold tracking-tight transition-colors hover:text-muted-foreground md:text-2xl"
        >
          {site.email}
        </a>
      </section>
    </div>
  )
}
