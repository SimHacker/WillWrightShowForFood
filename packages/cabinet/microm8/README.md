# microM8 in the cabinet

The cabinet's Apple ][ is April and Melody Ayres-Griffiths's microM8
([paleotronic/microm8-cln](https://github.com/paleotronic/microm8-cln), MIT). Two things are kept
apart here:

- **Our changes to their repo**: [`patches/`](patches/), described in [FORK.yml](FORK.yml).
  Each applies to their `master` with `git apply` and is marked for upstream or for us.
  Anything for upstream goes to them as a pull request, after asking.
- **Our packaging of it**: building their Go, with our patches, as a WebAssembly module, and the
  cabinet's Svelte component, reactive state and panels around it. Built and running; the design and the API are in
  [MICROM8.md](../MICROM8.md#microm8-as-a-webassembly-module-called-directly); that code
  lives in the cabinet, not in their tree.

To work on the patches, clone their repo, apply them in order, and export them again when
they change:

```
git clone https://github.com/paleotronic/microm8-cln microm8
cd microm8 && git checkout -b wasm-scope
git apply ../WillWrightShowForFood/packages/cabinet/microm8/patches/*.patch
```

`node scripts/microm8-wasm.mjs` builds that working copy into `dist/` and the site's
`static/microm8/`. Releases are built from upstream plus `patches/` alone (`--patches`), keyed
by a hash of what goes into them (`--key`), published to Cloud Storage by CI, and fetched by
deploys (`--fetch`); the details are in [apps/ties/SERVER.md](../../../apps/ties/SERVER.md). The
two builds are byte-identical when the patches are exported from the working copy, so export
them before pushing.

The plan to rebuild this Apple in TypeScript, as plugins on the cabinet's backplane, with microM8
as the reference it is checked against:

- [STACK.md](STACK.md): the parts, the rules, the plugin surfaces, video on the GPU.
- [TRANSPARENCY.md](TRANSPARENCY.md): overlays, traces, profiles, source maps from the printed
  listings to BASIC, rewind, lockstep and distributed devices.
- [GO-AND-TYPESCRIPT.md](GO-AND-TYPESCRIPT.md): what each language gives this job.
- [MODULE-MAP.md](MODULE-MAP.md): every microM8 package and where it goes.
- [PLAN.md](PLAN.md): the steps, each with a test and a number.

The disks this Apple boots are in [../disks/apple2](../disks/apple2/DISKS.yml); the Apple section
as a whole is [APPLE2.md](../APPLE2.md).
