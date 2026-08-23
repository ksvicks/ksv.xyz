import { ImageResponse } from "next/og"
import { ogCard, OG_SIZE } from "@/lib/og-card"
import { site } from "@/lib/site"

/** Baked at build time so the URL is stable and cacheable. */
export const dynamic = "force-static"

export function GET(): Response {
  return new ImageResponse(
    ogCard({
      eyebrow: site.domain,
      title: site.name,
      footer: `${site.role} · Backend systems`,
    }),
    OG_SIZE,
  )
}
