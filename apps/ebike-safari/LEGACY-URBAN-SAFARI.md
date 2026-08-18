# Urban Safari — preserved in amber (SFC era)

**Do not extend this stack.** [Ebike Safari](README.md) is the new project from scratch.

## What Urban Safari was

Don's **2008–2011 GPS storytelling lineage** — TomTom-era prototypes through SFC production.

**Pre-SFC (2007–2009):** TomTom day job — user-created content sharing, BitTorrent map
distribution, internationalization (TomTom Home). Side projects: iLoci; Amsterdam Coffeeshops
spreadsheet → iPhone app, website, LayAR, BONGO BINGO.

**SFC (2009–2011):** StoryMaker / Bar Karma collaborative TV storytelling → **Urban Safari**
geolocated scene cards, adventure-style navigation while riding, performed live with StoryMaker.
Google Maps / Apple MapKit components, MySQL backend, proprietary map APIs.

Full harvest index: [`design/sources/amsterdam-gps-lineage.md`](design/sources/amsterdam-gps-lineage.md)

## Where the history lives

| Archive | Path |
|---------|------|
| **TomTom trilogy + lineage index** | [`design/sources/amsterdam-gps-lineage.md`](design/sources/amsterdam-gps-lineage.md) |
| **Show + product (2026 seed)** | [`../../repo-shows/ebike-safari/`](../../repo-shows/ebike-safari/) |
| **StoryMaker media** | [`../../characters/don-hopkins/media/storymaker-urban-safari/`](../../characters/don-hopkins/media/storymaker-urban-safari/) |
| **Steering / VoyStick notes** | [`../../characters/don-hopkins/sources/urban-safari-steering-voystick-pie-network.md`](../../characters/don-hopkins/sources/urban-safari-steering-voystick-pie-network.md) |
| **Crazy idea jam** | [`../../process/crazy-idea-jam.yml`](../../process/crazy-idea-jam.yml) — `#urban-safari-gps-storytelling` |

Draw inspiration from sources; **write fresh code** for Ebike Safari.

**Active design:** [`design/README.md`](design/README.md) (cauldron, slurping phase)

## What Ebike Safari uses instead

| Old (Urban Safari) | New (Ebike Safari) |
|--------------------|-------------------|
| Google Maps / MapKit | OpenStreetMap + MapLibre (planned) |
| MySQL | Git repo + YAML + static JSON |
| Proprietary map SDKs | FIT → GeoJSON pipeline in [`scripts/`](scripts/) |
| SFC server stack | WWSFF stage + FIT pipeline in [`scripts/`](scripts/) |

↑ [README.md](README.md) · [skills/ebike-safari/](../../skills/ebike-safari/SKILL.md)
