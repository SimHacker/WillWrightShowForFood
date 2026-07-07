# The 2002 NSF proposal — digest

*Digest of Lall, Garvin & Smyth's NSF Engineering Education proposal, "Attracting and Retaining
Undergraduates to Engineer the Built Environment through Instructional & Technological Innovation"
(Columbia CEEM + EEE + CCNMTL). Written December 2001 – January 2002 (doc metadata: author Upmanu
Lall). Full originals preserved in [`../media/`](../media/): the 15-page project description, the
one-page project summary, and the summary's Word original.*

## What it proposed

**OPTIMUS** — the Open Platform for Teaching Integrated Modeling and Urban Simulation — as the
centerpiece of a rebuilt four-year Civil & Environmental Engineering curriculum: case-study courses
from freshman year ("Urban Systems Engineering" using **New York City** as the case), a
systems-approach spine, and an open, extensible city simulator as the shared laboratory. Prototype
alpha targeted for late fall 2003. PIs: **Upmanu Lall, Michael Garvin, Andrew Smyth**; pedagogical
lead **Peter Sommer** (CCNMTL, with the Brownfield Action and Heart Simulator teams).

## Don and David are in it

The consulting team is named on pages 6, 12, and 15:

> "Don Hopkins … has enthusiastically agreed to work as a consultant to help us design and
> implement an open courseware system that can meet the challenge. Don has collaborated extensively
> with Will Wright, the designer of SimCity, and David Levitt, the creator of the visual programming
> language Bounce, who has also plans to assist Don in this project."

> "The collaboration with Hopkins and Levitt, who have extensive experience in developing and
> implementing new programming languages and constructs and specifically in building Cellular
> Automata based simulators … holds promise for a breakthrough in developing an open system for
> virtual reality explorations in engineering education."

> "Prior to initiating full-scale development activities, the consulting team led by Hopkins will
> conduct a programming orientation…"

And the blocker-plus-solution, stated together:

> "SimCity lacks the open architecture to add modules and extract state variables. However, Hopkins
> has demonstrated how to make this game extensible to a multi-player, multi-platform setting, and
> to make the state variables accessible."

## The pedagogy, already running in 2002

They weren't speculating — they had already taught with it:

- **SimEarth** in an introductory Earth Science class: students altered CO₂ sources and sinks,
  ran parametric and sensitivity experiments, and "researched the literature to scientifically
  explain what they were observing… The student response was overwhelmingly positive."
- **SimCity** in the freshman *Earth Resources and the Environment* class: "Students make choices
  between infrastructure elements, and systematically analyze changes in growth, resource demands,
  and pollution in space and time. **Data abstracted from the simulations is analyzed offline to
  introduce basic statistical and model fitting concepts.**" — the data-lab / spreadsheet method,
  verbatim, in 2002.

## Quotable design requirements

- "The creation of silicon surrogates of real-world complex systems allows us, teachers and
  students, to perform **controlled, repeatable experiments**."
- Simulators need a "**LEGO like ability** to add features and change representations" and to
  "zoom into the function of a facility (e.g., water treatment plant)."
- "Students will develop and **add functional modules to the system using a high-level programming
  language**" — students as contributors, not just players.
- Multiple roles: "student teams to come in as a city public works engineer, a water systems
  manager etc." — multiplayer as pedagogy.
- Cellular automata as the teaching formalism: PDE flow models "are readily recast as CA models,
  enabling the instructor to start introducing these concepts early."
- Explicitly **constructivist**: "Simulations are a prime example of constructivist conceptions of
  learning…" — with evidence cited that simulation-and-discussion formats better retain **women
  and underrepresented students** than lecture-based teaching.
- Linked scenario engines: FEMA's **HAZUS** earthquake-loss model coupled to the city sim
  (Prof. George Deodatis's New York scenario); Sacramento flooding as the flood case.
- **K-12 outreach**: OPTIMUS for high schools in **Harlem and the Bronx**, and for the
  **Salvadori Center**'s built-environment K-12 programs.

## Why this matters now

Every requirement in this proposal is either shipped or on the roadmap of MicropolisCore + MOOLLM:
open architecture, extractable state, addable modules in a high-level language, multiple roles,
CA pedagogy, data-first analysis, classroom scenarios. The 2002 proposal reads as a specification
that took twenty-four years to become buildable — written by the professor, with Don already
signed on.
