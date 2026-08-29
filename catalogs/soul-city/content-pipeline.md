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
