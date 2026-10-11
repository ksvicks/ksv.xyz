---
title: "HealthKaati: A Food Diary You Talk To"
date: "2026-10-11"
summary: "I wanted to know what I eat before I feel bloated, without filling forms. So I built a diary where I just tell Claude, and it writes everything down. This is v1."
tags: ["HealthKaati", "MCP", "Claude", "Spring", "React"]
---

Every food tracking app I tried died the same death. Day one, I log everything. Day four, I am searching a database for "sambar, home-made, medium ladle" and giving up halfway through lunch.

The problem was never the motivation. It was the form.

So I built **HealthKaati**, a diary where the form does not exist. I tell Claude what happened, in the same words I would use with a friend, and it writes the diary for me.

> "2 idlis and sambar for breakfast, two hours in the field, weight 72.4, bloated since 3."

One message. Claude estimates the calories, works out the times, and records a meal, an activity, a weight and a symptom in a single call. A moment later it is all on my phone.

![HealthKaati on a phone: the Today screen, foods eaten before bloating, and calories per day](/blog-images/healthkaati/screens.webp)

*Sample data from the dev seed script, not my real diary. Kindly do not judge the bhatura.*

## Chat is the front door, the app is a window

HealthKaati is an MCP server. MCP is the protocol that lets Claude call tools on a server you run. Claude Desktop, claude.ai or any other MCP client can connect to it and read or write the diary.

That flipped the usual design. Talking is the main way in. The web app is mostly a viewer. It shows the same data, and new entries from chat show up on the screen within a few seconds.

Under it is one Spring Boot process. It serves a REST API for the web app and an MCP endpoint for Claude. Both call the **same service layer**, so a meal logged by hand and a meal logged from chat go through exactly the same rules. That one decision saved me from a whole class of "works in the app but not from Claude" bugs.

## There is no food database

This was the biggest decision, and the one I argued with myself about the most.

Accurate calorie data for Indian home food is hard to find. "One bowl of rajma" means something different in every house. So in v1 the model is the estimate. Claude guesses the calories, protein, carbs and fat for each item, and the server stores that guess.

Being honest about that became a design rule. Every number on screen carries a `~`. A time Claude had to guess is marked **est.** The Today screen says, in plain words, "Estimates only. Not for insulin or medicine dosing." The estimates can be off by about 20%, and the app never pretends otherwise.

What I want from the diary is not a precise number. It is the pattern.

## The pattern is the point

The real question I had was simple: what did I eat before I felt bad?

The History screen answers it. For each symptom, it lists the foods eaten in the hours before each episode. Then it compares each food with how often it shows up anyway. In the screenshot, bloating followed 8.4% of all meals. It followed 9 of 12 meals with bhatura. That gap is the interesting part, and the little tick on each bar marks the usual rate so the gap is easy to see.

Every page ends with the same line: **Associations, not causes. Not medical advice.** I mean it. Twelve meals is not a study.

## It records. It never advises.

This is the rule I care about most, and it is written into the instructions the server sends to the model.

- No diet suggestions, no exercise tips, no "maybe cut down on…".
- No diagnosis and no condition names.
- No judgement words. Not "good", not "too much".
- Medicines are not recorded at all. If I mention a tablet, Claude says "Medicines are not recorded in this diary." and moves on.

The server does not just hope the model behaves. It rejects a drug name in any field. It rejects a symptom type that is not already in my list, so the vocabulary does not slowly fill up with "bloating", "bloated" and "tummy feels full". The database repeats the service checks, because input from a model is input from outside, and I do not trust it more than a form.

## The small things that took the time

The happy path came together quickly. Most of the month went into edge cases, as usual.

**A message is many entries, and each one stands alone.** If Claude gets the weight right and fumbles the symptom, the weight is still saved. One bad entry does not throw away the others.

**Calls get retried.** Networks drop and clients retry. Every entry carries an idempotency key, so the same call sent twice gives back the first entry instead of a second breakfast.

**Who wrote this entry?** I wanted each entry to record which client wrote it, like "Claude Desktop". The server is stateless, though, and the client gives its name only in the first `initialize` request, not in later tool calls. So for a while every entry was signed by `undici`, the HTTP library. The fix was to put the client name inside the `Mcp-Session-Id` header the server sends back. MCP clients send that header with every later request, so the name comes back with each call. Nothing is stored, and it survives restarts.

**What is "today"?** A day ends at midnight in *my* time zone, not the server's. That sounds obvious until a late dinner lands on the wrong day.

**Undo, not "Are you sure?".** Deleting a meal by hand happens at once, with an undo. Confirm dialogs just teach people to tap "Yes" without reading.

## What v1 is

Honestly, it is a first try. But it is a complete one.

- A Spring Boot backend on Java 21, with PostgreSQL and Flyway migrations.
- A mobile-first React web app that installs as a PWA.
- Sign in with Google for the browser, and OAuth for claude.ai connectors.
- Data export and account deletion from day one.
- Docker, nightly backups, rate limits and CI, on a small Hetzner box behind Cloudflare.
- Invite-only for now. It is a showcase, not a product.

About 70 commits in one month, from an empty folder to a working v1.

## What comes next

- **A real food list for common dishes**, so the estimates move from "about right" to "right".
- **Better patterns.** Time windows that fit each symptom, and enough data before the app says anything at all.
- **Less typing.** A photo of the plate is the obvious next step.

The biggest lesson so far is not technical. When logging takes one sentence, I actually keep logging. Everything else in the app depends on that.

— Vicky KS
