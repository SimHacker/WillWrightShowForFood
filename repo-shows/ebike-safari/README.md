# eBike Safari

> Voice-controlled adventure navigation through a hidden graph of story cards at real-world places — you talk, the LLM listens, the phone shows the route, the bike moves you.

| Field | Value |
|-------|-------|
| **Status** | seed |
| **Host** | Don Hopkins |
| **Participants** | Don Hopkins, Will Wright |
| **Live app** | [apps/ebike-safari](../../apps/ebike-safari/README.md) · [ebike-safari.com](https://ebike-safari.com/) |
| **Readable spec** | [**ebike-safari.md**](ebike-safari.md) ← start here for the full story |
| **Machine girder** | [`ebike-safari.yml`](ebike-safari.yml) |

---

## On this page

| Section | Jump |
|---------|------|
| [What this is](#what-this-is) | Product + show relationship |
| [How it works](#how-it-works) | Two locations, voice, hidden graph |
| [The ride game](#the-ride-game) | AI vs rider; pie menus; VoyStick |
| [Hardware stack](#hardware-stack) | Camera · phone · Bosch · Koga · Enviolo |
| [From Bar Karma to Amsterdam](#from-bar-karma-to-amsterdam) | StoryMaker lineage |
| [What's shipping now](#whats-shipping-now) | FIT pipeline, live map, gestures |
| [Video gallery](#video-gallery) | Demos 1995–2015 |
| [Read next](#read-next) | Full spec + code |

---

## What this is

**eBike Safari** is StoryMaker on wheels — geolocated scene cards, topical link layers, and adventure-style voice navigation **while riding**.

Any camera captures POV for scene cards — phone, GoPro, action cam, whatever you ride with. Your phone on the handlebar is **display only** — map, Bosch stats, turn-by-turn. A mic and open-ear audio keep the conversation going; Apple SpeechAnalyzer listens. You talk; the LLM interprets; a hidden graph of story cards at real places updates; **"set destination"** commits routing through Bosch or Apple Maps.

You never see the graph. You ride Amsterdam (or anywhere), and the world becomes an adventure parser.

It's the product **and** the Repo Show: Don rides real streets, each stop becomes a scene card — short clip, geotagged, dropped into playlists in git. The map is the story graph, ridden. The audience adds cards via git; the map grows city by city, contributor by contributor. Same participatory itch as **StoryMaker**, **Urban Safari**, and [**Bar Karma**](https://en.wikipedia.org/wiki/Bar_Karma) at Stupid Fun Club: audience-authored stories at real places — rebuilt with open maps, FIT rides, and MOOLLM instead of a dead MySQL server.

Why keep revisiting a thirty-year-old weird idea? Will answered that himself, closing the 2005 Spore GDC talk:

> A lot of the games I've worked on, I've always had obstacles — usually trying to convince other people it's a good idea, or it'd be sellable, or whatever. When I look back on this idea, the biggest obstacle I truly had was making myself believe that we could build the game. My own imagination was the biggest bottleneck. Once I truly believed that this game was buildable, it proved to be actually quite easy to con— I mean, to persuade the rest of my staff and the executives and everything that we could do it.
>
> So I'd encourage all of you: if you've got some totally weird idea that is just so far outside the box that you think there's no way that would work — go back occasionally and revisit those ideas. Because you just never know where they might lead.
>
> — Will Wright, [*The Future of Content*, GDC 2005, 1:00:57](https://youtu.be/ofA6YWVTURU?t=3657)

**Read the full product spec:** [**ebike-safari.md**](ebike-safari.md) — human-readable edition of everything in the yaml girder.

---

## How it works

Two locations, one rider:

```
Physical GPS          Virtual focus (hidden)
     │                        │
     ▼                        ▼
 Bike on map  ──LLM──►  POI → card stack → topical links
     │                        │
     └──── "Set destination" ─┘
              │
              ▼
        Bosch / Apple routing
```

**Voice examples:** *"What's near me?"* · *"Tell me about that canal"* · *"What's the story behind that bridge?"* · *"Take me to the next [Space Invader](https://www.space-invaders.com/world/amsterdam/)"* · **"Set destination"**

That Space Invader example is real — Amsterdam was invaded in 1999–2000, and the mosaics are a ready-made topical layer: [official world map](https://www.space-invaders.com/world/) · [Amsterdam wave](https://www.space-invaders.com/world/amsterdam/) · [pnote crowd-sourced map (Amsterdam view)](https://pnote.eu/projects/invaders/map/#zoom=13&lat=52.368275884615386&lng=4.891928961538462) · [about the pnote map](https://pnote.eu/projects/invaders/) · [invaders-finder](https://invaders-finder.com/en/cities/amsterdam/) · [Flickr album of all 92](https://www.flickr.com/photos/meteorry/albums/723988/) · [r/Amsterdam thread](https://www.reddit.com/r/Amsterdam/comments/p6uicf/space_invaders_amsterdam/) · [Instagram](https://www.instagram.com/p/DHVPZu5IFtt/)

**Why voice:** Pinch-zoom and list scroll while riding is unsafe. Voice syncs bike location and graph cursor. Hands stay on handlebars — the hero tee writes itself: **HANDS MUST REMAIN ON HANDLEBARS**.

**Sutton framing:** Scene cards at POIs are **options**, not one-step world-model rollout. Story legs, not every turn to the canal. [One-step trap](../../characters/don-hopkins/sources/sutton-one-step-trap.md) · [MOOLLM ONE-STEP-TRAP](https://github.com/SimHacker/moollm/blob/main/skills/simulation/ONE-STEP-TRAP.md)

Parser lineage: Logo Adventure → DreamScape → MOOLLM adventure → SpeechAnalyzer.

---

## The ride game

Continuous two-player game — **never pauses:**

| Player | Job |
|--------|-----|
| **AI** | Guesses where you're going; suggests POIs/cards on your interest layers |
| **You** | Pedal, steer, confirm, deflect, voice-skip, VoyStick warble, set destination |

Each POI is a **pie-menu hub**. Wedges are nearby cards and topical links. You navigate the network by **biking** — handlebar steering and pie wedges share the same Fitts steering law. Pedaling past places reveals detail: glance → look → examine (adventure LOD).

**VoyStick:** homomorphic vocal joystick — pitch + vowel warble hops wedges hands-free. Best gestural UI Don ever built. [Deep dive](../../characters/don-hopkins/sources/urban-safari-steering-voystick-pie-network.md) · [MOOLLM ride-game example](https://github.com/SimHacker/moollm/blob/main/skills/simulation/examples/urban-safari-ride-game.yml)

---

## Hardware stack

| Piece | Role |
|-------|------|
| **Any camera** | POV capture for scene cards — phone, GoPro, action cam; optional, not required |
| **Mic + open-ear audio** | The conversation channel — earbuds, headset, whatever's safe |
| **Any phone + mount** | Map display only (Quad Lock, Bosch, generic) |
| **Bosch eBike** | Motor, battery, speed, route to head unit |
| **[Koga](https://www.koga.com/)** | Don's Amsterdam safari fleet — Dutch daily rider |
| **[Enviolo](https://www.enviolo.com/)** | CVT — roll off from a canal stop without gear hunting |

Field-tested on real safaris around Amsterdam — not aspirational spec.

---

## From Bar Karma to Amsterdam

| Year | What |
|------|------|
| 1995 | [DreamScape @ WWDC](https://www.youtube.com/watch?v=5NytloOy7WM) — rooms kiss-to-connect; ScriptX web objects |
| 2008–11 | [Amsterdam Coffeeshops map/Layar](https://www.youtube.com/watch?v=nG90XG3STz8) → Bongo Bingo → iLoci → StoryMaker → Urban Safari — all seeded during TomTom; the trilogy recalls Don to SFC |
| 2011 | [StoryMaker demo](https://www.youtube.com/watch?v=_2yEHs_WLzQ) — branching geo stories; [Facebook album round-trip on camera](https://www.youtube.com/watch?v=_2yEHs_WLzQ&t=742) |
| 2011–14 | [MediaGraph](https://www.youtube.com/watch?v=2KfeHNIXYUc) — songs on maps connected by roads; pie flick navigation |
| 2026+ | **eBike Safari** — voice + camera + LLM + open FIT/map stack; git audience cards |

**Pivotal moment:** Will saw iLoci + Coffeeshops + Bongo Bingo; said leave EA, come back to Stupid Fun Club. [The receipt](../../characters/don-hopkins/career/stupid-fun-club.yml).

Full lineage table with links: [**ebike-safari.md § Lineage**](ebike-safari.md#lineage--one-server-idea-many-clients)

---

## What's shipping now

The 2026 codebase is [`apps/ebike-safari/`](../../apps/ebike-safari/README.md) — **new from scratch**:

- **FIT pipeline** — Bosch/Flow rides → GeoJSON + static map JSON
- **MapLibre viewer** — replay rides at [ebike-safari.com](https://ebike-safari.com/) (40+ Amsterdam safaris; home-end scrub before public launch)
- **Gesture + exposure layer** — roundabouts, flood-fill neighborhoods (de Pijp!), encircles, brew trails on the graph
- **Design cauldron** — voice-first touring companion spec slurping into code

> *The world is the controller. The bicycle is the turtle; OpenStreetMap is the microworld.*

Not gamified distance — score **novel exposure** and **recognized gestures**. See [`apps/ebike-safari/design/VISION.md`](../../apps/ebike-safari/design/VISION.md).

**MVP slice (product seed):** Amsterdam canal loop; SpeechAnalyzer zero-touch voice; Bosch read-only telemetry; voice capture → geotagged card; playlist export for Will.

---

## Video gallery

| Demo | Watch |
|------|-------|
| DreamScape @ WWDC 1995 | [▶ 5NytloOy7WM](https://www.youtube.com/watch?v=5NytloOy7WM) |
| iLoci (2008) | [▶ 03ddG3jWF98](https://www.youtube.com/watch?v=03ddG3jWF98) |
| Amsterdam Coffeeshops Layar | [▶ nG90XG3STz8](https://www.youtube.com/watch?v=nG90XG3STz8) |
| StoryMaker comprehensive | [▶ _2yEHs_WLzQ](https://www.youtube.com/watch?v=_2yEHs_WLzQ) |
| Facebook album round-trip | [▶ t=742](https://www.youtube.com/watch?v=_2yEHs_WLzQ&t=742) |
| Urban Safari Layar | [▶ Db8KGNoeKHE](https://www.youtube.com/watch?v=Db8KGNoeKHE) |
| MediaGraph SFC | [▶ 2KfeHNIXYUc](https://www.youtube.com/watch?v=2KfeHNIXYUc) |
| Will — revisit weird ideas (Spore GDC) | [▶ t=3657](https://youtu.be/ofA6YWVTURU?t=3657) |

---

## Read next

| Depth | Document |
|-------|----------|
| **Full human-readable spec** | [**ebike-safari.md**](ebike-safari.md) — architecture, Sutton, VoyStick, MVP |
| Machine yaml | [`ebike-safari.yml`](ebike-safari.yml) |
| Live code + design | [`apps/ebike-safari/`](../../apps/ebike-safari/README.md) |
| SFC artifacts | [storymaker-urban-safari.yml](../../characters/don-hopkins/media/storymaker-urban-safari/storymaker-urban-safari.yml) |
| Steering + VoyStick | [urban-safari-steering-voystick-pie-network.md](../../characters/don-hopkins/sources/urban-safari-steering-voystick-pie-network.md) |
| MOOLLM skill | [ebike-safari/SKILL.md](../../skills/ebike-safari/SKILL.md) |
| Idea reactor | [crazy-idea-jam.yml](../../process/crazy-idea-jam.yml) |

---

## In this directory

| File | Purpose |
|------|---------|
| [**ebike-safari.md**](ebike-safari.md) | **Readable product spec** — the whole yaml in prose |
| [`ebike-safari.yml`](ebike-safari.yml) | Machine girder — lineage chain, ride game, voice stack |
| `SHOW.yml` | *Not yet* — lazy prototype promotion when ready to air |

↑ [`../README.md`](../README.md) · [`../INDEX.yml`](../INDEX.yml)
