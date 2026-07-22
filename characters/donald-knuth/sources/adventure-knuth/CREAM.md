# Cream — Knuth Adventure → MOOLLM / Repo Show

*Selective export. Full argument: [`ANALYSIS.md`](ANALYSIS.md).*

## One sentence

Adventure-in-CWEB is the founding **room graph + object props + tiny parser**, written so humans can read the machinery — the same stack MOOLLM and Repo Show extend with GitHub stages and LLMs.

## Schema cream (steal these names)

| Primitive | Woods/Knuth | Ours |
|-----------|-------------|------|
| Room | `location`, long/short desc, `flags` | directory / `CARD` room |
| Exit | `instruction {mot, cond, dest}` | link, conditional GO |
| Thing | `object`, `prop[]`, `place[]`, `base[]` | file / YAML object |
| Verb | motion / action / message word types | skill methods, chat verbs |
| Agent | dwarves, pirate, troll, bear | summoned characters, bots |
| Economy | treasures, tally, score classes | feelies, artifacts, episode score |
| Clock | `clock1`/`clock2` closing | quiet mode → publish |

## Algorithm cream

- **Travel table interpreter** — condition codes: always / probability / holding / sees / prop≠k
- **Forced locations** — crack, neck, lose, check… (immediate re-dispatch)
- **Dwarf random walk** with `cond != 100` (dwarves forbidden) and knife accuracy by `dflag`
- **Pirate** steals toted treasures → chest in maze; message as spotting flag
- **Lamp** as resource clock; batteries as continue token
- **Hints** table-driven: thresh, cost, prompt — points trade for comprehension

## Literate cream

- Write for humans first; tangle for machines ([literateprogramming.com](http://literateprogramming.com/))
- Sections as holons (de Marneffe / Koestler via Knuth's history)
- WWSFF already weaves: girder YAML → facade markdown; GLANCE → CARD → SKILL

## Lineage cream

[SHRDLU](../../../terry-winograd/) inside-out ↔ Adventure · fancier [WUMPUS](https://en.wikipedia.org/wiki/Hunt_the_Wumpus) · → Zork → MUD → MOO → [Scott](../../../scott-adams/) VM → Logo Adventure → **MOOLLM** → GitHub as stage ([Brewster](../../../brewster-kahle/))

Citation: [HN 45996916](https://news.ycombinator.com/item?id=45996916) · [Montfort](https://nickm.com/if/riddle_machines.html) · framing [`../../../nick-montfort/sources/riddle-machines.md`](../../../nick-montfort/sources/riddle-machines.md) · [*GET LAMP*](../../../jason-scott/sources/get-lamp.md) · [*It Is Pitch Dark*](../../../mc-frontalot/sources/it-is-pitch-dark.md) · local [`advent.w`](advent.w)

## Do next

1. Walk `advent.w` sections against `skills/adventure` world compiler — gap list
2. Episode beat: "Read the travel table aloud" with Scott or Terry
3. Preserve: keep `advent.w.gz` as bit-identical upstream; never "fix" without Woods/Knuth leave

↑ [`README.md`](README.md)
