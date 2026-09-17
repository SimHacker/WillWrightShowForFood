# Little Computer People — the headwater show

*Show seed. Read the first computer person off a 1985 floppy, live, and give him neighbours.*

| | |
|---|---|
| Principal guest | [David Crane](../../characters/david-crane/) — invitation drafted, **not sent**, no contact route yet |
| In memoriam | [Rich Gold](../../characters/rich-gold/) (1950–2003) — conceived it, and argued against the interactivity |
| Destination | [Ell / Tiny Life](../../characters/ellpeck/) — where the person moves in |
| Lineage | [Will Wright](../../characters/will-wright/) cites LCP as an ancestor of The Sims and took feedback from Gold while making it |
| Technical design | [apple-ii-floppy-bridge.md](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/apple-ii-floppy-bridge.md) · [federation entry](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/federation-peer-games.md#little-computer-people-activision-1985--the-headwater) |
| Protocol | moollm [`soul-city`](https://github.com/SimHacker/moollm/tree/main/skills/soul-city) |

## The premise

In 1985 a house on a floppy disk had room for exactly one man and one dog, and every disk held a
different man — Activision serialized each copy at the duplicator and used the number to seed his
name, his shirt colour and his personality. His accumulated state lives in a 256-byte block that his
own disk drive rewrote as he aged.

He has never had a neighbour. The sequel that would have given him one — producer Sam Nelson's LCP
apartment complex, where you watch the people interact and work several houses at once — was
prototyped in the office and, in Nelson's words, *"dropped on the floor."*

This show builds that sequel from outside, forty years late.

## The arc

1. **Boot it.** A real serialized disk in a browser emulator, running.
2. **Find the brain.** Read the persistent block and put the little person's state on screen as
   editable text. Crane documented the C64 layout; **the Apple ][ layout is undocumented**, and
   finding it is a live question for the guest.
3. **The argument.** Gold wanted a fishbowl you watch; Crane rewrote half the program so you could
   interact. Both shipped, fifteen years apart, as LCP and The Sims. Run the argument again with the
   person who won it.
4. **Move him in.** Into [Tiny Life](https://tinylifegame.com/) — an homage cover of The Sims played
   in the key of The Sims 0, which has in soul what it lacks in resolution. A town, neighbours,
   household export, open modding, one developer.
5. **Leave the choice in.** In the new house he can be watched or operated. That is a setting now,
   not a decision imposed by whoever held the compiler.

## Why it matters beyond nostalgia

It is the oldest working test of whether a soul bridge is real: 256 bytes, an undocumented disk
format, a dead co-creator, a living one, and a destination made by a single person who already ships
character export. If a character can make that trip, the rest of the federation is engineering.

## Status

Nothing sent. Crane has no identified contact route. Gold is [memorial mode](../../schemas/portrayal-standards.md#memorial-mode).
Ell has said the bridge idea sounds interesting and has an [updated invitation](../../characters/ellpeck/invitation.md)
plus a quote offer drafted and held privately until Don picks a line.

↑ [repo-shows/](../README.md) · [characters/david-crane/](../../characters/david-crane/) · [characters/rich-gold/](../../characters/rich-gold/)
