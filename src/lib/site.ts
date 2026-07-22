/**
 * Single source of truth for identity and contact details.
 * Every page reads from here so the name/title/links can't drift apart.
 */
export const site = {
  name: "Vignesh KS",
  /** Public-facing descriptor. The formal Zoho title (Member Technical Staff)
      appears on the CV's experience entry instead. */
  role: "Senior Software Engineer",
  /** City only — the phone number in the PDF is deliberately not surfaced here. */
  location: "Tenkasi, Tamil Nadu, IN",
  domain: "ksv.xyz",
  url: "https://ksv.xyz",
  email: "ksvicks@gmail.com",
  github: "https://github.com/ksvicks",
  linkedin: "https://www.linkedin.com/in/vigneshksingaraj",
} as const

export const socials = [
  { label: "Email", href: `mailto:${site.email}` },
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
] as const
