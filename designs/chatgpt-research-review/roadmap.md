# Roadmap — highest-leverage next steps for cross-platform adoption

> Prioritized for one goal: **make MOOLLM bootable by minds that are not Cursor + a diligent Claude.**
> Ordered by leverage. Each item names the deliverable, why it matters, effort, and where it lives (honoring
> the about-not-inside placement rule). Derived from the review's Phase-7 roadmap + `harvest.yml#critical` +
> `stack-evaluation.md`, deduplicated and sequenced.

Effort: S (hours) · M (days) · L (weeks+).

---

## 1. Publish the Driver Spec  ·  S–M  ·  home: `moollm/kernel/drivers/SPEC.md`
The review's #1 recommendation and the root of everything else. A short, strict, conformance-oriented
contract: canonical ops, boot order, resolver, paging, ambient handling, capability negotiation, and the
enforced-vs-advisory honesty rule. **First draft already exists** as [`driver-spec.md`](driver-spec.md) in
this bundle — harden it and promote it upstream. Without this, every new host is a bespoke prompt hack.

## 2. Build the tiny reference workspace ("hello world")  ·  M  ·  home: `moollm/examples/minimal-driver-conformance/`
One repo, three skills, one room, one character, one GLANCE/CARD/SKILL, one driver manifest, one boot trace,
one replay script that asserts the [conformance checklist](driver-spec.md#conformance-checklist). **Boot it
on a non-Cursor host** (Claude Code, Gemini CLI, or a plain API loop). This is the only instrument that
exposes the hidden Cursor-shape (`stack-evaluation.md` risk #1). Highest diagnostic value per hour.

## 3. Make the first advisory→enforced driver via MCP  ·  M  ·  home: `moollm/` + a small MCP server
Build the `moollm-kernel` MCP server sketched in `claude-code.yml`: tools with real `why`, enforced
append-only, structured event logging. This moves the `append` canary column from `emulated` to `native`
without owning a whole orchestrator. Cheapest path from advisory to enforced; unblocks trustworthy
provenance. (`driver-family.yml#observations.first_driver_to_build_next`.)

## 4. Name and schematize the Proposal Object  ·  S  ·  home: `moollm/skills/` (+ `schemas/`)
Command (world) + TicketPR (audience) + Finding (analysis) are one pattern invented three times. Define it
once — a shared schema with `status: proposed → accepted | rejected | acted` and an evidence/why/confidence
core — and have the command bus, TicketPR, and the read-only findings queue all cite it. Pure conceptual
compression; directly answers the "better at invention than compression" critique.

## 5. Ship the read-only findings queue + one worked example  ·  S  ·  home: `moollm/skills/moollm-driver/` + a demo
Add the `findings/` convention to the Driver Spec (see [`read-only-hosts.md`](read-only-hosts.md)) and prove
it end-to-end: take three real findings from this review (`license-missing`, resolver-is-behavioral,
reference-workspace-missing), write them as `.finding.yml`, have a Cursor session verify + act on one, and
capture the trace. Turns read-only hosts (the majority) into contributors.

## 6. Canonical schema bundle + validation  ·  M  ·  home: `moollm/schemas/` (WWSFF consumes, doesn't duplicate)
Publish machine-checkable schemas for `CARD.yml`, `GLANCE.yml`, `ROOM.yml`, `CHARACTER.yml`, `SHOW.yml`,
driver manifests, and the Proposal Object; wire them into `pnpm verify`. **Do this once at the kernel level**
— the review recommended it separately for kernel and for WWSFF; consolidate. Prevents YAML drift as content
scales and gives outside hosts something to validate against mechanically.

## 7. Status hygiene: one SSOT per fact class + drift check  ·  S  ·  home: WWSFF + `moollm`
The Will contradiction (now fixed) proved projection drift is a real failure class. Make
`characters/INDEX.yml` the acknowledged SSOT for guest status (it already is de facto), and add a verify step
that fails when a facade/README disagrees with its girder. Extend the same discipline to MicropolisCore's
current-vs-federation docs with a `working/partial/aspirational` label at the doc-tree level.

## 8. Verify the LICENSE gap, then fix if real  ·  S  ·  home: WWSFF root
The review's "highest-priority fix" is an unverified inference from a sidebar. **Check the working tree
first.** If a LICENSE is genuinely absent, add one — it is cheap and unblocks outside contribution/reuse.
If present, correct the review's finding. Do not act on the inference blind.

## 9. A boring 5-minute front door  ·  S  ·  home: `moollm/` root
A single short page: "MOOLLM in 5 minutes, no Cursor romance, no adventure world" — what it is, the pyramid,
how to boot, where the kernel ends and the demo world begins. Separates the thin kernel from the giant skill
library and the show culture. Directly attacks onboarding debt (`stack-evaluation.md` risk #1, #4).

## 10. Extend the guest ladder to code contributors  ·  S  ·  home: WWSFF `process/`
The review asked for a CONTRIBUTING + contributor ladder. One largely exists —
`process/guest-participation-ladder.yml` (tiers 0–5). Extend it to code/AI contributors rather than
inventing a parallel structure. Reuse, don't duplicate.

---

## Sequencing

```
1 Driver Spec ──▶ 2 Reference workspace ──▶ 3 MCP enforced driver ──▶ (mooco Tier-6)
      │                    │
      ├──▶ 4 Proposal Object ──▶ 5 Findings queue
      └──▶ 6 Schema bundle ──▶ 7 Status hygiene / drift check
   (parallel, low-risk, anytime): 8 LICENSE verify · 9 Front door · 10 Contributor ladder
```

**If you do only three things:** #1 (Driver Spec), #2 (reference workspace), #9 (5-minute front door). Those
three convert "a beautiful Cursor-shaped world" into "a thing another mind can boot." Everything else
compounds on top.

---

## Placement decision (the review's open question)

Where should the real driver skill live — kernel or WWSFF designs? Applying MOOLLM's **about-not-inside**
rule (a thing lives where it is *about*, mirrored in WWSFF `characters/INDEX.yml#meta.rule`):

- **The normative contract** (`driver-spec.md`) is *about the kernel* → **`moollm/kernel/drivers/SPEC.md`**.
- **The instantiable prototype** (`moollm-driver` + per-host children, Self-style delegation) is *about being
  a reusable skill* → **`moollm/skills/moollm-driver/`** (`CARD.yml` + `SKILL.md`, children
  `moollm-driver-{cursor,chatgpt,claude-code,mooco,…}`).
- **The analysis/harvest** (this whole bundle) is *about reviewing a specific document* → stays in
  **`WillWrightShowForFood/designs/chatgpt-research-review/`**.

Recommendation: keep `driver-spec.md` and `driver-family.yml` here as the reviewed design proposal; once Don
blesses them, **promote hardened copies to `moollm/`** and leave back-links here. Letting the normative
contract live permanently inside a show repo would violate the exact placement rule the stack teaches — the
driver spec is kernel business, not show business.
