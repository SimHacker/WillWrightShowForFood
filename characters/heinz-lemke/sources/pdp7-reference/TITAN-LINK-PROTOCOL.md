# The PDP-7 ↔ Titan link protocol — anatomy and reimplementation architecture

What actually moved over Wiseman's wire, decoded from the recovered listing
([`symelec-listing.txt`](../pixie-assembler-listing-1972/symelec-listing.txt), the
`/LTPIX/RELOC` section, SYMELEC pages 21–24, addresses 1701–2146), plus the architecture
for reimplementing the Titan side as a modern TypeScript service. Companion to the
[emulation plan](EMULATION-PLAN.md). This is a design sketch — nothing here is built yet.

## High level: what the protocol is

A synchronous, half-duplex, word-at-a-time transfer of a **serialized object graph** — a
PIXIE ring-structure file — between the PDP-7 and application programs on Titan, in either
direction, with:

- **framing** in "blocklets" (a redundant 4-word header + up to 8K-word data block + checksum),
- **integrity** per blocklet (running 18-bit additive checksum, compared against the
  sender's; mismatch → NAK and abort),
- **retry** at the header level (malformed header → re-request),
- **typing** (a magic word, `PXID = 767676`, opens every stream; "not PIXIE data" is a
  distinct error, which tells you the link carried *other* kinds of traffic too),
- **bounds checking** (incoming structure too large for the PDP-7's data-structure area →
  error exit),
- **pointer swizzling** (after a Titan→PDP transfer, a relocation pass walks the ring
  structure and rebases every pointer by a relocation constant computed from the stream
  heading — the 1969 answer to "you can't memcpy an object graph between machines"),
- **user abort** (Ctrl-X on the teletype cancels a transfer mid-flight),
- and — the detail that gives the game away — **the display keeps drawing during
  transfers**: the wait-for-link-word loop also polls the keyboard and restarts the Type
  340's display file whenever it hits a stop code. A single-threaded event loop servicing
  UI while blocked on network I/O. This is the NeWS / AJAX pattern with the serial numbers
  original.

So: not a terminal protocol, not a general file system protocol — a **structured data
interchange protocol for one application's object model**, with Titan as the big peer
running storage and computation.

## Low level: the wire, from the listing

**The instructions.** The link is programmed through custom IOTs no DEC manual documents
(Cambridge hardware): `LCF` (clear link flag), `LSF` (skip on link flag), `LKE` (enable),
`LLB6` (send a 6-bit control byte), `LLB18` (send an 18-bit word), `LRB18` (read an 18-bit
word), `LLAM` (microcoded with reads/writes; clear-AC-style modifier), `LSA` / `LKD`
(status/disconnect, used in the error path), plus `IDSI`/`IDLA` display IOTs serviced
inside the wait loop.

**Session opening** (`LTPX`, 1701): interrupts off (`IOF`), link flag cleared, then a
6-bit control code `4` requests headers; a second code `6` follows during the handshake.
Control code `010` is the NAK sent on checksum failure.

**Blocklet header** — four 18-bit words, redundantly encoded: word 1 (`HDR1`) carries the
direction bit in its top bits and the word count in its low 13 bits (`AND (17777`);
words 2 and 4 are check words (the code XORs pairs and requires the sum to come out
all-ones — `CMA; SZA!CLA; JMP TH` retries the whole header on any mismatch). A header
whose word count is zero means **end of transfer, normal exit**.

**Direction in-band:** the read/write subroutine (`RW`, 2107) rotates `HDR1`'s top bit
into the link register and does `LRB18` (read from Titan) or `LLB18` (write to Titan)
accordingly — *one code path for both directions*, steered by the header. The same loop
accumulates the running checksum.

**First blocklet only — the stream heading**, four words: `PXID` (magic `767676`, else
error "not PIXIE data"), `DSBEG` and `DSEND` (the data structure's begin/end addresses in
the *sender's* memory), and `SAVINS` (the ring's entry pointer). The receiver computes
`RELCON = localBEG − remoteBEG` (+1 in the listing's complement arithmetic), rejects
structures that won't fit ("DS TO LONG"), and relocates `SAVINS` immediately.

**Data area:** words stream one at a time through `RW`; if the local structure runs out
before the blocklet does, the PDP-7 pads with zeros. After each blocklet, the PDP-7 reads
Titan's checksum and compares (`SAD CKS`): match → request next blocklet (`JMP TX`);
mismatch → send NAK `010`, disconnect, error exit.

**Relocation pass** (Titan→PDP only, 2040–2071): walk the received ring structure;
skip atoms (top 5 bits zero) and NIL items (NIL is literally the `JMS` opcode value —
the same `X=JMS,` idiom the transcription arbitration uncovered); add `RELCON` to every
pointer; on a block header (top bits `20000`), skip the block's data using its embedded
length. Serialization *and* deserialization of a linked heap, in ~30 instructions.

**The wait loop** (`WAITLK`, 2125): poll teletype flag — Ctrl-X aborts to `BERTP1`; poll
display — if the 340 hit a stop code, restart it with `IDLA`; poll link flag (`LSF`) —
loop until the word arrives. Three devices, one loop, no interrupts (they're off).

## Where are the verbs?

Searching the whole listing for everything ever sent down the link: the wire carries
**three tiny session verbs and no application verbs at all**. The 6-bit control channel
(`LLB6`) sends `4` (start / request headers), `6` (handshake), and `010` (NAK); the
blocklet header carries the direction bit; `PXID` types the stream. That's the entire
in-band vocabulary.

So how did anything ever *happen*? Two places, neither on the wire:

1. **The user invoked the verb on the PDP-7.** SYMELEC's command dispatcher has a
   command-table entry (word `4130`, packed characters, commented `/TITAN`) that jumps to
   `MESIN5` — "`HERE IF TITAN COMMUNICATION`" — which readies the data structure
   (`LAW SAVINS; FINDN` — "in case writing to Titan") and calls the transfer. Talking to
   Titan was a *command in PIXIE's UI*, peer to its drawing commands.
2. **The endpoint was the verb.** What Titan did with the arriving ring file was decided
   by which application program user HL1470 had running on the far side. Send your model
   to the filestore program: it gets stored. Send it to an analysis program: it gets
   computed on. *Where you sent stuff is what verbed it* — precisely a web endpoint: you
   don't send verbs to a server either, you POST stuff at a URL and the route determines
   the semantics.

And it is emphatically **not** an asynchronous message system — no Simula coroutines, no
actor mailboxes. It's synchronous, half-duplex, polling, with interrupts explicitly off.
The *illusion* of asynchrony is manufactured inside the wait loop, which services the
display and keyboard while blocked on the link — cooperative multitasking hand-rolled into
the device driver. One verb noun-ed, you might say: the only thing you do is move stuff,
and moving stuff is arranged so that everything else keeps happening.

## Code or data? Titan as the build server

The listing's own title line answers where code came from: assembled on Titan, 12/2/72, by
user HL1470, on the Cambridge CAD Group Assembler. **Titan was PIXIE's source repository,
build server, and file server of code** — the PDP-7 never assembled or compiled anything
in its life. But note what the recovered link routine is shaped for: `PXID` typing,
data-structure bounds checks, ring-pointer relocation. It is a *model* mover, not a
program loader. Binaries most plausibly traveled the same way Ken Thompson's did from
GECOS at Bell Labs the same year: punched to paper tape on the big machine, carried to
the PDP-7's reader. Code by sneakernet, models by wire.

That sharpens the genealogy joke into taxonomy: **PIXIE is proto-AJAX, not proto-NeWS.**
The browser-that-downloads-code pattern (NeWS PostScript, JavaScript) moves *programs*
into the interactive front end; PIXIE moved *data* into a fixed front-end program —
which is exactly XMLHttpRequest exchanging structured state with a server. NeWS's mobile
code had to wait for machines that could afford to compile. The distributed-UI split
itself — interaction local, computation and storage remote — is fully present in 1969.

## Did anything else speak it?

**No — one wire, one pair of machines, and the software is bespoke.** The link hardware
was Wiseman's custom Cambridge interface; the Titan end was covered by Cambridge
supervisor planning documents ([PD/10 in the CUCPS archive](https://cucps.soc.srcf.net/titan/)),
and the CAD group's other PDP-7 programs presumably shared the blocklet layer — the
`PXID` check existing at all implies non-PIXIE streams on the same link. But nothing
outside that room ever spoke it. The Titan-side application programs Heinz talked to
nightly for three years are lost. That asymmetry — *PDP-7 side recovered in full,
Titan side gone* — is exactly what the plug-in architecture below is shaped around.

## Storage or simulation?

Both, in layers. The **protocol** is pure transport: move a typed, checksummed,
relocatable object graph. The **semantics** lived in whatever Titan program sat behind
the link: the filestore (park your model tonight, retrieve it tomorrow night) and
application computation on the model (the 1967 system analysis anticipated exactly this
split: interactive front end, computation backend). PIXIE didn't know or care which — it
sent a ring file and eventually got a ring file back. That indifference is the plug-in
surface, sixty years early.

## Reimplementation architecture — TypeScript service, C kept to a stub

**Decision: no protocol logic in C.** The only C written is a thin SIMH `LINK` device
(modeled on `PDP18B/pdp18b_g2tty.c`, which already attaches to TCP ports) that maps the
link IOTs to a byte stream: `LLB6`/`LLB18` → write frames, `LRB18` → read frames, `LSF` →
"data available", `LKD` → close. A dumb pipe, ~200 lines, written once and never extended.
Everyone else — students, hackers, turists — extends the system in TypeScript. Asking
people to write C to add a Titan application is how you get zero Titan applications.

```
┌─────────────────────┐   link IOTs    ┌──────────────────────────────────────┐
│ SIMH PDP-7 (C)      │◄──────────────►│ LINK device (C, dumb pipe, ~200 loc) │
│ + type340 + lightpen│                └───────────────┬──────────────────────┘
└─────────────────────┘                                │ TCP
┌─────────────────────┐                                ▼
│ Browser PDP-7 (TS)  │   in-process   ┌──────────────────────────────────────┐
│ + canvas 340        │◄──────────────►│ TITAN SERVICE (SvelteKit, TS)        │
└─────────────────────┘   or WebSocket │                                      │
                                       │  wire adapters: tcp / ws / in-proc   │
                                       │  blocklet codec (framing, checksums) │
                                       │  session state machine               │
                                       │  ring-structure codec (parse/build)  │
                                       │  ── plug-in surface ──               │
                                       │  applications: TitanApplication[]    │
                                       │  UI: filestore browser, ring viewer, │
                                       │      blocklet wireshark, session log │
                                       └──────────────────────────────────────┘
```

**Package layout (one SvelteKit app, `titan/` — location TBD when we build):**

- `src/lib/link/` — wire adapters: `TcpLinkServer` (SIMH attaches to it), WebSocket
  endpoint (browser bench, remote SIMH via bridge), `InProcessLink` (browser-only demo,
  no server at all — the whole Titan runs client-side too).
- `src/lib/blocklet/` — the codec: 4-word redundant headers, direction bit, word counts,
  running checksums, NAK `010`, end-of-transfer header. A faithful state machine of
  `LTPX`: `AWAIT_HEADER → STREAM_HEADING? → DATA → CHECKSUM → (next | END | NAK)`.
- `src/lib/ring/` — PIXIE ring-structure codec: atoms, NIL-as-`JMS`-value, block headers
  (`20000` + 13-bit length), pointer graph in and out of 18-bit words. This is the layer
  that turns "an array of octal" into "a model you can inspect, render, and transform."
- `src/lib/titan/` — the plug-in surface:

```ts
interface TitanApplication {
  id: string;                     // "filestore", "echo", "circuit-analysis", ...
  describe(): string;
  // A PIXIE ring file arrives from the PDP-7; return a ring file to send
  // back (immediately or on the PDP-7's next fetch), or null for store-only.
  accept(file: PixieRingFile, session: LinkSession): Promise<PixieRingFile | null>;
}
```

  Ship three: `filestore` (named slots, persisted — the honest 1969 workload),
  `echo` (round-trip test: send a model, get it back, diff), and a
  `circuit-analysis` **stub** that walks a SYMELEC electrical diagram's rings and
  returns it annotated — a plug-in socket where a real simulation engine (SPICE bridge?
  a student project?) can dock later. Lost Titan programs become an extension point
  instead of a blocker.

- `src/routes/` — the human side: filestore browser, a **ring viewer** (render subpictures
  from the data structure — Titan gets a screen this time), and a **blocklet wireshark**
  showing live header/data/checksum exchanges with octal and decoded views side by side.
  The protocol is the curriculum; the UI should teach it.

**Why this shape wins:** the blocklet and ring codecs are written once in TypeScript and
shared by *both* benches — the SvelteKit server (talking to SIMH over TCP) and the
in-browser PDP-7 (calling it as a library). Central or local is a deployment choice, not
an architecture choice. And the "hard part that might be hard to reimplement" — Titan's
lost application programs — is explicitly stubbed behind `TitanApplication`, so the demo
never blocks on archaeology.

↑ [emulation plan](EMULATION-PLAN.md) · [turist guide](GUIDE.md) · [reference library](README.md) · [PIXIE listing](../pixie-assembler-listing-1972/README.md)
