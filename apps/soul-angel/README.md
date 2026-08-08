# SoulAngel

*A guardian angel for your games.* Always-on DVR, universal **Soul Album**, machinima and streaming
studio, and per-game **Soul Bridges** that read and write the game's own soul — saves, albums,
characters — from a web overlay.

**Development home:** `MicropolisCore/apps/soul-angel/` — architecture, Soul Album schema, bridge
SDK, DVR spec, and the source-available license live there. This directory keeps the show and
community side. **Product spec:** [`catalogs/soul-city/soul-angel.yml`](../https://github.com/SimHacker/WillWrightShowForFood/tree/main/catalogs/soul-city/soul-angel.yml)

## The inversion

[MicropolisAngel](../micropolis-angel/) was a Sims 1 companion with streaming bolted on.
SoulAngel is a **universal capture/album/broadcast engine with game bridges plugged in**.
The Sims 1 is the first bridge, not the product.

| Tier | Needs from the game | What you get |
|------|--------------------|--------------|
| **1 Universal** | Nothing | DVR ring buffer, scrub back in time, still/clip capture, Soul Album story cards, voice narration, Twitch/YouTube/OBS gateway |
| **2 Soul Bridge** | Per-game plugin | Save read/write/edit/generate, soul (character) enumeration, native album round-trip (Sims Family Album first) |
| **3 Broadcast** | Soul City account | [SCBN](SCBN.yml) channels — TV, radio, magazine; federation syndication |

## Soul Album ⇄ Family Album

**Soul Album** is the generic cross-game schema; **Family Album** is what Sims fans call the
in-game feature. The Sims 1 bridge imports and exports between them. We never co-opt a game's
own vocabulary — bridges translate it into the uplifted, game-independent model.

## The Bagger

SoulAngel is the outreach-to-players'-desktops vehicle: a bucket-wheel excavator that digs up
content from running games — objects, snapshots, video, audio, stories — puts it on conveyor
belts, and streams it to the Soul City web site, Twitch, and the rest of the network.

## Subsumed: stream-gateway

[`../stream-gateway/`](../stream-gateway/) (brain bus, OBS overlay, Twitch/YouTube chat,
capture/compositing research) is subsumed into SoulAngel's universal tier. Its specs stay put
as design references; the implementation lands in the dev home.

## Rollout rule (inherited)

Soul City web hub ships first and builds audience; SoulAngel announces after. Do not lead with the
paid app before the free hub has people in it.
