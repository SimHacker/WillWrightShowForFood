# Off by one: boundary bugs in the PDP-7 emulator

The PDP-7's native loop primitive is `ISZ`, increment and skip if
zero. To run a loop N times you store the count *complemented*, let
`ISZ` count it back up toward zero, and keep track of whether anything
pre-incremented it along the way. So every count on this machine has
an off-by-one question, and building an emulator against a 1972
listing means answering each one again. The test is always the same:
SYMELEC either runs or it doesn't.

These are the boundary bugs the cabinet hit on the way up, in the
order they were found.

## The literal pool past the end of the image

**Symptom.** SYMELEC boots into its memory-initialization loop and
never leaves. `IDLA` never comes. No display, no interrupts.

**Cause.** The `.oct` conversion of the listing stopped at word 11741.
The 1972 assembler had placed the literal pool (every `(777776`,
`(JMP INT`, `(1777` in the source) at 12066–12257, past that point.
Every literal reference read 0. The instruction that should have
deposited `JMP INT` into the interrupt vector deposited 0, and the
machine's initialization never finished.

**Fix.** [`scripts/extract-literals.mjs`](scripts/extract-literals.mjs)
derives `symelec-literals.oct` from the listing's own literal-pool
pages (105–106); the loader takes both files. This was a truncation at
a boundary rather than strictly an off-by-one, but it set the approach
for everything after: when the machine misbehaves, check the listing
first.

## One bit off in a rotate

The OPR test asserted `RTR` as 740060, a plausible-looking encoding
that rotates nothing twice. The real word is 742020: the
rotate-twice bit is one field over from where it was assumed to be.
Microcoded operate instructions combine many independent bits; the fix
was reading the bits from the documentation, not from memory.

## The tick after the overflow

The clock test asserted that core location 7 (the clock's count, which
is kept *in memory*, not in a register) would equal 0 after overflow
raised the interrupt. It never does: the clock keeps ticking while the
handler runs, so by the time the test looks, the count has moved on.
The assertion became `< 0o10`. "Immediately after" the overflow is not
a single instant on a machine whose clock keeps counting.

## Subpicture identity lost after DDS

The 340's `DDS` (deposit-and-skip) writes a pen-dispatch linkage into
core mid-display-file; that is how a lightbutton knows its own address.
The first implementation reset the current subroutine identity to
"none" after `DDS`, so every character stroke drawn *after* the
deposit (the button's label) belonged to no subroutine. The SVG export had
no `<g data-subr=…>` groups; provenance was lost from exactly one word past
the deposit. The fix: segments after `DDS` inherit the deposited
linkage address (`subr = asr`). The acceptance test that diffs the SVG
caught it.

## The pen coordinates' dropped low bit

This boundary is in the 1972 design, not in our code. `IDRC` returns the
pen hit packed as `(x>>1)<<9 | (y>>1)`: the low bit of each coordinate
is gone before software sees it. We know because `TRCR` unpacks
with one left rotate for Y, a shift of eight for X, and masks of
`1776`, not `1777`. The unpack in the listing confirms the
packing formula, and the unit test asserts the round trip. Pen
coordinates on this machine are always even, so a test that expects an
odd coordinate will fail.

## IOT pulse codes without bit 010

tiny-titan's first draft matched IOT pulses straight from the
mnemonics: `LRB18` is 702252, so match pulse 52. But the CPU strips
bit 010 from every IOT before dispatch. That bit means *clear the
accumulator first* and is handled by the processor, not the device.
The device sees `LRB18` as pulse 42, `LRB18!LLAM` as 66. Two branches
would never have matched; this was caught by re-reading the dispatch in
[`pdp7.ts`](src/plugins/pdp7.ts) before the link was connected.

A consequence: the NAK is spelled `LLB6 10` in the listing, send
control byte plus bit 010. It reaches the device as **control 0 with
the accumulator pre-cleared**, because the 010 *is* the clear-AC bit.
The NAK code is the absence of a code, delivered by a hardware side
effect. It worked in 1972.

## ISZ BSZ: the blocklet word count

The blocklet host served Titan's side of the link and expected the
PDP-7 to send `count + 1` words per blocklet: four stream-heading
words plus `count − 3` of data. That arithmetic was reasonable but
wrong, because at 1734–1735 the listing complements the count and then
does `ISZ BSZ` *as part of the end-of-transfer test*, pre-incrementing
it by one. A blocklet carries exactly `count` words.

The failure followed from the 1972 code: the host held its checksum back,
waiting for a twentieth word that would never come; the PDP-7's
`WAITLK` found the flag still up from its own last send, read the
empty queue as 0, compared it against `CKS`, and **NAK'd the host**.
The 1972 software rejected the 2026 implementation's bad arithmetic,
as it was designed to. The test said `19 !== 20`; the listing said
`ISZ`; the listing was right.

## Minus zero in the header check

The last case is in the link's header check. Titan sends
each header twice (word 2 is word 1 complemented), and the PDP-7
verifies with:

```octal
XOR HDR1 … XOR BSZ … ADD SAV ; CMA ; SZA
```

That `ADD` is the PDP-7's **ones-complement add**, with end-around
carry, not the two's-complement `TAD` the checksum uses one page
later. The sum of a word and its complement is 777777: *minus zero*.
The header check requires the arithmetic to come out to negative zero.

A ones-complement machine has two zeros, so even zero has a boundary
case. The reliable references are the listing and an acceptance test
that runs the 1972 code.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TRACKING](TRACKING.md) · [TINY-TITAN](TINY-TITAN.md)
