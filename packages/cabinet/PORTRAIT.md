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

## Scene player: bodies, devices and connected time scales

This is a proposed extension of the portrait, not implemented playback functionality.
The scene player is a **causal microscope** as well as a performance player:
how, when, where, what and who belong in one explanation. It should let someone
follow a physical action into a detector, through the machine, and back into
visible or audible feedback.

### One history, several views

Record timestamped input, device and execution events, with initial state and
the configuration needed to reproduce them. Declare the clock domains and
their relationships: human movement, PDP-7 cycles, Type 340 operations and
physical rendering. Camera movement does not advance or modify the machine.

| Playback control | What it reveals |
|---|---|
| Normal speed | The operator's explanation and the working interaction |
| Slow motion and event stepping | Contact, detection, feedback and instruction timing |
| Fast-forward | The rhythm and emphasis of the same gesture sequence |
| Scrub, loop and bookmarks | Revisit a motion, selection or interrupt |
| Camera presets and continuous zoom | Move between the room, shared work surface, hand, detector and source |

Scrubbing requires checkpoints and deterministic replay, not merely seeking
an animation clip. Replay must include the input events that change the guest.
Physical models must advance from the declared simulation time: slowing the
processor while leaving phosphor decay on wall-clock time changes the behavior.
An intentionally decoupled explanatory view may be useful, but label it.
Audio needs its own stated policy under time dilation: mute, slow, preserve
speech pitch, or sonify events. It must not silently imply normal-time sound.

### A camera you can inhabit, steer and record

**Thesis: user-editable views and perspectives are first-class, persistent,
shareable content.** They are precious authored material, not disposable UI
state or a director's private settings. What someone chooses to show, from
where, at which scale, in what order and at what speed can carry an explanation
as surely as prose does.

Give a perspective its own identity, title, author, provenance and revision
history. Save, reopen, duplicate, edit, compare, annotate, link and share it.
An article can embed a view or tour; another author can build a different
interpretation of the same scene without copying the machine or overwriting
the first author's work. Preserve dependencies on the scene and event history,
and report missing or incompatible versions explicitly.

This extends the preservation mission to the learner's contribution: the
historical artifact is one kind of content, and a carefully composed way of
understanding it is another. A URL should be able to address that authored
perspective, not merely launch the default camera.

**Literary touchstone: David Marusek's *The Wedding Album* (1999).**
Its preserved simulations invite us to think about recordings as more than
passive keepsakes: what persists, who controls it, and what happens when its
format, context or owner changes. The
[discussion of the story and digital portrayals](../../characters/david-marusek/the-wedding-album-and-digital-souls.md)
connects that fiction to this project's concerns about consent, attribution
and the treatment of representations of people. It is an inspiration and an
ethical provocation, not evidence that our recorded views or avatars are
conscious people. Keeping a perspective must not erase the rights of the
people portrayed within it.

**Architectural touchstone: Myer and Sutherland's wheel of reincarnation.**
T. H. Myer and Ivan Sutherland's
[*On the Design of Display Processors* (CACM, 1968)](https://doi.org/10.1145/363347.363368)
describes how added capabilities turn a display channel into another computer,
which can acquire its own subsidiary processor. Our Type 340 already gives
that history a concrete footing; see the
[paper's source notes and PIXIE mapping](../../characters/ivan-sutherland/sources/1968-06-myer-sutherland-design-of-display-processors.md).
Don's framing is that we are building another rung of that wheel: a view
begins as output, then gains persistent state, editable programs and timelines,
interaction and tools of its own. That is an architectural analogy, not the
original paper's claim about this player. The lesson includes their warning:
declare responsibilities and boundaries rather than accidentally growing a
second opaque application inside the first.

The connection is an analogy grounded in those distinct subjects: Myer and
Sutherland describe a display channel becoming a computer; Marusek explores
a recording experienced as a world from within. Here, a preserved view becomes
an editable, executable perspective with state, a timeline and tools. That
does not make an avatar conscious, nor make the novella a hardware-design theory.

**Another rung of the wheel need not mean starting preservation over.**
Open representations, explicit dependencies, provenance and reusable execution
tools should let authored perspectives survive platform changes. The technical
history guides our architecture; the fiction reminds us that control over a
representation does not settle our responsibilities toward the people portrayed.

Offer a **first-person view from the character's eyes**, with the screen,
hands and occluding finger or pen where the operator would actually see them.
Like switching to first person in GTA, the viewpoint changes how the same
scene is understood; it does not replace the scene or restart the machine.
Let the learner switch or glide to over-the-shoulder, collaborator, room,
screen-side, detector close-up and other useful, playful or revealing views.

The camera is a directly manipulable **six-degree-of-freedom pose**: three
translation axes and three rotation axes, with field of view and focus as
additional parameters. Model a navigable, constrained parameter space, not
just a list of fixed shots. Constraints can keep a view outside solid cabinets,
within the room, aimed at a selected feature, or attached to an operator's
head. An explicitly labeled cutaway mode may cross surfaces to inspect a
mechanism; ordinary navigation should not silently put the camera inside it.

Allow orbit, pan, dolly and free flight, with inspectable anchors and
constraints. Smooth transitions should follow a collision-aware path and
interpolate orientation without abrupt flips; instant cuts and reduced-motion
alternatives remain available. Eye attachment is not eye tracking, and the
camera's look direction is not evidence of the historical person's gaze.
Head motion can be stabilized for comfortable viewing without changing the
recorded body performance.

**Record your own way through the explanation.** A view track stores camera
poses, anchors, constraints and lens settings against simulation timestamps.
A tour also selects time segments, playback scales, loops, annotations and
view transitions. Someone can record a room overview, glide into the operator's
eyes, slow the pen contact, follow an event into the source listing, then
return to the room at normal speed. These are editable, reusable perspectives,
not flattened videos.

Keep the camera/tour track separate from the machine and performance tracks.
Two people can explore different views and time scales of the same recorded
history without altering it. Store units, coordinate frames, stable object
identifiers and scene/recording versions so a saved view can resolve its
anchors or report that they are missing, rather than silently point somewhere
else. Simulation time and presentation time have an explicit mapping, including
paused intervals and speed changes; a saved tour must reproduce that mapping.

This is another interface to agency: take over a preset tour, directly steer
the camera, change the time scale, record the result and share the explanation
you found. The player should expose those operations to people, not reserve
them for an automated director.

### Gesture tells a story

Body language includes posture, gaze, pointing, emphasis and turn-taking.
A teacher's hands can describe a surface, compare distances or distinguish
contact from release even when the speech is inaudible. Signed languages are
languages, not generic gestures: any signed explanation needs fluent authors
or reviewers, its own linguistic timing, and a camera that keeps hands, face
and relevant body movement visible. Do not generate purported translations
by assigning arbitrary gestures to words.

Don remembers watching a VHS lecture by Ben Shneiderman about touchscreens
and lift-off selection decades ago. Fast-forward made Ben's vigorous,
expressive gestures delightfully funny while their spatial explanation remained
legible without words. That suggests a player feature, not a fabricated
performance: accelerate the actual motion and let the humor emerge. Other
characters can reveal the same effect. Do not script exaggerated flailing or
present a reconstruction as documentary footage. This anecdote belongs here,
not in the direct welcome note to Ben.

Existing lecture videos, including material on YouTube or in an author's
collection, could guide video-derived pose recovery with appropriate permission
and provenance. Occluded fingers and depth are uncertain; recovered motion
needs review, and reconstructed segments must be identified. A device-input
trajectory alone cannot recover a speaker's expressive body language: retain
a separate, synchronized performance track without letting it bypass the
physical input chain.

### From pen contact to executing source

Follow one interaction across scales, with cameras able to pause at each seam:

1. Establish the operator, stance, screen size and tilt, and the shared workspace.
2. Zoom to the pen tip against the glass. Show the Type 340 beam reaching the
   location, and the modeled emission, spread, color, intensity and persistence
   of the phosphor. Separate measured properties from artistic approximations.
3. Expose the pen's sensing region and the light that crosses its detection
   threshold. The human-visible afterglow and the detector's response need not
   be the same; use the documented spectral and temporal model.
4. Trace the detected event through the pen cable to the interface. Signal-flow
   highlights are explanatory overlays, not literal light traveling down a wire.
   Only simulate propagation delays for which we have evidence or a labeled model.
5. Show device status, any interrupt request, and the boundary at which the PDP-7
   recognizes it, according to the actual device, enable and CPU rules. Do not
   assume every pen event directly interrupts the CPU or is serviced on the next cycle.
6. Follow the executed instructions through core addresses, disassembly,
   recovered assembly and the scanned lineprinter listing. Highlight the source
   already printed on that historical paper; it is not live printer output.
7. Trace the program's response into subsequent display operations and back to
   the operator's perception and next movement.

The close-up and the room view explain the same event history. A detector
cross-section, bus trace and source highlight expose different aspects of it;
none should invent a second execution for the sake of a nicer shot.

### Touchscreens: the finger is part of the interface

Show the real occlusion: from the user's viewpoint a fingertip blocks the
screen behind it. A side view exposes glass thickness, viewing angle and
parallax; a transparent explanatory overlay can reveal the hidden target
without pretending the user could see it.

Reconstruct HCIL's above-finger or "pop-up" cursor and lift-off strategy:
touch establishes feedback, sliding refines the cursor position, the target
highlights, and release commits the selection. Compare with first-contact
selection and show why selecting small characters is possible when the cursor,
rather than the area covered by the finger, determines the target.
The [HCIL touchscreen history](https://www.cs.umd.edu/hcil/touchscreens/)
documents the 1988 work and its later high-precision studies. These demonstrations
predate iOS and Android touch text-selection interfaces; that chronology does
not by itself prove direct derivation or identity of techniques.
Use the original papers and videos to distinguish selecting a character from
selecting a text range, and to reconstruct the exact cursor behavior.

A proposed scene could feature identified portrayals of Ben Shneiderman,
Catherine Plaisant and Rich Potter at a touchscreen IBM PC, with their guidance
on the hardware, individual contributions and demonstration. Keep full-hand,
over-the-shoulder and fingertip views available. Accessible text explanations
and alternative controls must remain usable without watching the animation.

### Detectors, actuators and the shape of an action

Bill Buxton's *Lexical and Pragmatic Considerations of Input Structures*
([author's publications](https://www.billbuxton.com/papers.html)) is a useful
conceptual reference: study the physical structure of input and its use in
context, not just the abstract command eventually delivered.

| Object | Physical behavior to expose | Connection to the interface |
|---|---|---|
| Light pen | Grip, reach, sensing aperture, contact and cable | Detection and tracking feedback |
| Finger and touchscreen | Occlusion, sliding, release and reach | Cursor refinement and selection |
| Key or button | Travel, contact threshold and return | Press/release events; modeled debounce only where appropriate |
| Rotary knob | Angle, resistance, detents and end stops | Absolute setting versus relative change |
| Switch or pedal | Latching versus momentary action, force and posture | Persistent state versus transient input |
| Actuator or indicator | Motion, light, vibration or sound and its delay | Feedback the operator can actually perceive |

Declare what is sensed and what is driven, the units, thresholds and timing.
Do not give an old device modern haptic feedback and call it historical.
Virtual cabinets may deliberately improve controls, but identify departures
and preserve a documented historical mode.

### Engelbart: the whole workstation, not just the mouse

Another scene should reconstruct Douglas Engelbart's working arrangement:
**chord keyset, mouse, full keyboard, display, microphone, desk and chair**,
plus the cables, supporting equipment and collaborative context established
by the source material. Photograph and film evidence should determine dimensions,
placement, posture and which configuration or demonstration we are portraying.
Do not assemble every famous device into an invented timeless workstation.

Show the hands coordinating: one forms a chord while the other points with
the mouse, shifts to the keyboard, or rests. Expose the keyset's combination
of switch states, mouse motion and buttons, and the resulting interface action.
Show how seating, elbow support, screen position and the available desk area
make that coordination possible. The microphone and display connect speaking,
seeing and remote collaboration to the physical workstation rather than treating
them as unrelated app features.

Use wide shots to understand the arrangement, operator-view shots to understand
attention, and close-ups to inspect key travel and simultaneous inputs.
An exploded or transparent mechanism is an explicitly explanatory view.
NLS behavior needs its own recovered implementation or clearly identified
demonstration model; a portrait of the desk alone does not mean NLS is emulated.

The point is not a parade of gadgets. It is preserving the relationship between
people, physical objects, interaction techniques and computation, and letting
the learner inspect it at the scale and perspective where it becomes intelligible.

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

Marvin Minsky's 1952 design, which Claude Shannon built at Bell Labs: a plain wooden box with one
switch on the lid. Flip it on, the lid opens, a hand comes out, switches it off, and goes back in.
Arthur C. Clarke called it unspeakably sinister.

As a cabinet device it does exactly that and nothing else: its power switch is its only input, and
its only output is turning its own power switch off. Its one parameter is the **power-cycle delay**:
how long, in cabinet cycles, it waits after being switched on before it acts. That interval
drives the animation, in three phases timed against it:

1. **Lid and reach.** The lid lifts and the hand comes out toward the switch.
2. **Press.** The finger reaches the toggle and pushes it, and at that moment the device's
   `power` goes false. The animation follows the device state, never the reverse.
3. **Return.** The arm is spring-loaded: it snaps back into the box and the lid drops shut.

Run the cabinet slower and the hand moves slower, since the delay counts cycles. Set the delay
to zero and the hand flicks out the instant the switch closes.

**With the mouse.** Click the switch on and the hand starts out at once and switches it off. Click
it off yourself before the hand gets there and the hand gives up: it retracts straight back into
the box from wherever it was, and the lid closes. Either way the machine ends where it began, off. It's the smallest complete device the cabinet
can have, so it's also the test of the power-switch contract below, and of the scene's hands (the
animation is a device event like any other). It belongs beside the repo's
[Ultimate Machine bot](../../repo-shows/will-wright-premiere/audience/bot-ultimate-machine/CHARACTER.yml),
the gong that switches off the stream. The device is
[ultimate.ts](src/plugins/ultimate.ts); `pose()` drives this panel
([TURING-ENGINE.md](TURING-ENGINE.md#the-ultimate-machine)).

### Who's in the box?

The portrait's Ultimate Machine is a mechanical Turk. The little box with
the switch sits on top of a big floor cabinet, and someone is hiding inside.
When the machine wants to switch itself off, the occupant reaches up into
the little box, pushes a hand out through the lid like a sockless sock
puppet, flips the switch off and pulls back in. Lights inside the cabinet
show the occupant the device's phase, so it knows when to reach. A door on
the side of the cabinet opens to show who is in there.

The game is to guess who is inside, only by working the switch and
watching the performance: the timing, the hand, the sounds. It is a Turing
test for puppet hands. Minsky thought of the machine and Shannon built
it, so each has a fair claim to the job. But the occupant is a hidden
variable, and the box can be **empty**. "Nobody" is a perfectly good
answer, and the hardest one to prove.

**An occupant is a character profile:** how quickly it answers the
switch, how much its timing varies, how its hand moves, what you hear from inside,
how it reacts when you keep cancelling it, and what you see when the door
opens.

| Occupant | Tell | When you keep cancelling | Behind the door |
|---|---|---|---|
| **Claude Shannon** | Quick, consistent, a little flourish on the flip | Turns it into a game, as his early-1950s mind-reading (outguessing) machine did: learns your on/off rhythm and beats you to the switch. Silent: a tribute, not a voice. | Juggling; a unicycle in the corner |
| **Marvin Minsky** | Hesitant: reaches halfway, retreats, tries again, as if agents in his *Society of Mind* were arguing | Gets less predictable, not more: the hand's indecision is the only commentary. Silent, like Shannon. | Notes, turtle doodles, a tiny robot arm |
| **Nobody** | The same delay every time; no learning, no sounds | Nothing changes, ever | An empty cabinet, perhaps a dusty timer relay |
| **Homunculus robot** | Jerky, overprecise | Opens a smaller door inside and sends in a smaller robot | Robots all the way down, ending in a mirror or another empty box |
| **Trurl** | Overengineered; every switch-off is a bigger production | Builds a machine to switch the machine off | Workshop clutter, a half-built rival machine |
| **Klapaucius** | Dry, economical, skeptical pauses | Switches it off before you finish reaching, to make a point | Arms folded, critiquing Trurl's wiring |
| **The Sims robot maid** | Tidies first: straightens the box, dusts the switch, then flips it | Fussier every cycle, one more cleaning step each time | A tidy little closet and a mop |

Shannon and Minsky are silent tributes, as the repo's
[portrayal standards](../../schemas/portrayal-standards.yml) require for
people who have died. Their tells come from documented work (Shannon's
juggling, unicycle and mind-reading machine; Minsky's arm, turtles and
*Society of Mind*), with no voice and no words put in their mouths. The
fictional occupants may talk.

Trurl and Klapaucius can share the cabinet and take turns, so the style
changes between cycles without warning. The roster is open: anyone can take
a turn behind the switch. This booth is the pilot of a game for any box,
with rounds, scoring and player-made occupants:
[Who's In The Box?](../../designs/whos-in-the-box/README.md).

**Two rules keep it a game of deduction, not luck.**

- **The evidence is readable.** The phase lights and timing registers
  are the device's own registers (`UMRP`, `UMRL`, `UMRA`, the `UMLT`
  timings), so a player can measure instead of guess.
- **Impersonation gives itself away eventually.** Anyone can imitate
  anyone else, but not perfectly: a robot doing Shannon gets the speed
  right and never improvises the flourish.

**Rules of play.** You start with points and pay a little for each flip
of the switch. Opening the side door ends the round with the answer, at a
large penalty. After a guess, the round's history replays beside the
lights and registers, so you can compare what you saw with what the
occupant actually did.

**An occupant is a driver, and so is a program.** Behind the door, an
occupant does what any program can do to device 56: it watches the phase
and the lever, and sets each phase's timing with `UMLT` before the hand
moves. So the occupant can be a character profile in TypeScript, a Forth
program on the PDP-7 next to [ultimate.fs](tapes/pdp7forth/ultimate.fs),
a PDP-10 job with the device mapped into its address space
([MAPPING.md](MAPPING.md#device-registers-are-memory-too)), or a person.
The device needs two more registers for that: a **cancel count**, of
switch-offs that beat the hand, and the **cycle time of the last switch-on**,
so an occupant can learn the player's rhythm the way Shannon's machine
did.

**A person's hand.** In-browser hand tracking (MediaPipe's Hand
Landmarker gives 21 points per hand from a webcam) can let a player
*be* the occupant: the tracked hand drives the arm and finger as IK
targets, so it hesitates, flutters, points, flourishes and finally
presses. The causality runs through the hand, as with Heinz above: the
lever flips when the puppet finger actually reaches it, by the same
`UMOF` a program would use, and the device registers record it like any
other press. The tracker belongs in a planned glove device, a VPL
DataGlove driver with finger flex and hand position as registers. Like
every cabinet device, it could sit on
a PDP-7's IOTs, a PDP-10's `DATAI`, an Apple ]['s game port or a Lisp
Machine, each through its own bus adapter.

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
