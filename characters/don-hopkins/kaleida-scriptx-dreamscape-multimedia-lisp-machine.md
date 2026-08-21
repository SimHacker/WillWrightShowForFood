# Kaleida Labs — ScriptX, DreamScape, multimedia Lisp machine

**Kaleida Labs (1993–1996):** **ScriptX** — an **object-oriented multimedia Lisp machine**. Live
objects, time-based media, stacks you author while the system runs. Don built **DreamScape** —
a mirror-world / mind-map media environment — and demoed it at **WWDC 1995** without crashing
(official Kaleida rule: crash = push-ups).

> ScriptX was an object-oriented multimedia Lisp machine. So fucking fun.

(Don's words. The joy is load-bearing — this is why MOOLLM still wants live, editable objects.)

**Video:** [DreamScape @ WWDC 1995](https://www.youtube.com/watch?v=5NytloOy7WM) · [Medium transcript](https://donhopkins.medium.com/1995-apple-world-wide-developers-conference-kaleida-labs-scriptx-dreamscape-demo-17-min-read)

## What ScriptX was

| Piece | Idea |
|-------|------|
| **ScriptX language** | OO Lisp for multimedia — objects, messages, inheritance, time |
| **Runtime** | Lisp machine semantics applied to QuickTime-era media graphs |
| **Authoring** | Edit live — stacks/cards energy from HyperCard, power from Lisp |
| **DreamScape** | Navigable memory-palace / mirror-world — precursor to iLoci, MediaGraph, MOOLLM rooms, Urban Safari |

## The clock hierarchy — a window hierarchy for time ⏰

One of Don's favorite ScriptX features. Kaleida got **Apple's crown jewels — the QuickTime
API** — and ScriptX wrapped its **clock hierarchy**: a tree of timebases, like a window
hierarchy for time, and in fact **interpolated into the window hierarchy** — each window had
its own **time offset and scale relative to its parent**. Forward, pause, backwards, any
speed, plus any offset, composed down the tree the way transforms compose down a scene graph.
QuickTime fully supported it, audio included: **negative rate meant the media actually *played*
backwards** — backwards masking was a real, first-class operation.

That is still not possible in a web browser, thirty years later. Try to play a video backwards
with audio: `playbackRate` can't go negative in practice, so the best you can do is iteratively
set `currentTime` — a strobe of seeks, not *playing* in the sense ScriptX/Clocks/QuickTime
meant it. The web got the window hierarchy and never got the time hierarchy.

The Korz reading writes itself: the clock tree is **delegation along a time dimension** — every
node inherits its parent's timebase and overrides rate and offset locally, exactly as a
transform hierarchy delegates space. Windows had both at once: one tree, two dimensions,
per-node overrides. ([korz-prime](../david-ungar/korz-prime.md)'s "interpret, don't invent"
table would file this as prior art: the head-tilt where a containment hierarchy *is* an
inheritance hierarchy, applied to time in 1993.)

And it's the missing infrastructure under the video-sampler lineage: **EBN's VuJak chorded
time from a keybed** (MIDI notes jumping a QuickTime movie's playhead — see the
[Rhetoric Organ ancestors](rhetoric-organ-semantic-modulator-keyboard.md)); ScriptX made time
a **parentable, scalable, reversible coordinate system** you could hang whole interfaces on.
VuJak played the timeline; ScriptX let every window own one.

## DreamScape @ WWDC 1995

Live performance demo on PowerBook 540c (May 11, 1995). Improvisational programming art — switched
between **Macromedia Director** (authoring animations, registration points, robot parts) and
**Netscape** (browsing programmatically generated HTML, `scriptx:` URLs, room/object inspectors).

| Beat | What |
|------|------|
| **Rooms + map** | Editable room graph; kiss icons to connect; bounce off walls into neighbors |
| **Plug-together** | Director-imported parts; Mr Potato Head / Lego robots; behaviors (fission, wind/ESP) |
| **Web publishing** | Title containers downloadable from web; ScriptX as helper app; nested HTML outlines |
| **Netscape bridge** | Dynamic C extension; image maps hit live objects; edit elasticity/gravity via forms |
| **Nurturing env** | Not a killer app — fertile ground for artists to plant seeds |

Vision: **link globally, interact locally** — reinvent live plug-togetherable multimedia objects,
simulations, and web pages. Same architectural itch as StoryMaker cards, iLoci room networks,
and 2026 eBike Safari's hidden graph at real-world POIs.

→ Product seed: [`../../repo-shows/ebike-safari/README.md`](../../repo-shows/ebike-safari/README.md) · Jam: [`../../process/crazy-idea-jam.yml`](../../process/crazy-idea-jam.yml#dreamscape-scriptx)

The **ScriptX object-system design team** and the **Self team** held a great Kaleida meetup
called **Conscientious Objectors** — prototype-based object systems from two directions,
bouncing ideas off each other. Not a one-way lecture: ScriptX OO multimedia Lisp meets Self's
power-of-simplicity rig; mirrors, inheritance, and live objects argued in good faith.

→ Dream show with David Ungar: [`self-interest-narcissas-mirror-david-ungar.md`](self-interest-narcissas-mirror-david-ungar.md) · [`../david-ungar/`](../david-ungar/README.md)
→ The term's full 1967–2026 lineage: [`conscientious-objectors-enlightened-self-interest.md`](conscientious-objectors-enlightened-self-interest.md)

## Why it matters in the lineage

- **After NeWS/HyperLook** — still "send code, not commands," but now **time-based** and **authorable**
- **Before The Sims** — objects that carry behavior in a world you walk and edit
- **Conscientious Objectors** — ScriptX × Self meetup; the ethic MOOLLM still teaches (intentional craft, not vibe slop)
- **Forward** — DreamScape → iLoci (2008) → SFC MediaGraph → MOOLLM filesystem microworld

## Talks & receipts

- DreamScape @ WWDC 1995 — [`portrayal/presentations.yml`](portrayal/presentations.yml)
- Talk package: DonHopkins `talks/past/dreamscape-wwdc-1995.yml`
- [`talks/INDEX.yml`](talks/INDEX.yml) · [`career/stupid-fun-club.yml`](career/stupid-fun-club.yml) (MediaGraph lineage)

→ [`career/lineage.yml`](career/lineage.yml) (`bundle` DreamScape entry) · [`career/work-history.yml`](career/work-history.yml) · [`../../process/trails/live-objects.md`](../../process/trails/live-objects.md)
