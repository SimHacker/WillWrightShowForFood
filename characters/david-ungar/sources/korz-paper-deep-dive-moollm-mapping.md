# Korz — paper deep dive and the MOOLLM mapping

*Analysis of published papers, prompted by Ungar's own pointers (Oct 2025
rollup, and again Aug 2026: "the same entity behaving differently in
different situations... Don't know if it relates"). It relates.
[Portrayal standards](../../../schemas/portrayal-standards.md).*

| Field | Value |
|---|---|
| Papers | *Korz: Simple, Symmetric, Subjective, Context-Oriented Programming*, Ungar, Ossher, Kimelman — Onward! 2014 ([ACM](https://dl.acm.org/doi/10.1145/2661136.2661147)); *Subjective, Multidimensional Modularity with Korz*, MODULARITY Companion '15 ([DOI](https://dl.acm.org/doi/10.1145/2735386.2735923)) |
| Lineage | Us (Smith & Ungar's subjective language) grown symmetric and multidimensional; SOP (Harrison & Ossher '93) made dynamic — same Ossher, composing at dispatch time instead of build time |
| Implementation | Prototype interpreter, debugger, and IDE built **in Self, on the Self VM** |
| First pointer | [Oct 2025 email rollup](2025-10-26-korz-email-hn-rollup.md) — "the natural extension of Self to multidimensional (context \| subjectivity)" |

## The name

The Onward! '14 paper, Appendix A, "The Name":

> The name "Korz" comes from Korzybski, whose *Science and Sanity*
> (Korzybski 1933) explained how much one's perspective influences one's
> perceptions and thinking.

Alfred Korzybski, general semantics: **the map is not the territory.** A
language of subjective objects, named for the philosopher of how
perspective constructs perception. (Korz is also an anagram of Zork —
same four letters, *not* a reversal; Korz backwards is "Zrok" —
unremarked in the record, presumably a happy coincidence.) Two Korzybski
resonances worth keeping: MOOLLM's rebuttal to the map/territory slogan
is that the map *can* be the territory if you make the map a directory —
the [Cross-Platform Troll's soul realms](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/troll/realms)
are maps of Zork and Adventure that are navigable territories inside him.
And Korzybski's **time-binding** — humans as the class of life that
transmits knowledge across generations through symbols — is the repo-show
thesis, stated in 1933.

## The model in five sentences

Korz combines **implicit arguments** and **multiple dispatch** in a
**slot-based model**. There are no objects: a system is a *sea of slots*
in a multidimensional space, and a slot pertains to any number of
**coordinates** (pure identities) along named **dimensions** rather than
being contained by one object. A message send happens in a **context** —
a set of dimension:coordinate pairs, partly explicit, partly carried
implicitly through the call chain — and dispatch picks the most specific
slot whose **guard** matches the whole context. Slots gather into
"objects" *subjectively*, per situation: the same sea groups one way
along `rcvr`, another way along `assertions`. No dominant decomposition;
no dimension outranks any other.

The worked example: `pop()` defined once with guard
`{rcvr <= stackParent}`; assertion checking added later as a second pop
guarded `{rcvr <= stackParent, assertions <= true}` — more specific, so
it wins when the context carries `assertions: true`. The kicker:
`main()` never mentions assertions; the binding flows through
implicitly. New dimensions of variation arrive without touching
intermediate code — no layers, no aspects, no Visitor refactor.

## Why it maps onto MOOLLM

| Korz | MOOLLM / [Game Pieces](https://github.com/SimHacker/moollm/blob/main/designs/GAME-PIECES.md) |
|------|----------------------|
| Same entity behaving differently per situation (subjective objects) | The [Cross-Platform Troll](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/troll) fronting zork-mind vs adventure-mind per world — a `world` dimension in the dispatch context |
| Slot guards (`{assertions <= true}`) | Buff conditions (`while:`, `expires_when:`) — a disabled buff is a guard that stops matching; nothing is removed |
| Context flows implicitly through the call chain | The current room, game, and season flow into every action without objects passing them along — an LLM context window does this natively |
| Coordinates in a dimension, no fixed object boundary | Side-relative move coordinates: one PAWN/NWAP move-set, interpreted per `side` — dispatch on team frame, not duplicated files |
| Slots gathered into subjective objects per view | [The Hague](https://github.com/SimHacker/moollm/blob/main/skills/experiment/experiments/turing-chess/plugins/revolutionary-chess/house-rules/THE-HAGUE.yml): the same piece is juror, witness, accused, pundit depending on which dimension you group by |
| Most-specific-slot-wins dispatch | Advertisement scoring generalizes this — see the dispatch spectrum below |
| IDE presents asymmetric views of a symmetric space | Semantic pyramid + directory views: the task dictates which dimension dominates the presentation |

## The dispatch spectrum: argmax, find-best-N, softmax

Korz dispatch is **argmax**: most specific slot wins, deterministically;
dispatch ambiguity is a problem the paper legislates with specificity
rules (their Appendix B). The Sims shipped ambiguity as a feature:
autonomous behavior scores all advertisements, then its **find-best-N**
primitive picks *randomly among the top N* — deliberate dither that
makes behavior organic instead of digitally predictable, converting ties
into personality. And an LLM's temperature sampling is find-best-N's
continuous generalization, native to inference.

Why dither at all? Three reasons The Sims discovered in production.
**Epistemics:** advertisement scores are approximations at best and
intentional lies at their cleverest (objects hustle — the fridge's
"open me if hungry" chains to raw food's "cook me" chains to the stove's
hot-meal pitch with an unstated house-fire clause), so argmax over lies
isn't optimization, it's being deterministically conned. **Exploration:**
random picks among strong candidates escape local maxima and, iterated,
find ways out of apparent dead ends — the wide possibility-space coverage
a Drescher schema learner needs. **Teachability:** visible imperfection
leaves room for the player to improve the character by overriding it —
a directed command forces one ad regardless of score, which is
programming by demonstration in disguise; the resulting skill gains
re-weight future auctions until the override becomes the habit. An agent
that always argmaxes cannot be taught by demonstration, because its
teacher has nothing to add. And the override should weigh heavy: a
forced pick is a **strong salience signal** to a Drescher-style schema
learner — the teacher explicitly marking *which* choice mattered, worth
a thousand unattended trials — which implies the unbuilt fourth stage,
**advertisements that learn**: not to be more persuasive but more
appropriate and helpful, re-tuning bids to the hearer's observed
outcomes, with persuasion arriving as earned trust once the hearer
discovers the ads serve the listener rather than the seller.

1. **argmax** — deterministic; compiles to a table lookup
2. **find-best-N** — still crystallizable: scoring table plus a *seeded*
   RNG (log the seed, so replays don't diverge)
3. **softmax** — temperature over judged salience; the LLM's home turf

The Korzish move: make **temperature a context dimension**.
`{temperature: 0}` recovers classical Korz; the party planner runs hot
while the accountant in the same call chain runs cold; a scene sets its
dither once and every dispatch below inherits it implicitly — the
`assertions: true` trick, applied to determinism itself. And the
dimension can be set by the *environment*: ambient heat comes from the
room, and the room inherits it, time-varying, from **moody media**
playing in it — music and video artifacts carrying parameter tracks of
heat per semantic tag, broadcast while they play
([MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md)).
A room whose implicit context dimensions are written by the stereo is
about as Korz as game design gets.

## The tiered-JIT thesis

The LLM is **tier 0 of a tiered JIT for microworlds**, and the adventure
compiler is the optimizing tier. The shared contract is contextual
dispatch over guarded slots (YAML files: buffs, minds, house rules,
advertisements). The LLM is the maximal interpreter — guards by
inference, unbound dimensions filled from latent space, and a generative
miss handler: unmatched sends improvise in character, then the ruling is
lifted into a slot. The deterministic VM runs the crystallized subset —
gelled schemas whose dimensions are enumerable and whose guards are
decidable compile to dispatch tables and ECS archetypes. Coherence comes
from subset semantics plus monotone extension (everything the VM runs
means the same to the LLM; everything the LLM adds, the VM defaults away,
Postel-style). And when runtime invalidates a compiled assumption —
[Revolutionary Chess](https://github.com/SimHacker/moollm/tree/main/skills/experiment/experiments/turing-chess/plugins/revolutionary-chess)
appends an organelle to the commons — you do what the Self VM does when
an optimized method's assumptions break: **deoptimize to the interpreter
tier**, which now means *re-engage the LLM*, lift the ruling, recompile.
Dynamic pessimization with inference as tier 0.

## Open questions for the conversation

1. Korz picks the most specific slot; The Sims ranks all matching
   advertisements and dithers. Would Korz accept a **scored or
   stochastic dispatch mode** — and would temperature be a dimension?
2. "Deoptimize to the LLM": what does thirty years of Self VM experience
   say about **where the tier boundary wants to sit** and how eagerly to
   recompile?
3. Korz's open problems — global dimension names, merging slot spaces,
   composition richness — MOOLLM has partial answers (directory
   namespaces, Postel + provenance, advertisement merging). Do they
   transfer back?

Related: [Oct 2025 Korz pointer](2025-10-26-korz-email-hn-rollup.md) ·
[Self entry points](self-entry-points.md) ·
[Don's tiered-JIT note](../../don-hopkins/deoptimize-to-the-llm.md) ·
[Teaching complicated systems without a manual](../../don-hopkins/teaching-complicated-systems-without-a-manual.md)
