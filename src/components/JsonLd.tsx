/**
 * Renders a JSON-LD block.
 *
 * Kept as a component so every schema on the site serialises identically, and
 * so the one `dangerouslySetInnerHTML` call lives in a single reviewed place.
 * `<` is escaped because post titles and summaries flow in from markdown
 * frontmatter — an unescaped `</script>` there would break out of the tag.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
