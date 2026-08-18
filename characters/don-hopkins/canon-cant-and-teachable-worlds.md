# Canon, Cant, and Teachable Worlds — Harvest

*Ideas worth stealing from Nick Tau's kid-teachable MUD · harvested 2026-08-18*

| | |
|---|---|
| **Source** | [Canon](https://tau.dev/2026/08/07/canon) — Nick Tau, 2026-08-07 |
| **Discussion** | [HN 49272631](https://news.ycombinator.com/item?id=49272631) — *Teaching my kid to code with a modern MUD* |
| **Counterpoint** | [Gruber, *Why HyperCard Failed*](https://daringfireball.net/2002/08/why_hypercard_failed) (2002) — "stacks smell funny" |
| **Extends** | [`teaching-complicated-systems-without-a-manual.md`](teaching-complicated-systems-without-a-manual.md) — this doc harvests only what that essay does NOT already cover |

**One sentence:** Nick Tau built his eight-year-old a web MUD (Canon) with a deliberately
limited scripting language (Cant), and several of his design decisions are genuinely new
policy ideas for teachable microworlds — governance by topology, state ontology as consent,
rate-limited LLM tutoring, and pedagogically-bad-on-purpose language design.

---

## Already in our canon (pointers, not restatement)

| Canon feature | Where we already have it |
|---------------|--------------------------|
| PBD lineage; LLM as the missing generalizer | [Teaching essay §PBD](teaching-complicated-systems-without-a-manual.md) · [Palm's worms §trainable](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.md) |
| Clone-and-tweak instead of classify-first | Teaching essay §prototypes (Ungar / Self / instance-first) |
| Everything inspectable; the world is the manual | Teaching essay §manual-is-the-world · MOOLLM constructionism |
| HyperCard Script… button as GUI→code gateway | Teaching essay §PBD (Peridot, C32); Nick's own origin story confirms it independently |
| Text medium: unlimited *what*, constrained *how* | Teaching essay §implication-beats-simulation |

## New ideas harvested

### 1. Governance by topology — "lock out, never in"

Canon's map is a tree that grows only by budding; locks work only in the direction away
from the root. **You can make lairs, but you can't make dungeons.** Private spaces are
possible; imprisonment is structurally impossible — not by moderation policy, by graph
shape.

*Steal for:* MOOLLM room graphs. We use directories-as-rooms; a "locks only point away
from root" convention is one line of protocol and eliminates a whole griefing class in
kid-facing worlds.

### 2. Consent by state ontology — players carry no state

In Canon, players have **no state at all**; all marks and numbers live on items. A
fireball targets whatever the victim *carries* that answers to `vigor`. Don't want to
duel? Don't pick up the wand. Every encounter is opt-in because the object model makes
non-consent the default — there is nothing on the player to attack.

*Steal for:* MOOLLM encounter design. The Sims put motives on the person; Canon moves all
attackable surface onto props. For multiplayer LLM microworlds with kids, prop-carried
state is the cleaner consent primitive. (Composes with advertisements: the prop that
carries the state also advertises the interaction.)

### 3. Rate-limited LLM as tutor — the Wish function

One LLM-crafted item per player per day, delivered as **commented, editable Cant**
("Built by The Machine, but yours to change. Edit freely!"). Scarcity keeps the LLM a
teacher at authoring time, never a performer at play time. Field results: adults
polarized in both directions; the eight-year-old was **indifferent** — wished, then
immediately overwrote the output with her own words. AI as just another tool.

*Steal for:* MOOLLM adventure onboarding and the [PBD-in-LLM-era vertical](https://github.com/SimHacker/DonHopkins/blob/main/projects/micropolis-moollm/repo-shows/brad-myers/garnet-vpl.yml)
— Wish is a shipped, kid-tested instance of examples → commented code → human overwrite.
The rate limit is the pedagogy: one seed a day forces reading and editing over generating.

### 4. Language designed to be bad in educational ways

Cant is anti-DRY on purpose: a D20 is twenty `or` lines, not `randInt(1,20)`. `when`
takes one condition — no `and`/`or`/`else if`; you nest. Nick's claim: the learner will
hit the limits, **articulate** them, and then understand *why* the good habits are good
when she graduates to a real language. Frustration you can articulate is a curriculum.

*Steal for:* Micropolis Class exercise design. We already argue deliberate suboptimality
is a teaching affordance in *characters* (Sims find-best-N dither — teaching essay); Cant
applies the same principle to *language design*. Both belong in one section of the
eventual teachable-systems piece: engineered humility in the agent, engineered poverty in
the notation, both leaving room for the learner.

### 5. The casing is the type

Marks (booleans) are ALWAYS UPPERCASE; numbers always lowercase. The type system is
carried entirely by orthography — no declarations, no annotations, visible at a glance in
any listing. YAML Jazz adjacent: convention as machinery.

### 6. `or` — randomness as the first delight

The `or` keyword works anywhere Cant takes a string, picking a random variant per use —
baked into the lowest level of the language. Nick: an RNG is a new programmer's first
taste of delegated agency — "you programmed every response... and yet you don't know
exactly what it will say. It's like suddenly being able to tickle yourself."

*Steal for:* MOOLLM YAML — `or`-variant description lists as first-class idiom (rooms and
characters that never describe themselves quite the same way twice, cheaply, without an
LLM call).

### 7. Capability tokens on the curriculum — the teleport locus

Canon's map is a tree, so ladders and elevators would create cycles; teleport items fake
them, DOOM-style. The destination address (*locus*) is a random id learnable **only by
standing in the room** — teleports bypass locks, so security rests on the unguessable
token. An eight-year-old learns capability security as a game mechanic.

*Steal for:* MOOLLM room addressing and any teach-the-teacher security material. Also the
general move: keep the data structure clean (tree) and restore expressivity with an
in-fiction escape hatch (teleport item), instead of complicating the substrate.

### 8. Default amnesia, opt-in `remembers`

Item state resets when no players are around, so encounters are fresh for every visitor;
persistence requires the explicit `remembers` keyword. The default serves the *next*
player, not the last one.

*Steal for:* MOOLLM room/prop state policy — a one-keyword answer to "why is this puzzle
already solved?"

### 9. Hacking as a win condition

Every encounter is editable, so every encounter is cheatable — deliberately. Creating
puzzles, beating puzzles, and hacking puzzles are all wins; there are no scarce resources
to grief, so cheating costs no one. Clone-but-not-modify in Kingdoms means every artifact
doubles as a tutorial: **View Source as social contract**. And the kid found the exploit
anyway: *"I cloned everything ten times, which means I have more of your stuff than you
do!"* — a loot goblin in a game with no loot. Abundance economies still afford status
games; players will invent scarcity out of pure mischief.

### 10. The parent as coding agent (HN: derefr)

Best comment in [the thread](https://news.ycombinator.com/item?id=49272631): before LLMs,
a parent teaching "the computer does anything you can say" played exactly the role of a
coding agent — kid states intent, parent produces the runes fast enough to keep wonder
alive, then walks back through the lines. Kids don't care where the runes came from; the
magic is that text makes things happen at all. The craft-awareness (code as communication
between programmers) is a *later* lesson that can't be rushed.

*Steal for:* Repo Show framing — the Wish function, the parent-at-the-keyboard, and a
Cursor agent are the same pedagogical role at three levels of automation. Good segment
shape for a teaching-focused episode.

---

## Show seeds

- **Nick Tau** — candidate guest: HyperCard origin story (9-year-old builds a Street
  Fighter stack card-by-card, discovers Script…), Canon design opinions, the polarized
  adult / indifferent kid AI reception. Pairs with [Ken Kahn](../ken-kahn/) (ToonTalk —
  trained robots, birds) and the [Brad Myers PBD vertical](../brad-myers/GLANCE.md).
- **HyperCard segment** — Gruber's "stacks smell funny" as honest counterpoint: HyperCard
  couldn't make Mac-like apps *because* it was a user medium, not a developer tool. Ties
  to Bill Atkinson thread and Tade Mehl's simplify-don't-castrate question.
- **Tade follow-up** — Canon is a live answer to Tade's exact question: what to show, what
  to hide, and how normal people (age eight) learn without a manual.

↑ [Don's room](README.md) · [Teaching essay](teaching-complicated-systems-without-a-manual.md) · [ideas](ideas.md)
