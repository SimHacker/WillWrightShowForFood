# Korz for machines: a note asking for feedback

For David Ungar, Randall Smith, and others whose work this rests on. A draft: corrections welcome
at any level, from "that's not what Korz means" to "you'll regret that data structure".

## The idea

An emulator is a dispatcher with small, finite, fully known coordinates: address, read or write or
fetch, who is on the bus, opcode bits, device code, IOT pulse, memory configuration. Emulators
encode that dispatch by hand in switch statements and page tables. A plugin that wants to change one
address has to find the right place to patch it, and a debugger that wants to watch one has to be
built into the emulator.

We put every handler, mapping, opcode, IOT gate, trap, watch, fault and accelerator into one Korz
sea of guarded slots, and dispatch each access to the most specific match. Because the domains are
finite and every context is complete, two things Korz in general cannot do become possible:

- **Ambiguity is decided at install time**, by set arithmetic on the guards. Installs are
  transactional, so a card can bring the slot that resolves its own overlaps.
- **The sea resolves ahead of time** into the arrays a hand-written emulator would use. It is then
  compiled, with the dispatch folded into generated code.

The aspiration is a way of building emulators in general, for every machine SIMH covers and more,
and taking it further than SIMH can. SIMH and its ports serve as the oracle. Instrumentation,
extension and optimization are all the same operation: install a slot. `why` on any access names
the slots that answered it and who installed them.

## What is built

All of this is in TypeScript in this package, and runs in Node and the browser:

- [`src/korz/korz.ts`](src/korz/korz.ts), 490 lines: the sea.
- [`src/korz/pdp7.ts`](src/korz/pdp7.ts), 330 lines: the PDP-7 as slots.
- [`src/korz/iop.ts`](src/korz/iop.ts): the device bus.

The design document is [KORZ-DISPATCH.md](KORZ-DISPATCH.md).

**The sea.**
- **Dimensions** are finite and stored as bitsets per dimension.
- **Guards** per dimension are a value, a name, `bits(mask, match)`, `span(start, length)`, or a
  list of these, normalized at install.
- **Specificity** is the product order of per-dimension set inclusion.
- **Ambiguity** is checked at install by enumeration over the overlap, capped at 10⁶ points.
- **Layers** are observe, then patch, then machine, compared before specificity. Within a layer,
  slots are ordered most specific first.
- **`next`** is resend: it calls the rest of that chain.

`why` returns the chain for a context. `view` gathers slots by guard, which gives the subjective
cuts: everything on device 05, everything a given `by` installed, everything DEC didn't build.

**Three dispatch levels, all kept, each tested against the one below:**

1. **`Pdp7`** is switch statements, a TypeScript port of SIMH's PDP-7. It is the reference.
2. **The Korz interpreter** filters a selector's slots, sorts the matches, and calls the chain.
3. **The resolver.**
   - Per selector, it builds a table over only the dimensions that some slot of that selector
     constrains.
   - Equal chains are interned as entries that all have one V8 hidden class.
   - One function per selector is generated with `new Function` (`korz/exec.js` in the debugger),
     with the index computation inlined.
   - `bind` writes those functions into the CPU's dispatch object. An install or remove swaps
     them back to stubs that rebuild on their next call, so there is no generation check per
     dispatch.

   A watch on one 15-bit address turns `read` from a 1-entry table into a 32,768-entry one, and
   removing the watch turns it back.

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
survives: the Forth code always follows it with TMST, so no program here can see it. We report
that rather than paper over it. The whole package has 269 tests.

**Speed.** UNIX v0 boot, 3 million steps, Node 20 on an M4 Max, best of three. All three levels end
at the same PC.

| Level | Steps/s | ns/step |
|---|---|---|
| `Pdp7` (switch statements) | 33 M | 30 |
| Korz resolver | 17.5 M | 57 |
| Korz interpreter | 1.1 M | 900 |
| A real PDP-7 | about 0.3 M | 1.75 µs core cycle |

Profiling took the resolver from 105 ns to 57 ns. Three changes did it:
- The index computation moved into generated code that V8 inlines.
- `bind` replaced the per-call generation check.
- Fetch became a coordinate on `read` instead of a second selector.

About 20 ns of each step is the cabinet ticking its devices, a cost `Pdp7` pays too. Even the
interpreter, the oracle, runs UNIX at about 3.7 times a real PDP-7.

## Where it goes

**Step 3, a compiler.** It generates JavaScript basic blocks from the resolved tables:
- The `exec`, `ea` and `skip` chains for each instruction word are folded in as constants.
- Each compiled block depends on the words it was compiled from. A `write` to a compiled word
  invalidates the blocks that depend on it, which is Self's dependency-driven recompilation at the
  granularity of core words.
- An install or remove that changes a resolved chain invalidates every block that used it.

The same templates serve the JIT (hot blocks at run time) and AOT (ROMs, a fixed Forth kernel,
snapshots).

Our predictions:
- 200–400 M PDP-7 instructions per second for the CPU alone, at about 65% confidence.
- Capped near 40 M while devices tick every step, which is why event-driven devices (`nextEvent`)
  come first.
- After that, idle-loop skipping and block chaining.

The point is not only speed. The compiler is the third level of an oracle ladder, and every level
stays.

**Machines.** The PDP-7 was chosen because it is small.

- **The Apple II** is the real test, already designed in [microm8/PLAN.md](microm8/PLAN.md):
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
[moollm/designs/korz](https://github.com/SimHacker/moollm/tree/main/designs/korz):

- A language model proposes slots for regions the profiler finds hot: an accelerator for UNIX's
  idle loop, or for the Forth inner interpreter.
- A proposal goes into a candidate layer under its own `by` and runs in lockstep against the
  oracle on recorded traces.
- If it agrees, it is promoted; on any disagreement, it is removed.

This is crystallization and deoptimization, with meanings in place of types. The model is never on
the hot path, and lockstep raises confidence without proving equivalence, which is why such slots
stay labeled and removable.

**JavaScript, not Wasm, for now.** Vanessa Freudenberg's SqueakJS argument holds here: generate
code that V8's JIT optimizes, and V8 inlines it with the rest of the emulator and the devices.

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
6. **Seeing the sea.** `why` and `view` are text. For Randall in particular: the Alternate Reality
   Kit made a simulation's laws into objects you could pick up and change while it ran, and a
   patch slot on a running machine feels like that. What would a direct-manipulation view of a
   machine's sea look like, Morphic- or Kansas-style, where you grab a slot and the PDP-7 changes
   under you?
7. **Where does this break?** x86 decode, the Apple's floating bus, cycle-exact video, DMA that
   interleaves with the CPU mid-instruction. Which of these would you expect to defeat
   most-specific-slot dispatch, and which only look like they do?

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
- Craig Chambers and Weimin Chen. *Efficient Multiple and Predicate Dispatching*. OOPSLA 1999.
- Michael Ernst, Craig Kaplan and Craig Chambers. *Predicate Dispatching: A Unified Theory of
  Dispatch*. ECOOP 1998.
- Bob Supnik et al. SIMH, the PDP-7 simulator (`PDP18B`).
