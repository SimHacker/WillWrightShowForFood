# Mixing Up Adventures!

> What happens when Hunt the Wumpus, the grue, the troll, and whole adventures share one graph — told by two founders of the genre and the analyst who canonized it as literature.

| Field | Value |
|-------|-------|
| **Status** | seed |
| **Type** | trio |
| **Host** | Don Hopkins |
| **Guests** | Donald Knuth, Don Woods, Scott Adams |
| **Consent** | Knuth: snail-mail only; Woods + Adams: solo warm, trio not yet proposed |

## Topic

**Mixing up adventures** — not fan fiction, not a mashup mod, but parallel games on a
shared world graph: each cartridge carries its own rules, advertises its affordances, and
plugs into any maze (or map) that honors the socket.

The live demo already exists in MOOLLM:

- [Snorax the Wumpus](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/wumpus-snorax) — spatial puzzle, beast on a node
- [the grue](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/grue) — time puzzle, ambient field in darkness
- [Two-Toll the Cross-Platform Troll](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/troll) — economic puzzle, border on an edge

They interoperate through shared state — your **lamp**. While it burns, Hunt the Wumpus.
When it runs out, Don't Go In The Dark starts in the same rooms. The wumpus did not move;
the rules changed under you.

## Why these three

| Guest | What they bring to "mixing" |
|-------|----------------------------|
| **Don Woods** | Canonical Adventure (1977); the bridge toll troll and dungeon service economy; the crowther@ permission story; pits that became grues |
| **Scott Adams** | Adventureland (1978) — the first SOLD text adventure; whole worlds in 16K as portable data + interpreter; the original game cartridge |
| **Donald Knuth** | Not a founder — the canonizer: `advent.w` presented and analyzed Adventure as literature; the lineage insight that Adventure is "a fancier WUMPUS" |

## The troll flag question

Zork's troll: `GIVE AXE TO TROLL` (eats his weapon, cowers) and `GIVE TROLL TO TROLL`
(self-devours via transitive containment) — arguably acting as designed, since the MDL's
generic containment gave those for free. But `TROLL-FLAG` was never cleared when he ate
himself, so the empty room still fends you off with a menacing gesture. Don
reverse-engineered that flag from black-box play on MIT-DM and confirmed it in the source
decades later ([harvest](../../characters/don-hopkins/sources/zork-troll-flag-adventure-lineage-hn.md)).

The failure shape: **the room cached a fact about the troll instead of asking the troll.**
The show's design question: how do you build plug-in pieces so troll flags can't happen?
Robust-first (Ackley), the Sims expansion-pack socket, presence-is-the-flag, and the DRY
mixin graph for game pieces (chess sets, wumpus hazards, the troll's axe and stomach):
[GAME-PIECES.md](https://github.com/SimHacker/moollm/blob/main/designs/GAME-PIECES.md)

## Related shows

- [woods-and-adams-adventurers](../woods-and-adams-adventurers/README.md) — the pair show (mainframe vs 16K)
- [don-woods-adventure](../don-woods-adventure/README.md) — Woods solo; dream ensemble with Knuth
- [GAME-CARTRIDGES.md](../../characters/menagerie/GAME-CARTRIDGES.md) — the menagerie pattern this episode demos
- [map-game-platform.md](../../apps/ebike-safari/design/map-game-platform.md) — city-scale plug-in tenants (Amsterdam)

## In this directory

- [`mixing-up-adventures.yml`](mixing-up-adventures.yml) — machine reading (seed spec)
- `SHOW.yml` — *not yet*; add when ready to run the show

↑ [`../README.md`](../README.md) · [`../INDEX.yml`](../INDEX.yml)
