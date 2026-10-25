# The portrait: a 3D cabinet with live lights, a hot tube, and hands

**Try this first: [vitamoo.space](https://vitamoo.space).** It is VitaMoo, character animation from
The Sims 1 running in the browser. It reads the original game's skeleton, mesh and animation
formats (CMX, SKN and CFP), drives the skeletons, deforms the meshes on the GPU, and draws them
with a WebGPU renderer. Click a Sim to select it, and drag to spin it.

The renderer was written for more than characters. Its object picking already tells characters
apart from objects, walls, floors and terrain, and the rest of the stack (display lists, a camera,
per-object picking, GPU mesh caches) is not specific to Sims. It is open source, GPL-3.0, in
[MicropolisCore](https://github.com/SimHacker/MicropolisCore/tree/main/packages/vitamoo), as three
packages: vitamoo (parsers, skeletons, mesh deformation), mooshow (the WebGPU stage) and
vitamoospace (the demo).

So the portrait below is mostly an art production task rather than a programming one. The PDP-7
cabinet, the Type 340, the ASR-33 and Heinz at the console are models and textures for a renderer
that already runs, made from photographs and measurements of real machines, which the
[open letter](FOR-MUSEUMS.md) asks museums for. Some of the simulation exists already: Lars
Brinkhoff's GLSL [crt-simulation](https://github.com/larsbrinkhoff/crt-simulation) models the P7
phosphor. The [AM radio](AM-RADIO.md) is next: a virtual transistor radio set on the cabinet that
picks up the machine as it runs, as hackers' radios did on real PDP-7s, mixed with music made on
purpose, as on MIT's PDP-6 with its speakers and stereo amplifier, through a speaker bit that
Forth can play. The sections below were first sketched around Three.js; VitaMoo's renderer can
host the same views.

## What drives it

A 3D view of the machine, driven by the emulator's existing outputs. It adds no emulator
features; the emulator doesn't know it's there.

| Portrait element | What drives it |
|---|---|
| console lamps | declared registers (AC, PC, MB, MQ, IR, run/defer flags) |
| CRT picture | the segment log — the one stream ([DESIGN](DESIGN.md), Media) |
| ASR-33 chatter | `Teletype.onPrint` |
| light pen | pointer events → the same `LightPen` hit-test |
| avatar's hands | the automation frame's EXPECT/SEND script |
| the face | [reference/iron/](reference/iron/SOURCES.yml), serial 113 |

In [frame-manager](https://github.com/SimHacker/moollm/blob/main/designs/webtop/FRAMES.md)
terms: the portrait is one more view of the same machine, mounted beside
the 2D bench, wrapped by the same frames. Flip a view and the machine
does not notice.

## Lamp physics: duty cycle, not boolean

A browser frame sees ~9,500 emulated instructions. A lamp that renders
`bit ? on : off` at 60Hz strobes garbage. Real console lamps integrated:
a bit that is up 30% of cycles glows at 30%. So the run loop accumulates
per-bit set-counts (one AND and one add per register per step, in the
loop we already run), and the portrait normalizes per frame:
`brightness = count / steps`. The boot loop gets a *signature*, a
pattern of half-lit address bits you can recognize across the room.
PDP-7 operators read their machines that way, and it is the first
falsifiable milestone below.

## The tube: phosphor on curved glass

The 2D bench's phosphor pass already renders the segment stream to a
1024×1024 canvas. The portrait maps that same texture onto a curved
tube face inside a glass shell, with environment reflection, slight
barrel curvature, and the P7 double phosphor: a fast blue flash (what
the pen sees) over slow yellow-green persistence (what the human sees).
Render-to-texture, Three.js, no WASM ([WEB-BENCH](WEB-BENCH.md) rules
hold). The Type 340 was its own cabinet with a round tube; model it
beside the processor, as on Heinz's floor. Pen hits compute in screen
space of the *texture*, so the 3D projection cannot introduce aim
error. The glass is chrome; the hit-test is the plugin's.

**The reflection shot.** A preset camera over Heinz's shoulder, framed on the
tube, with his face reflected in the glass over the picture, as in the photographs
of operators at their tubes. A soft key light on his face from the side away from
the tube keeps the phosphor clear. One keyframable parameter, `reflection` from 0
to 1, fades his face in and out of the glass.

## Slow mode: watch the beam work

For later, but cheap and wonderful: a time-dilation knob on the
cabinet's cycle clock. The 340 is a display *processor* executing words
at documented point-plot speeds, and the phosphor pass renders the
segment stream in order, so at 1/1000 speed you *see* the beam crawl
the display file, each vector sweeping tip-first as a blue flash with
the yellow-green persistence behind it. Nothing is animated; the
emulator is just running slowly while the phosphor decays in real time.
It is the same knob the debugger frame wants for single-step, opened
all the way up.

## The DECtape eyes

Idle animation: the reels spin when the machine runs, stop on HLT.
Free and honest (they are reading `Cabinet.cycles`), and they keep the
face alive. The portrait is of a machine that looks back.

## Heinz at the console

An animated operator showing the *physicality*: leaning to the tube,
arm raised holding the pen against the glass (the posture radial menus
were invented for: gravity and a heavy arm are why the lightbuttons
ring the cross), turning to the ASR-33 to type.

The rig is IK to targets derived from input events, and the causality
runs *through* the hand: each frame, the simulated pen tip projects into
the tube's texture space, and that point is what the `LightPen` plugin
receives. `pen 512,300` moves the IK target, the arm swings, and the
emulator sees wherever the tip actually is *on the way there*. The arm
becomes a physical low-pass filter: PIXIE's incremental tracking loses
the cross when the target moves faster than the arm plausibly swings,
the same failure a heavy human arm produced in 1969, now emergent
instead of scripted.

Keyboard causality is the same: `type "S"` moves the hand to the S key,
and the Teletype receives the byte when the finger lands. The automation
frame's EXPECT/SEND scripts drive one stream through the body, so the
acceptance scripts double as performances. Gestures to reproduce come
straight from the [1969 film](https://www.youtube.com/watch?v=jDrqR9XssJI).

**The hand is a shared handle.** The IK target is one stream, and any
of these can write it:

- **playback**: a recorded target-and-keys log replayed through the
  body. The recording *is* the demo format.
- **puppeteer**: a live driver (an LLM agent, a remote teacher, a
  co-host) writes the target over the same socket [DESIGN](DESIGN.md)
  already plans for examine/deposit/step.
- **grab**: the local pointer seizes the target, an `arm` mode beside
  DESIGN's `honest` and `assist`. Letting go hands it back to the
  script: the run/edit flip from
  [FRAMES](https://github.com/SimHacker/moollm/blob/main/designs/webtop/FRAMES.md).

Every driver funnels through the tip, so no script, agent or human can
issue an input the arm could not physically make.

## ECG drives the body

The body is driven by Tom Ngo's Embedded Constraint Graphics
(Interval Research, patent expired 2016; Don's write-up:
[tom-ngo-embedded-constraint-graphics-at-interval.md](../../characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md)).
Author sim-Heinz's extreme poses once (pen high on the tube, pen low,
turned to the ASR-33, and so on) at the vertices of a simplicial
complex. Any posture is barycentric blend weights over those vertices,
and dragging a feature solves for the weights. ECG generalizes blend
shapes; Ngo built it for direct-manipulation character animation.

The input mapping becomes one chain, every link declared:

    user screen coords (mouse / joystick / touch)
      → dragged constraint on the body
      → ECG solve: blend weights over authored poses
      → pen tip position in tube texture space
      → emulator screen coords (the 340's 1024×1024 grid)
      → LightPen hit-test

Impossible inputs are unrepresentable rather than clamped: the space
contains no pose with the pen inside the cabinet, so no driver can
request one.

**Canned demos drive the pen tip, not the whole body.** A recording is
a tip trajectory plus keystrokes, and ECG fills in the rest of the
body. The same recording plays through a stick figure or a finished
Heinz, and upgrading the body never invalidates a demo. Because many
blend weights put the tip in the same place, slow noise among
alternative whole-body poses gives idle breathing while the tip stays
pinned. The early demo uses a canned whole-body clip, with the tip
stream still the source of truth for the emulator.

The avatar portrays Heinz Lemke operating his own program, made with
his participation: he sent the 128-page listing this whole machine
exists to run. His character dir is the source of grounding; anything
beyond "operator demonstrating PIXIE" needs his say.

## Scene player: bodies, devices and connected time scales

The scene player is a planned extension of the portrait. It follows a
physical action into a detector, through the machine, and back into
visible or audible feedback.

Layer by layer, from the room to the phosphor and back through the pen, with what runs today:
[CAUSE-AND-EFFECT.md](CAUSE-AND-EFFECT.md).

### One history, several views

The player records timestamped input, device and execution events, with
the initial state needed to reproduce them, and declares its clock
domains: human movement, PDP-7 cycles, Type 340 operations and
rendering. Slow motion and event stepping show contact, detection and
instruction timing; fast-forward shows the rhythm of a gesture; scrubbing
uses checkpoints and deterministic replay. Camera movement never advances
the machine, and explanatory views (decoupled time, cutaways, overlays,
reconstructed motion) are labeled as such.

### A camera you can inhabit, steer and record

Views and tours are user-editable, persistent, shareable content, with
their own author, provenance and history. A tour stores camera poses and
lens settings against simulation time, plus time segments, playback
speeds and annotations: a room overview, a glide into the operator's eyes,
the pen contact slowed down, an event followed into the source listing.
The tour track is separate from the machine and performance tracks, so two
people can explore the same recorded history without altering it, and an
article can link to a tour by URL. Anyone can take over a preset tour,
steer, and record their own.

The camera is a six-degree-of-freedom pose with constraints: outside solid
cabinets, aimed at a feature, or attached to the operator's head for a
first-person view, with the screen, hands and occluding pen where the
operator would see them, like switching to first person in GTA.

David Marusek's *The Wedding Album* (1999) is a literary touchstone for
what persists in a recording and who controls it; the
[discussion of the story and digital portrayals](../../characters/david-marusek/the-wedding-album-and-digital-souls.md)
connects it to this project's concerns about consent and attribution.
T. H. Myer and Ivan Sutherland's
[*On the Design of Display Processors* (CACM, 1968)](https://doi.org/10.1145/363347.363368)
describes the wheel of reincarnation, a display channel gaining
capabilities until it becomes another computer
([source notes and PIXIE mapping](../../characters/ivan-sutherland/sources/1968-06-myer-sutherland-design-of-display-processors.md)).
Don's framing is that a view here is another rung of that wheel, gaining
state, timelines and tools of its own, so it should declare its
responsibilities and boundaries rather than grow into a second opaque
application.

### Gesture tells a story

A teacher's hands can describe a surface, compare distances or
distinguish contact from release even when the speech is inaudible.
Signed explanations are authored or reviewed by fluent signers.

Don remembers watching a VHS lecture by Ben Shneiderman about touchscreens
and lift-off selection decades ago. On fast-forward, Ben's expressive gestures
were delightfully funny, and their spatial explanation stayed legible without
the sound. That suggests a player feature: speed up the recorded motion and
let the humor emerge. It works for any recorded speaker.

### From pen contact to executing source

Follow one interaction across scales, pausing at each seam: the pen tip
on the glass as the Type 340 beam reaches it; the phosphor flash
crossing the pen's detection threshold; the event through the cable to
the interface, and the PDP-7's device and interrupt rules; the executed
instructions in core, the disassembly and the scanned lineprinter
listing; then the program's response on the display and the operator's
next move. Every view reads the same event history.

### Touchscreens: the finger is part of the interface

From the user's viewpoint a fingertip hides the target; a side view
shows glass thickness and parallax. Reconstruct HCIL's above-finger or
"pop-up" cursor and lift-off strategy (touch, slide to refine the
cursor, release to commit) beside first-contact selection, and show why
selecting small characters is possible when the cursor, rather than the
area covered by the finger, determines the target. The
[HCIL touchscreen history](https://www.cs.umd.edu/hcil/touchscreens/)
documents the 1988 work and its later high-precision studies; these
demonstrations predate iOS and Android touch text selection. One scene
could portray Ben Shneiderman, Catherine Plaisant and Rich Potter at a
touchscreen IBM PC, made with their guidance.

### Detectors, actuators and the shape of an action

Bill Buxton's *Lexical and Pragmatic Considerations of Input Structures*
([author's publications](https://www.billbuxton.com/papers.html)) is the
conceptual reference: study the physical structure of input and its use in
context, as well as the command eventually delivered. Each device declares
what it senses and drives, with units, thresholds and timing: a pen's
aperture, a key's travel, a knob's detents and end stops, a switch that
latches or springs back. Virtual cabinets may improve on the original
controls, with each departure identified and a documented historical mode
available.

### Engelbart's workstation

Another scene reconstructs Douglas Engelbart's working arrangement: chord
keyset, mouse, keyboard, display, microphone, desk and chair, with
dimensions and posture taken from photographs and film of a specific
demonstration. It shows the hands coordinating, one forming a chord while
the other points with the mouse. NLS behavior needs its own recovered
implementation or demonstration model; the desk portrait alone does not
emulate NLS.

## Cabinets for machines that never had one

The PDP-7 has a face from photographs. Every other engine the cabinet wraps
([ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md)) gets one designed
for it, in the same rule as the PDP-7's: **every lamp, dial and switch is bound to
real state**, through the same seams (declared registers, device properties,
events). Nothing on a panel is decoration that lies. They share a design kit so they
sit together in one room, and each stays recognizably its own machine.

**The shared kit.** A 19-inch rack frame in brushed aluminium with a coloured front,
the DEC way. Bezels, lamp rows, toggle switches and paddle handles come from one
parts library, in each machine's own colour. Lamps use the duty-cycle physics above,
so a busy register glows instead of strobing. Each machine has a nameplate with its
inventor's name and year, set in a typeface of its period. Each cabinet is a glTF
`model` in a library cartridge ([CARTRIDGES.md §6a](CARTRIDGES.md#6a-scenes-the-machine-the-room-and-the-people-at-it)),
and its panel bindings live in the `scene`.

### CAM-6: the cellular automaton machine

The real board was a bare card in a PC slot. Low and wide, in black anodised aluminium, like late-80s lab gear. A square raster
monitor on top shows the planes. The front panel is the machine's structure:

- **Four plane lamps**, 0–3, each a 16×16 window onto its plane, live.
- **The neighbourhood selector**, a rotary switch with engraved positions: Moore, von
  Neumann, Margolus. In Margolus the panel's grid lamps show the 2×2 block
  partition flipping phase each step.
- **The lookup table** as a lamp matrix, lit by entry as the rule is used: you watch
  which entries a rule actually touches.
- **RUN, STEP, BACK.** BACK is lit only for reversible rules (Critters), and steps
  backward.
- A steps-per-second dial, needle and all, and a generation counter on Nixies.

### Micropolis: the city computer

A slanted light table in walnut and
cream enamel carries the city map, top-down. Around it, a panel row of dials:

- **Tax rate, funding levels** for roads, police and fire, as knobs. Turning one is
  the `poke`; the needle follows when the simulation changes it back.
- **R C I** as three tall analogue meters, the demand bars as needles.
- **The date** on a split-flap display; **funds** on a mechanical counter that
  clicks.
- **Disaster switches** under hinged, red, guarded covers, each a toggle that
  needs the cover lifted first.
- An evaluation printer that prints the yearly newspaper on a paper roll.

### Turing machine, and Minsky's universal machine

A long glass-fronted case with the tape running past a
read/write head on rollers, cells as flip tiles that turn to show their symbol. The
head carriage moves; the tape doesn't jump. Above the head, a **state drum** turns to
the current state's name. Beside it, the **transition table** as a pegboard: one peg
lights per step, the rule being applied.

Minsky's universal machine gets the same case in a second colour, and a second,
smaller tape inside the window: the machine being simulated, encoded on the big
tape, with the decoded state shown on its own little drum. Two levels of machine,
both visible. A brass plate on it: *7 states, 4 symbols, 1962*.

The machine behind the glass is the Turing engine
([TURING-ENGINE.md](TURING-ENGINE.md)): `TuringCpu` when the case is the whole
cabinet, device 54 when it sits beside a PDP-7. The panel binds to its control block in core:
the drum to STATE, the head carriage to HEAD and ORIGIN, the pegboard to the table entry at
`TABLE + state × NSYM + symbol`.

### Minsky's Ultimate Machine

Marvin Minsky's 1952 design, which Claude Shannon built at Bell Labs: a box with one switch.
Switch it on, the lid opens, a hand comes out, switches it off, and goes back in. Arthur C.
Clarke called it unspeakably sinister.

In the cabinet it is device 56, [ultimate.ts](src/plugins/ultimate.ts): a state machine with
eight phases, OFF, WAIT, OPEN, REACH, PRESS, RETURN, CLOSE and REST. The lid and the arm each
move from 0 to 1000. The phase, the lid and the arm are registers a program reads (UMRP, UMRL,
UMRA), so anything that draws the box follows the device. Each phase after OFF has its own
length in backplane steps, loaded with UMLT; the defaults are `UM_DEFAULT_TIMING`.

The switch-off has two handlers:

- **Hardware**, the default. When the arm reaches full travel, the finger flips the lever off,
  holds it down through PRESS (the lever can't be switched on meanwhile), and the arm and the lid
  go home.
- **Software**, manual press mode, set with UMLT. The arm reaches the lever and waits there
  without moving it. Whatever switches the lever off next, a program issuing UMOF, makes that the
  hand's press, and PRESS, RETURN, CLOSE and REST follow as usual. ULTIMATE HAND works this way:
  your tracked fingertip touching the switch is the press. A program can also give up with
  UMLT's retract bit, and the arm and the lid go home from wherever they are.

Switching the lever off yourself before the arm is all the way out is an abort: the hand turns
back from where it is. Switching it on while the hand is going home turns it round. The device
counts the hand's presses (UMRC reads them) and the aborts, and every phase change raises a flag
that can interrupt the PDP-7 (UMSI, UMIE).

Power is the lever or the mechanism away from home, as on the real box, where a limit switch
keeps the motor running until the arm is back and the lid shut. The lever, the counters and the
registers answer even with the power off. Through device 55 the lever can be bound to another
switch in the cabinet, so the hand can reach out and turn off something else.

[ultimate.fs](tapes/pdp7forth/ultimate.fs) draws the box on the 340 with the light pen on its
switch: touch it to switch the machine on, or to switch it off before the hand gets there
([live](https://hyperties.org/cabinet/ultimate/)).
[ultimate-hand.fs](tapes/pdp7forth/ultimate-hand.fs) makes your webcam hand the machine's hand
([live](https://hyperties.org/cabinet/ultimate-hand/)). Being the smallest complete device, it
also tests the power-switch contract below. It belongs beside the repo's
[Ultimate Machine bot](../../repo-shows/will-wright-premiere/audience/bot-ultimate-machine/CHARACTER.yml),
the gong that switches off the stream ([TURING-ENGINE.md](TURING-ENGINE.md#the-ultimate-machine)).

### Movable Feast Machine: tiles, not a cabinet

Ackley's machine is tiles and grows by adding them, so instead of a box it's blinking-light
Borg Lego: square tiles that snap together edge to edge, modelled on his real
[T2 tiles](https://t2tile.com/), each with its own small screen of sites and LEDs pulsing out of
step with the others. Drag a tile in to grow the machine; pull one out and the computation routes
around the hole. The engine is Andrew Walpole's
[MFM-JS](https://github.com/walpolea/MFM-JS) ([mfm.rocks](https://mfm.rocks/)), wrapped as a
cabinet, with one model tile per simulated tile.

### von Neumann's 29-state CA: the universal constructor

The display is a railway station departures board. Each cell is a split-flap unit, the kind
Solari of Udine made for stations and airports, whose flaps carry the 29 states as icons
instead of letters. When a cell changes state its flaps clatter round to the new icon, so you
can hear the constructor's arm extend across the board. This is a specialisation of the tile engine
([DESIGN.md](DESIGN.md#tiles-are-subroutines-drawn-by-the-forth-turtle)): a tile per state, as
photographic renders of real flaps, and a transition that is the flap animation.

The board sits in a tall 1950s frame of grey crackle paint and chrome, IAS-machine style,
with a station clock above it showing the generation count. The panel has:

- **A state legend** of 29 coloured lamps, each lit in proportion to how many cells are in
  that state.
- **The construction arm's position** on an X/Y pair of meters.
- **The description tape** read-out, scrolling, the copy's blueprint.
- When the copy completes, a second, identical cabinet model appears beside the
  first.

### Power switches

Every device has one: a real toggle or rocker in its own cabinet's style, with a pilot lamp, bound
to the device's power state. Off means the device does nothing on the clock, raises no
interrupts and answers no requests, and its displays go dark the way their phosphor or lamps
would. Turning a device on resets it. A whole cabinet has a master switch that powers its devices
up in order.

### Shared devices

Light pens, mice, joysticks, keyboards, buttons and paddles, round vector tubes and
raster monitors are one model each, in the kit's materials, re-coloured per machine.
The input devices are the virtual ones the emulated machine sees. A real mouse, a
touch or a demo session moves them, and the scene shows the device moving.

**Milestone for each:** every control on the panel is bound to real state and
moves when the engine does, checked by driving the engine headless and comparing the
panel's readings with its state.

## Falsifiable milestones, in the pretty-pass lane

Portrait work is never a blocker on the rungs in
[DESIGN.md](DESIGN.md); it rides behind them:

1. **Lamps:** the SYMELEC boot's duty-cycle signature on the address
   and AC rows: recognizable, reproducible, diffable as numbers.
2. **Tube:** the IDLA picture matches the 2D bench pixel-for-pixel
   *before* curvature is applied (same texture, so this is a seam
   check, not a hope).
3. **Hands:** the avatar types a character; the echo comes back
   through the emulated Teletype and prints on the modeled ASR-33.
4. **Pen:** the tip's projected point stops the display, the tracking
   cross settles under it, radial lightbuttons appear: the film frame,
   in the round. Yank the script target across the tube and the cross
   is lost, honestly.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [WEB-BENCH](WEB-BENCH.md)
