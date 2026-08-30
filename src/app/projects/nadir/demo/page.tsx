import type { Metadata } from "next"
import Link from "next/link"
import JsonLd from "@/components/JsonLd"
import NadirDemo from "@/components/nadir/NadirDemo"
import { getProjectBySlug } from "@/lib/projects"
import { absolute, alternatesFor } from "@/lib/seo"
import { site } from "@/lib/site"

const SUMMARY =
  "A proof of concept. Pick a square kilometre of Tirunelveli district and " +
  "see the ten that look most like it. 1050 Sentinel-2 squares, compared in " +
  "the browser."

export const metadata: Metadata = {
  title: "Nadir — live demo",
  description: SUMMARY,
  alternates: alternatesFor("/projects/nadir/demo"),
  openGraph: {
    type: "website",
    title: `Nadir, live — ${site.name}`,
    description: SUMMARY,
    url: "/projects/nadir/demo",
  },
}

/** The panel is the point of the page, so it gets a wider grid than the
    6xl the rest of the site reads at — a map needs the horizontal room. */
export default function NadirDemoPage() {
  const project = getProjectBySlug("nadir")

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Nadir",
    applicationCategory: "https://schema.org/BrowserApplication",
    operatingSystem: "Any",
    description: SUMMARY,
    url: absolute("/projects/nadir/demo"),
    author: { "@type": "Person", name: site.name, url: site.url },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  }

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-10">
      <JsonLd data={schema} />

      <header className="pt-20 pb-10 md:pt-28 md:pb-14">
        <p className="label text-muted-foreground">
          <Link
            href="/projects"
            className="transition-colors hover:text-foreground"
          >
            Projects
          </Link>
          {" / "}
          <Link
            href="/projects/nadir"
            className="transition-colors hover:text-foreground"
          >
            Nadir
          </Link>
        </p>

        <h1 className="mt-6 text-[clamp(2rem,6vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.035em]">
          Nadir, live
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          This is something I built while learning, so please treat it as an
          experiment and not a finished tool. Satellite imagery of Tirunelveli
          district is cut into 1050 squares of 1.28 km. Each square is turned
          into a list of 1024 numbers by Clay v1.5, an open earth observation
          model. Click a square and the rest are ranked by how close their
          numbers are to it.
        </p>
      </header>

      <NadirDemo />

      <section className="mt-16 grid gap-12 border-t border-border pt-12 md:grid-cols-3">
        <div>
          <h2 className="label text-muted-foreground">What it matches on</h2>
          <p className="mt-4 leading-relaxed">
            Only how a place looks in Sentinel-2 imagery. It knows nothing
            about sunlight, roads, distance or who owns the land. So a match
            means the two squares look alike to the model. Useful as a starting
            point for a look around, not as an answer.
          </p>
        </div>

        <div>
          <h2 className="label text-muted-foreground">Why it runs here</h2>
          <p className="mt-4 leading-relaxed">
            The whole index is small — 1050 squares of 1024 numbers each.
            Comparing them is plain arithmetic, and a browser finishes it faster
            than a round trip to a server would take. So the file is downloaded
            once and the search runs on this page. No backend to keep alive
            while I am still figuring this out.
          </p>
        </div>

        <div>
          <h2 className="label text-muted-foreground">What it costs</h2>
          <p className="mt-4 leading-relaxed">
            About 2 MB, stored as int16 instead of float32 to keep the
            download light. I did try int8 to halve it again, but the scores sit
            very close together — tenth place at 0.9773, eleventh at 0.9769 —
            and the rounding kept changing the order. int16 gave the same ten as
            the original, so I stopped there.
          </p>
        </div>
      </section>

      <nav className="mt-16 border-t border-border pt-8">
        <Link
          href="/projects/nadir"
          className="label text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {project ? project.name : "Nadir"}, in detail
        </Link>
      </nav>
    </div>
  )
}
