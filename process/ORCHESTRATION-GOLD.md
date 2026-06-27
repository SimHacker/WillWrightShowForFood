<!-- GENERATED from `process/orchestration-gold.yml` — do not edit; run `pnpm run facades` -->
<!-- content-sha256:a2bfae8ed2b4cf82 -->

# Orchestration gold

> **Girder:** [`orchestration-gold.yml`](orchestration-gold.yml) · **Regenerate:** `pnpm run facades` · **Registry:** [`markup-facades.yml`](markup-facades.yml)

## Pitch

Manual Transmission and model-branching runs produce labeled trajectories: spec in,
model choices, tool calls, spend, merge out. Steve Kommrusch's PhD showed GitHub
commit histories are training data for repair models. We extend: commits plus
cursor-mirror forensics — and human stick-shift decisions as training BY demonstration.
As conventional and valuable to tool vendors (Cursor-class) as PBD was to UI research.

## Tagline

*Real programmers + real specs + real routing traces → multi-LLM orchestrator training*

## Meta

| Key | Value |
|-----|-------|
| **id** | orchestration-gold |
| **status** | seed |

## Human Taste Routing

- **what:** It takes human taste and experience to learn which models to shift between for
different tasks — not fully specifiable upfront. The sport captures expert routing
as labeled segments: task type, model chosen, outcome, spend — orchestration gold.
- **learned_by_doing:** Manual Transmission + Micropolis Class homefun — many drivers, many laps
- **see:** stick-shift-protocol.yml

## Training By Demonstration

- **lineage:**
  - pbd: Programming by demonstration — Brad Myers, Watch What I Do, Garnet (Don ~1992–93)
  - see: ../characters/brad-myers/ · ../repo-shows/INDEX.yml#brad-myers-garnet-vpl
- **tbd:** Training BY demonstration — harvest expert multi-model laps as supervised routing signal
### Macro Tier

- **what:** Many steps are simple syntactic transformations — the kind Don used to do with
Emacs keyboard macros over dired buffers: transform one file, next file, rinse, repeat.
- **shift_rule:** Cheap/fast model or artisanal macro pass — do not burn premium on batch syntax
- **examples:**
  - normalize filenames
  - yaml header pass
  - import reorder
  - bulk rename
  - scaffold fill
- **record_in_commit:** task_class: macro_batch — links thinking blocks to repetitive tool pattern

- **vs_design_tier:**
  - macro: Syntactic rinse-repeat — upshift to mini/fast, or hand macro
  - design: Scout problem space — premium design_mode — stick-shift-protocol.yml
  - hairpin: Reasoning bug — downshift premium
- **industry_value:** Opt-in, consented, real-programmer traces with task labels + model choices + outcomes
is as grounded and best-practice as ML data gets — valuable to Cursor-class vendors
training orchestration and routing, not just base models. Fun competition → honest logs.

## Lineage

### Steve Kommrusch

- **role:** Leela AI colleague; PhD Colorado State 2022
- **thesis:** Machine Learning for Computer Aided Programming — stochastic program repair to verifiable equivalence
- **insight:** Mined GitHub repos — before/after bug-fix commits as supervised signal (VRepair, transfer learning)
- **repos:**
  - SteveKommrusch/VRepair
  - OpenNMT-py contributions
- **see:** https://github.com/SteveKommrusch/VRepair
- **note:** Bug-fix diffs + context lines — we add orchestration context + thinking blocks

- **our_extension:** Git log tells you WHAT changed. thoughtful-commitment + cursor-mirror tell you WHY,
WHICH MODEL, WHICH TOOLS, WHAT CONTEXT was assembled — and let you ask audit questions
across dimensions since the last commit.

## Thoughtful Commitment

- **skill:** SimHacker/moollm/skills/thoughtful-commitment
- **also_called:**
  - conscientious_commits
  - thoughtful_commits
- **what:** Intentional, reflective git commits — document what the LLM actually did and thought,
not just the diff. Links commit SHA ↔ cursor-mirror composer ↔ thinking event range.
- **message_shape:**
  - type: summary (imperative)
  - narrative — intent, not mechanics only
  - changes — bullet scan list
  - Thinking: cursor-mirror://<composer>/<event-range>
- **composes:**
  - cursor-mirror
  - git
  - trekify
  - deep-snitch

## Since Last Commit

- **when:** Each thoughtful COMMIT — analyze cursor-mirror from previous commit SHA to now
- **stick_shift:** If commit equals shift point — segment is one gear commitment until prompt closure;
see stick-shift-protocol.yml#gear_commitment
- **workflow:**
  - git log -1 --format=%H — anchor
  - cursor-mirror timeline / thinking / tools / context-sources since anchor
  - cursor-mirror export-prompts — instruction tape for this slice
  - Optional: deep-snitch on slice before public harvest
### Analyze Dimensions

- **routing:**
  - models_used_and_when
  - shift_count_vs_declared_rig_class
  - spend_csv_slice
- **cognition:**
  - thinking_blocks_summary
  - user_prompts_vs_assistant_plan
  - retries_and_recovery
- **context:**
  - files_read_grep_searched
  - messageRequestContext_assembly
  - terminal_commands_run
- **artifacts:**
  - images_added — provenance audit
  - new_files_and_why
  - deleted_or_renamed_and_why
- **quality:**
  - rubric SCORE on slice vs spec CARD
  - spec_compliance_diff

### Audit Questions

- **flagship:** homefun-grading.yml#flagship_question
- **examples:**
  - Does the commit message match the thinking blocks? — Micropolis Class homefun grading
  - Why did you add that image — where did it come from?
  - Which model wrote this yaml vs this prose?
  - What file selections drove this tool call?
  - Was this retry necessary or riding the clutch?

- **output:**
  - enriched_commit_message
  - optional orchestration-gold appendix in PR or experiment run
  - anonymized aggregate for harvest

## Bundle Per Run

- **required:**
  - Cursor spend CSV
  - composer id(s)
  - thoughtful-commitment commit chain with thinking-ref links
- **recommended:**
  - cursor-mirror export-jsonl since last commit
  - model-branch manifests — model-branching.yml
  - rubric scores + experiment COMPARE report
  - deep-snitch clean bill
- **harvest:** skills/ packages/ experiment runs — opt-in, redacted

## Credits

- **steve_kommrusch:** GitHub commit logs as ML training signal — repair / equivalence research
- **mike_gallaher:** RUBRIC-BRIDGE + experiment COMPARE for multi-axis scoring
- **brad_myers:** Programming by demonstration — Watch What I Do, Garnet; TBD extends to model routing

## Ties to

| Link |
|------|
| [`manual-transmission.yml`](manual-transmission.yml) |
| [`model-branching.yml`](model-branching.yml) |
| [`ai-offs.yml`](ai-offs.yml) |
| [`brain-stream.yml`](brain-stream.yml) |
| [`homefun-grading.yml`](homefun-grading.yml) |
| [`../characters/brad-myers/`](../characters/brad-myers/) |
| [`SimHacker/moollm/skills/thoughtful-commitment`](SimHacker/moollm/skills/thoughtful-commitment) |
| [`SimHacker/moollm/skills/cursor-mirror`](SimHacker/moollm/skills/cursor-mirror) |
| [`SimHacker/moollm/skills/rubric`](SimHacker/moollm/skills/rubric) |
| [`SimHacker/moollm/skills/experiment`](SimHacker/moollm/skills/experiment) |

## Related

| Link |
|------|
| [`ai-offs.yml#post_run_analysis`](ai-offs.yml) |
| [`manual-transmission.yml#post_run_forensics`](manual-transmission.yml) |
| [`repo-show-format.yml#cauldron_scoop`](repo-show-format.yml) |
