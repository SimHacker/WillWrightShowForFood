# Compiling the PDP-7's sea

The fourth dispatch level. `new KorzPdp7({ korz: "compile" })` turns runs of PDP-7 instructions
into JavaScript functions, built from the same sea of slots the resolver and the interpreter
dispatch through, and runs them until a device is due. The levels below it stay, and each is the
oracle for the one above:

| Level | Where | What decides what runs |
|---|---|---|
| `Pdp7` | [`src/plugins/pdp7.ts`](src/plugins/pdp7.ts) | switch statements, decoded every instruction |
| Korz interpreter | [`src/korz/korz.ts`](src/korz/korz.ts) | the sea, searched every dispatch |
| Korz resolver | the same | tables indexed by the bits each selector looks at |
| Korz compiler | [`src/korz/compile7.ts`](src/korz/compile7.ts) | the chains for each instruction word, looked up once, inlined |

The design of the sea, the resolver and the cabinet's event-driven backplane is in
[KORZ-DISPATCH.md](KORZ-DISPATCH.md). This document is the compiler's design and its record.

## What it has to beat

On UNIX v0, `Pdp7` makes a step in 11 ns and the resolver in 29 (Node 26, M4 Max). A resolver
step is five to eight indirect calls through a context object: fetch, `ea`, `exec`, the operand
read or write, and `skip`, `cc` and `rot` for OPR. Each lands on a call site that has seen every
slot of its selector, so V8 inlines none of them. `Pdp7` decodes every instruction every time it
runs it. A compiled block decodes once, when it is built, and its code contains no dispatch at all
where the sea has nothing to say.

Then there is the backplane. `Cabinet.run` calls `cpu.step()` once per cycle, sets the interrupt
line, checks whether a device is due, and counts the cycle, and `Pdp7`'s 11 ns include that loop.
A compiled CPU has to run many instructions per call or the loop limits it as it limits `Pdp7`.

## The batch contract

Between device events nothing outside the CPU changes: the event-driven backplane ticks no unit,
and the interrupt line, the OR of the units' flags, is only recomputed when a unit is serviced. So
the cabinet can hand the CPU a budget instead of a cycle.

```ts
/** The backplane's clock as a CPU running a batch sees it. */
type Clock = { cycles: number; readonly next: number; readonly until: number };

interface Cpu {
  /** Run instructions from `clock.cycles`; return the last one's result with its cycle uncounted. */
  runBatch?(clock: Clock): Step;
}
```

`next` is the cycle the earliest unit is due at; `until` is where the current `run` or `step`
stops. The CPU runs the instruction at cycle c, and then:

- if it halted or handed out an IOT, it returns that result, with `cycles` still c;
- if c + 1 reaches `next` or `until`, it returns, with `cycles` still c;
- otherwise it sets `cycles` to c + 1 and runs the next instruction.

The cabinet finishes the last instruction exactly as it finishes a `step()`: it dispatches a
handed-out IOT, services the units if c + 1 reached `next`, and counts the cycle. So a batch of one
instruction is a `step()`, and the cabinet's `step()` is a batch whose `until` is one cycle away.

`next` can come closer during a batch, and the CPU reads it after every instruction:

- An IOT brings its unit up to date first (`Backplane.sync`) and reschedules it for the next
  cycle.
- A core write that conflicts with what the 340 read ahead brings the 340 back and reschedules it.

Either way the batch stops after that instruction and the cabinet services the unit before the
next one, as it does now. `cycles` is the cabinet's own field, kept current per instruction,
because the write watch and `sync` read it to decide which cycle a unit is brought back to.

## Blocks

A block is compiled the first time the CPU reaches an address with no valid block. It starts at that
address and follows the program:

- **Straight-line code** is compiled in order.
- **A JMP to a known address** continues the block at the target, unless the target is already in
  the block: then the block jumps back to its own start as a JavaScript loop, or ends there if
  the target is somewhere else in it.
- **A JMS to a known address** stores the return word and continues at the subroutine's second
  word.
- **A skip** (SAD, ISZ, an IOT's skip, OPR's skip field) compiles the next word inside
  `if (!skip)`, provided that word is an inlined instruction that doesn't skip or halt. If that
  word falls through, both paths meet at the word after it and the block goes on there. If it
  jumps, `ISZ COUNT; JMP LOOP` or `SZA; JMP OUT`, the block leaves for the word after it: that word
  is reached only by skipping, and is often data, a JMS link or a constant. Otherwise the block
  ends at the skip.
- **An indirect JMP or JMS, XCT, EAE's multiply and divide**, whose next address is known only
  when they run, end the block at it.
- **A halt** ends it.
- **An instruction the compiler can't inline** (below) runs through `execute`, the resolver's own
  path, and ends the block.
- **A fetch that something watches** ends the block before that instruction, which the resolver
  then steps.
- **64 instructions** end it.

The block is a function of the CPU and the clock, built with `new Function` and named
`korz7/blk-<octal address>.js` for the profiler and the debugger. After each instruction it does
the clock check above. It returns 1 when the batch must stop, with `pc` stored, and 0 when it has
counted its last cycle and set `pc` to wherever control went. A dispatch loop in `runBatch` looks up
the block at `pc` and calls it.

**Entry conditions.** A block runs only if no interrupt can be taken anywhere inside it: interrupts
off or the line low, the ION delay done, no trace recording fetches, not halted. Otherwise the
resolver steps one instruction. Inside a block only an IOT or an XCT can change those: the line is fixed
for the batch, and both are compiled with a recheck. Before counting the cycle the block returns
if the CPU halted or handed the IOT out; after it, it returns to the dispatch loop if the ION delay
started, the line is up with interrupts on, or the block was invalidated. ION, IOF and the device
IOTs run inline and the block goes on when nothing changed.

## Templates live on the slots

A slot may carry `emit`, a template for its behavior as JavaScript source. The sea carries it and
never looks at it; only this compiler reads it. The compiler asks the interpreter's `chain` for each
selector at the instruction's coordinates. That happens once per block, at build time. If every
slot in the chain has a template, the templates are composed: a template that returns `next: true`
is an observe slot, whose code goes before the rest of the chain's, and the last one is the
behavior. The 340's write watch is such a slot: a store becomes `m.writeWatch(a)` followed by the
store into core, inline. If any slot in the chain has no template, the code calls the dispatcher,
as the resolver would:

| Selector | Coordinates known when compiling | Inlined when | Otherwise |
|---|---|---|---|
| `read`, fetch | `addr` = the instruction's address | the chain is the core slot | the block ends before it |
| `read`, data | `addr` if the address is direct | every slot in the chain has a template (for a computed address: in the chain for every address) | `m.read(a)` |
| `write` | the same | the same, on `write` | `m.write(a, v)` |
| `ea` | `op`, `ind` | direct, indirect, auto-index, JMP I with EMIR, CAL, CAL I | the instruction runs through `execute` |
| `exec` | `op`, `ind` | every opcode | the same |
| `iot` | `device`, `pulse` | never: the template calls the IOT dispatcher with the coordinates filled in | |
| `skip`, `cc`, `rot` | the three OPR fields | every combination but the undefined rotates | the same |

Every other installed slot keeps working. A watch on a fetch address is in the fetch chain, so that
instruction is stepped by the resolver and the watch sees it. A watch on a data address puts a call
in each block that reads that word directly. The cabinet's write watch for the 340, an observe slot
on `write`, makes every store a call. A patch slot on an opcode makes that opcode go through
`execute`. Nothing is special-cased: what the sea says at build time is what the block does.

## Invalidation, per word

PDP-7 code writes into itself all the time. JMS stores the return address in the subroutine's first
word, the auto-index registers sit in core next to the code, and programs of the period rewrite
their own instructions. A block depends on the exact words it was compiled from:

- Each word a block was compiled from is marked in a byte map the size of core, and listed with the
  blocks that used it.
- The `write` slot that stores into core checks the mark, and on a marked word marks those blocks
  invalid and forgets them. The check belongs to the store: a patch slot that makes a word read-only
  stores nothing and invalidates nothing.
- JMS's link word is never executed, so a block starts at the word after it, and calling a
  subroutine invalidates nothing.
- A block that stores into its own words, or calls out to a store that does, checks its own
  `valid` after that instruction and leaves.
- An install or remove on the sea marks every block invalid. A reset clears core, so it does too.

## XCT

XCT executes a word known only when it runs. Forth's NEXT is `XCT I 10`, so the inner interpreter
of every Forth program here is an XCT. Each compiled XCT keeps a map from address to cell: the word
found there, compiled as one instruction that sets `pc` to wherever control goes. Before running a
cell the XCT compares the word in core with the cell's word and rebuilds the cell if they differ,
so cells need no invalidation. An XCT of an XCT goes through `execute`, which counts the chain
against the PDP-7's limit.

## Threaded code (planned)

Not built. Mitch's Forth makes every thread cell a PDP-7 instruction (`CAL` for a colon word,
`JMP` for a primitive, `LAC` for a constant, `LAW` for a variable), and NEXT is `XCT I 10`. So a
colon definition is a run of instructions reached through register 10 instead of `pc`, and the
compiler can treat it as a block:

- **A thread slot.** The Forth loader installs a slot on `exec`, guarded on the word `XCT I 10`,
  whose template marks the instruction as a thread step. With it installed, the compiler follows
  threads; without it, XCT compiles as it does now. The compiler knows nothing about Forth.
- **Thread blocks.** Starting at the cell register 10 points at, compile each cell inline, with
  register 10's advance as a constant per cell, and end at a cell that changes control: a branch,
  `EXIT`, or a `CAL` into another colon word. Register 10 is stored when the block leaves.
- **Calls between thread blocks** are the same item as blocks calling each other directly.
- **Invalidation** is per word, as for any block: a store into a thread's cells throws its block
  away.
- **Ahead of time.** A kernel that never rewrites itself can be compiled at load time.
- **Prior art.** Piumarta and Riccardi, "Optimizing direct threaded code by selective inlining"
  (PLDI 1998); Ertl and Gregg's dynamic superinstructions.

It waits on a measurement, like everything in this section: in ULTIMATE-HAND, NEXT leaving its
block once per Forth word is the cost to measure first. The same slot shape covers Sweet 16 on
the Apple ][: its opcodes as slots, installed by whoever enters it.

## The accessors

The devices' DMA, the cabinet and the tests reach core through `m.read` and `m.write`. The
compiler builds both from the same chains, for every address: with only the core slot and the write
watch installed, `m.write` is the watch call and the store, with the invalidation check. If a slot
guards on an address or has no template, they are the dispatchers. The functions are shared by every machine in the
process with the same source and reach their machine as `this`; with a closure per machine, the
devices' call sites saw a new function for each machine, and later machines ran 18% slower.

## What runs where

The generated code reads and writes the CPU's fields (`m.ac`, `m.link`, `m.pc`) as the slots do, so
an instruction compiled inline and one stepped by the resolver leave the same state. `pc` is
stored when a block leaves and before every call out. A template that can throw (none can, for
inlined instructions) would need it stored first, so that an error leaves the machine where the
resolver would.

Not in this first version: registers in JavaScript locals across a block, blocks calling each other
without the dispatch loop, and compiling ahead of time (the Forth kernel, ROMs). Each comes after a
measurement says the dispatch loop or the field traffic is what costs. For the Turing engine
neither does: the cost there is a batch every 3 instructions.

## Testing

The compiler is tested against `Pdp7` the way the resolver was, plus what batching adds:

- **Random cores**, 300 seeds at 8K and 32K, step by step: each `step()` is a batch of one, so a
  block is entered at every address. Then the same cores in batches of random length with no
  backplane, comparing registers after each batch and core at the end. Random words are dense in
  self-modifying stores, auto-indexing and skips into data.
- **UNIX v0** booted to the shell prompt in slices of random length against `Pdp7` ticking every
  unit every cycle, with the fetch watch on 1065 installed and removed mid-run.
- **Every device rig** in `devices.test.ts`, at the compiled level, in slices of random length:
  SYMELEC, the paper tape and DataHand interrupt rigs, the Ultimate Machine, the 340 race, the
  Turing engine, titan-files and the rest.
- **Watches and patches**: random cores with observe slots on reads and writes of 0–777 and a
  patch slot on LAW, compiled and resolved, comparing what each slot saw after every batch.
- **Hand programs** for what random words almost never do: a loop that rewrites the instruction it
  runs next, by DAC and by DAC I, with and without a write watch; EMIR followed by JMP I through a
  pointer with the extend bit clear and set.

Planted errors, each put into the compiled JavaScript and run against the compiled-level tests:

| Error | Caught by |
|---|---|
| a skip that doesn't skip; ISZ skipping on 1 | device rigs |
| a compiled store that doesn't invalidate; `touch` leaving the block valid; no self-check after a store | UNIX, Ultimate Machine, SYMELEC over the Titan link |
| the `write` slot's own store not invalidating (the path when another slot has no template) | the self-rewriting loop |
| a batch ignoring `next`; one cycle late against `next`; one cycle late against `until` | device rigs |
| a block entered with the ION delay pending, or with the line up and interrupts on | device rigs |
| the fetch watch ignored | UNIX with its watch on 1065 |
| a slot without a template skipped in a chain; an observe template dropped; the write watch dropped | random cores; the 340 race |
| auto-index dropped; CAL to 21 | ULTIMATE-HAND, the DataHand rigs |
| EMIR's restore dropped | the EMIR program |
| an XCT cell not checked against core | the Turing engine, the Ultimate Machine |
| the IOT's recheck dropped | the DataHand interrupt rig |
| the IOT's halt and hand-out check dropped | every rig hangs |
| JMS saving its own address; a cell's skip ignored | device rigs; random cores |

One planted error is caught by nothing because it changes nothing: a block ending at HLT that
returns 0 instead of 1 goes back to the dispatch loop, which finds the CPU halted and returns the
halt from the resolver.

## Results

Node 26, Apple M4 Max, `scripts/korz-bench.mjs`, ns per instruction including the cabinet, with
every level ending in the same state:

| Workload | `Pdp7` | compiled | resolver | interpreter |
|---|---|---|---|---|
| UNIX v0 boot, 3M instructions | 11 | 5 | 30 | 777 |
| ULTIMATE-HAND, 10M | 21 | 13 | 44 | 763 |
| Turing engine running free, 5M | 67 | 71 | 118 | 1211 |

On the UNIX boot batches average 74 instructions; over 2M instructions 942 blocks are built and
685 invalidated, by UNIX's own stores into its code. ULTIMATE-HAND's batches run thousands of
instructions, and Forth's NEXT, an XCT I, leaves its block for the dispatch loop once per Forth
word. The Turing engine is a unit due every few cycles, so its batches average 3 instructions and
the cabinet's loop costs what it costs `Pdp7`.

