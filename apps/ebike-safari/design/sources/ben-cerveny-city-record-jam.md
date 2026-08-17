# Ben Cerveny jam — city record + speech track (Aug 2026)

Messenger design jam, August 17, 2026, Don Hopkins ↔ Ben Cerveny. Pitched the
city record ("eBike Safari meets scrobbling: every street is a groove") and got
back geometry, lineage, and credentials. Harvested into
`[../city-record.md](../city-record.md)` and `[../speech-track.md](../speech-track.md)`.

## What Ben said

- **"nice concept, especially in semi-circular amsterdam"** — the canal ring
as a stack of concentric locked grooves around the Centraal spindle. The
city's geometry already looks like a record.
- **Knows Paul Lamere "from back in the day"** — the Infinite Jukebox credit
landed with someone who didn't need the footnote.
- **Dennis Crowley was his student at NYU**, and **"i was on the board of
foursquare!"** — the "Foursquare for linear roads" framing was pitched,
by accident, at a Foursquare board member. Lineage doc:
`[foursquare-lineage.md](foursquare-lineage.md)`.



## What Don pitched

- **Scrobbling into the map** — "as if the city had record grooves flowing
down each street"; "you can pick up a song and carry it along with you on
your own way."
- **Vondelpark example** — ride the park paths scrobbling ambient park music
that other people can listen to and pick up into their own
currently-playing streams and playlists.
- **Foursquare for linear roads** — check-ins on edges of the map graph
instead of points. "But points too. ;)"
- **The story data model, recapped** (Urban Safari / Bar Karma / StoryMaker):
places and roads are one layer; scenes attach to places or along roads, any
number per place; scenes are collected into scrabble-letter-holder-like
sequences, shuffled and edited into a story segment; **sharing** a segment
is what actually links it into the story graph, creating back/forth links
between scenes — **Steve Strassman calls that a butterfly tree**. Until you
link it in, you're just assembling; once linked, anyone can walk into and
through it and branch their own incoming and outgoing paths from any scene.
- **Rides have a time track** — so videos, audio, photos, and anything else
with a timestamp align along them.
- Much of this shipped once already:
[Stupid Fun Club StoryMaker demo](https://www.youtube.com/watch?v=_2yEHs_WLzQ)
(Urban Safari era). "This is just a refinement and elaboration of what
worked well." Amber archive: `[../../LEGACY-URBAN-SAFARI.md](../../LEGACY-URBAN-SAFARI.md)`.



## The speech track spec (verbatim)

> ebike safari feature i should implement soon: record a speech to text track
> along with the ride. respond to certain commands immediately, but also lay
> down keywords or impressions, gezellig! fancy, dirty, scary, peaceful, safe,
> muddy, busy, (timestamped too of course since they are attached to a
> temporal ride track). so all speech is remembered, some is interpreted
> immediately and marked up as having been interpreted (hey ebike, remember
> here. hey ebike, what's this?) and the results of interpreting that command
> (including error handling and mitigation, great drescher schema engine food).

Distilled into `[../speech-track.md](../speech-track.md)`.

↑ `[README.md](README.md)` · `[../CAULDRON.yml](../CAULDRON.yml)`