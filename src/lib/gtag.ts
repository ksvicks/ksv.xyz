// Google Analytics measurement ID. Public by design — it ships in the HTML of
// every page — so it lives in source rather than in an env var.
export const GA_ID = 'G-NMXK6GY0LX'

declare global {
  interface Window {
    /**
     * Google Analytics `gtag` helper. An unknown-arg spread is enough here and
     * keeps the linter happy.
     */
    gtag: (...args: unknown[]) => void
  }
}

// The snippet is loaded with `send_page_view: false`, so every page_view —
// including the first one — is sent from here.
export const pageview = (url: string): void => {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  })
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
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}
