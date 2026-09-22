# The portrait: a 3D cabinet with live lights, a hot tube, and hands

As long as it runs in the browser, might as well. That flippancy is
load-bearing: every hard problem here was already solved by a seam the
cabinet committed to for other reasons. The portrait is a *consumer* —
it adds **no emulator features**, and nothing in the emulator ever
learns the portrait exists.

| Portrait element | Existing seam it consumes |
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

Portrayal note, repo standard: the avatar is a portrayal of Heinz
Lemke operating his own program, made with his participation — he sent
the 128-page listing this whole machine exists to run. His character
dir is the source of grounding; anything beyond "operator demonstrating
PIXIE" needs his say.

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
