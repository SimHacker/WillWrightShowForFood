# @wwsff/catalog

What can run, in one tree. Each entry declares where it appears (`path`), wherever its files
live, so the tree a person browses is independent of the layout on disk. The design, and the
systems it borrows from, are in [CARTRIDGES.md §7a](../cabinet/CARTRIDGES.md#7a-the-catalog-one-browser-for-every-machine).
Nothing in it knows about emulators; the cabinet is its first user.

```yaml
# any catalog.yml, anywhere
folders:
  - { path: games, title: Games, order: 1 }
  - { path: forths, title: Every Forth, query: { tags: { language: forth } } }
defaults:                       # under every entry of this file
  tags: { machine: apple2 }
  runs: { machine: apple2 }     # fills in an entry's own runs; never makes a container runnable
entries:
  - id: lcp
    title: Little Computer People
    path: games/simulations/little-computer-people
    also: [people/david-crane]  # folders it is also listed in
    was: [apple2/lcp]           # old paths, redirected
    tags: { year: 1985, by: david-crane }
    runs: { disk: lcp.dsk }
    mixins: [player/*]          # what a URL may add
    inputs:                     # what a URL may set
      speed: { path: machine.speed, type: number, default: 1, min: 0.5, max: 16 }
```

| Key | Meaning |
|---|---|
| `path` | slugs, one per level; the entry's place and its URL. Titles are accepted and slugged. |
| `title` | shown in the tree; for a folder, declared once in `folders:` |
| `runs` | what to boot, read by the machine's adapter; absent means a container |
| `also` | folders the entry is also listed in, as links to its path |
| `was` | old paths, which resolve to the current one |
| `order` | where the entry sits among its siblings, lowest first; unordered ones follow by title |
| `guide` | a markdown file shown with the entry, by its path from the repo root |
| `tags` | facets, each a value or a list; `"facet:value"` strings also work |
| `mixins` | names a URL's `with=` may add; `prefix/*` matches a prefix |
| `inputs` | values a URL may set: `path`, `type` (string, integer, number, boolean), `default`, `min`, `max`, `values` |

A folder exists when a path passes through it; a `folders:` entry adds a title, a description,
an `order`, or a `query` (a saved filter, whose children are the entries that match, grouped by
the folders they live in and ordered within each).

## API

```ts
import { Catalog, parseLaunch, launchUrl, effectiveValues, nest } from "@wwsff/catalog";
import { loadCatalog } from "@wwsff/catalog/node";   // every catalog.yml under some directories

const catalog = new Catalog().add(yamlObject, "where/it/came/from.yml");
catalog.tree("games");                    // nodes: folders, entries, links
catalog.find({ text: "forth", tags: { machine: ["pdp7", "apple2"] }, runnable: true });
catalog.facets();                         // { machine: { pdp7: 11, apple2: 60 }, ... }
catalog.byFacet("year");                  // a tree by one facet
catalog.resolve("apple2/lcp");            // { entry, redirect: "games/simulations/..." }
catalog.problems;                         // bad entries are left out and named here, never thrown

const launch = parseLaunch(catalog, "/cabinet/games/simulations/little-computer-people/", "?speed=2&with=player/don");
// { entry, with: ["player/don"], values: { "machine.speed": 2 }, ignored: [] }
nest(effectiveValues(launch.entry, launch.values));   // { machine: { speed: 2 } }
launchUrl(launch.entry, launch);          // the canonical URL, defaults left out
```

Within a facet any value matches; across facets every one must. Anything a URL sets that the
entry doesn't declare is returned in `ignored` with the reason.

## CLI

```
catalog tree [path] | find [text] [facet=value ...] | facets | by <facet> | url <url>
        --root <dir> (repeatable)  --base /cabinet/  --json
```

The cabinet's full catalog, with an entry per Apple disk, is
`node packages/cabinet/scripts/catalog.mjs`.
