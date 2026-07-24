# PIXIE System Analysis — 10 March 1967

Heinz Lemke's handwritten pre-PIXIE design document: *Problems of Systems Analysis of
Computer Aided Circuit Design with Display Unit*. Seven leaves, blue ink, internally
numbered 1–4. His "first thoughts for working on modelling and HCI" — written at age 25
after a year as an extra-mural student at the Institute of Computer Science, University
of London.

| File | What |
|------|------|
| [`FACSIMILE.md`](FACSIMILE.md) | **Start here** — page images + transcription side by side, readable |
| [`PIXIE-System-Analysis-Original-HULEMKE.pdf`](PIXIE-System-Analysis-Original-HULEMKE.pdf) | Original scan as received from Heinz (7 pages, image-only) |
| [`pages/page-00.png` … `page-06.png`](pages/) | Per-page rasters (200 dpi) used for transcription |
| [`thumbs/page-00.jpg` … `page-06.jpg`](thumbs/) | 480px thumbnails embedded in FACSIMILE.md |
| [`TRANSCRIPT.md`](TRANSCRIPT.md) | Faithful full transcription only, original spelling preserved |

## Provenance

- Written **10 March 1967**; presented to **Maurice Wilkes** that same March.
- Became the basis for Heinz's talk at the Cambridge University Mathematical Laboratory
  on **29 June 1967** — the effective start of the PIXIE project — after which Wilkes
  offered him a PhD place. See [1967 — Back to the Roots, Part 1](../1967-back-to-the-roots-part1.md).
- Digitized by Heinz and emailed **24 July 2026** ("AW: PIXIE/Rainbow, Sketchpad, and
  Object-Oriented Design") — see [thread doc](../2026-07-24-pixie-storyline-thread.md).
- Heinz's own framing: he received his copy of Engelbart's *Augmenting Human Intellect*
  (1962) only in 1969, so this was written without knowledge of it. "From then onwards,
  I felt like a pixie in the company of giants."

## What's in it (and why it matters)

Five pages of prose plus a system block diagram and a hand-drawn control-flow chart. For
a 1967 document by a 25-year-old, the anticipations are striking:

- **Satellite + central computer architecture.** Control computer (8–16K, 24-bit; XL12
  or PDP-8 / ARGUS candidates) handles display, console, and pre-processing; central
  computer (32K, 48–64-bit, time-shared) runs the analysis. This is exactly the
  **PDP-7 ↔ Titan** split PIXIE was built on two years later — and the DSHR "terminal
  vs. not-a-terminal" debate in the [July 2026 thread](../2026-07-07-pixie-trio-thread.md)
  is prefigured here: the control computer was always meant to own real data structures,
  not just refresh a screen.
- **The EXECUTIVE flowchart is an event loop.** An "interrupt-activated display system
  monitor" that "supervises and handles interrupts, pushbuttons, lights, knobs, and the
  display," dispatching work programs and resuming interrupted ones — a 1967 sketch of
  the interactive event-driven main loop, drawn before that pattern had a name.
- **Input devices: keyboard, light pen, RAND tablet.** The RAND tablet as a listed
  console option in March 1967 connects directly to Alan Kay's 2020 remark (in
  [from-alan-kay.yml](../../from-alan-kay.yml)) about wishing PIXIE had used a tablet
  instead of a light pen.
- **Output beyond the CRT:** "lights under program control, mounted in the switches" and
  "small noise making devices, operated by relays under program control" — programmatic
  audio feedback in the console spec.
- **Time-sharing economics of interaction.** Job slices under 2 minutes; and the closing
  research question — how to use "the idle time of the computer during the circuit
  designer's contemplation time of the problem" — is the interactive-computing
  utilization argument of Licklider and Corbató, arrived at independently from the
  circuit-design side.
- **Shared model libraries:** "library facilities for mutual sharing of device models" —
  users pooling reusable component models on the central machine.
- **MOST-circuit simulation** (MOS transistors) and nonlinear ECAP extensions via
  Newton-Raphson as target applications, in FORTRAN or Algol at 10–32K words.
- **Design principle (b):** "Hardware design should not limit programmer's flexibility."

Period hardware named: IBM 7094, ICT 1900 series, System 4, Elliott 4100, IBM 360
(central candidates); IBM 2250, **DEC 340** (the display PIXIE actually got), GE 760
(displays); Plessey console. The XL12 control-computer candidate is very likely the
Plessey XL12 process-control machine — Heinz was working in the Plessey orbit at the
time (see the Plessey spy-accusation story in [Back to the Roots](../1967-back-to-the-roots-part1.md)).

A marginal note in a lighter hand on leaf 3 — "how about steered beams?" — reads like a
reviewer's question; plausibly from the March 1967 presentation round. Worth asking Heinz
whose hand it is.

## Show use

- Opening artifact for the PIXIE origin-story segment: the actual pages Wilkes saw
  before offering the PhD. Pan across the EXECUTIVE flowchart while Heinz narrates.
- Side-by-side beat: this 1967 spec vs. the shipped 1969 PIXIE (PDP-7 + DEC 340 + light
  pen) vs. Engelbart 1962 — independent convergence, then contact in 1969.
- Companion to the [PIXIE assembler source recovery](../../pixie-source-recovery.md):
  the EXECUTIVE described here in prose is what the 5000-word listing implements.

↑ [character README](../../README.md) · [pull-in-gaps](../../pull-in-gaps.md) · [PIXIE show](../../../../repo-shows/pixie-pie-menus-pdp7.yml)
