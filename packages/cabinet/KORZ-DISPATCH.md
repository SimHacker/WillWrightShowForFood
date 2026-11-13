# Korz dispatch for emulators, in TypeScript

Design. Nothing here is built yet.

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
`slot`). microM8's interpreter instances are **VM slots**. microM8's own identifiers (`SlotCard`,
`SW_SLOTC3ROM`) keep their names.

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
- **The same ancestor for code generation.** James Gosling's Ace (1989) generated Sun's bitblt
  routines from one description specialized across depth, rasterop and clipping. Compiled page
  dispatch and compiled blocks are that kind of generator.

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

## Other machines

The same sea fits the cabinet's other machines; these are the first candidates, not commitments.

- **The PDP-7.** IOTs ([`src/bus.ts`](src/bus.ts)) carry a device code and pulse bits; a `Device`'s
  `iots` list is a guard on the device dimension, and per-pulse behavior is slots on the pulse bits.
- **The C64.** Its PLA banking (`LORAM`, `HIRAM`, `CHAREN`, `GAME`, `EXROM`) selects RAM, BASIC,
  KERNAL, character ROM, I/O or cartridge per region: configuration-guarded mapping slots, the
  language card's pattern with five bits.

## Steps

1. Normal forms and set operations, with the brute-force tests.
2. The interpreter, `why`, views, install-time ambiguity, layers and `next`.
3. The Apple bus on the interpreter, against microM8 ([microm8/PLAN.md](microm8/PLAN.md), steps 1–2).
4. The resolver: table sets, page kinds, interned chains, the opcode table, invalidation.
5. Standard slots, and compiled page dispatch.
6. Compiled 6502 blocks (microM8 plan step 14).

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
- James Gosling. Ace, the code generator for the bitblt and vector routines of Sun's Shapes library,
  1989 ([notes](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/cam-construction-set.md#ace-gosling-already-built-stage-2-for-exactly-this-problem)).
- Jeff Bezanson, Jiahao Chen, Ben Chung, Stefan Karpinski, Viral Shah, Jan Vitek and Lionel Zoubritzky.
  *Julia: Dynamism and Performance Reconciled by Design*. OOPSLA 2018. World age.
