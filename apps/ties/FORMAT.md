# The article format: markdown with embedded target applets

A converted HyperTIES article is **a plain `.md` file**. It reads as prose in any editor, renders on
GitHub, and diffs in git. Everything the 1988 system knew is carried in YAML frontmatter and in fenced
`target` blocks, so nothing is hidden inside a blob and nothing needs a custom parser to be *read* —
only to be *enhanced*.

This is the opposite of the 2005 XML pass, which wrapped each file in `<target class=… name=…>` and
put the original PostScript inside `<![CDATA[…]]>`. That labelled the outside and left the inside
opaque. Here the inside is the point.

## An article

```markdown
---
title: The Space Telescope in Orbit
synonyms:
  - "!home"
definition: An artist's conception of the space telescope in orbit.
source: newdb/orbview/orbview.st0
---

```target
shape: orbital view - shape telescope    # resolved in the TARGETS namespace
picture: orbital view                    # resolved in the PICTURES namespace
to: Hubble Space Telescope - Main View   # resolved in the DOCUMENTS namespace
```

→ ~Hubble Space Telescope - Main View~
→ ~Introduction article~
```

Three names, three namespaces, one construct — which is the syntax of the original:

```
.picture orbital view
.target orbital view - shape telescope
Hubble Space Telescope - Main View
```

## The four rungs

| Frontmatter | From | Rung |
|---|---|---|
| `title` | `.title` | name — the index's *principal* |
| `synonyms` | `.synonyms` / `.synonym` | every alias that resolves here |
| `definition` | `.definition` / `.description` | **the mandatory preview.** Single click shows this |
| body | `.contents` / `.content` | the article |

The second spellings are aliases in the 1988 formatter (`alias .description .definition`), so they
land in the same field here. See [`../../designs/webtop/hyperties/ARTICLE-SCHEMA.md`](../../designs/webtop/hyperties/ARTICLE-SCHEMA.md).

## Links are self-naming

`~name~` stays `~name~`. You write the phrase you meant to write and the reader resolves it against
titles **and synonyms** — the property the 1991 paper called *self-naming*, and the reason the author
is writing prose rather than marking up links.

The archive's prototype dialect spells it `.~ name~`, because `.~` is a FORTH word and FORTH words are
whitespace-delimited. The converter normalizes to the clean `~name~` that Weiland's C parser accepted.

`unresolved:` a `~name~` with no entry in any of the three namespaces is left as literal text and
reported by the converter. It is never silently dropped.

## Target applets

A fenced ` ```target ` block is YAML. Three properties matter, and any of them may be absent:

| Key | Meaning |
|---|---|
| `shape` | a name in the targets namespace; its geometry is `shapes/<slug>.svg` |
| `picture` | a name in the pictures namespace; the image the shape sits on |
| `to` | a name in the documents namespace — where a click goes |
| `class` | `PopupTarget`, `MenuTarget`, `ScrollbarTarget`, `PageTrackerTarget` |
| `command` | for control-panel targets, a `!Option…` browser verb instead of an article |

**Why a fenced block instead of a custom directive.** It renders as readable YAML on GitHub with no
plugin, it is yaml-jazz so comments inside it carry meaning, and a reader that has not loaded the
applet module still shows the reader something true. Graceful degradation, not a blank space.

## Shapes are normalized, and the y axis is flipped

`shapes/<slug>.svg` carries `viewBox="0 0 1 1"` with `preserveAspectRatio="none"`, because the
original `.tn0` geometry is normalized 0..1 — which is precisely why one target served renderings at
450x337, 507x598 and 533x509. Resolution independence was in the 1988 data and should not be thrown
away by baking in a pixel size.

PostScript is y-up and SVG is y-down, so `y_svg = 1 - y_ps`. The 2005 SVGs omitted this and are
vertically mirrored; verified by overlaying both on the artwork, where only the flipped path traces
the telescope. The converter reads the original `.tn0`, not those SVGs.

## The index carries three namespaces

`index.yml` per database is a direct translation of Weiland's `MASTER_INDEX`:

```c
struct index *documents, *pictures, *targets;
```

with `principals` and `entries` kept as separate counts, because aliasing lives in the index's shape
rather than on top of it — which is why resolving a synonym costs what resolving a title costs.

## The reader

`reader/` fetches the `.md`, parses frontmatter, renders the body with a markdown module, then:

1. resolves every `~name~` against the three namespaces,
2. **single click shows the destination's `definition`** — the rung the web dropped,
3. double click navigates,
4. replaces each `target` block with its picture and an SVG overlay of the shape, carrying the same
   single/double click semantics.

Step 2 is the whole point. HyperTIES got link previews for free from a schema that refused to let an
article exist without a definition.
