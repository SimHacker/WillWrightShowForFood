# Life Events playset — the paperwork is the state

*Proposed extension of the SimProv Wedding kit. Don's session ideas, 1 Sep 2026:
the Hope Chest as a **factory** that mints the marriage as a tangible object;
divorce as throwing out the certificate or hiring an attorney to remove it;
rental marriages that auto-renew; layaway; and **special objects for eloping and
other activities**. Everything below is design, not shipped — the shipped kit is
[`catalogs/simprov/ORCHESTRATOR.yml`](../../catalogs/simprov/ORCHESTRATOR.yml).*

## The pattern

**A life event is a factory. Its output is an artifact. The artifact hosts the state.**

```
orchestrator  →  mints  →  artifact  →  which certifies  →  the registry entry
(Hope Chest)              (certificate)   (evidence)          (the marriage itself)
```

Three properties fall out, and all three are things a flag on a Sim cannot do:

- **The artifact is placeable and visible.** A certificate hangs on the wall. State
  lives where people look, instead of in a panel.
- **The artifact names its parties, and the claim is checkable.** The participant IDs
  on the object can be compared against the registry — so a certificate can be
  *wrong*, which is a feature.
- **The artifact is a certified copy, not the marriage.** Burning it destroys evidence,
  not the entanglement. Ending the thing itself takes a different act, at a different
  price.

### The registry is the truth; the certificate is evidence

*Don, 1 Sep 2026: reconstruct the marriages from the relationship matrix, in distinct
keys meant to represent "married to" — then the marriage survives the certificate
burning up in a fire, and you can mail away for a duplicate. The mutual tags certify
the marriage is legit; if they do not agree, something is fishy. Pay a lawyer to sort
it out.*

This is how vital records actually work, and it is a better design than making the
paper load-bearing. You do not own your marriage by holding a document; a registry
holds the record and your document is a certified copy of it. So:

| | Registry entry | Certificate |
|---|---|---|
| **Is** | the marriage | evidence of the marriage |
| **Lives in** | neighborhood-scoped data, independent of any lot | one object, on one wall |
| **Survives** | fire, moving house, losing the paper | nothing much |
| **If destroyed** | the marriage is gone | mail away for a duplicate |
| **If forged** | n/a | detectable — its IDs will not match |

Two payoffs. **Marriage stops being lot-bound**, because the record does not care which
house either party lives in — which is what makes the guru's neighborhood-wide pairing
coherent at all. And **loss becomes a story instead of a bug**: the house burns down, the
certificate with it, and you mail for a replacement while staying married the whole time.

#### Disagreement is the interesting state

Relationship cells are per-direction and their contents are independent, so the registry
can hold a marriage that only one side claims:

```
  A says married to B  ·  B says married to A   →  legitimate
  A says married to B  ·  B says nothing        →  something is fishy
```

That asymmetry is not a bug to normalize away — it *is* bigamy, annulment, the spouse who
thinks they are divorced but is not, the forged certificate, a botched angel edit, and the
deluded suitor who believes a marriage exists. All of them for free, from a data structure
that simply does not force the two cells to agree.

And it gives the divorce lawyer a second job worth paying for: **reconciliation.** One side
of a distributed record disagrees with the other, and someone has to be paid to decide
which one is true and repair the loser. The angel can do the repair; the lawyer is the
diegetic face of it.

#### Do not put the tag on the person

The trap Don flagged, and its resolution:

```
  BAD    sim.spouse_id = 19          one slot per Sim — monogamy enforced by the schema
  GOOD   rel[A][B] += MARRIED        a tag per pair — a Sim has as many cells as it likes
```

Put the tag in the **pair**, never in a slot on the person, and polygamy becomes a *policy*
question the officiant answers rather than a limit the storage imposes. A true N-way group
bond still needs a group id, since a clique of married pairs is not the same object as one
three-way marriage — but pairs are the storage floor, and a clique is the honest lossy
approximation when that floor is all you have.

#### What the Sims 1 matrix can actually carry

Two findings that constrain the implementation:

- **There is no `married` bit in the Sims 1 relationship matrix.** It holds daily and
  lifetime scores in the range −100…100 and nothing else; the familiar bit flags for
  engaged and married belong to Sims 2. So there is no authored tag waiting to be read —
  the registry has to be built.
- **The on-disk cell is a length-prefixed list, not a fixed pair.** The neighborhood
  relationship format stores a key and then a count followed by that many values, so
  appending a marriage tag alongside the scores is *format-legal*. Whether the engine
  tolerates extra values, and whether an in-game save preserves them rather than
  rewriting the cell, is untested — a load / save / re-read experiment settles it.

Until that test runs, the safer home for the registry is **neighborhood general data**,
which is already the durable cross-lot channel. The relationship cell is the more elegant
home if it survives the round trip.

### Ownership migrates at ratification

*Don, 1 Sep 2026: the Hope Chest contains all the **persistent but throwaway**
state you do not need once you are finally married. It can hang around to
orchestrate the party, but anything marriage-related — divorce, death — is
orchestrated **by the license itself**.*

```
  the BECOMING                    │  the BEING and the ENDING
  owned by the Hope Chest         │  owned by the license
  ───────────────────────────────────────────────────────────
  plan · hires · schedule ·       │  in force · renewal · lapse ·
  ceremony · (tail: the party)    │  divorce · death · widowhood
                              handoff at ratification
```

Two rules, and together they are the lifecycle:

- **"Persistent but throwaway" is a real category.** The chest's state must survive
  saves and days of planning, and is worthless afterwards. That is *build state* —
  needed to produce the artifact, not to use it. Same distinction as a build
  directory versus the binary, or MOOLLM's `.moollm/` scratch versus what gets
  committed.
- **The artifact is active, not a record.** The license runs its own small machine
  and handles its own later events. A marriage outlives its wedding planner, so
  nothing about a divorce twenty years on should route through a piece of furniture
  that existed to book a caterer.

**The chest gets a tail, not a hard cutoff.** It may stay to orchestrate the
reception, since the party is still part of the becoming. Deletion is *permitted*
at ratification, not forced — the player throws it out when it stops being useful,
which is also how a hope chest works.

The license's own machine, which is small on purpose:

| State | Enters on | Owns |
|---|---|---|
| pending | issue | its lapse window |
| in force | ratification | renewal, upkeep, the effect itself |
| dissolved | divorce | residue, and who paid to unwind it |
| widowed | a participant's death | survivorship, inheritance, mourning |
| lapsed | pending window elapsed | nothing — it was never in force |

This generalizes past weddings, which is why it is the pattern and not a detail:
**the constructor owns construction; the object owns its own life and its own
ending.** Every artifact in the roster below follows it.

## Routes: more than one way to the same artifact

The Hope Chest is the full-package route. Eloping is the **shortcut edge** — same
certificate, different path, different price.

```
single → flirting → in_love → engaged → planning → rehearsal → ceremony → reception
                                  │                                  ▲
                                  └────────── elope ─────────────────┘
```

| Route | Object | Skips | Costs | Residue |
|---|---|---|---|---|
| **Full package** | Hope Chest | nothing | money, many days, NPC hires | gifts, photos, seated guests |
| **Elope** | **eloporter** (see below) | planning, rehearsal, reception | one object, one use | relatives furious, no gifts, gossip |
| **Courthouse** | numbered ticket | rehearsal, reception | one afternoon, one queue | nobody attends, nobody objects |
| **Renewal** | anniversary object | it is a re-ratification, not a first marriage | modest | refreshes a lapsing certificate |

Two things worth noticing.

**Eloping needs none of the apparatus.** No Crowd Sitter, no Buddha, no priest
hire — because the entire apparatus exists to make a *public* ceremony survivable.
The object set is a function of audience size, and the elopement route is the
cheapest thing in the kit.

### The eloporter

*Don, 1 Sep 2026: easier than a ladder — clone the teleporter pair (TSO had one,
and it is easy to build from scratch) and make an **eloporter**.*

A **one-way, single-use escape hatch**, sold as a pair of ends:

| Property | Value | Why it matters |
|---|---|---|
| Pair | two placed ends, one logical device | the object *is* the pair, like the certificate is its two IDs |
| Direction | one-way | a directed edge, not a teleporter's round trip |
| Charges | single-use | consumed on arrival; the fuse is the object |
| Placement | one end **indoors**, one end **outdoors** | the constraint tells the story |

Three reasons this is better than a ladder.

**It is a clone, not a new object.** The mesh, the animations and the routing all
exist already; only the behavior changes. That is the Transmogrifier workflow, and
it is prototype delegation with an override — the same move MOOLLM makes when a
skill inherits from another and changes one method.

**The placement constraint carries the fiction.** Indoors to outdoors *is* the
elopement: you leave the house and you are gone. Nothing needs explaining, because
the rule and the meaning are the same rule. Compare the hope chest, whose ordinary
meaning already is "the accumulating plan for a wedding."

**It introduces a guard the buff model does not have** — one checked at
**placement time** rather than at application or on tick. If the ends do not
straddle a doorway, the object cannot be put down at all. That is build-mode
validation acting as a precondition, and it fails early, loudly, and before any
state exists to clean up.

One design question left open: whether the return trip is impossible or merely
absent. A one-way trip with no way back is a stronger commitment device, and
commitment is what the route is about.

### The officiant is waiting at the other end

*Don, 1 Sep 2026: the officiant you picked from the officiant magazine can be
standing at the eloporter's **output** site waiting for you, and it summons and
routes the participants — who need not live on the lot. Keep it open ended. Cult
friendly.*

The joke and the architecture are the same thing: **the escape hatch has a
greeter.** You flee the house to avoid the wedding apparatus and the paperwork is
already outside, holding a clipboard. The officiant spawns at the *destination*
end, which is what makes it land.

Mechanically the officiant is a **mini-orchestrator**, and it needs nothing new:

| It does | Existing object that already does it |
|---|---|
| summons participants who are not on the lot | Cupid — instantiates the selected Sim into play |
| routes them irresistibly to a spot | Come and See Me — an unbeatable advertisement with a timeout |
| positions them for a staged beat | Crowd Sitter — gather, seat, manage overflow |
| mints the artifact when the beat completes | Hope Chest — the ceremony checks off, the certificate appears |

So it is a recombination of four shipped behaviors, hired from a magazine, placed
at a coordinate. That is the playset thesis in one object.

**Continuity with the full-package route matters.** The officiant comes from the
magazine the wedding consultant hands over, so eloping is not a separate
subsystem — it is the same hire, met somewhere else. The Hope Chest route buys
witnesses; the eloporter route buys the officiant and nothing else.

### Mass pairing — the guru assigns, in bulk

*Don, 1 Sep 2026: the guru **pairs off everyone**, arbitrarily or however he wants.
Or a tool object lets us do it ourselves. Or the angel does it procedurally by
editing the save files — creating marriage licenses and hanging one on the wall for
each person. Then a **multi-wedding**: summon and marry, in parallel, every
not-yet-ceremonied license on the lot.*

Not one N-person marriage — **N pairings, assigned at once, by fiat.** That is a
different and better mechanic, because it needs a licence to exist in an
*unratified* state, which is exactly how the real thing works.

#### The license is the pending state; the ceremony is the commit

```
issue N licenses  →  they sit there, unratified  →  one batch ceremony ratifies all
   (guru / tool / angel)         (portable, expirable)          (summon, marry, mint)
```

Three properties fall out, and all three are free:

- **A license is a work item.** "Every not-yet-ceremonied license on the lot" is a
  queue, and the multi-wedding is a batch job over it. The ceremony stops being one
  couple's scene and becomes a scheduler.
- **A license expires.** Real marriage licenses lapse if unused inside a window,
  which is a fuse on the pending artifact and free drama: the guru assigns you in
  March and you have until June.
- **Issuing and solemnizing can disagree.** Someone can be assigned and never show
  up. That gap is where every story in a mass-wedding setting lives.

Two artifacts, two states, both hangable:

| Artifact | State | Portable | Expires |
|---|---|---|---|
| **license** | issued, unratified | yes — this is the one that travels | yes, if unused |
| **certificate** | solemnized | no — it is the record | only per the policy table above |

#### Three ways to issue, and they are not equivalent

| Issuer | How | Diegetic? |
|---|---|---|
| **Guru NPC** | assigns pairs by fiat, arbitrarily or by his own logic | fully — a character does it, on camera |
| **Tool object** | player picks pairs from a pie menu, or a "pair everyone" option | fully — the Cupid pattern, scaled up |
| **The angel** | edits save files directly, minting licenses and placing them | no — reaches in from outside |

The angel is worth naming as a distinct tier rather than an implementation detail.
It is the god-outside-the-game, and it can do things no object can: touch other
lots, place artifacts with no regard for build rules, act on the whole
neighborhood at once. The design question is always **what can be done
diegetically**, with the angel as the fallback that proves the state is reachable
at all.

*(MOOLLM has the same two tiers: the agent editing YAML directly versus the engine
running verbs. Same distinction, same temptation to skip the hard one.)*

#### Group bonds are a separate case, still real

Mass pairing produces pairs, so the relationship matrix handles it. But a *cult as
an organization*, a crew, or a three-way marriage is genuinely one bond among many
parties, and that is a hyperedge rather than a pile of pairs: dissolving it is one
operation, not *n(n−1)/2* that can partly fail, and it survives members joining and
leaving. Written up as a host kind in
[`skills/buff/SKILL.md` § Group hosts](../../../moollm/skills/buff/SKILL.md).

Left open, because the answers are statements rather than mechanics: whether the
guru can assign non-consenting participants, and whether a Sim can refuse at the
altar ([procedural-rhetoric](../../../moollm/skills/procedural-rhetoric/)).

### Moving a license between lots

*Don's question: the angel can do it by editing saves, but is there an easy in-game
way? Can an object teleport itself to another house?*

Ranked by how little new machinery each needs:

| Path | How | Cost |
|---|---|---|
| **Mail it** | the license arrives in the mailbox; the carrier already delivers | nothing new — bills and magazine orders work this way |
| **Deliver it** | an NPC brings it, like the magazine object orders | nothing new — same delivery hook |
| **Carry it** | neighborhood-scoped inventory travels with the Sim | the real cross-lot path — see below |
| **Self-teleport** | the license relocates itself, eloporter-style | **impossible in-game** — no cross-lot addressing exists |
| **The angel** | edit the save | free, but not diegetic |

**Mail is the answer for same-lot delivery, and it is almost free.** Every lot has a
mailbox, the carrier already visits, and documents arriving by post needs no
explanation. Bills are the working precedent: an object that appears, demands
action, and carries a deadline. A license is a bill you *want*.

#### An object cannot create an object in another household

Checked against Don's own IFF parsers in
[`SimObliterator_Suite`](../../../Leela/git/SimObliterator_Suite/src/formats/iff/chunks/),
1 Sep 2026. **There is no cross-lot addressing in the VM.** Every position mode
`Create Object Instance` accepts is relative to *me* or to the *stack object* —
`UNDERNEATH_ME`, `ON_TOP_OF_ME`, `IN_FRONT_OF_ME`, `IN_MY_HAND`,
`IN_SLOT0_OF_STACK_OBJECT`, `NEXT_TO_ME_IN_DIRECTION_OF_LOCAL`, `OUT_OF_WORLD`
(`bhav_ast.py`, `VMCreateObjectPosition`). Both anchors are objects in the
currently loaded lot. No primitive takes a house or lot parameter.

So the answer is no, and the design has to route around it rather than through it.

#### Two channels that *are* neighborhood-scoped

The file formats draw the boundary clearly — per-lot state and neighborhood state
are different chunks in different files:

| Chunk | Scope | Holds |
|---|---|---|
| `HOUS` | one lot | house metadata, camera, GUID, roof |
| `NBRS` | the neighborhood | every Sim, their attributes and **relationships** — "used for spawning visitors and phone calls" |
| `NGBH` | the neighborhood | general neighborhood data and **inventory information** — "originally just the tutorial, later expanded for Hot Date" |

That gives the license a legitimate way to travel without any object ever reaching
into another house:

1. The guru or tool creates the license on lot A.
2. It goes into **neighborhood-scoped** storage — a Sim's inventory (`NGBH`), or a
   record keyed to the participants alongside the relationship data (`NBRS`).
3. The Sim travels. The record travels with the neighborhood, not the lot.
4. On lot B, **a local object materializes it on load** — `bhav_load` is OBJD field
   45, and `bhav_init` is 41.

**The artifact's truth is neighborhood state; the object on the wall is a lot-local
view of it.** No object creates an object elsewhere — each lot instantiates its own
copy of shared state when it loads. That is exactly how Sims themselves already
work: a neighbor exists in `NBRS` and gets instantiated when they visit.

*Confidence: the absence of cross-lot addressing is confirmed from the parsers. That
`NGBH` inventory can carry an arbitrary custom object is an inference from its
docstring and needs a test — and it is Hot Date era, so it costs an expansion
dependency.*

The angel is still required for the case with no visit: placing artifacts in houses
nobody will load, or editing the neighborhood without playing it.

### The wall problem

*Don: an invisible object can be placed anywhere, but finding a wall is
problematic — there may be no walls, or no free walls.*

This is a real constraint and it has a good answer. Three options, worst to best:

**Invisible, placed anywhere.** Works, and re-creates the exact failure of the
guinea pig disease: state carried by an entity nobody can see, so nobody can find
it, inspect it, or throw it out. It also throws away the whole reason the artifact
is an object — that it is *visible on the wall*. Avoid.

**Anchor to the mailbox.** Every lot has one, at the curb, and it cannot be
deleted. That makes it the one guaranteed placement anchor in the game, and it is
already the place documents arrive. A license lives *in* or *on* the mailbox until
someone claims it, which solves the no-free-wall case without inventing anything.

**A container object for the ratified ones.** A wedding album, a frame that stands
on a table, a filing box, a shrine. It holds many certificates, needs one slot
instead of N wall segments, and scales to a mass wedding where a hundred
certificates would otherwise need a hundred wall tiles. For a cult, the shrine
*is* the set dressing.

So: **licenses live at the mailbox, certificates live on a wall if there is one and
in the album if there is not.** The wall is the nice case, not the required one.

**Route choice is the rhetoric.** The costs are not balanced for fairness; they
encode who the wedding is *for*. The expensive route buys witnesses and gifts. The
cheap route buys speed and costs you your family's opinion. The player learns the
argument by pricing it, which is the whole
[procedural-rhetoric](../../../moollm/skills/procedural-rhetoric/) move.

## Object roster

**Shipped** (see the orchestrator doc): Hope Chest, Cupid, Crowd Sitter, Buddha,
magazines, planner / priest / photographer NPCs, Donna set pieces.

**Proposed — pair artifacts**

| Object | Mints | Notes |
|---|---|---|
| Eloporter (cloned teleporter pair) | certificate, by the shortcut | one-way, single-use, indoors→outdoors |
| Officiant (hired from the magazine) | ratifies pending licenses | summons and routes participants, residents or not |
| Guru / pairing tool | N unratified licenses at once | mass pairing by fiat or by pie menu |
| **Super Cupid** | nothing — it rewrites the matrix | everyone loves / hates / neutral, in one gesture |
| **Prenuptial agreement** | a modifier *on the certificate* | see below — the interesting one |
| Anniversary object | a renewal on an existing certificate | the upkeep path; lapses if ignored |
| Attorney's business card | summons the divorce NPC | cleaver, not catcher: severs and frees |
| Friendship bracelet / blood oath | a non-romantic pair bond | proves the artifact pattern is not about marriage |
| Business partnership contract | an economic pair bond | shared funds, shared liability |

**Super Cupid** deserves a note, since it is the only object here that mints
nothing. *Don, 1 Sep 2026: it could make everyone love everyone else, or hate, or
neutral.* Where Cupid edits one directed cell of the relationship matrix, Super
Cupid operates on a whole region of it at once — so it takes a **scope**, a
**topology** (complete, star, perfect matching, clique partition), and a choice of
whether it writes **base values** or applies a **temporary buff** per cell.

That last choice is the whole object. Writing base values is social amnesia:
permanent, and the feud is gone. Applying buffs is a truce: everyone adores each
other for an hour, then the originals come back with the grudges intact. Same
button, two entirely different objects. Mechanism and the topology table:
[`skills/buff/SKILL.md` § Bulk operations](../../../moollm/skills/buff/SKILL.md).

**Proposed — household and self artifacts**

| Object | Mints | Notes |
|---|---|---|
| Roommate agreement | a ruleset artifact for the household | a Fluxx New Rule you can hang in a hallway |
| Adoption papers, name change | a change to who someone *is* | bureaucracy as identity |
| Diploma, deed, citizenship | permanent unlocks | the tech-tree end of the ladder |
| Urn / headstone | the record of an ending | Sims 1 already does this — prior art for artifact-as-state |

## The prenup is a second-order buff

A prenuptial agreement modifies **the terms under which another artifact can be
removed**. It does not change what being married does; it changes what divorce
costs and what it leaves behind.

That is a buff whose target is another buff's *dispel policy*, and nothing in
[`skills/buff/`](../../../moollm/skills/buff/) can express it. It is the sharpest
argument in this document for adding a removal policy to the buff model — who may
dispel, at what cost, and what residue is left — because the prenup is exactly an
object that edits those three fields in advance.

It is also the object most likely to earn its keep in dialog, since a prenup is
already written in the register the layaway bit wants.

## Expiry is the argument

The certificate's `expires:` field is where the playset states its politics. Same
object, same ceremony, five different marriages:

| Policy | The marriage it describes |
|---|---|
| permanent, until destroyed | the traditional deal — yours, on the wall |
| `with: host` | till death do us part, implemented literally |
| `after: N years` | a term marriage, requiring re-ratification |
| `auto_renew: true` | Don's rental marriage — cancel anytime, fee applies |
| `upkeep: anniversaries` | lapses quietly if nobody maintains it |

The rental tier is Don's satire, and it is not an exaggeration: it is the ordinary
terms of service for music, film, books and software, applied to the one contract
people still expect to own outright. Dialog premise, left open for the writers'
room: [`bits/gag-marriage-layaway/`](../../bits/gag-marriage-layaway/gag-marriage-layaway.yml).

## Why this is a good MOOLLM test case

It exercises nearly every host kind at once — objects that host state, pairs that
host bonds, households that host rules, prototypes for the artifact types — plus
phase-scoped effects with an owner that unwinds them on abort. If the buff model
can express this playset, it can express most of what a life-simulation needs.

Mechanism write-ups: [`skills/buff/buffopedia/systems/simprov/`](../../../moollm/skills/buff/buffopedia/systems/simprov/SYSTEM.yml)
· hosts and relationship cells: [`skills/buff/SKILL.md`](../../../moollm/skills/buff/SKILL.md)
· phase extent and unwinding: [`skills/buff/SELF-KORZ.md`](../../../moollm/skills/buff/SELF-KORZ.md)

## See also

- [`README.md`](README.md) — the orchestrator-playset pattern and its instances
- [`catalogs/simprov/wedding-playset-depth.md`](../../catalogs/simprov/wedding-playset-depth.md) — "each object leads to the next"
- [`bits/gag-speed-dating-with-cupid/`](../../bits/gag-speed-dating-with-cupid/gag-speed-dating-with-cupid.yml) — the Cupid segment
