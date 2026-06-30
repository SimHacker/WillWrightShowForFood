# Maxis catalog (metadata only)

A **Card catalog** for Maxis / The Sims ecosystem objects and downloads — not a warez shelf.

## Get the game first

**[Get The Sims on Steam](../get-the-sims-on-steam.md)** — buy before you install custom content.
This catalog points at objects and downloads; it does not replace EA's store.

## What goes here

- **Killer downloads** (Killer Hamster, seasonal objects, …) — metadata + **one article each** for interesting backstories
- **Base game objects** — IDs, names, categories, pointers to previews
- **Expansion pack objects** — same schema, tagged by pack
- **Where the bytes live** — Steam install path, Internet Archive, donhopkins.com, Wayback, TCRF/Hidden Palace (link-only for protos)

## What does NOT go here

- Retail `.exe` / `.package` mirrors in git
- Leaked binary dumps (link out)

## Preview pipeline (hope → implement)

1. **Today:** ShowNTell-era scrapes + Simplifier screen-read ([`simplifier.yml`](../../apps/stream-gateway/simplifier.yml)) for live-game captures.
2. **Next:** Native **IFF reader** — rotations, zooms, multi-state sprite compositions (Transmogrifier parity, no ActiveX).
3. **Publish:** Previews on Micropolis Home federation; metadata in this catalog.

## Start

- Schema: [`CATALOG.yml`](CATALOG.yml)
- SimRefinery / business sims: [`../characters/will-wright/sources/simrefinery-recovery/`](../characters/will-wright/sources/simrefinery-recovery/README.md)
- ShowNTell source: [`../characters/will-wright/sources/2004-01-08-showntell-activex-preview/`](../characters/will-wright/sources/2004-01-08-showntell-activex-preview/README.md)

First article stub: **Killer Hamster** — TODO.
