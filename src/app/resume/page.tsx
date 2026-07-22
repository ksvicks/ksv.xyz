import type { Metadata } from "next"
import Link from "next/link"
import { site, socials } from "@/lib/site"

export const metadata: Metadata = {
  title: "CV",
  description:
    "Vignesh KS — senior software engineer and platform lead. Ten years on internet-scale SaaS: multi-tenant platforms, authentication and performance.",
  openGraph: {
    title: "CV — Vignesh KS",
    description:
      "Senior software engineer and platform lead. Ten years on internet-scale SaaS: multi-tenant platforms, authentication and performance.",
    url: "/resume",
  },
}

/* Content below is transcribed from Vignesh KS's resume. */

const skills = [
  {
    group: "Backend",
    items: ["Java", "REST APIs", "Kafka", "Redis", "MySQL", "Microservices", "HBase"],
  },
  { group: "Frontend", items: ["JavaScript", "React"] },
  {
    group: "Platform & infra",
    items: ["CDN", "Authentication & authorisation", "CI/CD", "Multi-tenant architecture"],
  },
]

interface Role {
  title: string
  points: string[]
}

interface Position {
  company: string
  title: string
  period: string
  roles: Role[]
}

const experience: Position[] = [
  {
    company: "Zoho Corporation",
    title: "Member Technical Staff",
    period: "May 2017 — Present",
    roles: [
      {
        title: "Client Portal Platform — Lead Engineer / Platform Owner",
        points: [
          "Lead development of a SaaS Client Portal platform for Zoho Desk customers, letting internal modules such as Community and Knowledge Base run on a shared hosting, theming and authentication layer.",
          "Architected and maintain a multi-tenant, highly available platform with global deployments.",
          "Implemented enterprise authentication — SAML, JWT, OIDC and federated login — with the IAM team, enabling SSO across modules.",
          "Migrated static resources to CDN-backed distributed hosting, improving load times and reducing backend load.",
          "Led SEO work: sitemaps, Open Graph, canonical URLs and 301 redirections.",
          "Integrated SMS-based authentication and compatibility with multiple identity sources.",
          "Drove unification of Client Portal models across Zoho products for shared authentication and a consistent experience.",
          "Worked with DevOps to deploy across multiple data centres — network troubleshooting, custom CNAME mapping and endpoint continuity.",
          "Monitor platform performance, availability and network health, resolving production issues with cross-functional teams.",
          "Run architecture and code reviews, and mentor a team of four engineers.",
        ],
      },
      {
        title: "Community SaaS Product — Full-Stack Engineer",
        points: [
          "Built and maintained a large-scale Stack Overflow-style SaaS application for customer communities.",
          "Developed 100+ REST APIs serving 1M+ requests a day, tuned with Redis caching, Kafka async processing and SQL optimisation.",
          "Shipped @mentions, Lucene-powered search improvements and multi-theme UI work in React.",
          "Built email notification pipelines on schedulers and Kafka.",
          "Created usage-analytics dashboards for customers.",
          "Implemented browser caching and SEO work — sitemaps, Open Graph and metadata.",
          "Executed cross-product data migrations with zero downtime.",
          "Added unit-test coverage that enabled the team's move to CI/CD.",
        ],
      },
    ],
  },
  {
    company: "Tata Consultancy Services",
    title: "Assistant System Engineer",
    period: "Jun 2015 — Apr 2017",
    roles: [
      {
        title: "Underwriting platform — US health insurance client",
        points: [
          "Maintained the platform's availability and reliability.",
          "Worked directly with users on requirements and extended the applications in Java.",
          "Generated statistical data in CSV to support underwriters, streamlining the process and improving accuracy.",
        ],
      },
    ],
  },
]

/** Swiss two-column row: mono label left, content right. */
function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="grid grid-cols-1 gap-6 border-t border-border py-12 md:grid-cols-[10rem_1fr] md:gap-10">
      <h2 className="label pt-1 text-muted-foreground">{label}</h2>
      <div className="max-w-2xl">{children}</div>
    </section>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-6 leading-relaxed text-muted-foreground">
      <span
        aria-hidden="true"
        className="absolute left-0 top-[0.6em] h-[0.3em] w-[0.3em] bg-foreground"
      />
      {children}
    </li>
  )
}

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <header className="pt-20 pb-16 md:pt-28 md:pb-20">
        <p className="label text-muted-foreground">Curriculum vitae</p>
        <h1 className="mt-8 text-[clamp(2.5rem,8vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.035em]">
          {site.name}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          {site.role} · {site.location}
        </p>

        <nav className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {socials.map(({ label, href }) => {
            const external = !href.startsWith("mailto:")
            return (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="label border-b-2 border-transparent pb-1 transition-colors hover:border-foreground"
              >
                {label}
              </a>
            )
          })}
        </nav>
      </header>

      <Row label="Summary">
        <p className="text-lg leading-relaxed">
          Senior software engineer and platform lead with ten years building and
          scaling internet-scale SaaS platforms. I currently lead a team of six
          across multi-tenant platform work at Zoho, covering delivery,
          architecture reviews and mentoring. Most of my depth is in Java
          distributed systems, authentication platforms and performance.
        </p>
      </Row>

      <Row label="Experience">
        <div className="space-y-14">
          {experience.map(({ company, title, period, roles }) => (
            <div key={company}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-xl font-bold tracking-tight">{company}</h3>
                <span className="label text-muted-foreground">{period}</span>
              </div>
              <p className="label mt-2 text-muted-foreground">{title}</p>

              <div className="mt-7 space-y-9">
                {roles.map((role) => (
                  <div key={role.title}>
                    <h4 className="font-bold tracking-tight">{role.title}</h4>
                    <ul className="mt-4 space-y-3">
                      {role.points.map((point) => (
                        <Bullet key={point}>{point}</Bullet>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Row>

      <Row label="Skills">
        <dl className="space-y-5">
          {skills.map(({ group, items }) => (
            <div
              key={group}
              className="grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-6"
            >
              <dt className="label pt-[0.2rem] text-muted-foreground">{group}</dt>
              <dd className="leading-relaxed">{items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </Row>

      <Row label="Education">
        <h3 className="font-bold tracking-tight">
          B.E. Electrical &amp; Electronics Engineering
        </h3>
        <p className="mt-1 leading-relaxed text-muted-foreground">
          National Engineering College, Anna University — CGPA 8.7
        </p>
        <p className="label mt-2 text-muted-foreground">Aug 2011 — Apr 2015</p>
      </Row>

      <Row label="Awards">
        <h3 className="font-bold tracking-tight">ILP Kudos, 2015</h3>
        <p className="mt-1 leading-relaxed text-muted-foreground">
          Tata Consultancy Services — best performance in the learners&apos;
          group during training.
        </p>
      </Row>

      <Row label="Side work">
        <p className="leading-relaxed text-muted-foreground">
          Self-hosting, a Spotify-connected web app and a few smaller things are
          over on{" "}
          <Link
            href="/projects"
            className="border-b border-border pb-0.5 text-foreground transition-colors hover:border-foreground"
          >
            projects
          </Link>
          .
        </p>
      </Row>
    </div>
  )
}
