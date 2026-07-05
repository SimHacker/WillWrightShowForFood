# MOOLLM Driver Specification (draft v0.1)

> **Status:** draft proposal, written from inside the Cursor driver by Claude Opus.
> **Intended home:** `moollm/kernel/drivers/SPEC.md` (see [Placement](#placement)). It lives here first
> as a design artifact of the ChatGPT-review harvest; promote it upstream once Don blesses it.
>
> **Purpose:** the review's #1 recommendation — *"publish a Driver Spec dramatically shorter and stricter
> than the current distributed explanation."* This is that spec: short, strict, conformance-oriented. It
> defines what any host must do to claim it "runs MOOLLM," and cleanly separates **MUST / SHOULD / MAY**
> and **enforced vs advisory**.

Keywords **MUST / SHOULD / MAY** follow RFC 2119. A conforming driver is one that passes the
[conformance checklist](#conformance-checklist) at its declared tier.

---

## 0. What a driver is (and is not)

A driver is a **thin adaptation layer** between the portable MOOLLM kernel and one host platform. It maps
the host's real tools onto MOOLLM's canonical operations, declares which kernel behaviors it can **enforce**
vs merely **advise**, and defines the boot ritual for that host.

A driver is **not**: the kernel, a skill library, or a prompt bundle. Existing manifests
(`moollm/kernel/drivers/{generic,cursor,claude-code,custom,antigravity}.yml`) are **instances** of this
spec written in YAML; this document is the **contract** they should conform to.

Critical honesty rule (learned first-person): a driver manifest **describes** a host; on advisory hosts it
is **not executed by the host**. Cursor never parses `cursor.yml`. The manifest is read by the *model*, and
compliance is voluntary. A spec that pretends otherwise will mislead every new host author. So the spec
below labels every requirement as **enforced-if-possible** or **advisory-by-nature**.

---

## 1. Capability tiers

Every driver declares a tier. Tier sets expectations, not privileges.

| Tier | Name | Defining capability | Example |
|------|------|---------------------|---------|
| 1 | Minimal | No guaranteed tools; conversation only | `generic.yml` |
| 2 | Read | File read + search, no reliable write | Deep Research, Ask-mode |
| 3 | Scripted | Read/write + a runtime (Python/browser), weak workspace model | ChatGPT apps |
| 4 | Workspace | Read/write/search/terminal + multi-root, tools have no `why` | Cursor, Copilot, Antigravity |
| 5 | Extensible | Tier 4 + custom tools via MCP | Claude Code |
| 6 | Sovereign | Kernel owns orchestration; `why`/append-only/ambient **enforced** | `custom.yml`, mooco |

A driver MUST NOT claim a tier whose defining capability it cannot demonstrate.

---

## 2. Canonical operations

The kernel speaks in **canonical ops**. A driver MUST map each to a host tool or declare it **advisory**
(simulated in-band, e.g. by asking the user, or by read+write emulation). The op set (adopted from the
review's synthesis, with `append` promoted to first-class):

| Op | Meaning | MUST for tier | Cursor mapping (first-person) |
|----|---------|---------------|-------------------------------|
| `read(path, range?)` | Read file / range | ≥2 | `read_file_v2` — native |
| `search.text(query, glob?)` | Lexical search | ≥2 | `ripgrep_raw_search` — native |
| `search.semantic(query)` | Meaning search | SHOULD | `SemanticSearch` — native (needs indexing 100%) |
| `list(path)` | Enumerate a room | ≥2 | `list_dir` — native |
| `write(path, content)` | Create/replace | ≥3 | `write` — native |
| `patch(path, edit)` | Structured edit | ≥4 | `edit_file_v2` — native |
| `append(path, text)` | **Append-only** add | ≥4 | ⚠️ **no native tool** — emulated read+write; append-only is honor-system |
| `run(cmd, cwd?)` | Execute | ≥4 | `run_terminal_command_v2` — native |
| `summarize(paths, into)` | Compress w/o losing truth | SHOULD | advisory — I do it in-band, write to `.moollm/summaries/` |
| `log(event, why)` | Intent/event log | SHOULD | advisory — append to `.moollm/session-log.md` by convention |

The `append` row is the canonical example of a **capability gap**: the op is required at tier 4 but Cursor
has no atomic append, so append-only logs are convention, not enforcement. Drivers MUST surface such gaps
explicitly (see §6). Do not silently pretend the guarantee holds.

Every op SHOULD carry a `why`. On tier ≤5 hosts `why` is **advisory** (documented in the response/thinking);
only tier 6 MAY **enforce** it (reject calls lacking `why`, per `custom.yml`).

---

## 3. Boot order (MUST)

A conforming boot is deterministic and idempotent:

1. **Detect** the host (system-prompt + tool signatures; see each manifest's `detection:` block).
2. **Load** the matching driver manifest (or `generic.yml` fallback).
3. **Read the ambient constraints** the host injects unconditionally. On Cursor this is
   `.cursorrules` + `.cursor/rules/*.mdc` (forced by the host — the one genuinely enforced hook).
4. **Read `.moollm/hot.yml`** (session priorities) if present; else seed from
   `skills/bootstrap/templates/hot.yml`.
5. **Read `skills/INDEX.yml`** (skill registry).
6. **Probe** the environment (mounted roots, indexing status), write `.moollm/bootstrap-probe.yml`.
7. **Ensure scratch files** exist (`output.md`, `session-log.md`, `working-set.yml`) at the driver's
   `session_root`.
8. **Announce** driver name + tier + advisory/enforced summary before acting.

Steps 3–5 are the **minimum viable boot**. A host that cannot do step 3 (no forced ambient injection)
degrades to tier 1 and MUST tell the user its constraints are unenforceable.

---

## 4. Resolver algorithm (MUST for tier ≥2 with multi-root)

For any bare-name reference (`inherits: [x]`, `see: x`), resolve in this order (from `cursor.yml`, now
normative for all drivers):

1. **Local tree-walk** outward from the referring dir: at each level test
   `is_skill_like(dir/skills/name)` then self-match `basename(dir)==name && is_skill_like(dir)`.
2. **Mounted-root union**: for each mounted workspace root, test `<root>/skills/<name>/`.
   Ordering: referring repo first (closest wins), then stable order, **`moollm/` last** (fallback library).
3. **Shadowing**: first match wins (lexical scope).
4. **Not found**: WARN, do not crash (robust-first); emit a one-line notice naming the repo the caller
   should mount. MUST NOT hallucinate the skill's contents.

`is_skill_like(dir)` ≡ dir has `SKILL.md` **or** `CARD.yml` **or** lives under a `skills/` parent
(duck-typing). CARD.yml alone is dispatchable.

**Conformance reality:** on advisory hosts there is no resolver *process* — the model executes this by
issuing search calls. The spec is therefore a **behavioral contract on the model**, and the conformance
test (§7) checks the *behavior*, not a code path.

---

## 5. Context paging (SHOULD)

- Honor the **semantic image pyramid**: prefer GLANCE → CARD → SKILL → README; do not open a lower level
  before the one above **as a default** (it is a strong default, not an invariant — a driver MAY jump when
  the task demands and SHOULD note it).
- Maintain advisory `hot.yml` / `cold.yml` / `working-set.yml`. On tier ≤5 these are **notes the model
  writes to itself and must re-read** — they are NOT loaded by the host. A driver MUST NOT claim automatic
  hot/cold management below tier 6.
- Tier 6 MAY implement real paging (parse `CARD.yml` AMBIENT advertisements, inject by score until budget;
  see `custom.yml#ambient_handling`).

---

## 6. Ambient skills & capability negotiation (MUST declare)

- A driver MUST declare `ambient_handling.mode`: `automatic` (host injects ambient skills — tier 6) or
  `manual` (model must keep them in context itself — tier ≤5).
- **Cursor nuance the reviewer missed:** Cursor is nominally `manual` (`cursor.yml`), but ambient skills
  *are* effectively auto-injected via compiled `.cursor/rules/*.mdc` in `.cursorrules`. So Cursor is a
  **hybrid**: ambient constraints enforced through the rules file; everything else advisory. A driver
  SHOULD document such partial enforcement honestly rather than pick one label.
- **Capability negotiation:** at boot a driver MUST publish, in one place, a table of
  `{op | enforced | advisory | unsupported}` so downstream skills and read-only producers know what will
  actually happen. This is the contract other tools (and other drivers) rely on. See `driver-family.yml`.

---

## 7. Conformance checklist

A driver at tier N conforms if it:

- [ ] declares `name`, `tier`, and a detection block;
- [ ] maps every canonical op required at tier N, or marks it advisory/unsupported with a fallback;
- [ ] performs the §3 boot order (or documents which steps degrade and why);
- [ ] implements the §4 resolver behavior for multi-root hosts, including WARN-don't-crash on miss;
- [ ] publishes a capability-negotiation table (§6);
- [ ] states, per behavior, **enforced vs advisory** — and never claims enforcement it cannot deliver;
- [ ] honors **no-ghost-actions**: any world mutation (esp. via MicropolisCore) goes through an
      inspectable command object, not a silent side effect. This is a **MUST** at every tier that can write.

A **minimal conformance fixture** (the review's "hello world"): one repo, three skills, one room, one
character, one GLANCE, one CARD, one SKILL, one driver manifest, one boot trace, one script that replays the
boot and asserts the checklist. Building it is the fastest way to discover which "universal" behaviors are
secretly Cursor-shaped. Tracked in [`roadmap.md`](roadmap.md).

---

## Placement

Per MOOLLM's **about-not-inside** rule (a thing lives where it is *about*, mirrored in WWSFF's own
`characters/INDEX.yml#meta.rule`: shows reference rather than hoard), this spec is **about the kernel driver
contract** — so its canonical home is **`moollm/kernel/drivers/SPEC.md`**, with `README.md` there linking to
it. The per-platform instances already sit in `moollm/kernel/drivers/*.yml`.

The **instantiable `moollm-driver` prototype** (a skill you clone per host, Self-style) belongs in
**`moollm/skills/moollm-driver/`** — `CARD.yml` advertising the ops, `SKILL.md` teaching the boot ritual,
with `moollm-driver-cursor`, `-chatgpt`, `-claude-code`, `-mooco` as prototype-delegation children.

Only the **analysis/harvest** (this bundle) belongs in `WillWrightShowForFood/designs/`. Recommendation:
keep `driver-spec.md` + `driver-family.yml` here as the design proposal, then promote a hardened copy to
`moollm/` once reviewed. Do not let the normative contract live permanently inside a show repo — that would
violate the very placement rule the stack teaches.
