# Korz dispatch for emulators, in TypeScript

Step 1 is built, for the PDP-7: the interpreter in [`src/korz/korz.ts`](src/korz/korz.ts) and the
PDP-7 on it in [`src/korz/pdp7.ts`](src/korz/pdp7.ts), tested against `Pdp7`
([the PDP-7 first](#the-pdp-7-first)). The rest is design.

Everything a machine does on its bus is a lookup on a few small bit fields: which address, read or
write, who is asking, which memory configuration, which opcode. Emulators usually spread that
lookup over `if` chains, switch statements and page tables written by hand, and a plugin that wants
to change one address has to find the right place to patch. This design puts every handler, mapping,
soft switch, opcode, trap, accelerator and watch into one sea of guarded slots, in the manner of Korz
(David Ungar, Harold Ossher and Doug Kimelman, *Korz: Simple, Symmetric, Subjective,
Context-Oriented Programming*, Onward! 2014), and dispatches each access to the most specific slot
that matches.

The domains are finite and small (16 address bits, 8 opcode bits, a few enums, a configuration word),
so unlike Korz in general, the whole dispatch can be resolved ahead of time into the arrays a fast
emulator would use anyway, and then compiled to JavaScript. The order of work:

1. **An interpreter.** Linear search over the sea, the specificity rule, the ambiguity check. Slow
   and obviously right. It stays as the oracle and as the engine behind `why`.
2. **A resolver.** The same answers as tables: page tables, 256-entry handler arrays, opcode
   tables, cached per configuration. No code generation.
3. **A compiler.** JavaScript generated from the resolved tables: per-page dispatch functions first,
   then 6502 basic blocks with the dispatch folded in.

Each step is tested against the one before it on the same inputs. The Apple ][ examples, including
the language card, the Saturn 128K and the Videx, are in
[microm8/STACK.md](microm8/STACK.md#dispatch-guarded-slots-resolved-ahead-of-time). Notes on Korz
itself, and on what Self's and Julia's compilers suggest for it, are in
[moollm/designs/korz](https://github.com/SimHacker/moollm/blob/main/designs/korz/korz-notes.md).

No language, parser or virtual machine: slots are TypeScript objects, handlers are TypeScript
functions, and the generated code is plain JavaScript.

**Words.** "Slot" alone always means a Korz slot. The Apple's eight card connectors are **expansion
slots**, always written that way, in prose and in code (`expansionSlots[6]`, a parameter `n`, never
`slot`). Running machines have no slots of their own: each is an object in the cabinet's array of
machines. microM8's eight "VM slots" and its identifiers (`SlotCard`, `SW_SLOTC3ROM`) are named only
when describing microM8.

## The model

- A **dimension** is a named coordinate with a finite domain: `addr` (0–`$FFFF`), `access` (read,
  write, fetch), `who` (cpu, video, dma, debugger), `op` (0–255), `machine`, `variant`, the fields of
  the configuration word, and `value` (the byte on the bus).
- A **context** is a point: one value for every dimension. An emulator always knows every
  coordinate of an access, so contexts are complete. Korz's bare-name guard stance ("present, any
  value") is the same as unmentioned here.
- A **guard** is a set of points, written per dimension. An unmentioned dimension is the whole
  domain.
- A **slot** is a guard, a selector, a layer, a behavior and a `by` naming who installed it.
- A **selector** is the message being dispatched: `bus` for memory accesses, `mode` and `operation`
  for building the opcode table, `fetch` for traps and accelerators. Slots only compete with slots
  of the same selector.
- The **sea** is the set of all installed slots. Adding and removing slots is the only way behavior
  changes.

```ts
type Slot = {
  selector: "bus" | "fetch" | "mode" | "operation" | string;
  guard: Guard;
  layer: "observe" | "patch" | "machine";
  by: string;
} & (
  | { run(c: Context, next: Next): number | void }     // opaque handler
  | { kind: StandardKind; params: object }            // a standard slot the resolver and compiler understand
);
```

`selector` defaults to `bus` (or `fetch` for a guard with `access: "fetch"`) and `layer` to
`machine`, which is how the examples in STACK.md are written.

### Dimension kinds and their sets

Guards are written in whatever form fits (masks, spans, lists, names) and normalized at install time
to one set representation per dimension kind. All of specificity, ambiguity, intersection and the
views below are set operations on these forms; the written form never matters after install.

| Kind | Dimensions | Written as | Normal form |
|---|---|---|---|
| Address | `addr` (16 bits on the Apple, 18 on the PDP-7) | `Bits` (mask, match), `Span` (start, length), lists of either | a page set: per 256-word page, empty, full, or a 256-bit mask |
| Byte | `op`, `value` | `Bits`, a list of values | a 256-bit set |
| Enum | `access`, `who`, `machine`, `variant`, `selector` | a name or a list of names | a bit per member |
| Configuration | the configuration word's named fields | `cfg({ lcRead: 1, lcBank2: 0 })` | a cube: some fields fixed, the rest free |

The page set is exact and cheap. A `Bits` guard with mask `$FFF0` touches one page and becomes a
256-bit mask there; a 4K span becomes 16 full pages. Inclusion, intersection and emptiness work page
by page, and full or empty pages short-circuit. The worst case, a mask that ignores high address bits
(an odd-addresses-only watch), is 256 masks of 32 bytes: 8 KB, once, at install.

A configuration guard is a single cube, not a union. Inclusion of cubes is a field comparison, while
inclusion of unions of cubes is a satisfiability problem. A slot that needs two configurations is two
slots.

### Specificity

Guard A is at least as specific as B (A ≤ B) when A's set is contained in B's on every dimension. A
is more specific (A < B) when A ≤ B and they differ on some dimension. This is the product of the
per-dimension inclusion orders, a partial order.

For a context, the matching slots of a selector and layer are those whose guards contain it. The
**most specific** is the one that is ≤ all the others. If no single slot is, the dispatch is
**ambiguous**, which is an error. Korz makes the same rule, and so do Cecil and predicate dispatch
(Michael Ernst, Craig Kaplan and Craig Chambers, *Predicate Dispatching: A Unified Theory of
Dispatch*, ECOOP 1998).

Two slots with equal guards, the same selector and the same layer are a conflict unless they have
the same `by`, in which case the new one replaces the old one (hot reload).

**Ambiguity is found at install, not at run time.** Slots A and B, overlapping and incomparable,
are ambiguous on their intersection I = A ∩ B unless more specific slots cover all of I. The
check: for each slot already in the sea that overlaps the new one, compute I; if neither guard
contains the other, subtract from I every slot ≤ both; anything left is a set of contexts where
dispatch would fail. The error names both slots' `by` and prints the leftover set. Two cards
configured into expansion slot 3 give "videx 6845 and super serial registers: equal guards on `$C0B0–$C0BF`";
a plugin's handler that half-overlaps a card's gives the half. A whole card's slots install as one
transaction, so a card can bring the slot that resolves its own overlaps.

### Layers and `next`

Specificity alone can't express a watch. A debugger watch on the whole `$C0xx` page is less specific
than every soft switch, so it would never run. The Korz paper lists "dimensions that alter the
behavior of the interpreter, such as handling failure or ambiguity" as future work; an emulator
needs a fixed answer now.

The **layer** is compared before specificity. The chain for a context is the matching slots of the
`observe` layer, then `patch`, then `machine`, each layer's slots ordered most specific first.
Dispatch calls the first slot in the chain with `next`, a function that calls the rest of the chain:
Self's resend, CLOS's `call-next-method`.

- **observe**: watches, breakpoints, counters, profilers, the writer overlay. They call `next` and
  return its value. The layer exists so a broad watch sees accesses that narrow machine slots
  handle.
- **patch**: plugins, accelerators, the debugger's side-effect-free peek. They usually don't call
  `next`; when they do, they wrap.
- **machine**: the motherboard and the cards, competing by specificity. The language card's mapping
  wins over the ROM's because its guard is narrower, not because of its layer.

Within a layer, `next` from slot S goes to the most specific matching slot that S is strictly more
specific than. The base case slot (the floating bus) has no `next`. If the slots above S at some
context have no unique minimum, `next` is ambiguous there; the resolver reports it as a warning
against S, and calling it at run time throws with the same message.

### The context object

One mutable object per bus, created once, every field present, numbers staying numbers, so V8 keeps
one hidden class for it and the dispatch code stays monomorphic:

```ts
type Context = {
  selector: number; access: number; who: number; addr: number; value: number;
  op: number; cycle: number; config: number;
  floatingBus(): number;       // the byte the video scanner fetches on this cycle
};
```

The dispatcher writes the coordinates in and calls the chain. A handler reads what it needs. No
allocation per access.

## Step 1: the interpreter

```ts
function dispatch(sea: Sea, c: Context): number {
  const chain = sea.slots
    .filter((s) => s.selector === c.selector && contains(s.guard, c))
    .sort(byLayerThenSpecificity);                       // throws on ambiguity, naming both slots
  const call = (i: number): number =>
    i < chain.length ? (chain[i].run(c, () => call(i + 1)) ?? 0) : missing(c);
  return call(0);
}
```

`contains` tests the context against each dimension's normal form: a bit test in a page mask, a bit
test in a 256-bit set, a member bit, a cube match. `byLayerThenSpecificity` compares layers, then
uses ≤ between guards. Order is a topological sort of a partial order; a matching set without a
unique minimum per layer is the ambiguity error.

That is the whole semantics. The interpreter runs a whole Apple, slowly. Everything later is an
optimization of this function and is tested against it.

**`why(c)`** is the interpreter with its working shown: every slot of the selector, whether it
matched, and if it lost, why ("matches, less specific on `addr`"; "doesn't match on `config.lcRead`");
then the chain as it ran. It is what the debugger shows for "who handles `$C08B` right now".

**Views** are the same set machinery with a guard as the query: everything that intersects
`{ addr: page $C0 }`; everything expansion slot 6's card installed (`by` prefix); everything that applies to
the //e and not the ][+ (intersects `machine: apple2e`, disjoint from `machine: apple2plus`). The
plugin list, the teaching graph's `drives` and `decodes` links and the memory map panel read views.

## Step 2: the resolver

The resolver computes the interpreter's answer for every context in advance, grouped so that the
fast path is an array index. It works by partial evaluation, one group of dimensions at a time.

**Static dimensions: one table set per configuration.** `machine` and `variant` are fixed while a
machine runs; the configuration word changes only when a soft switch changes banking. The resolver
takes the sea restricted to one static point (drop slots whose static guards miss it, drop the
static dimensions from the rest) and builds a **table set** from that. Table sets are cached by key
(machine, variant, configuration word). A banking switch looks up the key and swaps table sets, the
way the hardware switches its decoders. The language card has a handful of configurations, a //e with
aux memory more; the count real programs reach is measured, and the cache is bounded by it.

**Table dimensions: page tables.** For each `access` and `who`, a 256-entry page table. For each
page, the resolver collects the slots whose address sets touch it, then:

- **Direct page.** One mapping slot covers the whole page and nothing else touches it in any layer:
  the entry is `{ bank, offset }`, and a read is `bank[offset + (addr & 0xff)]`. This is RAM and ROM,
  the common case.
- **Uniform page.** Every slot touching the page covers all of it: one chain for the page.
- **Split page.** A 256-entry array of chains. The I/O page, a page with a watch on some bytes.

Chains are interned, so the 16 addresses of the speaker share one chain object and comparing chains
is comparing references. `who: "cpu"` tables are built eagerly; the debugger's and the video
scanner's on first use.

**Residual dimensions: checked at run time.** A slot guarded on `value` (a watch for writes of `$00`
to a switch) can't be resolved by address. Its chain entry keeps a short test on the residual
dimension in front of the slot. **Dimension relevance:** a dimension that no slot of a selector
constrains is dropped from that selector's tables entirely, so `value` costs nothing until someone
guards on it.

**The opcode table: two selectors, composed.** The 6502 decodes `aaabbbcc`: `cc` picks the group,
`aaa` the operation, `bbb` the addressing mode. `operation` slots guard on `aaa` and `cc`, `mode`
slots on `bbb` and `cc`, and the opcode table entry for an opcode is its resolved operation applied
through its resolved mode. Irregular opcodes are exact slots (`op: bits(0xff, n)`), more specific
than the field slots, so they win: `JMP (abs)`, the branches, the 65C02 additions, a plugin's wrapped
`BRK`. Most of the NMOS undocumented opcodes in group `cc = 11` behave as the group 1 and group 2
operations with the same `aaa` and `bbb` together (`LAX` is `LDA` and `LDX`; `SAX` stores `A AND
X`), so one field slot covers most of them and exact slots cover the unstable ones. The resolved
table per `variant` is the 256-entry array the processor indexes.

**Invalidation.** Adding or removing a slot dirties the table sets whose static point its guard
intersects, and in those, the pages its address set touches. Dirty pages are rebuilt on next use,
not at install. The sea carries a generation number; every table set records the generation it was
built at and the pages it depends on, Julia's world age with Self's dependency lists.

**Stated limits.** The configuration cache is a cache, with a measured size. A guard with an
unusual mask can split many pages. Both are reported by the resolver's statistics: table sets
built, pages split, chains interned, residual tests.

## Step 3: the compiler

The resolved tables are already fast; most of the remaining cost is the call through each slot's
`run`. In the interpreter and the resolver, that call site sees every handler in the machine, so V8's
inline cache for it is megamorphic and nothing gets inlined. Generated code gives every handler its
own call site, monomorphic, and for the standard slots no call at all.

### Standard slots

Most slots on a real machine are a few kinds, with parameters. These are data the resolver and
compiler understand, not closures:

| Kind | Params | Generated read / write |
|---|---|---|
| `map` | bank, base | `bank[base + a]` / `bank[base + a] = v` |
| `rom` | bank, base | read as `map`; write discarded |
| `latch` | state array, select bits, value bit | `s[(a >> k) & m] = a & 1`, then the floating bus |
| `toggle` | event list | push `cycle`, then the floating bus (the speaker) |
| `float` | none | the floating bus |
| `const` | value | the value |

A slot that doesn't fit a kind stays an opaque `run`, called from generated code. When the same
opaque pattern turns up in several cards, it becomes a new standard kind with parameters.

### Compiled page dispatch

For a split page, the compiler emits one function:

```js
// generated for page $C0, table set K, generation G
(function (c, h, n, s, fb) {
  switch (c.addr & 0xff) {
    case 0x30: case 0x31: /* ... */ case 0x3f: s.toggles.push(c.cycle); return fb();   // speaker
    case 0x80: case 0x84: return h[3](c, n[3]);                                          // language card switches
    /* ... */
    default: return fb();                                                                // floating bus
  }
})
```

built with `new Function`, with the opaque handlers (`h`), their `next` functions (`n`), state
objects and banks passed in as arguments,
not looked up. Observe-layer slots on the page are emitted first in their cases, each with its `next`
as the rest of the case. Each page function carries a `//# sourceURL` naming the page and table set,
so DevTools and the profiler show `cfg-K/page-C0.js` and not an anonymous closure
([microm8/TRANSPARENCY.md](microm8/TRANSPARENCY.md#further-down-from-the-6502-to-javascript-and-the-hosts-machine-code)).

### Compiled 6502 blocks

A basic block, from a fetch address to the next branch, jump, return or page-crossing hazard, is
compiled from its instructions' resolved `mode` and `operation` slots, which emit JavaScript
templates as the standard slots do. What the compiler knows that the interpreter doesn't:

- **Addresses known at compile time.** Absolute and zero-page operands, and the instruction fetches
  themselves, are resolved through the current table set when the block is compiled: a direct page
  becomes `bank[k]` with `k` a constant, an I/O address becomes the call or the inline template of its
  chain. No page table lookup at run time.
- **Indexed and indirect addresses** compile to an inline page table lookup:
  `const p = T[a >> 8]; v = p.bank ? p.bank[p.off + (a & 0xff)] : p.read(c)`.
- **Cycles.** The block keeps the cycle count in a local and writes it to `c.cycle` before any call
  that can observe it (an I/O handler, an opaque slot). The dummy reads and double writes of the NMOS
  and 65C02 parts are emitted as the processor makes them, because soft switches see them
  ([microm8/STACK.md](microm8/STACK.md#the-processor)).
- **Guards at entry.** A block assumes a table set and a set of pages. Its entry checks one flag,
  `if (!blk.valid) return deopt()`, and the flag is cleared by whatever invalidates its assumptions:
  a configuration switch away from its table set, a slot change on a page it depends on, a write to
  a page holding its code. Self did the same with dependency lists (Urs Hölzle, Craig Chambers and
  David Ungar, *Debugging Optimized Code with Dynamic Deoptimization*, PLDI 1992). Blocks are
  cached per table set, so switching the language card back finds the old blocks still valid.
- **Fetch slots.** A trap or accelerator on an address in the block ends the block there; the
  block's exit calls it.
- **Interrupts** are tested at block exits and after instructions that change `I`, so an interrupt
  is taken no later than the interpreter takes it. Exact sampling inside a block is a test the
  compiled code has to pass, not an assumption.

Each block carries a source map to the listing lines it came from
([microm8/TRANSPARENCY.md](microm8/TRANSPARENCY.md#further-down-from-the-6502-to-javascript-and-the-hosts-machine-code)).
A compiled block is also an accelerator whose `Exit` the compiler derives
([microm8/STACK.md](microm8/STACK.md#accelerators-typescript-in-place-of-a-6502-routine)).

### What Self and V8 already do for us

- **Hidden classes** (Self's maps): stable shapes for the context, slots, state and table entries.
- **Inline caches** are per call site, so generated code with one site per handler gets monomorphic
  caches for free. Polymorphic inline caches (Hölzle, Chambers and Ungar, ECOOP 1991) are V8's, not
  ours to build.
- **Customization** (Chambers and Ungar, PLDI 1989): table sets and blocks per configuration are
  code customized to a context, keyed on the configuration as Self keyed on the receiver's map.
- **Deoptimization**: the entry flag above, and the interpreter as the place to fall back to.

The piece neither Self nor Julia needed, since neither has implicit context, is dimension
relevance: dropping from each selector's tables the dimensions no slot of it constrains. Here that
is a scan of the guards at resolve time.

## Testing

- **Sets.** Normal forms against brute-force enumeration over the whole domain: for random guards,
  inclusion, intersection and emptiness agree with checking all 65,536 addresses.
- **Seas.** Random seas (random guards from masks, spans, enums and cubes; random layers) and random
  contexts: the interpreter, the resolver and the compiled page functions give the same chain and
  the same result. Install-time ambiguity reports exactly the contexts where the interpreter throws.
- **Machines.** The Apple on the interpreter, on the resolver and compiled, against microM8 and
  against each other: SingleStepTests for the processor, the Monitor and DOS boot for the machine,
  state hashes equal at every frame ([microm8/PLAN.md](microm8/PLAN.md)).
- **Rule tables.** Life and the other `CAM6.js` rules written as seas and resolved: the tables
  equal `CAM6.js`'s `ruleTableBytes` byte for byte.
- **Numbers.** The bench from microM8's step 0, per step, with the slot counts, table sets, split
  pages and compiled blocks it took to get there.

## The same move as CAM-6's rule tables

The resolver is the CAM-6 rule compiler pointed at a bus. CAM-6 rules were Forth words over named
neighbor bits (Tommaso Toffoli and Norman Margolus, *Cellular Automata Machines*, MIT Press 1987).
Loading a rule ran the word for every value of the neighborhood and stored the answers in the
lookup table the board indexes each cell with. Don's `CAM6.js` does the same in `compileRule`, which
fills `ruleTableBytes`, and its neighborhood functions gather the index bits for each cell. The
analysis in moollm's
[CAM construction set](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/cam-construction-set.md#the-move-has-a-name-partial-evaluation-and-one-more-thing)
applies here line for line:

- **The same binding-time division.** For CAM-6 the rule and its parameters are static and the
  neighborhood is dynamic. Here machine, variant and configuration are static, and address, access
  and `who` are dynamic.
- **Partial evaluation, then tabulation.** The residual function's domain is small enough to
  enumerate, so instead of residual code the resolver writes the function's graph: every input
  with its answer. A page table, a 256-entry I/O page and the opcode table are that kind of table,
  just as CAM-6's rule table is.
- **The same rule for when to stop.** Tabulate when the domain is small; emit code when it isn't.
  CAM-6's limit is large neighborhoods and real-valued parameters. Here it is the 6502 blocks of
  step 3, where the input is the whole machine state.
- **The same ancestor for code generation.** James Gosling's Ace (1989) is a C preprocessor that
  rewrites syntax trees with rules the programmer writes, used to generate the bitblt routines of
  Sun's SHAPES library from one description specialized across depth, rasterop and clipping.
  Compiled page dispatch and compiled blocks are that kind of generator, with the standard slots'
  templates in place of Ace's rules.

It works for both because the hardware was tables already. The Disk II controller is a state latch
and a 256-byte PROM indexed by state and inputs: a rule table. Address decoders, the character
generator and the video timing are fixed functions of a few bits. An emulator that resolves to
tables reproduces how the hardware was built, and the teaching graph's `models` links can say so.

**Cellular automata as a Korz sea.** A CA rule is a sea whose dimensions are the neighbor bits
(and the phase, and the planes), with the same specificity: a default slot ("stay as you are"),
more specific slots for the cases that change, ambiguity reported at install
([moollm's Korz CA case](https://github.com/SimHacker/moollm/blob/main/designs/korz/case-cellular-automata.md)).
Totalistic rules like Life's B3/S23 guard on a **derived dimension**, the neighbor count, which is a
function of other coordinates. The emulator has the same thing: the configuration word is computed
from the cards' states. The design admits derived dimensions on the same terms: they are computed
when the context is built, they have finite domains, and the resolver tabulates through them.

So one dispatcher serves both. A CA rule sea, resolved with the neighbor bits as table dimensions
and nothing left over, is a CAM-6 rule table; `CAM6.js` is its oracle the way microM8 is the
Apple's. The cabinet's cell renderer and a CAM-6 profile
([TODO.md](TODO.md)) get rules from the same place the Apple gets its soft switches.

## The PDP-7 first

The PDP-7 goes first because the cabinet already has a conventional emulator for it, `Pdp7`
([`src/plugins/pdp7.ts`](src/plugins/pdp7.ts)), which runs UNIX v0, SYMELEC and the 340 software, and
whose semantics are ported from SIMH's `pdp18b_cpu.c`. The Korz version, `KorzPdp7`, subclasses it, keeps its registers and EAE
arithmetic, and moves every decision into one sea per machine:

| Selector | Dimensions | Slots |
|---|---|---|
| `fetch`, `read`, `write` | `addr` (15 bits), `who` (cpu, device, debugger) | core; a fetch is a read |
| `ea` | `op`, `ind` | direct is the base case; indirect with auto-indexing, JMP I with EMIR, CAL, CAL I |
| `exec` | `op`, `ind` | one per opcode; OPR and LAW split on `ind` |
| `skip`, `cc`, `rot` | the three OPR fields | 16 skip conditions, 16 clear/complement combinations, 4 rotates, the undefined rotates, no rotate |
| `iot` | `device`, `pulse` | the CPU's IOF, ION and memory extension; the backplane's CAF and unclaimed codes; one slot per device code |

The operate group shows why fields become dimensions. `Pdp7.opr` is three switch statements over
three fields of one word; here each field is a selector, and "SZA SNL" or "CLA CLL CMA" is a slot
whose name `why` can print. The IOT bus shows why the CPU and the devices share a sea: the clock
claims device 0, and ION and IOF are slots on device 0 with a pulse, more specific than the clock's,
so the special case in `Pdp7.iot` is gone. `Cabinet` calls the CPU's optional `attach(box)`
([`src/bus.ts`](src/bus.ts)), and the backplane installs its devices' codes as slots; two devices
claiming one code is an install-time error instead of `devices.find` picking the first.

**The oracle.** [`src/korz/pdp7.test.ts`](src/korz/pdp7.test.ts) runs both CPUs side by side:

- 300 seeded random cores (8K and 32K, so the memory extension IOTs are live), every opcode and
  IOT, random interrupt requests, up to 2,000 steps each: registers and the `Step` result equal
  after every step, thrown errors equal, core equal at the end.
- UNIX v0 booted twice in lockstep from the RB09 platter, through login to the shell prompt:
  registers equal at every step, then paper and core equal.

Both tests fail when one slot is wrong: rotating RAL by two fails at step 4 of seed 3; deferring ION
by two instructions fails at step 51,210 of the boot.

**Speed.** UNIX v0, 3 million steps, Node 20 on an M4 Max:

| CPU | Steps per second | Time per step |
|---|---|---|
| `Pdp7` | 22–28 M | 35–45 ns |
| `KorzPdp7`, interpreter | 1.1 M | 880–915 ns |
| A real PDP-7 | about 0.3 M | 1.75 µs memory cycle |

A step makes five to eight dispatches (fetch, its read, `ea`, `exec`, operand reads and writes,
three more for OPR), and each filters the selector's slots and sorts the matches: about 150 ns a
dispatch. The interpreter is the oracle and the engine behind `why`, and at 3.7 times a real PDP-7
it is fast enough to boot UNIX in a test.

**Predictions for the next steps.** The resolver turns each selector into an array: `exec` and `ea`
have 32 entries, the OPR fields 16 each, `iot` 64 × 64, memory one entry per 256-word page. A
separate benchmark of resolved table dispatch measured 10–14 ns a call, so the resolved PDP-7 should
run near 10–15 M steps per second. The compiler then folds the dispatches into each block's code,
which should bring it to `Pdp7`'s speed or past it, since `Pdp7` decodes every instruction every
time and a compiled block decodes once.

**Per-word invalidation.** PDP-7 code writes into itself as a matter of course: JMS stores the return
address in the subroutine's first word, auto-index registers sit in the same core as the code, and
programs of the period modify their own instructions.
A compiled block therefore depends on the exact words it was compiled from, not on their page.
Invalidating by page would recompile every subroutine on every call, because its link word sits next
to its code. JMS's link word is never executed, so a block starts at `ea + 1` and the store at `ea`
invalidates nothing; a store into a word that a block was compiled from clears that block's `valid`
flag, which the block checks at entry, as the 6502 blocks below do.

## The whole machine

The CPU is the first client, not the only one. Every part of a cabinet that answers to coordinates
is a selector with dimensions:

- **Devices** are slots on the IOT bus, guarded on device code and pulse bits. The two showcases
  follow.
- **The backplane** is the `iot` selector itself, plus CAF, the power switches (a powered-off device
  is a slot that answers with `offIot`), and the order of IOP pulses within one IOT.
- **Buses and DMA.** The 340 and the RB09 read and write core with `who: device`. An observe slot on
  `{ who: "device" }` lights the words the display processor is fetching in the memory panel.
- **Storage.** The RB09's dimensions are track and sector. A bad sector, a write-protected track or a
  platter swapped mid-run is a patch slot on those coordinates, and `why` names it.
- **Networks.** A link between two machines in the cabinet's array carries messages with a port and
  a type; routing, logging and fault injection are slots on those.
- **Memory, shared and transformed.** Two machines whose `read` slots map one page to the same array
  share memory, and the slot says so. A transformed view is a selector over a virtual address
  space: the 340's display file read as instructions, SIXBIT words read as characters, the Apple's
  interleaved hi-res memory read as a linear bitmap. Writing through the view lands in the machine's
  memory through its `write` selector, so watches still fire.

Some things are reductions, not dispatch. The interrupt line is a wired OR of every device's flag;
slots with one guard would conflict. The backplane computes it over a view (every slot of selector
`irq`), and `why` on the line lists who is pulling it.

### Showcase: the Type 340

The 340 has two seas' worth of behavior: its IOTs on the PDP-7's bus, and its own instruction set,
which it fetches from PDP-7 core by DMA.

**IOTs as timed pulses.** A PDP-7 IOT does not deliver a pulse mask. It fires IOP1, IOP2 and IOP4 in
that order, for the bits that are set, and each device gate answers one pulse. `type340.ts` reads
the whole mask and needs `if … else if` to get the order right. With one dimension for the device
code and one for the pulse, the order is the backplane's and every gate is a slot:

```ts
const iop = (device: number, pulse: 1 | 2 | 4, by: string, run: Run<Io>): SlotSpec<Io> =>
  ({ selector: "iop", guard: { device, iop: pulse }, by: `340 ${by}`, run });

export const type340Iots = (d: Type340): SlotSpec<Io>[] => [
  iop(0o05, 1, "IDVE: skip on vertical edge",  (c) => c.skip(d.status & ST340_VEDGE)),
  iop(0o05, 2, "DAC into AC",                  (c) => { c.ac |= d.dac; }),
  iop(0o05, 4, "IDRS: resume in place",        () => d.resume()),
  iop(0o06, 1, "IDSI: skip on stop",           (c) => c.skip(d.status & ST340_STOPPED)),
  iop(0o06, 2, "clear DAC",                    () => d.setDac(0)),
  iop(0o06, 4, "IDLA: AC into DAC, start",     (c) => { d.setDac(d.dac | (c.ac & ADDR)); d.restart(); }),
  iop(0o07, 1, "IDSP: skip on light pen",      (c) => c.skip(d.status & ST340_LPHIT)),
  iop(0o07, 2, "IDRC: beam coordinates",       (c) => { c.ac |= d.penWord(); }),
  iop(0o07, 4, "clear flags, hold",            () => d.clearFlags()),
  iop(0o10, 1, "IDHE: skip on horizontal edge", (c) => c.skip(d.status & ST340_HEDGE)),
  iop(0o10, 2, "ASR into AC",                  (c) => { c.ac |= d.asr; }),
  { selector: "iop", guard: { device: 0o11, iop: 1 }, by: "cabinet: IDPN, skip on a pen hit", run: (c) => c.skip(d.lastHitPen) },
  { selector: "iop", guard: { device: 0o11, iop: 2 }, by: "cabinet: IDPN, which pen", run: (c) => { c.ac |= d.penNumber(); } },
];
```

IDLA (700606) is IOP2 then IOP4: clear the address register, then OR the AC into it. That is a load
built from two gates, as the hardware builds it, and the special case in `type340.ts` disappears.
700604 alone ORs into a DAC that is not cleared, which the current code treats as a load; the
differential test against `Type340` and SIMH decides which is right before this replaces it. IDPN is
the cabinet's extension, not DEC's, and its `by` says so: `view` on `by` lists every behavior DEC
did not build.

**The display processor as a sea.** The 340 decodes each word by its mode register, and in some
modes by the top two bits (DEC bits 0 and 1). Those are the dimensions:

```ts
const dims340 = [
  { name: "mode", width: 3, names: ["param", "point", "slave", "char", "vector", "vcont", "incr", "subr"] },
  { name: "top", width: 2 },   // DEC bits 0-1: escape and intensify in vector mode, the jump type in subr
];

export const type340Words = (d: Type340): SlotSpec<Word>[] => [
  { selector: "word", guard: { mode: "param" },  by: "340 parameter: mode, scale, intensity, stop", run: (w) => d.param(w.word) },
  { selector: "word", guard: { mode: "point" },  by: "340 point: load X or Y, maybe intensify", run: (w) => d.point(w.word, w.addr) },
  { selector: "word", guard: { mode: "slave" },  by: "340 slave: no Type 343, stop", run: (w) => d.slave(w.word) },
  { selector: "word", guard: { mode: "char" },   by: "340 three characters", run: (w) => d.chars(w.word, w.addr) },
  { selector: "word", guard: { mode: "vector" }, by: "340 vector", run: (w) => d.vector(w.word, w.addr) },
  { selector: "word", guard: { mode: "vector", top: bits(2, 2) }, by: "340 vector, escape after", run: (w) => { d.vector(w.word, w.addr); d.escape(); } },
  { selector: "word", guard: { mode: "vcont" },  by: "340 vector to the edge", run: (w) => d.vcont(w.word, w.addr) },
  { selector: "word", guard: { mode: "incr" },   by: "340 four increments", run: (w) => d.incr(w.word, w.addr) },
  { selector: "word", guard: { mode: "subr", top: 0 }, by: "cabinet: DTG, tag what follows", run: (w) => d.tag(w.word) },
  { selector: "word", guard: { mode: "subr", top: 1 }, by: "347 DDS", run: (w) => d.dds(w.word) },
  { selector: "word", guard: { mode: "subr", top: 2 }, by: "347 DJP: jump", run: (w) => d.djp(w.word) },
  { selector: "word", guard: { mode: "subr", top: 3 }, by: "347 DJS: jump and save", run: (w) => d.djs(w.word) },
];
```

The 340 fetches its word with `read` on the PDP-7's sea, `who: device`, so the memory panel, the
watches and the source map see display-file fetches the same way they see CPU fetches. Teaching
uses follow from the slots, not from extra code:

- An observe slot on `{ mode: "vector" }` draws each vector into the slow-motion beam view as it is
  decoded, with the display-file address it came from.
- `why` on any word says which mode decoded it and which bits mattered: "subr, top 3: 347 DJS".
- The edge and light-pen flags are what make SYMELEC interactive. A patch slot on `{ mode: "point" }`
  can inject a pen hit at a chosen point, so a test drives the pen menus without a mouse.
- The resolved form is an 8 × 4 table, 32 entries; the compiler can then compile a display file
  that does not change into one function that emits its segments.

### Showcase: the Turing machine

The cabinet's Turing engine ([`src/plugins/turing.ts`](src/plugins/turing.ts), device 054) runs a
transition table out of PDP-7 core: one word per (state, symbol), `[move:2][write:4][next:12]`, at
`TABLE + state × NSYM + symbol`, with the all-zero word meaning "no transition". Its IOTs split on
`pulse & 060` into four groups: status (skip on a flag, read, load and go), state (skip while
running, read, resume), mode (single step, set the mode, stop) and the last emitted character. On
the `iop` selector that is a `sub` dimension beside `device` and `iop`, and ten slots.

The table itself is where Korz fits best. A transition table is a rule table, like CAM-6's: a
function of a few small fields, stored as its graph. Written by hand it is a grid of words with
holes; written as a sea it is a few rules with defaults, and the resolver writes the grid. A binary
incrementer, with the head starting on the number's first digit:

```ts
const BLANK = 0, ZERO = 1, ONE = 2;
const R = 1, L = 2, N = 3;
const door = (move: number, write: number, next: number) => (move << 16) | (write << 12) | next;

const tm = new Sea<{ state: number; sym: number }>([{ name: "state", width: 12 }, { name: "sym", width: 4 }]);
tm.install([
  { selector: "door", by: "no transition", run: () => 0 },
  { selector: "door", guard: { state: 1 }, by: "scan right over the digits", run: (c) => door(R, c.sym, 1) },
  { selector: "door", guard: { state: 1, sym: BLANK }, by: "past the end: turn back", run: () => door(L, BLANK, 2) },
  { selector: "door", guard: { state: 2 }, by: "0 or blank: write 1, halt", run: () => door(N, ONE, 0) },
  { selector: "door", guard: { state: 2, sym: ONE }, by: "1: write 0, carry left", run: () => door(L, ZERO, 2) },
]);

for (let q = 0; q < 3; q += 1)
  for (let s = 0; s < NSYM; s += 1)
    cpu.write(TABLE + q * NSYM + s, tm.dispatch("door", { state: q, sym: s }));
```

The loop is the resolver by hand: it tabulates the sea into the words the engine reads, exactly as
`compileRule` fills CAM-6's table. State 0's row comes out zero, which the engine reads as halt.
Rules with a wildcard symbol ("in state 1, any digit") cannot be written in the table, which has one
word per pair; in the sea they are one slot each, and the more specific slot for the blank overrides
them without an `if`. An `emit` selector over the same two dimensions fills the emit table: one
slot `{ state: 2, sym: ONE }` returning BEL beeps on every carry.

`why` closes the loop for teaching. When the engine stops on an undefined transition, `why("door",
{ state, sym })` names the rule that should have answered and the dimension it missed on. When it
takes a transition, the trace record carries the table address, the address maps back to (state,
symbol), and (state, symbol) maps back to the slot and its `by`: the rule in the program, not the
word in core.

## Other machines

- **The C64.** Its PLA banking (`LORAM`, `HIRAM`, `CHAREN`, `GAME`, `EXROM`) selects RAM, BASIC,
  KERNAL, character ROM, I/O or cartridge per region: configuration-guarded mapping slots, the
  language card's pattern with five bits.

## Steps

1. **Built.** The interpreter, `why`, views, install-time ambiguity, layers and `next`, with sets as
   bitsets per dimension ([`src/korz/korz.ts`](src/korz/korz.ts)).
2. **Built.** The PDP-7 on the interpreter, against `Pdp7`: random programs and UNIX v0 in lockstep
   ([`src/korz/pdp7.ts`](src/korz/pdp7.ts)).
3. The IOT bus as timed IOP pulses; the Type 340 and the Turing engine as slots, against the current
   plugins and SIMH.
4. The resolver on the PDP-7: per-selector tables, then the measured speed against the 10–15 M steps
   per second predicted above.
5. Page-set normal forms with the brute-force tests; the Apple bus on the interpreter, against
   microM8 ([microm8/PLAN.md](microm8/PLAN.md), steps 1–2).
6. The resolver for the Apple: table sets, page kinds, interned chains, the opcode table,
   invalidation.
7. Standard slots, and compiled page dispatch.
8. Compiled blocks: PDP-7 first, with per-word invalidation, then 6502 (microM8 plan step 14).

Each step is done when it agrees with the step before it on every test, and its speed and table
counts are written down.

## References

- David Ungar, Harold Ossher and Doug Kimelman. *Korz: Simple, Symmetric, Subjective,
  Context-Oriented Programming*. Onward! 2014.
- Michael Ernst, Craig Kaplan and Craig Chambers. *Predicate Dispatching: A Unified Theory of
  Dispatch*. ECOOP 1998.
- Craig Chambers and Weimin Chen. *Efficient Multiple and Predicate Dispatching*. OOPSLA 1999.
  Dispatch compiled to decision trees, the general case of the tables here.
- Craig Chambers and David Ungar. *Customization: Optimizing Compiler Technology for Self, a
  Dynamically-Typed Object-Oriented Programming Language*. PLDI 1989.
- Urs Hölzle, Craig Chambers and David Ungar. *Optimizing Dynamically-Typed Object-Oriented
  Languages with Polymorphic Inline Caches*. ECOOP 1991.
- Urs Hölzle, Craig Chambers and David Ungar. *Debugging Optimized Code with Dynamic
  Deoptimization*. PLDI 1992.
- Tommaso Toffoli and Norman Margolus. *Cellular Automata Machines: A New Environment for
  Modeling*. MIT Press, 1987.
- James Gosling. [*Ace: a syntax-driven C preprocessor*](https://swtch.com/gosling89ace.pdf). July
  1989. Rules rewrite C syntax trees; X/NeWS 2.0's SHAPES graphics library needs Ace to build its
  device-dependent part ([HN](https://news.ycombinator.com/item?id=43594513)). More in
  [moollm's notes](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/cam-construction-set.md#ace-gosling-already-built-stage-2-for-exactly-this-problem).
- Jeff Bezanson, Jiahao Chen, Ben Chung, Stefan Karpinski, Viral Shah, Jan Vitek and Lionel Zoubritzky.
  *Julia: Dynamism and Performance Reconciled by Design*. OOPSLA 2018. World age.
