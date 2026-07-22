const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/**
 * Format an ISO date for display.
 *
 * Deliberately does NOT use `toLocaleDateString`: that resolves the locale on
 * the server at render time and again in the browser, so a visitor outside the
 * server's locale gets a hydration mismatch. Reading UTC parts keeps the output
 * identical everywhere and stops `2025-06-15` slipping to the 14th in negative
 * UTC offsets.
 */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso

  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${day} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** Rough reading time, at a conservative 200 wpm. */
export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}
