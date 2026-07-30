# Ideas to explore with Ben Cerveny 👤

*Conversation hooks for a Repo Show — grounded in Ben's public work. Don's proposed topics; not
quotes attributed to Ben unless marked.*
[Portrayal standards](../../schemas/portrayal-standards.md)

## What Ben has done

Strategist and designer at the intersection of games, maps, social platforms, speculative design,
and civic digital public infrastructure. Key roles in **Game Neverending** (→ Flickr), **Stamen
Design**, **Bloom Studio / Planetary** (Smithsonian), and **President of the Foundation for Public
Code** (Amsterdam). Long friend of Don Hopkins.

See [moollm-lane-neverending-habitat.yml](moollm-lane-neverending-habitat.yml)

## Shared ground

| Ben's lineage | This repo |
|---------------|-----------|
| Game Neverending → Flickr | Soul City Exchange; social spatial play as infrastructure |
| Habitat-style shared worlds | [Lane Neverending](moollm-lane-neverending-habitat.yml) — spliceable circular street |
| Stamen / Planetary — data as instrument | Micropolis zone maps; aggregate ↔ dollhouse zoom |
| Foundation for Public Code | Player-in-the-middle publish; provenance mandatory; opt-in catalog |
| Speculative design, nurturing environments | MOOLLM Soul City; characters-as-hydrogen federation |

## The hooks

### 1. Data portability — Will's 1986 thesis (kickoff spine)

Will's pre-Dollhouse talk: move **characters and data between worlds**. Natural framing for
episode one with Will. Walk [1996 Winograd video](../will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/)
+ [data-portability crown jewel](../../repo-shows/ideas/themes/data-portability-crown-jewel.yml).

### 2. Soul City — liminal heaven between game runtimes

While uplifted: explore, edit bodies and souls, create/buy/share. [Marusek *Wedding Album*](https://en.wikipedia.org/wiki/The_Wedding_Album_(short_story))
→ Sims 1 saves from 2001. [Soul City README](https://github.com/SimHacker/moollm/blob/main/examples/soul-city/README.md)
· [MicropolisCore soul-city.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/soul-city.md).

Show seed: Little Computer Person tours the future inside The Sims.

### 3. TypeScript in the browser — `packages/sims-io`, not Python runtime

SimObliterator Suite = reference guide. Implementation: MicropolisCore monorepo — shared WebGPU,
VitaBoy animation, IFF parsers. Local-first; optional Node server. Demo: drag `.FAM`, uplift,
download — no venv.

### 4. Head Shop + WigFabrik / Wig-O-Matic

Sims heads: create, buy, exchange, crush/recycle. **WigFabrik** (aka Wig-M-Porium / WigOMatic)
wigs import like clothing racks — ECG multitarget mesh+texture interpolation; AI-authored
hair-pattern *targets*; drag-to-solve weights (Tom Ngo ECG, patent expired).
[the-computer-as-portal §6](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/the-computer-as-portal.md#6-wigfabrik--wigomatic-and-the-character-customization-studio)

### 5. OpenLaszlo lineage — what was prototyped vs what's new

Don's earlier **SimProv Wedding Playset + SimFreaks** plumbing vs today's LLM soul-reading and
Mind Mirror synthesis layers.

### 6. Lane Neverending ↔ Habitat ↔ GNE

[MOOLLM adventure-4 street](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/street/lane-neverending)
loops forever; splice segments for more buildings. YAML/md as paper. [acme-bakfiets](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/street/lane-neverending/w1/acme-bakfiets-of-holding.yml)
— GPS + heavy lock + recovery service mirrors real Amsterdam bike parking.

### 7. Public code meets recovered Sims Exchange

Who gets credit when the Tornado imports 25 years of fan content? Opt-in publish preview.
Foundation for Public Code ethics × [archive tornado](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/the-tornado-and-the-archives.md).

### 8. Transmogrifier everything + deterministic browser RE

Maxis Transmogrifier pattern extended to full save files — SimAntics → YAML with comments,
hand/AI edit, inject back. LLMs great at reverse engineering *documentation*; runtime tools stay
deterministic and cheap.

### 9. Mind Mirror Apple ][ organelle

Run Timothy Leary's Mind Mirror in a browser emulator; round-trip enriched personality into
Soul City; export to other federation peers. [game-bridge-mind-mirror.yml](../../repo-shows/game-bridge-mind-mirror.yml)

### 10. Micropolis Federation naming

MicropolisCity + SoulCity under [Micropolis Public Name License](https://github.com/SimHacker/MicropolisCore/blob/main/MicropolisPublicNameLicense.md).
Soul City = umbrella fiction only. Git branch per city save: `MicropolisCity_<save-id>`.

## Sources (public)

- [`invitation.md`](invitation.md)
- Show seed: [`repo-shows/ben-cerveny.yml`](../../repo-shows/ben-cerveny.yml)
- [`moollm-lane-neverending-habitat.yml`](moollm-lane-neverending-habitat.yml)
- [`CHARACTER.yml`](CHARACTER.yml)
