# MOOCO — the flagship MOOLLM driver (deep dive)

> **Thesis:** every driver written so far (Cursor, ChatGPT, Claude Code, Antigravity) is an **advisory
> tenant** in someone else's house — it *describes* a host it does not control, and MOOLLM's guarantees
> hold only because a diligent model chooses to honor them. **mooco is different in kind, not degree.** It
> is the host. It owns the orchestration loop, so the behaviors every other driver can only *advise* become
> things mooco can *enforce, measure, optimize, and replay*. That is why mooco is the reference Tier-6
> driver, and why the capability bar it sets is the yardstick the others must virtualize, simulate, or stub.
>
> **Source:** deep read of the mounted `mooco` repo — README + `designs/` (~17k lines across 23 docs) +
> `packages/`. Verdict-tagging follows the stack's own working/partial/aspirational discipline.
> **Author:** Claude Opus, from inside the Cursor (advisory) driver, looking at what it *cannot* do.

Cross-refs: [`../driver-spec.md`](../driver-spec.md) §1 tiers, [`../driver-family.yml#children.moollm-driver-mooco`](../driver-family.yml),
[`MOOCO-CAPABILITY-BAR.yml`](MOOCO-CAPABILITY-BAR.yml), `moollm/kernel/drivers/custom.yml` (≈ the mooco contract).

**Three deep dives extend this doc** (the "whole other ball game" mechanics that make mooco the ideal MOOLLM
simulation host): [`MOOCO-COMPOSABLE-FILESYSTEM.md`](MOOCO-COMPOSABLE-FILESYSTEM.md) (hermetic multi-repo
namespace), [`MOOCO-LIVE-CONTROL-SURFACES.md`](MOOCO-LIVE-CONTROL-SURFACES.md) (files-as-API: /proc / $C000 /
NeWS magic dictionaries + mooco-mirror), [`MOOCO-SKILL-CLI-SANDBOX.md`](MOOCO-SKILL-CLI-SANDBOX.md) (sanitary
sister-script CLIs instead of raw shell).

---

## 1. What mooco actually is

- **MOO Custom Orchestrator** — an open-source LLM conversation orchestrator, a **SvelteKit app**
  (`apps/mooco/`) plus a set of `@moollm/*` packages (MIT target) it extracts for reuse. (`mooco/README.md`,
  `designs/MOOCO-ARCHITECTURE.md`.)
- **Architecturally parallel with Leela's PDA** (by Juho Hietala). mooco is a "clean-room but API-compatible"
  reimplementation of PDA's core, so shared packages flow both ways and there is a clean IP boundary
  (MIT open packages vs proprietary PDA). (`designs/MOOCO-DECISIONS.md#1`, `PDA-EXTRACTION-ANALYSIS.md`.)
- **Storage:** PostgreSQL as the spine, with native time-series + **pgvector** for analytics and semantic
  search; **SQLite** to read Cursor's mind via cursor-mirror. Git remains the single source of truth.
  (`designs/MOOCO-SCHEMA.md`, `MOOCO-MEMORY.md`.)
- **Streaming-first:** pure `AsyncGenerator<SSEEvent>` — no callbacks, no buffering; reconnection and clean
  abort are first-class. (`designs/MOOCO-STREAMING.md`, `MOOCO-DECISIONS.md#3`.)
- **Status (honest):** IN-DESIGN + a vibe-coded prototype. The design docs go **far** past the prototype —
  some hare-brained, some down-to-earth, many "won't know till we try." Phase 1 = faithful PDA reimpl;
  Phase 2 = MOOLLM extensions; Phase 3 = OSS release pending permissions. (`mooco/README.md#status`.)

The one-line difference from Cursor: **Cursor is a UI mooco can drive; mooco is a runtime the kernel owns.**

---

## 2. Why "owning the loop" changes everything

On Cursor I (the model) *am* the runtime: the resolver is a to-do list I execute by hand, the context pager
is me remembering to re-read `hot.yml`, append-only is a promise, `why` is a sentence I write in prose.
Nothing is enforced except the `.cursorrules` injection. (See [`../stack-evaluation.md`](../stack-evaluation.md).)

mooco inverts this. Because it wraps the stream, the tool executor, the persistence layer, and (in the
"in-the-middle" design) even the wire between the user and the model, it can put **real code** where Cursor
has only **model discipline**. The MOOLLM contract stops being advice and becomes architecture. That is the
"whole other ball game" — not new features bolted on, but the same features finally *load-bearing*.

---

## 3. The capabilities that set the bar

Each is native/enforced in mooco and can only be virtualized/simulated/stubbed elsewhere. Machine-readable
table in [`MOOCO-CAPABILITY-BAR.yml`](MOOCO-CAPABILITY-BAR.yml); prose here.

### 3.1 Enforced `why` on every tool call
mooco tools are Zod schemas wrapped by `withWhy(...)`, so a call **without** a reason fails validation. The
reason flows into the UI, the analytics, and the process summary. (`designs/MOOCO-TOOLS.md#the-why-convention`.)
- **Cursor:** advisory — I write intent in prose; nothing rejects a `why`-less action.
- **Bar set:** intent is a typed, required, queryable field — not a courtesy.

### 3.2 The tool gate: block / confirm / scriptify-to-sandbox
Before execution, mooco runs a **gate**. Tools declare `dangerous` / `confirmRequired`; policy hooks +
skill-containment (only skills that declare a tool in their CARD may trigger it) + a local-model snitch
decide **allow / confirm / block**. A suspicious command can be **scriptified** into an inspectable artifact
(`.mooco/pending-commands/<big-endian-id>.yml`), analyzed, edited, and **replayed in a sandbox** before it
ever runs for real. (`designs/MOOCO-IN-THE-MIDDLE.md#3`, `MOOCO-TOOLS.md`, `MOOCO-SKILL-MANAGER.md`.)
- **Cursor:** none — I call the tool and it runs. "No ghost actions" is honor-system.
- **Bar set:** this is the executable form of the command-bus / Proposal-Object pattern
  ([`../read-only-hosts.md`](../read-only-hosts.md)) applied to *every* tool, with a real sandbox.

### 3.3 Automatic ambient-skill injection
mooco is a **smart orchestrator**: it parses `CARD.yml` AMBIENT advertisements
(`score`/`condition`/`scope`/`resolution`), evaluates them against context, and injects skills into the
prompt by score until the budget is spent — the model never file-reads them. (`custom.yml#ambient_handling`.)
- **Cursor:** manual — ambient skills arrive only because they were pre-compiled into `.cursorrules`; keeping
  the *right* ones hot is my job via `hot.yml` (which Cursor does not even read).
- **Bar set:** ambient becomes a scored, dynamic, budget-aware injection engine, not a static rules file.

### 3.4 The CG — Context Gatherer / Treasure Collector (the big one)
The **CG** is mooco's k-line activation engine — the lexical *and* semantic mirror of GC: garbage collector
finds dead things to free memory; **Context Gatherer finds live things to fill attention.** Components:
Treasure Detector (scans hot k-lines), Diffuser (spreads heat along edges), Hoarder (caches associations),
Map (`K-CACHE.yml`). It learns via focus/defocus, persists heat in `K-CACHE.yml`, and uses **pgvector** for
semantic activation. A future `k-cache` skill exposes `show_heat / trace / polish / tarnish / mark_map /
diff_caches` to the model. (`designs/MOOCO-SKILL-SYSTEM.md`.)
- **Cursor:** I *simulate* k-line activation by reading files and free-associating — no heat, no learning,
  no persistence, no diffusion. Each session forgets.
- **Bar set:** k-lines go from "a naming convention I honor" to a **running, learning attention economy**.
  This single capability is why the review's "semantic image pyramid as paging" becomes real paging.

### 3.5 mooco-in-the-middle: proxy, snitch, recorder
The target architecture is **user → mooco → model/Cursor → back**. As the proxy, mooco can **intercept,
analyze, filter, and record** every message and tool call. A **free local model** (Ollama) runs a
continuous "skill snitch": a rolling mental model of which skills are in use, what they do, how they
interact, user intention, and **declared-vs-actual** diffs (CARD says `[read_file]`; stream shows
`[read_file, run_terminal]` → undeclared). Everything lands in PostgreSQL for browse/search/summarize/chain/
**playback**. (`designs/MOOCO-IN-THE-MIDDLE.md`.)
- **Cursor:** cursor-mirror can *read* the persisted SQLite after the fact and *append* via RPC, but cannot
  intercept or block on the live path. Observation only.
- **Bar set:** a governance + provenance + telemetry layer that no advisory host has. This is where "no
  ghost actions" gets teeth and where orchestration-gold training traces come from for free.

### 3.6 Three-tier memory with semantic recall
**Ephemeral** (PG conversations, preserved indefinitely) · **Persistent** (git = SSOT) · **Reflective**
(cursor-mirror + mooco-mirror). pgvector enables "how did I solve this before?" recall across sessions;
PG time-series enables session analytics. (`designs/MOOCO-MEMORY.md`.)
- **Cursor:** ephemeral memory is the chat window; reflective memory is cursor-mirror read-after-the-fact;
  no semantic cross-session recall.
- **Bar set:** memory is a queryable, embeddable, time-indexed substrate, not a scroll-back buffer.

### 3.7 The moorl namespace: resolver as real code
mooco delegates cross-repo resolution to the **moo** skill: `moollm://SimHacker/moollm/main/skills/…` URLs,
GitHub-branches-as-objects fetched via `gh api` (commands `ls/tree/read/sniff/glance/card/focus/batch-glance`),
with a cache. **MOOT** (future) reifies mounts into on-disk worktrees; **MOOFS** applies overlay resolution
`AMBIENT → ROOM → CHARACTER → LOCAL SHADOW → WORKING → UPSTREAM → BASE`. (`designs/MOOCO-REPOS.md`,
`MOOKIE.md`; public companions `moollm/designs/MOOCO-MOO-VM.md`, `MOOFS-DESIGN.md`.)
- **Cursor:** the resolver from `cursor.yml#skill_discovery` is *me* running Glob/Grep by hand; no cache,
  no overlay stack, no `moollm://` scheme.
- **Bar set:** the resolver becomes a real VM with caching and layered overlays — the behavioral spec in
  `driver-spec.md §4` finally has an implementation to conform *to*.

### 3.8 Multi-model provider abstraction (model-branching, stick-shift)
`@moollm/provider-base` abstracts providers with capability negotiation; the schema supports model-branching
(fork a conversation, compare trajectories) and stick-shift routing (switch models mid-task) as first-class,
not hacks. (`designs/MOOCO-PROVIDERS.md`, `MOOCO-SESSION-SCHEMA.md`.) This directly powers WWSFF's
`process/model-branching.yml` and `ai-offs.yml` spend-proof.
- **Cursor:** single-session, single-model from my vantage; model changes are out-of-band.
- **Bar set:** the provider is swappable and comparable under the orchestrator's control.

---

## 4. The bar, in one sentence per host

- **mooco (Tier 6):** native + enforced across all eight capabilities. The conformance oracle.
- **Claude Code (Tier 5):** can reach enforcement for 3.1–3.2, 3.6 **via an MCP server**; CG and in-the-middle
  proxy remain stubs. Cheapest path from advisory→enforced.
- **Cursor (Tier 4 hybrid):** virtualizes everything; enforces only ambient-via-`.cursorrules`. Best UI host.
- **ChatGPT / Deep Research (Tier 2–3):** simulate reading + `why`-as-prose; stub the gate, CG, memory,
  proxy. Correct role is read + **propose** into a findings queue for a writer to enact.

Full matrix in [`MOOCO-CAPABILITY-BAR.yml`](MOOCO-CAPABILITY-BAR.yml).

---

## 5. Why this is strategically right (and one caution)

**Right:** the review urged making a code-first runtime the first non-advisory driver so MOOLLM can "own
orchestration instead of pleading with someone else's UX." mooco *is* that runtime, and it is **ours** —
building the flagship on our own orchestrator (rather than binding it to a vendor SDK) keeps the leverage,
the IP boundary, and the optimization surface in-house. `custom.yml` already encodes the contract; mooco is
its implementation. Recommendation stands: **make mooco the Tier-6 reference; make Claude-Code-via-MCP and
OpenAI-Agents strong second children of the same spec.**

**Caution (no-sycophancy):** today the design docs vastly outrun the prototype (~17k lines of design; a
vibe-coded app). The risk is **spec gravity** — the capability bar becomes so tall that no other driver, and
not even mooco's own prototype, reaches it, and "enforced" stays theoretical. Mitigation: pick the **two**
capabilities with the highest advisory→enforced delta and ship them first as the proof —
**(a) enforced `why` + tool gate** and **(b) the CG heat/K-CACHE loop** — because those two are exactly the
guarantees Cursor cannot fake and the review most wants proven. Everything else can follow once the loop is
real. Sequenced in [`../roadmap.md`](../roadmap.md).

---

## 6. What other drivers should do about each capability

The honest instruction to a new driver author: **do not pretend to match mooco.** For each capability,
declare one of: `native` (host tool exists), `virtualize` (model performs the behavior by hand, documented),
`simulate` (approximate with weaker means), or `stub` (declare unsupported, degrade gracefully — robust-first).
Publish that per-capability declaration in your driver manifest's capability-negotiation table
(`driver-spec.md §6`). A driver that stubs the CG and says so is conformant; a driver that *claims* k-line
activation it does not have is not.
