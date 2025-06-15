export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

/* ---------- add this block ---------- */
declare global {
  interface Window {
    /**
     * Google Analytics `gtag` helper.
     * We don’t need to model all overloads—an unknown-arg spread is fine
     * and keeps the linter happy.
     */
    gtag: (...args: unknown[]) => void
  }
}
/* ------------------------------------ */

export const pageview = (url: string): void => {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
  window.gtag('config', GA_ID, { page_path: url })
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category?: string
  label?: string
  value?: number
}): void => {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}
