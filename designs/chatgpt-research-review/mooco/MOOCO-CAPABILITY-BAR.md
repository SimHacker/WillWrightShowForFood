# The mooco capability bar — friendly edition

> Readable rendering of [`MOOCO-CAPABILITY-BAR.yml`](MOOCO-CAPABILITY-BAR.yml) (that file stays the source of
> truth). For each MOOLLM capability: what **mooco** does natively/enforced, and what each other driver must do
> to be honest about it.
>
> Companions: [`MOOCO-DRIVER-DEEP-DIVE.md`](MOOCO-DRIVER-DEEP-DIVE.md) (prose) · [`../driver-spec.md`](../driver-spec.md) (contract) · [`../driver-family.md`](../driver-family.md) (the family).

## The four honesty levels

| Level | Meaning |
|-------|---------|
| **enforced / native** | mooco guarantees it (host tool or orchestrator rule) |
| **virtualize** | the model performs the behavior by hand — documented, honor-system |
| **simulate** | approximate with weaker means (lossy) |
| **stub** | declare unsupported, degrade gracefully |

**The rule that makes the bar fair** (`driver-spec.md §6`): a driver that **stubs and says so is conformant**;
one that **claims what it lacks is not.** Stubbing is honest; pretending is the only failure.

## The matrix at a glance

| Capability | mooco | claude-code | cursor | chatgpt | deep-research |
|------------|-------|-------------|--------|---------|---------------|
| **enforced why** | enforced | native (mcp) | virtualize | virtualize | virtualize |
| **tool gate** | enforced | native (mcp) | stub | stub | stub |
| **ambient injection** | enforced | simulate | simulate | virtualize | virtualize |
| **CG treasure collector** | enforced | stub | simulate | simulate | simulate |
| **in-the-middle proxy** | enforced | stub | simulate | stub | stub |
| **three-tier memory** | enforced | simulate | simulate | simulate | stub |
| **moorl resolver** | native | virtualize | virtualize | simulate | simulate |
| **hermetic namespace** | enforced | stub | virtualize | stub | stub |
| **live control surfaces** | enforced | stub | simulate | stub | stub |
| **skill CLI sandbox** | enforced | native (mcp) | stub | stub | stub |
| **multi-model provider** | native | simulate | stub | stub | stub |
| **streaming / reconnect** | native | native | native | native | simulate |

## What each capability is (and why it matters)

- **enforced why** — every tool call carries a required, typed reason (`withWhy`); why-less calls fail.
  *Intent becomes a queryable field, not a courtesy — powers analytics + process summaries.*
- **tool gate** — pre-execution block/confirm/scriptify-to-sandbox (dangerous + skill-containment + local
  snitch). *Executable no-ghost-actions for **every** tool, with a real sandbox — the Proposal Object,
  enforced.*
- **ambient injection** — parse `CARD.yml` AMBIENT ads (score/condition/scope) and inject by score until the
  budget is spent. *Ambient becomes a dynamic, budget-aware, scored engine instead of a static rules file.*
- **CG treasure collector** — the K-line activation engine: heat detection + diffusion along edges +
  `K-CACHE.yml` persistence + focus/defocus learning + pgvector activation. **The single biggest gap.** *Turns
  "k-lines as naming convention" into a running, learning attention economy — makes the semantic image pyramid
  REAL paging.*
- **in-the-middle proxy** — user→mooco→model: intercept/analyze/filter/record every message + tool call;
  local-model snitch; declared-vs-actual diff; full record to Postgres for playback. *Governance + provenance +
  telemetry no advisory host has — and where orchestration-gold training traces come from free.*
- **three-tier memory** — Ephemeral (PG, preserved) + Persistent (git SSOT) + Reflective (cursor-mirror +
  mooco-mirror); pgvector cross-session recall. *Memory as a queryable, embeddable, time-indexed substrate —
  not a scrollback buffer.*
- **moorl resolver** — the `moo` skill: `moollm://` URLs, GitHub-branches-as-objects VM, cache; MOOT on-disk
  reification; the MOOFS overlay stack. *The resolver becomes a real cached VM with layered overlays — the
  thing `driver-spec.md §4` can conform to.*
- **hermetic namespace** — compose many repos into ONE sealed virtual FS from `(repo+ref+path+mount)` tuples;
  ref-pinned → reproducible; no host-disk leakage. "Docker mounts but better." *Reproducible, contained worlds —
  fair model-branching/AI-off eval requires every contestant to boot the SAME pinned world.* →
  [`MOOCO-COMPOSABLE-FILESYSTEM.md`](MOOCO-COMPOSABLE-FILESYSTEM.md)
- **live control surfaces** — files bound to live interfaces: READ reflects state as self-describing YAML Jazz,
  WRITE actuates the orchestrator (`/proc` + Apple ][ `$C000` soft switches + NeWS magic dictionaries). *The
  model reads its own k-line heat and steers itself by writing files; every write is a gated Proposal Object.* →
  [`MOOCO-LIVE-CONTROL-SURFACES.md`](MOOCO-LIVE-CONTROL-SURFACES.md)
- **skill CLI sandbox** — skills declare sanitary CLI APIs (sister-script: top-of-file IS the API); mooco
  exposes ONLY declared commands as scoped sandboxed tools instead of raw shell. *Makes declared-vs-actual
  auditing COMPUTABLE — you can't snitch a wildcard; you can snitch a manifest.* →
  [`MOOCO-SKILL-CLI-SANDBOX.md`](MOOCO-SKILL-CLI-SANDBOX.md)
- **multi-model provider** — provider abstraction with capability negotiation; model-branching (fork+compare)
  and stick-shift routing first-class. *Powers WWSFF `model-branching.yml` + `ai-offs.yml` spend-proof under
  orchestrator control.*
- **streaming / reconnect** — `AsyncGenerator<SSEEvent>` streaming, reconnection, clean abort, process
  grouping. *Clean multi-turn tool loop; speed-of-light multi-turn; UX.*

## Ship this first (the two-capability wedge)

1. **enforced why + tool gate** — proves no-ghost-actions has teeth.
2. **CG treasure collector** — proves the pyramid is real paging, not a reading habit.

*Rationale:* these two are exactly the guarantees Cursor **cannot** virtualize convincingly, and the ones the
review most wants proven. Everything else follows once the loop is real. → [`../roadmap.md`](../roadmap.md)

## The failure mode to avoid — spec gravity

The bar can grow so tall that neither other drivers **nor mooco's own prototype** reach it, leaving "enforced"
theoretical. The design docs (~17k lines) already outrun the vibe-coded prototype. **Counter it by shipping the
two-capability wedge as a working proof before extending the bar further.**
