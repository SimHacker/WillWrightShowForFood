# eBike Safari

> Voice-controlled adventure navigation through a hidden graph of story cards at real-world places — Ray-Bans see and hear, phone shows the route, Bosch moves the bike, LLM translates intent.

| Field | Value |
|-------|-------|
| **Status** | seed |
| **Host** | Don Hopkins |
| **Participants** | Don Hopkins, Will Wright, Will's son |
| **Parent show** | [Urban Safari LIVE](../urban-safari-live/README.md) |
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
| [Hardware stack](#hardware-stack) | Ray-Ban · phone · Bosch · Koga · Enviolo |
| [From Bar Karma to Amsterdam](#from-bar-karma-to-amsterdam) | StoryMaker lineage |
| [What's shipping now](#whats-shipping-now) | FIT pipeline, live map, gestures |
| [Video gallery](#video-gallery) | Demos 1995–2015 |
| [Partners & licensing](#partners--licensing) | Uncle Milton model |
| [Read next](#read-next) | Full spec + code |

---

## What this is

**eBike Safari** is DreamScape on wheels — geolocated scene cards, topical link layers, and adventure-style voice navigation **while riding**.

You wear Ray-Ban Meta glasses (POV, mic, open-ear audio, your prescription). Your phone on the handlebar is **display only** — map, Bosch stats, turn-by-turn. Apple SpeechAnalyzer listens. You talk; the LLM interprets; a hidden graph of story cards at real places updates; **"set destination"** commits routing through Bosch or Apple Maps.

You never see the graph. You ride Amsterdam (or anywhere), and the world becomes an adventure parser.

This seed is the **product layer** on [Urban Safari LIVE](../urban-safari-live/README.md) — the Repo Show where Don (and Will's son) hop real streets and drop geotagged scene cards into git. Same participatory itch as **StoryMaker**, **Urban Safari**, and [**Bar Karma**](https://en.wikipedia.org/wiki/Bar_Karma) at Stupid Fun Club: audience-authored stories at real places — rebuilt with open maps, FIT rides, and MOOLLM instead of a dead MySQL server.

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

**Voice examples:** *"What's near me?"* · *"Tell me about that canal"* · *"What did Will's son film here?"* · *"Take me to the next Invader"* · **"Set destination"**

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
| **Ray-Ban Meta** | See, hear, speak, capture — camera off the phone |
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
| 2008–11 | iLoci → StoryMaker → Urban Safari — TomTom trilogy recalls Don to SFC |
| 2011 | [StoryMaker demo](https://www.youtube.com/watch?v=_2yEHs_WLzQ) — branching geo stories; [Facebook album round-trip on camera](https://www.youtube.com/watch?v=_2yEHs_WLzQ&t=742) |
| 2011–14 | [MediaGraph](https://www.youtube.com/watch?v=2KfeHNIXYUc) — songs on roads; pie flick navigation |
| 2026 | Urban Safari LIVE — git audience cards; Will async |
| 2026+ | **eBike Safari** — voice + Ray-Ban + LLM + open FIT/map stack |

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

## Partners & licensing

**License, don't acquihire.** We built Facebook album ↔ story card sync in 2011 on camera. Meta has Ray-Ban now; we have the safari graph + voice adventure layer.

| Partner | Pitch |
|---------|-------|
| Meta | Glasses-first demo; resurrect social card sync on modern APIs |
| Apple | SpeechAnalyzer + Vision field showcase |
| Bosch | Voice + story graph Flow lacks — don't kill extensibility again |
| Koga / Enviolo | Authentic Amsterdam safari fleet — co-marketing |

Uncle Milton precedent: Will's ant medium → shipped product with credit. Details: [**ebike-safari.md § Partners**](ebike-safari.md#partners)

---

## Read next

| Depth | Document |
|-------|----------|
| **Full human-readable spec** | [**ebike-safari.md**](ebike-safari.md) — architecture, Sutton, VoyStick, partners, MVP, competitive gap |
| Machine yaml | [`ebike-safari.yml`](ebike-safari.yml) |
| Live code + design | [`apps/ebike-safari/`](../../apps/ebike-safari/README.md) |
| Companion show | [Urban Safari LIVE](../urban-safari-live/README.md) |
| SFC artifacts | [storymaker-urban-safari.yml](../../characters/don-hopkins/media/storymaker-urban-safari/storymaker-urban-safari.yml) |
| Steering + VoyStick | [urban-safari-steering-voystick-pie-network.md](../../characters/don-hopkins/sources/urban-safari-steering-voystick-pie-network.md) |
| MOOLLM skill | [ebike-safari/SKILL.md](../../skills/ebike-safari/SKILL.md) |
| Idea reactor | [crazy-idea-jam.yml](../../process/crazy-idea-jam.yml) |

---

## In this directory

| File | Purpose |
|------|---------|
| [**ebike-safari.md**](ebike-safari.md) | **Readable product spec** — the whole yaml in prose |
| [`ebike-safari.yml`](ebike-safari.yml) | Machine girder — partners, lineage chain, voice stack |
| `SHOW.yml` | *Not yet* — lazy prototype promotion when ready to air |

↑ [`../README.md`](../README.md) · [`../INDEX.yml`](../INDEX.yml)
