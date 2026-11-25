# Korz for machines: a note asking for feedback

For David Ungar, Randall Smith, Alan Kay, Dan Ingalls, Lars Brinkhoff, Bob Supnik, Philip Budne,
and the others whose work this rests on. A draft: corrections welcome at any level, from "that's
not what Korz means" to "you'll regret that data structure".

The same TypeScript runs in Node and in the browser, and each machine runs in a page you can
open: [PDP-7 UNIX](https://hyperties.org/cabinet/systems/pdp-7-unix/), and
an [Apple \]\[+](https://hyperties.org/cabinet/machines/apple-ii/) on the same kit. There is no native build to
fetch, and the only WebAssembly module is microM8, kept on the Apple page as the oracle to
measure against. A slot is a JavaScript
function. V8 compiles the generated JavaScript, and V8's own lineage runs back through Self, which
is why this note is addressed where it is. Because the emulator is JavaScript in the page, a
person can read it, change one slot, and watch the PDP-7 change.

## The idea

Korz is [David Ungar](../../characters/david-ungar/README.md), Harold Ossher and Doug Kimelman's
language of subjective, context-oriented programming
([Onward! 2014](../../characters/david-ungar/sources/korz-2014-onward.pdf)). The name comes from
[Alfred Korzybski](https://en.wikipedia.org/wiki/Alfred_Korzybski), the founder of general
semantics, whose *[Science and Sanity](https://en.wikipedia.org/wiki/Science_and_Sanity)* (1933)
is about how much a point of view shapes what one sees. It has his best-known line:
"[A map is not the territory](https://en.wikipedia.org/wiki/Map%E2%80%93territory_relation) it
represents, but, if correct, it has a similar structure to the territory, which accounts for its
usefulness." An emulator is that kind of map of a machine, and the slots below are its structure.

An emulator is a dispatcher with small, finite, fully known coordinates: address, read or write or
fetch, who is on the bus, opcode bits, device code, IOT pulse, memory configuration. Emulators
encode that dispatch by hand in switch statements and page tables. A plugin that wants to change one
address has to find the right place to patch it, and a debugger that wants to watch one has to be
built into the emulator.

We put every handler, mapping, opcode, IOT gate, trap, watch, fault and accelerator into one Korz
sea of guarded slots, and dispatch each access to the most specific match. The paper's coordinate
is any element of a partial order, an object or a person as easily as a bit, and a send searches.
This stack numbers every coordinate, `0 .. 2^width − 1`, so the answer can be an index. The
machines' coordinates really are small integers, so numbering them loses nothing. A later
dimension whose order is objects or floats would stay a search beside these tables;
[KORZ-DISPATCH.md](KORZ-DISPATCH.md) says how. Because these domains are finite and every context
is complete, two things Korz in general cannot do become possible:

- **Ambiguity is decided at install time**, by set arithmetic on the guards. Installs are
  transactional, so a card can bring the slot that resolves its own overlaps.
- **The sea resolves ahead of time** into the arrays a hand-written emulator would use. It is then
  compiled, with the dispatch folded into generated code.

The aspiration is a way of building emulators in general, for every machine SIMH covers and more,
and taking it further than SIMH can. SIMH and its ports serve as the oracle. Instrumentation,
extension and optimization are all the same operation: install a slot. `why` on any access names
the slots that answered it and who installed them.

This is also how the cabinet enforces its [manifesto](MANIFESTO.md).
The manifesto says the machine in the page is ours, all of it at once, and that tribute,
accessibility and fun may bend the rules while the 1960s machine stays honest. Korz is the
mechanism. The faithful PDP-7 is the slots of the machine layer, checked in lockstep against the
switch-statement port of SIMH. A watch, a host service, a coprocessor, a louder teletype, a slot
installed by a person with their name on it: each is another slot, in a layer `why` can name, and
removing it restores the faithful machine. Nothing is sealed off, because a sealed-off part would
be a dispatch the sea does not own. The same sea is what lets one machine read another, which is
the manifesto's federation: shared memory is a slot that says which machine answers.

## What is built

All of this is in TypeScript in this package, and runs in Node and the browser:

- [`src/korz/korz.ts`](src/korz/korz.ts): the sea. It does not know a CPU, a device, a cell, or a tape.
- [`src/korz/cpu.ts`](src/korz/cpu.ts): the CPU host. A CPU file brings dimensions, slots, the decode, and the poll.
- [`src/korz/device.ts`](src/korz/device.ts): a device plugs in as slots, or as the function it already has, and a patch slot answers while its power is off.
- [`src/korz/ca.ts`](src/korz/ca.ts): Life, neighbor bits and a derived count.
- [`src/korz/tm.ts`](src/korz/tm.ts): a Turing rule as slots. It steps a tape, or writes the words the PDP-7 engine reads.
- [`src/korz/pdp7.ts`](src/korz/pdp7.ts): the PDP-7 instruction set, on that host.
- [`src/korz/compile7.ts`](src/korz/compile7.ts): the PDP-7 compiler.
- [`src/korz/iop.ts`](src/korz/iop.ts): the PDP-7 pulse protocol.
- [`src/korz/type340.ts`](src/korz/type340.ts): the Type 340's own instruction set as slots.
- [`src/korz/forth-device.ts`](src/korz/forth-device.ts): Mitch's Forth inner interpreter, 30 primitives and FIND as a device on the same image.
- [`src/korz/m6502.ts`](src/korz/m6502.ts) and [`src/korz/compile65.ts`](src/korz/compile65.ts): the 6502 on the same host, and its compiler.
- [`src/korz/apple2/`](src/korz/apple2/README.md): the Apple ][+ motherboard, language card, Disk II and scanner under it.
- [`src/korz/inspect.ts`](src/korz/inspect.ts): every sea, selector, slot, generated dispatcher and compiled block as one tree, for the page's KORZ browser.

The design document is [KORZ-DISPATCH.md](KORZ-DISPATCH.md). A tour of the source, port by port,
with workshop projects, is [SEA-OF-SLOTS-VOYAGE.md](SEA-OF-SLOTS-VOYAGE.md).

**The sea.**
- **Dimensions** in this stack are finite integer ranges, stored as bitsets. The paper's dimensions
  are partial orders, and a coordinate there need not be an integer.
- **Guards** per dimension are a value, a name, `bits(mask, match)`, `span(start, length)`, or a
  list of these, normalized at install.
- **Specificity** is the product order of per-dimension set inclusion.
- **Ambiguity** is checked at install by enumeration over the overlap, capped at 10⁶ points.
- **Layers** are observe, then patch, then machine, compared before specificity. Within a layer,
  slots are ordered most specific first.
- **`next`** is resend: it calls the rest of that chain.

`why` returns the chain for a context. `view` gathers slots by guard, which gives the subjective
cuts: everything on device 05, everything a given `by` installed, everything DEC didn't build.

**Four dispatch levels, all kept, each tested against the one below:**

1. **`Pdp7`** is switch statements, a TypeScript port of SIMH's PDP-7. It is the reference.
2. **The Korz interpreter** filters a selector's slots, sorts the matches, and calls the chain.
3. **The resolver.**
   - Per selector, it builds a table over only the dimensions that some slot of that selector
     constrains.
   - Equal chains are interned as entries that all have one V8 hidden class.
   - One function per selector is generated with `new Function` (`korz/exec.js` in the debugger),
     with the index computation inlined.
   - `bind` writes those functions into the CPU's dispatch object. An install or remove rebuilds
     the tables of the selectors it touched before it returns, so there is no generation check per
     dispatch.
   - The generated functions and the CPU's slots are shared by every machine in the process; a
     slot reaches its machine through the context. V8 specializes on call targets and hidden
     classes, so a second machine with its own closures ran 25% slower than the first.

   A watch on one 15-bit address turns `read` from a 1-entry table into a 32,768-entry one, and
   removing the watch turns it back.
4. **The compiler** ([KORZ-COMPILER.md](KORZ-COMPILER.md)).
   - Slots carry JavaScript templates. For each instruction word it asks the sea for the chains,
     once, and composes their templates into a basic block built with `new Function`.
   - A chain with a slot that has no template is called through the resolver's dispatcher, so
     every watch and patch keeps working.
   - The cabinet hands it a batch of instructions up to the next device event.
   - A store into a word a block was compiled from invalidates that block.

**The PDP-7 as a sea.** UNIX v0's cabinet has 99 slots. The selectors are `read` and `write`
(with `access` read or fetch), `ea`, `exec`, `skip`, `cc`, `rot`, `iot` and `iop`. Resolved table
sizes:

| Selector | Entries | Distinct chains |
|---|---|---|
| `exec` | 32 | 17 |
| `ea` | 32 | 5 |
| `skip` | 16 | 16 |
| `cc` | 16 | 16 |
| `rot` | 8 | 6 |
| `iot` | 4,096 | 10 |
| `iop` | 2,048 | 22 |
| `read`, `write` | 1 | 1 |

`read` and `write` each have one entry until something guards an address.

**The IOT bus as timed pulses.**
- An IOT fires IOP1, IOP2 and IOP4 in order, each through the `iop` selector, guarded on device
  code, pulse group (bits 060) and which pulse.
- A device gate is one slot.
- A device whose gates read each other's results decodes the whole pulse pattern in one `iot`
  slot instead. That slot is more specific than the device's timed slot, so it wins for exactly
  that pattern.
- A powered-off device is a patch-layer slot on its device codes, so `why` on a dead IOT names the
  power switch.

Every device in the cabinet is on this bus:
- Clock, teletype, paper tape and RB09 disk.
- Type 340 display.
- A Turing machine coprocessor (device 054). It runs a transition table out of PDP-7 core, one
  word per (state, symbol), driven from Forth.
- An Ultimate Machine: the box whose only function is to switch itself off.
- Tiny Titan, a link between machines.
- A file service onto browser storage, and a hand tracker.

Each device keeps its old `iot()` method as the oracle for its slots.

**Testing.** Each level runs in lockstep with the level below it, comparing registers every step:
- 300 seeded random cores at 8K and 32K.
- UNIX v0 booted to its `@` prompt, with an observe-layer watch installed mid-run. The resolver
  rebuilds and keeps agreeing.
- Nine device scenarios driven from Forth and SYMELEC: the Turing engine single-stepped and free
  running, a light-pen drawing sent over the Titan link, Ultimate Machine phase interrupts, and
  others.

Mutation checks confirm the tests notice when one gate is broken. Breaking IDSI, TMSS, TMSR, TMGO,
UMSI, LSF, LLB18, RSB, DBSF, DBLM, RAL or the ION delay each makes a test fail. One gate, TMLA,
survives: the Forth code always follows it with TMST, so no program here can see it. The compiler gets the same treatment: 24 errors planted in its
generated code, of which 23 are caught, one of them by hanging every rig, and the 24th changes
nothing. The whole package has 355
passing tests, and 2 skipped.

**Speed.** UNIX v0 boot, 3 million steps, a new machine each round, Node 26 on an M4 Max. All four
levels end at the same PC.

| Level | Steps/s | ns/step |
|---|---|---|
| `Pdp7` (switch statements) | 92 M | 11 |
| Korz compiler | 189 M | 5 |
| Korz resolver | 34 M | 30 |
| Korz interpreter | 1.3 M | 777 |
| A real PDP-7 | about 0.3 M | 1.75 µs core cycle |

Profiling took the resolver from 105 ns to 46 ns. Four changes did it:
- The index computation moved into generated code that V8 inlines.
- `bind` replaced the per-call generation check.
- Fetch became a coordinate on `read` instead of a second selector.
- Every machine shares the generated functions and the CPU's slots, so V8 sees one set of call
  targets however many machines run.

Then the devices became event-driven. Each one reports how many cycles remain before it does
anything visible, and the cabinet leaves it alone until then, or until an IOT addresses it. That
took the resolver from 46 to 29 ns and `Pdp7` from 30 to 15 ns. The old loop, every device every
cycle, stays as the oracle, run in lockstep against the new one. Moving from Node 20 to 26 then took
`Pdp7` to 11 ns and left the resolver where it was. Even the interpreter, the oracle, runs UNIX at
about four times a real PDP-7.

The 340 can't be left behind that way: drawing, it reads core every cycle and can raise a flag on
any of them. So it runs ahead instead, from a snapshot, holding back what it draws, until it
raises a flag, reaches its one store into core, or is called back. Every core write, from the CPU
or another unit, is announced first; in `KorzPdp7` that is one more slot, an observer on `write`.
A write to a word the 340 read ahead sends it back to the snapshot to replay up to the write. The
`ULTIMATE-HAND` workload (Forth, the 3D turtle, the 340, the DataHand and the Ultimate Machine)
went from 75 to 23 ns a step in `Pdp7` and from 102 to 43 ns in the resolver. It is optimistic
execution with rollback, Time Warp's idea, inside one emulated cabinet, checked against the
every-cycle loop by a rig built to race the 340.

Then the compiler: 5 ns a step on UNIX and 13 on `ULTIMATE-HAND`, against `Pdp7`'s 11 and 21. On
the Turing engine, a unit due every three cycles, it ties `Pdp7` at about 70 ns, because the
batches are three instructions long.

**Two more instruction sets in the PDP-7's cabinet.** The 340 fetches its own instructions from
PDP-7 core, and `KorzType340` decodes them as slots on two dimensions, the mode register and the
word's top two bits: one slot for each thing a word can do, resolved to a table of 32 entries,
tested against `Type340`'s switch on 200 random display files with a light pen wandering over
them. On the hand workload it measured no slower than the switch. Mitch's Forth is the other. The Forth device watches two
instruction fetches on the same image in core: at NEXT it runs the thread itself, colon calls,
constants and 30 primitives on the stacks where the kernel keeps them; at `find` it answers from
a table of names that follows `latest`. A code word it does not know goes back to the CPU as an
instruction. 30,000 passes of `I +` take 890,000 PDP-7 cycles in Mitch's kernel and 107,000 with
the device ([FORTH-DEVICE.md](FORTH-DEVICE.md)). It is differential-tested against the kernel,
and a menu on the page switches between the two.

The device's `read` slot guards the 18-bit address, which would have made a table of 262,144
entries. The resolver now builds a table that large by kinds: values that every guard treats
alike share one entry, and the table has 24.

**The Apple ][.** The 6502 is the second CPU on the host, `Korz6502`: an opcode is three
coordinates, the datasheet's fields `aaa`, `bbb` and `cc`. `exec` holds the operations, a column
per regular one ("LDA" is `cc=alu aaa=5`), a row where the chip decodes by row (the branches, the
flags), and an exact cell for each opcode the fields do not explain; `mode` holds the addressing
cycles and returns the address. The bodies are the switch's own cycles and ALU, and a test runs
every opcode in every flavor against the switch, bus cycle for bus cycle; the switch passes
SingleStepTests `6502/v1` including every bus cycle ([KORZ-INSPECT.md](KORZ-INSPECT.md)). `compile65.ts` compiles straight-line blocks
that still write out every bus cycle, so the scanner and the Disk II see them. The motherboard,
language card, Disk II and scanner run under it in TypeScript; they are not slots yet. In
multiples of a real Apple ][+, Node 20.19 on the same M4 Max, against microM8, a Go emulator
compiled to WebAssembly and the Apple's oracle:

| Workload | switch | compiler | resolver | microM8 (Wasm) | interpreter |
|---|---:|---:|---:|---:|---:|
| `DEX` / `JMP` in RAM | 128× | 150× | 88× | 2.9× | 1.7× |
| DOS 3.3 boot to `]` | 80× | 38× | 70× | 2.5× | 1.9× |
| Applesoft `10 GOTO 10` | 93× | 78× | 68× | 2.9× | 2.1× |

The gap to microM8 is mostly not WebAssembly. microM8 builds its picture inside every
instruction, reaches memory through Go interfaces, and shares one thread with the Go scheduler and
collector; it lands beside the Korz interpreter
([GO-AND-TYPESCRIPT.md](microm8/GO-AND-TYPESCRIPT.md#the-wasm-build-compared-with-the-korz-engines)). The Korz switch runs
near 130 million Apple cycles a second because it is one function over numeric fields with no
allocation in the loop. The compiler leads only where a block stays in RAM and repeats; on the DOS
boot and Applesoft, which are full of `JSR`, `RTS` and indirect jumps that end a block, the switch
leads. The PDP-7 compiler is ahead of its switch; the 6502 compiler is not yet, on a program that
calls ([KORZ-DISPATCH.md](KORZ-DISPATCH.md#the-apple-)). Little Computer People, at max speed
and one picture per game second, measured 88 MHz in Chrome while it loaded.

**The second machine, and what V8 keys on.** In one Node process, a second `KorzPdp7` ran 71–80 ns
a step against the first one's 55, with the same code, program and tables. V8 doesn't specialize on
data; it specializes on the hidden classes of the objects a site touches and on the functions a call
site has called. A call site that has seen one function inlines it. One that sees a second is
megamorphic for good: for calls, V8 keeps one target or gives up, with no small polymorphic set as
Self's PICs keep for receiver maps.

Every machine had its own slots, as JavaScript closures over `this`, its own generated dispatch
functions, and its own stubs that resolved a table on first call. Behavior lived in each instance.
The code V8 optimized while machine 0 ran had machine 0's functions inlined. Machine 1 brought
identical code in different function objects.

The evidence, in order:
- Timing a fresh machine per round showed the drop.
- `--trace-deopt` showed nearly every deoptimization at machine 1's construction as "wrong call
  target", in `step`, `execute`, `operate`, `read`, `write` and the generated dispatchers.
- `--print-bytecode` mapped the offsets to the calls into the dispatchers and, through them, into
  the slots.
- `--trace-turbo-inlining` showed machine 0 inlining dispatchers into `step` and slots into
  dispatchers, which machine 1 lost.

Fixing one layer at a time showed all three were needed:

| Shared across machines | Later machines, ns/step |
|---|---|
| nothing | 71–80 |
| generated dispatchers | 71–80 |
| and the CPU's slots | 62–71 |
| and no stubs: install rebuilds eagerly | 41–46 |

The fix is the split Smalltalk and Self make between shared behavior and per-receiver state. Slot
functions are built once per process. A slot reaches its machine as `c.cpu`, a field of the
context, the same way it reaches the opcode or the device code. With the machine as one more
coordinate, the behavior can be shared.

The costs:
- A burst of separate installs now rebuilds once per install instead of once at the next call.
- A slot pays one extra load to reach its machine.
- A CPU slot may not close over a machine.

Later machines are now faster than the first, which pays for warm-up.

Vanessa Freudenberg built SqueakJS on the same approach: "I'd much rather make the SqueakJS JIT produce
code that the JavaScript JIT can optimize well." The approach requires that a
generator emit the identities and shapes the host JIT keys on, not only the right code. The
host here descends in part from the Self work: maps became hidden classes, and inline caches and
deoptimization came with them.

## Where it goes

**Step 3, the compiler, is built** for the PDP-7, and for the 6502 as straight-line blocks.
On the PDP-7, each compiled block depends on the words it was
compiled from, and a `write` to one of them invalidates the blocks that depend on it: Self's
dependency-driven recompilation at the granularity of core words. Any install or remove
invalidates every block.

We predicted 200–400 M PDP-7 instructions per second for the CPU alone, at about 65% confidence.
UNIX boots at 189 M a second with the cabinet included; the CPU alone was not measured separately.

Next:
- Registers in JavaScript locals across a block, and blocks that call each other without the
  dispatch loop.
- The same templates compiled ahead of time, for ROMs, a fixed Forth kernel and snapshots.
- Idle-loop skipping.

The compiler is the top of the four levels, each checked against the one below, and all four are
kept.

**The 18-bit line.** The PDP-7 has siblings. In Bob Supnik's words, in the SIMH source, the
PDP-4, PDP-7, PDP-9 and PDP-15 are upward compatible: each new model adds architectural features
and, with them, incompatibilities. The PDP-7 has extend mode. The PDP-9 adds user mode and a
bounds register. The PDP-15 adds bank mode and a relocation register. SIMH covers the four in one
simulator, `PDP18B`, and picks the model at compile time. The header says only one should be
defined. The source has 194 conditional-compilation lines, and each model is a separate build.

In Korz the model is a dimension. Slots the whole line shares do not mention it. A slot only one
model has is guarded on that model, and a feature that arrived with the PDP-9 and stayed is
guarded on the PDP-9 and the PDP-15 together. That is the assertions example from the Korz paper:
a new axis, and the code in the middle never mentions it. One sea can be all four machines, and
four of them can run side by side in one browser tab, on the same program, with `why` naming the
slots that make them differ. There is hardware to check the PDP-9 against: Gavin Tersteeg's
homebrew clone, [RDP-9](https://github.com/tergav17/RDP-9), which runs Mitch Bradley's PDP-7 Forth
unchanged.

The PDP-1 is the ancestor and not a member of that dimension. It shares the 18-bit one's-complement
word. Supnik's account is that the PDP-4 cut the instruction set in half, and the PDP-7 inherited
the cut. The PDP-1 keeps its own slots, its Type 30 display and its sequence break. It is not a
guard value on the PDP-7's sea.

**Machines.** The PDP-7 was chosen because it is small.

- **apple2** is the real test, the sibling of pdp-7 at `src/korz/apple2`. Its 6502 runs on every
  level and the page runs on the compiler (above). Its bus as a sea is designed in
  [microm8/PLAN.md](microm8/PLAN.md) and not built. apple1 comes later.
  - Memory configuration as a cube of soft-switch fields.
  - The language card's mapping wins over ROM by being more specific, not by being first.
  - A card in an expansion slot as one transactional set of slots, which is how a Videx, a Saturn
    128K and the RWTS fast-path coexist.
  - The software library is the test corpus.
- **After that**, each instruction set brings its own dimensions:
  - PDP-10 and PDP-11: the processor mode (kernel or user) and the page registers.
  - PDP-11: the addressing modes of each operand.
  - VAX: operand specifiers.
  - Z80: prefix bytes.
  - x86: operating mode, prefix set and ModRM fields.
  - SPARC: register windows.
  - ARM: the condition field and Thumb.

  32-bit address spaces need page sets rather than flat tables; the address normal form in
  KORZ-DISPATCH.md is already a page set.

**What users get.**
- Watches and breakpoints that cost nothing until installed.
- Fault injection as patch slots: a bad sector, a stuck bit, a slow device.
- Host services as devices: PDP-7 Forth reads and writes browser storage through device 024.
- Accelerators that replace a hot ROM routine, guarded on its fetch address, verified in lockstep
  against the original.
- Two machines sharing memory through slots that say so.
- Views that read the 340's display file as instructions, or memory as a bitmap.

`why` answers for every one of them.

**Korz′, the LLM as a second dispatcher.** This is the speculative part, designed in
[moollm/designs/korz](https://github.com/SimHacker/moollm/tree/main/designs/korz). The profiler
measures the guest. Korz′ asks a model to accelerate one hot subroutine at a time, on a 6502, a
PDP-7, or whichever processor fetched it.

- The proposal is a TypeScript function that edits emulator state. It reads the registers and
  memory the call would have read, writes back the registers, flags, and memory the call would
  have left, and returns the exit PC and the cycles the routine took. That is an accelerator's
  `Exit` ([microm8/STACK.md](microm8/STACK.md#accelerators-typescript-in-place-of-a-6502-routine)).
  SWEET16, an Applesoft floating-point routine, the Forth inner interpreter, and a UNIX idle loop
  are the same shape of call.
- It goes into a candidate layer under its own `by` and runs in lockstep against the interpreter
  on recorded traces. The byte hash of the routine guards it, so a patched routine never takes
  the slot.
- If it agrees, it is promoted and the next hottest call can be asked for. On any disagreement,
  it is removed and the interpreter runs that call.

A promoted accelerator is a machine of its own, and Korz′ can measure that machine. The SWEET16
device executes each bytecode as one edit of R0–R15 and memory, in lockstep with the 6502
interpreter at `$F689`. Its program counter is R15. A hot `BS` target in that bytecode is the
next call: Korz′ writes one TypeScript edit of those registers and the memory the bytecode
touches, guarded by the hash of the bytecode, and lockstep runs it against the device. Agreement
promotes it. A mismatch interprets that call as bytecode again. The 6502 remains the oracle
under the device.

The compiler can paste that next call into a block only when the slot carries an `emit` template
and a guard that the bytes are still the ones compiled. That rule is the CPU kit's, and it is the
same on a PDP-7 and a 6502: [KORZ-CPU.md](KORZ-CPU.md#stacking-instruction-sets). XCT is the one
instruction it already pastes. An IOT stays a call.

The compiled basic block is the other accelerator: the compiler derives it, one instruction at a
time. Korz′ writes the coarser one, a whole call whose meaning the model states. Measurement
decides which calls are worth that. The model is never on the hot path, and lockstep raises
confidence without proving equivalence, which is why such slots stay labeled and removable.

**JavaScript, not Wasm, for now.** Vanessa Freudenberg's SqueakJS argument holds here: generate
code that V8's JIT optimizes, and V8 inlines it with the rest of the emulator and the devices.
The one measurement so far is the Apple above, and it is not a fair test of Wasm: a heavy Go
program compiled to Wasm landed beside the Korz interpreter, and a careful switch in JavaScript
ran 32 to 44 times faster than it.

The profile that matters is the guest program's: block counts, branch bias, chains that have only
ever had one shape. Our layers collect that profile and specialize code from it. That could later
feed a Wasm backend, which has fast tiered compilation but little speculation. It is only worth
doing if profiling shows the CPU loop, not the devices, is the limit.

## What we would like your judgment on

1. **Layers before specificity.** The Korz paper lists dimensions that alter the interpreter's
   behavior as future work. We needed watches now: a watch on a whole page must see accesses that
   narrow slots handle. Our answer is a fixed layer order (observe, patch, machine) compared before
   specificity. Should the layer instead be a dimension with its own order, or is a fixed
   stratification the honest answer?
2. **`next` across layers.** `next` calls the rest of a chain that runs across layers. Is that the
   resend you would want, or should resend stay within one layer and crossing layers be explicit?
3. **Install-time ambiguity by enumeration**, capped at a million points, is crude. The guards are
   per-dimension sets, so the leftover set after subtracting more specific slots could be computed
   symbolically. Is there a guard algebra you would trust for this: cubes, BDDs, or Chambers and
   Chen's decision trees?
4. **The resolver as customization.** A table per selector over its relevant dimensions, with chains
   interned and a function generated per selector, reads to us like customization with maps doing
   the work of hidden classes. Where would Self's compiler have gone next? Would it have split by
   context, inlined chains into callers, or kept dependency lists per slot for invalidation the way
   it kept them per map?
5. **Mutable context records.** For speed, a dispatch writes coordinates into a reused context
   record instead of allocating one, and slots write their results (`ac`, `skip`) into it too. Is
   there a semantic hazard here we haven't hit yet, for example a slot that captures its context, or
   a nested send that rebinds a coordinate its caller still reads?
6. **Seeing the sea.** `why` and `view` are text. The page now has two views that only look: SLOTS
   shows the slots behind the next instruction and the next display word, and every sea's slots;
   KORZ is a tree of every sea, selector, slot, generated dispatcher and compiled block, each with
   the JavaScript it became. For Randall in particular: the Alternate Reality Kit made a
   simulation's laws into objects you could pick up and change while it ran, and a patch slot on a
   running machine feels like that. What would a direct-manipulation view of a machine's sea look
   like, Morphic- or Kansas-style, where you grab a slot and the PDP-7 changes under you?
7. **Where does this break?** x86 decode, the Apple's floating bus, cycle-exact video, DMA that
   interleaves with the CPU mid-instruction. Which of these would you expect to defeat
   most-specific-slot dispatch, and which only look like they do?
8. **Identity versus behavior, on a host JIT.** For Alan and Dan in particular. The second-machine
   slowdown came from behavior with identity: each machine's slots were its own closures, so the
   host JIT treated identical code as different code. Smalltalk's answer, methods in the class and
   `self` passed in, fixed it. Korz has no classes, so the receiver became a coordinate.

   SqueakJS did the same thing with memory that this does with dispatch. Squeak objects are plain
   JavaScript objects, and a hybrid scheme "delegat[es] as much work as possible to the JavaScript
   GC". SqueakJS keeps only what the host can't give it, enumeration for `firstInstance` and
   `nextInstance`, in an old-space linked list of survivors rebuilt at full GC. New objects stay
   off the list, so the host collects them alone. What the host sees decides what the host can do:
   listed objects it can't collect, and unlisted ones it collects on its own.

   Korz hands dispatch to V8's JIT the same way, and keeps for itself what V8 can't give: layers,
   `why`, install-time ambiguity, invalidation. The bug was the dispatch version of putting every
   new object on the list: per-machine closures showed V8 identities it should never have seen.

   When a late-bound system runs on someone else's JIT and someone else's collector, which of its
   identities should the host see, and which should it never see? And how much of what Smalltalk's
   VMs learned, from the Deutsch and Schiffman inline caches to SqueakJS, should the emulator
   assume of its host instead of rediscovering it under a profiler?

Don Hopkins, November 2026.

## References

- David Ungar, Harold Ossher and Doug Kimelman. *Korz: Simple, Symmetric, Subjective,
  Context-Oriented Programming*. Onward! 2014.
- David Ungar and Randall B. Smith. *Self: The Power of Simplicity*. OOPSLA 1987.
- Randall B. Smith. *The Alternate Reality Kit: An Animated Environment for Creating Interactive
  Simulations*. IEEE Workshop on Visual Languages, 1986.
- Craig Chambers, David Ungar and Elgin Lee. *An Efficient Implementation of SELF*. OOPSLA 1989.
- Craig Chambers and David Ungar. *Customization: Optimizing Compiler Technology for Self*. PLDI
  1989.
- Urs Hölzle, Craig Chambers and David Ungar. *Optimizing Dynamically-Typed Object-Oriented
  Languages with Polymorphic Inline Caches*. ECOOP 1991.
- Urs Hölzle, Craig Chambers and David Ungar. *Debugging Optimized Code with Dynamic
  Deoptimization*. PLDI 1992.
- L. Peter Deutsch and Allan M. Schiffman. *Efficient Implementation of the Smalltalk-80 System*.
  POPL 1984.
- Vanessa Freudenberg, Dan Ingalls, Tim Felgentreff, Tobias Pape and Robert Hirschfeld. *SqueakJS:
  A Modern and Practical Smalltalk That Runs in Any Browser*. DLS 2014; DLS Most Notable Paper,
  2024. Section 2.3 is the hybrid GC.
  ([memorial edition](../../characters/vanessa-freudenberg/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf))
- Vanessa Freudenberg, on generating JavaScript for the host JIT,
  [Hacker News 38774277](https://news.ycombinator.com/item?id=38774277), December 2023.
- Craig Chambers and Weimin Chen. *Efficient Multiple and Predicate Dispatching*. OOPSLA 1999.
- Michael Ernst, Craig Kaplan and Craig Chambers. *Predicate Dispatching: A Unified Theory of
  Dispatch*. ECOOP 1998.
- Bob Supnik and the Open SIMH authors. SIMH, and the 18-bit family in `PDP18B`
  (`pdp18b_cpu.c`), one simulator compiled four ways. The PDP-7 CPU semantics here are ported
  from that file. *Writing a Simulator for the SIMH System* records the MIMIC lineage: Len
  Fehskens, Mike McCarthy and Supnik.
- Lars Brinkhoff. The PDP-7 Type 340 glue (`PDP18B/pdp18b_dpy.c`), and the Type 342 glyph table
  in `display/type340.c`, recovered frame by frame from MIT AI Lab film, with gaps filled from
  the Knight TV font. When PIXIE draws text, those are the strokes.
- Philip Budne and Douglas Gwyn. The XY display core (`display/`), where a light pen hits if it
  is near the last intensified point.
- April and Melody Ayres-Griffiths. microM8, whose "upcycling" is the attitude of the
  [manifesto](MANIFESTO.md): run the machine faithfully, then give it what it never had.
