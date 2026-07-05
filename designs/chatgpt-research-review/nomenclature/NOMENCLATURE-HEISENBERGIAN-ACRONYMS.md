# Heisenbergian acronyms (heizronyms) — ambiguity as a feature

> **The claim:** some of MOOLLM's most important names — **MOOLLM** itself, **CARD**, **K-line**, and their
> ancestor **UBIK** — are deliberately *not* pinned to one canonical expansion. They resolve differently
> depending on the context you observe them in, and that context-dependence is **designed in, not sloppy.**
> Don calls this a **heizronym**: a Heisenbergian acronym whose expansion you cannot fix without collapsing
> the very superposition that makes it useful.
>
> **Author:** Claude Opus, capturing Don's framing and defending it as sound cognitive engineering.
> A full **field theory of acronyms** (recursion topology, collapse bases, and the YAML/WINE/EMACS edge
> cases) sits below in *"A field theory of acronyms."*

---

## What a heizronym is

A normal acronym has one expansion: NASA is the National Aeronautics and Space Administration, always.

A **heizronym** has *many* valid expansions, selected by context, and no privileged canonical one. Observing
it in a given problem domain "collapses" it to the expansion that best projects the concept onto that domain.
Move to a new domain and it collapses differently — and both readings are correct, because the name's job is
to *communicate the idea in context*, not to encode one fixed string.

The name Heisenbergian is apt on two counts: (1) you can't measure the expansion without the context
disturbing which one you get, and (2) the "true" value is a **superposition** of all the useful projections,
not a hidden single answer you failed to read.

**Validity test (Don's rule):** an expansion is valid *if it communicates the idea correctly in that
context*. Invalid expansions exist, but validity is a context-dependent judgment about whether the reading
carries the meaning — not a lookup against one official definition.

---

## The canonical example: UBIK

Philip K. Dick's **UBIK** (1969) is the archetype. As far as anyone knows, PKD never gave a definitive
acronymic expansion, nor even confirmed it *is* an acronym. Yet the name is so **UNIVERSAL** — and "Universal"
is itself a good guess at what its initial **U** projects to — that readers expand it many valid ways:
**Ubiquitous**, **Universal**, and so on. The in-book ad copy treats UBIK as whatever-you-need-it-to-be (a
spray, a coffee, a principle of reality itself), which is precisely the heizronym move: the name is a
**stable pointer to an unstable, context-filled referent.** MOOLLM inherits this on purpose.

---

## A field theory of acronyms (the fun part)

The heizronym isn't a lone curiosity — it's one cell in a small periodic table. Once you notice that an
acronym's expansion can be *plural*, *time-varying*, *self-referential*, and *retrofitted*, you can classify
any acronym along a handful of independent axes. This section deconstructs **NASA, GNU, HURD/HIRD, PHP, WINE,
YAML,** and **EMACS** to map the space.

### Axis 1 — Cardinality: how many live expansions?

- **Monomial** — one expansion (NASA). The null case.
- **Bimodal** — exactly two (YAML out of time; WINE; PHP across its history).
- **Polytonal** — many (EMACS, MOOLLM, UBIK).

### Axis 2 — Collapse basis: what dimension selects the meaning?

Heizronym-ness is **basis-relative.** Every multi-valued name collapses along some observable dimension; deny
the observer that coordinate and the name stays in superposition.

- **Domain basis** — MOOLLM, UBIK (which problem you're discussing).
- **Time basis** — YAML, PHP, WINE (what year it is). *This is why YAML feels collapsed to a historian and
  superposed to someone with no clock: same name, measured in different bases.*
- **Free / humor basis** — EMACS (pick whichever expansion suits the joke).

### Axis 3 — Synchronic vs diachronic: coexist or replace?

- **Synchronic** — expansions co-exist *now* (heizronym proper: MOOLLM, UBIK, EMACS).
- **Diachronic** — a later expansion *replaced* an earlier one over time (PHP, WINE, YAML). Collapses in the
  **time** basis.

### Axis 4 — Recursion topology: a per-letter property

Recursion is fundamentally a property of the **letter/position**, not the whole word. Model the acronym as an
**expansion graph** (each letter's expansion words are nodes; an edge points back to the acronym if that
letter self-refers):

- **word is recursive ⟺ the graph has a cycle**; **grounded (well-founded) ⟺ it's a DAG** that bottoms out.

Per-letter recursion kinds, borrowing recursion theory:

| Kind | Which letter self-refers | Example |
|------|--------------------------|---------|
| **grounded** | none (well-founded, terminates) | NASA; EMACS = "Editor MACroS" |
| **head-recursive** | first | GNU = "**GNU**'s Not Unix" |
| **tail-recursive** | last | e.g. `MOO = "Microworlds Of MOO"` |
| **mid-recursive** | interior | (constructible) |
| **mutually recursive** | none alone; two acronyms cycle | GNU's **HURD** ↔ **HIRD** |
| **superposed** | undetermined until basis is fixed | YAML (one mode recursive, one grounded) |

The **imaginary-number** framing makes this precise: an acronym is a vector, one component per letter, each
carrying a recursion coordinate — `grounded → 1` (real), `recursive → i` (imaginary), `mutual → i·(other)`.
So `GNU = (i, 1, 1)`: only the head is "imaginary." Recursion needn't live in the first slot — a tail- or
mid-recursive acronym just moves the `i`.

There is no established word for the opposite of a recursive acronym; borrow **grounded / well-founded /
terminating** from recursion theory. "Recursive" is the *marked* case; "grounded" is the honest antonym.

### Where does the recursion sit? (non-head recursion, finally unstuck)

The stumbling block: "GNU's first letter recurses — how could a *later* letter recurse?" The answer is a
**typing constraint**, and it's exactly the intuition from CPS and typed holes:

> Treat expansion as a function `EXPAND(letterᵢ) → word`. The **recursive call** is the letter whose word
> *is the acronym itself*. But `EXPAND(letterᵢ)` must return a word **beginning with `letterᵢ`** — and the
> acronym begins with `letter₀`. So the recursive call **type-checks only at positions where `letterᵢ =
> letter₀`.** GNU's initial `G` occurs once (position 0), so GNU can *only* recurse at the head. **To move
> recursion rightward, the acronym must reuse its initial letter later.**

Head/tail/mid is then just *where the recursive call sits in the concatenation* — the same distinction as
`(cons SELF rest)` vs `(cons rest SELF)` vs a call buried in the middle:

| Kind | Rule | Example (recursive letter **bold**) | Reads as |
|------|------|-------------------------------------|----------|
| **head** | initial letter at front (always available) | **G**NU = "**GNU**'s Not Unix" | recur first, then qualify |
| **tail** | initial letter reused at the **end** | PO**P** = "Push Or **POP**" | do work, then recur (a stack pun, fittingly) |
| **mid** | initial letter reused in the **interior** | GI**G**O = "Garbage In, **GIGO** Out" | recur in the middle — garbage all the way down |
| **mutual** | `SELF` is a *different* acronym (its own initial) | **HURD** ↔ **HIRD** | two functions calling each other |
| **indirect / trampolined** | a cycle ≥ 3 hops | `TEA → EARL → LEAF → TEA` | mutual recursion with more bounces |
| **identity / unit** | `SELF` expands to *only itself*, adding nothing | **I** = "**I**" | recur and add nothing — the fixed point (§below) |

Two things fall out, both delicious to a Lisper:

- **Mutual recursion escapes the repeated-letter rule.** `POP` and `GIGO` need their own initial letter to
  reappear because `SELF` starts with that letter. But in `HURD ↔ HIRD`, each acronym's recursive call is the
  *other* acronym, which starts with *its* own letter and so type-checks in a *different* slot. You borrow a
  co-routine whose return type fits the hole — no repeated letter required. That's why GNU's daemon layer had
  to invent **two** names to close the loop.
- **No base case ⇒ divergence.** A recursive acronym has no terminal for the self-letter, so its expansion
  never bottoms out: `GNU → (GNU's Not Unix) → ((GNU's Not Unix)'s Not Unix) → …`. It's **non-well-founded** —
  an infinite unfold, a spaghetti stack with a continuation that always says "now expand the embedded copy."
  A **grounded** acronym is all terminals: every letter's word is a leaf, the derivation halts.

### The identity acronym: `I → I` (idempotent, and the tip of the pyramid)

There is a **limit case** the head/tail/mid/mutual axis was hiding: the acronym that self-refers **and adds
nothing.** Where GNU appends a qualifier (`GNU → GNU's Not Unix`) and `MOO → MOO` *grows*, the single letter
**I expands to exactly `I`.** This is the degenerate, and it is the most interesting point on the whole axis:

- **It is the fixed point of expansion.** `expand(I) = I` — a self-loop of length *zero*, not one. Every other
  recursive acronym diverges (`GNU → ((GNU)…)`); every grounded one halts after ≥ 1 rewrite; **`I` halts in
  zero rewrites because it is already its own expansion.**
- **It is the only *idempotent* acronym.** `expand ∘ expand = expand`. Reading it twice yields exactly what
  reading it once did — which is precisely what Don means by putting **"I"dempotent at the tip of the
  pyramid**: the apex of the semantic image pyramid is the idempotent read. A **GLANCE glanced twice tells you
  the same thing**; the tip is where refinement stops paying.
- **It is the unit / identity element** of the expansion monoid — hence *unit recursive acronym.* It's the one
  letter that is **simultaneously grounded and recursive** (its cycle has length zero), collapsing the
  grounded-vs-recursive distinction into a single fixed point. In the imaginary-number framing it sits on the
  real axis *and* self-refers: the origin the whole coordinate system pivots around.

**Both names betray the joke: `Identity` and `Idempotent` each begin with `I`** — and it's not coincidence,
it's etymology. Both descend from Latin **_idem_, "the same"** (idempotent = *idem* + *potent*, "same-powered,"
coined by Benjamin Peirce in 1870; *identity* from *idem*-ness). So the letter that expands to itself is
labeled by *two* properties that both **name self-sameness** *and* are **instances of it** — each starting with
the very letter it describes. The citation shorthand *idem* / *ibid.* ("the same source") is the same
self-reference in a footnote; the first-person **I** is the self doing the pointing. The metalanguage is
idempotent with the object language: **the name of the fixed point is a fixed point of the naming.** *Idem*,
indeed — `I → I` all the way down.

And math hands us one more `I`-word: **imaginary.** The **imaginary unit `i`** is just our letter lowercased —
the number you must *imagine* into being, defined purely by self-reference (`i² = −1`). It's no accident this
document already borrowed **`i` as the "recursive" coordinate** (grounded → `1` real, recursive → `i`
imaginary): the self-referential axis is *literally labeled with the identity letter.* So the same glyph does
double duty — **the letter that means itself, and the number that only exists once you imagine it** — and
"imaginary," of course, begins with `I`.

And the pun has teeth. **`I` rhymes with `EYE`** — a three-letter acronym that is **head = tail** (`E_E`), a
palindrome, and a *homophone of `I`.* The **EYE is the observer** — and per this document's opening Heisenberg
framing, **observation is what collapses the superposition.** So the fixed, unchanging **self (`I`)** and the
**eye that forces the collapse (`EYE`)** are *the same sound.* The identity acronym is literally the word for
the first-person self, and its homophone is the organ of measurement. The heizronym's collapse operator and
its fixed point are homophones — the loop closes on itself, idempotently.

**The apex mythology (lean in).** The most famous pyramid-with-an-eye is the reverse of the Great Seal of the
United States, on the $1 bill: a **13-course unfinished pyramid** (base `MDCCLXXVI` = 1776) with the **Eye of
Providence** — the all-seeing **EYE** — floating in a capstone above it, ringed by *Annuit Cœptis* ("Providence
has favored our undertakings") and *Novus Ordo Seclorum* ("a new order of the ages"). Conspiracy lore reassigns
it to the Bavarian Illuminati (founded, deliciously, in **1776**); historians insist it's a Renaissance emblem
of divine providence — so the seal is *itself* a heizronym, collapsing to "Illuminati" or "Providence" by the
observer's frame. Either reading serves us, because **the EYE sits at the pyramid's tip** — exactly where our
idempotent **`I`** sits atop the semantic image pyramid. And the pyramid is **unfinished on purpose**, the
capstone hovering separately: the Constructionist thesis in one glyph — **the world is never done; the
observing eye is the apex that completes it**, and can always lay one more course. The bill even recurses (a
note depicting a note depicting a note — a Droste/GNU regress you can fold in your wallet). *Novus Ordo
Seclorum*, indeed: a new order of the acronyms.

> **On "Droste":** not a person — a **Dutch chocolate/cocoa brand** (founded 1863, Haarlem). Its ~1904 cocoa
> tin depicted a nurse holding a tray bearing a Droste tin depicting a nurse holding a tray… the self-similar
> image that named the **Droste effect** (*mise en abyme*); the term was popularized in Dutch by poet-columnist
> Nico Scheepmaker. Recursion you can eat.

**The Boggs corner (whose value is it, anyway?).** A banknote is *itself* a heizronym whose meaning collapses
by observer frame: **legal tender**, **cotton-and-ink artwork**, or **counterfeit** — one object, three
readings, and the observer decides which is operative. The artist **J.S.G. Boggs** (1955–2017) built an entire
practice on that collapse. He drew exquisite one-sided currency ("**Boggs notes**") and *spent* them at face
value: offer a waiter a hand-drawn $100 note for a $100 meal, openly as a drawing, and if they accepted he took
the **change and the receipt** — never passing it as real. He then sold the *transaction* (receipt + change +
the where-and-when) to collectors, who would hunt down the vendor to buy the actual drawing. **Nobody got
ripped off:** the vendor chose freely, and the drawing plus the real change, framed together, *was* the
artwork. The Secret Service and the Bank of England disagreed about which reading was operative — he was raided
repeatedly and, in London in 1987, tried and **acquitted.** The observer with a badge collapses the
superposition differently. Boggs is the perfect specimen: **value as a context-selected expansion** — a
heizronym printed on paper.

(Engineering footnote: idempotency isn't only cute. It's the retry-safe virtue — RESTful `PUT`, at-least-once
delivery, append-only replay. MOOLLM's append-only logs and re-applyable Proposal Objects *want* the `I`
property: run it again, same state. The tip of the pyramid is also the safest operation in the substrate.)

**Wolfram corner.** Strip the whimsy and a recursive acronym is a **string-rewriting system** — a context-free
grammar (or an L-system) whose **start symbol appears on the right-hand side of a production**:

```
GNU  →  "GNU" "'s Not Unix"     # axiom on the RHS  ⇒ infinite derivation (non-terminating L-system)
NASA →  "National" "Aeronautics" "Space" "Administration"   # all terminals ⇒ derivation halts
```

So "grounded vs recursive" is precisely "terminating vs non-terminating rewriting"; head/tail/mid is *where
the nonterminal sits in the production body*; mutual recursion is *two productions referencing each other*.
The whole taxonomy is a tiny formal-language zoo — catnip for a computational-irreducibility crowd.

### Axis 5 — Provenance: where did the expansion come from?

- **Etymological** — the true original ("Editor MACroS"; "Personal Home Page").
- **Backronym** — retrofitted to fit existing letters, either **serious** (PHP → "Hypertext Preprocessor") or
  **humorous** ("Eight Megabytes And Constantly Swapping").

### Axis 6 — Polarity between modes: agree or negate?

- **Concordant** — modes agree in spirit; a later one *upgrades* (PHP: "Personal Home Page" → "Hypertext
  Preprocessor" — richer, not opposite).
- **Contronymic** — a later mode **negates** the earlier: an auto-antonym. YAML ("IS markup" → "AIN'T
  markup"); WINE ("**WIN**dows **E**mulator" → "Wine Is Not an Emulator").

### The worked deconstruction

| Name | Cardinality | Basis | Time-mode | Recursion | Provenance | Polarity | One-line classification |
|------|-------------|-------|-----------|-----------|------------|----------|-------------------------|
| **NASA** | mono | — | — | grounded | etymological | — | the null baseline: one fixed grounded expansion |
| **GNU** | mono | — | synchronic | head-recursive | etymological (recursion intended) | contronymic vs "Unix" | born recursive-and-negating; never had a grounded predecessor |
| **HURD/HIRD** | mono each | — | synchronic | **mutually** recursive | etymological joke | — | recursion lives in the *edges between* two acronyms |
| **PHP** | bi (over time) | time | diachronic | grounded → head-recursive | etymological → serious backronym | **concordant** (upgrade) | recursified without negating itself |
| **WINE** | bi | time | diachronic | grounded → head-recursive | etymological → backronym | **contronymic** | *became* a recursive auto-antonym (YAML's twin) |
| **YAML** | bi (de-timed) | time | diachronic | **superposed** (grounded ↔ recursive) | etymological → backronym | **contronymic** | bimodal, contronymic, Schrödinger-recursive |
| **EMACS** | **poly** | free/humor | synchronic | **spans all** (grounded + head-recursive) | **mixed** (etymological + backronym cloud) | mostly concordant | the full-spectrum heizronym |
| **MOOLLM / UBIK** | poly | **domain** | synchronic | grounded (uniform) | designed | concordant | domain-projective designed heizronyms |

### The three headline cases, deconstructed

- **EMACS is the full-spectrum specimen.** Its expansion cloud spans *every* recursion state at once: a
  grounded etymology (**"Editor MACroS"**), grounded humorous backronyms (**"Escape Meta Alt Control Shift,"
  "Eight Megabytes And Constantly Swapping"**), and head-recursive ones (**"EMACS Makes All Computing Simple,"
  "EMACS Makes A Computer Slow"**). So EMACS is a *polytonal synchronic heizronym whose expansions themselves
  straddle the recursion topology.* YAML is the two-state minimal version of what EMACS does maximally.

- **YAML and WINE are twins** — the **recursive auto-antonym** family: both started as a grounded descriptive
  name ("Yet Another Markup Language," "WINdows Emulator") and *flipped* into a recursive negation of that
  description ("YAML Ain't Markup Language," "Wine Is Not an Emulator"). Diachronic + contronymic +
  recursified. GNU shares the *negation* but not the *history* — it was born recursive-and-negating, no
  grounded past to renounce.

- **MOOLLM/UBIK are the designed case** — polytonal, uniform-grounded, collapsing in the *domain* basis. No
  negation, no recursion, no time-flip: pure context-projection. This is the heizronym MOOLLM actually wants
  to *be* — many co-valid domain projections, engineered on purpose (§"Why LLMs make heizronyms stronger").

### Genus EMACS: a case study in generative acronymy

EMACS isn't just a full-spectrum heizronym; it founded a **dynasty** — a decades-long, still-running family of
acronyms *generated from a template.* This is the richest specimen in the zoo, so it earns its own dissection.

The canonical Lisp Machine lineage (Weinreb & co., ~1978):

```
EMACS   →  "Editor MACroS"                 # the root: grounded etymology (base case)
EINE    →  "EINE Is Not EMACS"             # eine = German 1; head-self-recursive + points at EMACS
ZWEI    →  "ZWEI Was EINE Initially"       # zwei = German 2; head-self-recursive + points at EINE
```

and the sprawling side-family that all deny the same ancestor:

```
FINE    →  "FINE Is Not EMACS"
MINCE   →  "MINCE Is Not Complete Emacs"
SINE    →  "SINE Is Not EINE"              # denies a sibling, not the root
… (recursively enumerable — you can always mint one more)
```

**Deconstruction — each member does three things at once:**

1. **Self-recursion (head).** `EINE` = "**EINE** Is Not EMACS": the first `E` is the acronym itself →
   head-self-recursive, per the typing rule above (the initial letter sits at the front, so it type-checks).
2. **Genealogical reference (a cons-pointer).** The *other* capitalized token points at a **relative**: EINE
   → EMACS (parent), ZWEI → EINE (predecessor), SINE → EINE (sibling). That pointer is hetero-referential —
   it fits its own slot because it starts with its own letter (§mutual recursion).
3. **Negation or succession (the relation).** The connecting verb encodes the *kind* of edge: **"Is Not"**
   (apophatic — define by denial) or **"Was … Initially"** (diachronic succession — I am the next version).

**The names, scientifically:**

| Phenomenon | Coinage | What it means |
|-----------|---------|---------------|
| An acronym family produced by a shared template | **generative acronymy** | acronyms as a *formal language*, not one-offs |
| The template itself ("`X` Is Not Emacs") | **metacronym** | an acronym schema that generates acronyms |
| Defining a member by denying another ("Is Not") | **apophatic acronym** | apophasis = definition by negation (cf. apophatic theology) |
| Pointing at a parent/predecessor/sibling | **genealogical / dynastic acronym** | forms a lineage graph |
| Member(n+1) = successor of member(n), literally numbered | **successor (Peano) acronym** | EINE=1, ZWEI=2 → induction with a base case (EMACS) |
| The whole generated set | **acronym enumeration** | recursively enumerable from seed + productions |
| Names that are foreign-language ordinals | **polyglot ordinal pun layer** | German *eine/zwei/drei* doubles as the counter |

**Topologically**, the dynasty has two shapes at once:

- a **spine / path** — the counting lineage `EMACS → EINE → ZWEI → …`, each node cons-pointing at its
  predecessor: a **linked list whose every node is itself a head-recursive acronym.** (Peak Lisp: a cons-list
  of self-referential cells.)
- a **star / hub-and-spoke** — the many "`_` Is Not EMACS" siblings all pointing back at the root: an
  apophatic fan. EMACS is the fixed point everyone defines themselves *against.*

**Classified with the six-axis schema:**

```yaml
EINE: {mono, none, synchronic, head (self) + hetero (→EMACS), backronym-humorous, contronymic}   # apophatic
ZWEI: {mono, none, diachronic, head (self) + hetero (→EINE),  backronym-humorous, concordant}     # successor
```

The punchline worth putting on the t-shirt: **the Emacs family is an anti-dynasty — every heir is crowned by
denying the throne** ("I am Not Emacs"), and the succession is counted out loud in German. It is, formally, a
recursively-enumerable set generated by an apophatic metacronym over a genealogical linked list. Humorously,
it's forty years of programmers refusing to say what their editor *is*, only what it *isn't* — which is, of
course, the most Emacs thing imaginable.

### The MOO show: modular, tributary, nested, and fractal expansion

MOOLLM itself demonstrates four more structures the EMACS zoo doesn't — because Don built them in on purpose.

**Modular (MOODULAR).** MOOLLM factors into two independently-expandable **modules**: `[MOO][LLM]`. Each is its
own sub-heizronym with its own expansion set, and you can swap one without touching the other:

```
MOO ∈ { "Microworld Object-Oriented" (soft-official), "MUD Object-Oriented" (tributary),
        "Minsky Objects Orchestrated" (cognition), "MOO's Object-Oriented" (recursive), … }
LLM ∈ { "Large Language Model", "LLM" (kept opaque), "Language-Learning Model", … }
MOOLLM-expansions  =  MOO-set  ×  LLM-set        # a Cartesian product — a *factored* / *product* heizronym
```

So MOOLLM is **MOODULAR**: choosing an expansion = picking coordinates in a product space, and the two dials
turn independently. That's a genuinely new axis — **modularity** — orthogonal to everything above, and it's a
*feature*: the modules are hot-swappable interfaces, not a frozen phrase.

**Tributary basis (a new collapse dimension).** Beyond *domain* (project onto a problem) and *time* (which
year), there's the **tribute / lineage** basis: expansions that honor ancestry rather than fit a use-case. The
tributary reading is also the most *etymologically honest* one:

```
MOOLLM  (tributary)  =  "MUD Object-Oriented Large Language Model"
                             └── MUD  →  "Multi-User Dungeon"   (nested one level deeper)
```

This is exactly MOO's real etymology (MOO literally = "MUD, Object-Oriented"), so the tribute reading doubles
as the true history.

**Nested expansion + depth-gated disclosure.** Note "Dungeon" is **buried a level down**, on purpose. Expansion
has *depth*: `MOOLLM → MUD-OO-LLM → (Multi-User Dungeon)-OO-LLM`. Don gates that depth deliberately —
"Dungeon" creeps normal people out, so it lives deep in the recursion where only someone *digging* for the
lineage will surface it. This is the **semantic image pyramid applied to a name**: the shallow read is
friendly (Microworld / MOO + LLM), the deep read pays full tribute (MUD, Multi-User Dungeon). *Depth = audience
filter.*

**Fractal / self-similar expansion.** And the pure-fun one: expand the **M** of MOO back into **MOO** and you
harvest two more O's each time — a string-rewriting rule `M → MOO` over axiom `MOO`:

```
MOO → MOOOO → MOOOOOO → …            # rule {M → MOO}; each step appends OO — the cow moos longer
```

Self-similar, non-terminating, `M·O^(2n)` — a one-rule **L-system** (which is why it's also the Wolfram
corner's favorite: simple rule, unbounded growth). The head-recursion here *grows* the string instead of just
referencing the whole, making MOOLLM a **fractal acronym** whose leading letter is an infinite regress of
contented cattle.

### The classification schema (tag any acronym)

```yaml
# A six-coordinate signature. Fill each axis; heizronym = cardinality in {bi, poly} AND basis is real.
acronym:
  cardinality: mono | bi | poly
  basis:       domain | time | tribute | free | none   # the dimension that collapses it
  time_mode:   synchronic | diachronic
  recursion:   grounded | head | tail | mid | mutual | superposed | identity   # identity = I→I, the idempotent fixed point
  provenance:  etymological | backronym-serious | backronym-humorous | mixed
  polarity:    n/a | concordant | contronymic
  modularity:  atomic | factored          # factored = independently-swappable sub-acronym modules (MOO × LLM)
  depth:       flat | nested              # nested = a letter's expansion is itself further expandable (MUD→Multi-User Dungeon)
# Examples:
# GNU:    {mono, none,   synchronic,  head,      etymological, contronymic}
# YAML:   {bi,   time,   diachronic,  superposed, mixed,       contronymic}   # out of time → re-superposes
# EMACS:  {poly, free,   synchronic,  grounded+head (mixed),   mixed,        concordant}
# MOOLLM: {poly, domain, synchronic,  grounded,  designed,     concordant}
```

### Why this matters for MOOLLM (not just wordplay)

The taxonomy tells you **which kind of name to mint on purpose.** MOOLLM should coin **domain-basis,
synchronic, grounded, concordant** heizronyms (like itself and UBIK) — many co-valid projections, no time-bomb
negation, no accidental recursion. It should *avoid* accidental **diachronic contronyms** (a name whose "true"
meaning silently flips later and invalidates old docs — the YAML/WINE trap). And it can *deploy* recursion
deliberately (GNU-style) when self-reference is the joke or the point. The heizronym is the feature; the
diachronic auto-antonym is the hazard; recursion is a garnish to use on purpose, never by accident.

---

## Three corners: how RMS, DUGHUF, and Wolfram would read this

Three patron saints of self-reference would each claim this taxonomy as their own — and each would frame it in
their own register. (One caution, said once: these are affectionate reconstructions of *how* each thinks from
their published framings, not quotes.)

### The RMS corner

Richard Stallman isn't a spectator here — he's the **root of Genus EMACS.** He wrote the original EMACS
(Editor MACroS for TECO, 1976), and he minted the software recursive acronym with **GNU = "GNU's Not Unix."**
So the *recursion* delights him: the whole EINE/ZWEI dynasty is his editor's grandchildren, and the fractal
`M → MOO` is the same self-referential joke as GNU. He'd frame ambiguity through **freedom**: "free as in
freedom, not price" — a heizronym is a *free* name, owned by no single authority, forkable by anyone into a
new valid reading, which is the four freedoms applied to semantics; copyleft itself is a *recursive,
self-propagating* license, so he already thinks in these loops.

But — no-sycophancy — RMS is also the field's great **terminology precisionist**: "it's **GNU/Linux**, not
Linux"; "**free software**, not open source"; "there is no such thing as 'intellectual property' — it's a
seductive mirage"; "**DRM** = Digital *Restrictions* Management." He insists on the *one correct term.* So the
heizronym's deliberate *lack of a canonical expansion* would rub against his grain: he'd applaud the recursion
and the freedom, then insist the loop **bottom out in freedom** and probably argue there *is* a privileged
reading (the one that protects the user's liberty). He'd also flag the **Micropolis name license** as a
restriction on a free name — a trademark fence around the commons. RMS reaction:
*loves the recursion, loves the freedom, wants a base case, distrusts the ambiguity.*

### The DUGHUF corner (Doug Hof — Douglas Hofstadter)

This is his home turf. *Gödel, Escher, Bach* gave us **"GOD = GOD Over Djinn"** — a recursive acronym with an
infinite regress buried inside, which is *exactly* the fractal `MOO → MOOOO → …`. He'd read every heizronym as
a **strange loop**: the name points at a concept that points back through the name, a tangled hierarchy where
levels cross. He'd recognize the **grounded base case** as the place you can **"joots"** (Jump Out Of The
System) — without it, the acronym is an Escher staircase or a Bach endlessly-rising canon (the infinite MOO is
a Shepard tone made of cattle). Most of all, he'd claim the *collapse* mechanism as **analogy** — the engine of
cognition in *Surfaces and Essences* and *Fluid Concepts and Creative Analogies*: when an LLM expands MOOLLM
differently per domain, it is **making an analogy**, projecting one structure onto another, which is (for
Hofstadter) *what thinking is.* Genus EMACS he'd adore as a tangled genealogy, and the German counting as
playful level-mixing. DUGHUF reaction: *the heizronym is an analogy-pump and a strange loop; the base case is
where you joots out; this is a small cathedral of self-reference.*

### The Wolfram corner

Stephen Wolfram would strip the whimsy and see a **computational system.** Every expansion rule is a
**string-rewriting production**; a recursive acronym is a grammar (or **L-system**) with the start symbol on
the right-hand side, so it **never terminates** (`M → MOO` generates `M·O^(2n)`, a self-similar fractal string).
He'd reframe the whole taxonomy as a **rulespace**: enumerate all acronym-expansion systems, iterate each with
`NestList`, and **classify them like cellular automata** — grounded acronyms are Class 1 (halt to a fixed
point), recursive ones Class 2/4 (periodic or unboundedly growing), the EMACS enumeration a genuinely
**computationally irreducible** set you can only generate by running it. He'd measure growth rates, draw the
expansion graphs, and note that predicting a deep expansion has no shortcut but simulation. He'd probably
retitle the article *"Acronyms: A New Kind of Science"* and want it all in the Wolfram Language. Wolfram
reaction: *it's a formal rewriting zoo; enumerate the rulespace, classify by behavior class, and compute over
it.*

The three corners triangulate the same object: **RMS sees freedom and demands a base case; DUGHUF sees a
strange loop and an analogy engine; Wolfram sees a rewriting rulespace to enumerate.** All three are correct —
which is, fittingly, the heizronym thesis applied to the heizronym itself.

(The Wolfram corner is catnip enough to spin out on its own — it now lives as a sendable invitation +
artifact in Wolfram's guest dir: [`characters/stephen-wolfram/`](../../../characters/stephen-wolfram/README.md)
(the short [`invitation.md`](../../../characters/stephen-wolfram/invitation.md) plus the full
[`MOOLLM-AS-A-COMPUTATIONAL-SYSTEM.md`](../../../characters/stephen-wolfram/MOOLLM-AS-A-COMPUTATIONAL-SYSTEM.md),
which applies the computational lens to MOOLLM-the-system).

## Guest corners: dream guests who'd get it instantly

Two more corners — not patron saints of *recursion* but of the thing next door, and both **dream guests of the
show** (old friends of Don's and of Will's). They belong here because the heizronym has a visual and a social
twin.

### The Scott Kim corner (the ambigram is a visual heizronym)

Scott Kim makes **ambigrams** — his 1981 book *Inversions* is the foundational catalog, and Hofstadter
featured his work in *Scientific American* / *Metamagical Themas* (so this corner shares a wall with DUGHUF's).
An ambigram is a single figure that **reads as two different words depending on how you look at it** —
rotate it 180°, mirror it, and a *valid alternate reading* appears in the *same ink.* That is the heizronym
made **typographic**: one symbol, multiple co-valid readings, the reading selected by a *transformation* (here
a rotation/reflection) exactly as the heizronym's reading is selected by a *domain*. Scott would see the
acronym field theory and immediately map it onto **symmetry group theory** — each "collapse basis" is a
symmetry operation, and a superposed acronym like YAML is an ambigram in *time* instead of space. He'd want to
*draw* MOOLLM as an ambigram whose two readings are two of its expansions.

### The Amy Jo Kim corner (the social lifecycle heizronym)

Amy Jo Kim — game designer, author of *Community Building on the Web* (2000) and *Game Thinking*, and Scott's
wife — owns the **social** side. Her **membership lifecycle** (visitor → novice → regular → leader → elder)
is essentially WWSFF's [`guest-participation-ladder`](../../../process/guest-participation-ladder.yml) avant la
lettre, and her "**player journey**" framing maps directly onto how a newcomer climbs from *reading* the repo
to *proposing* to *governing.* She'd read the onboarding-glossary-vs-heizronym tension as a **new-player
experience** problem: the superposition is an *expert affordance*, the glossary is the *tutorial level*, and
the job is to design the ramp between them. Amy Jo is the corner that keeps the wordplay honest about **humans
arriving for the first time.**

Together the Kims round out the set: **Scott gives the heizronym its mirror (visual), Amy Jo gives it its
crowd (social).** Both already have character pages here —
[`scott-kim`](../../../characters/scott-kim/CARD.yml),
[`amy-jo-kim`](../../../characters/amy-jo-kim/CARD.yml) — and a joint
[`amy-jo-and-scott-kim`](../../../repo-shows/amy-jo-and-scott-kim/SHOW.yml) repo-show already exists.

---

## Why LLMs make heizronyms *stronger*, not weaker

Here is the part Don loves, and he is right to: **LLMs confidently expand MOOLLM differently in different
contexts, with plausible domain-appropriate words each time** — and that is a **feature**, not a
hallucination bug.

- Ask about the substrate → the model expands toward *"MOO + LLM"*, MUD/MOO object-orientation meets language
  models.
- Ask about cognition → it drifts toward *Minsky, Society of Mind, memory/objects/orchestration.*
- Ask about the filesystem → it reaches for *microworld / mount / object / operating* readings.

Each expansion is a **projection of the same concept onto the domain of the question.** The LLM is doing the
collapse *for* you, correctly, because the name was engineered to afford exactly that. A rigidly-defined
acronym would force the model to either recite the one string (losing the domain fit) or "err" by adapting it
(punished as inconsistency). The heizronym turns adaptation into the *intended* behavior. **The ambiguity is
load-bearing: it lets one token carry the right meaning into every room it enters.**

Design corollary (this is the non-obvious engineering point): **do not "fix" MOOLLM to one expansion in the
docs.** A single canonical definition would collapse the superposition globally and destroy the feature. The
correct doc move is to *list several* valid expansions per domain and say plainly "there is no single
canonical expansion; that is intentional" — which is what this file does.

---

## The same trick, smaller: CARD and K-line

Don applied heizronym thinking deliberately to **CARD** — he "thought long and hard about what CARD means
(multiple things at once) and how to benefit from that ambiguity instead of suffer." A `CARD.yml` is
simultaneously, and usefully, all of:

- an **index card** (the interface sniff, 50–200 lines — the middle of the semantic image pyramid);
- a **trading/playing card** (a capability you hold and can play — a skill's advertised moves);
- a **business card** (identity + how to contact/invoke this skill);
- a **punch card / program card** (a machine-readable declaration of what runs);
- a **báihuà "card" (卡)** — a checkpoint/gate you pass through.

You never have to choose. Each reading is correct in the moment you need it, and the file does all those jobs
at once. Same story for **K-line**: it leans hard into Minsky's well-defined "knowledge line" from *K-lines: A
Theory of Memory* (1980) — "lean into the training data," Don's phrase — so the model arrives already knowing
the concept, while MOOLLM projects it onto YAML anchors, heat/activation (the CG engine), and skill wiring.

---

## The design doctrine behind it: "lean into the training data"

The unifying principle across all of these is Don's rule to **use well-known, well-defined, heavily-written-
about terms** (K-line, room, character, card, skill, driver, kernel, mount) rather than coining neologisms.
Two payoffs:

1. **Onboarding leverage** — a model (or human) meets the term already carrying a rich pre-trained cluster of
   associations. The name is itself a K-line: it activates the right knowledge on contact.
2. **Heizronym headroom** — well-worn words are *polysemous by nature*, so they afford multiple valid
   projections. Coined words don't have that; they'd need definition and would collapse to one meaning.

So the nomenclature is a two-layer strategy: **borrow famous terms so the training data does the teaching,
then let their natural polysemy carry the concept correctly into each new domain.** The apparent "there's a
lot of nomenclature to grasp" cost is real for humans (see the glossary below), but for an LLM the terms are
mostly *free* — they're already in the weights.

---

## The soft-official anchor (onboarding without collapsing the superposition)

A heizronym needs a **front door** — one expansion shown *first* to a newcomer — without declaring a
*canonical* one that kills the superposition. Call it the **soft-official** reading: the default projection,
explicitly labeled "one of several, and the plainest," not "the answer." (This resolves the apparent tension
with the design corollary above: *soft*-official ≠ canonical. It's the boring-front-door projection; the
others stay live.)

The literal etymology is the honest root: **MOOLLM = MOO + LLM** — *a MOO (a MUD-style, object-oriented
microworld) that an LLM inhabits and runs.* If a newcomer remembers only that, they're not wrong.

Candidate soft-official expansions (mapped across `M·O·O·L·L·M`), by register:

| Candidate | Register | Reads as |
|-----------|----------|----------|
| **Microworld Object-Oriented LLM** | plain / recommended | "it's a MOO (microworld, object-oriented) for an LLM" — minimal and true |
| **Microworld Object-Oriented Layer for Language Models** | technical | an OS-ish layer LLMs run on |
| **Mountable Object-Oriented Landscape for LLM Minds** | filesystem projection | repos/skills mount into a browsable world |
| **Minsky Objects, One LLM Mind** | cognition projection | Society-of-Mind objects, one model inhabiting them |
| **MOOLLM Orchestrates Objects, Lets LLMs Model** | recursive Easter egg | head-recursive, a wink to GNU/EINE |
| **MUD Object-Oriented Large Language Model** | tributary / lineage | the true etymology; "MUD" nests to "Multi-User Dungeon," kept deep so it doesn't creep newcomers out (§"The MOO show") |

**Recommendation:** adopt **"Microworld Object-Oriented LLM"** as the soft-official front-door expansion —
it's the shortest true reading, carries the MOO+LLM etymology intact, and needs no prior MOOLLM knowledge.
Keep the etymology line ("MOO + LLM") beside it as the "what it literally is," and keep the domain projections
(cognition / filesystem / OS) explicitly listed as co-valid — so the glossary shows *one plain reading first,
several more underneath*, which is exactly the heizronym-with-a-ramp posture.

**Why leading with "Microworld" is the strong choice** (Don's instinct, and it's right): the word is a
*loaded K-line* that fires exactly the ancestry MOOLLM claims. It evokes **Seymour Papert's "microworlds"** and
**Constructionism** — small, tractable worlds you learn by *building inside* (LOGO's turtle geometry as the
canonical microworld), which is precisely MOOLLM's "learn by construction" thesis. It also lands on **SimCity
and The Sims** — Will Wright's software toys are microworlds in the literal sense, and Micropolis *is* one. So
"Microworld" front-loads three endorsements at once — Papert (pedagogy), Wright (the toy/simulation lineage),
and the object-orientation that follows — before the reader even reaches the second word. It's the rare
soft-official expansion whose *first token does the recruiting.*

Soft-official anchors for the neighbors (same rule — plain first, fun kept):

- **mooco** → soft-official *"MOO Custom Orchestrator"* (already canonical in the mooco repo); playful:
  *"MOO's Cozy Orchestrator."*
- **CG** → soft-official *"Context Gatherer"*; fun twin *"Treasure Collector"* (keep both — it's a deliberate
  two-name heizronym).
- **MOOFS** → soft-official *"MOOLLM Overlay File System"*; also read as *"…Virtual File System."*
- **CARD**, **K-line** → no soft-official needed; they're borrowed terms whose training-data meaning *is* the
  front door (§"The same trick, smaller").

Ball rolling. Lock in "Microworld Object-Oriented LLM" as the anchor and I'll thread it through the glossary,
the WWSFF/MOOLLM READMEs, and the VISION doc — or pick a different candidate and I'll thread that instead.

## The one honest caution (no-sycophancy)

The heizronym is genuinely clever and I'm not going to pretend otherwise — but it has a **failure mode** worth
naming: for **human newcomers** (a teacher, a school IT admin, a first-time contributor), superposition reads
as *"nobody will tell me what this means,"* which is onboarding friction, not delight. The LLM gets the
feature for free; the human pays the ambiguity tax.

**Resolution (don't kill the feature, gate it):** keep the heizronym for the *concept-carrying* names, but
provide a **boring front door** — a one-line-per-term glossary that says "here are several valid readings; you
don't have to pick" — so newcomers get a foothold without collapsing the superposition. That's exactly the
job of [`NOMENCLATURE-ONBOARDING-GLOSSARY.md`](NOMENCLATURE-ONBOARDING-GLOSSARY.md). Ambiguity is a feature for
those who can hold it; a glossary is the ramp for those who can't yet.
