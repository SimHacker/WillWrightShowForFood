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
| Ham radio as **wave controller** | broadcast sermons, recruitment drives — [a television](#the-television-is-the-demand-side-and-channels-dispense-ideology) | same role, and the cult splits it in two: the TV broadcasts, [a stand](#the-hub-is-a-swagomatic-and-multiple-stands-are-the-game) enrolls |
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
[television](#the-television-is-the-demand-side-and-channels-dispense-ideology) is the
other half of the machine but not the hub: it manufactures the want, and the stand
converts want into membership. Advertiser and registry, and they are separable — a
channel with no stand produces Sims who want something they cannot buy, which is a
perfectly good thing to be able to stage.

| | Television | SwagOMatic stand |
|---|---|---|
| Scope | the room it is in | the lot, via a roster |
| What it changes | what other objects are *worth* | who *belongs* |
| Membership | none — it cannot enroll anybody | **owns the group host** |
| If deleted | demand decays | the cult dissolves, members unhatted |

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
| Can one Sim join both? | **no** — the slot holds one thing | yes |
| Relationship | rivals, necessarily | compatible, possibly allied |
| Example | Balls For Hands vs. Pixelated Left Hand — both want the hand | Pixelated Head + Balls For Hands — no conflict at all |

**So the feud graph is computed from anatomy, and belief has nothing to do with it.** Two
cults are enemies exactly to the degree their regalia collide, which is a harder and funnier
claim than "small differences cause big feuds" — it says the differences are not even the
mechanism, the *real estate* is.

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

## The television is the demand side, and channels dispense ideology

*Don, 20 Sep 2026: the TV set could have different channels that dispense ideologies,
and Faux News makes you want to wear MAGA caps.*

Zombie Sims has the ham radio as `wave_controller` and SliceCity has the power plant as
seed spawner; Cult Sims needed "broadcast sermons, recruitment drives" and had no object
to put them in. It is a television, and the Sims already shipped one with a channel
selector on its pie menu. The TV is the demand side of the machine — the
[SwagOMatic](#the-hub-is-a-swagomatic-and-multiple-stands-are-the-game) is the hub that
holds membership, and the television is what makes membership look worth buying.

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
[television](#the-television-is-the-demand-side-and-channels-dispense-ideology) needs is
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
