export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  /** Two-digit index used as the Swiss grid marker. */
  index: string
  name: string
  /** One line — what it is, not why it's impressive. */
  summary: string
  /** A short paragraph of detail. Optional. */
  detail?: string
  stack: string[]
  /** Where it stands right now. Kept honest. */
  status: "Ongoing" | "In progress" | "Live" | "Shelved"
  /** Omit rather than guess — a fabricated date is worse than none. */
  year?: string
  /**
   * TODO(vignesh): add repo / live links as they become public.
   * Left empty deliberately — a dead link is worse than no link.
   */
  links?: ProjectLink[]
  /** Slug of a related blog post, if one exists. */
  post?: string
}

export const projects: Project[] = [
  {
    index: "01",
    name: "Auravibe",
    summary: "A Spotify-connected web app pairing a Spring backend with a React frontend.",
    detail:
      "Authentication, data fetching and the UI work end to end locally. Next step is deploying it to a subdomain and tidying the core before it goes anywhere public.",
    stack: ["Spring", "React", "Spotify API"],
    status: "In progress",
    year: "2025",
    post: "AuravibeMilestone",
  },
  {
    index: "02",
    name: "Home server",
    summary:
      "A second-hand HP thin client running Ubuntu, used for self-hosting and for learning the ops side properly.",
    detail:
      "No built-in WiFi and DisplayPort only, so it started life on a spare router and an Ethernet run. SSH and a static IP are up. Docker, Kubernetes, Jenkins and Prometheus/Grafana are the things I'm working through next.",
    stack: ["Ubuntu", "Docker", "Networking"],
    status: "Ongoing",
    year: "2025",
    post: "home-server-journey-part1",
  },
  {
    index: "03",
    name: "ksv.xyz",
    summary: "This site — a Next.js app with a file-based Markdown blog.",
    detail:
      "Statically generated, no CMS. Posts are Markdown files with front matter, so writing means adding a file.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    status: "Live",
    year: "2025",
    links: [{ label: "Source", href: "https://github.com/ksvicks/ksv.xyz" }],
  },
  {
    index: "04",
    name: "Raspberry Pi control panel",
    summary: "A small monitoring and control UI for a Pi, built with Java and React.",
    stack: ["Java", "React"],
    status: "Shelved",
  },
  {
    index: "05",
    name: "Lyrics-based song finder",
    summary: "Finds a song from a half-remembered fragment of its lyrics.",
    stack: ["Java"],
    status: "Shelved",
  },
]
