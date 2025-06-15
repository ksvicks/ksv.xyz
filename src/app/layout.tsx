import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import NavBar from "@/components/NavBar"
import ThemeProvider from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KSV",
  description: "Personal website of KSV",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NavBar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
