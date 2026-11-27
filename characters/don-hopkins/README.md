---
title: Don Hopkins
signifier: "👤"
authored_by: don-hopkins
resolution: readme
backbone: career/*.yml
---

# Don Hopkins

User-interface designer and programmer. Pie menus, SimCity on Unix, The Sims, Micropolis,
and this repository, including the [Machine Room](https://hyperties.org/machine/), whose
old computers run in the browser. Lives in Amsterdam.

Write to him by [opening an issue](https://github.com/SimHacker/WillWrightShowForFood/issues),
or send a pull request. Photos are in [`media.md`](media.md), books in [`books/`](books/README.md),
the short versions of this page in [`GLANCE.md`](GLANCE.md) and [`CARD.md`](CARD.md).
How to support the work is in [`SUPPORT.md`](../../SUPPORT.md).

## Work

| Years | Where | What |
|-------|-------|------|
| 1985–1990 | University of Maryland, Human-Computer Interaction Lab | Pie menus (the CHI '88 paper with Callahan, Weiser and Shneiderman), HyperTIES, the PSIBER Space Deck |
| 1987, 1990–1991 | Sun Microsystems | The NeWS Toolkit team under Warren Teitelman: PostScript user interfaces, pie menus, PizzaTool |
| 1991–1992 | Turing Institute, Glasgow | HyperLook, with Arthur van Hoff, and SimCity built on it |
| 1992–1993 | Carnegie Mellon | Garnet: Opal graphics, a pie-menu window manager |
| 1993–1996 | Kaleida Labs | ScriptX, an object-oriented multimedia Lisp; DreamScape, shown at WWDC 1995 |
| 1996–1997 | Interval Research | MediaFlow, Bounce, Director plug-ins |
| 1997–2007 | Maxis and Electronic Arts | The Sims: character animation (VitaBoy), pie menus, Transmogrifier and the other modding tools; SimCity for the OLPC laptop, released under the GPL as Micropolis |
| 2002–2003, 2009–2014 | Stupid Fun Club | Research programmer for Will Wright: robots, and films about how people treat them |
| 2005– | NutritionQuest | Chief architect: TurboGears, SQLObject and Genshi, running a decade on |
| 2007–2009 | TomTom, Amsterdam | Senior developer; iLoci, a memory-palace app, on the side |
| 2014–2021 | Pantomime | Chief architect: networked AR and VR |
| 2017– | Ground Up Software | His own company: PieCraft, Sims animation research |
| 2021– | Leela AI | Senior software engineer |
| 2022– | Gallium Studios | Consulting for Will Wright: procedural voxel worlds, cellular automata |

The full résumé is in [`hire-me.md`](hire-me.md) and [`career/work-history.yml`](career/work-history.yml).

## How one thing led to another

He started out writing Forth on a 6502, got onto the ARPANET and into Zork, and began
designing pie menus. He did not invent them: they go back to PIXIE in 1969. PostScript gave
the menus a language, and NeWS, a window server programmed in PostScript, let a client send
it code rather than commands. HyperLook, after HyperCard, ran SimCity in NeWS with scalable
graphics, a user-interface editor and drawing editors, and people could play it together
across the network. At Maxis the dollhouse became The Sims, and Transmogrifier let players
make their own objects. The OLPC laptop brought SimCity's source out as Micropolis. ScriptX
at Kaleida was a multimedia Lisp, and great fun; DreamScape was an early memory palace. At
Stupid Fun Club the robots asked people for empathy. Constraint systems, from Garnet
through OpenLaszlo to Svelte, have kept user interfaces declarative all along. Now the
repository itself is the stage: MOOLLM, where directories are rooms, and the Repo Show.

## Now

Micropolis on the web, in WebAssembly and SvelteKit. The Repo Show: conversations held in a
GitHub repository that end in working code. The Sims content tools rebuilt for the browser:
Transmogrifier, RugOMatic, WigFabrik. And the Machine Room, whose Apple ][ disks carry his Forth and his H19
terminal.

## The files

### About him

- [`about-host.md`](about-host.md): the career on one screen.
- [`hire-me.md`](hire-me.md): available for hire, 2026; references Will Wright and Henry Minsky.
- [`media.md`](media.md): photos and screenshots, from the Queen's Day Lisp shirt to Micropolis demos.
- [`GLANCE.md`](GLANCE.md), [`CARD.md`](CARD.md), [`CARD.yml`](CARD.yml), [`CHARACTER.yml`](CHARACTER.yml): the same profile at four lengths.
- [`browse-the-bouquet.yml`](browse-the-bouquet.yml): every topic file here, by name.
- [`sync-sources.yml`](sync-sources.yml): where these files come from upstream.

### Pie menus (1988)

- [`pie-menus-chi-88-and-beyond.md`](pie-menus-chi-88-and-beyond.md): from PIXIE in 1969 to the CHI '88 study, then SimCity, The Sims and MOOLLM.
- [`queer-oui-for-the-straight-gui.md`](queer-oui-for-the-straight-gui.md): rescuing a design by keeping its look and replacing how it is handled; with [Edd Coates](../edd-coates/).
- [`jojo-on-ui.md`](jojo-on-ui.md): Joseph Francis's user-interface satire.
- [`portrayal/presentations.yml`](portrayal/presentations.yml): papers and talks, with links.

### NeWS, HyperLook and ScriptX (1988–1996)

- [`axis-of-eval-send-code-not-commands.md`](axis-of-eval-send-code-not-commands.md): NeWS, the X Windows critique, Owen Densmore's object system, and sending code instead of commands.
- [`hyperlook-news-postscript-simcity.md`](hyperlook-news-postscript-simcity.md): HyperLook SimCity.
- [`porter-duff-postscript-to-webgpu.md`](porter-duff-postscript-to-webgpu.md): the Porter–Duff imaging model, from the window server through Cairo and Canvas to WebGPU.
- [`kaleida-scriptx-dreamscape-multimedia-lisp-machine.md`](kaleida-scriptx-dreamscape-multimedia-lisp-machine.md): ScriptX and DreamScape.

### Interval Research (1996–1997)

- [`interval-research-pluggers-and-mediaflow.md`](interval-research-pluggers-and-mediaflow.md): MediaFlow, Bounce, Director plug-ins, and the pie-menu talk he gave before he was hired.
- [`tom-ngo-embedded-constraint-graphics-at-interval.md`](tom-ngo-embedded-constraint-graphics-at-interval.md): Tom Ngo's embedded constraint graphics.
- [`breakfast-simplex-barycentric-direct-manipulation.md`](breakfast-simplex-barycentric-direct-manipulation.md): barycentric coordinates and pie menus.
- [`mediaflow-design-comments.md`](mediaflow-design-comments.md): the MediaFlow design essay.
- [`ifc-vs-bongo-comparison.md`](ifc-vs-bongo-comparison.md): Netscape's IFC against Marimba's Bongo.
- [`history/interval-research.yml`](history/interval-research.yml) and [`history/README.md`](history/README.md): the same history as records.

### SimCity and The Sims (1991–2007)

- [`career/simcity-lineage.yml`](career/simcity-lineage.yml): SimCity from the network version to OLPC and WebAssembly.
- [`open-sourcing-simcity-for-olpc.md`](open-sourcing-simcity-for-olpc.md): the December 2006 letter to Rod Humble that cleared SimCity for OLPC and the GPL.
- [`career/contracts/README.md`](career/contracts/README.md): the contracts that made the release possible.
- [`../will-wright/primary-sources-evidence-room.md`](../will-wright/primary-sources-evidence-room.md): Will Wright's sources.
- [`the-sims-transmogrifier-mod-tools.md`](the-sims-transmogrifier-mod-tools.md): Transmogrifier, RugOMatic, SimShow and VitaBoy.
- [`olpc-micropolis-python-pygtk.md`](olpc-micropolis-python-pygtk.md): SimCity on the XO laptop, in Python around the Tcl/Tk original.
- [`teaching-complicated-systems-without-a-manual.md`](teaching-complicated-systems-without-a-manual.md): answering Tade Mehl on teaching a system without a manual.
- [`canon-cant-and-teachable-worlds.md`](canon-cant-and-teachable-worlds.md): notes on Nick Tau's Canon MUD.
- [`writing/README.md`](writing/README.md) and [`writing/INDEX.yml`](writing/INDEX.yml): his essays and sources.

### Stupid Fun Club (2009–2014)

- [`career/stupid-fun-club.yml`](career/stupid-fun-club.yml): what he built there.
- [`stupid-fun-club-empathy-and-servitude.md`](stupid-fun-club-empathy-and-servitude.md): *Servitude* and *Empathy*, one-minute films about robots.
- [`talks/empathy-and-servitude.yml`](talks/empathy-and-servitude.yml): the talk about them.
- [Slats](../robots/slats/README.md): the waiter robot he programmed.

### Constraints and platforms

- [`garnet-to-svelte-constraint-ui-lineage.md`](garnet-to-svelte-constraint-ui-lineage.md): Garnet to OpenLaszlo to Svelte.
- [`nutritionquest-turbogears-genshi-alive-pd.md`](nutritionquest-turbogears-genshi-alive-pd.md): ten years of TurboGears at NutritionQuest.
- [`yoot-tower-open-source-and-alan-kay-interview.md`](yoot-tower-open-source-and-alan-kay-interview.md): Yoot Tower, and a 1993 interview with Alan Kay.

### Micropolis today

- [`micropoliscore-design-docs-packages-code-content.md`](micropoliscore-design-docs-packages-code-content.md): MicropolisCore, the WebAssembly engine and its tools.
- [`career/project-threads.yml`](career/project-threads.yml): how the projects connect.

### MOOLLM and the Repo Show

- [`import-self-from-self.md`](import-self-from-self.md): MOOLLM, where directories are rooms and skills inherit like Self objects.
- [`self-interest-narcissas-mirror-david-ungar.md`](self-interest-narcissas-mirror-david-ungar.md): a proposed show with David Ungar.
- [`moollm-microworld-os-talk.md`](moollm-microworld-os-talk.md) and [`talks/moollm-microworld-os.yml`](talks/moollm-microworld-os.yml): the talk, *The Sims for your filesystem*.
- [`repo-show-host-facet.md`](repo-show-host-facet.md): hosting the Repo Show.
- [`ideas.md`](ideas.md): guests he would like to invite, and shows to build.
- [`talks/README.md`](talks/README.md) and [`talks/INDEX.yml`](talks/INDEX.yml): all the talks.

### Records

- [`career/INDEX.yml`](career/INDEX.yml): where the records start.
- [`career/lineage.yml`](career/lineage.yml): the ideas, from MUD1 and LambdaMOO to MOOLLM.
- [`career/range.yml`](career/range.yml): what he can build, from 6502 Forth to Rust and WebAssembly.
- [`career/work-history.yml`](career/work-history.yml): the work, by date.
- [`career/on-stream.yml`](career/on-stream.yml): Don himself, as against [Don Philahue](../don-philahue/README.md), the announcer character.
- [`career/README.md`](career/README.md) and [`career/contracts/transmogrifier-distribution-license-notes.md`](career/contracts/transmogrifier-distribution-license-notes.md): the career folder, and Transmogrifier's license terms.
- [`portrayal/README.md`](portrayal/README.md), [`portrayal/voice.yml`](portrayal/voice.yml), [`portrayal/heroes.yml`](portrayal/heroes.yml): how he writes, and whom he learned from.

## Elsewhere

- [donhopkins.com](https://donhopkins.com)
- [SimHacker/MicropolisCore](https://github.com/SimHacker/MicropolisCore)
- [SimHacker/moollm](https://github.com/SimHacker/moollm)
- [Don in moollm's adventure-4](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/real-people/don-hopkins)

Shelved in Palmhoo under [Generative Art & Music](../../palmhoo/generative-art-and-music/README.md),
[Concurrency & Messaging](../../palmhoo/concurrency-and-messaging/README.md) and
[Packages](../../palmhoo/packages/README.md).

↑ [`../README.md`](../README.md) · [`../../process/cross-links.yml`](../../process/cross-links.yml)
