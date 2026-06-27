# Vision — tip of the pyramid

**If you stumbled here** — from Hacker News, a link, a search, or someone’s
forward — this page is the short version of what you’re looking at and why it
exists.

**If you represent a platform, archive, publisher, or production shop** —
Netflix-shaped, Brewster-shaped, Woz-shaped, or otherwise — same page applies.
Read the repo. Run `pnpm run verify`. No meeting required to understand the shape.

---

## What this is (one paragraph)

**Will Wright Show For Food** is a **public GitHub-native show format** called a
**Repo Show**: the stage is the repository itself. People **RTFR** (read the
repo), follow along on **whatever rig they bring** (AI optional), and watch a
guest introduced as a **Repo Man** — first invited guest: **Will Wright**, in a
topic-less kickoff orbiting his **1996 Stanford talk** on microworlds. Ideas
from the conversation get **documented, built, and bred back** into a **graph
of shows** (the ShowMaker network) and — critically — into **MOOLLM skills**
(`skills/`: inheritable protocols harvested from each show via cauldron SCOOP).
Pull requests carry technique DNA. It is **Micropolis Class**: real people,
credited ideas, constructionist payoff.

---

## Long-term ambition — not a promise

Don Hopkins and Will Wright have been circling this shape **since that 1996
presentation — and before**. Microworlds, simulation as thoughtware, design in
public: decades of practice. The Winograd seminar talk is the anchor artifact
([1996 source bundle](../repo-shows/will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/));
**this repo is the first public point of origin** — the **tip of the pyramid**,
small on purpose, inspectable today.

**We are not promising:**

- A greenlit series, stream, or distribution deal  
- Confirmed guest participation (Will’s invitation is drafted; consent not yet asked)  
- Viral scale, revenue, or a ship date  
- A finished product — this is **origin**, not launch day  

**We are documenting** a direction and building the **concrete** underneath it.

---

## Skills — the big harvest

Shows are the stage. **Skills are the durable artifact.**

Each Repo Show is meant to leave behind **MOOLLM skills** — not slide decks,
but runnable protocols (`GLANCE.yml` → `CARD.yml` → `SKILL.md`) you compose
with [SimHacker/moollm](https://github.com/SimHacker/moollm). Live conversation
melts in the **cauldron**; **SCOOP** lifts finished technique into [`skills/`](../skills/).
Fork them, nest them, breed them back via PR.

**Hand programmers:** extra respect for **artisanal** work without AI — intentional and
conscientious coders too. (See [David Ungar / Self × MOOLLM](repo-shows/david-ungar-self-moollm.yml)
show seed — rig culture Don taught with Ungar at Kaleida.)

**Vibe coders & orchestrated rigs:** declare your class. **AI users:** please share your rig (tools, models, MCP, skills, repos, MOOLLM wiring,
contexts) via issue or PR — we want real feedback, not vendor answers.

Over time this repo becomes a **skill forest** traced to guests, shows, and
git history — how a 1996 microworlds talk becomes *runnable* decades later.

---

## Curb appeal, brutalist GitHub

The README is the storefront. Under it:

| Layer | What it is |
|-------|------------|
| **Facade** | Markdown — warm, readable, browse without a GitHub account |
| **Girder** | YAML — `SHOW.yml`, `CARD.yml`, indexes, schemas, process definitions |
| **Slab** | Monorepo — pnpm, Python venv, `pnpm run verify`, CI on PRs |

We are not fooling around. If something is not built yet, the yaml says **seed**
or **roadmap**. If it is built, you can clone it and break it.

---

## Why different people might care

**Educators & constructionists** — *This is for the people we are inviting.*
**Brian Harvey** (Logo, *Simply Scheme*, *CS Logo Style*, Snap!, BJC),
**Jens Mönig** (Snap! architect — Micropolis × Snap!, blocks, distributed systems),
**Walter Bender** (OLPC Stone Soup, open-sourcing SimCity, constructionist playgrounds).
Repo Shows as **constructionist microworlds**: Winograd seminar lineage, Papert energy,
live conversation → cauldron → **MOOLLM skills** your students can run. Skill authoring
as programming-by-demonstration for the LLM era. RTFR with your class; fork a show seed;
PR harvested skills back. Show seeds: [`repo-shows/INDEX.yml`](../repo-shows/INDEX.yml)
(consent not yet asked for any guest).

**General audience / viral thread** — A show you can *enter*. Fork it. Run your
own parallel show on your branch. Man-vs-machine taste contests welcome.
Dance-off optional. No AI required.

**Archives & libraries** (Internet Archive ethos, university libraries, permanent
record keepers) — Attributed, forkable lineage from **1996 forward**. Talk
transcripts, show objects, technique DNA in git — meant to outlive any one
platform. Mirror and cite; the graph is the publication.

**Builders & hardware hackers** (Woz energy) — Schematics in the repo. Declare
your rig class: bare hands to full orchestration. Show your workflow; breed
winners back via merge.

**Publishers & editorial** — Not a flat playlist: a **graph** of show objects
and typed links. Each node is a directory with `CARD.yml` + README + optional
pitch. Anthologize branches; credit by git history.

**Platforms & production** (streaming, YouTube, Twitch, podcasts) — We are **not**
pitching a deal. We are planting a **format** you can inspect: announce a
pointer → audience RTFR on their rigs → live guest → harvest to code and skills
→ network grows by PR. Production can wrap the same object graph if the shape
fits.

---

## The ShowMaker network

Shows are **nodes**. Relationships are **edges**. You run a show on **your
branch**; you **PR to link** your show object into our index. Over time:
automation to scaffold CARDs and link PRs. Details:
[`showmaker-network.yml`](showmaker-network.yml).

---

## Start here

| Depth | File |
|-------|------|
| This page | `process/VISION.md` |
| Yaml girder | [`vision-and-ambition.yml`](vision-and-ambition.yml) |
| How a show runs | [`repo-show-format.yml`](repo-show-format.yml) |
| Show graph | [`showmaker-network.yml`](showmaker-network.yml) |
| Skills harvest | [`../skills/README.md`](../skills/README.md) |
| 1996 anchor | [`../repo-shows/will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/`](../repo-shows/will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/) |
| Repo front door | [`../README.md`](../README.md) |

**Talk to us:** [open an issue](https://github.com/SimHacker/WillWrightShowForFood/issues) —
inspect first, fork second, talk third.

— Don Hopkins
