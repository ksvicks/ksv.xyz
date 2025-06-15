"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import ModeToggle from "./mode-toggle"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white dark:bg-black sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ksv.xyz
        </Link>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
