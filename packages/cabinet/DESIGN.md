# Cabinet design — what PIXIE actually demands

Extracted from the transcribed listing
([`symelec-listing.txt`](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt),
zero transcription findings), not from DEC manuals alone. The rule throughout:
**instance first** — hardwire what SYMELEC needs, comment where the abstraction
would go, generate it lazily when a second instance demands it. Stated in full
as the porting method — *work backwards from the software you want to run* —
in the [TinyTeco runbook](../tiny-teco/FULL-ITS-TECO.md), where it was
discovered the first time the same week.

## Memory representation (decided)

One word per typed-array element. `Uint32Array` for word sizes ≤ 32 bits.
Never bit-pack: the whole PDP-7 core is 32KB unpacked and indexed typed-array
access is one machine load; packed access is multi-byte reconstruction in the
hottest loop. JS bitwise ops truncate at 32 bits, so a future wide-word cabinet
(36-bit PDP-10, 48-bit Titan) picks its own representation per plugin —
hi/lo pairs or plain numbers with arithmetic (safe to 2^53). **Word storage is
a plugin choice, not a backplane abstraction.** The backplane promises only:
a word is a JS number.

## The target program

- Load `symelec.oct` alone. It is self-contained: 0o21–0o11741 (17–5089 words),
  fits 8K. Boot: start at 0o22 (`JMP BEGRTP`).
- `rsppix.oct` overlays the same addresses with different contents — a separate
  standalone program, not a co-resident module. (688 shared addresses, 687
  differ. Measured 22 Sep 2026; closes the EMULATION-PLAN layout question.)

## Device contract — every IOT SYMELEC issues

| dev | IOTs (octal) | box |
|-----|--------------|-----|
| 00 | CLSF 700001 · IOF 700002 · ION 700042 · CLON 700044 | clock + interrupt system |
| 03 | KSF 700301 · KRB 700312 | keyboard |
| 04 | TSF 700401 · TCF 700402 · TLS 700406 | teleprinter |
| 05 | IDVE 700501 · IDRS 700504 | display: v-edge skip, resume |
| 06 | IDSI 700601 · IDLA 700606 | display: stop-code skip, load addr & go |
| 07 | IDSP 700701 · IDRC 700712 | display: pen skip, read beam coords |
| 10 | IDHE 701001 | display: h-edge skip |
| 11 | IDPN 701101 skip · 701112 read | **cabinet extension, not 1972**: which pen fired (1–8, 0 = none). Free device code; no PIXIE binary issues it, so stock software is unaffected. Reassemble PIXIE to use it — multiple pens, Engelbart tribute: drag two corners of a rectangle, two radial menus at once, a quiver of eight wands. |
| 22–23 | LSF 702201 · LCF 702222 · LRB18 702252 · LLB18!LLAM 702264 · LRB18!LLAM 702276 · LSA 702301 · LKD 702322 · LLB6 702344 · LKE!LLB6 702364 | Titan link |
| 33 | CAF 703302 | clear all flags |

Everything else: no-op (already the backplane default).

## Interrupts — the one missing bus concept

PIXIE is interrupt-driven. `BEGRTP` deposits `JMP INT` at location 1, `ION`.
The PDP-7 facility: on request with interrupts enabled, save PC (link in the
sign bit) at 0, jump to 1, interrupts off; `ION` re-enables (one-instruction
delay); handler returns `LAC INT1; ION; JMP I 0`. One level, no vectors —
the handler identifies the device by skip-chain:

    INT: IDSP→PEN · IDSI→STPCD · IDVE→EDGEV · IDHE→EDGEH · TSF→OUT · KSF→INP · CLSF→CLOCK

Backplane addition: a single IRQ line devices can raise; the CPU plugin
samples it and owns what an interrupt *does*. Roy's SIMH `GO` blanks for
exactly this reason — no device ever fires.

## The Type 340 is a display processor, not a segment sink

Contract decoded from `INT`/`PEN`/`TRCR`/`STPCD` (listing 5320–5533):

1. **Executes display words fetched from core** starting at the `IDLA`
   address. Hardwire: hand the 340 `cpu.read`.
   `// abstract to a DMA port when a second DMA device exists`
2. **Stoppable and resumable mid-file.** Pen hit or stop code freezes the
   display PC; `IDRS` resumes in place.
3. **Segments carry provenance** — the display-file address that drew them.
   PIXIE identifies *what* was hit via Type 347 `DJS` return linkage in low
   core (it reads locations 3 and 5 to tell lightbutton from drawing).
4. **`IDRC` returns packed beam coordinates**, read twice: rotate-1 +
   `AND 1776` → TEMPY, rotate-8 + `AND 1776` → TEMPX. Hardwire that exact
   packing; it satisfies the only program that reads it.
5. **Edge flags** (IDVE/IDHE) when the beam runs off the 1024×1024 grid.
6. **Stop codes** raise IDSI — frame boundaries; the clock handler flips
   intensity bits in the display file for blink.

Display-word codec: the Cambridge assembler's `DISP` encodings are
undocumented but recoverable — thousands of octal+mnemonic pairs in the
listing (`PAR SB`=160000 · `VEC ES -34 14`=406234 · `DJP TEMPDF`=404441 ·
`DDS SB 3`=360003), cross-checked against the mirrored H-340 manual.
**Decode only the words SYMELEC contains**; unknown display word = log and
skip (robust-first). No Type 342 character generator until a character word
appears in the file — and when one does, the glyph shapes come from the
`chars[]` table in SIMH's `display/type340.c`, where **Lars Brinkhoff
recovered the letterforms from AI lab film footage** (annotated per glyph:
`AI film 75`, `AI film 104`, Knight TV fills). The shapes question is
already answered, on celluloid.

## The light pen

Pen hit = pointer within aperture of a *freshly intensified* segment during
display execution (the real pen saw the blue flash, never the afterglow).
The hit stops the display; PIXIE's own `TRCR` moves the tracking cross —
the cross follows the mouse because 1969 software tracks it. The radial
lightbuttons (`LBD`, `PSD/PAD/PRD/PCD/PLD/PXD`) are PIXIE's display file:
**we do not implement radial menus; we implement the pen honestly and the
radial menus appear.** The full tracking machinery — cross, `TRCR`,
`POSCR`, the `SRAST` reacquisition raster, the Promethean acquisition
handoff — is walked through against the listing in
[TRACKING.md](TRACKING.md), and proven live by the tracking acceptance
test.

Two pen modes as a dimensional control:
- `honest` — PIXIE's incremental tracking; can lose the cross on fast
  motion, which is period-correct. The demo mode.
- `assist` — teleport the cross to the pointer. For kiosks and impatience.

## CPU plugin — verified gaps against the source

| Gap | Evidence | Cost of skipping |
|-----|----------|------------------|
| OPR group (RCL RTR RAL SZA SNA SMA SKP CMA HLT…) | ~280 uses | nothing runs |
| LAW (76xxxx) | `LAW LB` before every IDLA | display never starts |
| XCT | `XCT I ENTER-JMS` computed dispatch | silent corruption |
| Auto-index 10–17 (increment before use on indirect) | `DAC I 10`, `LAC I 11` in ring inner loops | ring walks garbage |
| EAE subset | ~11 words (64xxxx) | implement only the ops present |
| Interrupt facility | whole architecture | see above |

## tiny-titan

Per [`TITAN-LINK-PROTOCOL.md`](../../characters/heinz-lemke/sources/pdp7-reference/TITAN-LINK-PROTOCOL.md)
— the codec and plug-in surface are designed there; the module is
[`src/plugins/tiny-titan.ts`](src/plugins/tiny-titan.ts), and
[TINY-TITAN.md](TINY-TITAN.md) is its own page — what it does now,
what it could do, and why the name is the punchline. Two layers,
split so the far side is repackageable:

- **`TinyTitan`** is the cabinet device, claiming devs 22–23. Its pulses
  are what the CPU delivers after stripping bit `010` (clear-AC): `LSF`
  arrives as pulse 01, `LRB18` as 42, `LRB18!LLAM` as 66, `LLB18!LLAM`
  as 64; on dev 23, `LLB6` as 44, `LKE!LLB6` as 64 — and the NAK
  spelling `LLB6 10` reaches the device as control 0 with AC
  pre-cleared, the `010` being the clear-AC bit itself. The link ran
  with interrupts off, so the device raises no IRQ.
- **`TitanPort`** is the seam: `control / send / recv / ready /
  disconnect`, five calls a transport can carry anywhere. The PDP-7
  polls `LSF` in `WAITLK` — the 1969 polling loop *is* the await — so
  an in-process port answers instantly and a remote one (WebSocket,
  fetch) just buffers arrivals behind `ready()`. Same host class,
  three deployments: in the browser beside the emulator, in-process on
  node, or a real server streaming frames. Repackaging is lifting the
  file into its own package; it imports only the bus types.
- **`BlockletHost`** implements the session state machine from the
  `/LTPIX` listing: serves the 4-word redundantly-checked headers
  (`(w1^w2)+(w3^w4)` must be all-ones), sets the count per blocklet
  (a blocklet carries exactly `count` RW words — the end test's
  `ISZ BSZ` pre-increments the complemented count), accumulates RW's
  running 18-bit checksum, answers it for `SAD CKS`, and says goodbye
  with a zero-count header.

Ladder: **stub met** (portless `TinyTitan`: `LSF` always skips, the
`TITAN` command cannot wedge the machine) and **echo met** — the
acceptance test boots SYMELEC, types `TITAN` on the teletype, and the
recorded transfer opens with `PXID` followed by `DSBEG`/`DSEND`/
`SAVINS` and the live ring words from core. **Decode met** in
[`packages/pixie`](../pixie/): its acceptance test decodes that
transfer, checks the heading against the `BEG`, `END` and `SAVINS`
variables in core, classifies every word, and re-encodes the image to
exactly the words that crossed the wire. Next: `filestore` (named
slots; localStorage in browser, fs on node), then serving structures
*back* (direction bit `0o200000`), which is the same machine with the
queue running the other way.

### The command language it answers to

SYMELEC's teletype language is five commands and two message forms.
`INP` buffers a line (mark-parity ASCII, CR = `215` ends it); `MESIN`
hashes the **first three characters** — `SUMB = (SUMB<<6) + char` —
against the `MESL` table and `XCT`s the matching entry:

| typed | hash | does |
|---|---|---|
| `LABEL` | `170402` | `ISZ RLABEL` — name elements as you draw |
| `UNLABEL` | `302114` | `DZM RLABEL` — stop |
| `TITAN` | `271424` | `JMS LTPX` — phone the filestore |
| `GRID` | `122511` | coarsen the snap grid to 16 units |
| `START` | `262701` | reinitialize |

Anything else prints `?`. A line starting `/` is a label text; `:`
moves the working pointer to a subpicture. `TITAN`'s four-way skip
return maps to typed error notes — checksum fail, not PIXIE data,
data won't fit — and on success SYMELEC rebuilds its name list and
puts the received picture on the tube.

Remote control is not a console protocol: the Cabinet is a TS object.
Examine/deposit/step over the same WebSocket, a dozen lines.

## The application layer — `packages/pixie` (separate module)

The cabinet is the machine; PIXIE's ring structures are an application format
and live beside it, not inside it — the way SYMELEC sat on the PDP-7.

**Ring codec, wire-compatible.** The blocklet transfer ships the
data-structure core area verbatim (stream heading `PXID`/`DSBEG`/`DSEND`/
`SAVINS`, raw words, pointers relocated on receive), so one codec covers
everything: decode 18-bit words → TS object graph (nodes, branches, rings,
subpictures), encode back. Not RAM-byte-compatible — wire-compatible; the
graph representation is ours.

Format truth, in order:
1. Wire envelope: [`TITAN-LINK-PROTOCOL.md`](../../characters/heinz-lemke/sources/pdp7-reference/TITAN-LINK-PROTOCOL.md)
   — atoms (top 5 bits zero), NIL = the `JMS` opcode value, block headers
   `20000` + 13-bit length, `RELCON` relocation.
2. Semantics: RSPPIX itself (the Ring Structure Processor, transcribed clean),
   thesis §5, Heinz's data-structures paper.

One codec, three consumers: the mini-Titan filestore; **test-model
generation** (build a drawing in TS, feed it to 1969 PIXIE over the link,
watch it render); **extraction** (pull out what the user drew with the pen).
Acceptance test for free: encode → link → PIXIE → link → decode → deep-equal.

Built in `packages/pixie`: the word classes and the relocation pass,
`RingBuilder` cells with CAR/CDR walks, `encodeTransfer`/`decodeTransfer`
with a round trip through relocation, Graftal ferns through the real 340
to SVG, and the acceptance test against the transfer 1972 SYMELEC
actually sends (PDP → Titan, re-encoded word for word). Not built: the
Titan → PDP half, so a structure made in TypeScript has not yet been
drawn by PIXIE.

**Build state, 26 Sep 2026: broken.** `packages/pixie/package.json`,
`tsconfig.json` and `src/image.ts` were never committed. `dist/image.js`
survives, and `pnpm-lock.yaml` records the devDependencies (`@types/node`,
`@wwsff/cabinet` as `workspace:*`, `typescript`). Restore them before any
work below; `index.ts` should also export `photograph` and `SYMELEC_VARS`,
which `scripts/trace-serveback.mjs` imports. Latent bug in `graftal.ts`
`toDisplayFile`: a run of only zero-length strokes emits PARAM, Y, X and no
vectors, leaving the 340 in VECTOR mode when the next PARAM word arrives.

**To do: a live view and editor of ring structures, in memory and on
disk.** The emulator exposes every word of core, so the page can show
PIXIE's ring structure as a graph while PIXIE runs: nodes, branches,
rings and subpictures from `DSBEG` to `DSEND`, with `SAVINS` marked,
updating as the pen draws. The same view opens the ring files
tiny-titan records, so the copy in memory and the copy on disk sit side
by side and a difference between them is visible. Editing goes through
the codec in both places: edit a stored file and serve it back over the
link, or deposit into core while PIXIE runs and watch the tube change.
Uses beyond the demonstration: a check on the transcription, since a
misread word shows up as a pointer to nowhere or a ring that does not
close, and a way to show Heinz his 1969 data structures running.

Panes, all linked, all driven by the running cabinet:

1. **Tube** — the live 340, as now.
2. **Core strip** — `BEG..END` as a bar, one tick per word, coloured by
   class (atom, name, NIL, block, nonitem, free list, GC mark). Watch it
   fill as the pen draws and watch the collector sweep. A second layout:
   all of core on a Hilbert curve (8K words as two 64×64 squares end to
   end), so neighbouring addresses stay neighbours on screen with no
   jumps, coloured by class, or by read and write heat from shadow
   memory.
3. **Ring graph** — elements as nodes, pointers as edges, rings drawn as
   literal circles; printnames shown as strings, blocks as arrays.
4. **Inspector** — a selected cell's octal word, class, `CAR`/`CDR`, who
   points at it (reverse pointers, computed), and which display-file
   words it compiled to.
5. **Linked brushing** — hover a stroke and its ring element lights; hover
   an element and its strokes light, through segment provenance plus a
   display-address → ring-name map recorded by the DOWN compiler. Selecting
   an element can make PIXIE blink it, as pointing mode does.
6. **Text pane** — an editable projection that round-trips (below).

Two levels, like any structured-data viewer: the cell level is universal,
because every word carries its own tag; the element level (branch between
nodes 3 and 7, a resistor) needs a schema, gated on decoding RSPPIX's
element semantics. Other RSP applications would plug in their own.

Safe editing: `photograph()` a copy, edit it, check `pointersResolve`,
and serve it back over the link (type `TITAN`). That is the 1972
workflow with the browser as Titan, and it is the serve-back rung.
Photographing each frame also gives time travel: diff before and after a
stroke.

Text formats, two layers:

- **Lossless, the golden copy:** a flat table keyed by octal address with
  class tags, in YAML or JSON. Round-trips exactly, diffs in git:
  ```yaml
  beg: 0o10000
  savins: 0o10000
  words:
    0o10000: { name: 0o10002 }   # car
    0o10001: nil                 # cdr
    0o10002: { block: [512, 400, 530, 400] }
  ```
- **Projections for people:** sexprs with `#n=` labels (cells are conses,
  NIL is NIL, labels express sharing and ring closure, e.g.
  `#1=(OWNER (MEMBER-A MEMBER-B . #1#))`, printnames read as `"FERN"`);
  YAML anchors and aliases; domain words (`node:`, `branch:`) once the
  element schema is decoded. JSON only as the flat table.

**To do: the turtle display list as ring data, sharing graftal's code.**
Split `toDisplayFile` into `polylines(strokes)` and one shared emitter,
`compilePolylines(lines) → { words, starts }`, so `toDisplayFile` keeps
its output. Store each polyline as an RSP block (raw coordinates, which
the relocation pass already leaves alone) named from a picture list
whose name is `SAVINS`. `downCompile(image)` walks the list through the
shared emitter and returns the words plus tags (display-address range →
ring name) for the pen. Acceptance: `downCompile` equals `toDisplayFile`
for the fern, still after `relocate` and a wire round trip, and a pen
hit on the tube resolves to its polyline's name. The layout is ours, not
SYMELEC's segment format, and says so until the element decode lands.
The same structure is what a PDP-7 Forth builds
([FORTH-TURTLE-340.md §9](../../characters/heinz-lemke/sources/pdp7-reference/FORTH-TURTLE-340.md#9-rings-as-a-forth-data-type)).
Background for all of this: the ring-structures section of the
[turist guide](../../characters/heinz-lemke/sources/pdp7-reference/GUIDE.md#pixies-data--ring-structures-from-the-ground-up).

**To do: the RSP library, extracted from PIXIE and shared by every VM.**
One format, two halves.

- **On the PDP-7:** RSPPIX's own routines (`SETUP`, `FLST`, `CAR`, `CDR`,
  `PUSH`, `POP`, `STAK`/`UNSTAK`, `ENTER`/`EXIT`, the collector) lifted out of
  SYMELEC as a loadable image with its layout words, so Forth (as code
  words, [FORTH-TURTLE-340.md §9](../../characters/heinz-lemke/sources/pdp7-reference/FORTH-TURTLE-340.md#9-rings-as-a-forth-data-type)),
  a Lisp or any other PDP-7 program runs the same code PIXIE does. Beside
  it, new code, never patched into PIXIE:
  - a link client: open a session, send and receive ring transfers, both
    `PXID` drawings and messages;
  - a teletype client: type at another machine, read its printout;
  - handlers: a name list from message names to routines (`HANDLES name`
    in Forth), and a dispatch loop that polls the way `WAITLK` does;
  - send, request and reply, and the device-event kinds;
  - shared windows at the same address everywhere, `ISZ` locks (lock word
    777777), safe points, and barriers through Titan.
- **In TypeScript** (`packages/pixie`, to be renamed `rsp` if Don agrees):
  the codec as now, plus the host side of all the above: message
  encode/decode, device events on the [session](src/session.ts) vocabulary,
  the tiny-its services ([TINY-TITAN.md](TINY-TITAN.md#what-it-could-do)),
  and window mapping.

Threading stays as [WEB-BENCH.md](WEB-BENCH.md) decided: none. Several
cabinets in one thread share a window by sharing one `Uint32Array`
segment, and a lock is a scheduling rule. That needs a window map in
`Pdp7.read`/`write`, whose core is one private array today. Workers and
`SharedArrayBuffer` only if one thread stops being enough.

**Sharing PIXIE's own window, unmodified.** PIXIE's memory layout is data:
sixteen words at 5157–5177 (`DFE` … `STSAVE`) that `SETUP` reads, which is
what the `core8k` and `bigpic` patches poke. With them loaded, PIXIE's data
sits in the top of the 8K: RSPPIX's `FREE`, `LOP`, `LINK` and `GDM` at
12011–12020, the compiled picture (PERMDF) from 12301, the heap `BEG`–`END`
at 13741–17200, and the name list from `BOT` at 17301. Map 12000–17777 into
every VM and keep the others' code below 12000.

- One PIXIE writes and the rest read. The name list is the root set, since
  the collector marks from it, so readers walk it too.
- The host is the lock: readers run only while PIXIE polls in `WAITLK`,
  where no splice is half done and no collection is running.
- The collector marks and sweeps in place (mark bit 200000, masked with
  577777), so pointers stay valid, but anything off the name list is swept.
  A reader that keeps a pointer, or takes cells from `FREE` to write at a
  safe point, hangs them on a named ring.
- Two PIXIEs on one heap would need changes: `TOP+1` (5170) and `OP` (2232)
  are private while `FREE`, `LOP` and `LINK` would be shared. Until then
  they trade rings over tiny-titan.
- Our own writers lock with `ISZ`: the lock word rests at 777777, the `ISZ`
  that reaches 0 skips and owns it, and unlock stores 777777 again
  (`LAW 17777` / `DAC LOCK`). Under Web Workers, `Atomics.add` or a
  test-and-set IOT on `Atomics.compareExchange`.

**Sharing is per-VM configuration, not wiring.** A VM maps none, one or
several named segments, each at an address and with an access mode.
Segments holding rings must sit at the same address in every VM, because
ring words are absolute; a flat buffer or a mailbox can go anywhere.
Sketch:

```yaml
segments:
  rings:   { words: 0o6000 }          # PIXIE's own data area, 12000-17777
  mailbox: { words: 0o100 }
vms:
  pixie: { program: symelec,   map: [{ segment: rings, at: 0o12000 }] }
  forth: { program: pdp7forth, map: [{ segment: rings, at: 0o12000 },
                                     { segment: mailbox, at: 0o7700 }] }
  view:  { program: pdp7forth, map: [{ segment: rings, at: 0o12000, access: ro }] }
  duel:  { program: duel,      map: [] }
locks:
  rings: { segment: rings, held-in: [[SETUP, GARB2]], free-in: [WAITLK] }
```

**Magic implicit locks, enforced by the emulator.** We own the emulator,
so a lock can belong to the machine instead of the program. A lock
section is a start and length taken from the symbol table, named in the
config by symbol so a reassembly moves the lock with the code. Examples:
RSPPIX, which was assembled as one block, or just its collector, `LIM`
to `GARB2`. The emulator gives a VM the lock when its PC enters a
section. Another VM about to enter a section of the same lock is not
stepped until the lock is free. Its devices keep running, so to the
program the wait looks like a slow instruction. Entry is a `JMS` into
the section and exit is the `JMP I` through that entry's return word,
so a section that calls out (`FLST` calling `LIM`) still holds the lock.
The inverse policy, *free inside*, covers PIXIE: it holds its window
everywhere except `WAITLK`. Cost: one byte per word of core, a lock
number per address, looked up on each fetch. What it can't see: a store
to shared memory from outside every section. The emulator can watch the
window and flag those. It can also see deadlock (two VMs each stalled on
the other's lock) and report it instead of hanging. The unmodified
program never knows.

**Shadow memory: bits only the emulator sees.** Core is a `Uint32Array`
holding 18-bit words, so every word has 14 spare bits, and `write` masks
them off today. Use them for tags the machine can never see. Tags live
in the segment's array, so a shared segment shares its tags too. The rule
that makes it cheap: an untagged word has its top bits zero, so the fast
path is one test (`raw > 0o777777`), and only tagged words take the slow
path. Sketch of the 14:

| Bits | Tag | Kind |
|---|---|---|
| 18 | break on execute | trap |
| 19 | watch reads | trap |
| 20 | watch writes | trap |
| 21 | watch 340 fetches | trap |
| 22–25 | lock section, 15 locks (replaces the separate byte per word) | trap |
| 26 | executed (code coverage, like `ccov7` in pdp7-unix) | sticky |
| 27 | written since boot (a read without it is an uninitialised read) | sticky |
| 28 | dirty since last snapshot | sticky |
| 29–31 | spare | |

Trap bits send the access to the slow path. Sticky bits are set by
ordinary accesses, only while that feature is on, since each costs a
store. A trap bit says only that someone cares; who and what (which VM's
breakpoint, which watch, what condition) sits in a side table keyed by
address, so two VMs can watch the same shared word differently.

**Thicker layers, in parallel arrays.** Whatever does not fit in 14
bits goes in shadow arrays of any width, indexed like core and attached
to the segment: last writer (VM, PC, cycle) for every word, read and
write counts for a heat map, the source line or message a word came
from, a short history per word. That is the shape of Valgrind's memcheck
and AddressSanitizer, here for free because we own the machine. It
covers all memory, not only shared segments, and it feeds the panels:
break on a word, show who last wrote it and from which source line, and
colour the core strip by heat or coverage.

What changes in `Pdp7`: `write` must keep the tag bits and replace only
the low 18 (`core[a] = (core[a] & ~0o777777) | word`), every read the
machine or a device sees must mask them off, and tags get their own
calls. Snapshots stay 18-bit words, portable by construction as
[WEB-BENCH.md](WEB-BENCH.md) requires; tags and layers save beside them,
optionally.

**RSP in Unix syntax.** RSPPIX is written for the Cambridge assembler,
which `asm.ts` already parses. An emitter that prints `as7` syntax
(Ken Thompson's, as in `pdp7-unix`) gives an `rsp.s`. PDP-7 Unix had no
separate linker: `as` assembled several files together (`as7 -o boot.rim
sop.s pbboot.s` in the pdp7-unix build), so linking RSP into a program
means adding it to the command line. Mitch's Forth builds with `as7`, so
its kernel takes `rsp.s` directly and wraps the routines as code words.
The layout words stay data, so each program puts the heap where it
wants. To check: whether `as7` accepts the `NAME = JMS .` idiom, or the
emitter spells the calls out.

**Shared segments under Unix: swap the mapping with the process.** PDP-7
Unix already does this for one mapping, the display buffer. The `capt`
system call stores the process's buffer address in `u.dspbuf` and calls
`movdsp`; `rele` gives it back; and the swapper (`swap` in `s1.s`) points
the display at the kernel's own buffer before swapping a process out and
back at `u.dspbuf` after swapping it in. `dskswap` (`s5.s`) moves the
64-word user area and all 4096 words of user memory (010000–017777) to
and from swap space. A shared-segment hack has the same shape:

1. the user area gains a short map list: segment, address, length;
2. two system calls beside `capt` and `rele`, map and unmap, added to the
   `swp` dispatch table;
3. a new IOT asks the emulator to map or unmap a segment for the memory
   now in core;
4. the swapper unmaps before `dskswap; 07000` and maps after
   `dskswap; 06000`, where it already calls `movdsp`;
5. `dskswap` skips mapped ranges, splitting its 4096-word transfer around
   them. Otherwise swap-out writes the shared contents to disk and
   swap-in brings a stale copy back over the live one.

Then processes share segments with each other (one is in core at a time,
and each maps its segments when it comes back in) and with other VMs: a
display list any VM's 340 refreshes from, like a frame buffer, or
PIXIE's rings read by a B program. The swap-in IOT also tells the
emulator which process is in core, so symbol tables, lock sections,
breakpoints and shadow tags switch with it. The limit is size: user space
is 4K, and PIXIE's window 12000–17777 would leave a program only
010000–011777, so map the part it needs or a smaller segment.

## Local mode and remote mode

The same cabinets run in two places. **Local:** everything in the tab, as
now. **Remote:** any number of VMs on a cloud instance under Node (they
already run headless in the tests), with the tab as a terminal. The 340's
display list goes down and device events come up: interaction local,
computation remote, the split the 1967 Cambridge system analysis drew.

- **Down: the display list.** Each frame as the segment rows
  [`toYaml`](src/media.ts) already writes (`[addr, kind, x0, y0, x1, y1,
  int, scale, subr, cycle]`), or the JSONL the `Recorder` writes. The
  provenance travels with it, so hover, the inspector and linked brushing
  work remotely. PIXIE's picture is mostly still, so send a frame only
  when it differs from the last one sent, or send only the rows that
  changed, keyed by display address.
- **Up: device events,** the [session](src/session.ts) vocabulary (`sw`,
  `pen`, `tty`, `poke`, and the console kinds). The server stamps each
  with the cycle it was applied at, so its log replays the run exactly.
- **The pen stays in the machine.** The light pen device tests segments
  as the 340 draws them, in machine time; the tab only says where the pen
  is. Latency shows up as a lagging cross, as a fast hand already
  outruns SYMELEC's tracking, so the tab draws its own pointer locally
  and the hand never lags. The cabinet's 340 takes several pens, so two
  people in two places can each hold one.
- **Later: ship the 340's program instead.** The 340 is a computer, so
  the server could send display-file words and let the tab run the 340,
  the way NeWS sent PostScript rather than pixels. Smaller, and the
  phosphor timing is exact locally, but pen hits must then travel back
  into machine time. Segments first.
- **Watchers and pens.** A VM's frames broadcast to every viewer; who
  holds a pen is floor control, handed out by tiny-its.
- **Pacing.** The server runs each machine at 1969 speed or faster; the
  tab draws at `requestAnimationFrame`. Drop frames, never events.

One seam serves both modes, as `TitanPort` already does for the link: a
display port and an event port, in-process when local, a WebSocket when
remote.

**On a shared server** the emulated code cannot leave the emulator, but
the server still trusts nothing from a tab: validate every message
against its schema, cap VMs and CPU per user, rate-limit events, cap
segments per frame (a runaway display file makes huge frames), require
ownership or an invitation for any write (the tiny-its rule), and give
VMs no host files beyond their scoped filestore.

## Media — what the machine eats and excretes

SYMELEC issues **no reader or punch IOTs** — paper tape was how code arrived
(hardware read-in mode), not a device the program touches. So tape is a
loader-side module, not a Device.

| Module | In | Out | Validation |
|--------|----|----|------------|
| tape | `.oct`, `.rim` → core | core → `.rim` | diff against Roy's converter output |
| lister | core / `.oct` | 1972 Cambridge lineprinter column format | **diff clean against the 1972 listing itself** — second full-corpus check of transcription and decoder at once |
| assembler | transcribed Cambridge-dialect source | core / `.oct` | **round-trip bit-identical against `symelec.oct`** — the lister's inverse. SYMELEC was assembled on Titan (`BY HL1470`, 12 Feb 72) in a dialect no surviving assembler speaks: `(literal` pools, `JMP , n` relative, and the `DISP` display-word mnemonics, which share the 340 codec built for rung 2. `as7` from pdp7-unix is the cross-platform precedent; the DEC assembler on the emulated iron is the period-authentic stunt. Once the round-trip is clean, PIXIE is editable — patch, reassemble, boot, and diff the segment log against the original to see exactly what changed. |
| snapshot | segment stream | SVG (provenance as data attributes), PNG | eyeball vs 1969 film frames |
| recorder | segment stream | timestamped segment log (JSONL); WebM via `captureStream` | deterministic replay |
| phosphor | segment stream | canvas fade; WebGPU dual-phosphor later | the pretty-pass, never a blocker |

Load-bearing choice: **the segment log is the one stream** — snapshot, video,
phosphor, and the pen all consume it. Record and replay it and every display
bug is reproducible; the film comparison becomes a diff, not a squint.
Media files carry YAML-jazz sidecars (source, date, provenance), repo style.

The SVG snapshot is vector-to-vector with no rasterization between: a 340
display file is already closer to SVG than to pixels. Structure survives —
**a 347 `DJS` subroutine call becomes an SVG `<g>` group**, so PIXIE's
subpicture hierarchy is the export's hierarchy, and provenance rides as
`data-` attributes: click a stroke in the browser inspector and read the
display-file address that drew it in 1972. A dead vector format translated
into the living one, structure intact.

**Provenance is a timestamp too — the drawing maps back to machine state.**
Each segment carries the display-file address that drew it *and* the
backplane cycle it was drawn on, plus the 340's state at that instant
(display PC, mode, scale, intensity, `lp_ena`). Because execution is
deterministic from a snapshot plus the input log, a cycle stamp is a
**seekable address into machine time**: click a stroke — in the live canvas,
the SVG export, or the portrait's tube — and the debugger frame re-runs to
that cycle and lands with the whole machine posed: CPU registers, the 340
mid-file, the console lamps' duty cycles. The pen already needs
freshly-intensified segments, so recency is in the record anyway; the
debugger just reads the same field. Slow mode is this scrubbed
continuously; single-step is this at grain one. Nothing new to build in the
emulator — it is the segment log, the snapshot, and the frame manager
composing.

## Cartridges and live coding

**The name.** What the menu calls a program is really a whole configuration: which machine, which
devices, what to load and from where, how to build it, how its keys map, which panels open, its
help and its demo. Emulators have names for parts of this. SIMH has the `.do` script, MAME has
drivers and software lists, and Docker's *container* means an isolated running process, which
this is not. We call the file a **cartridge**: a thing you plug into the cabinet that carries
everything needed to run one program. A **profile** is a named overlay on a cartridge (trace on,
the memory panel open in source view, speed 10×), and several can stack. Everything the cabinet
knows about a program lives in its cartridge or is referred to by it.

**The URL is a cartridge plus profiles.** `/cabinet/<cartridge>/?profile=trace,wide&size=768`.
A `yaml cabinet` fence in an article says the same things in the same words, so a link and a
transclusion embed the same preconfigured machine. `src/lib/cabinet-url.js` in the ties app is the
one parser; today it knows `program` and `size`. The query overrides the path, profiles apply left
to right, and explicit parameters win last.

**A cartridge, sketched** (today these are the objects in `apps/ties/src/lib/cabinet-programs.js`,
which become files):

```yaml
id: forth-self-hosted
label: FORTH, BUILT HERE
machine: { cpu: pdp7, core: 8192, eae: true }
devices: [teletype, clock, papertape, type340]
keyboard: { case: upper, echo: program }        # Forth echoes; UNIX is { case: lower, map: simh-unix }
listing: { user: wmb }                          # who the listings say assembled it
sources:                                        # what LIVE CODING edits, in build order
  - { path: tapes/pdp7forth/kernel.s, lang: as7 }   # assembled after pdp7-unix's sop.s, then end.s
  - { path: tapes/pdp7forth/prelude.fs, lang: forth }
  - { path: tapes/pdp7forth/turtle.fs, lang: forth }
build:
  - { step: assemble, dialect: as7, sources: [kernel.s], out: kernel }   # our assembler: source map + symbols
  - { step: paper-tape-compile, image: kernel, tape: [prelude.fs, turtle.fs], type: "TAPE\r" }
boot: { start: cold }
panels: { tty: open, display: open, live: open }
demo: forth-turtle
help: articles/cabinet-forth.md
```

**Two Forths on the menu.** `forth` boots the kernel Mitch's `as7` assembled (committed, the
baseline). `forth-self-hosted` assembles `kernel.s` in the page. Both have to agree word for word
before the second one counts. What the second needs is an `as7` front end (see Assemblers, below):
`label:`, `name = expr`, `" comments`, `.=.+n`, `<c` character literals, `1f`/`1b` relative
labels, `;` between words, and numbers that are decimal unless they start with 0. Then the
assembler's source map gives the trace, the memory panel and the debugger Mitch's own source lines,
not just addresses.

**Variants are copies, not ifdefs.** This is a design rule. Neither `as7` nor our assembler
has conditional assembly, and we won't add it. A variant is a copy of the file, changed, with a
big-endian descriptive name (most general word first), so the family sorts together and each
name says what it is. Its provenance is written down in the open, not left in git history:

- **In the file:** a header comment saying what it was copied from, at which commit, what it
  changes, and which parts must stay in step with the parent.
- **Beside the files:** a `VARIANTS.yml` listing each variant, its parent, the upstream commit,
  the differences, and the sections that have to stay the same.

Keeping the copies coherent is the LLM's job. It reads `VARIANTS.yml`, sees a change to one copy,
and carries it into the others, or says why it doesn't apply. That makes several copies cheaper
than one file full of switches: each copy reads straight through, Mitch's `as7` builds every one
of them unchanged, and the differences are visible in the names and the list.

**The first variant: name format.** Mitch's headers keep a length and three SIXBIT characters
(`EXIT` lists as `EXI_`). The copies:

- `kernel.s`: Mitch's, unchanged, the upstream.
- `kernel-names-full.s`: every character of a name kept. What differs: the 84 two-word headers
  (generated by his `tools/hdr.py`), `find`, the parser's packing of the sought name into
  `tcnt`/`tname`, the header builders in `colon`, `const`, `var` and `create`, WORDS, and any code
  that goes from a header to its name. Only `mkcell` and `find` go from header to body, so with
  the extra name words placed before the two-word header, as Open Firmware lays names out, the
  threading is untouched (VARIANTS.yml has the layout).

The cartridge picks the file, as `as7` has always picked files: by the list it is given.

**Then finer grains.** The kernel splits into pieces that recombine, each with its variants,
closer to a metacompiler. A cartridge's build lists which pieces and which variants; the LIVE
CODING panel shows each choice as a switch or a dropdown, and Run reassembles, rebuilds the image
and boots it.

The Forth sources don't need to know. If one ever does (a decompiler that prints names, say), the
kernel variant defines a constant, `FULLNAMES`, and the Forth reads it.

**The LIVE CODING panel**, before MEMORY, for cartridges that list `sources`:

- a menu of the cartridge's source files, and an editor on the chosen one;
- **Save** (to the browser's local storage), **Revert** (back to the cartridge's copy), **Build**,
  and **Run**, which builds first;
- **Load**, for Forth sources: mount the file on the paper tape reader of the machine that is
  running and type `TAPE`, so the definitions go into the live image with no rebuild;
- below the editor, the build output: assembler errors with their lines, the listing, and what
  the paper-tape compile printed.

**Images.** Save the running core, or a built image, to local storage and load it again later.
All local for now; tiny-its will be the one that knows about servers and cloud storage, and
uploads and downloads images through its own interface.

**And tiny-its itself.** Once tiny-its is Forth running on the cabinet, the LIVE CODING panel
edits the mainframe too.

## Assemblers: several front ends, one back end

As in GNU's BFD, the shared part is the back end, not the parsers. Today `src/asm.ts` is one
assembler with `dialect === "cambridge"` tests scattered through it. It becomes:

- **The back end** (`asm/core`): the assembled object (words or bytes at addresses, each tied to
  its tape and line), placing them and reporting overlaps, the symbol table, the source map
  (`source.ts`), loaders, and the writers: the listing, the symbol table, `.oct`, `a7out`, paper tape.
  It knows nothing about any syntax.
- **A machine description**, which is all the back end knows about the hardware: word size (18 bits,
  or 8), address width, the radix and digit counts it prints in (octal 5/6, hex 4/2), and the
  opcode table the disassembler shares. PDP-7 first; a 6502 is a second description. It prints
  bytes where the PDP-7 prints words, several to a line, and continues a long `.byte` on the lines
  below.
- **Front ends**, one per language, each a parser that gives the back end statements:
  - **DEC-family**: DEC's 1964 dialect and Cambridge's 1972 one really are one language (`name,`
    labels, `/` origins, literals, variables for undefined names). They keep one two-pass engine and
    differ by a dialect object: its extra symbols, whether `,` is the location counter, `DISP`
    and `VEC`, how variables are ordered, and whether variables or literals are placed first.
  - **as7**: Ken Thompson's `as`, a different language, with its own small parser.
  - **Later, 6502**: symbols and source maps for a JavaScript 6502 emulator, ours or an existing one.

The front ends are written here from what each language does, not ported. pdp7-unix's `as7` is
GPL, so it is the reference we test against, not code we copy.

**Every front end is proved against the real thing.** `as7` on Mitch's `kernel.s` must give
`kernel.a7out` word for word and the same `Labels:`. The DEC-family engine must give
`symelec.oct` and `symelec-symbols.tsv`.

**Listings in the 1972 house style**, the one on Heinz's Titan listings
(`characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt`). All the front
ends share it, whatever the machine:

```
/SYMELEC   ASSEMBLED 12 2 72 AT 12,44,57 BY HL1470   PAGE  1
    1                                                      /SYMELEC
    6      21/ 740040  21/      HLT
   10      24/ 212257  BEGRTP,  LAC (JMP INT               /INTERRUPT ENTRY
```

- A page header with the title, the date and time, the user, and the page number. Then one row per
  source line: its sequence number, the address, the word, the label, then the statement, with the
  comment in a column of its own.
- At the end, the symbol table, four to a row and sorted by name, as `NAME = value`. A `*` marks a
  value that is more than an address: in SYMELEC every `*` value is `JMS` plus an address, which is
  what Cambridge's `name=JMS,` labels make.
- Options: `title`, `user`, `date`, and
  `pageLines` (60 for page breaks with a form feed and the header on every page; 0 for one
  continuous listing, headed once). Also `width`, and the case the listing is printed in.

**Each cartridge says who assembles it**, in `listing: { user, title }`. The user is printed in
the period's case, and chosen by this rule: the programmer's own user ID if one is known; if not,
one derived from the programmer's name; if there's no name either, a made-up, mysterious-sounding
hacker one. Today:

| Cartridge | User | Why |
|---|---|---|
| PIXIE SYMELEC | `HL1470` | Heinz Lemke's Titan ID, on every page of the 1972 listing |
| LIGHT PEN TEST | `CSTEIN` | from C. Stein, DEC, the author; a 1964 PDP-4 had no logins |
| DUEL | `PV0740` | made up, Titan style: Peterson and Viner, DECUS 7-40 |
| HILO, LANDER | `A2DEH` | Don's |
| FORTH | `wmb` | Mitch Bradley's own |
| UNIX v0 | `ken` | Ken Thompson |

Each front end also keeps its own tool's native format for comparison: `as7 -f list` with its
`Labels:`. The house style is what the cabinet shows and prints. The LIVE CODING panel's build
output is this listing, and a listing can be saved as a text file or printed on paper.

## Order of work — each step falsifiable

1. CPU completion + interrupts + `.oct` loader + console + clock.
   **Accept:** SYMELEC boots and issues `IDLA` (no display needed to verify).
2. 340 display processor → segments with provenance → canvas.
   **Accept:** tracking cross + radial lightbuttons match the 1969 film frame.
3. Pen synthesis from pointer → `TRCR` runs → cross follows mouse.
   **Accept: met at the emulator level** — the tracking acceptance test
   acquires, drags, and loses the cross ([TRACKING.md](TRACKING.md));
   the browser pointer wiring lands with the web bench.
4. Draw with the S/L/F lightbuttons. Radial menu question answered live.
5. Link stub → echo → filestore.
6. Phosphor pretty-pass: canvas 2D fade first; WebGPU dual-phosphor
   (fast blue flash for the pen, slow green for the human) is a stretch,
   never a blocker.
7. The portrait ([PORTRAIT.md](PORTRAIT.md)): 3D cabinet with
   duty-cycle lamps, the phosphor texture on curved glass, and
   sim-Heinz — whose pen tip drives the LightPen plugin. Rides the
   pretty-pass lane; consumes only existing seams.

Discipline: **differential trace vs SIMH.** One line format (`addr ir ac link`)
emitted by both benches over the same `.oct`; diff. Roy already steps the
binary natively — the oracle made mechanical.

↑ [README](README.md) · [SCHEMA](SCHEMA.yml) · [emulation plan](../../characters/heinz-lemke/sources/pdp7-reference/EMULATION-PLAN.md)
