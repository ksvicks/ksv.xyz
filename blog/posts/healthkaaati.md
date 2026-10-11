---
title: "HealthKaaati: A Food Diary You Talk To"
date: "2026-10-11"
summary: "A food diary where I just tell Claude what I ate and how I feel, and it writes everything down. This is v1."
tags: ["HealthKaaati", "MCP", "Claude", "Spring", "React"]
---

I wanted a food diary that feels like a chat with a friend. So I built **[HealthKaaati](https://health.kaaati.com/)**.

I tell Claude about my day in my own words:

> "3 idlis with sambar and coconut chutney for breakfast, curd rice and poriyal for lunch, a 30 minute walk in the evening, weight 72.4."

Claude estimates the calories, picks the times, and saves the meals, the walk and the weight in one go. A moment later, it is all on my phone.

![HealthKaaati on a phone: the Today screen, foods before a symptom, and calories per day](/blog-images/healthkaaati/screens.webp)

*Screens with sample data.*

## How it works

HealthKaaati is an MCP server. MCP lets Claude call tools on a server I run, so Claude Desktop or claude.ai can read and write the diary directly.

Talking is the main way in. The web app is a clean window over the same diary. One Spring Boot process serves both, through the same service layer, so a dosa added by hand and a dosa added from chat follow the same rules.

## Friendly estimates

Every home has its own sambar, so in v1 Claude estimates the calories, protein, carbs and fat for each item. Each number carries a `~`, and a time Claude picked is marked **est.** The diary is about the pattern, so a close estimate is all it needs.

## Patterns over time

The History screen shows the foods I ate in the hours before each symptom, beside how often those foods appear in general. Idli on Monday, parotta on Friday, pongal on Sunday: the diary lays it all out, side by side.

## It only records

HealthKaaati keeps to one job: it records and it shows. It shares facts only, and leaves advice and diagnosis to doctors. Medicines stay out of the diary. Every page ends with a gentle reminder that these are associations to notice.

## Small touches

- One message can hold many entries, and each entry saves on its own.
- Every entry carries an idempotency key, so a retried call saves it once.
- Each entry records which client wrote it, such as Claude Desktop.
- The day ends at midnight in my own time zone.
- Deleting a meal by hand comes with an undo.

## What v1 is

- Java 21 and Spring Boot, with PostgreSQL.
- A mobile-first React web app that installs as a PWA.
- Sign in with Google, and OAuth for claude.ai connectors.
- Data export and account deletion.
- Docker, nightly backups and CI, on a small Hetzner box.
- Invite-only for now, as a showcase.

About 70 commits in one month, from an empty folder to a working v1.

## Next

- A food list for common Tamil dishes like idli, dosa, sambar and rasam, for sharper estimates.
- Richer patterns as the diary grows.
- A photo of the plate, so logging is one tap.

When logging takes one sentence, logging becomes a habit. That is the whole idea.

HealthKaaati is live at [health.kaaati.com](https://health.kaaati.com/), invite-only for now.

— Vicky KS
