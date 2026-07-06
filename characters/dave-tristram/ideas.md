# Ideas to explore with David Tristram 🎸

*Conversation hooks for a Repo Show — **Don's proposed topics**, grounded in Dave's publicly
documented work and Don's firsthand friendship. Things Don would love to riff on **with** Dave;
not quotes from Dave and **not** claims about what he thinks.*
[Portrayal standards](../../schemas/portrayal-standards.yml) · consent not yet asked

## The hooks

### 1. USENIX Monterey (1989) — Panel Library meets PSIBER Space Deck
Don and Dave met **mid–late 1980s** at **USENIX Fifth Computer Graphics Workshop**, **Monterey, 16–17
Nov 1989** — Dave: *Controlling Virtual Worlds with the Panel Library* (3D GL widgets, **Eric Raible**'s
Scheme **Panel Editor**); Don: **PSIBER Space Deck** — visual **PostScript** programming and debugger
for **NeWS**. Same room, parallel obsession: **performance UI you play live**. Panel Library became
Electropaint's bouncing-slider console. See [`raster-masters-panel-library.md`](raster-masters-panel-library.md)
and Don's [PSIBER write-up](../don-hopkins/visual-programming-excel-and-dimensionality.md).

### 1½. Dave's source → Don's UMD hack (tree-shaped Electropaint)
Dave sent Don **Panel Library + Electropaint** source for **SGI**. Don rewired it on an **SGI at UMD**:
**recursive s-expression structures** instead of Electropaint's **linear animation histories** —
**transforms between tree nodes**, not just along linear arrays. A **3D Pseudo Scientific Visualizer**
in GL, sibling to the **2D PostScript** object browser in **PSIBER** (Monterey). Lineage →
[JSONsters](../don-hopkins/jsonsters/README.md).

### 2. Raster Masters — Shoreline, the Dead, Onyx rigs
SGI-era **visual-music ensemble** — Dave, **Creon Levit**, **Ron Fischer** (code); **Maggie Hoppe**
(video switcher); **Johnathan Nelson** (sound). **12-foot truck**, **5-hour setup**, **multiple
operators** mixing SGI video feeds + **recursive texture-map feedback**; **Shoreline** across from SGI
HQ; **Grateful Dead** tour (footage on ***Infrared Roses***); **Herbie Hancock**, **Graham Nash**.
Don's **"Grateful Dead Conferences"** joke — same tech crowd at Dead shows and at SIGGRAPH (public HN).

### 2½. Share the tape — open Panel Library + Electropaint source
Dead scene **taping culture** ↔ **sharing EP source** before SGI bundled it. **IGL** resurrection;
Don's mirror at [donhopkins.com/home/code/igl_0.1.8/](https://donhopkins.com/home/code/igl_0.1.8/).
Repo Show as **forkable performance**, not locked screensaver.

### 2¾. Viviography today — Resolume, TouchDesigner, UV advection
Dave on HN (2025): **flow-field UV displacement**, **feedback**, **restore force** — "motion that
looks quite a bit like fluid flow." Same family as Don's **melt.ps** / pixel warping anecdotes on the
same thread.

### 3. CA + reaction-diffusion + feedback in performance code
Dave has publicly cited **CelLab** (Rucker & Walker), Gleick's *Chaos*, and Toffoli & **Norman
Margolus**'s *Cellular Automata Machines* as influences. Don built **CAM6** straight from that
book. A natural duet: **Don's CAM6 grid** + **Dave's performance shaders** — rules you can *play*
live, not just watch.

### 4. MIDI-reactive generative graphics (then and now)
**Herbie Hancock** used Raster Masters software to **see** his jazz improvisation (*Wired*, 1995 —
"Hear It With Your Eyes"). Update the stack: Web MIDI → generative layer → stream. Same question:
what would jazz improvisation *look* like if you could see it — but this time the audience owns the
repo.

### 5. CA looping fest co-guest
Invite Dave into **[Norman Margolus](../../repo-shows/norman-margolus/)**'s cellular-automata
looping fest alongside **Stephen Wolfram**, **Dave Ackley**, **Jim Crutchfield**, **Scott Draves**,
**Will Wright**, and **Brian Eno** — Dave as the **live graphics performance** voice in a room full
of rule-makers. Async clips welcome; Dave + Don + a grid is already a show.

### 6. Adobe live painting R&D (PRIVATE — withheld until Dave clears)
Don beta-tested **pre-release interactive filter / liquid-simulation** work Dave was doing at Adobe
(~2022 Feature Camp focus group). Don called it *essential playfulness* in the same breath as Glenn
Reid's NeXT **Font Appreciation Tool**. **Do not cite product name or demo on air** until cleared.
Public stub only: [`sources/live-canvas-effects-stub.md`](sources/live-canvas-effects-stub.md).

## Sources (public)

- [`raster-masters-panel-library.md`](raster-masters-panel-library.md)
- [`CHARACTER.yml`](CHARACTER.yml)
- [Wired — Raster Masters (1994)](https://www.wired.com/1994/06/raster-masters/)
- [Wired — Hear It With Your Eyes / Herbie Hancock (1995)](https://www.wired.com/1995/08/hear-it-with-your-eyes/)
- [HN — Dead/tapers — Don's Raster Masters comment (2022)](https://news.ycombinator.com/item?id=33105030)
- [HN — Psychedelic Graphics — David + Don (2025)](https://news.ycombinator.com/item?id=42804566)
- [Infrared Roses — YouTube](https://www.youtube.com/watch?v=gkhr23asO-M)
- Show seed: [`repo-shows/dave-tristram/`](../../repo-shows/dave-tristram/)
