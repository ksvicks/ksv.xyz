// lib/gtag.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

// Standard page-view event
export const pageview = (url: string) => {
  if (!GA_ID) return
  ;(window as any).gtag('config', GA_ID, {
    page_path: url,
  })
}
