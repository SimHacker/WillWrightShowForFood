# Korz dispatch for emulators, in TypeScript

Steps 1, 2 and 3 are built, for the PDP-7: the interpreter and the resolver in
[`src/korz/korz.ts`](src/korz/korz.ts), the PDP-7 on them in
[`src/korz/pdp7.ts`](src/korz/pdp7.ts), and the compiler in
[`src/korz/compile7.ts`](src/korz/compile7.ts), designed and measured in
[KORZ-COMPILER.md](KORZ-COMPILER.md). The sea stays domain-free. Four kits sit on it:
the CPU host ([`src/korz/cpu.ts`](src/korz/cpu.ts)), the device adapter
([`src/korz/device.ts`](src/korz/device.ts)), Life ([`src/korz/ca.ts`](src/korz/ca.ts)),
and a Turing rule ([`src/korz/tm.ts`](src/korz/tm.ts)). [Domain kits](#domain-kits) says how they
divide. The PDP-7 runs at each level and is tested at each against
`Pdp7` ([the PDP-7 first](#the-pdp-7-first)). The apple2 bus and its compiled blocks are design. A short summary of results
and open questions, for readers who know Korz and Self, is [KORZ-MACHINES.md](KORZ-MACHINES.md).

Everything a machine does on its bus is a lookup on a few small bit fields: which address, read or
write, who is asking, which memory configuration, which opcode. Emulators usually spread that
lookup over `if` chains, switch statements and page tables written by hand, and a plugin that wants
to change one address has to find the right place to patch. This design puts every handler, mapping,
soft switch, opcode, trap, accelerator and watch into one sea of guarded slots, in the manner of Korz
(David Ungar, Harold Ossher and Doug Kimelman, *Korz: Simple, Symmetric, Subjective,
Context-Oriented Programming*, Onward! 2014), and dispatches each access to the most specific slot
that matches.

The Onward! 2014 paper defines a dimension as a partial order of coordinates, written `≤`. A
coordinate is whatever that order contains: an object, a person, `true`. A guard says "this
coordinate or anything more specific," or it names the coordinate and binds it, or it leaves the
dimension alone. A send searches for the unique most specific slot. Ambiguity is an error when the
send happens. Nothing in that account says a coordinate is an integer, that a domain is finite, or
that the answer is an index into a table.

This stack makes a narrower choice, so the sea can be compiled. Every dimension here is the
integers `0 .. 2^width − 1`. A guard is a bitset over that range: one number, a named enum member,
a mask, a span, or a union of those. Specificity is set inclusion. Because every context is a
point in a finite product of those ranges, the resolver can number the points and store the chain
at that index, and the compiler can paste the chain into a function. Install-time ambiguity and
ahead-of-time tables follow from that choice. They are available here because the emulator's
coordinates really are small integers: 16 address bits, 8 opcode bits, a few enums, a
configuration word. An object or a float would keep the paper's order.
[Objects, floats, and other orders](#objects-floats-and-other-orders) says how. The order of work:

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

**Names.** The Korz machines are sibling directories: [`src/korz/pdp-7`](src/korz/pdp-7/) and
[`src/korz/apple2`](src/korz/apple2/). `apple2` is the ][ and the //e. `apple1` is later, for
the historical machine. The running PDP-7 is still [`pdp7.ts`](src/korz/pdp7.ts),
[`compile7.ts`](src/korz/compile7.ts), and [`plugins/pdp7.ts`](src/plugins/pdp7.ts); those files
move into `pdp-7` when a change touches them. [`src/apple2/`](src/apple2/) stays the disk and world
layer the wasm Apple already uses.

## Domain kits

`korz.ts` is the sea. It guards, scores specificity, layers, and resolves. It does not know a
CPU, a device, a cell, or a tape. A domain is a kit beside it: dimensions, selectors, the slot
patterns that domain uses, and the step loop that domain needs. Kits do not import each other.
A cabinet composes them. An Apple is a CPU kit plus device slots. A CAM-6 is the automata kit
alone. A Turing machine can be a device on the PDP-7 or a machine of its own, and both are the
same slots.

- **cpu**, [`src/korz/cpu.ts`](src/korz/cpu.ts). The host every CPU was about to copy out of
  `KorzPdp7`: one sea, the rung (`interpret`, `resolve`, or `compile`), and one reused context
  per nesting. What the host owns, what a CPU file owns, how the rungs swap, and how a second
  instruction set stacks on the first are [KORZ-CPU.md](KORZ-CPU.md). `compile7.ts` and
  `compile65.ts` are the two compilers. Slots reach their machine as `c.cpu`.
- **device**, [`src/korz/device.ts`](src/korz/device.ts). A device that has slots installs them.
  Any other device gets one slot per code that calls the function it already has. A patch-layer
  slot per code answers while power is off, and calls `next` while power is on, so `why` on a
  dead code names the switch. Power is read when the slot runs. The kit does not know a pulse
  protocol. [`iop.ts`](src/korz/iop.ts) is the PDP-7's: `timed`, `gate`, `skipIf`, and `decode`.
  `backplaneSlots` is that protocol plugged into the kit, including the unclaimed-code slot and
  CAF.
- **cellular automata**, [`src/korz/ca.ts`](src/korz/ca.ts). Dimensions are the center, the eight
  neighbor bits, and a count derived from those bits. The stepper fills the count when it builds
  the context. Life is B3/S23, one slot for a birth, one for a survival, and a default that leaves
  the cell dead. The resolver's `cell` table is the rule table. A rule that cares which neighbor
  is alive guards a bit of `nb` and wins over a rule that only counted.
- **turing**, [`src/korz/tm.ts`](src/korz/tm.ts). Dimensions are state and symbol. `door` returns
  the transition word. `emit` is a second selector over the same two dimensions, and 0 is silent.
  The default door is no transition. `TmTape` steps an unbounded tape. `tabulate` writes the words
  the PDP-7 engine reads, one per (state, symbol), in the engine's layout. The engine in
  [`plugins/turing.ts`](src/plugins/turing.ts) is still the device on IOT 054. Its IOTs are the
  device kit. Its table can now be this sea.

A bitmask scored per bit, for asserts, logging, and bounds, would be a kit any of these can add.
It is a dimension the interpreter understands as bits. It is not built yet.

## The model

- A **dimension**, in this stack, is a named coordinate over `0 .. 2^width − 1`: `addr` (0–`$FFFF`),
  `access` (read, write, fetch), `who` (cpu, video, dma, debugger), `op` (0–255), `machine`,
  `variant`, the fields of the configuration word, and `value` (the byte on the bus). The paper's
  dimension is a partial order, and a coordinate there need not be one of these integers.
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

### Objects, floats, and other orders

The integer range is how this stack gets lookup tables, caches, indexes, masks and spans. It is
the shape of a bus. It is not the shape of every coordinate worth dispatching on.

Three kinds of value already fit, because their order is the integer order and the names are only
labels on the numbers:

- A boolean is one bit.
- A small closed set of names is an enum. The name's position is the number, and the context holds
  the number.
- An open set of names, such as Zork's verbs, is interned: a table from each string to a number,
  the same trick the resolver uses for chains. Interning picks out particular values. It does not
  give the names an order of their own.

An object and a float stay what they are. Stuffing either into `0 .. 2^width − 1` would invent an
order they do not have, and a guard written against that number would mean something else.

**An object** is a coordinate whose order is the paper's. A guard matches that object, or anything
more specific than it. "More specific" is the relation declared for that dimension: delegation
along a prototype chain, or "this person, or anyone acting for them." The test walks the relation.
Two objects that are not ordered against each other are incomparable, and a send that matches two
such slots is ambiguous. That is the paper's rule, and it is a search, not a bit test.

**A float** is a coordinate on the number line, and `≤` is numeric. A guard is a threshold or a
range, such as `isKnown ≥ 0.8`, the graded presence in the moollm notes. The domain is infinite,
so it is never enumerated and never a bitset. When every installed guard on that dimension is a
threshold, the cut points are finite and the float falls into one bucket between them. The bucket
is an integer, and that integer can index a table. The bucket is a cache of the thresholds
currently installed. It is not the meaning of the coordinate. A guard that is not a threshold
stays a test.

**How the two would share a selector.** A selector whose dimensions are all integers keeps the
tables it has now. A dimension whose order is objects or floats is residual: the integer
dimensions still pick a chain, and the chain's first step tests the object or the float, the way
a watch on `value` is already a short test in front of a slot the address table could not absorb.
A selector with no integer dimensions has no table. The interpreter's search is the
implementation, which is what `korz.ts` already is for the integer sea, and what the paper's send
always was.

None of this is in [`src/korz/korz.ts`](src/korz/korz.ts). `Dim` is a width. The machines this
package is building have integer coordinates, and the integer sea stays their oracle. Object and
float dimensions are the extension for a sea whose coordinates are not bus bits: a purpose, a
person, a graded `isKnown`.

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
Apple's. Life is that sea in [`src/korz/ca.ts`](src/korz/ca.ts): B3/S23 on every center and every
neighbor count, a blinker, and a still block, with the interpreter and the resolver agreeing.
A byte-for-byte compare with `CAM6.js`'s `ruleTableBytes` waits on a rule written in CAM-6's
neighborhood encoding. The cabinet's cell renderer and a CAM-6 profile
([TODO.md](TODO.md)) get rules from the same place the Apple gets its soft switches.

## The PDP-7 first

The PDP-7 goes first because the cabinet already has a conventional emulator for it, `Pdp7`
([`src/plugins/pdp7.ts`](src/plugins/pdp7.ts)), which runs UNIX v0, SYMELEC and the 340 software, and
whose semantics are ported from SIMH's `pdp18b_cpu.c`. The Korz version, `KorzPdp7`, subclasses it, keeps its registers and EAE
arithmetic, and moves every decision into one sea per machine:

| Selector | Dimensions | Slots |
|---|---|---|
| `read`, `write` | `addr` (15 bits), `who` (cpu, device, debugger), `access` (read, fetch) | core |
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

**Every level stays.** `new KorzPdp7({ korz: "interpret" })` searches the sea on every dispatch;
`korz: "resolve"`, the default, dispatches through the resolver's tables. Both run the same
differential tests against `Pdp7`, and [`src/korz/korz.test.ts`](src/korz/korz.test.ts) checks the
resolver against the interpreter on random seas, errors included. Each level is the oracle for the
one above it. `korz: "compile"` runs compiled blocks over the resolver and is tested against `Pdp7`
the same way, in batches of random length ([KORZ-COMPILER.md](KORZ-COMPILER.md)).

**Speed.** `npm run bench:korz` ([`scripts/korz-bench.mjs`](scripts/korz-bench.mjs)): UNIX v0, 3
million steps, a new machine each round, best of rounds 2 to 5, Node 26 on an M4 Max, devices
event-driven. All four end at the same PC.

| CPU | Steps per second | Time per step |
|---|---|---|
| `Pdp7` | 92 M | 11 ns |
| `KorzPdp7`, compiled | 189 M | 5 ns |
| `KorzPdp7`, resolver | 34 M | 30 ns |
| `KorzPdp7`, interpreter | 1.3 M | 777 ns |
| A real PDP-7 | about 0.3 M | 1.75 µs memory cycle |

The second workload is `ULTIMATE-HAND` in Forth, with a procedural hand in place of the camera
(`node scripts/korz-bench.mjs hand`): the Forth inner interpreter, the 3D turtle, the 340, the
DataHand and the Ultimate Machine at once, 10 million steps through one press of the switch. All
four end with the same PC, press count, frames latched and frames drawn.

| CPU | Steps per second | Time per step |
|---|---|---|
| `Pdp7` | 47 M | 21 ns |
| `KorzPdp7`, compiled | 74 M | 13 ns |
| `KorzPdp7`, resolver | 23 M | 44 ns |
| `KorzPdp7`, interpreter | 1.3 M | 763 ns |

The third is the Turing engine on device 54 running BCOUNT free (`0 SPEED`) at one transition every
three cycles, while Forth draws its tape on the 340 (`node scripts/korz-bench.mjs turing`), 5
million steps. All four end with the same PC, transition count, state and head.

| CPU | Steps per second | Time per step |
|---|---|---|
| `Pdp7` | 15 M | 67 ns |
| `KorzPdp7`, compiled | 14 M | 71 ns |
| `KorzPdp7`, resolver | 8.5 M | 118 ns |
| `KorzPdp7`, interpreter | 0.83 M | 1.21 µs |

Here the engine dominates, and the compiled CPU gets batches of 3 instructions between its
transitions: each transition reads its rule from core, rewrites a tape cell, and
writes its registers back to its control block in core. Each workload and level runs in its own process, since call sites shared between
workloads (the cabinet's device loop) see each other's devices; repeated runs differ by up to 8%. Node 20 ran `Pdp7` at 15 ns on UNIX and 149 ns on the
Turing workload; the resolver's 29 ns on UNIX is the same on both, so the gap the compiler has to
close grew to 2.6 times.
`--record` appends results to [`bench-results/korz.jsonl`](bench-results/korz.jsonl) with the
commit, Node version and machine. `--check` compares each result with the last one recorded on the
same machine, Node version, workload, level and step count, and exits 1 if the end state changed
or the steady time per step is more than 10% slower.

A step makes five to eight dispatches (fetch, its read, `ea`, `exec`, operand reads and writes,
three more for OPR), and each filters the selector's slots and sorts the matches: about 150 ns a
dispatch. The interpreter is the oracle and the engine behind `why`, and at about four times a real
PDP-7 it is fast enough to boot UNIX in a test.

**The resolver** (`Sea.resolve`, `Sea.bind`) turns each selector into an array indexed by the
dimensions its slots constrain, and drops the rest: `exec` and `ea` have 32 entries, `skip` and `cc`
16, `rot` 8, `iot` 4,096 (device × pulse), `iop` 2,048 (device × sub × IOP pulse), and `read` one entry, since no slot guards on `addr` or
`access` until a watch is installed. Equal chains share one entry. Each selector gets one generated
function (`korz/<selector>.js` in the debugger) that computes the index, loads the entry and calls
the chain's first slot; a chain of one slot gets a `next` that allocates nothing. `bind` writes these
functions into the CPU's dispatch object, and an install or remove rebuilds the tables of the
selectors it touched before it returns, so there is no check per dispatch. A watch on one 15-bit
address makes `read` a 32,768-entry table, built once.

Getting from 105 ns to 56 ns a step took three changes, each found with `node --cpu-prof`: the index
computation and table load moved into the generated function, so V8 inlines all of it; the per-call
generation check became `bind`; and an instruction fetch became `access: "fetch"` on `read` instead
of a second selector that called the first. With every device on the IOP bus behind its power slot,
a step was 57 ns in a fresh process and about 70 ns for every machine after the first.

**Every machine the same to V8.** V8 specializes optimized code on the functions a call site has
seen and the hidden classes of the objects it touches, not on addresses or data. Each `KorzPdp7`
had its own slot closures over `this`, its own generated dispatch functions, and stubs that
resolved on first call. The second machine's first `write` called its own stub through a site
optimized for the first machine's `korz_write`: `--trace-deopt` showed "wrong call target" in
`step`, `execute`, `operate`, `read` and `write`, and `--trace-turbo-inlining` showed the
dispatchers no longer inlined. A call site's feedback is one target or megamorphic, so one strange
target is permanent. Three changes made every machine look the same:
- one generated method per selector and index expression for the whole process, reading its table
  from a field beside it in the dispatch object, declared when `bind` creates the object;
- the CPU's slots built once, reaching their machine as `c.cpu` in the context;
- no stubs: an install or remove rebuilds the tables it touched before it returns.

A later machine then ran UNIX at 46 ns a step, faster than the first, which pays for warm-up.
Device slots are still closures over their devices; the hand workload, where devices dominate,
shows no difference between first and later machines, so they stay as they are until a
measurement says otherwise. The benchmark builds a new machine every round and says so when later
machines run more than 10% slower than the first. About 17 ns of the 46 was the cabinet calling
`irq`, `power` and `tick` on four devices every step, the same cost `Pdp7` paid.

**Event-driven devices.** A device with `nextEvent()` tells the cabinet how many cycles remain
before it does anything the CPU or the outside world can see: the clock's next tick, the teletype
finishing a character, the paper tape's next frame, the RB09's next word, the DataHand's next
camera frame. `Infinity` means idle until an IOT, a reset or something external. The contract: for
any n up to that count, `tick(n)` leaves the device exactly as n calls of `tick(1)` would. The
cabinet keeps, for each device, the cycle it was last brought up to and the cycle it is next due,
and leaves it alone in between. It brings a device up to date before an IOT that addresses it (the
Korz CPU's `iot` slot calls `Backplane.sync`), before CAF, before a power change, and at the end of
every `step` and `run`, so code outside a run always sees every device current. Anything changed
from outside between runs, a key typed or a tape mounted, is picked up at the start of the next
one. A device without `nextEvent` is ticked every cycle, as before. The Turing engine reports its
next transition, found by the same float additions its `tick` makes; the Ultimate Machine the end
of its timed phase, or a lower bound on when its lid or arm arrives; the 340 is below.

The old loop stays as the `everyCycle` option, and it is the oracle. The lockstep tests run `Pdp7`
ticking every device every cycle against `KorzPdp7` event-driven and compare registers at every
step: UNIX, the Forth rigs, and rigs that take paper tape, DataHand frames and the Ultimate
Machine's phase changes by interrupt. The interrupt rigs matter because bringing a device up to
date before each IOT hides a late event from a program that polls, but not from one that waits
for the interrupt. Ten planted schedule errors each fail a test: seven devices reporting their
next event a cycle or two late, the Korz CPU skipping its sync before an IOT, and the cabinet
deciding a device's next turn from its power before its tick instead of after. The last was a real
bug, caught by the Ultimate Machine test: the machine switches itself off during its own tick.

On UNIX, where the devices are idle most of the time, this took `Pdp7` from 30 to 15 ns a step
and the resolver from 46 to 29 ns, on Node 20. The Ultimate Machine's events took the hand workload
from 75 to 54 ns for `Pdp7` and from 102 to 77 for the resolver; the 340 took it the rest of the way.

**The 340 runs ahead.** Drawing, the 340 reads a display word every cycle and can raise a flag on
any of them, so it can't simply be left behind: its flags would rise late, and a CPU that read
core it should already have written would see it unwritten. Instead, asked for its next event, it
saves its state and runs ahead, holding back what it draws, until one of four things:
- it raises a flag or stops: that cycle is its next event, so the interrupt rises on time;
- the next word is a DDS, its one store into core: the store runs live, at its own cycle;
- 256 cycles, or the end of the run (`nextEvent(lead)`: the cabinet says how far it may look);
- the cabinet brings it back.

Each word it reads ahead is stamped with the cycle it read it. The cabinet hears of every core
write before it lands, from the CPU or from another unit: `Cpu.watchWrites`, a field test in
`Pdp7`, and in `KorzPdp7` an observe-layer slot on `write`, installed only while some unit reads
ahead. If the 340 has read that word anywhere in its window, the cabinet brings it back to the
write's point: within a cycle the CPU runs first and then the units in order, so a write by the
CPU at cycle s, or by a unit before the 340, must be seen from cycle s, and one by a unit after
it from s + 1. Bringing it back restores the saved state and replays to that point, reading core
as it is, which is why any word read in the window counts and not only words read after the
write: a later replay would otherwise read a word written since. An IOT brings it back too, except
a skip alone (IDSI, IDSP, the edge skips): the status can't change until the cycle running ahead
stops at, so those are answered from the saved state. That one matters most. Forth waits for the
display to stop by polling IDSI about twice a frame, and before it was answered ahead, every poll
threw away what the 340 had drawn. What it drew goes to `onSegment` when time reaches it, with the
cycle it was drawn at.

The oracle is the same every-cycle loop. A rig races the 340 on purpose: the display file starts
with a DDS into a word the CPU reads in each of the next three cycles; the CPU keeps rewriting the
x of the frame's last point, in a loop whose length changes by a cycle each time round; and three
DMA units, two before the 340 in order and one after, rewrite two more x words and the stop word
every 7, 11 and 13 cycles. Seventeen planted errors in running ahead each fail it or another rig:
no conflict check, conflicts from the write's point on only, the first read in the window missed,
running through a DDS, every IOT answered ahead, a skip reading the status from ahead, a rollback
that forgets x, a commit that drops segments, segments sent while ahead, a flag reported a cycle
late, a commit one cycle early, reads not stamped, the CPU's write point a cycle late, unit order
ignored, no second pass when a unit's write brings the 340 back mid-service, the Korz watch slot
clobbering the write it watches, and `Pdp7` calling the hook after the store. The second
was a real bug in the first version: a later replay read a word written since it was first read.

On the benchmarks no write has ever conflicted; every rollback was an IDSI poll, and now there are
none. The hand workload runs at 23 ns a step in `Pdp7` and 43 in the resolver, from 54 and 77, and
ends where it did. A unit that reads ahead assumes at least 8K of core, since a 13-bit display
address on a smaller core aliases a word the 340 never sees written; below that the cabinet asks
it to look no further than a cycle.

**The compiler.** The resolver still makes five to eight indirect calls a step, through a context
object. The compiler folds them into each block's code, and the cabinet hands it a batch of
instructions up to the next device event instead of one cycle at a time. It runs UNIX at 5 ns a
step and the hand at 13, against `Pdp7`'s 11 and 21, since `Pdp7` decodes every instruction every
time and a compiled block decodes once; on the Turing workload it ties `Pdp7`
([KORZ-COMPILER.md](KORZ-COMPILER.md)).

**Per-word invalidation.** PDP-7 code writes into itself as a matter of course: JMS stores the return
address in the subroutine's first word, auto-index registers sit in the same core as the code, and
programs of the period modify their own instructions.
A compiled block therefore depends on the exact words it was compiled from, not on their page.
Invalidating by page would recompile every subroutine on every call, because its link word sits next
to its code. JMS's link word is never executed, so a block starts at `ea + 1` and the store at `ea`
invalidates nothing; a store into a word that a block was compiled from clears that block's `valid`
flag and drops it from the table, and a block checks its own flag after each of its stores.

## The whole machine

The CPU is the first client, not the only one. Every part of a cabinet that answers to coordinates
is a selector with dimensions:

- **Devices** are slots on the IOT bus, guarded on device code and pulse bits. The two showcases
  follow.
- **The backplane** is the `iot` selector itself, plus CAF, the power switches (a powered-off device
  is a slot that answers with `offIot`), and the order of IOP pulses within one IOT.
- **Buses and DMA.** The 340, the Turing engine and the RB09 read and write core through the CPU's
  `read` and `write`, so watches and the memory panel see their traffic, but today as `who: cpu`.
  Planned: they say `who: device`, and an observe slot on `{ who: "device" }` lights the words the
  display processor is fetching in the memory panel.
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
that order, for the bits that are set, and each device gate answers one pulse. `Type340.iot()` reads
the whole mask and needs `if … else if` to get the order right. On the IOP bus the order is the
CPU's, and every gate is a slot. From `Type340.korzSlots` (bodies abridged):

```ts
timed(bus, 0o05, "340 device 05"),
skipIf(0o05, "340 IDVE: skip on vertical edge", () => (this.status & ST340_VEDGE) !== 0),
gate(0o05, 2, "340: DAC into AC", (c) => { c.ac |= this.dac; }),
gate(0o05, 4, "340 IDRS: resume in place", () => { /* clear edge and pen flags, resume */ }),
timed(bus, 0o06, "340 device 06"),
skipIf(0o06, "340 IDSI: skip on stop", () => (this.status & ST340_STOPPED) !== 0),
gate(0o06, 2, "340: clear DAC", () => this.setDac(0)),
gate(0o06, 4, "340 IDLA: AC into DAC, clear flags, start", (c) => { this.setDac(c.ac & ADDR); /* … */ }),
```

IDLA (700606) is IOP2 then IOP4: clear the address register, then load it from the AC. The IOP4
gate loads rather than ORs, which is what `iot()` does, so 700604 alone also loads. Whether the
hardware ORs into an uncleared DAC is still open, to be settled against SIMH or the 340 manual.
IDPN (device 011) is the cabinet's extension, not DEC's, and its `by` says so: `view` on `by` lists
every behavior DEC did not build.

**The device bus as built.** [`src/korz/iop.ts`](src/korz/iop.ts) has four helpers. `timed` is the
device's `iot` slot: it fires IOP1, IOP2 and IOP4 through the `iop` selector. `gate` answers one
pulse, optionally for one `sub` value (pulse bits 060, which split a device code into four groups).
`skipIf` is a `gate` on IOP1 that sets the skip. `decode` is an `iot` slot for a whole pulse
pattern, for devices whose pulses are not independent gates. Being more specific than `timed`, it
wins for its pattern and the rest of the device stays timed. The clock, teletype, paper tape, RB09,
340, DataHand and most of the Turing engine are timed; the RB09's `iot` slot recomputes its status
after the pulses. The Ultimate machine's device 055, the Turing mode group (sub 2), both Tiny Titan
codes and titan-files' group 0 decode whole pulses, because their gates read each other's results
or the AC as it was before IOP2.

The backplane adds one patch-layer slot per device code that answers with `offIot` while the device
is off, so `why` on a dead IOT names the power switch. A device without `korzSlots` gets one slot
per code that calls `iot()`; none in the cabinet needs it now. Both come from the device kit
([`src/korz/device.ts`](src/korz/device.ts)). `backplaneSlots` passes the IOT request and reply,
the unclaimed-code slot, and CAF. [`iop.ts`](src/korz/iop.ts) stays the pulse protocol.

Each device keeps `iot()` as the oracle. [`src/korz/devices.test.ts`](src/korz/devices.test.ts) runs
a `Pdp7` cabinet and a `KorzPdp7` cabinet in lockstep, comparing registers every step and
teletype output and device state at the end. It runs SYMELEC on the 340, teletype, clock and Tiny
Titan, a drawn line sent over the Titan link, the Turing engine stepped and free-running, the
Ultimate machine's phase interrupts, a hand-assembled paper tape reader loop (RSA and RSB), the
DataHand feeding the 3D turtle, and titan-files writing and reading words by name; the UNIX v0
lockstep in `pdp7.test.ts` covers the RB09. Breaking IDSI, UMSI, TMSS, TMSR, TMGO, LSF, LLB18, RSB,
DBSF, DBLM, FSF, FST's AC or the DataHand's register index makes it fail. Breaking TMLA does not: the Forth code always follows TMLA with TMST, which hides it.

**The display processor as a sea: built.** [`src/korz/type340.ts`](src/korz/type340.ts). The 340
decodes each word by its mode register, and in some modes by the top two bits (DEC bits 0 and 1).
Those are the dimensions, and `KorzType340` puts one slot on `word` for each thing a word can do:

```ts
export const DIMS_340 = [
  { name: "mode", width: 3, names: ["param", "point", "slave", "char", "vector", "vcont", "incr", "subr"] },
  { name: "top", width: 2 },   // DEC bits 0-1: escape and intensify, Y or X in point mode, the jump type in subr
];
const ESC = bits(2, 2);
// by, and guard (bodies abridged):
//   "340 parameter: mode, pen, scale, intensity, stop"   { mode: "param" }
//   "340 point: load X"                                  { mode: "point" }
//   "340 point: load Y"                                  { mode: "point", top: bits(1, 1) }
//   "340 slave: no Type 343, stop"                       { mode: "slave" }
//   "342 three characters"                               { mode: "char" }
//   "340 vector"                                         { mode: "vector" }
//   "340 vector, escape after"                           { mode: "vector", top: ESC }
//   "340 vector continue: repeat to the edge"            { mode: "vcont" }
//   "340 four increments"                                { mode: "incr" }
//   "340 four increments, escape after"                  { mode: "incr", top: ESC }
//   "cabinet DTG: tag what follows (not DEC's)"          { mode: "subr", top: 0 }
//   "347 DDS: deposit a jump back, start a lightbutton"  { mode: "subr", top: 1 }
//   "347 DJP: jump"                                      { mode: "subr", top: 2 }
//   "347 DJS: jump and save"                             { mode: "subr", top: 3 }
```

Where `Type340` tests the escape bit or the Y bit with an `if`, the sea has a more specific slot.
The common tail of every word (edge flags cleared on fetch, the escape back through the 347's
save register) stays in `Type340.instruction`, as the CPU's fetch stays in `step`, and `Type340`'s
`switch`, now its `decode` method, is the oracle. The slot bodies are written afresh from the same
structure; the beam (`vector`, `ipoint`, `character`, `emit`) is shared. Resolved, `word` is an
8 × 4 table of 32 entries; `why(word, mode)` names the slot that decodes a word and why the others
don't. The page uses `KorzType340` whenever the CPU menu picks a Korz level.

**Tested.** [`src/korz/type340.test.ts`](src/korz/type340.test.ts) runs 200 random display files on
each level, each 340 on its own copy of the same random core with a light pen wandering over the
screen, restarting both with the same IDRS or IDLA whenever they stop: registers and the newest
segment after every cycle, every segment and core at the end, 600,000 cycles. Planting a DDS that
keeps the save register, an increment escape that doesn't escape, or a Y point that forgets its
address each fails it within 150 cycles. The cabinet lockstep rigs in `devices.test.ts` (SYMELEC,
the light pen over the Titan link, the display race, the Turing tape, the Forth hand) run
`KorzType340` on the Korz side against `Type340` on the reference side.

**Cost: none measured.** `node scripts/korz-bench.mjs hand --display slots` against the default:
13 ns a step compiled, 43 resolved, against 13 and 42, with the same end state.

**Planned.** The 340 fetches its words through the CPU's `read` as `who: cpu`; saying `who: device`
lets the memory panel and the watches tell display fetches from CPU reads. Teaching uses then
follow from the slots, not from extra code:

- An observe slot on `{ mode: "vector" }` draws each vector into the slow-motion beam view as it is
  decoded, with the display-file address it came from.
- The edge and light-pen flags are what make SYMELEC interactive. A patch slot on `{ mode: "point" }`
  can inject a pen hit at a chosen point, so a test drives the pen menus without a mouse.
- The compiler can compile a display file that does not change into one function that emits its
  segments. That is the display's own `emit`, the CPU kit's stacking rule
  ([KORZ-CPU.md](KORZ-CPU.md#stacking-instruction-sets)). The PDP-7 compiler does not do it today:
  a 340 IOT becomes a call to `m.go.iot` with the device and the pulse filled in.

### Showcase: the Turing machine

The cabinet's Turing engine ([`src/plugins/turing.ts`](src/plugins/turing.ts), device 054) runs a
transition table out of PDP-7 core: one word per (state, symbol), `[move:2][write:4][next:12]`, at
`TABLE + state × NSYM + symbol`, with the all-zero word meaning "no transition". Its IOTs split on
`pulse & 060` into four groups: status (skip on a flag, read, load and go), state (skip while
running, read, resume), mode (single step, set the mode, stop) and the last emitted character. On
the `iop` selector that is a `sub` dimension beside `device` and `iop`, and ten slots.

The table itself is where Korz fits best. The engine still runs tables written as words. The sea
that writes those words, and that steps the tape itself, is [`src/korz/tm.ts`](src/korz/tm.ts).
A transition table is a rule table, like CAM-6's: a
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

The loop is `TmSea.tabulate`: the same sea, written into the words the engine reads, exactly as
`compileRule` fills CAM-6's table. `binaryIncrementer()` is this sea, and `TmTape` runs it with no
PDP-7 in the room: `"1"` becomes `"10"`, `"11"` becomes `"100"`. State 0's row comes out zero, which the engine reads as halt.
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
3. **Built.** The IOT bus as timed IOP pulses; every device in the cabinet as slots (clock,
   teletype, paper tape, RB09, Type 340, Turing engine, Ultimate machine, Tiny Titan, titan-files,
   DataHand), in lockstep against their `iot()` methods
   ([`src/korz/iop.ts`](src/korz/iop.ts), [`src/korz/devices.test.ts`](src/korz/devices.test.ts)).
   **Built:** the 340's own instruction set as slots, against `Type340`'s switch
   ([`src/korz/type340.ts`](src/korz/type340.ts)). **Built:** domain kits on the one sea
   ([domain kits](#domain-kits)): the CPU host, the device adapter, Life, and the Turing rule sea,
   which steps a tape and tabulates the words the engine reads
   ([`src/korz/domains.test.ts`](src/korz/domains.test.ts)). The engine still fetches those words
   from core. Not yet: the Forth device's primitives as slots, and device memory traffic as
   `who: device`.
4. **Built.** The resolver on the PDP-7: per-selector tables, 34 M steps per second on UNIX with
   the devices on the IOP bus and event-driven.
5. Page-set normal forms with the brute-force tests; the apple2 bus on the interpreter, against
   microM8 ([microm8/PLAN.md](microm8/PLAN.md), steps 1–2), in [`src/korz/apple2`](src/korz/apple2/).
6. The resolver for apple2: table sets, page kinds, interned chains, the opcode table,
   invalidation.
7. Standard slots, and compiled page dispatch.
8. Compiled blocks: **built** for the PDP-7, with per-word invalidation
   ([KORZ-COMPILER.md](KORZ-COMPILER.md)). **Built** for the 6502 as straight-line blocks that call
   the switch for everything else ([`src/korz/compile65.ts`](src/korz/compile65.ts)). Not yet: a
   fetch slot whose `emit` continues the block through a second instruction set
   ([KORZ-CPU.md](KORZ-CPU.md#stacking-instruction-sets)).

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
