# Emulation roundtable

*Show proposal, status seed. Nobody listed has been asked yet; every name here is an invitation, not
a booking.*

The people who keep old machines running, together: the authors of emulators, the people who read
the old media and scan the manuals they run from, and the people who argue for emulation as the way
to preserve software. One question runs through it: **what does an emulator owe the person using
it?** Fidelity first, everyone agrees. Then what? A debugger that runs backwards, a network, a
screen reader, a 3D view of a 1980 screen, a way for one machine to talk to another?

## Who

| Guest | Why | Room |
|---|---|---|
| April Ayres-Griffiths | microM8: the "upcycling" Apple ][ emulator, live rewind, reverse debugger, MCP server | [room](../../characters/april-ayres-griffiths/README.md) |
| Melody Ayres-Griffiths | Paleotronic Magazine; turtleSpaces, Logo in 3D | [room](../../characters/melody-ayres-griffiths/README.md) |
| Bob Supnik | SIMH, the framework most historic-machine simulators grew from | [room](../../characters/bob-supnik/README.md) |
| Lars Brinkhoff | ITS and the PDP-10 running again; the Type 340 phosphor simulator | [room](../../characters/lars-brinkhoff/README.md) |
| David Rosenthal | Emulation as a preservation strategy (his 2015 Mellon report); the Cambridge PDP-7 | [room](../../characters/david-rosenthal/README.md) |
| Al Kossow | bitsavers, the manuals everyone's emulators are built from; reading old tapes | [room](../../characters/al-kossow/README.md) |
| Jason Scott | The Internet Archive's in-browser emulation, from 2013 to more than 250,000 programs | [room](../../characters/jason-scott/README.md) |
| Thomas Cherryhomes | FujiNet: real 8-bit machines on the network, and emulators that join them | [room](../../characters/thomas-cherryhomes/README.md) |
| Mitch Bradley | Forth on the PDP-7, built and tested under SIMH; Open Firmware | [room](../../characters/mitch-bradley/README.md) |
| Brian Silverman | The PDP-1 Spacewar! emulator; transistor-level 6502 and 4004 | [room](../../characters/brian-silverman/README.md) |

Also wanted, no rooms yet: Will Scullin (apple2js), Chris Torrence (Apple2TS), Norbert Landsteiner
(masswerk's Spacewar! and other in-browser machines), Alexey Slyusar (Logo Adventure on LLOGO under
ITS).

## Episodes

A roundtable of ten is a meeting, not a show, so this is a series with a few shared threads.

1. **What an emulator owes you.** April, Melody, Lars, Bob. Fidelity, then upcycling: microM8's 3D
   screen and rewind, SIMH's breadth, ITS as a social network again, the cabinet's accessible
   teletype. Each guest shows one feature they'd want every emulator to have.
2. **The federation, live.** April, Melody, Thomas, Lars. A PDP-7 running Forth, an Apple ][ in
   microM8 and ITS on a PDP-10, side by side, talking through
   [tiny-titan](../../packages/cabinet/TINY-TITAN.md#the-hub-for-every-emulator). The first demo:
   Forth builds a PIXIE ring, tiny-titan turns it into Logo, microM8's 3D turtle draws it. Then
   FujiNet brings a real machine in.
3. **Emulation is preservation.** David, Al, Jason, Bob. David's argument that emulation is how
   software survives; Al reading the tapes and scanning the manuals; Jason putting it in a browser
   for everyone; what licenses, ROMs and the §1201 exemptions still block.
4. **From the listing up.** Mitch, Al, Lars, Brian. Restoring software from printouts and scans:
   PIXIE from its 1972 listing, Forth assembled in the page, Spacewar! running its original PDP-1 code.
5. **Logo, then and now.** Melody, April, Brian, with Cynthia Solomon if she'd like. The ITS turtle,
   Apple Logo II, turtleSpaces; Logo Adventure in Apple Logo and in LLOGO side by side.

## What the repository gets

- A shared vocabulary for emulators to talk: the messages tiny-titan carries, written up so any
  emulator can join, and translators for the ones that already have APIs (microM8's MCP server).
- A page per guest's emulator in the cabinet's [WEB-BENCH](../../packages/cabinet/WEB-BENCH.md),
  checked by them.
- The license question settled for the cabinet, with their advice: what would let their code and
  formats live in the federation as themselves
  ([MANIFESTO](../../packages/cabinet/MANIFESTO.md#a-federation-of-emulators-after-microm8)).

## Seeds

- [MANIFESTO](../../packages/cabinet/MANIFESTO.md): microM8 credited; the federation.
- [PRESERVATION.md](../../packages/cabinet/PRESERVATION.md): David's report, read in full.
- [`@wwsff/sunos-bar`](../../packages/sunos-bar/README.md): a reader for a tape Al recovered.
- [Thomas Cherryhomes show](../thomas-cherryhomes/README.md) and [Lars Brinkhoff show](../lars-brinkhoff/README.md):
  the existing pair proposals this extends.

↑ [repo-shows](../README.md)
