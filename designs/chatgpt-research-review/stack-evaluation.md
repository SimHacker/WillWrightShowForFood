# Whole-stack evaluation — Opus, from inside Cursor

> Honest, technically rigorous, optimizing for insight over praise (no-ai-sycophancy). I booted this stack
> this session, read the kernel drivers, the WWSFF vision/character index, and confirmed the command bus
> exists and is tested. Verdicts are mine; the review's are cited where I extend or dispute them.

The stack = **moollm** (kernel/skills/drivers) + **MicropolisCore** (simulation substrate + command bus) +
**WillWrightShowForFood** (social membrane that turns conversation into skills). The review is right that
these are three layers of one system, not three projects. My job here is to say what is real.

---

## Working / partial / aspirational

### Working (implemented and functioning)
- **The Cursor driver + boot ritual.** I am proof: `.cursorrules` + `.mdc` reliably inject ambient
  constraints; the pyramid and resolver are followable; multi-root union works from `workspace_paths`.
- **The filesystem-object grammar.** `moollm/kernel/DIRECTORY-AS-OBJECT.md`, `CARDS-AS-OBJECTS.md`,
  `SELFISH-COM-IMPLEMENTATION.md` are real, coherent, and more legible than typical agent-framework
  registries. Plural/singular/UPPERCASE conventions hold across repos.
- **The semantic image pyramid** as a paging discipline (`.cursorrules#skill-reading-order`). It matches how
  context budget actually gets spent. Best single idea in the stack.
- **The command bus.** `MicropolisCore/apps/micropolis/src/lib/CommandBus.ts` + `.test.ts` — proposal/
  approval/preview/undo/risk as *architecture*. The clearest language↔mutation boundary anywhere here.
- **The driver manifest triad** (`generic`/`cursor`/`custom`) genuinely separates minimal, real, and
  sovereign hosts. This is what makes host-independence a credible claim rather than a slogan.
- **The skill library** — 131 skills indexed in `skills/INDEX.yml`, each with the GLANCE/CARD/SKILL/README
  pyramid. It exists and is navigable.

### Partial (structurally real but incomplete, advisory, or unenforced)
- **The resolver.** A precise spec (`cursor.yml#skill_discovery`), executed by the model by hand. No process,
  no cache, no shadow-report. Works because a careful LLM follows it — label it behavioral, not code.
- **"Inhabiting" the world.** Room physics is honor-system on every advisory host. Real, but voluntary.
- **Context paging below tier 6.** `hot.yml`/`cold.yml`/`working-set.yml` are inert notes the model must
  remember to re-read. The stack sometimes talks about them as if automatic; they are not, except in mooco.
- **No-ghost-actions provenance.** True inside the command bus; but append-only logging (its substrate) is
  faith-based on every host below tier 6 (`append` has no native Cursor tool). Provenance you can *trust*
  needs an enforced-append host.
- **WWSFF as a working show.** Format, ladder, TicketPR, one audience example (palm) all exist; no show has
  aired, so the harvest loop is proven on paper.
- **MicropolisCore↔WWSFF seam.** Documented (`kernel/moollm-plugin.yml`); the live integration is mostly design.

### Aspirational (mostly design prose / vision)
- **mooco** — the sovereign Tier-6 driver. `custom.yml` specifies the enforced contract; `skills/mooco/` is
  in-design. This is the linchpin that turns advisory into enforced, and it is not built yet.
- **MicropolisHub / federation / GitHub-as-MMORPG multiverse.** Coherent, exciting, unbuilt.
- **"One object model for everything"** (config/messaging/AI/sync/identity/deployment as one Self ontology).
  The most beautiful and most aspirational claim in the review. The command bus is a real down-payment on the
  messaging half; the rest is vision. Say so.
- **Repo-as-medium / GitCity as a civic medium.** Philosophically the strongest idea; today a framing and a
  seed repo, not a running platform. Its power is as a *pitch and a north star*, which is legitimate — just
  tag it honestly.

---

## Where I dispute or sharpen the review

1. **The review understates Cursor leakage.** It rates Cursor "high fit, low difficulty" and moves on. From
   inside, the danger is the opposite: high fit *because the kernel was shaped to Cursor*. Behaviors sold as
   universal (pyramid-never-jump, automatic hot/cold) are really "Cursor + a diligent Claude." You cannot see
   which until you boot on a non-Cursor host. The tiny reference workspace is not a nice-to-have; it is the
   only instrument that finds the hidden Cursor-shape.

2. **The real axis is enforced vs advisory, not "how much fits."** Reframing the whole driver family this way
   (see `driver-family.yml#observations`) makes the strategy obvious: move guarantees from advisory to
   enforced without losing portability. `append` is the canary column.

3. **mooco, not OpenAI Agents SDK, is the flagship first-real-driver.** The review says make OpenAI Agents the
   first non-advisory host. But the stack already has its own Tier-6 target (`custom.yml` + `skills/mooco/`).
   Binding the flagship to a vendor SDK when you are building your own orchestrator inverts the leverage.
   Make mooco the conformance oracle; make OpenAI-Agents/Claude-Code-via-MCP strong second children.

4. **The three "Proposal Objects" are one pattern.** Command (world), TicketPR (audience), Finding (analysis)
   are the same primitive: propose an inspectable object, a governed step executes it. The stack invented it
   three times without naming it once. Naming it (and sharing a schema) is cheap conceptual compression — the
   exact medicine for the "better at invention than compression" critique.

5. **`license-missing` is unverified inference, not fact.** The reviewer saw a sidebar, not a tree. Do not
   treat it as ground truth; check the working tree, then fix if truly absent. (Logged in `harvest.yml`.)

---

## Biggest risks (ranked)

1. **Onboarding debt / hidden Cursor-shape.** A new host or contributor must reconstruct too much. Mitigation:
   Driver Spec + tiny reference workspace (roadmap #1, #2).
2. **Advisory guarantees masquerading as enforced.** Anywhere the docs imply automatic paging, enforced
   append-only, or a running resolver, a reader will over-trust. Mitigation: the honesty rule in driver-spec
   §6, applied repo-wide.
3. **Projection drift (public bud ↔ private archive).** The Will status contradiction was the proof of
   concept for this failure. Now fixed, but the class remains. Mitigation: one SSOT per fact class + a verify
   check that fails on drift.
4. **Term-surface overwhelm.** Load-bearing culture, but it buries the thin kernel. Mitigation: a boring
   5-minute front door that the ideas hang off of.
5. **Comment-as-data fragility.** Facade generators / formatters can silently drop the YAML comments the
   whole system treats as binding. Mitigation: never round-trip canonical YAML through a comment-stripping
   tool; treat generated facades as read-only derivatives.

---

## Preserve at all costs

Endorsing the review's list verbatim, because it is correct:

- **files-as-state**
- **the semantic image pyramid** (as paging, not decoration)
- **room / card / character grammar**
- **the explicit driver layer** (advisory-vs-enforced is a feature, keep it honest)
- **no ghost actions** (the command bus is the crown jewel)
- **public, inspectable, branchable artifacts** (repo-as-medium)

Add one of mine: **the honesty discipline itself** — the stack's habit of tagging seed/draft/roadmap,
`invitation_status`, `working/partial/aspirational`, and "unspecified until inspected." That discipline is
what lets an outside model (me, or the read-only reviewer) trust the repo at all. It is the substrate every
other beam rests on. Do not let curb-appeal polish erode it.

---

## Bottom line

This is a **file-native civilization stack for human+AI co-development** whose best ideas are real and
whose main debt is packaging, not concept. It is worth taking seriously. The single highest-leverage move is
the one the review named and this bundle started: **a short strict Driver Spec + a tiny non-Cursor reference
workspace**, because that is what converts a beautiful Cursor-shaped world into something other minds can
actually boot. Everything else in the roadmap is downstream of proving the kernel can breathe outside its
first habitat.
