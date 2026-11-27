# apple2

The Korz Apple ][ and //e. Sibling of [pdp-7](../pdp-7/). apple1 comes later, for the historical machine.

The switch chip is [src/m6502](../../m6502/m6502.ts). It is the NMOS 6502, with a NES flavor that ignores decimal and a 65C02 flavor for the read-modify-write bus, and it passes SingleStepTests `6502/v1` including every bus cycle. The motherboard it resets into is [plus.ts](plus.ts): 48K of RAM, the `$C0` page, and a 12K ROM. The scanner in [scan.ts](scan.ts) is a function of the cycle, an undriven read returns its byte, and `picture` samples the same addresses. [lang.ts](lang.ts) is the 16K language card. [disk2.ts](disk2.ts) is the Disk II: a `.dsk`, `.do`, `.po` or 2MG goes in the drive, and the P6 ROM from microM8's `apple2-plus` profile boots it. With that ROM and no disk it reaches the Applesoft `]` prompt. A cartridge plugs into an expansion slot and claims `$Cn00`. The sea over this chip is [m6502.ts](../m6502.ts), and the compiler is [compile65.ts](../compile65.ts). The motherboard as its own sea is designed but not built: [KORZ-DISPATCH.md](../../../KORZ-DISPATCH.md) steps 5 and 6. A whole-machine check writes a save, runs a stretch of ticks, and writes the save again ([SAVE-FILES.md](../../../SAVE-FILES.md)). microM8 is read at the ends of those stretches through the calls it already has.

Catalogs, WOZ, Wizardry, and Mind Mirror stay in [src/apple2](../../apple2/).

## The panel at $C041

The Apple has no front panel, so the cabinet adds one that needs no slot: `$C041`–`$C04F`, fifteen bytes, 120 bits. Every bit is both a switch and a light. The program sets bits with `STA` or `POKE -16319,n` and reads them with `LDA` or `PEEK(-16319)`; the person flips one with a click in the CPU panel; either sees what the other did. On a ][ or ][+ nothing answers there but `$C040`, the game port's strobe, which stays the strobe, and an undriven read only returned the scanner's byte, so no program can have counted on these addresses. A //c has its mouse at `$C048` and a IIgs its interrupts and mouse at `$C041`–`$C047`, so this is the cabinet's ][+, not a standard.

| Address | BASIC | Bits |
|---|---|---|
| `$C041` | `-16319` | 0–7 |
| `$C042` | `-16318` | 8–15 |
| … | … | … |
| `$C04F` | `-16305` | 112–119 |

A read drives the byte and changes nothing, so a 6502's dummy reads of an indexed `STA` are harmless. A write latches the data bus. `INC` counts on the lights and `ROL` chases them; the NMOS double write of a read-modify-write shows the old byte for one cycle. A program that reads a byte, changes one bit and writes it back can undo a click that lands between its read and its write; a few cycles, at the speed of a person's hand. The bits stay through a reboot, as switches would. The bus dance folds all 120 into the word the PDP-7's switches give it (`switchWord` in dance.ts), so any bit set twists the music. Later the bits are the pins for wires and breadboards.

## Looking at memory

The page's MEM panel is the PDP-7 memory panel's three views for the 6502: hex, eight bytes a line with their ASCII; code, an instruction a line from [disasm65.ts](../../m6502/disasm65.ts); and trace, the last instructions run with the A, X, Y, P and S each found ([trace65.ts](../../m6502/trace65.ts)). Addresses are named from [symbols.ts](symbols.ts): the Monitor's zero page, page 3's vectors, the soft switches, the panel, and the ROM's entry points, each checked to start a documented instruction in the ][+ ROM. The disassembler's 256 opcode lengths and its documented set are checked against the Korz sea's. The panel reads with `peek`, so looking never touches a soft switch. The trace records only while it shows; the compiler then runs one instruction at a time, as the PDP-7's does. Code arrives without source; source maps come with the 6502 assembler (ASSEMBLERS.md).

## A fast wait

`picture` paints the RAM as it is. The beam address is computed when an undriven read needs it.
[`runWatch`](pace.ts) runs the CPU for a stretch of Apple time and asks for a picture every so
many cycles. Little Computer People's move-in is such a stretch, and it should finish as soon
as the machine can. The rung to use is whichever finishes it soonest; on a DOS boot and an
Applesoft loop, that is the switch. Pictures come at one per game second, the rate set by the
screen angel's `frames` ([UPCYCLING-LCP.md](../../../UPCYCLING-LCP.md#the-screen-angel)). The
canvas keeps the last picture. The speaker stays `speaker` and `speakerClicks`. Samples are made for time
played at the Apple's own speed. A fast stretch adds none.

The machine being built here is the ][+. Eighty columns come from the Videx card. The screen angel's
looks are cut from the frame this page paints, so they match the Korz picture. microM8 stays
in the menu as the oracle and comes last. The menu is the compiler, the resolver, the
interpreter, the switch, and microM8, and it opens on the compiler. Text is the motherboard character generator, `roms/apple2/chargen.rom`. The motherboard
ROM and the Disk II ROM are the other two files there. A cartridge names another character
ROM with `chargen`, 64 glyphs of 8 bytes, the low 7 bits, bit 0 at the left.
Hi-res color follows the ][+ rule.

## Music seeds, and the page's address

The panel's 15 bytes are the Apple's music seed: the dance folds them into its twist (skew,
phase, effects), and the style comes from the person's menu or the prompt. In the Dance node,
Music seed copies them as a `panel:` line for an app in
[APPS.yml](../../../disks/apple2/APPS.yml) (30 hex digits, quoted so YAML keeps them a
string) or as a link, pastes one back, and keeps named favorites in this browser. Each app
has its own seed, random for now, for its author to choose later.

The page reads two parameters at power on (`PAGE_PARAMS` in the catalog's launch.ts):

- `?seed=` the 30 hex digits, put in the panel before the first instruction. It wins over the
  app's own seed.
- `?poke=addr:bytes,addr:bytes` stores bytes before the first instruction: `?poke=c041:ff`,
  `?poke=0300:a9008d30c0`. Hex, addresses up to four digits, two digits a byte. RAM below
  `$C000` and the panel take them (`poke` in [plus.ts](plus.ts)); anything else is skipped.

With "Following the prompts" on, Applesoft, a running BASIC program, Integer BASIC and the
Monitor each set the style and their own seed as the prompt changes (`PROMPT_PANELS` in
korz-apple.svelte.js). A game with its own seed starts with it off, so its music stays.

## The cassette

The board has both wires. `$C020` flips the cassette output, kept as a cycle log of flips
(`takeTape`) as the speaker is. `$C060` bit 7 reads the cassette input from `tapeIn(cycle)`,
a function the page plugs in. "Hear the tape" in the Sound node mixes the output with the
speaker, as a recorder's monitor plays it.

To come: the input from the microphone and from audio files (WAV, MP3, whatever the browser
decodes), recording the output to a file, both in step with Apple time rather than the wall's,
so a LOAD or SAVE can run as fast as the machine does instead of at the tape's speed; and a
pure tape mode, the cassette alone, unmixed, in and out.
