# Orchestration gold

> **Girder:** [`orchestration-gold.yml`](orchestration-gold.yml) · **AI-offs:** [ai-offs.md](ai-offs.md) · **Homefun:** [homefun-grading.md](homefun-grading.md) · **Manual Transmission:** [manual-transmission.md](manual-transmission.md)

**Tagline:** *Real programmers + real specs + real routing traces → multi-LLM orchestrator training*

Manual Transmission and [model branching](model-branching.md) runs produce labeled trajectories: spec in, model choices, tool calls, spend, merge out. Steve Kommrusch's PhD showed GitHub commit histories are training data for repair models. We extend: commits plus cursor-mirror forensics — and human stick-shift decisions as **training BY demonstration**. As conventional and valuable to tool vendors (Cursor-class) as PBD was to UI research.

---

## On this page

| Read | In one line |
|------|-------------|
| [Human taste routing](#human-taste-routing) | Expert shifts captured as labeled segments |
| [Training by demonstration](#training-by-demonstration) | PBD → TBD for model routing |
| [Since last commit](#since-last-commit) | Forensics slice per thoughtful COMMIT |
| [Bundle per run](#bundle-per-run) | What to submit for harvest |
| [Navigate](#navigate) | Related specs |

---

## Human taste routing

It takes human taste and experience to learn which models to shift between for different tasks — not fully specifiable upfront. The sport captures expert routing as labeled segments: task type, model chosen, outcome, spend — **orchestration gold**.

**Learned by doing:** [Manual Transmission](manual-transmission.md) + Repo Show homefun — many drivers, many laps.

See: [stick-shift-protocol.md](stick-shift-protocol.md)

---

<a id="training-by-demonstration"></a>

## Training by demonstration

| | |
|--|--|
| **PBD lineage** | Programming by demonstration — [Brad Myers](../characters/brad-myers/), Watch What I Do, Garnet (Don ~1992–93) |
| **TBD extension** | **Training BY demonstration** — harvest expert multi-model laps as supervised routing signal |

### Macro vs design tier

| Tier | When | Shift rule |
|------|------|------------|
| **Macro batch** | Syntactic rinse-repeat — normalize filenames, yaml headers, import reorder, scaffold fill | Cheap/fast model or artisanal macro pass — don't burn premium on batch syntax |
| **Design** | Scout problem space | Premium `design_mode` — [stick-shift-protocol.md](stick-shift-protocol.md) |
| **Hairpin** | Reasoning bug | Downshift premium |

Record in commit: `task_class: macro_batch` — links thinking blocks to repetitive tool pattern.

**Industry value:** Opt-in, consented, real-programmer traces with task labels + model choices + outcomes — valuable to Cursor-class vendors training orchestration and routing, not just base models. Fun competition → honest logs.

### Steve Kommrusch lineage

| | |
|--|--|
| **Role** | Leela AI colleague; PhD Colorado State 2022 |
| **Thesis** | Machine Learning for Computer Aided Programming — stochastic program repair to verifiable equivalence |
| **Insight** | Mined GitHub repos — before/after bug-fix commits as supervised signal ([VRepair](https://github.com/SteveKommrusch/VRepair)) |
| **Our extension** | Git log tells you WHAT changed. thoughtful-commitment + cursor-mirror tell you WHY, WHICH MODEL, WHICH TOOLS, WHAT CONTEXT — audit questions across dimensions since last commit |

---

<a id="since-last-commit"></a>

## Since last commit

**When:** each thoughtful COMMIT — analyze cursor-mirror from previous commit SHA to now.

| Step | Command / output |
|------|------------------|
| Anchor | `git log -1 --format=%H` |
| Mirror | timeline · thinking · tools · context-sources since anchor |
| Export | `cursor-mirror export-prompts` — instruction tape for slice |
| Snitch | optional deep-snitch before public harvest |

**Stick-shift rule:** if commit equals shift point — segment is one gear commitment until prompt closure ([stick-shift-protocol.md#gear-commitment](stick-shift-protocol.md)).

### Analyze dimensions

| Dimension | Inspect |
|-----------|---------|
| **Routing** | models used and when · shift count vs declared class · spend CSV slice |
| **Cognition** | thinking blocks summary · user prompts vs assistant plan · retries |
| **Context** | files read/grep · messageRequestContext assembly · terminal commands |
| **Artifacts** | images added — provenance · new/deleted files and why |
| **Quality** | rubric SCORE vs spec CARD · spec compliance diff |

### Audit questions

- **Flagship:** [Does the commit message match the thinking blocks?](homefun-grading.md#flagship-question)
- Why did you add that image — where did it come from?
- Which model wrote this yaml vs this prose?
- What file selections drove this tool call?
- Was this retry necessary or riding the clutch?

**Output:** enriched commit message · optional orchestration-gold appendix in PR · anonymized aggregate for harvest

---

## Bundle per run

| Required | Recommended |
|----------|-------------|
| Cursor spend CSV | cursor-mirror export-jsonl since last commit |
| composer id(s) | model-branch manifests ([model-branching.md](model-branching.md)) |
| thoughtful-commitment commit chain with thinking-ref links | rubric scores + experiment COMPARE report |
| | deep-snitch clean bill |

**Harvest:** `skills/` · `packages/` · experiment runs — opt-in, redacted

**Case study:** [Bun → Rust rewrite receipt](sources/bun-rust-rewrite-2026-07.md) — industrial-scale adversarial port (Jul 2026)

---

## Navigate

| Destination | Why |
|-------------|-----|
| [Manual Transmission](manual-transmission.md) | Primary competition lane |
| [AI-offs post-run analysis](ai-offs.md#post-run-analysis) | Forensics workflow |
| [Homefun grading](homefun-grading.md) | Flagship audit question |
| [Brain stream](brain-stream.md) | Live bus during runs |
| [Repo Show harvest](repo-show-format.md#harvest) | cauldron SCOOP |
| [thoughtful-commitment skill](https://github.com/SimHacker/moollm/tree/main/skills/thoughtful-commitment) | Commit shape |
| [cursor-mirror skill](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) | Session archaeology |

**Credits:** Steve Kommrusch (GitHub logs as ML signal) · Mike Gallaher (rubric + experiment) · Brad Myers (PBD lineage)
