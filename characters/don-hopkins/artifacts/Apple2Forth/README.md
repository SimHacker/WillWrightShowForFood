# Don's ProDOS Forth and H19 terminal, Apple ][

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
every start and abort. Block 4 runs `init-term von`, prints the banner, then `term`. In the
terminal, Ctrl-\ (character 28) quits to Forth. The Videx Soft Video Switch follows annunciator 0:
a reference to `$C058` shows the Videx's 80 columns, `$C059` the Apple's 40. `VIDOFF` touches
`$C058` and `VIDON` touches `$C059`. `von` and `voff` are separate, longer words, not yet decoded.

To run it in microM8: `microM8 -drive1 forth.po` on a copy, since microM8 writes to the image.
microM8 has no Videx card. A copy with `init-term`, `von` and `term` commented out of block 4
boots straight to the `Ok` prompt.

## A recording of the serial line

Blocks 32 to 37 hold a capture of the terminal's serial input. Block 29 defines `gulp` (block to
memory) and `plop` (memory to block, then `update`), `$400` bytes at a time. Block 30 saved the
ring buffer at `$2800`-`$3FFF` into blocks `$20`-`$25` with six `plop`s and printed the
`mbuff-in` and `mbuff-out` pointers. Block 31 is the replay: it sets `mbuff-in` to `$2CF2` and
`mbuff-out` to `$2CF3` and `gulp`s the six blocks back, so the whole ring reads as unread input
for the terminal to play again.

## For later

- Replay blocks 32 to 37 through the H19 emulator (`31 load`, then `term`) and record what the
  screen shows.
- Decompile the whole system, `H19.SYSTEM` and the source in `BLOCKS.4TH`, into source a
  metacompiler can rebuild: the Forth kernel's 6502 code, the threaded definitions, and the
  dictionary headers. Then the image can be rebuilt, changed and documented word by word, the way
  [Mitch Bradley's PDP-7 Forth](../../../../packages/cabinet/tapes/pdp7forth/README.md) is built
  from source in the cabinet.
