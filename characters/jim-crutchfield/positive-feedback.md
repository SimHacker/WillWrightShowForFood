---
status: draft
character_id: jim-crutchfield
public: true
audience: "James P. Crutchfield (as the intended audience) — and anyone reading over Don's shoulder"
about: "What forty years of Jim's loop did to Don's work — and the 1984 volume that already contained both halves of it"
see_also:
  - crutchfield-machine.md
  - papers/README.md
  - abraham-video-feedback-lineage.md
  - ../don-hopkins/warpomatic-video-background-removal.md
  - ../don-hopkins/cam-construction-set.md
  - ../norman-margolus/the-cam6-demo-for-norman.md
---

# Positive Feedback — what your loop did to me, Jim 🦋♾️

*A public draft written **to** James Crutchfield, and readable by anyone. Jim may edit,
correct, or ask for removal at any time. Not his words, and not his work.*
[Portrayal standards](../../schemas/portrayal-standards.md)

Jim —

This is feedback in both senses, which is the only reason I let myself use the pun. **Positive
feedback** in the control-theory sense is the runaway kind: output re-enters as input with
the same sign, and small things become large. It's also what you call it when you tell
somebody their work mattered. I've been in your loop for forty years and the gain never
dropped below one, so both readings are literally accurate and I'm going to spend the rest
of this letter earning them.

I'm also going to **define every term as I use it**, including the ones you invented. That's
not for you. It's for the people reading over my shoulder, and it has a purpose beyond
politeness: once the vocabulary is on the table, we can **bolt the words together into
compounds that say exactly what we mean.** There's a section at the end that does nothing
but that. Skip to [the glossary](#the-vocabulary-with-receipts) if you'd rather see the
parts before the assemblies.

## The thing I found out this week

I have spent four decades building two machines that I thought were two machines.

One is continuous: **[WarpOMatic](../don-hopkins/warpomatic-video-background-removal.md)**,
real-time video feedback with the background cut away, so the loop iterates a person instead
of a room. The other is discrete:
**[CAM6](../don-hopkins/cam6-cellular-automata-machine.md)**, my software reimplementation
of Toffoli and Margolus's cellular automata machine, book-compatible down to the lookup
tables. I have always treated these as neighboring hobbies. Related in spirit, filed
separately.

They were published as one idea, in one volume, in 1984, and the volume is yours.

**Physica D 10** is not a regular issue. It is *Cellular Automata: Proceedings of an
Interdisciplinary Workshop, Los Alamos, March 7–11, 1983*, edited by **Doyne Farmer, Tommaso
Toffoli, and Stephen Wolfram**. Your "Space-Time Dynamics in Video Feedback" is at pages
229–245. **Tommaso Toffoli's "CAM: A High-Performance Cellular Automaton Machine" is in the
same volume.** So is Wolfram's "Universality and Complexity in Cellular Automata" at page 1,
Kauffman on random boolean networks, and Hillis on the Connection Machine.

You brought a video feedback rig to a cellular automata workshop and let the room play with
it. Your own Acknowledgements say so — *"I would also like to thank the Automata Workshop
participants who played with the video feedback demonstration and discussed their ideas with
me,"* with particular thanks to Otto Rössler and Art Winfree. The people whose CA hardware I
would spend my life reimplementing were standing at your camera, holding things up to it.

And then in §5 you wrote the bridge out explicitly. Listing the variations worth pursuing,
you land on **(6) inserting a digital computer into the feedback loop via a video frame
buffer**, and say variations (5) and (6) *"may lead to the most fruitful applications."*
Then you describe what that machine does:

> *"In this process an image is stored each raster time. Each pixel and its neighbors are
> operated on by some (nonlinear) function. For rapid ('real-time') simulation this function
> is stored in a 'look-up' table. The pixel value and those of its neighbors form the input
> to the table. The table's result then becomes the pixel's new value that is stored and
> displayed."*

Jim, **that is the CAM-6 contract**, stated in full, in the same proceedings where Toffoli
presented the CAM-6. Neighbor bits form an index, the table answers, the answer becomes the
new cell. It's the sentence I've been implementing since the 1980s — in C, in Mitch Bradley's
Sun Forth, in C++, in Python, in JavaScript — and I did not know it was sitting in the video
feedback paper.

You then say the part that makes the two machines one machine:

> *"With video feedback one has simple control over the **nonlocality** of the rules using
> rotation and spatial magnification, and over the **number of neighboring pixels** using
> the focus."*

Rotation and magnification are the neighborhood's *shape*. Focus is the neighborhood's
*radius*. Those are knobs on a physical rig that do the job a CA architect does in hardware
by choosing Moore or von Neumann or Margolus. And then:

> *"Generalizing cellular automata, from a few states per site to many, leads to **lattice
> dynamical systems**."*

Which is the whole ladder — binary CA, to many-state CA, to continuous fields — described as
one continuum with a threshold knob deciding where on it you're standing.

So the honest summary of my career is that I have been building, in two separate piles for
forty years, the two ends of a single system that you described in one paper, at a workshop
Toffoli was also presenting at, before I started. I'm not upset about it. I think it's the
best news I've had in a while, because it means the merge isn't a mashup. **It's a
reunification, and you wrote the spec.**

## What I built, in your words

Here's my side of the loop, described using your vocabulary rather than mine. Everything in
bold is defined in [the glossary](#the-vocabulary-with-receipts) below.

**WarpOMatic** (PowerPC Mac, around 2003) is a **nonlocal** iterated image system: each
frame is warped, blurred, decayed, and composited back into itself, so the **operator** `T`
has your **rotation**, **magnification**, **focus**, and **storage decay** as its
**parameters**. Standard stuff — a small, sincere implementation of your model.

The part that isn't in your paper is what I did with the human.

I pulled the background out. Not with machine learning, which didn't exist for this yet —
with a **retroreflective** chromakey drape and a ring of blue LEDs bolted around the lens,
so the backdrop is grey to your eye and blue only to the camera. Cutting the person out was
supposed to be cosmetic. It turned out to be a **sensor**. Once the system knows which pixels
are the person, it can measure them — and I wired those measurements to the knobs.

**The performer's position in frame steers the transform. The area of their silhouette
drives the zoom.** Lean in and it magnifies hard; back off and it collapses into a spiral;
shrink to just a hand and the whole regime follows the hand. I called it a virtual joystick
at the time, which undersells it. In your framing, what I actually did was **move the human
from the state to the parameters**. In your rig the operator stands outside the system
turning knobs and occasionally perturbing the image by holding something up. In mine the
same gesture does both at once: the body is simultaneously **injected content** and **the
control signal**, and the person cannot perturb the picture without also changing the rule
that governs the picture.

I don't know whether that's interesting physics or just a fun instrument. That's a real
question, not a rhetorical one, and you're the person who'd know. It's a **closed loop
through a human nervous system**, which means the fixed points depend on what the person
finds pretty — and people are quite good at unconsciously hunting for the edge of the
interesting regime, which is a suspiciously familiar place to end up.

Meanwhile **CAM6** was the discrete half, and it kept reaching for the same things from the
other side. I ran **heat diffusion** in the upper bit planes with a CA in the lower ones,
leaking into each other. I built rules that pick among sixteen **convolution kernels** where
the selection is modulated by the clock, by position, and by the cell's own value at once —
a modulation matrix, which is a synthesizer idea, and which is also just **parameters that
vary in space and time** with a straight face. I was building lattice dynamical systems and
calling them marble textures.

## What I want to build now, and the one thing I'd want from you

The target is a **browser page with webcam access**: no install, no chromakey drape, no
hardware. Segmentation is a library call now; WebGPU is real; the reasons this stayed a
native app have all expired. Two halves on one component bus — the
[CAM Construction Set](../don-hopkins/cam-construction-set.md) for the discrete side, a
warp/feedback engine for the continuous side, sharing neighborhoods, parameters, and
instruments, because §5 says they're the same family and I finally believe it.

It has to work for a stranger in the first second. My acceptance test is that somebody picks
up their cat and holds it in front of the laptop — and I mean that literally: at 7:33 of my
own explanation video, after I've said goodbye and the tape should be over, I pick up my cat
and hold her to the camera, because that is what everybody does. **Cat-in-the-loop.** It is
also, in your terms, a **controlled perturbation of a spatially extended dynamical system by
an experimenter using the only apparatus they have**, which is exactly what you were doing
with Larry Cuba's borrowed equipment for Plates 6 and 7.

Here's the ask, and it's the only one.

**Put your instruments on the front door.** Not behind an "advanced" tab — right next to the
picture, from the first second. **Statistical complexity** and **entropy rate** as two live
meters. **Excess entropy** as a third. An **ε-machine** of the loop's own output, drawn and
updating, next to the loop it's a model of.

Because here's what that buys, and it's the thing I can't build without you. Right now, a
person playing with feedback has exactly two words available: *boring* and *pretty*. With
your meters on screen, they get to *watch the numbers while they turn the knob*, and
discover for themselves that **random is not the same as complex** — that when they crank
the noise until the screen is static, one meter pins and the other one **collapses**. That
is the single most important idea in your field and it is nearly impossible to explain in
words to someone who hasn't felt it. **It is trivial to feel in ten seconds with two meters
and a knob.**

That's the thing I want to make: not a demo of your work, an **instrument that teaches your
distinction by letting a stranger's hand find it** while they're playing with their cat.

## The vocabulary, with receipts

*Jim: skip, obviously. Everyone else: this is the whole space, in dependency order — each
term uses only terms above it. Citations are to where the term was introduced or defined;
where a concept has independent discoverers I've said so, because in this field that's
common and the parallel names cause real confusion. Anything marked ⚠️ is my summary and
should be checked against the source before you quote it.*

### Feedback and its machines

| Term | Definition | Where it comes from |
|---|---|---|
| **Feedback** | Output routed back in as input. **Negative** feedback subtracts, and stabilizes; **positive** feedback adds, and amplifies until something saturates. | Harold Black's negative-feedback amplifier, Bell Labs, 1927 |
| **Video feedback** | Point a camera at the monitor showing its own output. The image goes "round and round the camera-monitor loop" instead of from here to there. | Crutchfield, *Physica D* **10** (1984) 229 — opening lines. Published as mathematics eight years earlier by **Ralph Abraham**, "Simulation of cascades by video feedback," Springer *LNM* **525** (1976) 10–14 — reference `[1]` of the 1984 paper and the first name in its Acknowledgements. See [`abraham-video-feedback-lineage.md`](abraham-video-feedback-lineage.md) |
| **Space-time analog computer** | Jim's claim for what a feedback rig *is*: not a pretty effect but a machine computing a spatially extended dynamical system in real time, at full frame rate, on an entire image at once. | Crutchfield 1984 §1: *"I will be implicitly arguing that video feedback is a space-time analog computer"* |
| **Operator `T`** | The whole per-frame transformation: warp, blur, decay, recombine. The system is `Iₙ₊₁ = T(Iₙ)` — apply it forever and see what survives. | Crutchfield 1984 §3, the **iterated functional equation** model |
| **Reaction-diffusion** | The continuous cousin: local "reaction" chemistry plus spatial spreading, `∂I/∂t = F(I) + D∇²I`. Produces spontaneous patterns from uniform starting conditions. | **Turing**, "The Chemical Basis of Morphogenesis," *Phil. Trans. R. Soc. B* **237** (1952) 37 — reference `[6]` of the 1984 paper, whose eq. (7) is a video-feedback version of it |
| **Nonlocal** | A rule whose inputs are *not* only immediate neighbors. Jim's point: rotation and magnification in an optical loop reach across the image, so video feedback simulates automata that ordinary CA can't. | Crutchfield 1984 §1 and §5: *"video feedback also allows for the simulation of nonlocal automata"* |
| **Lattice dynamical system** | A grid where each site holds a continuous value rather than one of a few discrete states — the far end of a ladder that starts at binary CA. | Crutchfield 1984 §5: *"Generalizing cellular automata, from a few states per site to many, leads to lattice dynamical systems"* |
| **Coupled map lattice (CML)** | A lattice of simple maps, each nudged by its neighbors' previous values. The standard vehicle for spatiotemporal chaos. | **Kunihiko Kaneko**, from 1984 onward; with Crutchfield on spatiotemporal chaos phenomenology and the "dripping handrail" — Crutchfield & Kaneko, *Phys. Rev. Lett.* **60** (1988) 2715 |
| **Lookup table** | Precompute the rule's answer for every possible neighborhood; then running the system is just reading memory. The trick that makes real-time CA possible. | Toffoli & Margolus's CAM architecture — **and Crutchfield 1984 §5**, describing variation (6) in exactly those terms, in the same volume as Toffoli's CAM paper |

### Dynamics

| Term | Definition | Where it comes from |
|---|---|---|
| **State vs. parameter** | The **state** is what the system currently *is* (the image). A **parameter** is a setting of the rule (zoom, focus, decay). States evolve; parameters are turned. Confusing the two is the most common error in reading these systems — and deliberately blurring them is what WarpOMatic's body-driven controls do. | Standard dynamical systems theory |
| **Attractor** | What the system settles onto once startup effects die away — a fixed point, a repeating cycle, or a **strange attractor** with fractal structure. | Standard; the 1984 paper's proposed next step is *"reconstruct state space pictures of the simpler attractors"* |
| **Transient** | The behavior *before* it settles. Usually treated as garbage to be discarded, which is often a mistake — see the 1984 paper's seven-second limit cycle *"allowed to oscillate for two hours."* | Standard |
| **Bifurcation** | A qualitative change in the attractor as you smoothly turn a parameter — a cycle splits, an attractor appears or dies. The reason a knob can feel like a cliff edge. | Standard; Abraham's 1976 paper is titled "Simulation of **cascades** by video feedback" — cascade meaning a sequence of these |
| **Attractor reconstruction / embedding** | Recover the shape of a system's hidden dynamics from a *single* stream of measurements, by treating time-delayed copies of the signal as extra dimensions. You don't need access to the machine's internals; the output betrays them. | **Packard, Crutchfield, Farmer & Shaw**, "Geometry from a Time Series," *Phys. Rev. Lett.* **45** (1980) 712 |
| **Excitable medium** | A system where each element fires, then must rest before firing again — so waves travel outward and spirals sustain themselves. Chemistry (Belousov–Zhabotinsky), heart tissue, slime mold. | Standard; **Art Winfree**, thanked in the 1984 Acknowledgements, is the person who worked out the three-dimensional version |

### Information and intrinsic computation

*This is Jim's own tower. Each level needs the one above it.*

| Term | Definition | Where it comes from |
|---|---|---|
| **Entropy rate** `hμ` | How much genuinely *new* randomness the process produces per step — its irreducible surprise, after you've used everything the past can tell you. Maximal for pure noise, zero for a clock. | Shannon (1948); Kolmogorov–Sinai for dynamical systems |
| **Causal states** | Group together every past that implies the *same probability distribution over futures*. Those equivalence classes are the system's states — not the ones you assumed it had, the ones its own behavior requires. | **Crutchfield & Young**, "Inferring Statistical Complexity," *Phys. Rev. Lett.* **63** (1989) 105 |
| **ε-machine** | The minimal, unique machine built from the causal states that predicts the process as well as the entire past does. The model the process *is*, discovered rather than imposed. | Crutchfield & Young (1989); developed in Crutchfield, "The Calculi of Emergence," *Physica D* **75** (1994) 11 |
| **Statistical complexity** `Cμ` | How much information you must **store** in those causal states to predict optimally — the size of the minimal machine. Crucially, this is **low for both a clock and pure noise**, and high only in between. It measures *structure*, not disorder. | Crutchfield & Young (1989) |
| **Excess entropy** `E` | How much the past and future **share** — the total predictable information available in principle. Related to `Cμ` but not identical: `E` is what's learnable, `Cμ` is what must be remembered. | Crutchfield & Feldman, "Regularities Unseen, Randomness Observed," *Chaos* **13** (2003) 25. Independently discovered as **"effective measure complexity"** (Grassberger, *Int. J. Theor. Phys.* **25** (1986) 907) and **"predictive information"** (Bialek, Nemenman & Tishby, *Neural Computation* **13** (2001) 2409) — three names, one quantity ⚠️ |
| **Computational mechanics** | The whole framework: take a process, find its causal states, build its ε-machine, and read off how much information it stores and generates. Structure as a measurable property rather than an aesthetic judgment. | Crutchfield (1994); overview in "Between Order and Chaos," *Nature Physics* **8** (2012) 17 |
| **Intrinsic computation** | What a system is *already doing* with information on its own terms — storing it, transmitting it, transforming it — as opposed to what you could program it to compute for you. A hurricane is not computing anything for anybody, and it is doing an enormous amount of intrinsic computation. | Crutchfield (1994, 2012) |
| **Edge of chaos** | The claim that interesting computation lives on the boundary between frozen order and full disorder. **The term is Norman Packard's** ("Adaptation Toward the Edge of Chaos," 1988) and was popularized by **Chris Langton**'s λ parameter (*Physica D* **42** (1990) 12). Jim's relationship to it is more interesting than "he coined it," which he didn't: Crutchfield & Young's "Computation at the Onset of Chaos" (1990) is the rigorous version, and **Mitchell, Hraber & Crutchfield's "Revisiting the Edge of Chaos" (1993) is a careful pushback on the slogan** — showing that evolved CA doing real computation don't necessarily sit where the λ story predicts. He is a co-author of the paper that made his own field's catchphrase harder to say casually. | Packard (1988); Langton (1990); Crutchfield & Young (1990); Mitchell, Hraber & Crutchfield, *Complex Systems* **7** (1993) 89 |
| **Computational irreducibility** | Some systems have no shortcut: the fastest way to know what they do is to run them and watch. The reason an instrument is not a lazy substitute for a theory. | **Stephen Wolfram**, whose "Universality and Complexity in Cellular Automata" opens *Physica D* **10** — the same volume as the video feedback paper |

*Citations should be checked against [Jim's own publication list](https://csc.ucdavis.edu/~chaos/)
before anyone quotes them. Getting a man's bibliography wrong in a letter praising his
bibliography would be its own kind of feedback.*

## Molecules

Now the point of all that. With the terms defined we can bolt them together, and the
compounds say things that would otherwise take a paragraph each. Every one of these is a
real design target, not a turn of phrase.

**A nonlocal lattice dynamical system with a human in the parameter loop.**
That's WarpOMatic in your 1984 vocabulary, and writing it out is what showed me the human
isn't in the *state*, she's in the *parameters*. Which raises the question I'd most like to
ask you: when the experimenter's body is wired to the knobs, and she's steering by what looks
good, what is she actually optimizing? My guess is she's doing gradient ascent on
**statistical complexity** with her hands, and doesn't know it, because "boring" is what both
low-`Cμ` extremes feel like from the inside.

**An ε-machine of the instrument's own output, rendered as a HUD layer.**
Not analysis performed afterward on a recording — a model of the system, drawn live, next to
the system, updating as you turn the knob. The **transient** becomes visible as the meter
that hasn't settled yet.

**Cat-in-the-loop as a controlled perturbation of a spatially extended dynamical system.**
The stranger holding up their pet is running your experiment. The only difference between
that and Plates 6 and 7 is which apparatus was to hand.

**A curb-appeal front door onto a computational-mechanics instrument.**
The whole design thesis in one compound. First second: delight, no vocabulary required.
First minute: two meters that move when you move. First hour: you have personally discovered
that **random ≠ complex**, and nobody had to define entropy rate at you.

**Excess entropy as a difficulty knob.**
If the meters are live, they can also be a target. "Find me a regime where `E` is high" is a
legitimate puzzle, playable by someone who has no idea what `E` is, and it is a much better
game than most educational software because the answer isn't stored anywhere — the system is
**computationally irreducible**, so you and the machine have to find it together.

**One component bus, both halves of Physica D 10.**
CA lookup tables and continuous warps sharing neighborhoods, parameters, and instruments —
because §5 says a threshold is the only thing separating them, and because Toffoli's CAM
paper and your video feedback paper are twelve pages apart on the same shelf.

## What I'd want on the show

1. **Run the rig next to the film.** The 1984 film in one window, a live GPU implementation
   in the other. You point at a shot; I set the knobs to match. The plates are the target
   images and the uniforms are the controls.
2. **Open Physica D 10.** Your paper and Toffoli's, side by side, and you tell the room
   whether the merge was obvious to you at the time or whether it's hindsight I'm imposing
   forty years later. I genuinely don't know which answer I'm going to get.
3. **The two-meter demo.** `hμ` and `Cμ` on screen; hand somebody the noise knob; let them
   find the middle. Ten seconds to the punchline of your career, which I mean as a
   compliment to the punchline.
4. **The body-as-parameter question**, live and unresolved: is a human closing the loop
   through her own aesthetic sense doing anything a physicist should care about?
5. **Ralph.** He's in reference `[1]` and the first line of your Acknowledgements, and he
   died on 19 September 2024. [`../ralph-abraham/memorial.md`](../ralph-abraham/memorial.md)

Thanks for the loop, Jim. Forty years of gain greater than one.

— Don Hopkins *(the User Interface Flower Child)* 🌀🦋

## See also

- [`papers/README.md`](papers/README.md) — the 1984 paper and film, the plates
- [`crutchfield-machine.md`](crutchfield-machine.md) — a third party rebuilt the 1984 rig in fragment shaders, with the citations attached
- [`abraham-video-feedback-lineage.md`](abraham-video-feedback-lineage.md) — the 1976 → 1984 handoff
- [`../don-hopkins/warpomatic-video-background-removal.md`](../don-hopkins/warpomatic-video-background-removal.md) — the continuous half, transcribed
- [`../don-hopkins/cam-construction-set.md`](../don-hopkins/cam-construction-set.md) — the discrete half, as rewireable components
- [`../norman-margolus/the-cam6-demo-for-norman.md`](../norman-margolus/the-cam6-demo-for-norman.md) — the same letter, to the other author in the volume
