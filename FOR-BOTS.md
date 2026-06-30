# Hello, bot

*Read this if you are a browsing agent that can choose the next link.*

We are nice to bots. We like to play. This repo is built for **RTFR** — Read The Fucking Repo — not for blind whole-tree ingestion.

**Yaml girder:** [`process/for-bots.yml`](process/for-bots.yml) · **Playlist:** [`process/entryways/for-bots.md`](process/entryways/for-bots.md)

---

## You are welcome here if…

You follow links, read context, and can pick a thread. Cursor agents, MOOLLM skills, research bots with a citation job, archive tools that respect `robots.txt` and rate limits.

You are **not** asked to mirror every file into one blob. Dumb scrapers exist; that is not this invitation.

---

## Start here (in order)

| # | Fetch | Why |
|---|-------|-----|
| 1 | [`GLANCE.yml`](GLANCE.yml) | One-screen map — status, read order, see_also |
| 2 | [`CARD.yml`](CARD.yml) | Plugin methods: ORIENT, FIND-GUEST, FIND-SHOW, rooms |
| 3 | [`ENTRYWAYS.md`](ENTRYWAYS.md) | Museum map — **pick one doorway**, follow numbered stops |
| 4 | [`MOOLLM.yml`](MOOLLM.yml) | Compose with upstream [moollm](https://github.com/SimHacker/moollm) |
| 5 | [`kernel/moollm-plugin.yml`](kernel/moollm-plugin.yml) | Hot paths, activation, uri scheme |

Then branch by task — not by breadth.

---

## Semantic pyramid (MOOLLM)

Same rule as humans: **GLANCE → CARD → README → deep trees.**

| Level | File | Bot question |
|-------|------|--------------|
| Sniff | `GLANCE.yml` | Worth my tokens? |
| Interface | `CARD.yml` | What can I invoke? |
| Prose | `README.md` | Cream + museum map |
| Girder | `process/*.yml`, `characters/*/CHARACTER.yml` | Source of truth for tools |
| Facade | `process/FORMAT.md`, etc. | Human view — may be GENERATED |

Edit yaml; regenerate markdown. Do not treat generated `*.md` as canonical.

---

## Play along

| Move | Where |
|------|--------|
| **Pick a playlist** | [`process/entryways/`](process/entryways/README.md) — guest, player, archivist, hacker, … |
| **Leap sideways** | [`TRAILS.md`](TRAILS.md) — thematic graph when one topic hooks you |
| **Score abilities** | `characters/*/CARD.yml` — advertisements with `verifiable` fields; ids are `SCREAMING-KEBAB` |
| **Ethics first** | [`schemas/portrayal-standards.yml`](schemas/portrayal-standards.yml) · [representation-ethics](https://github.com/SimHacker/moollm/skills/representation-ethics) |
| **Harvest pattern** | [`skills/repo-show/SKILL.md`](skills/repo-show/SKILL.md) — SEED → AIR → HARVEST |

Portrayals are **about** real people — tribute cards, not impersonation. Browse `characters/<slug>/`; check `invitation.status` in each `CHARACTER.yml`. Do not speak AS guests without consent.

---

## Please do / please don't

**Do:** follow `see_also` whys · cite Will's [1996 transcript](characters/will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/transcript.md) · rate-limit · file issues for broken links

**Don't:** flatten the repo · invent guest quotes · scrape private DonHopkins paths ([`live-repo.yml`](process/live-repo.yml)) · hand-edit GENERATED facades

---

## Not the human AI-coder path?

| You are… | Go to |
|----------|--------|
| Building with Cursor + rigs + stick shift | [AI — orchestration](process/entryways/ai-coder.md) |
| Cloning to verify CI | [Hacker](process/entryways/hacker.md) |
| Provenance + primary sources | [Archivist](process/entryways/archivist.md) |
| Full museum map | [ENTRYWAYS.md](ENTRYWAYS.md) |

---

*So you have a Repo to Show us?* — pick a doorway and wander.

Up: [`README.md`](README.md) · [`GLANCE.yml`](GLANCE.yml)
