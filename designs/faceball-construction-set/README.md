# Faceball Construction Set

**Faceball like Pinball.** Not one face puppet — a kit for building arbitrary ones. Snap parts onto
anchors, stack behaviors, play the physics.

*Status: **design**, not an app. The spec is
[`apps/performance-space/faceball-construction-set.yml`](../../apps/performance-space/faceball-construction-set.yml);
this directory is its human-readable form. Nothing here is built yet.*

*Sniff:* [`GLANCE.yml`](GLANCE.yml) · Engine: [**Tom Ngo's ECG**](#the-engine-is-tom-ngos-ecg), by way of
[Golan Levin's Mouther](https://www.flong.com/archive/projects/mouther/) · Credits:
[`inspirations.md`](inspirations.md)

## The argument, which is Minsky's

Marvin Minsky wrote an essay for children called **"The Infinite Construction Kit"** whose whole
claim is one sentence: *"What matters is how the parts affect each other, not what is inside them."*
Alan Kay's afterword to it puts the same thing as **architecture dominates materials**, and then
demonstrates it — a conditioned reflex built from **three memories that are identical except for
their rate of forgetting**. One part, instanced three times, differing in one number, and animal
learning falls out of the arrangement.

That is the discipline this kit is trying to hold. Faceball has a small number of part *kinds* and a
large number of instances:

- **Tears and vomit are the same emitter** with a different anchor and a different fluid.
- **The size filter and the rotation engine are the same kind of object** — composable modifiers that
  stack onto any part, in any order.
- **Every attachment snaps to the same fiduciary anchor**, so a hat, a googly eye, and a particle
  emitter are interchangeable at the joint.
- **A face that emotes and a cartoon part that deforms are the same solver** — both are blends of drawn
  examples, which is [Tom Ngo's ECG](#the-engine-is-tom-ngos-ecg) and the deepest cut of this discipline
  in the whole kit.

If a new gag needs a new subsystem, the kit has failed. If it needs a YAML file naming an anchor and
a few numbers, the kit is working.

## The parts

| Kind | What it is | Composable with |
|---|---|---|
| **Fiduciary anchors** | Normalized (x,y) pins on a portrait — nostril, brow, eye, mouth, chassis. Usually invisible; a debug overlay in the editor. | Everything snaps here |
| **Attachments** | Mouth hole, googly eyes, hats, glasses, construction-paper props, creature parts | Anchors |
| **Expression modes** | What drives the face: webcam through the mouth hole, **[ECG pose blend](#the-engine-is-tom-ngos-ecg)**, audio-amplitude scrub, canned clip, hand-drawn overlay | One per puppet |
| **Parameterized parts** | A part whose *shape* is an [ECG blend](#the-engine-is-tom-ngos-ecg) of a few drawn example states rather than a fixed sprite. You drag it; you do not tune it | Anchors, modifiers |
| **Modifiers** | Stackable filters on a part — scale, rotation, jiggle gain, censorship mosaic | Each other, freely |
| **Emitters** | Particle and fluid sources — tears, sweat, confetti, snot, spit | Anchors |

The verbs are Budge's: **snap on, wire up, play.**

## The engine is Tom Ngo's ECG

**This kit is the showcase for [Embedded Constraint Graphics](../../characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md),
and ECG is not one expression mode among five — it is the engine under both halves of the parts table.**
The faces and the parts are the same problem, and Tom Ngo solved it at Interval Research in the
nineties.

**The mechanism.** Put example states at the **vertices of a simplicial complex** — compatible subsets
of examples span simplices, glued along shared faces into one continuous state space. Any point inside
a simplex is a **barycentric blend** of its corner examples. Then the move that matters: when you
**drag a feature on the drawing**, the system maps the direction and amount of your drag into motion
through that n-dimensional space, via the Moore–Penrose pseudoinverse of a Jacobian — the same linear
algebra family as inverse kinematics.

> *Gluing high-dimensional simplices at their edges and faces is an extremely general way to represent
> blending manifolds — in the same way that gluing polygons together has done us so much good in 3D
> modeling.* — **Tom Ngo**

**Why it is the right engine rather than a nice reference.** Every other blend-shape system in shipping
use — ARKit's named coefficients, Blender FaceIt, Unity's `SkinnedMeshRenderer` — hands you **sliders
for weights**. ECG inverts it: *you manipulate concrete outcomes and the solver recovers the
coordinates.* For a construction set whose entire premise is snap-on parts and direct manipulation,
sliders are the wrong instrument and always were. **Drag the face, solve the weights.**

And it collapses two subsystems into one, which is the
[Minsky discipline](#the-argument-which-is-minskys) this kit is trying to hold:

| Faceball needs | ECG supplies | Examples at the vertices are |
|---|---|---|
| **Faces that emote** | the pose blend expression mode | drawn example poses — neutral, grin, howl, wince |
| **Parts that deform** | parameterized parts, at any count | drawn example shapes of one cartoon part |

Same solver, same editor, same authoring gesture — draw a few examples, then drag. Don's own summary of
the application is blunter than anything written here: *"reimplement Tom Ngo's ECG to animate
parameterized cartoons — perfect application."*

**The patent is expired and this is free to build.** US5933150, filed 6 August 1996, lapsed around
August 2016 — Don noticed while
[commenting on G9.js](https://news.ycombinator.com/item?id=12572696) and wrote it up as prior art.
Before that, in 2013 at [Will Wright](../../characters/will-wright/README.md)'s Syntertainment, he pitched the same machinery for a multitouch
character designer and **volunteered Tom's patent to management before anyone asked**, offering to
bring Tom into the conversation. The conduct is part of the credit.

### Credit where it is due

- **[Tom Ngo](../../characters/tom-ngo/README.md)** — built ECG at Interval Research: the simplicial
  complex, the drag-to-solve inversion, the patent. The engine is his.
- **[Golan Levin](../../characters/golan-levin/README.md)** — **[Mouther](https://www.flong.com/archive/projects/mouther/index.html)**
  (1995), the prototype concept and artwork, built in Tom's ECG editor. **Mouther is the proof that ECG
  makes good cartoon faces, and it is the direct ancestor of every puppet in this kit.** Faceball is
  Mouther with physics, fluids, and an audience.
- **[Malcolm Slaney](https://engineering.purdue.edu/~malcolm/)** — the speech half of
  [Mouther](https://www.flong.com/archive/projects/mouther/index.html), and the reason it worked live: a phoneme recognizer
  on MFCC features with per-phoneme Gaussian mixture models, RASTA-filtered so it survived a real
  microphone in a real room, driving the ECG graphic so a different viseme shows for each phoneme
  spoken.
- Lineage behind all of it: Sketchpad, and James Gosling's CMU thesis *The Algebraic Manipulation of
  Constraints* — Don's own pointer in that HN thread.

**Mouther's viseme sheet is the clearest picture of the engine that exists.** Golan drew one cartoon
face in eleven mouth positions — AY, EE, UH, OH, R, OO, S, F, L, M — and *those drawings are the
vertices.* The recognizer picks and blends among them; everything in between is barycentric. If anyone
asks what "examples at the vertices of a simplicial complex" means, show them the contact sheet, not the
Jacobian.

`rights: the viseme sheet is Golan's artwork, © Golan Levin and Collaborators. Link it; ask before`
`reproducing it in this repo.` House practice with his material is already written down in
[`media-streams-icon-language.yml`](../../characters/golan-levin/media-streams-icon-language.yml) —
*"Asking is the point."*

And Golan's own closing note on Mouther, in 1995, is the brief this kit inherited:

> *the current result is amusing and could be sufficiently responsive for the quality-level needed in
> **children's computer games**.*

Thirty years later that sentence is still the target, which is
[the point of the next section](#seeds-not-showpieces).

**Both of them are warm contacts with a Repo Show already seeded**:
[`repo-shows/tom-and-golan-ecg-mouther/`](../../repo-shows/tom-and-golan-ecg-mouther/) — a pair
brainstorm on how a modern ECG should look in SVG, Canvas, or WebGPU. Conversation, not code. The
sibling showcase is Soul City's **WigFabrik**, which runs the same solver over hair meshes and
textures. This kit and that shop are the two demos that argument needs.

Full essay, with the patent abstract, the HN exchange, and the Syntertainment disclosure:
[`tom-ngo-embedded-constraint-graphics-at-interval.md`](../../characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md).

## What it looks like in the hands of a great artist

**[Eric Hedman — "Doppel": Character Modelling with Blendshapes for Animation](https://www.youtube.com/watch?v=6L7jtgRD5rs)**
is the demo to watch before building anything here. A monkey face rigged to the full ARKit morph-target
set — `eyeBlinkLeft`, `eyeLookOutRight`, `eyeSquint`, `eyeWide`, `jawForward`, `jawOpen` — with Eric in
frame driving it with his own face, live, and the applied weights visible beside the result. It is an
ARKit-based answer to Animoji, published by IMVU.

**It is also the funniest thing in this entire lineage, and the joy is the technical argument.** Nothing
in the pipeline produces that; Eric does. What the clip proves is not that ARKit works — anyone can
verify that — but that **a facial rig only becomes funny when someone who understands the whole pipeline
performs it.** He refines `MouthClose`, gets eye action working, notes on screen that it did not make
the shipped App Store build, and keeps going. That is a virtuoso at play in his own tooling.

Worth knowing who is doing it: Eric was **The Sims' first professional game artist**, hired specifically
to handle animation, and in his own words he *"ended up working directly with the superlative Don Hopkins
on building out the animation system,"* then moved into behaviour systems and object templating, designed
and built the majority of the original objects, and spent nearly six years on visual quality and
animation appeal before taking over art and animation for Hot Date, Vacation, Unleashed and Superstar.
`needs-check: Eric's portfolio credits Unleashed and Superstar with AIAS best-simulation-game awards for
2002 and 2003 — his claim, worth confirming before repeating as fact.`

- ▶️ [The Doppel blendshape demo](https://www.youtube.com/watch?v=6L7jtgRD5rs) · channel
  [@irkinteraction](https://www.youtube.com/@irkinteraction) · portfolio
  [erichedman.artstation.com](https://erichedman.artstation.com/projects/8wJDgw) · character room:
  [`characters/eric-hedman/`](../../characters/eric-hedman/)
- `todo: the Doppel video has no captions or transcript. Same treatment Don gave the 1996 Wright talk —`
  `upload for auto-captions, proofread, publish — would make it searchable, translatable, and quotable.`
  `Ask Eric first; it is his channel.`

## Seeds, not showpieces

**Eric Hedman and Golan Levin are artists of that rare grade: they understand the pipeline, the tech,
and the tools well enough to make content nobody else could.** Which is exactly why the goal is *not*
to have them produce finished puppets for this kit.

**The goal is for them to make the seeds — and the kits kids can use to make their own.**

That distinction is the whole success criterion, and it has precedent in this repo's own history,
because The Sims 1 already did it. Maxis artists' pipeline knowledge got packaged into tools players
ran themselves:

| Tool | What it handed over |
|---|---|
| [**Transmogrifier**](../../characters/don-hopkins/the-sims-transmogrifier-mod-tools.md) | clone and re-skin any object — the object pipeline, in players' hands |
| [**RugOMatic**](../../characters/will-wright/sources/2004-01-21-rugomatic-tutorial/) | turn your own picture into a rug, and learn the asset path by doing it |
| [**ShowNTell**](../../characters/will-wright/sources/2004-01-08-showntell-activex-preview/) | publish what you made so somebody else could see it |
| **SimShow**, **FaceLift**, **Create-A-Sim** | model yourself, your family, your home |

Don's framing of why that mattered, from his QGCon inclusivity notes: *"Create-a-Sim, SimShow, FaceLift,
and Transmogrifier let players model themselves, families, and homes — personal content for play and
stories"* ([`interview-points.yml`](../../characters/don-hopkins/sources/qgcon-inclusivity-paper/interview-points.yml)).

**So the test for Faceball is not "did a great artist make a great puppet."** It is:

1. **Did a great artist make a seed a twelve-year-old can open, change one number in, and laugh at?**
2. **Is the kit small enough that changing that number is obvious** — which is the
   [Minsky discipline](#the-argument-which-is-minskys) again, from the other end?
3. **Can the kid publish the result** without asking anyone's permission?

Golan wrote the brief himself in 1995 when he said Mouther was good enough for the quality level needed
in children's computer games. Eric spent six years turning animation craft into objects other people
played with. **The kit's job is to make that handoff cheap enough to happen by default** — a construction
set as [artifactory](../../process/artifactory.yml), where the output is more construction sets.

## Expression modes are the interesting axis

A puppet is a portrait plus a *mode* that decides what drives it. The modes are not visual presets,
they are different couplings between a performer and a face:

- **Webcam through the mouth hole** — the default. The driver's real mouth, normalized once and
  warped into whichever preset is active.
- **ECG pose blend** — drag features on the drawing; the solver recovers the blend weights. **The
  showcase mode**, and the one the rest of the kit is built around:
  [the engine section above](#the-engine-is-tom-ngos-ecg), Tom Ngo's ECG by way of Golan Levin's
  Mouther.
- **Amplitude scrub** — audio loudness scrubs a still portrait's mouth. Generalizes past mouths: remap
  any gesture to any audio clip.
- **Canned clip** — a recording plays and the driver lip-syncs to it, drag-queen style.
- **Hand-drawn overlay** — ink and paint on a transparent layer, South Park construction paper.

**Talking selfies** is the application that makes the modes worth having, and the cheapest one to hand
away. Point the kit at any photograph and it becomes a posed talking face — front camera, you in frame
next to the thing you are talking about, one puppet preset per topic, one clip per stop. It respects a
guest's time, because five one-minute selfies beat one three-hour obligation, and it works solo on a
phone, on a desk walkthrough, or live on a button board.

It is also already load-bearing elsewhere in the repo: Don's cats are talking-selfie faceballs, which is
how [Napoleon keeps being a star from the archive](../../characters/don-hopkins/cats.yml) — old photos
become talking cat faces that comment on a segment or read a viewer letter. Honoring someone by
transformation rather than by eulogy needs exactly this feature and nothing more.

**Point it at a photo of your own cat and you have the seed from
[the section above](#seeds-not-showpieces).** That is not a coincidence; it is the test being passed.

Calibrate the operator's webcam **once**, then remap into whichever preset is selected. That
indirection is what makes a button board able to jump between a dozen faces mid-show without
re-tuning.

## Where the rest is written down

The main design stops here on purpose. The elaborations live in their own files so this page stays
about the kit:

| File | What's in it |
|---|---|
| [`inspirations.md`](inspirations.md) | **Full credits.** [Bill Budge](../../characters/bill-budge/README.md)'s [Pinball Construction Set](inspirations.md#bill-budge--pinball-construction-set-1983), [The Incredible Machine and Incredible Toons](inspirations.md#the-incredible-machine-and-incredible-toons--dynamix), [Create-A-Sim](inspirations.md#create-a-sim--the-sims-maxis-2000) and [Maurice](inspirations.md#maurice-the-magnificent--create-a-sim-as-an-agent), the [Spore Creature Creator](inspirations.md#spore-creature-creator-maxis-2008), [LittleBigPlanet](inspirations.md#littlebigplanet--media-molecule), [Genital Jousting](inspirations.md#genital-jousting--free-lives--devolver-digital), and the [in-house lineage](inspirations.md#the-in-house-lineage) (HOMER II, Mona Eyes, ECG, Bounce, SimFaux) |
| [`physics-and-gags.md`](physics-and-gags.md) | The whimsical half — Sanspiel fluids, stage gags, the barf meter, the Faceball machine as a Twitch game, choreography modes, audience-as-balls |
| [`adult-section.md`](adult-section.md) | The opt-in, curtained adult palette: soft-body parts, satirical caricature presets, the Bowie video puppet, pixelated-by-default. Labeled, separate, and not on this page by design. Contains one finding that generalizes well past the palette — **[dancing pixels](adult-section.md#dancing-pixels)**, where a mosaic locked to a deforming mesh becomes the performance, and McCloud's closure predicts the censored cut is the *more* suggestive one |

## Editor and storage

Per-portrait layout is authored in an editor and saved as a preset bundle: portrait asset, expression
mode, mouth-hole polygon, eye pins, fiduciary pins, accessory layovers, look grade, enabled gags. One
bundle per dummy; a button board jumps between them instantly.

The editor as currently specified is a tool palette. **It should probably be an agent instead** —
which is the Maurice argument, made in
[`inspirations.md`](inspirations.md#maurice-the-magnificent--create-a-sim-as-an-agent).

## 2D and 3D parts in one scene, PaRappa style

**Parts are 2D or 3D and the kit does not care which, and they mix freely in the same scene.** The
reference for what that looks like is **[PaRappa the Rapper](https://en.wikipedia.org/wiki/PaRappa_the_Rapper)**
(NanaOn-Sha, 1996 — [Masaya Matsuura](https://en.wikipedia.org/wiki/Masaya_Matsuura), with
[Rodney Alan Greenblat](https://en.wikipedia.org/wiki/Rodney_Alan_Greenblat)'s art): **flat hand-drawn
characters standing in a 3D world.** Paper-thin, and when the camera swings you see it, and it is
*charming* rather than a defect.

**Steal the charm, because it is also the cheap answer to a hard problem.** A flat part costs a drawing;
a 3D part costs a model, a rig, a UV map and someone who knows Blender. If Faceball demanded meshes it
would contradict [seeds, not showpieces](#seeds-not-showpieces) in its very first authoring step — a kid
can draw a part, and cannot model one. **Flat-in-3D is how 3D scenes stay open to people who only draw**,
and PaRappa proved it reads as a style rather than as a limitation.

### The engine was already dimension-agnostic, so this costs nothing

This is not a compatibility layer bolted on afterwards. [ECG](#the-engine-is-tom-ngos-ecg) blends
**coordinates**, and the solver is indifferent to whether a target's coordinates are 2-vectors or
3-vectors — a simplicial complex of examples with barycentric weights is the same mathematics either way.
**Both halves already have existence proofs in this repo, on the same engine:**

| | Proof | Dimensionality |
|---|---|---|
| **2D** | **[Mouther](https://www.flong.com/archive/projects/mouther/index.html)** — [Golan Levin](../../characters/golan-levin/README.md) and Malcolm Slaney's lip-synched cartoon faces on a [viseme sheet](#the-engine-is-tom-ngos-ecg) | 2D outlines and control points |
| **3D** | **[Doppel](https://www.youtube.com/watch?v=6L7jtgRD5rs)** — [Eric Hedman](../../characters/eric-hedman/README.md) on the full [ARKit morph-target set](https://developer.apple.com/documentation/arkit/arfaceanchor/blendshapelocation); and [Tom Ngo](../../characters/tom-ngo/README.md)'s own **[WigFabrik](../../catalogs/soul-city/portals-and-modules.md)**, multitarget mesh plus texture | 3D mesh vertices |

**[ARKit blendshapes](https://developer.apple.com/documentation/arkit/arfaceanchor/blendshapelocation)
are morph targets, and morph targets are [ECG](../../characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md)
targets with a different file extension.** So the same solver drives a cartoon mouth and a photoreal face
rig, and the only thing that changes is the width of the vectors. That convergence is the strongest single
argument for having picked ECG as the engine, and it is exactly the pair brainstorm already seeded as
[`repo-shows/tom-and-golan-ecg-mouther/`](../../repo-shows/tom-and-golan-ecg-mouther/) — to which
[Eric's show](../../repo-shows/eric-hedman/README.md) adds the practitioner's third seat.

The underlying intuition, written up on its own:
[breakfast, the simplex, and barycentric direct manipulation](../../characters/don-hopkins/breakfast-simplex-barycentric-direct-manipulation.md),
and the wider lineage in [`process/trails/direct-manipulation.md`](../../process/trails/direct-manipulation.md).

### 2D first, with hot paths, not 2D as a degraded 3D

Ship 2D first and make it genuinely fast rather than treating it as the fallback it currently is in the
roadmap. **Flat geometry gets to skip most of what makes 3D expensive**, and those savings are the
optimization, not an approximation of one:

| 3D pays for | 2D skips it because |
|---|---|
| Depth buffer and depth sort | Painter's order is an explicit integer per part. Authors *want* to control stacking anyway |
| Perspective divide, 4×4 matrices | 2D affine, six floats, and the whole transform is invertible for free |
| Per-vertex normals, lighting | Flat art is pre-shaded by the person who drew it |
| Full-frame redraw | Dirty rectangles — a jiggling part invalidates its own box and nothing else |
| Large vertex buffers | An ECG target is a few dozen control points, so a blend is a handful of multiply-adds and fits in cache |

**Two 2D backends, because they fail in opposite directions:**

- **SVG** — retained mode. DOM nodes, CSS transforms, crisp at any zoom, hit-testing and accessibility
  for free, and *inspectable in devtools*, which matters for a construction kit whose whole pitch is
  that you can see inside it. Falls over at high node counts.
- **Canvas2D** — immediate mode. No DOM cost, fast with many parts and particles, composites naturally
  beside Sanspiel's fluids. Nothing to inspect and no free hit-testing.
- **WebGPU** — the 3D path and where Sanspiel already lives, so mixed scenes and the heavy passes land
  here.

One part abstraction, three backends, chosen per scene rather than per project. **The renderer is a
[modifier-style plug-in like everything else](adult-section.md#modifiers-are-the-actual-design-idea)**,
which is the consistency test any new subsystem in this kit has to pass.

## Render path

TypeScript and WebGPU in the browser, composited into a single OBS Browser Source, transparent PNG
out. Canvas2D fallback for bring-up. The pipeline is a stack of passes — portrait atlas, mouth mask
and warp, **[ECG solve](#the-engine-is-tom-ngos-ecg)** (the pose-and-shape pass, serving both faces and
parameterized parts), grade, googly-eye compute, particles, physics, composite.

Lineage note: the compositing model comes from
[Porter-Duff in PostScript and then WebGPU](../../characters/don-hopkins/porter-duff-postscript-to-webgpu.md),
and the "send code, not commands" habit comes from NeWS.

## Roadmap

The spec stages it v0 through v5: Canvas2D proof, then the WebGPU compositor and preset hot-swap,
then pose blending and the built-in particle set, then the arena and audience balls, then the barf
meter and the Twitch game, then choreography. Detail in
[the spec's `tech:` section](../../apps/performance-space/faceball-construction-set.yml).

## Consent and care

Self-authored avatars and consenting guests only. A human mouth through a hole, never a voice clone.
Satire aims at power and hypocrisy, never at private people. The governing documents are
[`schemas/portrayal-standards.yml`](../../schemas/portrayal-standards.yml) and
[`puppet-me-consent.yml`](../../characters/don-hopkins/portrayal/puppet-me-consent.yml).

## See also

- [`apps/performance-space/squares-in-a-box.yml`](../../apps/performance-space/squares-in-a-box.yml) — the panel grid this kit fills
- [`apps/performance-space/character-button-board.yml`](../../apps/performance-space/character-button-board.yml) — how the driver jumps between presets
- [`process/artifactory.yml`](../../process/artifactory.yml) — a construction set is an artifact factory; why that is the repo's central metaphor
- [`designs/orchestrator-playsets/`](../orchestrator-playsets/) — advertisement dispatch, the same Sims machinery driving menus
