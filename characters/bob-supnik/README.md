# Robert M. Supnik

*Public-work profile and invitation draft. This is not a simulation or an
assumption of consent.*

Robert M. Supnik created SIMH, the portable framework and family of simulators
for historically significant computer systems. SIMH's purpose is not just to
reproduce a processor: it makes historic software runnable and preserves the
machine behavior that software depends on. Supnik's papers document the SIMH
framework, DEC's 18-bit computer family, VAX microarchitecture, and the
practical work of restoring and simulating computing history.

## The PIXIE connection

The direct connection is the PDP-7 CPU in WWSFF's Cabinet emulator. Its
instruction semantics are ported from Open SIMH's
[`PDP18B/pdp18b_cpu.c`](https://github.com/open-simh/simh/blob/master/PDP18B/pdp18b_cpu.c),
which Supnik authored for the PDP-4/7/9/15 family. Cabinet's own source names
that file as its reference oracle. The port is adapted to TypeScript and scoped
to the programs and peripherals needed to run PIXIE; Cabinet is not SIMH
embedded in a browser.

The display is a separate lineage, and credit matters:

- **CPU model:** Supnik's PDP18B family implementation supplies the PDP-7
  instruction behavior.
- **Type 340 display processor:** Philip L. Budne wrote SIMH's
  [`display/type340.c`](https://github.com/open-simh/simh/blob/master/display/type340.c),
  a simulator-independent implementation of the 340's own instruction set.
- **XY display model:** Budne wrote the host-independent
  [`display/display.c`](https://github.com/open-simh/simh/blob/master/display/display.c),
  with revisions by Douglas A. Gwyn, building on Douglas W. Jones's PDP-8/E
  display emulator.
- **PDP-7/display interface:** Lars Brinkhoff's
  [`PDP18B/pdp18b_dpy.c`](https://github.com/open-simh/simh/blob/master/PDP18B/pdp18b_dpy.c)
  connects the PDP-7 IOTs to the Type 340 and its 341/342/347 options.
- **342 character shapes:** Brinkhoff also recovered additional Type 342 glyphs
  from MIT AI Lab film and the Knight TV font; SIMH's `chars[]` table records
  that provenance. Cabinet's display-character work builds on this recovery.
- **PIXIE evidence:** Heinz Lemke's PDP-7 program listing and the surviving
  Cambridge material determine what Cabinet needs to reproduce.

The Cabinet port follows that division rather than attributing the whole
emulator to one person. Its own source map records what was ported, what was
newly implemented, and what SIMH leaves stubbed.

## MIMIC → SIMH → Cabinet

The compact lineage is **MIMIC → SIMH → Cabinet**, with one important
distinction: each link inherits ideas and interfaces, not necessarily the same
implementation.

**MIMIC → SIMH:** SIMH's implementor documentation says its virtual-machine
interface is based on MIMIC's published specification, *How to Write a Virtual
Machine for the MIMIC Simulation System*, by Len Fehskens and Bob Supnik. The
historical account also credits Mike McCarthy in MIMIC's development. SIMH
turns that earlier framework lineage into a portable C system with many
machine models.

**SIMH → Cabinet:** Cabinet ports the PDP-7 and Type 340 behavior it needs from
SIMH, while deliberately narrowing the mission to a browser-based PIXIE
cabinet: corpus-bounded emulation, inspectable state, display-file provenance,
and light-pen interaction. The source map is
[`packages/cabinet/SIMH-MAP.md`](../../packages/cabinet/SIMH-MAP.md); the
emulator is described in [`packages/cabinet/README.md`](../../packages/cabinet/README.md).

In other words, the useful analogy is **emulator interface and accumulated
know-how passed forward**, with each generation choosing its own scope and
implementation. MIMIC is not a source-code ancestor of Cabinet, and Cabinet is
not a SIMH runtime.

## A personal thread

Don worked with Philip Budne at Sun and knew him through Usenet. That is a
first-person connection to one of the people in the Type 340 code's authorship
chain, not a claim that Don and Supnik already know one another. It gives the
conversation a human path into the technical question: how did individual
machine models, display models, and interfaces accumulate into a runnable
PIXIE-era system?

## The browser idea, in 2020

In March 2020, Don emailed Lars Brinkhoff after Lars added PDP-7 Type 340
support to SIMH. Lars clarified that Budne had written most of the PDP-6/10
display emulator and that he had added the PDP-7 parts. Don proposed compiling
the modular code with Emscripten, then integrating it with JavaScript and
Canvas; he also imagined a WebGL phosphor model and optional Type 347 radio
interference. That was a forward-looking proposal, not a shipped port. The
later Cabinet project took a PIXIE-bounded TypeScript route, but the
conversation already identified the major layers and browser questions.

## Conversation hooks

- What did Supnik carry forward from MIMIC when designing SIMH's virtual
  machine interface, and what needed to change for portability and a growing
  collection of machines?
- How should preservation balance architectural fidelity, runnable historic
  software, and explicit boundaries around unimplemented hardware?
- What does it mean for a TypeScript emulator to port a C reference model while
  changing the user experience and the scope of the machine?
- How do Supnik's CPU model, Budne and Gwyn's display core, Brinkhoff's PDP-7
  glue, and the PIXIE listing fit together without erasing each author's part?

## Sources

- Computer History Museum: [Robert Supnik oral history, part 1](https://www.computerhistory.org/collections/catalog/102738264/search/collection:oral-histories--keyword:vax/) and [part 2](https://www.computerhistory.org/collections/catalog/102740182/), with related [part 1 transcript](https://www.computerhistory.org/collections/catalog/102738263/) and [part 2 transcript](https://www.computerhistory.org/collections/catalog/102740181/).
- Supnik's [SIMH history and software archive](https://simh.trailing-edge.com/) and [papers on simulation and historic systems](https://simh.trailing-edge.com/papers.html).
- Supnik, [*Writing a Simulator for the SIMH System*](https://simh.trailing-edge.com/docs/simh.pdf), including the MIMIC interface lineage.
- The preserved [MIMIC source repository](https://github.com/PDP-10/MIMIC), an archival source rather than evidence of direct code reuse by Cabinet.
- Don/Lars 2020 correspondence: [Lars Brinkhoff correspondence](../lars-brinkhoff/correspondence.md).
- Open SIMH: [PDP18B CPU](https://github.com/open-simh/simh/blob/master/PDP18B/pdp18b_cpu.c), [Type 340](https://github.com/open-simh/simh/blob/master/display/type340.c), [XY display core](https://github.com/open-simh/simh/blob/master/display/display.c), and [PDP-7 display interface](https://github.com/open-simh/simh/blob/master/PDP18B/pdp18b_dpy.c).
- WWSFF: [`SIMH-MAP.md`](../../packages/cabinet/SIMH-MAP.md), [`GUIDE-PDP7.md`](../../packages/cabinet/reference/GUIDE-PDP7.md), and [`GUIDE-340.md`](../../packages/cabinet/reference/GUIDE-340.md).

↑ [Characters](../README.md) · [Invitation](invitation.md) · [Cabinet](../../packages/cabinet/README.md)