# Don's ProDOS Forth and H19 terminal, Apple ][

A Forth Don wrote for the Apple ][ under ProDOS, starting from fig-FORTH, with an H19 terminal
emulator built on it in its own RPN 6502 assembler. The terminal is how he reached the ARPANET
and the ITS machines, MIT-MC above all, where he hung out all day and all night
([lineage](../../career/lineage.yml)). MC itself survives, at the
[Interim Computer Museum](https://icm.museum/blog/?p=38). What survives is the bootable disk from May
1990, its 48 blocks of source, a capture of the serial line, and the Forth that uploaded the
Apple's ROMs and disk blocks to Unix. This directory is the restoration: what each file is, what
the system does, and what is left to bring it back running in the cabinet's browser Apple.

| File | What it is |
|------|-----------|
| [`forth.dsk`](forth.dsk) | 140K ProDOS volume `/H19` in ProDOS block order (a `.po` image). Boots. |
| [`f.dsk`](f.dsk) | The same volume in DOS 3.3 sector order; identical to `forth.dsk` once reordered. |
| [`forth.disk.hex.Z`](forth.disk.hex.Z) | A compressed hex dump, in Apple Monitor format, of the same 140K volume: decoded, it is byte-identical to `forth.dsk`. |
| [`junk.dsk`](junk.dsk) | DOS 3.3 disk with one two-sector `HELLO`. |
| [`a2.f`](a2.f) | Two words, `run` and `cli`, that call Rich Skrenta's `a2` emulator from a Unix Forth through its C entry points (`_run` between `_set_term` and `_restore_term`, and `_cli`). The `a2` source has a matching `main-f.c` whose `main_f` drops the emulator's own run loop. |
| [`Untitled.vii`](Untitled.vii) | A Virtual ][ (Mac emulator) session document, 2018. |
| [`upload/`](upload/README.md) | May 1990: Forth that dumped ProDOS blocks over the serial line to Unix. |

## The disk

The banner reads "ProDOS Forth Development System. Copyright (C) 1985 by Don Hopkins", version
07.000 of 11-JAN-88. `H19.SYSTEM` (29,707 bytes, "(C) 1986 Don Hopkins") is a saved Forth image
with an H19 terminal emulator on top: Videx 80-column output, a serial driver with an interrupt
handler and a ring buffer, baud rates to 38400, and H19 escape sequences. `BLOCKS.4TH` holds 48
blocks of source, 64-column text.

Startup: block 3, which builds the system, sets `4 ABORT-LOAD-BLK !`, so block 4 is loaded at
every start and abort. Block 4 runs `init-term von`, prints the banner, then `term`.

`TERM` loops: `POLL-KBD`, then a byte from the serial ring buffer to the H19 emulator, or
`RELAX`. The keyboard has two game-port buttons on it. Button 0 (`$C061`) is Meta: a key typed
with it held goes out with bit 7 set. Button 1 (`$C062`) is the command shift: the key indexes
`KEYCMDS`, 128 words, `ERROR-SOUND` where nothing is defined:

| Key with button 1 | Word |
|---|---|
| F | `ENTER-FORTH`, prints `[Forth]` and leaves the terminal |
| T | `ENTER-TERM` |
| R | `INIT-TERM` |
| I | `INIT-MODEM` |
| M | `SET-MINPUT` |
| P | `PRINT-SCREEN` |
| U | `UPDATE-VIDEX` |
| V | `SETVID` |
| W | `SETWRAP` |
| Z | `ZAP-MBUFF` |
| Ctrl-Q | `EMPTY-MBUFF` |
| , | `BUMP-MBUFF` |
| Space | `UNDER-CUR` |
| arrows (Ctrl-H, J, K, U) | `LEFT`, `DOWN`, `UP`, `RIGHT` |

Block 23's simpler terminal `t` quits on Ctrl-\ (character 28); `term` sends Ctrl-\ down the
line. The Videx Soft Video Switch follows annunciator 0
unless a graphics mode is on: a reference to `$C059` shows the Videx's 80 columns, `$C058` the
Apple's 40. `VIDON` touches `$C059` and `VIDOFF` touches `$C058`. The Videx firmware does the same,
`STA $C059` on every character it prints; the Soft Video Switch manual has the two addresses
swapped. `von` and `voff` are separate, longer words, not yet decoded.

To run it in microM8: pick `forth/forth.po` on the browser Apple's disk menu; the page restarts
on the `apple2-plus-videx` profile, a II+ with the Videx in slot 3 and the serial card in slot 4
(patch `0006-serial-2651-card`). The driver programs a Signetics 2651: data, status, two mode
registers and command at `$CE00`-`$CE03` in slot 4's `$C800` space, selected by `LDA $C400`, with
the card's interrupt latch at `$CE41` (on) and `$CE40` (off). The page's `microM8.serialSend`
and `serialTake` are the other end of the line. Left Option is button 0 (Meta) and right Option
is button 1, held while the other key types as itself: right Option-F enters Forth.
`forth/forth-ok.po` is the same disk with `term` blanked out of block 4; it stops at the Forth
prompt. Both are in [DISKS.yml](../../../../packages/cabinet/disks/apple2/DISKS.yml).

## A recording of the serial line

Blocks 32 to 37 hold a capture of the terminal's serial input. Block 29 defines `gulp` (block to
memory) and `plop` (memory to block, then `update`), `$400` bytes at a time. Block 30 saved the
ring buffer at `$2800`-`$3FFF` into blocks `$20`-`$25` with six `plop`s and printed the
`mbuff-in` and `mbuff-out` pointers. Block 31 is the replay: it sets `mbuff-in` to `$2CF2` and
`mbuff-out` to `$2CF3` and `gulp`s the six blocks back, so the whole ring reads as unread input
for the terminal to play again.

## TODO

- Something on the far end of the serial line in the page: a loopback, a telnet bridge, or a
  Unix to log in to.
- Name the serial card, if anyone recognizes a 2651 card with an interrupt latch at `$CE40`.
- Watch the soft switch: the browser Apple now tracks the annunciators, so its AN0 lamp follows
  `VIDOFF` ($C058) and `VIDON` ($C059) as the Forth switches screens.
- Decode `von` and `voff`.
- Replay blocks 32 to 37 through the H19 emulator (`31 load`, then `term`) and record what the
  screen shows.
- The same dictionary and disassembler views the cabinet's PDP-7 Forth has, reading this Forth's
  dictionary out of the emulated Apple's memory.
- Decompile the whole system, `H19.SYSTEM` and the source in `BLOCKS.4TH`, into source a
  metacompiler can rebuild: the Forth kernel's 6502 code, the threaded definitions, and the
  dictionary headers. Then the image can be rebuilt, changed and documented word by word, the way
  [Mitch Bradley's PDP-7 Forth](../../../../packages/cabinet/tapes/pdp7forth/README.md) is built
  from source in the cabinet.
