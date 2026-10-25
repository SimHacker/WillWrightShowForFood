# April Ayres-Griffiths 🌈

Invitation portrayal — **not** April Ayres-Griffiths. [Standards](../../schemas/portrayal-standards.md)

**Field:** emulation, programming languages, Logo, Go

[Invitation](invitation.md) · [Hooks](ideas.md) · [Sources](CHARACTER.yml)

## Who she is

April Ayres-Griffiths is the technical director of Paleotronic, the retro-technology magazine and
software studio she runs with [Melody Ayres-Griffiths](../melody-ayres-griffiths/README.md) in
Victoria, Australia. She designed and programmed **microM8**, the Apple ][ emulator, and
**tapDancer**, an Android app that plays back 1980s home computer cassettes. She learned to code
on a Commodore 64 as a teenager, earned a Bachelor of Computing at La Trobe University in Bendigo,
and has worked for Bendigo Bank, National Australia Bank and the Melbourne print-software firm
PaperCut. Paleotronic's crew page calls her "an informal Golang evangelist," and microM8 is written
in Go ([Meet the Crew](https://paleotronic.com/about/meet-the-crew/)).

## What she built

[microM8](https://paleotronic.com/software/microm8/) runs the Apple ][, ][+ and //e, and then
"upcycles" them:

- graphics in 3D and HD, with cameras you can move, rendered in LED, raster or voxel styles;
- live rewind, and freeze and thaw of a running machine;
- a web-based reverse debugger with trace recording, speed control and memory heat maps (2018);
- an Epson FX-80 printer that prints to colour PDF, a virtual modem for calling BBSes, Mockingboard
  with a six-channel tracker;
- Applesoft and Apple Logo rewritten in Go with 3D modes and new commands;
- microPAK, one file that dresses an old program with new colours, music, backdrops and controls;
- an HTTP API, and since 2025 an MCP server, so another program or an AI can drive it
  ([KansasFest 2025 talk](https://www.youtube.com/watch?v=Jrkq8Mhww70)).

Its source was published under the MIT license in September 2025
([paleotronic/microm8-cln](https://github.com/paleotronic/microm8-cln)). With Melody she also makes
[turtleSpaces](https://turtlespaces.org/), a 3D Logo based on and compatible with Apple Logo II,
and cyanIIde, a web-based Apple //e. Paleotronic's disk-image tool diskM8 is GPL-3.

## Why she's here

microM8 is the inspiration for much of the cabinet's attitude: an emulator owes the person using it
more than fidelity ([MANIFESTO](../../packages/cabinet/MANIFESTO.md#a-federation-of-emulators-after-microm8)).
Its microPAK is the nearest thing to the cabinet's cartridge, and its MCP server makes the first
federation demo possible: Forth on an emulated PDP-7 sending PIXIE rings through tiny-titan to
microM8's 3D Logo turtle ([TINY-TITAN.md](../../packages/cabinet/TINY-TITAN.md#first-demo-pixie-rings-to-microm8s-3d-turtle)).

In November 2018, when Alexey Slyusar ported Don's 1980s Logo Adventure to LLOGO on ITS, April
explained in the [PDP-10/its issue](https://github.com/PDP-10/its/issues/1268) how to move Logo
source into an emulated Apple ][: paste it at the Logo prompt with Ctrl-Shift-V in microM8, then
`SAVE`. Melody had just ported the same game to Apple Logo
([her port](../melody-ayres-griffiths/sources/logo-adventure-apple-logo-2018/README.md)).

## Connections

- [Melody Ayres-Griffiths](../melody-ayres-griffiths/README.md): Paleotronic, turtleSpaces.
- [Cynthia Solomon](../cynthia-solomon/README.md) and [Brian Silverman](../brian-silverman/README.md):
  Logo; turtleSpaces is based on LCSI's Apple Logo II.
- [Lars Brinkhoff](../lars-brinkhoff/README.md): the PDP-10/its repository where the Logo Adventure
  thread ran.
- [Thomas Cherryhomes](../thomas-cherryhomes/README.md): FujiNet puts real Apple ][s on the
  network; microM8 and the cabinet put emulated ones there.
- [Emulation roundtable](../../repo-shows/emulation-roundtable/README.md): the show proposal.

↑ [characters](../README.md)
