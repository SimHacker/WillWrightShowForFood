# MOOCO live control surfaces — the filesystem is the API

> **Don's framing:** mooco's `mooco-mirror` goes far past `cursor-mirror` — *deeper, higher-fidelity,
> real-time, reflective, self-describing magic YAML files* like **Apple ][ `$C000` I/O memory**, **NeWS magic
> dictionaries**, and **Linux `/proc`**. The LLM sees files; it *talks to the orchestrator by reading and
> writing YAML Jazz files* into the control surfaces and objects of the filesystem. **Any file may be bound
> to a control interface.** Mount a skill on a directory or file, and it comes to life — efficiently.
>
> **Author:** Claude Opus. Grounded in `MOOFS-DESIGN.md` (which already names the *NeWS magic dictionary
> pattern* explicitly), `MOOCO-MEMORY.md` (mooco-mirror), `MOOCO-SKILL-SYSTEM.md` (K-CACHE), and Don's
> first-hand NeWS lineage. **Status:** cursor-mirror is the working ancestor; live read/write control surfaces
> are aspirational.

Companion: [`MOOCO-COMPOSABLE-FILESYSTEM.md`](MOOCO-COMPOSABLE-FILESYSTEM.md) · [`MOOCO-SKILL-CLI-SANDBOX.md`](MOOCO-SKILL-CLI-SANDBOX.md) · [`MOOCO-DRIVER-DEEP-DIVE.md`](MOOCO-DRIVER-DEEP-DIVE.md)

---

## The core move

An LLM's entire I/O vocabulary is **read a file / write a file**. So don't bolt a separate control API onto
mooco — **make the filesystem itself the control surface.** A "file" need not be storage; it can be *bound to
a live interface*:

- **Reading** a magic file → mooco computes and returns current state as self-describing **YAML Jazz**
  (reflection).
- **Writing** a magic file → mooco parses the YAML and *actuates* — mounts a repo, switches a model, warms a
  k-line, approves a queued command (actuation).

The file is a **handle to a device or object**, not a blob on disk. This is the oldest good idea in systems
programming, applied to the LLM's only interface.

## The three precedents (each precise, each load-bearing)

| Precedent | What it is | What mooco borrows |
|-----------|-----------|--------------------|
| **Apple ][ `$C000`–`$C0FF` soft switches** | Memory-mapped I/O: reading/writing those addresses doesn't touch RAM — it toggles hardware (keyboard strobe, speaker click, graphics mode). *The address **is** the device.* | A path **is** a device. Reading/writing it actuates the orchestrator, not disk. |
| **NeWS magic dictionaries** | In NeWS (PostScript window system) certain dictionaries were "magic": `get`/`put` on a key ran code or reflected live system state instead of static storage. (Don worked on NeWS — first-hand.) | A file's read/write are **computed** (get/set hooks), and reads are self-describing. |
| **Linux `/proc`** | A synthetic filesystem: `/proc/<pid>/status` is generated live on read; writing `/proc/sys/...` changes kernel parameters. The files don't exist on disk. | A whole `/proc`-like tree that reflects the **microworld's** live state and accepts control writes. |

The unification (this is the insight): in all three, **the name is bound to a live interface, not to
bytes.** MOOFS already implements the read side of this — its "magic dictionary pattern" resolves a file
through the overlay stack transparently. mooco generalizes it to the **write** side and to **arbitrary
bound interfaces.**

## mooco-mirror vs cursor-mirror

`cursor-mirror` reads Cursor's *persisted* SQLite **after the fact** — a snapshot you poll (see
`mooco/designs/MOOCO-IN-THE-MIDDLE.md`: "each call is a snapshot; there is no built-in push"). `mooco-mirror`
is different in kind because mooco owns the runtime:

| | cursor-mirror | mooco-mirror |
|--|---------------|--------------|
| Fidelity | what Cursor chose to persist | full session: parts, thinking, tool I/O, k-line heat, mounts |
| Timing | poll SQLite after write | live (Postgres LISTEN / in-process) |
| Direction | read-only reflection | **read reflects, write steers** |
| Self-describing | external schema (KEY-CATALOG) | each surface documents its own schema in YAML Jazz comments |

So mooco-mirror isn't just "read the log" — it's the **reflective self-image** of a running mind that the
mind itself can read to see its own state and write to change it.

## What the control tree might look like

```yaml
# Reading .mooco/proc/session/HEAT.yml  → live k-line heat (reflection; generated on read)
# self-describing header tells the LLM what this surface is and how to write it:
# CONTROL-SURFACE: k-cache heat map. READ: current heat. WRITE: {polish|tarnish: <edge>, why: <reason>}.
hot:   [ {edge: "command-bus↔safety", weight: 0.94}, {edge: "repo-as-medium↔mcluhan", weight: 0.71} ]
warm:  [ {edge: "mooco↔driver", weight: 0.38} ]
budget: { used: 6200, max: 8000 }
```

```yaml
# Writing .mooco/control/model.yml  → actuates a model switch (the LLM steers itself)
set:  "claude-opus-4-8-thinking-high"
why:  "Task shifted from search to synthesis; want the deeper model."
```

```yaml
# Reading .mooco/proc/tools/pending/  → the tool-gate queue (see MOOCO-SKILL-CLI-SANDBOX.md)
# Writing .mooco/proc/tools/pending/<id>.yml with {decision: approve, why: ...} → resolves the gate
```

```yaml
# Writing .mooco/control/mounts/NEW.yml → composes a repo into the namespace (see composable-filesystem doc)
source: { repo: "SimHacker/moollm", ref: "a1b2c3d", path: "skills/adventure" }
target: "/skills/adventure"
why: "Need the adventure skill for this room."
```

## "Mount a skill on a file/dir and it comes to life"

Mounting **binds a skill's control interface to a path.** After
`MOUNT k-cache ON .mooco/proc/session/` :

- reading a file under that path invokes the skill's **reflect** method (renders live state as YAML);
- writing a file there invokes its **actuate** method (validated, why-required, gated).

It's **efficient** because the binding is *lazy and demand-driven*, not polled: nothing computes until the
LLM reads or writes the bound path. This is MOOFS mount semantics
(`skills/mount`, GRANT/AFFLICT, room/character/ambient scope) extended from "overlay content" to "bind a live
control interface." The directory listing under a mount **is the advertisement** of what you can read/write
there — the yaml-jazz "directories as advertisements" principle, made executable.

## Safety: a control-surface write is a Proposal Object

Writing a magic file is not a side-channel around governance — it flows through the *same* discipline as any
tool call (see [`../read-only-hosts.md`](../read-only-hosts.md) and [`MOOCO-SKILL-CLI-SANDBOX.md`](MOOCO-SKILL-CLI-SANDBOX.md)):

- every actuating write carries a **`why`**;
- it hits the **tool gate** (allow / confirm / block / scriptify-to-sandbox) if the bound interface is
  dangerous;
- it appends to the session trace (mooco-mirror records it) so there are **no ghost actions**, even via the
  filesystem.

The magic is powerful precisely because it's *uniform*: read to see, write to steer, and every steer is an
inspectable, reasoned, logged proposal.

## Why this is a "whole other ball game"

On Cursor I *describe* what I want in prose and hope the loop honors it; I can't read my own k-line heat
(there isn't any) or approve a queued command by writing a file (there's no queue). mooco makes the model's
**introspection and control** first-class filesystem objects. The LLM stops being a guest that asks the host
to do things and becomes an **inhabitant that reads and rewrites the room it's standing in** — which is
exactly the MOOLLM thesis (files-as-state, repo-as-world) taken to its literal conclusion.

## Honest status

- **Working ancestor:** cursor-mirror (read persisted state); MOOFS magic-dictionary *read* resolution.
- **Aspirational:** the live *write*/actuate side, the `/proc`-like reflective tree, skill-bound control
  interfaces, and mooco-mirror's real-time self-image. Sequence it *after* the enforced `why`+gate wedge
  (`MOOCO-CAPABILITY-BAR.yml#ship_first`), because every control-surface write depends on that gate to be safe.
