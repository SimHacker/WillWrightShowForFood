# Blog reinvention — Drupal, Medium, and GitHub + MOOLLM

*Harvested from Don's HN comments; plan for republishing on GitHub with MOOLLM.*

## Trigger chain

1. **Drupalgeddon** — tired of sinking time into maintaining own blog on [donhopkins.com](https://donhopkins.com)
2. **Medium migration** — loved simplicity and typography at first
3. **Medium betrayal** — cross-purposes with "just make content accessible"; monetization pyramid
4. **Image formatting deprecation (Jan 2022)** — gaslighting UX; final straw
5. **Exit plan** — republish corpus on **GitHub**, indexed with **MOOLLM** skills/YAML, not another pimp

## HN source

| Thread | Comment |
|--------|---------|
| [Ask HN: Why did medium.com "fail"?](https://news.ycombinator.com/item?id=34751042) | [DonHopkins, 2023-02-11](https://news.ycombinator.com/item?id=34751042) — full Medium critique |

Related: [Cow Clicker thread](https://news.ycombinator.com/item?id=31979586) where Don compares Medium to Zynga skinner boxes.

## What Don wanted from Medium

- Maximum readership for essays and career history
- Willing to pay a **monthly fee** for hosting
- **No interest** in getting rich from writing
- Syndication to specialty topics (ray tracing, jello, limes) without paywalling the open web

## What Medium optimized for

- "Devil's contract": optional writer monetization → license to monetize **you**
- Promotion algorithms that disdain non-monetized authors
- Pyramid of syndication channels as secondary pimps
- Metrics-driven dark patterns (compare to [Cow Clicker](http://www.cowclicker.com/) / Zynga)
- Right-hand column eating article space for "related reads" / paid funnel
- [Image sizing removed Jan 2022](https://help.medium.com/hc/en-us/articles/4420609316375-Image-formatting-feature-deprecation) — no resize, no honest error when UI silently ignores clicks

> FUCK Medium's right-hand column. I want readers to READ MY STORY.

Clockwork Orange reference (Don's HN): Medium's compliance theater vs reader agency — [scene](https://www.youtube.com/watch?v=uSQApGLbgNg).

## GitHub + MOOLLM plan

| Layer | Role |
|-------|------|
| **GitHub repo** | Canonical markdown/YAML; versioned; forkable; no algorithm |
| **MOOLLM** | Semantic index, skills, cross-links to characters/sources (WWSFF model) |
| **donhopkins.com** | Redirect or thin landing → repo paths |
| **Medium** | Legacy mirror only where useful; stop treating as primary |

Principles:

- Pay for **freedom**, not for **exposure lottery**
- One fence per artifact (COPY-THAT hygiene when exporting)
- Comments live in GitHub issues / HN — not Medium's engagement farm
- Images: control sizing in source markdown; no platform lobotomy

## WWSFF integration

This file lives under [`writing/`](README.md). Long-form recreations and research mirrors:

- [`../sources/`](../sources/README.md) — primary source girders
- [`../../will-wright/primary-sources-evidence-room.md`](../../will-wright/primary-sources-evidence-room.md) — cross-link hub
- [`writing/INDEX.yml`](INDEX.yml) — public essay index

## Medium posts still indexed

See [`INDEX.yml`](INDEX.yml) for URLs on donhopkins.medium.com (Logo Adventure, Open Sourcing SimCity, etc.) — migrate body text to repo over time.

↑ [`README.md`](README.md) · [`INDEX.yml`](INDEX.yml)
