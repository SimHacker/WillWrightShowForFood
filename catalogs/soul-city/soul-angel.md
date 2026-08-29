# SoulAngel — a guardian angel for your games

*The universal capture, album, and broadcast companion. Machine-readable
spec: [soul-angel.yml](soul-angel.yml).*

**In one line:** always-on DVR, universal family album, machinima and
streaming studio, and per-game **Soul Bridges** that read and write the
game's own soul — saves, albums, characters — from a web overlay. The
Sims 1 is the first bridge, not the product.

## The name and the inversion

The lineage runs SimAngel (working title) → MicropolisAngel (EA
trademark respect) → **SoulAngel** (Micropolis is licensed too — the
same reason micropolis-home became Soul City). Soul is the family name:
Soul City (web), SoulAngel (native), Soul Bridges (per-game plugins),
Soul City Broadcast Network (channels).

The product inverted along the way: it *was* a Sims 1 companion with
streaming bolted on; it *is* a universal capture/album/broadcast engine
with game bridges plugged in. Album + DVR + narrate + publish works on
**any** game with zero integration; deep integration (save read/write,
native album round-trip) is a per-game plugin. That makes Mac viable
(no Mac Sims, plenty of Mac games), makes the product Steam-general,
and makes each new bridge a content drop instead of a new app.

## Three tiers

1. **Universal** (requires nothing from the game): always-on DVR ring
   buffer; instant-replay scrub — pause the game and walk back in time
   on video; still capture from the live frame or any DVR timestamp;
   a family album of captioned, ordered story cards; voice narration;
   publish to Soul City and remix others' albums; Twitch/YouTube/OBS
   gateway for live performance.
2. **Soul Bridge** (per-game plugin): a TypeScript module in the web
   overlay — save file read/write/edit/generate, character (soul)
   enumeration, native album round-trip where the game has one. First
   bridge: [the sims1 Soul Bridge](sims1-soul-bridge.md).
3. **Broadcast** (Soul City account): membership in the Soul City
   Broadcast Network — scheduled shows, channels, federation
   syndication.

## The Soul Album engine

Naming discipline: **Soul Album** is our generic cross-game schema;
**Family Album** is the Sims feature and fan vocabulary. The Sims 1
bridge imports and exports between them — bridges uplift game
vocabulary into game-independent schemas, never co-opt it.

The claim: everything the built-in Sims Family Album does, plus video,
voice, and the network. Each card carries an image (live capture, DVR
scrub, or import), a caption (typed, voice-narrated, or
assistant-drafted and human-edited), optional narration audio, and
provenance — game id, save id, soul ids, DVR timestamp. The card cites
the moment. (Same shape as MOOLLM's thoughtful-commitment: freeze the
reasoning behind the artifact.)

The Sims 1 round-trip is real, not scraped: the game stores Family
Album pages on disk as paired image and caption files and rescans the
directory when the album UI opens, so SoulAngel can read *and write*
the album while the game runs — external edits appear on the next album
open, no injection.

## Broadcast network — TV, radio, magazine

The liminal city has a station: **TV** (live gateway, machinima
premieres, Repo Show simulcast), **radio** (narrated albums as podcast
episodes, TTS story readings), **magazine** (published albums as web
stories — the Sims Exchange revival, cross-game). Repo Shows are the
programming; SCBN is the station; SoulAngel is the camera truck.

## Platforms and product

Windows first (WinUI 3 + WebView2, Windows.Graphics.Capture + NVENC);
Mac after v1 (ScreenCaptureKit + VideoToolbox — viable because the
universal tier needs no Sims). Paid Steam Software listing; bridges are
free content updates; optional subscription meters AI-assist API
tokens and never gates the core album and DVR. Fan bridges are
fan-made and disclaimed; the engine is ours. Not endorsed by or
affiliated with any game publisher.

## Rollout

1. Soul City web hub live (unchanged prerequisite).
2. SoulAngel Windows: universal tier with the Sims 1 bridge as launch
   showcase.
3. Bridge SDK docs — third parties write Soul Bridges for their
   favorite games.
4. Mac universal tier.
5. SCBN channels as audience forms.

## Related

- [The sims1 Soul Bridge module](sims1-soul-bridge.md)
- [Browser ecosystem spec](browser-ecosystem.md) · [GitHub distribution model](github-distribution-model.md)
- [Steam Community Guide strategy](steam-community-guide.md)
- [Soul City catalog](README.md)
