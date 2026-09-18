# CloudMade 2009 — the custom-OSM-map market before Mapbox existed

Primary artifact: the Amsterdank Coffeeshop Guide (2009–2011), a themed OSM map of Amsterdam with
an offline tile cache in an iPhone app. It is a dated snapshot of what a small developer could
actually buy in 2009, and of the market Mapbox went on to own.

## What the code says

| Piece | Choice |
|---|---|
| Basemap | CloudMade **style 8558**, a custom style made in CloudMade's web Style Editor — the green weed-themed Amsterdam map |
| Tiles | `{a,b,c}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png`, raster, attribution "Data © 2009 OpenStreetMap. Rendering © 2009 CloudMade" |
| Web client | OpenLayers 2, with a hand-written `OpenLayers.Layer.CloudMade` subclass of `Layer.TMS` |
| Geocoding | `geocoding.cloudmade.com` |
| Routing | `routes.cloudmade.com` |
| iPhone | **route-me** with `RMCloudMadeMapSource`, plus a prewarmed SQLite tile cache (`MapCloudMadeMaps8558.sqlite`) built by a Python script that enumerated and pulled every tile |

Style, tiles, geocoding, routing and offline caching, in 2009, by one person, with a free API key.

## What Mapbox was at that moment

Nothing you could have used for this. Mapbox was a project name inside Development Seed, a
Washington DC consultancy, and its pieces arrived after the code above was already running:

| Date | Event |
|---|---|
| Jun 16, 2010 | Knight News Challenge grant to "MapBox's TileMill" — the earliest public use of the name in this trail ([Development Seed](https://developmentseed.org/blog/2010-06-16-tilemill-2-0-wins-knight-news-challenge-grant-to-improve-hyper-local-mapping-in-washington-dc/)) |
| Jun 2010 | Justin Miller joins as mobile lead, "original team of fifteen" |
| Oct 8, 2010 | **MBTiles** format released — SQLite full of tiles, for moving them to devices and using them offline ([announcement](https://developmentseed.org/blog/2010-10-08-portable-map-tiles-format-released/)) |
| Jan 2011 | MapBox for iPad ships, built on **route-me** |
| Feb 16, 2011 | **TileMill** announced publicly — desktop map design with CartoCSS over Mapnik ([announcement](https://developmentseed.org/blog/2011-02-16-announcing-tilemill-a-modern-map-design-studio-powered-by-open-source/)) |
| Apr 25, 2011 | **TileStream Hosting** — the first time you could pay Mapbox to host your custom tiles ([announcement](https://developmentseed.org/blog/2011-04-25-mapbox-launches-tilestream-hosting-and-announces-the-tilemill-appliance/)) |
| Oct 2013 | Mapbox Inc., $10M Series A led by Foundry Group. Vector tiles, Studio and GL follow |

Even in 2011, TileMill and CloudMade were different products for different people: TileMill meant
installing a design studio, writing CartoCSS, rendering, then hosting the output. CloudMade meant a
style editor in a browser and a live tile URL with a key. For someone who needed a green Amsterdam
by the weekend, there was one option.

## The same choice, made twice, in the same months

Justin Miller's account of building MapBox for iPad in 2010 describes evaluating exactly the two
things this repo's old code used — and notes that CloudMade's own iOS tooling was built on route-me:

> Two possibilities came to light: CloudMade, a company specializing in mapping technology, and
> route-me, an open source library upon which CloudMade's tools are actually built. Based on the
> activity of the route-me project, the fact that it was truly open source … we decided to go with
> route-me.
> — [Code Sorcery Workshop, Jan 5 2011](https://codesorcery.net/2011/01/05/mapbox-for-ipad-goes-live.html)

Mapbox then forked route-me into the Mapbox iOS SDK, and invented MBTiles to solve the problem of
shipping a million tiles to a device — the same problem solved here with a hand-rolled SQLite tile
cache. The trace is still in the tree: the vendored route-me copy contains
`RMMBTilesTileSource.h`, documenting MBTiles at a mapbox.com URL. Mapbox's format walked into the
library while it sat on disk.

## The CloudMade diaspora built the tools everyone uses now

- **Leaflet** was written by Vladimir Agafonkin **at CloudMade** (first release 2011). He later
  joined Mapbox.
- **route-me** became the Mapbox iOS SDK.
- CloudMade engineers (Andy Allan, Matt Amos, Shaun McDonald, Harry Wood) delivered OSM **API
  0.6** ([OSM wiki](https://wiki.openstreetmap.org/wiki/CloudMade)).

## Fate of CloudMade

| Date | Event |
|---|---|
| 2007 | Founded by **Steve Coast** (who started OSM in 2004) and **Nick Black** ([TechCrunch](https://techcrunch.com/2008/03/17/cloudmade-raises-e24m-to-supercharge-open-source-maps/)) |
| Mar 2008 | €2.4M Series A, Sunstone Capital. Greylock later. Pitch: "CloudMade overcomes Google Maps fatigue" |
| 2008–2011 | The commercial OSM platform: Style Editor, tile hosting, geocoding, routing, free developer keys |
| Oct 5, 2010 | **Steve Coast resigns** ([OSM blog](https://blog.openstreetmap.org/2010/10/05/osm-founder-steve-coast-leaves-cloudmade/)) |
| ~2013 | Pivot to location-based in-game advertising ("Zigi") |
| **May 1, 2014** | **Tiles, geocoding, routing and vector streams switched off** for anyone under 10,000,000 transactions/month — which is to say, for everybody ([the email](https://notes.ericjiang.com/posts/741)) |
| ~2015 → | Connected car, SDKs, automotive data |
| 2024 | Automotive AI technology and IP acquired by Stellantis |

The green Amsterdam map did not rot. It was switched off from London, on a date, by a company on
its way to selling software to car makers.

## Who else was in the field, 2009–2011

| Option | What it was | Why not, then |
|---|---|---|
| OSM's own tile server | The one Mapnik "standard" style | No custom styling, no commercial guarantees |
| **CloudMade** | Styles + tiles + geocoding + routing, free keys | The pick |
| MapQuest Open (AOL) | OSM tiles and directions — UK Jul 2010, US Dec 2010 ([OSM blog](https://blog.openstreetmap.org/2010/07/10/mapquest-announce-openstreetmap-support/)) | Arrived later, MapQuest's style only |
| Google Maps API v3 Styled Maps | Styling of Google's tiles, announced at I/O May 2010 ([Google](https://developers.googleblog.com/geo-at-google-io-2010/)) | Google's data, Google's terms, no offline, not OSM |
| Self-hosted Mapnik + osm2pgsql + mod_tile / TileCache / Cascadenik | Total control | Weeks of work and a server, to get what a style ID gave for free. This is the stack the TomTom web-map people were using at the time |
| Clients | OpenLayers 2 (used here), Modest Maps, Polymaps (2010), Leaflet (2011, out of CloudMade) | — |
| Also circling | Stamen, SimpleGeo, Skobbler, Geofabrik, ITO World, Nutiteq, CartoDB (2012) | Design studios, data shops, or too late |

## What this history is good for

Two lessons that apply directly to [`../bike-computer.md`](../bike-computer.md):

1. **The rendering vendor is a rented dependency, and rent gets called.** CloudMade's style editor
   was the best thing going and it evaporated with 30 days' notice. Style definitions, tile
   sources and offline caches belong behind an interface, and the style itself should exist as a
   file we hold — not as an integer in someone's database.
2. **Turnkey beats correct, for one developer with a weekend.** CloudMade won in 2009 for exactly
   the reason a browser-based head unit can win now: it was ready, it was free to start, and it
   did the thing without asking permission first.

↑ [`../bike-computer.md`](../bike-computer.md) · [`amsterdam-gps-lineage.md`](amsterdam-gps-lineage.md) · [`tomtom-rejected-ideas.md`](tomtom-rejected-ideas.md)
