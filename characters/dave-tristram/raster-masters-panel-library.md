# Raster Masters & the Panel Library — David Tristram (Don's firsthand + public sources)

*Don has known Dave since the **mid–late 1980s** — they met at the **USENIX Fifth Computer Graphics
Workshop** in **Monterey** (Nov 1989): Dave's **Panel Library** paper, Don's **PSIBER Space Deck**
(visual PostScript programming and debugger for **NeWS**). Don later saw **Raster Masters** at
**Shoreline** and **Grateful Dead** shows in the **1990s SGI era**. Public HN comments indexed
below, not private mail.*
[Portrayal standards](../../schemas/portrayal-standards.yml)

## Don ↔ Dave (firsthand)

Don and Dave met in the **mid–late 1980s** at the **USENIX Fifth Computer Graphics Workshop**,
**Monterey, CA, 16–17 Nov 1989** — both presenting in the same proceedings:

| Presenter | Paper |
|-----------|--------|
| **David A. Tristram** (NASA Ames) | *Controlling Virtual Worlds with the Panel Library* — 3D **GL** performance UI toolkit |
| **Don Hopkins** (UniPress / NeWS) | **PSIBER Space Deck** — visual **PostScript** programming and interactive debugger for **NeWS** (*The Shape of PSIBER Space: PostScript Interactive Bug Eradication Routines*) |

Same conference, same obsession: **live, visual, programmable graphics** — Dave building **3D GL
widgets** and bouncing slider banks; Don building a **navigable debugger** over NeWS's PostScript
heap, stacks, and processes. See Don's
[`visual-programming-excel-and-dimensionality.md`](../don-hopkins/visual-programming-excel-and-dimensionality.md)
and [The Shape of PSIBER Space (Medium, Oct 1989)](https://medium.com/@donhopkins/the-shape-of-psiber-space-october-1989-6bcdf7a3a1f5).

**Dave sent Don the source.** After Monterey, Dave shipped Don the **Panel Library** and **Electropaint**
source for **SGI**. Don hacked it on an **SGI at UMD** (HCIL era):

| Electropaint default | Don's hack |
|--------------------|------------|
| **Linear animation histories** — transforms along arrays | **Recursive s-expression structures** — transforms **between tree nodes** |
| Timelines of slider moves | **Tree-shaped** data you navigate like structure |

Goal: a **3D Pseudo Scientific Visualizer** — the same idea as the **2D PostScript object browser**
inside **PSIBER** (*"a fish-eye lens for the macroscopic examination of data… arbitrarily large,
arbitrarily deep structures in a fixed amount of space"*), but in Dave's **GL** world on Silicon
Graphics instead of NeWS PostScript on Sun.

Lineage continues in Don's **[JSONsters](../don-hopkins/jsonsters/README.md)** (Unity structural graphs;
inspired by the PseudoScientific Visualizer). Demo:
[PseudoScientific.mov](http://www.donhopkins.com/home/movies/PseudoScientific.mov).

**Later (1990s):** Dave at **Silicon Graphics**; **Raster Masters** performing. Don saw **live
generative graphics on million-dollar SGI workstations** at **Shoreline Amphitheatre** (across North
Shoreline Blvd from SGI HQ) and at **Grateful Dead** shows — custom code, multiple operators,
MIDI-driven improvisation **on the screen behind the band**.

Don jokes he often accidentally calls them **"Grateful Dead Conferences"** — so many **Silicon Valley /
Free Software / conference-circuit** people he knew (Fen, Gilmore, Barlow, etc.) showed up at Dead
shows when **"the hippies were in charge, before the frat bros took over."** At one show a concert-goer
on shrooms pointed at the screen in awe; Don (sober) could see the same thing. *(Don's public HN
comment, Oct 2022 — [`item?id=33105030`](https://news.ycombinator.com/item?id=33105030).)*

## Dead scene ↔ open source (cultural parallel)

The Dead **encouraged taping and trading**; Raster Masters mirrored that ethos in **software**:
**Panel Library + Electropaint source** and **recorded live performance scripts** shared freely —
often before SGI bundled a later version in its demo library. Don draws a straight line from that
**give-it-away, perform-it-live** culture to **open source** (same HN tapers thread, Oct 2022).

**Infrared Roses** — a Grateful Dead live compilation of **"Drums"** and **"Space"** improvisations —
features **Electropaint / Raster Masters** visuals (~11:00 in the video; multiple parallel feeds mixed
live). [Wikipedia — *Infrared Roses*](https://en.wikipedia.org/wiki/Infrared_Roses) ·
[YouTube](https://www.youtube.com/watch?v=gkhr23asO-M)

## Panel Library — 3D GL UI toolkit (NASA Ames)

Dave (with **Eric Raible**) built the **Panel Library** at **NASA Ames** (**Numerical Aerodynamic
Simulation** / NAS) — a **GL-based 3D user-interface toolkit** on early **SGI Iris** workstations
next door to Ames.

What made it radical in the late 1980s:

- **Widgets drawn in 3D with GL** — real beveled edges; some controls **attached to animated 3D
  objects in the scene** ("everybody thought they was crazy").
- **Panel Editor** — Eric Raible's **Scheme-based GUI editor**.
- **~150-page reference manual**; distributed via Ames / **COSMIC**; early releases on
  quarter-inch tape.
- Used in-house on **FAST** and tools like **EAGLEView** (Panel Library as GUI front-end to grid
  generation).

**USENIX Fifth Computer Graphics Workshop**, Monterey, CA, **16–17 Nov 1989**:

| Field | Value |
|-------|--------|
| **Title** | *Controlling Virtual Worlds with the Panel Library* |
| **Author** | David A. Tristram (NASA Ames Research Center) |
| **Pages** | 83–92 ([proceedings archive](https://archive.org/details/1989-proceedings-5th-comp-graphi)) |

NASA tech report index: [NTRS 19920000697](https://ntrs.nasa.gov/citations/19920000697) — *Panel
Library And Editor* (v9.8) + Editor (v1.1), C and Scheme.

That toolkit became **Electropaint's live performance console** — banks of **automatic bouncing
multi-sliders** (value, min, max, speed, wrap) scrubbed while the image generator runs.

## Electropaint — instrument, not screensaver

**Electropaint** began as a Panel Library demo — triangles/squares, simple rules, complex motion.
Dave brought it to **SGI**; it became demo/screensaver source (later **IGL** distribution).

- **Live:** operators perform **slider banks** via Panel Library — the UI *is* the instrument.
- **Shipped Indy screensaver:** sliders hidden; **plays back recorded performances** (Dead-scene
  taping instinct for graphics presets).
- **Extended performance stack:** **Electropaint 2 (EP)**, **Electroslate**, **Squish** (Ron Fischer,
  Comet Way / darkside archive).
- **Recursive texture-map feedback** — high-end SGI only; Don recalls Raster Masters describing this
  in performance (HN Psychedelic Graphics thread, 2025).

Dave's own words on EP (darkside archive): *"Electro-Paint responds, but in ways that are hard to
describe… It will reward attention… Try a little 'wrst', with some 'zoom'…"*

**Source lineage:** Dave posted Panel Library + EP to newsgroups while at NASA; **Matevz Bradac**
resurrected sources as **IGL** / **GLectric** (IrisGL→OpenGL wrappers). Don mirrors **IGL 0.1.8**
(including EP + mslider source):
[donhopkins.com/home/code/igl_0.1.8/](https://donhopkins.com/home/code/igl_0.1.8/)

## Raster Masters — visual-music ensemble (1990s)

**"Free-form mind blowing"** — Creon Levit (*Wired* 2.06). Goal: **live computer-graphics ensemble
performance** — *"'60s light shows grafted onto '80s music video, real time"*; **"virtual
hallucinations"*; **"instrument builders, playing away on the visual equivalent of the first
synthesizers."**

### The band

| Role | Person |
|------|--------|
| **Programmers / instrument builders** | **David Tristram** (NASA Ames → SGI), **Creon Levit** (NASA Ames), **Ron Fischer** (SGI) |
| **Mixer / video switcher** | **Maggie Hoppe** (graphic designer) |
| **Sound design** | **Johnathan Nelson** |

Fischer: performance graphics as **"puppets, directly reacting to many operator actions at once."**

### The rig

- **2× Onyx RealityEngine²** + **2× Indigo² Extreme** — **12-foot truck**, **~5 hours** setup.
- Code **SGI couldn't run on a Mac** — corporate sponsorship as arts patronage (*Wired*).
- **Shoreline:** lug rigs from SGI HQ across North Shoreline Blvd; also **Dead tour buses**.
- **MIDI-reactive**, multi-operator, **mixing several SGI video feeds + feedback in real time**.

### Where they played (public)

- **Grateful Dead** (tour + Shoreline) — audience member **louky** saw them ~**1992** (HN 2025).
- **Herbie Hancock**, **Graham Nash** (*Wired* 1995 — Hancock drove visuals via MIDI).
- **Amsterdam** TILE Convention (Jun 1994), **Montreux** Music Festival, **Digital World** LA,
  **SIGGRAPH** Orlando (Jul 1994), **Germany** tour — per *Wired* 2.06.

### After SGI

SGI withdrew sponsorship ("Onyx RE/2 cost more than a Stratocaster"). Dave continued as
**"Viviographer"** — *"art in motion… spontaneity of jazz performance in a visual medium"* (web
archive, tristram.com). **NASA Ames → SGI → Adobe**; Electropaint™ / **Tristram Visual**.

### Dave today (public HN, Jan 2025)

**dtristram** on [Psychedelic Graphics](https://news.ycombinator.com/item?id=42804566): still
performing — **Resolume Avenue**, **TouchDesigner**; investigating **UV displacement via flow-field
advection** + **feedback** ("motion that looks quite a bit like fluid flow").

## Before commoditized VJ culture

Don's HN punchline: all this predates club **VJ** culture where someone opens **VLC**, hits space,
and tends to everything *except* the visuals. Raster Masters were **musicians on code** — the
improvisational software **performed in real time along with the music**.

## Same orbit: Scott Draves, CAM6, Crutchfield

Same live-generative family as Don's **CAM6**, **HyperLook**, **Musical Gas** — and **[Scott
Draves](../scott-draves/)** ("Spot"): **Fractal Flame**, **Electric Sheep**, evolutionary feedback art;
**[Jim Crutchfield](../jim-crutchfield/)** video-feedback dynamics; **[Norman Margolus](../norman-margolus/)**
*Cellular Automata Machines* (Dave has cited publicly).

## Repo Show angles

- **Panel Library → web** — performance UI + generative layer (Don's PostScript/Cairo/WebGPU lineage).
- **UMD Electropaint hack redux** — tree-shaped **s-expr** navigation + generative motion in the browser;
  3D Pseudo Scientific Visualizer meets Dave's slider banks again.
- **Raster Masters redux** — repo as band; MIDI in; multi-operator mix; forkable.
- **Infrared Roses / Drums–Space** — show the archival footage, rebuild the stack in browser.
- **CA looping fest** — Dave + Don's **CAM6** + dream co-guests (Norman, Scott, Crutchfield).

## Sources (public)

### Don Hopkins (HN — public comments)

- [Recording the Grateful Dead / tapers — Raster Masters mega-comment (Oct 2022)](https://news.ycombinator.com/item?id=33105030)
- [Psychedelic Graphics — links + melt.ps / Dave thread (Jan 2025)](https://news.ycombinator.com/item?id=42804566)
- [Cross-post of Dead comment on Psychedelic Graphics thread](https://news.ycombinator.com/item?id=33105030) (via item 42804566 thread)

### David Tristram (HN)

- [dtristram intro — Raster Masters, Resolume/TouchDesigner (Jan 2025)](https://news.ycombinator.com/item?id=42804566)
- [UV advection / feedback technique comment (Jan 2025)](https://news.ycombinator.com/item?id=42804566)

### Papers & NASA

- Tristram, D.A. (1989). *Controlling Virtual Worlds with the Panel Library.* USENIX Fifth Computer
  Graphics Workshop, Monterey, CA, 16–17 Nov 1989, pp. 83–92.
- Hopkins, D. (1989). *The Shape of PSIBER Space: PostScript Interactive Bug Eradication Routines.*
  Same workshop — **PSIBER Space Deck** (visual PostScript programming and debugger for NeWS).
  [Medium](https://medium.com/@donhopkins/the-shape-of-psiber-space-october-1989-6bcdf7a3a1f5)
- [NASA NTRS — Panel Library And Editor](https://ntrs.nasa.gov/citations/19920000697)
- [NAS Ames RND-92 — Panel Library transition paper (Wallach & Woodrow)](https://www.nas.nasa.gov/assets/pdf/techreports/1992/rnd-92-001.pdf)

### Press & archives

- [Wired 2.06 (1994) — Raster Masters](https://www.wired.com/1994/06/raster-masters/)
- [Wired (1995) — Hear It With Your Eyes](https://www.wired.com/1995/08/hear-it-with-your-eyes/)
- [Infrared Roses — Wikipedia](https://en.wikipedia.org/wiki/Infrared_Roses)
- [Comet Way / Ron Fischer — Electropaint history (web archive)](https://web.archive.org/web/20110814074647/http://darkside.cometway.com/content.agent?name=001&page_name=Article)
- [USENIX 1989 proceedings — archive.org](https://archive.org/details/1989-proceedings-5th-comp-graphi)

### Code & video

- [Don Hopkins — IGL 0.1.8 + Electropaint + mslider source mirror](https://donhopkins.com/home/code/igl_0.1.8/)
- [github.com/sgi-demos/igl](https://github.com/sgi-demos/igl)
- [Electropaint on SGI Indy (YouTube)](https://www.youtube.com/watch?v=StA81MNuqB8)
- [Infrared Roses video (YouTube)](https://www.youtube.com/watch?v=gkhr23asO-M)
- [Electroportis decompilation thread (HN 2014)](https://news.ycombinator.com/item?id=7700340) — i_am_ralpht ported EP to OpenGL at SGI
