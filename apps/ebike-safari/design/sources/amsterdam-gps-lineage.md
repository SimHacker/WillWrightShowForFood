# Amsterdam GPS lineage — harvest index

**Inspiration and backstory only.** These projects are decades out of date on their original
stacks — mine them for **tested ideas**, not code to port.

Ebike Safari inherits a long chain of geolocated, bike-friendly, city-as-map experiments.

## Family tree (compressed)

```
DreamScape (1995)
  → TomTom day job (2007–2009) — UGC sharing, BitTorrent map distribution, i18n
  → iLoci (2008) — memory palace on iPhone (side project)
  → Amsterdam Coffeeshops DB (2009) — spreadsheet → many surfaces
      → iPhone app · website · LayAR · BONGO BINGO
  → StoryMaker / Bar Karma (2009–11) — SFC collaborative TV storytelling
      → Urban Safari — geolocated scene graph, performed live
  → MediaGraph (2011–15) — songs on roads
  → Ebike Safari (2026+) — FIT → OSM → gestures + exposure
```

## TomTom day job (2007–2009)

Paid work at TomTom Amsterdam (Oosterdok) — **TomTom Home** (XULRunner desktop client), map
updates, and community content infrastructure. Side projects (iLoci, Coffeeshops, BONGO BINGO)
ran in parallel; see below.

| Work area | What it tested | Ebike Safari hooks |
|-----------|----------------|-------------------|
| **User-created content sharing** | Community-authored map POIs, routes, and extras — publish, discover, install | Git-native ride/scene YAML; shared graphs without a proprietary content cloud |
| **BitTorrent map distribution** | Peer-assisted delivery of large map update packages (BitTorrent DNA) — scale without central chokepoint | Static JSON + Git LFS or IPFS-style mirrors for heavy assets; peer assist is amber, **open formats** are the harvest |
| **Internationalization** | Global map product — locale strings, regional variants, multi-market rollout | OSM tag locale layers; story layer prompts per language; manifest metadata for `lang` |

Corroboration: [2018 resume](https://donhopkins.medium.com/don-hopkins-resume-93defe4842ac) (TomTom Home, BitTorrent DNA); Aug 2008 go-ahead from Pieter Geelen to deploy BitTorrent map distribution ([pie-menu timeline](../../../../characters/don-hopkins/sources/pie-menu-timeline-medium-full.md)).

## TomTom trilogy (2008–2009, side projects)

Solo self-education projects built on the side while at TomTom. Together they matched what
Will Wright needed for CurrentTV — and led back to Stupid Fun Club.

| Project | What it tested | Ebike Safari hooks |
|---------|----------------|-------------------|
| **iLoci** | Method of Loci on iPhone; pie-menu **network editor** — rooms not menus, kiss-to-connect | Navigable graph UI; pie network on map ([`skeleton/road-graph.md`](../skeleton/road-graph.md)) |
| **Amsterdam Coffeeshops database** | Spreadsheet of every coffeeshop — photos, metadata, the **content layer behind the map** | POI / frontage exposure model; YAML corpus instead of spreadsheet |
| **Coffeeshops iPhone app** | Native app over the DB — look-and-feel, field photos | Mobile field capture → ride-attached media |
| **Coffeeshops website** | Web front on the same DB | Static JSON + Git replaces server-rendered pages |
| **LayAR app** | AR overlay on real streets from the same DB | AR is amber; **continuous trace + OSM** replaces point POI tap |
| **BONGO BINGO** | Web/mobile game: random coffeeshop bingo card, **bike around**, GPS check-in via Foursquare API, reviews feed back into DB | Gamified exposure without mayorships; **novel-type sets** not random bingo tiles |

Videos (historical): [iLoci](https://www.youtube.com/watch?v=03ddG3jWF98) · [Coffeeshops app](https://www.youtube.com/watch?v=nG90XG3STz8)

## SFC era (2009–2011) — StoryMaker / Bar Karma / Urban Safari

Built at Stupid Fun Club after the TomTom trilogy re-sparked the Will collaboration.

| Project | What it tested | Ebike Safari hooks |
|---------|----------------|-------------------|
| **StoryMaker** | Collaborative branching stories; MediaWiki + Python + Flash; geolocated scenes; many clients (iPad, Facebook, Unity) | Story layer reads **detected events** — engine stays honest ([`skeleton/story-layer.md`](../skeleton/story-layer.md)) |
| **Bar Karma** | First online community-developed network TV series — audience votes branch the plot | Show format; not the GPS engine |
| **Urban Safari** | Geolocated branch of StoryMaker: capture scene cards in the field, follow paths through a shared graph; Layar AR demos; Facebook album round-trip; **performed live** in Amsterdam (2011) | Continuous ride trace; gesture spells; exposure log — fresh stack in this repo |

Amber archive: [`../../LEGACY-URBAN-SAFARI.md`](../../LEGACY-URBAN-SAFARI.md)

## What to harvest (ideas, not stacks)

| Tested idea | From | Into Ebike Safari |
|-------------|------|-------------------|
| City as navigable graph | iLoci, StoryMaker | Road graph + snap |
| Spreadsheet → many surfaces | Coffeeshops DB | Git + YAML + static JSON |
| Bike as check-in instrument | BONGO BINGO | Ride *is* the check-in stream |
| GPS-verified field notes | BONGO BINGO, Urban Safari | Video sync + transcript on route |
| POI frontage both sides | Coffeeshops density | Exposure Pac-Man ([`../exposure-pac-man.md`](../exposure-pac-man.md)) |
| AR overlay on streets | LayAR, Urban Safari Layar demos | MapLibre layers (2D first) |
| Community path following | Urban Safari, StoryMaker | Shared ride graphs — future |
| Pie network on map | iLoci, steering notes | Viewer UI pattern |
| Community content sharing | TomTom UGC system | Git PRs for ride YAML, scene cards, exposure rules |
| Large asset distribution | TomTom BitTorrent map updates | Static build artifacts; optional peer mirror — not proprietary DNA |
| Multi-locale maps | TomTom i18n | Per-locale story + OSM label layers |
| Territory / segment claim | TomTom rejected paint idea; Quitmeyer Mark Your Territory | [`tomtom-rejected-ideas.md`](tomtom-rejected-ideas.md) |
| Geography-fed pet | TomTomagotchi (rejected at TomTom) | [`geometry-as-language.md`](../geometry-as-language.md) |

## What to reject (amber stacks)

| Old | Why reject | Use instead |
|-----|------------|-------------|
| Google Maps / MapKit | Proprietary | OSM + MapLibre |
| MySQL scene server | Centralized | Git + YAML |
| Foursquare check-in API | Point taps, cloud lock-in | Continuous FIT trace |
| Flash / MediaWiki stack | Dead clients | SvelteKit + static JSON |
| Spreadsheet as live DB | Manual, single-writer | Versioned YAML in repo |
| Proprietary P2P map CDN | TomTom BitTorrent DNA stack | Git + static hosting; open GeoJSON/FIT |

## Archive pointers (WWSFF)

| Topic | Where |
|-------|-------|
| TomTom employment | [`../../../characters/don-hopkins/career/work-history.yml`](../../../../characters/don-hopkins/career/work-history.yml) |
| TomTom Home / BitTorrent DNA (resume) | [`../../../characters/don-hopkins/sources/2018-05-24-don-hopkins-resume.md`](../../../../characters/don-hopkins/sources/2018-05-24-don-hopkins-resume.md) |
| BitTorrent deploy go-ahead (Aug 2008) | [`../../../characters/don-hopkins/sources/pie-menu-timeline-medium-full.md`](../../../../characters/don-hopkins/sources/pie-menu-timeline-medium-full.md) |
| TomTom trilogy + Will rejoin | [`../../../characters/don-hopkins/career/stupid-fun-club.yml`](../../../../characters/don-hopkins/career/stupid-fun-club.yml) |
| Idea jam entries | [`../../../process/crazy-idea-jam.yml`](../../../../process/crazy-idea-jam.yml) — `#iloci_memory_palace`, `#amsterdam_coffeeshops_app`, `#bongo_bingo`, `#creationtv_storymaker`, `#urban_safari_gps_storytelling` |
| Career lineage | [`../../../characters/don-hopkins/career/lineage.yml`](../../../../characters/don-hopkins/career/lineage.yml) |
| Urban Safari performed live | [`../../../repo-shows/urban-safari-live/`](../../../../repo-shows/urban-safari-live/) |
| StoryMaker media | [`../../../characters/don-hopkins/media/storymaker-urban-safari/`](../../../../characters/don-hopkins/media/storymaker-urban-safari/) |
| Steering / VoyStick | [`../../../characters/don-hopkins/sources/urban-safari-steering-voystick-pie-network.md`](../../../../characters/don-hopkins/sources/urban-safari-steering-voystick-pie-network.md) |

↑ [`../CAULDRON.yml`](../CAULDRON.yml) · [`../lineage.yml`](../lineage.yml)
