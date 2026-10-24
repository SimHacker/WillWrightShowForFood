# Will Wright Show For Food

A Repo Show is a recorded conversation whose stage is a public GitHub repository. The guest talks
about their work, the audience follows along in the repo and asks questions as issues and pull
requests, and afterward the ideas get built into code and reusable skills here. Will Wright, who
designed SimCity and The Sims, accepted the invitation to the first one in July 2026. Don Hopkins
hosts.

This repo holds the guests, the shows, and what gets built from them. It is public but unannounced
while invitations go out, so please don't post links to it yet.

[![The User Interface Flower Child](characters/will-wright/media/DonHopkinsSimsCreditsIcon.jpg)](repo-shows/will-wright-premiere/README.md)

## Try it now

These run in a browser with nothing to install.

| What | Where |
|------|-------|
| A PDP-7 and Type 340 emulator running PIXIE (1969), DUEL, PDP-7 UNIX, Mitch Bradley's Forth, a Turing machine and Minsky's Ultimate Machine | [hyperties.org/cabinet](https://hyperties.org/cabinet/) · [23-minute tour](https://www.youtube.com/watch?v=lo8kdY-5i6c) · [source](packages/cabinet/README.md) |
| ULTIMATE HAND: your webcam hand becomes the Ultimate Machine's hand, in Forth | [hyperties.org/cabinet/ultimate-hand](https://hyperties.org/cabinet/ultimate-hand/) |
| HyperTIES, Ben Shneiderman's 1980s hypertext system, restored | [reading room](https://hyperties.org/archive/reading-room/) · [source](apps/ties/FORMAT.md) |
| Character animation from The Sims 1 | [vitamoo.space](https://vitamoo.space) |
| SimCity, open source as Micropolis | [micropolisweb.com](https://micropolisweb.com/) |
| CAM6, a cellular automata machine simulator | [donhopkins.com/home/CAM6](https://donhopkins.com/home/CAM6/) |
| eBike Safari, a first prototype | [ebike-safari.com](https://ebike-safari.com/) |

## Start here

| If you are | Start with |
|------------|-----------|
| Will Wright | [Your invitation](characters/will-wright/invitation.md), then [browse in any order](repo-shows/will-wright-premiere/BROWSE.md) |
| Someone invited | [How we portray people](schemas/portrayal-standards.md), then your page in [characters/](characters/README.md) |
| A Sims or SimCity player | [The premiere](repo-shows/will-wright-premiere/README.md) and [Will's 1996 Stanford talk](characters/will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/README.md) |
| Watching a stream | [How a show runs](process/repo-show-format.md) |
| A programmer | [SETUP.md](SETUP.md), then [packages/](packages/README.md) |
| Into old machines | [The cabinet](packages/cabinet/README.md) and [the retro tour](process/entryways/retro.md) |
| A teacher | [The educator tour](process/entryways/educator.md) |
| An archivist or historian | [The archivist tour](process/entryways/archivist.md) and [RIGHTS.md](RIGHTS.md) |
| Planning your own show | [The repo-show skill](skills/repo-show/README.md) and [the show network](process/showmaker-network.yml) |
| A platform or publisher | [Vision](process/vision-and-ambition.md) |
| A bot | [FOR-BOTS.md](FOR-BOTS.md) |

All the tours: [ENTRYWAYS.md](ENTRYWAYS.md). Paths that cut across topics: [TRAILS.md](TRAILS.md).
A hand-built topic directory of everything: [Palmhoo](palmhoo/README.md).

## What's in the repo

| Directory | What it holds | Index |
|-----------|---------------|-------|
| [characters/](characters/README.md) | One directory per person or character: invitations to living guests, memorials, and fictional characters | [INDEX.yml](characters/INDEX.yml) |
| [repo-shows/](repo-shows/README.md) | One directory per show, from the premiere to proposed episodes | [INDEX.yml](repo-shows/INDEX.yml) |
| [packages/](packages/README.md) | Code: the PDP-7 cabinet, Embedded Constraint Graphics, TinyTeco, PIXIE, Turing machines | |
| [apps/](apps/README.md) | HyperTIES, Soul Angel, SimFaux, eBike Safari, stream tools | [CARD.yml](apps/CARD.yml) |
| [process/](process/README.md) | How shows are made: format, invitations, game-show formats, production | [INDEX.yml](process/INDEX.yml) |
| [skills/](skills/README.md) | MOOLLM skills harvested from shows | [INDEX.yml](skills/INDEX.yml) |
| [schemas/](schemas/README.md) | Portrayal standards, invitation workflow, rig schema | |
| [designs/](designs/) | Design notes that span shows | |
| [catalogs/](catalogs/README.md) | Sims custom content any show can recommend | |
| [bits/](bits/README.md) | Running gags, themes and rituals | |
| [videos/](videos/README.md) | Reproducible clip extraction from source video | |
| [rigs/](rigs/README.md) | Participants' setups, AI or not | |
| [kernel/](kernel/README.md) | How this repo plugs into [MOOLLM](https://github.com/SimHacker/moollm) | |

People and LLMs read the same files. Each directory has a README for people and, often, YAML for
programs; [GLANCE.yml](GLANCE.yml) and [CARD.yml](CARD.yml) summarize the repo for MOOLLM.

## How a show runs

A show is announced ahead of time, usually on Hacker News. Before it, you read the repo. During it,
you follow along with whatever you like: vim, Emacs, Cursor, a notebook, or paper. AI is optional,
and people who program by hand are as welcome as anyone.

The guest is the topic, starting from their own work. Questions come in as issues, pull requests,
and live chat. To get a seat, submit a [TicketPR](process/ticket-pr.yml): a pull request adding
your questions under `repo-shows/<show>/audience/<your-github-username>/`. It's free. An issue or a
comment on the announcement works too.

Afterward, the ideas get built into code and [skills](skills/README.md) in this repo. Some episodes
are game shows instead, such as [Code That Spec](process/code-that-spec.yml) and the
[Micropolis AI Drag Race](process/micropolis-ai-drag-race.md). The full definition is in
[repo-show-format.yml](process/repo-show-format.yml).

If you use AI, we'd like to know your setup and what it cost: tools, models, tokens. See
[rigs/](rigs/README.md) and [ai-offs](process/ai-offs.yml).

## Build

```bash
nvm use && corepack enable && pnpm install && pnpm run verify
```

Details: [SETUP.md](SETUP.md). The repo is a pnpm monorepo (`apps/`, `packages/`) alongside
directories of Markdown and YAML that [MOOLLM](https://github.com/SimHacker/moollm) can read.

## Get in touch

[Open an issue](https://github.com/SimHacker/WillWrightShowForFood/issues) or a pull request. Anyone
portrayed here can correct their page or ask for it to be removed; see
[portrayal standards](schemas/portrayal-standards.md). Who owns what: [RIGHTS.md](RIGHTS.md).

## Related repos

| Repo | What |
|------|------|
| [SimHacker/moollm](https://github.com/SimHacker/moollm) | MOOLLM: a git repo as a world for people and LLMs |
| [SimHacker/MicropolisCore](https://github.com/SimHacker/MicropolisCore) | Micropolis (SimCity), VitaMoo, Screen Angel |
| [SimHacker/Hyperties](https://github.com/SimHacker/Hyperties) | The HyperTIES restoration |
| [SimHacker/CAM6](https://github.com/SimHacker/CAM6) | The CAM6 simulator |
| [MitchBradley/pdp7forth](https://github.com/MitchBradley/pdp7forth) | The PDP-7 Forth the cabinet runs |

## The Crazy Idea Jam

The strangest ideas in the project, collected in one place: a robot resurrection on Easter Sunday,
cellular automata that melt your city if you don't pay, GitHub as a multiplayer game.
[Read it](process/crazy-idea-jam.md).

— Don Hopkins
