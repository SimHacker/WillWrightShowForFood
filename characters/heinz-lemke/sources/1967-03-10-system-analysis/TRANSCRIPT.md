# Transcript — Problems of Systems Analysis of Computer Aided Circuit Design with Display Unit

**Author:** Heinz U. Lemke, age 25 · **Date:** 10 March 1967
**Original:** handwritten, blue ink on lined A4, 7 leaves, internally numbered 1–4
**Scan:** [`PIXIE-System-Analysis-Original-HULEMKE.pdf`](PIXIE-System-Analysis-Original-HULEMKE.pdf) · page images in [`pages/`](pages/)
**Provenance + analysis:** [`README.md`](README.md) · **Images + text side by side:** [`FACSIMILE.md`](FACSIMILE.md)

Transcription conventions: original spelling preserved (`complexicity`, `excisting`, `wether`,
`includ`); `[?]` marks uncertain readings; `✗` marks Heinz's marginal X marks; page breaks follow
the scan (leaf N = `pages/page-0N.png`), with Heinz's own page numbers noted where written.

---

## Leaf 1 (numbered "1", dated "10th March 67")

> **PROBLEMS OF SYSTEMS ANALYSIS OF COMPUTER AIDED CIRCUIT DESIGN**
> **WITH DISPLAY UNIT**
>
> It is assumed that the system works on a shared memory basis of Control Computer and
> Central Computer. In the design of a display system for CAD the following features should
> receive attention:
>
> a) Preceding the design stage of the system a thorough analysis of the hardware and
> software should be undertaken.
>
> b) Hardware design should not limit programmer's flexibility
>
> Hardware and software can be grouped into:
>
> **Hardware**
>
> 1.) Control Computer
> 2.) Display Unit
> 3.) Central Computer
> 4.) Interface

**System block diagram** (hand-drawn, captioned "SYSTEM BLOCK DIAGRAM"):

- **CENTRAL COMPUTER** — candidate machines listed beside the box: `7094`, `110Z`[?],
  `1900 ser`[?], `SYS.4`, `4100`, `360`
- connected via **INTERFACE** to
- **CONTROL COMPUTER** — `XL12` or `PDP-8` / `PDP-4`[?] / `ARGUS`
- which drives **CONSOLE** (`PLESSEY`) and **DISPLAY** (`IBM 2250`, `DEC-340`, `GE 760`)

> **Software**
>
> 1.) Softw. for Control C. ← display / console / pre-processing
> 2.) Softw. for Central C. ← analysis / processing.

## Leaf 2 (unnumbered)

> **Systems Hardware**
>
> **1.) Control Computer**
>
> This computer could be a XL12 with 8K to 16K 24 bit words which provides:
>
> a) System control (executive program)
> b) System memory
> c) Calculation of subroutines
> d) Graphics handling routines
> ✗ e) Circuit modelling routines
>
> The coupling to the other elements of the system can be carried out by three
> bi-directional real time data channels. The amount and rate of data which must pass
> between the control computer and central computer have to be sufficiently low to to
> enable standard common carrier communication facilities to be used, e.g. not more than
> 2400 Baud.
>
> Peripheral equipment should includ a tape punch and read[er].

## Leaf 3 (numbered "2")

> **2) Display unit**
>
> This could be a digital controlled CRT display with 1024 by 1024 points representing an
> image of 10" square with alphanumeric and graphic capability. Depending on complexicity
> of circuits a vector length of 127 dots seemed to be sufficient and the generation time
> per point should be about 1 to 2 µs. The phosphorescence time should reduce flickering
> but not restrain dynamic changes in display.

Marginal note in a lighter hand beside that paragraph:

> — how about steered beams?

> The display unit shares the control computers memory. The number of units can be
> augmented if required. A great number of displays simultaneously in operation insures
> more economical use of central computer time.
>
> **Console**
>
> The communication devices for the operation of the system should contain:
>
> **Man to Machine:**
>
> 1.) Keyboard for manual input and overall job control
> 2) Light pen
> 3) Rand tablet
>
> **Machine to Man**
>
> 1.) CRT
> 2.) Lights under program control, mounted in the switches
> 3.) Small noise making devices, operated by relays under program control

## Leaf 4 (unnumbered)

> **3.) Central Computer**
>
> The user is primarily concerned with the software facilities on the central computer.
> But the hardware needed for circuit analysis programs on a time shared basis should
> contain:
>
> 1.) 32K core storage 48 to 64 bit word length
> 2) Input/output buffer channels
> 3) 10 magnetic tape units
> 4) Card reader and punch
> 5) Line printer
> 6) Paper tape punch and reader
>
> and a variety of programming languages.
>
> The **interface** transfers data between the control computer and central computer. On
> the control computer side, the interface accesses memory via the data interrupt system
> and on the central computer side it is connected to a pair of input/output buffer
> channels.

## Leaf 5 (numbered "3")

> **Systems Software**
>
> **1.) For Control Computer**
>
> a) EXECUTIVE is an interrupt-activated display system monitor which depends on periodic
> interrupts to initiate regular checks on the system status. This program supervises and
> handles interrupts, pushbuttons, lights, knobs, and the display.

**Flowchart** (hand-drawn event loop):

```
ENTER
  │
  ▼
ANY INTERRUPT? ──YES──▶ calls for work program
  │ NO                   such as calculation subroutines,
  ▼                      graphic handling routines,
ANY INTERRUPT            circuit modelling routines etc.
PROGRAM TO
FINISH ──Y──▶ RESUME
  │ N
  ▼
ANY NEW PROG
HAS TO BE STARTED ──▶ START IT
NOW
  │
  ▼
ANY STAND BY WORK
OR MAINTENANCE ──▶ START IT
OR DIAGNOSTIC W.
  │
  └──────▶ (loop back to ANY INTERRUPT?)
```

> R-T progr. { b) Graphics handling routines / c) Circuit modelling routines } —
> relocatable subroutines which reside in memory only when loaded
>
> All programs are written in machine-language. It should be investigated wether the 24
> bit word length of the XL12 requires programming in word pairs or wether individual
> instruction without concern about the modes of adjacent instruction are possible.

## Leaf 6 (unnumbered)

> **2) For Central Computer**
>
> Time-sharing environment and special requirements for Display Units impose special
> programing requirements upon analysis and systems monitor program (EXECUTIVE) within
> time-shared facilities.
>
> If the analysis time on a problem is long and the number of simultaneous users large
> the following features are necessary for an efficient system:
>
> a) Monitor of the analysis as it proceeds
> b) Computational sequence must be alterable
> ✗ c) Stopping of analysis at will
> d) Pseudo-random point selection
> e) All data should be retained
> ✗ f) Queuing priority
> ✗ g) Library facilities for mutual sharing of device models
>
> A 32K 48 bit words for floating point arithmetic central computer on time shared basis
> could fulfill these requirements.
>
> ✗ As it is not practical to interrupt the central computer during the execution of
> another customers job, the average job execution time of the computer should not exceed
> 2 min. On the other hand the core storage requirements for a circuit analysis
> computation does hardly permit access for other users to the central computer.
> Therefore further investigations should resolve the efficient usage of the idle time of
> the computer during the circuit designers contemplation time of the problem.

## Leaf 7 (numbered "4")

> The EXECUTIVE program can be supplied of the manufacturer but will be very generalized,
> so many users write their own EXECUTIVES.
>
> Other points for the investigations are:
>
> a) further analysis and development of excisting analysis programs.
>
> This could include nonlinear extensions of ECAP for d-c and transient analysis using
> Newton-Raphson and Quasi-analytic methods,
>
> b) special purpose programs
>
> such as simulation of MOST-circuits ✗
>
> These programs are likely to be written in FORTRAN or Algol and require approx. 10K to
> 32K words of storage.
>
> This general CAD display system is very flexible and can be adopted to different
> purposes via programming.

---

↑ [1967 doc README](README.md) · [character README](../../README.md) · [thread](../2026-07-24-pixie-storyline-thread.md)
