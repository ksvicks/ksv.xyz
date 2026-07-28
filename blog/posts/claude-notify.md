---
title: "A Menu Bar Light for Claude Code"
date: "2026-07-29"
summary: "Running several Claude Code sessions means constantly checking which one is stuck. So I built a menu bar indicator that tells me, and learned that the interesting parts were all edge cases."
tags: ["Claude Code", "macOS", "Swift", "Hooks"]
---

I usually have three or four Claude Code sessions open across different terminal tabs. One is working, one finished a while ago, one is sitting on a permission prompt waiting for me. There is no way to know which is which without clicking through every tab.

So I built a small menu bar app that answers that question at a glance.

## The shape of it

Claude Code fires hooks on session events. Five of them are enough here: session start, prompt submitted, notification, stop, session end.

Each hook calls a shell script. The script writes one file per session into `~/.claude/session-state/`. A Swift menu bar app polls that directory once a second and renders what it finds.

That is the whole design. No daemon, no socket, no IPC. Two halves that agree on a file format and otherwise know nothing about each other.

The contract is a plain text header plus the raw hook payload, untouched. The shell script does no parsing at all — no `jq`, no Python, just builtins and `date`. It sits on the critical path of every prompt I submit, so I wanted it to be boring. The app owns all the parsing, because that is the half I can debug properly.

## The parts that actually took the time

The happy path took an evening. The rest was edge cases.

**"Notification" means two different things.** The hook fires when Claude is blocked on a permission prompt, and it also fires after about sixty seconds of an idle prompt. The first genuinely needs me. The second does not. Treating them alike meant a red badge that cried wolf, which is worse than no badge at all. The payload text is the only thing that separates them.

**Sessions die without saying goodbye.** `SessionEnd` fires on a clean exit. It does not fire when a window is closed, when the process is killed, or when something crashes. Those sessions leave a state file behind, and the app cheerfully reports a session that has not existed for two days. The fix was to record the process id at write time and check whether it is still alive at read time. A dead pid past a grace period means the file gets reaped.

**A file being read while it is written.** Rare, but it happens, and a half-written file parses as garbage. Writing to a temp file and renaming it makes the swap atomic, so the app only ever sees a complete file or the previous one. One extra line, and a whole category of flake disappears.

None of these are clever. They are just the difference between something that works on my machine and something that keeps working.

## Shipping it was its own problem

The app half is easy to distribute. The hook half is not — it needs entries in `~/.claude/settings.json`, and asking people to paste JSON into their config is how you get zero users.

A `.dmg` cannot do it at all; drag-and-drop installs an app and nothing else. A `.pkg` can run a post-install script, but it needs to be notarized or Gatekeeper blocks it, and notarization means an Apple Developer account at ninety-nine dollars a year. That is a strange thing to pay for a free menu bar utility.

Claude Code plugins turned out to solve exactly this. A plugin can ship its own `hooks.json`, and installing it registers the hooks. No config editing, no installer, no signing certificate. The app still builds from source with `swiftc`, which sounds like a downside but is not: an ad-hoc signature is valid on the machine that produced it, so Gatekeeper never has an opinion.

## Getting the icon wrong twice

I first used red for blocked, green for finished, grey for working. It looked fine in isolation and was wrong in two ways.

Green was the real mistake. macOS already shows a green dot in the menu bar when the camera is on. A second green dot next to it does not read as "your session finished". It reads as "something is watching you". Blue fixed it.

Grey was the quieter mistake. I had used the secondary label colour, which is designed to recede. On a menu bar with a dozen other icons competing, receding means invisible. Full contrast, and it was legible again.

The version I use now keeps one burst shape for every state and changes only the fill and the colour. Solid means something wants me. Outline means it does not. Terracotta for blocked, since that reads as Claude rather than as a system alert.

## A few things worth remembering

Plain files are an underrated interface. Two processes in different languages, no shared library, no protocol, and either one can be rewritten without touching the other.

The boring half should stay boring. Everything that could go wrong on the hot path was moved to the half I can attach a debugger to.

Distribution shapes design more than I expected. The decision to build from source rather than ship a binary was made entirely by the code signing rules, and it turned out to be the better choice anyway.

Colour is not decoration. Green already meant something on that menu bar before my app arrived, and I did not get to redefine it.

The code is at [github.com/ksvicks/claude-notify](https://github.com/ksvicks/claude-notify).
