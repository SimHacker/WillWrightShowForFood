# Off by one: field notes from the fencepost

The PDP-7's native loop primitive is `ISZ` — increment and skip if
zero. To run a loop N times you store the count *complemented*, let
`ISZ` count it back up toward zero, and remember whether anything
pre-incremented it along the way. Every count on this machine is a
negotiation about which side of the fence the post stands on. Building
an emulator against a 1972 listing means renegotiating each one, and
the referee is always the same: SYMELEC either runs or it doesn't.

These are the boundary bugs the cabinet hit on the way up, in the
order they bit.

## The pool past the fence

**Symptom.** SYMELEC boots into its memory-initialization loop and
never leaves. `IDLA` never comes. No display, no interrupts, nothing.

**Cause.** The `.oct` conversion of the listing stopped at word 11741.
The 1972 assembler had placed the literal pool — every `(777776`,
`(JMP INT`, `(1777` in the source — at 12066–12257, past the fence.
Every literal reference read 0. The instruction that should have
deposited `JMP INT` into the interrupt vector deposited 0, and the
machine initialized itself into a wall.

**Fix.** [`scripts/extract-literals.mjs`](scripts/extract-literals.mjs)
derives `symelec-literals.oct` from the listing's own literal-pool
pages (105–106); the loader takes both files. Not strictly an
off-by-one — a truncation at a boundary — but it set the pattern for
everything after: *when the machine misbehaves, the listing already
contains the truth.*

## One bit off in a rotate

The OPR test asserted `RTR` as 740060, a plausible-looking encoding
that rotates nothing twice. The real word is 742020 — the
rotate-twice bit lives one field over from where intuition put it.
Microcoded operate instructions are bit-salads; the fix was reading
the bits, not remembering them.

## The tick after the overflow

The clock test asserted core location 7 — the clock's count, which
lives *in memory*, not in a register — would equal 0 after overflow
raised the interrupt. It never does: the clock keeps ticking while the
handler runs, so by the time the test looks, the count has moved on.
The assertion became `< 0o10`. A fencepost in time — "immediately
after" is not an instant on a machine that never stops counting.

## The subpicture that forgot its name

The 340's `DDS` (deposit-and-skip) writes a pen-dispatch linkage into
core mid-display-file — it is how a lightbutton knows its own address.
The first implementation reset the current subroutine identity to
"none" after `DDS`, so every character stroke drawn *after* the
deposit — the button's label — belonged to nobody. The SVG export had
no `<g data-subr=…>` groups; provenance fell off exactly one word past
the deposit. The fix: segments after `DDS` inherit the deposited
linkage address (`subr = asr`). Off by one level of identity, caught
by the acceptance test that diffs the SVG.

## The bit that falls off the pen

Not a bug we wrote — a boundary 1972 designed in. `IDRC` returns the
pen hit packed as `(x>>1)<<9 | (y>>1)`: the low bit of each coordinate
is gone before software ever sees it. We know because `TRCR` unpacks
with one left rotate for Y, a shift of eight for X, and masks of
`1776` — not `1777`. The unpack in the listing is the receipt for the
packing formula, and the unit test asserts the round trip. Pen
coordinates on this machine arrive even; anyone tempted to assert an
odd number loses to the mask.

## The pulse that isn't in the pulse

tiny-titan's first draft matched IOT pulses straight off the
mnemonics: `LRB18` is 702252, so match pulse 52. But the CPU strips
bit 010 from every IOT before dispatch — that bit means *clear the
accumulator first* and is the processor's business, not the device's.
The device sees `LRB18` as pulse 42, `LRB18!LLAM` as 66. Two dead
branches, caught by re-reading the dispatch in
[`pdp7.ts`](src/plugins/pdp7.ts) before the wire went live.

The corollary is the protocol's best joke: the NAK is spelled
`LLB6 10` in the listing — send control byte, plus bit 010. It reaches
the device as **control 0 with the accumulator pre-cleared**, because
the 010 *is* the clear-AC bit. The "NAK code" is the absence of a
code, delivered by a hardware side effect. It works; it worked in
1972; nobody would design it on purpose today.

## ISZ BSZ, the star of the show

The blocklet host served Titan's side of the link and expected the
PDP-7 to send `count + 1` words per blocklet: four stream-heading
words plus `count − 3` of data. Defensible arithmetic — and wrong,
because at 1734–1735 the listing complements the count and then does
`ISZ BSZ` *as part of the end-of-transfer test*, pre-incrementing it
by one. A blocklet carries exactly `count` words.

The failure chain was pure 1972: the host held its checksum back,
waiting for a twentieth word that would never come; the PDP-7's
`WAITLK` found the flag still up from its own last send, read the
empty queue as 0, compared it against `CKS`, and **NAK'd the modern
host** — the 54-year-old software rejecting the 2026 implementation
for bad arithmetic, exactly as designed. The test said `19 !== 20`;
the listing said `ISZ`; the listing won.

## Minus zero, or: the machine is off by one about zero

The closing exhibit is in the link's header check itself. Titan sends
each header twice — word 2 is word 1 complemented — and the PDP
verifies with:

```octal
XOR HDR1 … XOR BSZ … ADD SAV ; CMA ; SZA
```

That `ADD` is the PDP-7's **ones-complement add**, end-around carry
and all — not the two's-complement `TAD` the checksum uses one page
later. The sum of a word and its complement is 777777: *minus zero*.
The header check literally demands that the arithmetic come out to
negative nothing.

A machine whose number system contains two zeros is off by one about
zero itself. On such iron, fenceposts are not mistakes you make once
and learn from; they are the terrain. The only reliable map is the
listing — and an acceptance test that lets 1972 do the refereeing.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TRACKING](TRACKING.md) · [TINY-TITAN](TINY-TITAN.md)
