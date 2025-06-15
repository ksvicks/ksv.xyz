import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
<section className="h-[calc(100vh-6rem)] flex flex-col md:flex-row overflow-hidden">        {/* Left: Logo */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-black h-1/2 md:h-full">
        <div className="max-h-[80%] max-w-[80%]">
          <Image
            src="/ksv.png"
            alt="KSV Logo"
            width={300}
            height={300}
            style={{ height: "auto", width: "100%" }}
            priority
          />
        </div>
      </div>

      {/* Right: Hero Text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center md:text-left px-6 md:px-12 space-y-6 h-1/2 md:h-full overflow-y-auto">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Hello world, I&apos;m Vignesh KS 👋
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl">
          A software engineer building scalable systems and real-time SaaS applications.
        </p>
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <Link href="/blog"><Button variant="outline">Blog</Button></Link>
          <Link href="/projects"><Button variant="outline">Projects</Button></Link>
          <Link href="/resume" rel="noopener noreferrer">
            <Button variant="outline">Resume</Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground pt-4">
          why do we fall? so we can learn to pick ourselves up.
        </p>
      </div>
    </section>
  )
}
