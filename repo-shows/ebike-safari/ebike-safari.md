# eBike Safari — readable product spec

> **Girder:** [`ebike-safari.yml`](ebike-safari.yml) · **Front page:** [`README.md`](README.md)  
> **Live code:** [`apps/ebike-safari/`](../../apps/ebike-safari/README.md) · **Rides:** [ebike-safari.com](https://ebike-safari.com/)

Voice-first AI touring companion. Product layer on [Urban Safari LIVE](../urban-safari-live/README.md).

---

## One line

Voice-controlled adventure navigation through a hidden graph of story cards at real-world places — you talk, the LLM listens, the phone shows the route, the bike moves you.

## Elevator pitch

eBike Safari is **DreamScape on wheels**, descended through iLoci and Urban Safari: geolocated scene cards, topical link layers, adventure-style voice navigation while riding.

Any camera captures POV for scene cards — phone, GoPro, action cam, whatever you ride with. Any phone on a handlebar mount is **display-only** — map, Bosch stats, turn-by-turn. A mic and open-ear audio carry the conversation; Apple SpeechAnalyzer drives hands-free control.

The rider never sees the graph. The LLM interprets natural language, hops virtual focus across nearby POIs and cards, then **"set destination"** arms Bosch/Apple routing.

We already built several versions of this idea (1995 DreamScape → 2008–2011 TomTom/SFC → 2026). 2026 adds on-device speech, vision, and LLM narration.

---

## Lineage — one server idea, many clients

> Not one prototype — a family of clients on one server idea: **rooms that kiss, cards at places, links between cards.**

| Era | Project | What it was |
|-----|---------|-------------|
| **1995** | [DreamScape](https://www.youtube.com/watch?v=5NytloOy7WM) | Kaleida ScriptX @ WWDC — rooms kiss-to-connect; plug-togetherable web objects; Director ↔ Netscape live switch. [Medium write-up](https://donhopkins.medium.com/1995-apple-world-wide-developers-conference-kaleida-labs-scriptx-dreamscape-demo-17-min-read) · [room doc](../../characters/don-hopkins/kaleida-scriptx-dreamscape-multimedia-lisp-machine.md) |
| **1996** | MediaFlow | Interval — Mac Common Lisp + QuickTime hypermedia streams (no pie menus). [design comments](../../characters/don-hopkins/mediaflow-design-comments.md) |
| **2008** | [iLoci](https://www.youtube.com/watch?v=03ddG3jWF98) | Method of Loci on iPhone; pie-menu network; kiss-to-connect rooms |
| **2009** | [Amsterdam Coffeeshops Layar](https://www.youtube.com/watch?v=nG90XG3STz8) | Every coffeeshop as map layer; spreadsheet database |
| **2009** | Bongo Bingo | Foursquare bingo — bike GPS check-ins across coffeeshop card |
| **2010–11** | [StoryMaker](https://www.youtube.com/watch?v=_2yEHs_WLzQ) | Branching stories; geolocated scenes; Facebook album import/export; iPad MapKit; Unity visualizer; voice-synth reading |
| **2011** | Urban Safari | Layar AR field cards; [Layar demo](https://www.youtube.com/watch?v=Db8KGNoeKHE); [Facebook album round-trip on camera](https://www.youtube.com/watch?v=_2yEHs_WLzQ&t=742) (~12:22 export → ~13:11 import) |
| **2011–14** | [MediaGraph](https://www.youtube.com/watch?v=2KfeHNIXYUc) | SFC Unity — songs on roads; per-song pies; Mario-cannon flick nav; LOD terrain. [Medium demo](https://donhopkins.medium.com/mediagraph-demo-a7534add63e5) |
| **2025–26** | Proxi | Memory snow globes at geo stops — press parallel |
| **2026** | [Urban Safari LIVE](../urban-safari-live/README.md) | Real streets; git audience cards |
| **2026+** | **eBike Safari** | This spec — eBike + voice + camera + LLM narrator |

**Pivotal moment:** TomTom trilogy (iLoci + Coffeeshops + Bongo Bingo) matched Will's CurrentTV problems. Don sent demos; Will said leave EA and come back to SFC. [How Don rejoined Will](../../characters/don-hopkins/career/stupid-fun-club.yml).

---

## DreamScape @ WWDC 1995

DreamScape (*Actualized Fantasy Screen Waster*) — constructive ScriptX experience: rooms connected in a map, objects with behaviors, smooching UI, astral travel between rooms ("don't lose your head"). Live improvisational performance programming on PowerBook 540c. Demo did not crash; came close ("my demo's falling apart" — elasticity ping-pong, butterfly agent).

**Authoring:** Director importer — animations with registration points; Mr Potato Head / Lego robot parts; timeline.

**Browsing:** Dynamically loaded Netscape C extension; `scriptx:` protocol; programmatic HTML collections; room browser with nested outlines; forms edit live simulation (elasticity, gravity); image map clicks hit real objects. Preview engine for multimedia web you generate — link globally, interact locally.

**Web vision:** Each room a distributable title container; plug-togetherable interactive objects; window-shopping GIF storefronts linking to downloadable ScriptX objects for test drives. Same itch as Urban Safari cards at POIs and MOOLLM rooms.

> *"We want to give creative people an environment in which to plant their seeds — fertile ground, instead of a killer app."*

Leads to: iLoci, StoryMaker, Urban Safari, MediaGraph, MOOLLM, ebike-safari.

---

## Split architecture — three roles, one rider

### Camera + audio

| Role | Detail |
|------|--------|
| Capture | POV video/photo for scene cards — phone, GoPro, action cam, camera glasses if you like; optional, not required |
| Audio | Mic + open-ear speakers — earbuds, headset, whatever's safe on a bike |
| Why | Camera off the phone means **any handlebar mount works** (display only); hands stay on handlebars |

### Handlebar phone

Display-only: map, turn-by-turn, Bosch SDK UI. Optional Android. Any mount — Quad Lock, Bosch, generic — no integrated camera required.

### Bosch eBike system

Motor assist context, battery, speed, route to head unit — read via the Flow SDK. Flow does turn-by-turn; it doesn't do voice or story graphs. This does.

---

## Field hardware — what Don actually rides

Authentic endorsement, not aspirational spec.

| Component | What | Why |
|-----------|------|-----|
| **[Koga](https://www.koga.com/)** | Dutch premium e-bike — Don's safari fleet | Built for daily Dutch urban riding; local brand fits Amsterdam canal-loop demos |
| **[Enviolo](https://www.enviolo.com/)** | CVT hub — no discrete gear shifts | Stop-start urban safari: narrate at a canal, roll off without hunting gears. Hands stay on handlebars; voice UX is not fighting drivetrain. |
| **Stack** | Koga frame + Bosch motor + Enviolo CVT | Field-tested on real safaris |

---

## Dual location navigation

Adventure-like navigation through the graph of cards at places ahead of you. **Two locations:**

1. **Physical** — GPS truth; bike position on map.
2. **Virtual focus** — cursor hopping map → nearby POI → cards at POI → links between cards across topical layers.

The user does not care how it is modeled. The LLM hides structure, interprets intent, follows overlaying topical graphs.

### Voice commands (examples)

- "What's near me?"
- "Tell me about that canal"
- "What's the story behind that bridge?"
- "Take me to the next Invader"
- **"Set destination"** — commit virtual focus → route via Bosch/Apple. MUCH safer than pinch-zoom or list scroll while riding.

### Temporal abstraction — Sutton's one-step trap

Rich Sutton (Jul 2024): iterating one-step world models for long horizons compounds error and explodes combinatorially — use **options** and GVFs instead. [One-step trap](http://incompleteideas.net/IncIdeas/OneStepTrap.html) · [HN 48883415](https://news.ycombinator.com/item?id=48883415) · [Don's room](../../characters/don-hopkins/sources/sutton-one-step-trap.md)

**Safari read:** Scene cards at POIs = temporally abstract stops. Virtual focus + voice commands = semi-MDP options. "Set destination" commits an endpoint; Bosch turn-by-turn is hierarchical micro-detail filled on demand — not the primary planning model.

**Tyranny of the specific** (ssivark @ HN): flight legs + 15–18 hours, not every turn to the airport. Voice layer plans story legs; map UI stays zoomed out until rider commits routing.

**LLM nuance:** HN counter (mxwsn) — LLMs can self-correct with more tokens for field narration, not for rehabilitating one-step tile/world-model rollout for navigation.

**MOOLLM ties:** [ONE-STEP-TRAP.md](https://github.com/SimHacker/moollm/blob/main/skills/simulation/ONE-STEP-TRAP.md) · [example yml](https://github.com/SimHacker/moollm/blob/main/skills/simulation/examples/one-step-trap.yml)

**Parser lineage:** Logo Adventure (zeroth, REPL-as-parser) → DreamScape → MOOLLM adventure → SpeechAnalyzer voice parser.

---

## Steering, pie network, and the ride game

Continuous two-player game: AI guesses where you're going and suggests places; you pedal through a **positional direct-manipulation pie-menu network** — skip ahead by voice or [VoyStick](https://news.ycombinator.com/item?id=45250328) warble. Handlebar steering IS steering law manifest; pedaling past POIs incrementally reveals focus and locality (LOD).

| Player | Move |
|--------|------|
| **Rider** | Pedals, steers, warbles, asks, deflects, commits SET DESTINATION |
| **AI** | Guesses from bearing + speed + history; suggests POIs/cards on interest layers |

Not a form. Not turn-by-turn map nagging. A **running inference duel**.

- **AI guesses:** bearing + speed + ride history → proposed next story leg
- **AI suggests:** POIs/cards ranked on interest layers — not generic tourism
- **Rider moves:** confirm, deflect, voice_skip, voystick_wedge, set_destination
- **Never pauses**

Each POI = hub; wedges = nearby cards + topical links; approach opens menu. Biking navigates the network physically; virtual focus highlights wedge. Same law family as Fitts pie menus (CHI'88) — one gesture steers Amsterdam AND graph focus.

**Incremental revelation:** Pedal toward POIs → LOD glance → look → examine (adventure `pickDescription` pattern). Bearing + proximity widens/narrows what loads from hidden graph. Simulator effect: imply depth; reveal on approach.

**VoyStick:** pitch=Y, vowel=X homomorphic vocal joystick — hop pie arcs and between POIs/cards MediaGraph-style, hands on bars. Computer synthesizes same gesture; sing along, harmonic blend confirms. *"Really fun and smooth — best gestural UI I've ever done."*

**Code switching:** NL selects tools/destinations; gestural executes spatial hops. Expert path: mostly warble + occasional NL punctuation. Both streams parallel; LLM fuses intent.

Deep dive: [urban-safari-steering-voystick-pie-network.md](../../characters/don-hopkins/sources/urban-safari-steering-voystick-pie-network.md) · [MOOLLM ride-game example](https://github.com/SimHacker/moollm/blob/main/skills/simulation/examples/urban-safari-ride-game.yml) · [Piecraft related projects](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/piecraft/RELATED-PROJECTS.md)

**AI memory loop:** remember → lookup → organize → project → speak → answer (all without stopping or screen touch).

---

## Voice stack

| Layer | Technology |
|-------|------------|
| **Primary (field)** | Apple SpeechAnalyzer |
| Browser STT | `skills/speech` — recognition.js (Web Speech API) |
| Native STT | `skills/speech/native` — moollm-speech CLI (planned, macOS 26+) |
| Parallel gestural | VoyStick — pitch stream (not in Apple STT) |
| Fallback | WhisperKit for locales SpeechTranscriber does not cover |

**Why on bike:** Hands on handlebars; ~2% WER clean / ~4.5% noisy on LibriSpeech vs legacy SFSpeechRecognizer; on-device privacy and latency. Field test still needed: windy canal-side ride.

**Implementation note:** SpeechAnalyzer sessions hang without `finalizeAndFinishThroughEndOfInput()` — see [Inscribe benchmark](https://get-inscribe.com/blog/apple-speech-api-benchmark.html) · [HN thread](https://news.ycombinator.com/item?id=48894752)

Audit: [STT-STACK.md](https://github.com/SimHacker/moollm/blob/main/skills/speech/STT-STACK.md)

---

## LLM layer

| Role | What |
|------|------|
| Interpret intent | Natural language → graph operations |
| Hide structure | Rider never sees YAML |
| Field narration | Proximity-triggered at stops |
| Vision | "What am I looking at?" |
| Caption | Scene cards from captures |
| Export | Memory snow globe — Proxi parallel |

**Capture loop:** *"Capture this"* → camera photo + GPS + LLM caption → geotagged scene card on map/git.

---

## Social card sync — we already built it once

StoryMaker shipped a Facebook app with album import/export (scene photos ↔ story cards). Micropolis Facebook app same era.

**Don demonstrates album export / edit / import on camera** in the [StoryMaker comprehensive demo](https://www.youtube.com/watch?v=_2yEHs_WLzQ&t=742) (~12:22 export → ~12:39 Facebook drag-edit → ~13:11 import round-trip). The 2026 equivalent syncs scene cards with whatever photo/social service the rider already uses.

---

## MVP demo slice

Amsterdam canal eBike loop on Koga + Enviolo; SpeechAnalyzer voice loop (zero screen touches); Bosch read-only speed/battery/route; voice capture → geotagged card; one playlist export for Will async.

**Field test:** 30-minute ride WER + wind — a benchmark nobody else runs.

**Belief gate:** Same Spore GDC hinge — believe the weird idea is buildable on today's stack. [revisit-weird-outside-the-box](https://youtu.be/ofA6YWVTURU?t=3657)

---

## What's shipping now — ebike-safari app

The 2026 implementation lives in [`apps/ebike-safari/`](../../apps/ebike-safari/README.md) — **new from scratch**, not a port of the SFC/MySQL stack:

| Urban Safari (2011) | eBike Safari (2026) |
|---------------------|---------------------|
| Google Maps / MapKit | OpenStreetMap + MapLibre |
| MySQL scene graph | Git + YAML + static JSON |
| Proprietary map SDKs | FIT pipeline |
| SFC server | This repo + [ebike-safari.com](https://ebike-safari.com/) |

**The world is the controller.** The bicycle is the turtle; OpenStreetMap is the microworld; the ride is a program written on the street graph. Score **novel exposure** and **recognized gestures** (roundabouts, flood-fill neighborhoods, encircles), not kilometers.

Design cauldron: [`apps/ebike-safari/design/`](../../apps/ebike-safari/design/README.md) · Vision: [`design/VISION.md`](../../apps/ebike-safari/design/VISION.md)

---

## Swag and culture

Will loves industrial-warning / absurd stickers — SFC gift seeded packs. Art lead: [Howard Penner](../../characters/howard-penner/README.md). Hero tee concept: **HANDS MUST REMAIN ON HANDLEBARS**.

- [SFC sticker packs](../../bits/swag-sfc-sticker-packs/swag-sfc-sticker-packs.yml)
- [VoyStick warning stickers](../../bits/swag-voystick-warning-stickers/swag-voystick-warning-stickers.yml)
- Howard deliverable: big WARNING chest-panel tees + kiss-cut carnage sheets

Howard flagged [codebase-posters](https://github.com/unable12/codebase-posters) — paint WillWrightShowForFood / MOOLLM git history as wall art. Every repository has a shape.

---

## Video gallery

| Clip | URL |
|------|-----|
| DreamScape @ WWDC 1995 | [youtube.com/watch?v=5NytloOy7WM](https://www.youtube.com/watch?v=5NytloOy7WM) |
| iLoci | [youtube.com/watch?v=03ddG3jWF98](https://www.youtube.com/watch?v=03ddG3jWF98) |
| Amsterdam Coffeeshops Layar | [youtube.com/watch?v=nG90XG3STz8](https://www.youtube.com/watch?v=nG90XG3STz8) |
| StoryMaker comprehensive | [youtube.com/watch?v=_2yEHs_WLzQ](https://www.youtube.com/watch?v=_2yEHs_WLzQ) |
| Facebook album round-trip | [youtube.com/watch?v=_2yEHs_WLzQ&t=742](https://www.youtube.com/watch?v=_2yEHs_WLzQ&t=742) |
| Urban Safari Layar | [youtube.com/watch?v=Db8KGNoeKHE](https://www.youtube.com/watch?v=Db8KGNoeKHE) |
| MediaGraph SFC | [youtube.com/watch?v=2KfeHNIXYUc](https://www.youtube.com/watch?v=2KfeHNIXYUc) |
| Will — revisit weird ideas | [youtu.be/ofA6YWVTURU?t=3657](https://youtu.be/ofA6YWVTURU?t=3657) |

---

## Related documents

| Document | Role |
|----------|------|
| [ebike-safari.yml](ebike-safari.yml) | Machine girder (this doc's source) |
| [Urban Safari LIVE](../urban-safari-live/README.md) | Companion Repo Show |
| [StoryMaker / Urban Safari (2011)](../../characters/don-hopkins/media/storymaker-urban-safari/storymaker-urban-safari.yml) | SFC era artifacts |
| [Stupid Fun Club lineage](../../characters/don-hopkins/career/stupid-fun-club.yml) | Will rejoin story |
| [Crazy Idea Jam — urban cluster](../../process/crazy-idea-jam.yml) | Idea reactor |
| [ebike-safari skill](../../skills/ebike-safari/SKILL.md) | MOOLLM protocol |
| [Bar Karma](https://en.wikipedia.org/wiki/Bar_Karma) | Audience-authored TV — same participatory itch |

↑ [`README.md`](README.md) · [`../README.md`](../README.md)

*Hand-authored readable edition. Machine source: [`ebike-safari.yml`](ebike-safari.yml).*
