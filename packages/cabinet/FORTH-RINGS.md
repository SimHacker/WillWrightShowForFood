# Forth and PIXIE rings: one 1969 data structure, two languages

The PDP-7 in this cabinet now runs a Forth that holds 1969 ring structures in its own core.
The code that builds those rings is RSPPIX, Cambridge's ring structure processor from the
1972 listing. It is not a rewrite: it is the same code SYMELEC is built on, moved up in
memory. You type at the teletype, a ring grows in core, and the RINGS panel draws it in 3D
as it changes.

    RSAVINS S" SQUARE" NAMED
    RSAVINS S" TRIANGLE" NAMED
    RSAVINS S" HEX" NAMED
    RSAVINS .RING            HEX TRIANGLE SQUARE  ok
    RSAVINS RCOUNT .         3  ok

Three things came together to make that possible, and each is worth something on its own.

## 1. A Forth whose names are whole

Mitch Bradley's PDP-7 Forth is small and complete: an inner interpreter, a compiler, control
structures, and turtle graphics on the Type 340. The cabinet runs a copy of it,
[`kernel-names-full.s`](tapes/pdp7forth/kernel-names-full.s), that keeps each name whole, up
to 31 characters, three SIXBIT characters to a word.

Each word is laid out the way Open Firmware lays one out: the name, then the header, then
the body. The execution token is still the header's address, and links still run from header
to header. The body is at xt+1. Only `mkcell` knows where the body is, so nothing above it
cares about the layout.

This matters for what follows. A ring library has many words with similar names: `RFINDS`,
`RFINDN` and `RFINDP`, or `RINIT` and `RINSRT`. The 1972 names can be used as they are, and
`WORDS` prints them as they are.

The copy is made from Mitch's [`kernel.s`](tapes/pdp7forth/kernel.s) by a script
([`make-forth-names-full.py`](scripts/make-forth-names-full.py)), so his changes carry over
when the script is run again. His kernel stays beside it as the reference the tests compare
against. [VARIANTS.yml](tapes/pdp7forth/VARIANTS.yml) records how each copy differs.

## 2. RSPPIX inside Forth, unchanged

[`rsppix.s`](tapes/pdp7forth/rsppix.s) is generated from the 1972 Cambridge source and must
assemble to the listing word for word. The test that checks this still passes, and the file
is not edited. It was written to live at octal 022, inside SYMELEC, using SYMELEC's variables
and SYMELEC's error handlers. Linking it into Forth took three steps.

**Moving it.** The Cambridge assembler sometimes adds an offset to an address by ORing it
(`rop 02`, `. 013`). That only gives the right sum when the low bits it lands on are zero.
So RSPPIX moves up by exactly 014000, to 014022. Every word it ORs together then still adds
up, and a test checks every moved word against the listing.

**Standing in for SYMELEC.** [`pixie.s`](tapes/pdp7forth/pixie.s) provides what SYMELEC
provided:
- `BEG`, `END`, `ENDRES`, `BOT`, `TOP` and the stacks, in SYMELEC's order. `TOP+1` is the
  pointer to the next free permanent name, as RSPPIX expects.
- `ERRMEB` and `ERRGB`, the error exits. In 1972 they typed a message and restarted SYMELEC.
  Here they print `ring?` or `rings full?` and abort to the Forth prompt.

**A Forth word for each routine.** `RSETUP RINIT RGETSP RCAR RCDR RPUSH RPOP RNULLR RINSRT
RFINDS RFINDN RFINDP RFEL RFELN RADDW RDELB`, plus `REL REL1 RNM RSAVINS` for RSPPIX's own
permanent names. A ring name is a cell holding a JMS-tagged address. A Forth `VARIABLE`
leaves exactly the address that RSPPIX's `LAW X` calling convention wants, so most of the
wrappers are three instructions: pop, `jms`, `jmp next`. `RINSRT` takes its second operand
inline, as RSPPIX expects, so its wrapper writes a `LAW` into its own code before the call.

Core, top down:

| Address | What |
|---|---|
| 017601–017700 | RSPPIX's operand and link stacks |
| 017101–017600 | permanent names, then the garbage collector's mark stack |
| 017000–017100 | the reserve past END |
| 015500–017000 | the ring area, about 350 two-word items |
| 015400 | SYMELEC's variables, for RSPPIX |
| 014022 | RSPPIX |
| below 014022 | Forth's literal pool, growing down to meet the dictionary |

Running out of ring space runs the 1972 garbage collector. It marks from the permanent
names, sweeps, and rebuilds the free list. Elements you delete with `RDELB` come back.
When nothing can be reclaimed, you get `rings full?` and the prompt, not a halt.

[`pixie.fs`](tapes/pdp7forth/pixie.fs) is the layer people type at:

| Word | What it does |
|---|---|
| `RINGS` | start again with an empty ring at `RSAVINS` |
| `ELEMENT` | form an element and insert it in a ring, as SYMELEC does with `FEL`, `ADDW` and `INSRT` |
| `NAMED` | the same, with a printname, its characters stored as `COPIN` stored them |
| `RFIRST`, `RNEXT` | walk a ring |
| `RCOUNT` | count a ring's elements |
| `.PNAME`, `.RING` | print names back |
| `APPEND`, `SAY`, `SAYS` | add at the end, so a ring reads in the order written; `SAYS` makes an element per word |
| `HELLO` | start again with `HELLO WORLD FROM PDP-7 FORTH`, which is what it boots with |

The panel is a 3D teletype: Forth appends to it, resets it and rewrites it. `S" AND PIXIE
RINGS" SAYS` adds three words to the ring you're watching.

## 3. Seeing it

The FORTH + TURTLE program tells the RINGS panel where to look: `RBEG`, `REND` and
`RSAVINS`, the same three cells it reads in a running SYMELEC. The panel copies the ring
area out of live core, lays it out in 3D from `RSAVINS`, and lights cells as they change.

The scene builder, `ringToScene` in [`@wwsff/pixie`](../pixie/src/scene.ts), is the one that
draws SYMELEC's structures, a file, or a ring image read off the wire. Nothing in it knows
which language built the rings. A test types elements in at the Forth teletype, copies the
ring area the way the panel does, and checks that the scene reaches every element from
`RSAVINS` and nothing outside the ring area.

**SAVE** writes what the panel shows as a `.pix` file: the transfer stream the Titan link
carries (`PXID`, BEG, END, SAVINS, the words, three bytes a word); shift-click for YAML.
**LOAD** reads a `.pix`, YAML or JSON ring file into Forth's ring area, as the 1972 receiver
did: it relocates every pointer to Forth's BEG, points `RSAVINS` at the entry, gives the
other permanent names fresh items, and lays the rest out as RSPPIX's free list. Forth can
walk and extend what it loaded straight away (`implant` in
[`image.ts`](../pixie/src/image.ts), tested by a save, `RINGS`, load and walk round trip).

RSPPIX keeps a printname as a run of consecutive words, the way `CDR` steps through a list,
not as two-word cells. The scene builder reads the run, so the panel spells `TRIANGLE`.

## Why it's worth having

**One structure, several readers.** The PDP-7 builds rings, the browser draws them, and the
transfer stream (`PXID`, `DSBEG`, `DSEND`, `SAVINS`, then the words) carries them without a
parser on either end. Forth is now a second program that writes that structure, and the
first that can be typed at.

**The 1972 code is used, not imitated.** The garbage collector, insertion, and the walk round
a ring to its start are Cambridge's own instructions on an emulated PDP-7. When Forth builds
a ring, it builds one SYMELEC's code could walk, because it is SYMELEC's code doing the
building.

**Interactive.** SYMELEC builds rings in response to a light pen. Forth builds them in
response to whatever you type: loops, definitions, recursion. `: MANY 0 DO RSAVINS S" AB"
NAMED LOOP ;` then `200 MANY`, and you can watch the garbage collector run in the panel.

**Forth and turtle in one image.** The turtle still draws on the 340 with the rings loaded,
and a test checks it. Turtle paths and ring structures share one core, one dictionary and
one prompt.

## Next: two PDP-7s, one Titan

In 1972, PIXIE's PDP-7 was a satellite of Titan, Cambridge's Atlas 2. It sent its drawings
to Titan over Neil Wiseman's link and fetched them back. [Tiny Titan](TINY-TITAN.md) is that
far end, as one TypeScript file. 1972 SYMELEC already uploads to it: type `TITAN`, and the
ring area goes over the wire, checksummed.

The goal is two cabinets running side by side, SYMELEC in one and Forth in the other, both
connected to one Tiny Titan, handing drawings back and forth:

1. **Draw in Forth.** The turtle draws on the 340. The same moves are also recorded as a
   PIXIE structure: an element per stroke, the coordinates in block data, the way SYMELEC
   keeps lines.
2. **Send it.** A Forth word does what SYMELEC's `/LTPIX` does: `PXID`, the bounds,
   `SAVINS`, the ring words, the checksum, the goodbye. Tiny Titan files it.
3. **Edit it in PIXIE.** SYMELEC, in the other cabinet, loads it over the link. Its 1972
   relocation pass adds `RELCON` to every pointer, so the drawing works at SYMELEC's
   addresses. You edit it with the light pen.
4. **Bring it back.** SYMELEC sends the edited drawing. Forth loads it, relocates it to its
   own ring area, and walks it with `RFIRST`, `RNEXT` and `RCAR`: list the elements, move a
   point, delete a branch with `RDELB`, and redraw with the turtle.

What each step needs:

- **A filestore in Tiny Titan.** SAVE and LOAD already move ring files between core and
  disk; Tiny Titan's filestore does the same over the link. Named slots for ring images: OPFS or `localStorage` in the
  browser, files on node. `BlockletHost` records uploads today. Serving them back is the
  rung that was prototyped and lost (see [TINY-TITAN.md](TINY-TITAN.md#what-it-could-do)),
  with two known fixes to make when it is rebuilt.
- **Two cabinets on one host.** Two `Cabinet`s, each with a `TinyTitan` device, sharing one
  `BlockletHost` behind the `TitanPort` seam. That seam already has the right shape: the
  PDP-7 polls `LSF`, so a remote port only has to buffer arriving words behind `ready()`.
- **The link in Forth.** Words over the link IOTs (`LSF`, `LRB18`, `LLB18`, `LLB6`, `LKD`),
  then `TITAN-SEND` and `TITAN-LOAD` written from `/LTPIX` and its read path. These could be
  in assembler in `pixie.s` like the RSPPIX words, or in Forth over a few primitives.
- **Relocation on load in Forth.** The pass is short: skip atoms and NIL, add `RELCON` to
  every pointer, and skip block data by its length. `relocate` in
  [`image.ts`](../pixie/src/image.ts) is the reference, and its test is the oracle.
- **Block data from Forth.** RSPPIX's block data routine, `RBDN`, is not wrapped yet. Line
  coordinates need it.
- **SYMELEC's drawing schema.** For SYMELEC to accept a drawing, Forth has to build what
  SYMELEC builds: the instance ring at `SAVINS`, `SUBP` and `INST`, line and point blocks,
  and the catalogue. This is the research step. Its oracle is easy, though: draw something
  in SYMELEC, photograph the structure with the RINGS panel, and make Forth build the same
  structure.
- **`CREATE DOES>`** is in ([`does.fs`](tapes/pdp7forth/does.fs)), so ring types can be
  defining words: `: LINE-TYPE CREATE ... DOES> ... ;`.

The order that gets there soonest: serve-back and the filestore first. A round trip of
SYMELEC to Titan and back to SYMELEC is the referee for everything after it. Then Forth
receives what SYMELEC sent and walks it. Then Forth sends. Last, the turtle writes PIXIE
drawings that SYMELEC can edit.

## Where things are

| What | Where |
|---|---|
| full-names kernel | [`tapes/pdp7forth/kernel-names-full.s`](tapes/pdp7forth/kernel-names-full.s) |
| RSPPIX, generated | [`tapes/pdp7forth/rsppix.s`](tapes/pdp7forth/rsppix.s) |
| SYMELEC's part, the Forth words | [`tapes/pdp7forth/pixie.s`](tapes/pdp7forth/pixie.s) |
| the Forth layer | [`tapes/pdp7forth/pixie.fs`](tapes/pdp7forth/pixie.fs) |
| linking, `rsppixForForth` | [`src/forth.ts`](src/forth.ts) |
| tests | [`src/forth.test.ts`](src/forth.test.ts), [`../pixie/src/pixie.test.ts`](../pixie/src/pixie.test.ts) |
| how the copies differ | [`tapes/pdp7forth/VARIANTS.yml`](tapes/pdp7forth/VARIANTS.yml) |
| the link and its host | [TINY-TITAN.md](TINY-TITAN.md) |

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TINY-TITAN](TINY-TITAN.md) · [TINY-ITS](TINY-ITS.md)
