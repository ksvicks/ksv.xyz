import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-32 md:px-10 md:py-40">
      <p className="label text-muted-foreground">Error 404</p>
      <h1 className="mt-8 text-[clamp(2.5rem,8vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.035em]">
        Nothing here
      </h1>
      <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">
        That page doesn&apos;t exist — it may have moved, or never did.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
        <Link
          href="/"
          className="label border-b-2 border-foreground pb-1 transition-colors hover:text-muted-foreground"
        >
          Home
        </Link>
        <Link
          href="/blog"
          className="label border-b-2 border-transparent pb-1 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        >
          Writing
        </Link>
      </div>
    </div>
  )
}
