# Cult Sims — the bridge playset

*Don, 1 Sep 2026: Cult Sims as an expansion pack compatible and integrated with
Zombie Sims — and the Crowd Sitter, Buddha, Cupid and forced marriages intermingle
with SimProv too.*

**Status: proposed.** SimProv and Zombie Sims are real catalogs with real objects
([`catalogs/simprov/`](../../catalogs/simprov/), [`catalogs/zombie-sims/`](../../catalogs/zombie-sims/)).
This is a design for the thing that sits between them.

## Why it bridges cleanly

**Cult conversion and zombie infection are the same mechanism.** Both are a state
that spreads host to host: a transmission event, a growing membership, a leader or
patient zero, and waves rather than individual actions. The difference is the
fiction and the consent, not the machinery.

That is why the two catalogs compose instead of colliding:

| Zombie Sims has | Cult Sims needs | Same thing? |
|---|---|---|
| Ham radio as **wave controller** | broadcast sermons, recruitment drives — [a television](#the-television-dispenses-ideology-by-the-channel) | same role, and the cult splits it in two: the TV broadcasts, [a stand](#the-hub-is-a-swagomatic-and-multiple-stands-are-the-game) enrolls |
| infection by contact | conversion by persuasion | yes — transmission with a different guard |
| faction configs, religion-mapped skins | denominations, sects, schisms — [one stand per sect](#multiple-stands-and-why-the-smallest-difference-makes-the-worst-feud) | yes, and the skins are the *whole* difference between sects |
| siege waves | recruitment drives, defector retrieval | yes — waves either way |

Zombie Sims already carries `religion_mapped_skins` and its show hook already runs
*"hell is full → drain souls by religion → waves at scale"*
([`ORCHESTRATOR.yml`](../../catalogs/zombie-sims/ORCHESTRATOR.yml)). The religious
axis is in that material already; Cult Sims gives it a hub.

## The SimProv objects need no changes at all

This is the part worth sitting with. Every object the wedding kit needs, the cult
needs, doing the same job:

| Object | In SimProv | In Cult Sims |
|---|---|---|
| **Buddha** | suppress needs so a big wedding can finish | suppress needs so members keep working — which is what cults actually do |
| **Crowd Sitter** | gather and seat wedding guests | seat the congregation |
| **Come and See Me** | irresistible routing for a staged beat | the call to assembly |
| **Cupid** | pick who loves whom, from a pie menu | assigned affection, by the leader |
| **Super Cupid** | everyone loves everyone, for a party | `star_inbound` — adoration flows to the guru; `clique_partition` — a schism, in one gesture |
| **Guru / pairing tool** | mass-issue marriage licenses | mass-issue marriage licenses |
| **Officiant** | ratify pending licenses in parallel | the mass wedding |
| **Eloporter** | elope — escape the wedding apparatus | **defect** — escape the compound |
| **Divorce attorney** | sever a bond, expensively, properly | exit counselor; the cleaver again |
| **Hope Chest** | own the wedding state machine | own the initiation state machine |

**The eloporter is the sharpest reuse.** One-way, single-use, one end indoors and
one outdoors, with an NPC possibly waiting at the output. As a wedding object that
is romantic. As a cult object it is a defection hatch, and the NPC waiting at the
far end is no longer an officiant. Identical object, identical constraints,
inverted meaning — see [`life-events-playset.md`](life-events-playset.md).

## The argument it makes

The wedding playset, pointed at a compound instead of a chapel, is a cult playset.
Nothing is added: **forced pairing, need suppression, irresistible routing, crowd
management, a state machine that gates what you may do next, and one hard-to-reach
exit.**

The only thing that changes is consent, and consent is not a mechanic here — which
is precisely the argument. A player who has run the wedding kit and then runs the
cult kit discovers they were operating the same controls the whole time. That is
[procedural rhetoric](https://github.com/SimHacker/moollm/tree/main/skills/procedural-rhetoric) doing what it is
for, and it does not require a single line of editorial.

The Buddha reuse carries it alone: an object built so a wedding would not collapse
into hunger becomes, unaltered, an object that keeps members from noticing they are
hungry.

## The worked example: red baseball caps are the infection marker

*Don, 20 Sep 2026: red baseball caps are a sign of infection. MAGA cult!*

This solves a real design problem rather than only supplying a joke. **A contagion
game has to make infection visible**, or the player cannot see the wave they are
supposed to be managing. Zombie Sims does it with skins and its plugin list already
carries `religion_mapped_skins`, so the slot exists. Cult Sims needs the same thing,
and the answer is a hat.

The **MAGA cap** is the worked case because it needs no interpretation: mass-produced
campaign merchandise, sold at a profit, voluntarily worn, and treated by its wearers
as an identity marker rather than a garment.

### The hat is a better mechanic than persuasion

Conversion-by-argument is hard to implement and boring to watch. Conversion-by-hat is
one object, and the differences from zombie infection are all load-bearing:

| Zombie infection | Cap conversion |
|---|---|
| contact event, involuntary | **purchase** event, voluntary |
| the bite costs the victim nothing | **the marker is the revenue model** — simoleons flow toward the leader |
| visible after the fact | visible *because the host chose to display it* |
| cannot be removed | **taking it off is the defection event** |

**The third and fourth rows are the ones worth building.** The cap itself is not an
object — it is a **dressable accessory**, so it cannot sit in inventory advertising
*wear me*. What advertises is [the stand that dispenses
it](#the-hub-is-a-swagomatic-and-multiple-stands-are-the-game), the way a dresser
advertises *change clothes*. That keeps the `spreads:` field this document proposes but
gives it a fixed carrier: transmission happens at a location somebody walks to, not
between Sims in passing. And because the transmission event is a *transaction*, the
contagion has a direction the zombie model cannot express: **the cult sells you your
own symptom.**

### It wires into objects that already exist

Nothing new is required, which is the whole thesis of this playset:

- **Crowd Sitter** seats a congregation, and a seated congregation in identical hats is
  a rally.
- **Buddha** was built so a wedding would not collapse into hunger. Pointed at a rally
  it keeps members standing in line for hours without noticing, and that sentence needs
  no editorial attached to it.
- **Eloporter** — the far end of the one-way hatch is where the cap comes off, and a cap
  left at the output is evidence somebody made it out.
- **Super Cupid** `star_inbound` — adoration flows to the guru; `clique_partition`
  forks the schism when a rival starts selling a different hat.

### Where the satire is aimed

At the apparatus and at whoever installed the Buddha — not at the rank-and-file wearer.
This document's own argument makes members **the people the mechanism is being operated
on**: need-suppressed so they keep working, routed by Come and See Me, gated by a state
machine they did not write. They are the mechanism's subject, not its butt.

That is also the sharper reading. A stand that sells you the marker of your own
conversion is a joke about **who is collecting**, and it survives a fact-check, which is
the house standard — see
[`bits/gag-vice-not-ice-puppet/gag-vice-not-ice-puppet.yml#house_test`](../../bits/gag-vice-not-ice-puppet/gag-vice-not-ice-puppet.yml).

## The hub is a SwagOMatic, and multiple stands are the game

*Don, 20 Sep 2026: caps are dressable accessories, not objects themselves, but an object
can orchestrate them — one MAGA SWAGA stand that works like a dresser, and that one
object orchestrates the cult. Make multiple competing stands the whole thing, essential
gameplay, each with its own adjustable parameters.*

### The object already exists, stocked differently

A cap is an accessory, and the appliance that manages accessories is already designed and
named: **WigOMatic, reskinnable as AnythingOMatic** — "a custom in-game object, like a
dresser, that manages all your wigs… dress and undress accessories, easy peasy," and it
**renders its pie menu tree custom** from your own categories and your own contents. See
[the appliance pattern](../../catalogs/soul-city/portals-and-modules.md) and
[the shop table](../../catalogs/soul-city/object-shops.md).

So the MAGA SWAGA stand is **a SwagOMatic: an AnythingOMatic with the swag line loaded**.
Custom pie-menu rendering means the merch tiers *are* the menu, with no new UI. The
playset's "objects need no changes" thesis holds one more time, and it holds in the
strongest way — the object was designed for wigs by someone who had never considered this
application.

The lineage is funnier than anything that could be invented for it. The AnythingOMatic's
credited precedent is **the one-armed-bandit TMog Steve Alvey (SimSlice) made for Don**,
"but less random." A merch stand that extracts money in exchange for a feeling of
belonging is a reskinned slot machine, and in this repo that is a documented inheritance
rather than a metaphor.

### One stand is one cult

**The stand is the hub, and this is the object the bridge table was asking for.** It holds
the group host, the roster, the price list, and the parameters. The
[television](#the-television-dispenses-ideology-by-the-channel) is the
other half of the machine but not the hub: it manufactures the want, and the stand
converts want into membership. Advertiser and registry, and they are separable — a
channel with no stand produces Sims who want something they cannot buy, which is a
perfectly good thing to be able to stage.

| | Advertiser role | Registry role |
|---|---|---|
| Scope | the room it is in | the lot, via a roster |
| What it changes | what other objects are *worth* | who *belongs* |
| Membership | none — it cannot enroll anybody | **owns the group host** |
| If deleted | demand decays | the cult dissolves, members unhatted |

**Those are two roles, not necessarily two objects** — and the strongest version of this
design [fuses them into a single television](#the-television-is-the-vending-machine), which is
what the rest of the document builds toward. Keeping the roles named separately is still
useful, because a split configuration is stageable and occasionally what you want: a channel
with no stand produces Sims who crave something they cannot buy.

### Multiple stands, and why the smallest difference makes the worst feud

Don's escalation is that **multiple competing stands are the essential gameplay**, not a
robustness afterthought — ideologically identical cults distinguished only by cap color,
with the smallest differences driving the biggest feuds.

The engine supplies the reason, and it is anatomical: **a slot holds one thing.** Two
stands stocking the head are competing for the same square inch, and the rule that falls
out is the one worth building the playset around:

> **Hostility is inversely proportional to doctrinal difference, because the more alike
> two cults are, the more exactly they need the same slot.**

Rivalry is therefore [decided by slot collision rather than by
belief](#many-slots-many-cults-at-once), which is a sharper claim than the doctrinal one:
two cults can disagree about everything and coexist happily on different body parts, while
two that agree about everything and both want the head cannot share a member at all.

That is not a joke bolted onto the simulation; it is competitive exclusion, the ecological
rule that two species occupying an identical niche cannot coexist. Freud named the human
version the **narcissism of minor differences** (*Civilization and Its Discontents*, 1930),
and the literature has been staging it ever since: Swift's **Big-Endians and
Little-Endians** going to war over which end of the egg to break — a joke already living
in this repo's vocabulary, since [yaml-jazz](https://github.com/SimHacker/moollm/blob/main/skills/yaml-jazz/SKILL.md)
prescribes big-endian naming — and *Life of Brian*'s People's Front of Judea against the
Judean People's Front. **Splitters.**

**The precedent that matters most is the machine itself.** In Dr. Seuss's *The Sneetches*
(1961), Sylvester McMonkey McBean rolls in a **Star-On Machine** that applies a purely
cosmetic membership marker for three dollars, then a **Star-Off Machine** to remove it, and
profits in both directions while the Sneetches sprint between them until nobody can
remember who was which. That is the SwagOMatic, including the defection hatch, including
the revenue model, including the ending. It is sixty-five years old and it is a better spec
than most design documents.

### Affinity is to the stand, not to the hat

*Don, 20 Sep 2026: what if affinity was to the stand, and the stand can be configured to
sell any of a number of hats (or wigs even)? When you changed hat colours or wigs, everyone
in the "cult" of that particular object will be compelled to run over and switch.*

**This is the correction that makes the whole thing work.** Membership points at the
*object*, and the object has a current stock. The marker is not what you believe in — it is
whatever the stand is selling today. Which means the doctrine can be changed by whoever
configures the stand, and the members change with it, because their loyalty was never
attached to the colour.

That is how it actually works, and it is why the Sneetches ending lands: nobody in that
story was ever loyal to stars, they were loyal to whatever McBean was operating. Orwell
built the same beat into *1984* — Oceania switches from war with Eurasia to war with
Eastasia overnight, and the crowd absorbs the reversal without breaking stride, because
**allegiance was to the switching authority all along.**

### The switch is a loyalty assay, and the comedy is in the uniformity

Reconfiguring a stand fires a **mass re-dress**: every member is compelled to drop what
they are doing, run over, and change. Don wants them to line up, and that turns the gag
into an instrument, because the switch measures something no other mechanic in this
document can:

> **Change red to green. Whoever follows was loyal to the stand. Whoever balks was loyal
> to the colour. Turn the knob, count the dropouts.**

Conviction and obedience look identical right up until the doctrine changes, and then they
separate cleanly. The player runs that experiment themselves and gets a number, which is
the same standard as the [doctrine-distance slider](#the-knob-that-carries-the-argument) —
discovered by experiment, no editorial.

**The queue utility exists, and Don found it in the wild.** The
[Slap Conga](../../repo-shows/will-wright-premiere/simprov-slap-conga.yml) is built from
exactly three objects — **Cupid, Buddha, Crowd Sitter** — and its origin note is that "Don
hit this loop once in the wild — lovers lined up and slapped him in sequence." Sims queue
to perform a social interaction on a target, one at a time, as emergent behaviour nobody
had to implement. Its score is `consecutive_slaps_in_one_queue`, so **queue length is
already the metric**.

The mass re-dress is that machine with the verb changed. Same crowd trap, same
[Crowd Sitter](../../catalogs/simprov/README.md) seating, same Buddha keeping motives alive
so the line does not collapse into hunger halfway through — which is the sentence this
document already flagged as needing no editorial, now doing structural work. Queue length
stops being a slap counter and becomes **a visible congregation size**: the rally is the
line at the merch stand.

For the choreography, Faceball already has the vocabulary — **formation swoop**, listed as
"figure-eight, conga, diamond, pinball ballet," alongside synchronised-swimmer spin modes
([`physics-and-gags.md`](../faceball-construction-set/physics-and-gags.md)). The uniformity
*is* the joke, and it reads better as a drill team than as a stampede.

### Many slots, many cults at once

*Don: different cults can mount accessories on different body parts, so characters can be
in several cults at once with overlapping and non-overlapping permutations. The Balls For
Hands club.*

One slot per cult, many slots per body, so **membership is a set rather than a flag**.
Rivalry falls out of geometry:

| | Same slot | Different slots |
|---|---|---|
| Can one Sim join both? | **yes — and that is the problem** | yes, comfortably |
| What happens | the slot holds one thing, so the member is [torn between them forever](#ping-pong-multi-cult-cap-dynamics) | both satisfied at once, no interaction |
| Relationship | rivals, necessarily | compatible, possibly allied |
| Example | Balls For Hands vs. Pixelated Left Hand — both want the hand | Pixelated Head + Balls For Hands — no conflict at all |

**So the feud graph is computed from anatomy, and belief has nothing to do with it.** Two
cults are enemies exactly to the degree their regalia collide, which is a harder and funnier
claim than "small differences cause big feuds" — it says the differences are not even the
mechanism, the *real estate* is.

Note that colliding cults do **not** refuse each other. Nothing stops a Sim enrolling in
both, and the conflict shows up afterwards as an oscillation rather than as a rejection —
which is [where this ends up](#ping-pong-multi-cult-cap-dynamics), and it is much worse than
exclusion would have been.

And a Sim's costume becomes a **readable affiliation display**: cap, plus balls for hands,
plus one pixelated ear, is three memberships legible at a glance. The god-view asymmetry
this document keeps returning to gets rendered on the character instead of on the floor.
Walk through a crowd and read everyone's commitments off their bodies.

**Faceball is the parts supplier.** "Balls For Hands club" is a joke that happens to name a
real integration: [Faceball](../faceball-construction-set/README.md) already builds
attachable parts with per-feature slots and pairing
(`mouth_hole`, `googly_eyes` with `paste_on` and `pair`), so the SwagOMatic stocks Faceball
output and players author their own regalia. That is Faceball's "seeds, not showpieces"
philosophy arriving in Cult Sims, and it makes the swag line **user-generated** — the
funniest possible cult uniform is the one a player made. Wigs come for free, since the
appliance is a reskinned WigOMatic and hair colour is the most arbitrary difference
available.

### The pixelation clubs, or: regalia made of absence

*Don: also censorship hijinks like the "pixelated head club" and "pixelated left hand" club
and "pixelated right hand club". I think that's possible.*

It is possible, and it is already specced. Faceball's `sims1_pixelization` modifier attaches
**a bounding box to any part** — "boobs, dongs, a joint, a whole head" — and drives a
pixelation of the screen layer underneath it. A mosaic is therefore already a slot-mounted
accessory, which is exactly the shape a cult marker needs.

**These are the best clubs in the set, because the uniform is a redaction.** Every argument
in [the censorship section](../faceball-construction-set/adult-section.md#what-censorship-actually-does)
now pays off as a membership mechanic:

- **The occluder is evidence.** A mosaic signals *something forbidden is here*, so wearing
  one voluntarily is claiming forbidden-ness as status. The uniform that hides you makes
  you the most conspicuous thing in the room, which is the
  [Streisand argument](../faceball-construction-set/adult-section.md#why-any-of-this-is-in-a-construction-set-the-streisand-argument)
  worn as a hat.
- **Closure does the rest.** Members are marked by what cannot be seen, and every observer
  fills the gap themselves — so the cult's regalia is different for everyone who looks at
  it while being identical in the save file.
- **Pixelated Head Club members are indistinguishable from each other.** The uniformity
  comedy hits its ceiling: a congregation whose faces are all mosaic, lined up at a stand,
  individually unidentifiable even to the player.

And **Left Hand against Right Hand is Swift's egg**, arriving on its own without being
reached for. Two clubs, identical doctrine, identical marker, differing only in which hand
— and by the slot rule they are not even rivals, because they occupy different slots, so
they can coexist while loathing each other. Big-Endians and Little-Endians could always
have shared a table. That is the joke Swift was making.

**Transmission comes free, and it is already written.** The mosaic spec's
`moments_of_unnecessary_censorship` includes "pass a **pixelated joint** → it pixelates your
HEAD (the mosaic follows the contraband)." That is a contact-transmission contagion, already
designed, which gives the pixelation clubs the **zombie-bite model** — involuntary, by
contact — running alongside the stand's **purchase model** in the same playset. Two
transmission modes, neither invented here, and the contrast between them is the
[argument this document opened with](#the-hat-is-a-better-mechanic-than-persuasion).

`needs-check: trivial in Faceball, which renders in real time, but sims1 sprites are`
`pre-rendered per rotation and zoom — so a per-slot mosaic has to be baked into the skin`
`variant through the Stat-U-Matic sprite pipeline rather than applied live. Possible in`
`both, by different means; confirm the bake cost before promising the left/right split.`

### The knob that carries the argument

Each stand gets its own parameters, which is what makes this a toy rather than a lesson:

| Parameter | What it does | Why it is the interesting one |
|---|---|---|
| **current stock** | which hat, wig, or part is issued *right now* | changing it fires the [mass re-dress](#the-switch-is-a-loyalty-assay-and-the-comedy-is-in-the-uniformity), which is the loyalty assay |
| **slot** | which body part this cult claims | decides who its rivals are, before doctrine is considered |
| **swag line + color** | the catalogue it can issue from | the only real difference between rival cults |
| **doctrine distance** | how far this cult's stated beliefs sit from its rivals' | **turn it toward zero and watch hostility rise** |
| **price ladder** | cap → flag → vest → commemorative tier | each rung costs more and marks more commitment |
| **proselytizing radius** | how far the stand advertises | overlapping radii are the contested ground |
| **defection penalty** | cost of taking the hat off | set high and the Eloporter becomes the only exit |
| **channel binding** | which TV channel feeds this stand | whose demand this stand is harvesting |

**Doctrine distance is the parameter the whole playset is for.** The player drags it
toward zero expecting the factions to reconcile, and instead the feud intensifies, because
identical cults compete for the same slot. Freud's thesis becomes a slider, and the player
discovers it by experiment rather than by being told — no editorial required, which is the
same standard the television's god-view overlay meets.

The price ladder is where the swag gets ridiculous, and the escalation is mechanical
rather than a list: each tier costs more and is harder to explain away as a garment, so
the wearer's sunk commitment is legible at a glance. A vest tier also connects to the
[tactical-cosplay peg](../../bits/gag-vice-not-ice-puppet/gag-vice-not-ice-puppet.yml)
already written up in bits.

### Robustness: what multiple stands must not assume

Don asked for multiple stands to work robustly, and per
[robust-first](https://github.com/SimHacker/moollm/blob/main/skills/robust-first/SKILL.md)
the failure modes are worth naming before the first one is built:

- **No singleton state.** Nothing may refer to "the cult." Every membership fact is owned
  by a stand, so two stands on a lot is the normal case and one stand is the special case.
- **Joining is leaving, but only within a slot.** Enrolling at stand B evicts stand A only
  if both claim the same body part; B's join and A's defection are then *the same event*,
  and A's roster must hear about it rather than keeping a ghost. Memberships in other slots
  must survive untouched, which is the bug waiting to happen — a Sim joining a hand cult
  should not quietly lose their hat.
- **Deleting a stand must release its members, and only its slot.** Bulldozing the hub
  cannot leave Sims wearing regalia belonging to a group host that no longer exists.
  Degrade to unhatted, do not orphan, and do not touch the other three cults they are in.
- **A mass re-dress must survive interruption.** The queue is long, and Sims will be
  pulled out of it by fire, death, hunger, or the player. Half-switched membership is the
  normal state, not an error, so a member wearing last week's colour is *behind*, not
  broken — and how long the stand tolerates that is a parameter rather than a crash.
- **Two stands, same color.** Genuinely open: do they merge into one host, or is selling
  the *same* hat the most offensive possible provocation? The second reading is funnier
  and probably truer.
- **A stand with no channel** still works, just slowly — it has to rely on its own
  advertisement instead of manufactured demand, which is a useful control condition for
  measuring what the television actually contributes.

`needs-check: how many accessory slots sims1 really exposes, and whether they are`
`independent. The design needs several mutually exclusive slots — one per body part —`
`since that is what makes multiple simultaneous cults work and what decides which ones`
`are rivals. Heather and Steve's call, since the skin and accessory system is theirs —`
`religion_mapped_skins may already answer it.`

## The television dispenses ideology by the channel

*Don, 20 Sep 2026: the TV set could have different channels that dispense ideologies,
and Faux News makes you want to wear MAGA caps.*

Zombie Sims has the ham radio as `wave_controller` and SliceCity has the power plant as
seed spawner; Cult Sims needed "broadcast sermons, recruitment drives" and had no object
to put them in. It is a television, and the Sims already shipped one with a channel
selector on its pie menu. This section covers what a channel *does*; that the same set
[also takes the order and issues the cap](#the-television-is-the-vending-machine) is the
collapse the document arrives at later.

### The mechanic: the TV does not touch the Sim

This is the part that makes it worth building, and it is engine-native rather than
invented. In SimAntics, objects **advertise** scores to Sims, and a Sim autonomously
walks toward whatever advertises highest given its motives and personality. So:

> **Faux News does not convert anybody. It raises the advertised score of the cap.**

The Sim then crosses the room and buys the hat *on its own*, because the hat is now the
most attractive thing available. No coercion state, no forced interaction, no conversion
check to fail. The television is a **second-order object**: it does not satisfy a need,
it re-weights what everything else is worth.

Two consequences fall straight out, and both are the argument rather than decoration:

- **From inside, nothing happened.** Every Sim freely chose the highest-advertising
  option, which is what Sims always do. There is no moment you could point to and call
  it the coercion.
- **From outside, the player can see the numbers move.** The god view shows the
  advertisement re-weighting that the Sims themselves cannot perceive. That asymmetry is
  the whole rhetorical payload, and it requires no editorial — it is just the debug
  overlay.

### Channels are the magazine mode, broadcast

The dispatch vocabulary already has the right shape. A
[`magazine`](../../schemas/advertisement-dispatch.yml) is a portable catalog that turns
the surface it is placed on into a temporary menu host. **A channel is the same thing
without the surface**: it radiates to everyone in the room, so the room becomes the
host and nobody has to pick it up.

| | magazine | channel |
|---|---|---|
| Reach | whoever walks to the table | everyone in the room, at once |
| Opt-in | you choose to browse it | it is already on |
| Carrier | an object you can throw away | the air |
| Who aims it | the Sim who picks it up | **whoever holds the remote** |

**The remote control is therefore the contested object**, and that is a household power
struggle the Sims engine is extremely good at staging. One object, high advertisement,
one holder at a time.

### I'm the Slime: the worked example of a channel

*Don, 20 Sep 2026: a TV set that plays the riff from Zappa's slime oozing out from your TV
set, then plops a green expanding slime-puddle out in front of it, and at the same time
anyone watching — it only does this when people are watching — gets their souls corrupted
in some way, like gaining an affinity for red caps.*

**Zappa wrote this object's spec in 1973.** "I'm the Slime," on *Over-Nite Sensation*, is
sung in the first person *by* a television, and its verses are a functional description of
everything above:

- "I'm the slime oozin' out from your TV set" — the spawn behaviour, taken literally.
- "I'm the tool of the government / And industry too / For I am destined to rule / And
  regulate you" — the apparatus thesis, stated by the apparatus.
- "I may be vile and pernicious / But you can't look away / **I make you think I'm
  delicious** / With the stuff that I say" — **this is advertisement modification in
  verse.** The slime does not compel anybody. It makes things *seem* delicious. That is the
  same mechanic as [the TV never touching the Sim](#the-mechanic-the-tv-does-not-touch-the-sim),
  and it was written fifty-three years before this document argued for it.

Like [the Sneetches](#multiple-stands-and-why-the-smallest-difference-makes-the-worst-feud)
for the SwagOMatic, the reference is not decoration — it is a better statement of the
design than a spec would manage, by someone who was making the argument first.

### Audience-gating is the whole point

"It only does this when people are watching" is the load-bearing constraint, and it is not
just thrift. **A TV in an empty room is inert.** Nothing oozes, nothing accrues, no soul
moves. Which means the Sim's own attention is the delivery vector: you cannot be corrupted
by a television you are not watching, so the corruption requires the victim's
participation at every step and there is still no moment anybody could point to and call
it coercion. It is the document's argument compressed into a trigger condition.

Two things follow that are worth more than the joke:

**The puddle is a viewership meter.** It expands with audience-hours, so a room's floor
records how much watching happened there. The player reads accumulated corruption as
literal floor coverage while the Sims see only a mess — the god-view asymmetry again, this
time as a physical quantity rather than a debug overlay. Walk into a strange house, look at
the floor, and you know what they have been watching.

**Sims mop puddles**, which is native behaviour and it closes a loop the satire could not
buy: watching television generates housework. Leave it and the slime takes the room, so the
apparatus fouls its own nest and somebody has to be assigned to clean up after the
ideology. Who mops is a household politics question, and it will not be whoever holds the
remote.

### What "corrupted soul" means mechanically

Don's word is the precise one, because in this repo a soul is **persistent saved identity**
rather than a mood — see [the sims1 Soul Bridge](../../catalogs/soul-city/sims1-soul-bridge.md).
So watching has two distinct effects, and separating them is what makes the demand side
actually reach the supply side:

| | While watching | Written to the soul |
|---|---|---|
| Scope | the room | **travels with the Sim** |
| Lifetime | ends when they walk away | persists, and it is saved |
| Effect | other objects' ads re-weighted | a standing **affinity for a particular stand** |

The second row is the upgrade. A room-scoped re-weight cannot convert anybody, because the
stand is somewhere else; an affinity that travels means a Sim watches at home and then
walks across the lot to a [SwagOMatic](#the-hub-is-a-swagomatic-and-multiple-stands-are-the-game)
under their own steam. **Exposure becomes conversion at the moment the effect stops being
local.** And affinity accrues per watching-hour, so it is a dose — two Sims in the same
room with different viewing histories arrive with different affinities, and the puddle
measures the dose for both of them.

Because souls in this repo persist past death — the graveyard manager and the tombstone
generator whose container is "text and a soul" — **a corrupted soul stays corrupted into
the afterlife.** The ghost still wants the hat. Nobody has to write that joke; the save
format commits it.

The corruption is per-channel, which wires this into the faction machinery: Faux News
builds affinity for *a stand* rather than for a colour, so the `channel binding` parameter
stops being bookkeeping and becomes the **transmission path** — channel makes the want, the
soul carries it, the stand collects. Three stages, three objects, all already designed.

And because [affinity points at the stand](#affinity-is-to-the-stand-not-to-the-hat), a
channel cannot dictate what its converts end up wearing. It delivers them to an object,
and the object decides. Watch enough television and you do not acquire a belief — you
acquire **a stand you will obey when it changes its mind.**

### Shipping the riff without shipping the riff

Zappa's estate is not a rights holder to improvise around, and the repo already solved this
exact problem: [**recipes, not files**](../../catalogs/soul-city/rendering-and-rights.md).
A moody station travels as envelope and timing data keyed to a **track identity** — duration
plus acoustic fingerprint — matched against the copy the recipient already owns, which is
the LRC and karaoke-chart tradition and asks nobody to fetch anything.

So the slime TV ships as **a cue sheet, not a song**: the ooze event, the expansion curve,
and the affinity tick are timed against a track identity, and they fire for a player who
owns *Over-Nite Sensation* and do nothing at all for one who does not. The
[jukebox and Squawk Box shops](../../catalogs/soul-city/object-shops.md) already supply the
player's-own-audio slot. Quoting four lines of lyric in a design document is a different
question from shipping a recording, and this document is doing the former.

### The channel lineup is the faction generator

Different channels dispense different ideologies, which means the schism mechanic gets
its cause. `clique_partition` forks the group host when a rival channel starts selling a
different hat, and the shrine question in **Open** becomes concrete: the two factions are
arguing over the television.

**The content already exists in this repo.** *Faux News* is not a placeholder — Don built
**SimFaux**, an OpenLaszlo Fox News parody, in 2006, and it is being rebuilt as a live
switchboard instrument at [`apps/simfaux/`](../../apps/simfaux/) with a show seeded at
[`repo-shows/simfaux/SHOW.yml`](../../repo-shows/simfaux/SHOW.yml). So the cult's
propaganda channel is a working app, and the playset's TV can tune to it.

`needs-check: The Sims 1 TV offered channel selection from the pie menu with`
`per-channel effects, and personality influenced which channels a Sim enjoyed — but`
`confirm the actual channel names, their motive/skill effects, and which personality`
`axes gated them before writing any of it as fact. Heather and Steve's call on whether`
`the TV is a zombie-sims plugin or the Cult Sims hub proper.`

## The television *is* the vending machine

*Don, 20 Sep 2026: now it is making sense that the "vending machine" or "clothes cabinet" or
"web stand" for cults should be the television itself. And you "order stuff from TV" to get
your cap.*

**This collapse is a simplification and it is also more honest.** The demand/supply split was
a structure this document invented to keep two objects busy; fusing them removes an object and
gains an argument, because **direct-response television sells the thing it just made you
want, in the same breath.** There is no gap between the wanting and the ordering — the
absence of that gap is the entire format. Call now.

The precedents are not decorative. **Televangelism** is the fused object already built: the
set asks for money and sends back a token — a prayer cloth, a lapel pin, a book — so the
broadcast, the collection plate, and the regalia issue are one appliance. The same topology
runs a home-shopping channel and every talk host who sells supplements during his own
programme. The grift does not need two devices, and pretending it does was the weaker design.

### One role, many skins

Don's three names — vending machine, clothes cabinet, web stand — are not alternatives to
decide between. They are **skins on one orchestrator role**, which is exactly what the
[AnythingOMatic pattern](../../catalogs/soul-city/portals-and-modules.md) is for, and each one
is the same mechanism in a different media era:

| Skin | Era | What it makes obvious |
|---|---|---|
| **Television** | broadcast | demand and supply are one object — the canonical skin |
| **Vending machine** | Seuss | the operator profits in both directions ([Star-On, Star-Off](#multiple-stands-and-why-the-smallest-difference-makes-the-worst-feud)) |
| **Clothes cabinet** | the dresser | it is a wardrobe, and membership is what you have on |
| **Web stand** | now | the merch drop, and the algorithm that decided you wanted it |

All four keep the [stocked pie-menu tree](#the-object-already-exists-stocked-differently) and
all four inherit the one-armed-bandit lineage. The television is canonical because it fuses
the roles; the others are the same object wearing different fiction, which is what a
reskinnable appliance is supposed to give you.

### Membership is a relationship with a television

Don's term for the bond is **"under-the-thrall-of,"** and taking it literally is the best
structural decision available here: membership is **a directed, weighted edge in the
relationship matrix, from a Sim to an appliance.**

That pays for itself immediately:

- **Thrall is a score, not a flag.** Members are more or less captured, so commitment has an
  intensity and a threshold rather than a boolean.
- **The roster is a query**, not a list to keep in sync — ask the matrix who is in thrall to
  this set. Half the [multi-stand robustness
  problems](#robustness-what-multiple-stands-must-not-assume) evaporate, because there is no
  second copy of the truth to go stale.
- **Super Cupid already operates on it.** Its topologies (`star` inbound to the set, `complete`
  across the congregation) work on membership directly, because membership now lives in the
  structure Super Cupid edits.
- **[Disband](#disband-and-the-three-kinds-of-member) becomes literally what Don said it was** —
  "un-does all the membership bonds in the relationship matrix" is no longer a paraphrase, it
  is the operation: drop every inbound thrall edge.
- **You can see it in the panel.** A Sim's relationship list shows the televisions they are in
  thrall to, which makes the affiliation graph readable without new UI.

## Ping-pong multi-cult cap dynamics

*Don: if they were in another cult too, the other cult's TV set sees they are wearing the
wrong cap, and advertises strongly that they wear its cap! Ping pong multi cult cap dynamics.*

**This is the best emergent result in the playset, and nobody has to implement it.** Take one
rule — *a set advertises more strongly at members wearing the wrong cap* — and give a Sim
thrall to two sets that both claim the head:

1. Set A prescribes red. The Sim is wearing red. A is satisfied and quiet.
2. Set B sees a member in the wrong cap and advertises **hard** for green.
3. The Sim crosses the room, orders green, puts it on. B goes quiet.
4. **A now sees a member in the wrong cap** and advertises hard for red.
5. Go to 1, forever.

The Sim spends the rest of its life walking between two televisions changing hats.

### It is a hunting oscillation, which means it is a real result

This is not a bug and it is not whimsy — it is **two independent controllers fighting over one
actuator with no coordination**, which is the classic hunting oscillation that dueling
thermostats and competing control loops produce. The
[slot-collision rule](#many-slots-many-cults-at-once) predicted these cults would be rivals;
this is the *mechanism* of the rivalry, and it is far nastier than mutual exclusion would have
been. **The cults do not fight each other. They tear the member in half.**

It also self-limits in a way that turns the farce into an instrument:

- **Ping-pong is the signature of a tie.** If thrall(A) > thrall(B) by enough, the Sim settles
  on A and stays there. Oscillation only happens when the two thralls are *balanced*, so
  **watching a Sim ping-pong tells you it is exactly torn** — the behaviour is a readout.
- **Needs decay while commuting.** A ping-ponging Sim eats nothing, sleeps nothing, and
  eventually collapses, so it becomes a resource sink that requires
  [Buddha](#it-wires-into-objects-that-already-exist) to sustain. Death by irreconcilable
  ideological obligation is an entirely legitimate Sims death and it needs no new code.

### Hysteresis is the knob, and refusing to turn it up is the joke

Any engineer looking at that loop adds a **deadband** so the controller stops hunting. So make
it a parameter and hand it to the player:

| `commitment_hysteresis` | Behaviour |
|---|---|
| zero | pure farce — Sims ping-pong between sets until they drop |
| low | visible dithering, members mostly settle, occasional relapse |
| high | Sims commit to their dominant set and ignore the other's shouting |

**The player tunes how much farce they want**, which is the same shape as the
[doctrine-distance slider](#the-knob-that-carries-the-argument): the knob is the argument, and
you find out what it means by turning it. Stated once and not belaboured — a person holding two
total commitments that claim the same ground, with no mechanism to reconcile them, does in fact
shuttle between them until something gives.

### The sets escalate against each other

One more consequence falls out of the word *strongly*. If advertisement strength rises when a
set sees the wrong cap, then **advertising is state-dependent — a feedback controller, not a
constant** — and two colliding sets therefore escalate, each shouting louder precisely when it
is losing.

Which produces the genuinely alarming version: **an arms race between two televisions crowds
out every other advertisement on the lot.** Both sets are running at maximum, so the fridge,
the bed, and the toilet cannot compete for the Sim's attention on score. The Sim is not
neglecting its needs out of devotion. It literally cannot hear them over two televisions
arguing about a hat.

`needs-check: whether sims1 supports ordering from the TV at all, or whether the phone is`
`the ordering device and the set needs a phone step ("call the number on screen", which is`
`arguably better). Also whether an object can hold a relationship-matrix edge with a Sim, or`
`whether thrall needs a parallel structure keyed the same way.`

## High fives, and what they lead to

*Don, 20 Sep 2026: when in a cult, members can high five each other to increase their
relationship, so the whole cult bonds together. And you know what that leads to! …Lots of
just incidentally happens to be gay, not that there's anything wrong with that, sex.*

### The high five is a membership-gated hand-cranked Super Cupid

Gate the interaction on shared membership and two things happen at once. The obvious one is
bonding. The better one is that **the pie menu becomes the membership test** — if the slice
is offered, they are in your cult, so a player discovers the affiliation graph by walking up
to people and seeing what is on the menu. No UI required, and it works for a cult whose
members are wearing
[mosaics instead of faces](#the-pixelation-clubs-or-regalia-made-of-absence).

Mechanically this is **the hand-cranked version of Super Cupid's `complete` topology**.
[Super Cupid](life-events-playset.md) takes a scope and a topology — complete, star, perfect
matching, clique partition — and rewrites a whole region of the relationship matrix in one
gesture; everyone loving everyone is what `complete` means. A cult with a mutual high five
grinds its way to the same matrix pair by pair, cheaply and repeatedly, in
[daily and lifetime increments](../../process/art-thief-game.yml). Normal Sims
relationships grow slowly and pairwise; **a cult is a relationship-inflation machine that
raises the entire clique at once**, because everyone is doing it with everyone.

### There is no platonic channel

Here is the engine fact that makes Don's punchline inevitable rather than editorial: **The
Sims tracks one relationship score per pair, not separate friendly and romantic tracks**,
and romantic interactions unlock above a threshold on that single score. So bro-bonding and
courtship accumulate *the same number*. There is no way to become extremely close to
someone without also becoming romance-eligible with them.

Which makes the choice of gesture perfect. A high five is the most deniable physical
contact available — it is the no-homo handshake — and **the engine cannot tell it apart from
courtship, because a relationship point is a relationship point.** The deniability is
entirely in the animation. The accumulation is identical.

### The engine never checks gender, so nobody has to write the joke

The Sims shipped without modelling sexual orientation. Romantic interactions were offered on
relationship score, and the code did not consult gender — which is why same-sex romance was
in the game from the start, and why it surfaced publicly in a live E3 demo when two female
Sims kissed without anyone having planned it.

So the romance graph that falls out of a fully-bonded cult is **orientation-blind by
omission**. Nothing was authored. Nobody added a gag. An engine that counts relationship
points and does not check gender, pointed at a roster that high-fives itself all day,
produces exactly what Don says it produces.

**And that is the sharpest thing in this document, because of what it would take to prevent
it.** To make the cult behave according to its stated ideology, somebody would have to go
*add a gender check to the romance system*. The prejudice is not in the machine; it is a
feature request, and it would have to be filed, specified, and implemented on purpose.

> **The satire is not that these people are secretly anything. It is that the cohesion
> ritual does not share the cult's politics, and the simulation is indifferent exactly where
> the doctrine is obsessed.**

That aims at the doctrine's incompatibility with its own machinery rather than at any
wearer, which is the standard
[this document set for itself](#where-the-satire-is-aimed) — and it survives a fact-check,
because the mechanism is just what the engine did in 2000.

**There is also no closet in the engine.** The relationship is in the data, visible in the
panel, and Sims cannot lie about it. So the god-view asymmetry this playset keeps producing
arrives a third time: the player watches [advertisement scores
re-weight](#the-mechanic-the-tv-does-not-touch-the-sim) that Sims cannot perceive, watches
[slime accumulate](#audience-gating-is-the-whole-point) that Sims read as mess, and now
watches a romance graph the doctrine denies. Seinfeld got the accompanying dialogue right in
1993 — the frantic disclaiming *is* the tell, and "not that there's anything wrong with
that" is what the protest sounds like from outside.

### Cohesion is stored potential energy

Now the payoff. Everyone in the cult is in love with everyone. One public kiss with a
newcomer, and the
[Slap Conga](../../repo-shows/will-wright-premiere/simprov-slap-conga.yml) runs — except the
queue is not a handful of lovers now, it is **the entire congregation, in line, one at a
time**, with Buddha keeping their motives alive so the line does not collapse before it
finishes.

It is a spring rather than a fuse, which is the next section.

**Slap-queue length is proportional to how tightly the cult bonded**, and queue length was
already the score. So the bonding phase is literally the high-score setup: *Cult Sims is a
Slap Conga farm.* The mechanism that holds the cult together is the mechanism that detonates
it, and the tighter it is held, the bigger the detonation.

**The guru is therefore the single point of failure.** Point Super Cupid's `star` topology
inward and adoration flows to the leader, which means the leader is everyone's romantic
target simultaneously — so the leader kissing any one member in public slap-queues the whole
room. That the sexual conduct of the leadership is where these organisations actually come
apart is not a joke this document has to make; the topology makes it.

### The slap congas keep it spicy: a limit cycle, not a death spiral

*Don, 20 Sep 2026: and the slap congas will keep it spicy!*

**Plural, and the spec already agrees.** The Slap Conga's secondary scores are
`queues_survived` and `time_to_first_conga`, and its buff rule is "kiss or Cupid to restore
relationship — **queue may reform**." It was designed to recur. So the cascade is not the
cult's ending, it is its **metabolism**.

The loop runs on the machinery already described, and it closes on itself:

1. High fives inflate the matrix. Cupid converts scores into romance.
2. One public kiss fires a congregation-length slap queue. Relationships crater.
3. The repair mechanism for cratered relationships is… **the high five**, which is sitting
   right there and is still membership-gated.
4. Go to 1, tighter than before.

**Rupture-and-repair is stickier than never having fought**, because step 3 is an investment
and the member now has repair work sunk into the group. Each cycle raises the switching cost
that [defection](#the-hat-is-a-better-mechanic-than-persuasion) has to overcome. So the
cascade is **retention, not attrition** — which is the opposite of what it looks like while
it is happening, and it is the reason `queues_survived` reads as a tenure metric rather than
a damage count. A cult that has survived twelve of these is not a fragile cult.

**The cascade also filters.** Weak-tie members drop below the affinity threshold and leave
during the chaos; the ones who stay were the committed ones, so average commitment *rises*
after every crisis. Tighter roster, more inflated matrix, larger next queue: **the amplitude
grows**. That is an oscillator winding up, and eventually it does break — but it breaks as a
[schism](#many-slots-many-cults-at-once) rather than as a collapse, because the survivors are
more committed than they started.

And the Slap Conga's own design notes already call this **"failure-as-entertainment"**, which
is the whole point of the word *spicy*. **Drama is the product.** The cult is not selling
hats, it is selling the cycle — and that is precisely what the
[television](#the-television-dispenses-ideology-by-the-channel) on the other
side of the lot is doing too, manufacturing outrage that requires more channel to resolve.
**The broadcast apparatus and the cult turn out to be the same shape**, which is the finding
this playset was built to arrive at, and neither object had to be told.

### The lifecycle, which is a loop

The playset now has endogenous dynamics and it needed no new mechanisms:

| Stage | Object | What happens |
|---|---|---|
| Demand | [television](#the-television-dispenses-ideology-by-the-channel) | a channel builds affinity for a stand |
| Recruitment | [SwagOMatic](#the-hub-is-a-swagomatic-and-multiple-stands-are-the-game) | the Sim buys the marker and joins |
| Cohesion | high five | the relationship matrix inflates across the roster |
| Romance | Cupid / Super Cupid | high scores become a lover stack, orientation-blind |
| Rupture | one public kiss | the congregation-length jealousy queue |
| **Repair** | **high five again** | **the loop closes here — back to cohesion, tighter** |
| Attrition | Eloporter | weak ties fall below threshold and leave; the core concentrates |
| Schism | a second stand | eventually, and only when the amplitude gets too large |

Before this, Cult Sims could recruit and could lose members, but nothing made it *live*. The
high five supplies a cycle rather than a failure state, and the cult does not die of its own
bonding so much as **run on it**.

## Population tools: Instacult, Banish, Disband, and the deprogrammer

*Don, 20 Sep 2026: "Instacult" pie menu item that instantiates 10 more cult members. Hmm,
might need a deprogrammer to take them away too. Or just "Banish" pie menu item on them.*

The instinct to ship the unmake button alongside the make button is the right one, and the
tools Don names are not variations on each other — **one is a god tool, two are cult powers
at different scopes, and one is a rival institution.** Keeping them distinct is most of the
design.

### Instacult makes the experiments runnable

Almost nothing above is observable at household scale. A
[mass re-dress queue](#the-switch-is-a-loyalty-assay-and-the-comedy-is-in-the-uniformity), a
congregation-length slap cascade, an inflated relationship matrix, a
[dropout count](#the-switch-is-a-loyalty-assay-and-the-comedy-is-in-the-uniformity) — all of
them need a roster, and the Slap Conga's setup step is currently the manual chore of
"pre-invite a crowd onto the lot, trap / seat them." **Instacult is the button that does the
tedious part**, which makes it an instrument rather than a cheat.

It has a sibling already in the kit: [Super Cupid](life-events-playset.md) "mints nothing"
and rewrites a whole region of the relationship matrix in one gesture. Instacult does the
same thing for population that Super Cupid does for relationships — **skip the grind, arrive
at the interesting state.** Naming that as a pattern is useful, because the playset needs
both: you cannot study a crowd phenomenon by recruiting one Sim at a time.

**The ten arrive pre-converted, already wearing the hat**, and that is worth stating plainly
because it is a limitation rather than a feature: *Instacult bypasses conversion entirely, so
it can tell you nothing about conversion.* The TV-and-stand pipeline is the argument; Instacult
is the crowd. A careful player uses one to populate and the other to demonstrate, and having
both makes the distinction visible instead of blurred. The uniformity gag comes free — ten
identical members materialising in identical hats.

### Banish is excommunication, and it belongs to the guru

A **Banish** pie slice is the cheap removal, and the question that decides what it *means* is
who gets the menu item.

| Operated by | What it is | Effect on the rest |
|---|---|---|
| the player | a god tool — sandbox cleanup | none, it is outside the fiction |
| **the guru or the stand** | **excommunication** | **the interesting one** |

Make it a cult power and it stops being housekeeping: **purging one member in front of the
congregation should raise everyone else's commitment.** Discipline performed publicly is a
retention mechanism, which pairs exactly with the
[cascade-as-filter](#the-slap-congas-keep-it-spicy-a-limit-cycle-not-a-death-spiral) — the
cascade concentrates the core by attrition, and the purge concentrates it by force. Same
direction, two different costs.

That also gives the guru a lever the player can watch being abused, which the document's
[open question about a conduct guard](#open) was already circling.

### Disband, and the three kinds of member

*Don, 20 Sep 2026: the cult anchor object will have a "Disband" item that un-does all the
"membership" bonds in the relationship matrix, and disappears (raptures) all the NPC cult
members. So family members, visitors from other lots, and NPC cult members can be members of
a cult represented by a cult swag vending machine orchestrator object.*

**Disband is the robustness requirement promoted to a verb.** This document already demanded
that [deleting a stand must release its members](#robustness-what-multiple-stands-must-not-assume)
rather than orphan them; Disband is that same teardown, exposed on the anchor's pie menu
instead of hidden in a cleanup path. Which is the better pattern in general — **if the
graceful path has to exist anyway, let the player ask for it on purpose.**

The design content is the member taxonomy, because Disband has to treat the three classes
differently and **what happens to each falls out of where it lives in the save**:

| Class | Where it persists | On Disband |
|---|---|---|
| **NPC members** (Instacult spawns) | nowhere — they were instantiated | **raptured**, and nothing is lost |
| **Visitors from other lots** | another household's save | go home, **and take the affinity with them** |
| **Family members** | your save, permanently | **stay**, unhatted, and you live with the aftermath |

**Don's word is exactly right, and the joke is theologically precise: the NPCs get raptured
and the real people are left behind.** Nobody has to write that; the save format does it.

And it is the consequence system rather than a gag. If everybody vanished, dissolving a cult
would be free, and the whole cycle would have no weight. Because household members persist —
with whatever the [slap cascade](#the-slap-congas-keep-it-spicy-a-limit-cycle-not-a-death-spiral)
did to their relationships still sitting in the panel — **shutting down the cult costs
something that stays in your save.** You disband it and you still have to live with the
people you queued up and slapped.

**The visitor row is the epidemiology, and it is the most consequential line in the table.**
A visitor who joins, then walks home carrying the affinity, is how the cult **crosses lots**.
That is the neighbourhood-scale transmission the proposed `spreads:` field actually wants:
not Sim-to-Sim in a room, but household-to-household by social call. The simulation's scope
stops being the lot. Visit them next week and there may be a stand in their living room.

### What Disband does *not* undo, and why that is the good part

Don's phrasing is precise — it undoes the **membership** bonds. Not the friendships. And
[Super Cupid](life-events-playset.md) already supplies the implementation, since it can write
either **base values** or a **temporary buff** per cell:

- **Membership is the buff layer.** Disband strips it in one gesture, which is what Super
  Cupid is for.
- **High-five bonding is base values.** It survives, because nobody removed it.

So after Disband you are left with **an intact, tightly-bonded clique wearing no hats** — a
cult-shaped hole with the congregation still in it. Which completes the schism mechanic from
the other direction: [a second stand](#many-slots-many-cults-at-once) can adopt that roster
*immediately*, because the relationship matrix it needs is already inflated and paid for.

> **The cult dies and the congregation does not.** That is how movements actually re-form,
> and here it is a consequence of storing the two kinds of bond in different layers rather
> than a behaviour anybody scripted.

### The four removal verbs are not the same verb

Worth keeping straight, since the design now has four and they muddle easily:

| Verb | Scope | Operated by | Costs |
|---|---|---|---|
| **Banish** | one member | the guru — it is excommunication | nothing, and it *raises* group commitment |
| **Disband** | the whole cult | the anchor object | the wreckage stays in your save |
| **Deprogram** | one member | a rival NPC, from outside | money and time, and it can fail |
| **Bulldoze** | the whole cult, ungracefully | the player, via the build tools | must degrade to Disband, never orphan |

The last row is the robustness rule: **bulldozing has to route through the same teardown as
Disband.** One code path, two entry points, and the ungraceful one must not be able to leave
a Sim wearing regalia owned by nothing.

### Instacult and Disband are setup and teardown

Together these two make the playset **a repeatable experiment** instead of an accumulation.
Spawn a roster, tune the parameters, run the
[loyalty assay](#the-switch-is-a-loyalty-assay-and-the-comedy-is-in-the-uniformity) or the
cascade, disband, and go again on a clean lot. Without a teardown verb a lot silently fills
with dead cults and stops being usable; with one, **it is a laboratory you can run twice.**

That is also what makes Don's "multiple cults are fun to play against each other" true in
practice rather than in principle. Playing two cults against each other requires running the
matchup repeatedly with different knobs, and that requires being able to clear the board.

### The deprogrammer is a rival cult with a roster of one

This is the best of the three, and the reason is uncomfortable. The
[divorce attorney pattern](life-events-playset.md) already exists — an artifact summons an
NPC who is a "cleaver, not catcher: severs and frees" — so a **deprogrammer's business card**
needs no new plumbing. It costs money, it takes time, and it can fail.

The part worth building is **what it is made of**. Deprogramming, historically, frequently
meant removing somebody against their will, isolating them, and applying sustained pressure
until their affiliation changed — the anti-cult intervention that ran the cult's own
playbook. So implement it that way, **out of the identical objects**: the
[Eloporter](#it-wires-into-objects-that-already-exist) to take the member away, Buddha to
keep their motives alive while isolated, repeated interaction to overwrite the affinity.

> **If deprogramming is mechanically indistinguishable from conversion, that is a finding
> rather than a bug** — and the player discovers it by building the counter-apparatus and
> noticing they reached for the same parts bin.

Nobody has to editorialise, which is the standard the rest of this document holds to. The
deprogrammer aims at the *apparatus*, including the apparatus that bills itself as the cure.

### Robustness for the population tools

- **Instacult needs a cap and a graceful refusal.** Four stands times ten members is a
  crowd no lot will route, and sims1 has population limits. Refuse politely at the ceiling,
  spawn what fits, say so — do not spawn into a frozen lot.
- **Banish is per-slot, like everything else.** Banishing a member of three cults removes
  them from *one*. The other two must not notice.
- **Banishing the guru** has to be answered rather than crashed. Either the stand promotes
  somebody, or the cult dissolves and everybody is unhatted — both are fine, but one of them
  has to be chosen.
- **Banishing the last member** dissolves the group host, and the stand stays on the lot
  selling to nobody, which is the correct and funnier outcome. It must route through the same
  teardown as [Disband](#disband-and-the-three-kinds-of-member) rather than reimplementing it.
- **Disband must survive a partial roster.** Members mid-queue, members off-lot, a visitor
  already walking home, an NPC being deprogrammed at that moment: the rapture cannot wait for
  a quiet lot, so anything it cannot reach has to be releasable later rather than left bonded
  to a host that is gone.
- **Deprogramming must be reversible**, because
  [re-conversion is the interesting case](#open) — a Sim who has been deprogrammed once and
  walks back to the stand is the most informative Sim on the lot.

### The regalia gets in the way of the ritual

One consequence worth keeping, because it falls out of anatomy rather than intent: a high
five uses **hands**, and the [hand-slot clubs](#many-slots-many-cults-at-once) have claimed
them. Balls For Hands members high-five with soft-body physics and a boing. Pixelated Left
Hand members high-five into a mosaic that censors the moment of contact.

So **cults whose regalia occupies the hand bond worse than cults that claim the head** —
their cohesion ritual is physically obstructed by their own uniform. That is a genuine
balance implication derived from where the hats go, and it means the slot a stand claims
decides not only [who its rivals are](#many-slots-many-cults-at-once) but how strong it can
ever become.

`needs-check: whether sims1 exposes High Five as a base social or whether it arrives with`
`an expansion — the gesture matters to the joke, so a substitute would need the same`
`deniability. Also confirm the single-relationship-score claim for sims1 specifically,`
`since later games split friendly and romantic tracks and the whole "no platonic channel"`
`argument depends on sims1 not doing that. The E3 demo story is widely repeated; get a`
`citation before it goes on air.`

## What is genuinely new

Three things, and all of them are mechanisms rather than objects:

**Contagion.** A state that propagates to new hosts. Neither Zombie Sims' waves nor
a cult's recruitment is expressible in the buff model, which applies an effect to a
host and stops there. Prior art is already in the franchise: the guinea pig disease
spread between Sims. Written up as a family and a `spreads:` field —
[`skills/buff/`](https://github.com/SimHacker/moollm/blob/main/skills/buff/SKILL.md).

**Membership as a group host.** A cult is one organization many people belong to,
not a pile of pairs: it survives members joining and leaving, and dissolving it is
one operation. That is the group-host case, and this is its clearest example.

**Advertisement modification — second-order objects.** Objects advertise to Sims, and
buffs change a Sim's motives so the same advertisement scores differently. What the
[television](#the-television-dispenses-ideology-by-the-channel) needs is
neither: an object that re-weights **another object's** advertised score without
touching the Sim at all. That is a new kind of thing in the model, and it is the one
worth getting right, because it is what lets the playset stage manufactured desire
without a single coercion state.

## Open

- Does the guru have a **Consequence-Ability-style conduct guard** — powers that
  unlock based on how the leader has behaved? (See `buffopedia/systems/spore/`.)
- Is defection reversible, and who pays for retrieval?
- Does the schism mechanic fork a group host into two, and what happens to shared
  artifacts? (Super Cupid's `clique_partition` topology generates the rival factions, and
  a schism is now concrete — **it is a second stand appearing** — so the open part is
  narrowed to what happens to the shrine, and to whether two stands stocking the same
  colour merge or feud.)
- **Does the slime itself corrupt, or is it only the receipt?** Secondhand exposure —
  walk through somebody else's puddle, catch somebody else's affinity — is tempting and
  would give the contagion a second vector. The recommendation is **no**: keep the slime
  as evidence and mess, and make watching the only way in, because "you had to watch it
  yourself" is the argument this whole document is built on and a spreading floor that
  converts bystanders quietly throws it away.
- Heather and Steve's call, since Zombie Sims is theirs: is the cult a faction
  *inside* the outbreak, or a parallel outbreak with a different transmission rule?

## See also

- [`README.md`](README.md) — the orchestrator-playset pattern
- [`life-events-playset.md`](life-events-playset.md) — licenses, mass pairing, the eloporter
- [`catalogs/zombie-sims/README.md`](../../catalogs/zombie-sims/README.md) — Heather + Steve's catalog
- [`catalogs/simprov/ORCHESTRATOR.yml`](../../catalogs/simprov/ORCHESTRATOR.yml) — the Hope Chest state machine
