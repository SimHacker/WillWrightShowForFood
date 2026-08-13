# Ideas to explore with James P. Crutchfield 🦋

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in James's
public work and documented connections to this repository. Things Don would love to follow
**with** James P. Crutchfield; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## What James has done

James P. Crutchfield ("Chaos") is a physicist and mathematician of complex systems —
Distinguished Professor of Physics at UC Davis, director of its Complexity Sciences
Center, external faculty at the Santa Fe Institute, and president of the Art & Science
Laboratory (Santa Fe). As a UC Santa Cruz grad student he was part of the legendary
Dynamical Systems Collective ("the Chaos Cabal") with Doyne Farmer, Norman Packard, and
Rob Shaw — whose "Geometry from a Time Series" (1980) showed how to reconstruct a
system's hidden dynamics (attractors) from a single stream of measurements, and who famously
built wearable computers to beat roulette (the *Eudaemonic Pie* story). He did foundational
work on video feedback as a spatiotemporal dynamical system, on the "edge of chaos" and
evolving cellular automata to perform computation (with Melanie Mitchell), and founded
computational mechanics — the ε-machine, a way to discover the intrinsic structure and
information processing hidden inside a process. The Santa Cruz group is a centerpiece of James
Gleick's *Chaos: Making a New Science*.

## The hooks



### 1. Show seed: `repo-shows/jim-crutchfield/`

Walk the repo on air and build from the seed.

### 2. The director's cut, live — *we're the MST3K robots* 🤖

The 2013 thread, finished on air: Jim axed the original soundtrack of *Space-Time Dynamics in
Video Feedback* over music rights, but the U-Matic master kept narration and music on separate
tracks — and the explanatory narration deserves to go back on. Plan: **record the voice-over
live on the show** over the clean YouTube transfer, MST3K-silhouette style. The narration source
survives on the tape **Kathy Abelson** gave Don (his office mate at Sun; she wrote the NeWS
manual Don meticulously reviewed and helped illustrate). Bonus reveal for the credits roll: Jim
composed ***Rio Chama*** himself. Full story: [`don-and-jim-history.md`](don-and-jim-history.md).

### 3. The CA playground plan — Norman's book, Jim's layer, students' homefun 🌸

The December 2013 offer — Jim co-developing an **introduction to CAs and structural complexity**
on Don's simulator — is now buildable: **Norman Margolus has given Don permission to turn
chapters of *Cellular Automata Machines* into interactive instructional and artistic web apps**
([Norman's room](../norman-margolus/README.md)). The plan, in show order:

1. **First cut:** rewrite Don's monolithic CAM6 simulator as **modern, modular TypeScript**.
2. **Brainstorm the designs on air, write them down, check them in** — the repo is whiteboard
  and archive at once.
3. **Jim's layer on Norman's rules:** excess entropy ([Feldman & Crutchfield 2003](http://csc.ucdavis.edu/~cmg/compmech/pubs/2dnnn.htm)),
  computational mechanics of CA ([Hanson & Crutchfield 1997](http://csc.ucdavis.edu/~cmg/compmech/pubs/ECA54TitlePage.htm)),
   his pedagogy wish of **1D CAs with 1+1D space-time diagrams**.
4. **A thousand flowers bloom** — collaborators fork the seeds; Jim's
  [grad class](http://csc.ucdavis.edu/~chaos/courses/ncaso/) gets  
   **[homefun, not homework](../../process/homefun-grading.md)**, checked in with public receipts.

### 4. Don ↔ Jim, 2008–2025 — the correspondence + the boat 🚤

Seventeen years of threads, written up in [`don-and-jim-history.md`](don-and-jim-history.md):
**2008** — Jim asks Don how to reach **Will Wright** to show him the CAVE (the show is the delayed
rendezvous); **2013** — the "Powers of Feedback" tape thread and the director's-cut project, Don
posting Jim's film to Will's Facebook; **Dec 2013** — the CA-intro offer; **May 2019** — Amsterdam:
**Ben Cerveny's canal boat** picnic (photos in [`media/`](media/)), Sims-object-programming demos
at UvA IAS, the **CAM-8-hardware-missing-software** revelation and the 1983 LANL wire-wrap story;
**2025** — the browser-dynamics reply (Ed Puckett's ODE plotter, the *"wholly unrealized"* plan to
port the Jupyter class demos — a ready-made show project). Plus the **dripping handrail** paper
Don loves (Crutchfield & Kaneko 1988) — browser-sim show beat.

**Jan 2025 mail:** Don → Jim citing Psychedelic Graphics HN
[42804566](https://news.ycombinator.com/item?id=42804566); WebGPU feedback-simulator prompt.
→ [`sources/2025-01-25-psychedelic-graphics-hn.md`](sources/2025-01-25-psychedelic-graphics-hn.md) ·
[`../don-hopkins/sources/2025-01-psychedelic-graphics-hn-compendium.md`](../don-hopkins/sources/2025-01-psychedelic-graphics-hn-compendium.md)

### 5. The smoking gun — Abraham → Crutchfield video feedback lineage

**Ralph Abraham** published "Simulation of cascades by video feedback" (Springer LNM 525, **1976**,
UCSC) — the camera-pointed-at-monitor demo as dynamics instrument. Jim's *Physica* 10D (**1984**)
paper turned it into the formal spatiotemporal treatment — cellular automata, morphogenesis,
spatial complexity. Same campus, one generation apart. Don's own work traces to a **VHS copy of
Jim's 1984 film** — [now on YouTube](https://www.youtube.com/watch?v=B4Kn3djJMCE). Full writeup +
show beats: [`abraham-video-feedback-lineage.md`](abraham-video-feedback-lineage.md). **Spot
(Scott Draves) should read it** — dream three-way segment.

### 6. Remembering Ralph Abraham (1936–2024) 🌀

Ralph died **19 September 2024** at home in Santa Cruz, at 88. A **memorial segment** on Jim's
show: Jim shared the UCSC campus where the video-feedback thread passed between generations, and
he's the right person to tell the real stories — phase space made *visible* (*Dynamics: The
Geometry of Behavior*, the Visual Mathematics Library), the 1976 cascades paper, the Santa Cruz
counterculture, the tabla and the Trialogues. The phase-space-as-possibility-space thread runs
straight to **Will Wright's** design vocabulary — Will put Abraham on his own look-up list.
Memorial room: [`../ralph-abraham/memorial.md`](../ralph-abraham/memorial.md).

### 7. Raster Masters / Dave Tristram crossover

Same HN cluster — Raster Masters, Shoreline SGI rigs, Dead "conferences," Electropaint. Panel Library. Co-guest with [`../dave-tristram/`](../dave-tristram/).

### 8. Art & Science Laboratory — CA as an art medium

Jim is president of the **[Art & Science Laboratory](https://artscilab.com/)** (Santa Fe) — complexity
science and art made in the same room. That's exactly the seam Don works: cellular automata not only
as computation but as **performance and storytelling**. Segment: what does honest art-from-science
look like when the science is chaos, feedback, and CA?

### 9. Don's CA artwork storytelling — the CAM6 demo finale

At the end of Don's [long-form CAM6 demo made for Norman Margolus](https://www.youtube.com/watch?v=LyLMHxRNuck)
he turns the CAM6 platform from lab instrument into **narrative art** — painting with overlapping
cellular automata layers, cells rendered as animated SimCity tiles, telling a story with the rules.
It's the natural bring-your-own-artwork contribution to an Art & Science conversation with Jim.
→ [`../norman-margolus/the-cam6-demo-for-norman.md`](../norman-margolus/the-cam6-demo-for-norman.md)

### 10. The cellular automatists' rules-and-art jam

Jim anchors the complexity end of the repo's CA gang: **video feedback** and **evolving CA that
compute** alongside [Norman Margolus](../norman-margolus/README.md) (CAM-6 / reversible CA),
[Scott Draves](../scott-draves/README.md) (Electric Sheep / generative art), Don's CAM6, and — from
his SFI board seat — [Reese Jones](../reese-jones/README.md) (agent-based modeling / ALife). The
Santa Fe Institute is the shared home for all of it. See the
[Margolus CA looping fest](../../repo-shows/norman-margolus/README.md).

## Sources (public)

- Show seed: [`repo-shows/jim-crutchfield/`](../../repo-shows/jim-crutchfield/)
- [`CHARACTER.yml`](CHARACTER.yml) · [`don-and-jim-history.md`](don-and-jim-history.md)

