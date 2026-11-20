# apple2

The Korz Apple ][ and //e. Sibling of [pdp-7](../pdp-7/). apple1 comes later, for the historical machine.

The switch chip is [src/m6502](../../m6502/m6502.ts). It is the NMOS 6502, with a NES flavor that ignores decimal and a 65C02 flavor for the read-modify-write bus, and it passes SingleStepTests `6502/v1` including every bus cycle. The motherboard it resets into is [plus.ts](plus.ts): 48K of RAM, the `$C0` page, and a 12K ROM. The scanner in [scan.ts](scan.ts) is a function of the cycle, an undriven read returns its byte, and `picture` samples the same addresses. [lang.ts](lang.ts) is the 16K language card. [disk2.ts](disk2.ts) is the Disk II: a `.dsk`, `.do`, `.po` or 2MG goes in the drive, and the P6 ROM from microM8's `apple2-plus` profile boots it. With that ROM and no disk it reaches the Applesoft `]` prompt. A cartridge plugs into an expansion slot and claims `$Cn00`. The sea over this chip is [m6502.ts](../m6502.ts), and the compiler is [compile65.ts](../compile65.ts). The motherboard as its own sea is still design: [KORZ-DISPATCH.md](../../../KORZ-DISPATCH.md) steps 5 and 6. A whole-machine check writes a save, runs a stretch of ticks, and writes the save again ([SAVE-FILES.md](../../../SAVE-FILES.md)). microM8 is read at the ends of those stretches through the calls it already has.

Catalogs, WOZ, Wizardry, and Mind Mirror stay in [src/apple2](../../apple2/).

## A fast wait

`picture` paints the RAM as it is. The beam address is computed when an undriven read needs it.
[`runWatch`](pace.ts) runs the CPU for a stretch of Apple time and asks for a picture every so
many cycles. The move-in is that stretch, and the goal is to finish it as soon as the machine
can. The rung is whichever finishes it soonest. A DOS boot and an Applesoft loop both say the
switch. One picture per game second is the rate, from the angel's `frames`. The canvas keeps
the last picture. The speaker stays `speaker` and `speakerClicks`. Samples are made for time
played at the Apple's own speed. A fast stretch adds none.

The machine being built here is the ][+. Eighty columns is the Videx card. The screen angel's
looks are cut from the frame this page paints, so they match the Korz picture. microM8 stays
in the menu as the oracle and comes last. The menu is the compiler, the resolver, the
interpreter, the switch, and microM8, and it opens on the compiler. Text is the motherboard character generator, `roms/apple2/chargen.rom`. The motherboard
ROM and the Disk II ROM are the other two files there. A cartridge names another character
ROM with `chargen`, 64 glyphs of 8 bytes, the low 7 bits, bit 0 at the left.
Hi-res color is the ][+ rule.
