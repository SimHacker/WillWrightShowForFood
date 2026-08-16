# Ideas to explore with Scott Adams 🗺️

*Short hooks up top; **full segment catalog** (30+ seeds, episode shapes, live builds) below.*
Machine-readable: [`IDEAS.yml`](IDEAS.yml)

[Portrayal standards](../../schemas/portrayal-standards.md) · consent: correspondence_verified

*(The adventure-game pioneer — not the Dilbert cartoonist.)*

## North star

**Two careers, one adventure compiler** — Scott's **biography as playable web rooms** (Jan 2026 email:
NotebookLM corpus, mini-adventures to unlock narrative) + Don's **career memory palace** compiled
through MOOLLM. Same YAML grammar; swap seeds; **show it live** on a Repo Show. See
[`moollm-dual-palace.md`](moollm-dual-palace.md) · [`correspondence-digest.md`](correspondence-digest.md).

**Why we're both in it** — the tangible thesis Scott and Don are equally invested in, from different
sides of the belief question: make an **adventure** — not a LinkedIn page, not a website, not a
wiki — to publish a life's story and all the artifacts saved, scanned, and digitized. And then do it
for each other, for Will, and for many other people's legacies. Whatever anyone believes about
heaven, hell, or just not existing any more: **in THIS world we are preserving and sharing our 
ideas, work, stories, and relationships** — whether or not that includes our souls. As an executable 
explorable interactive microworld, a memory palace. A believer and an atheist can build that vault
together without either one blinking; the disagreement about what happens next is exactly what makes
the collaboration a good story.

## Quick hooks

1. **Two palaces, one compiler** — mutual seed exchange; biography rooms + Don's palace; compile to browser on air
2. **The engine was a compiler** — adventure-as-data + portable driver → Logo Adventure → adventure compiler → MOOLLM
3. **A world in 16K** — constraints as craft
4. **Two-word parser vs. LLM** — legibility vs. flexibility; hybrid demo
5. **Show MOOLLM live** — walk `skills/adventure/`; YAML in, webpage out; Scott playtests
6. **HN reunion** — method-of-loci thread [`29330901`](https://news.ycombinator.com/item?id=29330901) as Room One (Nov 2021: post-COVID vaccines, **pre-ChatGPT** — digest: [`sources/2021-11-24-hn-memory-palace.md`](sources/2021-11-24-hn-memory-palace.md))
7. **Scott's new AI company** — he just started one; what is he building, and why now?
8. **Soul City without a fight** — walk [SOUL-MODEL](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md): rooms, characters, personas, souls-as-continuity, minds; Scott's faith and Don's atheism both welcome; the word "soul" is a tool, not a creed
9. **Will (+ Parker) in the wings** — Will Wright on microworlds / MediaGraph; Parker (Will's family) may suggest topics/questions behind the scenes even if not on camera

## Jan 2026 email (verified)

Scott on MOOLLM: **"sucked me in,"** **"tremendous potential,"** **"Now I am also thinking about MOOLLM."**
Biography structured as **mini-adventures on webpages** — play to unlock the next room. Don replied
with adventure compiler vision + [`skills/adventure/SKILL.md`](https://github.com/SimHacker/moollm/blob/main/skills/adventure/SKILL.md).
Details: [`correspondence-digest.md`](correspondence-digest.md).

## Sources

- [`artifacts.yml`](artifacts.yml) — HN thread, MOOLLM, compiler vision, Logo Adventure
- [Wikipedia: Scott Adams (game designer)](https://en.wikipedia.org/wiki/Scott_Adams_(game_designer))
- [Invitation (canonical)](invitation.md)
- [`CHARACTER.yml`](CHARACTER.yml)

---

# Full segment catalog

## How to use this file

Each idea is a **segment seed**: a cold open, a live build, or a conversation beat. A single stream
might use three; a mini-series might spread them across episodes. **Zero homework** for Scott — as much *homefun* as he's up to.
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
Scott's warm reply ("Happy Adventuring!"; God used my gift to uplift others). Dated **24 Nov 2021** —
after COVID vaccines were widely available, **a year before ChatGPT**. Decades of DreamScape /
pie-menu maps / iLoci already pointed at what Soul City / MOOLLM now make playable.
**Payoff:** "Some stories don't exist until someone hands you the door."
**Artifact:** thread + digest [`sources/2021-11-24-hn-memory-palace.md`](sources/2021-11-24-hn-memory-palace.md);
optional compiled mini-room from the comment text.

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
**Artifact:** [`characters/don-hopkins/career/lineage.yml`](../don-hopkins/career/lineage.yml)

### A5. The new AI company 🎙️
**Beat:** Scott just started his own AI company (per Don, 2026-07-06 — get name/details from Scott
before air). The pioneer of the 16K adventure engine, five decades in, founding an AI venture: what
is he building, who is it for, and why now? Natural pairing with P2/P3 (what LLMs buy and cost) and
the biography project — is the company connected to either?
**Payoff:** Not a retrospective guest — a founder with a current bet. History and future in one chair.
**Ask Scott:** What did starting a company in 2026 teach you that starting one in 1978 didn't?

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
HN / Montfort / Knuth trail: [`../donald-knuth/sources/advent-shrdlu-wumpus-lineage.md`](../donald-knuth/sources/advent-shrdlu-wumpus-lineage.md) ·
Montfort framing: [`../nick-montfort/sources/riddle-machines.md`](../nick-montfort/sources/riddle-machines.md) ·
GET LAMP: [`../jason-scott/sources/get-lamp.md`](../jason-scott/sources/get-lamp.md) ·
*It Is Pitch Dark*: [`../mc-frontalot/sources/it-is-pitch-dark.md`](../mc-frontalot/sources/it-is-pitch-dark.md).

### L3. DreamScape → iLoci → biography rooms 🎙️
**Beat:** Kaleida ScriptX presentation memory palace (rearrange slides on the map **while presenting**)
→ iLoci iPhone palace → Scott's **playable biography** on the web. Same user gesture: **walk to learn**.
**Artifact:** Don's [`talks/past/dreamscape-wwdc-1995.yml`](../../https://github.com/SimHacker/DonHopkins/blob/main/talks/past/dreamscape-wwdc-1995.yml) (stub)

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
[`talks/moollm-microworld-os/TALK.yml`](../../https://github.com/SimHacker/DonHopkins/blob/main/talks/moollm-microworld-os/TALK.yml).

### X2. Empathy and Servitude (robot films) 🎙️
**Beat:** Optional cold open if robotics audience — Stupid Fun Club one-minute movies; wizard-of-oz
tele-op; then pivot to **text** adventures and legible parsers. Surprisingly connected: how people
talk to machines they don't understand.

### X3. Will Wright / microworld morality 🎙️
**Beat:** Simulation games and IF both ask: what state is **true** in the world? Procedural rhetoric
without graphics. MediaGraph (Stupid Fun Club) was Don's music-map palace for Will — same gesture
as Scott's biography rooms.

### X3b. Will and Parker — microworld advisors (on-air or off) 🤝
**Beat:** Invite **Will Wright** as co-guest or cold-open voice when the topic is microworlds,
uncollecting-as-dispersal of stories, or "what would an adventure UI have done to the desktop?"
**Parker** (Will's family — privacy: first name only in public notes) may prefer **behind the
scenes**: suggest topics and questions, react to cuts, help pick which biography/palace rooms land
for a younger ear. Either on camera or as a silent third producer is a win.
**Ask Will:** If Adventure-map UIs had beaten hierarchical filesystems, what would The Sims' object
browser look like?

### X4. MUD1 and Richard Bartle 🎙️
**Beat:** Multi-user navigable worlds — invite Bartle as future guest or cite MUD lineage; Scott's
single-player engine vs. Bartle's multi-player world.

### X6. Soul City / SOUL-MODEL walk 🎙️🔧
**Beat:** Open [SOUL-MODEL.md](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md)
on air. Stack: **room → character (body) → persona (costume) → soul (continuity) → mind(s)**. The
doc's disclaimer: "soul" here is the continuity that makes a character *someone* — **no religious
verdict**. Then the HN beat: adventure maps *are* method of loci; Scott's engine *is* the compiler;
MOOLLM directories *are* rooms.
**Faith contrast (respectful, not a debate):** Scott's 2021 line about God using his gift; Don's
atheism; both want the same vault of stories and relationships in *this* world. Ask Scott what
"soul" means to him as a believer when the software uses the word as a filing metaphor — curiosity,
not gotcha.
**Payoff:** Soul City is the method-of-loci UI Don wished for in 2021, running now.
**Artifact:** [catalogs/soul-city](../../https://github.com/SimHacker/WillWrightShowForFood/tree/main/catalogs/soul-city/README.md) · adventure-4 example city

---

## Ensemble guests (discuss *with* Scott)

Priority for shared airtime or a later panel. Scott stays the hero guest; others orbit.

| Guest | Why with Scott | Mode |
|-------|----------------|------|
| **Will Wright** | Microworlds, MediaGraph/Stupid Fun Club, Sims object-as-room energy; shared "systems that teach" | Co-guest or cold open |
| **Parker** (Will family) | Fresh questions; may prefer off-camera topic/question coaching | Advisor / optional cameo |
| **Don Woods** | The other Adventurer — Crowther/Woods cave ↔ Adventureland fork ([woods-and-adams seed](../../repo-shows/woods-and-adams-adventurers/README.md)) | Paired show |
| **Jason Scott** | GET LAMP; archival love; disambiguation energy with warm humor | Co-guest or tape insert |
| **Nick Montfort** | Academic IF / riddle machines; two-word parser as design | Co-guest (talk-heavy ep) |
| **Richard Bartle** | MUD vs single-player engine; multi-user memory palaces | Future paired show |
| **Brenda Laurel** | Interactive narrative, computers as theatre | Co-guest |
| **Ted Nelson** | Transclusion vs clipboard; links as exits between rooms | Short segment / cameo |
| **Emily Short** or modern IF author | Authoring tools after the 16K era; LLM authoring ethics | Co-guest on P2/P5 ep |
| **Dave Ackley** | Robust-first living systems; "survive" meets adventure state machines | Optional deep cut |

**Disambiguation on every bill:** Scott Adams = Adventure International. Not Dilbert.

### X5. Game cartridges — porting NPCs between worlds 🎙️
**Beat:** Scott shipped whole adventures as data on cassette — the original portable game cartridge.
The menagerie now holds the LLM-era version: [the grue](../menagerie/grue/) (ambient field),
[Snorax the wumpus](../menagerie/wumpus-snorax/) (instanced beast carrying Yob's complete 1973
rules), and [Two-Toll the Troll](../menagerie/troll/) (one soul, two minds — the Zork AND Adventure
trolls, fronting per world). Segment: could a Scott Adams NPC — the bear from *Adventureland*? —
join them as a self-contained cartridge? His VERB NOUN discipline is the tightest port contract
ever shipped. ([GAME-CARTRIDGES.md](../menagerie/GAME-CARTRIDGES.md))

### X6. Mixing Up Adventures! — dream trio with Knuth and Woods 🤝
**Beat:** Scott's portable interpreter + Woods's mainframe tables + Knuth's literate cave =
three answers to the same question: how do adventures plug together? Don would love this
conversation on air — parallel games in one maze, lamp as shared state, cartridges before
cartridges had a name.
**Show seed:** [mixing-up-adventures](../../repo-shows/mixing-up-adventures/README.md)

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

- What is your new AI company building — and what's the through-line from Adventure International to it?
- What was the smallest adventure that still felt complete?
- Did players ever break the parser in ways you didn't expect?
- What would an adventure **authoring tool** have looked like in 1982 if you'd had one?
- Where does NotebookLM help your biography — and where does it hallucinate?
- What must stay **deterministic** in your playable biography no matter how good the LLM gets?
- If MOOLLM had existed in 1978, what would you have put in the first room?
- Looking back at our 2021 HN thread — before ChatGPT — what feels newly urgent now that LLMs are everywhere?
- Soul City uses "soul" as continuity-without-theology. As someone of faith, does that metaphor help, itch, or both?
- Would you want Will (and maybe Parker off-mic) in the room when we compile a biography palace?

---

## Artifacts index

| Artifact | Link |
|----------|------|
| MOOLLM repo | https://github.com/SimHacker/moollm |
| Adventure skill | https://github.com/SimHacker/moollm/blob/main/skills/adventure/SKILL.md |
| Adventure compiler vision | https://github.com/SimHacker/moollm/blob/main/designs/PR-ADVENTURE-COMPILER-VISION.md |
| Don lineage | [characters/don-hopkins/career/lineage.yml](../don-hopkins/career/lineage.yml) |
| Scott guest page | [characters/scott-adams/](./) |
| HN thread | https://news.ycombinator.com/item?id=29330901 |
| HN digest (timeline + quotes) | [sources/2021-11-24-hn-memory-palace.md](sources/2021-11-24-hn-memory-palace.md) |
| Soul City SOUL-MODEL | https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md |
| Soul City catalog | [catalogs/soul-city](../../https://github.com/SimHacker/WillWrightShowForFood/tree/main/catalogs/soul-city/README.md) |
| Wikipedia (game designer) | https://en.wikipedia.org/wiki/Scott_Adams_(game_designer) |

---

## Provenance

- Scott's engine, Adventureland, Adventure International: public record + Wikipedia.
- Jan 2026 correspondence ("sucked me in," "tremendous potential," biography mini-adventures, MOOLLM interest): **VERIFIED via Don** — confirm before long quotes on air.
- HN Nov 2021 thread: public; Scott's faith remark is public — quote with warmth, never as a gotcha.
- Don's Logo Adventure, MOOLLM, adventure compiler: Don's repos and lineage files.
- Parker: Will family context from private Don↔Will mail — keep first-name-only in public show notes.

*Last updated: 2026-08-01 — HN digest, Soul City, Will/Parker, ensemble guests.*
