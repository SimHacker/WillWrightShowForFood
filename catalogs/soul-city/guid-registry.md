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
