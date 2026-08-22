'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { pageview } from '@/lib/gtag'

// Client-side navigations do not reload the gtag snippet, so send a page_view
// on every route change.
export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    pageview(pathname)
  }, [pathname])

  return null
}
