# Ideas for a Repo Show with Scott Adams 🗺️

*Segment catalog for the show proposal — pick any subset; no fixed order. Grounded in Scott's
public work and **verified Jan 2026 correspondence** (warm contact; likes MOOLLM). Confirm before
long on-air quotes.*
[Portrayal standards](../../schemas/portrayal-standards.yml) · [invitation](invitation.md) · [SHOW.yml](SHOW.yml)

*(Scott Adams the **adventure-game pioneer** — Adventureland, Adventure International — not the
Dilbert cartoonist.)*

## How to use this file

Each idea is a **segment seed**: a cold open, a live build, or a conversation beat. A single stream
might use three; a mini-series might spread them across episodes. **Zero homework** for Scott —
Don prepares artifacts; Scott picks what sounds fun on the day.

| Tag | Meaning |
|-----|---------|
| 🎙️ | Mostly talk — archive, story, design retrospective |
| 🔧 | Live build — adventure compiler, MOOLLM, browser artifact |
| 🎮 | Play — audience or Scott tries a mini-adventure |
| 📜 | Primary source — Scott's engine, Don's Logo Adventure, HN thread |
| 🤝 | Mutual — Scott's biography rooms + Don's tooling |

---

## Anchor segments (strong openers)

### A1. The Hacker News reunion 🎙️📜
**Beat:** Don's method-of-loci comment on [HN `29330901`](https://news.ycombinator.com/item?id=29330901);
Scott's warm reply; how a thread buried in search becomes a **room** once it's in the corpus.
**Payoff:** "Some stories don't exist until someone hands you the door."
**Artifact:** thread link; optional compiled mini-room from the comment text.

### A2. "Sucked me in" — MOOLLM first impressions 🎙️
**Beat:** Scott's January note — MOOLLM has **tremendous potential**; he's **also thinking about MOOLLM**.
Don walks one room (`skills/adventure/`: GLANCE → CARD → SKILL) without preaching.
**Payoff:** Same shape as Scott's engine: small interpreter, big world in data.
**Artifact:** [github.com/SimHacker/moollm](https://github.com/SimHacker/moollm)

### A3. Adventureland in sixteen kilobytes 🎙️
**Beat:** 1978, TRS-80, first commercial microcomputer text adventure. Not nostalgia — **engineering**:
what had to be true for the whole product to ship.
**Payoff:** Constraints as a design tool, not a footnote.
**Ask Scott:** What did you refuse to put in the engine because it wouldn't fit?

### A4. The engine was always a compiler 🎙️🔧
**Beat:** Adventure-as-**database** + portable **driver** per machine = compile once, run everywhere.
Trace on a whiteboard: Scott → Don's **Logo Adventure** (Logo REPL as parser) → adventure compiler → MOOLLM.
**Payoff:** Four decades, one architecture.
**Artifact:** [`characters/don-hopkins/career/lineage.yml`](../../characters/don-hopkins/career/lineage.yml)

---

## The lineage thread (deep cuts)

### L1. Logo Adventure — the missing link 🎙️📜
**Beat:** Don's Terrapin Logo Adventure: adventure-map editor + Logo REPL as the text parser — paid,
shipped on the C64 Examples disk. Same trick MOOLLM plays with the LLM chat REPL.
**Payoff:** Scott's verb-noun table and Don's Logo prompt are both **legible parsers**.

### L2. Colossal Cave → Infocom → Scott → MUD → MOO → MOOLLM 🎙️
**Beat:** Crowther/Woods rooms-and-objects grammar; Infocom's luxury; Scott's **portable VM**;
Bartle's MUD; Curtis's LambdaMOO; Don's name echo **MOOLLM = MOO + LLM**.
**Payoff:** MOOLLM skill lineage cites Scott Adams Adventures explicitly.

### L3. DreamScape → iLoci → biography rooms 🎙️
**Beat:** Kaleida ScriptX presentation memory palace (rearrange slides on the map **while presenting**)
→ iLoci iPhone palace → Scott's **playable biography** on the web. Same user gesture: **walk to learn**.
**Artifact:** Don's [`talks/past/dreamscape-wwdc-1995.yml`](../../../DonHopkins/talks/past/dreamscape-wwdc-1995.yml) (stub)

### L4. Pie menus as radial room exits 🎙️🔧
**Beat:** Direct manipulation verb-picker for a modeled world — CHI'88 to The Sims to MOOLLM.
Optional: radial menu to pick the next segment on air (audience votes a direction).

---

## Scott's biography project (mutual build)

### B1. NotebookLM corpus vs. navigable palace 🤝🎙️
**Beat:** Scott feeds Gemini/NotebookLM thousands of emails, interviews, articles. Don's counter:
once material is **rooms and objects**, it's navigable forever — not dependent on RAG recall or
web search ranking.
**Ask Scott:** What didn't surface until you uploaded it yourself?

### B2. Mini-adventures that unlock narrative 🤝🔧🎮
**Beat:** Scott's structure: readers **play on a webpage** to get the next chapter. Don compiles
YAML adventure data → self-contained browser page (adventure compiler pipeline).
**Homeplay:** Author one room together; ship the page before credits roll.

### B3. HN thread as Room One 🤝🔧
**Beat:** Compile Don's method-of-loci comment + Scott's reply into a two-room mini-adventure;
the "prize" is a transcluded essay or audio clip from the biography corpus.
**Payoff:** Proof that compiler tooling serves **Scott's** project, not just Don's demo.

### B4. Verb-noun gates for real chapters 🤝
**Beat:** Scott's two-word parser as **deliberate friction** — you only unlock the Questprobe chapter
after `EXAMINE MARVEL` or `GO PUBLISHING`. Legibility vs. LLM mush.
**Ask Scott:** Where should the reader work for it vs. get it free?

### B5. Parallel palaces 🤝
**Beat:** Don's career memory palace (`characters/don-hopkins/`) and Scott's biography — two authors,
same compiler, swap seed YAML files as PRs. Mutual seed exchange on air.

---

## Parser vs. LLM (the craft debate)

### P1. Two words that fit 🎙️
**Beat:** Why verb-noun was not laziness — it was **memory accounting** and player legibility.
**Ask Scott:** What verbs did every game need? What nouns did you refuse to implement?

### P2. What LLMs buy authors 🎙️
**Beat:** Free-form input, inference, paraphrase, procedural variation. Where Scott is taking AI
for **authoring**, not just playing.

### P3. What LLMs cost 🎙️
**Beat:** Determinism, replay, fairness, speedrun integrity, "did the game actually support that?"
The speedrun community and the IF community both care about **provable state**.

### P4. Hybrid parser — deterministic core, LLM skin 🔧
**Beat:** MOOLLM adventure skill: deterministic transforms + LLM dungeon master. Scott's engine
table + natural language suggestions that map back to legal verbs.
**Live demo:** Illegal command gracefully rejected; legal command narrated richly.

### P5. The DM is not the author 🎙️
**Beat:** Separation of concerns: **world data** (Scott's database) vs. **narration layer** (LLM).
Don't let the model retcon your biography.

---

## Adventure International history

### H1. Founding a game company from a hobby 🎙️
**Beat:** Adventureland → Adventure International; selling adventures by mail; the 1980s IF business.
**Ask Scott:** What would you do differently if you started today with the same 16K?

### H2. Pirate Adventure with Alexis Adams 🎙️
**Beat:** Co-design, family business, early collaborative authoring.

### H3. Questprobe and Marvel 🎙️
**Beat:** Licensed superheroes in a two-word world — constraints of IP, parser, and platform.
**Audience hook:** `EXAMINE HULK` — what did the license allow?

### H4. Porting war stories 🎙️
**Beat:** One database, many interpreters — TRS-80, Apple ][, Atari, VIC-20, C64. What broke on
each port?

### H5. The count, the castle, the odyssey 🎙️
**Beat:** Tour one classic title's **map design** — how few rooms carry how much story.

---

## Live build segments (Repo Show payoff)

### G1. YAML in, webpage out 🔧
**Beat:** Author `rooms/`, `objects/`, `actions/` in YAML; lint; compile to single HTML/JS artifact.
**Duration:** 20–40 min with audience Q&A.

### G2. Compile Adventureland-shaped toy world 🔧🎮
**Beat:** Not cloning Scott's IP — a **homage grammar**: six rooms, three items, ten verbs. Prove
the pipeline; Scott critiques the data format.

### G3. MOOLLM room walk + compile 🔧
**Beat:** `cd` into `skills/adventure/`; read GLANCE; compile a room from the repo itself as meta-demo.

### G4. Audience PR adventure 🔧🎮
**Beat:** Viewers submit a room YAML in chat/issue; compile mid-stream; Scott playtests blind.

### G5. Biography room zero 🔧🤝
**Beat:** Scott dictates one real room from his life (public fact only); Don types YAML; page ships.

---

## Crossover with Don's other work

### X1. MOOLLM microworld OS talk (nested) 🎙️
**Beat:** Telescoping keynote segment — outer room MOOLLM, inner room Scott's engine. See Don's
[`talks/moollm-microworld-os/TALK.yml`](../../../DonHopkins/talks/moollm-microworld-os/TALK.yml).

### X2. Empathy and Servitude (robot films) 🎙️
**Beat:** Optional cold open if robotics audience — Stupid Fun Club one-minute movies; wizard-of-oz
tele-op; then pivot to **text** adventures and legible parsers. Surprisingly connected: how people
talk to machines they don't understand.

### X3. Will Wright / microworld morality 🎙️
**Beat:** Simulation games and IF both ask: what state is **true** in the world? Procedural rhetoric
without graphics.

### X4. MUD1 and Richard Bartle 🎙️
**Beat:** Multi-user navigable worlds — invite Bartle as future guest or cite MUD lineage; Scott's
single-player engine vs. Bartle's multi-player world.

---

## Episode shapes (pick a format)

### One-shot (90 min)
1. A1 HN reunion → A3 sixteen K → A4 compiler lineage → G1 YAML in/page out → B2 unlock narrative.

### Two-parter
- **Ep 1 — History:** A3, H1–H5, P1, L1
- **Ep 2 — Future:** A2, B1–B5, P2–P4, G5 biography room zero

### Mini-series (Repo Show season)
| Ep | Title seed | Core ideas |
|----|------------|------------|
| 1 | **Sixteen K** | A3, H4, P1, G2 |
| 2 | **The Compiler** | A4, L1, L2, G1 |
| 3 | **Parser vs. LLM** | P1–P5, G4 |
| 4 | **Biography Rooms** | B1–B5, G5, B3 |
| 5 | **Palace Buddies** | B5, L3, X1, audience PR |

### Workshop stream (hands-on)
G1 + G4 + B2 — audience authors; Scott playtests; Don compiles; no lecture longer than 5 min.

---

## Audience participation (warm, not gotcha)

- **Vote the verb:** pie menu of next segment (DreamScape, Questprobe, compiler live, biography).
- **Speedrun the toy world:** chat tries to finish the homage adventure first.
- **Noun submission:** suggest a noun; if it fits the schema, Don adds it live (Scott approves).
- **Transclude, don't copy-paste:** Ted Nelson spirit — links and visible connections, not invisible clipboard.

---

## Questions worth asking Scott (if he's game)

- What was the smallest adventure that still felt complete?
- Did players ever break the parser in ways you didn't expect?
- What would an adventure **authoring tool** have looked like in 1982 if you'd had one?
- Where does NotebookLM help your biography — and where does it hallucinate?
- What must stay **deterministic** in your playable biography no matter how good the LLM gets?
- If MOOLLM had existed in 1978, what would you have put in the first room?

---

## Artifacts index

| Artifact | Link |
|----------|------|
| MOOLLM repo | https://github.com/SimHacker/moollm |
| Adventure skill | https://github.com/SimHacker/moollm/blob/main/skills/adventure/SKILL.md |
| Adventure compiler vision | https://github.com/SimHacker/moollm/blob/main/designs/PR-ADVENTURE-COMPILER-VISION.md |
| Don lineage | [characters/don-hopkins/career/lineage.yml](../../characters/don-hopkins/career/lineage.yml) |
| Scott guest page | [characters/scott-adams/](../../characters/scott-adams/) |
| HN thread | https://news.ycombinator.com/item?id=29330901 |
| Wikipedia (game designer) | https://en.wikipedia.org/wiki/Scott_Adams_(game_designer) |

---

## Provenance

- Scott's engine, Adventureland, Adventure International: public record + Wikipedia.
- Jan 2026 correspondence ("sucked me in," "tremendous potential," biography mini-adventures, MOOLLM interest): **VERIFIED via Don** — confirm before long quotes on air.
- Don's Logo Adventure, MOOLLM, adventure compiler: Don's repos and lineage files.

*Last updated: 2026-07-01 — grows as segments get tried on stream.*
