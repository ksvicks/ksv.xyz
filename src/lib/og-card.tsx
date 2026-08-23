import type { ReactElement } from "react"

/** Facebook/LinkedIn/X all crop to this ratio. Anything else gets letterboxed. */
export const OG_SIZE = { width: 1200, height: 630 }

/**
 * Palette lifted from the dark theme in globals.css.
 *
 * Written as hex on purpose: the card is rendered by satori, which does not
 * understand `oklch()` and silently falls back to black on unknown colours.
 */
const BG = "#1c1b19"
const FG = "#f4f2ee"
const MUTED = "#a8a49c"
const RULE = "#3a3833"

/**
 * The shared social card.
 *
 * No web font is loaded: fetching one at build time would make `next build`
 * fail on a machine without network access. The default face is regular
 * weight only, so hierarchy comes from size, colour and letter-spacing
 * instead of bold.
 */
export function ogCard({
  eyebrow,
  title,
  footer,
}: {
  eyebrow: string
  title: string
  footer: string
}): ReactElement {
  // Long headlines need to shrink or they overflow the card.
  const titleSize = title.length > 70 ? 60 : title.length > 45 ? 72 : 88

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: BG,
        color: FG,
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        {eyebrow}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: titleSize,
          lineHeight: 1.05,
          letterSpacing: -2,
          textTransform: "uppercase",
          // Satori has no ellipsis support, so cap the text instead.
          maxHeight: 340,
          overflow: "hidden",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          borderTop: `1px solid ${RULE}`,
          paddingTop: 28,
          fontSize: 26,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        {footer}
      </div>
    </div>
  )
}
