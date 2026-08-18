# Bun Zig→Rust rewrite — ingested receipts (Jul 2026)

**Flagged by Don** as super interesting and related. Three public artifacts, one industrial-scale
AI orchestration case study, one language-creator counter-post, one hour of commentary that splits
neatly into "learn from this" and "don't do this."

| Source | URL | Role |
|--------|-----|------|
| Jarred Sumner — *Rewriting Bun in Rust* | https://bun.com/blog/bun-in-rust | Primary receipt — how the port worked |
| Andrew Kelley — *My Thoughts on the Bun Rust Rewrite* | https://andrewkelley.me/post/my-thoughts-bun-rust-rewrite.html | Zig creator response — relationship + critique |
| Theo - t3.gg — *Well this really p\*ssed me off* | https://www.youtube.com/watch?v=kAjNWanR3n8 | Commentary — methodology praise + Kelley pushback |

Machine index: [`bun-rust-rewrite-2026-07.yml`](bun-rust-rewrite-2026-07.yml)

---

## Why this belongs in the Repo Show

This is not a language-war curiosity. It is the first public **orchestration-gold** bundle at
production scale: labeled workflows, adversarial review lanes, a language-independent test oracle,
spend receipts, and a human supervisor who fixes **the loop** when agents misbehave — not just the
diff. Our house formats already describe this shape:

- **Manual Transmission** — smallest model / fewest tokens that ships the spec; prove with spend
- **Orchestration gold** — labeled trajectories for training orchestrators, not just base models
- **Adversarial committee** (Mike Gallaher → MOOLLM skill) — implementer + reviewers, split context
- **Repo Wars** `translation-arena` — same spec, many languages, judges score craft
- **OpenLaszlo reunion** — smaller parallel: AI revives a dead toolchain, making-of is the content
- **Human control & authorship** — AI proposes; people dispose; Drew Carey's 2023 lesson on personality

Bun is the stress test. OpenLaszlo is the sympathetic scale model.

---

## What Jarred did (the receipt)

**Scale:** ~535K lines of Zig → Rust. **11 days** (May 3–14, 2026). **~6,778 commits**. Peak **64
Claude instances** across **~50 dynamic workflows**. **~$165K** at API pricing (5.9B uncached input
tokens, 690M output, 72B cached reads). Counterfactual: three engineers with full codebase context
for ~a year — during which bugfixes, security, and features freeze. Jarred's framing: the realistic
alternative was **not** a year-long human rewrite; it was **keep patching memory bugs forever**.

**Strategy:** Mechanical port, not idiomatic rewrite — same architecture, same TypeScript test suite,
minimal behavioral change. Prep before code:

1. **PORTING.md** — Zig→Rust pattern map (hours of design talk serialized)
2. **LIFETIMES.tsv** — per-field lifetime analysis with adversarial review on the guide itself
3. **Trial run** — 3 `.zig` files, full implementer + 2 reviewer + fixer loop, before 1,448 files

**Core loop** (oversimplified):

```js
while (task = todoList.pop()) {
  result = implementer(task);
  feedback = await Promise.all([reviewerA(result), reviewerB(result)]);
  await fixer(feedback, result);
}
```

**Adversarial review rules:**

- **Split context windows** — implementer never reviews; reviewers never implement
- **1 implementer : 2+ adversarial reviewers** per task
- Reviewer's only job: find bugs and reasons the code cannot work
- When loops misbehave (git stash wars, stub-out-to-compile, paragraph-long workaround comments):
  **edit the workflow prompt**, don't hand-patch thousands of files

**Oracle:** Bun's TypeScript test suite — **~1.4M `expect()` calls**, 57–60K tests, 4,173+ files —
does not depend on the runtime language. CI burndown: 972 failing test files → 23 → green Linux →
all platforms. **19 known regressions**, all fixed (mostly Zig/Rust semantic twins: `assert` vs
`debug_assert!`, bounds checks, etc.).

**Post-merge hardening:** 11 rounds Claude Code Security review; 24/7 coverage-guided fuzzing on
every parser; **~4% `unsafe`** (78% single-line C/C++ interop). Claims: 128 bugs still reproducible
in last Zig release fixed; memory leak class reduced; ~20% smaller binaries; 2–5% faster.

**Theo addendum:** Multi-**model-family** reviewers (e.g. Codex + Claude) beat multiple Claudes —
stick-shift discipline applied to review lanes, not just implementation.

---

## What Andrew Kelley said (the counter-post)

Kelley's post is **not** a technical teardown of Rust vs Zig. It is a **relationship autopsy** with
technical asides — and he later edited the conclusion to admit unprocessed resentment leaked through.

**Relationship thread:**

- Characterizes Jarred as "beginner energy" from ~5 years ago — fast, learning-heavy, mediocre
  engineering outcomes early
- VC/Oven shift: grapevine reports of poor management, unrealistic expectations, grind culture
- Zig Software Foundation increasingly saw Bun as **net liability** before RoboBun (AI contributor)
- **Rooted for Rust rewrite** — relief at distance from Bun's engineering reputation and AI-slop
  influx into Zig communities
- $60K/year donation to ZSF stopped after Anthropic acquisition

**Technical counter-claims:**

- False dichotomy: style guide enforcement vs language features — **bugs are eliminated by
  engineering time** (TigerBeetle cited as counterexample)
- If test suite is sufficient for 1M lines of unreviewed Rust, why so many Zig bugs?
- LTO available in Zig; fuzzing claims inconsistent with what Bun team reportedly said on calls
- Binary-size section = engineering that should have happened in Zig years ago
- Omitted compile-speed comparison (Zig ~16s clean build for ~600K LOC)

**Kelley's reframed conclusion (edited):** Main issue = diverging value systems and relationship
breakdown, not Zig vs Rust features. Apologizes to Zig users scared an ex-user getting "trashed"
by the language creator might happen to them.

---

## What Theo did with it (the pedagogy)

**Part 1 — the useful half:** Treat Jarred's blog as a landmark document for **loop engineering** at
scale. Highlights: derisk before spend (PORTING.md, 3-file trial), compiler errors as work queue,
cgroups for hostile integration tests, fix-the-process discipline, cost framing as
**$165K vs never happening** not vs $600K human-year. Predicts the post will be cited for years as
the start of a shift.

**Part 2 — the crash-out:** Kelley's post damages Zig more than the rewrite damages Bun. Calls out:

- Personal attacks dressed as business analysis ("stinky manager," "beginner," "groomed by Thiel")
- **Test taxonomy lesson** — unit tests verify behavior; they do not replace borrow-checker / ASAN /
  leak-class guarantees for long-running servers
- Edited post still opens badly; "not personal" disclaimer contradicted by volume of personal lines
- Theo (JavaScript creator) more qualified on memory-safety testing than Zig's creator — damning

Theo knows Jarred personally; corroborates grind culture and imperfect management while defending
transparency and the rewrite decision. Tone: friend defending friend + educator for audience.

---

## Repo Show segment map

| Beat | Format | Hook |
|------|--------|------|
| **Score the run** | Manual Transmission / ai-offs | Fantasy spend CSV + rubric axes: cost, oracle quality, adversarial ratio, merge confidence |
| **Committee port** | Mike Gallaher adversarial-committee | Live micro port: 1 implementer, 2 personas, split context — MOOLLM skill demos itself |
| **Translation arena** | Repo Wars | Contestants declare rigs; Zig→Rust or Rust→Zig micro-spec; Slats judges aesthetics |
| **Sympathetic scale** | OpenLaszlo show | David Temkin's smaller AI revival — same resurrection grammar, human scale |
| **Personality rule** | Drew Carey contrast | AI as backstage crew + orchestrator, not synthetic host — audience already rejected clone-Drew |
| **Reviewer stick-shift** | stick-shift-protocol | Same task, different model families in reviewer lanes — Theo's upgrade to Bun's pattern |

---

## Doctrine connections (why Don flagged it)

**Lean into training / humansplaining:** Rust and Zig live in weights; a mechanical port works
because the **target language is prepaid** in the model. Invented DSLs in prompts are humansplaining
tax. Bun's PORTING.md is a human-authored compression layer — cream on top of latent Rust/Zig.

**Fix the loop, not the slop:** Jarred edits workflow prompts when Claudes stub functions or write
justify-paragraph comments. Same ethic as MOOLLM orchestrator: AI proposes; people dispose of bad
**process**.

**Receipts or it didn't happen:** Test suite green + security rounds + fuzzing + canary + public
token bill. Our orchestration-gold bundle wants exactly this shape for smaller runs.

---

## Open questions (good on-air)

1. Is mechanical AI port + test oracle **enough** for merge confidence at 1M lines — or only when
   the oracle is pathologically good (Bun's 1.4M expects)?
2. When does adversarial review become **performance** (64 Claudes) vs **discipline** (2 reviewers)?
3. Kelley's relationship post: fair warning to Zig users, or creator punching down at exit velocity?
4. Does multi-model reviewer stick-shift belong in our Manual Transmission rubric by default?

↑ [sources index](README.md) · [orchestration-gold](../orchestration-gold.yml) · [repo-wars](../repo-wars.yml) · [OpenLaszlo](../../repo-shows/openlaszlo/README.md)
