# Forth past 8K: high memory for Mitch's PDP-7 Forth

How the cabinet's Forth reaches beyond its 8K bank: for data now (hand-pose streams, captured
poses, tables), and later for the dictionary's names, and for whole cartridges paged in as
overlays. Step 1 is built ([xmem.fs](tapes/pdp7forth/xmem.fs)); the rest is design.

## The hardware

The PDP-7 addresses 8K with 13 bits. The Type 148 memory extension adds banks up to 32K, which
the cabinet's CPU emulates as SIMH does ([GUIDE-PDP7](reference/GUIDE-PDP7.md#memory-beyond-8k)):

- A direct address is in the instruction's own bank. `PC + 1` wraps within the bank.
- Extend mode off (after reset, and on every interrupt): an indirect address is 13 bits, in the
  current bank. Programs written for 8K never notice the other banks.
- Extend mode on (`EEM`, 707702; off with `LEM`, 707704; `SEM`, 707701, skips if on): an indirect
  address is 15 bits and reaches any bank.
- `JMS`, `CAL` and interrupts save extend mode in bit 16 of the return word. `EMIR` (707742) turns
  extend mode on until the next `JMP I`, which restores it from that bit: how a handler returns to
  whatever mode was running.
- The 340 fetches display words with 13-bit addresses: display lists stay in bank 0.

## The kernel's constraint

Mitch's kernel lives in bank 0 and assumes it: IP, RP and SP are 13-bit auto-index pointers,
`HERE`, links and `@`/`!` are 13 bits, and almost everything is an indirect reference that
relies on staying in the current bank. Running the kernel with extend mode on would mean
auditing every one of them.

So the kernel stays exactly as it is, and only a few primitives know about high memory. Each
turns extend mode on for its own indirect references and off again before the next thread cell.
Bank 0 code, stacks, dictionary and display list are untouched.

## Step 1, built: X@, X!, and XMOVE

[xmem.fs](tapes/pdp7forth/xmem.fs), after code.fs:

| Word | Stack | Does |
|---|---|---|
| `XMEM?` | `( -- flag )` | the extension is present (more than 8K of core) |
| `X@` | `( xaddr -- w )` | fetch from any 15-bit address |
| `X!` | `( w xaddr -- )` | store to any 15-bit address |
| `XMOVE` | `( from to n -- )` | copy n words, any bank to any bank, overlapping or not, as `MOVE` does |
| `XHERE` | `( -- addr )` | variable: the next free high word, from 8192 |
| `XALLOT` | `( n -- )` | reserve n high words |
| `X,` | `( w -- )` | store at `XHERE` and step it |
| `XROOM` | `( -- n )` | high words left (0 on an 8K machine) |

- An extended address is a plain number, 0 to 32767: the bank is its top two bits. `24576 X@`
  reads bank 3's first word. No bank-and-offset pairs. A `VARIABLE` pushes its address in LAW
  form, negative; every word here takes a negative address as that, in bank 0.
- **One copy word.** With extend mode on, both of the copy's pointers are 15 bits, so it copies
  between any two banks directly, bank 0 being just one of them: there is no up-copy or
  down-copy. A source may run across a bank boundary.
- **Overlap.** Up the addresses unless the destination starts inside the source; then down,
  so nothing is overwritten before it is read.
- **Speed.** Up the addresses uses auto-index 015 and 016 (free in the kernel): `LAC I 015`,
  `DAC I 016`, `ISZ`, `JMP`, about seven cycles a word. A 63-word hand pose is about 450
  cycles; a whole bank about 60,000. Down the addresses steps two pointers by hand, about twice
  as slow, and only overlapping copies need it.
- **Interrupts.** An interrupt turns extend mode off. [interrupt.fs](tapes/pdp7forth/interrupt.fs)'s
  handler now returns with `EMIR`, `JMP I 0`, so an interrupted copy goes on in extend mode.
  Without it, the rest of the copy writes into bank 0. The test proves both. Any other handler
  that can interrupt these words must return the same way.
- `XMEM?` uses `EEM` then `SEM`: with only 8K, `EEM` does nothing and `SEM` doesn't skip.
- Cost: about 120 dictionary words.

Tested in [xmem.test.ts](src/xmem.test.ts): every bank fetched and stored, poses copied up and
back, bank to bank, overlapping both ways and across a bank boundary, an 8K machine reporting
no room, and a 4,000-word copy running through 60 Hz-style clock
interrupts handled in Forth, coming out whole, with extend mode off at the end.

### What step 1 makes possible

- **Hand-pose streams.** Each frame, capture a pose (about 63 words) and `XMOVE` it to
  `XHERE`. At ten frames a second, a bank holds about 13 seconds, banks 1 to 3 about 40. Play
  back with `XMOVE` into the current-hand buffer and draw it. Recorded gestures (beckoning,
  come hither) for the attract mode, made on the PDP-7 itself.
- **The hands-of-hands tree** ([HAND-TRACKING.md](HAND-TRACKING.md#to-do)): every frozen pose
  in high memory, as many as fit.
- **Tables** too big for bank 0: sine tables, fonts, Turing tapes, ring files.

## The extended kernel, built

[kernel-names-full-extended.s](tapes/pdp7forth/kernel-names-full-extended.s) is
kernel-names-full.s with `XMEM?`, `X@`, `X!` and `XMOVE` as kernel primitives, made by
[make-forth-extended.py](scripts/make-forth-extended.py): the parent copied, with replacements
that must each match once, so a change to the parent is carried over by rerunning it. The
`-extended` suffix names every parallel implementation that knows about memory past 8K
([VARIANTS.yml](tapes/pdp7forth/VARIANTS.yml)). With it, load
[xmem-extended.fs](tapes/pdp7forth/xmem-extended.fs) for `XHERE` and friends; with the plain
kernel, [xmem.fs](tapes/pdp7forth/xmem.fs) gives everything as CODE words. The same tests run
on both.

## Files: save and restore by name

High memory meets storage through tiny-titan's file service, device 24
([TINY-TITAN.md](TINY-TITAN.md)): read and write words by path, offset and length, straight to
and from any bank, with `/tmp`, `/browser` (kept across reloads), `/proc` (made on demand) and,
planned, `/user` and `/net`. A `.gz` name is stored compressed. Hand-pose streams recorded into
high memory can then be kept: `S" /browser/beckon.gz" 8192 n 0 WRITE-WORDS`.

## Step 2: the names in bank 1

Today each word's name is packed three characters a word just before its header, in bank 0 (the
full-names kernel, [VARIANTS.yml](tapes/pdp7forth/VARIANTS.yml)): 231 words for the prelude,
turtle and scheme alone, more for each cartridge.

- Each header keeps its link and its body, and one name word: the 15-bit address of its name in
  bank 1 (count, then the characters).
- `FIND` compares names with extended fetches (013 and an extended indirect, or `X@`).
- `CREATE` and the header maker write names at a high-memory name pointer.
- `WORDS` and anything that prints a name read it from bank 1.
- `NEXT`, `EXECUTE`, the threaded code and the stacks don't change: nothing that runs a word
  ever reads a name.
- The 512-word link limit is easier to meet, since names no longer sit between headers.
- Saves about one bank-0 word for every three name characters: 200 to 600 words a cartridge.

### What step 2 needs from the assembler: one definition, two destinations

Words defined at run time are easy: `CREATE` keeps two pointers, `HERE` in bank 0 and a name
pointer in bank 1, and writes to each. The kernel's own 84 headers, and pixie.s's, are written
in assembler source, and today each one is spelled out by hand: the packed name words, then the
header word with its count, tag and link computed from the previous header's label.

```
" DUP ( x -- x x )
	0446560	" DUP
h.dup:	0060000+tag.prim+h.dup-h.xi-1	" DUP
dup:	jms un
```

With names in bank 1, every word would need two edits in two places that must agree: the
name record in high memory, and the header in low memory pointing at it. So the assembler has to
assemble into **two destinations at once**, low and high, from **one definition macro** per
word:

```
	fword DUP, dup, tag.prim
dup:	jms un
```

which expands to

```
lo.=.			" remember the low location counter
.=hi.			" assemble into bank 1
n.dup:	3		" count
	0446560		" DUP
hi.=.			" remember the high one
.=lo.			" back to bank 0
	n.dup		" the name's 15-bit address, at xt-1
h.dup:	0060000+tag.prim+h.dup-last.-1	" count, tag, link
last.=h.dup
```

- **Two location counters.** `lo.` and `hi.` are ordinary redefinable assignments, so the
  expansion is plain as7 (or plain MACRO-9 with `.LOC`). The macro is the only new thing; the
  assembler already has `.=` and redefinition.
- **The link is computed, not written.** `last.` is the previous header, carried from one
  expansion to the next, so inserting or moving a word no longer means editing its neighbour's
  link expression. The 512-word link check is the assembler's: an error at the line, not a
  broken chain at run time.
- **The header keeps its count field**, so `FIND` rejects most candidates without an extended
  fetch and only reads bank 1 when the count matches.
- **The name pointer sits at xt-1**, where the name words are now, so the body stays at xt+1,
  `>NAME` is `xt 1- @`, and `NEXT` and the threaded code don't change.
- **Same macro, other layouts.** Pointed at one destination it lays the name down just before
  the header, as kernel-names-full.s does now; pointed at none it makes a headerless word, as
  Open Firmware's metacompiler does with `headerless` and `headers` (`forth/kernel/metacompile.fth`).
  One source, three builds, chosen by an assignment at the top of the file.
- **The run-time twin.** `fword` at assembly time and `mkhdr` at run time lay down the same two
  records. Both should come from one declaration of the header and name types
  ([DESIGN.md, Typed memory](DESIGN.md#typed-memory-core-as-typed-blocks)), and a test should
  check that a word defined each way produces the same records.

What the cabinet's assembler lacks today:

| Needed | Today |
|---|---|
| A macro facility | None in `as7.ts`. MACRO-9 has `.DEFIN`, `.ETC`, `.ENDM` and created symbols (manual §3.16, §4.3.2, in [reference/](reference/)) |
| Switching location counters | Have: `.=` and redefinable assignments in as7; `.LOC` "as many times as required" in MACRO-9 (§3.3) |
| Names packed the kernel's way | Neither `.SIXBT` nor as7 does it. The kernel's SIXBIT is ASCII minus 040 (`D` is 044, space 0); MACRO-9's `.SIXBT` is trimmed ASCII (`A` is 01, space 040). The macro needs a name-packing operator of its own |
| Addresses past 8K in the back end | `as7.ts` places 18-bit addresses, but `PDP7` declares 13 address bits, and the listing writes a line's extra words at `addr + k` masked to 13 bits. A line that emits into two banks needs each word listed at its own address, which `AsmLine.words` already records |
| One source map across banks | `AsmLine.words` holds each word's address, so a word in bank 1 maps back to its `fword` line; the memory panel has to show bank 1 for that to be visible |

Upstream compatibility: Mitch's build assembles with his `as7`. If the macro is expanded by a
cabinet script into plain as7 (as make-forth-extended.py generates kernel-names-full-extended.s),
his tools never see it. Whether his `as7` and loader place words above 8K is still to check.

## Step 3: overlays, not high-bank threaded code

Putting the threaded code itself in high banks would free most of bank 0, but `NEXT` would have
to run in extend mode or translate every cell, slowing every word, and auto-index pointers,
interrupts and the 512-word link limit all get harder. Not worth it.

Overlays instead: keep the kernel, the prelude and the turtle in bank 0, and keep each cartridge
(turing.fs, ultimate.fs, datahand.fs, ultimate-hand.fs) compiled for a fixed overlay area of
bank 0, stored in a high bank. Choosing a program copies its overlay down with `XMOVE` and
patches the dictionary link to it. Every cartridge on one machine, with no recompiling.

## Tapes

The loader writes 18-bit words wherever the tape says, in any bank, so one tape is enough for a
32K image. Separate tapes per bank would only help development: rebuild bank 0 without the
names, or reload one overlay.

## Order of work

1. ~~`X@`, `X!`, `XMOVE`, `XHERE`; the handler's `EMIR`.~~ Done.
2. Programs on 32K machines: `coreWords: 32768` for the hand programs, and pose streams
   (capture, record, play back) in datahand.fs.
3. Names in bank 1, in the full-names kernel:
   1. The assembler: macros, a name-packing operator, 15-bit addresses in the back end and the
      listing.
   2. `fword`, first pointed at one destination, reproducing kernel-names-full.s word for word.
   3. Then pointed at bank 1, with `FIND`, `CREATE`, `WORDS` and `mkhdr` reading and writing
      names there.
4. Overlays for cartridges.
