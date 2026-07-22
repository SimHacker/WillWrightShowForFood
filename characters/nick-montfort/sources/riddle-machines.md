# Riddle Machines — framing (Montfort 2007)

*Summary + Repo Show / MOOLLM map. Not a reprint. Read the essay:*
[https://nickm.com/if/riddle_machines.html](https://nickm.com/if/riddle_machines.html)

| | |
|--|--|
| Author | Nick Montfort |
| Title | *Riddle Machines: The History and Nature of Interactive Fiction* |
| Venue | *A Companion to Digital Literary Studies* (Siemens & Schreibman, Blackwell, 2007), pp. 267–282 |
| Canonical URL | https://nickm.com/if/riddle_machines.html (author republication, 2018; IA preserved the offline digital edition) |
| Book sibling | Montfort, *Twisty Little Passages* (MIT Press, 2003) — riddle-as-literary-relative argument developed at book length |

Portrayal standards: [`../../../schemas/portrayal-standards.md`](../../../schemas/portrayal-standards.md). Guest room: [`../`](../).

---

## One sentence

Interactive fiction is a **parser + world model** that produces **potential narrative** — dialogue on the surface, simulated rooms/objects underneath — closer to a **riddle** (input required to complete the work) than to a novel you only read.

## Form cream (steal these)

| Primitive | Montfort | Ours |
|-----------|----------|------|
| Parser | Language understanding → command to player character | Chat / skill verbs / GO |
| World model | Rooms as graph; containment; behaviors | Directory rooms, YAML objects, CARD ads |
| Output | Focalized narration from simulation state | Facade markdown + live transcript |
| Potential narrative | Space of traversals, not one fixed path | Repo Show as space of guest/branch traversals |
| Riddle | Work incomplete until interactor answers with action | Episode solved by *doing* in the repo |
| Feelies / maps / transcripts | Material props of classic play | Artifacts, girder YAML, session logs |

## Lineage cream (his history section)

Eliza/Doctor → **SHRDLU** → **Hunt the Wumpus** → Crowther/Woods **Adventure** → house games / Acheton / **Zork** → Adventure International + **Infocom** → Level 9 / Magnetic Scrolls → TADS/Inform + IF Comp → MUDs/MOOs → graphical adventures (distant cousins).

That is the trail leoc cited on HN for “ADVENT ≈ SHRDLU inside-out / fancier WUMPUS”:
[`../../donald-knuth/sources/advent-shrdlu-wumpus-lineage.md`](../../donald-knuth/sources/advent-shrdlu-wumpus-lineage.md).

## Claims that matter for this show

1. **Not hypertext lexia-hopping.** Output is generated from a simulated world (time of day, inventory, light, NPC state) — same reason a Repo Show stage is a live tree, not a fixed FAQ page.
2. **Potential narrative (Oulipo-adjacent).** *Bronze* (Emily Short) is one traversal; the work defines a space of narratives. Repo Shows are potential episodes over one GitHub world.
3. **Literary relative = riddle, not novel.** Novels were the marketing metaphor (Infocom genres, “electronic novel”); the better form-cousin is the riddle: the work asks for an answer performed as action.
4. **MUD = multi-user IF that swerved social.** Bartle: MUD’s “Dungeon” points at *Dungeon*/Zork. MOO → MOOLLM is our continuation of that fork.
5. **Hobbyist renaissance after commercial crash** — Inform/TADS, IF Comp, free archive — parallel to open Micropolis / MOOLLM / Repo Show outside store shelves.

## What this essay is *not*

- Not the Knuth CWEB museum piece — that lives in [`../../donald-knuth/sources/adventure-knuth/`](../../donald-knuth/sources/adventure-knuth/)
- Not Scott’s portable adventure VM story — that lives in [`../../scott-adams/`](../../scott-adams/)
- Not a Winograd interview brief — SHRDLU room: [`../../terry-winograd/`](../../terry-winograd/)

Montfort is the **literary map**; Knuth is the **algorithmic museum**; Scott is the **compiler lineage**; Terry is the **language-as-adventure** parent.

## Show hooks

| Segment | Why Montfort |
|---------|----------------|
| Terry Winograd | Parser vs world-model emphasis (SHRDLU inside-out) |
| Scott Adams | Commercial IF → portable data + tiny VM; Comp-era cousin |
| Donald Knuth | Literate Adventure as readable world machinery |
| Brewster Kahle | Preserve early dreams of interactive worlds |
| Janet Murray | *Hamlet on the Holodeck* — [`../../janet-murray/sources/hamlet-on-the-holodeck.md`](../../janet-murray/sources/hamlet-on-the-holodeck.md) |
| Jason Scott | *GET LAMP* — [`../../jason-scott/sources/get-lamp.md`](../../jason-scott/sources/get-lamp.md) |
| MC Frontalot | *It Is Pitch Dark* — [`../../mc-frontalot/sources/it-is-pitch-dark.md`](../../mc-frontalot/sources/it-is-pitch-dark.md) |
| MOOLLM / Repo Show | Potential narrative = potential repo; riddle = perform understanding |

## See also

- Upstream essay: https://nickm.com/if/riddle_machines.html
- HN citation trail: https://news.ycombinator.com/item?id=45996916
- Knuth mission map: [`../../donald-knuth/sources/adventure-knuth/ANALYSIS.md`](../../donald-knuth/sources/adventure-knuth/ANALYSIS.md) · [CREAM](../../donald-knuth/sources/adventure-knuth/CREAM.md)
- MOOLLM: [`skills/adventure`](https://github.com/SimHacker/moollm/tree/main/skills/adventure)

↑ [`README.md`](README.md) · guest [`../`](../)
