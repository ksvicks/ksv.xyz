import Link from "next/link"

export default function ResumePage() {
  return (
    <section className="min-h-screen px-4 py-16 max-w-4xl mx-auto space-y-16 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-black dark:via-zinc-900 dark:to-zinc-800">
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-extrabold text-primary">Vignesh KS</h1>
        <p className="text-muted-foreground text-lg">Senior Software Developer</p>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <a href="mailto:ksvicks@gmail.com" className="underline text-blue-600 dark:text-blue-400">ksvicks@gmail.com</a>
          <a href="https://www.linkedin.com/in/vigneshksingaraj" target="_blank" className="underline text-blue-600 dark:text-blue-400">LinkedIn</a>
        </div>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Summary</h2>
        <p className="text-muted-foreground leading-relaxed">
          Software engineer with 9+ years of experience in building scalable, responsive SaaS products. Passionate about fault-tolerant backend systems, team leadership, and solving complex problems.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {["Java", "JavaScript", "Kafka", "MySQL", "Redis", "React", "Spring Boot", "Postgres", "REST APIs", "OAuth", "SAML", "JWT", "Influx","CI/CD"].map(skill => (
            <span key={skill} className="bg-muted  px-3 py-1 rounded-full text-sm ">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Experience</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold">Zoho Corporation (2017 - Present)</h3>
            <ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
              <li>Built a Stack Overflow-like SaaS platform with millions of daily API hits</li>
              <li>Mentored 4 team members in backend and frontend development</li>
              <li>Integrated Kafka, Redis, Lucene, and IAM (SAML, OAuth, Federated Login)</li>
              <li>Improved performance via browser/server caching, query tuning, and CDN</li>
              <li>Added @mentions, SEO, Open Graph, and HTTP redirection features</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Tata Consultancy Services (2015 - 2017)</h3>
            <ul className="list-disc ml-5 text-muted-foreground text-sm space-y-1">
              <li>Maintained underwriting platform for a US health insurance client</li>
              <li>Generated statistical insights for underwriters via Java and CSV automation</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Projects</h2>
        <ul className="list-disc ml-5 text-muted-foreground text-sm space-y-2">
          <li><strong>Raspberry Pi Control Panel:</strong> Built a custom UI panel using Java + React</li>
          <li><strong>Lyrics-based Song Finder:</strong> Mini app to search songs by lyrics text</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Education</h2>
        <p className="text-muted-foreground">B.E. in Electrical and Electronics Engineering — National Engineering College, Anna University (CGPA 8.7)</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-primary">Languages</h2>
        <p className="text-muted-foreground">Tamil (Native), English (Fluent)</p>
      </section>
    </section>
  )
}
