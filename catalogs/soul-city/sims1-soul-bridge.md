# The sims1 Soul Bridge

*The Sims-1-specific module of [SoulAngel](soul-angel.md), built from
[TMog modules](portals-and-modules.md): save bridge, Family Album
round-trip, graveyard manager, Simplifier, catalog crawl.
Machine-readable spec: [sims1-soul-bridge.yml](sims1-soul-bridge.yml).
Naming history: this spec was previously titled MicropolisAngel; see
"The name and the inversion" in [soul-angel.md](soul-angel.md).*

**In one line:** the part of SoulAngel that watches over you playing
Sims 1 -- catalog, accessibility, machinima, streaming, and Exchange
revival -- supercharging storytelling without replacing the game.

What it is **not**: an Electron shell around the Soul City website;
implied EA endorsement or Plumbob branding; a cheat bot. SoulAngel
itself ships on Windows and Mac (it applies to all games); the
while-you-play sims1 features run where the game runs, which for the
Legacy Collection is Windows -- Mac players get everything else, plus
catalogs and albums on Soul City in the browser.

## Why now -- 2000 versus 2026

In 2000, machinima storytelling, real-time video compression,
screencasting, and community catalog federation weren't practical at
consumer scale. The vision is the same one Don prototyped in the
SimFreaks catalog (Laszlo + Python) -- compose 2D playset scenes, share
object collections, revive Exchange-style publishing
([the 2005 SimFreaks catalog bundle](../../characters/will-wright/sources/2005-09-18-simfreaks-content-catalog-laszlo/README.md),
[the 2004 Sims Exchange bundle](../../characters/will-wright/sources/2004-01-12-sims-exchange/README.md)) --
now joined by the Simplifier lineage (screen read, TTS, guided browse)
and the modern streaming stack. SoulAngel is the desktop gateway to
Soul City, and the sims1 Soul Bridge is the resurrection of EA's
historic but expired web services.

## What it does

- **While you play** -- a fair assistant, not a cheat bot: screen reader
  and accessibility bridge for the legacy UI; catalog capture from the
  live game window; install helpers; a personal catalog of favorites,
  notes, and object guides.
- **Simplifier showcase** -- pioneered speech synthesis for the catalog:
  read object titles and descriptions aloud, click through the UI to
  browse and showcase objects, build and share favorites lists that
  others can play back as guided tours.
- **Catalogs and sharing** -- search, browse, favorite, share; Soul City
  is the source of truth for published lists and the Angel is the
  in-game client.
- **Storytelling** -- picture-and-text Family Albums (Exchange revival);
  a 2D playset composer with room-snapshot backgrounds and Sims like
  removable vinyl stickers; publish object collections others install
  together. The dream workflow from community research: a tray watcher
  on `UserData/Houses` and Web Pages exports that auto-uploads to Soul
  City and puts the link on your clipboard -- replacing the alt-tab
  browser upload the 2025 Steam release never restored
  ([the Exchange gap](../../characters/will-wright/sources/sims1-legacy-collection-exchange-gap/README.md)).
- **Machinima and streaming** -- capture, compression, screencasting,
  OBS/YouTube/Twitch integration; the Repo Show stream rig shares this
  DNA.
- **Chatting with God** -- capture screen and telemetry, ask your chosen
  model, hear the answer via TTS: the thing players already do manually
  with screenshots, made easy while you play. Playful Sim Religion --
  reclaiming Angel, Soul, and a little God for gameplay the way Queer
  was reclaimed. Not theology, and never an AI impersonating a living
  host on a broadcast.
- **Graveyard manager** -- Death, Satan, and the bodies: enumerate urns
  and tombstones from save-file parse (not screen scrape), guide
  resurrection, deliberate story kills, and cloning -- always
  save-before-mutate, always with operator consent. Accessibility and
  storytelling, not a grief bot.

## Tools as characters: Death (Don, 2026-08-29)

Tools can BE characters. **Death embodies the graveyard manager** --
the Grim Reaper is already a sims1 NPC, and here he gets a pie menu
for doing graveyard stuff:

- **Resurrect** from tombstones and urns
- **Kill** people and leave tombstones and urns behind
- **Generate custom tombstones** (the Tombstone Generator, embodied)
- **Edit relationships** and the life-and-death-related objects
- **Sync** the Soul City representation of the departed

And life as well as death: Death **ushers souls into existence** --
as many as you want, placed straight into the save file. Many clones
from one tombstone, or out of thin air; import a character, or
generate one from a template. Even character editing could be his
skill. The scythe cuts both ways: one character, one pie menu, the
whole life-cycle toolchain behind a face you already know from the
game. (The pattern generalizes -- a tool with a face is an interface
players already know how to talk to -- and Death is its first
incarnation. Its object-shaped sibling is the
[AnythingOMatic appliance pattern](portals-and-modules.md).)

### The web reaper and the reaping ceremony (Don, 2026-08-29)

Death's true form runs **on the web site, not in the game**. An
in-game Grim Soul Reaper could only do what the engine allows at
runtime; the reaper running in your browser has **full read and write
over your save files and characters** -- supernaturally much more
powerful. (Both can exist; the browser one is the real power.)

The ceremony: **reap a character** and the web reaper replaces them
with a **custom tombstone that says anything you want** -- written AS
the character. A sim's exit, in the sim's own words: "I'm leaving The
Sims, and here is why." The virtual death of a Sim as testimony --
poignant, diegetic, and composed of fictional representations
(personal-data pitfalls sidestepped by construction; a proper privacy
policy covers the rest). Soul City keeps the tally of exits -- this is
the [character petition](steam-app-strategy.md) given its ritual form.
And the murder is always undoable: the same reaper resurrects from
the same tombstone whenever you want. Tombstones are **iconified
souls**.

### Every template gets an index page

Each object template has a page with stats and links to **all public
objects created from it** -- install any of them into your catalog,
place them in any save file. So the page listing every
i-am-leaving-the-sims tombstone isn't a special campaign feature: it
falls out of the generic **object viewer and template instance
browser**, exactly like the tombstone index page Don made decades ago
with the original Tombstone Generator.

## The sims1 district (Don, 2026-08-29)

The bridge has two ends. The game end is the app above. The **Soul
City end is a place**: the part of town relating to The Sims 1, with
shops and residencies -- creator storefronts (SimFreaks, SimSlice, and
friends), TMog tool shops, album galleries, the graveyard.

And the district expands -- like a pie menu slide -- into a **huge
suburbia of featured home save files**, the way The Sims Online
presented neighborhoods. Every featured lot is a real save file.
Click a house to load it and step inside: **not a simulation, an
open book**. Explore and edit and see everything inside of it -- what
each sim was doing, their action queue, their motives, relationships,
inventory, everything the save knows, browsable and editable. The
save inspector is the reading room; the
[Stat-U-Matic](stat-u-matic.md) scene-editor path (pre-rendered
z-buffered rooms, movable objects, pie menus, sound) is the same
viewer growing into the same streets. Frozen neighborhoods you can
walk through and read like albums -- and every one of them is shared
content, free to download and load into your own game.

## Rollout rule

Web first, Angel second. Get the Soul City web hub working (create,
publish, share -- no install), promote it through
[Steam Community Guides](steam-community-guide.md), ModTheSims, and
YouTube, build the audience -- *then* announce the SoulAngel companion
as the power-user, creator, and streamer upgrade.

## Related

- [SoulAngel -- the universal engine this plugs into](soul-angel.md)
- [Portals and modules -- TMog, the tools umbrella](portals-and-modules.md)
- [Browser ecosystem spec](browser-ecosystem.md) · [Steam guide strategy](steam-community-guide.md)
- [Sims 1 community landscape](../sims1-community-landscape.md)
- [SimFreaks catalog](../simfreaks/README.md)
