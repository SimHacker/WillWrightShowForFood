# The CAM Construction Set — the machine itself, rewireable 🔲🧩

*Don's design. The step past "CA rules as a block palette": expose the **datapath**, so the
emulator is something you assemble on screen and the historically accurate CAM-6 is one
particular way of wiring it up.*
[Portrayal standards](../../schemas/portrayal-standards.md) ·
Strategy: [Snap! visual engines / fundable goals](snap-visual-engines-fundable-goals.md)

> **On the name.** **Construction Set**, deliberately — after
> **[Bill Budge](../bill-budge/README.md)'s Pinball Construction Set** (1983), which this repo
> already calls the archetype of the genre and already pays tribute to with the
> [Faceball Construction Set](../../apps/performance-space/faceball-construction-set.yml).
> PCS is the exact precedent: parts you drag together, and the machine runs *immediately*,
> with no compile step and no distinction between building it and playing it. Budge is
> upstream of Will Wright, so the name puts this where it belongs in the family. Short handle:
> **the CAM Set**.

## The move

Most CA toys give you rules and hide the machine. The book doesn't — *Cellular Automata
Machines* teaches the **architecture**, and the architecture is the interesting part.
Toffoli and Margolus's whole insight is a hardware insight: don't evaluate the rule in the
inner loop, precompute every answer into a **lookup table** and let the table be the
program.

So build the machine out of visible parts. **Every functional block of the CAM-6 becomes a
Snap! component with wires going in and out** — cell planes, neighborhood formers, the
address assembler, the rule table, the phase generator, the color map, the instruments. You
snap them together. Wired one way you get a historically accurate CAM-6. Rewired, you get
things no CAM-6 could do, and you can see exactly which wire you moved to get there.

**The lookup table stops being an implementation detail and becomes a component on the
canvas** — a thing with an address bus arriving and a value leaving, which you can inspect,
hand-edit, or fill from a rule. That single piece of exposed plumbing is the whole lesson
the book teaches and nearly every modern CA toy hides.

## The component inventory

Blocks, grouped by what they are in the hardware. Each is a Snap! block with typed inputs
and outputs; each is independently swappable.

**Storage**
- **Cell plane** — a grid of cells, N bits deep. Multiple planes stack in the same cell
  site, which is what makes Echo and heat-under-CA possible.
- **Plane writer** — where a result lands (`>PLN0` and friends).
- **Plane shifter** — moves old state up a plane each step. This block *is* Echo (book §3.2).

**Neighborhood**
- **Neighborhood former** — the block that taps which cells feed the rule. Interchangeable
  variants: **Moore** (8 + center), **von Neumann** (4 + center), **Margolus** (2×2 blocks
  with the grid offsetting on alternate steps), and **custom** for anything you invent.
  Swapping this block is the single most instructive edit in the whole system.
- **Phase generator** — even/odd step, horizontal/vertical phase; what the Margolus
  neighborhood needs and what multiplexed rules ride on.

**The table path**
- **Address assembler** — concatenates the tapped neighbor bits into an index. Draw this
  wire bundle and the reader understands the machine.
- **Rule table** — the lookup memory itself. Inspectable as a real table, hand-editable,
  savable, diffable.
- **Rule compiler** — takes a rule *as a value* and runs it over every possible neighborhood
  to fill the table. In Snap! a rule can be a first-class procedure, so this is an ordinary
  higher-order block: `fill table from (rule)`.

**Output and instruments**
- **Color map** — value to color, editable live, with the notch/X-ray trick available.
- **Histogram**, **event counter**, **space-time diagram** (the 1+1D view for one-dimensional
  rules), **zoom views**, **X-ray slice**.
- **Input tools** — brushes, spray, line, randomize, image import, webcam.

**Between machines**
- **Layer bus** — one engine's output plane wired into another's input. This is *ganging
  CAM-6 cards*, which the hardware did physically and which the software version can do
  arbitrarily.

## The phase matrix — the component the marble rules were hiding

The most transferable thing in the existing monolith is buried inside the marble rules,
where it looks like knob-twiddling. It isn't. Don walks through it in detail from **15:45 to
22:14** of the [demo](../norman-margolus/the-cam6-demo-transcript.md#modulating-the-phase-time-value-space-1655),
and it generalizes into a component the whole Construction Set should have.

The rule holds a **bank of 16 convolution kernels**. What makes a world is not the bank —
it's **what selects from it, per cell, per step**. Those selectors can all run at once, each
with its own depth, and they sum:

| Selector | What it reads | What it does to the picture |
|---|---|---|
| **Phase offset** | nothing — a constant | Every cell uses one kernel. The whole field flows one direction. Don calls it *"the DC voltage."* |
| **Phase shift step** | the clock, at a chosen rate | The kernel advances over time — *"how fast do we stir it."* Slow bakes each effect in; fast is the wavy stuff that hurts your brain. |
| **Phase shift cell** | the cell's own value | Structure becomes its own cause. Pattern folds along its contour lines; a value change shows up as a visible crease — *"a wrinkle in phase."* |
| **Phase shift X** / **Y** | position, at independent frequencies per axis | Standing zigzags whose chunkiness you dial. Different X and Y frequencies beat against each other. |
| **Cell shift** | an irregular but **spatially coherent** source | Breaks up regularity without turning it into noise. |

Dial all to zero but one and you can see what each contributes — which is how Don teaches it
in the video, and it's the right default UI behavior. Run several and they interfere.

**That is a modulation matrix**, the architecture of a modular synthesizer: a small set of
**sources** routed with adjustable depth to a small set of **destinations**, where the
character lives in the routing rather than the parts. Sixteen kernels is a small bank; the
matrix is what makes it a large space.

So make it a **component, not a rule feature**. A phase matrix block takes any bank-selecting
input and drives it from the same source palette. Wire it to:

- **the kernel bank** — what the marble rules already do;
- **the rule table** — different lookup tables in different regions or at different times,
  which is the `RISCA` "paint programs onto the grid" idea reached from the other direction;
- **the neighborhood former** — Moore here, von Neumann there, switching on a clock;
- **the color map** — the X-ray notch sweeping under modulation.

And the source palette is open: the clock, the cell, position, noise — plus, once the
continuous half is on the same bus, an **audio envelope** (Don's *"synchronize it with the
music's time instead of the simulation's time"* at 22:14) or a **webcam-derived signal**,
which is exactly how [WarpOMatic](warpomatic-video-background-removal.md) drove its feedback
parameters from the performer's own position and silhouette area. Same architecture, one
system apart.

## One pattern, four scales

The phase matrix isn't a special case. Once you write it out, **most of what the monolith
already does is the same component wearing different clothes**: a **bank** of behaviors plus
a **selector** that decides which one applies, here, now. The zoo collapses.

| Layer | The bank | What selects from it |
|---|---|---|
| **Marble / flow rules** | 16 convolution kernels | the phase matrix — constant, clock, cell value, X, Y, coherent noise |
| **Anneal arbiter** | two or more CA rules (Life here, Brian's Brain there) | a **third CA** — anneal's majority-with-near-tie-inversion vote, which partitions the space into domains and hands each domain to a different rule |
| **RISCA** | ~16 instructions | the **cell's own top four bits**, with the bottom four as the operand |
| **Echo / heat** | which bit planes route where | plane masks — a static selector, the degenerate case |

So the Construction Set needs **one** core component, parameterized, not four. A `bank` block
holding N behaviors and a `selector` input that resolves to an index. Everything else is
which selector you plug in and how many entries the bank has.

That's what makes it a construction set rather than a menu. And it means each of the
following is a wire change, not a new subsystem:

- Drive the **rule table** from the phase matrix and you get regime changes over time and
  space that RISCA reaches by a different route.
- Drive the **anneal arbiter** from a clock and the domains breathe.
- Let a RISCA opcode's operand be a **phase offset** and the painted program carries its own
  modulation depth.
- Nest them: a selector whose source is *another bank's output*. This is where it stops being
  a config format and starts being a language.

### RISCA, taken seriously

The Ridiculous Instruction Set deserves more than the joke, because it's the most radical
thing in the existing engine. Splitting the cell into **opcode field** and **operand field**
means **the rule a cell obeys is stored in the cell**. Consequences worth building on:

- **Programs are painted, and adjacency is the calling convention.** A patch of Life next to
  a heat diffuser next to a copy-northward region interact wherever they touch, with no
  wiring, no ports, no API. In the demo the "logic calculator" visibly sucks Life into
  itself. That's two hand-painted programs discovering each other at a boundary.
- **The eyedropper is a debugger.** Sample a cell, paint with it — you have copied behavior,
  not appearance.
- **Opcodes should be open.** Any layer in the Construction Set ought to be installable as an
  opcode, so the instruction set is user-extensible rather than a fixed sixteen.
- **Opcodes that write opcodes.** Self-modifying spatial code: a region that rewrites its
  neighbors' instruction fields is a constructor, and von Neumann's 29-state machine is
  sitting right there as the historical target.
- **Movement instructions already exist** — the demo's copy-in-a-direction opcodes slurp Life
  across the grid. Give those a proper operand and you have transport as a primitive.

And here's the bridge worth naming: **RISCA is a proto-Movable Feast Machine.** In
[Dave Ackley](../dave-ackley/README.md)'s MFM, each **atom** carries a **type**, and the type
determines the code that runs on it. Don arrived at typed cells dispatching their own
behavior independently, from the paint-program side. Dave formalized it and asked what
happens when you also stop assuming a global clock — which is the next section.

## Iteration order is a plug-in

This is the axis nearly every CA system hardcodes and hides, and exposing it is the biggest
idea here after the lookup table itself.

**Iteration order is not a performance detail. It is part of the rule.** Life updated
asynchronously is a different system from Life updated synchronously — not slower, *different*,
with different attractors. Any engine that bakes in "synchronous, whole grid, row-major" has
silently fixed a parameter its users don't know exists. So make the scheduler a component with
a plug-in interface, and put the variants in the palette:

- **Synchronous whole-grid.** Read the old state everywhere, write the new state everywhere.
  The textbook default, and one option among several rather than the law.
- **Row-major scan.** Required the moment a rule carries state across cells — which
  **error diffusion** does, by handing the averaging remainder to the next cell instead of
  discarding it.
- **Serpentine scan.** Alternate direction each row. The classic partial fix for the
  directional bias raster scanning introduces.
- **Four-rotation cycling.** Scan the grid rotated 0°, 90°, 180°, 270° on successive
  generations. Because a CA runs forever, the accumulated anisotropy **cancels over time**
  rather than merely being scrambled within one frame — which is strictly better than
  serpentine for this use, and is only available to you because you're iterating rather than
  rendering one image. Without it, error diffusion's residual always drifts the same way and
  the "worming" artifacts acquire a permanent grain.
- **Block-partitioned (Margolus).** Worth saying out loud: **the Margolus neighborhood is
  already an iteration-order plug-in** and everyone treats it as a neighborhood. Updating 2×2
  blocks atomically with the block grid offsetting on alternate steps is a *scheduling*
  decision, and it's the scheduling decision that buys reversibility and conservation. Once
  the scheduler is a visible component, that stops being folklore and becomes the obvious
  first example.
- **Random event windows (MFM).** Ackley's asynchronous model: pick a site at random, run the
  rule atomically on a window around it, no global clock at all. **Concurrent windows are safe
  when they don't overlap**, so parallelism falls out of spatial separation rather than
  barrier synchronization — which is what makes it **indefinitely scalable**: add hardware
  without redesigning the program. It's also **robust-first** in the strict sense, because
  there is no global synchrony left to lose when part of the machine fails.
- **Tiled parallel dispatch.** The GPU version of the same non-overlap argument, with
  workgroups instead of random draws.

Two payoffs from making this a component:

**The scheduler can be modulated like anything else.** Plug the phase matrix into the
iteration-order selector and the update discipline itself becomes a function of time,
position, or cell value. Synchronous in the calm regions, asynchronous where it's busy.

**Comparisons become one wire.** Run the same rule under four schedulers side by side and
watch which structures survive. That's a real experiment, it's a good show segment, and it's
the sort of thing that's currently a rewrite instead of a swap.

## Rewiring is the curriculum

The point of components is that the lesson plan is a sequence of patches, each one edit away
from the last:

1. **Life.** Moore former → address assembler → table → plane 0. The minimal machine.
2. **Life with trails.** Add a plane shifter. Nothing else changes. Echo is not a feature,
   it's a block you inserted.
3. **Billiard-ball logic.** Swap the Moore former for Margolus and add the phase generator.
   Same table path, reversible physics out the other end — and the reason *why* becomes
   visible, because you can see that the rule now rewrites a whole block at once.
4. **Heat under CA.** Two engines sharing one cell array, split by bit plane, with a leak
   wire from the CA into the diffusion. The "heat pollution" from the demo, drawn.
5. **Ganged layers.** N engines in parallel with cross-wiring — what the hardware needed
   extra boards for.

Each of those is a chapter playground, which is the thing Norman gave permission for.

## "Historically accurate" as a test, not a claim

The target is a configuration that **is** a CAM-6, and the way to make that mean something
is to make it falsifiable:

> Assemble the CAM-6 patch, load the **Forth rules printed in the book**, run them, and
> check the output against **the book's own figures**.

That's a real acceptance test with a published answer key, and it's the same contract the
existing `CAM6.js` already honors — book Forth rules compiled to lookup tables, imported
and matched. Passing it earns the word "accurate." Until then the honest phrasing is
"CAM-6-shaped."

**To verify before claiming fidelity:** the sub-array organization and plane depth, the exact
neighborhood tap sets and their address-line ordering, table width, the phase and event-
counter details, and how ganged boards actually exchanged data. Those come from the book and
from the CAM-6 Forth sources — not from memory, and not from this document. The
[letter to Norman](../norman-margolus/the-cam6-demo-for-norman.md#who-jits-the-jitter-a-connections-detour)
already flags that its "8 bits in, 8 bits out" framing is the essential kernel rather than
the real datapath. Same caution applies here, and Norman is the person who can settle it in
one sitting.

## Then break it on purpose

Once the accurate configuration exists and passes, everything interesting is a modification
of a working reference:

- **Neighborhoods that never existed** — hexagonal, aperiodic, distance-2, or one wired from
  a picture.
- **Tables from anywhere** — hand-painted, learned, imported from an image, generated by
  another CA.
- **Instruments as plugins** — Jim Crutchfield's structural-complexity readouts (excess
  entropy, ε-machines) as a meter you clip onto the bus, next to the histogram.
- **Views as plugins** — cells as animated SimCity tiles, cells as sound grains
  ([Musical Gas](musical-gas-granular-ca-synth.md)), 1+1D space-time diagrams.
- **The continuous half** — a warp/feedback engine on the same bus, which is where this
  meets [WarpOMatic](warpomatic-video-background-removal.md) and the
  [Crutchfield machine](../jim-crutchfield/crutchfield-machine.md). §5 of Crutchfield's 1984
  paper argues video feedback and lookup-table CA are one family; a shared component bus is
  what that claim looks like when you build it.

And every patch is a document: shareable as a URL, diffable, forkable, with the wiring
visible rather than buried in a config file.

## Why this needs both visual paradigms

Worth stating plainly, because it settles an open question in the
[Snap! engines doc](snap-visual-engines-fundable-goals.md), which lists blocks and patch
cords as complementary without saying where they meet. **This is where they meet.**

- **The rule is control flow.** "Count the neighbors, compare, decide" is a procedure, and
  Snap!'s first-class procedures are exactly right for authoring it and handing it to a
  compiler block as a value.
- **The machine is data flow.** Planes, formers, tables, and instruments are boxes on wires
  with data moving between them — [Bounce](levity-bounce-space-seed.md)-shaped, not
  block-shaped. Drawing a datapath as nested blocks would be a lie about its structure.

So the honest build is Snap! blocks for rules, hosted inside a patch-cord canvas for the
machine — which makes CAM-6-in-Snap! the first concrete reason to build the bridge, rather
than a nice idea deferred forever.

## Retire the XML. Generate the JavaScript. Believe in the JIT.

The monolith composes rules through a **commented XML string-templating system**. It works,
it got a lot done, and it should go. Its problems are structural rather than cosmetic:
it's stringly-typed, so nothing is checked until it runs; it has no composition semantics, so
"combine these two rules" isn't an operation, it's a paste; and meaning ends up in comments
the parser can't see, which makes the config a document pretending to be a program.

The replacement is **higher-order composition plus code generation**.

**Rules become values.** A rule is a function; a layer is a function; composing them is
function composition. In Snap! that's free — first-class procedures and lists are the
language, so `compose (rule) with (layer)` is an ordinary block that takes procedures as
inputs and returns one. In TypeScript it's just functions. Either way "combine these" becomes
an operation with a type, instead of template expansion with a prayer.

**Then emit JavaScript and let V8 compile it.** Don't interpret the composed structure per
pixel, and don't reach for WASM. **Generate specialized source for the exact configuration
that's currently wired up**, and hand it to the JIT:

- A disabled layer **disappears from the source**, rather than costing a branch per cell per
  frame.
- A constant phase offset **inlines its kernel**; the bank and the selector evaporate.
- The scheduler is **specialized** — the scan loop generated for four-rotation cycling is a
  different loop from the synchronous one, not the same loop with a mode flag.
- Everything downstream is straight-line, monomorphic code, which is exactly the shape a
  modern JIT is good at.

This is **[Vanessa Freudenberg](../vanessa-freudenberg/README.md)'s** lesson from SqueakJS,
and the repo already states her principle: **target JS, not WASM** — generate source and
trust the JIT, because the JIT has decades of adaptive optimization in it that a
hand-written interpreter will never match. She was right, and it's the right call here for
the same reasons.

It also closes the loop the [letter to Norman](../norman-margolus/the-cam6-demo-for-norman.md#who-jits-the-jitter-a-connections-detour)
opens. That section traces why `CAM6.js` runs fast — Self's inline caches and adaptive
optimization → Strongtalk → HotSpot → V8 — and asks *who JITs the jitter?* With codegen the
answer gets better: **the rule compiler and the JIT become two stages of one pipeline.**
Toffoli and Margolus's Forth compiled a readable rule down to a table that hardware executed;
now a block-composed rule compiles down to JavaScript that V8 executes. Same three-layer
architecture, one era later.

**And it generalizes the book's contract instead of abandoning it.** The lookup table is the
right target when the state is small and the neighborhood is finite — that's most of the
book, and those rules should still compile to tables and still match the book's figures. But
the table can't express many-state cells, continuous values, error diffusion carrying a
remainder across cells, or MFM event windows. So the compiler gets **two back ends**:

> **Table when it fits. Generated code when it doesn't. One front end either way.**

The user writes a rule once; the compiler picks the representation. That's the honest 2026
version of "don't evaluate the rule in the inner loop."

Two more reasons this is the right move for a *teaching* system specifically:

- **The generated source is readable, and should be shown.** Put it in a panel. You snap
  blocks together and watch the JavaScript for your machine appear, then set a breakpoint in
  it. A lookup table is opaque and a WASM blob is worse; generated source is the most
  inspectable artifact of the three, which matters more here than in a production engine.
- **It makes the pipeline itself a lesson.** Rule → composition → generated code → JIT →
  machine code is the same story as rule → Forth → table → TTL, and a student who has seen
  one can be shown the other.

**The honest caveats:** generated code has to be regenerated whenever the configuration
changes, so the edit-to-running latency needs watching in a live-coding context; and the hot
loops have to stay monomorphic or the JIT's help evaporates, which is a real constraint on
how clever the generator is allowed to be. Neither is a reason not to do it. Both are reasons
to measure.

## Show beats

1. **Assemble Life on air**, from empty canvas to running glider, naming each block as it
   goes down. Under five minutes if the components are right — and if it isn't, that's the
   design review.
1. **Same rule, four schedulers.** Synchronous, serpentine, Margolus blocks, and MFM random
   event windows, running side by side on identical seeds. Which structures survive is the
   whole argument for exposing iteration order, and it needs no explanation to be legible.
2. **One wire, different universe.** Swap Moore for Margolus live and let Norman explain why
   the physics changes.
3. **Open the table.** Show the actual lookup table filling up as the compiler runs, then
   hand-edit one entry and watch the universe change. Nobody ever gets to see this.
4. **Grade the fidelity.** Run the book's rules against the book's figures with Norman
   watching, and let him call out what's still wrong.
5. **Then break it.** Wire something the hardware could never have done, with the person who
   designed the hardware in the room.

## See also

- [`../norman-margolus/the-cam6-demo-for-norman.md`](../norman-margolus/the-cam6-demo-for-norman.md) — the letter; Act 2 is this
- [`../norman-margolus/the-cam6-demo-transcript.md`](../norman-margolus/the-cam6-demo-transcript.md) — the demo transcribed, with the jargon defined
- [`cam6-cellular-automata-machine.md`](cam6-cellular-automata-machine.md) — the existing monolith and its lineage
- [`snap-visual-engines-fundable-goals.md`](snap-visual-engines-fundable-goals.md) — the four-engine strategy this is the first slice of
- [`levity-bounce-space-seed.md`](levity-bounce-space-seed.md) — the patch-cord half
- [`../jens-monig/README.md`](../jens-monig/README.md) · [`../brian-harvey/README.md`](../brian-harvey/README.md) — Snap!, integration partners
- [`../dave-ackley/README.md`](../dave-ackley/README.md) — Movable Feast Machine: random event windows, asynchrony, indefinite scalability, robust-first
- [`../vanessa-freudenberg/README.md`](../vanessa-freudenberg/README.md) — SqueakJS; target JS not WASM, and believe in the JIT
- [`../jim-crutchfield/positive-feedback.md`](../jim-crutchfield/positive-feedback.md) — why the continuous half belongs on the same bus: Physica D 10, §5

*Status: design, not built. The components are a proposal; the fidelity claims are
unverified pending a pass through the book with Norman.*
