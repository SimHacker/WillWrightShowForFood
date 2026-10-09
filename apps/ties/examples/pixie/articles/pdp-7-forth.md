---
title: PDP-7 Forth
synonyms:
  - forth
  - pdp7forth
  - turtle
  - mitch bradley
definition: "Mitch Bradley's Forth for the PDP-7, with turtle graphics on the 340. Running in this page."
---

```yaml cabinet
title: Mitch Bradley's PDP-7 Forth, with the turtle on the 340.
machine: pdp7
program: forth
size: 512
```

```transclude
follows: cabinet
article: cabinet-{program}
```

Mitch Bradley wrote this Forth in 2026 for the machine UNIX was born on: 18-bit words, 8K of core, no bytes. Each cell of a colon definition is a PDP-7 instruction that the inner interpreter runs with `xct`, so NEXT is three instructions, and a word's kind is in its opcode bits. The turtle is Forth source, loaded from paper tape, that writes the 340's display list as it moves.

Mitch builds it with pdp7-unix's `as7` assembler and compiles the Forth prelude by running the kernel under SIMH. ~The emulator~ does both in the page: it assembles the kernel with its own `as7`, feeds the Forth sources to the emulated paper tape reader, and keeps the core.

The cabinet's copy keeps names whole, laid out as Open Firmware lays them out. It adds `CREATE DOES>` with Open Firmware's and CForth's names, and it carries PIXIE's 1972 ring structure processor, RSPPIX, unchanged, with a Forth word for each routine. Open RINGS and type `RSAVINS S" SQUARE" NAMED` to watch a ring grow. The plans: a PDP-7 and Type 340 assembler written in Forth, Forth and SYMELEC trading drawings through ~Tiny Titan~, and a command line built the Open Firmware way. The full story is in [PDP7-FORTH.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/reference/PDP7-FORTH.md) and [FORTH-RINGS.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/packages/cabinet/FORTH-RINGS.md).

Source: [github.com/MitchBradley/pdp7forth](https://github.com/MitchBradley/pdp7forth), MIT licence.

```transclude
path: packages/cabinet/tapes/pdp7forth/README.md
```
