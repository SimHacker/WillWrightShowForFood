# Ideas to explore with Gwern Branwen 🧊

*Conversation hooks — Don's proposed topics, grounded in public work.
Not quotes from Gwern.*
[Portrayal standards](../../schemas/portrayal-standards.md)

Corpus- and authoring-weighted on purpose. The overlapping-but-differently-aimed companion is
[`../said-achmiz/ideas.md`](../said-achmiz/ideas.md), which takes much of the same material from the
implementation side. Both directories carry the same credit line; receipts in
[`../said-achmiz/sources/gwern-net-credits.md`](../said-achmiz/sources/gwern-net-credits.md).

## What Gwern has done (public record)

[gwern.net](https://gwern.net/): long-form, endlessly revised essays across machine learning,
statistics, psychology, genetics and self-experiment, published as a hypertext instrument rather than
a blog — iceberg pages with collapsed depth, link annotations with local archive mirrors, backlinks
carrying their calling context, recursive transclusion, sidenotes, a published
[design essay](https://gwern.net/design) that stays current, and a companion essay on the features
that were **tried and rejected**. Stated principles include *reader > author*, *give the reader
agency*, and *local > remote*. Design and much of the JavaScript/CSS credited to **Said Achmiz** since
2017; gwern's own phrase for the relationship is **"tech co-creator."**

## The hooks

### 1. He cited Don, which is where this starts

The [Xanadu essay](https://gwern.net/xanadu) identifies Don as a participant in early hypertext
(NeWS, HyperTIES), quotes his contemporaneous Scripting News criticism of the machine-generated Xanadu
C++ release, and resurrects his 1999 question: **"Has Xanadu been used to document its own source
code?"** — evidence that Xanadu's failure to become its own convincing use case was identified while
the wreckage was warm, not in hindsight. Worth opening with, because it is the actual reason these two
bodies of work found each other.

### 2. HyperTIES 1988: the semantic ladder as a mandatory schema

Unpublished primary sources from Don's own team. Every article required **title, synonyms,
description, body** — with build scripts proving the definition was a separate compilation unit. That
is link-icon → title → abstract → section, shipped as a *required* schema thirty-eight years ago on
1988 hardware. Embedded menus and link previews five years before the web.
[`hyperties/ARTICLE-SCHEMA.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/hyperties/ARTICLE-SCHEMA.md).

The synonyms field is the interesting part: it makes text **self-naming**, inverting the web's model
where the linker bears all the cost of naming the target.

### 3. Author burden, answered at build time

His Xanadu essay concludes LLMs may finally absorb the authoring burden that kept hierarchical
hypertext and semantic zoom impractical. Don's version runs the model **at build time** and ships a
static artifact needing no model to read —
[`TAGSONOMY-COMPILER.md`](https://github.com/SimHacker/moollm/blob/main/designs/TAGSONOMY-COMPILER.md),
with four shipped precedents rather than a proposal, MDL Zork's `SYNONYM` interning among them.

Stated honestly: synonym collisions fail **silently**, resolving to a plausible wrong node. So it must
be a build-time lint with a distinctness filter, not a runtime guess. Written knowing what gwern.net
is and is not willing to become.

### 4. Two disagreements (the point, not the garnish)

**The pyramid needs a rung below the link icon.** Proposed as an eval rather than a taste:
[`GLYPH-BENCHMARK.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/GLYPH-BENCHMARK.md),
with the argument that the pelican has no referent while a thousand documents do.

**The site already keeps a durable per-reader model and spends it on chrome.** LocalStorage persists
dark mode; it does not persist the reader's place in the argument.
[`READING-CURSORS.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/READING-CURSORS.md).
The uncomfortable version: the machinery for reader agency is already installed and pointed at the
toolbar.

### 5. "Give the reader agency," taken literally

An article does not *get* a room — it **is** one.
[`PLAYABLE-CORPUS.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/PLAYABLE-CORPUS.md).
Rooms with behavioral objects and characters who can be asked questions **in character and in
context**, so the corpus accrues its own FAQ as a retrievable artifact
([`AUTO-FAQ.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/AUTO-FAQ.md)) — a
Drescher schema factory or Minsky frame maker for questions and answers.

With VERBOSE / BRIEF / SUPERBRIEF as the ancestor of semantic zoom, and Scott Adams' interpreter-plus-
portable-database as the ancestor of publishing a life's work as a playable thing in a browser.

### 6. Reading cursors, and shareable reading lists

Reading positions as first-class objects: named, persistent, forkable, shareable, with their own notes
and staleness reporting (elapsed time, commits since, what changed above them) so resumption is a
judgment rather than an assumption. From which falls out the socially useful artifact — **reading
lists for a corpus that others can remix, check off, annotate, argue with, and wield.** For a body of
work as large as his, the reading list may be the missing interface.

### 7. The Know Knob: confidence as a relation, not a page property

His per-page confidence tags, made navigable rather than annotated. Turn the knob and the corpus
re-renders: clean narrative → certainty markers and attribution → assumptions, provenance and dates →
expanded counterarguments → full audit with sources, history and executable tests.

Because certainty is not a property of a proposition but a relation over **knower × claim × evidence ×
assumptions × time**. So `know:` becomes a cross-cutting metadata namespace — Dublin Core for
epistemic state — attachable to any object, inheritable, overridable, with named levels
(*fiction → rumor → speculation → plausible → likely → supported → established*) to avoid fake
precision.

The recursion that makes it more than filtering: **simulation rules can carry it too.** A
population-growth rule declaring itself *plausible, short-term, fails-when resource-limited* stops
impersonating natural law. Turn the knob and the world becomes transparent, revealing which floorboards
are observation, assumption, guess, ideology, or joke.

Prior art worth crediting: GreaterWrong's theme tweaker did reader-controlled *presentation* years ago.
See [`../said-achmiz/ideas.md`](../said-achmiz/ideas.md). Both knobs are renderings of one signed
record over a compiled vocabulary, specified in
[`SIGNED-ASSESSMENTS.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/SIGNED-ASSESSMENTS.md) —
where your per-page confidence tag becomes *gwern's assessment, signed gwern*, which is what it
always was.

### 8. The Wonder Knob: ignorance as an object

Low confidence cannot express "I don't know" — 0% means *certainly false*, 50% can mean a
well-understood balance. So the counterpart is **question volume**: a `?` that grows with curiosity,
plus an ask switch that broadcasts *answers wanted* and specifies what is welcome (evidence,
estimates, speculation, personal experience, experiments). Ignorance becomes visible, valuable and
socially actionable rather than a blank, and the asker can turn it down as it resolves without
deleting the history of having wondered.

Three operations instead of two: **assert, contest, inquire.**

The name comes from a button Don misread at a con — QUESTION AUTHORITY, taken as an honorific rather
than a call to action, *an authority on questions, ask him some.* Both parses are the design, and the
honorific is the half nobody builds. It also carries its own warning: a button costs nothing to wear,
which is how a critical artifact becomes a badge and then a metric.
[`SIGNED-ASSESSMENTS.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/SIGNED-ASSESSMENTS.md) has the
mechanism and the trap.

### 9. Contestability as the obligation

Neutrality is impossible; contestability is the duty. **Volume is not the problem — architecture is.**
Sometimes the territory really is enormous and the reader needs a vehicle: a horse, a map, a caravan,
an aqueduct, semantic zoom. The test is whether the vehicle gives claims individually addressable
handles, distinguishes evidence from inference from speculation, exposes dependencies between
conclusions, lets readers choose depth and route, puts counterevidence where it will actually be
encountered, permits annotation and forking, preserves provenance, and declines to treat "did not read
everything" as assent.

By that test gwern.net passes on every count — abstracts, margin notes, bidirectional links,
transclusion, archives and progressive disclosure turn a firehose into navigable plumbing. The residual
risk is only that good plumbing can manufacture authority by itself, independent of what flows through
it.

Don's extension: a PR is **executable dissent** — here is the sentence I contest, my replacement, my
evidence, and what the structure looks like with my stones installed. Moderation and contestability
are not opposites; the obligation is not to merge everything but to make judgment legible, with
forking as the exit. And ordinary readers should never need to understand git for this — git is the
constitutional machinery under the floor, not the admission exam at the door.

### 10. Revision as method, and the design graveyard

Essays as long-lived revisable objects rather than dated posts, and the published record of *rejected*
features — which teaches what a changelog cannot, and is the practice Don most wants to copy directly.
Adjacent: writing for an intelligent-but-forgetful future self rather than an audience, and building
machinery that lets future-you prove present-you wrong.

### 11. Where the two designs actually differ

Not a critique, a different shell around problems already solved well: full WIMP rather than popup
frames, **pie menus** rather than a gear menu, semantic zoom **across repos** rather than within a
page, git-native build rather than Hakyll, tabs and stacks and z-order, and unapologetic Mac/NeWS/
SunView nostalgia over monochrome minimalism.
[`webtop-gwern-inheritance/GWERN-WHAT-TO-INHERIT.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop-gwern-inheritance/GWERN-WHAT-TO-INHERIT.md).

### 12. "You must earn your ornaments"

His line, and the one Don quotes back most. Removal is the prerequisite, not the product: strip the
ground first so what you add is legible against it — but a file stripped to nothing is empty, not
stark. Don reads it as the correct rebuttal to lazy minimalism, and as Chesterton's Fence applied to
interface: removing an affordance you never understood is not restraint.

### 13. Will Wright: the same reading habit, the opposite artifact

Both of them accumulate research piles far past any single project's need. Gwern compiles his into
something citable; Wright compiles his into something playable — the reading shows up as a rule set
you inhabit rather than a claim you check. Worth asking directly which losses each form takes: the
simulation cannot be footnoted, and the essay cannot be replayed with different parameters. Wright is
also a user interface designer, and the Sims object model is the article-as-room thesis already
shipped — objects carry their own code and broadcast their own affordances to whoever walks past,
which is exactly what "characters in a room who can be asked questions" needs underneath it.
[`designs/sims/sims-design-index.md`](https://github.com/SimHacker/moollm/blob/main/designs/sims/sims-design-index.md).

### 14. Ian Bogost: navigation design is already an argument

**Procedural rhetoric** — the claim that rules and processes persuade in their own right — turns the
reader-agency thesis from an affordance question into a rhetorical one. A route offered, a depth
selected, a counterargument placed where it will actually be met: each is a move in a channel prose
cannot reach, and each is therefore answerable on rhetorical grounds rather than usability grounds.
It cuts both ways, which is the interesting part: if navigation argues, then a well-built corpus
argues for its own authority whatever it happens to contain. Bogost is a literary critic as well as a
game designer and is the likeliest of anyone here to reject the whole frame.
[`FRICTION-FIELDS.md#the-procedural-rhetoric-of-direct-manipulation`](https://github.com/SimHacker/moollm/blob/main/designs/pie-stack-views/FRICTION-FIELDS.md) ·
[`PROCEDURAL-RHETORIC-INDEX.md`](https://github.com/SimHacker/moollm/blob/main/designs/indexes/PROCEDURAL-RHETORIC-INDEX.md).

## Show seeds

- Not yet planted. Formats offered in [`invitation.md`](invitation.md): solo, joint with Said,
  written-only (repo exchange published as the episode), or a panel — Shneiderman, Nelson and Temkin
  on the hypertext lineage; Wright and Bogost on simulation, interface, and procedural rhetoric.

## Sources

- [gwern.net](https://gwern.net/) · [gwern.net/design](https://gwern.net/design) ·
  [gwern.net/help](https://gwern.net/help) · [gwern.net/xanadu](https://gwern.net/xanadu)
- [`sources/2025-xanadu-even-more-hindsight.md`](sources/2025-xanadu-even-more-hindsight.md) ·
  [`sources/2024-lesswrong-after-roam.md`](sources/2024-lesswrong-after-roam.md)
- [`invitation.md`](invitation.md) · [`CHARACTER.yml`](CHARACTER.yml) ·
  [`../said-achmiz/ideas.md`](../said-achmiz/ideas.md)
