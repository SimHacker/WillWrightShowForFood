# OPTIMUS, 2002 → 2026: the NSF Project Summary, annotated

*The complete text of the one-page **Project Summary** from Upmanu Lall, Michael Garvin & Andrew
Smyth's 2002 NSF Engineering Education proposal, "Attracting and Retaining Undergraduates to
Engineer the Built Environment through Instructional & Technological Innovation" (Columbia
CEEM + EEE + CCNMTL) — with annotations mapping each idea to what **exists today** or is
**on the roadmap** in [MicropolisCore](https://github.com/SimHacker/MicropolisCore),
[MOOLLM](https://github.com/SimHacker/moollm), and the
[Will Wright Show](https://github.com/SimHacker/WillWrightShowForFood).*

*Original PDFs preserved in [`../media/`](../media/); the full 15-page proposal is digested in
[`nsf-2002-proposal-digest.md`](nsf-2002-proposal-digest.md). Legend: ✅ exists · 🚧 planned/in
progress.*

---

## Why civil & environmental engineering needed this

> The disciplines of Civil and Environmental Engineering (CEE) play a critical role in the
> development and maintenance of physical infrastructure and hence in any strategy for improving
> planetary habitability and sustainable use of resources. The breadth of topics covered by these
> disciplines and the need to understand their interactions in a physical, chemical, ecological,
> social and economic context pose challenges for the design of an undergraduate curriculum. The
> traditional, sequential, skill based undergraduate curriculum has successfully trained a cadre of
> engineers who have designed and built reliable physical infrastructure that society takes almost
> for granted. However, "engineer bashing" is not uncommon in many segments of society as this
> infrastructure ages, needs replacement, and unanticipated environmental and social problems
> created as a byproduct come to the fore. Re-engineering the $20 trillion US physical
> infrastructure is now recognized as a major challenge. At the same time, undergraduate CEE
> enrollments have been declining, and retention of women and other minorities lag expectations.

**2026:** The framing has only gotten more urgent — and "use a city simulator to pull students
from other departments into engineering" is now the founding precedent of the
[educators' track](https://github.com/SimHacker/WillWrightShowForFood/blob/main/process/tracks/educators-track/educators-track.md). ✅

## The diagnosis: students never touch the real thing early

> Interviews with students reveal: (1) a strong interest in the CEE subject matter, but a lack of
> knowledge at the college entrance level of the engineer's role; (2) little exposure to
> engineering in the first two years; and (3) a sense of ill-preparedness for the work force on
> graduation that is often ascribed to instructional methods that are abstract, focused on general
> principles related to unit processes, with limited integrative application. The second item
> contributes negatively to undergraduate retention at schools where the student has a choice of
> major through the second year. An institutional response is to emphasize design content, and
> introduce capstone or synthesis classes in the curriculum. However, these measures are typically
> adopted only in junior/senior classes.

**2026:** The proposed cure — hands-on systems play from day one — no longer needs a lab install
or a license. Micropolis runs in any browser, engine compiled to WebAssembly:
[`packages/micropolis-engine`](https://github.com/SimHacker/MicropolisCore/tree/main/packages/micropolis-engine). ✅

## The proposed curriculum: systems first, case studies, data driven

> Through a partnership between Columbia University's Departments of Civil Engineering &
> Engineering Mechanics and Earth & Environmental Engineering and the Columbia Center for New Media
> Teaching and Learning the development of a new instructional approach and curriculum to
> systematically address the issues raised above is proposed here. The new curriculum is anchored
> by a sequence of classes in the first three years that progressively expose the students to a
> variety of CEE problems of regional and national interest in a case study mode. These classes,
> designed to provide technological literacy to all majors, will use a "systems approach". The
> proposed curriculum will be progressively specialized as one moves to the higher grades, offering
> a student the opportunity to explore a subsystem given an understanding of the larger context of
> the problem. The goal is to present a data driven, problem focused approach to learning that
> integrates material from concurrent science and humanities classes and emphasizes the
> interconnection between most classes in the curriculum. Spatial interactions between subsystems
> over different time frames will be made explicit and used to motivate the application of
> empirical as well as theoretical approaches to design, analysis and management of the pieces and
> the whole.

**2026:** "Curriculum as a sequence of explorable case studies" maps directly onto
curriculum-in-a-repo: fork it, assign it, grade the pull request — the
[educators' track formats](https://github.com/SimHacker/WillWrightShowForFood/blob/main/process/tracks/educators-track/educators-track.md). 🚧
And "technological literacy to all majors" is the Lall move the track is named for: the game is
the bait, the data literacy is the catch. ✅

## The platform: an open simulation environment

> Information and computer technology will be used extensively to develop a virtual reality
> platform that will be used throughout the curriculum. Beyond the redeveloped curriculum, the
> development of this open simulation platform and working prototype scenarios for classroom
> introduction represents the major deliverable of this proposal. Spatially explicit simulators
> that bring together a variety of interacting infrastructure and environmental components (as in
> the game SimCity) will be used as a vehicle to introduce the broad problem context, and to bring
> case studies to life.

**2026:** The open SimCity is real and has been for 18 years — Will Wright's original, GPL'd as
**Micropolis** (2008, for OLPC), modernized as
[MicropolisCore](https://github.com/SimHacker/MicropolisCore): C++ engine → WebAssembly →
TypeScript/Svelte, tile renderer, plugin architecture
([renderer roadmap](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/renderer-plugin-roadmap.md)). ✅
The 2003 OPTIMUS prototype itself survives at
[`ccnmtl/optimus`](https://github.com/ccnmtl/optimus) — Python, with its own federation
architecture (`Federate.py`, `FedWizard.py`), a design instinct MicropolisCore's
[federation of peer games](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/federation-peer-games.md)
carries forward. ✅/🚧

## Students explore historical data and policy scenarios

> Student teams will use it to explore historical data, as well as the effects of both policy and
> structural measures for a range of problems (e.g., natural and environmental hazards) on the long
> term functioning of the infrastructure, the environment and interacting social systems.

**2026:** Scenarios (earthquakes, floods, meltdowns, monsters) shipped in the engine since 1989.
Controlled experiments with **data extraction** are the point of the planned data lab: not CSV
exports circa 2002, but **Google Sheets — online, shared, machine-readable, scriptable,
analyzable, turn-in-able, gradable** — high on the educational unlock path
([educators' track `data_lab`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/process/tracks/educators-track/educators-track.md)). 🚧
What students abstracted by hand from SimCity in Lall's 2002 freshman class becomes a live feed.

## Students add modules in a high-level language

> In addition to exercising the system with different problems and settings, students will develop
> and add functional modules to the system using a high-level programming language. The inner
> workings of key subsystem components or processes will be accessible for stand-alone instruction.

**2026:** This was the sentence SimCity couldn't deliver in 2002 — the full proposal says it
plainly: *"SimCity lacks the open architecture to add modules and extract state variables.
However, Hopkins has demonstrated how to make this game extensible…"* Delivered twice over:

- **Then:** the GPL Micropolis exposed the engine to **Python** via SWIG
  ([SimHacker/micropolis](https://github.com/SimHacker/micropolis)), exactly the high-level-language
  module story the proposal asked for. ✅
- **Now:** MicropolisCore exposes engine state to **JavaScript/TypeScript** through WebAssembly,
  and [MOOLLM](https://github.com/SimHacker/moollm) goes one further — modules written as
  **skills in natural language + YAML**, legible to students, teachers, and AI alike
  ([MOOLLM ↔ Micropolis integration](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/moollm-micropolis-integration.md)). ✅

The proposal's "conversational environment in which the learner can apply knowledge to problems"
is now literal: the conversation partner is an LLM with the city as context. ✅

## Multiple roles, teams, and real data sources

> Interaction with existing numerical models, Geographical Information Systems, and statistical
> analysis packages will be considered as part of the design. Case studies introduced in the first
> year may continue to be building blocks for more detailed analyses in subsequent years.

**2026:** Multi-role play — the full proposal wanted student teams as "a city public works
engineer, a water systems manager" — is the
[federation/multiplayer design](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/federation-peer-games.md)
(and Don demonstrated multiplayer SimCity on X11 in the early 1990s, which is why the proposal
cited him). ✅/🚧 GIS import and coupled numerical models (the HAZUS earthquake-loss idea) remain
open invitations — a perfect student project, which is rather the point. 🚧

## The team and the promise

> NSF Support is sought for the development of CEE case studies and the educational
> simulation/gaming platform. Materials for three classes offered in the first two years will be
> developed using the proposed grant and matching funds. Industrial collaborators who have
> experience developing SIMgames have been recruited as consultants to help design and implement
> the open modeling platform. The materials developed under the grant will be made available to the
> engineering education community, and formal evaluations of changes in material, skills and
> knowledge imparted to and retained by students will be performed.

**2026:** Those "industrial collaborators who have experience developing SIMgames" are named in
the full proposal: **Don Hopkins** — who went on to GPL SimCity itself and has spent the years
since building the open platform this summary asked for — and **David Levitt**. The "materials
made available to the engineering education community" clause is fulfilled beyond its own
ambition: the entire platform is free software, and the collaboration now runs in public, in git,
on the [Will Wright Show](https://github.com/SimHacker/WillWrightShowForFood). ✅

---

## The scorecard

| 2002 ask | 2026 answer | Status |
|---|---|---|
| Open simulation platform "as in the game SimCity" | SimCity itself, GPL'd → [MicropolisCore](https://github.com/SimHacker/MicropolisCore) (WebAssembly, browser) | ✅ |
| Extract state variables | Engine state exposed to JS/TS; Python via SWIG in the [classic repo](https://github.com/SimHacker/micropolis) | ✅ |
| Students add modules in a high-level language | Python then; TypeScript + [MOOLLM skills](https://github.com/SimHacker/moollm) (natural language + YAML) now | ✅ |
| "Conversational environment" for learners | An LLM with the city as context — literal | ✅ |
| Multiple roles / student teams | [Federation of peer games](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/federation-peer-games.md); 1990s X11 multiplayer precedent | ✅/🚧 |
| Data abstracted from simulations, analyzed statistically | Google Sheets data lab — shared, scriptable, gradable | 🚧 planned, high priority |
| Classroom case studies + curriculum | Curriculum-in-a-repo, [educators' track](https://github.com/SimHacker/WillWrightShowForFood/blob/main/process/tracks/educators-track/educators-track.md) | 🚧 |
| Formal evaluation of learning outcomes | The reproducibility pilot (his own 2002 with/without-simulator design, revived) | 🚧 |
| Cellular automata as teaching formalism | Micropolis *is* a CA city; Don's [CAM6 emulator](https://github.com/SimHacker/CAM6) besides | ✅ |
| GIS / coupled models (HAZUS) | Open invitation — ideal student contribution | 🚧 |

*Twenty-four years from proposal to platform. The blocker didn't survive; the idea did.*
