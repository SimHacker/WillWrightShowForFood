# Jim Crutchfield — papers annex 🦋

*Local copies of key papers, with summaries and the reasons each one lives in
this repo. Don has been giving Jim feedback about his feedback since 2013 —
see [don-and-jim-history.md](../don-and-jim-history.md) for the correspondence,
the Amsterdam boat, and the director's-cut project.*

## In this directory

| File | Paper |
|------|-------|
| [`crutchfield-1984-space-time-dynamics-in-video-feedback.pdf`](crutchfield-1984-space-time-dynamics-in-video-feedback.pdf) | "Space-Time Dynamics in Video Feedback," *Physica* **10D** (1984) 229–245 |
| [`crutchfield-2002-what-lies-between-order-and-chaos.pdf`](crutchfield-2002-what-lies-between-order-and-chaos.pdf) | "What Lies Between Order and Chaos?" in *Art and Complexity*, J. Casti ed., Oxford (2002) |

Canonical sources: [UC Davis PDF](https://csc.ucdavis.edu/~cmg/papers/Crutchfield.PhysicaD1984.pdf) ·
[abstract page](https://csc.ucdavis.edu/~chaos/chaos/pubs/stdvf-title.html) ·
[DOI 10.1016/0167-2789(84)90264-1](https://doi.org/10.1016/0167-2789(84)90264-1) ·
[Jim's films page](https://csc.ucdavis.edu/~chaos/chaos/films.htm)

## Space-Time Dynamics in Video Feedback (1984)

**The move:** point a video camera at its own monitor and treat what happens
not as a party trick but as a **spatiotemporal dynamical system** — then argue
that the rig is a **space-time analog computer**. "The information no longer
goes from here to there, but rather round and round the camera-monitor loop...
From this dynamical flow of information some truly startling and beautiful
images emerge."

**What's in it:**

- **The physics of the loop.** The vidicon tube stores and integrates charge
  (a temporal low-pass filter) and diffuses electrons (a spatial low-pass
  filter); the knobs — **zoom, rotation, focus, f/stop, brightness, contrast,
  hue** — become the control parameters of a dynamical system. Focus is,
  wonderfully, a hands-on **spatial diffusion rate** control.
- **Two models.** A discrete-time **iterated functional equation** on the
  space of images, and a continuous **reaction-diffusion PDE** in the direct
  lineage of **Turing's 1952 morphogenesis paper** — with one Korz-flavored
  twist: the rotation/magnification term makes the spatial coupling
  **nonlocal**.
- **A taxonomy of behavior:** fixed-point images, limit cycles (a 7-second
  color oscillation stabilized by a tiny mark near the screen center — left
  running two hours one evening with no deviation), chaotic image sequences,
  noise-driven bursts, and — where dynamical systems theory runs out of
  vocabulary — **"quasi-attractors"**: maze-like **dislocation** patterns that
  are stable as a *class* of similar images rather than as any exact image.
  Pinwheel images are compared to Winfree's rotating waves in heart tissue;
  spiral color waves to Belousov-Zhabotinsky.
- **The CA claim (§5).** Video feedback "does, in fact, simulate some
  two-dimensional automata and rapidly, too" — rotation and magnification give
  **nonlocal neighborhoods**, focus sets the **neighborhood radius**, and
  proposed variation (6), *"inserting a digital computer into the feedback
  loop via a video frame buffer,"* generalizes the rig to arbitrary lookup-table
  rules and lattice dynamical systems.
- **The price tag footnote:** "The cost for this space-time simulator is a
  little over $1000, approximately a cheap home computer."
- **Provenance:** premiered (as film) at the **International Workshop on
  Cellular Automata, Los Alamos, May 1984**. Acknowledgments thank **Ralph
  Abraham** for the introduction to video feedback (the 1976 cascades paper —
  see [abraham-video-feedback-lineage.md](../abraham-video-feedback-lineage.md)),
  **Doyne Farmer** and CNLS for support, and **Larry Cuba** — the *Star Wars*
  Death Star briefing animator — for loaning the video equipment behind
  Plates 6 and 7.

### The plates

Scanned from the printed Physica D article:

![Plates 1-4: equilibrium image, limit cycle snapshot, dislocations, logarithmic spiral](../media/video-feedback-plates-1-4.jpg)

*Plate 1: a nine-fold equilibrium image (360°/40° rotation = 9 — "symmetry
locking," the spatial cousin of frequency locking). Plate 2: one frame of the
7-second limit cycle. Plate 3: dislocations — laminar stripes outside, a
maze of broken symmetry inside; the quasi-attractor specimen. Plate 4: the
logarithmic spiral, "structure and periodic coloring [that] occur often in
organisms, such as budding ferns and conch shells."*

![Plates 5-7: relaxation oscillation burst, pinwheels, spiral waves](../media/video-feedback-plates-5-7.jpg)

*Plate 5: a noise-amplified burst — "noise-driven spatial structures in a
relaxation oscillator," first cousin of the [dripping
handrail](../don-and-jim-history.md#the-dripping-handrail-). Plates 6-7 (shot
on Larry Cuba's equipment): luminance-inversion pinwheels compared to the
rotating electrical waves of the beating heart, and outward-spiralling color
waves reminiscent of Belousov-Zhabotinsky.*

### Why this paper lives in this repo

- **It's the video verse of the feedback-loop hymn.** Lucier ran the loop
  through a room (1969, audio); Crutchfield ran it through a camera-monitor
  pair (1984, video); the [robopoetry telephone
  game](../../don-hopkins/rhetoric-organ-semantic-modulator-keyboard.md) runs
  it through a language model (2026, text). And Crutchfield's variation (6) —
  put a computer in the loop — **is** the telephone game's architecture,
  proposed forty-two years early: the LLM is the frame buffer.
- **It premiered at the CA conference where the CAM was born.** Jim's 2019
  recollection (see [don-and-jim-history.md](../don-and-jim-history.md)): at
  the 1983 Los Alamos gathering, Toffoli and Margolus were **wire-wrapping the
  first CAM in the back of the room**. The film premiered at the 1984 workshop
  in the same series. That thread runs straight to the [Norman Margolus
  show](../../../repo-shows/norman-margolus/SHOW.yml), Don's CAM6.js, and the
  CAM-8 software-archaeology beat.
- **Nonlocal neighborhoods are dimension guards.** Rotation and zoom
  parameterize *which cells are your neighbors* — the same generalization
  [korz-prime](../../david-ungar/korz-prime.md) makes when it reads cellular
  automata as fully-crystallized Korz ("CA at absolute zero") with
  neighborhoods as dimensions. Video feedback is the analog machine where you
  *turn the neighborhood with a lens ring*.
- **Turing 1952 is the shared ancestor** of this paper's PDE model, of
  reaction-diffusion texture work everywhere, and of the morphogenesis riffs
  in the [hierarchy-of-bleeds fluid
  CA](../../../repo-shows/heather-and-steve-alvey/afterlife-zombie-bridge.yml).
  Plate 3's dislocations are what the blood/chum flood z-buffer wants to look
  like when it grows up.
- **The director's cut is an open show project.** The film ([YouTube, 77k
  views](https://www.youtube.com/watch?v=B4Kn3djJMCE)) lost its narration to
  music rights; the narration survives on Kathy Abelson's tape; the plan is to
  re-record it **live on the show**, MST3K-style. Bonus sleeper credit: the
  soundtrack's *Rio Chama* is **composed by Crutchfield himself**.

## What Lies Between Order and Chaos? (2002)

Written for John Casti's *Art and Complexity* volume: Crutchfield's most
accessible statement of the thesis behind computational mechanics — that
**structure lives between order and randomness**, and that both extremes are
cheap while the middle is where nature (and art) does its work. Entropy
measures surprise but not organization; his **statistical complexity** and
**ε-machines** measure the intrinsic computation a process performs — how much
history it stores and how it uses that memory to behave.

### Why this paper lives in this repo

- **It's the aesthetic theory of the whole jam.** "Between order and chaos" is
  the operating point of Eno's generative systems ([brian-eno
  ideas](../../brian-eno/ideas.md)), Don's [Musical
  Gas](../../don-hopkins/musical-gas-granular-ca-synth.md), the CAM6 space
  inventory sets, and the [rhetoric
  organ](../../don-hopkins/rhetoric-organ-semantic-modulator-keyboard.md)'s
  dramaturgy (ride the loop up to peak absurd beauty, then gong it).
- **It's korz-prime's temperature axis with the sign conventions worked out.**
  Fully crystallized rules at one end (strict tier, CA at absolute zero),
  noise at the other, and the interesting representations in between — the
  soft/strict two-tier design is a bid to *live* at Crutchfield's operating
  point rather than visit it.
- **Art & Science Laboratory credentials:** Jim co-founded the Santa Fe
  Art & Science Lab and built the *Theater of Pattern Formation* with composer
  David Dunn — performed at CalArts and **Burning Man**. He has already staged
  pattern formation as a show; the Repo Show format is his home turf.

## Cited, not downloaded

- Packard, Crutchfield, Farmer & Shaw, **"Geometry from a Time Series,"**
  *Phys. Rev. Lett.* 45:712 (1980) — reconstruct the attractor from one
  measurement stream; the Santa Cruz Dynamical Systems Collective's
  calling card (and the *Eudaemonic Pie* roulette era).
- Crutchfield & Kaneko, **"Are Attractors Relevant to Turbulence?"** *PRL*
  60:2715 (1988) — the **dripping handrail**; transients that outlast the
  universe. Show beat: simulate it in the browser.
- Mitchell, Hraber & Crutchfield, **"Revisiting the Edge of Chaos"** (1993) —
  evolving cellular automata to compute; the GA-meets-CA thread.
- **Films:** [*Space-Time Dynamics in Video Feedback*
  (1984)](https://www.youtube.com/watch?v=B4Kn3djJMCE) and [*Chaotic Attractors
  of Driven Oscillators* (1982)](https://youtu.be/Sq8Vu40Bw1g), both Entropy
  Productions, Santa Cruz.

## See also

- [don-and-jim-history.md](../don-and-jim-history.md) — the correspondence, the boat, the tape
- [abraham-video-feedback-lineage.md](../abraham-video-feedback-lineage.md) — the 1976 → 1984 handoff
- [ideas.md](../ideas.md) · [invitation.md](../invitation.md) · [CHARACTER.yml](../CHARACTER.yml)
