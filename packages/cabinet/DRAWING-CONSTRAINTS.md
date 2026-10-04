# Drawing constraints: editing a running program's pictures safely

**Status: longer term, optional, to be decided.** None of this is needed for the first universal
editor ([DESIGN.md, A universal 340 editor](DESIGN.md#a-universal-340-editor)), which pauses the
machine, edits, and writes back only where the cartridge says it's safe. This file collects the
harder questions so they aren't lost. Every section is an invitation: students and hackers who
want a real problem with a real 1972 program to test it on, pick one and say so.

Legend: **done** · **next** (about to do) · **will** (planned) · **could** (open, wants a
volunteer) · **won't** (decided against, with the reason).

## The question

Any 340 display list can be lifted into the universal drawing and edited. Writing it back is
the hard part, because the program that made it may depend on its exact words: where they
are, how many there are, which ones it rewrites while running. Edits split into two kinds:

- **Faithful:** edits that respect the program's limits, so the drawing can be written back
  and the program keeps working.
- **Free:** edits with no limits, for a drawing that is exported, saved, or handed to another
  program, never written back into this one.

The editor should know which kind it is doing, and show it.

## 1. Lift the 340's limits into general constraints (could)

The editor shouldn't need to know 340 opcodes. The importer translates what the code allows
into constraints any drawing editor understands:

| 340 fact | General constraint |
|---|---|
| a vector's delta is 7 bits times scale | this point stays within a box around its neighbour |
| characters advance from the one before | the things after me move with me |
| POINT words are absolute | this point is free anywhere on the screen |
| a run shares one scale | these points move on a grid of that step |
| a `DJS` target is shared | editing this group edits every instance |
| the words can't grow (no room, or code reads them) | the word count is fixed |
| the program rewrites these words (the cross) | locked: shown, not editable |

In faithful mode the editor enforces them, as the low-level instruction editor's clamp box does
now (**done**, for one corner of one vector; that editor stays, as the way to poke words
directly). In free mode it ignores them and says so.

## 2. Who may move the words (could)

Writing back a longer drawing needs room. Options, cheapest first:

- rewrite in place when the new words fit;
- a patch: `DJP` from the original spot to a longer copy in a patch area and back;
- relocate the whole list and fix every pointer to it.

Patching and relocating are safe only if nothing else depends on the old addresses. Two ways
to find out:

- **Static:** search the program for the list's addresses. Unreliable alone: a data word, a
  count or a coordinate can equal an address by chance (false positives), and computed
  addresses (`LAW DFB`, then `TAD`) never appear literally (false negatives). The assembler's
  source map and symbol table cut both: a word assembled from the label `DFB` is a pointer,
  `1000` typed as a number is not. We control the assemblers, so they can mark every word
  that came from an address expression.
- **Runtime:** watch which instructions read and write the list's region while the program
  runs (the attention overlays, below). Shows what actually happens, but only on the paths
  that ran.

Both together, plus what the cartridge declares, decide.

## 3. What the cartridge declares (will, in a small form; could, in full)

The first editor needs only the first form; the rest is open.

```yaml
display:
  buffers:
    - { start: dlbuf, end: dl>, capacity: 1024, owner: append-only }      # Forth turtle
    - { start: DFB, end: DFE, owner: regenerated, from: rings }            # PIXIE: edits last until the next recompile
    - { start: LB, words: 200, owner: static, rewritten: [YCROSS, XCROSS] } # SYMELEC's lightbuttons
  patch_area: { start: 17000, words: 200 }
  pointers:            # symbolic hints for the static search
    allow: [DFB, TEMPDF, LB]
    deny: [ring storage: BEG..END]   # ring words are never display pointers
```

Owners: `static` (assembled, never changes), `append-only`, `regenerated` (the program
rebuilds it; edit the source data instead), `rewritten` (named words the program pokes).

## 4. Attention overlays (could)

For each memory word, keep the last read, write and execute, separately for the PDP-7, the
340, and Forth's instruction pointer (location 010: Forth's `next` is `xct i 010`, so IP says
which Forth cell ran), each with the PC that did it, plus counts. Not a log: one record per
word per processor, cheap enough to leave on. Full history is the trace's job. The memory
panel can tint words by who touched them last, and a display word can say which instruction
wrote it.

A Forth source map (address back to file or terminal line) needs Forth's help: a hook in the
compiler that records `here` with the current line. The emulator can't infer it without
simulating how Forth compiles. Propose to Mitch.

## 5. Patching code, not just pictures (could)

Display words the PDP-7 program rewrites (SYMELEC's cross) can only be changed by changing the
code that writes them. Layers: patch PDP-7 words in place; reassemble a routine from source and
hot-patch it; redefine Forth words; generate Forth source. See DESIGN.md's "Layers above,
later". A PDP-7 assembler written in Forth would let the machine assemble its own patches.

## 6. Extended memory (could)

The cabinet has 8K, and the 340 addresses exactly 8K. A larger PDP-7 (up to 32K with memory
extension) would give room for display lists, patch areas and double buffers. Questions for a
volunteer: did a real 340 reach past the first 8K (check the 340 and PDP-7 manuals)? If not,
a display-bank IOT as a marked extension. Could PIXIE's ring library put its structures in
upper banks behind its existing calls, without changing SYMELEC? Could Forth keep headers,
source maps and symbols in an upper bank and run a headerless image in the lower one, the way
Mitch's metacompiler (OpenFirmware `forth/kernel/metacompile.fth`) builds target images?

## Won't

- **Edit the universal drawing live while the 340 runs.** The drawing editor pauses; it is
  simpler and safe. Live editing stays where it is exact: the low-level instruction editor,
  which changes only the words you drag.
- **Guess.** When the analysis can't tell, the editor asks or refuses, and says why.

↑ [DESIGN](DESIGN.md) · [TODO](TODO.md) · [ROADMAP](ROADMAP.md)
