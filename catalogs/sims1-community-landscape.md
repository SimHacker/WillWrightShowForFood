# Sims 1 community landscape

*Machine index:* [`sims1-community-landscape.yml`](sims1-community-landscape.yml)

Who still serves Sims 1 custom content, how they pay for it, and how **Soul City** + a optional **free Steam companion** fit without fighting EA or vacuuming Heather and Steve.

## Buy the game first

[`get-the-sims-on-steam.md`](get-the-sims-on-steam.md) — every catalog and companion path assumes a legal Steam copy.

---

## EA license — don't rely on amnesia

The old **Transmogrifier** click-through license is still instructive ([full text](../characters/don-hopkins/career/contracts/transmogrifier-ea-tools-eula.txt)):

- Personal **noncommercial** tool use
- Fan creations on a **noncommercial** site with EA's disclaimer block
- No redistribution of EA's tool binary

**Soul City** is a **clean-room reimplementation** of SimShow / Transmogrifier / RugOMatic in the browser — not mirroring the 2000 `.exe`. SimProv and allied catalogs are **fan-authored objects**; players supply the game.

Status quo (MTS, SimFreaks, subscriptions) is not a signed release from EA Legal. Strategy: **free UCC + disclaimer + drive Steam sales**, not paid wrappers around EA assets.

---

## Active Sims 1 sites (snapshot)

| Site | Model | Sims 1 role |
|------|--------|-------------|
| [ZombieSims](https://zombiesims.com/) | **$9.99 lifetime** (+ free newbie tier) | Heather/Steve magnum opus + **SimSlice back-catalog** during SimFreaks server migration |
| [SimFreaks](https://www.simfreaks.com/) | Creator storefront; migrating | ~26-year object suites; Cool Sites directory |
| [SimSlice](http://www.simslice.com/) | Creator site | SliceCity; downloads often via ZombieSims temporarily |
| [Mod The Sims](https://modthesims.info/f/662/) | **Free** + ads | Sims 1 forum/downloads branch; site is Sims 2–4 centric |
| [The Sims Resource](https://www.thesimsresource.com/downloads/browse/category/sims1/) | **Free files**; VIP **~$3/mo / ~$24/yr** for ad-free, fast, basket | Legacy Sims 1 category |
| [SneakySims](https://sneakysims.net/) | **Free** hub; archive DB + new tools | Post–Legacy Collection preservation push |
| [The Sims Depot](http://www.thesimsdepot.com/sims-1/downloads/) | **Free** | EA Get Cool Stuff archive + tools list |

**Yahoo Groups:** largely dead. Recovery = Internet Archive + preservation groups (e.g. Saving The Sims, CTO Sims — cited by SneakySims).

### First corpus case: Bunny Wuffles (checked 2026-08-29)

*Don asked whether the whole Bunny Wuffles catalog can be pulled down,
site pages and object shots included.*

**Both sites are live**, not dead:
[the School of Sims Transmogrification](http://bwsost.woobsha.com/)
for the tutorials and
[Architectural Supplies (ARCHIVES)](http://sas.woobsha.com/) for the
objects, themes, houses, walls, and floors. She moved to woobsha.com
when StrategyPlanet stopped hosting Sims sites; the Yahoo Groups
mirrors her archive page still points at are gone. Some sets also live
on SimFileShare, and the Donation Files ship a permission statement
inside the download, which is the
[read-the-terms-in-the-box](soul-city/rendering-and-rights.md) case
arriving on cue.

Her site states terms:

> If you would like to redesign or recolor objects from The Bunny
> Wuffles School of Sims Transmogrification, please provide credit on
> your site and in the object description with a link back to us.
> Where I have had specific permission for an item to be cloned for
> this site, you will need to ask the same permissions from the
> original designer.

That grants **derivation with credit**, says **nothing about
re-hosting**, and warns that part of the catalog is cloned from other
creators under permission **she cannot pass along.** So:

| Act | Verdict |
|-----|---------|
| Download it all for your own use | Fine. It is offered for download. Crawl politely: serial, rate-limited, robots honored, identifiable agent with a contact address, because the server is live and small. |
| Save pages and object shots | Fine for private research. **Save the terms pages first** -- they are the license record. |
| Push the pages into the Internet Archive | Do it early. Preservation without becoming the host, and it survives us. |
| Publish the metadata | Yes -- names, ids, hashes, set membership, credit chains are facts. |
| Publicly mirror her files | **No**, absent her permission, and never for the third-party clones. |

**The move that makes all of this easy is asking her.** She is
reachable, she already publishes a permission statement, some of her
downloads carry their own, and her "first entirely new object"
tutorial credits Don by name. First creator aboard, and the natural
one: her school is the pedagogical ancestor of what we are building.

Two technical notes for whenever it lands. The tutorial kits
(BunnyWufflesTutorialKit and Kit2) are **test fixtures** -- grid
templates plus deliberately ugly one-simolean objects built for
checking placement and z-buffers -- which is exactly what a pipeline
needs to validate against. And her site pages are **attribution
ground truth**: object names, pictures, theme grouping, and credit
links back to originating creators, which is the scoring corpus the
[registry](soul-city/guid-registry.md) wants for fitting weights
against confirmed cases rather than guesses.

---

## Virtual catalogs to build

| Catalog | Role |
|---------|------|
| [`maxis/`](maxis/README.md) | Metadata for base + expansion + killer downloads — pointers to Steam / IA |
| **Exchange / originalsims history** | Saves, family albums, characters — IA + Soul City hub ([2004 essay](../characters/will-wright/sources/2004-01-12-sims-exchange/); [2025 Steam gap](../characters/will-wright/sources/sims1-legacy-collection-exchange-gap/)) |
| **SimFileShare** | Post-Exchange shortlink host (`simfil.es`) — browser-only upload; invite-gated creators ([research](../characters/will-wright/sources/sims1-legacy-collection-exchange-gap/community-sharing-today.yml)) |
| **IA import pipeline** (`tornado_importer` working name) | Harvest Wayback → CARD records (URL, creator, install notes) — **index**, don't blindly re-host whole dead sites |
| **Soul City** | Deep hub for round-trippable saves and cross-game facets ([bridge architecture](../repo-shows/INDEX.yml); [GitHub distribution](soul-city/github-distribution-model.yml)) |
| **GitHub object repo** | Free UCC + metadata CARDs in [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood) + MOOLLM/Soul City in [moollm](https://github.com/SimHacker/moollm) — TSR browse replacement for repo-native lane |

Federated **brand** catalogs: [SimFreaks](simfreaks/), [SimSlice](simslice/), [SimProv](simprov/), [Zombie Sims](zombie-sims/).

---

## Steam Community Guides — Soul City discovery

**Not a separate Steam app** — official player guides on The Sims Legacy Collection Community Hub. Informational playbooks that link to Soul City (web) and Repo Shows. No install for readers.

| Job | What |
|-----|------|
| **Catalogs & tools** | Links to Soul City web — SimFreaks, SimSlice, SimProv, Zombie Sims, MTS, IA index, web Transmogrifier/SimShow |
| **Repo Shows channel** | Discover & promote Repo Shows — **Will Wright flagship**, guests, live/VOD, GitHub, TicketPR |
| **Sims & bridges** | Episodes about The Sims + **Soul City bridges** to other games (Minecraft, Stardew, Proxi, Spore, …) |
| **EA alignment** | Requires owned Sims on Steam; fan-guide disclaimer; drives sales; revives Exchange |

The guide is the **front door to the show** for players who just bought Legacy Collection and want to know what this 26-year culture is about — without downloading another app.

Full spec: [`soul-city/steam-community-guide.yml`](soul-city/steam-community-guide.yml)

| Do | Don't |
|----|--------|
| Link to web hub + creator storefronts | Sell fan UCC as Steam DLC without creator deals |
| Require / recommend owned Sims on Steam | Bundle EA `.iff` / expansion packs |
| Promote Will show + bridge episodes + public repo | Replace ZombieSims **$9.99 lifetime** — lift creators |
| Deep-link streams, issues, play-along submit | Plumbob branding / implied EA endorsement |

**Rollout:** web Soul City + public repo → Steam Community Guide + MTS + YouTube → **SoulAngel** (Windows + Mac Steam companion) → EA conversation after traction.

---

## SoulAngel — Windows + Mac Steam companion (later)

**Not a web wrapper** — native **Steam Software** (Windows first, Mac after; the sims1 while-you-play features run where the game runs, which is Windows). Watches over you playing: Simplifier TTS showcase, catalog capture, find/download/install, favorites lists you share and play back, machinima + OBS/Twitch, gateway to Exchange revival via Soul City.

Much of the catalog/playset UX already exists in Don's **SimFreaks prototype** — compose 2D scenes with room snapshot backgrounds, place objects and Sims like vinyl sticker playsets, publish installable collections.

**Announce after** the web hub bootstraps an audience — guides and MTS first, Angel second.

Full spec: [`soul-city/sims1-soul-bridge.yml`](soul-city/sims1-soul-bridge.yml)

---

## EA long game

Companion that **requires the game**, **recommends Steam purchase**, **revives Exchange storytelling** EA omitted from Legacy Collection, and **documents** the hobby model Will described in 1996 — revenue + publicity + continuity ([`get-the-sims-on-steam.md`](get-the-sims-on-steam.md)).

Short-term risk is highest when you look like a **store selling their IP** or **replacing their re-release's missing Exchange**. Lowest when you look like **infrastructure for the fan economy that already exists** — with Heather and Steve paid first.

↑ [`README.md`](README.md) · [`soul-city/`](soul-city/README.md)
