# Hand tracking: the DataHand on the PDP-7

A webcam hand tracker running in the browser, plugged into the emulated PDP-7
as **device 57**. Forth programs read the hand, then draw it on the Type 340
in 3D. On the cabinet menu it is **DATAHAND (2026)**, which runs
[datahand.fs](tapes/pdp7forth/datahand.fs) at 10× a real PDP-7. The hand in the
DATAHAND panel starts automatically when DATAHAND is selected (and **only** then).
There is nothing to click in the app: allow the browser's camera prompt and
hold up your hand.

- **Auto / camera** (default): your hand takes over immediately when detected.
  After **one second** without a detected hand, a clearly labeled synthetic
  hand returns, waving and changing gestures to invite you back. Brief tracking
  dropouts hold your last pose rather than flickering into the demo.
- **Synthetic attract mode**: runs while permission is pending, the tracker is
  loading, the camera is unavailable, or no hand is visible. The panel says
  **PLEASE ENABLE THE CAMERA** before startup completes, then **SHOW YOUR HAND**
  once the tracker is ready. It invites imitation of open, fist, point, bird,
  victory, I-love-you and three gestures. These are procedural; recorded
  beckoning and other performances can be added later.
- **👋 Demo**: optional synthetic-only mode, with the camera turned off.
- **Sliders**: T I M R P curl each finger, ↻ turns the hand. Touching one
  takes the hand over and holds it still.

Live and synthetic poses never drive the device at the same time. In auto
mode the tracker keeps looking even during attract mode; no second click is
needed to take over. Camera denial or startup failure leaves the show running
with an explicit error and permission/retry instructions, not a blank display.
**RETRY CAMERA** retries after changing browser permissions. Auto / camera
can also be toggled off for privacy. Each cabinet owns its own
[hand controller](../../apps/ties/src/lib/hand-controller.js); camera callbacks
feed that cabinet's current device, including after a reset. Switching to
manual or demo input, leaving the program, or removing the applet stops the
camera and invalidates late callbacks. A late permission grant after leaving
releases its stream without starting the tracker.

Below the buttons, the panel shows the pipeline for debugging: the camera,
mirrored, with the tracker's 21 points and bones drawn over it (fingertips
yellow, wrist magenta, nearer points bigger). Beside it are the tracker's
state (GPU or CPU, frames a second, milliseconds a frame, frames with a hand,
the side MediaPipe saw and how sure it was) and the device's latched registers
(status, wrist, flex per finger, pinch). The `340` line reports display frames
and the hardware status in octal, separately from the device's latch count.

DATAHAND normally scales and centres the hand (`FIT`). `0 FITTING !` draws it
where the camera has it instead, so a hand can walk on from the side of the
stage, fingers first. Either way, lines that leave the glass are clipped
(Cohen–Sutherland, [clip.fs](tapes/pdp7forth/clip.fs)) by turtle3d.fs's
`LINE`, never sent to the 340, whose edge flag would stop the picture. Only
DATAHAND loads clip.fs: the 2D turtle still refuses off-screen moves, since
cartridges such as the Turing machines have little dictionary to spare.

This is the DataHand row of [ROADMAP §13](ROADMAP.md#13-emulation-mash-ups),
split the way that section splits every device:

| Half | File | What it knows |
|---|---|---|
| The instrument | [hand.ts](src/plugins/hand.ts) | 21 landmarks per hand (MediaPipe's numbering), flex per finger, synthetic hands and gestures. No machine. |
| The port | [datahand.ts](src/plugins/datahand.ts) | Device 57 on the PDP-7's IOT bus: a register file the program latches and reads. |
| The camera | [hand-camera.js](../../apps/ties/src/lib/hand-camera.js) | MediaPipe Hand Landmarker on the webcam, loaded on first use. Feeds the port. |
| The program | [turtle3d.fs](tapes/pdp7forth/turtle3d.fs), [datahand.fs](tapes/pdp7forth/datahand.fs) | A 3D turtle, and DATAHAND, which walks the skeleton with it. |

Video never reaches the PDP-7, or the server. The browser turns frames into
21 points, and only the numbers cross into the machine.

## Choosing a tracker

A survey of what runs in a browser, as of October 2026, with versions from npm:

| Library | Version | What it gives | Notes |
|---|---|---|---|
| [@mediapipe/tasks-vision](https://www.npmjs.com/package/@mediapipe/tasks-vision) Hand Landmarker | 1.1.0 | 21 points per hand, image and world coordinates, handedness | Apache-2.0. WASM plus WebGL (GPU delegate) or CPU. About 13 MB of wasm and a 7.8 MB model, fetched once. **Chosen.** |
| [@mediapipe/hands](https://www.npmjs.com/package/@mediapipe/hands) | legacy | The same model, older API | Superseded by tasks-vision. |
| [@tensorflow-models/hand-pose-detection](https://www.npmjs.com/package/@tensorflow-models/hand-pose-detection) | 2.0.1 | MediaPipe Hands under TF.js (WebGL, WebGPU, WASM backends) | Last released 2023; brings all of TF.js. |
| [@vladmandic/human](https://www.npmjs.com/package/@vladmandic/human) | 3.3.6 | Face, body, hands, gestures, in one package | Large. Good if you want everything. |
| [ml5](https://www.npmjs.com/package/ml5) | 1.4.0 | `handPose`, friendly API over TF.js | Aimed at p5.js sketches. |
| [handtrackjs](https://www.npmjs.com/package/handtrackjs) | 0.1.5 | Bounding boxes only | No joints. |
| [fingerpose](https://www.npmjs.com/package/fingerpose) | 0.1.0 | Gesture classes from landmarks | Sits on top of a tracker. |
| [handsfree](https://www.npmjs.com/package/handsfree) | 8.5.1 | Wrapper over MediaPipe models | Dormant. |
| [kalidokit](https://www.npmjs.com/package/kalidokit) | 1.1.5 | Landmarks to rig rotations (VRM avatars) | Solves the joint-angle step we do in datahand.ts. |
| [onnxruntime-web](https://www.npmjs.com/package/onnxruntime-web) | 1.30.0 | Run any ONNX hand model on WASM, WebGL or WebGPU | Bring your own model. |
| [@techstark/opencv-js](https://www.npmjs.com/package/@techstark/opencv-js) | 5.0.0 | OpenCV in wasm: skin masks, contours, convexity defects | The classical, pre-learning way; fragile. |
| Rust to wasm: tract, burn, candle, ort | — | Inference engines you can compile for the browser | A route to our own model, later. |
| [WebXR Hand Input](https://www.w3.org/TR/webxr-hand-input-1/) | W3C | 25 joints per hand, from a headset's own tracking | Headsets only (Quest, Vision Pro), no webcam. The same port can take it. |
| Ultraleap (Leap Motion) | — | Dedicated hardware, very good joints | Not a browser library. |

MediaPipe wins on accuracy, speed, size and licence, and it gives 3D points
with a stable numbering that everything else (kalidokit, fingerpose, WebXR
mappings) already speaks. The applet imports it lazily, so nobody downloads
it until they select DATAHAND.

One trap: MediaPipe names hands *as if the picture were mirrored*. A webcam's
raw video is not mirrored, so its "Left" is the person's own right hand.
`hand-camera.js` swaps them, and the port reports the person's own hand.

## Units: the PDP-7's, not the browser's

The PDP-7 has no floating point, so the port speaks only in units it already
uses:

- **Positions** are 340 screen pixels, 0 to 1023, x right, y up, z toward the
  viewer. The picture is mirrored, as people expect a webcam to be.
- **Angles** are whole degrees, as turtle.fs's `RT` takes them.
- **Fractions** are scaled by **16384**, which is turtle.fs's `90 SIN`. Flex
  runs 0 (straight) to 16384 (curled). The palm's unit vectors are in the same
  scale, so `*/ 16384` is the multiply.

## The hand as turtle moves

Most trackers hand you points. A program on a 1965 computer would rather be
told how to *draw* the hand, so the port reports it the way a 3D turtle walks
it:

1. **The palm frame.** H runs from the wrist toward the middle knuckle.
   U = H × (index knuckle − pinky knuckle), the back of the hand.
   L = U × H. All three are unit vectors scaled by 16384.
2. **Twenty bones.** For each finger, four bones from the wrist out: yaw
   (right), pitch (up), and forward length in pixels.

A turtle that starts at the wrist, faces the palm frame, and does those
twenty moves (a finger at a time, back to the wrist between fingers) walks
the whole skeleton. The port plans the moves with the turtle's own integer
arithmetic: it starts from the rounded frame and tracks where the turtle
really lands. So one bone's rounding error is made up by the next, and errors
never add up along a finger. The test checks every landmark is reached within
2.5 pixels.

The port also gives the raw 21 points, so a program can skip the turtle.

### Registers

Read with `GRD` at the index loaded with `GLI`; `GRD` steps the index.

| Index | Contents |
|---|---|
| 0 | Status: bit 1 a hand is in view, bit 2 it is a right hand, bit 4 it is synthetic (demo or sliders, not tracked) |
| 1–3 | The wrist: x y z |
| 4–12 | The palm frame ×16384: H xyz, L xyz, U xyz |
| 13–72 | 20 bones × (yaw, pitch, length): thumb 0-1-2-3-4, index 0-5-6-7-8, middle, ring, pinky 0-17-18-19-20 |
| 73–77 | Flex, thumb to pinky: 0 straight to 16384 curled |
| 78 | Pinch: thumb tip to index tip, pixels |
| 79–141 | The 21 landmarks: x y z |

### IOTs, device 57

A cabinet extension on a free device code, marked "not 1972" in
[DESIGN.md](DESIGN.md#device-contract--every-iot-symelec-issues). Pulses group
by 060 like the 340's; bit 010 is the CPU's own clear-AC.

| IOT | Name | Does |
|---|---|---|
| 705701 | GSF | Skip if a new frame waits |
| 705712 | GRS | Read the latched frame's status |
| 705704 | GLT | Latch the newest frame, clear the flag |
| 705721 | GSH | Skip if the latched frame has a hand |
| 705732 | GRD | Read the register at the index, and step the index |
| 705724 | GLI | Load the index from AC |
| 705744 | GCF | Clear the flag |
| 705764 | GIE | Interrupt on a new frame iff AC bit 17 |

The tracker can run at camera speed while the program draws at its own
speed. Latching gives the program a frame that holds still while it reads.

## The 3D turtle

[turtle3d.fs](tapes/pdp7forth/turtle3d.fs) follows Abelson and diSessa's
*Turtle Geometry* (1981), chapter 3: a position and three unit vectors, H, L
and U. Each turn rotates two of the vectors by the same formula, so there's
no gimbal lock and nothing to invert:

    A' = A cos − B sin      B' = B cos + A sin

| Word | Does |
|---|---|
| `yaw ( deg -- )` | Turn right about U |
| `pitch ( deg -- )` | Nose up about L |
| `roll ( deg -- )` | Roll right about H |
| `fwd ( n -- )` / `jump ( n -- )` | Move n pixels along H, drawing or not |
| `moveto3 ( x y z -- )`, `upright`, `home3` | Place and face the turtle |
| `remember` / `recall` | Save the turtle at a fork; come back for the next branch |
| `view ( deg -- )` | Look from SPIN degrees around the pivot |
| `vnum vden vox voy` | Scale and offset the picture |

Positions are kept in 1/16 pixel, so a long walk doesn't drift.

## DATAHAND

[datahand.fs](tapes/pdp7forth/datahand.fs) draws a backdrop once (five flex meters
and the finger names), then loops until a key:

- Latch a new frame.
- Fit the hand to the screen (`FIT`): scale and centre it from the box
  around its 21 points, so a hand close to the camera, or half out of the
  picture, still fills the space between the meters and the captions.
- Walk the skeleton: the knuckle line, then each finger from the wrist, with a
  small box at each fingertip.
- Fill each meter to its finger's flex.
- Caption RIGHT or LEFT, PINCH when thumb and index touch, and THE BIRD when
  the middle finger stands alone (`BIRD?`, from the flex registers). The demo
  hand gives it too: no gesture vocabulary is complete without it.

At the teletype, after a key stops it:

    60 VIEW DATAHAND            \ the hand turned 60 degrees: see the curl in depth
    3 SPINNING ! DATAHAND       \ turn 3 degrees a frame
    0 SPINNING ! 0 VIEW DATAHAND
    4 SPOT . .               \ where the thumb tip was drawn: y, then x

It's slow, honestly: about 600,000 steps a frame, so about one frame a second
at the real PDP-7's speed. The cost is the software multiply and divide in
`*/`, done for every vector component the turtle turns or moves. Turn the speed up and it keeps up with the camera.

## Hands, tools, and human agency

Bret Victor's [A Brief Rant on the Future of Interaction
Design](https://worrydream.com/ABriefRantOnTheFutureOfInteractionDesign/)
([responses and follow-up](https://worrydream.com/ABriefRantOnTheFutureOfInteractionDesign/responses.html))
is a useful challenge for this project. Hands are not merely things to
recognize or pictures to display. They feel and manipulate: grip, pressure,
weight, resistance, articulation, and coordinated movement are part of how
people think and work with tools. His criticism of "Pictures Under Glass"
asks us to design for those capabilities, rather than reduce a hand to a
single finger sliding on a surface.

The ULTIMATE HAND demo offers a small example of discovering an interaction
by doing it. Moving a hand toward the camera makes its displayed counterpart
bigger, letting the fingers reach the switch. The arm supplies gross
positioning; the fingers supply the expressive finish. A person can poke,
flourish, hesitate, or withdraw. Withdrawing the real hand cancels the cycle
and retracts the mechanism. Movement has consequences; it is not just an
animation decorating a command.

But **camera tracking restores some manipulation, not touch**. The person
does not feel the switch's resistance or snap, the box, or the weight of the
virtual mechanism. A beautifully tracked skeleton does not replace those
sensations. DATAHAND is an experiment in embodied visual interaction, not a
solution to Victor's whole critique. Visual feedback and the person's own
sense of their moving body help, but they are not force feedback.

This connects to **interfaces to agency, not agents instead of interfaces**.
The design question is whether computation gives a person's capabilities
more reach, or substitutes an opaque actor for the person exercising them.
The point is not to prohibit automation, but to make its relationship to
human intention legible and steerable. The synthetic attract hand invites
participation; when a real hand appears, it yields control. It waves you in,
then gets out of your way.

### Directions to explore

These are project directions, not claims of implemented features:

- **Two hands with different jobs.** One holds or positions something while
  the other operates on it, as when opening a jar. Explore coordinated roles
  rather than treating two hands as interchangeable cursors.
- **Physical props with digital meaning.** Track hands manipulating a real
  object, retaining its weight, grip, and resistance while adding
  computational behavior. The physical object supplies feedback that a
  camera and display alone cannot.
- **Hands as composable material.** In the recursive hand-tree student
  project below, a pose becomes something to capture, place, transform, and
  compose. The hand is not just issuing commands: its movement and shape
  become material in an expressive medium.
- **Hand-driven Spacewar.** Explore continuous, simultaneous control rather
  than a gesture-password system in which making a prescribed sign merely
  replaces pressing a key.
- **Beyond the hands.** Arms, shoulders, posture, and whole-body movement
  offer further expressive possibilities. Any extension should have a
  purpose and alternatives for people with different ranges of movement;
  requiring more movement is not automatically a better interface.

The future interface is a design choice, not an inevitable sequence of
devices. The useful test is not how futuristic the tracking looks, but what
it enables a person to feel, understand, express, and do.

## Design: Hand Turtle, then Hand-Driven Spacewar

**Design only. Start with HAND TURTLE: one person, one hand, one turtle.**
Use gestures to drive the familiar `PU`, `PD`, `RT`, `LT`, `FD`, and `BK`
words before introducing ships, inertia, weapons, or another player. The
turtle's trail makes the mapping visible and leaves a record of what the
person did. Keep keyboard controls available for comparison and as an
alternative.

### The simplest base: HAND TURTLE

The hand controls the turtle; this is different from DATAHAND, where the
turtle draws the hand's skeleton. Start with the existing 2D turtle and
its ordinary movement words. No new game engine is needed.

Candidate mappings to try, not a prescribed gesture vocabulary:

| Turtle word | Gesture experiment | Behavior to compare |
|---|---|---|
| `PU` / `PD` | Open hand lifts the pen; a deliberate pinch lowers it. | Hold-to-draw, with release lifting the pen, versus separate latched pen-up and pen-down gestures. |
| `RT` / `LT` | Lean or point right/left from a comfortable upright neutral pose. | A small fixed turn on entering the gesture versus continuous turn rate proportional to lean. |
| `FD` / `BK` | Point up/down in the camera plane. | A fixed step on entering the gesture versus continuous forward/backward speed while held. |

Pointing up is only a candidate: in the simple directional mapping above
it means `FD`; in a lean-to-turn mapping it can instead mean straight ahead,
with no turn. Label profiles explicitly rather than assigning two meanings
to the same pose in the same context. Also try splitting the channels:
hand orientation turns, finger curl controls forward motion, and pinch
controls the pen. Backward motion needs a distinguishable gesture or an
explicit reverse mode in that profile. Test whether these actions can be
combined comfortably without one gesture corrupting another.

Compare **discrete commands** (one `FD` step or `RT` turn per gesture entry,
release to rearm) with **continuous control** (small moves and turns at a
fixed update rate while held). Movement must depend on elapsed time, not
the camera's changing frame rate. Compare both with **direct heading**:
pointing requests an absolute turtle heading, translated into bounded
`RT`/`LT` corrections, rather than a turn rate. Keep these profiles
switchable; none is declared the winner in advance.

**Pull yourself along with your pointing finger.** Extend to reach, then
retract to pull the turtle forward: repeated finger strokes, rather than
holding a pose to run a motor. Try mapping the amount of retraction to
`FD` distance, with extension as the recovery stroke. A held finger does
not keep moving the turtle. Accumulate only deliberate retraction beyond
a small noise threshold, and rearm after sufficient extension so tracking
jitter cannot become a stream of tiny forward steps. Calibrate the useful
range without requiring a fully straight finger or a tightly curled one.

Compare finger flex with fingertip travel relative to the palm: moving
the whole hand must not accidentally count as retracting the finger.
If the index finger also supplies direction, curling it can make that
direction unstable. Try taking the heading at the start of each pull,
or steering with the palm while the index finger supplies the stroke.
Show reach, pull, and recovery visibly. Start with forward pulls only;
experiment separately with an explicit reverse modifier for `BK`, rather
than making the recovery stroke undo the distance just travelled.

This adds a third movement feel alongside discrete steps and held-rate
control: **movement by accumulated strokes**. Compare how precisely a
person can approach a target, draw a short line, and stop. Keep pen control
independent where possible; if pinch interferes with the pulling finger,
try latched pen state or another finger instead. A lost and reacquired
hand must establish a fresh stroke baseline, never produce a large jump.

**Continuous fly mode: a hand-operated WASD.** Hold a gesture to keep
moving, return to neutral to stop issuing motion. Use the same logical
controls from either the hand or the keyboard:

| Control | Turtle action while held | Hand experiment |
|---|---|---|
| `W` | Forward (`FD`), distance proportional to elapsed time | Forward finger/hand deflection from neutral |
| `S` | Backward (`BK`) | Opposite deflection |
| `A` | Turn left (`LT`), angle proportional to elapsed time | Lean left |
| `D` | Turn right (`RT`) | Lean right |

Allow forward/backward and turning simultaneously, just as `W+A` makes
a moving left turn. Opposing controls cancel on their axis. Compare
simple on/off gestures with proportional deflection for speed and turn
rate, with a neutral dead zone. Here A/D turn, not strafe; lateral motion
can be a separately labelled experiment later. Keep `PU`/`PD` available
independently so flying can draw curves or reposition without drawing.

Make **stroke mode** and **fly mode** explicit selectable profiles. In
stroke mode, retracting the pointing finger accumulates a finite pull;
in fly mode, holding a deflection sustains motion. Show the active profile
and require neutral when switching so the same held pose cannot suddenly
launch the turtle. Test WASD alone, gestures alone, and keyboard fallback;
define input ownership explicitly rather than letting stale hand commands
remain active after keyboard takeover.

For the first turtle fly profile, neutral stops movement immediately.
That is a navigation control, not yet spaceship physics. A later ship
profile maps forward/backward to acceleration under the game's rules:
releasing thrust leaves the ship coasting. Do not silently change between
these behaviors under the same mode label.

Show the recognized command, pen state, requested motion, and a visible
turtle even with the pen up. Begin stopped with the pen up. Missing or
unusable tracking stops commanded movement and lifts the pen; reacquisition
requires neutral/release before movement or drawing resumes. Do not let an
attract hand draw on the person's canvas. Clearing the drawing, homing,
and changing profiles can remain explicit panel actions at first, rather
than overloading more gestures.

First tasks: draw a line, leave a gap with `PU`, draw a corner, back up,
and make a square. Compare accidental marks, unwanted turns, latency, and
comfort. Only then add more words or a 3D profile for yaw, pitch, and roll.

### From turtle to ship

Once HAND TURTLE feels good, try **one player, one hand, one ship** in an
empty arena with targets. Reuse the gesture/control experiments, not the
turtle's movement physics: a ship accelerates and coasts, while `FD` moves
a turtle a specified distance. Turning can carry over; pen engagement can
suggest a thrust or firing gesture, but the game profile must name its
meaning explicitly. Make turning, thrust, and firing enjoyable before
adding another hand or a second player.

This is an experiment with mappings, not a settled gesture vocabulary.
Try both direct and indirect controls, let the player switch between them,
and show which mapping is active. Do not require a theatrical pose when a
small, comfortable movement will do.

### One hand: turn, thrust, fire

| Action | First experiment | Alternatives to compare |
|---|---|---|
| Turn | Point up for straight: an upright hand is neutral; leaning left or right requests a turn in that direction. | Direct heading from the wrist-to-middle-knuckle axis or pointing finger; palm tilt as a turn-rate control; displacement from a calibrated neutral position as a joystick. |
| Thrust | Curl the middle, ring, and little fingers to engage thrust, leaving thumb and index available to fire. | Proportional curl for throttle; palm tilt; movement toward the camera if a reliable depth signal can be established. |
| Fire | Close thumb and index into a pinch: one shot on closing, release to rearm. | An index-finger flick; deliberate held pinch for rate-limited repeated fire, as a separate mode. |

**What does "point up for straight" mean?** In indirect mode it means zero
turn rate: retain the ship's current heading, not point the ship toward
the top of the screen. Lean farther to turn faster, within a cap. In direct
mode, pointing up means the desired ship heading is screen-up; pointing
left requests screen-left. The ship turns toward that heading at a bounded
rate. Neither mode directly moves the ship to the hand's position:
thrust changes velocity, and the ship keeps drifting without thrust.

Try the palm's wrist-to-knuckle axis and the index finger separately as
direction signals. A curled or foreshortened finger may give a poor heading;
holding an index finger upright continuously may also be tiring. Learn
which signal remains usable while thrusting and pinching, not just while
demonstrating steering on its own.

Keep firing discrete and steering/throttle continuous where useful. A pinch
can disturb the apparent pointing direction, and curling fingers can change
the palm estimate. Show these interactions and test combinations rather
than assuming three individually recognizable gestures are independent.
Do not add hyperspace or other gesture commands until the basic flight
controls are comfortable.

### Feedback, calibration, and loss of tracking

- Show the ship's current heading and requested heading or turn rate,
  thrust level, and fire/rearm state. A small hand overlay and neutral guide
  should be optional, so players can see why the ship is responding.
- Calibrate a comfortable neutral pose and range, for either hand. Use a
  steering dead zone, bounded smoothing, and different engage/release
  thresholds for pinch and thrust to prevent chatter. Tune these in play;
  do not bake untested thresholds into the design.
- Normalize pinch distance by palm size rather than fixed screen pixels,
  so moving closer does not silently change the trigger. Camera-relative
  landmark z is not a reliable absolute wrist-depth measurement; a
  toward-camera throttle needs separate validation.
- On missing or unusable tracking, release thrust and fire and request no
  further turn; the ship continues under the game's physics. Show the
  tracking loss. Reacquisition must not generate a shot: require release
  before rearming the trigger. Consider an explicit pause option for solo
  practice.
- Synthetic attract hands may teach controls in a clearly separate demo,
  but must never silently take over a player's live ship. Preserve the
  existing DATAHAND demo's behavior outside this proposed game.

### Later: two hands, two arrangements

**Two players, one hand each.** Each person claims a ship with a hand in a
visible entry zone. Both use the one-hand mapping, with independent
calibration and trigger state. Initial left/right screen position can
assign ships, but crossing hands must not swap them. Tracker result order
and left/right handedness are not player identities: two people may both
use their right hand. Association needs continuity, ambiguity detection,
and explicit reclaim when identity is lost. Test occlusion and limited
camera space before treating this as a reliable multiplayer mode.

**One player, two hands, as Engelbart's keyset and mouse.** The design goal for two hands is
in [DEVICES.md](DEVICES.md#the-design-goal-engelbarts-keyset-and-mouse-from-two-bare-hands):
fingers up and down as chords, the other hand's position, rotation and curls as the mouse.

**One player, two hands.** Give the hands complementary jobs: one steers,
the other supplies thrust and fire. Compare a proportional throttle hand
with a simpler curl-to-thrust hand, and allow roles to be swapped. This
removes the need to steer, curl, and pinch with the same hand. It should
feel like coordinated manipulation, not two redundant cursors.

The camera currently requests one hand and passes only its first result;
device 57 exposes one hand's register file. Two-hand modes therefore need
camera, controller, and device work, not merely a different game loop.
Preserve the existing single-hand interface while designing an explicitly
selected, consistently latched multi-hand view. Both ships must read the
same capture, rather than mixing hands from different video frames.

### Connecting the controls to a game

Keep three concerns separate: tracked hand measurements, the selected
control mapping, and the game's input interface. A control sample should
distinguish presence, desired heading versus signed turn rate, thrust, and
a fire event. Keep per-player gesture state outside the raw pose data.

- **Historical DUEL, unchanged.** Adapt the controls to its active-low
  console switches. Indirect steering naturally produces left/right
  switches; proportional input needs an explicit conversion to on/off
  commands. Direct heading control additionally needs the ship's heading
  and a feedback controller; do not claim it follows from setting switches
  alone. Clear hand-owned switches on tracking loss or leaving the mode,
  without overwriting unrelated console input.
- **A future Forth Spacewar.** Read hand measurements through device 57
  and experiment with continuous flight controls in Forth. Keep the
  existing [datahand.fs](tapes/pdp7forth/datahand.fs) as the hand drawing
  demo, rather than turning it into the game. Drawing a faint controlling
  hand near a ship is an optional aid, not a prerequisite for play.

Neither route is selected here. Start with HAND TURTLE, then compare the
control mappings in a small flight experiment; the historical adapter and
a new Forth game have different constraints.

### How to judge the experiment

Use the same short tasks for each mapping: fly straight, turn to a target,
accelerate then coast, and fire while turning and thrusting. Record time
on target, accidental shots, response latency, tracking losses, and
comfort after a few minutes. Check either hand, different distances from
the camera, and restricted movement ranges. Then repeat with crossing and
occlusion for two players, and independent steering/throttle for two-hand
solo play. Choose mappings from those observations, not from how impressive
the gesture looks in a demonstration.

## History: RB2 and the DataGlove

VPL Research's DataGlove (Zimmerman and Lanier, 1987) measured finger flex
with optical fibres. A Polhemus tracker on the back of the hand gave position
and orientation. That is exactly the register file above: flex per finger,
plus a frame.

VPL's RB2, "Reality Built for Two" (1989), wired two people into one world:

- **Body Electric**, on a Macintosh, was a dataflow program. It mapped the
  DataGloves' and trackers' readings onto Swivel 3D skeletons.
- It sent the posed world over UDP to **Isaac**, a renderer running on two
  Silicon Graphics machines, one per eye.

The cabinet already has the pieces in miniature. The port is Body Electric's
input stage. The turtle walk is the skeleton. `VIEW` at ±3 degrees on two
340s is a stereo pair.

### To do

- **Two-rig VR.** Two people, two DataGloves, one world, rendered per eye. Either
  more CPU types in the cabinet, or a direct emulation of the applications:
  a tiny-Isaac that answers Body Electric's UDP the way
  [tiny-titan](src/plugins/tiny-titan.ts) answers the Titan link. That is,
  emulate the conversation, not the computer.
- **WebXR Hand Input** as a second camera: 25 joints from a headset, mapped
  onto the same 21-point instrument.
- **The pinch as a light pen**, so PIXIE programs draw with a hand unchanged
  (ROADMAP §13's PDP-7 adapter).
- **The Ultimate Machine's occupant**: a tracked hand drives the box's arm
  ([Who's in the box?](../../designs/whos-in-the-box/README.md)).
- **An Apple ][ port**: the same instrument as paddles and buttons, once the
  6502 runs.
- **A student project: hands of hands, a recursive tree.** Today `HAND` in
  [datahand.fs](tapes/pdp7forth/datahand.fs) draws whatever frame the device
  latched last, from the wrist the device reports. Separate the pose from the
  drawing, and a hand becomes a shape you can store, copy, and draw anywhere:
  - **Pose buffers.** A pose is the 63 registers that describe a hand's shape:
    the palm frame and the 20 bones (registers 4 to 72, yaw, pitch and length),
    plus the flex if wanted. `POSE ( "name" -- )` makes a buffer; `CAPTURE
    ( pose -- )` copies the latched hand into it; `>CURRENT ( pose -- )` copies
    a pose into the current-hand buffer that drawing reads.
  - **`DRAW-HAND ( -- )` in the turtle's own frame.** It draws the current pose
    starting where the 3D turtle stands, facing where it faces, at the current
    scale and brightness, not at the camera's wrist and not in the camera's
    frame. Then a hand is drawn the way a square is: move, turn, scale,
    `DRAW-HAND`.
  - **The tree.** At each fingertip, push the turtle, step out of the tip,
    shrink, and draw a sub-hand; pop and go on to the next finger. Five
    children per hand, so a few levels make hundreds of hands.
  - **Playing it.** Every second the hand you control freezes (`CAPTURE`), and
    control moves on to the next fingertip's sub-hand: you pose the thumb's
    child, then the index finger's, then theirs, and so on, building the tree
    pose by pose. Or nothing freezes, and every node draws the live hand, so
    the whole tree moves with you, all the way down.
  - **What the turtle needs.** `REMEMBER` and `RECALL` in
    [turtle3d.fs](tapes/pdp7forth/turtle3d.fs) keep one saved turtle, enough
    for the five fingers of one hand. A tree needs a stack of them, PostScript's
    `gsave`/`grestore`, one level per generation, with the scale and brightness
    saved along with the position and the H, L and U vectors.
  - **What to watch.** The 1024-word display list (a hand is about 90 words:
    count the levels you can afford, or redraw a level a frame), the cycles
    per frame, and the 8K core: each pose buffer is 63 words, so capture only
    what you will draw. Clip at the glass ([clip.fs](tapes/pdp7forth/clip.fs))
    lets the tree spill off the screen.

## Tests

The app-side [routing tests](../../apps/ties/src/lib/hand-controller.test.js)
run with `node --test src/lib/hand-controller.test.js` from `apps/ties`
(after building `packages/cabinet`). They check independent cabinets, camera
startup cancellation, reset routing, and actual 340 meter strokes produced
by Forth for camera-fed fist, open-hand and bird poses.

[datahand.test.ts](src/datahand.test.ts) checks that:

- Flex round-trips through synthetic hands.
- The JavaScript turtle walk reaches every landmark within 2.5 pixels.
- Every IOT does what the table says.
- The Forth turtle's axes are right.
- Forth's drawn joints land within 5 pixels of the landmarks for three
  gestures.
- DATAHAND draws frames from a moving source.
