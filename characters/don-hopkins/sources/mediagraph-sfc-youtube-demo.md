# MediaGraph — SFC Unity music navigation prototype (built 2010; video Jul 2015)

**Don Hopkins · Stupid Fun Club (Will Wright) · Unity3D research prototype**

| | |
|---|---|
| **Video** | [YouTube — 2KfeHNIXYUc](https://www.youtube.com/watch?v=2KfeHNIXYUc) (5:05, published Jul 10, 2015) |
| **Title** | MediaGraph Music Navigation with Pie Menus Prototype developed for Will Wright's Stupid Fun Club |
| **Medium echo** | [mediagraph-demo-a7534add63e5](https://donhopkins.medium.com/mediagraph-demo-a7534add63e5) |
| **Platform** | Unity3D (not Interval MediaFlow — that was Mac Common Lisp + QuickTime) |
| **Jam** | [crazy-idea-jam.yml#mediagraph](../../../process/crazy-idea-jam.yml#mediagraph) |

YouTube description (Don): *pie menus, an editable map of music interconnected with roads, and cellular automata. Uses one kind of nested hierarchical pie menu to build and edit another kind of geographic networked pie menu.*

Demo music on soundtrack: *Dueling Banjos* (Eric Weissberg, Steve Mandell).

---

## Timeline

The video went up in 2015, but the prototype is five years older, and MediaGraph went on to become a
product and a company. From Don's pie menu timeline and his 2012–13 correspondence:

| When | What |
|------|------|
| 1995 | DreamScape at Kaleida: bumping objects together to connect them, and flicking to navigate |
| 2008 | iLoci, Don's mind-mapping iPhone app, with the same bump-to-connect and flick-to-navigate gestures (Mobile Dev Camp talk, December 2008) |
| April 2010 | The MediaGraph prototype in Unity3D at Stupid Fun Club |
| April 2012 | The screencast `MediaGraphDemo1.mov` shared with Ben Cerveny and Tom Carden of Bloom, alongside StoryMaker |
| August 2012 | MediaGraph becomes a product effort with a small team; Don builds a Mac app for adding a music library to it |
| December 2012 | MediaGraph, LLC, a company Stupid Fun Club was involved in, takes over Don's work |
| January 2013 | Don's iOS app for MediaGraph: finds the music on an iPad or iPhone, extracts its metadata and artwork, and plays it |
| July 2015 | The demo uploaded to YouTube |

Don's own description of the prototype, from April 2012:

> This was a particularly fun project because Will wanted me to use cellular automata to decorate
> the biomes. One nice thing about it that I'm proud of was the "Fahrvergnügen" and ease of
> connecting and disconnecting places with roads by bumping them together, and the way you can
> automatically travel down the roads by gesturally flicking between them, and the way that
> seamlessly integrates with the free-form panning/zooming user interface, without creating another
> "mode". The hard part was getting it to perform efficiently (breaking the terrain up into tiles,
> and caching 2d images of tiles, so it was fast enough to animate the cellular automata and support
> smooth fluid direct manipulation of the terrain).

And on iLoci, the same year: a reformulation of pie menus "from a tree structured indirect
manipulation user interface artifact, to a flat network structured geographical virtual
environment," so that the menu editor "disappears and dissolves into an editable direct manipulation
environment, by replacing hierarchy with geography."

---

## What it is

A **zoomable map of songs** connected by **roads**. Point at a song → earcon; click → play. Songs drag anywhere; labels are editable. Each song carries a **pie menu** for **radius** (small ↔ big) and **biome** — a cellular-automata rule (Life, ice, moon surface, etc.) that paints the island under the song. Same biomes **merge**; different biomes **compete** for territory.

**Road editing:** drop one song onto another → road appears; drop again → road removed. Kiss-toggle topology without a separate link tool.

**Navigation:** left-drag pans the map. **Drag on a song** (not empty map) → **flick down the road** in the drag direction — camera fires to the next node along that edge, cursor staying underneath (Mario World cannon energy). Zoom out; flick still works. Auto-scroll camera can follow the graph or detach.

**LOD:** far away = flat low-poly snapshots (high frame rate over the whole map). Close or editing = extruded **3D terrain** per song (Don cites ~85 fps with one–four terrains live). When a terrain stops moving it bakes back to a 2D layer.

Goal stated in demo: *very fluid style* — efficient traversal + direct manipulation of the song network.

---

## Transcript beats (YouTube auto-captions, Jul 2026 harvest)

| Time | Beat |
|------|------|
| 0:00 | MediaGraph — arrange songs on a map; connect with roads |
| 0:06 | Point → earcon; click → play |
| 0:22 | Drag songs; edit/add labels |
| 0:39 | Per-song pie menu: radius small/big; biome = CA rule (Life, ice, moon surface…) |
| 1:05 | Moving song repaints CA; interesting patterns |
| 1:16 | Two songs — same biome merges; different biomes compete |
| 1:40 | Roads: drop on another → road; drop again → no road |
| 2:11 | Efficient LOD — flat polygons far; terrain when close or editing |
| 2:38 | Terrain extrudes when close; saves to 2D when motion stops |
| 2:52 | ~85 fps with 1–4 terrains; flat layers when zoomed out |
| 3:21 | Pan = left-drag on map; **drag on song = flick down road** in drag direction |
| 3:37 | Flick zooms along road to next node; cursor tracks underneath |
| 4:05 | Auto-scroll follows graph or detach |
| 4:19 | Goal: very fluid style |

---

## Pie layers (corrected lineage)

| Layer | Role |
|-------|------|
| **Per-song pies** | Configure radius + biome; live CA preview on the island |
| **Song + road graph** | User-editable network — drag nodes, kiss-toggle roads, sculpt continents |
| **Flick navigation** | Gestural travel along edges on pan/zoom canvas — predecessor to Urban Safari / eBike wedge hops |

Interval **MediaFlow** is a **parallel** hypermedia thread (Lisp + QuickTime streams) — **no pie menus**. Pie flick navigation in this lineage starts here at **MediaGraph**.

---

## Lineage forward

```
Logo Adventure → DreamScape → MediaFlow (no pies) → iLoci → MediaGraph → Urban Safari → eBike Safari
```

MediaGraph cannon-flick → Voystick warble along pie wedges outdoors ([urban-safari-steering](urban-safari-steering-voystick-pie-network.md)).

---

## Reception

YouTube comment (@bharatbanslaa2107, ~2024): *"Whats happening? What is this for? what platform/software is this? I'm intrigued."* — fair question; answer: SFC Unity UI research for Will, 2015.

---

↑ [Don sources](README.md) · [stupid-fun-club.yml](../career/stupid-fun-club.yml) · [Will playlist entry](../../will-wright/sources/don-youtube-2KfeHNIXYUc-mediagraph/README.md)
