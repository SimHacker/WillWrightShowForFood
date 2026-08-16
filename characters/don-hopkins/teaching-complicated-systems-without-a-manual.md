# Teaching Complicated Systems Without a Manual

*Public essay · Aug 2026 · Don Hopkins*

| | |
|---|---|
| **Prompt** | Cold email from **Tade Mehl** (Aug 2026) — building a humanoid; two sharp questions |
| **Why publish** | They deserved a real answer; they gave Don a focus worth sharing beyond one inbox |
| **Tade's bookshelf** | [tademehl.com/bookshelf](https://www.tademehl.com/bookshelf) (book picks checked against it) |
| **Show seed** | [`teaching-complicated-systems-without-a-manual.yml`](teaching-complicated-systems-without-a-manual.yml) · [`ideas.md`](ideas.md) |
| **Lineage room** | [`README.md`](README.md) Cluster V · [`visual-programming-excel-and-dimensionality.md`](visual-programming-excel-and-dimensionality.md) |

In August 2026 Tade Mehl wrote out of the blue. He is working on a humanoid and kept hitting a design wall: how should normal people teach or program it without it feeling like programming? He had read Don's SimCity and pie menu work. His email asked two excellent questions that any builder of teachable interfaces should ask:

> When you make an interface for something really complicated, how do you decide what the person should see and control and what should disappear completely?  
> And did SimCity teach you anything about how normal people learn a complicated system without a manual?

Don replied by email (bookshelf recs, Will Wright talk, HN harvest). This essay expands that reply into a public response for anyone who asks good questions like these: robot builders, simulation designers, LLM tool makers, constructionist educators. It says *robot* rather than *humanoid* throughout: in the tradition of Lem's *Cyberiad* constructors and Will Wright's Stupid Fun Club, teachable robots come in every shape, not just ours.

---

## Contents

- [Short answer](#short-answer)
- [The four things that must fit together](#the-four-things-that-must-fit-together)
- [What to show vs what to hide](#what-to-show-vs-what-to-hide)
  - [1. Implication beats simulation](#1-implication-beats-simulation)
  - [2. Goldilocks complexity](#2-goldilocks-complexity)
  - [3. Objects advertise; people scan](#3-objects-advertise-people-scan)
  - [4. Masking — enough detail to see yourself](#4-masking--enough-detail-to-see-yourself)
  - [5. Multiple toys in one box](#5-multiple-toys-in-one-box)
  - [6. Discoverability vs minimalism (counter-example)](#6-discoverability-vs-minimalism-counter-example)
- [How normal people learn without a manual](#how-normal-people-learn-without-a-manual)
  - [Play before vocabulary](#play-before-vocabulary) · [The manual is the world](#the-manual-is-the-world) · [Third-person beats first-person](#third-person-beats-first-person-for-social-learning) · [Design by accretion](#design-by-accretion-looks-like-hacks-until-it-doesnt)
- [Lineage: microworlds → programming by demonstration → MOOLLM](#lineage-microworlds--programming-by-demonstration--moollm)
  - [Papert: microworlds and constructionism](#papert-microworlds-and-constructionism)
  - [Programming by demonstration / programming by example](#programming-by-demonstration--programming-by-example)
  - [SimCity, The Sims, and shipped PBD](#simcity-the-sims-and-shipped-pbd)
  - [Play-Learn-Lift and MOOLLM](#play-learn-lift-and-moollm)
  - [Reading list for this lineage](#reading-list-for-this-lineage)
- [What kind of object is a robot? Prototypes, roles, and pantomime horses](#what-kind-of-object-is-a-robot-prototypes-roles-and-pantomime-horses)
  - [Prototypes: teach by cloning, not by classifying](#prototypes-teach-by-cloning-not-by-classifying)
  - [Multiple inheritance: the talking chair problem](#multiple-inheritance-the-talking-chair-problem)
  - [Advertisements: the world knows what it's for](#advertisements-the-world-knows-what-its-for)
  - [The compiler takes dictation: natural language → running code](#the-compiler-takes-dictation-natural-language--running-code)
  - [Why this matters for a teachable robot](#why-this-matters-for-a-teachable-robot)
- [LLMs, vibe coding, and hard thinking](#llms-vibe-coding-and-hard-thinking)
- [Book recommendations](#book-recommendations)
- [Source harvest index](#source-harvest-index)
- [Checklist for a teachable robot UI](#checklist-for-a-teachable-robot-ui)
- [Related Don Hopkins work](#related-don-hopkins-work)

**People in this essay with rooms in this repo:** [Will Wright](../will-wright/README.md) · [Terry Winograd](../terry-winograd/README.md) · [Seymour Papert](../seymour-papert/README.md) · [Alan Kay](../alan-kay/README.md) · [Brad Myers](../brad-myers/GLANCE.md) · [Henry Lieberman](../henry-lieberman/README.md) · [Gary Drescher](../gary-drescher/README.md) · [Chaim Gingold](../chaim-gingold/README.md) · [Chris Trottier](../chris-trottier/README.md) · [Scott McCloud](../scott-mccloud/README.md) · [Don Norman](../don-norman/README.md) · [Ian Bogost](../ian-bogost/README.md) · [David Ungar](../david-ungar/README.md) · [David Temkin](../david-temkin/README.md) · [Don Hopkins](README.md)

---

## Short answer

**What to show:** only affordances that map onto things the user already understands, at the scale they're thinking at right now — then let curiosity pull them deeper.  
**What to hide:** implementation guts, brittle shortcuts, and parameters that only make sense once you've already built a mental model.  
**How they learn without a manual:** play first; the simulation is a compiler for a *mental* model, not a textbook for the code running inside.

SimCity didn't teach this by being realistic. It taught it by being *honest at the level of play* while quietly cheating at the level of computation — and trusting the player to fill the gap with city knowledge they already had.

---

## The four things that must fit together

From [Will Wright's](../will-wright/README.md) 1996 Stanford talk (*Interfacing to Microworlds*, [Terry Winograd's](../terry-winograd/README.md) CS547 seminar) — [video](https://www.youtube.com/watch?v=nsxoZXaYJSk), [Don's writeup](https://donhopkins.medium.com/designing-user-interfaces-to-simulation-games-bd7a9d81e62d), [primary source room](../will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/):

| Part | Role |
|------|------|
| Simulation model | What's actually running |
| Gameplay | Goals and conflicts layered on top |
| User interface | What you can touch |
| User's mental model | What they *think* is running |

All four must be **tractable together**. A gorgeous UI can't save an impossible simulation. A perfect simulation fails if the UI can't express it. And the shallow model on screen is only a compiler for the deep model in the player's head:

> The digital models running on a computer are only compilers for the mental models users construct in their heads.

**Design rule for a teachable robot:** the robot's true control stack can be arbitrarily deep; the teach surface only needs to expose the slice that matches the teacher's current intent — walk, gesture, habit, story — not joint torques.

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

**For a robot:** one mode where nothing can go wrong (sandbox pose / puppet), one where autonomous habits emerge, one expert layer — not all knobs at once.

### 3. Objects advertise; people scan

Early Dollhouse / The Sims design (1996 demo, same writeup):

> They scan the room for people and objects, and the objects are all kind of advertising: "If you're angry, pick up me and throw me!", "If you're hungry, eat me!"

The **person** carries no knowledge of objects. Objects carry interaction scripts, animations, scheduling. Behavior is **distributed in the environment**.

This is the answer to "programming without feeling like programming": you don't open a REPL on the robot; you teach **props, places, and habits** — "when the bell rings, go here," "when hands out, take this."

MOOLLM's Sims-inspired **Advertisements** in CARD.yml are the same pattern for LLM agents: broadcast capabilities, score them per character state, generate menus from what's salient now.

### 4. Masking — enough detail to see yourself

Don's HN comment on emoji inclusivity ([27808826](https://news.ycombinator.com/item?id=27808826)), citing [Scott McCloud's](../scott-mccloud/README.md) *Understanding Comics*:

> You have to have enough specificity to represent you enough, but not so inclusive that your emoji palette is hundreds of thousands of emoji.

McCloud's **masking** concept: simplified avatars invite projection; hyper-real faces exclude. The Sims' low-poly people are a feature.

**For robots:** a teachable character probably shouldn't look uncanny-valley perfect on day one. Leave room for the teacher's intent to complete the identity.

### 5. Multiple toys in one box

SimCity supports sandbox terraforming, painting with roads, scenario games, disaster toys, storytelling — **without mode switches labeled "tutorial."** Same microworld, different games.

Will's **train set** metaphor (1996 talk): some buyers care about hills, some about switching, some about the village. Persistent data that accretes across sessions — hobby model, not blockbuster movie model.

### 6. Discoverability vs minimalism (counter-example)

John Gruber's [*Bad Dye Job*](https://daringfireball.net/2025/12/bad_dye_job) (Dec 2025) — harvest summary:

Alan Dye led Apple's HI design from brand/print (Kate Spade, Ogilvy), not interaction design. A decade of UI driven by **how things look** at the expense of **how things work** — Liquid Glass readability failures, Mac complexity underserved, designers inside Apple who couldn't use terms like "key window" without being treated as "programmer talk."

> Design is not just what it looks like and feels like. Design is how it works. — Jobs (quoted on stage while doing the opposite)

The iOS 26.1 **clear/tinted** Liquid Glass toggle was an admission that visual minimalism broke function.

**Lesson for robot builders:** hiding controls to look clean is not the same as progressive disclosure. Power and discoverability are not sins. Pie menus exist partly so frequent actions stay **spatially learnable** without cluttering the main canvas ([pie menu retrospective](https://donhopkins.medium.com/pie-menus-a-30-year-retrospective-5bdcb24a835a)).

---

## How normal people learn without a manual

### Play before vocabulary

SimCity shipped without requiring urban planning credentials. Zones, bulldozer, speed-up-time are **metaphors**, not domain jargon. Kids reverse-engineer the simulator for fun ([Chaim Gingold's](../chaim-gingold/README.md) [SimCity reverse diagrams](https://www.scheming.io/simcity/) — cited throughout Don's Medium article).

### The manual is the world

Actions have immediate visible consequences on terrain the user already reads as "city." Wrong guesses are cheap. Stories emerge (label districts, share save files) beyond what the sim formally supports — Will suggested class projects building hyperlinked city stories off one save.

### Third-person beats first-person (for social learning)

Will chose Dollhouse's 45° orthographic view over Doom-style first person: easier to read crowds, gestures, social situations. Same reason SimCity is top-down.

For someone teaching a robot: watching it **from outside** while demonstrating may beat immersive teleop early on.

### Design by accretion looks like hacks until it doesn't

[Chris Trottier's](../chris-trottier/README.md) Maxis interview ([2004 primary source](../will-wright/sources/2004-02-21-chris-trottier-tuned-emergence/), cited in Don's HN threads): The Sims was **["Design by Accretion"](../chris-trottier/design-by-accretion.md)** / **"Tuned Emergence"** — a pile of components that looked disposable for years, then suddenly cohered. Managers hate this; players benefit. (It's a big enough idea to have its own [show seed](../../repo-shows/design-by-accretion/README.md).)

The lesson for a teachable robot: don't try to design the perfect teaching notation up front — the complete set of named habits, gestures, and commands people will use to instruct it. Ship a tight demonstrate-and-correct loop first, and let that vocabulary accrete from what real teachers actually do with it, the same way The Sims cohered.

---

## Lineage: microworlds → programming by demonstration → MOOLLM

The question is not new. It is the same problem [Seymour Papert](../seymour-papert/README.md), [Alan Kay](../alan-kay/README.md), [Brad Myers](../brad-myers/README.md), Allen Cypher, [Henry Lieberman](../henry-lieberman/README.md), and [Will Wright](../will-wright/README.md) have been circling for fifty years: **how do you let a non-programmer teach a complicated system by doing, not by reading a manual?**

The answer stack:

```
Papert microworlds          →  simplified explorable domain (Logo turtle, SimCity tile grid)
Constructionism             →  learn by building inspectable things you care about
Programming by demonstration →  watch what I do; infer and replay the procedure
Programming by example      →  same family; often emphasizes generalization from instances
Self prototypes             →  clone-and-tweak objects; no classes, taxonomy emerges (Ungar & Smith)
Play-Learn-Lift             →  MOOLLM's systematic version of the above
Skills                      →  lifted demonstrations, inheritable as prototypes, reusable by other agents
```

### Papert: microworlds and constructionism

[Seymour Papert](../seymour-papert/README.md) (*Mindstorms*, MIT Media Lab, Logo) argued that people learn best by **constructing** things in a **microworld**: a domain simplified enough to explore freely, rich enough to carry real ideas. Logo's turtle is the canonical microworld. The computer is Proteus: it can simulate anything, so the microworld can match the learner's passion.

Will Wright's 1996 talk was literally titled *Interfacing to Microworlds* (Terry Winograd's CS547). SimCity is a city microworld. The Sims is a social microworld. Dollhouse was a dollhouse microworld. Same design move every time: **low floor** (anyone can place a zone or click a person), **high ceiling** (experts reverse-engineer dynamics), **wide walls** (sandbox, scenarios, disasters, storytelling).

**For a robot:** the teach surface is a microworld. Joint torques and planner graphs are the wrong microworld for a normal teacher. "Walk here," "wave when the bell rings," "sit when tired" is the right one.

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
| **A teachable robot (?)** | Gesture, habit, social script | Jacobian, RL reward, motion primitives |

Don worked in Brad Myers' Garnet group at CMU (~1992–93), building the PostScript driver and **GLASS** (*Graphical Layer And Server Simplifier*). Brad's *All the Widgets* (CHI '90) and visual-programming taxonomy (CHI '86 / JVLC 1990) are the map Don still cites on HN: spreadsheets **are** visual programs; PBD is a first-class category; hiding the "inner world" does not disqualify direct manipulation.

[Henry Lieberman's](../henry-lieberman/README.md) MIT work (Eager, Tinker, programming by demonstration in everyday UIs) is the same ethic: **watch what I do in context**, don't make me open an editor first.

**Design rule:** demonstration is not "record macro and replay blindly." Good PBD **generalizes**: "when I did this here, I probably mean *this kind of thing* in similar situations." That is exactly the "teach without feeling like programming" problem.

The deepest treatment of that generalization step is [Gary Drescher's](../gary-drescher/README.md) ***Made-Up Minds*** (MIT Press, 1991; see [`../gary-drescher/made-up-minds.md`](../gary-drescher/made-up-minds.md)). Drescher's **schema mechanism** is a Piagetian infant in software: it learns **context → action → result** schemas from raw experience, uses *marginal attribution* to figure out which conditions actually mattered, and spins off new, more specific schemas when a general one proves unreliable — a **schema factory** that grows its own ontology instead of being handed one. That is the missing middle of every PBD system: the demonstration is one concrete experience; the schema mechanism is the machinery that decides what the demonstration *meant*. MOOLLM's Play-Learn-Lift maps onto it directly (PLAY surfaces candidate schemas, LEARN revises and stabilizes them, LIFT publishes the reliable ones as skills), and the modern echo — schemas versus vectors versus LLM latent generalization — is exactly the conversation in [`../gary-drescher/schemas-vectors-and-llms.md`](../gary-drescher/schemas-vectors-and-llms.md). For a robot: show it a task once, and the question "what did I just mean?" is Drescher's question, verbatim.

### SimCity, The Sims, and shipped PBD

SimCity is not usually filed under PBD, but the teach loop is the same shape:

1. **Play** in a microworld (place zones, roads, bulldoze).
2. **Learn** from visible consequences (traffic, budgets, riots).
3. **Lift** mental models and stories (named districts, shared saves, classroom projects).

The Sims went further toward explicit PBD:

- **Object advertising** (see above): the world publishes affordances; the teacher picks among salient actions.
- **[SimAntics](https://modthesims.info/wiki.php?title=SimAntics)**: a visual programming language for behaviors (conditions, actions, motives) that Don implemented with Will Wright. Behaviors are **authored by demonstration-like composition** in a VPL, not by typing code. Edith demo videos are the proof that "normal people" can program social behavior when the notation matches the domain: [pie menu + SimAntics demo](https://www.youtube.com/watch?v=-exdu4ETscs) · [Sims team steering committee demo, June 1998](https://www.youtube.com/watch?v=zC52jE60KjY) · [SimAntics wiki](http://simantics.wikidot.com/) · [Ken Forbus, *Programming Objects in The Sims* (PDF)](http://www.qrg.northwestern.edu/papers/Files/Programming_Objects_in_The_Sims.pdf) · more in [`visual-programming-excel-and-dimensionality.md`](visual-programming-excel-and-dimensionality.md).
- **Players train Sims by repetition**: tell a Sim to sleep on one side of the bed a few times and they learn to prefer that side. And most importantly, players demonstrate **fun, social, and romantic behaviors between characters** — repeatedly directing two Sims to joke, flirt, insult, or fight literally *trains them to love or hate each other*, because every interaction moves the relationship scores that drive their autonomous behavior. That is programming by demonstration shipped to millions of living rooms — players were programming their Sims' hearts and habits, and no one called it programming, which was the point.

The machinery under that training is worth spelling out, because it is the same machinery a teachable robot needs. Each Sim maintains a **relationship matrix** with objects and with other people. Every interaction succeeds or fails, and the outcome feeds back into **mood**; mood and relationships in turn re-weight how the world's advertisements are **scored**, which changes what the Sim does next. Habits, grudges, and preferences aren't stored as rules anyone wrote — they *emerge* from the loop of advertised affordances, scored by state, updated by outcome.

**MOOLLM lifts this headspace directly from The Sims** — object advertisement scoring, plugin object behavior, SimAntics-style game AI, the visual-programming stance that behavior lives in the world — and reimagines it with an **LLM as the coherence engine and simulation engine**, one that understands natural language as well as code. Sims objects could only advertise what a programmer had wired in SimAntics; MOOLLM objects advertise in YAML and prose, the LLM scores salience with actual language understanding, and the same loop (advertise → score by state → act → update relationships) runs over meanings instead of just magic numbers.

How far can the "spec" stretch when the engine understands language? In MOOLLM's adventure microworld, the Wumpus is a portable character whose rules and behavior are defined not just in natural language but by the **historic 1973 BASIC source code** of Hunt the Wumpus, checked into [its character directory](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/wumpus-snorax): [`GAME.yml`](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/characters/fictional/wumpus-snorax/GAME.yml) holds the distilled rules, [`wumpus-basic-source.md`](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/characters/fictional/wumpus-snorax/wumpus-basic-source.md) holds Gregory Yob's original BASIC, and [`DODECAHEDRON.yml`](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/characters/fictional/wumpus-snorax/DODECAHEDRON.yml) holds the canonical cave map. The LLM reads fifty-year-old BASIC as fluently as prose, so the original program *is* the authoritative spec: a dead listing teaching a living character how to behave.

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

MOOLLM **Advertisements** in CARD.yml are Sims-style object scripts for LLM agents: broadcast what you can do, score by current character state, generate menus from what's salient. Same pattern as teachable robot affordances.

Other MOOLLM skills echo PBD by name: `copy-that` grows venue plugins **by example**; `cursor-mirror` treats your transcript as a demonstration to mine; `yaml-jazz` is **documentation by example** (the instance is the curriculum).

**For a robot builder:** if the teach loop works, the path is predictable:

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
| **Gary Drescher — *Made-Up Minds*** | Schema mechanism: how one demonstration becomes a general habit — [`../gary-drescher/`](../gary-drescher/README.md) |
| **Mitchel Resnick — Scratch / Lifelong Kindergarten** | Papert for the 2000s; low floor / wide walls |
| **Chaim Gingold — *Building SimCity*** | SimCity as cultural microworld; reverse diagrams — [`../chaim-gingold/`](../chaim-gingold/README.md) |
| **MOOLLM `skills/play-learn-lift/`** | Methodology Don uses now |
| **MOOLLM `skills/constructionism/`** | Filesystem = microworld; skills = constructions |

---

## What kind of object is a robot? Prototypes, roles, and pantomime horses

There is a deeper architectural question hiding under the interface question, one Don keeps returning to in conversations with **[David Ungar](../david-ungar/README.md)** (co-creator of the Self programming language) and **[David Temkin](../david-temkin/README.md)** (founder of Laszlo Systems, where Don worked on OpenLaszlo): **what kind of *thing* is a teachable entity, in computer science terms?** The answer shapes everything the teacher can and cannot do.

### Prototypes: teach by cloning, not by classifying

Most programming makes you define a **class** first — an abstract blueprint like "Robot" — and only then stamp out instances. That's backwards for teaching. Nobody teaches a child "first, the taxonomy of dogs; now, this dog." You point at a working example and say "like that, but different."

Ungar and Randall Smith's **Self** language (1987) built this insight into the machine: there are no classes, only **prototypes** — concrete working objects you **clone and tweak**. Identity is cheap. Variation is a small delta on something that already works. The taxonomy *emerges* from what people actually make, instead of being designed up front and defended forever.

That is exactly what teaching a robot by demonstration is: every taught habit is a clone-and-tweak of a working behavior. "Wave like you did yesterday, but slower, and only when Grandma arrives." A class hierarchy fights that; a prototype system *is* that. (Temkin's OpenLaszlo carried the same idea to declarative UI — Oliver Steele called it **instance-first development**: build the concrete instance, then extract the general pattern, which is Play-Learn-Lift in language-design clothing.)

### Multiple inheritance: the talking chair problem

Now the fun part. What happens when one entity is **several kinds of thing at once**?

- **Chairry** in Pee-wee's Playhouse is a chair *and* a character: you can sit on her (furniture interface) and she hugs you and talks (character interface).
- **Globey** is a globe *and* a character. Magic Screen is a display *and* a playmate.
- A **horse** is a vehicle, a co-worker, and a character with opinions about all of it.
- An **Iain M. Banks Culture ship** is the limit case: a vehicle, a *place* where millions of people live, and a person — a Mind with a name like *Of Course I Still Love You* and a personality to match. Room, character, and vehicle in one entity.
- A **pantomime horse** inverts the whole thing: **one** character presented outward, implemented by **two** players inside. Multiple interfaces inward, single interface outward — a multiplayer object.

Class-based single inheritance chokes on all of these: is Chairry a `Chair` subclass or a `Character` subclass? Pick one and you've amputated half of her. What you actually want is **multiple inheritance of roles** — or better, prototype **delegation**, where an entity simply points at several parents ("I behave like furniture *and* like a character") and can add or drop roles at runtime. A robot that is sometimes a tool, sometimes a pet, sometimes a co-worker shouldn't have to be reclassified each time; it should just wear more than one hat.

MOOLLM does this literally: a **directory is a room**, but a room can also be a character (the pub that talks back), and a character can contain rooms (a ship you walk around inside). The filesystem doesn't care; the roles are layered on by what the entity *advertises*.

And it has a live worked example: **Two-Toll the Troll, a.k.a. the Cross-Platform Troll** ([character file](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/troll)). He plugs into both Colossal Cave Adventure (1977) and Zork I (1980) and inherits a different role from each game, carried as two separate minds in one soul: the [Adventure mind](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/characters/fictional/troll/minds/adventure-mind.yml) is a toll gate priced in treasure (one per crossing, he keeps it), the [Zork mind](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/characters/fictional/troll/minds/zork-mind.yml) a combat gate priced in violence (bloody axe, blocks all passages). Dropped into a new world, he samples the local advertisements and **fronts whichever mind speaks the local currency**, blends both when a world speaks both (fight me or pay me; the adventurer picks), and when neither applies he falls back to improvising species-level troll behavior — riddles, older than either game — and learns new troll tricks that travel with him.

The Cross-Platform Troll and the pantomime horse are opposite corners of the same Self-ish prototype object system running on an LLM coherence and simulation engine. The horse is **one interface outward, two players inside**; the troll is **one player inside, two game interfaces outward**, switched and blended per world. Neither fits a class hierarchy; both are easy as prototypes with roles, once the engine resolving the roles understands language.

### Advertisements: the world knows what it's for

Which brings back the Sims insight, now in architectural terms. Instead of one giant brain that knows what every object does, **each object broadcasts its own affordances** — "eat me," "sit on me," "teach me this here" — and actors pick among what's salient given their current state. Intelligence is **distributed into the environment**.

This composes perfectly with prototypes and roles: when Chairry inherits the furniture role, she automatically advertises "sit on me"; the character role adds "talk to me." The pantomime horse advertises "ride me" outward while advertising "be my front half" and "be my back half" inward. Nobody wrote a master ontology; the advertisements *are* the ontology, and it is discoverable by walking around — which is why no manual is needed.

### The compiler takes dictation: natural language → running code

MOOLLM closes the programming-by-demonstration loop with its **adventure compiler**. You describe an object in natural language — "a talking chair like Chairry, but grumpy, and she only hugs people who say please" — as a prototype inheritance plus a natural-language specialization. The compiler resolves the inheritance chain, applies the specializations, and **generates plain JavaScript that runs in the browser with no LLM at runtime**.

The division of labor is the point:

- **Authoring time:** the LLM is the compiler. Natural language and demonstration are the source code. Expensive intelligence is spent once.
- **Play time:** the output is ordinary, deterministic, inspectable JS. It runs anywhere, costs nothing per interaction, and behaves the same every time.

This is PBD completed end to end. The demonstration or description is the program; the generated code is readable (and you *should* read it — the anti-vibe-coding ethic applies to compilers too); and the artifact outlives the session that created it.

**For a robot, same shape:** teach with LLM assistance in the loop, then compile the taught habit down to a small, fast, verifiable controller that runs on the robot **without** an LLM in the loop. The LLM helps you write the habit; it doesn't have to be awake to perform it.

### Why this matters for a teachable robot

Put the four together and the architecture writes the spec for a teachable robot:

1. **Prototypes** make every taught behavior a cheap clone-and-tweak of a working example — teaching is versioning, not authoring from scratch.
2. **Multiple roles via delegation** let the robot be tool, pet, student, and co-worker without a reclassification crisis — and let taught habits attach to the *role*, not the whole robot.
3. **Advertisements** make the teachable surface discoverable in place — the robot, its props, and its places all say what they can learn, so the manual dissolves into the world.
4. **Compilation from natural language** makes taught behavior durable and cheap — LLM at teach time, plain code at run time.

This is the thread Don is pulling with Ungar (Self, *Narcissa's Mirror*, objects all the way down) and Temkin (Laszlo's declarative prototypes, constraint-driven UI): the same handful of ideas keep resurfacing every decade because they match how people actually teach and learn — by example, by role, by pointing at things in a shared world.

---

## LLMs, vibe coding, and hard thinking

From Don's email reply (Aug 2026):

- LLMs overturn old assumptions; one best use is **learning at your own pace**.
- **Vibe coding** (not looking at generated code) forfeits the learning loop.
- The minority still willing to **read, think, and design with** an LLM are disproportionately powerful.

Related HN harvest ([48964059](https://news.ycombinator.com/item?id=48964059) — Papert query thread):

> YOU HAVE TO READ THE CODE. Refusing to do that means you're not a serious programmer, you're outsourcing your thought and design and implementation.

**For robot teaching:** an LLM can translate natural intent into motion primitives — but the human should see enough of the mapping to **correct and compose**, not just accept vibes. Same ethic as SimCity: learn the city, not the tile array.

---

## Book recommendations

Checked against Tade's bookshelf API (2026-08-16).

### Don's picks — **not yet on shelf** (high priority)

| Book | Why |
|------|-----|
| **Stanisław Lem — *The Cyberiad*** | "Trurl's Machine" (stubborn computer / simulated universe) inspired SimCity. Don's HN Lem hunt: [38744779](https://news.ycombinator.com/item?id=38744779) |
| **[Scott McCloud](../scott-mccloud/README.md) — *Understanding Comics*** | Masking, closure, simplification → Sims character readability. [27808826](https://news.ycombinator.com/item?id=27808826) |

### Already on shelf — worth re-reading for this project

| Book | Connection |
|------|------------|
| **[Don Norman](../don-norman/README.md) — *The Design of Everyday Things*** | Affordances, signifiers, discoverability — antidote to Dye-style veneer |
| **Mihaly Csikszentmihalyi — *Flow*** | Challenge/skill balance in learnable systems |
| **Isaac Asimov — robot stories / *I, Robot*** | Teaching rules vs emergent behavior (already on the shelf) |
| **Dr. Samuel Xiangming Li — *Humanoid Robotics Hardware*** | Already aligned with build |

### Additions Don would stack on top

| Book | Why |
|------|-----|
| **Seymour Papert — *Mindstorms*** | Constructionism: people learn by constructing things they care about |
| **Allen Cypher (ed.) — *Watch What I Do: Programming by Demonstration*** | PBD/PBE canon; Peridot, Garnet, Lieberman, HyperCard lineage — [acypher.com/wwid](http://acypher.com/wwid) |
| **Brad Myers — papers + *Pick, Click, Flick!* (forthcoming)** | VPL taxonomy, Garnet, C32, *All the Widgets* — [ixtbook.com](http://www.ixtbook.com/) |
| **Chaim Gingold — *Play Design* (PhD, 2016)** | SimCity as cultural artifact; reverse diagrams; microworld pedagogy |
| **[Ian Bogost](../ian-bogost/README.md) — *Persuasive Games* / procedural rhetoric** | How mechanics argue — Sims social commentary by design |
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

## Checklist for a teachable robot UI

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

- Pie menus — spatial muscle-memory controls: [30 Year Retrospective](https://donhopkins.medium.com/pie-menus-a-30-year-retrospective-5bdcb24a835a) · [`pie-menus-chi-88-and-beyond.md`](pie-menus-chi-88-and-beyond.md)  
- The Sims design documents: https://donhopkins.com/home/TheSims/ · [`the-sims-transmogrifier-mod-tools.md`](the-sims-transmogrifier-mod-tools.md)  
- SimAntics / Sims behavior VPL (Don + Will): [`visual-programming-excel-and-dimensionality.md`](visual-programming-excel-and-dimensionality.md) · [`drakon-control-flow-vs-dataflow.md`](drakon-control-flow-vs-dataflow.md)  
- CMU Garnet / Brad Myers lineage: [MicropolisCore brad-myers doc](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/brad-myers-visual-programming-hn.md) · [`../brad-myers/`](../brad-myers/GLANCE.md) · [`garnet-to-svelte-constraint-ui-lineage.md`](garnet-to-svelte-constraint-ui-lineage.md)  
- Open Micropolis / constructionist SimCity: [MicropolisCore](https://github.com/SimHacker/MicropolisCore) · [`open-sourcing-simcity-for-olpc.md`](open-sourcing-simcity-for-olpc.md)  
- MOOLLM Play-Learn-Lift + constructionism + PBD-as-skills: [moollm](https://github.com/SimHacker/moollm) — [`skills/play-learn-lift/`](https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift), [`skills/constructionism/`](https://github.com/SimHacker/moollm/tree/main/skills/constructionism), [`skills/skill/`](https://github.com/SimHacker/moollm/tree/main/skills/skill), [`skills/adventure/`](https://github.com/SimHacker/moollm/tree/main/skills/adventure)  
- MOOLLM as microworld OS — flagship talk: [`moollm-microworld-os-talk.md`](moollm-microworld-os-talk.md)

---

*Published 2026-08-16 in [WillWrightShowForFood/characters/don-hopkins/](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/don-hopkins). Prompted by Tade Mehl's Aug 2026 cold email. Sources: Gruber, Medium, YouTube, HN, Tade bookshelf API, Papert/Cypher/Myers/Lieberman/MOOLLM lineage.*

↑ Back to [Don's room](README.md) · [show ideas](ideas.md) · [show seed](teaching-complicated-systems-without-a-manual.yml) · [writing index](writing/INDEX.yml)
