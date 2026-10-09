# PDP-7 Forth, by Mitch Bradley

A small Forth for the PDP-7, from [MitchBradley/pdp7forth](https://github.com/MitchBradley/pdp7forth)
(MIT licence, `LICENSE` here), commit `96c3202` of 26 September 2026. Its README and `DESIGN.md`
explain it. Among the ideas: each cell of a colon definition is a PDP-7 instruction run by `xct`,
so NEXT is three instructions.

- `kernel.s` and `end.s`: the kernel's source. `as7` assembles pdp7-unix's `src/sys/sop.s` (the
  opcode names), then these two.
- `kernel.a7out` and `kernel.lst`: that assembled with pdp7-unix's `as7` (`make
  build/kernel.a7out build/kernel.lst`). The cabinet's own `as7` front end assembles `kernel.s`
  in the page, and a test checks that it matches these word for word.
- `prelude.fs` and `turtle.fs`: Mitch's Forth source, unchanged. `turtle.fs` is turtle graphics on
  the Type 340.
- `kernel-names-full.s`: the cabinet's Forth, a copy of `kernel.s` that keeps names whole, made
  by `scripts/make-forth-names-full.py`.
- `does.fs`: `CREATE DOES>`, `(DOES>)`, `>BODY` and `LASTACF`, as Open Firmware and CForth name
  them, in Forth.
- `pixie.s`, `rsppix.s`, `pixie.fs`: PIXIE rings. `rsppix.s` is RSPPIX from the 1972 listing,
  generated and not edited; `pixie.s` gives it SYMELEC's variables and a Forth word per routine;
  `pixie.fs` is the layer you type at. See [FORTH-RINGS.md](../../FORTH-RINGS.md).
- `VARIANTS.yml`: what each copy differs in, and what it must keep identical.
- `scheme.fs`: a local CPS arithmetic S-expression experiment, compiled after the upstream sources
  in the Cabinet tests. Nested `+` and `*` over single-digit integers pass intermediate values
  through explicit Forth continuation tokens; it is not complete Scheme or first-class `call/cc`.

Mitch's build compiles the prelude into the image by running the kernel under SIMH, feeding it the
source on paper tape. The cabinet does the same thing itself (`src/forth.ts`). It loads the
kernel, mounts the Forth sources on the reader, types `TAPE`, and keeps the core that results. The
menu's FORTH + TURTLE loads the full-names kernel with PIXIE rings, then `prelude.fs`, `does.fs`,
`turtle.fs` and `pixie.fs`. The upstream kernel, prelude, and turtle remain unchanged apart from
the prelude's `CELLS` and `CHARS`; `scheme.fs` is a separate local experiment.
