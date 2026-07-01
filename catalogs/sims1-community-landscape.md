# Sims 1 community landscape

*Machine index:* [`sims1-community-landscape.yml`](sims1-community-landscape.yml)

Who still serves Sims 1 custom content, how they pay for it, and how **Micropolis Home** + a optional **free Steam companion** fit without fighting EA or vacuuming Heather and Steve.

## Buy the game first

[`get-the-sims-on-steam.md`](get-the-sims-on-steam.md) — every catalog and companion path assumes a legal Steam copy.

---

## EA license — don't rely on amnesia

The old **Transmogrifier** click-through license is still instructive ([full text](../characters/don-hopkins/career/contracts/transmogrifier-ea-tools-eula.txt)):

- Personal **noncommercial** tool use
- Fan creations on a **noncommercial** site with EA's disclaimer block
- No redistribution of EA's tool binary

**Micropolis Home** is a **clean-room reimplementation** of SimShow / Transmogrifier / RugOMatic in the browser — not mirroring the 2000 `.exe`. SimProv and allied catalogs are **fan-authored objects**; players supply the game.

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

---

## Virtual catalogs to build

| Catalog | Role |
|---------|------|
| [`maxis/`](maxis/README.md) | Metadata for base + expansion + killer downloads — pointers to Steam / IA |
| **Exchange / originalsims history** | Saves, family albums, characters — IA + Simopolis hub ([source bundle](../characters/will-wright/sources/2004-01-12-sims-exchange/)) |
| **IA import pipeline** (`tornado_importer` working name) | Harvest Wayback → CARD records (URL, creator, install notes) — **index**, don't blindly re-host whole dead sites |
| **Simopolis** | Deep hub for round-trippable saves and cross-game facets ([bridge architecture](../repo-shows/INDEX.yml)) |

Federated **brand** catalogs: [SimFreaks](simfreaks/), [SimSlice](simslice/), [SimProv](simprov/), [Zombie Sims](zombie-sims/).

---

## Steam Community Guides — Micropolis Home discovery

**Not a separate Steam app** — official player guides on The Sims Legacy Collection Community Hub. Informational playbooks that link to Micropolis Home (web) and Repo Shows. No install for readers.

| Job | What |
|-----|------|
| **Catalogs & tools** | Links to Micropolis Home web — SimFreaks, SimSlice, SimProv, Zombie Sims, MTS, IA index, web Transmogrifier/SimShow |
| **Repo Shows channel** | Discover & promote Micropolis Class shows — **Will Wright flagship**, guests, live/VOD, GitHub, TicketPR |
| **Sims & bridges** | Episodes about The Sims + **Simopolis bridges** to other games (Stardew, Proxi, Spore, …) |
| **EA alignment** | Requires owned Sims on Steam; fan-guide disclaimer; drives sales; revives Exchange |

The guide is the **front door to the show** for players who just bought Legacy Collection and want to know what this 26-year culture is about — without downloading another app.

Full spec: [`micropolis-home/steam-community-guide.yml`](micropolis-home/steam-community-guide.yml)

| Do | Don't |
|----|--------|
| Link to web hub + creator storefronts | Sell fan UCC as Steam DLC without creator deals |
| Require / recommend owned Sims on Steam | Bundle EA `.iff` / expansion packs |
| Promote Will show + bridge episodes + public repo | Replace ZombieSims **$9.99 lifetime** — lift creators |
| Deep-link streams, issues, play-along submit | Plumbob branding / implied EA endorsement |

**Rollout:** web Micropolis Home + public repo → Steam Community Guide + MTS + YouTube → **MicropolisAngel** (Windows Steam companion) → EA conversation after traction.

---

## MicropolisAngel — Windows Steam companion (later)

**Not a web wrapper** — native **Steam Software** for Windows (Sims 1 does not run on Mac). Watches over you playing: Simplifier TTS showcase, catalog capture, find/download/install, favorites lists you share and play back, machinima + OBS/Twitch, gateway to Exchange revival via Micropolis Home.

Much of the catalog/playset UX already exists in Don's **SimFreaks prototype** — compose 2D scenes with room snapshot backgrounds, place objects and Sims like vinyl sticker playsets, publish installable collections.

**Announce after** the web hub bootstraps an audience — guides and MTS first, Angel second.

Full spec: [`micropolis-home/micropolis-angel.yml`](micropolis-home/micropolis-angel.yml)

---

## EA long game

Companion that **requires the game**, **recommends Steam purchase**, **revives Exchange storytelling** EA omitted from Legacy Collection, and **documents** the hobby model Will described in 1996 — revenue + publicity + continuity ([`get-the-sims-on-steam.md`](get-the-sims-on-steam.md)).

Short-term risk is highest when you look like a **store selling their IP** or **replacing their re-release's missing Exchange**. Lowest when you look like **infrastructure for the fan economy that already exists** — with Heather and Steve paid first.

↑ [`README.md`](README.md) · [`micropolis-home/`](micropolis-home/README.md)
