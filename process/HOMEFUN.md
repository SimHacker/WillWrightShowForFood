<!-- GENERATED from `process/homefun-grading.yml` — do not edit; run `pnpm run facades` -->
<!-- content-sha256:98a071c8daafd6a3 -->

# Homefun grading

> **Girder:** [`homefun-grading.yml`](homefun-grading.yml) · **Regenerate:** `pnpm run facades` · **Registry:** [`markup-facades.yml`](markup-facades.yml)

## Pitch

When Micropolis Class deploys to classrooms, teachers need something better than
'did the code compile?' Homefun submissions are git commits + PRs with
thoughtful-commitment messages linked to cursor-mirror thinking blocks. The killer
audit question — for students, ai-offs judges, and future orchestrator training:
Does the commit message match the thinking blocks?

## Tagline

*No homework — but as much homefun as you like. Grade the receipts.*

## Meta

| Key | Value |
|-----|-------|
| **id** | homefun-grading |
| **status** | seed |

## Homefun Not Homework

- **line:** No homework — but as much homefun as you like.
- **see:** ../repo-shows/will-wright/SHOW.yml#audience_homefun
- **loop:** Do homefun → check into repo → show originators → best work discussed in later episode
- **vs_homework:** Homework optimizes for completion. Homefun optimizes for exploration, taste,
and show-your-work — with optional AI rig, declared class, and public receipts.

## Flagship Question

- **text:** Does the commit message match the thinking blocks?
- **why_brilliant:** One question bridges narrative (what you claim) and forensics (what the session
actually shows). Teaches intellectual honesty, catches slop and clutch-riding,
scales to human teachers AND rubric/experiment automation.
### How To Answer

- **human_teacher:**
  - Read commit narrative + changes bullets
  - cursor-mirror thinking <composer> for linked event range
  - thoughtful-commitment EXPLAIN or ARCHAEOLOGY on commit SHA
  - Score match: aligned / partial / mismatch / no thinking-ref
- **automated:**
  - MOOLLM rubric criterion with weight
  - experiment COMPARE commit message vs thinking summary
  - Optional: model-assisted — always human review for grades that matter


## Rubric Faces

### Primary

### Commit Thinking Alignment

- **question:** Does the commit message match the thinking blocks?
- **weight:** high
- **levels:**
  - aligned
  - mostly
  - gap
  - fiction


- **secondary:**
  - Why that file? (context-sources vs commit claims)
  - Why that image — where did it come from?
  - Declared rig class vs spend CSV (piss test honesty)
  - SETUP.md — can a stranger boot your rig without you?
  - Stick-shift commits match gear segments — stick-shift-protocol.yml
  - Constructionist generosity — did you credit sources?
- **tool:** SimHacker/moollm/skills/rubric
- **credits:** Mike Gallaher

## Teacher Workflow

- **assign:** Show seed CARD or homefun prompt — fork, implement on your rig
- **submit:** PR with thoughtful-commitment chain + optional spend CSV if ai-offs class
- **grade:**
  - rubric SCORE — flagship question first
  - cursor-mirror since-last-commit per commit in PR
  - Feedback as PR comments — constructionist, not gotcha
- **showcase:** Best homefun → later Repo Show segment — feedback from originator

## Educator Pillar

- **vision:** vision-and-ambition.yml#educators
- **headline_guests:**
  - Brian Harvey
  - Jens Mönig
  - Walter Bender
- **fit:** Logo/Snap!/BJC constructionism — microworlds, blocks, show your work.
Homefun grading is PBD for the LLM era: the commit message is the student's
story; thinking blocks are the replay. Expert stick-shift laps are training BY
demonstration — see orchestration-gold.yml#training_by_demonstration

## Ai Offs As Lab

- **note:** Manual Transmission runs produce the same artifacts teachers grade — sport = assessment
- **see:**
  - manual-transmission.yml
  - orchestration-gold.yml
  - stick-shift-protocol.yml

## Student Artifact

### Minimum

- PR or branch
- at least one thoughtful commit with Thinking: cursor-mirror:// ref

- **optional:**
  - rigs/*.rig.yml declared class
  - rigs/*.SETUP.md — reproduce + mod guide
  - Cursor spend CSV for stick-shift class
  - homefun README in branch

## Ties to

| Link |
|------|
| [`orchestration-gold.yml#audit_questions`](orchestration-gold.yml) |
| [`orchestration-gold.yml#since_last_commit`](orchestration-gold.yml) |
| [`../repo-shows/will-wright/SHOW.yml`](../repo-shows/will-wright/SHOW.yml) |
| [`vision-and-ambition.yml`](vision-and-ambition.yml) |
| [`repo-show-format.yml`](repo-show-format.yml) |
| [`SimHacker/moollm/skills/thoughtful-commitment`](SimHacker/moollm/skills/thoughtful-commitment) |
| [`SimHacker/moollm/skills/rubric`](SimHacker/moollm/skills/rubric) |
| [`SimHacker/moollm/skills/evaluator`](SimHacker/moollm/skills/evaluator) |

## Related

| Link |
|------|
| [`manual-transmission.yml`](manual-transmission.yml) |
| [`ai-offs.yml`](ai-offs.yml) |
