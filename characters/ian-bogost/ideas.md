# Ideas to explore with Ian Bogost

*Conversation hooks — procedural rhetoric × Sims lineage. Consent not_yet_asked.*  
[Portrayal standards](../../schemas/portrayal-standards.md)

## Show thesis

**Procedural rhetoric in The Sims** — from Will's 1997 Motive.c substrate through Don's UCC objects
(Wedding Playset, Dumbold) to Soul City federation. You named the category; we have the artifacts.

## Segment map

### 0. QGCon paper — How Inclusivity Saved The Sims (optional)

- Don's abstract + timeline + Patrick Barrett arc — your reaction to procedural rhetoric as **saved** the franchise
- Pair with [Janet Murray](../janet-murray/) on Family Album / Exchange as storytelling holodeck
- [`../don-hopkins/sources/qgcon-inclusivity-paper/`](../don-hopkins/sources/qgcon-inclusivity-paper/)

### 1. Motive.c — rhetoric at the substrate

- Failure alerts as persuasive design (starvation, mandatory bath, wet bed)
- Global variables vs shipping Sims — does prototype rhetoric differ from product rhetoric?

### 2. Wedding playset — inclusion agitprop

- Built when marriage equality was still contested; republishing for Steam Sims 1 families
- Politics in orchestration rules (Cupid, Crowd Sitter, Buddha) — not a cutscene manifesto
- **The component chain as rhetoric**: Hope Chest → Wedding Consultant →
  wedding planner magazines on the dining table → objects → spawned NPC staff
  → reciprocal services ([ORCHESTRATOR.yml](../../catalogs/simprov/ORCHESTRATOR.yml)) —
  the playset argues through a supply chain, not a manifesto; Cupid runs the
  saga state machine, the Buddha statue manages crowd needs, and the locked
  menus *teach* by what they permit
- **Paperwork as procedural rhetoric**
  ([wedding-playset-depth.md](../../catalogs/simprov/wedding-playset-depth.md)):
  officiant chosen from a magazine (priest, rabbi, clown), invitation list as
  a neighborhood-wide toggle phone, the marriage license as capability token
  that *enables* the ceremony — and binds two Sims with no gender check on
  the form; photographers feed the Family Album; the unshipped plan generated
  wall paintings and a coffee-table wedding storybook from the simulation's
  after-effects; plus a hireable divorce lawyer — the institution modeled
  honestly, exits included
- Ask: useful category next to *Persuasive Games*?

### 3. Dumbold — institutional farce that dates

- 2004 e-voting satire, charmingly dated on purpose — preserve honestly; how procedural satire ages vs inclusion playsets that **gain** force

### 3b. Death, zombies, and the kindest graveyard on the internet

- His own parenthetical from the 2015 essay: *"in video games, emotional
  nuance often seems to involve zombies"* — so bring him
  [Heather and Steve's Zombie Sims](../../catalogs/zombie-sims/README.md),
  artisanal and still shipping; Don's HN framing: "Simprov was all about
  passion, but ZombieSims is all about revenge and murder and chaos and
  brains! @;)"
- The [tombstone generator](../will-wright/sources/2005-09-22-halloween-tombstones-original-sims/article.md)
  (2005): Halloween Tombstone with ghosts or Solemn Tombstone with flowers,
  upload a photo of the deceased — somber and playful in one object,
  the emergence↔nuance slider applied to grief
- The [Original Sims cemetery](http://www.originalsims.com/cemetery): 1200+
  memorials of people *and* Sims by 2005 — **read epitaphs from the Wayback
  archive on air**
  ([harvested sample, verbatim](sources/original-sims-cemetery-epitaphs.md):
  Christopher Reeve beside Frankenstein, the first Sim to die of a broken
  heart, the Updating Queen, an excellent cat), then ask the 2026 question:
  what does a UGC memorial site where strangers wrote each other's grief
  with care say against the internet we got instead? The cemetery as the
  counterfactual internet

### 4. Soul City — rhetoric as platform

- Federation publishing for artisanal UCC; procedural rhetoric as infrastructure
- [The attitude](../../catalogs/soul-city/README.md#the-attitude): Nina Hagen
  as patron saint — punk exit from walled gardens, not exit interview; answers
  the closing of his own 2015 essay ("we'll sign away anything… rationed by
  the billionaires") with a systems move: leave, take the souls, get louder
- [The turnstile](../../catalogs/soul-city/README.md#the-turnstile): exit as
  petition — voluntary signatures from players *and their Sims*, a one-way
  turnstile that counts you if you choose, and a live "OVER *N* SIMS SOULS
  SAVED" tote board; protest as procedural rhetoric, for the man who named
  the category — and Don, Heather, and Steve can build it **in The Sims** as
  custom objects (petition on the dining table, turnstile in the yard, tote
  board on the lawn syncing to the site): the exit conducted diegetically,
  from inside the walled garden being left
- [The pool](../../catalogs/soul-city/README.md#the-pool): the turnstile
  opens onto a gated pool with a diving board and **no ladder** — the game's
  most famous death inverted into ceremony; the soul is already exported, so
  the dive is pure statement, and the lawn of generator-engraved tombstones
  grows one grave per saved soul — the drowning pool as baptismal font in
  reverse, surely the darkest procedural rhetoric ever pitched to its own
  theorist

### 4b. Roles, not characters — his 2015 essay, answered with running code

- ["Video Games Are Better Without Characters"](https://www.theatlantic.com/technology/archive/2015/03/video-games-are-better-without-characters/387556/)
  asks "why must we have characters in games at all?" — Don's decades-old
  answer: SimCity implies its characters as **roles around the glass**
  (mayor, treasurer, planner, tool operator), and multiplayer X11 SimCity
  made them literal seats with voting
- Soul City casts the roles: characters imported from other games — and
  agents — playing mayor's advisor, traffic engineer, opposition paper
- Full response doc: [`roles-not-characters.md`](roles-not-characters.md)
- On-air segment beat: [`../../repo-shows/will-wright-premiere/ian-bogost-procedural-rhetoric/roles-not-characters-beat.md`](../../repo-shows/will-wright-premiere/ian-bogost-procedural-rhetoric/roles-not-characters-beat.md) — Act 4: Bogost closing + Soul City underground railroad

### 4c. The Wumpus and the Troll — characters that are operations, not personalities

*The segment Don most wants to run. Two working exhibits, both browsable, both
answering 4b from a different direction: they concede his objection and then keep
going.*

- **Snorax IS the game.** The character directory for the wumpus contains the
  rules, the topology, and the source — the character is not a personality bolted
  onto a rule set, it **is** the rule set with a name on it.
  [`characters/fictional/wumpus-snorax/`](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/wumpus-snorax)
- **Platform studies as a character's soul**, which is his own methodology pointed
  at an NPC: the same creature held as Yob's 1973 BASIC, his Wumpus 2 BASIC, a BCC1
  variant, V7 Unix `wump.c` (1979), BSD games `wump.c` (1989), and Yob's own 1975
  *Creative Computing* essay — sources kept, not summarized. Plus `wumpus.w.md`, a
  literate treatment of the 1973 BASIC in the manner of Knuth's *Adventure*. Two
  representations of one character: the readable soul and the machine one.
- **Yob generalized his own game and we kept the generalization.** Wumpus 2 let you
  change the graph, so the topologies ship as peers — Möbius strip, string of beads,
  hex torus, dendrite, one-way lattice. The creature is indifferent to which; the
  topology is a parameter, not a level.
- **Two-Toll the Troll: one soul, two minds, and neither flattened into the other.**
  The Colossal Cave bridge troll (pay a treasure) and the Zork I troll (pay in
  steel) as the same worker with two jobs, commuting between dungeons and
  context-switching protocols. Arriving in a new world he **samples the local
  advertisements**: combat verbs present, the Zork mind bids to front; treasure
  scoring present, the Adventure mind bids; both, the adventurer picks the currency;
  neither, he falls back to riddles — the species-level protocol, older than both
  games.
  [`characters/fictional/troll/`](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/troll)
- **Dispatch weight worn as visible anatomy.** He is two-headed, one head per mind,
  and **head size displays the live fronting weight** — blend `{zork: 0.7,
  adventure: 0.3}` and the heads hold that ratio. Adventurers read the heads the way
  sailors read the sky. The mechanism is perceivable rather than ambient, which is
  the honest answer to a critic who is right to distrust invisible machinery.
- **A realm is a block quote you can walk around inside.** He carries a mirror of
  each mind's home turf — the Troll Room and its passages, the chasm and its
  rickety bridge — seven rooms each, dilated one move outward, with exits past the
  corner ending in fog. Every part of quotation has a counterpart: the excerpt is
  the mirrored rooms, **the ellipsis is the fog**, the citation is the `canon:`
  field, and fair-use sizing means seven rooms rather than the Great Underground
  Empire. The pattern's other names are the Disneyland dark ride, the holodeck
  reenactment, and the braindance — each a navigable excerpt of somebody else's
  world, glitch-fuzzed where the recording ends. Which makes it a **procedural
  rhetoric of quotation**: the argument is carried by what got excerpted, where the
  fog was placed, and what you are allowed to do inside the passage.
  [`troll/realms/`](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/troll/realms)
- **And the realms are the test rig, which is why this is not just a nice image.**
  Each isolates one mind, so cross-mounting one mind into the other's realm tests
  whether "samples the local advertisements" is a mechanism or a description of one.
  Then strip the world down — fewer rooms, no ambient layer, no sibling characters,
  descriptions deleted — and **the smallest world in which he still behaves
  correctly is a number**, which is extractability measured rather than asserted.
- **Three characters, three graph elements, composable.** The wumpus binds to a
  **node**, the grue to an **ambient condition**, the troll to an **edge** — so any
  room network hosts all three at once and none requires the others. That is the
  extractability test passing in the hard case, not the easy one.
- **The lamp is the exhibit.** Two games read one piece of shared state: while it
  burns you are playing Hunt the Wumpus, and when it dies you are in Don't Go In The
  Dark. *The wumpus did not move; the rules changed under you.* Genre as a
  consequence of state, from two systems that were never designed together.
- **The troll is a procedural argument about tolls.** The gatekeeper who demands
  payment shipped twice in five years with different currencies and has been
  reinstantiated in every boss door, toll bridge, and paywall since — embodied as
  somebody with two jobs. Worth asking him whether that is procedural rhetoric or
  merely a joke with good documentation, because the answer is genuinely unclear and
  he is the person who would know.
- **The concession to make out loud:** these have names but their names are labels
  on mechanisms, not invitations to identify with anyone. His 2015 objection is to
  characters as vessels for identification, and none of these three are that. Ask
  whether that satisfies the objection or evades it.

### 5. Cow Clicker — the show Don wants (optional dessert)

*Respectful love letter to intentional satire — not a dunk on Molyneux for sport.*

**Register rule — the withheld dunk (praeteritio):** deadpan facts only, no
adjectives on Molyneux; the reader/audience supplies the judgment ("He didn't
get it. I explained. He still didn't get it."). The contrast does all the
work: Cow Clicker is self-aware on purpose — Cowpocalypse, "It wasn't very
fun before" — while Curiosity satirized itself by accident. Bogost dunks on
himself better than anyone; piling on Molyneux would miss the point of the
satire, withholding proves we got it. The Molyneux receipts (RPS
"pathological liar" interview, TechCrunch) stay in
[the source page](../don-hopkins/sources/hn-cow-clicker-curiosity-unite-2012.md)
as background, not ammunition.

- [The Cow Clicker story](sources/cow-clicker.md) — mechanics, Cowpocalypse, citations
- [Cow Clicker site](http://www.cowclicker.com/) · [Wikipedia](https://en.wikipedia.org/wiki/Cow_Clicker) · [HN 2022](https://news.ycombinator.com/item?id=31979586)
- Bogost line: *"It wasn't very fun before."* — scheduled death as honesty
- Don's [Unite 2012 cow joke](../don-hopkins/sources/hn-cow-clicker-curiosity-unite-2012.md) — Curiosity didn't get the reference
- [Curiosity + Cow Clicker parody](../../bits/gag-curiosity-cow-cube/gag-curiosity-cow-cube.md) — keep real Curiosity dead; center is your cow
- [Morningstar → Ashford → Bogost chain](../../bits/gag-how-to-deconstruct-the-cube/gag-how-to-deconstruct-the-cube.md)
- When Cow Clicker got popular anyway — is *that* the second joke?
- Distressed-moo click audio — procedural rhetoric admitting manipulation?
- Medium-as-skinner-box: Don's [HN Medium essay](../don-hopkins/writing/hn-medium-failure-and-github-moollm.md) cites Cow Clicker as comparator

### 6. The postmortem of The Sims — the one that's never been done

- The prenatal record exists:
  [Will's 1996 Winograd talk](../will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/README.md)
  ([YouTube](https://www.youtube.com/watch?v=nsxoZXaYJSk) ·
  [Don's Medium write-up](https://donhopkins.medium.com/designing-user-interfaces-to-simulation-games-bd7a9d81e62d))
  — postmortems of SimEarth/SimAnt/SimCity 2000, then the Dollhouse preview,
  with Will's "what now?" answer opening on **data portability** (1996!)
- Study Will's early words against everything since: two representational
  systems for same-sex love (see
  [roles-not-characters.md](roles-not-characters.md)), the expansion-pack
  arc, the Exchange rise and removal, Moola, the 2026 take-private
- Ian's 2015 essay was a eulogy for Maxis; the postmortem of The Sims is
  the sequel only he can co-write — with Will in the room and the source
  code on the table
- The Khandaker-Kokoris emergence↔nuance spectrum, answered: the Family
  Album and Exchange made it a per-scene slider — retroactively narrate the
  emergence, or stage-direct every shot, or anywhere between; improv meets
  playwriting (see [roles-not-characters.md](roles-not-characters.md))

## Sources

- [`../../repo-shows/will-wright-premiere/ian-bogost-procedural-rhetoric/SHOW.yml`](../../repo-shows/will-wright-premiere/ian-bogost-procedural-rhetoric/SHOW.yml)
- [`../will-wright/media/sims-series-procedural-rhetoric-inclusion-agitprop.md`](../will-wright/media/sims-series-procedural-rhetoric-inclusion-agitprop.md)
- [`../will-wright/sources/2008-02-10-soul-of-the-sims/Motive.c`](../will-wright/sources/2008-02-10-soul-of-the-sims/Motive.c)
