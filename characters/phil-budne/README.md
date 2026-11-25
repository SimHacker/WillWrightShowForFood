# Philip L. Budne

*Public-work profile and invitation draft. This is not a simulation or an
assumption of consent.*

Philip L. Budne is a Unix systems programmer, consultant, and builder of
language tools. His public resume records work at DEC on the
FORTRAN-10/20 compiler and runtime and advanced SAFE RISC work; systems
programming at Boston University's Distributed Systems Group; firmware and
networking at Shiva; and independent consulting from 1993 onward. His recent
public work spans portable SNOBOL4, networking, embedded systems, and
performance-sensitive Unix/Linux software.

## The display work

[Cabinet](../../packages/cabinet/README.md) is Don's PDP-7 emulator in TypeScript, running in the
browser ([live](https://hyperties.org/cabinet/), [source](../../packages/cabinet/src/)). It was
built to run [PIXIE](../../packages/cabinet/PIXIE-RESTORATION.md#what-pixie-is), the light-pen
graph editor [Heinz Lemke](../heinz-lemke/README.md), Neil Wiseman and John Hiles wrote at
Cambridge for a PDP-7 with a Type 340 vector display (published 1969). The program that survives
is SYMELEC, PIXIE's circuit-drawing program, from a listing assembled in 1972
([live](https://hyperties.org/cabinet/symelec/),
[how it works](../../packages/cabinet/reference/GUIDE-SYMELEC.md)).

Cabinet's Type 340 is based on Phil's work. Its display model,
[`src/plugins/type340.ts`](../../packages/cabinet/src/plugins/type340.ts), is ported nearly line
by line from his `type340.c` in SIMH, including the Type 342 character glyphs. Three pieces of
SIMH are involved, and Phil wrote the first two:

- [`display/type340.c`](https://github.com/open-simh/simh/blob/master/display/type340.c)
  is Budne's simulator-independent model of the Type 340's own instruction set.
  The source says it began in 2003, came from the VT11 simulator, and models the
  340 proper rather than a particular host interface.
- [`display/display.c`](https://github.com/open-simh/simh/blob/master/display/display.c)
  is his host- and operating-system-independent XY display model
  ([his page for it](https://www.regressive.org/phil/xy/): PDP-1 Type 30, PDP-11 VT11, and the
  340 on the PDP-6, on X11, MacOS and Win32), including
  phosphor persistence and point rendering. Its header credits revisions by
  Douglas A. Gwyn and says it started from Douglas W. Jones's PDP-8/E display
  emulator, `vc8e.c`.
- [`PDP18B/pdp18b_dpy.c`](https://github.com/open-simh/simh/blob/master/PDP18B/pdp18b_dpy.c)
  is the machine-specific layer: Lars Brinkhoff added the PDP-7's Type 340/341
  interface and options.

In a 2020 email, Brinkhoff wrote that Budne had done most of the display
emulator work for the PDP-6/10, and that he had added the PDP-7 parts
([correspondence](../lars-brinkhoff/correspondence.md)). Cabinet credits each part to its author
([SIMH-MAP.md](../../packages/cabinet/SIMH-MAP.md#credit)):

- The PDP-7 CPU, [`src/plugins/pdp7.ts`](../../packages/cabinet/src/plugins/pdp7.ts), is ported
  from [Bob Supnik](../bob-supnik/README.md)'s `pdp18b_cpu.c`
  ([PDP-7 guide](../../packages/cabinet/reference/GUIDE-PDP7.md)).
- The Type 340, [`src/plugins/type340.ts`](../../packages/cabinet/src/plugins/type340.ts), is
  ported from Budne's `type340.c` ([Type 340 guide](../../packages/cabinet/reference/GUIDE-340.md),
  [phosphor](../../packages/cabinet/reference/GUIDE-PHOSPHOR.md),
  [light pen](../../packages/cabinet/reference/GUIDE-LIGHTPEN.md)).
- The PDP-7 side of the display, the IOTs that connect the 340 to the CPU, is specified by
  SYMELEC's own listing. Brinkhoff's `pdp18b_dpy.c` matches its IOT map word for word, but its
  light pen and edge paths were stubs
  ([SIMH-MAP.md](../../packages/cabinet/SIMH-MAP.md#map-port-with-credit)).
- What PIXIE should do comes from Heinz Lemke's 1972 listing and his own accounts
  ([PIXIE-RESTORATION.md](../../packages/cabinet/PIXIE-RESTORATION.md)).

Cabinet also has a compiler that turns PDP-7 code into JavaScript
([KORZ-MACHINES.md](../../packages/cabinet/KORZ-MACHINES.md), [source](../../packages/cabinet/src/korz/)),
and runs PDP-7 UNIX ([live](https://hyperties.org/cabinet/unix/),
[UNIX-V0.md](../../packages/cabinet/UNIX-V0.md)) from the pdp7-unix project below. A PDP-10 KA10
running ITS is planned next ([PDP10.md](../../packages/cabinet/PDP10.md)), and it will use the
same Type 340 model on the KA10. The PDP-6 and PDP-10 are where Phil did most of SIMH's display
work.

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
SNOBOL/SPITBOL pattern matching.

## A personal and technical thread

Don knew Phil through Usenet and the mailing lists. A 1986 FIGIL/Usenet
exchange preserves Budne asking for Forth recommendations for an Apple IIe
experiment-control project; in 1990 Phil passed Don Rick Adams's FTP, and
asked to forward PizzaTool. See [correspondence](correspondence.md).

In March 2020, Don contacted Lars Brinkhoff about Open SIMH's new PDP-7 Type
340 support, and Brinkhoff explained who wrote which part. Don proposed a
browser version: compile the modular emulator with Emscripten, integrate it
with JavaScript and Canvas, and model Type 340 phosphor with a WebGL shader,
even imagining RFI from the Type 347 as an optional experience. Cabinet was
built differently: SIMH's C was ported to TypeScript, and the display draws on a canvas
([DESIGN.md](../../packages/cabinet/DESIGN.md)).

## His home page

[regressive.org/phil](https://www.regressive.org/phil/), "This Page is Lynx Friendly!", lists
his "Personal Fascinations" under the heading "The outmoded, the ill-fated, the overlooked,
the doomed, and other lost causes": computer software archeology, XY display simulation,
SNOBOL4, LIL (the Little Implementation Language), Finger, the PDP-10; and outmoded
transport: Evinrude and Johnson boats, steam power, airships, flying boats, the China Clipper,
the Martin Mars. His goal: "To someday, do six impossible things before breakfast." His
specialty: "wading into swamps that make most people turn and run."

It also collects his favorite keyboards ("Now with VT52 keyclick/buzzer sound file!!"),
classics such as DECWRL's *Measured Capacity of an Ethernet* and Spencer and Collyer's
*#ifdef Considered Harmful*, recipes, music, and the non-profit sites he built and maintains.
He has volunteered as a Jewish Big Brother: "It's the experience of two lifetimes!"

His [PDP-10 page](https://www.regressive.org/phil/pdp10/), [finger page](https://www.regressive.org/phil/finger.html)
and the rest are summarized in [sources/home-pages.md](sources/home-pages.md): the high-school
KA10 over an acoustic coupler, ITS as BUDD ("a typo that stuck"), BU's 2060 until October
1986, SAFE and VAST under Alan Kotok, and his ITS-style finger.

## Conversation hooks

- XY display simulation is on his own list of lost causes, and it's how Cabinet's 340 exists.
  What would he still change about it?
- LIL and Finger: what draws him to the small, overlooked tools?
- His VT52 keyclick file: should Cabinet's terminals (the Videx on the Apple II, the 340's
  keyboard) click?

- How did the Type 340 emulator's boundary between processor semantics,
  phosphor/display behavior, and host glue make the code useful across several
  DEC machines?
- What did the PDP-7 UNIX recovery teach about reconstructing software from
  scanned listings, and how do its goals differ from a machine emulator?
- What did the Usenet and FIGIL Forth community make possible for systems
  programmers working in public?
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

↑ [Characters](../README.md) · [Correspondence](correspondence.md) · [Invitation](invitation.md) · [Cabinet](../../packages/cabinet/README.md)