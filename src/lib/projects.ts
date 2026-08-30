export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  /** Two-digit index used as the Swiss grid marker. */
  index: string
  /** URL segment for the detail page. Written out rather than derived from
      `name`, which contains dots and mixed case. */
  slug: string
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
  /**
   * Site-relative path to a live, in-page demo. Separate from `links` because
   * those open in a new tab with an external-link marker, and this one is a
   * route on this site — it deserves an internal link and its own emphasis.
   */
  demo?: string
}

export const projects: Project[] = [
  {
    index: "01",
    slug: "nadir",
    name: "Nadir",
    summary:
      "A first go at similarity search over satellite imagery — click a square kilometre of Tirunelveli district and see the ten that look most like it.",
    detail:
      "A learning project, and a proof of concept rather than a finished tool. Sentinel-2 imagery of Tirunelveli district is cut into 1050 squares of 1.28 km, and each square is turned into a list of 1024 numbers by Clay v1.5, an open earth observation model. Comparing those lists is what ranks one square against all the others. There is an early experiment with a second date, comparing how a place changed instead of how it looks, and it does seem to help, but I have not tested it carefully enough to claim anything. The aim so far was to get the whole path working end to end and see it on a map. Proper evaluation, the serving side and the harder geospatial questions are what I want to take up next.",
    stack: ["Python", "PyTorch", "Clay v1.5", "FastAPI", "numpy", "PostGIS", "pgvector", "Leaflet"],
    status: "In progress",
    year: "2026",
    demo: "/projects/nadir/demo",
  },
  {
    index: "02",
    slug: "claude-notify",
    name: "claude-notify",
    summary:
      "A macOS menu bar indicator showing which Claude Code session is waiting on you.",
    detail:
      "Hooks write one small state file per session; a Swift menu bar app polls that directory and renders what it finds. The hook script has no dependencies and does no parsing, so either half can be replaced without touching the other. Packaged as a Claude Code plugin, so installing it registers the hooks with no config editing by hand.",
    stack: ["Swift", "AppKit", "Bash", "Claude Code hooks"],
    status: "Live",
    year: "2026",
    links: [{ label: "Source", href: "https://github.com/ksvicks/claude-notify" }],
    post: "claude-notify",
  },
  {
    index: "03",
    slug: "auravibe",
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
    index: "04",
    slug: "home-server",
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
    index: "05",
    slug: "ksv-xyz",
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
    index: "06",
    slug: "raspberry-pi-control-panel",
    name: "Raspberry Pi control panel",
    summary: "A small monitoring and control UI for a Pi, built with Java and React.",
    stack: ["Java", "React"],
    status: "Shelved",
  },
  {
    index: "07",
    slug: "lyrics-song-finder",
    name: "Lyrics-based song finder",
    summary: "Finds a song from a half-remembered fragment of its lyrics.",
    stack: ["Java"],
    status: "Shelved",
  },
]

/** Detail-page lookup. Returns undefined for an unknown slug so callers 404. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
