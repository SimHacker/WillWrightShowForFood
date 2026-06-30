# Multiplayer SimCity — UI and network design

*Don Hopkins, December 2006 OLPC pitch letter + SimCityNet product history. Primary harvest: [sim-city-in-open-source-for-100-laptop.txt](../../../../DonHopkins/temp/old-email/sim-city-in-open-source-for-100-laptop.txt). Republished in [WillWrightShowForFood](https://github.com/SimHacker/WillWrightShowForFood).*

---

## Three layers of "multiplayer SimCity"

| Era | Platform | Network model | UI idea |
|-----|----------|---------------|---------|
| **SimCityNet** (1993+) | X11 / TCL/Tk on Unix | Shared city; cooperative edit | Voting, proposals, chat, chalk overlay |
| **Educational / Columbia** (1990s–2000s) | Scriptable SimCity | Classroom experiments | TCL scripting, data export to spreadsheets |
| **Micropolis web** (2000s) | Python / TurboGears / OpenLaszlo / Flash AMF | Central server, thin clients | Constructionist politics — proposals, campaigns, wiki newspaper |
| **Sugar / OLPC** (2007+) | Python / GTK on XO | Mesh, journaling | Kid-friendly collaboration (separate essay) |

This article focuses on **SimCityNet** and the **planned Laszlo centralized client** — the implemented cooperative UI and its web reincarnation sketch.

---

## SimCityNet — what shipped

Don sold **SimCityNet** commercially (CD-ROM + FTP demo, node-locked or floating network license) after porting Mac SimCity to:

1. **NeWS / HyperLook** (1993) — pie menus, unlockable demo that "melts" the city
2. **X11 / TCL/Tk** — scriptable, network-aware GUI; multi-platform (Sun, SGI, HP, Linux, NCD X terminals)

Demonstrated at **InterCHI'93** Interactive Experience, Interval "Electric Carnival" / Lollapalooza, and trade shows.

Screenshots (three displays — SGI Indigo, NCD X terminal, Sun):

- http://www.donhopkins.com/home/images/SimCity-Indigo.gif
- http://www.donhopkins.com/home/images/SimCity-NCD.gif
- http://www.donhopkins.com/home/images/SimCity-Sun.gif

Paper: [SimCityNet: A Cooperative Multi User City Simulation](http://www.art.net/~hopkins/Don/simcity/simcitynet.html)

---

## Design principle: politics without breaking the sim

> The intent of my design for the multi player SimCity user interface was to introduce **collaboration, conferencing, interpersonal politics and gridlock** into the game, but **not to change the way the simulation worked** in any way (don't mess with a good thing).

Multiplayer is a **social layer** on an unchanged Micropolis engine — same rule as Micropolis Home today: federation and operator tools sit beside the sim, not inside it.

---

## Cooperative UI mechanics (1993 X11 build)

### Unanimous votes on expensive changes

When multiple players are connected, everyone must vote **unanimously** to build expensive zones (stadiums, power plants) or change the **tax rate**.

### Bouncing building proposals

Any player can place a proposal. Instead of instant construction:

1. The building **bounces up and down** over the lot to attract attention
2. A **non-interruptive dialog** opens on every screen with an inset live view of the bouncing building
3. Players may **ignore** the dialog and keep editing
4. When **everyone votes yes** (vote button *or* builds the same building in the same spot), the building **settles** and opens

Meanwhile: text chat, alternate proposals, pleading — and **drawing on the map** with the chalk overlay tool.

### High-speed "twitch" cooperative play

The UI supports extreme simulation speed (1000 years/minute on a 500 MHz laptop in 2006). Design details:

- **Pie menus** — switch tools without cursor travel to palette
- **Blurred month digits** when running fast — fewer repaints
- **Tax dialog doesn't pause** — drag taxes while watching buildings rise/fall in real time
- **Transparent overlays** — multiple map windows, multiple editors on different regions
- **Notice pop-ups** include clickable live map views to jump the main editor to the problem site

Fire departments at high speed are mandatory — fires engulf the city in a blink.

---

## Dynamic Zone Finder — information visualization

Inspired by Chris Williamson and Ben Shneiderman's **Dynamic Home Finder**. Washboard filters (min/max sliders) on pollution, land value, density, traffic, crime, distance to police/fire, etc. Map **animates** as filters move — especially vivid at high sim speed.

Scripting (TCL/Tk) implemented multiplayer UI, talking pie menus, and these visualizations.

---

## Planned: centralized OpenLaszlo / Python multiplayer (2000s)

Don's Micropolis **PROGRESS.txt** future plans (TurboGears + OpenLaszlo + Flash AMF stack):

```
Shared city library.
Journal, chat, IRC.
Deeper MediaWiki integration.
Multi user support.
    Avatar chat in game.
    Avatars as editing tools and programmable bots.
    Writing proposals.
    Campaigning for issues.
    Voting on proposals.
    Cooperative multi user interface.
    Writing down ideas, justifying your proposals to other players...
    Journalism and creative writing.
    City newspaper.
    Publish stories about cities in the wiki.
    Live playable views of save files associated with stories.
```

Source: [`micropolis/PROGRESS.txt`](../../../../micropolis/PROGRESS.txt) (Future plans section); echoed in [`laszlo/micropolis/TODO.txt`](../../../../micropolis/laszlo/micropolis/TODO.txt) (Facebook-era "city wall", event quests, friend city snapshots).

**City save tree:** immutable branch cities vs mutable leaf cities; players branch from each other's shared saves — parent pointers, snapshot-on-branch semantics (see email dump ~line 15255 in `old-email.txt` and TODO.txt).

This is the **centralized server + rich web client** thread — precursor to Micropolis Home federation (MySQL/SQLObject Laszlo catalog → git CARD + stream-gateway derived DB).

---

## Lessons for Micropolis Home (2026)

1. **Non-interruptive proposals** — good pattern for async collaboration (don't modal-lock operators)
2. **Unanimous vs majority** — SimCityNet chose gridlock-by-design; modern federation may need configurable quorum
3. **Chalk + chat + journalism** — maps to wiki newspaper + show transcripts + Simplifier accessibility layer
4. **Scriptable bots as avatars** — PacBot in PROGRESS.txt; Simplifier reincarnation drives programmable agents without breaking ToS

---

## Related

- [`../simcity-open-source-saga/`](../simcity-open-source-saga/README.md) — OLPC negotiation that contains this letter
- [`../sugar-centralized-multiplayer-laszlo/`](../sugar-centralized-multiplayer-laszlo/README.md) — Sugar mesh vs Laszlo catalog CMS
- [`../../../../don-hopkins/career/simcity-lineage.yml`](../../../../don-hopkins/career/simcity-lineage.yml)
- Demo video: https://www.youtube.com/watch?v=8snnqQSI0GE (Python/Flash Micropolis)

**SimCityNet capture:** https://www.youtube.com/watch?v=_fVl4dGwUrA — *Multi Player SimCityNet for X11 on Linux*

---

*Previously: outline-only README. Upgraded 2026-06-29 from email harvest + PROGRESS.txt.*
