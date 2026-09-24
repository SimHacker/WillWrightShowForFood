# CARS 2027: interface to agency, medical leg

Plan for two things that share one argument: Part 7 of the essay
[Interface to agency](https://github.com/SimHacker/moollm/blob/main/designs/INTERFACE-TO-AGENCY.md),
and Don's presentation and demonstration at CARS 2027 in Berlin.

## The session

| | |
|---|---|
| Theme | "HCI and Modelling -- where we come from and may be going to" (joint IFCARS project, CARS 2027 through 2030) |
| Session | "IA and AI: pearls and pitfalls", CARS 2027 Berlin |
| Date | 29 June 2027, the special HCI session; 60 years after Heinz's first PIXIE lecture at the Cambridge Mathematical Laboratory |
| Asked of Don | A presentation and demonstration |
| Planning loop | Heinz Lemke, Roy Eagleson and his students, Mario Cypko, Leo Joskowicz; Franziska Schweikert for CARS logistics |
| After | 2.5-day IFCARS Think Tank meeting, autumn 2028, Black Forest |

Sources: [3 Aug proposal](sources/2026-08-03-cars-2027-hci-modelling-cooperation.md) ·
[13–14 Aug Think Tank thread](sources/2026-08-13-cars-2027-hci-modelling-think-tank.md) ·
[Roy's reply](../roy-eagleson/sources/2026-08-13-think-tank-reply.md) ·
[Leo's reply](../leo-joskowicz/sources/2026-08-14-think-tank-reply.md) ·
[Mario](../mario-cypko/)

Not yet known: whether a paper is expected, its length, the proceedings (IJCARS supplement or
other), the submission deadline, and whether the session includes a panel.

## Why medicine

The essay's cases so far are a game, a butterfly, a bike and a coffeeshop register. In each, a
wrong agent action is cheap to recover from. In a hospital it can harm a patient, so every claim
in the essay has to hold there or be restated.

Heinz's framing already carries the argument. CARS started in 1985 saying medical work stations
would depend on "MODELLING and MAN-COMPUTER INTERACTION techniques". His "Good" future is a
PIXIE III: graph models you can see and poke, with a Model Identity Certificate for the AI models
behind them. Leo's reply names the problem from the other side: the bottleneck of AI is now the
human, and AI promotes a false sense of understanding.

## Part 7 outline

Working title: **The high-stakes case: medicine**. Each section extends an earlier part and needs a
real case from someone who works in the field. No case gets invented to fill a section.

### 1. Where it comes from

PIXIE on the Cambridge PDP-7 (1969), then the 1979 TU Berlin report *A Network of Medical Work
Stations for Integrated Word and Picture Communication in Clinical Medicine*, derived from the
Cambridge Ring and republished by SIIM in 2003 as a PACS anniversary article, then PIXIE II (MMVR
2014: MEBN graphs and screen representations of patient models, on Dave Warner's ANTz). Virtually
all hospitals now run PACS, and, as Heinz notes, its origins are mostly forgotten.

- Extends: the front page and [The Sims](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-sims.md) (pie menus).
- Needs: Heinz's check of the dates and the Cambridge Ring connection.

### 2. The same verbs

No agent-only verbs. When an AI marks a nodule, flags a study, reorders a worklist or drafts an
order, the result is the same kind of object a clinician makes with the same menu: editable,
signed, attributed. What the agent intends to do next sits in a queue the clinician can see and
cancel before it runs, as the Sims queue does.

- Extends: [The Sims](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-sims.md).
- Needs: one current clinical tool where AI output is a different kind of object from human
  output, and what that costs in practice.

### 3. What cannot be undone

No agent can pedal the bike, and no agent makes the incision or gives the dose. The ride cannot be
undone but its interpretation can; the procedure cannot be undone but the report, the model and
the plan can. The line between the two decides what an agent may do alone.

- Extends: [Ebike Safari](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/ebike-safari.md).
- Needs: Leo on computer-aided orthopaedic surgery, which steps surgeons kept and why ("how to be
  very precisely wrong").

### 4. The model is a file

The patient model as something clinicians read, compare and fork. Mario's Bayesian networks for
head and neck oncology are already this kind of model. The Model Identity Certificate is the file's
provenance record. A tumour board or heart team compares treatments by discussion; a copy of the
model run on each option would put the comparison on screen, where members can inspect it.

- Extends: [The state is a file](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-state-is-a-file.md) ("Agents you can copy").
- Needs: Mario on who may change a clinical model today, how a change is reviewed, and what his
  LLM-guided knowledge modelling does when a clinician disagrees with it.

### 5. The layer that clicks

Software already drives hospital screens it did not write: PACS viewers, record systems, order
entry. An agent operating those screens is Screen Angel in a clinic. The keylogger problem from
Part 4 becomes patient privacy; every click the layer makes has to be visible and logged as the
agent's.

- Extends: [Screen Angel](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/screen-angel.md).
- Needs: whether anyone in the Think Tank has seen agents or automation driving clinical screens,
  and how it was audited.

### 6. What medicine already has

Medicine has institutions the essay's other domains lack: informed consent, the second opinion,
morbidity and mortality review, and a chart corrected by signed addendum, never erased. The
essay's rule that claims accumulate and are resolved at read time is how a chart already works.
This section says medicine had these first and asks what each looks like when one party is an
agent.

- Extends: [The state is a file](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/the-state-is-a-file.md) and [Ebike Safari](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/ebike-safari.md) (the exposure log).
- Needs: the clinicians' view of which of these already covers AI and which does not.

### 7. The human bottleneck

Leo's point closes the part. If reading capacity is fixed, an interface has to let a clinician
check what the agent did faster than redoing it: see the queue, poke the model, diff the change.
Where it cannot, the agent should not act. Roy's symbolic-AI pendulum fits here: an inspectable
model is easier to check than an opaque one.

- Extends: the front page claim.
- Needs: Leo's permission to quote his reply in the public essay; Roy's likewise.

## Questions for Heinz, Roy, Leo and Mario

For Heinz:
- Is a paper expected alongside the presentation, and in what format and by what date?
- Is there a panel in the session, and who is on it?
- May the essay quote your 13 August framing of PIXIE III and the Model Identity Certificate?

For Mario:
- In the laryngeal and head and neck oncology networks, who could change the model, and how was a
  change reviewed?
- In LLM-guided knowledge modelling with human oversight, what happens when the clinician and the
  model disagree?
- What did the Virtual Heart Team show about several people working one model?

For Leo:
- Which steps in computer-aided orthopaedic surgery did surgeons refuse to hand over?
- May the essay quote your 14 August reply?

For Roy:
- Would the students' PIXIE re-implementation be shown in the same session?
- May the essay quote your 13 August reply?

To route through Heinz to the wider Think Tank (Dirk Wilhelm, Kevin Cleary, Krishna Kandarpa,
Leonard Berliner, Hugo Herrero Antón, Akinobu Shimizu, Carlos Amato): one case each where an
automated step was hard to see or hard to stop.

## Demonstration candidates

- [PIXIE live](https://hyperties.org/databases/playground/pixie-live/) on the emulated PDP-7: where we come from.
- A small patient-model graph with pie-menu actions that the clinician and the agent share: the
  same verbs, the visible queue, fork and diff. A sketch toward PIXIE III, built only after
  Mario's answers show what the model should contain.
- The student PIXIE re-implementation, if Roy's group finishes it.

## Rules for this work

- No clinical case, number or quote enters the essay unless its source gave it and agreed to
  publication.
- Private correspondence stays in the DonHopkins repo; this file cites only the public digests.
- The essay part is written after the answers arrive; this file is the plan and the questions.

↑ [Heinz Lemke](README.md) · [ideas](ideas.md) · [correspondence](correspondence.yml)
