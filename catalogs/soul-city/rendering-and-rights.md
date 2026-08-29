# Client-side rendering: what we render, what we host

*The rule that lets Soul City show the whole game without
redistributing any of it: **the client renders, the server keeps what
the player authored.** Machine-readable spec:
[rendering-and-rights.yml](rendering-and-rights.yml).*

## The short answer

Uploading **rendered images** is a screenshot. Uploading
**asset-fidelity sprite sets** is distributing the object. The line
between them is not resolution or taste, it is a technical question
with a testable answer:

> **Could a determined person rebuild a working game object from what
> we host?**

If yes, we hosted the object. If no, we hosted a picture. Compose,
flatten, and publish pictures freely. Never publish a complete,
reassemblable set of an official object's sprites, rotations, zooms,
z-buffers, and alpha channels -- that IS the art asset wearing a PNG
extension.

## Why the picture side is solid ground

Two precedents, one of them EA's own:

1. **The game shipped a publish-to-web feature.** The Sims 1's
   *Auto Generate Web Pages* exported your houses, families, and
   albums as HTML for putting on the internet -- rendered Maxis art
   included. Maxis built the pipeline whose whole purpose was
   publishing images of their own objects. Soul City's album and
   scene publishing is that feature, restored, after the Legacy
   Collection dropped the upload path
   ([the Exchange gap](../../characters/will-wright/sources/sims1-legacy-collection-exchange-gap/README.md)).
2. **Object preview images were the fansite economy for 25 years.**
   Every download site, including SimFreaks, showed rendered previews
   of what you were about to install. Don formally requested the
   tooling for it in the **2004 Transmogrifier renovation plan**:
   "Export composed picture previews and text descriptions of
   objects, for use on web pages... they could just export them as
   gifs or jpegs directly from Transmogrifier. This will save lots of
   time for people who create web sites for downloading objects."
   (A request on the record; we have no document showing Maxis
   answered it. The practice it describes ran unchallenged for two
   decades regardless.)

Add the ordinary background: screenshots and machinima of games are
normal, expected, and marketing that publishers want.

## The architecture that makes it moot

Split what lives where, and most of the question dissolves:

| Layer | Where it lives | Why |
|-------|----------------|-----|
| **Object metadata** (name, description, price, GUID, expansion, category) | Server, public, complete | Facts about a product, not art. This is what makes the catalog useful to everyone. |
| **Official object art** | Rendered on the client, from the player's own legal install | Never uploaded as a standalone asset. Materializes on machines entitled to it. |
| **User-authored compositions** (scenes, showcases, room snapshots, albums) | Server, on explicit consent | The player made it. It is a screenshot of their game. |
| **UGC object art** | Server, creator's choice | It is the creator's own work; the mods policy already allows free distribution. |

So the catalog is complete for everybody, and the pictures of Maxis
objects materialize locally for people who own the game. The
advanced dynamic house rendering, editors, and scene composition
require a real purchased install -- which is not a limitation to
apologize for. It means Soul City makes owning the game **more**
valuable rather than substituting for it, and that is a good-faith
posture worth being able to point at.

Ownership verification is already designed: Steam sign-in via OpenID,
built for the turnstile
([steam-app-strategy.md](steam-app-strategy.md)). It does double duty
here as the license-hygiene gate.

## The gray area, resolved

You named it precisely: composed scenes read as screenshots;
systematically extracted individual object renders start to read as
an asset library. Where each falls:

- **Composed room and scene showcases** -- clearly fine. This is the
  SimFreaks playset prototype's whole point: a room, a background,
  objects arranged in it, published as a picture. Same category as
  every screenshot ever posted.
- **Preview thumbnails attached to a catalog listing or a creator's
  showcase** -- fine, and the 25-year norm. Presentation renders:
  composed, flattened, one viewing angle, screenshot resolution.
- **A complete rendered extraction of every official object, at asset
  fidelity, browsable as an art library** -- don't. That is the one
  version that functions as an asset repository and substitutes for
  the install, and it fails the reconstructability test.

The practical difference is small and cheap to honor: render Maxis
object previews locally, cache them locally, and let the server hold
the metadata plus whatever the player composed on purpose.

## Media sources: where content may come from

The tools accept media from two places: **files you already have on
your machine**, and **URLs that publish files for download**. That is
the whole policy, and the rest of this section is why it is drawn
there and why it costs nothing.

### The rule

> **Is the URL a published file, or a page?**

RSS and OPML enclosures are files their publishers put up *to be
downloaded*, so fetching one gives the publisher the download, the
statistics, and the subscriber. A streaming platform's watch page is
not that, and platform terms generally prohibit retrieving media from
one by other means. So the fetcher's allowlist is sources that
publish files: podcast feeds, the Internet Archive, Free Music
Archive, ccMixter, Jamendo, Wikimedia Commons, the YouTube Audio
Library's own downloads, and public-domain material.

We do not build extraction for streaming platforms. The legal
position around such tools is unsettled at best: in Germany it is
settled against them and reaches hosting providers, not only authors
(LG Hamburg, 31 March 2023, 310 O 316/21; upheld OLG Hamburg,
21 November 2024, 5 U 54/23, holding YouTube's rolling cipher to be
an effective technological measure under section 95a UrhG). In the US
the question is contested rather than resolved: RIAA sent GitHub a
DMCA 1201 notice against youtube-dl in October 2020, EFF answered
that reading the signature JavaScript as any browser does is not
circumvention, and GitHub reinstated the repository, which is a
platform declining a takedown rather than a court ruling. None of
that is a landscape to build a product feature into.

**Local stays local, in both directions.** What anyone does with
their own machine and their own files is their business, outside our
tools, and we do not inspect it: we do not ask where a file came
from, and we do not scan or fingerprint-report anything. That is the
same guarantee as everywhere else on this page.

### Recipes, not files

The interesting consequence is that the sharing model does not need
fetching at all. **Shared artifacts carry annotation, not media.**

A moody station travels as **envelope and timing data keyed to a
track identity** -- duration plus an acoustic fingerprint -- and the
recipient's tool matches it against the copy they already have. A
shared station therefore does nothing whatsoever for somebody who
does not own the track, and never asks anyone to fetch anything.
Sharing annotation that references a work you do not ship is
thoroughly established practice: LRC lyric files, karaoke and
rhythm-game charts, MusicBrainz and AcoustID, CDDB before them. It is
also more useful than a URL recipe would be, because it works no
matter where a legitimate copy came from.

One trap worth flagging: **Creative Commons licensing on a streaming
platform is not a download permission.** The uploader's CC grant
settles the *copyright* question and leaves the platform's *terms*
untouched. Get CC material from places that offer a download button.

Not legal advice; counsel reviews this page before launch.

### Frames: quotation is the strongest posture we have

*Don, 2026-08-29: grab frames from the video and render them on a TV
set, a movie screen, or a rug -- not every frame, some chosen by the
user or picked automatically, possibly using the transcript.*

Same source rule, better rights posture, and the transcript turns it
into something more interesting than a screenshot.

**Stills are the favorable end of every factor that matters.** A
frame is a small fraction of an audiovisual work, screenshot practice
is universal, and criticism and commentary are exactly what
quotation is for. That is not a licence to host frames from other
people's films on our servers, but it is a much better place to stand
than a full song, and it points at the version worth building:

> **A frame plus its transcript line is a block quote of a video.**
> Fair-use sized, with the citation attached.

That vocabulary is already ours: a
[realm is a block quote of another game](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/characters/fictional/troll/realms)
-- procedural rhetorical excerpt, fog as the ellipsis, canon fields
as the citation, seven rooms rather than the Great Underground
Empire. A quoted frame is the same move at a smaller scale.

**So the object cites its source, and the citation is scannable.**
Put a [SoulGlyph](object-shops.md) on the rug or the TV pointing at
the original **at that timecode** (deep-linking into a video by time
is a supported, ordinary thing). Three things follow at once: the
quotation carries attribution, traffic goes *to* the source rather
than away from it, and somebody scanning a TV in a Sims house ends up
watching the actual clip. Attribution and virality turn out to be the
same gesture.

**The recipe is a cue sheet.** Shared artifacts carry
**timecodes, not pixels**: "frames at 12:31 and 47:02 of this
source." Tiny, obviously not a copy, resolves against the file the
recipient already has, and identical in spirit to the audio envelope
rule above. Frames themselves stay local unless the creator owns them
-- your own footage, your own phone video, public-domain and
CC-licensed material with a download button.

**The transcript is what makes automatic selection good.** Caption
timings are semantic anchors, so instead of sampling every N seconds
the tool can grab the frame where a memorable line lands, and put the
line in the object's popup as the caption. Practical selection stack,
cheapest first: caption boundaries for candidates, frame differencing
for scene changes, a sharpness and brightness filter to throw out
blurry and black frames, and optionally a language model reading the
transcript to pick the lines worth quoting. Every step runs on the
client against a local file.

**What it looks like in the game.** No new object is required: the
[RugOMatic picture rig](object-shops.md) already holds many images
with pie-menu switching, so a video quote rig is that with a
frame-picker in front of it, pointed at a rug, a painting, a TV, or a
projector screen. Aspect ratio needs a crop-or-letterbox choice, and
the generator has to quantize and downscale to what the game's sprite
pipeline accepts, which reads as period-correct rather than as
degradation.

And frames can advance on the
[moody timeline](object-shops.md): dead-reckon the audio position and
swap the sprite when the next cue arrives. At roughly a frame per
second with synced audio you get something between a comic and a
video, which is precisely the 2000-era slideshow aesthetic and is
charming on purpose. Real video playback is not on the table; this is
better than a stalled attempt at it.

## Rules

1. **Push rendering to the client.** Always. The server never needs
   game art to do its job.
2. **Upload only on explicit consent**, per artifact, never
   ambiently. (Paid tiers may gate features; they never widen what
   gets uploaded.)
3. **Reconstructability test** before hosting any render of official
   art: composed and flattened, yes; complete sprite/rotation/zoom/
   z-buffer sets, no.
4. **Metadata travels freely** -- facts about objects are how
   non-owners still get a complete, searchable catalog.
5. **Never host official object art as a standalone download**, at
   any fidelity, for any tier.
6. **Creators own their own art**; UGC publishing is the creator's
   call, credited.
7. **Advanced rendering requires a verified install.** Not a
   punishment -- the thing that keeps the whole design clean.
8. **Fetchers only for enclosure-style URLs** from sources that
   publish files. Everything else is a recipe that resolves against
   the user's own library: envelopes for audio, timecodes for frames.

Not legal advice; counsel should read this page before launch. But
the posture is defensible and the architecture costs us nothing,
which is the combination worth having.

## Related

- [Portals and modules](portals-and-modules.md) · [Browser ecosystem](browser-ecosystem.md)
- [Stat-U-Matic](stat-u-matic.md) -- the scene composer this governs
- [GUID registry](guid-registry.md) -- the official-object catalog as metadata
- [Membership model](membership-model.md) · [Steam app strategy](steam-app-strategy.md)
- [The 2004 renovation plan](../../characters/will-wright/sources/2004-02-05-transmogrifier-renovation-plan/README.md)
