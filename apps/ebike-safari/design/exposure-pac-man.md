# Exposure Pac-Man — addresses as flavored dots

Abstraction: **the road moves past addresses**, not "where am I on the map?"

Question: *What have I exposed myself to?*

## Both sides of the street

Keep left and right exposure separate:

```
left:  🏠🏠🏠🏠🏠🏠🏠🏠
       =====================  🚲 →
right: 🌳🌳🌳🌳🌳🌳
```

Log frontage, not just points — traversing a graph edge visits everything facing that edge.

## Pellet types (from OSM)

Procedural from `building=*`, `amenity=*`, `shop=*`, `leisure=*`, `landuse=*`, `natural=*`:

| Pellet | OSM hint |
|--------|----------|
| residence | building=house / apartments |
| cafe | amenity=cafe |
| library | amenity=library |
| park | leisure=park |
| grocery | shop=supermarket |
| hospital | amenity=hospital |
| playground | leisure=playground |
| charging | amenity=charging_station |

## Ride summary (not distance vanity)

Instead of "5.2 km":

```
Passed: 83 homes, 2 schools, 14 cafes, 1 bakery, 3 playgrounds,
        87 trees, 5 bus stops, 2 bridges
```

Exposure metrics:

- residential exposure (address count)
- park exposure (meters of park frontage)
- commercial frontage (meters)

## Time-of-day rhythm

Same POIs, different meaning:

- 5 schools at 15:00 ≠ 5 schools at midnight
- bakery at 07:00 ≠ bakery at 23:00

## Semantic edge log (sketch)

```json
{
  "edge": 21834,
  "left": { "houses": 18, "shops": 2, "trees": 7 },
  "right": { "park": true, "pond": true, "playground": 1 },
  "speed_kmh": 21,
  "duration_s": 48
}
```

LLM summary: *"Quiet residential bordering a large park, then into commercial frontage."*

## Novel exposure scoring

Score discovery of **new place types**, not kilometers:

- 12 new houses, 3 new cafes, first windmill, 47 m of canal, first vineyard

Exploration = sampling the ecology of places.

## Smells on the road (pull ads)

Frontage pellets are **passive exposure** — what you rode past. Territory **smell layers**
([`peerboard-and-brews.md`](peerboard-and-brews.md)) are **pull ads**: YAML creatives
(menus, stands, peer brews) distributed on the **road graph** as strength fields. You widen
or pinch nostrils, follow the gradient, arrive at source — conversion is decode the payload.
Same city, two channels: sides of the street vs edges between.

↑ [README.md](README.md) · [geometry-as-language.md](geometry-as-language.md)
