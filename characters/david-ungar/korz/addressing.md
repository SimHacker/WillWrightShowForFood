# Addressing — every address is a guard vector

*Part of the [Korz cauldron](README.md). The
[design](design.md) establishes that a slot file's location supplies
its coarse guard coordinates ("containment is a guard"). This document
follows that idea all the way down: through filenames, into files,
through archives, and out into tables and tensors — no new mechanisms,
only new readings of addressing schemes the world already runs.*

## Containment is a guard (recap)

A slot file living under `worlds/zork/` gets `world: zork` for free
from its address — the directory tree supplies default coordinates.
Location is a guard; moving a file re-guards it; `git log` is the time
dimension. Everything below is that rule applied at successively finer
grain.

## Prefixes are containment without directories

Big-endian naming — most significant first: `2026-08-20-topic.yml`,
`heads-axe-brow.yml` / `heads-ledger-squint.yml` — makes lexicographic
order semantic order, and **prefix matching clusters the files of one
flat directory into implicit trees with semantically meaningful
paths**. The shared `heads-` prefix is a subtree node nobody had to
`mkdir`; a plain sorted `ls` is a treewalk; `heads-*` is a subtree
query the filesystem answers for free.

In the Korz reading, a filename prefix is a guard coordinate at finer
grain than the directory address — the same containment-is-a-guard
rule, one level down: renaming re-guards a file exactly the way moving
it does, and a date prefix is the time dimension worn on the name
(git log gives the *edit* history; the prefix gives the *subject*
time). So the tree/sea duality goes fractal: every directory is
simultaneously a little flat sea and a bundle of implicit subtrees
pattern-matched out of its names — the explicit tree below it and the
implicit trees within it are both just saved views over prefix
guards, and the strict tier gets its cheapest discrimination index —
sort order — as a gift from the filesystem.

## The suffix is a type declaration

A filename is big-endian almost all the way: most significant first,
subject before detail — except the very end, where one little-endian
holdout declares the *type*: `.yml`, `.png`, `.pdf`, `.js`. In the
Korz reading the extension is a guard on the **reader dimension** — it
dispatches perception itself. `.yml` says parse me as structured text
with load-bearing comments; `.png` says run me through the vision
tool; `.pdf` says extract me; `.js` says I am executable by the strict
tier. The LLM reads the suffix the way a compiler reads a type
annotation: it selects which faculty to bring, before a single byte of
the body is touched. So one filename carries the full dispatch
recipe — prefix path says *what it's about* (semantic address,
big-endian), suffix says *how to perceive it* (type, little-endian
caboose) — and MIME types turn out to have been coordinate guards worn
on the name all along.

## Fragments — the path drills through the file boundary

Paths don't stop at files. URLs continue inside with `#` and `?`, and
the internet already standardized the per-format drill-down:
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

## And it recurses through archives

A suffix that names an archive reader turns "file" back into
"directory": a zip is a filesystem in a file (and half the world's
formats confess it — `.jar`, `.docx`, `.epub` are zips wearing
costumes), a `.tgz` is one with a bow on it, and loopback mounts and
FUSE make the head-tilt literal — `mount` *is* the reinterpretation
operator. The Sims shipped this doctrine in 1999: **FAR** files are
Maxis archives containing **IFF** object files, and IFF is itself
chunked — `OBJD` definitions, `SPR2` sprites, `TTAB` action tables,
`BHAV` SimAntics behavior trees — so one address drills
`objects.far#/troll.iff#/BHAV/4096` from archive through object
through chunk to a single behavior tree, alternating file and
directory vocabularies the whole way down. Don's Transmogrifier walked
exactly that path twenty-five years ago; the drill already exists, it
just never got written as a URL. Turtles all the way down, and every
turtle is addressable.

## Higher-dimensional spreadsheets exist, and the best one is a directory tree

CSV never grew an N-D extension worth having; the real lineage is
HDF5/NetCDF — named dimensions, hierarchical groups, an internal
filesystem with `#/group/dataset` paths plus hyperslab selection — and
**Zarr**, which stores an N-D array as a directory tree of chunk files
where *the chunk's coordinates are its filename*. That's our head-tilt
running in reverse: the array world looked at a directory and saw a
tensor. Or skip formats entirely and fold a flat file numpy-style —
shape, strides, rowbytes: three integers turn bytes into any rank you
like, the oldest lesson in the business that **dimensionality is a
reading, not a property of the bytes**. And the pun that isn't one:
array *dimensions* and Korz *dimensions* unify. A context vector is an
index tuple into a sparse, high-dimensional, semantically indexed
array; the sea of slots is a sparse tensor whose axes have names like
`mood` and `world`; a dense numeric array is just the corner of the
sea where every coordinate happens to be an integer and every cell
happens to be full.

## CSV headers bind to dimension names

So how would that work — the header row as dimension binding? Take
the troll's three `greet` slots from the [design](design.md) and lay
them flat:

```csv
rcvr,world,mood,greet
troll*,zork,,The troll brandishes his axe and blocks the passage.
troll*,adventure,,The troll demands payment before you may cross the bridge.
troll*,,*,"Greet to fit {mood}; menace if provoked, grudging respect if they've beaten you."
```

The header row declares which dimensions this file's rows are guarded
on; **each data row pours one guarded slot into the sea**, and the
three guard stances map onto cell syntax with nothing left over: an
**empty cell** is *unmentioned* (the row stays generic on that
dimension — the honest structural absence, not a null), a **`*`** is
the *bare* stance (bind whatever mood is present), and a **value** is
*constrained*. Dispatch is row selection: `greet.csv#world=zork` —
RFC 7111's positional fragments upgraded to named ones, the query
string as guard expression — and most-specific-wins falls out as
*fewest empty cells among the matching rows*. Sorting by guard
columns, big-endian, groups the table into its own specificity
lattice: the flat CSV is a little sea, and every sort order is a saved
view, same fractal as the directory.

And this reading has three famous ancestors, none of which knew they
were doing Korz: **decision tables** (1960s — condition columns,
action columns, most-specific row wins; the shape survives in
`.gitattributes` and firewall rule tables); **Codd's relational
model** (1970 — a relation *is* a set of tuples over named attributes,
`SELECT ... WHERE` *is* a guarded query over named dimensions; the
relational database was N-dimensional dispatch all along, minus the
specificity lattice); and **tidy data** (Wickham — one variable per
column, one observation per row: the coordinate-native serialization
of a sparse tensor, which is why `pandas.melt` and `xarray` convert
between CSV-shape and tensor-shape mechanically). The Zork compiler
([design.md](design.md)) gains a second target: crystallize hot slots
not into code but into a dispatch CSV — diffable row-wise in git,
greppable, sortable into its own lattice, loadable by the strict tier
as a table and readable by the soft tier as prose with a header.

---

*Next: [epistemics.md](epistemics.md) — what happens when an address
points at latent space instead of a file.*
