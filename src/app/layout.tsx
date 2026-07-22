import "./globals.css"
import type { Metadata } from "next"
import { Archivo, IBM_Plex_Mono } from "next/font/google"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import ThemeProvider from "@/components/theme-provider"
import AnalyticsConsent from "@/components/AnalyticsConsent"

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
})

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL("https://ksv.xyz"),
  title: {
    default: "Vignesh KS — Software engineer",
    template: "%s — Vignesh KS",
  },
  description:
    "Software engineer and platform lead working on backend systems — Java, Kafka, Redis and MySQL. Nine years at Zoho. Notes on debugging and self-hosting.",
  authors: [{ name: "Vignesh KS", url: "https://ksv.xyz" }],
  creator: "Vignesh KS",
  openGraph: {
    type: "website",
    url: "https://ksv.xyz",
    siteName: "ksv.xyz",
    title: "Vignesh KS — Software engineer",
    description:
      "Software engineer working on backend systems. Notes on debugging and self-hosting.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vignesh KS — Software engineer",
    description:
      "Software engineer working on backend systems. Notes on debugging and self-hosting.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${archivo.variable} ${plexMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          {/* Renders nothing until the visitor decides; no GA request before that. */}
          {GA_ID && <AnalyticsConsent gaId={GA_ID} />}
        </ThemeProvider>
      </body>
    </html>
  )
}
