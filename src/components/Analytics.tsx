// components/Analytics.tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { pageview } from '@/lib/gtag'

export default function Analytics() {
  const pathname = usePathname()

  // -- Fire once on initial load & again on every route change
  useEffect(() => {
    pageview(pathname)
  }, [pathname])

  return null
}
