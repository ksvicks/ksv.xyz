import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import NavBar from "@/components/NavBar"
import ThemeProvider from "@/components/theme-provider"
import Script from "next/script"
import Analytics from "@/components/Analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KSV",
  description: "Personal website of KSV",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
         {/* GA loader (async) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />

        {/* GA bootstrap */}
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              anonymize_ip: true  // GDPR-friendlier
            });
          `}
        </Script>

        {/* Client-side router listener */}
        <Analytics />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavBar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
