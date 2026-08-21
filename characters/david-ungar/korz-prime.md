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
Sidecar: [korz-prime-trajectory.md](korz-prime-trajectory.md) — the
session that grew this document, as a K-line paging log: what Don
pointed at, what came back, where it crystallized.

The name, after Bourland's E-Prime: Korz minus the assumption that
dispatch must be decidable. Alternative naming scheme, via the
anagram: the deterministic tier is **Korz**, the LLM tier is **Zork**.
Korz compiles; Zork improvises.

## Interpret, don't invent

The method throughout this document, stated once so every section
can lean on it: **no new mechanisms — only new readings of
mechanisms already deployed.** What we are really building is a way
of *tilting your head in multiple dimensions at once*, so that an
ordinary directory tree of ordinary files reads as a tag-soup Korz
system.

The precedent is NeWS's `class.ps`
([Densmore, "Object Oriented Programming in NeWS," Monterey Usenix 1986](https://mirrors.meulie.net/bitsavers.org/pdf/sun/NeWS/Densmore_-_Object-Oriented_Programming_in_NeWS_Monterey86.pdf)
— "Much to our surprise, PostScript could implement classes with no
modifications! The secret is PostScript dictionaries."), which got a
full class system with inheritance not by extending the PostScript
VM but by *respecting* it: the dictionary stack was already a
delegation chain, so class.ps made dict-stack search *be* method
lookup — the object system was a disciplined way of using what the
host already did on every name lookup.

And the same two people then aimed the same trick at the filesystem
itself. Owen Densmore and David S. H. Rosenthal's
[US Patent 5,187,786](https://patents.google.com/patent/US5187786A/en)
(Sun, filed April 1991) is "a method for implementing a class
hierarchy of objects in a hierarchical file system" — classes as
directories, methods and instance variables as files, inheritance
via path files whose contents are logically related by the class
relationships, `Self` and `Super` as pseudo entries — explicitly
requiring **no additional file attributes** from the filesystem. The
directory-tree-as-object-system head-tilt is not a metaphor Korz′
invented; it is prior art, patented by the class.ps authors, and
expired in 2011 — public-domain furniture now. What their patent
froze was a single dimension: the class hierarchy, materialized as
*the* tree. Korz′ generalizes the same reading to N dimensions —
the tree stays put and the dimensions are in the tilt of the
reader's head.

Korz′ owes the filesystem, git, and Unix
the same respect class.ps paid the PostScript interpreter. Itemized:

| Already exists | Head-tilt reading |
|---|---|
| Directory tree | Sea of slots; containment is a guard |
| Filename prefixes + sort order | Implicit subtrees; cheapest specificity index |
| Filename suffix | Type declaration on the reader dimension |
| URL fragments — `#row=`, JSON Pointer, `#t=`, `#xywh=` | The guard chain continuing inside the file — intra-file coordinates |
| `ls` | The mirror — reflection, advertisement index |
| YAML comments | Load-bearing semantics (Korz Jazz) |
| `git log` / `diff` / `bisect` | Time dimension, change protocol, time-travel debugger |
| `sources/` directories | Paged-in K-lines |
| Pull-request review (git PR — proposed changes reviewed before merging) | Memory integrity check for the K-line cache; human-and-agent-in-the-middle |
| The LLM | doesNotUnderstand promoted to peer dispatcher |

One row deserves spelling out, for readers who have never merged a
branch. A PR — pull request — is git's code-review ritual: someone
proposes a set of changes on a branch, others read the diff, comment
line by line, request revisions, and finally merge or reject.
**THIS is human-and-agent-in-the-middle.** GitHub is a massively
multiplayer online game whose world state is structured knowledge:
humans and agents collaborate in building, reviewing, and processing
it along branching, merging timelines — issue tracking, code review,
discussions, releases, blame, and more affordances than anyone can
enumerate. Every mutation is proposed, inspected by any mix of human
and machine reviewers, and only then merged into shared reality. For
Korz′ that ritual is the write barrier: nothing enters the soup
unreviewed, and the reviewer can be a person, a model, or both
taking turns.

Nothing in the left column was built for Korz′; everything in the
right column is a way of *reading* it. And the head-tilt is
reflexive — choosing which dimensions to read the repo along is
itself a Korz dispatch, a context vector applied to the world. The
discipline matters because it is the same discipline that made the
ancestors essential rather than merely clever: Self got its power by
*removing* — classes, variables — until only objects and messages
remained; Korz removed the receiver and the object boundary until
only slots and context remained. Korz′ tries to remove the last
thing: the requirement that anything new exist at all. If a feature
needs a mechanism the filesystem, git, and the model don't already
supply, it doesn't belong here. A language you adopt by
reinterpreting the repo you already have is a language whose VM is
already installed everywhere.

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

That doesNotUnderstand row is the oldest trapdoor in object-land, and
worth naming as lineage: Smalltalk-80's `doesNotUnderstand:`,
Objective-C's `forwardInvocation:`, Ruby's `method_missing`, Python's
`__getattr__`, Perl's `AUTOLOAD`. Every dynamic language kept a hatch
where *failed dispatch becomes a first-class event with a handler* —
and the handler is where the magic always lived: proxies, mocks,
ORMs, NeXT's entire Distributed Objects remoting system squatting in
Objective-C's forwarding path. Those systems proved that the failure
path can carry production architecture; they just had to hand-write
the handler per trick. Korz′ finishes the thought: **the soft tier is
doesNotUnderstand: promoted from escape hatch to peer dispatcher.**
The handler of last resort is a mind with the training distribution
behind it, "message not understood" stops being an error family and
becomes the boundary marker between the tiers, and crystallization
moves that boundary one slot at a time.

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

**And the suffix is a type declaration.** A filename is big-endian
almost all the way: most significant first, subject before detail —
except the very end, where one little-endian holdout declares the
*type*: `.yml`, `.png`, `.pdf`, `.js`. In the Korz reading the
extension is a guard on the **reader dimension** — it dispatches
perception itself. `.yml` says parse me as structured text with
load-bearing comments; `.png` says run me through the vision tool;
`.pdf` says extract me; `.js` says I am executable by the strict
tier. The LLM reads the suffix the way a compiler reads a type
annotation: it selects which faculty to bring, before a single byte
of the body is touched. So one filename carries the full dispatch
recipe — prefix path says *what it's about* (semantic address,
big-endian), suffix says *how to perceive it* (type, little-endian
caboose) — and MIME types turn out to have been coordinate guards
worn on the name all along.

### Fragments — the path drills through the file boundary

Paths don't stop at files. URLs continue inside with `#` and `?`,
and the internet already standardized the per-format drill-down:
[RFC 7111](https://www.rfc-editor.org/rfc/rfc7111) gives CSV
`#row=2-5`, `#col=3`, `#cell=4,2` — row, column, cell, region;
[JSON Pointer](https://www.rfc-editor.org/rfc/rfc6901) gives
`#/defs/troll/greet`, the `$ref` idiom JSON Schema runs on;
[RFC 5147](https://www.rfc-editor.org/rfc/rfc5147) gives plain text
`#line=10,20` (GitHub's `#L10-L20` is folk practice of the same);
[W3C Media Fragments](https://www.w3.org/TR/media-frags/) give
`#t=10,20` into a video and `#xywh=160,120,320,240` into an image —
drilling by time and by pixel region. One uniform notation, cross
syntax, XPath's ambition done federated: **as easy and as cheap to
point at a cell as at the file as at the directory.**

In the Korz reading the fragment is the guard chain continuing past
the file boundary. The directory supplied coarse coordinates, the
filename prefix finer ones, the suffix picked the reader — and the
fragment addresses *within the reader's own coordinate system*:
`#cell=4,2` is `{row: 4, col: 2}` worn on the address, a hyperslab
range is a region guard. Every address is a guard vector at
successively finer grain, and the file boundary is not a wall — just
the point where the dimension vocabulary changes.

**And it recurses through archives.** A suffix that names an archive
reader turns "file" back into "directory": a zip is a filesystem in a
file (and half the world's formats confess it — `.jar`, `.docx`,
`.epub` are zips wearing costumes), a `.tgz` is one with a bow on it,
and loopback mounts and FUSE make the head-tilt literal — `mount`
*is* the reinterpretation operator. The Sims shipped this doctrine in
1999: **FAR** files are Maxis archives containing **IFF** object
files, and IFF is itself chunked — `OBJD` definitions, `SPR2`
sprites, `TTAB` action tables, `BHAV` SimAntics behavior trees — so
one address drills `objects.far#/troll.iff#/BHAV/4096` from archive
through object through chunk to a single behavior tree, alternating
file and directory vocabularies the whole way down. Don's
Transmogrifier walked exactly that path twenty-five years ago; the
drill already exists, it just never got written as a URL. Turtles all
the way down, and every turtle is addressable.

**Higher-dimensional spreadsheets exist, and the best one is a
directory tree.** CSV never grew an N-D extension worth having; the
real lineage is HDF5/NetCDF — named dimensions, hierarchical groups,
an internal filesystem with `#/group/dataset` paths plus hyperslab
selection — and **Zarr**, which stores an N-D array as a directory
tree of chunk files where *the chunk's coordinates are its filename*.
That's our head-tilt running in reverse: the array world looked at a
directory and saw a tensor. Or skip formats entirely and fold a flat
file numpy-style — shape, strides, rowbytes: three integers turn
bytes into any rank you like, the oldest lesson in the business that
**dimensionality is a reading, not a property of the bytes**. And the
pun that isn't one: array *dimensions* and Korz *dimensions* unify.
A context vector is an index tuple into a sparse, high-dimensional,
semantically indexed array; the sea of slots is a sparse tensor whose
axes have names like `mood` and `world`; a dense numeric array is
just the corner of the sea where every coordinate happens to be an
integer and every cell happens to be full.

### CSV headers bind to dimension names

So how would that work — the header row as dimension binding? Take
the troll's three `greet` slots from above and lay them flat:

```csv
rcvr,world,mood,greet
troll*,zork,,The troll brandishes his axe and blocks the passage.
troll*,adventure,,The troll demands payment before you may cross the bridge.
troll*,,*,"Greet to fit {mood}; menace if provoked, grudging respect if they've beaten you."
```

The header row declares which dimensions this file's rows are
guarded on; **each data row pours one guarded slot into the sea**,
and the three guard stances map onto cell syntax with nothing left
over: an **empty cell** is *unmentioned* (the row stays generic on
that dimension — the honest structural absence from the null table,
not a null), a **`*`** is the *bare* stance (bind whatever mood is
present), and a **value** is *constrained*. Dispatch is row
selection: `greet.csv#world=zork` — RFC 7111's positional fragments
upgraded to named ones, the query string as guard expression — and
most-specific-wins falls out as *fewest empty cells among the
matching rows*. Sorting by guard columns, big-endian, groups the
table into its own specificity lattice: the flat CSV is a little
sea, and every sort order is a saved view, same fractal as the
directory.

And this reading has three famous ancestors, none of which knew they
were doing Korz: **decision tables** (1960s — condition columns,
action columns, most-specific row wins; the shape survives in
`.gitattributes` and firewall rule tables); **Codd's relational
model** (1970 — a relation *is* a set of tuples over named
attributes, `SELECT ... WHERE` *is* a guarded query over named
dimensions; the relational database was N-dimensional dispatch all
along, minus the specificity lattice); and **tidy data** (Wickham —
one variable per column, one observation per row: the
coordinate-native serialization of a sparse tensor, which is why
`pandas.melt` and `xarray` convert between CSV-shape and
tensor-shape mechanically). The Zork compiler gains a second
target: crystallize hot slots not into code but into a dispatch
CSV — diffable row-wise in git, greppable, sortable into its own
lattice, loadable by the strict tier as a table and readable by the
soft tier as prose with a header.

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

## Cellular automata — Korz at absolute zero

How does Korz map to CAs? **Neighbors are dimensions.** A cell's
update rule dispatches on its neighborhood, and the neighborhood is
an implicit context: von Neumann is five named dimensions (`c`, `n`,
`s`, `e`, `w`), Moore is nine, an MFM event window is forty-one. The
rule table is a set of guarded slots over those dimensions — and it
is **total and decidable**: every context matches exactly one rule,
zero ambiguity, nothing left latent. A cellular automaton is the
extreme strict tier — Korz fully crystallized, the specificity
lattice flattened into a complete lookup table. **Korz at absolute
zero**: Zork froze five dimensions, The Sims froze two, and the CA
freezes them all the way down to the compass rose.

The classic rule families are guard algebra wearing lab coats:

- **Totalistic rules guard on derived dimensions.** Life's B3/S23
  never looks at individual neighbors — it guards on their *sum*:
  `{center: dead, live_neighbors: 3} → born`. An aggregate of
  dimensions used as a dimension. (ASK David: are derived/computed
  dimensions ordinary dimensions, or a new kind of guard? The
  Margolus bullet below finds a second species — coordinate
  transforms, not just aggregates.)
- **Rotational symmetry is guards quotiented by a group.** A
  symmetric rule doesn't enumerate four rotations; it matches the
  *orbit*, not the point — dispatch modulo group action, a symmetry
  declaration collapsing many contexts into one equivalence class.
- **The Margolus neighborhood is no-privileged-receiver in
  silicon.** A 2×2 block with *no center cell* — four sites dispatch
  symmetrically, none of them "the receiver" — and the alternating
  partition makes the block phase a **time-and-space parity
  dimension**: `T` decides which tick's partition you're in, `V` and
  `H` decide which corner of your block you are, so the same four
  cells match different slots on even and odd ticks *and* the block
  boundaries themselves shift under your feet.
  Reversible rules make the slot set bijective — `git revert` as
  physics.

  And here's the head-tilt: the Margolus neighborhood **isn't new
  hardware, it's a derived coordinate system**. CAM-6 implemented it
  on plain Moore-neighborhood machinery: the block-relative
  dimensions `C`, `CW`, `CCW`, `OPP` are *functions* of the compass
  rose (`N S E W NW NE SW SE`) plus three phase dimensions — `T`
  (time parity), `V` (vertical phase), `H` (horizontal phase). Which
  physical neighbor is "clockwise from you" depends on where you sit
  in the block and which tick it is — a **change of basis over
  dimensions you already had**. That sharpens the derived-dimensions
  question from the totalistic bullet: Life's `live_neighbors` is an
  *aggregate* (sum of dimensions), but `CW` is a *coordinate
  transform* (permutation of dimensions indexed by other
  dimensions). Same machinery, second species.

  The rules complete the no-privileged-receiver story, and the name
  for it is **multiple dispatch**. Single dispatch picks the method
  from one privileged receiver (`cell.update(...)`); multiple
  dispatch (CLOS, Cecil) picks it from the joint types of *all* the
  arguments; and Korz goes one step further — dispatch on the whole
  **context**, where "arguments" and "environment" are just
  dimensions, and nothing is the receiver. A Margolus rule is
  exactly that: a generic function whose method is selected by the
  **joint state of all four sites plus the phase dimensions** — not
  `nw.update(ne, sw, se)` but `update{a, b, c, d, T, V, H}`, written
  **once, rotationally symmetric (dispatch modulo the rotation
  group), with four receivers and four outputs**. Every site is
  simultaneously an argument to dispatch and a result of it; the
  block updates as one atomic multimethod call. Korz's symmetric,
  receiverless message send was running in silicon in 1987. The
  crystallization pipeline shipped there too: CAM-6 rules were
  written in Forth and *compiled into lookup tables* — expressive
  description down to total dispatch table, exactly the
  Zork-compiler movement — the machine Don's own
  [CAM6.js](../don-hopkins/cam6-cellular-automata-machine.md)
  simulates and the [Norman Margolus
  show](../../repo-shows/norman-margolus/) plays live.
- **The Moveable Feast Machine is the soft tier's physics.**
  Ackley's MFM abandons the synchronous total table: events fire
  asynchronously and stochastically, and an element's behavior
  function acts on *whatever its event window actually contains* —
  including noise, decay, and corruption. That is deopt-not-segfault
  as a physical law: robust-first, survive > heal > function,
  guards written to tolerate partial matches instead of erroring on
  them. The MFM sits exactly on the tier boundary — strict elements,
  soft scheduling — and its indefinite scalability comes from
  refusing the strict tier's global synchrony the same way the soft
  tier refuses its global decidability.

The soft tier adds one more reading: a neighborhood can be a
*pattern coordinate* instead of per-site dimensions — `neighborhood:
glider-head` is a K-line guard, which is how humans actually talk
about Life (nobody says "dead cell with three live neighbors
northeast"; they say *glider*). Pattern names are the semantic
compression the strict table can't express and the soft tier gets
free.

### Crystallization targets — compile Korz to kernels

CAM-6 already proved the movement: Forth descriptions compiled into
total lookup tables. Generalize the back end and Korz becomes a
**source language for GPU kernels**. The soft tier (an LLM) reads a
Korz spec — dimensions, guards, neighborhood declarations, symmetry
quotients — and lowers it to:

- **PyTorch** — wildly specialized CA and image-processing flows as
  tensor programs, including **training and generation**: make the
  rule table differentiable and you're in neural-CA territory
  (Mordvintsev's growing CAs), where the crystallized table is the
  *result* of gradient descent instead of hand enumeration. Korz
  guards in, learned physics out.
- **WebGPU TypeScript** — better, because it runs where the audience
  is: in the browser, with `getUserMedia` putting the **video camera
  in the loop**. Camera → compute shader pipeline → canvas → camera:
  [Crutchfield's variation (6)](../jim-crutchfield/papers/README.md)
  — "insert a digital computer into the feedback loop via a video
  frame buffer" — running live in a tab, forty-two years later. The
  1984 control knobs map straight onto shader uniforms: rotation,
  zoom, and pan choose *which cells are your neighbors*, focus is
  the diffusion radius — dimension guards you turn with a slider
  instead of a lens ring.

The pipeline is the same in both cases: **describe in Korz, ask the
soft tier to crystallize, run the strict artifact on the GPU** — and
when a guard needs renegotiating, melt it back up a tier and
recompile. Zork-compiler movement, hot loop edition.

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

### Sparse shadow trees — null means "ask your parent"

Name for a pattern this document keeps using without naming: a
**sparse shadow tree** is a secondary hierarchy that shadows a dense
primary tree but only materializes nodes where a value actually
*changes*. Everywhere else the slot is empty, and empty means
**delegate up** — fall through to the nearest materialized ancestor.

The type specimen is **ScriptX clocks over views** (Don was there).
Every view has a clock slot; the root view has the root clock. A
subview's clock is either null — inherit your (grand\*)parent's clock
— or an explicit reference, which may just point at the same clock the
parent uses; same effect either way. The default is inherit, so you
never end up with unnecessary clocks: the clock tree stays a sparse
shadow of the dense view tree, materialized only where somebody
actually needed a new timebase (a paused panel, a reversed movie, a
slow-motion inset). Time inheritance rides the containment hierarchy
for free, and overriding it costs exactly one node.

The same term describes MOOLLM's **placement hierarchy**: the
containment tree of *rooms holding things* is a sparse tree over the
physical directory tree, skipping the intermediate **chrome** —
`sources/`, `media/`, organizational directories that exist for
filing, not for meaning. Placement materializes only at the
semantically load-bearing nodes; everything between them is
fall-through.

And it answers a Korz scaling worry directly: won't N dimensions
demand N parallel trees? No — **one dense tree, N sparse shadows,
each nearly empty.** Every dimension (time, style, provenance,
security, mood) keeps its own shadow over the same files,
materializing a coordinate only where it changes; absence delegates
up. This is prototype delegation projected onto containment — don't
copy, don't materialize, fall through — which is why it feels
Self-shaped: the shadow tree is to the containment tree what the
parent slot is to the object.

Prior art is everywhere once it has a name: **CSS inherited
properties** (set `color` on one node; ten thousand descendants read
it without storing it), **X resources** falling through the widget
hierarchy, **git config** (system → global → repo → worktree),
**process environments** (fork inherits; override one variable),
**Emacs buffer-local variables** shadowing globals. The dense
counterpart is the scene-graph transform, where *every* node composes;
the sparse shadow is what you build when most nodes have no local
opinion. (Not to be confused with the DOM's "shadow tree," which is
encapsulation — walls. This is the opposite: transparency by
fall-through.)

**But which parent? "Ask your parent" is a big ask.** In a soup,
"parent" has a lot of subjective and objective meanings at once: the
same node is embedded in many hierarchies simultaneously — physical
directory parent, placement parent, time parent, style parent — and
may have **multiple parents within one hierarchy** besides. An
unqualified fall-through instruction would be a dangling pointer of a
different flavor. The resolution is that the null is
**dimension-indexed**: empty doesn't mean "ask *the* parent," it
means "ask my predecessor **along the tree whose shadow this is**."
So: a null clock means **inherit from your time-parent**. A null
placement means ask your **place-parent**; a null style, your
**style-parent**. The hyphenated compound is the dimension index made
visible in the name — big-endian naming applied to kinship, so the
word itself carries the guard. Each sparse shadow supplies its own
parent function; the time-parent climbs the view tree, the
place-parent climbs the room tree, and they can disagree about who
your parent is without conflict, because they are different
questions. ScriptX and CSS never noticed the problem only because
their hosts were single-parent trees — the degenerate case where all
the parent functions coincide and "parent," unqualified, is
harmless.

And when a single dimension genuinely offers multiple parents
(ordered delegation, Self-style), fall-through lands in machinery
this document already built: **ordered parents** resolve it the way
Self's parent priorities do, and a genuinely unordered tie is just
**ambiguity**, handled by the standing policies — `error` in the
strict tier, `sample` or `blend` in the soft tier. A slot with two
time-parents and no preference *blends their clocks* the way the
troll blends his heads. Whether that's a feature or a horror is a
per-dimension guard decision, which is exactly where Korz likes to
put such decisions.

One more resolution for the nulls section above: *this* null is the
benign kind. It isn't Hoare's billion-dollar "value that explodes when
touched" — it's a **delegation instruction**, "no local opinion, ask
my parent along this dimension." Absence-as-delegation is the one
null that was never a mistake; Self bet the whole language on it —
though Korz has to say *which* parent, because it dissolved the
privilege of having only one.

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
- What are derived dimensions, formally? The CA section finds two
  species: **aggregates** (Life's `live_neighbors`, a sum used as a
  dimension) and **coordinate transforms** (CAM-6's Margolus
  neighborhood: `CW`/`CCW`/`OPP` as permutations of the Moore
  compass indexed by phase dimensions `T`/`V`/`H`). Are both
  ordinary dimensions, a new guard kind, or evidence that dimensions
  form an algebra?
