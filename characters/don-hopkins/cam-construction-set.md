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

## Show beats

1. **Assemble Life on air**, from empty canvas to running glider, naming each block as it
   goes down. Under five minutes if the components are right — and if it isn't, that's the
   design review.
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

*Status: design, not built. The components are a proposal; the fidelity claims are
unverified pending a pass through the book with Norman.*
