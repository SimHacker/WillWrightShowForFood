# Devices in layers: any instrument, any interpreter, any machine, any emulator

The goal: plug a data hand into any emulated machine, through any gesture recognizer or
accessibility interface; put Engelbart's mouse and keyset on any computer; run the Turing engine
on a PDP-7, a PDP-10 or an 8-bit Apple ][; give any machine a configurable frame buffer, tile
engine or vector display list. To do that, a device is split into layers, and only the bottom
layers know which machine or which emulator it is plugged into.

This is the device half of [the package is not the emulator](CARTRIDGES.md#the-goal-the-package-is-not-the-emulator):
a cartridge says which devices a program needs and how they're bound, and each emulator supplies
the concrete end.

## The layers

| Layer | What it is | Knows about the machine? | Examples |
|---|---|---|---|
| **1. Instrument** | What a person's hand, eye or voice does, as raw numbers | No | 21 hand landmarks a frame; mouse deltas and three buttons; five keyset keys; eye gaze; one switch; a microphone |
| **2. Interpreter** | Turns instrument data into intentions: gestures, chords, choices, words | No | pinch = button; fist, point, open hand; NLS chord tables; Dasher steered by gaze or one switch; pie menus; speech to digits |
| **3. Abstract device** | A typed interface: properties, registers, events, methods, memory regions | No | pointer with buttons; keyboard; axis; Turing engine; frame buffer; tile engine; vector display list |
| **4. Binding** | Maps an abstract device onto one architecture's I/O mechanisms | Yes, the architecture | PDP-7 IOTs, flags and the interrupt line; Apple ][ soft switches, paddle timers and IRQ; PDP-10 I/O instructions or a 10/11-style memory map; a serial port; memory regions through a `MemoryPort` with packing |
| **5. Host** | Which emulator the binding runs in, and how it gets in | Yes, the emulator | the cabinet, in process; microM8, through its key, mouse, paddle and memory calls; SIMH, through its console and serial sockets |

Each layer can be swapped without touching the others:

- **Any instrument, any interpreter.** A person who can't use a mouse picks a different
  instrument and interpreter, and the program sees the same pointer. Accessibility lives in
  layers 1 and 2, so it works for every machine at once, including programs written in 1968.
- **Any abstract device, any machine.** The binding is the only per-architecture code. The
  machine doesn't have to pretend to be another machine's I/O.
- **Any machine, any emulator.** The same Apple ][ binding of a pointer is paddles and
  pushbuttons whether the Apple ][ is microM8 or something else; only layer 5 changes.

## The DataHand, layer by layer

The DataHand shows what each layer is for. The top is cross-platform and in floating point; the
bottom is one machine's, and is written in collusion with that machine's software.

- **Instrument (built).** A webcam and MediaPipe in the browser give 21 hand landmarks a frame,
  in floating point. A synthetic waving hand or finger sliders stand in when no hand is seen.
  Video never leaves the browser. [`hand.ts`](src/plugins/hand.ts)
- **Interpreter (planned).** Everything that's useful on every machine goes here, once: gesture
  recognition; finger pie menus, where a pinch opens a pie and the hand's direction picks a slice
  ([TAGS-AND-PIES.md](TAGS-AND-PIES.md) has the cabinet's pies); knobs, where a twist of the
  wrist turns a value; pointing as a pointer. Any machine and any program can use them, through
  whatever binding that machine has for a pointer, a button or a key.
- **PDP-7 binding (built).** [`datahand.ts`](src/plugins/datahand.ts), device 57, turns the
  floating-point rotations and translations into 18-bit integers in the ranges PDP-7 Forth's
  turtle graphics already use: positions in Type 340 pixels (0 to 1023), angles in whole
  degrees, and fractions scaled by 16384, which is `90 SIN` in turtle.fs's integer sine table.
  It reports the hand as turtle moves: the palm's frame, then twenty bones as yaw, pitch and
  forward length. It plans those moves with the turtle's own integer rounding, so one bone's
  error is made up by the next and never adds up along a finger
  ([HAND-TRACKING.md](HAND-TRACKING.md#units-the-pdp-7s-not-the-browsers)).

The adaptor is smart so the PDP-7 doesn't have to be. A Forth program draws the hand by
reading registers and walking the turtle through them, with no floating point and no
trigonometry of its own. Then it can turn the picture with `60 VIEW DATAHAND`, spin it, or ask
`BIRD?` ([datahand.fs](tapes/pdp7forth/datahand.fs)). Binding a device to a machine
includes fitting it to the machine's best programming environment, not only its I/O bus. On
the Apple ][ the same hand would bind to paddles and pushbuttons for every program, and could
also bind to Logo's turtle units for programs written for it.

## The design goal: Engelbart's keyset and mouse, from two bare hands

One hand plays the chord keyset and the other drives the mouse, both tracked by the webcam,
with no hardware. The layers are the same as the DataHand's, with two hands in and two
Engelbart devices out:

- **Instrument.** Both hands from the same video frame, with handedness. MediaPipe's hand
  landmarker tracks more than one hand; the cabinet's camera asks for one today
  (`numHands: 1` in `apps/ties/src/lib/hand-camera.js`).
- **Interpreter: the keyset hand.** Each of the five fingers, up or down, is one of the keyset's
  five keys, and the five together are a chord, read with NLS's own tables
  ([ROADMAP §12](ROADMAP.md#12-the-engelbart-mouse-and-chorded-keyset)). Flex thresholds have
  hysteresis, and the interpreter decides when a chord is complete, so a finger moving slowly
  doesn't type the chords in between.
- **Interpreter: the mouse hand.** The hand holds a virtual Engelbart mouse. Its position moves
  the mouse, and its rotation turns the mouse body. The simulation keeps the original's two
  wheels at right angles: each wheel reports only motion along its own rolling direction, in
  the body's frame, so a turned mouse moves the cursor at an angle the way the real one did.
  Three finger curls are its three buttons.
- **The picture.** Photorealistic 3D models of the keyset and the mouse, measured from Don's
  pair, sit under the tracked hands: keys go down under the fingers, and the wheels turn as the
  mouse moves.
- **Bindings.** The interpreter outputs keyset chords and mouse motion and buttons, and every
  machine binds those its own way: on the PDP-7, chords as teletype characters and the mouse as
  the light pen; on the Apple ][, chords as keys at `$C000` and the mouse as `PDL(0)`, `PDL(1)`
  and PB0–PB2 ([ROADMAP §13](ROADMAP.md#13-emulation-mash-ups)). The same hands then work
  in the cabinet, in microM8 or in any emulator with those bindings.
- **Roles.** Keyset left and mouse right by default, as in the 1968 demo, and swappable.
  Handedness picks the role, but the two hands are tracked by continuity, so crossing them
  doesn't swap them ([HAND-TRACKING.md](HAND-TRACKING.md#later-two-hands-two-arrangements)).

Needed: two hands from the camera latched from one frame, the interpreter layer, the NLS chord
tables, the wheel simulation, and the 3D models. None of it is built; one-hand tracking and the
PDP-7 DataHand are.

## How a device reaches a machine

The binding uses whatever the architecture already has, and adds nothing the CPU plugin hasn't
agreed to:

- **I/O instructions**: PDP-7 IOTs on a free device code, marked as cabinet extensions, never
  used by stock software. Built for the DataHand (57), Turing engine (54) and Ultimate Machine (56).
- **Memory-mapped registers**: Apple ][ `$C0xx` soft switches and the game port; on the PDP-10,
  a device register mapped into a job's address space the way the DOOR server mapped the TV-11's
  ([MAPPING.md](MAPPING.md)).
- **Interrupts and flags**: the device raises an abstract event; the binding routes it to the
  CPU's interrupt line, skip flag or polling loop.
- **Serial ports**: anything that can be a character stream (a keyset's chords, Dasher's words)
  binds to a teletype or UART on any machine that has one.
- **Shared memory**: devices that work on memory (Turing engine, display devices) see it only
  through a `MemoryPort` and a shape (word size, packing), so the same engine runs on 18-bit,
  36-bit or 8-bit memory ([TURING-ENGINE.md](TURING-ENGINE.md#portability-any-host-any-memory-shape),
  [CORE-LINKS.md](CORE-LINKS.md)).
- **New instructions**, only when the CPU plugin binds them to valid, unused encodings and defines
  their effects. Machines with no room for them use the mechanisms above.

## Output devices are the same, in reverse

A display device reads a region of a machine's memory through a read-only link and draws it: a
frame buffer (RGBA or indexed), a tile engine (the Apple's text page from a character atlas, a
SimCity map from Micropolis's tile renderer), or a vector display list (the Type 340's). Each is
one abstract device configured by source, codec, output, layout and view, so the Apple ][ hi-res
page, the 340 and an invented heat map are the same kind of thing with different settings
([DISPLAY-DEVICES.md](DISPLAY-DEVICES.md)).

## Built and planned

**Built:**

- The hand is split into the first and third layers: `hand.ts`, the machine-free instrument
  (landmarks, flex, pinch), and `datahand.ts`, its PDP-7 binding as IOTs on device 57
  ([HAND-TRACKING.md](HAND-TRACKING.md)).
- The Turing engine is a portable device: it sees memory only through `MemoryPort` and a shape,
  with three adapters: a PDP-7 device, the whole cabinet's CPU, and no machine at all
  ([TURING-ENGINE.md](TURING-ENGINE.md)).
- The Type 340 runs as a vector display device reading the PDP-7's core.

**Not built:**

- The backplane's `Device` interface in `bus.ts` is still PDP-7-shaped (IOT select codes and
  pulses), so it's the binding layer for one architecture, not a general one.
- There's no separate interpreter layer yet. The DataHand's `GESTURES` are poses the synthetic
  demo hand acts out, not a recognizer; the one recognizer, `BIRD?`, is Forth running on the
  PDP-7 ([datahand.fs](tapes/pdp7forth/datahand.fs)).

**Planned, in order:**

1. An interpreter layer above the DataHand: gesture recognition (pinch, fist, point, open hand)
   with the recognizer swappable, then finger pie menus and wrist knobs, usable from any machine.
2. The Engelbart mouse and chord keyset as instruments, simulated first
   ([ROADMAP §12](ROADMAP.md#12-the-engelbart-mouse-and-chorded-keyset)).
3. A second binding for each instrument on the Apple ][: pointer as `PDL(0)`, `PDL(1)` and
   PB0–PB2, keyset chords as keys at `$C000` ([ROADMAP §13](ROADMAP.md#13-emulation-mash-ups)),
   through microM8's input calls ([MICROM8.md](MICROM8.md)).
4. The Turing engine on the Apple ][ with byte-pair words, then on the KA10 with SIXBIT.
5. Display devices beyond the 340: the Apple ][ text, lo-res and hi-res pages through the codec
   and tile renderer.
6. Device declarations and bindings in `cartridge.yml`, with binding code that only one emulator
   can use kept in that emulator's organelle
   ([UPCYCLING-FORMATS.md](UPCYCLING-FORMATS.md#organelles-nesting-without-flattening)).

## Why

A device written for one machine in one emulator is used once. Split into layers, one hand
tracker, one gesture recognizer or one display engine serves every machine the cabinet or its
peers can run, old programs get modern input without changing a word of them, and an
accessibility interface written once reaches all of it.

↑ [cabinet](README.md)
