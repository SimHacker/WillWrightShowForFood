# Body Electric / Bounce — the VR stack that was heart, brain, and nervous system

*Don's firsthand account of the **Body Electric / Bounce** real-time visual-programming VR stack —
the groove, the wires, and the architecture. Told partly out of Don's long, wonderful conversations
with **[Jaron Lanier](../jaron-lanier/README.md)** (VPL co-founder & Body Electric visionary — its
**lead designer/programmer was Chuck Blanchard**) and **[David Levitt](../david-levitt/README.md)**
(created Hookup at MIT; built Bounce as a derivative of Body Electric). Firsthand recollection; a warm
salute, not a spec.*
[Portrayal standards](../../schemas/portrayal-standards.yml) ·
Trail: [visual-programming-patch-cord](../../process/trails/visual-programming-patch-cord.md)

**Eric Hosick VPL collection** — "All the Widgets for VPLs" (2014): [`sources/2014-vpl-snapshots-eric-hosick-thread.md`](sources/2014-vpl-snapshots-eric-hosick-thread.md)

**Chuck Blanchard screenshots** (Feb 2020): [`../chuck-blanchard/media/body-electric/`](../chuck-blanchard/media/body-electric/)

This was the **grooviest groove** I have ever gotten into — the flow of programming and exploring
interactive-simulation possibility space in real time, **while it was running.** You'd reach into a
live system, re-patch it, and it just kept going — acting weird when there were live bugs, but never
stopping. **Live-coding mode** before the phrase existed: performing brain surgery on a running
simulation, patching in new behavior while the video played and the world responded.

The demo content was gloriously irreverent — live-editing simulated characters (including caricatures
of public figures like **Rush Limbaugh** and **Jesse Jackson**: their "brains, DNA, and memories" as tweakable structured simulation parameters and dialog trees) **in real time while the simulation ran**, the video played, and **closed captions matched patterns in JSON-like configuration data** — all read through COM component modules and flowing on the wires.

## The architecture: one real-time hub

Body Electric / Bounce was the **heart, brain, and nervous system** of the Body Electric VR stack —
the **Atlanta, GA hub** where everything met and was orchestrated in real time from one running,
editable patch:

- **Inputs, all live:** MIDI, Ethernet, **Polhemus** trackers, **DataGlove**, VR headsets, and the
**Convolvotron** (real-time 3D spatialized audio). One nervous system, many senses.
- **The skeleton as a data type — Swivel 3D.** The articulated body was an **integrated 3D
transform-tree data type**: literally **Swivel 3D save files** — a hierarchy of joints/transforms —
whose parameters were **projected in real time** by the running patch. The save file *was* the
skeleton; Bounce animated its parameters. Jaron (2020): Swivel 3D was **written in FORTH** by
"young Harvill" — hard to scale; namespace ran out → lost to other modelers.
→ [`sources/2020-06-swivel3d-forth-jaron.md`](sources/2020-06-swivel3d-forth-jaron.md)
- **Stereo out over UDP.** **UDP packet modules** streamed the projected transform parameters to
**two SGI renderers at once — one per eye**, each with a **different perspective**. That's the
stereo VR view: the patch computes, the packets fly, both eyes render.

So the shape of it: **sensors → live patch (projecting the Swivel 3D transform tree) → UDP →
dual-SGI stereo render**, all re-editable while running.

## The wires: passing whole objects, typed and colored

Here's the design jewel — and the reason it maps straight onto everything I've built since.

Bounce modules had a hard limit: **max 6 parameters for nested modules.** You'd blow past that fast in
a real patch. The fix was beautiful: **COM component modules that read COM "jsonic" datatypes —
JSON-like structured objects** — and put them on **specially colored, typed wires** into the dataflow
simulation. Instead of fanning out six loose scalars, you passed a **whole object as one thing** down
a single typed wire.

That's **passing a whole structured object by reference through one connection** — the visual-dataflow
cousin of "streams of streams / a file description through a file descriptor"
([streams-of-streams / zero-copy](streams-of-streams-fd-passing-zero-copy.md)). And it's the direct
ancestor of the **Pantomime JSON object system** David and I built later, which became **Don's
JSON/YAML config system → MOOLLM** ("[slots all the way down](../david-rosenthal/slots-all-the-way-down.md)"). Typed colored wires carrying reflective JSON-ish objects, in ~1990s Bounce at Interval Research.

**How we got COM on the Mac:** we adapted an early **ATL (ActiveX Template Library)** to work with
**Metrowerks CodeWarrior** (Microsoft was bringing **Internet Explorer 6** to the Mac and needed COM;
Metrowerks added pragmas so C++ vtables matched COM's layout). That let us define **COM interfaces**
for Bounce plug-in modules — and those modules introduced **IMOADict / IMOAArray**-style tree-structured
types (polymorphic dict/array/int/boolean — we pre-invented JSON), with readers/writers/indexers on
**colored typed wires**. Build a model of the world, run the simulation, pass **object references** between
modules instead of fanning out six scalars. Jaron and I argued whether Swivel3D alone was general enough
or you needed a non-visual config language; his answer — **make objects visible** — is the design jewel.

## Why it still matters

- **Live coding a running world** — edit-while-running as the *normal* way to explore, not a party
trick. The target feel for any Bounce reincarnation.
- **The model is a data type** — Swivel 3D transform tree as a first-class, projectable value. Rig as
data, animation as parameter projection.
- **Whole objects on typed wires** — beat the arity limit by passing structured, self-describing
objects; the seed of Pantomime JSON → MOOLLM.
- **One hub, many devices** — a single real-time nervous system fusing MIDI/Ethernet/Polhemus/glove/
headset/Convolvotron; the patch is the conductor.



## Salute → Rebounce

This is exactly what the **[Rebounce](../../repo-shows/rebounce/README.md)** homage is for: check in the
old source, and invite everyone — with **David** and **Jaron** seeding the discussion — to rewrite it
by hand and with AI, competing and cooperating, chasing that same groove in a modern (TypeScript/web)
stack. Bounce is also the **patch-cord half** of the
[Snap! visual-engines vision](snap-visual-engines-fundable-goals.md) (blocks author rules; patch-cords
wire live streams).

## Sources & to-verify

- **Credit where due — Chuck Blanchard.** Body Electric's lead designer/programmer was **Chuck
Blanchard**, not Jaron. Per the **1999 Jaron↔Don email** (in bounce-notes.txt): "Chuck Blanchard
wasn't credited as the lead designer/programmer of BE/Bounce when David brought the program to
Interval. Chuck's name was reduced in stature…" Jaron founded VPL and drove the vision; Chuck wrote
the custom tools (e.g. the Swivel 3D transform-tree editor). *(To do: a `chuck-blanchard/` character.)*
- Don's Bounce writeup: [Medium — *Bounce Stuff](https://medium.com/@donhopkins/bounce-stuff-8310551a96e3)* ·
[c2: BounceLanguage](https://wiki.c2.com/?BounceLanguage) ·
[bounce-notes.txt (LEV list 2000; 1999 Jaron thread)](https://www.donhopkins.com/home/archive/visual-programming/bounce-notes.txt)
- Neighbors: [Levity / Bounce / Space Seed](levity-bounce-space-seed.md) ·
[David Levitt](../david-levitt/README.md) · [Jaron Lanier](../jaron-lanier/README.md) ·
[visual-programming taxonomy](visual-programming-taxonomy.md)
- To confirm before citing as fact: exact SGI models, Convolvotron/Polhemus/DataGlove config, the
"Atlanta hub" installation details, and dates. This is Don's recollection — verify specifics with
Jaron and David on the show.

*Status: firsthand oral history — vivid and true to Don's memory; treat hardware specifics and dates
as pointers to confirm on air.*