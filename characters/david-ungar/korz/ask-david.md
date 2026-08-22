# ASK David — the open questions, collected

*Part of the [Korz cauldron](README.md). Every question the design
raises that only David Ungar can answer well, gathered from the
documents that raise them — the agenda for the conversation.*

## The tier architecture ([design.md](design.md))

1. **Does the JIT framing land?** Crystallize/deopt is Self's
   speculative optimization applied to *semantics* — is that a
   continuation of the Self VM work or an abuse of it?
2. **Where does the tier boundary want to sit?** His VM instincts on
   what "hot and stable enough to compile" means when the
   interpreter is a language model — and how eagerly to recompile
   after a deopt.
3. **Should `blend` frighten us?** Method combination by semantic
   merge ([the troll's mixture](examples/troll-blend.md)) is either
   the answer to Korz's composition problem or a new kind of bug no
   debugger can see. (The troll wears his weights as anatomy; is
   that a debugging story or a dodge?)
4. **Is prose-in-guards a feature or a moral hazard?** The strict
   tier's refusal to compile it is the only discipline on offer.

## The dispatch semantics

5. **What are derived dimensions, formally?** The
   [CA case study](case-cellular-automata.md) finds two species:
   **aggregates** (Life's `live_neighbors`, a sum used as a
   dimension) and **coordinate transforms** (CAM-6's Margolus
   neighborhood: `C`/`CW`/`CCW`/`OPP` as permutations of the Moore
   compass indexed by phase dimensions `T`/`V`/`H`). Are both
   ordinary dimensions, a new guard kind, or evidence that
   dimensions form an algebra?
6. **Would Korz accept a scored or stochastic dispatch mode?** The
   Sims ranks all matching advertisements and dithers among the top
   N ([the auction](examples/sims-advertisements.md)); Korz
   legislates ties away. Is the specificity lattice's determinism
   the point, or would he buy dispatch as an auction — with
   temperature as a dimension
   ([the MOODY reading](examples/moody-temperature.md))?
7. **Coordinates as distributions.** `world: {zork: 0.7, adventure:
   0.3}` turns a binding into a mixture and sampling into a special
   case of blending. Is that still Korz, or a different (worse?
   better?) language wearing its clothes?
8. **The null family.** Korz has no null coordinate — dodged bullet
   or missing feature? Korz′ splits null's meanings into unmentioned
   / `isKnown` / named sentinels / deopt
   ([epistemics.md](epistemics.md)) and keeps one benign null as
   dimension-indexed delegation
   ([sparse-shadow-trees.md](sparse-shadow-trees.md)) — does that
   partition survive his scrutiny? And which parent function did the
   Self prototype's delegation *actually* use when hierarchies
   multiplied?

## The hosting and tooling story ([hosting-moollm.md](hosting-moollm.md))

9. **How much of the prototype's IDE was Korz needing an IDE, and
   how much was the Self image needing a window?** If the slots had
   been files in a repo — visible to `ls`, `grep`, and `git` — what
   tooling would he have actually missed? Is a saved-view interface
   file (durable, versioned) what the IDE's on-demand slot grouping
   wanted to be?
10. **Hosting symmetry.** Korz-in-Self took machinery; Self-in-Korz
    takes only restraint (guard everything on `rcvr`). Does hosting
    Korz in Self predict that a filesystem can host both readings in
    one repository — and did the prototype ever exploit the
    asymmetry?

## The history

11. **The Conscientious Objectors meetup** — the Kaleida gathering
    of the ScriptX object-system team and the Self team. Who was
    there? (Don recalls
    [Dan Bornstein](../../dan-bornstein/README.md), who implemented
    ScriptX's CLOS-like multimethods, in the room — cross-examine.)
    What was argued, and did anything from either side ship in the
    other?
12. **Korz's unpublished residue.** The prototype had an
    interpreter, debugger, and partial IDE in Self — what survives?
    What did the papers leave out that the implementation knew?

## Where the rest of the ASKs live

[korz-notes.md](korz-notes.md) carries Don's Q&A working notes on
the papers, with embedded ASKs on nulls, JIT history, Linda, layers,
mirrors, and Emacs buffer-locals — those stay in their reading
context rather than being duplicated here. The
[deep dive](../sources/korz-paper-deep-dive-moollm-mapping.md) ends
with its own open-questions list, which this page subsumes.
