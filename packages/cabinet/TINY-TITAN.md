# tiny-titan: the mainframe in the minicomputer's pocket

Titan was Cambridge's Atlas 2 — a machine that filled a room and ran a
university. PIXIE's PDP-7 hung off it as a satellite, phoning home over
Neil Wiseman's custom link to store and retrieve drawings in the Titan
filestore. That was the size relationship: the PDP-7 was the small one.

**tiny-titan inverts it.** In the cabinet, the whole of Titan — as much
of it as PIXIE ever saw — is [one TypeScript
file](src/plugins/tiny-titan.ts) with no dependencies beyond the bus
types. The room-filling mainframe survives as the smallest component on
the backplane, serving its emulated satellite from inside the browser
tab. tiny-teco compressed Minsky's TECO to a universal Turing machine;
tiny-titan compresses the other end of the wire to a session state
machine. The corpus-of-one principle, applied to a mainframe: implement
only what the one surviving caller dialed.

## What it is, and isn't

**Not a Titan emulator, and not a simulator.** It has none of the Atlas 2: no 48-bit
words, no extracodes, no supervisor, no discs. By the cabinet's own definitions
([README](README.md#simulation-vs-emulation): emulation reproduces an interface so the
original program runs; simulation models a process), it is two things:

- **An emulator of Wiseman's link interface**, the PDP-7 side of it: the IOTs, the flag,
  the skips. It passes the cabinet's test: SYMELEC's unmodified `LTPX` runs against it.
- **A stand-in for the far end of the conversation.** `BlockletHost` answers the `/LTPIX`
  session the way user HL1470's Titan programs did, and plays the master role Lang's
  [Planning Document 10](../../characters/heinz-lemke/sources/pdp7-reference/cambridge-supervisor/pd10-titan-pdp7-link.md)
  gives Titan (the PDP-7 asks; Titan's header decides the direction). In testing terms, a
  fake server: the real protocol with no machine behind it. The emulation plan's phrase:
  emulate the conversation, not the computer.

It comes in rungs: with no port it is a **stub** (`LSF` always skips; that's what the
browser applet runs), with `EchoPort` a **loopback**, with `BlockletHost` a **listener**
that records what PIXIE sends. Serving back and the filestore are the next rungs. If an
Atlas 2 emulator ever exists, it docks behind `TitanPort` and tiny-titan shrinks to the
link card.

One sentence version: *tiny-titan stands in for the Titan end of Wiseman's link, well
enough that 1972 PIXIE on our emulated PDP-7 uploads its drawings to it.*

## What it does now

Three layers, split so each is portable on its own:

**`TinyTitan`** is the cabinet device, claiming device codes 22–23. The
IOTs come from the [SYMELEC listing](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt)
— no DEC manual documents them, because the hardware was Wiseman's
Cambridge interface, not a catalog item: `LSF` (skip on link flag),
`LCF`, `LRB18` / `LRB18!LLAM` (read 18-bit word), `LLB18!LLAM` (write),
`LSA` / `LKD` (status and disconnect on the exit paths), `LLB6` /
`LKE!LLB6` (6-bit control bytes). The link ran with interrupts off —
the `WAITLK` loop polls the flag while hand-servicing the display and
keyboard — so the device raises no IRQ. With no port attached it is the
robust-first stub: `LSF` always skips, and a `TITAN` command typed at an
empty socket returns an error note instead of wedging the machine.

**`TitanPort`** is the seam — five calls a transport can carry
anywhere: `control / send / recv / ready / disconnect`. Because the
PDP-7 polls `LSF`, the 1969 wait loop *is* the await; no callbacks
needed. An in-process port answers instantly. A remote port buffers
arriving frames behind `ready()` and the same 1972 software works
unmodified over a WebSocket.

**`BlockletHost`** is the session state machine from the `/LTPIX`
routine (listing pages 21–24), decoded in
[TITAN-LINK-PROTOCOL.md](../../characters/heinz-lemke/sources/pdp7-reference/TITAN-LINK-PROTOCOL.md):

- serves the 4-word redundantly-checked headers — word 2 is word 1
  complemented, and the PDP requires `(w1^w2)+(w3^w4)` to be all-ones;
- sets the count per blocklet (a blocklet carries exactly `count` words
  — the end-of-transfer test's `ISZ BSZ` pre-increments the
  complemented count, an off-by-one the acceptance test caught live);
- accumulates the same running 18-bit checksum the PDP's `RW` routine
  does, and answers with it so `SAD CKS` matches;
- says goodbye with a zero-count header.

The acceptance test (`type TITAN and SYMELEC phones tiny-titan` in
[cabinet.test.ts](src/cabinet.test.ts)) boots SYMELEC, types `TITAN` on
the emulated KSR-33, and records the transfer. `MESIN` hashes the first
three characters to `271424`, dispatches to `LTPX`, and the first word
on the wire is `PXID` — `767676`, PIXIE's magic stream heading —
followed by `DSBEG`, `DSEND`, `SAVINS`, and the live ring words from
core, checksummed, matched, disconnected. The five-command teletype
language that gets you there (`LABEL`, `UNLABEL`, `TITAN`, `GRID`,
`START`) is documented in [DESIGN.md](DESIGN.md#tiny-titan).

Two wire details worth their salt:

- The CPU strips bit `010` from every IOT as clear-AC, so the device
  sees `LRB18` (702252) as pulse 42, not 52.
- The NAK instruction is spelled `LLB6 10` — it reaches the device as
  control 0 with the accumulator pre-cleared, because the `010` *is*
  the clear-AC bit. The hardware winks; the protocol works anyway.

## What it could do

Every rung below is the same `BlockletHost` with more behind it; the
device and the 1972 software never change.

**Serve structures back.** Direction bit `200000` in the header turns
the queue around: Titan streams, the PDP reads, relocates pointers by
`RELCON`, and displays the received drawing. This is the test-model
pipeline in [DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module):
build a drawing as a TS object graph, encode it to ring words, hand it
to 1969 PIXIE over the link, and watch the tube. The encode/decode
codec's format truth is the wire envelope in
[TITAN-LINK-PROTOCOL.md](../../characters/heinz-lemke/sources/pdp7-reference/TITAN-LINK-PROTOCOL.md)
— atoms with top 5 bits zero, NIL spelled as the `JMS` opcode value,
block headers of `20000` plus a 13-bit length.

This rung was prototyped and lost. `packages/pixie/dist/pixie.test.js`
(compiled 25 Sep) calls a `BlockletHost.serving(encodeTransfer(photo))`
that is not in the source: it served a photograph of the boot workspace
back and asserted the checksums matched, with a note that SYMELEC's
name-list rebuild halts on an empty `SAVINS`, so the payload must be a
well-formed drawing. Two things to fix when it is rebuilt: its no-NAK
check looks for control `010`, but the NAK arrives as control `0`; and
`RW`'s read path follows every `LRB18` with an unskipped `LLB18!LLAM`,
which a serving host must not mistake for data from the PDP.

**Filestore.** Named slots for ring files: `localStorage` or OPFS in
the browser, the filesystem on node. Titan's actual job — PIXIE drew,
Titan remembered. Save a drawing by typing `TITAN`, reload the page,
type `TITAN` again, and the drawing comes back through the same
handshake it used in 1972.

**A real server.** The `TitanPort` seam behind a WebSocket makes
tiny-titan an actual remote machine again — one host process serving
many emulated PDP-7s, which is more than Cambridge ever gave it. Two
browser tabs sharing one filestore is two PDP-7s on one Titan;
collaborative PIXIE falls out of a protocol designed three decades
before the word.

**Examine/deposit alongside.** Remote control of the cabinet is not a
console protocol — the Cabinet is a TS object, and step/examine/deposit
ride the same socket in a dozen lines. The link carries drawings; the
bench carries the machine.

## Where things are

| What | Where |
|---|---|
| the module | [`src/plugins/tiny-titan.ts`](src/plugins/tiny-titan.ts) |
| protocol decode | [`TITAN-LINK-PROTOCOL.md`](../../characters/heinz-lemke/sources/pdp7-reference/TITAN-LINK-PROTOCOL.md) |
| primary source | [`symelec-listing.txt`](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt), `/LTPIX` at 1701 |
| device + command language | [DESIGN.md](DESIGN.md#tiny-titan) |
| tests | [`src/cabinet.test.ts`](src/cabinet.test.ts) — echo unit test and the `TITAN` acceptance test |

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TRACKING](TRACKING.md) · [PORTRAIT](PORTRAIT.md) · [OFF-BY-ONE](OFF-BY-ONE.md)
