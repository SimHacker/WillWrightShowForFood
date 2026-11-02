# Flavors at build time and after

The words, the phases, and what comes next. What exists (own-path files, overlays, templates,
recipes, outputs, the full form) is described in [README.md](README.md).

## Words

From Lisp Machine Flavors, used for what they meant there:

| Word | Meaning here |
|---|---|
| flavor | a directory with a marker file and any other files |
| base flavor | the first parent: what the thing is |
| mixin | a later parent: one capability, its own keys, its own files |
| vanilla | the empty root flavor everything can start from (Flavors' `si:vanilla-flavor`) |
| abstract | never instantiated alone (`:abstract-flavor`) |
| requires | flavors and keys an instance must also have (`:required-flavors`, `:required-instance-variables`) |
| combination | how values at a path combine: `merge`, `replace`, `append`, keyed (method combination) |
| instance, instantiate | the composed result, and making it (`make-instance`) |
| daemons | recipe steps hung `before` or `after` another step (`:before`, `:after` methods) |

From image building, used for what they mean there:

| Word | Meaning here |
|---|---|
| bake | write the instance into an image at build time |
| fry | values supplied at boot or run time, into a baked image |
| recipe | the ordered build steps (Chef, BitBake and Conan use the word the same way) |
| output | a recipe step that writes the composed values in one format |
| full form | the `full` format: values, history, provenance, comments' authors and file sources, as YAML |

The phases, in order: **instantiate** (compose values and files) → **render** (templates) →
**build** (recipe steps, outputs among them) → **bake** (write the directory). **Fry** happens
later, at run time, and only fills inputs the bake declared.

## Values stay data

There is no expression language in the values. Terraform invented HCL to compute inside its
configuration; here values are data, templates read them, and anything that computes is a
builder written in TypeScript. Helm templates YAML as text and gets indentation bugs; here
YAML, JSON and OGDL are combined as values and written by their syntax, and templates are for
the files no syntax reads.

## Next

1. **Tool builders.** Each wraps a tool that already exists, and lives where the tool is:
   | Builder | Uses |
   |---|---|
   | Apple II disks | The cabinet's TypeScript file systems, in Node and the page: `prodos.ts`, `dos33.ts`, `pascal.ts` ([APPLE2.md](../cabinet/APPLE2.md#disk-images), with credits). A builder step puts files from the image onto a disk image: `{ step: apple2-disk, image: disks/forth.po, put: [{ from, to, type, aux }] }` |
   | VM and edgebox images | [Packer](https://www.packer.io), given the baked directory |
   | tar | [nanotar](https://github.com/unjs/nanotar) |
2. **A step cache.** Each step's output stored under the hash of its builder, options and
   inputs, as [CARTRIDGES.md §2](../cabinet/CARTRIDGES.md#2-build-steps-and-the-cache)
   describes. With an ordered list, that is all the build system there is; when a recipe needs
   more (parallel steps, dependencies across recipes), the next tool is an existing one.
3. **Inputs, and fry.** A baked image declares values it leaves open, with a type and an
   optional default, filled at boot or run time: a site's address, a player's name, a person
   injected into a disk at startup. Run time reads the baked files and the inputs, and never
   walks parents, combines values or renders templates.
4. **JSON Schema checks.** A base flavor ships a schema for the surfaces it offers, and
   instantiating validates against it with [Ajv](https://ajv.js.org). `requires` is the small
   version of this that exists now.
