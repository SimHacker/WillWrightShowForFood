# PDP-10: a Korz KA10 that runs ITS, beside the PDP-7

A design, not yet code. The cabinet's second big CPU after the PDP-7 is the 36-bit PDP-10, as
MIT's AI Lab had it: a KA10 with the lab's own paging box, extra interrupt levels, a Type 340
display, and a cable to eight PDP-11s through which any user program could map another machine's
memory into its own address space. That last part has its own document,
[MAPPING.md](MAPPING.md). This one is the CPU, its bus, and the devices it shares with the PDP-7.

**The point is the sharing.** The PDP-7 in the page already has a Korz CPU, a Korz Type 340, a
light pen, a teletype, a paper tape reader, a Turing machine coprocessor, an Ultimate Machine, a
DataHand, a link to tiny-titan, and a file service. Each one is written once. A KA10 should not
get its own copies. It should get its own CPU and its own bus, and plug the same devices in, each
through a binding for the KA10's I/O instructions ([DEVICES.md](DEVICES.md#the-layers)). Then
ITS's 340 programs draw on the same 340 the PDP-7's PIXIE draws on, the same hand turns LLOGO's
dials and Forth's turtle, and a PDP-10 job can map the PDP-7's core into its address space and
read PIXIE's rings with half-word instructions.

**Korz** is [David Ungar](../../characters/david-ungar/README.md), Harold Ossher and Doug
Kimelman's language of slots, dispatched on coordinates
([Onward! 2014](../../characters/david-ungar/sources/korz-2014-onward.pdf)). It is named for
[Alfred Korzybski](https://en.wikipedia.org/wiki/Alfred_Korzybski), whose
*[Science and Sanity](https://en.wikipedia.org/wiki/Science_and_Sanity)* (1933) says
"[a map is not the territory](https://en.wikipedia.org/wiki/Map%E2%80%93territory_relation) it
represents, but, if correct, it has a similar structure to the territory, which accounts for its
usefulness." How the cabinet uses it for machines, and what is built, is
[KORZ-MACHINES.md](KORZ-MACHINES.md). The PDP-7 and the Apple ][ run on it today.

Status: planned in [README.md](README.md) ("A PDP-10 that runs ITS") and in
[ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md#different-processors-one-cabinet), which
already decided that "a PDP-10 should not pretend its channels are PDP-7 IOTs". Nothing of the
KA10 is built.

**TypeScript, on the same kits as the PDP-7.** The KA10 is written in TypeScript on the cabinet's
Korz CPU kit and device kit ([KORZ-CPU.md](KORZ-CPU.md)), so it shares the sea, the rungs, the
devices, the memory map and the panels with the PDP-7, and with a PDP-11 written the same way for
the GT40's and the Knight TV's 11/05. SIMH is not compiled to WebAssembly for this: it is a large
program, and a module built from it would be a sealed box beside the cabinet instead of machines
sharing code. The one public attempt, OhmGeek's
[SIMH-WebAssembly](https://github.com/OhmGeek/SIMH-WebAssembly) (2022), got the VAX-11/780 started
under Node and left the browser side unfinished. SIMH stays native, on the desk, as the oracle
([Phases](#phases)).

## Which machine

ITS ran on four kinds of PDP-6/10 at MIT ([doc/machines.md](https://github.com/PDP-10/its/blob/master/doc/machines.md)):
the PDP-6 it started on in 1966, the KA10s (AI, ML, DM), the KL10 MIT-MC, and later KS10s. We
build the **KA10**, for three reasons:

- **It is MIT-AI**, the machine with the 340, the Knight TV system and the 10/11 interface.
  Everything in [MAPPING.md](MAPPING.md) happened on it.
- **Its pager is a separate box.** DEC sold the KA10 with only a relocation/protection pair. MIT
  built a paging box in 1970 as a separate bay of TTL wire-wrap boards beside the processor
  ([David Moon](https://github.com/PDP-10/its/wiki/Hardware-info-from-David-Moon)). The processor
  put a virtual address on the memory bus, the box mapped it, and "the processor doesn't know that
  it isn't talking directly to the memories". That is a device on a bus, the shape the cabinet
  already has.
- **SIMH has it.** `PDP10/kx10_cpu.c` with the `ka10_*` devices models the MIT machines, Rubin
  interface and all, and the [PDP-10/its](https://github.com/PDP-10/its) project builds a bootable
  ITS for it with `make EMULATOR=pdp10-ka`. That is the oracle and the acceptance test in one. Its
  start script turns the 340 on with `type340` and the Spacewar consoles with `wcnsls`.

The KL10 is the counterexample worth writing down. MIT-MC had no separate paging box: Richard
Greenblatt's memo
[Running ITS on the KL-10](https://gunkies.org/wiki/Running_ITS_(the_Incompatible_Timesharing_System)_on_the_KL-10)
proposed doing ITS paging in modified KL10 microcode over DEC's own paging hardware. ITS pages
are 1024 words and the KL's are 512, so each ITS page loads as two hardware entries. Same
contract, different implementation: the cabinet's pager should be swappable for the same reason.

MC itself survives: KL10 serial 1038, in service at MIT from 1975 to 1988, is at the
[Interim Computer Museum](https://icm.museum/blog/?p=38). Their page has the KL-UDGE, the
DeCoriolis clock (set by `PDSET`, his initials), Moon's February 1976 note putting MC on the
ARPANET as host 354 octal, and the configuration it ended with: 2 MW of core, three RP04s and
three T-300s behind a slave PDP-11, the DL10 with CHAOS through a PDP-11 running NSWIT, and the
Dover printer reached through an Alto called SPRUCE. The KL-UDGE also gave MC 36 lights a program
could set, "since the KL10 didn't sport any", which is what a null job needs. The KA10 and KI10
consoles have a lights register a program can write; the PDP-7's console only shows its
registers, so a PDP-7 null job keeps its pattern in AC ([TODO](TODO.md), the PDP-7 operator
console).

## Words: 36 bits in a 53-bit number

JavaScript has one kind of number, a 64-bit float, and it holds every integer up to 2^53 exactly.
V8 keeps small integers (31 bits in 64-bit Chrome) as integers, and in optimized code keeps
larger ones as raw doubles in registers, so the floating point mostly compiles away. A 36-bit
word in a variable is an ordinary `number`: `+` and `-` are exact, and `% 2 ** 36` wraps. Three
things are not:

- **The bitwise operators** work on 32 bits: `&`, `|`, `^`, `<<` and `>>` silently drop the top
  four. Logic goes through halves (below).
- **Products.** Two 36-bit words multiply to as many as 72 bits, past 2^53, so `MUL`, `IMUL`,
  `DIV`, `IDIV` and the double-word shifts work in 18-bit pieces.
- **Arrays.** There is no fast 36-bit or 64-bit integer array, and a 36-bit value stored outside
  a compiled block becomes a heap number. So memory is not kept as numbers at all ([Memory](#memory)).

Then:

- **Memory** is two parallel `Uint32Array`s of 18-bit halves, `left` and `right`. Half-word
  instructions (`HLL`, `HRR`, `HRLZ`, … a quarter of the instruction set) touch one of them, and
  byte pointers address within a half or across both.
- **Half-words cost nothing.** Because the split falls where the PDP-10 splits its own words,
  `HRRZ` is one load of `right[a]`, `HLRZ` one load of `left[a]`, and `HRRM` or `HLLM` one
  store, with no shift and no mask. Packing 36 bits any other way would charge every one of them a
  shift and a mask, and they are the instructions Lisp runs on: CAR and CDR are the two halves of
  a word, and so are a stack pointer's count and address. The cost moves to the instructions that
  cross the middle: a full-word `ADD` carries out of `right` into `left`; `AOBJN` and `PUSH` add
  `1,,1`, which is two increments plus that same carry when the right half is 777777; `LSH`,
  `ROT`, a full-word compare, and a byte that straddles bit 18 read both halves. Tags kept in the
  14 spare bits of each half would put a mask back on every read, so tags that are read often go
  in a parallel plane instead ([Room beside every word](#room-beside-every-word)).
- **Registers and bus values** are `number`s below 2^36. `Cpu.read`, `Cpu.write` and `ac` in
  [bus.ts](src/bus.ts) already take `number`, so the CPU contract does not change.
- **Logic** goes through a small `w36` module that splits into halves: `and`, `or`, `xor`, `not`,
  `lsh`, `rot`, `ash`, `lh`, `rh`, `xwd`. All bitwise code in the plugin goes through it, and a
  lint rule against bare `&` in `src/plugins/ka10/` should keep it that way.
- **Not BigInt.** It is exact but allocates, and a KA10 runs a few hundred thousand instructions a
  second, each of which would make garbage.
- **What V8 keeps.** A 36-bit value does not fit V8's small integers, so it lives where V8 holds a
  raw number: a typed array, or a local in a compiled block. The sixteen accumulators can be a
  `Float64Array`, or two halves like memory. Both get measured, the way the PDP-7's rungs were
  ([BENCHMARKS.md](BENCHMARKS.md)). That is Vanessa Freudenberg's rule from SqueakJS: emit what
  the host JIT optimizes ([SEA-OF-SLOTS.md](SEA-OF-SLOTS.md#vanessas-bet)).

The same trap is already in the tree: [turing.ts](src/plugins/turing.ts) masks words with
`& this.wmask`, so the `{36, 6, 4, 18}` PDP-10 shape that [TURING-ENGINE.md](TURING-ENGINE.md)
lists would lose the top four bits of every word. Its cell arithmetic already uses division; the
masks need the same. That fix is phase 0 below.

## Memory

[core.ts](src/core.ts) is an 18-bit, 8K PDP-7 core. Generalize it by `wordBits`, with storage
chosen by width: `Uint32Array` up to 32 bits, two halves for 36. Its `.core` save format gets a
`wordBits` field; PDP-7 files without one stay 18-bit.

The KA10 sees 256K words (18-bit addresses). The MIT machines had more behind the pager. Moon:
the box added one, later two, address bits, and "there is no simple answer". The plugin offers
256K, 512K and 1M words. SIMH's ITS build runs with 512K.

Fast memory, the sixteen accumulators, sits at addresses 0–17, as on the real machine: a
reference to 0–17 is a register reference.

### Room beside every word

An 18-bit half in a 32-bit element leaves 14 bits over, and memory is cheap: a million words is
4 MB an array. Both are room for knowing what the running code does:

- **The high bits** carry tags on a half: a word the compiler has code for (so a store knows to
  invalidate it), a breakpoint, a word written since the last snapshot. A read masks them off,
  one `&` with `0o777777`.
- **Parallel arrays**, planes by address as [microM8's stack design](microm8/STACK.md) calls
  them: an execution count per word for a heat map, and the last reader, writer and executor of
  each word, its PC and which machine. [DRAWING-CONSTRAINTS.md](DRAWING-CONSTRAINTS.md) asks for
  those three for the PDP-7 already. With the 10/11 map in, the last writer of a word can be the
  PDP-7.

Korz is what makes this free when it is off. Each plane is a set of slots on the `read`, `write`
and `exec` selectors, in a `watch` dimension. With `watch` off, the resolver never picks them
and the compiler emits a plain load or store. With it on, the compiler puts the count or the
stamp inline in the compiled block, for the span of addresses being watched and nowhere else.
Nothing is decided by an `if` in the hot path.

## The KA10 as a sea

The PDP-7's instruction set is 99 slots on a handful of selectors
([KORZ-MACHINES.md](KORZ-MACHINES.md#what-is-built)). The KA10's is made the same way, and it
fits Korz even better, because the PDP-10's instruction set was designed as fields. An
instruction is a 9-bit opcode, a 4-bit accumulator, an indirect bit, a 4-bit index register and
an 18-bit address. Most opcodes are families, and each family is a product of small choices:

| Family | Opcodes | Dimensions |
|---|---|---|
| Half-word | `500`–`577` | which half from, which half to, what fills the other half (nothing, zeros, ones, sign), and the mode |
| Boolean | `400`–`477` | the function, a 4-bit truth table, and the mode |
| Test | `600`–`677` | the mask's half (right, left, direct, swapped), what to do to the tested bits (nothing, zero, complement, set), when to skip (never, all zero, always, not all zero) |
| Arithmetic compare, skip, jump | `300`–`377` | compare, jump, skip, or add or subtract one first; and the condition: never, less, equal, less or equal, always, greater or equal, not equal, greater |
| Move | `200`–`217` | plain, swapped, negative, magnitude, and the mode |
| Arithmetic | `140`–`177` floating, `220`–`237` multiply and divide, `270`–`277` add and subtract | the operation and the mode |

The mode is basic, immediate, memory, or both (or self, for the families that have it). So the
sea has slots per field, not per opcode. "Half-word, right to left, zero fill" is one slot,
"memory mode" is another, and the resolver writes the 512-entry opcode table out of them, the way
it writes the PDP-7's 32-entry `exec` table and the Turing engine's transition words
([KORZ-DISPATCH.md](KORZ-DISPATCH.md#showcase-the-turing-machine)). `why(exec, op)` names the
slots that make an opcode do what it does.

**Selectors**, after the PDP-7's:

| Selector | Guarded on | What it is |
|---|---|---|
| `read`, `write` | address, `access` (read, write, fetch), processor mode, `who` | memory, the ACs at 0–17, the pager, the 10/11 map |
| `ea` | indirect bit, index register | effective address, with the KA10's indirect chain |
| `exec` | the family dimensions above | the instruction |
| `skip`, `jump` | the condition | the compare and test families |
| `io` | device (7 bits), function (3 bits) | the I/O bus ([below](#the-io-bus-is-not-the-pdp-7s)) |
| `uuo` | opcode `000`–`077` | unimplemented user operations, which ITS uses for its system calls |

**More dimensions.** The processor mode, user or exec, is a dimension, as KORZ-MACHINES.md says
for the PDP-10. So is the **model**. The PDP-6 and the KA10 differ in a known list of
instructions, as the PDP-7 and the PDP-9 do, and in Korz a model is a dimension: slots both
machines share do not mention it, and a slot only one has is guarded on it
([The 18-bit line](KORZ-MACHINES.md#where-it-goes)). The PDP-6 that ITS started on, and that
MIT-AI kept as a slave beside the KA10, is then the same sea with another guard value. aap's
[pdp6](https://github.com/aap/pdp6) is its oracle.

**The rungs.** The same ladder as the PDP-7, every rung kept and run in lockstep with the one
below it ([KORZ-CPU.md](KORZ-CPU.md#the-rungs)):

1. **The switch**, `Ka10`: a TypeScript port of the KA10 paths of SIMH's `kx10_cpu.c`, as `Pdp7`
   is a port of `pdp18b_cpu.c`. The reference.
2. **The interpreter**, which searches the sea on every dispatch.
3. **The resolver**, which writes the tables and one generated function per selector.
4. **The compiler**, `compile10.ts`, which composes slot templates into one function per basic
   block, invalidated per word when a store lands in a word a block was compiled from
   ([KORZ-COMPILER.md](KORZ-COMPILER.md)).

SIMH's `pdp10-ka`, native, sits under all four as the oracle, through recorded instruction traces.

**The second machine.** A KA10 and a PDP-7 in one tab are two seas, and their generated
functions are their own. Their devices are not. The PDP-7's Type 340 and the KA10's Type 340 are
two instances of one class, and their slots reach their machine as `c.cpu`, so the code V8
optimized for one is the code the other runs. That is the rule that made the PDP-7's second
machine faster than its first
([KORZ-MACHINES.md](KORZ-MACHINES.md#what-is-built), "The second machine"), applied across two
architectures.

## The I/O bus is not the PDP-7's

A PDP-7 `IOT` names a device and fires timed pulses, IOP1, IOP2 and IOP4, each answered by a gate
slot ([iop.ts](src/korz/iop.ts)). A PDP-10 I/O instruction names a device (seven bits, written in
octal as a multiple of four: the 340 is `130`) and one of eight functions:

| Function | Meaning |
|---|---|
| `CONO` | conditions out: set the device's control bits and PI channel |
| `CONI` | conditions in: read status |
| `CONSZ`, `CONSO` | skip if the masked status is zero / nonzero |
| `DATAO`, `DATAI` | one data word out / in |
| `BLKO`, `BLKI` | increment a pointer word, then `DATAO`/`DATAI` through it; skip unless the count runs out |

On the Korz KA10 this is the `io` selector, with `device` and `fn` as its dimensions. A device
answers four functions, each one slot: `cono`, `coni`, `datao`, `datai`. The other four belong to
the processor, as slots guarded on `fn` alone: `BLKO` increments the pointer word and sends
`DATAO` on to the same device, and `CONSZ` and `CONSO` send `CONI` and test the result. A device
never sees a `BLKO`.

`io10.ts` is to the KA10 what `iop.ts` is to the PDP-7: four helpers, one per function. The device
kit under both does not know a bus protocol ([device.ts](src/korz/device.ts)), so power switches
come from it unchanged: a powered-off device is a patch-layer slot on its device code, and `why`
on a dead `CONO` names the switch. An unclaimed device code is a bus slot too.

### Priority interrupts, and MIT's seventeen levels

Seven PI channels; channel *n* executes the instruction at `40 + 2n`, and if that is a `BLKO` or
`BLKI` whose count has run out, the one at `41 + 2n`, which can jump to a real handler. So a
single `BLKO` there feeds a device without a full interrupt routine. MIT's KA10s did most of
their DMA this way. Moon: magtape, DECtape, the ARPANET, the 340 and maybe analog I/O "all worked
by using the KA10's single-instruction interrupt handler feature", and MIT-AI had no DF10 data
channel at all.

They also added seven more levels: "an extra I/O bus cable which added seven additional interrupt
levels, each with its own pair of interrupt instructions in locations 62-77", all at channel 1's
priority. Moon called it the **channel 1 multiplex feature** and recommends it to anyone with
many devices. The plugin implements it as an option (`pi.multiplex`) because ITS for AI expects
it.

A PI request is a reduction, not a dispatch: each channel is the wired OR of every device
assigned to it. The backplane computes it over the devices' requests, as the PDP-7's interrupt
line is computed, and `why` on a channel lists who is pulling it
([KORZ-DISPATCH.md](KORZ-DISPATCH.md#the-whole-machine)). Devices are event-driven, as on the
PDP-7: each says how many cycles remain before it raises a request, and the compiler hands the
CPU a batch up to the next one.

## The pager is a device

ITS knows several pagers; Moon: "even the format of page-table entries is parameterized, since it
has been different on every machine ITS has run on". So the plugin does the same. A pager is a
set of slots on `read` and `write`, guarded on the processor mode and on which pager is fitted,
between the processor and core:

- **`none`**: DEC's relocation/protection pair, for DEC diagnostics and non-ITS programs.
- **`its-ka`**: MIT's box. 1024-word pages; user and exec maps from page tables in core; an
  associative memory of recent translations; page faults that can restart the instruction. Opcode
  `102` loads and stores the box's eight registers as a block (`LPM`/`SPM`), which is how ITS
  switches jobs. The ITS-specific processor changes Moon lists (write access checked before the
  accumulator changes, the PC and flags saved at every instruction start so a fault can back up,
  `BLT` faults fixed) belong to the processor, guarded on this pager.
- **`its-kl`** (later, for a KL10 plugin): Greenblatt's microcode version, two hardware half-pages
  per ITS page, the DBR registers.

Loading the pager's registers is an install. A compiled block depends on the translations it was
compiled under, so `LPM` invalidates the blocks of the job it switches away from. `kx10_cpu.c` is
the reference for the exact bit layouts; Moon's account and Greenblatt's memo are the why.

## The devices the PDP-7 already has

A cabinet device is split in layers ([DEVICES.md](DEVICES.md)): the abstract device, which knows
no machine, and a binding, which maps it onto one architecture's I/O. On the PDP-7 the binding is
IOTs on a device code. On the KA10 it is the four functions on a device number. The abstract
device does not change, and neither do its tests.

Some of these are DEC's or MIT's, and some are the cabinet's own. Every slot says which in its
`by`, so `view` on `by` lists everything DEC did not build, on either machine.

| Device | Real or the cabinet's | On the PDP-7 (built) | On the KA10 (planned) |
|---|---|---|---|
| Type 340, with the 342 characters and the 347 subroutines | DEC's; MIT-AI had one | IOTs 05–10; it fetches the display file from core | device `130` through the Type 344: the processor feeds it ([below](#the-korz-type-340-on-the-ka10)) |
| Light pen | DEC's | a flag on the 340, read with the 340's IOTs | `CONI` bit 2.2 on device `130`, on the 340's special PI channel; `DATAI` reads the beam position |
| Which pen fired, of eight | the cabinet's | IDPN, IOT 11 | a free device number, marked as the cabinet's |
| Teletype | DEC's | IOTs 03 and 04 | the console teletype, device `120` |
| Paper tape reader | DEC's | IOT 01 | device `104` |
| Clock | DEC's | IOT 00 | the processor's line-frequency clock flag |
| Disk | DEC's | the RB09, IOT 71 | not shared: ITS's build uses RP03 packs on the RP10, a KA10 device of its own |
| Turing machine coprocessor | the cabinet's | IOT 54; the table and tape in core through a `MemoryPort` | a device number; the same engine over PDP-10 core, SIXBIT cells, shape `{36, 6, 4, 18}` ([TURING-ENGINE.md](TURING-ENGINE.md)) |
| Ultimate Machine | the cabinet's | IOTs 55 and 56 | a device number, or a word mapped into a job ([MAPPING.md](MAPPING.md#device-registers-are-memory-too)) |
| DataHand | the cabinet's | IOT 57, in the Forth turtle's units | a device number, in units a 36-bit program wants; and as axes for LLOGO's `DIALS` ([LOGO-TURTLE.md](LOGO-TURTLE.md#every-device-logo-drove-to-emulate)) |
| tiny-titan link | Cambridge's protocol, the cabinet's link | IOTs 22 and 23 | through the same Titan |
| Files and host calls | the cabinet's | IOT 24, CALL ([TINY-TITAN.md](TINY-TITAN.md#one-call-for-the-host-call-on-device-24)) | `DATAO` the block's address, `CONO` to start, `CONSO` on the done flag ([TINY-TITAN.md](TINY-TITAN.md#one-titan-for-every-machine)) |
| Forth device | the cabinet's | stacked on the PDP-7's NEXT ([FORTH-DEVICE.md](FORTH-DEVICE.md)) | not shared: it is a PDP-7 instruction-level device |

The host side comes along with each device, because it was never in the binding. The teletype
wraps, scrolls, zooms, reads aloud and takes dictation ([MANIFESTO.md](MANIFESTO.md#push-the-driver-out-into-the-host))
for ITS as for UNIX. The 340's segments go to the same phosphor, the same recorder and the same
print-screen. The pens are the same `PenInput` list, with the same mouse, the same simulated
Heinz, and the same multi-pen colors ([lightpen.ts](src/plugins/lightpen.ts)).

## The Korz Type 340 on the KA10

The cabinet's 340 is two seas' worth of behavior ([KORZ-DISPATCH.md](KORZ-DISPATCH.md#showcase-the-type-340)).
One is its IOTs on the PDP-7's bus. The other is its own instruction set: `KorzType340` puts one
slot on `word` for each thing a display word can do, on two dimensions, the mode register and
the top two bits, and the resolver writes that as an 8 × 4 table
([type340.ts](src/korz/type340.ts)). `Type340`'s switch is its oracle, and the two run in lockstep
on random display files and in every cabinet rig.

**The display sea moves to the KA10 unchanged.** A 340 word is a 340 word whichever computer
sent it. The parameter, point, vector, increment, character and subroutine slots are the same,
the beam code is the same, and `why(word, mode)` answers the same on ITS's display files as on
PIXIE's. The cabinet's DTG slot, which tags what follows so a pen hit can say what it hit, is
there too, and says it is not DEC's.

**What changes is the binding.** On the PDP-7 the 340 fetches its own words from core by DMA. On
the PDP-6 and KA10 at MIT it sat behind the **Type 344 interface**, which the processor fed: each
`DATAO` to device `130` sends one 36-bit word, two 18-bit display instructions, left half then
right ([kx10_dpy.c](https://github.com/simh/simh/blob/master/PDP10/kx10_dpy.c), Philip Budne,
citing ITS's `340 INFO`). ITS fed it by `BLKO` from an interrupt location. `340 INFO` gives the
`CONI` bits (the mode, vertical edge, light pen hit, horizontal edge, stop, done, and the special
and data PI channels) and the `CONO` bits (no-ink mode, half-word mode, resume, initialize, and
the two PI channels). So the 344 is a dozen slots on `io`, guarded on device `130`:

- `datao`: put the word's two halves in the 340's queue and clear done.
- `coni`: the status above.
- `cono`: the modes, resume, initialize, and the two channel assignments.
- `datai`: the beam position.

The 340's `fetch` callback, which on the PDP-7 reads core, reads that queue on the KA10. Running
out of words raises done on the data channel, and the `BLKO` at its interrupt location sends the
next word. Edges, stops and pen hits raise the special channel. Half-word mode and no-ink mode
get settled against SIMH's model and against ITS's own display code.

**It is easier to run fast than on the PDP-7.** The PDP-7's 340 reads core every cycle while it
draws, so it runs ahead from a snapshot and rolls back when the CPU writes a word it already read
([KORZ-MACHINES.md](KORZ-MACHINES.md#what-is-built), Time Warp's idea). Behind a 344 the 340 cannot
see PDP-10 memory at all. It holds at most one word, and its next event is a number it can
compute: the cycle it runs out, or the cycle it raises a flag. The CPU's compiled batch runs to
that cycle with nothing to roll back.

**The display file as one function.** The compiler's planned rule for the 340, a display file that
does not change compiled into one function that emits its segments, applies on both machines
([KORZ-CPU.md](KORZ-CPU.md#stacking-instruction-sets)). On the KA10 the `BLKO` pointer says where
the file is and how long it is, and the same per-word invalidation drops the function when a
store lands in it.

**What to run on it.** The ITS build has the programs that drew on MIT-AI's 340
([doc/programs.md](https://github.com/PDP-10/its/blob/master/doc/programs.md)): MUNCH, munching
squares; SPCWAR, Spacewar, with the Spacewar consoles; PORNIS, Steiner chains; NTSDDT, DDT with 340
support; MacHack VI's board display; and LLOGO's display turtle. They are the acceptance tests
for the 344, run in SIMH and in the cabinet, frame for frame.

**One 340 or two.** MIT-AI had one 340, on the KA10. The cabinet can give each machine its own, or
put one 340 between them with a switch that says which machine drives it. That switch is a patch
slot, so `why` on the display says who has it. This is a choice to make in the cartridge, not in
the code.

## Machines that see each other

The other half of the point. MIT's 10/11 interface let a PDP-10 job map a PDP-11's memory into
its own address space with one system call, `T11MP` ([MAPPING.md](MAPPING.md#the-rubin-1011-interface)).
In Korz a mapping is a slot: a `read` and a `write` slot on a span of PDP-10 physical addresses
that answer from another machine's memory, through a packing rule
([MAPPING.md](MAPPING.md#packing-rules)). The interface's map is 256 words of PDP-10 memory at
`3,,776000`, so an observe slot on writes there installs and removes those slots as ITS changes
the map. `why` on a mapped word names the map entry and the machine behind it.

The PDP-7 is one of the machines on the far end. Its 18-bit words pack two to a PDP-10 word,
`left,,right`, so `HLRZ` and `HRRZ` reach each PDP-7 word directly and nothing is lost. Then:

- **An ITS job reads PIXIE.** PIXIE's rings live in PDP-7 core. A job maps that core and walks the
  rings with half-word instructions, while the PDP-7 runs SYMELEC.
- **DDT on the PDP-10 examines the PDP-7.** ITS's debugger, pointed at a mapped page, reads and
  changes a running PDP-7.
- **The Turing engine crosses over.** The same engine runs on the KA10 over a tape in the PDP-7's
  core, and PDP-7 Forth watches the tape the PDP-10 is writing ([MAPPING.md](MAPPING.md#memoryport-is-already-the-adapter)).
- **Device registers are words.** The Ultimate Machine's switch and lid appear as a word in a
  PDP-10 job, which turns the machine on with a store and watches the arm come out with a load,
  as MIT-AI's `DOOR` server buzzed the ninth-floor door
  ([MAPPING.md](MAPPING.md#the-door-and-the-elevator)).
- **Locks.** ITS's `AOSE` on −1 and the PDP-7's `ISZ` on `777777` are the same idea in two widths.
  The backplane steps both machines in one thread, so a shared lock's increment and test stay
  indivisible ([MAPPING.md](MAPPING.md#locks)).

## The ninth floor: the TV-11, the door, the elevator and the tourists

MIT-AI reached the building through the same interface. The TV-11, the PDP-11 that ran the
Knight TVs, had spare bits in its keyboard multiplexer status register, Unibus `764050`, wired
to the elevator call buttons for floors 8 and 9 (bits 8 and 9, held about ⅓ s) and the
ninth-floor door buzzer (bit 11, held 3 s). Three roads set them: Escape D and Escape E on a
Knight TV, which the TV-11 handled itself; Terminal-D and Terminal-E on a Lisp Machine; and
`:ESCE` at an ITS terminal. The last two went over Chaosnet to the `DOOR` server on AI, which
mapped the register into its own address space with `T11MP`, set the bit, waited and cleared it
([Call me an elevator](../../characters/kent-pitman/elevator-and-door.md),
[MAPPING.md](MAPPING.md#the-door-and-the-elevator)).

Running that needs machines the cabinet does not have yet, and simulators of things that were
never computers. None of it is built:

| Piece | Real or imagined | In the cabinet |
|---|---|---|
| TV-11 | a real PDP-11 | a PDP-11 on the Korz CPU kit, running the TV-11's own program, [tv.147](https://github.com/PDP-10/its/blob/master/src/system/tv.147). Its Unibus memory is what `T11MP` maps |
| Knight TV | real | a frame buffer in TV-11 memory, shown the way the 340 viewer shows the 340, with its keyboard on the multiplexer |
| The status register | real | a device-kit register at `764050`, with observe slots on bits 8, 9 and 11 that tell the building |
| Elevator | simulated | cars and floors on machine time; bit 8 or 9 held is a hall call on that floor |
| Ninth-floor door | simulated | locked, and released while bit 11 is held; it hears knocking |
| Tourists | imagined | people who arrive in the lobby at random times, call the elevator, ride to nine and knock |
| Hackers | imagined | people at the terminals who, after a while of knocking, buzz the door, or don't |
| Lisp Machine | a real CADR | a CADR emulator beside the cabinet, on the same Chaosnet |
| Terminal | real | an ITS login on the cabinet's teletype |

A run goes the way Don's did as an urchin: a tourist comes up in the elevator and pounds on the
door until someone at a Knight TV types Escape D. A player at a simulated Knight TV can be the
one who buzzes. Once in, the tourist sits at a free Knight TV, Lisp Machine or terminal, logs in
under the [tourist policy](../../characters/don-hopkins/mit-ai-lab-tourist-policy.md), and plays.

The building keeps machine time from the backplane like every other device, so a buzz held for
3 s of KA10 time holds the door for 3 s, and the whole floor runs fast or slow with the
machines. Its random numbers are seeded, so a run replays. Drawn as a cutaway, floors stacked
with the elevator in its shaft, it is the same kind of picture as Little Computer People's
house, and the people in it can be the cabinet's characters.

[tiny-titan](TINY-TITAN.md#one-titan-for-every-machine) is where both machines meet: the file
mounts, the drawing store, the services, the clocks, and the map. Each machine reaches it through
a door in its own idiom, with the request block in its own word size.

## MacLisp, fast and in view

A goal, not built. MacLisp is part of the ITS build in [PDP-10/its](https://github.com/PDP-10/its),
so it comes with phase 5. Two things make it a good test of this design:

- **It runs on half-words.** A cons is one word, CAR in the left half and CDR in the right, so
  `CAR` is `HLRZ` and `CDR` is `HRRZ`, and NIL tests are jumps on a half. Lists are walked with
  `PUSHJ`, `POPJ`, `PUSH` and `POP` on a stack pointer that is itself a count and an address in
  halves. Those are the instructions the two-array memory does in one load or store, and the ones
  the compiler should make fastest. MacLisp's own compiler already open-codes fixnum and flonum
  arithmetic, so compiled MacLisp runs mostly straight-line code with few traps.
- **Its types are in its memory map.** MacLisp keeps each type in its own segments (BIBOP, a big
  bag of pages) and looks a word's type up in a segment table by address. The table is in core,
  so the cabinet can read it too, and knows without guessing whether a word is a cons, a fixnum,
  a flonum, a symbol or an array.

That is what a viewer needs, and [RingView](../../apps/ties/src/lib/RingView.svelte) already does
the same for PIXIE: it reads core live, lays the structure out in 3D, lights the cells that
changed, and opens a cell in the memory panel when clicked. A MacLisp view reads the segment table
for types and walks conses from roots: the obarray of interned symbols, their property lists and
values, and the stack. The planes add what core alone can't show. The writer plane shows which
function last did a `RPLACA` or `RPLACD` on a cell, the heat plane shows which lists are being
walked, and the age of each write shows the free list being used up and refilled by the garbage
collector. The segment size, the table's layout and the roots' addresses come from the MacLisp
sources, which are still to read.

## Phases

0. **36-bit hygiene.** Fix the `& wmask` masks in [turing.ts](src/plugins/turing.ts) and test the
   engine at `{36, 6, 4, 18}` against a plain array: same results as the 18-bit shape, only more
   cells per word.
1. **`w36` and core.** Halves, exact arithmetic, byte pointers (`LDB`, `DPB`, `ILDB`, `IDPB`,
   `IBP`), `wordBits` in `core.ts`. Unit tests per instruction against `kx10_cpu.c` by hand.
2. **The switch rung**, `Ka10`, with the `none` pager, a teletype on device `120`, and the paper
   tape reader on `104`. Acceptance: DEC diagnostics, then DDT on a bare machine.
3. **Oracle runs.** Boot the same image in SIMH's `pdp10-ka` and in the cabinet, record
   instruction traces, and diff them, as the PDP-7 does against `pdp7.c` ([SIMH-MAP.md](SIMH-MAP.md)).
4. **The sea.** The KA10 on the Korz CPU kit, with the instruction families as dimensions, and
   the `io` bus through the device kit. The interpreter and the resolver in lockstep with `Ka10`
   on random programs and on the boot.
5. **`its-ka` pager, PI multiplex, the RP10 disk.** Acceptance: the ITS image from `PDP-10/its`
   comes up to `DSKDMP`, then logs in.
6. **The 340 through the 344.** Split the 340's PDP-7 IOTs out of `Type340` into a PDP-7 binding,
   and write the 344 binding beside it. `KorzType340` in lockstep with `Type340` on the KA10 as on
   the PDP-7. Acceptance: MUNCH and SPCWAR draw in the cabinet's 340 viewer as they do in SIMH.
7. **The other devices**, bound to the KA10: the Turing engine with SIXBIT cells, the tiny-titan
   door, the DataHand, the Ultimate Machine. Each runs its PDP-7 tests unchanged, plus a KA10 rig.
8. **The compiler**, `compile10.ts`, with per-word invalidation and the pager's invalidation on
   `LPM`. Benchmarks beside the PDP-7's and the Apple's in [BENCHMARKS.md](BENCHMARKS.md).
9. **The 10/11 map** ([MAPPING.md](MAPPING.md)): the PDP-7, the Turing tape, or a PDP-11 when we
   have one, appearing in a PDP-10 job's address space through `T11MP`.
10. **The ninth floor.** A PDP-11 on the Korz kit running tv.147, the status register, then the
    elevator, the door, the tourists and the hackers. Acceptance: `:ESCE 9` at an ITS terminal and
    Escape D on a Knight TV both bring a tourist in.
11. **MacLisp, fast and in view.** Benchmarks of interpreted and compiled MacLisp on the Korz
    KA10, then the cons viewer over the segment table and the planes
    ([MacLisp, fast and in view](#maclisp-fast-and-in-view)).

## Sources

- SIMH `PDP10/`: [kx10_cpu.c](https://github.com/simh/simh/blob/master/PDP10/kx10_cpu.c),
  [kx10_dpy.c](https://github.com/simh/simh/blob/master/PDP10/kx10_dpy.c) (the 344, and ITS's
  `340 INFO` bits), [ka10_ten11.c](https://github.com/simh/simh/blob/master/PDP10/ka10_ten11.c),
  and the other `ka10_*` devices.
- [PDP-10/its](https://github.com/PDP-10/its): ITS sources, the build and its
  [`pdp10-ka` configuration](https://github.com/PDP-10/its/tree/master/build/pdp10-ka),
  [doc/machines.md](https://github.com/PDP-10/its/blob/master/doc/machines.md),
  [doc/programs.md](https://github.com/PDP-10/its/blob/master/doc/programs.md).
- [aap/pdp6](https://github.com/aap/pdp6), the PDP-6.
- David Moon, [Hardware info](https://github.com/PDP-10/its/wiki/Hardware-info-from-David-Moon)
  (the paging box, the channel 1 multiplex, the 10/11 interface, the DF10 kludge).
- Richard Greenblatt, [Running ITS on the KL-10](https://gunkies.org/wiki/Running_ITS_(the_Incompatible_Timesharing_System)_on_the_KL-10).
- [KL-UDGE](https://github.com/PDP-10/its/issues/622), MIT-MC's homebrew box for the IMP
  interface, clocks and console lights; not a pager.
- Interim Computer Museum, [MIT-MC.ARPA](https://icm.museum/blog/?p=38): the machine itself, its
  configuration, and photographs.
- David Ungar, Harold Ossher and Doug Kimelman, *Korz: Simple, Symmetric, Subjective,
  Context-Oriented Programming*, Onward! 2014 ([PDF](../../characters/david-ungar/sources/korz-2014-onward.pdf)).
