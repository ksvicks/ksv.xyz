import Image from "next/image"
import ConsentSettingsButton from "@/components/ConsentSettingsButton"
import { site, socials } from "@/lib/site"

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-5">
            <Image
              src="/ksv.png"
              alt=""
              width={716}
              height={292}
              className="h-12 w-auto logo-adaptive"
            />
            <div className="space-y-2">
              <p className="text-lg font-bold uppercase tracking-tight">
                {site.name}
              </p>
              <p className="label text-muted-foreground">{site.role}</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-6">
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="label text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
            <ConsentSettingsButton enabled={Boolean(process.env.NEXT_PUBLIC_GA_ID)} />
          </nav>
        </div>

        <p className="label mt-10 text-muted-foreground">
          © {new Date().getFullYear()} — {site.domain}
        </p>
      </div>
    </footer>
  )
}
