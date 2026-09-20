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

The engine already supplies the reason, and it is anatomical: **there is one hat slot.**
One head, one accessory slot, N stands competing for it. Which means:

> **Hostility is inversely proportional to doctrinal difference, because the more alike
> two cults are, the more exactly they need the same slot.**

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

### The knob that carries the argument

Each stand gets its own parameters, which is what makes this a toy rather than a lesson:

| Parameter | What it does | Why it is the interesting one |
|---|---|---|
| **swag line + color** | the visible marker | the only real difference between rival cults |
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
- **Joining is leaving.** The hat slot is single-valued, so enrolling at stand B silently
  unhats stand A's member. B's join and A's defection are *the same event*, and A's roster
  must hear about it rather than keeping a ghost.
- **Deleting a stand must release its members.** Bulldozing the hub cannot leave Sims
  wearing a cap that belongs to a group host that no longer exists. Degrade to unhatted,
  do not orphan.
- **Two stands, same color.** Genuinely open: do they merge into one host, or is selling
  the *same* hat the most offensive possible provocation? The second reading is funnier
  and probably truer.
- **A stand with no channel** still works, just slowly — it has to rely on its own
  advertisement instead of manufactured demand, which is a useful control condition for
  measuring what the television actually contributes.

`needs-check: whether sims1 accessories are one exclusive slot or several stackable ones`
`decides how much of the above survives. The hat-slot scarcity argument needs a real hat`
`slot. Heather and Steve's call, since the skin and accessory system is theirs —`
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
- Heather and Steve's call, since Zombie Sims is theirs: is the cult a faction
  *inside* the outbreak, or a parallel outbreak with a different transmission rule?

## See also

- [`README.md`](README.md) — the orchestrator-playset pattern
- [`life-events-playset.md`](life-events-playset.md) — licenses, mass pairing, the eloporter
- [`catalogs/zombie-sims/README.md`](../../catalogs/zombie-sims/README.md) — Heather + Steve's catalog
- [`catalogs/simprov/ORCHESTRATOR.yml`](../../catalogs/simprov/ORCHESTRATOR.yml) — the Hope Chest state machine
