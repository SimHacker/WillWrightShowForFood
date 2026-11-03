# @wwsff/flavors

Directories that inherit from directories, with multiple inheritance used the way Lisp Machine
Flavors and CLOS taught: a base flavor says what a thing is, and **mixins** add one capability
each. A flavor is a directory with a marker file (`flavor.yml`, `flavor.json`, or the marker in
any registered syntax) and any other files. `parents` lists what it is built on.

Instantiating a flavor composes one value tree, every flavor's files, the comments that still
apply, and a record of who set what. Baking renders the templates, runs the recipe and writes
the result into a directory at build time. The words are Flavors' wherever they mean the same thing
(base flavor, mixin, vanilla, abstract, required flavors, combination, instance); the
build-time plan and the rest of the vocabulary are in [DESIGN.md](DESIGN.md).

Nothing in it knows about emulators. The cabinet's cartridges are its first user:

```
pdp7/flavor.yml                       machine: { cpu: pdp7, memory: { core_words: 8192 } }
pdp7/forth/flavor.yml                 parents: [pdp7]
pdp7/forth/flowers/flavor.yml         parents: [forth]
pdp7/forth/flowers/don/flavor.json    { "parents": ["flowers"], "player": "don" }

apple2/micropak/boot.cfg              microM8's own OGDL, as microM8 writes it
apple2/plus-videx/micropak/boot.yml   init: { profile: apple2-plus-videx }
apple2/plus-videx/forth/flavor.yml    parents: [plus-videx, serial-slot4]
```

## Bases and mixins

- The **base** is the first parent: `apple2`, then `apple2/plus-videx`. It says what the
  flavor is.
- A **mixin** is any later parent. It adds one capability (a serial card in slot 4, a
  player's settings, a site's network) and owns its own keys.
- **vanilla** is the empty root flavor, the start of "build up from nothing".
- Compose upward. A small base plus mixins beats a large base with things deleted; `null` is
  for the exception.

These are plug-in surfaces, not an ontology. A mixin fills a surface its base offers (a slot,
a `micropak/` file, a device list), and the keys at that surface are the interface both sides
agree on, the way an OLE control and its container site each publish what the other may call.
The inheritance stays wide and shallow: a few bases, many small mixins.

Three keys describe the flavor rather than its data, and are not inherited:

| Key | Flavors | Effect |
|---|---|---|
| `parents` | component flavors | what it is built on, in order |
| `abstract: true` | `:abstract-flavor` | `instantiate` refuses it and `leaves()` leaves it out; mixins and bare bases are abstract |
| `requires: { flavors, keys }` | `:required-flavors`, `:required-instance-variables` | an instance must also have these flavors among its ancestors and these value paths; checked at `instantiate`, every miss named |

```yaml
# serial-slot4/flavor.yml
abstract: true
requires: { flavors: [apple2], keys: [machine.cpu] }
slots: { 4: acia-c800 }
```

## Parents

`parents` is the one key for inheritance: an ordered list of references. In a file a
reference is a name; in memory it is the Flavor object (`parentFlavors(id)`). A single name is
read as a list of one.

A reference is an exact id, or the last segments of one (`forth`), and the match nearest the
referring flavor in the tree wins. Two equally near matches are an error naming both.

This differs from Self, where every slot whose name ends in `*` is a parent and parents are
reached by name. Here parents are not named: the list is the order, and the order decides who
wins.

Nothing is lost by that. A value can hold a reference to any flavor, a parent included, as an
ordinary value (`console: apple2/videx`), and code that reads it gets that flavor as itself:
`get(id)` for its own values, `instantiate(id)` for it composed. That is the way to treat a
parent as a separate thing rather than part of you, and needing it is usually a sign the parent
should be a value you hold, not a flavor you are. When a flavor wants one parent's value over
another's, it sets the value itself, or lists that parent later.

## Multiple inheritance, used well

Multiple inheritance got its reputation from class hierarchies where every parent brings state,
behavior and opinions about the same things, and the language guesses which one you meant: the
C++ diamond with two copies of the shared base, a method found by a lookup nobody can predict,
deep trees where a change at the top breaks a leaf. The harm comes from how it is used, not
from the mechanism, and the uses that work have a shape.

| Harmful | Harmless, and the shape here |
|---|---|
| Parents that overlap, each owning some of the same keys | A base says what the thing is; each mixin owns its own keys (one card, one slot, one player) |
| Order decided by a search the reader has to simulate | One C3 order, printed by `order`, the later parent winning |
| A diamond's shared ancestor applied twice, or in two places | Applied once, before everything that builds on it |
| Inconsistent orders resolved silently | An error naming the two flavors that disagree |
| Deep trees, reasons to inherit lost | Wide and shallow, and the full form records who set every value and why it won |
| Inheriting to reuse code you don't mean to be | `requires` states what a mixin depends on; `abstract` keeps a mixin off the menu |
| State and behavior tangled across parents | Data only; composing ends at build time, and run time sees a plain result |

This is the use Flavors was built for, and the one Python, Ruby modules, Scala traits and CLOS
mixins converged on: small pieces that each add one thing, composed in an order you can print.

## Precedence

Each flavor's **precedence list** is itself, then its ancestors, each once, most specific
first. It is computed by C3, the linearization from Dylan that Python and Raku use:

- a flavor precedes its parents;
- its parents keep the order they are written in, and the **later parent wins** where two
  disagree (a stack of layers, like merge patch; CLOS and Python have the leftmost win);
- every ancestor's own precedence list is kept, so a diamond's shared ancestor comes once,
  after both sides, and neither side's changes to it are undone.

When parents disagree about an order (one puts `a` over `b`, another `b` over `a`),
instantiating is an error naming them. `precedence(id)` gives the list; `order(id)` gives it reversed, the
order layers are applied in.

A second pass lays **overlays** on the result: a flavor id, or a map with its own `parents`
and values. Each overlay is one more subclass of everything before it; a parent already in
the list is already applied and is left out. That is where an instance goes: a player's
settings, a site, a session.

## Combination

How a layer's value combines with what is below it, named after Flavors' method combination:

| Value | Combination |
|---|---|
| map | merges key by key, recursively ([RFC 7386](https://www.rfc-editor.org/rfc/rfc7386)) |
| scalar, array | the later one replaces the earlier |
| `null` | deletes the key, from any layer, overlays included |
| `id`, `parents`, `abstract`, `requires` | not inherited |

Rules change that per path (`*` matches any one key), as `{ path, combine }`:

| `combine` | Effect | Example |
|---|---|---|
| `replace` | the later value replaces whole, maps included | `containers.*` |
| `append` | the earlier items, then the later items not already present (Flavors' `:append`) | `packages` |
| `{ key: "path" }` | list entries matched by a field; a match merges (or `entries: "replace"`); `remove: true` drops one; new ones append | `resources`, `build` by `id` |

## Syntaxes and comments

A syntax is a plugin: `{ name, extensions, parse(text) → { value, notes }, stringify(value, notes) }`.
YAML, JSON and OGDL come with the package. Pass more in `syntaxes`, or the same one with more
extensions (`{ ...ogdl, extensions: [".cfg"] }` for microPAK files).

Every structured file is matched by its path without its extension, so `video.cfg` and
`video.yml` are one file. A file only one flavor has is written byte for byte.

Comments are carried beside the values. A comment above a key is inherited with the key. A
comment at the end of a value's line describes that value, so it stays only while the flavor
that wrote it still owns the value. They come out in whatever syntax the result is written in.

## Files

A flavor's files keep their path. `apple2/serial-slot4/acia.fs` is at that path in the source
and in the image, so a value can name a file that sits beside its own marker, and a mixin
carries its files with it.

A file rule with `overlay: true` makes files **overlays** instead: matched by their path inside
the flavor, laid over their ancestors' files, and written once at the image root. microPAK's
`micropak/*.cfg` are overlays. A structured overlay merges key by key across syntaxes (a
parent's `micropak/boot.cfg` and a child's `micropak/boot.yml` are one file) and is written in
the syntax of the last flavor that had it, or the rule's `as`. Other overlays, and overlays a
rule marks `opaque`, replace whole. Two files written at one path are an error.

A file named for a template engine (`acia.fs.liquid`) is rendered and written without the
engine's extension (`acia.fs`). Engines are plugins `{ name, extensions, render }`;
[LiquidJS](https://liquidjs.com) is the default: Jinja's `{{ }}` and `{% %}`, no code runs, in
Node and the page. A template sees `values` (the instance's), `flavor` (its own flavor),
`instance` and `path`, and `{% render "apple2/serial-slot4/irq.liquid" %}` includes another
file by its path. A missing value is an error, not an empty string.

```liquid
\ {{ flavor }} for {{ instance }}
HEX {{ values.serial.base }} CONSTANT ACIA  DECIMAL {{ values.serial.baud }} BAUD
```

Data files don't need templates. A YAML, JSON or OGDL file is combined as values and written by
its syntax, so it can't come out with broken indentation or quoting.

## Recipes and outputs

`recipe` is a list of build steps that run over the image before it is written. Steps combine
by `id`, so a mixin adds a step, replaces one, or drops one with `remove: true`. A step with
`before: <id>` or `after: <id>` hangs on another step, the way a Flavors `:before` or `:after`
daemon hangs on a primary method.

```yaml
recipe:
  - { id: cfg,  step: output, format: ogdl, to: micropak/machine.cfg }
  - { id: pak,  step: zip, from: micropak/, to: game.pak, move: true }
  - { id: full, step: output, format: full, to: debug/flavor.full.yml, after: pak }
```

Builders are plugins `{ name, run(step, context) }`. Three come with the package and run in
Node and the page:

| Step | Does |
|---|---|
| `output` | writes the composed values in a `format`: any syntax, or `full` |
| `zip` | the files under `from` into the archive `to`; `move` takes them out of the image ([fflate](https://github.com/101arrowz/fflate)) |
| `unzip` | the archive `from` into `to`; `move` takes the archive out |

What gets written is whatever `output` steps the recipe has. A recipe with none gets one: the
marker name in YAML (`flavor.yml`), or in the `as` format given to `bake`. Once a recipe names
any output, it names all of them.

## Build time and run time

Instantiating and baking happen once, before anything runs: when a cartridge is built, a menu
is made, or an image is made. `bake` ends build time by writing a plain directory. Run time
reads that directory and nothing else. It never walks parents, combines values, or needs the
package. The exception is a page that adds mixins when it starts a flavor, from a URL or a menu:
it instantiates in the browser and caches the result ([DESIGN.md](DESIGN.md#next), item 4).

### The full form

`full` is one more output format: the instance with everything instantiating knew, as YAML
with comments saying what each part is. It is written only when an output step asks for it,
for debugging or for tools that ask why.

```yaml
# The full form of a flavor instance, from @wwsff/flavors. Run time reads the composed files, not this.
instance: apple2/videx/forth
# Most specific first. Of two parents, the later wins.
precedence: [apple2/videx/forth, apple2/videx, apple2]
# Every value path: its value now, who set it, every change any layer made, its comments and their authors.
values:
  slots.3: { value: videx, set_by: [apple2/videx] }
  slots.2:
    gone: true
    history:
      - {by: apple2, set: ssc}
      - {by: apple2/videx, deleted: true}
# Every file in the image: where it sits, which flavor it came from, what was read, and whether
# its bytes are copied, combined or rendered.
files:
  micropak/boot.yml:
    placement: overlay
    flavor: apple2/videx/forth
    sources: [apple2/micropak/boot.cfg, apple2/videx/forth/micropak/boot.yml]
    bytes: composed
    values:
      init.profile:
        value: apple2-plus-videx
        history: [{by: apple2, set: apple2e-en}, {by: apple2/videx/forth, set: apple2-plus-videx}]
        comment: {after: " Videx", after_by: apple2/videx/forth}
  apple2/videx/forth/forth.po: {placement: own, flavor: apple2/videx/forth, sources: [apple2/videx/forth/forth.po], bytes: original}
```

`instance.full()` gives the same tree as a value, and `render("full")` as text.

## Use

```ts
import { Flavors, yaml, json, ogdl } from "@wwsff/flavors";
import { bake, dirSource } from "@wwsff/flavors/node";

const syntaxes = [yaml, json, { ...ogdl, extensions: [".ogdl", ".cfg"] }];
const carts = new Flavors(dirSource("cartridges"), {
	marker: "cartridge",
	syntaxes,
	rules: [{ path: "resources", combine: { key: "path" } }],
	files: [{ match: "micropak/*", overlay: true }],
});
const forth = carts.instantiate(carts.find("forth"), { overlay: { player: "don" } });
forth.data; forth.files; forth.full(); forth.render("json");
await bake(forth, "out/forth", { marker: "cartridge", syntaxes });
```

In a page, `memorySource` takes a path-to-contents map, such as a bundler's eager glob, and
`image(instance)` with `build(instance, image, { syntaxes })` gives the baked files in memory.

```
flavors <root> list | leaves | order <id> | instantiate <id> | bake <id> <dir> | why <id> <path> | full <id>
  --marker NAME  --as FORMAT  --output FORMAT=PATH  --overlay ID|FILE  --rules FILE  --ext .cfg=ogdl  --clean
```

`--output full=debug/flavor.full.yml` adds an output step for that bake without editing a flavor.

## Not yet

Builders that run tools (AppleCommander for Apple II disks, Packer for VM images), a cache of
step outputs, run-time inputs, and JSON Schema checks are planned in [DESIGN.md](DESIGN.md).
A check for keys two unrelated mixins both set is not written.

## Lineage

Flavors (MIT Lisp Machine) named the mixin, after the mix-ins at Steve's Ice Cream in
Somerville, and gave vanilla, abstract and required flavors, and method combination. CLOS
gave the precedence list; Dylan gave C3.
Self gave prototypes that delegate to parents. NeWS 2.0's `class.ps` kept multiple parents
in `/ParentDictArray`, an ordered array, the shape `parents` has here. The Self-ish fragment
configuration design in [moollm](https://github.com/SimHacker/moollm)
(`designs/PROTOTYPE-FRAGMENT-CONFIG.md`) set out directories as prototypes, ordered parents,
merge patch with `null` deletes, a type pass and an overlay pass, and materialization with
provenance. This package adds C3, abstract and required flavors, per-path combination,
syntax plugins, comments, files merged across syntaxes, templates, recipes, and the full form.
