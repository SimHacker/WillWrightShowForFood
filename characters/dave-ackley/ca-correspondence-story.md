# A crashed system is infinitely wrong

### Don Hopkins × Dave Ackley — a cellular-automata correspondence

Don Hopkins and Dave Ackley have been trading email and Hacker News comments about
cellular automata since 2017. This is that conversation — and the wider circle it
pulled in — retold as a readable story instead of a raw pile of forwarded quotes.
It's organized so someone who wasn't there can follow the ideas, run the demos, and
find the links. The direct quotes below come only from public talks, papers, HN
posts, and videos; the private back-and-forth is paraphrased. Dave can correct,
trim, or remove any of it.

---

## Start here — the map

**Dave Ackley's work**


| Link                                                                        | What                                                                    |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [cs.unm.edu/~ackley](https://www.cs.unm.edu/~ackley/)                       | Home base — robust-first computing, papers, talks                       |
| [Movable Feast Machine](https://movablefeastmachine.org/)                   | The spatial-computing substrate: code as living, self-repairing pattern |
| [MFM on GitHub](https://github.com/DaveAckley/MFM)                          | The simulator source                                                    |
| [T2 Tile Project](https://t2tile.com/)                                      | Indefinitely scalable *hardware* — tiles you bolt together              |
| [The T2 Tile Project (YouTube)](https://www.youtube.com/c/TheT2TileProject) | "Big fun" — demos, build logs, robust-first talks                       |
| *[Beyond Efficiency* (CACM, 2013)](https://cacm.acm.org/)                   | The seed essay: correctness and speed are luxuries; survival is not     |


**Don's cellular automata (the pictures at the top of this page)**


| Link                                                                                | What                                                                  |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [CAM6 simulator — live](https://donhopkins.com/home/CAM6/)                          | Toffoli & Margolus' Cellular Automata Machine, rebuilt in the browser |
| [CAM6.js source](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)  | The whole engine, one readable file                                   |
| *[Cellular Automata Machines* book (PDF)](https://donhopkins.com/home/cam-book.pdf) | Toffoli & Margolus, the source of the rules                           |
| [CA + Video Feedback demo reel](https://www.youtube.com/watch?v=eCVJ08gK2o8)        | What the engine does when you let it run                              |


Jump to the [full categorized link vault](#the-link-vault) at the bottom.

---

## The two pictures

Don sent these to Dave and the rest of the CA circle as running examples — proof
that [Tommaso Toffoli](https://en.wikipedia.org/wiki/Tommaso_Toffoli) &
[Norman Margolus](https://en.wikipedia.org/wiki/Norman_Margolus)' 1980s
[cellular-automata](https://en.wikipedia.org/wiki/Cellular_automaton) hardware
rules could live in a browser tab and be poked with a mouse. **You can run it
yourself right now:** this is Don's **[CAM6 simulator, live](https://donhopkins.com/home/CAM6/)**
([source](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js) ·
[the Toffoli & Margolus book that defines the rules, PDF](https://donhopkins.com/home/cam-book.pdf) ·
[video demo reel](https://www.youtube.com/watch?v=eCVJ08gK2o8) if you'd rather watch first).
*(More CAM6 in these repos: [Norman Margolus' room](../norman-margolus/README.md) — Don showed
this simulator to the man who co-designed the original — and the
[visual-programming patch-cord trail](../../process/trails/visual-programming-patch-cord.md).)*
Both frames run the **Margolus "Dendrite Heat"** rule — a
[Margolus-neighborhood](https://en.wikipedia.org/wiki/Block_cellular_automaton)
partitioning rule that grows a
[diffusion-limited-aggregation](https://en.wikipedia.org/wiki/Diffusion-limited_aggregation)
crystal inside a diffusing heat field.

CAM6 running the Margolus Dendrite Heat rule: a single blue-white dendrite crystal frozen at the center of concentric red heat rings — the "Eye of Sauron."

*The "Eye of Sauron": one dendrite seed, frozen mid-growth, ringed by heat. The
right half is the same engine driving a SimCity-style tile palette — cellular
automata and city simulation are the same machine wearing two costumes.*

The same rule with the frob tools turned up: the dendrite has grown into a full ring of blue crystal in a cyan band, red heat radiating outward, with the Rule/Frob control panel open.

*The same rule, "frobbed" live — Don's word for direct-manipulation editing of a
running simulation. Turn up the cell-change and the seed blooms into an annular
dendrite. Nothing is paused; you're painting into physics while it runs.*

---

## How it started

In 2017 Don cold-emailed Dave after watching one of his
[artificial-life](https://en.wikipedia.org/wiki/Artificial_life) talks. The hook
was simple: Don had spent decades with the same rules Dave was building hardware
for. He'd met the **CAM6** — [Toffoli](https://en.wikipedia.org/wiki/Tommaso_Toffoli)
and [Margolus](https://en.wikipedia.org/wiki/Norman_Margolus)' Cellular Automata Machine, a card that plugged into a PC and ran two-state, neighborhood-based physics at video speed — in the 1980s, and had been gleefully re-implementing and playing with it ever since, from [Forth](https://en.wikipedia.org/wiki/Forth_(programming_language)) to C to
C++ to JavaScript, so it could [run in a browser](https://donhopkins.com/home/CAM6/)
([source](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js)) with
no special hardware at all.

That lineage matters, because it's the whole argument in miniature: the CAM6 put
locality first — every cell only ever talks to its neighbors — and got rich,
lifelike behavior out of dumb local rules. Don's company name, **Ground Up
Software**, is the same idea as a pun: build from the bottom up, out of many
small parts mooshed together, rather than down from some grand model/view/
controller cathedral. Dave's phrasing for his own version was **"bottom up"**
too, and his machines take it further than anyone.

## Robust-first: the reorder

Dave's core move — the one Don has been evangelizing on Hacker News for years and
eventually baked into his MOOLLM system as an always-on **ambient skill** — is a
reordering of what computing is *for*:

> **Survive → Heal → Function → Optimize.**

Traditional computing fails fast and loud: hit an error, throw, halt. Dave's
**robust-first computing** inverts the priorities. A system that limps along
incorrectly but keeps running can be repaired; a system that crashes cannot.
Hence the line that anchors the whole philosophy:

> *"A system that crashes is infinitely wrong, regardless of how correct it was
> up until the crash."* — Dave Ackley

Correctness and efficiency, in this view, are luxuries you earn *after* survival —
the argument he made in *[Beyond Efficiency](https://cacm.acm.org/)* (CACM, 2013).
For Don this wasn't just good engineering taste; it was a different value system,
and a sibling to Norman Margolus' physics-respecting, locality-first cellular
automata: **the hardware should be as local as the rule.**

## The Movable Feast Machine

Robust-first isn't a slogan; Dave built a machine that lives it. The **Movable
Feast Machine (MFM)** is a spatial computing substrate where a "program" is a
*pattern* — atoms diffusing across a grid, repairing themselves and their
neighbors, with no global clock and no central authority. Errors aren't
exceptional events to be caught; they're the weather, and the pattern is built to
survive them.

The demos are the best on-ramp, and Don spent years sending them to everyone he
loves:


| Demo                            | Link                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Distributed **city generation** | [youtube.com/watch?v=XkSXERxucPc](https://www.youtube.com/watch?v=XkSXERxucPc) |
| **Demon Horde Sort**            | [youtube.com/watch?v=helScS3coAE](https://www.youtube.com/watch?v=helScS3coAE) |
| **λ-Codons**                    | [youtube.com/watch?v=DauJ51CTIq8](https://www.youtube.com/watch?v=DauJ51CTIq8) |
| Intercellular transport         | [youtube.com/watch?v=6YucCpYCWpY](https://www.youtube.com/watch?v=6YucCpYCWpY) |
| Membrane robustness             | [youtube.com/watch?v=oq0uvF4mm7Y](https://www.youtube.com/watch?v=oq0uvF4mm7Y) |
| **The whole demo playlist**     | [Movable Feast Machine demos (19 videos)](https://www.youtube.com/playlist?list=PLm5k2NUmpIP8qwttAS5Batnd7u2UpBtaL) |


The [city-generation demo](https://www.youtube.com/watch?v=XkSXERxucPc) became
Don's go-to benchmark and party trick — a running CA that grows a road network and
zones, robust-first, repairing itself as it sprawls. And it's more than eye candy:
the video quietly links a paper explaining exactly how it works, and it's a great
read. **[Trent R. Small's *Local Routing in a new Indefinitely Scalable
Architecture*](city-generation-routing.md)** shows how the self-grown city routes
cars to building *types* with no global map and no absolute addressing — [full
summary + PDF in this repo](city-generation-routing.md), [paper on the author's
host](https://www.cs.unm.edu/~ackley/papers/paper_tsmall1_11_24.pdf), [source
code](https://github.com/sixstring982/MFMv2-city). (When cyberpunk author
**Rudy Rucker** got buried in Ackley links, the thing that finally landed was
*"is there a video with pretty pictures of CAs, and not a guy talking?"* — and the
answer was this city-gen video.)

## The T2 Tile Project: locality all the way to the silicon

The MFM asks: what if hardware were as local as the rule? The **T2 Tile Project**
is the answer in metal — physical tiles that only talk to their immediate
neighbors, asynchronously, with no global clock. Add tiles, add computer, forever.
That's what **indefinitely scalable** means: no architectural ceiling, because
nothing anywhere assumes it can see the whole machine.

The internals are gorgeous and slightly deranged in the best way. Dave describes
the tile-locking scheme as a brick wall rather than a checkerboard, with
overlapping "event windows" — a bounded number of tiles cooperating on any given
event, dozens of events in flight at once, all chasing a benchmark he calls the
Average Event Rate. Don's favorite metaphor for it is **tiling a ballroom floor
while the dancing is still going on** — you can never stop the world to fix it, so
you fix it locally, in place, forever. (Compare the Dutch traffic engineer Hans
Monderman's *shared space*: remove the central controller and let local
negotiation produce global order.)

## "Why not 3D?" — the answer Don keeps re-quoting

Every time cellular automata come up, someone asks *"why only 2D — why not 3D?"*
Dave's answer, from his **Living Computation** retirement talk, is Don's favorite
thing to paste into Hacker News threads:

> *"3D is the number one question. And my answer is, depending on what mood I'm in:
> we need to crawl before we fly. Or — I need to preserve one dimension to build
> the thing and fix it. Imagine if you had a three-dimensional computer, how do you
> fix something in the middle of it? … So I'm keeping the third dimension in my back
> pocket, to do other engineering. … a 2.1D model … indefinitely scalable in two
> dimensions."* — [Living Computation talk](https://youtu.be/YtzKgTxtVH8?t=3780)

Don's gloss, delivered by email: *"Ringo may have a hole in his pocket, but you've
got a whole dimension!"* The third dimension isn't missing — it's reserved, for
repair and for engineering the machine that runs the flat physics. It's a
robust-first answer to a performance question, which is exactly why Don loves it.

*(A standing show idea: pose "why not 3D?" to a whole panel — Ackley, Norman
Margolus, Scott Draves, Rudy Rucker, Henry Minsky — and collect the answers.)*

## The wider web: everyone Don dragged into this

Part of what makes this a story and not just a two-person thread is how many
people Don pulled in. Dave's work turned out to be a hub:

- **Andrew Walpole** rebuilt the MFM in clean native TypeScript —
[mfm.rocks](https://mfm.rocks/) / [MFM-JS](https://github.com/walpolea/MFM-JS) —
and Don fell for the readability. The two of them kicked around WASM and worker
threads, and Andrew sketched a **SPLAT-style** in-browser element editor: rules
authored *by example*, the way **AgentSheets** and **KidSim/Stagecast** let you
demonstrate a rewrite instead of coding it. Don's refrain in that thread:
***"speed is not the holy grail. Robustness is."***
- **Timothy Davidson**'s **[LifeBrush](https://www.youtube.com/watch?v=5LBHRyGxLGI)**
— VR/3D agent-based molecular biology you *paint* into existence, David
Goodsell-style — got sent around as **"Emacs for Cytoplasm."** Dave: *"Very
cool!"* Don: *"the bunny-rabbit world is flabbergasting."*
- **Norman Margolus** (co-author of the CAM6 book) got the MFM tour: λ-Codons,
Demon Horde Sort, city generation, T2 tiles.
- **Jim Crutchfield** (Complexity Sciences Center, ex-SFI) wanted Don's CA
simulator for a graduate course, and got shown the DLA + heat-layer tricks —
including the "Eye of Sauron" up top — over a proposed Amsterdam coffee.
- **Scott Draves** (Electric Sheep, Fractal Flame) — generative/evolutionary art
as living organisms; a natural sibling to MFM patterns.
- **Bill Joy** got the long-term pitch: the MIPS race was headed the wrong way —
perfect but fragile, globally synchronized even when it needn't be.
- **Lu Wilson (TodePond)** — of [Sandspiel](https://sandspiel.club/) /
[Sandspiel Studio](https://studio.sandspiel.club/) fame — later co-wrote
**["Dialogues on Natural Code"](https://todepond.com/code)** *with* Dave Ackley
for Onward! (SPLASH 2024): robust-first meets falling-sand.

The same conversation kept touching **Wave Function Collapse**
([Gumin](https://github.com/mxgmn/WaveFunctionCollapse),
[Merrell's model synthesis](https://paulmerrell.org/model-synthesis/)), Brian
Eno and Will Wright on [playing with time](https://www.youtube.com/watch?v=Dfc-DQorohc),
and Sam Earle's [gym-city](https://github.com/smearle/gym-city) (reinforcement
learning playing Micropolis and Conway's Life at variable scales).

## Where it landed

Two places, so far.

First, in public: Dave and Lu Wilson's "Natural Code" essay, the Future of Coding
"Beyond Efficiency" discussions, and a steadily growing crowd who now take
robust-first seriously as a *design stance*, not a curiosity.

Second, and closer to home: **robust-first is a literal ambient skill in Don's
MOOLLM system** — a rule that runs continuously and shapes how everything handles
failure, opening with Dave's line and encoding his priority order. It's
load-bearing in the operating system that runs this whole show. That's the pitch
for getting Dave on a Repo Show: not to explain his work from scratch, but to make
the survival-first argument in public, live, on a stage anyone can clone and run.

## MOOLLM is a Movable Feast Machine for text

Here's the part that makes Dave's work more than an inspiration to us — it's the
architecture.

MOOLLM is, in effect, a **robust, non-deterministic, LLM-driven Movable Feast
Machine** whose substrate is not a 2-D grid of atoms but a **hierarchical
filesystem of 1-D text samples**, addressed by **URL pointers** that drill from
directory → file → the internal structure *inside* a file. The LLM is the moving
"feast" — the read/write head that lands somewhere, reads its neighborhood, and
acts. Where the MFM diffuses atoms across space, MOOLLM diffuses *attention and
edits* across a repo, and the git log is its clock.

And like the MFM it is **robust-first by construction**: no global consistency is
required, work happens locally, malformed input is interpreted charitably rather
than fatally (`postel`), and a crashed run is simply resumed — the state lives in
files, redundantly, recoverable from git. The same ambient skill that opens with
Dave's line governs how the whole machine behaves under confusion.

The twist is what it does with the neighborhood. The MFM *moves* atoms. MOOLLM
mostly **refers** — it points, with metadata, instead of relocating. It *can* move
things (rename and reorganize directories, package and unbundle archives, drive
git, run scripts, compose Anthropic/MOO skills), but the default gesture is to add
a **pointer plus context**. [Palmhoo](../../palmhoo/) is the clearest specimen: a
directory that contextualizes internal and external objects at many granularities,
each tagged as many times as it's useful, continuously refactored and rearranged as
it grows — a live, hand-tended index that grows on demand rather than a fixed tree.
Robust-first computing, applied to a knowledge base instead of a chip.

That's why the Ackley thread isn't a side quest. It's the theory of the machine
these files run on.

---

## The link vault

Everything above, categorized for grabbing.

### Dave Ackley & robust-first


| Link                                                                                                       | What                                           |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [cs.unm.edu/~ackley](https://www.cs.unm.edu/~ackley/)                                                      | Home page                                      |
| [Living Computation (retirement talk)](https://www.youtube.com/watch?v=YtzKgTxtVH8)                        | The "why not 3D?" answer lives here (~1:03:00) |
| [T2 Tile Project (site)](https://t2tile.com/) · [T2 (YouTube)](https://www.youtube.com/c/TheT2TileProject) | Indefinitely scalable hardware                 |
| [robust.cs.unm.edu](http://robust.cs.unm.edu/doku.php)                                                     | The robust-computing wiki                      |
| [Cat vs. Emacs](https://www.youtube.com/watch?v=CURDEuQRktA)                                               | Because of course                              |


### Movable Feast Machine


| Link                                                                                                                                                                                                  | What                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [movablefeastmachine.org](https://movablefeastmachine.org/) · [MFM (GitHub)](https://github.com/DaveAckley/MFM)                                                                                       | Substrate + source            |
| [City generation](https://www.youtube.com/watch?v=XkSXERxucPc) · [Demon Horde Sort](https://www.youtube.com/watch?v=helScS3coAE)                                                                      | The demos that convert people |
| [Full MFM demo playlist (19 videos)](https://www.youtube.com/playlist?list=PLm5k2NUmpIP8qwttAS5Batnd7u2UpBtaL)                                                                                        | Every demo in one place       |
| [City-routing paper — summary + PDF](city-generation-routing.md) · [author's host](https://www.cs.unm.edu/~ackley/papers/paper_tsmall1_11_24.pdf) · [code](https://github.com/sixstring982/MFMv2-city) | *How* the city routes itself (Trent R. Small) |
| [λ-Codons](https://www.youtube.com/watch?v=DauJ51CTIq8) · [Intercellular transport](https://www.youtube.com/watch?v=6YucCpYCWpY) · [Membrane robustness](https://www.youtube.com/watch?v=oq0uvF4mm7Y) | More patterns                 |
| [ECAL 2015 / ULAM](https://www.youtube.com/watch?v=aR7o8GPgSLk)                                                                                                                                       | The MFM programming language  |
| [mfm.rocks](https://mfm.rocks/) · [MFM-JS (Walpole)](https://github.com/walpolea/MFM-JS)                                                                                                              | Native-JS reimplementation    |


### Don's CAM6 (the images on this page)


| Link                                                                                                                         | What                |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| [CAM6 live](https://donhopkins.com/home/CAM6/) · [CAM6.js](https://github.com/SimHacker/CAM6/blob/master/javascript/CAM6.js) | Run it / read it    |
| [CAM book (PDF)](https://donhopkins.com/home/cam-book.pdf)                                                                   | Toffoli & Margolus  |
| [Demo reel](https://www.youtube.com/watch?v=eCVJ08gK2o8) · [Margolus demo](https://www.youtube.com/watch?v=LyLMHxRNuck)      | Video feedback + CA |
| [CAM6 wiki](https://donhopkins.com/mediawiki/index.php/CAM6_Simulator)                                                       | Notes               |


### "Emacs for Cytoplasm" — Timothy Davidson / LifeBrush


| Link                                                                                                                               | What                           |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| [Emacs for Cytoplasm](https://www.youtube.com/watch?v=5LBHRyGxLGI) · [LifeBrush demo](https://www.youtube.com/watch?v=6CsxADBpal0) | VR molecular biology you paint |
| [Thesis overview](https://www.youtube.com/watch?v=ocT7W3o8CfE) · [Painting ABM](https://www.youtube.com/watch?v=HYLvN2qijeA)       | The method                     |
| [All videos](https://www.youtube.com/user/11011001/videos)                                                                         | The channel                    |


### Visual programming by example


| Link                                                                                                                            | What                                           |
| ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [AgentSheets](https://en.wikipedia.org/wiki/AgentSheets) · [Stagecast Creator](https://en.wikipedia.org/wiki/Stagecast_Creator) | Rewrite-by-example lineage (SPLAT's ancestors) |


### Falling sand & natural code


| Link                                                                                      | What                                         |
| ----------------------------------------------------------------------------------------- | -------------------------------------------- |
| [Sandspiel](https://sandspiel.club/) · [Sandspiel Studio](https://studio.sandspiel.club/) | Max Bittker                                  |
| [Dialogues on Natural Code](https://todepond.com/code)                                    | Lu Wilson **with Dave Ackley**, Onward! 2024 |


### Complexity / SFI neighbors


| Link                                                                                                                                  | What                                |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Space-Time Dynamics in Video Feedback](https://www.youtube.com/watch?v=B4Kn3djJMCE)                                                  | Crutchfield                         |
| [Wave Function Collapse](https://github.com/mxgmn/WaveFunctionCollapse) · [Model synthesis](https://paulmerrell.org/model-synthesis/) | Constraint-based generation         |
| [Eno × Wright: playing with time](https://www.youtube.com/watch?v=Dfc-DQorohc)                                                        | The Long Now angle                  |
| [gym-city](https://github.com/smearle/gym-city)                                                                                       | RL on Micropolis + Life (Sam Earle) |


---

## Rooms


|                     |                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| **Invitation**      | [invitation.md](invitation.md)                                                                    |
| **Portrait**        | [README.md](README.md)                                                                            |
| **Hooks**           | [ideas.md](ideas.md)                                                                              |
| **Self-routing city** | [city-generation-routing.md](city-generation-routing.md) — Trent Small's MFM routing paper, summarized (PDF mirrored) |
| **Media**           | [media/](media/) — the CAM6 snapshots, the routing PDF + provenance                               |
| **CA looping fest** | [Norman Margolus](../norman-margolus/README.md) · [Stephen Wolfram](../stephen-wolfram/README.md) |


*Subject may request correction or removal at any time.
[Portrayal standards](../../schemas/portrayal-standards.md).*