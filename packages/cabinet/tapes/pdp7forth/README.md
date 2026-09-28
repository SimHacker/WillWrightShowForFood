# PDP-7 Forth, by Mitch Bradley

A small Forth for the PDP-7, from [MitchBradley/pdp7forth](https://github.com/MitchBradley/pdp7forth)
(MIT licence, `LICENSE` here), commit `96c3202` of 26 September 2026. Its README and `DESIGN.md`
explain it. Among the ideas: each cell of a colon definition is a PDP-7 instruction run by `xct`,
so NEXT is three instructions.

- `kernel.s` and `end.s`: the kernel's source. `as7` assembles pdp7-unix's `src/sys/sop.s` (the
  opcode names), then these two.
- `kernel.a7out` and `kernel.lst`: that assembled with pdp7-unix's `as7` (`make
  build/kernel.a7out build/kernel.lst`). The cabinet's own assembler speaks DEC's 1964 dialect and
  Cambridge's, not `as7`'s, so the kernel comes in assembled. An `as7` dialect is the next step,
  so the page can assemble `kernel.s` itself: [DESIGN.md](../../DESIGN.md#cartridges-and-live-coding).
- `prelude.fs` and `turtle.fs`: Mitch's Forth source, unchanged. `turtle.fs` is turtle graphics on
  the Type 340.

Mitch's build compiles the prelude into the image by running the kernel under SIMH, feeding it the
source on paper tape. The cabinet does the same thing itself (`src/forth.ts`). It loads the
kernel, mounts `prelude.fs` and `turtle.fs` on the reader, types `TAPE`, and keeps the core that
results. Nothing in this folder is changed from Mitch's.
