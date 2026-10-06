# Philip L. Budne

*Public-work profile and invitation draft. This is not a simulation or an
assumption of consent.*

Philip L. Budne is a Unix systems programmer, consultant, and long-running
tools-and-languages builder. His public resume records work at DEC on the
FORTRAN-10/20 compiler and runtime and advanced SAFE RISC work; systems
programming at Boston University's Distributed Systems Group; firmware and
networking at Shiva; and independent consulting from 1993 onward. His recent
public work spans portable SNOBOL4, networking, embedded systems, and
performance-sensitive Unix/Linux software.

## The display work

Budne's connection to PIXIE is not the PDP-7 CPU or its PDP-7-specific Type 340
I/O interface. It is the reusable display machinery between them:

- [`display/type340.c`](https://github.com/open-simh/simh/blob/master/display/type340.c)
  is Budne's simulator-independent model of the Type 340's own instruction set.
  The source says it began in 2003, came from the VT11 simulator, and models the
  340 proper rather than a particular host interface.
- [`display/display.c`](https://github.com/open-simh/simh/blob/master/display/display.c)
  is his host- and operating-system-independent XY display model, including
  phosphor persistence and point rendering. Its header credits revisions by
  Douglas A. Gwyn and says it started from Douglas W. Jones's PDP-8/E display
  emulator, `vc8e.c`.
- [`PDP18B/pdp18b_dpy.c`](https://github.com/open-simh/simh/blob/master/PDP18B/pdp18b_dpy.c)
  is the machine-specific layer: Lars Brinkhoff added the PDP-7's Type 340/341
  interface and options. Budne's model and Brinkhoff's glue are different jobs.

In a 2020 email, Brinkhoff put the collaboration plainly: Budne had done most
of the display-emulator work for the PDP-6/10, and Brinkhoff had added the
PDP-7 parts. That distinction is central to the PIXIE port. Cabinet's PDP-7
CPU is ported from Bob Supnik's `pdp18b_cpu.c`; its Type 340 semantics descend
from Budne's display model; SIMH's PDP-7 IOT integration is Brinkhoff's layer;
the target behavior comes from Heinz Lemke's PIXIE materials.

## Beyond the 340

Budne has also contributed to PDP-7 UNIX restoration. His resume describes
typing in and debugging/commenting the kernel and utilities, determining disk
layout, implementing PDP-7 assembler components and shell utilities, and
resurrecting the TMG compiler-compiler. The collaborative
[`pdp7-unix`](https://github.com/philbudne/pdp7-unix) project brings Unix back
from scans of its original assembly sources; it is not his solo project.

His language work includes the maintained C port of Bell Labs' Macro SNOBOL4
([`csnobol4`](https://github.com/philbudne/csnobol4)) and JavaScript's
[`spipatjs`](https://github.com/philbudne/spipatjs), an implementation of
SNOBOL/SPITBOL pattern matching. The common thread is practical systems craft:
recover a model or tool, make it portable, and keep the interfaces legible.

## A personal and technical thread

Don worked with Phil at Sun and knew him through Usenet. A 1986 FIGIL/Usenet
exchange preserves Budne asking for Forth recommendations for an Apple IIe
experiment-control project. Their professional overlap and online exchanges
make Budne a direct participant in this story, not a name added only from a
source-file header.

In March 2020, Don contacted Lars Brinkhoff about Open SIMH's new PDP-7 Type
340 support. Brinkhoff clarified the Budne/Brinkhoff split. Don then sketched a
browser direction: compile the modular emulator with Emscripten, integrate it
with JavaScript and Canvas, and model Type 340 phosphor with a WebGL shader,
even imagining RFI from the Type 347 as an optional experience. That was a
proposal, not the implementation that shipped. Cabinet later took a focused
TypeScript-port route, with explicit PIXIE provenance and a browser-native
interaction model.

## Conversation hooks

- How did the Type 340 emulator's boundary between processor semantics,
  phosphor/display behavior, and host glue make the code useful across several
  DEC machines?
- What did the PDP-7 UNIX recovery teach about reconstructing software from
  scanned listings, and how do its goals differ from a machine emulator?
- What was the Sun work like, and what did the Usenet/Forth community make
  possible for systems programmers working in public?
- Which parts of the 2020 browser proposal still feel right, and what changed
  when the project became a PIXIE-specific TypeScript emulator?

## Sources

- Budne's [resume](http://www.ultimate.com/phil/resume.html) and
  [chronological resume](http://www.ultimate.com/phil/reschron.html).
- Open SIMH sources: [Type 340 model](https://github.com/open-simh/simh/blob/master/display/type340.c),
  [XY display model](https://github.com/open-simh/simh/blob/master/display/display.c),
  and [PDP-7 display interface](https://github.com/open-simh/simh/blob/master/PDP18B/pdp18b_dpy.c).
- Budne's [PDP-7 UNIX work](https://github.com/philbudne/pdp7-unix),
  [CSNOBOL4](https://github.com/philbudne/csnobol4), and
  [SNOBOL pattern matcher](https://github.com/philbudne/spipatjs).
- WWSFF's [SIMH source map](../../packages/cabinet/SIMH-MAP.md),
  [PDP-7 guide](../../packages/cabinet/reference/GUIDE-PDP7.md), and
  [Type 340 guide](../../packages/cabinet/reference/GUIDE-340.md).
- 2020 correspondence and the Type 340/PDP-7 attribution: [Lars Brinkhoff correspondence](../lars-brinkhoff/correspondence.md).

↑ [Characters](../README.md) · [Invitation](invitation.md) · [Cabinet](../../packages/cabinet/README.md)