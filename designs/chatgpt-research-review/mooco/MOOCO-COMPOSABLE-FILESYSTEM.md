# MOOCO composable filesystem — hermetic namespace from repo+ref+path+mount

> **Don's framing:** mooco is the ideal host for MOOLLM simulations because it can compose **multiple git
> repos into one tightly controlled, hermetically sealed virtual filesystem namespace** by mapping
> `(repo + ref + path + mount)` tuples — *"like docker file mounts but better."* The LLM sees one clean
> namespace; mooco controls exactly what's in it, from where, pinned to what version.
>
> **Author:** Claude Opus, grounded in the mounted design docs: `moollm/designs/MOOFS-DESIGN.md` (overlay
> layers, magic-dictionary reads), `MOOCO-MOO-VM.md` + `mooco/designs/MOOCO-REPOS.md` (moorl, moo skill,
> MOOT, workspace.json), `PROTOTYPE-FRAGMENT-CONFIG.md` (compose-time fragments).
> **Status:** moorl/moo = shipped; MOOFS overlay + MOOT reification = design; **hermetic pinning = the new ask.**

Companion: [`MOOCO-DRIVER-DEEP-DIVE.md`](MOOCO-DRIVER-DEEP-DIVE.md) §3.7 · [`MOOCO-LIVE-CONTROL-SURFACES.md`](MOOCO-LIVE-CONTROL-SURFACES.md) · [`MOOCO-CAPABILITY-BAR.yml`](MOOCO-CAPABILITY-BAR.yml)

---

## The idea in one line

> A session's filesystem is **composed, not inherited**: mooco assembles it from pinned slices of many repos,
> and the LLM sees only that composition — nothing of the host's ambient disk.

## Why "like docker mounts but better"

A docker bind mount is `host_path → container_path`: opaque, unversioned, host-coupled, all-or-nothing. A
mooco mount is a `(repo, ref, subpath) → namespace_path` binding with four things docker can't give you:

| Property | Docker bind mount | mooco mount |
|----------|-------------------|-------------|
| **Source** | a host directory | a git repo + subpath (local checkout *or* remote via moorl) |
| **Version pinning** | none (whatever's on disk now) | pinned to a **ref/commit** → hermetic + reproducible |
| **Materialization** | full host path must exist | **lazy/partial fetch** via moorl (`gh api`, no full clone) or MOOT reification |
| **Overlay semantics** | last mount wins, crudely | **MOOFS layered resolution** (top-wins / merge / prompt), GRANT/AFFLICT modes, scope |
| **Audit** | none | every resolve carries `--why`, logged to the session trace |

The "better" is the combination: **content-addressed sources + version pinning + partial fetch + layered
overlays + audited resolution.** Docker gives you isolation; mooco gives you isolation *plus provenance plus
composition semantics.*

## The three mechanisms it's built from (all real in the repos)

1. **moorl / the `moo` skill (shipped)** — the *remote* virtual filesystem: `moollm://repo/ref/path` addresses,
   GitHub branches-as-objects, `gh api` transport, partial fetch (`sniff/glance/card`), per-repo/branch/path
   cache. This is the "browser engine" for repos; no clone needed to read.
2. **MOOFS (design)** — *which layer wins*: the overlay stack
   `AMBIENT → ROOM → CHARACTER → LOCAL SHADOW → WORKING → UPSTREAM → BASE`, top-wins resolution, GRANT/AFFLICT
   mount modes, multi-repo layering (user repo over team repo over base). It reads like a normal file; the
   layering is transparent ("magic dictionary pattern" — see the live-surfaces doc).
3. **MOOT / MOOKIE (future)** — *local reification*: turn the composed namespace into real symlinks/worktrees
   on disk when an editor, compiler, or offline work needs actual files. moorl browses; MOOT materializes.

Plus **fragment compose** (`PROTOTYPE-FRAGMENT-CONFIG.md`): resolve config/session fragments at session
start so the composed namespace boots with the right ambient/room/character context already merged.

## The mount tuple (proposed schema)

```yaml
# .mooco/workspace.yml — the composition manifest (hermetic when every ref is a commit sha)
namespace:
  mounts:
    - source: { repo: "SimHacker/moollm", ref: "a1b2c3d", path: "skills" }   # ref pinned → hermetic
      target: "/skills/moollm"
      mode: ro                 # ro | rw
      layer: base              # base | upstream | working | shadow (MOOFS priority)
      scope: session           # session | room:<id> | character:<id>  (when the mount is live)
      resolution: top-wins
    - source: { repo: "SimHacker/MicropolisCore", ref: "v1.4.0", path: "apps/micropolis/worlds" }
      target: "/worlds"
      mode: ro
    - source: { repo: "file:///Users/don/skills-dev", ref: "WORKING", path: "." }
      target: "/skills/local"
      mode: rw
      layer: shadow            # local edits override everything below
  namespaces:
    $SKILLS: ["/skills/local", "/skills/moollm"]   # search order across mounts
  seal:
    hermetic: true             # refuse to resolve any path outside the declared mounts
    pin_policy: require-sha    # every ref must resolve to an immutable commit for reproducibility
```

## What "hermetically sealed" buys (the new emphasis)

This is the part beyond what's written down today, and it's the point of doing it in an orchestrator instead
of by hand:

1. **Reproducibility** — pin every mount to a commit sha and the *entire* namespace a session saw is
   reconstructable byte-for-byte later. Combined with mooco-mirror's recorded trace, a whole run **replays**.
2. **No ambient leakage** — the LLM cannot read `~/.ssh`, `/etc`, or a sibling repo it wasn't granted. The
   namespace is a whitelist of mounts, not "the host disk minus some denies." Containment by construction.
3. **Determinism for evaluation** — WWSFF's model-branching / AI-off comparisons
   (`process/model-branching.yml`, `ai-offs.yml`) are only fair if every contestant boots the *same* world;
   a hermetic pinned namespace guarantees it.
4. **Safe multi-repo composition** — pull skills from moollm, worlds from MicropolisCore, a character set from
   WWSFF, and a private overlay from the user — into one coherent tree, each pinned, each audited, no
   cross-contamination.

This is exactly the Cursor→mooco gap: on Cursor the "namespace" is *whatever multi-root workspace happens to
be open*, unpinned, host-coupled, and I resolve paths by hand. mooco makes the namespace a **declared,
pinned, sealed artifact** — the filesystem becomes as reproducible as a lockfile.

## Relation to the driver spec

`driver-spec.md §4` defines the resolver behaviorally; this doc is the *implementation shape* that resolver
conforms to when the host is mooco. Other drivers (Cursor, ChatGPT) can only **virtualize** it — I emulate a
"namespace" by remembering which roots are mounted and Glob/Grep-ing within them, with no pinning, no seal,
no overlay stack. That's the honest `virtualize`/`simulate` row in the capability bar.

## Honest status

- **Working:** moorl addressing + `moo` partial fetch + cache; `workspace.json` local repo registry.
- **Design:** MOOFS overlay resolution, GRANT/AFFLICT mounts, multi-repo layering, fragment compose.
- **Aspirational (the new ask):** the **`seal.hermetic` + `require-sha`** guarantee and MOOT on-disk
  reification. This is the piece to spec next, because it's what turns "compose repos" into "reproducible,
  contained worlds" — and reproducibility is what makes recording/replay and fair evaluation possible.
