# Repo Show — SKILL (public live instance)

The **show orchestrator** for Micropolis Class. Protocol for what you do *with* a show,
*in* a show, and *during* a live show — in **WillWrightShowForFood**, the public live repo.

**Interface:** [`CARD.yml`](CARD.yml) · **Nav/metadata:** [`GLANCE.yml`](GLANCE.yml) — **read both** before README  
**Human markup:** [`../../process/FORMAT.md`](../../process/FORMAT.md) (generated — `pnpm run facades`)  
**Girder:** [`../../process/repo-show-format.yml`](../../process/repo-show-format.yml#description_scaffolding)

### CARD + GLANCE split (WWSFF experiment → moollm upstream)

| File | Owns |
|------|------|
| **GLANCE.yml** | Title, iconic (tab label), description, keywords, **navigation SSOT** (parent/siblings/children, see_also, read_order) — smaller, no ads |
| **CARD.yml** | Interface only — methods, abilities, protocols, `compose_with`; points at `glance:` |
| **README.md** | Human article; teaser from GLANCE; nav links rendered at bottom for humans |

Do not maintain navigation in two places. When this split proves out here, promote into MOOLLM `skills/card` and `skills/glance` — extend upstream, don't permanently override.

---

## Self all the way down

- **Seed** — `repo-shows/<name>.yml` — one file, emailable, inherits SHOW
- **Plant** — `repo-shows/<name>/` — directory with SHOW.yml, sources, invitation
- **Keep seed alive** — sync via RESEED; replant in other repos

`repo-shows/REPO-SHOWS.yml` declares implicit inheritance for the whole collection.

## Lifecycle

`SEED → PLANT → ELABORATE → PROPOSE → INVITE → TEND → ANNOUNCE → AIR → PRODUCE → HARVEST → RESEED`

| Phase | WWSFF action |
|-------|----------------|
| ELABORATE | Gather sources in show dir — RTFR must be interesting |
| PROPOSE + INVITE | `characters/<guest>/invitation.md` — public, linkable |
| TEND | Guest + audience PR artifacts before air |
| ANNOUNCE | HN pointer → this repo (~1 week lead) |
| AIR | Twitch/YouTube + Cursor screencast + live PRs |
| HARVEST | cauldron → `skills/` + `packages/` |

## Time-shifted participation

All clocks write into **one GitHub repo**:

- **Before announce** — show planted; sources gathered
- **From announce** — HN pointer, issues, **TicketPRs** under `repo-shows/<show>/audience/<you>/` ([`process/ticket-pr.yml`](../../process/ticket-pr.yml))
- **Before guest accepts** — TicketPRs still welcome; seed interest so invitees see real questions
- **During** — Twitch chat; Don Philahue passes mic; brain-stream overlay ([`process/brain-stream.yml`](../../process/brain-stream.yml))
- **After** — implementation PRs; transcript; harvest

### TicketPR — Master ⇒ PR

**TicketPR** is a pun on **TicketMaster**: the toxic **Master** (monopoly gatekeeper) becomes **PR** (pull request — constructive, collaborative, reviewable, **free**). Same joke, opposite ethics.

Your **free public ticket** to attend live — a PR in the **show's** `audience/` directory (not `characters/`):

```
repo-shows/<show>/audience/<github-username>/
  questions.yml      # required — TicketPR
  CHARACTER.yml      # recommended — MOOLLM body
  CARD.yml           # recommended — ASK-QUESTION, WEAR-COSTUME, …
  GLANCE.yml
  SIMULATION.yml     # during/after show protocols
  costume.yml        # optional
```

**MOOLLM tutorial:** [`repo-shows/_TEMPLATE/audience/CHARACTER.md`](../../repo-shows/_TEMPLATE/audience/CHARACTER.md) — learn character creation; participate in simulation during/after the show.

**Low friction:** HN comments and GitHub issues. **High signal:** merged TicketPR + MOOLLM stack.

Don **Philahue** harvests HN + issues + TicketPRs into the show directory as air approaches. Guests may review and merge PRs. Optional donations → recognition + call-on priority (never required).

Live ritual: *YOUR NAME HERE: COME ON DOWN to the QUESTION IS RIGHT!*

Template: [`repo-shows/_TEMPLATE/audience/`](../../repo-shows/_TEMPLATE/audience/README.md) · Flagship: [`repo-shows/will-wright/audience/`](../../repo-shows/will-wright/audience/README.md)

Miss live? Your merged TicketPR question can still get asked; Q+A memorialized in repo + YouTube.

## Intro ritual

1. *"So you have a Repo to Show us?"*
2. *"This episode's repos are:"* — game-show intro per repo
3. Guest as **Repo Man, Woman, or Anybody**
4. License + credit beat
5. Optional controlled AI-slop audience gag — then anti-slop for the rest

## Close ritual

Rotating sign-offs: *"Have a big fun!"* · *"Goodnight, until tomorrow."* (Thomas Cherryhomes kinship)

Menu of **continuations**: homefun prompt, recommended viewing, repo trailheads.

## Homefun not homework

*"No homework — but as much homefun as you like!"*

Submit PRs; best work discussed on later episodes. Graded by [`process/homefun-grading.yml`](../../process/homefun-grading.yml) — flagship question: **Does the commit message match the thinking blocks?**

## Rig spectrum

Declare honestly in [`rigs/<slug>.rig.yml`](../../rigs/README.md) + [`SETUP.md`](../../rigs/_TEMPLATE.SETUP.md):

| Class | Meaning |
|-------|---------|
| artisanal | Hand-only — zero AI tokens |
| intentional | Deliberate craft |
| conscientious | Show-your-work ethics |
| vibe | AI-forward flow |
| orchestrated | Full agent stack |
| stick_shift | Multi-model routing — proof in spend log |

Full spec: [`process/repo-show-format.yml`](../../process/repo-show-format.yml) · [`process/ai-offs.yml`](../../process/ai-offs.yml)

## Game-show formats (same SHOW skill, different TYPE)

| Format | Spec |
|--------|------|
| Code That Spec | [`process/code-that-spec.yml`](../../process/code-that-spec.yml) |
| Manual Transmission | [`process/manual-transmission.yml`](../../process/manual-transmission.yml) |
| Micropolis AI Drag Race | [`process/DRAG-RACE.md`](../../process/DRAG-RACE.md) |
| Retrocomputing Drive | [`process/challenges/RETROCOMPUTING.md`](../../process/challenges/RETROCOMPUTING.md) |

Slats judges flair; spreadsheet runs the piss test.

## Characters

- **Guests** — `characters/<id>/` — portrayal standards, public invitation
- **Don Philahue** — MC orchestrator avatar
- **Slats** — fictional judge + RoboResurrection quest
- **Audience** — TicketPR per show (`audience/<github-user>/questions.yml`); long-lived characters in `characters/`; question-advertisements fire by relevance

Governed by [`schemas/portrayal-standards.yml`](../../schemas/portrayal-standards.yml).

## Harvest

After AIR:

1. Melt via moollm **cauldron**
2. SCOOP skills into [`skills/`](../README.md)
3. Implement in [`packages/`](../../packages/README.md) / [`apps/`](../../apps/README.md)
4. RESEED portable show yaml for other lands

## WWSFF-specific anchors

| Topic | Path |
|-------|------|
| Vision | [`process/VISION.md`](../../process/VISION.md) |
| ShowMaker network | [`process/showmaker-network.yml`](../../process/showmaker-network.yml) |
| Live repo policy | [`process/live-repo.yml`](../../process/live-repo.yml) |
| Will kickoff | [`repo-shows/will-wright/`](../../repo-shows/will-wright/README.md) |
| Lars + Thomas retro | [`characters/lars-brinkhoff/`](../../characters/lars-brinkhoff/README.md) · [`characters/thomas-cherryhomes/`](../../characters/thomas-cherryhomes/README.md) |

## Methods (invoke)

- **ORIENT** — read root README + GLANCE + active show
- **FIND-GUEST** — `characters/INDEX.yml`
- **FIND-SHOW** — `repo-shows/INDEX.yml`
- **SEED / PLANT / RESEED** — show lifecycle
- **HARVEST** — delegate cauldron

## Compose with (moollm upstream)

- cauldron · character · thoughtful-commitment · rubric · experiment · cursor-mirror · advertisement

## See also (rabbit holes)

| Trail | Start here |
|-------|------------|
| Repo Show spine | [`process/cross-links.yml`](../../process/cross-links.yml) → `repo_show_spine` |
| Drag race + ai-offs | [`process/cross-links.yml`](../../process/cross-links.yml) → `drag_race_and_ai_offs` |
| Retro computing | [`process/cross-links.yml`](../../process/cross-links.yml) → `retrocomputing_drive` |
| MOOLLM compose | [`process/cross-links.yml`](../../process/cross-links.yml) → `moollm_compose` |
| Format girder | [`process/repo-show-format.yml`](../../process/repo-show-format.yml) |
| Generated markup | [`process/FORMAT.md`](../../process/FORMAT.md) — `pnpm run facades` |
| Harvest registry | [`skills/INDEX.yml`](../INDEX.yml) |
| Upstream skills | [moollm/skills/README.md](https://github.com/SimHacker/moollm/skills/README.md) |

---

Part of **MOOLLM** · [`SimHacker/moollm`](https://github.com/SimHacker/moollm) · Public world: [`WillWrightShowForFood`](https://github.com/SimHacker/WillWrightShowForFood)
