# The shops: objects as containers, and the action editor that fills them

*The cluster of storefronts around the sims1 bridge, where ordinary
game objects become containers for anything a player wants to put in
them -- and the general pie menu tree editor underneath that makes
new ones without writing code. Machine-readable spec:
[object-shops.yml](object-shops.yml).*

**The realization:** a startling number of Sims objects are already
containers with a switch. A jukebox holds tracks. A rug holds an
image. A wardrobe holds outfits. A backdrop holds a scene. Ship the
container empty and let players fill it, and one template becomes
infinite objects -- trivial, whimsical, and **intensely personal**.

## The shops

Each shop is one template plus a generator plus a storefront in the
[sims1 district](sims1-soul-bridge.md). All of them are
[TMog modules](portals-and-modules.md) and all of them obey
[the rendering policy](rendering-and-rights.md).

| Shop | The container | What you put in it |
|------|---------------|--------------------|
| **Jukebox** / [Moody Jukebox](#moody-jukebox-the-flagship-of-the-ad-editor) | Music player | Your own tracks. The most requested thing in the game's history, and it was always just a file list. |
| **WigOMatic** and the AnythingOMatic family | Accessory manager | Any accessory category: toggle on and off, reset, organize. Generalizes past wigs to whatever the shop stocks ([the appliance pattern](portals-and-modules.md)). |
| **RugOMatic picture rig** | One rug, many images | Switch between them from the pie menu. **Import a Family Album into a rug** and walk on your own story. A picture rig you can stand on. |
| **[Squawk Box](#the-squawk-box-your-voice-your-pet-your-phone)** (trainable parrot, sound board) | Recorded sounds plus dialogs | Your own microphone. Your cat. Your phone photos. The shareable one. |
| **Backdrop** | Switchable scene | Lineage: Superstar (2003) brought the film set, photo shoot set, and music video set to Studio Town. Bring the backdrop home and load your own scenes. |
| **Statue** | Posed character | [Stat-U-Matic](stat-u-matic.md), already spec'd. |
| **Tombstone** | Text and a soul | The Tombstone Generator, embodied in Death ([the reaping ceremony](sims1-soul-bridge.md)). |
| **[QR panel](#qr-codes-the-return-path-out-of-the-game)** | A code and a destination | Links out of the game **that players can actually follow**. Any object can carry them. |

The list is open by construction. Every object with a state you can
switch is a shop waiting to open: TVs, paintings, fireplaces, fish
tanks, signs, computers, radios, aquaria, lava lamps.

## The action editor: a pie menu tree you can build

Underneath every shop is one authoring surface: a **general pie menu
tree editor**. Organize any number of actions into a tree -- slices,
submenus, slides -- and populate it from a library of **action
plugins**. No SimAntics required to make a jukebox that plays your
songs.

Two kinds of action, matching how Sims objects actually behave:

1. **Player actions** -- what appears when you click the object.
   Toggle accessory, switch to picture, play track, next scene.
2. **Autonomous actions with advertisements** -- what the object
   broadcasts so Sims come use it on their own. This is the motive
   advertising system that makes the game a simulation instead of a
   toy box, and it needs its own surface: **the ad editor**. Set what
   the object advertises, to whom, how loudly, under what conditions.
   Dispatch semantics already sketched in
   [`schemas/advertisement-dispatch.yml`](../../schemas/advertisement-dispatch.yml)
   (forward, inject, and hub modes, with SimAntics advertisements as
   the acknowledged lineage).

An object without advertisements is furniture. An object with them
joins the simulation. Both are legitimate, and the editor should make
the second one no harder than the first.

## Moody Jukebox: the flagship of the ad editor

*This shop is the implementation of an existing design. Canonical
spec: [MOODY.md](https://github.com/SimHacker/moollm/blob/main/designs/MOODY.md)
("A moody jukebox for The Sims 1, in SimAntics") -- proposed to the
Maxis team as SimRadio on February 18, 1999, with the moody track as
its emotional payload. Show seed:
[Moody -- MIDI for Mood](../../repo-shows/moody-midi-for-mood/moody-midi-for-mood.yml).
What follows is the shop and its authoring tool, not a new design.*

The jukebox is the demo that teaches the whole system, because it
exercises every part of it at once. Load your own tracks, then answer
three questions about each one.

**When does it call you?** Conditions on the advertisement, written
against the motives the game already tracks:

- Play when you gotta pee (bladder low)
- Play when you are tired (energy low)
- Play when you are sad (mood down)
- ...or any combination, plus time of day, who is home, what room

The object isn't waiting to be clicked; it is **advertising to
specific moods**. Your Sim wanders over on their own because the
right song was listening for the right moment.

**What does it do to you?** Moody consequences, which are just action
plugins pointed at motives: a mood boost, an energy lift, a comfort
bump, a fun spike -- or anything else in the plugin library, since a
consequence is a consequence.

**What happens while it plays?** **Moody timelines.** Schedule
effects along the track: the chorus hits and the mood jumps, the
bridge drops and the Sim slows down. In MOODY terms these are
`(time, tag, heat)` envelopes -- the mood swing literally is an
envelope -- and the conditions above are the same parameter bus read
from the other end.

Synchronization by **dead reckoning audio time, assuming normal play
speed**, exactly as you framed it: MOODY calls this *hot dogging it*,
open loop, and works through why it is respectable navigation anyway
(t=0 is anchored to the tick that issued the play call; ticks convert
to seconds by calibration; resync is free at every track boundary
because the jukebox controls when songs start; and emotional weather
is forgiving in a way lip-sync is not, so quantizing envelopes to
coarse sections means dead reckoning never misses by a section).

One correction to something I said earlier: **game speed is invisible
from inside SimAntics** -- ticks are the only clock, so all speeds
feel identical from within, and the object cannot notice a speed
change. That is what makes the drift structural rather than
detectable in-object. The web side has full save access and can
calibrate, and the reimplementations (FreeSO, Simitone) can grow a
real audio-position primitive and close the loop properly.

Then the shop tool: an **advanced moody timeline and audio editor**
-- waveform, markers, and the condition/consequence editors side by
side, so scoring your own game is a visual task instead of a
programming one. This is the companion authoring tool MOODY.md
describes in the Transmogrifier lineage: pick tracks, author their
envelopes, and the tool bakes them into the generated object's
behavior data.

### The blue note

The fun moody action, and it is already canon. MOODY.md's degenerate
case: the legendary **brown note** is, in this schema, just a tag
whose constraint binds not to a mood but to the **bladder motive at
max gain** -- media driving physiology, skipping the heart entirely.
The Sims localizes it as **the blue note**, because Sims pee blue
puddles: the game collapses all bodily catastrophe into one
blue-puddled bladder motive, so the note comes out the color of the
puddle. It is also the bent, flatted tone that makes the blues the
blues, which is exactly the register of a Sim standing in a puddle
with both hands on their head.

MythBusters busted the note in the real world. In a microworld it
works every time, which is why the **prank subwoofer** with a
BLUE-NOTE parameter track is a legitimate plug-in object -- and why
**the diaper is a buff that disables exactly one binding.**

The point under the joke is the reason the ad editor is general:
**the moody track is a parameter bus, not a mood system.** Mood was
just the first thing worth broadcasting on it. Any plugin that can
write a motive can be scheduled on a timeline and advertised on a
condition, which is why "play when you gotta pee" and "make you need
to pee" are the same machinery pointed in opposite directions.

This is also the clearest argument for the ad editor existing at all.
A jukebox that plays your songs is nice. A jukebox that knows your
Sim is miserable at 3am and plays the right song, unprompted, is the
game writing a scene with you.

## The Squawk Box: your voice, your pet, your phone

**Why stop at files you downloaded?** Record your own microphone.
Then it is not a jukebox at all -- it is a **trainable parrot**, a
**squawk box**, a **sound board**. Say a thing, name the action
whatever you want, and hang consequences off it. The delight is
immediate and slightly stupid, which is the correct register:
inventing silly action names attached to your own sounds, and having
them **affect the simulation**.

Everything from the jukebox carries over unchanged, because it was
never really about music: conditions on the advertisement,
consequences as plugins, timelines. And every action can open a
dialog -- title, picture, text, buttons, branching -- which is rung 3
of the ladder, so a sound board is one edit away from being
interactive fiction that talks in your voice.

The material is whatever a phone can capture. Your voice. Your cat
meowing. Your dog farting. Your kid's laugh. A photo from your
pocket.

Embodiment note: a trainable parrot wants to be a character rather
than an appliance, following the Death precedent
([tools as characters](sims1-soul-bridge.md)). Whether the game
already ships a bird to embody is a question for the official-object
catalog scan ([GUID registry](guid-registry.md)) -- and if it does
not, the parrot is just an object we make.

### Rights-clean by construction: the viral content class

Here is why this matters more than the jukebox, and it is a rights
argument, not an aesthetic one.

**Music is encumbered.** Locally, that is fine and it is exactly the
point of local-first: make an object with any track you love, on your
own machine, and nobody is distributing anything
([the membership model](membership-model.md),
[EA policy fit](membership-model.md)). But **shared** music is
somebody else's copyright, which makes it the one content class that
cannot go viral safely.

**Your voice, your pet, and your phone photos are yours.** No
license, no clearance, no takedown, no gray area -- shareable *by
construction*. Which means the content class that can be freely
published is also, conveniently, the more personal and funnier one. A
soundboard of your own voice beats a licensed track on every axis
that matters here.

So the viral artifact is: **a template, plus your own recordings and
photos, plus visually programmed behavior.** Every requirement lines
up:

| Requirement | How it is met |
|-------------|---------------|
| Inherently shareable | Contains only the creator's own media -- no third-party rights, no official game art |
| Playable at full fidelity in a browser | [The preview runtime](#the-preview-runtime-it-can-say-what-it-would-have-done) runs the authored layer for real; owning the game is what lets you *install* it |
| Template based | One template, infinite instances, each listed on the template's index page |
| Visually programmable | [The action editor and its ladder](#the-plugin-ladder) |
| Expressive and personal | It is literally your voice and your cat |
| Memetic | **The template is the meme format.** Instances are the memes; the template index page is the gallery. |

That last row is the whole distribution strategy in one line. A meme
format is a template that strangers fill in and pass along, and ours
are **executable** ones: fill in the blanks with your own media, get
a real object, and the object plays back in anybody's browser whether
or not they own the game. Owning the game is the upgrade, not the
ticket.

And it composes back the other way. Once the sharing-safe class
exists, the sophisticated storytelling machinery -- branching dialog,
motive consequences, moody timelines -- rides on content that is free
to travel. The jukebox stays local and personal; the squawk box goes
everywhere.

## The preview runtime: it can say what it would have done

**We own both ends** (Don, 2026-08-29). We design the templates *and*
we implement the runtime, so full-fidelity browser playback is a
design guarantee rather than an emulation problem. Nobody has to
emulate The Sims to show off a squawk box: the only thing that needs
running is **the layer the author actually wrote**.

So the object gets shown in its full glory and splendor -- with a
real pie menu, which is the whole point. Not a form describing the
pie menu, not a screenshot of one: **the object's own pie menu, live,
built from the tree you authored, doing what it does as far as it can
go.** Click a slice and the sound plays, the dialog opens, the
picture is there, the buttons branch, the state remembers. That is
the preview of what you made, and it is the same thing a stranger
experiences when they open your object's page.

### Two layers, and honesty at the seam

| Layer | In the browser |
|-------|----------------|
| **Authored** -- pie menu tree, sounds, pictures, dialogs, branching, state, timelines | **Executed, exactly.** This is our code running our data. |
| **Simulated** -- motives, routing, animation, autonomy, other Sims | **Declared, not faked.** It says what it *would have* done. |

That seam is the interesting part, and narrating it beats faking it.
"Fun +30, Comfort +10." "The Sim would walk here and use this for two
hours." "Advertises to tired Sims within eight tiles." A fake
simulation would be a lie that breaks the moment it disagrees with
the real game; a **stated consequence** is accurate by construction,
and it makes normally invisible mechanics visible while you are
authoring them. The preview is an inspector, not a diorama.

It reads the argument out loud, too, which is exactly the
[rhetoric](#what-the-language-is-for-visual-procedural-rhetoric)
layer surfacing: an advertisement is a claim about what is worth
wanting, and the preview says the claim in words while the author is
still deciding whether they meant it.

### Three things fall out of this for free

1. **One runtime, two audiences.** The author's preview and the
   stranger's playback are the same code path, so there is no
   separate web demo to build or keep in sync. Whatever previews,
   shares.
2. **A dry run is a test harness.** If the runtime can say what it
   would have done, it can also enumerate what it *could* do: walk
   every branch, list every ending, flag the slice that is
   unreachable because its condition can never be true. Authoring
   tools usually get that late or never.
3. **Real simulation stays an upgrade path, not a dependency.** The
   authored layer is data; a real VM can consume it. The open
   reimplementations ([FreeSO, Simitone](../sims-open-source-and-formats.yml))
   are where "actually simulate it in the browser" lives if and when
   anyone wants it. We do not need it to ship, and designing as if we
   might get it costs nothing today.

## The plugin ladder

Start trivial and climb. Each rung is a plugin an author picks from a
list and fills in:

1. **"Play this audio file"** [upload file]
2. **"Show this picture and text"** [upload picture] [enter text]
3. **"Say something in a popup, with this picture and these
   buttons"** -- and each button branches to another node
4. **Conditionals and state** -- remember what was chosen, gate slices
   on motives, relationships, time of day, who is clicking
5. **A friendly visual programming language** -- the branching
   dialog and behavior graph, authored visually, compiled down
   ([what it actually is](#what-the-language-is-for-visual-procedural-rhetoric))
6. **Raw SimAntics** -- Edith-class access for people who want it

Rung 3 is where it stops being decoration and becomes **interactive
fiction inside a Sims object**: a branching conversation with a
picture and buttons is a complete storytelling medium, and it is
maybe two weeks of work on top of rungs 1 and 2.

The rungs are progressive disclosure, not tiers to be sold
separately. And the ladder does not replace Edith -- **why not
both**: the visual language for everyone, the raw semantics tree for
the people who grew up reading it. Everything the friendly editor
emits should be inspectable and editable at the level below it, all
the way down.

## What advanced users build: the radio simulator

*Don, 2026-08-29. The natural top-of-ladder project, and the reason
the ladder goes that high.*

Give people conditionals, state, and a media library and somebody
builds a **radio station**: several shows, each a sequence of clips,
randomized, looping, with commercials inserted. The GTA model, which
is the model precisely because it works -- a station is not a
playlist, it is a **scheduler over pools of segments**.

| Segment pool | What it is |
|--------------|-----------|
| Music | The tracks, tagged |
| DJ links | Patter between songs |
| Station IDs and jingles | The three seconds that make it a station |
| Commercials | Fake ads, the classic delight |
| News, weather, call-ins | Whatever the author invents |

The programming is the rules over those pools: no repeat inside a
window, patter between songs, an ad break every so often, this show
in the morning and that one at night. All of it is rung 4 work
(conditionals and state) pointed at a playlist instead of a
conversation, which is why an advanced user can build it without any
new engine features.

**Radio is the easy case for dead reckoning.** A station that keeps
playing whether or not anyone is tuned in is exactly the trick
already spec'd for [moody timelines](#moody-jukebox-the-flagship-of-the-ad-editor)
-- and cheaper here, because a station needs only a start tick and a
table of segment durations to know what "should" be on the air.
Tuning in mid-song is the *feature*, and it comes free from arithmetic
rather than from an audio API the game does not have.

### SimRadio, with the network moved

This is the [1999 SimRadio proposal](../../characters/don-hopkins/simradio-moody-1999-maxis-email.md)
(February 18, 1999, to the Maxis team) with one substitution.
SimRadio needed **the game** on the network: Maxis-run
SimRadioStation servers, IP multicast, a receiver in the game. The
2026 version needs **no networked game at all**. The tools are
networked; the game reads local files. Browser-based save and object
editing is the delivery channel, and it is asynchronous by nature:
fetch, compose, bake, write. Content still arrives, nobody is ever
forced online to play, and the always-online lesson stays learned.

Most of what the 1999 email wanted servers for survives the
substitution intact: fresh programming instead of the same loops
driving players insane, plug-in objects delivered as diegetic events,
personality-filtered reactions. What genuinely does not survive is
**live simultaneity** -- the twentieth-caller contest, everyone
hearing the same broadcast in the same minute. Scheduled drops can
approximate it (the tools bake a segment with a time window, the ad
expires on schedule) but real simultaneity needs a network the game
does not have, and saying otherwise would be a lie the design would
eventually have to pay for.

### The squawk box is the station's staff

The pieces connect the moment you look at who records the patter.
**Your DJ links, your station IDs, and your fake commercials are
recordings you made** -- which puts the whole station inside the
[rights-clean class](#rights-clean-by-construction-the-viral-content-class).
Fake radio ads have been a joy of the medium since GTA III, and here
they are load-bearing rather than decorative: MOODY's pun is that **a
radio ad IS a Sims advertisement** in the full behavioral sense,
broadcast into the room, scored by everyone who hears it, acted on by
the susceptible. Author a commercial and you have authored an
argument aimed at your Sims' desires. That is not a joke about
procedural rhetoric, it is the mechanism.

### Format and catalog: why stations are shareable even when music isn't

The split that makes this work, and it is the radio industry's own
distinction. A station has a **format** (schedule, rotation rules,
patter, jingles, show structure) and a **catalog** (the records).

- **The format is yours and travels.** It is authored structure plus
  your own voice, so publishing it is clean.
- **The catalog stays home.** Encumbered music is a local-only
  pleasure, exactly as designed.

So a shared station arrives as programming with **slots**: it asks
for tracks by tag or role, and the downloader maps their own library
in. Every instance is personal; the format is the shareable artifact.
Radio formats have been syndicated that way for a century, and it
happens to be the only version of this that is rights-clean.

### Podcasts: OPML in, several shows on one dial

*Don, 2026-08-29. Export your podcast list to a Sims radio object,
several podcasts on the same radio.*

This is the case where every constraint above relaxes at once, and it
starts with a file format that already exists. **Podcast apps export
subscription lists as OPML** -- Apple Podcasts, Pocket Casts,
Overcast, AntennaPod, all of them, because sharing subscription lists
was the point of the format. So the import is not a scraping project,
it is a file open dialog.

The mapping writes itself:

| Podcast side | Radio side |
|--------------|-----------|
| OPML subscription list | The dial: one station per show |
| RSS feed | A station's schedule |
| Episode enclosures | The segments |
| Chapters (Podcasting 2.0 JSON, or ID3) | Segment boundaries inside a long episode |
| Transcripts (`podcast:transcript`) | Subtitle popups, search, and mood tagging |

Several podcasts on one radio is then just the pie menu doing what it
already does: the tree becomes the tuner.

**Podcast stations are the first genuinely shareable catalog.** The
[format/catalog split](#format-and-catalog-why-stations-are-shareable-even-when-music-isnt)
said the records stay home -- but a podcast catalog *is a list of
URLs*, and feed URLs are made to be passed around. So sharing a
podcast station means sharing an OPML file plus a schedule, and the
downloader's tool fetches the episodes itself. Nothing encumbered
ever moves between players.

That also settles where the audio comes from: **fetch it client-side
from the publisher's own feed, never through us.** Not only because
hosting somebody's show is redistribution, but because the direct
fetch is the *right* thing: the publisher gets the download, the
analytics, and the subscriber. A proxy would quietly steal all three.
This makes the feature something podcasters have reason to like
rather than tolerate.

**Freshness is the whole trick, and it is the 1999 dream.** Podcasts
update, baked audio goes stale, so the tool grows a refresh: re-fetch
the latest episodes, re-bake, write into the
[Downloads set](guid-registry.md). Open the tools on Sunday and your
Sims radio has this week's shows. That is precisely what SimRadio
wanted servers for -- fresh programming instead of the same loops
driving players insane -- delivered with **no networked game at
all**. It is also an honest recurring reason to open the tools, which
makes scheduled refresh and transcoding a plausible
[paid service](membership-model.md): the bake stays free and local,
the convenience is the product, and no content is ever sold.

**Long-form fits better than it should.** A Sims day runs roughly 24
real minutes at normal speed (calibration constant, verify against
the build), so an hour-long episode spans two and a half Sim days.
Chapters give clean segment boundaries where a show publishes them,
but the more interesting answer is to leave episodes whole and let
the station keep its virtual playhead: **dead reckoning turns
long-form into real radio**, where you tune in mid-sentence and the
show was already going without you.

Two things fall out that are better than the podcast part:

- **Talk radio in the dollhouse, finally.** MOODY's SimDJ slot has
  been empty since 1999. The world now produces an effectively
  infinite supply of free talk audio, so the slot fills itself, and
  the motive consequences are already authorable.
- **Transcripts are a mood track waiting to be compiled.** A show
  that ships a transcript can have its
  [moody envelopes](#moody-jukebox-the-flagship-of-the-ad-editor)
  generated from its own content instead of hand-authored, which is a
  legitimate AI feature rather than a decorative one. It also gives
  subtitle popups for free, which is accessibility arriving through
  the side door.

And the return path closes the loop in the most satisfying possible
place: put a [SoulGlyph](#qr-codes-the-return-path-out-of-the-game)
on the radio pointing at the current show. **Scan your Sims radio,
subscribe to the podcast on your phone.** In-game listening becomes
real-world subscription, linking is always clean, and the podcaster
gets a new listener out of somebody's dollhouse.

## The About slice: wrapping our metadata around other people's objects

*Don, 2026-08-29. When importing user-created objects into a
[Downloads scope](guid-registry.md), inject an **About** action as the
first slice, always top, where the about box belongs.*

The question every player has asked about half the objects in their
Downloads folder for twenty-five years: **what the hell is this,
where did it come from, and what can you tell me about it?** We are
building the database that answers it. This is how the answer gets
delivered: in the game, on the object, one click away.

Everything else here is about objects we generate. This is the move
that reaches **objects other people made**, which is most of the
corpus and all of the history.

### What is in the box

Straight out of the [registry](guid-registry.md), with the honest
parts marked honest:

- **Identity.** Ids, and the magic cookie that names the creator.
- **Provenance.** Which archive or site it came from, when it was
  scanned, the original download page, and **the original readme
  verbatim** when we have it, since that is frequently the only
  documentation that ever existed.
- **Requirements and conflicts.** Which expansion it needs; what it
  collided with in your set and what remap we applied.
- **A [SoulGlyph](#qr-codes-the-return-path-out-of-the-game).** Scan
  it, land on the object's registry page, read the long version,
  contribute to it.
- **Pages of illustrated help,** paginated with Next buttons, user
  contributed and curated.

That last bullet needs no new machinery, which is the pleasing part:
an About box is a **title, a picture, text, and buttons** -- rung 3 of
[the ladder](#the-plugin-ladder), the same plugin a squawk box uses
to tell a joke. The archival apparatus and the fart button are built
from the same part.

### Credit, restored retroactively

Worth saying plainly, because it is the best thing about this
feature. Enormous amounts of 2000s custom content circulated
repacked, rezipped, and stripped of its readme, so creators lost
attribution to the redistribution chain. The magic cookie usually
survived that, because it is inside the object.

So the About slice **gives credit back** to people who were never
credited by whoever passed their work along. Not a legal maneuver, an
archival one, and it is the sort of thing that makes the registry
worth trusting.

Dead sites get the same treatment. Creator URLs from 2002 mostly do
not resolve, and the [resolve-an-id](#bake-an-id-not-a-destination)
indirection means our redirector can fall back to an Internet Archive
snapshot instead of a 404. Point your phone at a fifteen-year-old
object and arrive at its creator's site as it stood when the object
was new.

### When we know nothing, the box says so and asks

The database will often have nothing, and that case matters more than
the well-documented one. An About box that says "unknown" is useless;
an About box that says **what it can infer and how to help** turns
every mystery object into an open question with a submit button:

> Creator cookie 0x4A2F, unregistered. Scanned from a 2004 archive
> mirror. Nobody has identified this yet. Do you know what it is?

**The About box is the crowdsourcing interface**, and that is the
flywheel. Every unidentified object in every player's Downloads
folder becomes a prompt, in context, at the exact moment somebody is
curious. The corpus documents itself because the object asks. No
cataloging campaign we could run would reach as many people as their
own game does.

### Reserved position, and the system slice it starts

Always first, always top, because that is where the about box lives
in every interface anyone has used since 1984. The muscle-memory
objection does not really apply here: Sims pie menus already vary
their slice count by object and state, so there is no fixed geometry
to disturb, and a reserved slot at a known angle is worth more than
angles that happen to be stable.

About is the first citizen of a **system slice** -- our slot on
somebody else's object -- and once it exists the family is obvious:
repair a conflict, remap, export a clean copy, hand it to
[Death](sims1-soul-bridge.md), report a problem.

Two rules, both inherited:

- **Never modify the original.** The injection is part of the import
  transform that builds the Downloads set; originals stay untouched
  and an unmodified copy is always exportable. Same discipline as
  [save-before-mutate](guid-registry.md).
- **Removable.** Anyone who wants their menu back can have it.

## QR codes: the return path out of the game

*Don, 2026-08-29. Named: a **SoulGlyph** is the mechanism, which
belongs to the platform because it works for any game; a **TMogCode**
is the sims1 object that displays one. First build is the dialog
surface, shipped alongside the [Squawk Box](#the-squawk-box-your-voice-your-pet-your-phone),
because that is the surface that always scans.*

**Objects that display QR codes with URLs in them.** Any number per
object, chosen by circumstance. Shown in popup dialogs, and drawn in
the world. And the twenty-five-year-old unmet need finally met:
**object creators can put a link to their own site inside their
object, and players can actually follow it.**

### Why it works, and why it needed no permission

Every other route out of the game requires the game to cooperate:
clickable links, a browser control, network access, an API nobody
shipped. This route needs none of it, because the channel is not the
game at all -- it is **the player's phone looking at the screen**.

Mechanically it is nothing: a QR code is a static bitmap, and the
generator bakes it at authoring time. No engine change, no runtime
cost, no network in the game, nothing to patch. The rendering
pipeline that already draws sprites draws this one. A 2000-era engine
gets a working hyperlink because the link travels **out of band**,
through a camera, on hardware nobody had when the game shipped.

This also fills the one real hole in the architecture. The tools are
networked, the game is not, and content flows in by
[baking into saves](#simradio-with-the-network-moved) -- but nothing
flowed *out*. Now the return path exists, and it needs no permission
from anybody.

### Three surfaces, in order of reliability

*Build order: surface 1 first and alone. The panel and the
conditional-destination shop are worth doing, and neither is worth
delaying a mechanism this cheap.*

1. **The popup dialog.** Biggest, flattest, most stable, and it stops
   the world while it is open. This is the one that always scans, so
   this is the default. (Verify what the dialog primitive accepts for
   its picture slot -- if it is limited to the object's own thumbnail,
   see 2.)
2. **The catalog thumbnail.** If the dialog picture is the object's
   icon, then **make the icon the code**. Sneaky bonus: thumbnails
   also show in buy mode, so the object advertises its own source
   from the catalog page.
3. **In-world, as a panel.** The spectacle version: a code standing
   in the room. Since object sprites are pre-rendered per rotation
   and zoom anyway, draw the code **flat and screen-aligned in all
   four rotations** rather than perspective-projected onto a surface.
   It reads as a floating panel, which is diegetically fine -- it is
   obviously a magic sign -- and flat beats skewed for scanning at
   this resolution.

### Making them actually scannable

The constraints are geometric and they are not severe:

- **Module budget.** Version 1 (21x21 modules) carries about 25
  alphanumeric characters, version 2 (25x25) about 47, version 3
  (29x29) about 77. Short URLs stay small. Numeric-only payloads are
  denser still, so a short domain plus a numeric id is the cheapest
  possible code.
- **Pixels per module.** Phones want roughly 3 screen pixels per
  module off a monitor. A version-3 code at 3 pixels plus its quiet
  zone lands near 110 pixels square -- comfortable in a dialog, fine
  in-world at the closest zoom, hopeless at the farthest. So zoom
  level is part of the design, not a bug.
- **The quiet zone is load-bearing.** Four modules of light border,
  or scanners fail. Which means occlusion at the *edges* breaks a
  code as thoroughly as occlusion in the middle: pad generously.
- **"Flashing" needs to be slow.** A phone wants about a second of
  steady frame. Cycling codes is fine; strobing them is not.
- **Test-scan it in the preview.** The
  [preview runtime](#the-preview-runtime-it-can-say-what-it-would-have-done)
  can decode its own render at each target zoom and report which ones
  scan. A dry run that catches an unscannable code before publishing
  is exactly the test-harness dividend.

### Occlusion, honestly

High z helps and will not save you: Sims 1 composites per-pixel
against a z-buffer, so a tall enough neighbor still wins. Wall
paintings sit higher than most traffic and fare better than floor
tiles. The dialog is the guaranteed-clear surface, which is why it is
the default.

And your instinct is right that this is not really a problem: **"get
out of the way, I am trying to open a QR code"** is a perfect Sims
sentence. The failure mode is a joke about the game's own rules,
which is the kind of failure mode to keep.

### Bake an id, not a destination

The URL in the code should be a **stable short id that we resolve**,
not a final destination. Baked bitmaps are forever; a code minted
today must still land somewhere sane years from now, after sites move
and shops rename. Resolve server-side and the destination stays
editable, dead links degrade into an explanation instead of a 404,
and the same code can carry per-instance identity: which template,
which instance, whose object.

That last part closes the loop with something already designed. A
scan lands on **the exact instance page in the
[template instance browser](portals-and-modules.md)** -- see it,
inspect it, install it. Every object becomes its own distribution
vector.

### What this unlocks

- **Credit that survives distribution.** The creator's link rides
  inside the object, through every repost, forever.
- **Screenshots and video carry live links.** A QR code survives
  being photographed, streamed, clipped, and re-encoded. Somebody
  else's let's-play or TikTok of your object is a **working link** to
  it. That is the viral mechanism the shareable content class was
  missing.
- **Scan a tombstone, meet the soul.** The
  [reaping ceremony](sims1-soul-bridge.md) gets a physical gesture:
  point your phone at a grave, arrive at the soul's page and the exit
  tally.
- **Conditional codes.** Different circumstances, different
  destinations, chosen by the same conditions the
  [ad editor](#moody-jukebox-the-flagship-of-the-ad-editor) already
  evaluates. A sign that links somewhere else at night.

### Bright lines, stated once

Two, both consistent with policy already written down:

- **No transaction destinations in shared objects.** EA's mods policy
  forbids monetary-transaction features in mods
  ([the analysis](membership-model.md)). A code that opens a checkout
  is exactly the clean violation we refuse to hand anybody. Links to
  a creator's site: fine. Links to a cart: never.
- **Opaque links get inspected.** A QR code is unreadable to humans
  by design, which makes it a phishing surface. So: the generator
  always displays the decoded URL, published codes resolve through
  our redirector, destinations are visible on the object's page
  before anyone scans, and the redirector can revoke. This is normal
  hygiene for hosting links, and worth building in from the start
  rather than after the first incident.

## What the language is for: visual procedural rhetoric

**Naming it properly (Don, 2026-08-29): this is a Visual Procedural
Rhetoric Programming Language.**

Not just a VPL. A VPL is a language you draw instead of type -- that
describes rung 5's *notation*, not its *purpose*. The purpose is the
thing Ian Bogost named:
[procedural rhetoric](../../characters/ian-bogost/sources/procedural-rhetoric-quote.md),
"an unholy blend of Will Wright and Aristotle" -- argument made
through processes and rule authorship rather than through words or
pictures.

The loop closes on itself, which is the pleasing part. SimAntics was
already a visual language, and Edith was already its editor; Wright's
half of Bogost's blend was this simulation. What was missing was
**authors**. Procedural rhetoric has had twenty years of critics and
very few practitioners, because making an argument in rules has
required being a programmer. Aristotle taught rhetoric as a citizen
skill, on the theory that persuasion is too important to leave to
professionals. Rung 5 is that theory applied to procedures: hand the
rule-authoring to everybody, in a notation you can draw.

### The advertisement is the argument

The mapping is not decorative, it is structural, and the load-bearing
piece is the advertisement.

A Sims advertisement literally is an advertising claim: *this object
will satisfy this need, by this much, from this far away.* Authoring
one is making a claim about **what is worth wanting** -- and the Sim
completes the argument by choosing to walk over. That is an
enthymeme: the author supplies the premise, the audience supplies the
conclusion by acting on it. The game's entire economy of desire runs
on it.

So the classical parts land where you would want them:

| Aristotle | Here |
|-----------|------|
| Logos | The rule structure -- conditions, state, branching |
| Pathos | Motive consequences -- what it does to how they feel |
| Ethos | Whose object it is: credit, soul voice, the creator's name on the template |
| Enthymeme | The advertisement -- a premise the Sim finishes by acting |

Which means **the ad editor is the rhetoric editor**, and the reaping
ceremony was already using the language before we named it: a
tombstone that speaks the character's last words is an argument
authored in rules, delivered by a process, and counted on a tote
board.

### Three consequences worth accepting on purpose

1. **A rhetoric library is an editorial responsibility.** If
   templates carry arguments, then which templates ship is an
   editorial decision wearing a technical costume. Own that
   explicitly rather than discovering it later.
2. **It has to be able to make arguments we dislike.** The classic
   failure of persuasive-game tooling is the single-issue toy: a
   machine that can only produce its author's opinion. The defense is
   already in the design -- the primitives are motives, media, and
   consequences, never slogans. The author supplies the argument. If
   ours can only make our argument, it is not a language, it is a
   pamphlet with a GUI.
3. **Rhetoric needs a venue, so browser playback is constitutive,
   not merely convenient.** An argument nobody can hear is not
   rhetoric. That is why the sharing-safe content class and
   full-fidelity browser playback are load-bearing parts of the
   language rather than distribution details.

Open naming question, flagged rather than answered: the phrase is
what the thing *is*, but "VPRL" is not a name you put on a shop door.
The UI names stay plain (action editor, ad editor, timeline editor);
whether the language itself ever gets a proper name is a branding
decision, not a technical one, and it can wait.

## Why this matters more than it looks

These are not important objects. A rug that cycles your vacation
photos is not important. But it is **yours**, it took five minutes,
and it makes a house feel like somebody lives there. The Sims was
always a medium for personal expression pretending to be a game about
furniture; giving players containers to fill is the shortest path
from "I downloaded some stuff" to "I made this, look."

And every generated object gets its template index page, so the
jukebox template's page lists every jukebox anyone published -- a
browsable, installable catalog of other people's taste
([template instance browser](portals-and-modules.md)).

## Related

- [Portals and modules -- TMog, the tools umbrella](portals-and-modules.md)
- [The sims1 Soul Bridge and its district](sims1-soul-bridge.md)
- [Stat-U-Matic](stat-u-matic.md) · [Rendering and rights](rendering-and-rights.md)
- [GUID registry](guid-registry.md) -- every generated object needs a clean id
- [`schemas/advertisement-dispatch.yml`](../../schemas/advertisement-dispatch.yml) -- advertisement dispatch semantics
