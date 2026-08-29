# The content pipeline: pristine sources, sidecar overlays, generated sets

*Don, 2026-08-29. Keep original un-renumbered objects from external
sources in a **catalog cache** that is never edited. Bind them to our
catalog with YAML or JSON **sidecar overlays**. Generate the
localized, renumbered, About-wrapped Downloads set from those.
"It's a pipeline, never edit in place, just make a data flow
dependency network." Machine-readable spec:
[content-pipeline.yml](content-pipeline.yml).*

## The move

**Downloads stops being the source of truth and becomes a build
output.** Three layers, one direction of flow:

| Layer | What it holds | Mutability |
|-------|---------------|------------|
| **Catalog cache** | Every object exactly as it arrived, byte for byte, from whatever zip or mirror or folder it came out of | **Never edited.** Append-only. |
| **Sidecar overlays** | YAML or JSON beside each source: identity binding to our catalog, corrections, categories, credits, claim state, notes | Edited freely, by us and by contributors |
| **Generated sets** | The Downloads trees the game actually reads: renumbered, localized, [About](object-shops.md) wrapped around each object | **Disposable.** Rebuilt on demand. |

The useful analogy is git rather than a filesystem: **the cache is
the repository, a set is a working tree, the overlay is the diff you
meant, and the manifest is a lockfile.** You do not edit a checkout
and hope; you change the inputs and rebuild.

## First run: rename Downloads to Sources, and never touch it again

*Don, 2026-08-29: at startup look for a sibling of Downloads named
Sources. If it exists we already initialized. Otherwise rename
Downloads to Sources, make a fresh Downloads, inventory everything
that was there into a manifest, and build -- wrapping user content in
About boxes, pulling catalog info, generating glyphs.*

That is the whole bootstrap, and the **rename** is what makes it
respectable. It is not a copy, so it costs nothing on an eight
gigabyte Downloads folder, it cannot half-succeed into two divergent
copies, and it means the player's original bytes are never rewritten
even once. Everything after that point is generated and therefore
expendable.

In pipeline terms, first run is `git init` plus the initial commit:
the manifest of what was already there is the **baseline snapshot**,
which is simultaneously the rollback target, the provenance record for
content that arrived with no readme, and the first observation for
[co-occurrence clustering](guid-registry.md).

### Five ways the naive version bites, and what to do instead

**1. Directory existence is a weak sentinel.** Players have their own
folders, sync clients create empty ones, and a crashed first run
leaves a real `Sources` that is not initialized. Gate on a **marker
file** -- `Sources/.soul-sources.json`, carrying schema version,
initialization time, and tool version -- and treat a bare `Sources`
directory with no marker as an unrelated folder to leave alone and
name around.

**2. The dangerous window is between the two operations.** After the
rename and before the fresh Downloads exists, an interrupted run
leaves a game with no Downloads at all. **Write the intent before
acting** and keep a small state machine on disk: `planned`,
`renamed`, `downloads_created`, `inventoried`, `built`. Recovery
reads the last state and finishes the job rather than guessing. This
is the boring write-ahead discipline and it is exactly what the
situation deserves.

**3. Cloud sync will hurt somebody.** The Sims lives under
Documents, and OneDrive redirects Documents by default on Windows;
iCloud and Dropbox do comparable things on the Mac. Renaming a synced
directory can mean a full re-upload, and sync clients have been known
to resurrect deleted files or delete partially. **Detect the sync
root before touching anything** and say so plainly, with the option
to proceed, relocate, or stop.

**4. Renaming a directory may not be available in the browser.**
File System Access gives us `move()` for file handles; directory
support is the part to verify against current browsers rather than
assume. If it is unavailable, the fallback is copy, **verify every
file by hash**, and only then remove -- and this is a concrete
argument for [SoulAngel](sims1-soul-bridge.md), which has ordinary
filesystem access and can do the atomic thing.

**5. Sources must become genuinely read-only.** Not "we promise not
to write there": mark it read-only where the platform allows, keep
the write path physically separate in the code, and have the build
refuse to run if the marker's recorded hashes disagree with what is
on disk.

### The escape hatch is the feature

Uninstall is: delete the generated Downloads, rename Sources back.
Two operations, no data at risk, and the player's collection is
exactly as it was. **Say that out loud in the UI before asking for
permission**, because it is the honest answer to "what is this thing
about to do to twenty years of my stuff," and it is the reason
somebody clicks yes.

Two things still to measure rather than assume: whether the game
ignores an unfamiliar sibling directory (it should, since it looks
for Downloads specifically), and what the practical ceiling is on
inventorying a very large collection in a browser.

## Lineage: Don built this pipeline once already

The framing is not a metaphor borrowed from software development; it
is the same job Don did for Sims character animation, with 3ds Max
and MaxScript plus C++ extensions, SourceSafe, and Access. The
correspondence is close enough to be worth writing down:

| Animation pipeline | This pipeline |
|--------------------|---------------|
| Max scene files, the authoring originals | The catalog cache, never edited |
| MaxScript and C++ exporters | TMog build modules |
| SourceSafe | Content addressing plus git for sources and overlays |
| Access database of metadata and ids | The [GUID registry](guid-registry.md) |
| Game-ready exported animation data | The generated Downloads set |

Same shape, same reason: authoring originals outlive the build format,
so the build format has to be regenerable and the metadata has to
live in a database rather than in filenames. *Worth asking Don on the
record: did the Access side hold id assignment, and what broke often
enough to be memorable?*

## What falls out of this for free

The reason to say yes immediately is that most of the hard problems
elsewhere in this design stop being problems.

- **Downloads becomes fearless.** Delete the whole thing, rebuild it
  from cache plus manifest. The folder every Sims player has been
  afraid to touch since 2000 turns into a cache directory.
- **Renumbering is a build step, not a mutation.** Two sets can
  assign different ids to the same source object and neither one
  disturbs the source. The
  [id virtualization](guid-registry.md) design stops being a clever
  trick and becomes an ordinary consequence of building.
- **Every content profile is a build target.** The zombie set, the
  SimProv set, the recreate-a-2002-fansite set: same sources,
  different manifests and overlays.
- **The provenance stamp becomes a build receipt.** Which source
  hash, which overlay revision, which mapping, which tool version.
  It describes a derivation instead of asserting a history.
- **Improvements apply retroactively to everything you own.** When
  the registry learns what a mystery object actually is, you rebuild
  and **every About box in your collection gets better**. No
  re-downloading, no mutation, nothing lost. That is the payoff the
  cataloging flywheel needed.
- **Undo is free**, because the original never changed.

## Content addressing pays an unexpected dividend

Address the cache by **hash of the original file**, and repack
detection becomes a side effect rather than a project.

Twenty-five years of custom content circulated through zips inside
zips, rehosted, rebundled, renamed, and stripped of readmes. Hash the
bytes and the same object arriving from five different bundles is
**stored once with five provenance records** -- which is to say the
cache automatically reconstructs the redistribution chains. Those
chains are exactly the evidence
[attribution claims](object-shops.md) need: who published it first,
who repacked it, where the readme survived.

So the storage optimization and the archival mission turn out to be
the same mechanism.

## Determinism is a requirement, not a nicety

Two players building from the same manifest must get **the same
bytes**, because they will trade saves that reference those ids. That
puts real constraints on the generator:

- Seed anything random. No wall-clock timestamps in outputs, or if a
  timestamp must exist, take it from the manifest.
- Fix iteration order everywhere. Directory listing order is not an
  order.
- Pin inputs by hash in the manifest, not by filename. Filenames from
  2003 are not identifiers.
- Record the tool version, and treat generator changes that alter
  output bytes as version bumps.

Then a manifest is a reproducible description of a set, sets can be
diffed and shared as *recipes*, and a save file's id space means the
same thing on both machines.

## What to back up, and what not to

- **Precious:** the catalog cache, the overlays, the manifests, and
  the per-save [journal](guid-registry.md). Small, textual except for
  the cache, and irreplaceable.
- **Disposable:** every generated set. Regenerable by definition, so
  backing it up is backing up a build directory.

Honest cost: you are storing the original and the built copy, so a
large collection roughly doubles. The cache compresses well and can
keep originals in their delivered archives; the outputs need no
backup at all. For what it buys, that is cheap.

## What this makes possible: lot sharing that actually works

*Don, 2026-08-29: this recreates Exchange-style uploading and
downloading of lots, safer and more virtual, and encouraging to
sharing.*

The Exchange's hard problem was never the upload button, it was
**dependencies**, and it had only two options, both bad:

1. **Do not bundle the custom content.** The lot downloads and is
   broken: missing objects, wrong objects, empty rooms, sometimes a
   crash. Communities adapted by circulating "no custom content"
   lots, which is a real solution and also a real amputation.
2. **Bundle the custom content.** Now the lot works, and every
   download **redistributes other people's objects** -- credit
   stripped, readmes gone, duplicate copies of the same mesh
   accumulating under different ids, conflicts multiplying, file
   sizes exploding. This is the failure mode that made creators
   furious in the Sims 2 era, and they were right to be.

Nobody solved it because the two obvious answers are broken
downloads and unauthorized redistribution. This pipeline has a third
answer, and it is the same discipline as everywhere else on this
project: **share the recipe, not the payload.**

A shared lot travels as **lot plus manifest**: the layout and the
instance state, plus a list of what it needs, by registry id. On
arrival:

- Everything you already have is **matched by content hash**, not by
  filename or number, so nothing gets installed twice and no
  collision has to be resolved by a coin flip.
- Everything missing becomes a **[proxy that wears its own
  glyph](guid-registry.md)**, so the lot loads, plays, and shows you
  exactly what it wants and where to get it.
- Every install resolves to **the creator's own canonical entry**,
  which means attribution is structural rather than a courtesy line
  in a readme that a repacker deleted.
- Id conflicts stop mattering, because ids are assigned during your
  build, not baked into somebody else's upload.

So the download is never broken and nothing is ever redistributed.
The dilemma was real; it just needed pieces that did not exist yet.

**Why this was not available in 2001.** Not a failure of nerve:
content-addressed storage, client-side compute in a browser with file
access, ubiquitous cameras for scanning a code off a screen, and
cheap deterministic rebuilds are all recent. The Exchange shipped the
right idea on the wrong decade's infrastructure, and the official
exchanges are long gone, along with a great deal of what lived only
there.

**And it should make sharing feel safe**, which is the part that
matters for whether anyone does it. A creator's work is never
inside somebody else's upload. A downloader never has to choose
between a broken lot and installing a mystery bundle. Every object in
a shared lot is a link back to whoever made it. Those are the terms
that were missing when people stopped sharing lots with content in
them.

## One footgun worth naming now

**Find out what the game itself writes into the output trees before
treating them as disposable.** A build system that deletes user files
is a catastrophe, not a bug. Anything the game or the player creates
inside a generated tree has to be **adopted as a source** on the next
build rather than swept away, which means the importer needs a rule
for unrecognized files in output directories: never delete, always
ingest or leave alone.

## Related

- [GUID registry and remapper](guid-registry.md) -- the id mapping this pipeline applies
- [Object shops](object-shops.md) -- the About wrapper and the generators that emit objects
- [Rendering and rights](rendering-and-rights.md) -- what may be fetched and hosted
- [Portals and modules](portals-and-modules.md) -- where this sits in the TMog suite
