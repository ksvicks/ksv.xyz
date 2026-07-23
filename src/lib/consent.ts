export const CONSENT_KEY = "ksv:analytics-consent"

/** Fired when the stored decision changes. */
export const CONSENT_CHANGED = "ksv:consent-changed"
/** Fired when the visitor asks to review their decision again. */
export const CONSENT_REOPEN = "ksv:consent-reopen"

export type ConsentValue = "granted" | "denied"

/**
 * Reads the stored decision. Returns null when undecided.
 * Storage access is wrapped: Safari private mode and hardened browser
 * settings throw on localStorage rather than returning null.
 */
export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === "granted" || v === "denied" ? v : null
  } catch {
    return null
  }
}

export function writeConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    /* Decision still applies for this page view via the event below. */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: value }))
}

/** Lets the footer link re-open the banner after a decision was made. */
export function openConsentSettings(): void {
  window.dispatchEvent(new Event(CONSENT_REOPEN))
}

/**
 * Best-effort removal of the cookies GA already set, used when consent is
 * withdrawn. Cookies are host-scoped, so try the bare host and the
 * dot-prefixed registrable domain that GA actually writes to.
 */
export function clearAnalyticsCookies(): void {
  const { hostname } = window.location
  const parts = hostname.split(".")
  const domains = new Set<string>([hostname, `.${hostname}`])
  if (parts.length > 2) domains.add(`.${parts.slice(-2).join(".")}`)

  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim()
    if (!name || !/^_ga|^_gid$|^_gat/.test(name)) continue
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`
    }
    document.cookie = `${name}=; Max-Age=0; path=/`
  }
}
