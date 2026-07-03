---
title: "The Bug That Left No Trace"
date: "2026-07-03"
summary: "Some of Claude's summaries of our docs came back empty. The cause turned out to be a stale cache in Anthropic's web_fetch tool."
tags: ["Debugging", "Caching", "SSR", "Claude"]
---

A quick note on a bug that had no error, no logs, and no request in our access logs. Those are always a bit more interesting to chase.

## The symptom

We run a docs portal with a lot of articles. Claude was fetching those URLs to summarize them via `web_fetch`. Most were fine. A few came back empty — no error, just blank output.

## The obvious cause

The portal is an SPA, so the first response is a JS shell and the content renders client-side. `web_fetch` doesn't run JavaScript — Anthropic's docs mention this too — so it saw an empty shell.

The usual fix: serve SSR content on the first response for clients that can't run JS. We did, and most of the empty URLs started working.

## The part that didn't add up

A few stayed empty after the fix. Same URLs every time, while similar ones passed. That pattern was the clue — it looked like state, not randomness.

So I checked whether those requests were even reaching our servers. They weren't. No origin hits at all. We were serving correct content that nobody was asking for.

## The likely cause

If the body is empty and origin is never queried, the empty response isn't coming from us. It's a cached copy from before the SSR fix, still being served.

The cache was inside the tool, though, so there wasn't an obvious way to confirm it from our side.

## Confirming it

Through the API, `web_fetch` returns a `retrieved_at` timestamp — when the content was captured. It's in the response payload (though not really documented as a staleness signal). I fetched a failing URL directly and got two things:

- a `retrieved_at` from before our SSR deploy, and
- a body with no article — just a couple of `<meta>` tags.

So it was an old, empty capture being replayed. That was enough to be sure.

## Resolution

I raised it with support first, with the URL, the timestamp, and the empty body attached. That didn't go far on its own. Around the same time, someone from Anthropic happened to be talking to our team about something unrelated, so I mentioned the caching issue there too and passed along the same evidence.

That got it in front of the right people. They cleared the affected cache entries and asked us to re-test. The URLs came back with the current content.

## A few things worth remembering

A hypothesis isn't a fix. "Probably a stale cache" is where the checking starts, not where it ends.

Missing signals count as signals. The useful clue here was the absence of origin requests, not anything I found.

The tools we build on have more in them than the polished surface shows. `retrieved_at` wasn't meant for debugging, but it happened to be exactly what confirmed this.

Caches trade freshness for speed, and once in a while for correctness. Worth keeping in mind when an "obvious" fix clears up most of a problem but not all of it.
