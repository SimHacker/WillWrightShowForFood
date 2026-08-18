# AI-offs

> **Girder:** [`ai-offs.yml`](ai-offs.yml) · **Format:** [repo-show-format.md#rig-spectrum](repo-show-format.md#rig-spectrum) · **Rig reports:** [rig-feedback.md](rig-feedback.md) · **Scoreboard:** [showmaker-network.md](showmaker-network.md)

**Tagline:** *Declare class, report spend, live-code your thinking into git*

AI-offs are declared-class competitions — artisanal vs budget bull ride vs stick-shift model switching vs orchestrated. Score cost-to-ship **and** solution quality. Prove with Cursor spend CSV + [cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) + [thoughtful commits](https://github.com/SimHacker/moollm/tree/main/skills/thoughtful-commitment).

Flagship lane: [Manual Transmission](manual-transmission.md) — smallest model that works — multi-rubric [orchestration gold](orchestration-gold.md).

---

## On this page

| Read | In one line |
|------|-------------|
| [Game shows](#game-shows) | Code That Spec · Drag Race · Manual Transmission |
| [Spend proof](#spend-proof) | Cursor CSV — voluntary piss test |
| [Rig classes](#rig-classes) | Bull ride · stick shift · code that spec |
| [Thoughtful commits](#thoughtful-commits) | WHY in git, not just WHAT |
| [Scoreboard](#scoreboard) | Cost + quality + merge + abstraction |
| [Post-run analysis](#post-run-analysis) | Mirror + deep-snitch before harvest |
| [Navigate](#navigate) | Related specs and skills |

---

## Game shows

| Format | Spec |
|--------|------|
| **Code That Spec** | [code-that-spec.md](code-that-spec.md) — bid tokens/time; audience chants **CODE THAT SPEC!!!!!** |
| **Manual Transmission** | [manual-transmission.md](manual-transmission.md) — smallest model / fewest tokens |
| **Micropolis AI Drag Race** | [show README](../repo-shows/micropolis-ai-drag-race/README.md) · [process spec](micropolis-ai-drag-race.md) |

**Drag race opener:** *Start your engines — may the best rig werk, commit, and merge.*

**Live overlay:** [brain stream](brain-stream.md) — prompts, thinking, shifts — Manual Transmission tachometer.

---

## Spend proof

**Cursor spend CSV** — required for Manual Transmission, stick shift, and Code That Spec.

| | |
|--|--|
| **Metaphor** | Voluntary piss test — the ref that doesn't lie |
| **Proves** | Model timeline · tokens · bid honesty · shift count |
| **Full spec** | [Manual Transmission · spend CSV](manual-transmission.md#spend-csv-piss-test) |

Export Cursor usage/spending (timestamped spreadsheet or billing export). Pair with cursor-mirror session IDs for the ai-offs scoreboard — efficiency vs extravagance within class. Stick-shift competitions: the spend log shows every model switch — smooth shifts vs grinding gears.

---

## Rig classes

| Class | Play |
|-------|------|
| **budget bull ride** | One tier, tight budget, wrangle through chaos and hallucinations — *"We can't stop here — this is bat country!"* |
| **stick shift** | Multi-model — shift efficiently; cliff-road metaphor; spend log is the tachometer ([stick-shift-protocol.md](stick-shift-protocol.md)) |
| **code that spec** | Game-show bid — tokens or time; rig as Let's Make a Deal costume |

Declare honestly in [`rigs/`](../rigs/README.md) + [`rig-schema.yml`](../schemas/rig-schema.yml). Full spectrum: [repo-show-format.md#rig-spectrum](repo-show-format.md#rig-spectrum)

---

## Thoughtful commits

Also called **conscientious commits** or **thoughtful commitment**.

Live-code thought process into git commits — COMMIT with cursor-mirror-backed reasoning. Share **WHY** not just WHAT. Session linkage so others can archaeology your ai-off ride.

| Step | Action |
|------|--------|
| Mirror | `timeline` / `thinking` / `tools` / `context-sources` since last commit SHA |
| Commit | thoughtful-commitment COMMIT — narrative + `Thinking: cursor-mirror://composer/range` |
| Merge | PR merges tissue + provenance back into the organism |

**Since-last-commit** slices feed [orchestration gold](orchestration-gold.md). Grading tie-in: [homefun-grading.md](homefun-grading.md) — *Does the commit message match the thinking blocks?*

MOOLLM spreads virally as enabling substrate — cursor-mirror + thoughtful-commitment + cauldron SCOOP + `skills/` harvest. Floor wax **and** dessert topping.

---

## Scoreboard

Report on every ai-off:

- Cursor spend export + token totals
- cursor-mirror session/composer ID
- thoughtful-commitment commit SHAs
- Rig class declared (artisanal / budget bull ride / stick shift / orchestrated)

### Stick-shift judging

| | |
|--|--|
| **Smooth** | Right model for the curve — planning vs implementation vs polish |
| **Proof** | Cursor spend log timestamps + cursor-mirror timeline alignment |
| **Fail** | Premium model for yaml formatting — that's riding the clutch |

**Judges:** cost to ship · solution quality · integration (PR merge) · abstraction (`skills/` + `packages/`)

**Orchestration lab:** FUN competitive reason for real programmers to submit real multi-LLM routing traces. GitHub logs trained bug-fix models (Steve Kommrusch); our logs + thoughtful commits + cursor-mirror slices can train orchestrators. MOOLLM stack: [rubric](https://github.com/SimHacker/moollm/tree/main/skills/rubric) · [experiment](https://github.com/SimHacker/moollm/tree/main/skills/experiment) · [evaluator](https://github.com/SimHacker/moollm/tree/main/skills/evaluator) · [model branching](model-branching.md)

**Case study:** [Bun → Rust rewrite receipt](sources/bun-rust-rewrite-2026-07.md) — industrial-scale adversarial port (Jul 2026)

---

<a id="post-run-analysis"></a>

## Post-run analysis

**When:** after Manual Transmission, Code That Spec, or any ai-off run.

Analyze artifacts the chat generated — not just the merge diff. cursor-mirror reconstructs prompts, thinking, tool calls, context assembly; deep-snitch audits transcripts for secrets and sketch before anything goes public or into orchestration gold.

| Phase | Commands / outputs |
|-------|-------------------|
| **Mirror** | `timeline` · `thinking` · `tools` · `context-sources` · `stream` |
| **Snitch** | `deep-snitch` — gut-camera pass; mask secrets before harvest or brain-stream replay |
| **Harvest** | rubric SCORE forensics summary · experiment COMPARE vs bid and vs other contestants · model-branching COMPARE across forked trajectories |

Attach composer id + deep-snitch clean bill to PR. Full workflow: [Manual Transmission · post-run forensics](manual-transmission.md#post-run-forensics)

**cursor-mirror commands:**

```bash
python3 skills/cursor-mirror/scripts/cursor-mirror.py timeline <composer>
python3 skills/cursor-mirror/scripts/cursor-mirror.py thinking <composer>
python3 skills/cursor-mirror/scripts/cursor-mirror.py tools <composer>
python3 skills/cursor-mirror/scripts/cursor-mirror.py context-sources <composer>
python3 skills/cursor-mirror/scripts/cursor-mirror.py deep-snitch <composer>
```

---

## Navigate

| Destination | Why |
|-------------|-----|
| [Manual Transmission](manual-transmission.md) | Smallest model — piss test required |
| [Brain stream](brain-stream.md) | Live overlay during ai-offs |
| [Orchestration gold](orchestration-gold.md) | Training gold from real routing traces |
| [Model branching](model-branching.md) | Fork trajectories — post-run compare |
| [Drag race + ai-offs trail](cross-links.yml#drag-race-and-ai-offs) | Full game-show + proof trail (girder) |
| [Rig feedback](rig-feedback.md) | Tell us your real stack |
| [skills/INDEX.yml](../skills/INDEX.yml) | cursor-mirror, thoughtful-commitment upstream |
