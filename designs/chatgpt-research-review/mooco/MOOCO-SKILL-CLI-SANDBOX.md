# MOOCO skill CLIs — sanitary sandboxed interfaces, not the whole shell

> **Don's framing:** skills declare **sanitary, safe CLI APIs** that the LLM invokes through **limited
> sandboxed tools** instead of the whole shell. Raw shell stays available for its compositional power, but
> many skills are better served by a **strict interface to their "sister-script" CLI** that they wrap.
> This makes auditing and cursor-snitch tractable.
>
> **Author:** Claude Opus. Grounded in `moollm/skills/sister-script/` (the doc-first CLI whose top-of-file
> *is* the API), `mooco/designs/MOOCO-SKILL-MANAGER.md` (skill containment; bash blocked from skills; safe
> invocation), `MOOCO-TOOLS.md` (`why`, `dangerous`, `confirmRequired`), `MOOCO-IN-THE-MIDDLE.md` (snitch,
> declared-vs-actual, sandbox replay). **Status:** sister-script + containment = designed; mooco auto-generating
> sandboxed tools from declarations = aspirational.

Companion: [`MOOCO-LIVE-CONTROL-SURFACES.md`](MOOCO-LIVE-CONTROL-SURFACES.md) · [`../read-only-hosts.md`](../read-only-hosts.md) (Proposal Object) · [`MOOCO-CAPABILITY-BAR.yml`](MOOCO-CAPABILITY-BAR.yml)

---

## The problem with "just give it bash"

The whole shell is **ambient authority**: a skill that can `bash(...)` can do *anything* the process can —
read secrets, reach the network, delete files, escape its declared scope. The declared-vs-actual gap the
snitch worries about (`MOOCO-IN-THE-MIDDLE.md`: CARD declares `[read_file]`, stream shows `[read_file,
run_terminal]`) exists **because** the shell is a wildcard. You can't audit "did the skill stay in bounds?"
when its one tool is "run arbitrary commands."

## The fix: a skill wraps a sanitary CLI, mooco exposes only that

The pattern MOOLLM already has the pieces for:

1. **The skill wraps a sister-script CLI.** Per `skills/sister-script/`, a skill's Python CLI is written so
   the **top of the file is the API**: imports (deps), globals/enums (state shape), and the argparse/click
   subcommand definitions with help text (the contract). An LLM reads the top ~100 lines and knows the full,
   typed API without reading the implementation. *The CLI definition IS the documentation IS the interface.*
2. **The CARD declares the allowed commands.** The skill's `CARD.yml` lists exactly which subcommands are
   invokable, each with a Zod-validated arg schema and a required `why`. This is the skill's **capability
   manifest** — its sanctioned surface.
3. **mooco generates a sandboxed tool from the declaration.** Instead of exposing `bash`, the orchestrator
   exposes `skill.<command>(args)` as a tool whose schema is the declared CLI. The executor runs it in a
   **restricted sandbox**: filesystem scoped to the skill's declared paths, no network unless declared,
   resource/time limits, output captured to the trace.
4. **The LLM invokes the command, never the shell.** `roomnav.go({direction: "north", why: "..."})` —
   validated, scoped, logged — rather than `bash("python roomnav.py go north")`.

```yaml
# skills/room-navigator/CARD.yml  (excerpt — the capability manifest)
cli:
  sister_script: "roomnav.py"          # sister-script CLI this skill wraps
  sandbox:
    fs_scope: ["/worlds", ".moollm/state.yml"]   # nothing else is reachable
    network: false
    timeout_ms: 5000
  commands:                            # the ONLY invokable surface — mooco exposes exactly these
    look:
      args: {}
      why: required
    go:
      args: { direction: "enum[north,south,east,west]" }
      why: required
# A call to any non-declared command, or a shell escape, is a snitch violation.
```

## Shell isn't banned — it graduates

Raw shell keeps its place for **composition, exploration, and glue** — piping, chaining, one-off
investigation. But it's marked `dangerous`/`confirmRequired`, gated, and snitched. The trajectory is a
**graduation ladder**, which is exactly play→learn→lift:

```
procedure doc (PROCEDURE.md)        # PLAY: describe the steps
      ↓
bash glue                           # PLAY/LEARN: rough automation, full shell, gated + snitched
      ↓
sister-script CLI (EXTRACT)         # LIFT: stabilize into a typed, self-documenting CLI
      ↓
sanitary sandboxed tool             # mooco binds the CLI as a scoped, why-required tool
      ↓
audited capability                  # declared-vs-actual is now trivially checkable
```

A skill *starts* by shelling out while it's being figured out, and **hardens** into a sanitary CLI as it
matures. sister-script's `EXTRACT` method is literally the lift step; mooco's contribution is auto-binding
the extracted CLI as a sandboxed tool.

## Full shell vs sanitary CLI

| | Raw `bash` tool | Sanitary skill CLI |
|--|-----------------|--------------------|
| Authority | ambient (anything the process can do) | capability-scoped (declared commands only) |
| Arg validation | none (string) | Zod schema per command |
| Filesystem | whole disk | declared `fs_scope` only |
| Network | whatever's reachable | off unless declared |
| Auditability | must parse arbitrary command strings | tool name + typed args = self-describing |
| Snitch (declared-vs-actual) | intractable | trivial: any undeclared command is a flag |
| When to use | composition, glue, exploration | anything a skill does repeatedly / in production |

## Why this makes auditing + cursor-snitch actually work

The snitch's whole job is **declared-vs-actual**. When invocation is through typed, declared commands:

- **Declared surface is explicit** — the CARD lists the sanctioned commands; there's a ground truth to diff
  against.
- **Actual surface is legible** — the trace shows `skill.go({...})`, not an opaque shell string to reverse-
  engineer.
- **Violations are obvious** — a skill that shells out when it declared only its CLI, or touches a path
  outside `fs_scope`, is flagged immediately by `skill-snitch` / `cursor-snitch`.
- **Every invocation is reasoned + logged** — the required `why` + append-to-trace means no ghost actions,
  and the local-model snitch (`MOOCO-IN-THE-MIDDLE.md`) can annotate risk per call for free.

So the sanitary-CLI discipline isn't just safety hygiene — it's what makes the **auditing layer computable**
instead of aspirational. You can't snitch a wildcard; you can snitch a manifest.

## Relation to the tool gate and control surfaces

This is the same **Proposal Object** spine as the command bus, TicketPR, and control-surface writes
([`../read-only-hosts.md`](../read-only-hosts.md)): a skill CLI invocation is a *proposed, typed, reasoned
action* that passes the gate (allow/confirm/block/scriptify-to-sandbox) before it runs. Control-surface
writes ([`MOOCO-LIVE-CONTROL-SURFACES.md`](MOOCO-LIVE-CONTROL-SURFACES.md)) are the *filesystem* face of the
same primitive; sandboxed skill CLIs are the *tool* face. One governance model, two ergonomic surfaces.

## Honest status

- **Working/designed:** sister-script (doc-first CLI, EXTRACT/UNDERSTAND); skill-manager containment (bash
  blocked from skills, safe invocation); tool `dangerous`/`confirmRequired`/`why`; skill-snitch declared-vs-
  actual.
- **Aspirational:** mooco **auto-generating** a sandboxed tool from a CARD's `cli.commands` declaration, and
  the enforced `fs_scope`/`network`/`timeout` sandbox around it. This pairs with the enforced-`why`+gate
  wedge as the first thing to ship, because it's the concrete mechanism that gives the gate something typed
  to gate.
