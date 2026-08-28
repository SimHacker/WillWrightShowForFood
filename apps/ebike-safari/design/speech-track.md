# Speech track: the ride hears you

Record a **speech-to-text track along with the ride**. All speech is
remembered; some is interpreted immediately; everything lands timestamped on
the same temporal ride track as GPS, scrobbles, photos, and gestures.
Feature spec landed in the August 2026 design jam
([`sources/ben-cerveny-city-record-jam.md`](sources/ben-cerveny-city-record-jam.md)).

## Two tiers of utterance

**Commands — interpreted immediately.** Addressed speech gets acted on now:

- *"Hey ebike, remember here."* — drop a marker at current time+place.
- *"Hey ebike, what's this?"* — query the enrichment layers (OSM tags,
  smell, grooves, story scenes) at the needle position and answer aloud.

**Impressions — laid down, interpreted later.** Unaddressed keywords and
exclamations become timestamped annotations on the ride track:

> gezellig! · fancy · dirty · scary · peaceful · safe · muddy · busy

Open vocabulary, Dutch welcome — these are heat tags with a place and a
moment, the moody schema `(time, place, tag, heat)` spoken instead of
gestured. Emphasis and repetition are heat. Impressions feed the same
semantic layers everything else feeds: a street that accumulates "scary" at
night and "peaceful" at noon has learned something no OSM tag knows.

## Everything remembered, interpretation marked up

The raw transcript is never discarded. Interpretation is **markup over the
transcript**, not a replacement of it:

- Every utterance span keeps its raw text, timestamp, and place.
- Interpreted spans are marked *as having been interpreted*, with the
  results attached — including failures: what the parser thought you said,
  what it tried, what happened, how it recovered or asked.
- Uninterpreted speech stays queryable — tonight's batch pass, next month's
  better model, or you scrubbing the tape can interpret it retroactively.

Error handling and mitigation are recorded as first-class results, which
makes the speech track **great Drescher schema engine food** (Gary Drescher,
*Made-Up Minds*): context, action, and result triples — including the misfires
— are exactly what a schema learner eats. The bike learns what "remember
here" reliably means in your mouth, on cobblestones, in wind.

## Data plane mapping

```yaml
# rides/{id}/speech.json (sketch)
- t: "2026-08-17T11:42:03+02:00"
  pos: { lat: 52.36, lon: 4.88 }        # interpolated from ride track
  raw: "hey ebike remember here"
  tier: command
  interpreted:
    intent: remember
    result: { marker: "mark/0042", ok: true }
- t: "2026-08-17T11:44:51+02:00"
  pos: { lat: 52.36, lon: 4.87 }
  raw: "gezellig!"
  tier: impression
  tags: [gezellig]
  heat: 0.8                              # exclamation mark is heat
- t: "2026-08-17T11:46:10+02:00"
  raw: "hey ebike what's uh"
  tier: command
  interpreted:
    intent: query
    result: { ok: false, error: trailing_ellipsis, mitigation: asked_followup }
```

- Builds directly on the existing **MAP_TRANSCRIPT** pipeline phase
  ([`../scripts/map_transcript.py`](../scripts/map_transcript.py)) — Whisper
  words clustered on the route. The speech track adds the command/impression
  split and the interpretation markup.
- Voice is **another gesture channel**: the gesture engine emits
  `speech_command` and `speech_impression` events onto the same ride event
  bus every tenant reads ([`map-game-platform.md`](map-game-platform.md)).
- No screen interaction while riding — the annotation *is* the riding,
  now also the talking.

## Tie-in

| Doc | Role |
|-----|------|
| [`city-record.md`](city-record.md) | impressions tag grooves; "what's this?" queries them |
| [`skeleton/gesture-engine.md`](skeleton/gesture-engine.md) | voice as event source |
| [`skeleton/story-layer.md`](skeleton/story-layer.md) | narration reads impressions, never invents geometry |
| [`semantic-taxonomy-pyramid.md`](semantic-taxonomy-pyramid.md) | coalescing open-vocabulary impressions |
| [MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md) | spoken impressions in the place+time sync track |
| [`speech-plumbing.md`](speech-plumbing.md) | audio-stack reality: echo suppression rules, routing rigs, the `/lab` instrument |

↑ [`README.md`](README.md) · [`VISION.md`](VISION.md)
