# Teaching Complicated Systems Without a Manual

*Public essay · Aug 2026 · Don Hopkins*

| | |
|---|---|
| **Prompt** | Cold email from **Tade Mehl** (Aug 2026) — building a humanoid; two sharp questions, not fan mail |
| **Why publish** | They deserved a real answer; they gave Don a focus worth sharing beyond one inbox |
| **Tade's bookshelf** | [tademehl.com/bookshelf](https://www.tademehl.com/bookshelf) (book picks checked against it) |
| **Show seed** | [`teaching-complicated-systems-without-a-manual.yml`](teaching-complicated-systems-without-a-manual.yml) · [`ideas.md`](ideas.md) |
| **Lineage room** | [`README.md`](README.md) Cluster V · [`visual-programming-excel-and-dimensionality.md`](visual-programming-excel-and-dimensionality.md) |

In August 2026 Tade Mehl wrote out of the blue. He is working on a humanoid and kept hitting a design wall: how should normal people teach or program it without it feeling like programming? He had read Don's SimCity and pie menu work. His email was not fan mail. It was two excellent questions that any builder of teachable interfaces should ask:

> When you make an interface for something really complicated, how do you decide what the person should see and control and what should disappear completely?  
> And did SimCity teach you anything about how normal people learn a complicated system without a manual?

Don replied by email (bookshelf recs, Will Wright talk, HN harvest). This essay expands that reply into something anyone can browse: humanoid builders, simulation designers, LLM tool makers, constructionist educators.

**Representation note:** Tade is credited here as the prompt author. There is no WillWrightShowForFood character directory for him; this essay is Don's public response, not a portrayal of Tade.

---

## Short answer

**What to show:** only affordances that map onto things the user already understands, at the scale they're thinking at right now — then let curiosity pull them deeper.  
**What to hide:** implementation guts, brittle shortcuts, and parameters that only make sense once you've already built a mental model.  
**How they learn without a manual:** play first; the simulation is a compiler for a *mental* model, not a textbook for the code running inside.

SimCity didn't teach this by being realistic. It taught it by being *honest at the level of play* while quietly cheating at the level of computation — and trusting the player to fill the gap with city knowledge they already had.

---

## The four things that must fit together

From Will Wright's 1996 Stanford talk (*Interfacing to Microworlds*, Terry Winograd's CS547 seminar) — [video](https://www.youtube.com/watch?v=nsxoZXaYJSk), [Don's writeup](https://donhopkins.medium.com/designing-user-interfaces-to-simulation-games-bd7a9d81e62d):

| Part | Role |
|------|------|
| Simulation model | What's actually running |
| Gameplay | Goals and conflicts layered on top |
| User interface | What you can touch |
| User's mental model | What they *think* is running |

All four must be **tractable together**. A gorgeous UI can't save an impossible simulation. A perfect simulation fails if the UI can't express it. And the shallow model on screen is only a compiler for the deep model in the player's head:

> The digital models running on a computer are only compilers for the mental models users construct in their heads.

**Design rule for Tade's humanoid:** the robot's true control stack can be arbitrarily deep; the teach surface only needs to expose the slice that matches the teacher's current intent — walk, gesture, habit, story — not joint torques.

---

## What to show vs what to hide

### 1. Implication beats simulation

SimCity classic is tile indices and magic numbers scattered through fast C — not a general urban dynamics engine. Will's line (via Don's article): educators wanted glass-box internals; the game works because **implication is more efficient than simulation**.

Players attribute cause and effect the programmer knows aren't wired together. That's a feature: they integrate what they already know about cities.

**Hide:** joint Jacobians, planner graphs, reward hacks.  
**Show:** outcomes that read correctly at human scale — "it sat down," "it's waiting," "it's confused."

### 2. Goldilocks complexity

Will's postmortem ladder (same talk):

| Game | Verdict |
|------|---------|
| SimEarth | Too complex — continental drift erases your work |
| SimAnt | Too simple — ant farms look alike |
| SimCity 2000 | "Just right" |

SimEarth's view controls were ordered in **temporal progression** (continental drift → technology) — a UI lesson in making scale legible without a manual.

**For a humanoid:** one mode where nothing can go wrong (sandbox pose / puppet), one where autonomous habits emerge, one expert layer — not all knobs at once.

### 3. Objects advertise; people scan

Early Dollhouse / The Sims design (1996 demo, same writeup):

> They scan the room for people and objects, and the objects are all kind of advertising: "If you're angry, pick up me and throw me!", "If you're hungry, eat me!"

The **person** carries no knowledge of objects. Objects carry interaction scripts, animations, scheduling. Behavior is **distributed in the environment**.

This is the answer to "programming without feeling like programming": you don't open a REPL on the robot; you teach **props, places, and habits** — "when the bell rings, go here," "when hands out, take this."

MOOLLM's Sims-inspired **Advertisements** in CARD.yml are the same pattern for LLM agents: broadcast capabilities, score them per character state, generate menus from what's salient now.

### 4. Masking — enough detail to see yourself

Don's HN comment on emoji inclusivity ([27808826](https://news.ycombinator.com/item?id=27808826)), citing Scott McCloud's *Understanding Comics*:

> You have to have enough specificity to represent you enough, but not so inclusive that your emoji palette is hundreds of thousands of emoji.

McCloud's **masking** concept: simplified avatars invite projection; hyper-real faces exclude. The Sims' low-poly people are a feature.

**For humanoids:** a teachable character probably shouldn't look uncanny-valley perfect on day one. Leave room for the teacher's intent to complete the identity.

### 5. Multiple toys in one box

SimCity supports sandbox terraforming, painting with roads, scenario games, disaster toys, storytelling — **without mode switches labeled "tutorial."** Same microworld, different games.

Will's **train set** metaphor (1996 talk): some buyers care about hills, some about switching, some about the village. Persistent data that accretes across sessions — hobby model, not blockbuster movie model.

### 6. Discoverability vs minimalism (counter-example)

John Gruber's [*Bad Dye Job*](https://daringfireball.net/2025/12/bad_dye_job) (Dec 2025) — harvest summary:

Alan Dye led Apple's HI design from brand/print (Kate Spade, Ogilvy), not interaction design. A decade of UI driven by **how things look** at the expense of **how things work** — Liquid Glass readability failures, Mac complexity underserved, designers inside Apple who couldn't use terms like "key window" without being treated as "programmer talk."

> Design is not just what it looks like and feels like. Design is how it works. — Jobs (quoted on stage while doing the opposite)

The iOS 26.1 **clear/tinted** Liquid Glass toggle was an admission that visual minimalism broke function.

**Lesson for Tade:** hiding controls to look clean is not the same as progressive disclosure. Power and discoverability are not sins. Pie menus exist partly so frequent actions stay **spatially learnable** without cluttering the main canvas ([pie menu retrospective](https://donhopkins.medium.com/pie-menus-a-30-year-retrospective-5bdcb24a835a)).

---

## How normal people learn without a manual

### Play before vocabulary

SimCity shipped without requiring urban planning credentials. Zones, bulldozer, speed-up-time are **metaphors**, not domain jargon. Kids reverse-engineer the simulator for fun ([Chaim Gingold's SimCity reverse diagrams](https://www.scheming.io/simcity/) — cited throughout Don's Medium article).

### The manual is the world

Actions have immediate visible consequences on terrain the user already reads as "city." Wrong guesses are cheap. Stories emerge (label districts, share save files) beyond what the sim formally supports — Will suggested class projects building hyperlinked city stories off one save.

### Third-person beats first-person (for social learning)

Will chose Dollhouse's 45° orthographic view over Doom-style first person: easier to read crowds, gestures, social situations. Same reason SimCity is top-down.

For a humanoid teacher: watching the robot **from outside** while demonstrating may beat immersive teleop early on.

### Design by accretion looks like hacks until it doesn't

Chris Trottier's Maxis interview (cited in Don's HN threads): The Sims was **"Design by Accretion"** / **"Tuned Emergence"** — a pile of components that looked disposable for years, then suddenly cohered. Managers hate this; players benefit.

Don't wait for the perfect teach language. Ship tight loops; let the teach vocabulary emerge from what people actually do.

---

## Lineage: microworlds → programming by demonstration → MOOLLM

Tade's question is not new. It is the same problem Seymour Papert, Alan Kay, Brad Myers, Allen Cypher, Henry Lieberman, and Will Wright have been circling for fifty years: **how do you let a non-programmer teach a complicated system by doing, not by reading a manual?**

The answer stack:

```
Papert microworlds          →  simplified explorable domain (Logo turtle, SimCity tile grid)
Constructionism             →  learn by building inspectable things you care about
Programming by demonstration →  watch what I do; infer and replay the procedure
Programming by example      →  same family; often emphasizes generalization from instances
Play-Learn-Lift             →  MOOLLM's systematic version of the above
Skills                      →  lifted demonstrations that other agents can reuse
```

### Papert: microworlds and constructionism

Seymour Papert (*Mindstorms*, MIT Media Lab, Logo) argued that people learn best by **constructing** things in a **microworld**: a domain simplified enough to explore freely, rich enough to carry real ideas. Logo's turtle is the canonical microworld. The computer is Proteus: it can simulate anything, so the microworld can match the learner's passion.

Will Wright's 1996 talk was literally titled *Interfacing to Microworlds* (Terry Winograd's CS547). SimCity is a city microworld. The Sims is a social microworld. Dollhouse was a dollhouse microworld. Same design move every time: **low floor** (anyone can place a zone or click a person), **high ceiling** (experts reverse-engineer dynamics), **wide walls** (sandbox, scenarios, disasters, storytelling).

**For Tade's humanoid:** the teach surface is a microworld. Joint torques and planner graphs are the wrong microworld for a normal teacher. "Walk here," "wave when the bell rings," "sit when tired" is the right one.

Don's open-source SimCity work (MicropolisCore, OLPC) sits explicitly in the **constructionist education** lineage: Doreen Nelson's city-building pedagogy, Minsky and Kay, classroom microworlds where kids learn by building cities they care about.

### Programming by demonstration / programming by example

**Programming by demonstration (PBD)** and **programming by example (PBE)** name the same core idea: the user performs an example; the system records, generalizes, and replays.

The canonical book is Allen Cypher's ***Watch What I Do: Programming by Demonstration*** (MIT Press, 1993; [acypher.com/wwid](http://acypher.com/wwid)). Brad Myers co-edited; chapters cover Peridot, Garnet, Triggers, Eager, and dozens of systems where **the UI is the program** and demonstration is the source code.

| System | What the user demonstrates | What gets hidden |
|--------|---------------------------|------------------|
| **Peridot** (Brad Myers, 1987) | Widget layout and behavior by example | Constraint solver, Lisp internals |
| **Garnet / C32** (CMU, early 1990s) | Spreadsheet-like constraints by demonstration | KR pull-constraint engine |
| **HyperCard** | Button scripts from recorded actions | HyperTalk under the hood |
| **KidSim / StageCraft** (Apple, Lieberman lineage) | Kids script characters by example in a microworld | Rule generalization |
| **SimAntics** (The Sims, Don + Will) | Visual behavior rules: conditions → actions | Compiled behavior tree |
| **Tade's humanoid (?)** | Gesture, habit, social script | Jacobian, RL reward, motion primitives |

Don worked in Brad Myers' Garnet group at CMU (~1992–93), building the PostScript driver and **GLASS** (*Graphical Layer And Server Simplifier*). Brad's *All the Widgets* (CHI '90) and visual-programming taxonomy (CHI '86 / JVLC 1990) are the map Don still cites on HN: spreadsheets **are** visual programs; PBD is a first-class category; hiding the "inner world" does not disqualify direct manipulation.

Henry Lieberman's MIT work (Eager, Tinker, programming by demonstration in everyday UIs) is the same ethic: **watch what I do in context**, don't make me open an editor first.

**Design rule:** demonstration is not "record macro and replay blindly." Good PBD **generalizes**: "when I did this here, I probably mean *this kind of thing* in similar situations." That is exactly Tade's "teach without feeling like programming" problem.

### SimCity, The Sims, and shipped PBD

SimCity is not usually filed under PBD, but the teach loop is the same shape:

1. **Play** in a microworld (place zones, roads, bulldoze).
2. **Learn** from visible consequences (traffic, budgets, riots).
3. **Lift** mental models and stories (named districts, shared saves, classroom projects).

The Sims went further toward explicit PBD:

- **Object advertising** (see above): the world publishes affordances; the teacher picks among salient actions.
- **SimAntics**: a visual programming language for behaviors (conditions, actions, motives) that Don implemented with Will Wright. Behaviors are **authored by demonstration-like composition** in a VPL, not by typing code. Edith demo videos are the proof that "normal people" can program social behavior when the notation matches the domain.

Pie menus are a related move: **spatial muscle memory** from repeated demonstration of "where the action lives," without a command language.

### Play-Learn-Lift and MOOLLM

MOOLLM makes the PBD loop **explicit and repeatable** across everything Don builds:

| Stage | PBD analog | MOOLLM |
|-------|-----------|--------|
| **Play** | Demonstrate manually; explore; fail safely | Messy notes, scratchpad, `.moollm/` probes |
| **Learn** | System generalizes; user inspects mapping | Patterns documented; schemas revised |
| **Lift** | Reusable procedure/script/tool | Skill in `skills/` with CARD.yml + SKILL.md |

From the MOOLLM `skill` meta-protocol:

> Documentation → Procedure → Script → Tool  
> This is **Programming by Demonstration** made systematic.

**Constructionism** is the philosophy (build to understand; filesystem as microworld; YAML files as inspectable constructions). **Play-Learn-Lift** is the methodology (jazz first, then standards; don't lift before you've dogfooded the concrete instance). **Skills** are where lifted demonstrations live: documentation that learned to do things, inheritable like Self prototypes, advertised to agents like Sims objects.

MOOLLM **Advertisements** in CARD.yml are Sims-style object scripts for LLM agents: broadcast what you can do, score by current character state, generate menus from what's salient. Same pattern as teachable humanoid affordances.

Other MOOLLM skills echo PBD by name: `copy-that` grows venue plugins **by example**; `cursor-mirror` treats your transcript as a demonstration to mine; `yaml-jazz` is **documentation by example** (the instance is the curriculum).

**For Tade:** if the humanoid teach loop works, the path is predictable:

1. Ship a **microworld** teach mode (puppet, props, places).
2. Let teachers **demonstrate** habits; show them enough of the inferred mapping to correct it (anti-vibe-coding).
3. When a pattern repeats, **lift** it into a named skill/habit the robot advertises next time.

That is Play-Learn-Lift applied to robotics. It is also what Cypher's book cataloged system by system in 1993.

### Reading list for this lineage

| Work | Connection |
|------|------------|
| **Allen Cypher (ed.) — *Watch What I Do*** | The PBD/PBE bible; [acypher.com/wwid](http://acypher.com/wwid) |
| **Brad Myers — Peridot, Garnet, C32, VPL taxonomy** | [cmu.edu/~bam](http://www.cs.cmu.edu/~bam/); [`../brad-myers/`](../brad-myers/GLANCE.md) |
| **Henry Lieberman — MIT PBD lineage** | Eager, contextual learning from demonstration |
| **Seymour Papert — *Mindstorms*** | Constructionism, microworlds, Logo |
| **Mitchel Resnick — Scratch / Lifelong Kindergarten** | Papert for the 2000s; low floor / wide walls |
| **Chaim Gingold — *Building SimCity*** | SimCity as cultural microworld; reverse diagrams |
| **MOOLLM `skills/play-learn-lift/`** | Methodology Don uses now |
| **MOOLLM `skills/constructionism/`** | Filesystem = microworld; skills = constructions |

---

## LLMs, vibe coding, and hard thinking

From Don's email to Tade (Aug 2026):

- LLMs overturn old assumptions; one best use is **learning at your own pace**.
- **Vibe coding** (not looking at generated code) forfeits the learning loop.
- The minority still willing to **read, think, and design with** an LLM are disproportionately powerful.

Related HN harvest ([48964059](https://news.ycombinator.com/item?id=48964059) — Papert query thread):

> YOU HAVE TO READ THE CODE. Refusing to do that means you're not a serious programmer, you're outsourcing your thought and design and implementation.

**For humanoid teaching:** an LLM can translate natural intent into motion primitives — but the human should see enough of the mapping to **correct and compose**, not just accept vibes. Same ethic as SimCity: learn the city, not the tile array.

---

## Book recommendations

Checked against Tade's bookshelf API (2026-08-16).

### Don's picks — **not yet on shelf** (high priority)

| Book | Why |
|------|-----|
| **Stanisław Lem — *The Cyberiad*** | "Trurl's Machine" (stubborn computer / simulated universe) inspired SimCity. Don's HN Lem hunt: [38744779](https://news.ycombinator.com/item?id=38744779) |
| **Scott McCloud — *Understanding Comics*** | Masking, closure, simplification → Sims character readability. [27808826](https://news.ycombinator.com/item?id=27808826) |

### Already on shelf — worth re-reading for this project

| Book | Connection |
|------|------------|
| **Don Norman — *The Design of Everyday Things*** | Affordances, signifiers, discoverability — antidote to Dye-style veneer |
| **Mihaly Csikszentmihalyi — *Flow*** | Challenge/skill balance in learnable systems |
| **Isaac Asimov — robot stories / *I, Robot*** | Teaching rules vs emergent behavior (Tade has the series) |
| **Dr. Samuel Xiangming Li — *Humanoid Robotics Hardware*** | Already aligned with build |

### Additions Don would stack on top

| Book | Why |
|------|-----|
| **Seymour Papert — *Mindstorms*** | Constructionism: people learn by constructing things they care about |
| **Allen Cypher (ed.) — *Watch What I Do: Programming by Demonstration*** | PBD/PBE canon; Peridot, Garnet, Lieberman, HyperCard lineage — [acypher.com/wwid](http://acypher.com/wwid) |
| **Brad Myers — papers + *Pick, Click, Flick!* (forthcoming)** | VPL taxonomy, Garnet, C32, *All the Widgets* — [ixtbook.com](http://www.ixtbook.com/) |
| **Chaim Gingold — *Play Design* (PhD, 2016)** | SimCity as cultural artifact; reverse diagrams; microworld pedagogy |
| **Ian Bogost — *Persuasive Games* / procedural rhetoric** | How mechanics argue — Sims social commentary by design |
| **Alan Kay / media literacy canon** | Microworlds, not apps — Don's Medium Alan Kay pieces |

---

## Source harvest index

### Primary

| Source | Harvested lesson |
|--------|------------------|
| [Will Wright talk (1996 video)](https://www.youtube.com/watch?v=nsxoZXaYJSk) | Four coupled parts; Goldilocks complexity; Dollhouse→Sims; object advertising; train-set accretion |
| [Don: Designing UI to Simulation Games](https://donhopkins.medium.com/designing-user-interfaces-to-simulation-games-bd7a9d81e62d) | Full notes + 2023 video link; implication>simulation; storytelling; SimRefinery/Sim MIS anecdotes |
| [Gruber: Bad Dye Job](https://daringfireball.net/2025/12/bad_dye_job) | Discoverability crisis; interaction design vs brand design; Lemay replacement |
| [Cypher: Watch What I Do](http://acypher.com/wwid) | PBD/PBE canon; Peridot, Garnet, demonstration-as-programming |
| [Brad Myers CMU / VPL taxonomy](http://www.cs.cmu.edu/~bam/papers/VLtax2-jvlc-1990.pdf) | Spreadsheets as VPL; PBD category; Garnet lineage |
| [MOOLLM play-learn-lift](https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift) | Play → Learn → Lift; PBD made systematic |

### HN comments Don linked

| ID | Parent thread | Harvested gist |
|----|---------------|----------------|
| [22886489](https://news.ycombinator.com/item?id=22886489) | Game devs' proudest work | Don's 1998 Sims design doc notes on relationship tree |
| [27808826](https://news.ycombinator.com/item?id=27808826) | I Stopped Using Emojis | McCloud masking — specificity vs infinite inclusivity |
| [30145646](https://news.ycombinator.com/item?id=30145646) | Story of Maxis (1999) | Maxis / SimCopter history (tangential) |
| [35539087](https://news.ycombinator.com/item?id=35539087) | Sims + ChatGPT bots | Family Album storytelling; deliberate from day one |
| [35539207](https://news.ycombinator.com/item?id=35539207) | Sims + ChatGPT bots | ChatGPT Simlish "Philip Glass" — play language vs sim rigor |
| [38744779](https://news.ycombinator.com/item?id=38744779) | Lem hard sci-fi game | Trurl's Machine; LLM confabulates wrong Lem story |
| [48805234](https://news.ycombinator.com/item?id=48805234) | When 2+2=5 | Lem's stubborn computer; SimCity lineage |
| [15175516](https://news.ycombinator.com/item?id=15175516) | Solaris / Lem | *The Congress* mocap scene — embodiment capture |
| [15175234](https://news.ycombinator.com/item?id=15175234) | Solaris / Lem | *Cyberiad* + Michael Kandel translation |
| [26615042](https://news.ycombinator.com/item?id=26615042) | Iain M. Banks utopia | Lem's reviews of nonexistent books; *Imaginary Magnitude* |

### Tade's bookshelf

Interactive graph at https://www.tademehl.com/bookshelf — 113 books via `/api/books`. Strong biographies / business / sci-fi; missing comics theory and Lem despite hard-SF lean.

---

## Checklist for a teachable humanoid UI

1. **Microworld tier** — simplified teach domain (Papert); not the full control stack  
2. **Sandbox tier** — puppet/teach mode with no failure states  
3. **Demonstrate, then generalize** — PBD/PBE loop; teacher performs, system infers habit  
4. **Advertised affordances** — objects/places publish "you can teach me this here" (Sims + MOOLLM Ads)  
5. **Hide the Jacobian** — show outcome verbs, not control vectors  
6. **Goldilocks panel** — one screen of "just right" before advanced  
7. **Masking** — simplified appearance that invites projection  
8. **Persistent accretion** — lessons stack; train-set, not one-shot demo  
9. **Play-Learn-Lift** — when a teach pattern repeats, lift it to a named reusable habit/skill  
10. **Read the generated code** — if LLM-assisted, teacher sees the mapping (anti-vibe-coding)  
11. **Don't Dye it** — minimalism that kills discoverability is not sophistication  

---

## Related Don Hopkins work

- Pie menus — spatial muscle-memory controls: [30 Year Retrospective](https://donhopkins.medium.com/pie-menus-a-30-year-retrospective-5bdcb24a835a)  
- The Sims design documents: https://donhopkins.com/home/TheSims/  
- SimAntics / Sims behavior VPL (Don + Will): Edith demos, HN SimAntics threads  
- CMU Garnet / Brad Myers lineage: [MicropolisCore brad-myers doc](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/brad-myers-visual-programming-hn.md) · [`../brad-myers/`](../brad-myers/GLANCE.md)  
- Open Micropolis / constructionist SimCity: [MicropolisCore](https://github.com/SimHacker/MicropolisCore)  
- MOOLLM Play-Learn-Lift + constructionism + PBD-as-skills: [moollm](https://github.com/SimHacker/moollm) (`skills/play-learn-lift/`, `skills/constructionism/`, `skills/skill/`)

---

*Published 2026-08-16 in [WillWrightShowForFood/characters/don-hopkins/](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/don-hopkins). Prompted by Tade Mehl's Aug 2026 cold email. Sources: Gruber, Medium, YouTube, HN, Tade bookshelf API, Papert/Cypher/Myers/Lieberman/MOOLLM lineage.*
