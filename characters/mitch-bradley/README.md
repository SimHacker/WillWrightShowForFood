# Mitch Bradley 🥾

Invitation portrayal — **not** Mitch Bradley. [Standards](../../schemas/portrayal-standards.md)

**Field:** firmware and Forth; Open Firmware; the OLPC XO

[Invitation](invitation.md) · [Hooks](ideas.md) · [Sources](CHARACTER.yml)

## Who he is

Mitch Bradley joined Sun Microsystems when it was about six months old. He started as a hardware
designer, building SCSI and Ethernet interfaces, and became the person who could debug the whole
system, using a Forth environment he had built for hardware diagnostics. Around 1987 Andy
Bechtolsheim asked him for smaller firmware for the design that became the SPARCstation 1, and he
wrote OpenBoot. A Sun machine's boot monitor was a Forth interpreter: you could type at it, probe
the hardware, and load drivers written in FCode, a processor-independent bytecode, from the cards
themselves.

OpenBoot became IEEE 1275-1994, Open Firmware. Sun used it, Apple used it in PowerPC Macs, and IBM
used it in PowerPC servers. Its device tree, which describes a machine's hardware to the operating
system, is still how Linux learns about the hardware on many systems. Mitch represented Bradley
Forthware on X3J14, the ANS Forth committee, as acting Vice-Chair. He founded
[FirmWorks](http://firmworks.com/) to support Open Firmware on other platforms.

In 2006 he joined One Laptop per Child and wrote the XO's firmware, replacing LinuxBIOS with Open
Firmware, a register initialization table and about fifty lines of assembly
([2008 interview](https://web.archive.org/web/20120118132847/http://howsoftwareisbuilt.com/2008/03/27/interview-with-mitch-bradley-firmware-olpc/)).
His [Open Firmware](https://github.com/MitchBradley/openfirmware) and
[CForth](https://github.com/MitchBradley/cforth) are on GitHub, and he is the top contributor to
the FluidNC CNC firmware.

In September 2026 he wrote a [Forth for the DEC PDP-7](https://github.com/MitchBradley/pdp7forth),
with turtle graphics on the Type 340 display, in a day, using Claude Code. His note: "PDP-7 turns
out to be an amazingly good target instruction set for Forth." The inner interpreter's NEXT is
three instructions.

## Why he's here

Mitch hired Don as a summer intern at Sun in 1987 to put pie menus and Forth into CADroid, a
schematic editor from Lucasfilm. He suggested the name "pie menu." Don's pie menu experiments ran in
a window manager whose main loop was rewritten in Mitch's Forth, HyperTIES at Maryland ran on it,
and it compiled the rules for Don's CAM6 simulator. Don's memory allocator is still in Open
Firmware. Mitch's PDP-7 Forth now runs in the [cabinet](https://hyperties.org/cabinet/forth/), on
the same kind of machine PIXIE and UNIX ran on.

## Cast neighbors

| Who | Why |
|-----|-----|
| [Charles Moore](../charles-moore/) | Invented Forth |
| [Heinz Lemke](../heinz-lemke/) | PIXIE on the Cambridge PDP-7 |
| [David Rosenthal](../david-rosenthal/) | Sun; the Cambridge PDP-7 |
| [James Gosling](../james-gosling/) | NeWS at Sun |
| [Walter Bender](../walter-bender/) | One Laptop per Child |
| [Norman Margolus](../norman-margolus/) | CAM-6, whose rules Mitch's Forth compiled |
| [Mike Gallaher](../mike-gallaher/) | The pie menu name |
| [Bob Supnik](../bob-supnik/) | SIMH |

Subject may request correction or removal anytime.

↑ [characters](../)
