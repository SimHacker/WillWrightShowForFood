# The GUID registry and the remapper: file cop on shrooms

*A TMog module and a Soul City service: index every object id and
Magic Cookie registration we can find, document the overlaps instead
of hiding them, and remap ids so any objects can coexist -- with
creator attribution preserved. Machine-readable spec:
[guid-registry.yml](guid-registry.yml).*

**In one line:** The Sims File Cop, on shrooms -- because the 2004
Transmogrifier renovation plan asked for exactly this, and now the
whole library can be read in a browser.

## The anatomy that makes this work

A Sims object id is 32 bits, and Transmogrifier split it in two:

| Bits | Field | Meaning |
|------|-------|---------|
| High 16 | **Magic Cookie** | The producer: a person or organization, registered on the honor system at thesimstransmogrifier.com |
| Low 16 | Suffix | Which object this producer made (originally random) |

That split is the whole design. **Renumber the low half, keep the
cookie**, and a remapped object still says who made it. Attribution
survives the collision fix. (Source: the 2004 registry page --
65535 cookies, fewer than 65536 objects each, Maxis-published ids
reserved regardless of cookie field, cookie hoarders banned and their
cookies recycled. See
[the Magic Cookie registry](../../characters/will-wright/sources/2004-transmogrifier-magic-cookie-registry/README.md).)

## Four tiers of id space

1. **Official Maxis objects** -- base game and every expansion.
   Immutable anchors, reserved regardless of what cookie field they
   carry. We never renumber these; conflicts resolve around them.
   Deliverable: a complete catalog of official objects, which is also
   the test that no user content is allowed to overlap.
2. **Registered cookie space** -- producers who signed up in
   2000-2004. Don has the old registration database; it becomes the
   seed of the index and the historical record of who owned what.
3. **Unregistered and unknown** -- cookie 0 (Transmogrifier's default
   when nobody entered one), hand-hacked ids, tools that ignored the
   convention, and 26 years of drift. This is where the interesting
   damage lives.
4. **Newly issued** -- ids we allocate now, in space the index shows
   is free.

## Overlaps are documented, not silently fixed

Assume overlaps. Two kinds, both expected:

- **Object clashes:** the same 32-bit id used by different objects.
  Already classified by the existing analysis layer as exact
  duplicate, near duplicate, or hard conflict.
- **Creator clashes:** two producers using the same 16-bit cookie --
  because the honor system was an honor system. A cookie is evidence
  of a creator, not proof.

Neither gets quietly overwritten. Every collision becomes a **record
with provenance**: which file, which root, which archive it came out
of, what else shipped alongside it. The index gets better as more
content is scanned, and the knowledge is **incremental and
cumulative** -- scan a new archive, learn more, publish the delta.
Nobody has ever had a complete map of this space. Building one is
worth doing for its own sake.

## The remapper: combine any objects you want

The registry answers "who is this?" The remapper answers "make these
coexist." A TMog module inside
[SoulAngel](soul-angel.md): choose any set of objects, however
conflicting their provenance, and get an installable set where every
id is unique.

Policy, in order:

1. Never renumber an official Maxis object.
2. Renumber the **suffix only**, keeping the cookie, so the creator
   stays legible.
3. Stay close to the original id: prefer the nearest free suffix, so
   an id remains recognizable to anyone who knew it.
4. If the cookie itself is contested, keep it and record the
   ambiguity; don't launder it away.

The hard part is not the number, it is the **references**: SimAntics
code, other objects, and save files all point at GUIDs. A remap that
misses a reference breaks the object. The whole-library reference
graph the existing analysis plan calls for (scan every object's code
for GUID references, build the edges, keep coherent families
together) is the prerequisite, not an optimization.

## Virtualized ids, per save file -- Downloads included

The key move: **object ids are virtualized per save file.** Global
uniqueness was never actually required -- ids only need to be unique
within one game instance. So the registry holds the global truth
about identity and provenance, and each save file gets its own
mapping table from registry identity to the local id space that save
uses.

And **"save file" includes the Downloads directory** (Don,
2026-08-29), because that is where the local id space actually lives:
the installed custom objects DEFINE the numbers, the neighborhoods
and lots merely REFERENCE them. A remap that rewrote saves without
rewriting Downloads, or vice versa, would be a broken game. So the
real unit is the closure: **install + Downloads + every neighborhood
and save, remapped together as one transaction.** We have read/write
access to all of it, so we can do that atomically -- the same
supernatural access the [web reaper](sims1-soul-bridge.md) has, aimed
at identity instead of mortality.

Consequences worth stating plainly:

- Two objects that collide globally can both be installed, in the
  same game, under different local ids.
- The closure is remapped **together and consistently**; remapping an
  object already placed in existing saves without updating those
  saves (or updating Downloads without the saves that point into it)
  breaks them.
- An object's identity in the registry never changes, no matter how
  many local ids it wears. Credit is attached to identity, not to a
  number that happens to be free.
- Save-before-mutate, always, with operator consent. Snapshot the
  whole closure, not just the file being touched.

## How the virtualization is actually implemented

*The three-layer build architecture underneath all of this -- pristine
catalog cache, sidecar overlays, generated sets -- is spec'd in
[content-pipeline.md](content-pipeline.md). What follows is how it
looks from the game's side.*

**We do not change how The Sims reads and writes files** (Don,
2026-08-29). The game's file handling is fixed and we work with it,
not around it. What we control completely is **which directory trees
occupy the paths the game reads**: GameData, UserData, Downloads. So
the mechanism is not a clever runtime indirection, it is honest file
management:

1. **Named sets.** Every Downloads tree (and its companion user data)
   is a named, registry-tracked set with a manifest of what it
   contains and which id mapping it uses.
2. **Mount one at a time.** The game always sees exactly one set, in
   the place it expects to find it. Swap sets between sessions, never
   during.
3. **Synchronize.** The registry knows what each set holds, so sets
   can be built, diffed, updated, shared, and rebuilt from their
   manifests.

There is a **default set** for normal play, plus special-purpose sets
built for one body of content: a zombies set, a SimProv set, a
recreate-a-2002-fansite set. Small, coherent, fast to load, no
conflicts, because a purpose-built set only contains what that purpose
needs.

## The Downloads set is the scope for save files

This is the rule that makes the model sound: **a save file belongs to
a Downloads set.** Its object ids only mean anything inside that set,
so the binding between save and set is part of the save's identity and
the registry records it.

Moving a save between sets is therefore a **migration, not a copy**:

- Remap every object id in the save into the target set's id space.
- Discover which objects the target set simply does not have.
  Unknown objects are the normal case, not an error.

### Dummy objects, so saves round-trip

For missing objects, **generate a dummy** (long-term plan, worth
designing toward now): a placeholder object standing in at the right
id, carrying whatever the save knows about what belonged there, and
**marked as a dummy in a way we recognize on the way back**. Then the
save round-trips instead of losing furniture: migrate it to a
poorer set and home again, and the real objects come back because the
dummies remembered their places.

Presentation: a dummy can be invisible or an obvious placeholder,
which is a pie menu action away in either direction -- "make
invisible" and "show placeholder" are exactly the kind of toggle the
[action editor](object-shops.md) already generates. A lot full of
invisible dummies still loads, still plays, and still tells you what
is missing when you ask it.

### A dummy can display as its own QR code

*Don, 2026-08-29.* Third presentation mode, and the best one: the
proxy renders as a
**[SoulGlyph](object-shops.md) pointing at the page for the object
that should be there.** Point a phone at the hole in the lot and
arrive at the thing you are missing.

This inverts the oldest annoyance in Sims custom content. Downloading
somebody's lot has always meant discovering you lack forty-seven
objects, with no good way to find out which. Now **every gap is a
self-service install link**, and a broken lot is a shopping list that
explains itself.

Four reasons this is the cleanest case for an in-world code:

- **We own the geometry.** A dummy is our object, so it can be shaped
  for scanning rather than shaped like furniture: flat,
  screen-aligned, quiet zone intact. The
  [reliability worries](object-shops.md) about in-world codes are
  mostly worries about somebody else's sprite.
- **Bigger missing object, bigger code.** The dummy knows the
  footprint it is standing in, so a large absence gets a large panel,
  which means more pixels per module and an easier scan.
- **No rights question whatsoever.** Nothing here is official art. We
  are rendering a code we generated in place of an object nobody has.
- **The payload already exists.** The provenance stamp records what
  the dummy stands in for, so the code is just that resolvable id.

Two practical rules. **One code for the lot, too:** scanning
forty-seven glyphs is not a plan, so a lot with dummies also offers a
single manifest code that installs everything missing at once, with
the per-object codes there for people who want to choose. And the
manifest is a **list of ids, not content** -- the same recipe
discipline as everywhere else.

Screenshots do the rest. A picture of a lot studded with glyphs *is*
a manifest: post it, stream it, clip it, and anyone watching can scan
the exact objects out of the image. The failure state advertises its
own cure.

### Proxies generate offline; querying the catalog is opt-in

*Don, 2026-08-29.* A generic proxy needs no network. Everything it
requires is either in the save already or pure computation: the id it
is standing in for, the footprint, and a
[glyph](object-shops.md) whose payload is a resolver URL derived from
that id. Code generation is arithmetic, so an offline import produces
working, scannable proxies with no lookup at all.

Querying the registry to make a *better* proxy -- real name,
thumbnail, creator, what expansion it wants -- is then an **opt-in
enrichment**, on the same consent footing as everything else here.
Offline is complete; online is nicer.

### The resolver page: an id is always a valid key

Even when we know nothing, the id is a key we can honor. The glyph
points at the resolver for that id, and the resolver page **lists
every known object bearing it** -- which is the normal case, not the
degenerate one, since
[collisions are the point](#overlaps-are-documented-not-silently-fixed)
of this registry.

So resolution has two levels and neither dead-ends:

1. **Id known, instance unknown.** The page is a disambiguation list:
   here are the four objects that have used this number, with dates,
   sources, creators, and pictures. Pick yours, or tell us which it
   was.
2. **Instance known.** The glyph points straight at the specific
   object, which may still share its id with others -- and the page
   says so, because that is a fact about the object worth knowing.

An id therefore never produces a 404, only a shorter or longer list.

### Clustering: the rest of the lot is evidence

*Don, 2026-08-29: look at all the object ids in the house. Other
creator-adjacent objects suggest you downloaded more than one from the
same creator, or the same magic cookie. It is a clue about which
candidate is right.*

Exactly right, and it works because **content arrives correlated.**
Nobody downloads one object; they download a set, from a site, from a
creator, in an afternoon. So an ambiguous id sitting in a lot with
thirty unambiguous neighbors is not really ambiguous.

Signals worth combining, each weak alone:

| Signal | Why it discriminates |
|--------|---------------------|
| **Magic cookie co-occurrence** | The cookie *is* creator identity. Thirty objects here carry cookie 0x4A2F, so the disputed 0x4A2F object is probably from that same set. |
| **Id adjacency** | Creators numbered a set's objects consecutively, so a candidate whose suffix sits next to ids already present is the better bet. |
| **Expansion requirements** | A lot that needs Superstar makes a Superstar-dependent candidate more plausible. |
| **Era coherence** | A lot assembled in 2002 does not contain a 2005 object. The rest of the content dates the lot. |
| **Archive co-membership** | Candidates from the same mirror or bundle as the lot's other objects, per the [cache's provenance](content-pipeline.md). |
| **Local presence** | If one candidate is already installed, hash matching answers the question outright. No inference needed. |
| **Placement fit** | Whatever the save records about how the instance sat -- wall versus floor, level, orientation -- constrains what it could have been. Worth measuring what the format actually preserves before leaning on it. |

Combine them the boring way: a prior from the registry (which
candidate is more widely attested), times the likelihood from each
independent signal. It is market-basket analysis with better priors,
and it will be right most of the time.

**But it produces a hypothesis, and hypotheses stay labeled.** The
rule that governs collisions governs this too:
[document, do not adjudicate](#overlaps-are-documented-not-silently-fixed).
An inference is stored as an inference, with its confidence and the
evidence that produced it, shown to the player in those terms --
*probably this one, because thirty-one objects here share its
cookie* -- and promoted to fact only by a human confirming it. An
inference never overwrites a claim and never quietly becomes the
registry's answer.

### Resolution is a scored, ranked list

*Don, 2026-08-29: we are scoring possible guid-to-object mappings and
putting the best at the top so it is easy to select by default. Many
possible ways to score, to be decided.*

So make the ranked list **the interface**, not an implementation
detail. Every id query returns candidates in order, each with the
evidence that ranked it, the best one preselected, and the
alternatives one click away. Scripts get the same list as the UI, and
so does an agent.

Three requirements that are easy to get wrong and expensive to
retrofit:

**Scores must be explainable and re-runnable.** Store the feature
vector and the scorer version alongside every decision. When a better
scorer arrives we can re-rank the whole corpus and see exactly which
decisions changed, which is the difference between improving the
system and reshuffling it.

**Resolutions are pinned in the manifest, like a lockfile.** A better
scorer must never silently change somebody's build. The chosen mapping
goes in the lock; re-resolving is an explicit action with a diff.
[Determinism](content-pipeline.md) requires this.

**A pick is always recorded as a pick.** Preselecting the top
candidate is a convenience, not a claim, and it stays labeled as an
inference until a human confirms it.

Features to draw on, in rough order of how much they should move the
needle: exact content hash, our own stable id, cookie co-occurrence,
co-residence in the same original archive, id adjacency, name-string
agreement, reference-descriptor agreement (below), era coherence,
expansion requirements, and breadth of attestation across the corpus.
Weighting is genuinely to be decided, and should be fit against
cases we have confirmed rather than guessed at.

### The reference table: make every link carry several keys

*Don: our metadata includes a table of guid references with metadata
that helps resolve them if they got scrambled, like the object title
or our own unique id. Make the links stronger.*

Right, and this is the move that makes scrambled content recoverable.
Every outgoing reference in an object gets a **descriptor** rather
than a bare number:

| Field | Why it is there |
|-------|-----------------|
| Numeric id as found | The original link, whatever state it is in |
| Site | Where in the file it was found: which field, which behavior, which operand |
| Role | What the link means: multi-tile part, created object, related object |
| Target name string | Survives renumbering and is often human-recognizable |
| Our stable id | The strong key, once known |
| Target content hash | The strongest key, once known |
| Confidence and source | How we came to believe it |

Resolution is then a cascade: content hash, then stable id, then id
plus cookie, then name plus role plus closure membership, then the
bare number. **A link with five keys survives losing four of them.**

The precedent is the old Alias Manager, which stored file id, name,
path, volume, and dates, and tried them in order precisely because
any single locator eventually goes stale. Package managers do the same
thing with name, version, and integrity hash.

**The reference table also becomes the test suite for renumbering,
which may be its biggest payoff.** After a build rewrites ids, re-run
every descriptor against the new set: each edge must resolve to the
same target it did before. If any edge lands somewhere else or
nowhere, fail the build. Combined with the rule that unmapped
references are a
[refusal rather than a guess](content-pipeline.md), that turns
renumbering from an operation we hope is right into one we can check.

Keep the inverse index too. "Who points at me" is what tells you the
closure boundary before you move anything.

### Two better payoffs than disambiguation

The clustering is worth building even if no id were ever ambiguous.

**It reassembles lost download sets.** Twelve objects that always
appear together were one package, whatever its zip was called before
the readme went missing. Recovering set membership means we can name
them, describe them, and offer them as sets again -- which is a large
piece of what the repack chain destroyed.

**It turns an anonymous cookie into a portfolio.** If cookie 0x4A2F
has forty objects across the corpus and no name attached, the cluster
*is* that creator's body of work, assembled and waiting. When someone
turns up who can show it was theirs, they claim **the whole portfolio
in one action** instead of forty separate arguments. That is the
difference between a credit system somebody might actually use and
one nobody will.

Both of those need co-occurrence data across many collections, which
is cheap -- id lists, no content -- and consent-gated like everything
else: compute locally, contribute aggregate counts if you choose,
never lot contents.

### What a proxy has to carry, which is less than it looks

The question of preserving all the object data mostly dissolves once
the two kinds of data are separated:

| | Where it comes from | Can we preserve it? |
|---|---|---|
| **The object** -- meshes, sprites, behavior, catalog entry | The installed package | **No, and there is nothing to preserve.** If the object was never installed, the save never contained it. |
| **The instance** -- position, rotation, level, orientation, contents, per-instance attributes, who was using it | The save file | **Yes, and it is small.** Bytes, not megabytes. |

That is the whole answer to round-tripping: **the save only ever held
a reference plus instance state, so a proxy that preserves the
reference and the state loses nothing that was there.** The assets
come back by installing the real object, exactly as they arrived the
first time.

One structural caveat worth designing around: **the game rewrites its
own save files.** Anything we tuck into a house or neighborhood file
may not survive the next in-game save, so per-instance state belongs
in **our own sidecar journal**, keyed to the save and the object's
place in it, rather than in a chunk the game might drop. The dummy
object package carries the class-level stand-in facts, which are the
same for every instance of that absence; the journal carries the
per-instance particulars.

### Punt on embedding whole objects -- and it is not a punt

Let people download the resolved object. That is the better answer on
five counts, not the lazy one:

1. **It is a redistribution question.** An object embedded inside a
   save that then gets shared *is* a redistributed object. A
   reference plus a scan-to-install link is not. Every rights
   decision on this project points the same way
   ([rendering and rights](rendering-and-rights.md)), and this is the
   same call in a new costume.
2. **You get the current version.** Fresh metadata, fresh credit,
   fixes applied since -- rather than a copy pickled in 2027.
3. **The set stays consistent.** The object arrives through the
   normal install path, so the registry, the manifest, and the id
   mapping all agree afterward. An object smuggled in through a save
   agrees with nothing.
4. **Saves stay small and loadable.** Object packages are loaded
   wholesale; fattening them taxes every lot that uses them.
5. **Reconstruction beats replication.** A named set built from a
   manifest is the design already
   ([how the virtualization works](#how-the-virtualization-is-actually-implemented)).
   Shipping bytes inside saves is the thing that model exists to
   avoid.

So a shared lot travels as **lot plus manifest**: what it needs, by
id, with glyphs for each. Recipes, not files, one more time.

### If bulk ever is required, the answer is boring

No tricky pickling scheme. If some future case genuinely needs more
bytes than a chunk comfortably holds, the standard moves are enough:
deflate the payload, split it across numbered part chunks with a
small index chunk carrying the part count and a hash, and reassemble
on read. Text-only surfaces like the string table need a text-safe
encoding; a custom chunk can stay binary.

And put bulk in the **sidecar file** by default, since it has no
ceiling and no loader to surprise us. The practical limits of what
the game and the common editors tolerate inside an object are an
empirical question -- measure them before depending on any number.

The direction to hold on to: **full virtualization of game data.**
Not this month, but every design decision should stay compatible with
it.

## Lineage: this is a 22-year-old request

From Don's own **2004 Transmogrifier renovation plan**, in the
user-requested features section:

> Incorporate The Sims File Cop rules, checks and conventions from
> managing objects and verifying validity. Detect, repair and prevent
> conflicts and crashes.

([the renovation plan](../../characters/will-wright/sources/2004-02-05-transmogrifier-renovation-plan/README.md)
-- the same document that requested object preview export, and the
statue renderer that is now [Stat-U-Matic](stat-u-matic.md).) The
request was reasonable in 2004 and impossible to finish in the tools
of the day. In the browser, with the whole library readable at once,
it is a weekend's worth of scanning and a proper database.

Groundwork that already exists:

- Collision analysis: intake, exact grouping, near-match clustering,
  and classification, in the TMog suite (carried from the
  SimObliterator collision layer -- analysis only, never mutating).
- Catalog storage: the `objects`, `guid_references`,
  `guid_collision_cases`, and `creators` tables in
  [the catalog schema](../../apps/soul-angel/windows/CATALOG-DB-SCHEMA.yml).
- Public triage: one GitHub issue per GUID or collision cluster,
  keyed and fingerprinted, in
  [the GUID issue hub](../../apps/soul-angel/windows/GUID-ISSUE-HUB.yml).

What this page adds: the **registry** as a first-class published
artifact (official catalog + cookie registrations + observed ids),
the **remapper** as a shipping module, and **per-save
virtualization** as the policy that makes arbitrary combination safe.

## Renumbered objects carry their own papers

*Don, 2026-08-29: when we renumber an object, we stamp metadata into
it -- what the original was, plus a snapshot of what our database
knows, as a JSON resource.*

The stamp records what a remap otherwise destroys and what a database
alone cannot promise:

- **The original numbers.** Ids and magic cookie as found, so any
  remap is reversible and re-mappable.
- **The remap itself.** Old to new, which set, which tool version,
  when.
- **Registry identity plus a snapshot** of what we knew at stamp
  time: provenance, source archive, requirements, conflicts,
  attribution state, the readme if there is one.
- **A resolvable id** for the live version, since the snapshot is a
  cache and knows it.

### Why it goes in the object and not only in the database

**Because objects escape.** Somebody zips their Downloads folder and
posts it in 2031, on a forum we have never heard of, long after
whatever happens to us has happened. A file that carries its own
provenance stays interpretable by strangers with no access to our
index; a file whose provenance lives only in our database becomes
anonymous again the moment it travels.

That is the whole archival principle in one line: **metadata travels
with the artifact, not just in the index.** It is also the honest
answer to "what if Soul City disappears," and it costs a few
kilobytes.

### Append, never overwrite

Provenance is a **log, not a field**. An object that has passed
through three sets carries all three entries in order, so the chain
of custody stays readable and a second pass cannot quietly erase the
first. If the stamp is already there, we are re-processing something
we processed before, which is worth knowing on its own.

This also makes the remapper safe in the way that matters: the
original numbering is always recoverable, cross-set
[migration](#the-downloads-set-is-the-scope-for-save-files) is
lossless in both directions, and
[dummy objects](#dummy-objects-so-saves-round-trip) know exactly what
they are standing in for.

### Three places, because tools are careless

An unknown chunk in an IFF file *should* be skipped harmlessly by
anything that reads it -- verify that against the game and the
common editors before relying on it -- but a tool that **rewrites**
the file may drop what it does not recognize. So redundancy, cheaply:

1. **A custom chunk** holds the machine-readable JSON. The truth.
2. **A string-table entry** holds a short human-readable summary, in
   a chunk type every Sims editor already supports, so the
   provenance is visible even in tools that know nothing about us.
   This is also what the [About box](object-shops.md) renders.
3. **A sidecar file** beside the object, for tools that never look
   inside and for objects that get rewritten by something old and
   grumpy.

Any two surviving is enough to reconstruct the third.

### Two rules on the contents

- **Small.** A snapshot summary, not a database dump: a few
  kilobytes, with ids to resolve for the long version. Embedded says
  *last known*, online says *current*.
- **Facts about the object, never about the person.** No local paths,
  no usernames, no machine identifiers, nothing about who ran the
  tool. Downloads folders get shared, and a stamp must never be the
  thing that leaks somebody's home directory.

One dividend worth noting: because the stamp is in the file, **the
About box works with no network at all.** It renders from the
embedded snapshot, and the scannable link is there for whoever wants
the live version.

## The registry shows up in the game: the About slice

A registry nobody reads is a filing cabinet. So the import transform
that builds a Downloads set also **injects an About action into every
object it imports**, first slice, always top: identity, provenance,
the original readme, conflicts and the remap we applied, a scannable
link to the object's registry page, and illustrated pages of what
anyone knows about it.

It runs in both directions. When the registry knows the answer, the
player finally gets one, and creators stripped of attribution by the
old repack chain **get their credit back**. When the registry knows
nothing, the box says exactly that and asks, which turns every
unidentified object in every player's game into a documentation
prompt at the moment somebody is curious. That is how a corpus this
size gets cataloged: it asks for help from inside the game.

Full spec: [object-shops.md](object-shops.md), "The About slice."

## How it is offered

Local scans and remaps of your own folders are free, like every other
local TMog operation. The metered service is the hosted registry
side: continuous monitoring of a Downloads folder, bulk operations
across a whole catalog, and the published index itself. See
[the membership model](membership-model.md).

## Related

- [Portals and modules -- TMog, the tools umbrella](portals-and-modules.md)
- [The sims1 Soul Bridge](sims1-soul-bridge.md) · [SoulAngel](soul-angel.md)
- [Browser ecosystem spec](browser-ecosystem.md)
- [The Magic Cookie registry (2004 source)](../../characters/will-wright/sources/2004-transmogrifier-magic-cookie-registry/README.md)
- [The Transmogrifier renovation plan (2004 source)](../../characters/will-wright/sources/2004-02-05-transmogrifier-renovation-plan/README.md)
