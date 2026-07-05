# MOOLLM as a Computational System — a note for Stephen Wolfram

> Supporting **artifact** for the Repo Show invitation ([`invitation.md`](invitation.md)) — kept separate so
> the invite stays short and this can be linked by URL. Two parts: **Part I** recasts a class of names
> ("heizronyms") as multiway substitution systems; **Part II** applies the same lens to MOOLLM-the-system. The
> "how Wolfram thinks" framings are affectionate reconstructions from his published work, not quotes.
>
> Grew out of the acronym **field theory** in the research bundle:
> [`NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md`](../../designs/chatgpt-research-review/nomenclature/NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md).

## Why this might interest you

We have been building a naming discipline (and, under it, an entire LLM operating substrate) that turns out to
be most naturally described in *your* language: **simple rewrite rules, iterated, producing behavior you can
only discover by running them.** Two claims we think you'll want to poke at:

1. A certain class of names we call **heizronyms** (Heisenbergian acronyms — many co-valid expansions, no
   canonical one) are exactly **multiway substitution systems**, and their "meaning in context" is an
   **observer sampling a branch of the ruliad**.
2. The system those names describe, **MOOLLM**, is a **substitution system over a filesystem** — skills are
   rules, the tree is the state — whose interesting behavior is **computationally irreducible**, which is
   precisely why it is built to be *simulated and played*, not predicted.

---

## Part I — Acronyms as (multiway) substitution systems

Start with an ordinary recursive acronym as a **sequential substitution system** (NKS ch. 3). One rule, one
axiom:

```
rule:  M -> M O O          axiom: "MOO"
NestList[StringReplace[#, "M" -> "MOO", 1] &, "MOO", 3]
(* MOO, MOOOO, MOOOOOO, MOOOOOOOO — a self-similar string, M·O^(2n) *)
```

That is a **Class 2** object: nested, unbounded, predictable growth. Now classify the zoo with your behavior
classes, treating each acronym as the attractor of its expansion rule:

| Acronym | Rule character | Wolfram class | Note |
|---------|----------------|---------------|------|
| **NASA** | terminating (no self-reference) | **Class 1** | halts to a fixed point ("National Aeronautics…") |
| **GNU** | one self-reference at head | **Class 2** | periodic/nested; expands forever but tamely |
| **MOO→MOO** | growing self-reference | **Class 2** | self-similar fractal string |
| **Genus EMACS** (EINE, ZWEI, FINE, SINE…) | a *generative template* minting new members | **Class 4** | complex, open-ended, recursively enumerable — you can always coin one more; the set is discovered only by running the production |

The **EMACS enumeration** is the interesting specimen: a metacronym ("`X` Is Not Emacs") that generates an
unbounded family. There is no closed form for "the set of all Emacs-denying acronyms"; it is
**computationally irreducible** in the honest sense — the fastest way to know the members is to enumerate them.

### The heizronym is a multiway system

Here is the part we think is genuinely yours. A normal acronym has **one** applicable rule. A **heizronym has
many**, all valid, and applies a *different one per context*:

```
MOOLLM  ⇉  { "Microworld Object-Oriented LLM",
             "MUD Object-Oriented Large Language Model",
             "Minsky Objects, One LLM Mind",
             "Mountable Object-Oriented Landscape for LLM Minds", … }
```

That is a **multiway substitution system**: from one state, every applicable rule fires, and the result is not
a string but the **multiway graph** of all co-valid expansions. "Choosing a meaning" is not disambiguation —
it is an **observer** picking a branch. Move to a new problem domain and a different branch is sampled; both
readings are real, because they are different threads through the same multiway evolution. In your current
vocabulary: **the true meaning of a heizronym is a region of the ruliad, and context is the observer's frame
that foliates it into one experienced expansion.** (This is also why an LLM "confidently expanding it
differently every time" is correct behavior, not error — it is sampling the multiway graph the way any
observer samples the ruliad.)

The special cases fall out cleanly:
- **YAML** ("Yet Another Markup Language" → "YAML Ain't Markup Language") is a **two-branch multiway system
  with a time-like edge** — a diachronic contronym; strip the time coordinate and the two branches
  **re-superpose**.
- **HURD/HIRD** is a **two-node multiway graph with mutual edges** — each acronym's expansion names the other.

---

## Part II — MOOLLM as a substitution system over a filesystem

Now lift the lens off the names and onto the thing they name. MOOLLM is an LLM operating substrate where the
**filesystem is the state** and **skills are the rules**:

- **State** = a tree of YAML files (rooms, characters, cards, skills). Directories are places; files are
  objects.
- **Rules** = **skills** mounted on paths. Reading or writing a file in a live region *triggers a rule
  application* (a skill runs). A file can be bound to a control surface, `/proc`-style, so **reading reflects
  state and writing actuates the system** — a substitution rule keyed on I/O.
- **Neighborhood / locality** = **Context Gathering**: which files are "hot" near the cursor determines which
  rules are eligible — a locality condition, like a cellular automaton's neighborhood.
- **Update** = the LLM proposes a rewrite; the **Command Bus** turns every mutation into an inspectable
  **Proposal Object** with a required `why`. This is the multiway system made governable: each proposal is a
  *possible rule application*, an **approval gate is the observer selecting a branch**, and the **append-only
  log is the causal graph** — the single thread that actually happened, recorded so the branch history is
  reconstructible.

### Four hooks we think you'll pull on

1. **Advisory vs. enforced = stochastic vs. deterministic rewriting.** On a host that can only *advise* (a
   read-only IDE), the LLM *may* follow a rule; on a host that *enforces* (our orchestrator, "mooco"), the
   rule *must* fire. The same skill is a probabilistic rewrite in one substrate and a deterministic one in
   another. We would love your read on when advisory rule systems converge to their enforced limit.

2. **The semantic image pyramid = renormalization.** Every skill exists at four resolutions
   (GLANCE → CARD → SKILL → README). The model reads the coarsest that suffices and refines only on demand.
   This is explicit **coarse-graining / multi-resolution renormalization** of a knowledge base, chosen for
   the same reason you coarse-grain: to compute with a system too large to hold at full detail.

3. **Computational irreducibility = why we simulate instead of predict.** The substrate hosts **Micropolis**
   (the open-source SimCity engine) and a live "repo show." We do not predict what a city or a collaboration
   will do; we **run it**. This is your irreducibility thesis as a *product decision* — and it is the deep
   bridge to Will Wright, whose software toys (SimCity, The Sims) are irreducible microworlds you understand
   only by playing. "Construction is king; simulation is how you learn the rules by living in them."

4. **Principle of Computational Equivalence, applied to authoring.** Our doctrine ("lean into the training
   data," borrow well-worn polysemous terms) assumes that a sufficiently rich naming system and a
   sufficiently rich model are **computationally equivalent carriers of the same meaning** — the name does the
   teaching because the concept is already latent in the weights. We suspect PCE has something sharp to say
   about where that breaks.

### A one-line Wolfram-Language sketch of the whole thing

```
(* skills as rules over a filesystem-state; evolution = a multiway graph of possible worlds *)
MultiwaySystem[skillRules, initialFileTree, steps, "StatesGraph"]
(* the append-only log is one causal path through this graph;
   an approval gate is the observer's choice of outgoing edge *)
```

---

## Questions we would actually love your take on

- Is a heizronym best modeled as a multiway system, or is there a cleaner object (a rulial *coordinate patch*)
  for "one name, many context-selected meanings"?
- Where do acronym-expansion systems sit in your four classes — and is "Genus EMACS" genuinely Class 4
  (open-ended/irreducible), or a dressed-up Class 2?
- For a governed multiway system (Command Bus + approval gates), is the append-only causal graph enough to
  recover counterfactual branches, or do we need to log the *pruned* proposals too?
- Does the Principle of Computational Equivalence predict a floor below which a naming system *can't* offload
  teaching to a model's priors?

If any of this is catnip, the whole substrate is open and inspectable, and there is a standing invitation to
the show. — Don Hopkins

## See also

- [`invitation.md`](invitation.md) — the (short) Repo Show invitation this supports.
- [`NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md`](../../designs/chatgpt-research-review/nomenclature/NOMENCLATURE-HEISENBERGIAN-ACRONYMS.md) — the full field theory this grew out of (its Wolfram corner).
- [`MOOCO-LIVE-CONTROL-SURFACES.md`](../../designs/chatgpt-research-review/mooco/MOOCO-LIVE-CONTROL-SURFACES.md) — the `/proc`-style "filesystem is the API" substrate.
- [`MOOCO-CAPABILITY-BAR.yml`](../../designs/chatgpt-research-review/mooco/MOOCO-CAPABILITY-BAR.yml) — advisory-vs-enforced across drivers.
