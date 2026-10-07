# The portrait: a 3D cabinet with live lights, a hot tube, and hands

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

## Lamp physics — duty cycle, not boolean

A browser frame sees ~9,500 emulated instructions. A lamp that renders
`bit ? on : off` at 60Hz strobes garbage. Real console lamps integrated:
a bit that is up 30% of cycles glows at 30%. So the run loop accumulates
per-bit set-counts (one AND and one add per register per step, in the
loop we already run), and the portrait normalizes per frame:
`brightness = count / steps`. The boot loop gets a *signature* — a
pattern of half-lit address bits you can recognize across the room,
which is precisely the skill every PDP-7 operator had and the first
falsifiable milestone below.

## The tube — phosphor on curved glass

The 2D bench's phosphor pass already renders the segment stream to a
1024×1024 canvas. The portrait maps that same texture onto a curved
tube face inside a glass shell: environment reflection on the glass,
slight barrel curvature, P7 double phosphor — fast blue flash (what the
pen sees, already the pen rule) over slow yellow-green persistence
(what the human sees). Render-to-texture, Three.js, no WASM
([WEB-BENCH](WEB-BENCH.md) rules hold). The Type 340 was its own
cabinet with a round tube; model it beside the processor, as on
Heinz's floor. Pen hits compute in screen space of the *texture*, so
the 3D projection cannot introduce aim error — the glass is chrome,
the hit-test is the plugin's.

**The reflection shot.** A preset camera over Heinz's shoulder, framed on the
tube, with his face reflected in the glass over the picture. Lighting is arranged for the
shot: a soft key on his face from the side away from the tube, so it shows in the
reflection without washing out the phosphor, and a rim light behind him for a halo
edge. One parameter, `reflection` from 0 to 1, fades his face in and out. At 0 the glass
reflection is off and the picture is at full sharpness and contrast; at 1 his face sits
in the glass over the vectors, as in the photographs of operators at their tubes. The
camera and the fade can be keyframed, so a demo can hold on the drawing, fade up to
his face as he works, and fade back to the graphics.

## Slow mode — watch the beam work

For later, but cheap and wonderful: a time-dilation knob on the
cabinet's cycle clock. The 340 is a display *processor* executing words
at documented point-plot speeds, and the phosphor pass renders the
segment stream in order — so at 1/1000 speed you *see* the beam crawl
the display file: each vector sweeping tip-first as a blue flash, the
yellow-green persistence blooming behind it, the whole picture being
argued into existence stroke by stroke, sixty times a second collapsed
into a minute. Nothing is animated; the emulator is just running slowly
while the phosphor decays in real time. It is the same knob the
debugger frame wants for single-step, opened all the way up. The demo
teaches the architecture by itself: you watch the tracking cross get
redrawn every frame and understand refresh displays forever.

## The DECtape eyes

Idle animation: the reels spin when the machine runs, stop on HLT.
Free, honest (they are reading `Cabinet.cycles`), and it keeps the
face alive — the portrait is of a machine that looks back.

## Heinz — the avatar with honest hands

An animated operator showing the *physicality*: leaning to the tube,
arm raised holding the pen against the glass (the posture radial menus
were invented for — gravity and a heavy arm are why the lightbuttons
ring the cross), turning to the ASR-33 to type.

The rig is IK to targets derived from **input events, not canned
animation** — and the causality runs *through* the hand, not alongside
it. **The simulated pen in sim-Heinz's hand drives the lightpen
emulator:** each frame, the pen tip's position projects into the tube's
texture space and that point is what the `LightPen` plugin receives.
`pen 512,300` does not feed the emulator and gesture the arm as two
effects of one command — it moves the IK target, the arm swings, and
the emulator sees wherever the tip actually is *on the way there*.

That makes the arm a physical low-pass filter on pen input, and buys
period honesty for free: PIXIE's incremental tracking loses the cross
when the target moves faster than the arm plausibly swings — the same
failure a heavy human arm produced in 1969, now emergent instead of
scripted. The radial lightbuttons justify themselves in the same
breath: commands ring the cross because the arm holding a pen against
glass wants short strokes, and our arm *has* that cost model.

Keyboard causality is the same: `type "S"` moves the hand to the S key,
and the Teletype receives the byte when the finger lands, not when the
script line executes. The automation frame's EXPECT/SEND scripts drive
one stream through the body, so the hands and the inputs cannot
disagree — the acceptance scripts become performances; the demo is the
test suite, embodied. Gestures to reproduce come straight from the
[1969 film](https://www.youtube.com/watch?v=jDrqR9XssJI).

**The hand is a shared handle.** The IK target is one stream, and it
does not care who writes it:

- **playback** — a recorded target-and-keys log replayed through the
  body. The recording *is* the demo format: small, diffable, and
  honest, because replay goes through the same arm into the same
  emulator, never around them.
- **puppeteer** — a live driver writes the target remotely, over the
  same socket [DESIGN](DESIGN.md) already plans for examine/deposit/
  step. Sim-Heinz becomes a hand you can lend: an LLM agent, a remote
  teacher, a co-host on the show.
- **grab** — the local pointer seizes the target directly: take his
  hand and move the pen around, an `arm` mode beside DESIGN's `honest`
  and `assist`. Grabbing mid-demo is just seizing the stream; letting
  go hands it back to the script. That takeover — watch it run, reach
  in, resume — is the run/edit flip from
  [FRAMES](https://github.com/SimHacker/moollm/blob/main/designs/webtop/FRAMES.md),
  performed with a wrist.

Every driver funnels through the tip, so nothing — script, agent, or
human — can issue an input the arm could not physically make.

## ECG drives the body

"Could not physically make" needs an implementation, and it exists:
**Tom Ngo's Embedded Constraint Graphics** (Interval Research, patent
expired 2016 — Don's write-up:
[tom-ngo-embedded-constraint-graphics-at-interval.md](../../characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md)).
Author sim-Heinz's extreme poses once — pen high on the tube, pen low,
leaning in, turned to the ASR-33, hand at each keyboard corner — and
put them at the vertices of a simplicial complex. Any posture is
barycentric blend weights over those vertices; **direct manipulation is
the constraint solve**: drag a feature and the system solves for the
weights. This is blend shapes, everyone's intuition already; ECG is
the general rig, and Ngo built it for exactly this — direct-manipulation
character animation.

That replaces raw IK with a body that cannot leave its manifold. The
input mapping becomes one chain, every link declared:

    user screen coords (mouse / joystick / touch)
      → dragged constraint on the body
      → ECG solve: blend weights over authored poses
      → pen tip position in tube texture space
      → emulator screen coords (the 340's 1024×1024 grid)
      → LightPen hit-test

Mouse and joystick differ only at the first link — position versus
rate — because everything after the dragged constraint is the same
solve. Impossible inputs are unrepresentable rather than clamped: the
space contains no pose with the pen inside the cabinet, so no driver
(script, puppeteer, or grab) can request one. A demo recording gets
smaller and more legible too — a weight-vector timeline over named
poses instead of a joint-angle soup, which is the same inspect-and-edit
property the glyph work borrows from ECG one repo over.

**Canned demos drive the pen tip, not the whole body.** A recording is
a tip trajectory plus keystrokes — the emulator-facing stream and
nothing else — and ECG interpolates the rest of the body from that one
dragged constraint. So the demo format is rig-independent: the same
recording plays through a stick figure or a finished Heinz, and
upgrading the body never invalidates a demo, because the body was
never in the file.

**Breathing.** The solve is underdetermined — many blend weights put
the tip in the same place — and that slack is where life goes. Keep a
few alternative whole-body targets consistent with the current tip
constraint (weight on the left foot or the right, leaning more or
less) and blend among them with slow noise. The tip stays pinned to
what the emulator needs; everything the constraint does not nail down
drifts, shifts, settles. Idle is not an animation clip, it is noise in
the null space of the task.

Staging is unembarrassed about rungs: the **early demo uses canned
whole-body animation** — a hand-authored clip that looks right and
proves the scene, with the tip stream still the source of truth for
the emulator. ECG replaces the clip when the pose vertices are
authored; the recordings carry over untouched.

Portrayal note, repo standard: the avatar is a portrayal of Heinz
Lemke operating his own program, made with his participation — he sent
the 128-page listing this whole machine exists to run. His character
dir is the source of grounding; anything beyond "operator demonstrating
PIXIE" needs his say.

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

### Movable Feast Machine: tiles, not a cabinet

Ackley's machine is tiles and grows by adding them, so instead of a box it's blinking-light
Borg Lego: square tiles that snap together edge to edge into whatever shape you build, modelled
on his real [T2 tiles](https://t2tile.com/). Each tile has its own small screen of sites and its
own LEDs, pulsing at its own rate, out of step with the others. Drag a tile in to grow the
machine, pull one out and the computation routes around the hole. No master switch; each tile has
its own small rocker. The engine is Andrew Walpole's
[MFM-JS](https://github.com/walpolea/MFM-JS) ([mfm.rocks](https://mfm.rocks/)), wrapped as a
cabinet, with one model tile per simulated tile.

### von Neumann's 29-state CA: the universal constructor

The display is a railway station departures board. Each cell is a split-flap unit, the kind
Solari of Udine made for stations and airports, whose flaps carry the 29 states as icons
instead of letters:

- ground (blank);
- the sensitised and transitional states;
- ordinary and special transmission arrows in four directions, single and double-headed;
- confluent cells;
- each of those both quiescent and excited.

When a cell changes state its flaps clatter round to the new icon, so the constructor's
arm extends across the board with that sound, and you can hear construction happening.

This is a specialisation of the tile engine
([DESIGN.md](DESIGN.md#tiles-are-subroutines-drawn-by-the-forth-turtle)): a tile per state, as
high-resolution photographic renders of real flaps (painted enamel, a little wear, the hinge
line), and a transition that is the flap animation, not a cut. A state change that skips several
flaps cycles through the ones in between, as the mechanism would.

The board sits in a tall 1950s frame of grey crackle paint and chrome, IAS-machine style,
with a station clock above it showing the generation count. The panel has:

- **A state legend** of 29 coloured lamps: ground, sensitised, confluent,
  ordinary and special transmission in four directions. Each lamp lights in proportion to how
  many cells are in that state.
- **The construction arm's position** on an X/Y pair of meters.
- **The description tape** read-out, scrolling, the copy's blueprint.
- When the copy completes, a second, identical cabinet model appears beside the
  first.

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
   and AC rows — recognizable, reproducible, diffable as numbers.
2. **Tube:** the IDLA picture matches the 2D bench pixel-for-pixel
   *before* curvature is applied (same texture, so this is a seam
   check, not a hope).
3. **Hands:** the avatar types a character; the echo comes back
   through the emulated Teletype and prints on the modeled ASR-33.
4. **Pen:** the tip's projected point stops the display, the tracking
   cross settles under it, radial lightbuttons appear — the film frame,
   in the round. Yank the script target across the tube and the cross
   is lost, honestly.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [WEB-BENCH](WEB-BENCH.md)
