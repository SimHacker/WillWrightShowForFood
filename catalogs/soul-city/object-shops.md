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
| Playable at full fidelity in a browser | Voice, photo, dialog, and buttons need no game install to experience; owning the game is what lets you *install* it |
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
