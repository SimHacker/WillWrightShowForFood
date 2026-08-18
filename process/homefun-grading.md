# Homefun grading

> **Girder:** [`homefun-grading.yml`](homefun-grading.yml) · **Format:** [repo-show-format.md#rig-spectrum](repo-show-format.md#rig-spectrum) · **AI-offs:** [ai-offs.md](ai-offs.md) · **Manual Transmission:** [manual-transmission.md](manual-transmission.md)

**Tagline:** *No homework — but as much homefun as you like. Grade the receipts.*

When Repo Show deploys to classrooms, teachers need something better than "did the code compile?"
Homefun submissions are git commits + PRs with [thoughtful-commitment](https://github.com/SimHacker/moollm/tree/main/skills/thoughtful-commitment) messages linked to [cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) thinking blocks.

**The killer audit question** — for students, ai-offs judges, and future orchestrator training:

> Does the commit message match the thinking blocks?

---

## On this page

| Read | In one line |
|------|-------------|
| [Homefun not homework](#homefun-not-homework) | Exploration + taste + show-your-work |
| [Flagship question](#flagship-question) | Narrative vs forensics alignment |
| [Rubric faces](#rubric-faces) | Primary + secondary criteria |
| [Teacher workflow](#teacher-workflow) | Assign → submit → grade → showcase |
| [Navigate](#navigate) | Related specs |

---

## Homefun not homework

**Line:** *No homework — but as much homefun as you like.*

| | |
|--|--|
| **Loop** | Do homefun → check into repo → show originators → best work discussed in later episode |
| **Show hook** | [will-wright-premiere audience homefun](../repo-shows/will-wright-premiere/README.md) |
| **vs homework** | Homework optimizes for completion. Homefun optimizes for exploration, taste, and show-your-work — with optional AI rig, declared class, and public receipts. |

---

<a id="flagship-question"></a>

## Flagship question

**Does the commit message match the thinking blocks?**

One question bridges narrative (what you claim) and forensics (what the session actually shows). Teaches intellectual honesty, catches slop and clutch-riding, scales to human teachers **and** [rubric](https://github.com/SimHacker/moollm/tree/main/skills/rubric) / [experiment](https://github.com/SimHacker/moollm/tree/main/skills/experiment) automation.

### How to answer

| Grader | Steps |
|--------|-------|
| **Human teacher** | Read commit narrative + changes · `cursor-mirror thinking <composer>` · thoughtful-commitment EXPLAIN on SHA · score: aligned / partial / mismatch / no thinking-ref |
| **Automated** | MOOLLM rubric criterion · experiment COMPARE message vs thinking summary · optional model assist — human review when grades matter |

---

## Rubric faces

**Tool:** [MOOLLM rubric skill](https://github.com/SimHacker/moollm/tree/main/skills/rubric) · **Credits:** Mike Gallaher

### Primary (high weight)

| Criterion | Levels |
|-----------|--------|
| **Commit ↔ thinking alignment** | aligned · mostly · gap · fiction |

### Secondary

- Why that file? (context-sources vs commit claims)
- Why that image — where did it come from?
- Declared rig class vs spend CSV ([piss test honesty](manual-transmission.md#spend-csv-piss-test))
- SETUP.md — can a stranger boot your rig without you?
- Stick-shift commits match gear segments ([stick-shift-protocol.md](stick-shift-protocol.md))
- Constructionist generosity — did you credit sources?

---

## Teacher workflow

| Phase | Action |
|-------|--------|
| **Assign** | Show seed CARD or homefun prompt — fork, implement on your rig |
| **Submit** | PR with thoughtful-commitment chain + optional spend CSV if ai-offs class |
| **Grade** | rubric SCORE — flagship question first · cursor-mirror since-last-commit per commit |
| **Feedback** | PR comments — constructionist, not gotcha |
| **Showcase** | Best homefun → later Repo Show segment — feedback from originator |

### Educator pillar

Logo / Snap! / BJC constructionism — microworlds, blocks, show your work. Homefun grading is **PBD for the LLM era**: the commit message is the student's story; thinking blocks are the replay. Expert stick-shift laps are training by demonstration — see [orchestration gold](orchestration-gold.md#training-by-demonstration).

**Headline guests (vision):** Brian Harvey · Jens Mönig · Walter Bender

### AI-offs as lab

Manual Transmission runs produce the same artifacts teachers grade — **sport = assessment**.

---

## Navigate

| Destination | Why |
|-------------|-----|
| [Manual Transmission](manual-transmission.md) | Competitive runs = same receipts |
| [Orchestration gold](orchestration-gold.md) | Harvest routing traces for training |
| [AI-offs](ai-offs.md) | Post-run forensics family |
| [Stick-shift protocol](stick-shift-protocol.md) | Gear = commit segments |
| [Repo Show format](repo-show-format.md) | Participation + rig culture |
| [Vision — educators](vision-and-ambition.md#who-this-is-for) | Classroom doorway |
