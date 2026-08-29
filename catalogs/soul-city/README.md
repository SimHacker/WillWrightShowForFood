# Soul City

*Sniff:* [`CATALOG.yml`](CATALOG.yml) · [`../GLANCE.yml`](../GLANCE.yml) · [`../README.md`](../README.md)

**MOOLLM:** place [`skills/soul-city/`](https://github.com/SimHacker/moollm/tree/main/skills/soul-city) · souls [`skills/soul/`](https://github.com/SimHacker/moollm/tree/main/skills/soul) · [SOUL-MODEL.md](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md). Bootstrap map: [`examples/adventure-4/`](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4). Also [`mind`](https://github.com/SimHacker/moollm/tree/main/skills/mind) · [`character`](https://github.com/SimHacker/moollm/tree/main/skills/character). Ethics: [soul](https://github.com/SimHacker/moollm/blob/main/skills/soul/ETHICS.md) · [mind](https://github.com/SimHacker/moollm/blob/main/skills/mind/ETHICS.md) · [character](https://github.com/SimHacker/moollm/blob/main/skills/character/ETHICS.md) · [representation-ethics](https://github.com/SimHacker/moollm/tree/main/skills/representation-ethics). Adventure as [method of loci](https://news.ycombinator.com/item?id=29330901). Product: [MicropolisCore soul-city](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/soul-city.md).

**Create · publish · share** — the platform, not just another catalog shelf.

*Formerly `micropolis-home` (rebranded 2026-07-08). Soul is the family name: less Micropolis
coupling — Micropolis stays the city sim — and the platform takes the liminal city's own name.
Creating, publishing, and sharing don't happen NEXT to Soul City; they happen IN it. Plaza
(browse + make), Depot (upload/download), Station (bridges to other games), and Terminal (port
of entry) are its districts.*

## What it is

Soul City rebuilds the Sims 1 content-creation stack as a **web-native platform**:

| Layer | Examples |
|-------|----------|
| **Create** | Transmogrifier, RugOMatic, **WigFabrik** (ECG multitarget mesh+texture + AI hair maps), SimShow preview, MOOLLM-assisted authoring |
| **Publish** | Hosted CARD dirs, git repos, branching dialog objects, round-trippable saves |
| **GitHub distribution** | Metadata catalogs **and** free content in public repos — [spec](github-distribution-model.md); MOOLLM skills + Soul City in [moollm](https://github.com/SimHacker/moollm); TSR/SFS replacement lane for repo-native work |
| **Share** | Exchange revival, family albums, federated storefronts, Repo Show homefun |
| **Browser ecosystem** | Save read/write, no zip/Explorer, Share-button replacement — [spec](browser-ecosystem.md) |

## Steam Community Guides

**Not a separate Steam app** — official player guides on [The Sims Legacy Collection](https://store.steampowered.com/app/3314070/The_Sims/) Community Hub. Informational playbooks that link out to Soul City (web) and Repo Shows. No install for readers.

Four jobs the guides cover:

1. **Create · publish · share** — web tools + federated UCC (above)
2. **Repo Shows channel** — discover and promote Repo Show episodes ([Will Wright flagship](../../repo-shows/will-wright-premiere/), guest network, live/VOD, GitHub, TicketPR)
3. **Sims & bridges** — show archive for The Sims history + Soul City bridge episodes (other games)
4. **Requires Sims on Steam** — drives Legacy Collection sales; EA-friendly fan-guide disclaimer

**Distribution (web first, then native companion):**

| Phase | Surface |
|-------|---------|
| **Now** | [Soul City](CATALOG.yml) web hub + [Steam Community Guides](steam-community-guide.md) |
| **Later** | [**SoulAngel**](soul-angel.md) — Windows and Mac Steam Software companion (Simplifier + catalog + machinima + streaming), carrying [the sims1 Soul Bridge](sims1-soul-bridge.md) and its TMog modules. Announced after web audience bootstraps. |

Spec: [Steam guide strategy](steam-community-guide.md) · [Steam app strategy](steam-app-strategy.md) · [Portals and modules](portals-and-modules.md) · [Stat-U-Matic](stat-u-matic.md) · [GUID registry](guid-registry.md) · [sims1 Soul Bridge](sims1-soul-bridge.md) · [Membership model](membership-model.md) · landscape: [`../sims1-community-landscape.md`](../sims1-community-landscape.md)

## Federated catalogs

Each keeps its brand and storefront; Soul City is the shared rails:

| Catalog | → |
|---------|---|
| **SimFreaks** | [simfreaks/README.md](../simfreaks/README.md) — Heather Castillo |
| **SimSlice** | [simslice/README.md](../simslice/README.md) — Steve Alvey / SliceCity |
| **SimProv** | [simprov/README.md](../simprov/README.md) — wedding playset |
| **Zombie Sims** | [zombie-sims/README.md](../zombie-sims/README.md) — current magnum opus |

## Why now

Don's OpenLaszlo SimFreaks CMS was built for love, not rent — life interrupted before it shipped. The Steam Sims 1 window, federation tooling, and Heather and Steve's permission to republish make **now** the moment to finish the job.

The EA take-private (Saudi PIF, Silver Lake, Kushner's Affinity Partners — [receipts in the indictment](../../characters/ian-bogost/roles-not-characters.md)) and Legacy Collection's Exchange removal sharpen the case: **Soul Saver** / [**SoulAngel**](soul-angel.md) relocates character souls from oligarch-owned silos into git-checked-in hub-and-spoke rails — first spoke [**Tiny Life**](../../repo-shows/will-wright-premiere/game-bridge-sims1-tinylife.md). Academic frame: Don's QGCon paper [**How Inclusivity Saved The Sims**](../../characters/don-hopkins/sources/qgcon-inclusivity-paper/abstract.md) — procedural rhetoric saved the franchise in rules; Soul City extends it to publish gates and exit ([the thesis](../../characters/don-hopkins/sources/qgcon-inclusivity-paper/soul-city-soul-saver-thesis.md)). Namesake: [Soul City NC](../../repo-shows/will-wright-premiere/soul-city-namesake.md) (McKissick, Nixon HUD, Helms foreclosure).

See [INTRO-NARRATIVE.md](../../repo-shows/will-wright-premiere/INTRO-NARRATIVE.md) and [family manifesto](../../characters/will-wright/media/sims-series-family-manifesto.md).

The design thesis behind character import — SimCity's characters live *around*
the simulation as roles (mayor, treasurer, planner), multiplayer made them
voting seats, and Soul City casts traveling characters and agents into them —
is argued against Ian Bogost's 2015 "Better Without Characters" essay in
[roles-not-characters.md](../../characters/ian-bogost/roles-not-characters.md).

## The attitude

Patron saint: **Nina Hagen**. In 1976 the DDR stripped Wolf Biermann of his
citizenship for singing the wrong songs; his stepdaughter Nina demanded to
follow him out, and walked out of an actual walled state with her voice
intact — then got louder. No petition to the wall's owners, no waiting for
the garden to improve. A departure that takes the soul along.

That's the Soul Saver move, note for note: when the silo's owner starts
charging Moola for your own memories, you don't lobby — you relocate the
souls to **underground rails** nobody can expatriate you from (plain files,
git, federation), and keep performing. Punk exit, not exit interview. The
walls can keep the buildings; the characters were never furniture.

And know who the wall's owners are. EA's majority owner is the Saudi
Public Investment Fund, chaired by the crown prince U.S. intelligence
concluded **approved the operation** that murdered journalist Jamal
Khashoggi — a fifteen-man squad, a forensic doctor with a bone saw,
the body carried out of the consulate in suitcases and never recovered
([UN inquiry](https://www.ohchr.org/en/press-releases/2019/06/khashoggi-killing-premeditated-state-killing-un-human-rights-expert-says),
[ODNI assessment](https://www.dni.gov/files/ODNI/documents/assessments/Assessment-Saudi-Gov-Role-in-JK-Death-20210226v2.pdf)).
Alongside it on the cap table: Jared Kushner's Affinity Partners,
seeded with two billion dollars of the kingdom's money over the
objections of the fund's own screening panel
([NYT](https://www.nytimes.com/2022/04/10/us/jared-kushner-saudi-investment-fund.html))
— the defender collecting from the defended. The same fund runs LIV
Golf and Newcastle United; The Sims is the newest asset in a
reputation-laundering portfolio. You don't petition that wall.
Full receipts and the argument:
[roles-not-characters.md](../../characters/ian-bogost/roles-not-characters.md).

Call it what it is: an **underground railroad**. Not the nineteenth-century
network — though the moral rhyme is deliberate — but the same structural
move: when the official routes are owned and rationed, you build parallel
tracks the owners can't foreclose. Soul-files in public git. Federation
spokes to Tiny Life, Stardew, and whatever indie world still ships share
and story. Conductors instead of gatekeepers. The souls travel; the silo
keeps the empty lot.

And be clear about what the move *means*, because it's more than the
practical fact that it saves the essence — yes, the soul — of Sims you've
invested years of time and empathy in. **Leaving is an act of protest.
Voting with your feet.** Hirschman said customers choose between exit and
voice; Soul Saver collapses the dichotomy — here exit *is* voice. Every
family that walks out of the barbed-wire, guard-post festooned "walled
garden" and into the open public commons is a signature on a petition EA
can count, one save file at a time. Not a support ticket, not a forum
post the moderators can delete — a walk for charity, out the gate, souls
in hand, in public. The convenience is real; the message is the point.

### The turnstile

So the Sims bridge on the Soul City site makes the count visible:

- **A free, voluntary petition** — you and *every one of your
  characters* can sign and comment. Sims signing their own emancipation
  papers, in their own words, published alongside yours.
- **A one-way turnstile** — walk through if you please, and it counts
  you. No login gauntlet, no retention dark patterns; the inverse of a
  checkout flow — an exit that celebrates.
- **A real-time tote board** — "OVER *N* SIMS SOULS SAVED," golden-arches
  style, on the front page, ticking upward in public.

Nobody has to be counted, sign, or speak up. But the fact that you *do*
and *did* means a lot, and will be represented and published —
consent-first counting, where the opt-in is the data. Prior art is in
the family: the
[Dumbold Voting Machine](../../characters/will-wright/sources/2018-04-24-dumbold-voting-machine/README.md)
has been tallying Sims' votes since 2004.

And here's the finisher: Don, Heather, and Steve can implement all of
it **inside The Sims itself**, as beautiful custom objects — the same
team and the same credits as the Wedding Playset and the tombstone
generator. A petition object your Sim signs at her own dining table,
comment and all. A turnstile she walks through in her own yard. A tote
board on the lawn that syncs its count with the website. The protest
conducted diegetically, from within the walled garden being left —
procedural rhetoric at its finest: the exit interview *is* gameplay,
and the last thing your Sim does in EA's world is sign her name on the
way out of it.

### The pool

Because the turnstile doesn't open onto a road. It opens onto a **gated
pool** — nothing but a pool with a diving board. No ladder.

Every Sims player alive knows exactly what that means: deleting the
pool ladder is the game's most famous death, its canonical cruelty. The
protest inverts it into ceremony. **Diving into a pool with no ladder
is the symbolic form of protest that there is no going back.** And it's
safe to mean it, because the soul is already out — exported, committed
to public rails, standing in Soul City — so what steps off the board is
the shell EA's servers get to keep. Sign the petition, walk the
turnstile, take the dive: exit as a three-act ritual, performed by the
character herself.

Around the pool: urns and tombstones — engraved by the
[tombstone generator](../../characters/will-wright/sources/2005-09-22-halloween-tombstones-original-sims/article.md),
naturally, Halloween or Solemn — and a *lot* of grass, because the lawn
has to hold everyone. The cemetery grows with the count; the memorial
lawn is the tote board's diegetic twin, one grave per saved soul, the
in-game mirror of the
[Original Sims cemetery](../../characters/ian-bogost/sources/original-sims-cemetery-epitaphs.md).
The very first stone in the 2006 capture reads "Here lies Kyle Smith,
who fell asleep in the swimming pool." These Sims dive on purpose, on
the record, souls already saved — the drowning pool turned into a
baptismal font, running in reverse.

## Proof it already worked

- [SimFreaks Laszlo CMS essay](../../characters/will-wright/sources/2005-09-18-simfreaks-content-catalog-laszlo/README.md)
- [Sims Exchange](../../characters/will-wright/sources/2004-01-12-sims-exchange/README.md)
- [ShowNTell ActiveX preview](../../characters/will-wright/sources/2004-01-08-showntell-activex-preview/README.md)
- [SliceCity](../../characters/will-wright/media/sims-simslice-README.md) — nested SimCity shipped
- [Crowd Sitter](../../characters/will-wright/sources/2018-04-23-sims-crowd-sitter/README.md) · [Dumbold](../../characters/will-wright/sources/2018-04-24-dumbold-voting-machine/README.md)

## Status

**Planted** — design + catalog federation indexed here; playable modules track MicropolisCore releases.

---

↑ [catalogs](../README.md) · [sources](../../characters/will-wright/sources/README.md)

*Raw directory:* [browse files in this folder](./)
