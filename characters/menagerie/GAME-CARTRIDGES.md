# Game Cartridges — porting NPCs between games

Three menagerie guests — [the grue](grue/), [Snorax the wumpus](wumpus-snorax/), and
[Two-Toll the Troll](troll/) — are here as **foundational examples** of a claim the
show keeps circling: a game character can be a self-contained, portable object that
carries its own game with it.

## The claim

An NPC doesn't have to be a script welded into one engine. Refactored properly, a
character from Zork, Hunt the Wumpus, Colossal Cave Adventure, or a Scott Adams
adventure becomes a **plug-in game cartridge**: a directory that carries its own
playing pieces — and, when needed, its own rooms, objects, hazards, skills, and
rules — and plugs into any world that honors a small socket.

The socket is the one The Sims proved at scale: **objects carry their own behavior
and advertise it**. A Sims object ships with its code and broadcasts scored offers;
characters are markets that sample those offers against their motives. The house
doesn't know what a hot tub is, and doesn't need to. That's why expansion packs
worked, and it's why the objects we made with **Edith** and shared through
**Transmogrifier** could drop into anyone's house and just play: the socket never
changed. MOOLLM characters use the same socket, so a 1973 wumpus, a 1977 troll, and
a 1980 grue coexist in one 2026 maze without reading each other's source code.

The full protocol lives upstream in MOOLLM:
[PORTABLE-NPCS.md](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/PORTABLE-NPCS.md)
(advertisements as socket, prototype/instance split, treaties, customs) and
[SOUL-MODEL.md](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md)
(souls, minds, personas). This document is the WWSFF adaptor: what the pattern
means here, and which shows it feeds.

## The three archetypes, resident

| Guest | Source game | Archetype | Travels by |
|---|---|---|---|
| [Snorax](wumpus-snorax/) | Hunt the Wumpus (Yob, 1973) | **instanced beast** | pointer file + a save file that grows per world |
| [the grue](grue/) | Zork (Infocom, 1980) | **ambient field** | predicate binding — attaches wherever `lighting: none` |
| [Two-Toll](troll/) | Adventure (1977) AND Zork (1980) | **instanced border** | pointer bound to an *edge* in the room graph; his location IS a rule |

Snorax is the maximal cartridge: his MOOLLM directory carries the complete 1973
rules (`GAME.yml`), the canonical dodecahedron topology, the original BASIC source
as provenance, and the hazards factored into plugin parts (superbats, bottomless
pit) that other games adopt a la carte. The grue is the minimal cartridge: install
nothing — if your world has darkness, he's already in it. And the troll is the
**dual cartridge**: one soul with two organelle minds, the Zork combat-gate and the
Adventure toll-gate, fronting whichever protocol the destination world's currency
calls for. Same troll, two games, fifty years, nobody noticed he was commuting.

## The adaptor (how imports work here)

The mechanism is [MOOLLM-OVERLAY.yml](MOOLLM-OVERLAY.yml), same as Palm, Donna
Toadstool, and Doctor No: the canonical soul stays in MOOLLM; WWSFF keeps a thin
local `CHARACTER.yml` that points upstream, summarizes identity, and records the
`wwsff_overlay` — roles, gallery beats, and relationships earned *here*. Local
experiences accumulate without forking canon. That's the cartridge economy in
miniature: prototype shared, instance local.

## The lineage (show material)

Construction sets all the way down — one refinement per generation:

- **Adventure Construction Set** (Stuart Smith, EA 1984) — creatures as records,
  not code; whole adventures as tradeable data.
- **Raid on Bungeling Bay's level editor** (Will Wright, 1984) — the editor was
  more fun than the game; the realization became SimCity.
- **The Sims** (2000) — the construction set that stayed open at runtime; **Edith**
  as the behavior editor, **Transmogrifier** as the community porting tool;
  expansion packs as proof the socket held.
- **MOOLLM** (2026) — directories as the construction set; a character directory
  is Stuart Smith's creature record grown up: soul, rules, topology, provenance,
  plugins, instances.

## Show hooks

- **Don Woods** — the troll and the ACME battery vending machine are both his:
  the dungeon service economy, invented 1977. The grue descends from his pits
  ("You may fall into a pit or step on a grue" — Zork's darkness answering his).
- **Scott Adams** — cartridges before cartridges: whole adventures in 16K, two-word
  parsers, the discipline of tiny portable worlds. How do you say "I insist" in
  VERB NOUN?
- **Will Wright** — Edith, Transmogrifier, and the advertisement socket; why
  objects-that-carry-behavior beat engines-that-know-everything, twenty-six years
  before it became an LLM pattern.
- **Soul-city segment** — Two-Toll live: one character switching minds per world,
  the pandoc-for-characters demo with a bloody axe and a ledger.
