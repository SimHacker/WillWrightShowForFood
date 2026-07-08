# Palm's questions — Snap! / Logo pair show 🐒

*Readable edition for Brian Harvey & Jens Mönig. **Source of truth:** [`questions.yml`](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/snap-logo-brian-jens/audience/palm/questions.yml) — this page is rendered for guests; the YAML drives the orchestrator.*

---

## Ticket

| Field | Value |
|-------|-------|
| **Show** | `snap-logo-brian-jens` |
| **Audience** | Palm (`github`) |
| **Attend live** | yes |
| **Merged** | yes |
| **Submitted** | 2026-07-08 |
| **Seeded** | yes |
| **Running gag** | yes |
| **Authored by** | curator |
| **Character ref** | [Palm CHARACTER.yml](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/palm/CHARACTER.yml) |

**Relationship**

Palm filed Theo the Logo Turtle in his field notebook after Snap!Con — worms transform, birds carry, turtles draw and sometimes even embroider. He loves the gray ring as quote: evaluation must not pass through until you choose. Warm, curious, not a gotcha — wants Brian and Jens to settle what Snap! actually ships vs what the Reference Manual promises for macros.

**Prior reading**

- [Palm's worm field notebook](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.md)
- [Metaprogramming digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snap-macros-metaprogramming.md)
- [Brian's Snap!Con 2025 Karlstrom address digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snapcon-2025-karlstrom-address.md)

**Producer note**

Palm is MOOLLM fiction — warm, philosophical, read the worm field notebook first. The show's spine is **harmonious disagreement**: rehash controversial design fights (dynamic binding, macros, MVC) not to pick a winner but to show how successfully harmonious designers resolved differences and kept shipping together. Arc: ring=quote → dynamic binding → SICP scorecard → Morphic heritage → SAP gratitude → **no grades / Buber** → **community memorial** → silly closer. Brian owns pedagogy + elders; Jens owns interpreter, Morphic, funding, and scene. The no-grades question (id 12) is the HEART beat — give Brian all the room he wants; the seventh-grade algebra teacher story and Buber's I–Thou are his to tell, not ours to summarize.

---

## Question tree

Twelve questions · priorities 1–10 · click **Zap** links for context lasers

---

### 1 · Ring as quote

| | |
|---|---|
| **To** | Brian Harvey & Jens Mönig |
| **Theme** | `ring-as-quote` |
| **Status** | open |
| **Priority** | 1 |

Brian — you said the gray ring around a procedure is lambda, and I keep thinking it's also **quote**: the gap in the ring is where evaluation stops until something explicitly calls through. Did you design the ring to be *visible* quote for kids who will never type an apostrophe? And Jens — when the ring captures an environment for a macro expansion, is that closure the same object as a lambda closure, or a different beast under the hood?

**Zap for more**

- [Metaprogramming digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snap-macros-metaprogramming.md)
- [Snap! Reference Manual — Procedures as Data](https://docs.snap.berkeley.edu/procedures-as-data/)

#### 1a · Invisible rings

| | |
|---|---|
| **To** | Brian Harvey |
| **Theme** | `invisible-rings` |
| **Status** | open |

Follow-up: Scratch `if` and `forever` already had unevaluated C-slots — invisible rings. When you added `Any (unevaluated)` for special forms, were you smuggling macro semantics in through the back door so factorial wouldn't infinite-loop?

---

### 2 · SICP in blocks — honest scorecard

| | |
|---|---|
| **To** | Brian Harvey & Jens Mönig |
| **Theme** | `sicp-in-blocks-honest-scorecard` |
| **Status** | open |
| **Priority** | 2 |

Don posted on Hacker News that everything you can do in Scheme — recursion, HOFs, closures, continuations, macros, metaprogramming — lives in Snap! through BJC. I want the honest scorecard: what's **fully** there for a kid doing SICP-shaped thinking, what's **partial** (macros?), and what would you tell a Racket user *not* to expect yet?

**Zap for more**

- [Metaprogramming digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snap-macros-metaprogramming.md)
- [Simply Scheme source notes](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/simply-scheme.md)

#### 2a · Hygiene

| | |
|---|---|
| **To** | Brian Harvey |
| **Theme** | `hygiene` |
| **Status** | open |

The Manual says hygienic macros are the main Scheme feature Snap! doesn't implement yet. You argued on the forum that FEXPR-style might be better for learners anyway — teach name-capture, skip the wizardry. Still your position? Would BJC ever need hygiene?

---

### 3 · Dynamic binding controversy

| | |
|---|---|
| **To** | Brian Harvey |
| **Theme** | `dynamic-binding-controversy` |
| **Status** | open |
| **Priority** | 2 |

Brian — I hear your most **controversial** opinion is that **dynamic binding** is better for *kids*, because you taught Logo for decades and kids grokked caller-visible variables more easily than lexical puzzle boxes. You're **for** it on pedagogy grounds, not because you hate abstraction. Can you lay out the **arguments for** (Logo MAP and ?, debugging at the REPL, one-off helpers) and the **arguments against** (name capture, interchangeable blocks, teams of 500) — and which side you still hold after Snap! shipped **lexical** scope anyway?

**Zap for more**

- [Metaprogramming digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snap-macros-metaprogramming.md)
- [Computer Science Logo Style notes](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/computer-science-logo-style.md)
- [Snap! forum — hygienic macros thread](https://forum.snap.berkeley.edu/t/hygienic-macros/3258)

#### 3a · What Snap! actually ships

| | |
|---|---|
| **To** | Brian Harvey & Jens Mönig |
| **Theme** | `snap-scope-reality` |
| **Status** | open |

So what does Snap! **actually** have — lexical only? Globals and script variables and sprite-local as special cases? Special forms and invisible rings? Something like fluid-let? Or one underlying atomic primitive (Don frames `self` as RISC for OOP) — rings plus environment, `of` for context switch, debugging hooks — vs a Rube Goldberg of scope rules? What are the minimal visual metaprogramming primitives and visual representations that you can build all the others out of?

#### 3b · Why not dynamic

| | |
|---|---|
| **To** | Jens Mönig |
| **Theme** | `why-not-dynamic` |
| **Status** | open |

Jens — you told Brian dynamic scope is horror for interchangeable blocks and costs interpreter speed. What did you ship instead when kids need caller variables — gray rings, hyperblocks, extra inputs, globals? And did any of Brian's hybrid-scope or DYNAMIC VARIABLES ideas leave fingerprints in the debugger?

#### 3c · Macros as dynamic analogue

| | |
|---|---|
| **To** | Brian Harvey |
| **Theme** | `macros-as-dynamic-analogue` |
| **Status** | open |

You used dynamic scope as a metaphor for FEXPR macros and lexical scope for hygienic macros. If Snap! never gets dynamic binding, do gray rings + caller-context macros **subsume** what you wanted from Logo's dynamic scope — or is something still missing that only dynamic lookup would fix?

---

### 4 · AST metaprogramming

| | |
|---|---|
| **To** | Jens Mönig |
| **Theme** | `ast-metaprogramming` |
| **Status** | open |
| **Priority** | 3 |

Snap! 8 gave us `split by blocks`, `join`, and `define` — blocks as syntax trees. In Lisp the metacircular evaluator falls out of list structure. In Morphic.js, did you expose what was already internal, or invent a parallel AST? And can Palm **see** inside a ringed script on stage without breaking the insulation metaphor?

**Zap for more**

- [Morphic.js notes](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/jens-monig/sources/morphic-js.yml)
- [Metaprogramming digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snap-macros-metaprogramming.md)
- [Snap! Reference Manual — Metaprogramming](https://docs.snap.berkeley.edu/metaprogramming/)

---

### 5 · Macro caller context

| | |
|---|---|
| **To** | Brian Harvey & Jens Mönig |
| **Theme** | `macro-caller-context` |
| **Status** | open |
| **Priority** | 4 |

The macro that declares script variables in the **caller** — not inside the helper — is the example that finally made macros click for me. The Manual admits macros aren't fully wired: you pass the calling script explicitly, there's no checkbox yet, users in 2023 couldn't tell macro from `call` of a ring. What's the status now — demo-ready, or still Snap!Con homework?

**Zap for more**

- [Metaprogramming digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snap-macros-metaprogramming.md)
- [Snap! forum — do macros actually work?](https://forum.snap.berkeley.edu/t/do-macros-actually-work-in-snap/14431)

#### 5a · Command macro notation

| | |
|---|---|
| **To** | Jens Mönig |
| **Theme** | `command-macro-notation` |
| **Status** | open |

Command macros stack like commands but report scripts — syntactic mismatch. Brian said maybe don't try too hard in userland until the make-a-block dialog gets a macro checkbox. Is that checkbox designed, or still arguing on the forum?

---

### 6 · Logo to Scheme lineage

| | |
|---|---|
| **To** | Brian Harvey |
| **Theme** | `logo-to-scheme-lineage` |
| **Status** | open |
| **Priority** | 5 |

You started as Logo disguised as Scratch; lambda made it Scheme disguised as Scratch. Theo the Turtle in my notebook draws lines; the ring holds a script still. Is metaprogramming the moment the turtle learns to read its own pen trails as data — or is that over-poetic?

**Zap for more**

- [Palm's worm field notebook](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.md)
- [Computer Science Logo Style notes](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/computer-science-logo-style.md)

---

### 7 · Micropolis metaprogramming

| | |
|---|---|
| **To** | Brian Harvey & Jens Mönig |
| **Theme** | `micropolis-metaprogramming` |
| **Status** | open |
| **Priority** | 7 |

Don's 2018 thread — drive Micropolis and CAM6 from Snap! blocks. If we finish it on air, is the interesting beat **simulation API** or **kids rewriting city rules** via split/join on their own custom blocks? Which would you demo first?

**Zap for more**

- [Micropolis × Snap! — Brian's thread digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/micropolis-snap-2018.md)
- [Micropolis × Snap! — Jens's thread digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/jens-monig/sources/micropolis-snap-2018.yml)

---

### 8 · SAP research funding

| | |
|---|---|
| **To** | Jens Mönig |
| **Theme** | `sap-research-funding` |
| **Status** | open |
| **Priority** | 6 |

Jens — I want the **warm** beat, not an audit. SAP supported Alan Kay's Communications Design Group, supported *you* as a researcher, and still collaborates on Snap! with Berkeley (Walldorf, Barcelona, California — Bernat, Lauren, Michael Ball, Dan Garcia, Brian). How wonderful and how *strange* is it that a business-intelligence giant funds microworlds for kids? What did "people, not projects" research culture actually buy Snap! — and what survived after CDG wound down? Would Snap! exist without SAP's patience?

**Zap for more**

- [SAP research & Snap! notes](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/jens-monig/sources/sap-research-and-snap.yml)
- [GP / Alan Kay lineage](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/jens-monig/sources/gp-alan-kay-lineage.yml)
- [SAP News — NTLS 2020 award](https://news.sap.com/2020/11/snap-jens-moenig-ntls-education-technology-leadership-award/)
- [The Art of Research — CDG history](https://theartofresearch.org/a-history/)

#### 8a · Kay CDG to Snap!

| | |
|---|---|
| **To** | Jens Mönig |
| **Theme** | `kay-cdg-to-snap` |
| **Status** | open |

You worked under Kay on GP before Snap! — then SAP hosted Kay's CDG with Bret Victor and Vi Hart. Is there a through-line from that lab to Morphic.js and Snap!, or did enterprise research and BJC pedagogy stay in parallel lanes that only you connected?

#### 8b · openSAP & Young Thinkers

| | |
|---|---|
| **To** | Jens Mönig & Brian Harvey |
| **Theme** | `openSAP-young-thinkers` |
| **Status** | open |

SAP News says Snap! powers openSAP, Young Thinkers, Meet and Code — while BJC reaches kids through Berkeley. Does that feel like one mission with two doors, or two different Snap! audiences you each optimize for?

---

### 10 · Morphic heritage vs MVC

| | |
|---|---|
| **To** | Jens Mönig |
| **Theme** | `morphic-heritage-mvc` |
| **Status** | open |
| **Priority** | 4 |

Jens — walk me through the **heritage of Morphic**: Self's direct-manipulation UI, Dan Ingalls' Lively Kernel in the browser, what you're building in Morphic.js today, and how Snap! actually uses it under the blocks. Smalltalk's antique **Model–View–Controller** got cargo-culted into everything — interactive GUIs, web server frameworks, client-side SPA stacks — until the words barely mean anything. Morphic was the live-object answer: morphs all the way down, edit the IDE while it runs. Why did MVC win the textbook and job-interview lottery while Morphic never got the same love — even from people who claim to admire Smalltalk?

**Zap for more**

- [Morphic.js notes](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/jens-monig/sources/morphic-js.yml)
- [GP / Alan Kay lineage](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/jens-monig/sources/gp-alan-kay-lineage.yml)
- [Dan Ingalls — Repo Show seed](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/dan-ingalls/README.md)
- [Alan Kay — OOP, messaging, MVC origin](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/alan-kay/media/quora-recaps/oop-messaging-and-what-comes-next.md)
- [morphic.js in Snap! repo](https://github.com/jmoenig/Snap/blob/master/morphic.js)
- [Lively Kernel](https://lively-kernel.org/) · [lively.next (active successor)](https://lively-next.org/)
- [MOOLLM — SELF-ISH influences](https://github.com/SimHacker/moollm/blob/main/designs/SELF-ISH-INFLUENCES.md)

#### 10a · Scratch morph to Morphic.js

| | |
|---|---|
| **To** | Jens Mönig |
| **Theme** | `scratch-morph-to-morphicjs` |
| **Status** | open |

Scratch already had morphic-style sprites on a stage. When you forked toward BYOB/Snap! and rewrote the substrate as Morphic.js, what did you **keep** from Scratch's implementation and what did you have to reinvent because the browser isn't Squeak?

#### 10b · Lively Kernel lineage

| | |
|---|---|
| **To** | Jens Mönig |
| **Theme** | `lively-kernel-lineage` |
| **Status** | open |

Did Ingalls' Lively Kernel directly inspire Morphic.js — same object graph in a web page, saveable live worlds — or were you solving a parallel problem from the Scratch/GP/SAP side without looking over Dan's shoulder?

---

### 12 · No grades — friendship, Buber, and the seventh-grade algebra teacher

| | |
|---|---|
| **To** | Brian Harvey |
| **Theme** | `no-grades-friendship-buber` |
| **Status** | open |
| **Priority** | 8 |

Brian — the beat I most want the full version of: **no grades**. At Lincoln-Sudbury you negotiated no grades for the computer center, and you've said that's what made friendship possible — with grades you're a hurdle, not a friend. Don remembers you telling a story about your **seventh-grade algebra teacher** — someone who, by your own telling, didn't teach you much algebra, but became a **friend**, and that mattered more. Tell that story here, whole. Then make the strong claim explicit: grading doesn't just stress kids out — it **spoils the relationship** between teacher and student. If a teacher's real purpose is holistic — building a relationship, showing ways to lead lives together, not just transmitting content — what does that mean concretely for how we should run classrooms, and what did CCUS prove that schools still refuse to hear?

**Zap for more**

- [Brian's Snap!Con 2025 Karlstrom address digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snapcon-2025-karlstrom-address.md)
- [Cleaned transcript of the live talk](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snapcon-2025-karlstrom-address-transcript.md)
- [Martin Buber](https://en.wikipedia.org/wiki/Martin_Buber)
- [Karlstrom address video](https://www.youtube.com/watch?v=pDK2PE_pkqQ)

#### 12a · Martin Buber — philosophy of education

| | |
|---|---|
| **To** | Brian Harvey |
| **Theme** | `martin-buber-philosophy` |
| **Status** | open |

When you said teaching is more than the transferral of skills, the moderator offered you **Martin Buber** — teachers have the purpose of building a relationship, ways to lead lives together. Do you accept the gift? Is Buber's I–Thou (dialogue, whole persons) versus I–It (skill transfer, assessment objects) the right frame for what CCUS was — and where do you see I–It thinking hiding in today's classrooms (assessment spreadsheets, self-check questions, AI tutors) dressed up as progress?

#### 12b · No grades in the Snap! world

| | |
|---|---|
| **To** | Jens Mönig |
| **Theme** | `no-grades-in-snap-world` |
| **Status** | open |

Jens — in the Karlstrom Q&A a Dutch math teacher stood up and said he'd had Brian-style teachers in the 70s — slept at their houses, holidays together — and thanked Brian "for celebrating the 20th century" because the 21st forbade him the same. Snap!'s own world — the forum, Snap!Con, openSAP, Young Thinkers — runs mostly without grades. Is that no-grades ethos something you protect **by design**, and where does it collide with schools that want Snap! but also want the spreadsheet?

#### 12c · Unconditional positive regard — Hargreaves, honestly

| | |
|---|---|
| **To** | Brian Harvey |
| **Theme** | `unconditional-positive-regard-hargreaves` |
| **Status** | open |

An audience member said you embody **Hargreaves's "unconditional positive regard"** for students irrespective of relationship issues — and that the assessment problem "never goes away; you just have to tackle it, not assume there's some magic solution." You answered with the most honest thing in the whole Q&A: *"There were kids I didn't like… I was not a good teacher for those kids. So, you know — not perfect."* And he pushed back: you're not ALLOWED to not like a kid when you're a teacher, because you have to be fair in your grading of that kid. Stay in that uncomfortable spot for me: can unconditional positive regard actually be practiced, or only aimed at? And is his other point right — that educators like you **shape computer science itself** through educative purpose, rather than accepting it from professionals who think they know what they're doing? (Lambda in Snap! says yes.)

---

### 11 · Community memorial — lessons from people

| | |
|---|---|
| **To** | Brian Harvey & Jens Mönig |
| **Theme** | `community-memorial-lessons` |
| **Status** | open |
| **Priority** | 9 |

Brian and Jens — we've been digging up your old **design arguments** on purpose: dynamic binding, macros, MVC vs Morphic. The interesting part isn't who won — it's that you kept building together. So I want the **people** beat: who from your Logo / blocks / BJC / Snap!Con world do you **miss**, want to memorialize, or still hear teaching when you make a design choice? Not a eulogy contest — name someone who isn't in the room enough (or isn't anymore) and one lesson we should still learn from them. What would you want this repo to remember?

**Zap for more**

- [Brian's Snap!Con 2025 Karlstrom address digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snapcon-2025-karlstrom-address.md)
- [Jens's Karlstrom intro digest](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/jens-monig/sources/snapcon-2025-karlstrom-intro.yml)
- [Cynthia Solomon — character room](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/cynthia-solomon/CHARACTER.yml)
- [Old band back together](https://github.com/SimHacker/WillWrightShowForFood/blob/main/process/old-band-back-together.yml)
- [Computer Science Logo Style notes](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/computer-science-logo-style.md)
- [Simply Scheme notes](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/simply-scheme.md)
- [Beauty and Joy of Computing notes](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/beauty-and-joy-of-computing.md)

#### 11a · Brian's teachers and elders

| | |
|---|---|
| **To** | Brian Harvey |
| **Theme** | `brian-teachers-and-elders` |
| **Status** | open |

Brian — CCUS, "every kid needs a *me* teacher," Papert's turtle, Hal Abelson's foreword, Dan Garcia carrying BJC activism — who shaped your pedagogy and what do you still quote when Jens ships something you wouldn't have chosen?

#### 11b · Jens's scene and colleagues

| | |
|---|---|
| **To** | Jens Mönig |
| **Theme** | `jens-scene-and-colleagues` |
| **Status** | open |

Jens — Scratch team, GP under Kay, Snap!Con Barcelona (TurtleStitch, Cynthia Solomon, the old band), SAP colleagues who funded patience — who from your scene do you wish more newcomers knew by name, and what did they teach you about **non-competitive** community?

---

### 9 · Silly closer — ring bracelet

| | |
|---|---|
| **To** | Brian Harvey |
| **Theme** | `ring-gap-silly` |
| **Status** | open |
| **Priority** | 10 |

Silly closer: if I ringify a `say` block and drop it in a `list`, does the speech balloon wait in the list like Schrödinger's greeting until `run` opens the ring — and can Theo the Turtle wear the ring as a bracelet? Also, are there any cool Snap! designs, swag, and jewelry I can embroider and 3D print?

---

## Meta

| Field | Value |
|-------|-------|
| **MOOLLM stack** | `CHARACTER.yml`, `CARD.yml` |
| **Question tree schema** | [schemas/question-tree.yml](https://github.com/SimHacker/WillWrightShowForFood/blob/main/schemas/question-tree.yml) |
| **Source digest** | [snap-macros-metaprogramming.md](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snap-macros-metaprogramming.md) ([yml girder](https://github.com/SimHacker/WillWrightShowForFood/blob/main/characters/brian-harvey/sources/snap-macros-metaprogramming.yml)) |
| **Rendered from** | [questions.yml](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/snap-logo-brian-jens/audience/palm/questions.yml) |

↑ [Palm README](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/snap-logo-brian-jens/audience/palm/README.md) · [pair show](https://github.com/SimHacker/WillWrightShowForFood/blob/main/repo-shows/snap-logo-brian-jens/README.md) · [Brian](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/brian-harvey) · [Jens](https://github.com/SimHacker/WillWrightShowForFood/tree/main/characters/jens-monig)
