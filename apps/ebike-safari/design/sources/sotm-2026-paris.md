# State of the Map 2026 — Paris, harvested for Ebike Safari

**Source:** [2026.stateofthemap.org](https://2026.stateofthemap.org/) · [programme](https://2026.stateofthemap.org/programme/) ·
Cité Descartes, Champs-sur-Marne, **August 28–30 2026** · [HN thread](https://news.ycombinator.com/item?id=49507280)

**Provenance and its limits.** Titles, speakers and tracks are from the published programme.
**No abstracts were read and no recordings existed yet at harvest time** (the conference closed the
day before). The analysis below is inference from titles plus independent knowledge of the named
projects — Panoramax, MOTIS, Valhalla, OSRM, MapLibre, PMTiles, MapRoulette, uMap and GeoDesk are
things we know outside this programme. Items resting on the title alone are marked ⚠. Watch the
[SotM YouTube channel](https://www.youtube.com/@OpenStreetMap) for recordings and re-check the ⚠
items before acting on them.

---

## 1. The one that reads as a bug report against our data model

Our overlay design uses OSM ids as **foreign keys**: `spawn: { edge: way/482910 }`, territory
strength keyed on snapped way ids, exposure pellets referencing node ids
([`viewer-maplibre.md`](../skeleton/viewer-maplibre.md#base-map-vs-overlays--do-not-pollute-osm)).

**OSM ids are not stable.** A way gets split when someone maps a new junction, merged when someone
tidies a duplicate, deleted and re-drawn when someone re-traces from better imagery. Every one of
those routine edits silently breaks a foreign key — and since we never write to OSM, nothing tells
us it happened. Our pee-heat just quietly detaches from the street it was painted on.

Two talks land directly on this:

| Talk | Speaker | Why it matters here |
|---|---|---|
| **OSMPID: A Persistent ID Specification and an Object Identity Service** | Stefan Keller | A spec plus a *service* for durable references to OSM objects. If it works, it is the correct type for our foreign keys and we should adopt it rather than invent one. |
| **Where are my ways?** | Michael Reichert | ⚠ Title suggests exactly the way-disappearance problem. Worth watching first. |
| **Detection and Semantic Annotation of Changes in OpenStreetMap Data** 🎓 | Camille Bernard, PedroPinheiro | Change detection — the machinery for *noticing* a key broke and re-snapping. |
| **Clearance: Quality Proxy for OSM Replication, roadmap to v1.0** | Frédéric Rodrigo | Replication quality, i.e. how to stay in sync with a moving base at all. |

**Action:** treat this as a design defect to fix before territory data accumulates, not a nice-to-have.
Cheap mitigation regardless of what OSMPID turns out to be: store the snapped **geometry** (or a
geohash of the midpoint) *alongside* the way id, so a broken key can be re-snapped automatically
instead of being lost. Belongs in
[`road-graph.md`](../skeleton/road-graph.md) and [`git-postgres-sync.md`](../git-postgres-sync.md).

---

## 2. Panoramax — the biggest product opportunity in the programme

[Panoramax](https://panoramax.fr/) is the open, federated street-level imagery platform (a
commons-governed alternative to Street View and Mapillary). It had **five slots** across three days,
which is what a project looks like when it is being pushed hard:

- **State of Panoramax** — Christian Quest, Adrien Pavie
- **Panoramax Foundation** — Christian Quest
- **Immersing Panoramax in the 3D world** — Vincent Picavet
- **Panoramax Netherlands** — Bas Bussink
- **Panoramaxing the local hiking route 500m from here** (outdoor workshop)

**Why this is ours specifically.** Ebike Safari is a camera-equipped bike that already records
geolocated tracks with a timebase ([`DATA-CONTRACT.md`](../../DATA-CONTRACT.md), the Bosch FIT
pipeline). That is *precisely* a Panoramax capture rig. The same ride that produces a ride line, an
exposure log and a story track can produce open street-level imagery as a by-product — and
**Panoramax Netherlands** means there is a local community already doing it in Don's country.

Three distinct things this could be:

1. **Contribution** — publish ride imagery to Panoramax. Turns a private lifelog into a commons
   donation, which fits the project's stated politics far better than hoarding it.
2. **Consumption** — pull Panoramax imagery *into* the viewer as a ground-level layer, so a story
   card or a pee marker can show the actual doorway. Cheaper and more open than any commercial
   imagery API.
3. **The ethics forcing-function** — a camera on a bike in a Dutch city films people. Panoramax has
   had to solve blurring, consent and takedown as a *governance* problem, not just a technical one.
   Whatever they decided is prior art we need and would otherwise have to invent.

Adjacent and directly usable:

- **StreetMeasure: low-cost open source monocular depth estimation supporting OSM measurement tags
  from 360° streetview photos** 🎓 — Quang Huy Nguyen, Federica Gaspari. Depth from a single camera.
  A bike camera plus this yields lane widths, parking setbacks, path clearances — measurements the
  exposure and gesture layers could consume. ⚠ on quality; monocular depth is improving fast but
  metric accuracy is the whole question.

---

## 3. Cycling data — the schema Ebike Safari actually runs on

This is a **bike** app, so the quality and shape of OSM cycling tags is not background detail, it is
the substrate. Four items:

| Talk | Speaker | Application |
|---|---|---|
| **How OSM inspired CEN standards for cycling infrastructure** | Tu-Tho Thai | OSM tagging feeding into a European *standard*. If a standard schema is arriving, our internal cycling vocabulary should align to it rather than diverge. |
| **How OpenStreetMap became the backbone of France's National Cycling Database** | Samuel Deschamps-Berger | A national-scale production system built on the same tags we plan to read. Their normalization pipeline is the one to copy. |
| **Assessing the Intrinsic Data Quality of OSM for National-Scale Cycling Network Analysis** 🎓 | Vanessa Bolognani | Quantified answer to "how much can you trust the cycling network?" — sets expectations for snapping and routing failures. |
| **Reconstructing a High-detailed Lane-Level Road Network Model from OSM: A Connectivity-Driven Approach** 🎓 | Chengzhi Rao | Bike lanes are frequently separate ways parallel to the road, or tags on the road, inconsistently. Lane-level reconstruction is the fix for map-matching a bike to the *right* line. |

That last one is also the general form of a problem the design already has: deriving fine
connectivity (which lane, which direction, which turn is legal) from coarse wiring. Turn
restrictions and one-ways are **directed edges** — the road graph is not symmetric, and
[`road-graph.md`](../skeleton/road-graph.md) should say so explicitly.

---

## 4. Styling and tiles — our viewer's exact stack, discussed by the people who build it

The viewer plan is MapLibre, one style with many sources, a layer catalog compiled from
`viewer/layers/catalog.yml`, and "realistic vs cozy — same data, different style JSON," with
PMTiles/tippecanoe/Protomaps at scale.

| Talk | Speaker | Application |
|---|---|---|
| **Style-as-Code: Moving Beyond "Off-the-Shelf" to Unlock the Full Richness of OSM Data** 🇫🇷 | paul goullencourt | Our `catalog.yml` → MapLibre style JSON *is* a compilation step. This is the same argument, from people who ship it. Highest-value talk for the viewer. |
| **Sourdough and Layercake: removing technical barriers to using OSM data for cartography and analysis** | Jake Low | ⚠ Two tools, contents unknown. Title is exactly the osm-enrichment problem statement. |
| **MapLibre — from data to rendering, in one status update** | Yuri Astrakhan, Frank Elsinga | Survey of where the renderer is. Check for globe/3D-terrain state before committing viewer features. |
| **A new stack for OpenStreetMap vector tiles** | Matt White | Basemap tile serving — relevant to whether we self-host or lean on Protomaps. |
| **Mapterhorn Terrain and Imagery** | Oliver Wipfli | **Terrain.** An ebike app is about hills — the FIT series already carries elevation, and terrain tiles would let the map *show* what the legs felt. Directly feeds the cozy/realistic split. |
| **From Bits to Pixels: Introduction to Map Making with OSM Data and MapLibre** | Bart Louwers, Yuri Astrakhan | Workshop — the on-ramp, if anyone new joins the viewer work. |
| **OSMF Vector Tiles** (session) | — | Governance of the official tile stack; matters if we depend on it. |

---

## 5. Routing, map-matching and isochrones

[`viewer-maplibre.md`](../skeleton/viewer-maplibre.md#osm-ecosystem-toolswhat-each-does) already
names Valhalla and OSRM for routing, isochrones and map-matching. Both were on stage, and one talk
is straightforwardly actionable:

- **Making world spinning faster — how we sped up Valhalla graph creation 3×** — Stefan Kizim.
  Valhalla is in our stack and graph build time is the pain point for anyone running it locally.
- **OSRM is Back: Revitalizing the OSM-Native Routing Engine** — Dennis Luxen (OSRM's original
  author). Worth knowing whether OSRM is maintained again before choosing between the two.
- **Moving around with OpenStreetMap** — Julien Coupey (⚠ likely VROOM, vehicle routing).
- **When Maps Mislead: Lessons from Outdoor Navigation with OpenStreetMap** — Jakub Zmrzlik.
  Failure modes of OSM-based navigation. For a product that will route a human being down a path at
  night, the catalogue of ways this goes wrong is more valuable than another feature.
- **MOTIS** (Felix Gündling, Robin Durner) and **Transitous** (Volker Krause) — public transport
  routing. Not core, but multimodal (bike + train) is the obvious Dutch extension.

---

## 6. Exposure, senses and accessibility

These map onto [`exposure-pac-man.md`](../exposure-pac-man.md),
[`navigation-smell-steer.md`](../navigation-smell-steer.md) and
[`urban-garden-loop.md`](../urban-garden-loop.md):

| Talk | Speaker | Application |
|---|---|---|
| **MyGreenSpace: Relying on Open Data to Characterize the Health Potential of Urban Green Spaces** 🎓 | Marion Porcherie | A published methodology for scoring green space by *health potential* — a principled scoring function for the garden and exposure layers instead of a hand-tuned one. |
| **Mapping the City in the Rhythm of Colours and Sounds: OSM as a Basis for Multisensory Civic Cartography** 🎓 | Paweł Struś | Multisensory mapping — the closest published thing to the smell-steering pillar. |
| **From centroid to entrance: a global assessment of POI access locations for accessibility** 🎓 | Pierre-Leo Bourbonnais, Yannick Brosseau | Sharp and practical: exposure pellets are POI-derived, and a POI's *centroid* is not where you enter it. Riding past a building's centroid is not passing its door. This changes pellet placement. |
| **Text with a purpose — building the image of the world for blind users through structured POI data** | Pawel Masarczyk | Describing place in language from structured data — the same generation problem as the speech track ([`speech-track.md`](../speech-track.md)), with harder correctness requirements. |
| **Putting Accessibility on the Map** (session, ran twice) | — | Community state of the art. |
| **OSM for Intelligent Speed-Limit Assistance (ISA)** 🎓 | Raphael Volz | Speed limits from OSM as a driver-assist input — the data-quality bar for anything safety-adjacent. |

---

## 7. Play, participation and territory

| Talk | Speaker | Application |
|---|---|---|
| **Carto'Mission: Bringing Participatory Mapping Off-Screen Through Cooperative Play** 🇫🇷 | Coralie Le Bian | Cooperative — not competitive — mapping as a game. This is [`urban-garden-loop.md`](../urban-garden-loop.md)'s "don't complete, cooperate," field-tested. |
| **Adopt Your Town** | Giacomo Alessandroni | Territory adoption as a contribution model. Compare with territory paint and the polder/waterschap framing in [`semantic-polder.md`](../semantic-polder.md). |
| **Announcing MapRoulette 4!** | Martijn van Exel | The most successful gamified micro-tasking system in OSM. Prior art for [`map-game-platform.md`](../map-game-platform.md) — study its task model. |
| **Why do you contribute to OSM?** | Michael Montani | Motivation research; the retention question every game layer is implicitly betting on. |
| **Wonders of OSM** | CapitaineMoustache | ⚠ Unknown; the title suggests a showcase worth mining for demo-bar material. |

---

## 8. Tooling and plumbing

- **GeoDesk: The OpenStreetMap toolkit that's fast, easy and fun** — Martin. A possible replacement
  for the Overpass/pyosmium path in [`osm-enrichment.md`](../skeleton/osm-enrichment.md). Worth
  benchmarking against pyosmium for local bbox extraction.
- **Introduction to OSM Analytics with ohsome** and **ohsome 2.0 has arrived!** — Rafael Troilo,
  Michael Auer, Benjamin Herfort. Historical OSM analytics — how a place's tags *changed over time*,
  which is the raw material for a "city record" that has a past.
- **A Swiss Army knife for geographical data voxelization** — Pierre-Yves Rollo, Théo Szanto.
  Vector/graph geodata onto a lattice. Relevant if territory or smell ever wants a raster field
  rather than per-way values.
- **OSM2World: 3D models from OpenStreetMap data** — Tobias Knerr. Procedural 3D from footprints and
  tags — the cozy view's building geometry, without modelling anything by hand.
- **Making maps with Ultra** (Daniel Schep), **Cartes.app is now international**, **Terraink**,
  **UseOSM** — the uMap-adjacent product space we sit in. Competitive/analogue scan.
- **Structuring road information in open data: a nested Wikidata–OSM–BD TOPO architecture** —
  Jean-Louis Zimmermann. A worked multi-source taxonomy, which is
  [`semantic-taxonomy-pyramid.md`](../semantic-taxonomy-pyramid.md)'s problem with real authorities
  behind it.

---

## 9. Legal and political

- **Update on attribution enforcement for users of OpenStreetMap servers** — Mateusz Konieczny.
  ODbL attribution is a real compliance obligation for a shipped product, and enforcement is
  apparently active. Check the viewer's attribution before any public demo.
- **Consumed at Scale: AI-Driven Extraction and the Political Economy of OpenStreetMap** 🎓 —
  Hannah Boettcher. The commons-extraction critique. Ebike Safari's stated position — *read OSM,
  never pollute it, keep game state in our own Git* — is a good-citizen posture, and this paper is
  the frame for saying so out loud.
- **Running OpenStreetMap.org in the Age of AI** — Grant Slater. Infrastructure under scraping load;
  informs whether it is acceptable to hit public endpoints at any volume. (Short answer, predictably:
  cache locally, do not hammer Overpass.)
- **Whose Knowledge Counts? Diversity and Exclusion in OSM's Tagging Proposals Process** 🎓 — Carlos
  Cámara. Who gets to define the schema our app depends on.

---

## Follow-up queue

| # | Action | Target doc |
|---|---|---|
| 1 | Watch **OSMPID** + **Where are my ways?**, then fix the foreign-key model | [`road-graph.md`](../skeleton/road-graph.md), [`git-postgres-sync.md`](../git-postgres-sync.md) |
| 2 | Add geometry-alongside-id as interim mitigation, regardless of #1 | [`road-graph.md`](../skeleton/road-graph.md) |
| 3 | Evaluate **Panoramax** for capture *and* playback; read their consent/blur policy | new pillar — `panoramax-imagery.md` |
| 4 | Align cycling vocabulary with the **CEN standard** direction | [`osm-enrichment.md`](../skeleton/osm-enrichment.md) |
| 5 | Move pellets from POI centroid to **entrance** | [`exposure-log.md`](../skeleton/exposure-log.md) |
| 6 | Watch **Style-as-Code**; compare with `catalog.yml` → style JSON compilation | [`viewer-maplibre.md`](../skeleton/viewer-maplibre.md) |
| 7 | Evaluate **Mapterhorn** terrain for the hills | [`viewer-maplibre.md`](../skeleton/viewer-maplibre.md) |
| 8 | Benchmark **GeoDesk** vs pyosmium | [`osm-enrichment.md`](../skeleton/osm-enrichment.md) |
| 9 | Study **MapRoulette 4**'s task model | [`map-game-platform.md`](../map-game-platform.md) |
| 10 | Audit ODbL attribution before any public demo | [`../../DATA-CONTRACT.md`](../../DATA-CONTRACT.md) |

## A note on the HN thread

The [discussion](https://news.ycombinator.com/item?id=49507280) leads with xvilka's claim that
street maps are fine but public-transport software and data are neglected and worked on only by solo
developers. The programme from the same weekend partly contradicts it: **Transitous** (Volker
Krause) — which a commenter recommends downthread, apparently unaware it was on the schedule —
**MOTIS** (Felix Gündling, Robin Durner), **Client-Side Transport Maps on OpenStreetMap.org** (Andy
Allan), **One region. 40,000 bus stops.** (Sergio Luke, Florian Lainez), and a public-transport stop
analysis paper all shipped talks. The gap being described looks more like **discovery** than effort.

↑ [`README.md`](README.md) · [`../README.md`](../README.md)
