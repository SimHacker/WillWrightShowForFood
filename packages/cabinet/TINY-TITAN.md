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

**Messages, not just drawings.** The link has three session verbs and no
application verbs: the stuff, and where it goes, say what to do. Keep that
rule and add a second stream type beside `PXID`: a message is a ring whose
head names its handler (a printname atom), carried in the same blocklets
with the same checksums and relocation. PIXIE only ever receives `PXID`
drawings, since it rejects anything else ("not PIXIE data"); our own VMs
accept both. The PDP always opens the session and Titan's header sets the
direction, so a VM collects its mail by asking: control 4, then Titan
either reads the VM's outgoing message or serves the next one queued for
it. Our own VMs can have new IOTs, so an attention flag lets Titan ring
first. Between VMs sharing a memory window, a message can be one name, a
pointer, instead of a copy.

**Device events are messages too.** The applet already records everything
that reaches a machine from outside as [session events](src/session.ts),
stamped in machine cycles: `sw` (AC switches), `pen` (x, y, down,
aperture), `tty` (keys), `poke` (a deposit). Its comment already expects
tiny-titan messages as another kind. Make that vocabulary the wire format
for device events and add the rest of the console: `reset`, `start addr`,
`stop`, `continue`, `examine`, `readin` (paper tape), the address
switches, and `program` (the applet's program selector: boot SYMELEC,
DUEL, LANDER …). The emulator handles these, not the program: a pen event
moves the cabinet's pen, a switch event sets the switch register, a reset
presses the key. The running program sees what it saw in 1969 and needs
no change. So one VM can steer another's pen, type at its teletype, flip
its switches or reboot it into another program, and a recorded session is
a message log, replayable at any speed.

**Services, and tiny-its.** Titan can answer and send messages itself.
Give the host a few services, each a named endpoint:

- `services`: what is offered, discovery included.
- `who`: the PDP-7s on the bus, what each is running, its PC, running or
  halted, the windows it maps, who is watching it.
- `peek`: read another machine's core; the live ring view, remotely.
- `send`: deliver a message or a device event to a machine or a handler.
- `filestore`: named ring files (above).
- `lock`, `unlock`, `barrier`: the host handles one request at a time, so
  it is a lock manager for free.
- `clock`: the cycle count, for runs kept in step.

Call that service layer **tiny-its**, after MIT's Incompatible
Timesharing System: named as a joke on CTSS the way tiny-titan is one on
Titan, and famously open (no passwords, tourists welcome, `:PEEK` at
anyone's job). tiny-titan is the link card and the session; tiny-its is
the timesharing system behind it, for machines that were never
timeshared. The openness suits a public exhibit, with one limit on a real
server: visitors get `who` and `peek`, and anything that writes (`poke`,
device events, `reset`, `program`) is scoped to machines the sender owns
or was invited to.

**tiny-its is HACTRN for the cabinet.** On ITS your top-level job was
DDT, called HACTRN, and DDT was the shell and the debugger at once: the
same keystrokes that ran a program opened its memory. Jobs under it
could be stopped, examined, patched and continued, and with `:UJOB`
somebody else's job too. That was how people collaborated: Don's
`DPTSTOK/-1` reached into another user's running job. tiny-its gives
every VM that treatment, all over tiny-titan messages:

- jobs: list, select, boot a program, stop, continue, start at an
  address, reset, kill;
- memory: examine and deposit (`addr/` opens a word, as in any DDT),
  symbolic, from each program's symbol table;
- disassemble and assemble in place, with the cabinet's own
  disassembler and `asm.ts` (DEC and Cambridge dialects, `as7` to come);
- dump and load: copy a range, a segment or a whole core in or out as
  a filestore file, a paper tape or a ring file, and from one VM into
  another;
- watch: follow another machine's core, tube or teletype live.

Because it is messages, a VM can be the DDT: a Forth on one PDP-7 can
stop, patch and restart another. The browser front end is the modern
half: ITS syntax for those who type it, pie menus, help, and a panel of
all your jobs for everyone else.

It is a tribute, the way [Tiny Life](https://tinylifegame.com/) is to
The Sims: small, retro, and well designed now, not a replica. It is also
a back-port. DDT began on MIT's PDP-1 in 1961, and DEC shipped one for
the PDP-7; ITS grew its manners on the PDP-6 and PDP-10 afterward.
tiny-its brings those manners back to the class of machine DDT started
on, the way this cabinet brings Unix home to the PDP-7 it was born on.

**Not a timesharing system itself.** tiny-its does one thing at a time: it
is a command interpreter. The parallel part is the VMs, which the
backplane steps. It is the live programming command line for all of
them, and it needs only a teletype, no display: the cabinet's KSR-33
panel, a terminal on the server, or a PDP-7 VM typing at it.

**Shared memory and locks are its to manage.** The per-VM sharing config
and the implicit locks in
[DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module)
are the same state that tiny-its commands edit; the YAML is the saved
form. Commands cover:

- segments: create, resize, delete, snapshot, copy;
- maps: map and unmap a segment into a VM at an address, read-write or
  read-only, and list who maps what;
- locks: define one over symbol ranges (held inside or free inside), list
  holders and waiters, watch stray writes to a window, and break a
  deadlock by hand.

**Symbol tables and source maps, as a protocol.** Each VM can export a
symbol table, optionally, and tiny-its and the emulator's panels use it
for everything: examine by name (`FLST/`), disassemble a routine,
show its source, name the lock sections. A symbol is a name, an address,
a kind (code, variable, constant, literal, Forth word), a length where
known, its segment, and a source file and line where known. Tables carry
a generation number, so a live change (a new Forth word, a patch) tells
every viewer to refresh. Where they come from:

- **Our assembler:** `asm.ts` already gives a static symbol table and an
  address to source line map ([`sourceFromAsm`](src/source.ts)). The 1972
  listing gives the same through `sourceFromListing` and
  `symelec-symbols.tsv`. The applet's symbol dropdown, which scrolls the
  octal view, disassembles, or opens the source, already runs on these.
- **`as7` and Unix:** `as7` writes a listing and a name list, and PDP-7
  Unix had its own `nm`, so Unix programs can export theirs.
- **Mitch's Forth, live and without changing it:** its dictionary is a
  linked list of two-word headers (length and first three characters),
  so the host can walk it in core and list every word with its address.
  Full names and a source map come from the feeding side: the host types
  the source in, so it knows which line was being read while `HERE`
  moved, and maps each new word's address range to that file and line.
  With IP in location 10, the panels can then show which Forth word is
  running and where it came from.

All of it is optional, and each piece helps: tiny-its commands, the
debugger, the source view, program visualisation panels.

## Where things are

| What | Where |
|---|---|
| the module | [`src/plugins/tiny-titan.ts`](src/plugins/tiny-titan.ts) |
| protocol decode | [`TITAN-LINK-PROTOCOL.md`](../../characters/heinz-lemke/sources/pdp7-reference/TITAN-LINK-PROTOCOL.md) |
| primary source | [`symelec-listing.txt`](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt), `/LTPIX` at 1701 |
| device + command language | [DESIGN.md](DESIGN.md#tiny-titan) |
| tests | [`src/cabinet.test.ts`](src/cabinet.test.ts) — echo unit test and the `TITAN` acceptance test |

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TRACKING](TRACKING.md) · [PORTRAIT](PORTRAIT.md) · [OFF-BY-ONE](OFF-BY-ONE.md)
