# Stat-U-Matic: the 3D photo booth

*TMog module design (Don, 2026-08-29). Siblings:
[portals-and-modules.md](portals-and-modules.md),
[browser-ecosystem.md](browser-ecosystem.md). The name joins the
-O-Matic / -U-Matic register (Rug-O-Matic lineage; U-Matic was the
Sony videotape format, so a Stat-U-Matic is obviously the machine
that records statues).*

## What it is

A 3D photo booth for sims1 characters and pets. Pick any character or
pet, dress them in any clothes, wig, and accessories, put them in any
pose -- and generate a **statue object** you install back into the
game. Statues of your own family, on your own mantel.

- **Materials:** pick a marble. Or painted natural colors. Or
  whatever the texture plugins can dream up (bronze, jade, chrome,
  cellular-automata lava...).
- **Couples:** two characters, one statue. The wedding-cake topper,
  the anniversary piece, the rivals frozen mid-slap.
- **Output:** a real installable sims1 object -- the posed 3D render
  goes through the sprite pipeline (rotations, zoom levels, z-buffer
  and alpha channels) and comes out as catalog-ready content.

## Texture plugins: generic, shared, system-wide

The material system is not Stat-U-Matic's private code. Texture
generation and editing are **generic plugins any tool in the system
can use** to generate, edit, and apply textures:

| Plugin | What it does | Also feeds |
|--------|--------------|------------|
| Material library | Marbles, metals, woods, painted-natural | any mesh tool |
| Cellular automata generator | Living patterns, CAM-6 lineage | Rug-O-Matic walls/floors/rugs |
| AI image generation and editing | Prompt-to-texture, retouch, recolor | WigFabrik, Rug-O-Matic, everything |

One plugin registry, many consumers: the same CA rule that animates a
rug patterns a statue's robe; the same AI edit that retouches a wig
texture paints a statue's base. This is the module discipline of
[portals-and-modules.md](portals-and-modules.md) applied one level
down, inside the tools.

## The growth path: from viewer to scene editor

Stat-U-Matic is not a from-scratch app. It is the **current SimShow
replacement, kept improving**: today's codebase is the **TMog suite**
-- TypeScript, running in the browser, based on the SimObliterator
Suite (the earlier Python generation, whose character browser,
mesh/sprite library, and glTF export prove the pipeline). The seed
viewer is VitaMoo, the browser 3D character viewer with animation
playback, carried forward into the TMog suite. The path:

1. **One character** -- dress, wig, accessorize, pose (SimShow, done
   right).
2. **Statue output** -- material plugins + sprite pipeline = the
   photo booth ships.
3. **Couples, then groups** -- select and pose multiple characters.
4. **Scenes** -- pose characters into **pre-rendered z-buffered rooms
   with objects you can move around**. Not a simulation: an
   **editor**. Pie menus, sound effects, all the nice touches from
   The Sims -- implemented fresh and clean and much better.

## Provenance

- **SimShow (2000):** Don's original dress-and-pose viewer, part of
  the Transmogrifier-era toolchain TMog reclaims
  ([the tools](../../characters/don-hopkins/the-sims-transmogrifier-mod-tools.md)).
- **The SimFreaks prototype:** Don's scene-composer experiment for
  [SimFreaks](../simfreaks/README.md) was all about plastiform-playset
  style scene backgrounds -- placing object preview images into
  pre-rendered rooms. He wrote Python that extracted Sims objects
  into FLV files that Flash could dynamically load. Same idea, Flash
  era plumbing.
- **2026:** it's SO much easier now. The browser reads game files
  directly ([browser ecosystem](browser-ecosystem.md) save layer),
  the TMog suite carries the sprite and mesh pipeline SimObliterator
  proved in Python into TypeScript, and WebGL renders what Flash had
  to fake with pre-baked FLVs.

## Fit in the model

Local-first like every module: viewing, dressing, and posing your own
characters costs nothing and touches no server. The photo booth's
compute-heavy verbs -- AI texture generation and editing, the sprite
render pipeline that bakes a statue into a game object -- are natural
members of the metered online tier. The statue itself, once shared,
is free to download like all shared content.
