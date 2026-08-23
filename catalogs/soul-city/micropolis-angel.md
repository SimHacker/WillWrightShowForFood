# MicropolisAngel — the Sims 1 Soul Bridge

*The Sims-1-specific module of [SoulAngel](soul-angel.md): save bridge,
Family Album round-trip, graveyard manager, Simplifier, catalog crawl.
Machine-readable spec: [micropolis-angel.yml](micropolis-angel.yml).*

**In one line:** a Steam Software companion that watches over you
playing Sims 1 — catalog, accessibility, machinima, streaming, and
Exchange revival — supercharging storytelling without replacing the
game.

What it is **not**: an Electron shell around the Soul City website;
implied EA endorsement or Plumbob branding; a cheat bot; a Mac app
(the Legacy Collection only runs on Windows — Mac users browse
catalogs and albums on Soul City in the browser).

## Why now — 2000 versus 2026

In 2000, machinima storytelling, real-time video compression,
screencasting, and community catalog federation weren't practical at
consumer scale. The vision is the same one Don prototyped in the
SimFreaks catalog (Laszlo + Python) — compose 2D playset scenes, share
object collections, revive Exchange-style publishing
([the 2005 SimFreaks catalog bundle](../../characters/will-wright/sources/2005-09-18-simfreaks-content-catalog-laszlo/README.md),
[the 2004 Sims Exchange bundle](../../characters/will-wright/sources/2004-01-12-sims-exchange/README.md)) —
now joined by the Simplifier lineage (screen read, TTS, guided browse)
and the modern streaming stack. MicropolisAngel is the desktop gateway
to Soul City and the resurrection of EA's historic but expired web
services.

## What it does

- **While you play** — a fair assistant, not a cheat bot: screen reader
  and accessibility bridge for the legacy UI; catalog capture from the
  live game window; install helpers; a personal catalog of favorites,
  notes, and object guides.
- **Simplifier showcase** — pioneered speech synthesis for the catalog:
  read object titles and descriptions aloud, click through the UI to
  browse and showcase objects, build and share favorites lists that
  others can play back as guided tours.
- **Catalogs and sharing** — search, browse, favorite, share; Soul City
  is the source of truth for published lists and the Angel is the
  in-game client.
- **Storytelling** — picture-and-text Family Albums (Exchange revival);
  a 2D playset composer with room-snapshot backgrounds and Sims like
  removable vinyl stickers; publish object collections others install
  together. The dream workflow from community research: a tray watcher
  on `UserData/Houses` and Web Pages exports that auto-uploads to Soul
  City and puts the link on your clipboard — replacing the alt-tab
  browser upload the 2025 Steam release never restored
  ([the Exchange gap](../../characters/will-wright/sources/sims1-legacy-collection-exchange-gap/README.md)).
- **Machinima and streaming** — capture, compression, screencasting,
  OBS/YouTube/Twitch integration; the Repo Show stream rig shares this
  DNA.
- **Chatting with God** — capture screen and telemetry, ask your chosen
  model, hear the answer via TTS: the thing players already do manually
  with screenshots, made easy while you play. Playful Sim Religion —
  reclaiming Angel, Soul, and a little God for gameplay the way Queer
  was reclaimed. Not theology, and never an AI impersonating a living
  host on a broadcast.
- **Graveyard manager** — Death, Satan, and the bodies: enumerate urns
  and tombstones from save-file parse (not screen scrape), guide
  resurrection, deliberate story kills, and cloning — always
  save-before-mutate, always with operator consent. Accessibility and
  storytelling, not a grief bot.

## Rollout rule

Web first, Angel second. Get the Soul City web hub working (create,
publish, share — no install), promote it through
[Steam Community Guides](steam-community-guide.md), ModTheSims, and
YouTube, build the audience — *then* announce the Windows companion as
the power-user, creator, and streamer upgrade.

## Related

- [SoulAngel — the universal engine this plugs into](soul-angel.md)
- [Browser ecosystem spec](browser-ecosystem.md) · [Steam guide strategy](steam-community-guide.md)
- [Sims 1 community landscape](../sims1-community-landscape.md)
- [SimFreaks catalog](../simfreaks/README.md)
