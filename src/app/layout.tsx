import "./globals.css"
import type { Metadata } from "next"
import Script from "next/script"
import { Archivo, IBM_Plex_Mono } from "next/font/google"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import ThemeProvider from "@/components/theme-provider"
import Analytics from "@/components/Analytics"
import { GA_ID } from "@/lib/gtag"
import { site } from "@/lib/site"

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

/** Shared social card. Pages that want their own set `openGraph.images`. */
const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Vignesh KS — Software engineer",
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
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
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vignesh KS — Software engineer",
    description:
      "Software engineer working on backend systems. Notes on debugging and self-hosting.",
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google show full-length text snippets and large image previews
      // instead of the conservative defaults.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
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

          {/* Sends a page_view on first load and on every route change. */}
          <Analytics />
        </ThemeProvider>

        {/*
          Google Analytics. Loaded on every page, with no consent gate. The
          measurement ID is public by design, so it lives in the source.
          `send_page_view: false` leaves all page_view events to <Analytics />,
          which also covers client-side navigations.
        */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { send_page_view: false });
          `}
        </Script>

        {/*
          Cloudflare Web Analytics. Cookieless and privacy-preserving, so it
          needs no consent banner. The token is public by design — it ships in
          the HTML of every page — hence no env var.
          `type="module"` already defers execution, so this never blocks
          rendering; the explicit `defer` is a no-op that satisfies
          @next/next/no-sync-scripts.
        */}
        <script
          type="module"
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "706270176d8841bead8085a95e290705"}'
        />
      </body>
    </html>
  )
}
