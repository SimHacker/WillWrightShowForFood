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

Mitch builds it with pdp7-unix's `as7` assembler and compiles the Forth prelude by running the kernel under SIMH. ~The emulator~ takes the kernel `as7` assembled and does the SIMH step itself, in the page: it feeds `prelude.fs` and `turtle.fs` to the emulated paper tape reader and keeps the core. The next step is to assemble the kernel in the page too, so its source can be edited and rerun.

Source: [github.com/MitchBradley/pdp7forth](https://github.com/MitchBradley/pdp7forth), MIT licence.

```transclude
path: packages/cabinet/tapes/pdp7forth/README.md
```
