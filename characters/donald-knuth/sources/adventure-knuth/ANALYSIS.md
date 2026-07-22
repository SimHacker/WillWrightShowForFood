# Knuth Adventure as MOOLLM / Repo Show source material

*Perspective analysis — not a rewrite of Knuth. Local CWEB: [`advent.w`](advent.w). Cream: [`CREAM.md`](CREAM.md).*

*(If we name it, we link it — [Ted Nelson](../../../ted-nelson/), [Terry Winograd / SHRDLU](../../../terry-winograd/), [Scott Adams](../../../scott-adams/), [Brewster Kahle](../../../brewster-kahle/), [MOOLLM adventure skill](https://github.com/SimHacker/moollm/tree/main/skills/adventure).)*

## What it is

Donald Knuth took Woods's FORTRAN Adventure 1.0 and **recast it as a CWEB literate program**: documentation containing code, sections ordered for human understanding, then CTANGLE for the compiler and CWEAVE for the book. The opening line of the web names the stake: *the ur-game for computers*.

Two layers matter at once:

1. **The game** — rooms as a graph, objects with properties, a tiny English vocabulary, dwarves/pirate as autonomous agents, scoring, death/resurrection, cave closing.
2. **The meta-game** — the program itself is a navigable web of named sections (holons): vocabulary → cave data → travel table → objects → parser loop → verbs → motions → dwarves → scoring. Same shape as the cave.

Literate programming (Knuth 1984; site quotes at [`../literate-programming-site-quotes.md`](../literate-programming-site-quotes.md)) is the claim that the primary audience of a program is **other intelligent beings**, not the machine. Adventure-in-CWEB is that claim applied to the founding recreational world model.

## What it is not

- Not Infocom Zork (though Zork / *Dungeon* is the MUD name-seed — [Bartle](https://mud.co.uk/richard/imud.htm)).
- Not SHRDLU — but [leoc / Montfort](../advent-shrdlu-wumpus-lineage.md) are right that ADVENT is **SHRDLU turned inside out**: same parser+world-model duo; Adventure makes the *world* the adventure and the language thinner; SHRDLU made the *language* the adventure and the world a blocks table.
- Not the two-page PDF at literateprogramming.com alone — that file is an entry card; **`advent.w` is the source**.

## Lineage (one breath)

[Eliza](https://en.wikipedia.org/wiki/ELIZA) → [SHRDLU](../../../terry-winograd/) → [Hunt the Wumpus](https://en.wikipedia.org/wiki/Hunt_the_Wumpus) → Crowther/Woods **Adventure** → Zork → MUDs → MOOs → Scott Adams portable VM → Don's Logo Adventure → **MOOLLM** (`MOO + LLM`) → **Repo Show** (GitHub as stage).

Montfort's [*Riddle Machines*](https://nickm.com/if/riddle_machines.html) is the literary map
([framing](../../../nick-montfort/sources/riddle-machines.md)). Knuth's web is the **algorithmic museum**.

## Mapping to MOOLLM / WWSFF

| Adventure (Knuth/Woods) | MOOLLM / Repo Show |
|-------------------------|-------------------|
| `location` / rooms / travel table | Directories as rooms; links as exits ([`skills/adventure`](https://github.com/SimHacker/moollm/tree/main/skills/adventure)) |
| `object` + `prop[]` + containment lists | Files / YAML objects; state in props |
| Vocabulary hash (motion / object / action / message) | Commands + skill verbs + chat as parser |
| `instruction {mot, cond, dest}` | Conditional exits, hints, forced moves |
| Dwarves + pirate | Autonomous NPCs / agents in the world |
| Feelies / transcripts / maps | Repo artifacts, issues, PRs, sourced clips |
| Scoring + closing the cave | Episode arcs, quiet mode → open publication |
| Literate sections (web of holons) | YAML Jazz + CARD/GLANCE/SKILL pyramid — explain for humans, extract for machines |
| "I will be your eyes and hands" | Host + LLM as eyes/hands; guest as player character or co-DM |

The mission-level claim: **we are not inventing a new dead medium**. We are reframing a live one (git/GitHub) the way Adventure reframed the command line — as a place you *move through*, with a world model underneath the dialogue. Brewster's "sounds like an adventure" ([`../../../brewster-kahle/`](../../../brewster-kahle/)) is the correct parse.

## Why this is source material for *everything*

Adventure's data tables are the ancestor schema for:

- **Rooms / geography** — `make_loc` / travel instructions (probability, holding, property tests)
- **Objects / treasures** — movable vs fixed, multipart objects (`GRATE`/`GRATE_`), notes by property
- **Trolls / dwarves / pirate** — the original griefers and economy thieves
- **Rules** — lamp limit, carrying capacity, cave closing clocks, death count
- **Databases** — vocabulary, remarks, default messages, hint tables
- **Algorithms** — random walk for dwarves, scoring, resurrection drop rules

Scott's later insight ([`../../../scott-adams/`](../../../scott-adams/)) was to **compile** this shape into portable data + a tiny VM. MOOLLM's adventure compiler / skill continues that: world as data, driver as shared runtime, LLMs as soft parsers and dungeon masters.

Literate programming is the other half of the mission: **skills and character rooms should read as essays that happen to run** — documentation containing protocol, not protocol with comments hiding under the stairs.

## Insights (cream expanded)

1. **Potential narrative = potential repo.** Montfort: IF is a space of narratives, not one path. A Repo Show is a space of traversals through the same tree — different guests, branches, issue threads.
2. **Inside-out SHRDLU.** Winograd maximized language over a small world; Adventure maximized world over a small language. Repo Show + LLM wants **both** — rich world model *and* rich conversation — which is why Terry belongs in the cast.
3. **Tangle/Weave = facades.** CTANGLE emits machine order; CWEAVE emits human order. WWSFF already does this: `repo-show-format.yml` → generated `FORMAT.md`; CARD/GLANCE before SKILL. Same discipline.
4. **The shadowy figure is your reflection.** Woods's intentional false clue (mirror between windows) is the Repo Show audience: you peer across the pit into the lighted room and see yourself participating.
5. **Closing the cave.** After all treasures are seen, the world *changes rules*. Quiet-mode invitations → public open is our `clock1`/`clock2`.
6. **Don Woods is the ultimate troll with an axe** — NeWS `/etc/motd`: *Welcome to Adventure. Would you like instructions?* The host machine *was* the well house. GitHub as stage is the same joke, played for keeps.

## Show / skill hooks

- [Terry Winograd](../../../terry-winograd/) — SHRDLU ↔ Adventure; CS547 as format ancestor
- [Scott Adams](../../../scott-adams/) — portable adventure database lineage
- [Brewster Kahle](../../../brewster-kahle/) — Archive keeps early dreams; Adventure is an early dream of interactive worlds
- [Ted Nelson](../../../ted-nelson/) — intertwingled sections vs jumplinks; literate web ≈ Xanalogical instinct without claiming identity
- MOOLLM [`skills/adventure`](https://github.com/SimHacker/moollm/tree/main/skills/adventure) · sister-script / yaml-jazz ambient skills

↑ [`README.md`](README.md) · [`CREAM.md`](CREAM.md) · [`artifacts.yml`](artifacts.yml)
