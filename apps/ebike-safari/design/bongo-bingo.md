# Bongo Bingo

**Status:** shipped 2011 on Foursquare; Ebike Safari tenant not started
**Platform:** [`map-game-platform.md`](map-game-platform.md) · **Lineage:** [`lineage.yml`](lineage.yml)

Amsterdank Coffeeshop Bongo Bingo was a bingo game played across Amsterdam. The squares on your
card were coffeeshops, and the only way to mark a square was to go there and check in on
Foursquare. Don built it on the Amsterdank server and published it at amsterdank.nl for the
Amsterdam Cannabis Cup in November 2011. There was no money to promote or advertise it.

The challenge is the trip. You mark a square by moving your position in the city itself, not by
clicking on a map of it, and the only way to move it is to carry yourself there. That is why it
appears in
[An interface to agency](https://github.com/SimHacker/moollm/blob/main/designs/interface-to-agency/ebike-safari.md).

## How it worked in 2011

The server was TurboGears, with Genshi templates and a `bingo_card` table.

**Signing in.** You logged in with Foursquare, and the page greeted you with your Foursquare name
and photo.

**Marking squares.** The server called the Foursquare API for your venue history and matched each
venue you had been to against the coffeeshops in the Amsterdank database, by Foursquare venue ID.
Every coffeeshop you had ever checked into marked its square, so a new card could start with marks
from last year. The server also took Foursquare's push notifications, so a new check-in was recorded
as it happened. A check-in anywhere that was not a coffeeshop was ignored.

**Dealing a card.** Two numbers dealt every card:

- The **game seed** was shared by everyone that season. It drew 15 coffeeshops for each of the five
  columns from all the coffeeshops in the database, the way a bingo column holds 15 numbers.
- The **card seed** was yours. It dealt five coffeeshops from each column's 15, so no two cards
  matched, but every card came from the same deck.

The centre square was free. Because a card is reproducible from its two seeds, it could be shared
and checked later.

**Winning.** Five in a row, in a column or on either diagonal, and you pressed the button. The page
counted your bingos on that card, or told you "You do not have a bingo, silly!" You could hold up
to five cards at once.

| Card | Header | Grid | Coffeeshops per column |
| --- | --- | --- | --- |
| Standard | BONGO | 5×5 | 15 |
| American | USA | 3×3 | 15 |
| Dutch | GODVERDOMME | 11×11 | 18 |

GODVERDOMME has eleven letters, so the Dutch card has 121 squares. There was also a hidden deck in
which every square was Betty Too.

The 2011 server source is a historical Subversion repository. It is not published.

## What changes now

Foursquare moved check-ins into its Swarm app in 2014, and the API the game called is gone. Ebike
Safari does not need it. The ride already knows where you stopped, and the camera already knows
what you photographed.

**A mark is a visit, not a pass.** Riding past a coffeeshop is exposure: the
[exposure log](exposure-pac-man.md) counts it as a café on your left. A check-in meant you went
in, so a mark needs a `STOP` from the [gesture engine](skeleton/gesture-engine.md) within N metres
of the shop, plus a photograph of your own with GPS in its EXIF data. A photo without a stop is a
passer-by; a stop without a photo is a red light.

Every mark is also survey evidence about the shop, so playing bingo fills in the
[amsterdank](https://github.com/SimHacker/amsterdank) coffeeshop register
([GEOTOKING.md](https://github.com/SimHacker/amsterdank/blob/main/skills/coffeeshop/GEOTOKING.md#bongo-bingo-which-already-existed)).

## A tenant on the shared data plane

Bongo Bingo has no tracking of its own. It is a contract that reads what the ride already wrote
([`map-game-platform.md` § shared data contracts](map-game-platform.md#shared-data-contracts--the-actual-platform)):

```yaml
# design/games/bongo-bingo.contract.yml  (proposed)
id: game/bongo-bingo
reads:
  - rides/*/events.json          # STOP events, snapped to a node
  - rides/*/frames/              # the rider's own photographs, local by default
  - places/                      # the amsterdank register: which nodes are coffeeshops
writes:
  - bingo/cards/*                # game seed, card seed, marks, bingos
emits_events: [square_marked, bingo]
declares:
  reads_identities: false
  leaderboard: false
```

The same ride that marks a square also tends a garden bed, pays a troll's bridge toll and feeds the
story layer, because every tenant reads the same event log. Nothing about bingo has to be built into
the ride, and nothing about the ride has to be copied into bingo. That is the platform test from
[`map-game-platform.md`](map-game-platform.md): a new game is a contract file, not a fork.

The card is also a view. With the bingo preset on, the map shows your card's shops and which ones
are marked; with it off, the marks are still in the shared store for any other game that wants
them.

## Rules carried forward

- **Scores stay local and opt-in.** A public ranking of who smoked in the most coffeeshops is a bad
  thing to publish about real people, including yourself. No leaderboard by default.
- **Where you were is sensitive.** The ride log stays on the rider's device unless the rider
  publishes it ([`privacy.md`](privacy.md)).
- **Other people's Foursquare data stays out.** The 2011 data brought in other users' tips, photos
  and mayorships. Those are quarantined in amsterdank and never published.

## Related

- [`lineage.yml`](lineage.yml): the 2009 Amsterdam Coffeeshops database and its surfaces
- [`sources/foursquare-lineage.md`](sources/foursquare-lineage.md): Foursquare as lifelogging reference
- [`exposure-pac-man.md`](exposure-pac-man.md): passing, as opposed to visiting
- [SUMMARY-GENRES.md](https://github.com/SimHacker/moollm/blob/main/designs/webtop/SUMMARY-GENRES.md): bingo as a family of cards (Blogo, Gonzo, Gonzo Bongo)

↑ [`INDEX.yml`](INDEX.yml) · [`map-game-platform.md`](map-game-platform.md)
