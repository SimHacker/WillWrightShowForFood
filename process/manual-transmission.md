# Manual Transmission

> **Girder:** [`manual-transmission.yml`](manual-transmission.yml) · **Format:** [repo-show-format.md#game-show-formats](repo-show-format.md#game-show-formats) · **Overlay:** [brain-stream.md](brain-stream.md) · **Harvest:** [orchestration-gold.md](orchestration-gold.md)

**Tagline:** *What's the smallest model — or fewest tokens — you can code the spec with?*

Real programmers, real tools, real models, real specs — a FUN reason to document how you orchestrate LLMs. Submit your Cursor spend CSV like a piss test: voluntary, verified, the ref that doesn't lie. We are facilitating circumstances that collect invaluable data for training models to orchestrate multiple LLMs. This shit is GOLD.

**Contest prompt:** same spec CARD for everyone. Compete on as many dimensions as you dare — measurable and subjective — at the same time. Like a Rubik's cube: many faces, one solve, twist any axis you want to optimize.

---

## On this page

| Read | In one line |
|------|-------------|
| [How a round works](#how-a-round-works) | Bid → ship branch → multi-rubric score → merge or sashay |
| [Spend CSV piss test](#spend-csv-piss-test) | Voluntary proof — spreadsheet doesn't lie |
| [Rig classes](#rig-classes) | Artisanal to orchestrated — declare, don't exclude |
| [Scoring](#scoring) | Rubric + experiment + Slats + spreadsheet |
| [Judges](#judges) | Slats werk · MOOLLM rubric · human taste · CSV ref |
| [Post-run forensics](#post-run-forensics) | deep-snitch before public harvest |
| [Navigate](#navigate) | Related formats and skills |

---

## How a round works

**Duration:** 5–10 min mini slot or full [Micropolis AI Drag Race](../repo-shows/micropolis-ai-drag-race/README.md) rotation.

| Step | What |
|------|------|
| 1 | Drop spec CARD — same for everyone |
| 2 | Declare bids — model tier + token budget + rig class |
| 3 | Start engines — audience chants **CODE THAT SPEC!!!!!** |
| 4 | Ship branch — merge-ready PR |
| 5 | Multi-rubric score — many faces at once |
| 6 | Merge or sashay |
| 7 | Post-run forensics — before publishing artifacts |

**Overlay** ([brain stream](brain-stream.md)): current prompt · model badge · cost ticker · shift events · GitHub attachment links.

**Bid examples:**

- *I can code that spec on Composer Fast — 50k tokens, zero shifts.*
- *GPT-5 Mini scaffold, one Opus hairpin for the schema — 120k total.*
- *Zero tokens — artisanal only; my model is a mechanical pencil.*
- *Bull ride: one mini, four retries, still under 80k — hold my chaps.*

---

## Spend CSV piss test

Submitting your Cursor spend export is like taking a piss test — **voluntary proof**.

| Proves | How |
|--------|-----|
| Model tier timeline | Spend breakdown timestamps |
| Token totals | CSV aggregates |
| Bid honesty | Bid vs actual — misbid and the audience is the ref |
| Shift count | Gear changes on the tachometer |
| Cost to ship | Tokens + dollars + wall-clock |

See [AI-offs · cursor-mirror](ai-offs.md) for forensics workflow.

---

## Rig classes

Same track — declare class; compete fair within it.

| Class | Play |
|-------|------|
| **artisanal** | Zero tokens — smallest model is you |
| **single gear mini** | One cheap/fast model, no shifts — purity play |
| **stick shift** | Every shift = commit; runbooks span many prompts ([stick-shift-protocol.md](stick-shift-protocol.md)) |
| **bull ride** | One tier through hallucination hairpins — retries are costume |
| **orchestrated** | Many models + MCP — judged on efficiency per complexity, not raw spend |

Full rig spectrum: [repo-show-format.md#rig-spectrum](repo-show-format.md#rig-spectrum)

---

## Scoring

**Engine:** MOOLLM [rubric](https://github.com/SimHacker/moollm/tree/main/skills/rubric) SCORE + [experiment](https://github.com/SimHacker/moollm/tree/main/skills/experiment) COMPARE — many criteria at once.

### Measurable (high weight)

| Criterion | Proof |
|-----------|-------|
| Cost to ship | Cursor spend CSV |
| Smallest model used | Spend breakdown on merge commit |
| Bid honesty | Bid vs CSV |
| Spec compliance | Diff vs CARD + automated lint |
| Merge harvest | PR merged; skills/packages graft bonus |

### Measurable (medium weight)

Shift smoothness · wall-clock vs bid

### Subjective

Eleganza · shift feel · narration · replication · brain-stream aesthetics — [Slats](../characters/robots/slats/) judges camp and werk.

**Credits:** [Mike Gallaher](https://github.com/SimHacker/moollm/blob/main/designs/mike-gallaher-ideas.md) — rubric, experiment lineage, adversarial committee, evaluator.

---

## Judges

| Judge | Role |
|-------|------|
| **[Slats](../characters/robots/slats/)** | Celebrity robot judge — subjective Rubik faces; camp, robopoetry, werk |
| **Rubric + experiment** | MOOLLM SCORE + COMPARE — many axes at once |
| **Human** | Taste, constructionist generosity, merge-worthiness |
| **Spreadsheet** | Cursor spend CSV — the piss test; the ref that doesn't lie |

---

## Post-run forensics

**When:** after the run — before publishing artifacts or harvesting to `skills/`.

The chat generated code, yaml, commits, transcripts. Run [cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) to archaeology the session; run deep-snitch to audit what left the building. Forensics feed rubric SCORE, experiment COMPARE, and [orchestration gold](orchestration-gold.md) — with secrets stripped.

| Step | Command / artifact |
|------|-------------------|
| Timeline | `cursor-mirror timeline <composer>` |
| Thinking | `cursor-mirror thinking <composer>` |
| Tools | `cursor-mirror tools <composer>` |
| Context | `cursor-mirror context-sources <composer>` |
| Gut camera | `cursor-mirror deep-snitch <composer>` |
| Attach | Forensics summary to PR / rig report / experiment run config |

Full spec: [AI-offs post-run analysis](ai-offs.md)

**Required artifacts for orchestration gold:**

- Cursor spend CSV
- cursor-mirror composer timeline + since-last-commit slice
- thoughtful-commitment commit chain
- `rigs/*.rig.yml` declared shift map
- Optional brain-stream event log
- Post-run deep-snitch clean bill before public export

---

## Navigate

| Destination | Why |
|-------------|-----|
| [Code That Spec](code-that-spec.md) | Bid tokens/time — audience chants |
| [Micropolis AI Drag Race](../repo-shows/micropolis-ai-drag-race/README.md) | Flagship drag-race show |
| [AI-offs](ai-offs.md) | Competitive forensics family |
| [Orchestration gold](orchestration-gold.md) | Labeled trajectories for training |
| [Model branching](model-branching.md) | Fork worlds at any bubble |
| [Brain stream](brain-stream.md) | Live overlay bus |
| [ShowMaker network](showmaker-network.md) | Competitions index |
| [Repo Show format](repo-show-format.md) | Participation + rig culture |
