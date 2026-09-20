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
| Ham radio as **wave controller** | broadcast sermons, recruitment drives — [a television](#the-hub-object-is-a-television-and-channels-dispense-ideology) | yes — one hub, two skins |
| infection by contact | conversion by persuasion | yes — transmission with a different guard |
| faction configs, religion-mapped skins | denominations, sects, schisms | yes — the plumbing already mentions religion |
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

**The third and fourth rows are the ones worth building.** Sims objects advertise, so
a cap in inventory advertises *wear me* to nearby Sims and gifting one is a
transmission event — which is exactly the `spreads:` field this document proposes, with
a physical carrier instead of an abstract aura. And because the transmission event is a
*transaction*, the contagion has a direction the zombie model cannot express: **the
cult sells you your own symptom.**

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

That is also the sharper reading. A merch table that sells you the marker of your own
conversion is a joke about **who is collecting**, and it survives a fact-check, which is
the house standard — see
[`bits/gag-vice-not-ice-puppet/gag-vice-not-ice-puppet.yml#house_test`](../../bits/gag-vice-not-ice-puppet/gag-vice-not-ice-puppet.yml).

`open: Heather and Steve's call again, since the skin slot is theirs — is the cap a`
`religion_mapped_skins plugin, or does a bought-marker need its own slot because it`
`carries a price and an inventory item rather than only an appearance?`

## The hub object is a television, and channels dispense ideology

*Don, 20 Sep 2026: the TV set could have different channels that dispense ideologies,
and Faux News makes you want to wear MAGA caps.*

**This names the hub the bridge table was missing.** Zombie Sims has the ham radio as
`wave_controller` and SliceCity has the power plant as seed spawner; Cult Sims needed
"broadcast sermons, recruitment drives" and had no object to put them in. It is a
television, and the Sims already shipped one with a channel selector on its pie menu.

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
[television](#the-hub-object-is-a-television-and-channels-dispense-ideology) needs is
neither: an object that re-weights **another object's** advertised score without
touching the Sim at all. That is a new kind of thing in the model, and it is the one
worth getting right, because it is what lets the playset stage manufactured desire
without a single coercion state.

## Open

- Does the guru have a **Consequence-Ability-style conduct guard** — powers that
  unlock based on how the leader has behaved? (See `buffopedia/systems/spore/`.)
- Is defection reversible, and who pays for retrieval?
- Does the schism mechanic fork a group host into two, and what happens to shared
  artifacts? (Super Cupid's `clique_partition` topology generates the rival
  factions; the open part is what happens to the shrine.)
- Heather and Steve's call, since Zombie Sims is theirs: is the cult a faction
  *inside* the outbreak, or a parallel outbreak with a different transmission rule?

## See also

- [`README.md`](README.md) — the orchestrator-playset pattern
- [`life-events-playset.md`](life-events-playset.md) — licenses, mass pairing, the eloporter
- [`catalogs/zombie-sims/README.md`](../../catalogs/zombie-sims/README.md) — Heather + Steve's catalog
- [`catalogs/simprov/ORCHESTRATOR.yml`](../../catalogs/simprov/ORCHESTRATOR.yml) — the Hope Chest state machine
