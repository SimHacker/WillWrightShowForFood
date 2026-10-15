# Hand tracking: the DataGlove on the PDP-7

A webcam hand tracker running in the browser, plugged into the emulated PDP-7
as **device 57**. Forth programs read the hand, then draw it on the Type 340
in 3D. On the cabinet menu it is **DATAGLOVE (2026)**, which runs
[glove.fs](tapes/pdp7forth/glove.fs) at 10× a real PDP-7. The hand in the
GLOVE panel starts automatically when DATAGLOVE is selected (and **only** then).
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
[glove controller](../../apps/ties/src/lib/glove-controller.js); camera callbacks
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

GLOVE normally scales and centres the hand (`FIT`). `0 FITTING !` draws it
where the camera has it instead, so a hand can walk on from the side of the
stage, fingers first. Either way, lines that leave the glass are clipped
(Cohen–Sutherland, [clip.fs](tapes/pdp7forth/clip.fs)) by turtle3d.fs's
`LINE`, never sent to the 340, whose edge flag would stop the picture. Only
DATAGLOVE loads clip.fs: the 2D turtle still refuses off-screen moves, since
cartridges such as the Turing machines have little dictionary to spare.

This is the DataGlove row of [ROADMAP §13](ROADMAP.md#13-emulation-mash-ups),
split the way that section splits every device:

| Half | File | What it knows |
|---|---|---|
| The instrument | [hand.ts](src/plugins/hand.ts) | 21 landmarks per hand (MediaPipe's numbering), flex per finger, synthetic hands and gestures. No machine. |
| The port | [glove.ts](src/plugins/glove.ts) | Device 57 on the PDP-7's IOT bus: a register file the program latches and reads. |
| The camera | [hand-camera.js](../../apps/ties/src/lib/hand-camera.js) | MediaPipe Hand Landmarker on the webcam, loaded on first use. Feeds the port. |
| The program | [turtle3d.fs](tapes/pdp7forth/turtle3d.fs), [glove.fs](tapes/pdp7forth/glove.fs) | A 3D turtle, and GLOVE, which walks the skeleton with it. |

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
| [kalidokit](https://www.npmjs.com/package/kalidokit) | 1.1.5 | Landmarks to rig rotations (VRM avatars) | Solves the joint-angle step we do in glove.ts. |
| [onnxruntime-web](https://www.npmjs.com/package/onnxruntime-web) | 1.30.0 | Run any ONNX hand model on WASM, WebGL or WebGPU | Bring your own model. |
| [@techstark/opencv-js](https://www.npmjs.com/package/@techstark/opencv-js) | 5.0.0 | OpenCV in wasm: skin masks, contours, convexity defects | The classical, pre-learning way; fragile. |
| Rust to wasm: tract, burn, candle, ort | — | Inference engines you can compile for the browser | A route to our own model, later. |
| [WebXR Hand Input](https://www.w3.org/TR/webxr-hand-input-1/) | W3C | 25 joints per hand, from a headset's own tracking | Headsets only (Quest, Vision Pro), no webcam. The same port can take it. |
| Ultraleap (Leap Motion) | — | Dedicated hardware, very good joints | Not a browser library. |

MediaPipe wins on accuracy, speed, size and licence, and it gives 3D points
with a stable numbering that everything else (kalidokit, fingerpose, WebXR
mappings) already speaks. The applet imports it lazily, so nobody downloads
it until they select DATAGLOVE.

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
| 0 | Status: bit 1 a hand is in view, bit 2 it is a right hand |
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

## GLOVE

[glove.fs](tapes/pdp7forth/glove.fs) draws a backdrop once (five flex meters
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

    60 VIEW GLOVE            \ the hand turned 60 degrees: see the curl in depth
    3 SPINNING ! GLOVE       \ turn 3 degrees a frame
    0 SPINNING ! 0 VIEW GLOVE
    4 SPOT . .               \ where the thumb tip was drawn: y, then x

It's slow, honestly: about 600,000 steps a frame, so about one frame a second
at the real PDP-7's speed. The cost is the software multiply and divide in
`*/`, done for every vector component the turtle turns or moves. Turn the speed up and it keeps up with the camera.

## History: RB2 and the DataGlove

VPL Research's DataGlove (Zimmerman and Lanier, 1987) measured finger flex
with optical fibres. A Polhemus tracker on the back of the hand gave position
and orientation. That is exactly the register file above: flex per finger,
plus a frame.

VPL's RB2, "Reality Built for Two" (1989), wired two people into one world:

- **Body Electric**, on a Macintosh, was a dataflow program. It mapped the
  gloves' and trackers' readings onto Swivel 3D skeletons.
- It sent the posed world over UDP to **Isaac**, a renderer running on two
  Silicon Graphics machines, one per eye.

The cabinet already has the pieces in miniature. The port is Body Electric's
input stage. The turtle walk is the skeleton. `VIEW` at ±3 degrees on two
340s is a stereo pair.

### To do

- **Two-rig VR.** Two people, two gloves, one world, rendered per eye. Either
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

## Tests

The app-side [routing tests](../../apps/ties/src/lib/glove-controller.test.js)
run with `node --test src/lib/glove-controller.test.js` from `apps/ties`
(after building `packages/cabinet`). They check independent cabinets, camera
startup cancellation, reset routing, and actual 340 meter strokes produced
by Forth for camera-fed fist, open-hand and bird poses.

[glove.test.ts](src/glove.test.ts) checks that:

- Flex round-trips through synthetic hands.
- The JavaScript turtle walk reaches every landmark within 2.5 pixels.
- Every IOT does what the table says.
- The Forth turtle's axes are right.
- Forth's drawn joints land within 5 pixels of the landmarks for three
  gestures.
- GLOVE draws frames from a moving source.
