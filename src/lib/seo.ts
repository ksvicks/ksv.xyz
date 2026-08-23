import type { Metadata } from "next"
import { site } from "@/lib/site"

/**
 * Canonical + feed links for a page.
 *
 * `alternates` is a single top-level metadata key, so a page that sets its own
 * canonical replaces whatever the layout declared — including the RSS link.
 * Building both here keeps every page consistent and stops the feed link
 * silently disappearing from inner pages.
 *
 * `path` is relative; Next resolves it against `metadataBase`.
 */
export function alternatesFor(path: string): Metadata["alternates"] {
  return {
    canonical: path,
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: `${site.name} — Writing` },
      ],
    },
  }
}

/** Absolute URL for a site-relative path. Structured data needs absolutes. */
export function absolute(path: string): string {
  return new URL(path, site.url).toString()
}
