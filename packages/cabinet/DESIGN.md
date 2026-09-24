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
