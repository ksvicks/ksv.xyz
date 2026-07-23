"use client"

import Script from "next/script"
import { useCallback, useEffect, useState } from "react"
import Analytics from "@/components/Analytics"
import {
  CONSENT_CHANGED,
  CONSENT_REOPEN,
  type ConsentValue,
  clearAnalyticsCookies,
  readConsent,
  writeConsent,
} from "@/lib/consent"

/**
 * Gates Google Analytics behind explicit consent.
 *
 * The gtag script is not rendered at all until the visitor accepts, so no
 * Google request is made and no cookie is set beforehand. Declining after a
 * previous acceptance sets GA's official kill switch and clears its cookies.
 */
export default function AnalyticsConsent({ gaId }: { gaId: string }) {
  const [consent, setConsent] = useState<ConsentValue | null>(null)
  // localStorage is unavailable during SSR, so nothing consent-dependent may
  // render until after mount — otherwise the markup mismatches on hydration.
  const [mounted, setMounted] = useState(false)
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    setConsent(readConsent())
    setMounted(true)

    const onChanged = (e: Event) => {
      setConsent((e as CustomEvent<ConsentValue>).detail)
      setReviewing(false)
    }
    const onReopen = () => setReviewing(true)

    window.addEventListener(CONSENT_CHANGED, onChanged)
    window.addEventListener(CONSENT_REOPEN, onReopen)
    return () => {
      window.removeEventListener(CONSENT_CHANGED, onChanged)
      window.removeEventListener(CONSENT_REOPEN, onReopen)
    }
  }, [])

  // GA reads this flag on every call, so it also stops an already-loaded script.
  useEffect(() => {
    if (!mounted) return
    const w = window as unknown as Record<string, unknown>
    w[`ga-disable-${gaId}`] = consent !== "granted"
    if (consent === "denied") clearAnalyticsCookies()
  }, [consent, gaId, mounted])

  const decide = useCallback((value: ConsentValue) => writeConsent(value), [])

  const granted = consent === "granted"
  const open = mounted && (consent === null || reviewing)

  return (
    <>
      {granted && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
          <Analytics />
        </>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Analytics consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-10">
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              I use Google Analytics to see which posts get read. It sets
              cookies, so it only runs if you say yes. Declining changes
              nothing else about the site.
            </p>

            <div className="flex shrink-0 items-center gap-6">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="label text-muted-foreground transition-colors hover:text-foreground"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="label border-2 border-foreground px-4 py-2 transition-colors hover:bg-foreground hover:text-background"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
