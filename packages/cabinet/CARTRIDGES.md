# Cartridges: what you plug in, how it builds, and where your changes go

[DESIGN.md](DESIGN.md#cartridges-and-live-coding) named the cartridge and sketched one. This file
owns the format: what a cartridge may carry, how it is built and cached, how one cartridge
extends another, how code comes back out of a binary, and how an edit made in the page ends up
in a git repo, built by CI and deployed. The LIVE CODING panel, variants and pen scripts stay
in DESIGN.md.

Today a cartridge is an object in
[`cabinet-programs.js`](../../apps/ties/src/lib/cabinet-programs.js) with its loading written as
code. Every one of them already does one of the things below by hand:

| Today | Does | Becomes |
|---|---|---|
| DUEL | binary tape, a loader tape, a five-word patch overlay | `tape` resources, a `load` step, a `patch` resource |
| SYMELEC | `.oct` image, symbols TSV, the 1972 listing, and its address-to-source map | `image`, `symbols`, `listing`, `source-map` |
| LP370 | three sources assembled together, DEC dialect | `source` × 3, an `assemble` step |
| HILO, LANDER | a program plus a shared library, `tapes/lib/readln.s` | `source` plus a `library` |
| FORTH | `sop.s kernel.s end.s` by `as7`, then two Forth files compiled on the machine | `assemble` with concatenation, then `tape-compile` |
| UNIX | a gzipped RB09 platter and a RIM boot tape | `platter`, `tape`, `read-in` |

## 1. A cartridge is a directory

```
tapes/forth-flowers/
  cartridge.yml        what it is, what it carries, how to build it
  flowers.fs           its own files, any kind
  README.md            the help article; HyperTIES renders it beside the machine
```

`cartridge.yml` lists **resources** and **build steps**, and refers to everything else by path.
The design target is broader: the cartridge also declares the machine configuration—CPU,
memory, devices, ports, mappings, timing, interrupts, and host-facing adapters. Today the
cartridges are still JavaScript objects in `cabinet-programs.js`; the YAML below is a sketch of
the file format, not a claim that every machine field is parsed and wired already.

```yaml
id: forth-flowers
label: FLOWERS (2026)
extends: forth                       # everything of forth's, then these changes
machine:
  cpu: pdp7
  memory: { core_words: 8192 }
  devices: [teletype, clock, papertape, type340]
listing: { user: A2DEH }
resources:
  - { path: flowers.fs, kind: source, lang: forth }
build:
  - { step: tape-compile, image: $parent, tape: [flowers.fs] }   # on top of forth's image
demo: flowers
help: README.md
```

The parent `forth` cartridge can supply the machine wiring, so this child only needs to declare
the program-specific additions. A machine declaration is a **wiring plan**, not a claim that all
CPUs share one bus:

- **CPU and memory** identify the instruction-set plugin, word/address dimensions, memory banks,
  and regions or devices visible in the address space.
- **Devices** declare their abstract interface: methods, properties, status flags, events, and
  optional memory regions. The cartridge binds those interfaces to the selected CPU's actual
  mechanisms: PDP-7 IOT device/pulse/AC conventions; Apple II soft switches and game-port registers;
  PDP-10 channels, byte pointers, or interrupts.
- **Instruction contributions** are optional. A device may describe operations that can be exposed
  as guest instructions, but the CPU plugin must explicitly bind them to valid encodings and define
  their architectural effects. Fixed or incompatible ISAs use their native I/O mechanism instead.
- **Interrupts, flags, and timing** are mapped by the cartridge to the CPU's interrupt lines and
  scheduling rules. A device's abstract event does not assume every CPU has the same flag or
  interrupt model.
- **Adapters** translate between device interfaces and machine-specific protocols. A cartridge
  may select a built-in adapter or, where permitted, a trusted JavaScript module. Arbitrary
  JavaScript from URL-loaded cartridges is not evaluated: today's cartridge scripts use a
  constrained declarative vocabulary, and adapter code needs an explicit trust/capability boundary.

This separation lets one device travel across unlike machines. For example, a mouse/keyset
instrument can become a PDP-7 light pen plus teletype input, or Apple II paddle values, pushbuttons,
and keyboard events. Only the cartridge's adapter changes; neither machine needs to pretend its
I/O architecture is the other's. The configuration itself is inspectable and testable, so wiring
errors—overlapping addresses, unclaimed ports, invalid opcode bindings, or an interrupt with no
CPU route—can fail before a program starts.

**Resource kinds** are open-ended, and each one names who reads it:

| Kind | Example | Read by |
|---|---|---|
| `tape` | `duel.pt`, `rim.pt`, `boot.rim` | the paper tape reader, or a `read-in` step |
| `source` | `.s` (as7, dec, cambridge), `.fs` (Forth), a talk tape | an assembler or a compile step |
| `library` | `readln.s`, `rsp.fs`, `pen-to-tty.yml` | the same, shared by path across cartridges |
| `template` | a CA rule, a talk tape skeleton | `expand`, below |
| `image` | a core image (`.oct`, `a7out`, a saved core) | `boot` |
| `platter` | the UNIX RB09 image | the disk device |
| `patch` | DUEL's five words | applied after load, never folded into source |
| `symbols` | `symelec-symbols.tsv` | disassembler, memory panel, source view |
| `listing` | the 1972 assembler listing | listing/source view; parsed to build an address-to-source map |
| `source-map` | core address → listing line and expected word | memory panel, execution trace, source view; highlights source and detects divergence |
| `scan-map` *(planned)* | authoritative listing line → page and normalized rectangle(s) in the original scan, aligned through OCR tokens | synchronized scan/listing viewer; OCR text is a fuzzy-match witness, never replacement source |
| `table` | a cellular automaton lookup table | a device, or a deposit at a label |
| `session`, `demo` | recorded input ([session.ts](src/session.ts)) | the transport ([ROADMAP §11](ROADMAP.md#11-one-transport-and-a-demo-library)) |
| `save` | a Forth Animal tree, a SYMELEC ring file, a UNIX file | the program, by typing or the tape reader |
| `scripts` | pen and key handlers | the cabinet ([DESIGN.md](DESIGN.md#pen-events-and-cartridge-scripts)) |
| `doc` | a HyperTIES article, a picture | the reader |

An unknown kind is carried and ignored, the way an older page plays a session with new event
kinds. A cartridge from tomorrow still loads today; it just can't do the new thing.

**Panels are opted into.** A cartridge lists the panels it needs, and a panel's chip appears
only when the running cartridge asks for it. RINGS already works this way: it shows only for
a program that says where its ring structure lives (`rings: { beg, end, roots }`), today only
SYMELEC. A Forth cartridge that `extends` the base with `rsp.fs` and names its ring area gets
the 3D ring viewer for free, live on the rings the Forth is building, the same viewer PIXIE's
rings use. DUEL's game panel, read from core through its symbols, is the next opt-in panel.

## 2. Build steps, and the cache

A build is a short list of steps from a fixed vocabulary, the same rule as cartridge scripts:
data, no eval, because a cartridge arrives by URL.

| Step | In | Out |
|---|---|---|
| `concat` | files, in order | one source; the source map remembers which file each line came from |
| `expand` | a template and its parameters | a source |
| `assemble` | sources, a dialect (`as7`, `dec`, `cambridge`) | image, symbols, source map, listing |
| `tape-compile` | an image, Forth sources on tape | a new image, compiled on the emulated machine |
| `load` / `read-in` | tapes | core, the way the hardware does it |
| `patch` | core, a patch | core |
| `decode` | core, hints | sources (§4) |
| `verify` | two images | pass, or the first differing word |
| `table` | a rule | a lookup table (§5) |

`as7` has always assembled several files as one (`sop.s kernel.s end.s`), so concatenation is
just the order of the list. Our assemblers keep each line's file and line number, so an error
or a trace in `kernel.s` points at `kernel.s`, not at line 4,000 of a joined file.

**Content-addressed cache.** Each step's output is stored under the hash of everything that
went in: the step, the tool's version, its options and the hash of every input. Building the
same thing twice is a lookup. Changing one Forth file reruns only the steps downstream of it.
Forty cartridges that share one Forth kernel assemble it once. The cache lives in IndexedDB in
the page and in a directory under Node. Because the emulator is deterministic, the hash also
names the result, and CI can check it (§7).

## 3. Extending: many cartridges, one Forth

`extends` names a parent cartridge. The child gets every resource and step of the parent, then:

- adds resources;
- replaces a resource by giving the same path;
- removes one with `{ path: …, remove: true }`;
- appends build steps, or replaces one by id.

The parent can be in this repo (`forth`), in another (`gh:mitch/pdp7forth-carts/turtle@main`),
or at a URL. A child records the parent's content hash when it is saved, so a parent that
changes later doesn't silently change the child; updating is a choice, shown as a diff.

That gives the family Don asked for: one `forth` base, and any number of small cartridges that
are a single user-written `.fs` file each. The same goes for HILO's talk tapes, for CA rules
over one CAM base, and for SYMELEC with different saved drawings.

## 4. Live decoding: from a binary back to source

The disassembler already runs in the page ([disasm.ts](src/disasm.ts)), and the assemblers do
too. So decoding needn't be a script run once on a desk: it is a panel, and a step.

1. **Load the binary** the way the cartridge always did (DUEL: RIM, FunnyFormat, patches after).
   Record which words the loader wrote.
2. **Code or data.** Trace from the start address and the interrupt entry through `jmp`, `jms`,
   skips and known tables. Running the game with an execution map is a second witness: every
   word the CPU fetched as an instruction is code, every word the 340 fetched is a display word.
3. **Emit sources**, one file per region, with labels named by address (`l1157`). Data as octal,
   display lists as display words.
4. **Assemble them and verify**, word for word against step 1. This runs on every edit, so the
   panel shows a green bar while the decode is still exact and the first differing word when it
   isn't.
5. **Name and comment**, by hand or with an LLM's help, one name at a time, verify green after
   each. Names and comments are the only change; the words stay identical.
6. **Factor.** Lift a routine that recurs into a `library`, a fragment into a snippet, a family
   of near-copies into a `template` with parameters. Verify still green.

The result is a new cartridge that `extends` the binary one and replaces the tape with sources,
with `verify` in its build against the original image. The tape stays in the cartridge as the
witness. [ROADMAP §15](ROADMAP.md#15-duel-from-tape-to-source) is this, done for DUEL first;
the same panel then serves every symbol-less tape from Oslo.

**Templates** are sources with named holes and a parameter list with types and defaults. `expand`
fills them, and nothing else: no conditionals, no loops. Anything cleverer is a variant
([DESIGN.md](DESIGN.md#cartridges-and-live-coding), "Variants are copies, not ifdefs") or code
on the machine.

## 5. The cellular automata machine, as cartridges

The CAM base ([DESIGN.md](DESIGN.md#cam-on-the-pdp-7-a-cam-off)) is a cartridge: Mitch's Forth,
Don's rule compiler in Forth, the CAM-6 device. Each rule `extends` it with one file:

```yaml
id: cam-life
extends: cam6
resources:
  - { path: life.fs, kind: source, lang: forth }       # the rule, in CAM-6 Forth
  - { path: life.lut, kind: table, built: true }       # compiled by the machine, kept
  - { path: README.md, kind: doc }                     # the CelLab-style article
build:
  - { step: tape-compile, image: $parent, tape: [life.fs], type: "TAPE\r" }
  - { step: table, from: device, out: life.lut }       # read the table the Forth built
```

- **The Forth builds the lookup table** on the emulated machine, exactly as on a 1987 CAM-6.
  The `table` step reads it back out, and the cartridge saves it as a resource.
- **Save all three**: the rule's source, its compiled table, and a core image with the rule
  loaded. The source is the truth; the table and image are cached results with their hashes,
  so loading one is instant and rebuilding it proves it.
- The CAM-off's plain-assembly side is the same rule as a `template` expanded into PDP-7
  assembly: one card, two implementations, both from cartridges.

## 6. Live coding, saving, and laying eggs

Every edit in the page, of any resource, makes a **working copy**: the cartridge plus a stack
of changes, kept in IndexedDB, never lost on reload. Things that become resources the moment you
make them:

- an edited source, or a new one;
- a save file: the running Forth's Animal tree printed as source, a SYMELEC ring file, a file
  written inside UNIX;
- a recording or a demo, from the transport;
- a core image, saved from a running machine;
- a decoded and commented source (§4).

**Laying an egg** turns a working copy into a new cartridge: a child that `extends` the one it
came from, carrying only what changed, with a name, a label and who made it. It lands as a
visible object (the cabinet's menu, the rack), unhatched until it goes somewhere. This is
Screen Angel's egg ([EGGS.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/EGGS.yml)), "a promise
with a location": the pending thing is the publication, and the egg shows where that has got to
(§7). Hatching is the merge and deploy. An egg can also just be downloaded as a zip and never
hatch anywhere, and that's fine.

**Clone** is laying an egg from a cartridge without changing anything, to start from it.

## 7. Git: your own repo, a pull request, CI, deploy

A cartridge directory is plain files, so git is the store and GitHub is the sharing. The page
offers three destinations:

| Where | Who | How |
|---|---|---|
| **This browser** | anyone | IndexedDB; download and upload as a zip |
| **Your own repo** | you, with push rights | a commit straight to the branch you choose |
| **Someone else's repo** | anyone with a GitHub account | fork, branch, commit, open a pull request |

The page decides which path from the repo's permissions, not from a setting: if you can push,
it commits; if you can't, it forks and opens a PR, the same way everyone contributes to anything
on GitHub. Writing to your own repo needs nothing from this one. A cartridge loads straight
from any repo (`/cabinet/?cart=gh:you/your-carts/flowers@main`), built in your page, so your
repo is already a published cartridge library, no CI needed.

**Committing from the page.** GitHub's Git Data API writes blobs, a tree and a commit, and
moves the branch, in one round of requests; no clone. A one-file change is one commit with one
blob.

**Credentials.** A GitHub App, asking only for repository contents and pull requests, and only
on the repositories the user picks. The token is held by the ties server in the user's session
(the session cookie already exists, [auth.js](../../apps/ties/src/lib/server/auth.js)), never
in the page's storage, where any script on the page could read it. The page asks the server to
commit; the server checks the request and makes the call.

**CI.** [`pr-checks.yml`](../../.github/workflows/pr-checks.yml) already builds every app on
every PR. It gains a cartridge check, headless under Node, the way the tests already boot
programs:

- `cartridge.yml` parses against the schema, every path resolves, every kind is known or
  carried;
- every build runs, and every `verify` passes;
- a cartridge that records `expect` hashes for its outputs reproduces them, so a PR that
  claims to change only a comment can't change a word;
- size and step limits, so a PR can't make CI build forever.

The PR shows the result as a comment: what changed, the built image's hash, and a link to try
it (the PR's own branch, loaded by URL). Merging to main deploys through
[`server-deploy.sh`](../../scripts/server-deploy.sh) as now, and the cartridge appears on
hyperties.org. The egg's states are the PR's: laid, pushed, checks running, checks passed,
merged, live. Each is a GitHub event, so the egg can show it without polling a person.

**What review is for.** A cartridge can't escape the emulator, and its scripts can't run
JavaScript, so a reviewer is judging content and taste, not reading for exploits. Two things
are still checked by people: help articles (rendered markdown, sanitized like every article)
and anything that claims to be a period program, which needs its provenance said in its README.

## 8. Order of work

1. **Cartridges as files.** Move each object in `cabinet-programs.js` into
   `tapes/<id>/cartridge.yml`, with a loader that interprets the steps. Accept: every program
   boots the same, and its tests pass unchanged.
2. **Build cache.** Content-addressed, IndexedDB and Node. Accept: a second boot of FORTH
   assembles nothing.
3. **`extends`.** Accept: a one-file Forth cartridge boots with its words loaded.
4. **Working copies and eggs**, local only, with zip download and upload.
5. **Live decode** on DUEL ([ROADMAP §15](ROADMAP.md#15-duel-from-tape-to-source)), in the page.
6. **The cartridge check in CI.**
7. **GitHub**: the App, commit to your own repo, fork and PR for anyone else's, load by `gh:` URL.
8. **CAM** cartridges, once the CAM-6 device exists.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [ROADMAP](ROADMAP.md)
