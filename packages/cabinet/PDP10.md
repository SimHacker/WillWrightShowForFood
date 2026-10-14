# PDP-10: a KA10 plugin that runs ITS

A design, not yet code. The cabinet's second big CPU after the PDP-7 is
the 36-bit PDP-10, as MIT's AI Lab had it: a KA10 with the lab's own
paging box, extra interrupt levels, a Type 340 display, and a cable to
eight PDP-11s through which any user program could map another machine's
memory into its own address space. That last part is the history of
what the cabinet is trying to do; it has its own document,
[MAPPING.md](MAPPING.md). This one is the CPU plan.

Status: planned in [README.md](README.md) ("A PDP-10 that runs ITS") and
in [ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md#different-processors-one-cabinet),
which already decided that "a PDP-10 should not pretend its channels are
PDP-7 IOTs".

## Which machine

ITS ran on four kinds of PDP-6/10 at MIT ([doc/machines.md](https://github.com/PDP-10/its/blob/master/doc/machines.md)):
the PDP-6 it started on in 1966, the KA10s (AI, ML, DM), the KL10 MIT-MC,
and later KS10s. We build the **KA10**, for three reasons:

- **It is MIT-AI**, the machine with the 340, the Knight TV system and
  the 10/11 interface. Everything in [MAPPING.md](MAPPING.md) happened on it.
- **Its pager is a separate box.** DEC sold the KA10 with only a
  relocation/protection pair. MIT built a paging box in 1970 as a
  separate bay of TTL wire-wrap boards beside the processor ([David Moon](https://github.com/PDP-10/its/wiki/Hardware-info-from-David-Moon)).
  The processor put a virtual address on the memory bus, the box mapped
  it, and "the processor doesn't know that it isn't talking directly to
  the memories". That is a device on a bus, the shape the cabinet already
  has.
- **SIMH has it.** `PDP10/kx10_cpu.c` with the `ka10_*` devices models
  the MIT machines, Rubin interface and all, and the
  [PDP-10/its](https://github.com/PDP-10/its) project builds a bootable
  ITS for it with `make EMULATOR=pdp10-ka`. That is the oracle and the
  acceptance test in one.

The KL10 is the counterexample worth writing down. MIT-MC had no separate
paging box: Richard Greenblatt's memo
[Running ITS on the KL-10](https://gunkies.org/wiki/Running_ITS_(the_Incompatible_Timesharing_System)_on_the_KL-10)
proposed doing ITS paging in modified KL10 microcode over DEC's own paging
hardware. ITS pages are 1024 words and the KL's are 512, so each ITS page
loads as two hardware entries. Same contract, different implementation:
the cabinet's pager should be swappable for the same reason.

## Words: 36 bits in a 53-bit number

JavaScript numbers hold integers exactly up to 2^53, so a 36-bit word is
an ordinary `number`, and `+`, `-`, `*` with `% 2 ** 36` are exact. The
bitwise operators are not: `&`, `|`, `^`, `<<` and `>>` work on 32 bits
and silently drop the top four.

- **Memory** is a `Uint32Array` of two 18-bit halves per word, left then
  right. Half-word instructions (`HLL`, `HRR`, `HRLZ`, … a quarter of the
  instruction set) touch one element, and byte pointers address within
  a half or across both.
- **Registers and bus values** are `number`s below 2^36. `Cpu.read`,
  `Cpu.write` and `ac` in [bus.ts](src/bus.ts) already take `number`, so
  the CPU contract does not change.
- **Logic** goes through a small `w36` module that splits into halves:
  `and`, `or`, `xor`, `not`, `lsh`, `rot`, `ash`, `lh`, `rh`, `xwd`. All
  bitwise code in the plugin goes through it, and a lint rule against
  bare `&` in `src/plugins/ka10/` should keep it that way.
- **Not BigInt.** It is exact but allocates, and a KA10 runs a few hundred
  thousand instructions a second, each of which would make garbage.

The same trap is already in the tree:
[turing.ts](src/plugins/turing.ts) masks words with `& this.wmask`, so
the `{36, 6, 4, 18}` PDP-10 shape that
[TURING-ENGINE.md](TURING-ENGINE.md) lists would lose the top four bits of
every word. Its cell arithmetic already uses division; the masks need the
same. That fix is phase 0 below.

## Memory

[core.ts](src/core.ts) is an 18-bit, 8K PDP-7 core. Generalize it by
`wordBits`, with storage chosen by width: `Uint32Array` up to 32 bits,
two halves for 36. Its `.core` save format gets a `wordBits` field;
PDP-7 files without one stay 18-bit.

The KA10 sees 256K words (18-bit addresses). The MIT machines had more
behind the pager. Moon: the box added one, later two, address bits, and
"there is no simple answer". The plugin offers 256K, 512K and 1M words.

Fast memory, the sixteen accumulators, sits at addresses 0–17, as on the
real machine: a reference to 0–17 is a register reference.

## The I/O bus is not the PDP-7's

A PDP-7 `IOT` names a device and pulses (`Iot {device, pulse, ac}` in
[bus.ts](src/bus.ts)). A PDP-10 I/O instruction names a device (seven
bits, written in octal as a multiple of four: the 340 is `130`) and one
of eight functions:

| Function | Meaning |
|---|---|
| `CONO` | conditions out: set the device's control bits and PI channel |
| `CONI` | conditions in: read status |
| `CONSZ`, `CONSO` | skip if the masked status is zero / nonzero |
| `DATAO`, `DATAI` | one data word out / in |
| `BLKO`, `BLKI` | increment a pointer word, then `DATAO`/`DATAI` through it; skip unless the count runs out |

So the KA10 gets its own device type, beside the PDP-7's:

```ts
interface Ka10Device {
  readonly devices: readonly number[];          // 130, 134, …
  cono(dev: number, bits: number): void;
  coni(dev: number): number;
  datao(dev: number, word: number): void;
  datai(dev: number): number;
  pi(): number;                                 // channels requesting, a 7-bit mask
  tick?(cycles: number): void;
  reset(): void;
  power: boolean;
}
```

`CONSZ`, `CONSO`, `BLKI` and `BLKO` are the processor's, built from the
four device calls. Power, tick, reset and the cabinet's shared services
(run, stop, inspection, recording) stay as in
[ARCHITECTURE-AND-LINEAGE.md](ARCHITECTURE-AND-LINEAGE.md#cpus-are-devices).
A device that has nothing PDP-7 about it, like the Ultimate Machine,
gets a thin adapter for each bus rather than a second implementation.

### Priority interrupts, and MIT's seventeen levels

Seven PI channels; channel *n* executes the instruction at `40 + 2n`,
and if that is a `BLKO` or `BLKI` whose count has run out, the one at
`41 + 2n`, which can jump to a real handler. So a single `BLKO` there feeds a device
without a full interrupt routine. MIT's KA10s did most of their DMA this
way. Moon: magtape, DECtape, the ARPANET, the 340 and maybe analog I/O
"all worked by using the KA10's single-instruction interrupt handler
feature", and MIT-AI had no DF10 data channel at all.

They also added seven more levels: "an extra I/O bus cable which added
seven additional interrupt levels, each with its own pair of interrupt
instructions in locations 62-77", all at channel 1's priority. Moon
called it the **channel 1 multiplex feature** and recommends it to anyone
with many devices. The plugin implements it as an option (`pi.multiplex`)
because ITS for AI expects it.

## The pager is a device

ITS knows several pagers; Moon: "even the format of page-table entries
is parameterized, since it has been different on every machine ITS has
run on". So the plugin does the same: a `Pager` interface between the
processor and core, and implementations behind it.

```ts
interface Pager {
  translate(vaddr: number, write: boolean, user: boolean): number | Fault;
  lpm(block: number[]): void;   // load eight registers from memory
  spm(): number[];              // store them
  reset(): void;
}
```

- **`none`**: DEC's relocation/protection pair, for DEC diagnostics and
  non-ITS programs.
- **`its-ka`**: MIT's box. 1024-word pages; user and exec maps from page
  tables in core; an associative memory of recent translations; page
  faults that can restart the instruction. Opcode `102` loads and stores
  the box's eight registers as a block (`LPM`/`SPM`), which is how ITS
  switches jobs. The ITS-specific processor changes Moon lists (write
  access checked before the accumulator changes, the PC and flags saved
  at every instruction start so a fault can back up, `BLT` faults fixed)
  belong to the processor, switched on with this pager.
- **`its-kl`** (later, for a KL10 plugin): Greenblatt's microcode
  version, two hardware half-pages per ITS page, the DBR registers.

`kx10_cpu.c` is the reference for the exact bit layouts; Moon's account
and Greenblatt's memo are the why.

## The 340 on a KA10

The cabinet already has a Type 340 ([type340.ts](src/plugins/type340.ts)),
fed through a `fetch(addr)` callback. On the PDP-7 the 340 fetches its
own words from core. On the PDP-6 and KA10 at MIT it sat behind the
**Type 344 interface**, which the processor fed: each `DATAO` to device
`130` sends one 36-bit word, two 18-bit display instructions, left half
then right ([kx10_dpy.c](https://github.com/simh/simh/blob/master/PDP10/kx10_dpy.c),
Philip Budne, citing ITS's `340 INFO`). ITS fed it by `BLKO` from an
interrupt location; `CONO` sets flags and the PI channel; `DATAI` reads
back the beam position.

So the KA10 340 is the same `Type340`, with its fetch fed from a
two-word queue that `DATAO` fills and the PI request empties. Same
display, same phosphor, same light pen; the 344 is a dozen lines.

## Phases

0. **36-bit hygiene.** Fix the `& wmask` masks in
   [turing.ts](src/plugins/turing.ts) and test the engine at
   `{36, 6, 4, 18}` against a plain array: same results as the 18-bit
   shape, only more cells per word.
1. **`w36` and core.** Halves, exact arithmetic, byte pointers
   (`LDB`, `DPB`, `ILDB`, `IDPB`, `IBP`), `wordBits` in `core.ts`. Unit
   tests per instruction against `kx10_cpu.c` by hand.
2. **The processor**, with the `none` pager, a teletype on device `120`,
   and a paper-tape reader. Acceptance: DEC diagnostics, then DDT on a
   bare machine.
3. **Oracle runs.** Boot the same image in SIMH's `pdp10-ka` and in the
   cabinet, record instruction traces, and diff them, as the PDP-7 does
   against `pdp7.c` ([SIMH-MAP.md](SIMH-MAP.md)).
4. **`its-ka` pager, PI multiplex, a disk.** Acceptance: the ITS image
   from `PDP-10/its` comes up to `DSKDMP`, then logs in.
5. **The 340 through the 344.** Acceptance: ITS display programs draw
   in the cabinet's 340 viewer.
6. **The 10/11 map** ([MAPPING.md](MAPPING.md)): a PDP-7 VM, the Turing
   tape, or a PDP-11 when we have one, appearing in a PDP-10 job's
   address space through `T11MP`.

## Sources

- SIMH `PDP10/`: [kx10_cpu.c](https://github.com/simh/simh/blob/master/PDP10/kx10_cpu.c),
  [kx10_dpy.c](https://github.com/simh/simh/blob/master/PDP10/kx10_dpy.c),
  [ka10_ten11.c](https://github.com/simh/simh/blob/master/PDP10/ka10_ten11.c),
  and the other `ka10_*` devices.
- [PDP-10/its](https://github.com/PDP-10/its): ITS sources, the build,
  [doc/machines.md](https://github.com/PDP-10/its/blob/master/doc/machines.md).
- David Moon, [Hardware info](https://github.com/PDP-10/its/wiki/Hardware-info-from-David-Moon)
  (the paging box, the channel 1 multiplex, the 10/11 interface, the DF10
  kludge).
- Richard Greenblatt, [Running ITS on the KL-10](https://gunkies.org/wiki/Running_ITS_(the_Incompatible_Timesharing_System)_on_the_KL-10).
- [KL-UDGE](https://github.com/PDP-10/its/issues/622), MIT-MC's
  homebrew box for the IMP interface, clocks and console lights; not a
  pager.
