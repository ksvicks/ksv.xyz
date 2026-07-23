"use client"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import ModeToggle from "./mode-toggle"

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/resume", label: "CV" },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-colors hover:text-muted-foreground"
        >
          {/* Decorative: the adjacent wordmark already carries the name.
              .logo-adaptive lifts the navy for the dark background. */}
          <Image
            src="/ksv.png"
            alt=""
            width={716}
            height={292}
            priority
            className="h-6 w-auto logo-adaptive"
          />
          <span className="text-base font-bold uppercase tracking-tight">
            Vignesh KS
          </span>
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          {/* Short enough to always show — no mobile menu needed, and no
              hidden-nav dead end on small screens. */}
          <nav className="flex items-center gap-6 md:gap-8">
            {navItems.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "label relative transition-colors hover:text-foreground",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1.5 left-0 h-[2px] w-full bg-foreground"
                    />
                  )}
                </Link>
              )
            })}
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
