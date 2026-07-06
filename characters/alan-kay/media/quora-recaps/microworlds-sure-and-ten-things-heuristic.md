# Microworlds libraries — Kay's "Sure!" and the 10-things heuristic

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Sources:** Alan Kay's public **Quora** replies to:
- *"What does Alan Kay think about the development of software libraries adopting Seymour Papert's
  constructivism and 'microworlds' concepts…?"*
- *"What does Alan Kay think about the following research proposal notes about a new software world?"*
  (osoco.es — same heuristic)

**Nature:** Summary; verify against Quora. Credit: **Quora**. Governed by
[`portrayal-standards.yml`](../../../../schemas/portrayal-standards.yml).

> **Project tie-in:** Repo Show thesis, hook **#1**, **Snap!/Etoys/Micropolis**, MOOLLM skills as microworlds,
> [`computer-revolution-not-yet.md`](computer-revolution-not-yet.md).

---

## The whole answer — "Sure!"

Asked about software libraries adopting Papert's **constructivism** and **microworlds**: Kay's reply is
literally **"Sure!"** — then the protocol:

For anything major, two heuristics used **50+ years**:
1. Try to **"write 10 things"** about it
2. Then **"write 20 examples"** — from "simple things that must be simple" through "major things that should
   be as simple as possible" to difficult things that must be built

→ **Basis for discussion and further comment.**

Same pattern for "new software world" proposals: **"We definitely need a new software world …"**

## What Kay doesn't do in these threads

He does **not** in these short replies enumerate specific libraries or endorse particular repos — the heuristic
is the gift: force concreteness before abstraction.

## Connect to powerful ideas / Etoys

Elsewhere Kay met Papert (~1968), saw children + **powerful ideas**; VPRI ran **Etoys in schools**; Etoys as
"illustration of concept" for education threads. Microworlds = learner's space where powerful ideas live, not
black-box apps (Repo Show thesis).

Kay on inheritance/Smalltalk: include **children as users for everything** — more sympathy + learning drive.

---

## Repo Show connection — HAR 2009 Micropolis lightning talk (Don's guess)

*Is Don's constructionist-education Micropolis lightning talk what Kay means by "10 things / 20 examples"?
Draft — not Alan's words. Ask him on air.*

### The talk

**HAR 2009** (*Hacking at Random*) — Don's lightning talk **"Micropolis: Constructionist Educational Open
Source SimCity"**:

| Artifact | Link |
|----------|------|
| **Transcript + video** (Medium) | [HAR 2009 lightning talk](https://donhopkins.medium.com/har-2009-lightning-talk-transcript-constructionist-educational-open-source-simcity-by-don-3a9e010bf305) |
| **Talk outline** (notes) | [`MicropolisDev/notes/MicropolisHARTalk/micropolis-talk.txt`](https://github.com/SimHacker/Micropolis/blob/master/notes/MicropolisHARTalk/micropolis-talk.txt) · [`notes/html/talk.html`](https://github.com/SimHacker/Micropolis/blob/master/notes/html/talk.html) |
| **Photos** | [`../../../don-hopkins/media/micropolis-gallery/micropolis-gallery.yml`](../../../don-hopkins/media/micropolis-gallery/micropolis-gallery.yml) (`har_constructionist`) |
| **Winograd / constructionist thread** | [`../../../will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/medium-article.md`](../../../will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/medium-article.md) |
| **Alan encouraged OLPC SimCity** | [`../../ideas.md`](../../ideas.md) hook **#6** · [`../llms-copilots-trust-and-teaching.md`](llms-copilots-trust-and-teaching.md) |

Core claim in the talk: fulfill SimCity's potential as a **microworld for children's learning and
exploration** — open source, scriptable, multiplayer, applied across science, writing, economics, politics,
programming. Jeff Braun's line: *"There is no win or lose, just cause and effect."*

### Is this what Kay means?

**Partly yes — same genus, not yet the same protocol.**

Kay's gift is not "Sure!" — it is **force concreteness before abstraction**: write **10 things**, then **20
examples** (simple → major → difficult), *then* discuss. The HAR talk is **constructionist microworld
substance** Don would show Alan, but it was structured as a **lightning vision + example menu**, not an explicit
10/20 pass:

| Kay asks for | HAR 2009 talk delivers |
|--------------|----------------------|
| Microworld library, not black-box app | ✅ Open Micropolis; "read and modify the source" |
| Simple things that must be simple | ✅ Play city, cause/effect, export spreadsheet data |
| Major things as simple as possible | ⚠️ OLPC port, Python/SWIG, PyGTK — shipped; politics/polder/blogging — aspirational |
| Difficult things that must be built | ⚠️ Multiplayer eduverse, visual programming (Etoys/SimAntics), community newspaper — sketched |
| Basis for discussion | ✅ Rich enough to argue with — Alan already argued SimCity should be glass-box |
| Disciplined 10 + 20 lists | ❌ Not formatted that way — would need a rewrite for Alan's protocol |

**Our guess:** Alan would say the talk is **the right kind of proposal** (microworld + powerful ideas + child
as user) but **incomplete by his standard** until we extract explicit **10 things** and **20 examples** and
mark which were **built**, **demo'd**, or **still gutter** (white space for the learner — see
[`lenat-cyc-knowledge-and-slow-thinking.md`](lenat-cyc-knowledge-and-slow-thinking.md)).

### Draft — 10 things about Micropolis as a microworld library (from HAR talk)

*For Alan to red-pen — not endorsed.*

1. **Glass-box city simulation** — rules inspectable, not SimCity black-box.
2. **Toys not games** — no win/lose; cause and effect (Braun).
3. **Complex systems literacy** — pollution, traffic, budgets, emergent failure.
4. **Data out for real math** — export spreadsheets; experiment outside the game.
5. **Writing in the world** — newspaper/blog stories linked to save snapshots.
6. **Economics & consequence** — loans, credit, what-if rewind points.
7. **Civic process** — proposals, debate, voting, role-play (polder model).
8. **Open source soup-to-nuts** — modular C++/Python example others extend.
9. **Visual programming path** — Etoys / SimAntics / Robot Odyssey lineage named.
10. **Multiplayer community** — shared cities, collaborative eduverse (goal).

### Draft — 20 examples (simple → difficult)

*Status honest: **shipped** · **demo'd** · **aspirational**.*

| # | Example | Status |
|---|---------|--------|
| 1 | Place zones; watch RCI demand | shipped |
| 2 | Trigger disaster; observe recovery | shipped |
| 3 | Export sim data → spreadsheet graph | shipped (PyGTK era) |
| 4 | Read Micropolis source; find pollution rule | shipped |
| 5 | Pie menu / taartmenu localization (nl-NL) | shipped (OpenLaszlo) |
| 6 | PacBot agent eats traffic | shipped (demo) |
| 7 | OLPC XO-1 Sugar laptop play | shipped |
| 8 | HyperLook SimCity (NeWS lineage) | shipped (historical) |
| 9 | Write in-game newspaper article + snapshot | aspirational |
| 10 | Blog dialog with graphs/overlays embedded | aspirational |
| 11 | Student "what-if" rewind at decision point | aspirational |
| 12 | Loan + credit rating mini-sim | aspirational |
| 13 | Player proposal with map overlay + vote | aspirational |
| 14 | Polder-model slow multiplayer gridlock | aspirational |
| 15 | Hand Monderman shared-space traffic lesson | aspirational (pedagogy) |
| 16 | Extend sim rule in Python | shipped (partial) |
| 17 | Etoys-style visual rule block | aspirational |
| 18 | SimAntics-style behavior tiles | aspirational |
| 19 | Multiplayer shared city + roles | aspirational |
| 20 | 2026 Repo Show glass-box Micropolis in browser | in progress |

### Question for Alan

> Don gave a **HAR 2009 lightning talk** pitching Micropolis as constructionist educational open-source SimCity
> — microworld, cause/effect, open source, writing/economics/politics/programming examples. Is that **what you
> mean** by adopting Papert microworlds — or do we still owe you an explicit **10 things** and **20 examples**
> list before it's a basis for discussion? Which of the 20 are the wrong examples — and what's missing?

**Live segment:** screen the talk outline + HAR photos; Alan red-pens the draft 10/20; rebuild one **simple
thing that must be simple** live in MicropolisCore.

---

## Questions for Alan (show fodder)

- For **MOOLLM**, what are your **10 things** and **20 examples**?
- For **Micropolis** as a microworld library — what must be in the 20 examples list? Don's **HAR 2009
  constructionist lightning talk** as draft material — is that the right shape?
  [§ HAR 2009 talk](microworlds-sure-and-ten-things-heuristic.md#repo-show-connection--har-2009-micropolis-lightning-talk-dons-guess)
- Is **Snap!** the best living microworlds library — or missing a dimension?
- Would you evaluate a proposal that **only** had slogans and no 10/20?
