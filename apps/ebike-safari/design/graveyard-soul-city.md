# Graveyard — two independent layers

**Two layers, never mixed:**

1. **Real memorial** — Foursquare-for-graves: precise geolocation, photos, VLM headstone read,
   **remember** / **respect** (not "like"). **No ghosts.** This is real.
2. **Soul City** — fictional interments, summon ghost, virtual plots. Game fiction only.

Tom × Keez: Die Space / memento mori → bike-as-visit, replay-as-elegy
([`characters/tom-tjon-a-loi/ideas.md`](../../../characters/tom-tjon-a-loi/ideas.md)).

---

## Layer A — Real memorial (respectful)

OSM cemetery polygon + **user-added grave pins** with survey-grade GPS (when on site).

| Verb | Effect |
|------|--------|
| **Add grave** | Photo of headstone → **VLM extract** name/dates/epitaph (human confirms) |
| **Remember** | Private or shared note attached to **that pin** |
| **Respect** | Counter / gesture — not gamified "like"; no leaderboard vanity |
| **Leave flowers** | Offering at pin or cemetery entrance |

```yaml
# story/memorial-graves/{id}.yml
id: memorial-grave/abc
cemetery_osm: relation/482910
location: { lat, lon, accuracy_m }    # on-site capture preferred
headstone:
  photo_ref: story/photos/...
  vlm_extract: { name, dates, epitaph }  # human_confirmed: true required
  confirmed_by: rider/alice
visibility: public | family_only
```

**Rules**

| Do | Don't |
|----|-------|
| Human confirm VLM before publish | Auto-publish scraped genealogy |
| Opt-in pin per grave | Imply Soul City fiction on real pin |
| Respectful copy in UI | Ghost summon, haunt mechanics on this layer |
| Separate store `story/memorial-graves/` | Merge with `story/interments/` |

Toggle: **`memorial_real`** layer in viewer — independent of **`soul_city_graves`**.

---

## Layer B — Soul City (fiction)

**Virtual plots** inside cemetery bbox — never aliased to Layer A pins.

| Verb | Effect |
|------|--------|
| **Remember** | Note to cemetery place (anonymous ok) or virtual plot |
| **Leave flowers** | Offering layer on entrance edges |
| **Summon ghost** | Only `character_ref` in `story/interments/` |

See prior interment YAML pattern; **no real names** from Layer A.

---

## OSM base

- `landuse=cemetery`, `amenity=grave_yard` — site boundary, entrance edges
- Do not bulk-import real deceased from OSM tags alone — Layer A pins are **user contributed**

## Demo

Replay ride → stop at cemetery → Layer A: add/respect real pin (photo workflow deferred in v0).
Layer B: summon Soul City character at virtual plot. Both can be off in vegan/peace presets.

↑ [`skeleton/story-layer.md`](skeleton/story-layer.md) · [`oni-map-platform.md`](oni-map-platform.md)
