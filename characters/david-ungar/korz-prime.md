# Korz′ (Korz-Prime): Korz for the Age of LLMs

A design sketch for the demo conversation. Premise borrowed from David
Temkin's **Declare**: design the language *from the start* for three
readers — humans, LLMs, and deterministic machines — instead of
retrofitting. Declare redid the UI declaration layer that way; this
sketch redoes the dispatch semantics. Prior art it leans on:
[korz-notes](korz-notes.md), the
[deep dive](sources/korz-paper-deep-dive-moollm-mapping.md),
[SELF-AND-MOOLLM](https://github.com/SimHacker/moollm/blob/main/designs/object-system/SELF-AND-MOOLLM.md),
[MOODY](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md),
[LATENT-SPACE-INHERITANCE](https://github.com/SimHacker/moollm/blob/main/designs/object-system/LATENT-SPACE-INHERITANCE.md).

The name, after Bourland's E-Prime: Korz minus the assumption that
dispatch must be decidable. Alternative naming scheme, via the
anagram: the deterministic tier is **Korz**, the LLM tier is **Zork**.
Korz compiles; Zork improvises.

## One semantics, two dispatchers

Keep the Korz model exactly: a sea of slots, guards over named
dimensions, sends dispatched symmetrically through an implicit
context, no receiver, no classes. Change nothing about *what* a
program means. Add a second executor:

| | Strict tier (Korz) | Soft tier (Zork) |
|---|---|---|
| Dispatcher | deterministic VM | LLM |
| Coordinate match | type/subtype, exact | semantic — "stormy" satisfies `weather: bad` |
| Guard language | decidable predicates | prose allowed ("when the player seems frustrated") |
| Multiple matches | unique most-specific or **error** | **sample** by relevance — or **blend** the matching slots |
| No match | doesNotUnderstand | **fall through to latent space** — improvise a slot from training |
| Slot body | code | code, prose, or both |

The two tiers are not rivals; they are **JIT tiers**. This is the
Self playbook run one level up. The LLM is the interpreter: slow,
expensive, handles everything, understands prose guards. The VM is
the optimizing compiler: fast, cheap, handles only slots whose guards
and bodies have been made decidable. Between them, two movements:

- **Crystallize** (compile up): a latent improvisation or prose slot
  that runs hot and stable gets rewritten — by the LLM, reviewed by a
  human — into decidable guards and executable body, and enters the
  strict tier. Speculative, like any JIT: the compiled slot carries
  the *envelope* of contexts it was crystallized from.
- **Deoptimize** (bail down): a send whose context leaves the
  envelope — a coordinate the compiled guard never saw, an ambiguity
  the lattice can't order — doesn't error. It bails to the model,
  which improvises, and the result is a candidate for
  re-crystallization. Deopt in Self rescued speed without losing
  semantics; deopt in Korz′ rescues *determinism* without losing
  meaning.

Crystallization already has a shipped precedent: the
[adventure compiler](https://github.com/SimHacker/moollm/blob/main/skills/adventure/ADVENTURE-COMPILER.md)
compiles adventure YAML — rooms, objects, guards — into deterministic
JavaScript and Python that runs standalone or tethered to an LLM for
creative decisions. The next step is a **Zork compiler** that emits
deterministic, executable **Korz** instead of (or as well as) JS and
Python — the strict tier's slot space as a compilation target, not
just a hand-authored one. Zork improvises, the compiler crystallizes,
Korz runs: the anagram becomes a toolchain.

Endosymbiosis, stated mechanically: the deterministic program lives
inside the model the way mitochondria live inside the cell, doing the
high-throughput metabolism, with gene transfer (crystallization) in
one direction and rescue (deopt) in the other.

Prior art for the tier philosophy, in one sentence of Vanessa
Freudenberg's (SqueakJS, on riding the JavaScript JIT rather than
fighting it): *"My plan is to do as little as necessary to leverage
the enormous engineering achievements in modern JS runtimes."*
Replace "JS runtimes" with "language models" and that is Korz′'s
soft tier ([her room](../vanessa-freudenberg/README.md), her
[jit notes](../vanessa-freudenberg/sources/jit-notes/) — which cite
the Hölzle–Chambers–Ungar deoptimization paper directly).

**What would Vanessa think of this?** A question for her friends, not
for the model — memorial mode applies to design discussions too. We
don't ask an LLM to simulate her; we ask the people who knew her to
remember her and imagine what she would say, to remember what she
*did* say, and to go over her notes, papers, code, and live
environments — the [jit notes](../vanessa-freudenberg/sources/jit-notes/)
with their runnable mockups, the
[DLS '14 paper](https://github.com/SimHacker/moollm/blob/main/designs/prestoration/sources/Freudenberg-2014-SqueakJS-memorial-edition.pdf),
SqueakJS itself still live in the browser. She had strong documented
opinions exactly here — she chose readable, debuggable, *fun* JS over
a WASM rewrite, and rode the platform's JIT instead of fighting it.
Would she read the soft tier as the same bet one level up, or as the
thing she warned about — losing readability and flexibility to an
opaque optimizer? Her friends get to argue it; she gets quoted, not
synthesized. A beat for the
[memorial arc](../../repo-shows/remembering-vanessa-freudenberg/).

## The surface: slots are data

No new syntax. Slots are YAML; the sea is a directory tree; git is
the persistence, history, and diff of the sea. One artifact, three
readings: the machine parses structure, the human reads names and
comments, the LLM reads everything.

**Korz Jazz.** (Or *Jazzork*, when the soft tier is playing.) This is
where the language leans hardest into
[yaml-jazz](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz),
and it is a foundational design goal, not a courtesy: **comments in
code impart understanding and meaning to humans, to LLMs, and even to
deterministic programs — everything else follows from that.** The
lineage is Knuth's literate programming, with one inversion. WEB wove
prose and code into a single document, but `tangle` stripped the
prose before the machine ever saw it — literature for humans, dead
weight for the compiler. In Korz′ the tangle step disappears, because
the interpreter is a *reader*: in the soft tier a comment on a slot
is semantics (it changes how the slot matches, samples, and blends);
in the toolchain a comment is the crystallizer's specification (the
compiled slot is checked against what the prose said it *meant*, and
carries that comment forward as its contract); and in the strict tier
comments round-trip as data — YAML preserves them, so the
deterministic program that doesn't understand a comment still
transports it faithfully to the next reader who does. Weave and
tangle collapse into one artifact: the program is the book, and the
book runs.

```yaml
# sea/troll/greet.yml — three slots, one selector
greet:
  guards: {rcvr: troll*, world: zork}      # constrained × 2
  do: The troll brandishes his axe and blocks the passage.

greet:
  guards: {rcvr: troll*, world: adventure}
  do: The troll demands payment before you may cross the bridge.

greet:
  guards:
    rcvr: troll*
    mood:              # bare name — bind whatever mood is present
  do: |                # prose body: soft tier only, for now
    Greet in a way that fits {mood}; lead with menace if provoked,
    grudging respect if the visitor has beaten you before.
  # He's privately embarrassed about the axe incident — never mentions
  # it first. This comment is load-bearing: the strict tier transports
  # it, the soft tier plays it.
```

The strict compiler takes the first two, refuses the third (prose
body, unbounded coordinate), and the refusal is the *partition
criterion*: what compiles is exactly what has been made decidable.
The third runs on the model until its observed behavior crystallizes
into per-mood variants — or never does, and stays soft forever, which
is fine.

**Containment is a guard.** A slot file living under `worlds/zork/`
gets `world: zork` for free from its address — the directory tree
supplies default coordinates the way MOOLLM's typed container
directories supply inherited metadata. Location is a guard; moving a
file re-guards it; `git log` is the time dimension.

**Prefixes are containment without directories.** Big-endian naming —
most significant first: `2026-08-20-topic.yml`,
`heads-axe-brow.yml` / `heads-ledger-squint.yml` — makes lexicographic
order semantic order, and **prefix matching clusters the files of one
flat directory into implicit trees with semantically meaningful
paths**. The shared `heads-` prefix is a subtree node nobody had to
`mkdir`; a plain sorted `ls` is a treewalk; `heads-*` is a subtree
query the filesystem answers for free. In the Korz reading, a
filename prefix is a guard coordinate at finer grain than the
directory address — the same containment-is-a-guard rule, one level
down: renaming re-guards a file exactly the way moving it does, and a
date prefix is the time dimension worn on the name (git log gives the
edit history; the prefix gives the *subject* time). So the tree/sea
duality goes fractal: every directory is simultaneously a little flat
sea and a bundle of implicit subtrees pattern-matched out of its
names — the explicit tree below it and the implicit trees within it
are both just saved views over prefix guards, and the strict tier
gets its cheapest discrimination index — sort order — as a gift from
the filesystem.

### Names are inheritance

Dimensions and coordinates are ordinary words — `mood`, `weather`,
`era`, `trust` — and in the soft tier a word is a K-line: `mood:
gezellig` imports everything the training data knows about
gezelligheid, no definition required. The strict tier treats the same
word as an opaque symbol. One name, prepaid latent semantics above,
free interning below.

### Any slot can hold a K-line pointer

Not only `parents:`.
[LATENT-SPACE-INHERITANCE](https://github.com/SimHacker/moollm/blob/main/designs/object-system/LATENT-SPACE-INHERITANCE.md)
established the move for the parent list; the sea generalizes it to
every slot body. `template: gothic-victorian-newspaper` with no such
file on disk isn't a broken link — it's an address into training
data, dereferenced by the soft tier at send time. `voice:
carnival-barker`, `layout: ransom-note`, `physics: looney-tunes` —
each resolves to more than any file you'd bother writing.

Every slot value is an address, and addresses come in two kinds:

- **Filesystem paths** — resolved by `open`, versioned by git,
  honored by the strict tier.
- **K-lines** — resolved by inference, versioned by the model
  generation, soft tier only.

The strict compiler treats an unresolvable pointer the way it treats
a prose body — refuses it, which marks it: every latent pointer is a
standing candidate for crystallization into a real file once its
improvised referent stabilizes. Dangling pointers become deopt
triggers instead of segfaults.

### isNull becomes isKnown

With path pointers the presence test is boolean — the file exists or
it doesn't. With K-line pointers the question generalizes: not *is it
null* but **how known is it** — `isNull: bool ⇒ isKnown: float`.
`mood: gezellig` activates deep, dense, consistent training
knowledge; `layout: zorbleflax` activates nothing; `theme:
bridge-gothic` sits in between — composable from parts, but no
canonical referent.

Measurable, too: ask the model to describe the referent several times
and score the agreement (consistency probing), or read the logprobs
directly — cheap conversational version and instrumented version of
the same test.

What it buys:

- **Guards can threshold on knownness** — `template: {kline:
  gothic-victorian-newspaper, min_known: 0.6}` matches only when the
  referent is solid enough to trust. The korz-notes null question
  ("no null coordinate — missing feature or dodged bullet?") gets a
  third answer: neither null nor absence, but *graded presence*.
- **Crystallization gets its policy signal.** High isKnown → safe to
  leave latent (the training data is the file). Low isKnown → spell
  it once, in a real file — which is the
  [no-ai-humansplaining](https://github.com/SimHacker/moollm/tree/main/skills/no-ai-humansplaining)
  test ("is the pointee in latent space?") turned from a heuristic
  into a compiler policy with a threshold.
- **Improvisation scales its own caution.** The soft tier can lower
  its temperature as isKnown drops — confident riffing on gezellig,
  careful literalism near zorbleflax — instead of hallucinating with
  uniform confidence. State the confidence as a number, then act on
  it: calibrated dereferencing.
- **Advertisement scoring expressions get an epistemic term.** A Sims
  ad's score is already an expression re-weighted by the chooser's
  needs; let it also multiply in the isKnown of the ad's own
  referents — `score: 80 * isKnown(template) * isKnown(voice)` — and
  a slot whose pointers are shaky **bids low in its own auction**.
  Confident slots outbid vague ones; a half-remembered behavior
  gracefully loses to a well-grounded one instead of winning on a
  hardcoded number; and the hallucination damper is built into the
  market instead of bolted onto the model. (The troll's head-weights
  inherit it too: a mind whose referents have gone vague visibly
  shrinks.)

### Do we want nulls at all? (The zillion-dollar question)

Hoare called null references his billion-dollar mistake — a zillion
with inflation — and his regret was specific: null silently inhabits
*every* reference type, so every dereference is a hidden conditional.

Korz already dodged that bullet structurally, and it's worth saying
how: **absence is not a value.** A dimension is either bound or
unmentioned; there is no `location: null` poisoning the coordinate
space, no token you can accidentally dereference — an unbound
dimension just means only more-generic slots match.

The deeper sin of null is that one token conflated at least three
meanings — *no binding*, *unknown*, and *nothing* — and Korz′ gives
each its own honest mechanism:

| Null conflated | Korz′ separates |
|---|---|
| No binding | Unmentioned dimension — structural absence, matched by generic slots |
| Unknown | `isKnown: float` — measured, thresholded, acted on |
| Nothing | A real sentinel coordinate you name and guard on — `inventory: empty`, `location: nowhere` — a value, never a hole |
| Failure | Deopt to the soft tier — improvise, don't segfault |

So: keep Korz's refusal of the null coordinate (dodged bullet,
confirmed), replace null's epistemic duty with isKnown (the boolean
shadow gets its continuum), and when a domain genuinely needs
"nothing," model it as a named coordinate that dispatch can see —
E-Prime discipline applied to reference: ban the degenerate universal
token, and every absence has to say *which kind of absent it is*.

**Prior art, from Don's own peanut gallery.** A July 2024
[HN comment of Don's](https://news.ycombinator.com/item?id=41043950)
already staked out this ground: JavaScript's null *and* undefined make
a "holy trinity of nothingness" with TypeScript's `unknown` — Anders
Hejlsberg calls it the Two-Billion-Dollar Mistake, and commenter
dunham lands the punchline: "assuming these mistakes are additive and
not multiplicative." Korz′'s answer to the multiplication is to hold
a zero factor: no null tokens at all, so the product of the mistakes
is zero. The same comment cites the Rumsfeld Matrix, and it maps onto
isKnown mechanically:

| Rumsfeld | isKnown |
|---|---|
| Known knowns | High isKnown — dense latent activation, or a resident page a reviewer signed |
| Known unknowns | Low isKnown, *measured* — the page-fault queue; the strict compiler's crystallization to-do list |
| Unknown unknowns | K-lines never minted, dereferences never attempted — no score exists; deopt is the detector that turns one into a known unknown |

And the comment's kicker — "Microsoft COM hinges on the IUnknown
interface" — closes a loop this document already opened: MOOLLM reads
directories as IUnknown (`ls` as QueryInterface — except `ls`
out-reflects it; see the accretion section: `ls` is a mirror), so the
whole object world already rests on the Unknown. Korz′ upgrades the root interface
by one letter and one type: **IUnknown → isKnown**, boolean interface
to measured float. (TypeScript's `unknown` is the top type and
`never` its dual bottom; Don's corollary stands — INever implements
IEnumerable, so you can iterate until the
[12th of Never](https://www.youtube.com/watch?v=2PnPnSjCUnc), and
that's a long, long time.)

### Paging latent space: K-line virtual memory

isKnown is the page fault detector; here is the fault handler. When
an important K-line dereferences below threshold, don't just
improvise cautiously — **page it in**: system call out to a web
search or vector-store lookup, distill what comes back, and cache it
as a repo file under the same K-line name
(`klines/gothic-victorian-newspaper.yml`, big-endian, greppable).
Next dereference hits the file instead of faulting.

The mapping is exact:

| Virtual memory | K-line paging |
|---|---|
| Virtual address | The K-line name |
| Backing store | Latent space and the web |
| RAM | The repo |
| Resident page | The cached file |
| Page fault | A dereference below the isKnown threshold |
| Fault handler | Search → distill → commit |

**The cache is editable and learnable.** Pages are yaml-jazz with
provenance — search date, sources, who distilled. Humans and LLMs
correct them in place; git versions every refinement. A wrong page
gets *fixed*, not just evicted.

**PR review is the memory integrity checker.** Paging in is a
commit, so every page-in can go through a pull request. The review
agent reads the new page's provenance, checks its claims against the
cited sources, and catches a bad page *before it becomes resident* —
ECC for the K-line cache, except the parity check is a literate
review and the correction is a diff. Hallucinations that survive
distillation still have to survive review. And unlike DRAM, a page
that passes review is *better* than its backing store: a reviewer
signed it.

**Cache policy falls out of the two signals already on hand.**

- Page in when isKnown is low and usage is high.
- Leave latent when isKnown is high — the training data is the file.
- A paged K-line serves both tiers at once: the strict tier reads the
  file; the soft tier reads the file *plus* the activation.

**The repo already runs this by hand.** Every `sources/` directory —
Vanessa's JIT notes fetched from squeak.js.org, hashed, and preserved
"so they survive even if the site goes away" — is a paged-in K-line.
The proposal just makes the librarian automatic and lets the
dispatch statistics decide what's worth shelving.

## Zorkizing Adventure

Knuth literate-ized Adventure: his CWEB edition of Crowther & Woods's
ADVENT (*Selected Papers on Fun and Games*) is the canonical literate
program — the cave as a book. Korz Jazz suggests the sequel:
**zorkize it** — rewrite the cave as a sea of slots with load-bearing
comments, one artifact that both tiers can run and both kinds of
reader can enjoy.

And Zork itself decomposes into Korz with almost no force. ZIL
dispatches every turn through parser globals — **PRSA** (the verb),
**PRSO** (direct object), **PRSI** (indirect object) — plus two more
implicit context globals the parser keeps bound: **WINNER**, the
character (say "ROBOT, PUSH BUTTON" in Zork II and the parser rebinds
WINNER to the robot — same verb, same object, different dispatch),
and **HERE**, the location (the current room, whose action routine
speaks first via `M-BEG`). Then a fixed most-specific-first cascade:
roughly the room, the indirect object's handler, the direct object's,
the verb's default. That is symmetric dispatch over an implicit
context with no privileged receiver — **five hardwired dimensions —
verb, direct object, indirect object, character, location — and a
frozen specificity order, shipped in the Z-machine in 1979**. The
Sims froze two dimensions (`me` and `stackObject` — see
[korz-notes](korz-notes.md)); Zork froze five, sixteen years earlier.
Korz generalizes to N: those five, plus light and the clock (daemons
and fuses become slots guarded on a time dimension), all become
ordinary addable dimensions, the cascade becomes the specificity
lattice, and "you can't get there from here" degrades from error to
improvisation in the soft tier.

**Character and location are the load-bearing pair.** They're the two
dimensions MOOLLM already reifies as first-class directories —
`characters/` and rooms, the adventure-game pair — which is why the
hosting section below works: the filesystem tree *is* those two
dimensions spatialized (containment is a guard; a character directory
is a standing `rcvr` binding). Zork bound them as globals; MOOLLM
binds them as addresses; Korz names them as ordinary dimensions and
lets you add the rest. **Korz may be
the ultimate adventure modeling and scripting language** — the
[GAME-PIECES](https://github.com/SimHacker/moollm/blob/main/designs/GAME-PIECES.md)
thesis stated as a language claim, and the anagram closing into a
loop a second time: first the troll was a Korz subjective object
*containing* Zork; now Zork the language *decomposes into* Korz the
semantics, letter for letter.

The toolchain sketch above completes the circle: Adventure → literate
CWEB (Knuth's weave) → jazz YAML (zorkized) → the Zork compiler →
deterministic Korz slots — played strict when the guards are
decidable, improvised soft when the player walks off the map.

## Hosting Korz in MOOLLM — soups intertwingled with objects

David prototyped Korz **in Self** — an interpreter, debugger, and
partial IDE hosted on the Self language, VM, and environment. MOOLLM
**is** Self on the filesystem: directories as prototypes, slots as
files, `parents:` / `inherits:` as ordered delegation, clone as
`cp -r`, reflection as `ls`. So the hosting question isn't "can we
build a Korz VM beside MOOLLM?" — it's "can MOOLLM host the same
Korz-in-Self move one level up, with the filesystem as the substrate
instead of the Self heap?"

Yes — and the asymmetry from [korz-notes](korz-notes.md) says it
should be *cheap*: Korz-in-Self took machinery; Self-in-Korz takes
only restraint (guard every slot on `rcvr` alone and you're writing
Self). MOOLLM's selfish object system is exactly that restraint —
**a one-dimensional Korz system**. The paper's spectrum runs from
procedural (zero dimensions) through single-receiver OO (one) to full
Korz (N). MOOLLM sits at dimension one: the receiver is the
directory path; lookup walks the parent list; first match wins. Add
guards on more dimensions and you've opened the sea without leaving
the repo.

So Korz soups and MOOLLM objects **intertwingle in place** — same
files, same
[yaml-jazz](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz)
syntax, same
[big-endian naming](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz)
(`2026-01-24-description.yml`), same git history as the time
dimension — dual-readable:

| Reading | What the filesystem is | Dispatch |
|---|---|---|
| **Self / MOOLLM** | Tree of prototypes | Send to path; walk `parents:`; first slot wins |
| **Korz** | Sea of slots | Send + implicit context; specificity lattice |

A `CHARACTER.yml` in the Self reading is prototype metadata and
shared state. In the Korz reading the *same directory* is a bundle of
guarded slots — and every file under it may carry more slots for other
selectors. Directory address supplies default coordinates
(`world: zork` because the file lives under `worlds/zork/`); moving
the file re-guards it. The tree isn't abolished; it's **one saved
view** among many the Korz dispatcher can cut through the sea.

### What is an interface in Korz?

In MOOLLM's
[Directory-as-IUnknown](https://github.com/SimHacker/moollm/blob/main/designs/DIRECTORY-AS-IUNKNOWN.md)
model, an interface is a **queryable facet** — drop `ROOM.yml`,
`CHARACTER.yml`, `SKILL.md` into a directory and QueryInterface finds
it. Inside-out COM: visible state, multiple interface files, shared
directory.

In Korz an interface is a **saved view** — a named cut through the
slot sea, not a container. The paper refused to reify layers in the
language and said the IDE would group slots as needed; an interface is
that grouping made durable:

```yaml
# INTERFACE.yml — Korz facet declaration (same filename, extended semantics)
interface:
  id: gatekeeper
  query: {rcvr: troll*, selector: [BLOCK, DEMAND-TOLL, BRANDISH-AXE]}
  default_context: {world: null}   # bind at query time
  advertisement: |
    Prices an edge. Currency depends on which mind fronts.
```

QueryInterface in the hybrid: "does this directory implement
`gatekeeper`?" → read `INTERFACE.yml` (or infer from slot files) →
bind the declared default context → surface the matching slot group.
Not a vtable — a **subjective projection** with a contract. Multiple
interfaces on one directory share the same files the way COM
interfaces share state; in Korz they share the **sea** underneath.

### What are cards?

In MOOLLM the semantic image pyramid is fixed resolution:
[GLANCE.yml](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz)
→ CARD.yml → SKILL.md → README.md — precompiled views at increasing
depth, each a K-line activation packet.

In Korz a **card** is the same idea wearing guard algebra:

| MOOLLM | Korz |
|---|---|
| GLANCE | Minimal guard + one-line activation ("is this relevant?") |
| CARD | Saved view at medium resolution — methods/advertisements as guarded slots |
| SKILL | Full slot space for that facet — every selector, every guard stance |
| README | Human narrative layer; comments load-bearing in the soft tier |

`CARD.yml` on the Cross-Platform Troll is already both readings at
once: Self-side rarity, methods, and combos_with *and* Korz-side
advertisements (`BLOCK`, `BLEND-FRONT`, `READ-HEADS`) that dispatch
when `{rcvr: troll*, ...}` matches. The card doesn't own the troll —
it **advertises** which slots exist and how to invoke them from a
typical context. Add dimensions to the card's guard and you've
declared which subjective object you're looking at.

**A card is a bundle of Sims advertisements — guarded and scored.**
Look at the troll's advertisement shape: `action` (selector),
`condition` (guard), `score` (weight), `effect` (body). That is a
Korz slot with one addition Korz doesn't have: the **explicit score**.
Korz derives precedence structurally — unique most-specific wins, ties
are errors; The Sims declared it numerically — every object advertises
scored actions, every Sim re-weights the scores through its own needs
and personality, and dithers among the top few. So MOOLLM cards have
been doing Korz dispatch all along, on roughly one dimension, with an
**auction instead of a lattice** — which is exactly the korz-notes ASK
("would he buy dispatch as an auction?") already running in
production. The score is where the two resolution strategies meet:
lattice specificity is a score the guard structure computes;
advertisement scoring is a lattice the designer flattens by hand; the
soft tier's relevance sampling interpolates between them.

### Dropping interface files — accretion, state, pointers

How does dropping `ROOM.yml`, `CHARACTER.yml`, `HTML-RENDERER.yml`
into a directory actually work? **By accretion, with no
registration.** The directory is the object; the filename is the
interface ID; QueryInterface is a stat call — and **`ls` is more
powerful and reflective than QueryInterface ever was. `ls` is a
mirror.** QueryInterface only answers yes or no to an IID you must
already possess — COM never shipped enumeration, so you interrogate
IUnknown by guessing GUIDs you brought from somewhere else. `ls`
inverts the epistemics: the object volunteers its complete manifest,
unprompted, in human-readable names — and since names are K-lines,
each line of the listing is also an activation, which is why
yaml-jazz says the directory listing *is* the advertisement index,
the Sims-style "what's here?". COM's root interface confesses
ignorance (IUnknown: you must already know); the filesystem's root
operation confers knowledge (`ls`: now you know). The object shows
you itself — reflection without registration, introspection for the
price of a syscall, the same move cursor-mirror makes one level up
when a session reads its own transcript. Drop the file in and the
object grows a queryable facet without touching anything that was
already there
([Directory-as-IUnknown](https://github.com/SimHacker/moollm/blob/main/designs/DIRECTORY-AS-IUNKNOWN.md)
calls this design by accretion). In the Korz reading, dropping an
interface file **pours new slots into the sea** pre-guarded by the
directory's address coordinates: an `HTML-RENDERER.yml` under
`troll/` arrives already guarded `{rcvr: troll*}`; its own keys add
`{medium: html}`.

**Yes, they carry state as well as declarations** — that's the
inside-out-COM point. COM hid state behind interface methods; MOOLLM
inverts it: the directory is visible state, and the interface file is
both a contract *and* a place to keep the facet's own slots. A
`ROOM.yml` holds exits, contents, and mood (state) next to its
protocol hooks (declarations). COM even has the precedent for facet-
private state: **tear-off interfaces**, created on demand with their
own storage — dropping `HTML-RENDERER.yml` with a `theme:` block is a
tear-off that persists. In Korz terms the distinction dissolves
anyway: state is slots with data bodies, declarations are slots with
guard templates, and both float in the same sea.

**And yes, they point to other files** — pointers are just slots
whose bodies are addresses, and addresses come in two kinds: paths
into the repo and K-lines into latent space (see "Names are
inheritance" above — any slot, not just `parents:`, can hold either).
The path idiom is everywhere already:
`prototype:` and `parents:` (delegation), `script:` in CARD methods
(behavior lives in a sibling file), `see_also:` (associative edges),
the troll instance's pointer-file visa. Shared state between facets
is the same move: `ROOM.yml` and `BUSINESS.yml` both pointing at
`inventory.yml` is COM aggregation with the sharing visible in the
open. One worked example, all three at once:

```yaml
# HTML-RENDERER.yml — dropped into troll/; the facet arrives by accretion
interface:
  id: html-renderer
  query: {medium: html}        # + {rcvr: troll*} free, from the address

state:                         # tear-off state, private to this facet
  theme: bridge-gothic
  last_rendered: 2026-08-20    # facet remembers; directory persists it

pointers:                      # slots whose bodies are addresses
  template: ../shared/character-page.tmpl.html
  heads_widget: ./heads-gauge.js   # renders the live fronting weights
  shares: ../CHARACTER.yml         # reads the same soul every facet reads

advertisements:
  - action: RENDER
    score: 80
    condition: "medium: html AND observer wants a page"
    effect: "Emit the troll's page; heads drawn at current weights."
```

Query it, and the directory answers as an HTML renderer; delete the
file, and that facet of the object simply ceases — no deregistration,
no dangling vtable, and every other reading of the directory
untouched.

The Zork compiler (above) is what turns a SKILL-level slot space into
strict-tier Korz — CARD and GLANCE survive as the human/LLM-facing
views; the compiled sea is what the VM runs.

### The self-revealing soup

`ls`-is-a-mirror is the static claim; here is the dynamic one: the
slot soup is a **self-revealing interface** in the pie-menu sense
([gesture-space-self-revealing-ui](../../repo-shows/gesture-space-self-revealing-ui/)).
A pie menu's display isn't separate from its expert gesture — the
novice's guided walk *is* the rehearsal for the expert's blind
stroke, same motion at different speeds. The soup works identically:
the novice runs `ls`, reads names, descends; the expert types the
full path unprompted. Browsing trains direct address, because the
reveal and the invocation are the same syntax. No mode switch, no
separate command language to graduate into — the menu *is* the
gesture.

And the reveal is **hierarchic both ways at once** — directories and
alphabetical sorting of shared prefixes — because hierarchy in the
soup is *revealed, not imposed*. Sorting adds nothing; it exposes
structure the big-endian names already carry: a flat `ls` of
prefix-clustered names reads as an outline, and `ls -R` is the same
outline played on directories. The two axes are one mechanism at two
temperatures: `/` is the hard separator (crystallized hierarchy —
somebody ran `mkdir`), `-` is the soft one (implicit hierarchy —
nobody had to). A path is a big-endian name whose separators got
promoted; a prefix cluster is a directory that hasn't been mkdir'd
yet; promotion and demotion are ordinary renames, and rename
re-guards, same rule as always. So the sea is flat and hierarchic
*simultaneously* — the hierarchy is just the cheapest saved view
there is, the one `sort` computes for free — which is the
interfaces-are-saved-views doctrine bottoming out in the collation
order of the filename alphabet.

### No IDE required — bootstrapping on bare files and git

Design constraint, stated flat: **this has to work with a normal
filesystem and a git repo, no IDE.** So what about Korz actually
*required* one? Audit the paper's IDE dependencies and almost all of
them turn out to be compensation for the heap — slots lived in an
opaque Self image, so you needed a tool to see them at all. Put the
sea in files and the image is born visible; the residue is semantic,
and the LLM covers it.

| The IDE did | The bare repo does |
|---|---|
| Group slots into objects/layers on demand | Directories, big-endian prefixes, `INTERFACE.yml`/`CARD.yml` — saved views that are *durable and versioned*, where the IDE's were ephemeral |
| Browse and navigate the sea | `ls` is reflection, `glob` is a subtree query, `grep <selector>` is "show every slot for this message"; filenames are K-lines; directory listings are advertisements |
| Answer "what does this code do in all contexts?" | The LLM cuts any subjective plane and narrates it — the disco ball talks in chat, no window system required |
| Guard-writing support, ambiguity warnings | The strict compiler's refusal is the linter; `git diff` and PR review are the change protocol; crystallizations reviewed like pull requests |
| Debugging symmetric dispatch (no receiver to follow) | Dispatch traces as plain text committed beside the code; the provenance dimension; the troll's heads — weights worn as visible anatomy; `git bisect` as the time-travel debugger |

The pattern: the Korz prototype inherited its IDE-dependence from its
host — it was built *on the Self environment*, where everything lives
in an image and outliners are how you see. MOOLLM made the opposite
bet and it's load-bearing here: `cat`, `ls`, `grep`, `glob`, and
`git` are the primitive IDE, the yaml-jazz comment channel carries
what tooltips and inspectors carried, and the LLM supplies the one
genuinely semantic service (cross-context comprehension) that Unix
tools can't. That service used to require building an environment;
now it requires a conversation.

So the bootstrap order inverts the paper's: **files first,
conversation second, IDE last** — and when the IDE eventually comes,
it's progressive enhancement generated *from* the same data (GLANCEs
and CARDs are precompiled views; an IDE is just a renderer for saved
views with faster refresh). Nothing in the semantics waits for it.

**ASK David:** is this how he imagined the partial IDE — saved views
over the sea, not reified layers — and does hosting Korz in Self
predict that the filesystem could host both readings without a second
repository? Sharper: how much of the prototype's IDE was Korz
needing an IDE, and how much was the Self image needing a window? If
the slots had been files in a repo, what tooling would he have
actually missed?

## What the soft tier adds to Korz's open problems

The paper's future work asked for dimensions that alter the
interpreter. Take that seriously and standardize three:

- **`ambiguity:`** — what to do on multiple most-specific matches:
  `error` (Korz), `arbitrary` (Linda), `sample` (LLM), `blend` (LLM
  method combination: merge the matching bodies — the composition
  operator no deterministic dispatcher can offer, because it requires
  understanding what the bodies *mean*). `blend` already has a running
  specimen: the
  [Cross-Platform Troll](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/troll)
  can front one mind — zork-mind or adventure-mind — or blend between
  them, mixing the minds together with different **weights**. The
  weights are just more context bindings: `{world: {zork: 0.7,
  adventure: 0.3}}` turns a coordinate into a distribution, dispatch
  into a mixture, and the sample/blend distinction into a continuum —
  sampling is blending with all the weight on one slot. And the troll
  is **literally two-headed** (retconned canonical, one head per
  mind, more addable): head size displays the live fronting weight,
  so the dispatch mixture is visible anatomy — you know you're in
  trouble when the bridge-toll head shrinks and the fighting head
  expands. Debuggability by physiology: the blend that "no debugger
  can see" (ASK below), worn on the neck.
- **`temperature:`** — how adventurous sampling and improvisation may
  be. Ambient; a room can set it (MOODY). Zero recovers determinism:
  strict Korz is the corner case Korz′ reaches at temperature 0 with
  decidable guards.
- **`provenance:`** — who wrote this slot (human, model, session,
  date) and how trusted it is. Korzybski's time-binding as a
  dimension; also the mechanism for *defaults without rules* — a
  well-provenanced slot wins ties without ever becoming mandatory.

And the IDE problem — "what does this code do in all contexts?" was
Korz's hardest usability question — inverts: the soft tier's mirror
is conversational. Ask the model to cut any subjective plane through
the sea and narrate it. The disco ball talks.

## What each reader gets

- **Humans** read YAML files with English names and jazz comments,
  diff them in git, and review crystallizations like pull requests.
- **LLMs** read the same files as activations (names are K-lines,
  comments are semantics), write new slots as data not code, execute
  the soft tier natively — MOOLLM already runs this loop for the
  Selfish prototype model; Korz′ just gives the dispatch a guard
  algebra.
- **Machines** parse the structure, compile the decidable subset,
  and run it fast, deterministically, offline — with deopt as the
  escape hatch instead of a crash.

## Testing it

The experiment ladder for all of this —
[KORZ-LLM-EVALS](https://github.com/SimHacker/moollm/blob/main/designs/KORZ-LLM-EVALS.md):
mechanical dispatch against a reference implementation (with an
anti-Korz control spec to separate rule-following from training
prior), soft matching against human panels, latent inheritance under
precedence rules, and the Sims advertisement economy as the
integration test — a poison buff that advertises "cure me" to anyone
guarded `skill: medical`.

## ASK David

- Does the JIT framing land? Crystallize/deopt is Self's speculative
  optimization applied to *semantics* — is that a continuation of the
  Self VM work or an abuse of it?
- Where does the tier boundary want to sit? His VM instincts on what
  "hot and stable enough to compile" means when the interpreter is a
  language model.
- Should `blend` frighten us? Method combination by semantic merge is
  either the answer to Korz's composition problem or a new kind of
  bug no debugger can see.
- Is prose-in-guards a feature or a moral hazard? (The strict tier's
  refusal to compile it is the only discipline on offer.)
