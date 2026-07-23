"use client"

import { useEffect, useState } from "react"
import { openConsentSettings } from "@/lib/consent"

/**
 * Lets a visitor revisit their analytics decision — consent has to be as easy
 * to withdraw as it was to give. Hidden when analytics isn't configured at all,
 * since there'd be nothing to review.
 */
export default function ConsentSettingsButton({ enabled }: { enabled: boolean }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!enabled || !mounted) return null

  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className="label text-muted-foreground transition-colors hover:text-foreground"
    >
      Cookies
    </button>
  )
}
