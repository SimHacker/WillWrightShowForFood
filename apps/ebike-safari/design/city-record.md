# The city record: every street is a groove

**Music for Streets** — the map as a branching, overlapping playback record.
Every ride lays down a music sync track: what was playing, where, when, by whom.
Streets accumulate **parallel grooves** from many rides, side by side in the
asphalt, and **your bike is the record needle**.

Canonical concept doc:
[MOODY.md — "The city record"](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md)
(moollm designs). This pillar is the ebike-safari implementation view: how
grooves, scrobbles, and the radio dial land on the shared data plane.

## Needle mechanics

- **Drift laterally** between grooves anywhere — crossfade between what
  different riders heard on this street.
- **Turn to follow a groove** and keep listening; an intersection is a branch
  point in a song graph.
- **Circle a roundabout** — a locked groove, looping the bar until you exit.
  (Same municipal gesture guides the gesture engine already uses for ENCIRCLE.)
- **Take the music with you**, honey-bee style: pull the song you're hearing
  into your own currently-playing stream so it continues when you branch off —
  carving a new groove that carries the taken song forward.
- **Follow someone's ride path** to hear the next thing they listened to:
  music discovery as wayfinding, a route as a mixtape, the best DJ in town
  possibly being someone's commute.

## Magnetic playback: the needle has inertia

Groove maps are full of irregularities and discontinuities. Stop at a light
and the recorded track has one location with a stack of different timestamps;
GPS jitters; riders move at different speeds. So playback **cannot** be a 1:1
mapping from your current time:place onto the original ride's time:place —
that would warp tempo, stutter at every stoplight, and jump on every jitter.

Instead song tracks are **magnetic and inertial**. Switching into a song
(beat matching and crossfading are version 2.0) starts a play head with its
**own smooth temporal velocity** in that song, not directly driven by the
underlying gps:time samples of the groove being followed. As long as you stay
near the same ride with the same song playing, you keep your own time in the
song. The groove attracts — it decides *which* song you're in — but it never
drags the play head. No speed changes, no jumping around. **It's for
listening and enjoying, not being anal retentive.**

Jump-in semantics follow from the same decoupling: when you drop into a
groove you can start **where it was playing at this location**, or **from the
top** — walkers and riders move at different speeds, and plenty of people
want to hear songs whole. Position picks the song; the listener owns the
clock.

## Roundabout dynamics: where the Infinite Jukebox comes in

A roundabout is a locked groove, but literal position-sync would loop a
fixed few seconds mechanically. Roundabouts deserve **delightful dynamics**,
and this is exactly where Paul Lamere's Infinite Jukebox engine plugs in:
beat-level self-similarity analysis finds the points where the song can loop
and branch seamlessly, so circling holds you *inside* the song — orbiting
its self-similar beats, never ending, never stuttering — and exiting on a
tangent is a branch out of the loop. The municipal traffic circle becomes an
Infinite Jukebox instance with a curb.

One consequence for the stack: Spotify has since retired the public
Echo-Nest-derived audio-analysis API (the shutdown that broke the Eternal
Jukebox), so the city record carries its **own open beat analysis** —
librosa / Essentia / aubio class tooling — as a pipeline phase, storing
per-track beat and self-similarity data alongside the groove.

## Turns switch, stops scan

Rides are **tagged by music type**, so grooves are filterable by genre: ride
the Vondelpark paths listening to techno, or handbag house, that you and
other people laid down.

**A non-forward turn is a switch event.** Turning onto a new path is the
natural moment to change songs — in the simplest rule, *turn means switch*:
pick a song from the grooves on the new path that's different from the
current one and that you haven't heard recently. Keep going straight and
your song keeps its inertia.

**Stopping means scanning.** Stand still and the player opens a scan — a pie
menu, or in AR the perfect pie menu use case: **point your body in real
compass directions** and see what's going down each path, music flowing both
coming and going. Query every groove within a radius and render each song as
a bearing pointing toward its highest density. **You ARE the radio dial** —
literally rotating yourself to tune. It's radar for music: stand at an
intersection of Vondelpark paths, turn around slowly, and see which music
there is to follow along each spoke. (Pie menu lineage: the steering
voystick, [`CAULDRON.yml`](CAULDRON.yml) `steering-voystick` entry.)

### Brake levers are the flippers

The pinball flipper is a *stop and look*. Squeeze the brakes and you have
declared interest — situational awareness at this point on the graph. That
is a universal gesture: the world focuses. Cards, prior activity, OSM,
smells, grooves, and a pie of what's here come up. Keep riding and it all
**melts away** — sleek, un-obnoxious.

Lead, follow, or get out of the way. The pie menu credo. The UI does not
chase you down the block.

A wait snapped to a light, signal, or sign is a different stop: **patience**
([`patience.md`](patience.md)) — civic mint, not a look. Same brakes. It
feeds transgression; transgression feeds it back.

## Nodes or arcs? Both — the MediaGraph question

MediaGraph and the later musical projects at Stupid Fun Club kept hitting
the same modeling question: what does the arc between song nodes represent —
incoming or outgoing, playing this song or the next one? Are songs **nodes**
(rooms, cities, points of interest) or are the **arcs** songs?

The city record answers: **both, natively.** A song can live *along a path*
(an arc: listening while moving, the groove) or *at a place* (a node: a full
or partial listen in one spot — a bench, a café terrace, a fountain). The
substrate is everything OSM provides: nodes (points of interest), **ways**
(OSM's abstraction for street segments), addresses along ways, areas and
land-surface types, and all the other artifacts. Any of them can carry
music; the play head's inertia is what makes the two representations
compose instead of fighting.

## Scrobbling — the word, credited, extended

**Scrobbling** is automatically logging each track you listen to, as you
listen, building a public listening history. The word comes from
**Audioscrobbler**, Richard "RJ" Jones's 2002 University of Southampton
project, which merged into **Last.fm** in 2005 and made the verb a household
word among music nerds. We use the word deliberately and gratefully.

Ebike safari extends the scrobble with **place**: riding scrobbles a playlist
*into the map*. Each scrobble is `(time, place, track, span)` on the ride's
time track. Two differences from the Last.fm original:

1. **Partial listens are first-class.** A scrobble is an editable section —
   expand it to the full song later, remove it, change the sample window.
   The groove keeps what you actually heard, not a binary played/didn't.
2. **Scrobbles are spatial writes.** They land in the shared data plane as
   groove segments other riders can drift into, follow, take, or tune in.

## The radio dial

At any point on the map there's a **radio dial**. Turn it to tune across
stations ordered by locality: first the grooves of rides intersecting your
current position, then other rides in the neighborhood, then the wider area —
signal strength as literal distance. The dial is how songs travel: tune in a
ride from three neighborhoods over, keep riding, and you lay down a new
synchronized trail carrying that music into this part of the map. Songs hop
around the city one commute at a time — radio propagation where the
transmitter is a bicycle.

## Prior art, credited

- **Paul Lamere — The Infinite Jukebox**
  ([Boston Music Hack Day 2012, at MIT](https://musicmachinery.com/2012/11/12/the-infinite-jukebox/)):
  decompose a song into beats via Echo Nest analysis, graph the
  similar-sounding beats, branch playback through the graph forever. Top of
  Reddit and Hacker News, Wired, an Information is Beautiful award, and
  ~100M TikTok views later, it lives on as **Izzy Dahanela's Eternal
  Jukebox** (eternalbox.dev), which matched the analysis to YouTube audio
  after the original upload servers were shut down —
  [Paul's ten-year retrospective](https://musicmachinery.substack.com/p/the-infinite-jukebox-10-years-later).
  Spotify's later retirement of the analysis API broke even that, which is
  why the city record does its own beat analysis.
  The city record is the Infinite Jukebox at 1:1 scale: beats become blocks,
  branches become intersections, the song graph drawn in asphalt — and its
  loop engine is the roundabout engine.
  Paul is on the Moody show bench — see
  [`characters/paul-lamere/`](../../../characters/paul-lamere/).
- **The Echo Nest** (Tristan Jehan and Brian Whitman, MIT Media Lab spinoff,
  acquired by Spotify 2014): machine listening — tempo, energy, danceability,
  valence — the per-track analysis a groove can carry as metadata.
- **Audioscrobbler / Last.fm** (Richard Jones, 2002): the scrobble itself.
- **Foursquare / Dodgeball** (Dennis Crowley): check-ins are points; ebike
  safari is **Foursquare for linear roads in map graphs** — edges first,
  points too. Lineage in
  [`sources/foursquare-lineage.md`](sources/foursquare-lineage.md).
- **Brian Eno**: the catalogue entry writes itself — *Music for Streets*, the
  sequel *Music for Airports* always implied. Ambient (rewards every level of
  attention) and generative (no two rides play the same city).
- Kin: Janet Cardiff's audio walks, Bluebrain's location-aware albums, the
  Situationists' dérive finally issued with a soundtrack.

Ben Cerveny, in the design jam that sharpened this pillar: *"nice concept,
especially in semi-circular Amsterdam"* — the canal ring is a stack of locked
grooves around the Centraal spindle. Digest:
[`sources/ben-cerveny-city-record-jam.md`](sources/ben-cerveny-city-record-jam.md).

## Data plane mapping

Grooves are a tenant on the shared data plane
([`map-game-platform.md`](map-game-platform.md)) — no private shadow graph.

```yaml
# design/games/city-record.contract.yml (sketch)
id: game/city-record
reads:
  - road_graph
  - rides/*/events.json
  - grooves/edges/*          # groove segments by way/id
  - grooves/nodes/*          # place listens: POIs, addresses, areas
  - tracks/*/analysis.json   # own beat + self-similarity analysis
writes:
  - grooves/edges/*          # scrobble spans: (ride, track, t0, t1, way/id, tags)
  - grooves/nodes/*          # full/partial listens at a place
  - rides/{id}/scrobbles.json  # editable partial listens, per ride
emits_events: [scrobble, take_song, dial_tune, groove_follow,
               turn_switch, stop_scan, jump_in, roundabout_loop]
```

- **`grooves/edges/`** joins on `way/id` like every other layer — smell,
  territory, and grooves are siblings; a street can carry pee, tomatoes,
  and Bowie.
- **Scrobble edits** (expand/trim/remove) are ordinary Git-visible mutations
  of your own ride file; the groove index rebuilds from ride files.
- **Radio dial** is a read-only locality query over `grooves/edges/` —
  intersecting rides, then neighborhood, then area. The AR body-compass scan
  is the same query rendered as bearings instead of a dial.
- **The play head is player state, not shared data.** Grooves store what was
  heard where; your inertial clock lives in the client. Decoupling time from
  place in the data model is what makes magnetic playback free.
- **Demo mode needs no bike**: drag the marker or click-to-route in the
  browser viewer and the needle logic is identical; demo tapes and street
  tapes are interchangeable.

## Tie-in

| Doc | Role |
|-----|------|
| [`map-game-platform.md`](map-game-platform.md) | grooves as tenant contract |
| [`speech-track.md`](speech-track.md) | spoken impressions tag the same time track scrobbles live on |
| [`skeleton/story-layer.md`](skeleton/story-layer.md) | grooves + scenes on the same ride timeline |
| [`navigation-smell-steer.md`](navigation-smell-steer.md) | MediaGraph lineage; pie-menu steering |
| [`sources/foursquare-lineage.md`](sources/foursquare-lineage.md) | points vs edges lifelogging |
| [`sources/ben-cerveny-city-record-jam.md`](sources/ben-cerveny-city-record-jam.md) | design jam digest |
| [MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md) | canonical concept: moody media, the zig-zag, the city record |

↑ [`README.md`](README.md) · [`VISION.md`](VISION.md)
