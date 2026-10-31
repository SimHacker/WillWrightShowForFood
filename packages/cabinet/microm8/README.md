# microM8 in the cabinet

The cabinet's Apple ][ is April and Melody Ayres-Griffiths's microM8
([paleotronic/microm8-cln](https://github.com/paleotronic/microm8-cln), MIT). Two things are kept
apart here:

- **Our changes to their repo**: [`patches/`](patches/), described in [FORK.yml](FORK.yml).
  Each applies to their `master` with `git apply` and is marked for upstream or for us.
  Anything for upstream goes to them as a pull request, after asking.
- **Our packaging of it**: building their Go, with our patches, as a WebAssembly module, and the
  cabinet's Svelte component, reactive state and panels around it. The plan and the API are in
  [MICROM8.md](../MICROM8.md#proposal-microm8-as-a-webassembly-module-called-directly); that code
  lives in the cabinet, not in their tree.

To work on the patches, clone their repo, apply them in order, and export them again when
they change:

```
git clone https://github.com/paleotronic/microm8-cln microm8
cd microm8 && git checkout -b wasm-scope
git apply ../WillWrightShowForFood/packages/cabinet/microm8/patches/*.patch
```

The disks this Apple boots are in [../disks/apple2](../disks/apple2/DISKS.yml); the Apple section
as a whole is [APPLE2.md](../APPLE2.md).
