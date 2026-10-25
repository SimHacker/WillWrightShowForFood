# Core links: shared memory and DMA between unlike machines

How memory moves between machines on the cabinet's backplane when they don't agree on anything:
word size, byte order, character set, number format, or what an address means. It extends
[MAPPING.md](MAPPING.md), which gives the map entry, the packing rules between word widths, the
`MemoryPort` adapter and locks, from MIT's Rubin 10/11 interface. This page adds conversions beyond
width, what a write can trigger, exclusive and shared ownership, DMA, and links to devices and to
tiny-titan's services. Design only.

The name comes from ITS, where a core link was a device two jobs opened to pass data, with an
interrupt to the reader when data arrived ([MANIFESTO](MANIFESTO.md#every-machine-can-see-every-other-machine)).

## A link

A core link joins a range in one memory domain to a range in another:

```ts
type CoreLink = {
  from: { domain: string; base: number; limit: number };  // a CPU's core, a bank, a device buffer, a service
  to:   { domain: string; base: number; limit: number };
  mode: "shared" | "exclusive" | "copy";                   // below
  codec: Codec;                                           // how words become words
  trigger?: Trigger;                                      // what a write causes on the other side
};
```

A **domain** is anything with addressable words: a PDP-7's 8K bank, a bank above it, an Apple ]['s 64K
(the cabinet's own or microM8's through its [WebAssembly module](MICROM8.md#proposal-microm8-as-a-webassembly-module-called-directly)),
a PDP-10 job's address space, the Type 340's display list, a disk image, or a tiny-titan service.

## Codecs: what the words mean on each side

MAPPING's packing rules answer "how many words of one width fit in the other." A codec answers the
rest, as a stack of steps declared once and run in both directions:

| Step | What it does | Examples |
|---|---|---|
| **pack / unpack** | width: several small words in one big one, or the reverse | 18 ↔ 36 as `left,,right`; 16 → 36 the 10/11 way; three 6-bit characters in an 18-bit word; 8 → 18 a byte per word or packed |
| **depth** | bits per element | 1-bit display memory ↔ 8-bit pixels; Apple ][ hires seven pixels a byte with a colour bit ↔ RGBA |
| **endian** | byte and halfword order | the 6502's and PDP-11's little-endian words; a 68000's big-endian; PDP-10 byte pointers that count from the left |
| **character set** | text | the PDP-7 kernel's SIXBIT (ASCII − 040) ↔ ASCII; PDP-10 7-bit ASCII five to a word; Apple ][ ASCII with the high bit set; FIODEC on the PDP-1 |
| **number format** | floating and fixed point | PDP-10 floating point ↔ IEEE 754; Applesoft's five-byte floats ↔ IEEE 754; ones' complement on the PDP-7 and PDP-1 ↔ two's complement |
| **swizzle** | pointers | a PIXIE ring link (an address in the PDP-7's bank) ↔ an index or a host object reference; Applesoft's next-line pointers relocated when a program moves |
| **structure** | a whole typed block | a PIXIE ring ↔ JSON or YAML ([TINY-TITAN.md](TINY-TITAN.md#rings-instead-of-json)); a 340 display list ↔ line segments; a Forth header ↔ a name record |

Codecs come from the typed-memory declarations ([DESIGN.md](DESIGN.md#typed-memory-core-as-typed-blocks)):
a type that can decode and encode itself is a codec step. A codec says what it loses, if anything
(IEEE 754 can't hold every PDP-10 float exactly; RGBA can hold every hires pixel), and a link with a
lossy codec says so in the debugger.

## Modes

- **Shared.** Both sides see the same words. A read on either side goes through the codec to the
  owner's storage. Because every machine steps in one thread on one backplane clock, there is no
  coherence problem: a write is visible to the other side on the next cycle it runs.
- **Exclusive.** One side owns the range at a time; the other's reads and writes wait or fault until
  ownership passes, by a lock word (ITS's `AOSE` convention or the PDP-7's `ISZ` on `777777`,
  [MAPPING.md](MAPPING.md#locks)) or by an explicit hand-off. Disk buffers and display lists that a
  device is reading want this.
- **Copy.** A block moves once, through the codec, and the two sides go their own ways: a message,
  a file transfer, PIXIE's upload to Titan.

## Triggers

A write into a linked range can do one of three things on the other side:

- **Nothing.** The other machine polls, as the PDP-7 polls `LSF` on Wiseman's link.
- **An interrupt**, ITS core-link style: the receiving machine gets an interrupt on arrival, on its
  own interrupt system (the PDP-7's program interrupt, a PDP-10 channel, the 6502's IRQ or NMI),
  with a device flag it can test. Conditions: any write, a write to a marked word (an end-of-message
  word), or a count of words.
- **A handler on the host**: a TypeScript function runs instead of, or before, the interrupt. This is
  where tiny-titan translates (a ring arrives, becomes Logo for a turtle, goes to microM8 or
  turtleSpaces) and where a debugger stops.

Every trigger is stamped with the backplane cycle, so a link's traffic can be replayed and stepped
with the rest of the machine ([CAUSE-AND-EFFECT.md](CAUSE-AND-EFFECT.md)).

## DMA

Devices move memory too, without the CPU: the Type 340 fetching its display list, a disk
controller reading a sector into core, Wiseman's link (polled, word at a time, but a transfer all
the same). In the cabinet a DMA is a copy-mode link that a device opens, runs and closes, charged to
the backplane cycles it would have stolen. Then the same view that shows one machine reading
another's memory also shows the 340 reading the PDP-7's, and a disk image filling a buffer.

## Links to devices and services

The far end of a link doesn't have to be a CPU:

- **Disks**, exclusive while a transfer runs: a PDP-7 DECtape image, an Apple ][ disk in microM8, a
  UNIX v0 file system image.
- **tiny-titan** as hub and server ([TINY-TITAN.md](TINY-TITAN.md#the-hub-for-every-emulator)): a
  network-disk service in the style of Sun's ND (blocks by number), a file service in the style of
  NFS (files by path, which tiny-titan's device 24 already does, [TINY-TITAN.md](TINY-TITAN.md)),
  REST and JSON or YAML services, and PIXIE ring servers. Each is a domain; a link to it runs
  through the codec for that service, so the PDP-7 sees rings and the web service sees JSON.
- **Other emulators**, through microM8's module or debug WebSocket ([MICROM8.md](MICROM8.md)), and
  real machines through a FujiNet-style bridge.

## Order of work

1. `CoreLink` over `MemoryPort`, shared mode, same width, between two PDP-7s; a debugger view of
   both ends.
2. Codecs from typed memory: SIXBIT ↔ ASCII, 18 ↔ 36 packing, ones' ↔ two's complement.
3. Triggers: the PDP-7 program interrupt on arrival, and host handlers.
4. Exclusive mode with lock words; the 340 and disks as DMA links.
5. An Apple ][ (microM8 as WebAssembly) linked to a PDP-7: Applesoft floats and ASCII both ways.
6. tiny-titan's services as domains: rings ↔ JSON and YAML, file and block services.

↑ [README](README.md) · [MAPPING](MAPPING.md) · [TINY-TITAN](TINY-TITAN.md) · [MANIFESTO](MANIFESTO.md)
