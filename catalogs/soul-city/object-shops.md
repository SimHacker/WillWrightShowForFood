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
| **Jukebox** | Music player | Your own tracks. The most requested thing in the game's history, and it was always just a file list. |
| **WigOMatic** and the AnythingOMatic family | Accessory manager | Any accessory category: toggle on and off, reset, organize. Generalizes past wigs to whatever the shop stocks ([the appliance pattern](portals-and-modules.md)). |
| **RugOMatic picture rig** | One rug, many images | Switch between them from the pie menu. **Import a Family Album into a rug** and walk on your own story. A picture rig you can stand on. |
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
