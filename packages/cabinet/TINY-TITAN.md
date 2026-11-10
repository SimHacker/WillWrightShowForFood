# tiny-titan: the Titan end of PIXIE's link

*tiny-titan stands in for the Titan end of Wiseman's link, well enough that 1972 PIXIE on our
emulated PDP-7 uploads its drawings to it.*

Titan was Cambridge's Atlas 2, a room-sized machine that ran the university. PIXIE's PDP-7 was
its satellite. Over Neil Wiseman's custom link, the PDP-7 stored drawings in the Titan filestore
and fetched them back. In the cabinet, the Titan end is [one TypeScript
file](src/plugins/tiny-titan.ts) with no dependencies beyond the bus types. It implements only
what the one surviving caller, SYMELEC's `LTPX`, dialed.

## What it is, and isn't

**Not a Titan emulator, and not a simulator.** It has none of the Atlas 2: no 48-bit words, no
extracodes, no supervisor, no discs. By the cabinet's definitions
([README](README.md#simulation-vs-emulation): emulation reproduces an interface so the original
program runs; simulation models a process), it is two things:

- **An emulator of the PDP-7 side of Wiseman's link interface:** the IOTs, the flag, the skips.
  It passes the cabinet's test: SYMELEC's unmodified `LTPX` runs against it.
- **A fake server for the far end.** `BlockletHost` answers the `/LTPIX` session the way user
  HL1470's Titan programs did. It plays the master role that Lang's [Planning Document
  10](reference/cambridge-supervisor/pd10-titan-pdp7-link.md) gives Titan: the PDP-7 asks, and
  Titan's header decides the direction. It is the real protocol with no machine behind it.

It comes in rungs:

- **Stub**, with no port: `LSF` always skips. The browser applet runs this.
- **Loopback**, with `EchoPort`.
- **Listener**, with `BlockletHost`: it records what PIXIE sends.

Serving back and the filestore are the next rungs. If an Atlas 2 emulator ever exists, it docks
behind `TitanPort` and tiny-titan shrinks to the link card.

## What it does now

Three layers, each portable on its own.

**`TinyTitan`** is the cabinet device. It claims device codes 22–23. The IOTs come from the
[SYMELEC listing](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt).
No DEC manual documents them, because the hardware was Wiseman's Cambridge interface, not a
catalog item:

- `LSF`: skip on link flag. `LCF`: clear it.
- `LRB18` / `LRB18!LLAM`: read an 18-bit word. `LLB18!LLAM`: write one.
- `LSA` / `LKD`: status and disconnect, on the exit paths.
- `LLB6` / `LKE!LLB6`: 6-bit control bytes.

The link ran with interrupts off. The `WAITLK` loop polls the flag while it services the display
and keyboard by hand, so the device raises no IRQ. With no port attached it is the robust-first
stub: `LSF` always skips, and a `TITAN` command typed at an empty socket returns an error note
instead of wedging the machine.

**`TitanPort`** is the seam: five calls a transport can carry anywhere, `control / send / recv /
ready / disconnect`. The PDP-7 polls `LSF`, so the 1969 wait loop *is* the await, and no
callbacks are needed. An in-process port answers at once. A remote port buffers arriving frames
behind `ready()`, and the same 1972 software works unmodified over a WebSocket.

**`BlockletHost`** is the session state machine from the `/LTPIX` routine (listing pages 21–24),
decoded in [TITAN-LINK-PROTOCOL.md](reference/TITAN-LINK-PROTOCOL.md). It:

- serves the 4-word, redundantly checked headers. Word 2 is word 1 complemented, and the PDP
  requires `(w1^w2)+(w3^w4)` to be all ones;
- sets the count per blocklet. A blocklet carries exactly `count` words. The end-of-transfer
  test's `ISZ BSZ` pre-increments the complemented count, an off-by-one the acceptance test
  caught live;
- accumulates the same running 18-bit checksum as the PDP's `RW` routine, and answers with it so
  `SAD CKS` matches;
- says goodbye with a zero-count header.

The acceptance test (`type TITAN and SYMELEC phones tiny-titan` in
[cabinet.test.ts](src/cabinet.test.ts)) boots SYMELEC, types `TITAN` on the emulated KSR-33, and
records the transfer. `MESIN` hashes the first three characters to `271424` and dispatches to
`LTPX`. The first word on the wire is `PXID`, `767676`, PIXIE's magic stream heading. Then come
`DSBEG`, `DSEND`, `SAVINS`, and the live ring words from core, checksummed, matched,
disconnected. The five-command teletype language that gets you there (`LABEL`, `UNLABEL`,
`TITAN`, `GRID`, `START`) is in [DESIGN.md](DESIGN.md#tiny-titan).

Two wire details:

- The CPU strips bit `010` from every IOT as clear-AC, so the device sees `LRB18` (702252) as
  pulse 42, not 52.
- The NAK instruction is spelled `LLB6 10`. It reaches the device as control 0 with the
  accumulator pre-cleared, because the `010` *is* the clear-AC bit.

### Files by name: device 24

[titan-files.ts](src/plugins/titan-files.ts) gives every PDP-7 program files by path, without
the blocklet handshake. It is a cabinet extension on device 24, beside the 1972 link on 22 and
23:

| IOT | Name | Does |
|---|---|---|
| 702401 | FSF | skip if the last request has finished |
| 702412 | FRS | read the last result |
| 702404 | FGO | start the request whose block is at AC (15 bits) |
| 702444 | FCF | clear the flag |

The program fills a seven-word request block (operation, path address, offset, length, data
address, result, path length) and hands it over. The host moves the words by DMA, as a disc
controller would, and raises the flag. Operations: READ, WRITE, SIZE, DELETE, LIST. A file is
18-bit words, and offsets and lengths count words. Data addresses are 15 bits, so a file goes
straight to and from any bank of a 32K machine ([FORTH-HIGH-MEMORY.md](FORTH-HIGH-MEMORY.md)).
The PDP-7 waits with FSF, which suits a host that answers asynchronously.

Paths are folded to lower case (the teletype has none) and mounted by prefix, longest first.
`..` is refused.

| Mount | What | Kind |
|---|---|---|
| `/tmp` | memory, gone on reload | `MemoryMount` |
| `/browser` | the browser's localStorage, three bytes a word, base64 | `StorageMount` |
| `/proc` | made on demand from the cabinet's state, read-only | `ProcMount` |
| `/user` | planned: the person's own files, a folder picked with the File System Access API, or a synced store | |
| `/net` | planned: a TitanPort over WebSocket, tiny-titan as a real server | |

A name ending `.gz` is stored gzipped and unzipped on read (CompressionStream). Other suffixes
could pick other codecs the same way.

From Forth, [files.fs](tapes/pdp7forth/files.fs) after code.fs:

    S" /browser/pose" POSE 63 0 WRITE-WORDS   ( -- n )
    S" /browser/pose" POSE 63 0 READ-WORDS    ( -- n )
    S" /browser/pose" FILE-SIZE               ( -- n )
    S" /browser/pose" DELETE-FILE             ( -- r )
    S" /browser" BUF 200 LIST-FILES BUF SWAP TYPE-WORDS

A result is the words moved, or -1 no file, -2 bad path, -3 bad operation, -4 read-only, -6
failed. Tested in [titan-files.test.ts](src/titan-files.test.ts). Still to do: mount it in the
applet (the device is in the package, not yet on the menu's machines), `/user`, `/net`, and SAVE
and LOAD of a whole core image as files, which gives every program save and restore.

## What it could do

Every rung below is the same `BlockletHost` with more behind it. The device and the 1972
software never change.

### Serve structures back

Direction bit `200000` in the header turns the queue around. Titan streams, the PDP reads,
relocates pointers by `RELCON`, and displays the received drawing. This is the test-model
pipeline in [DESIGN.md](DESIGN.md#the-application-layer--packagespixie-separate-module): build a
drawing as a TS object graph, encode it to ring words, hand it to 1969 PIXIE over the link, and
watch the tube. The codec's format truth is the wire envelope in
[TITAN-LINK-PROTOCOL.md](reference/TITAN-LINK-PROTOCOL.md): atoms with the top 5 bits zero, NIL
spelled as the `JMS` opcode value, block headers of `20000` plus a 13-bit length.

This rung was prototyped and lost. `packages/pixie/dist/pixie.test.js` (compiled 25 Sep) calls a
`BlockletHost.serving(encodeTransfer(photo))` that is not in the source. It served a photograph
of the boot workspace back and asserted that the checksums matched. Its note says SYMELEC's
name-list rebuild halts on an empty `SAVINS`, so the payload must be a well-formed drawing. Two
things to fix when it is rebuilt:

- Its no-NAK check looks for control `010`, but the NAK arrives as control `0`.
- `RW`'s read path follows every `LRB18` with an unskipped `LLB18!LLAM`. A serving host must not
  mistake that for data from the PDP.

### Filestore through the link

Named slots for ring files: `localStorage` or OPFS in the browser, the filesystem on node. This
was Titan's actual job: PIXIE drew, Titan remembered. Save a drawing by typing `TITAN`, reload
the page, type `TITAN` again, and the drawing comes back through the same handshake it used in
1972. Device 24 ([above](#files-by-name-device-24)) already has the mounts to store it in.

### A real server

The `TitanPort` seam behind a WebSocket makes tiny-titan a remote machine again: one host
process serving many emulated PDP-7s. Two browser tabs sharing one filestore are two PDP-7s on
one Titan, so two people can work on the same drawings.

Remote control of the cabinet needs no console protocol. The Cabinet is a TS object, and step,
examine and deposit ride the same socket in a dozen lines. The link carries drawings. The bench
carries the machine.

### tiny-bus: the backplane between machines

tiny-titan grows into tiny-bus: the bus that every command, event, source and sink in the bench
rides, within a tab, to a central server, and across networks. Like every tiny piece, it is
small enough to read in one sitting and complete enough to use everywhere
([TINY.md](TINY.md)).

- **`TinyCommand`**: `{ id, args, source, risk }`, with big-endian ids (`cabinet.pen.tap`,
  `cabinet.tape.load`). Pie items, buttons, keys, scripts, tiny-its, MCP and LLMs all dispatch
  it.
- **`TinyEvent`**: `{ id, at, node, vm, data }`. `at` is the machine cycle, so a log replays
  exactly (`cabinet.pen.hit`, `cabinet.teletype.printed`).
- **Sources** put events on the bus: the 340, pens, the teletype, the console, the Titan link, a
  remote watcher, a recording.
- **Sinks** take them off: the applet, the recorder, the definition window, a screen reader
  announcer, `waitFor`, another node.
- **Three reaches, one envelope.** Intra-tab (direct calls), intra-node (a `BroadcastChannel`
  between tabs), inter-node (the WebSocket server, and tiny-its forwarding between servers). The
  same command or event crosses all three unchanged.
- **Policy** travels with the command, `reversible` or `destructive`, so an LLM proposes and a
  person approves, wherever it was sent from.

The shape follows the command bus in the MicropolisCore repo, but the names are ours. That
simulator's name is used under a limited permission, and none of our classes, ids or wire
formats carry it.

### Messages, not just drawings

The link has three session verbs and no application verbs: the stuff, and where it goes, say
what to do. Keep that rule and add a second stream type beside `PXID`. A message is a ring whose
head names its handler (a printname atom), carried in the same blocklets with the same checksums
and relocation. PIXIE only ever receives `PXID` drawings, since it rejects anything else ("not
PIXIE data"). Our own VMs accept both.

The PDP always opens the session and Titan's header sets the direction, so a VM collects its
mail by asking. It sends control 4, and Titan either reads the VM's outgoing message or serves
the next one queued for it. Our own VMs can have new IOTs, so an attention flag lets Titan ring
first. Between VMs that share a memory window, a message can be one name, a pointer, instead of
a copy ([CORE-LINKS.md](CORE-LINKS.md)).

### Interrupting messages

ITS jobs talked through core links, a device you opened like a file
([ITS CLO](https://github.com/PDP-10/its/blob/master/doc/sysdoc/clo.100)). Two jobs that opened
`CLO:FOO;BAR BAZ`, one for input and one for output, were joined by a one-way stream with a
buffer of about 100 words. `CLU` was the same but would not create a link. The interrupting
pair was `CLI` and `CLA`. A sender opened `CLI:<uname> <jname>`, which gave that job the
`%PICLI` interrupt, and the receiver opened `CLA:` to read the message and learn who sent it.
That is how `:SEND` put a line on someone's screen: DDT opens `CLI:<user> HACTRN`, and the
receiving HACTRN prints it. Core links are also how one Lisp could evaluate something in another. The
tiny-titan device can do the same for VMs that ask for it: a
new IOT enables a link interrupt, and an arriving message raises the PDP-7's program interrupt,
so the handler runs without polling. It is per-VM configuration and off by default. PIXIE
services the link with interrupts off, and its interrupt routine at location 1 knows nothing of
it. Two kinds of message ride it:

- **send:** a message to a VM's handler, or a line to a person's teletype, as `:SEND` did;
- **eval:** a request whose reply comes back to the sender: a Forth word run in another Forth, a
  Lisp form in another Lisp, a tiny-its command on another node.

Addresses are node, VM, handler: `CAMBRIDGE:FORTH:ON-DRAW`, as `CLI:` addressed a job by
UNAME and JNAME.

### Device events are messages too

The applet already records everything that reaches a machine from outside as [session
events](src/session.ts), stamped in machine cycles: `sw` (AC switches), `pen` (x, y, down,
aperture), `tty` (keys), `poke` (a deposit). Its comment already expects tiny-titan messages as
another kind. Make that vocabulary the wire format for device events, and add the rest of the
console: `reset`, `start addr`, `stop`, `continue`, `examine`, `readin` (paper tape), the address
switches, and `program` (the applet's program selector: boot SYMELEC, DUEL, LANDER …).

The emulator handles these, not the program. A pen event moves the cabinet's pen, a switch event
sets the switch register, a reset presses the key. The running program sees what it saw in 1969
and needs no change. So one VM can steer another's pen, type at its teletype, flip its switches
or reboot it into another program, and a recorded session is a message log, replayable at any
speed.

### Services

Titan can answer and send messages itself. The host offers a few services, each a named
endpoint:

- `services`: what is offered, discovery included.
- `who`: the PDP-7s on the bus, what each is running, its PC, running or halted, the windows it
  maps, who is watching it.
- `peek`: read another machine's core. The live ring view, remotely.
- `send`: deliver a message or a device event to a machine or a handler.
- `filestore`: named ring files (above).
- `lock`, `unlock`, `barrier`: the host handles one request at a time, so it is a lock manager
  for free.
- `clock`: the cycle count, for runs kept in step.
- `build`: the cabinet's toolchain, run on the host for any machine on the bus. Assemble in any
  dialect (`as7`, DEC, Cambridge), translate Cambridge to as7, disassemble, link several files
  into one image with one symbol table, compile Forth on a scratch machine. It returns the image,
  symbols, listing and source maps. The 1972 PDP-7 never assembled anything itself either: Titan
  cross-assembled SYMELEC (the listing says `ASSEMBLED ... BY HL1470` on Titan).
- `type`: deliver a file to a machine by typing it into its teletype, as fast as the machine
  reads. Forth already reads source a line at a time from the keyboard, so a Forth file typed in
  compiles exactly as if someone typed it, with no file system and no new words. The teletype's
  speed is a cabinet setting, so tiny-titan types thousands of characters a second instead of
  ten. It waits for each line's ` ok` before the next, as Mitch's `prelude.py` does with the tape
  reader. Errors come back as the line Forth didn't accept. Any program that reads its keyboard
  can be fed this way: HILO's talk tapes, UNIX at its shell.

**tiny-its** is the command line over these services, named after MIT's Incompatible Timesharing
System (itself a joke on CTSS, as tiny-titan is one on Titan). tiny-titan is the link card and
the session. tiny-its is the job manager, debugger and memory mapper behind it, for machines that
were never timeshared. Its language and what it manages are designed in
[TINY-ITS.md](TINY-ITS.md#what-it-manages).

ITS was famously open: no passwords, tourists welcome, `:PEEK` at anyone's job
([reference/GUIDE.md](reference/GUIDE.md)). That suits a public exhibit, with one limit on a real
server. Visitors get `who` and `peek`. Anything that writes (`poke`, device events, `reset`,
`program`) is scoped to machines the sender owns or was invited to.

### Rings instead of JSON

Tiny Titan's storage and services speak PIXIE rings, not JSON. A ring is the PDP-7's own data
structure, so the minicomputer reads what the mainframe stores without a parser. The same
structure serves every layer:

- **Discovery:** a `services` ring. Each member is a block naming a service, with a child ring
  for its operations.
- **Schemas:** rings too. A schema is a ring of field rings, each with a printname and a kind,
  so the schema travels in the format it describes.
- **Services:** a message is a ring whose head names its handler. The reply is a ring.
- **Pipelines:** a ring of stages. Each stage takes a ring and gives one back, so stages chain
  and splice like list cells.

The host side lives in [`@wwsff/pixie`](../pixie/src/index.ts). `readRings` loads a ring image
from YAML, JSON (a graph, a word list or a ring image) or the binary transfer stream (three
bytes a word, starting with `PXID`). `packWords` writes that stream. `ringToScene` lays any image
out in 3D, and `ringsPlugin` draws it beside the characters as a holodeck layer, so a character
giving a talk can hold up a data structure and turn it. The cabinet's RINGS panel shows the live
ring structure in a running SYMELEC's core, or in a file, with changed cells lit as they change.

### The hub for every emulator

The same seam that carries Wiseman's link can carry anything. tiny-titan becomes the switchboard
for a federation of emulators ([MANIFESTO](MANIFESTO.md#a-federation-of-emulators-after-microm8)):

- **Registration.** Each emulator instance, the cabinet's own or another program's, announces
  itself with a `services` ring: its machine, its operating system, and what it can be asked to
  do.
- **Peers outside the page.** A peer is reached over whatever it speaks. For microM8 that is its
  MCP server (stdio or SSE) or its HTTP API. For a FujiNet-style device, its network protocol.
  For another browser, a WebSocket.
- **Translation.** Rings are the hub's own form. A translator per peer turns a ring into the
  peer's language and its reply back into a ring. Generic translators turn rings into JSON, YAML
  and XML and back. The schema is a ring too, so a translator can be written from it.
- **Fairness.** Machines run at their own speeds. Messages queue at the hub, and the PDP-7 polls
  for them with `LSF` as it always has.

### First demo: PIXIE rings to microM8's 3D turtle

1. A Forth word on the PDP-7 builds a ring for a figure: a list of moves and turns, or a PIXIE
   picture's lines.
2. It sends the ring over the link. `BlockletHost` receives it as it receives a drawing today.
3. A turtle translator walks the ring and writes Logo: `PENDOWN`, `FORWARD`, `RIGHT`, and the 3D
   turns microM8's Logo adds.
4. The translator calls microM8's MCP server: `type_text` at its Logo prompt, or
   `write_interpreter_code` for a whole procedure, then `screenshot` to bring the picture back.
5. The result returns to the PDP-7 as a ring: done, or the error microM8 reported.

Nothing in it is new on microM8's side. Its MCP tools already do each step. turtleSpaces has a
remote protocol of its own: its `api` primitive opens a socket on port 1967 that takes Logo, one
worker per connection ([reference](https://turtlespaces.org/reference/environment/#cmd-api)). So
the same translator can send the figure to turtleSpaces instead, through tiny-titan's host side.
Details in [MICROM8.md](MICROM8.md). Ask them first:
[April Ayres-Griffiths](../../characters/april-ayres-griffiths/README.md) and
[Melody Ayres-Griffiths](../../characters/melody-ayres-griffiths/README.md).

## Where things are

| What | Where |
|---|---|
| the module | [`src/plugins/tiny-titan.ts`](src/plugins/tiny-titan.ts) |
| files by name, device 24 | [`src/plugins/titan-files.ts`](src/plugins/titan-files.ts) |
| protocol decode | [`TITAN-LINK-PROTOCOL.md`](reference/TITAN-LINK-PROTOCOL.md) |
| primary source | [`symelec-listing.txt`](../../characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt), `/LTPIX` at 1701 |
| device + command language | [DESIGN.md](DESIGN.md#tiny-titan) |
| tiny-its, its language and what it manages | [TINY-ITS.md](TINY-ITS.md) |
| the tiny pieces and why they are small | [TINY.md](TINY.md) |
| tests | [`src/cabinet.test.ts`](src/cabinet.test.ts) (echo unit test and the `TITAN` acceptance test), [`src/titan-files.test.ts`](src/titan-files.test.ts) |

↑ [README](README.md) · [DESIGN](DESIGN.md) · [TRACKING](TRACKING.md) · [PORTRAIT](PORTRAIT.md) · [OFF-BY-ONE](OFF-BY-ONE.md)
