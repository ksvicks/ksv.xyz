# ksv.xyz

Personal site and writing of **Vignesh KS** — senior software engineer.

Live at [ksv.xyz](https://ksv.xyz).

## Stack

| Concern    | Choice                                       |
| ---------- | -------------------------------------------- |
| Framework  | Next.js 15 (App Router, RSC, Turbopack dev)  |
| Language   | TypeScript                                   |
| Styling    | Tailwind CSS v4 with CSS-variable theming    |
| Components | shadcn/ui on Radix primitives                |
| Content    | Markdown files parsed with `gray-matter`     |
| Rendering  | `react-markdown` + `remark-gfm`              |
| Analytics  | Google Analytics (opt-in via env var)        |
| Hosting    | Vercel                                       |

## Design

A deliberately Swiss layout: one grotesque typeface (Archivo) with IBM Plex Mono
for labels and data, hard edges (`--radius: 0`), a warm-paper background, and a
single vermillion accent. All colour lives in CSS variables in
`src/app/globals.css` — light and dark are defined together, so nothing is
hardcoded in components.

Long-form article typography is hand-rolled in `globals.css` under `.article`
rather than using `@tailwindcss/typography`, so the prose scale matches the rest
of the grid instead of fighting it.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Writing a post

Drop a Markdown file into `blog/posts/`. The filename becomes the URL slug.

```markdown
---
title: "The Bug That Left No Trace"
date: "2026-07-03"
summary: "One sentence that shows up in listings, search results and share cards."
tags: ["Debugging", "Caching"]
---

Body goes here. GitHub-flavoured Markdown — tables, task lists and
strikethrough all work.
```

Posts are statically generated at build time via `generateStaticParams`, sorted
newest-first by `date`, and each one gets its own OpenGraph and Twitter metadata
derived from its front matter.

## Environment

| Variable            | Required | Purpose                                            |
| ------------------- | -------- | -------------------------------------------------- |
| `NEXT_PUBLIC_GA_ID` | No       | Google Analytics measurement ID. Unset ⇒ no script. |

## Layout

```
blog/posts/          Markdown source for the blog
src/app/             Routes — home, /blog, /blog/[slug], /resume, 404
src/components/      NavBar, Footer, theme toggle, shadcn/ui primitives
src/lib/site.ts      Name, role, and contact links — single source of truth
src/lib/blog.ts      Front-matter reading and slug resolution
src/lib/format.ts    Locale-stable date formatting and reading time
```
