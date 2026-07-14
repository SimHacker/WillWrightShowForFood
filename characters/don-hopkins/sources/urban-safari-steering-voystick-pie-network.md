# Urban Safari — steering law, pie networks, VoyStick ride game

Field UX for [Urban eBike Safari](../../../repo-shows/ideas/urban-ebike-safari.yml): continuous
**guess where I'm going** / **suggest places to go** between rider and AI — positional direct
manipulation through a pie-menu network you navigate by biking, with voice skip-ahead.

**Naming:** *VoyStar* was a filename typo for VoyStick — but a good suggested coinage for **Voystick
+ pie-menu** navigation (warble along wedge stars/rays). Canonical term remains **VoyStick**; VoyStar
reserved as informal alias for the pie-wedge gestural layer.

## The continuous game

Two players, never pauses:

| Player | Move |
|--------|------|
| **Rider** | Pedals, steers, warbles, asks, deflects, commits `SET DESTINATION` |
| **AI** | Guesses intent from bearing + speed + history; suggests POIs/cards on interest layers |

Not a form. Not turn-by-turn map nagging. A **running inference duel** — the AI proposes the next
story leg; the rider confirms, corrects, or jumps elsewhere by voice or voystick gesture.

Examples:

- AI: "You're heading toward the Jordaan — Invader mosaic two blocks ahead, or canal ring?"
- Rider: "Invader." / warble northeast wedge / "nah, coffee first"
- Rider: **code-switch** — say "set destination" (NL) while warbling the wedge (gestural); or all-gesture expert path with occasional NL tool names
- AI: updates virtual focus, loads card stack, narrates as proximity reveals LOD

Ties to Sutton [one-step trap](sutton-one-step-trap.md): suggestions are **options**, not rolled-out
tile physics. See [MOOLLM ONE-STEP-TRAP](https://github.com/SimHacker/moollm/blob/main/skills/simulation/ONE-STEP-TRAP.md).

## Graph navigation (Logo Adventure → DreamScape → MediaFlow → …)

**Zeroth:** [Logo Adventure](logo-adventure-c64-terrapin.md) (Terrapin C64, age 17) — REPL-as-parser;
no separate engine; `GO`/`LOOK`/`TAKE` between rooms in a hidden graph. The adventure compiler
lineage starts here.

**First:** [DreamScape](https://www.youtube.com/watch?v=5NytloOy7WM) (1995 WWDC) — rooms kiss to
connect on an editable map; link globally, interact locally ([crazy-idea-jam](../../../process/crazy-idea-jam.yml#dreamscape_scriptx)).

**Then:** Interval **MediaFlow** — Don's **Mac Common Lisp + QuickTime** hypermedia stream/dataflow
implementation ([mediaflow-design-comments.md](../mediaflow-design-comments.md)). **No pie menus** —
parallel hypermedia thread, not the flick-navigation UI.

[iLoci](https://www.youtube.com/watch?v=03ddG3jWF98) — pie-menu network editor; rooms kiss to connect
([jam](../../../process/crazy-idea-jam.yml#iloci_memory_palace)).

**MediaGraph** (SFC Unity, Jul 2015 — [YouTube demo](mediagraph-sfc-youtube-demo.md)) — **songs**
on **roads**; drag nodes, edit labels. Per-song **pie menu**: radius + **biome** (CA — Life, ice,
moon surface; same merge, different compete). **Kiss-toggle roads:** drop on another → link; drop
again → unlink. **Flick-on-song** (not empty map) travels down the road in drag direction — Mario
World cannon; pan = left-drag elsewhere. LOD flat polygons far, 3D terrain close (~85 fps, 1–4 live).
([jam](../../../process/crazy-idea-jam.yml#mediagraph)).

**Urban Safari** — cards at POIs; invisible graph overlay.

On the bike (**Urban eBike Safari**): continuous pitch+vowel trace steers **singing while biking** —
Voystick warbles along wedge **arcs** to hop POI→POI, card→card; NL + gestural **code-switch**; hands
on handlebars. Don: *really fun and smooth — best gestural UI I've ever done.*

MOOLLM: [exit](https://github.com/SimHacker/moollm/blob/main/skills/exit/CARD.yml) edges + [adventure](https://github.com/SimHacker/moollm/blob/main/skills/adventure/SKILL.md) verbs + [memory-palace](https://github.com/SimHacker/moollm/blob/main/skills/memory-palace/GLANCE.yml).

On the bike:

- Each **POI** exposes a radial menu of exits: nearby cards, topical links, contributor scenes
- **Physical approach** selects the hub; **virtual focus** highlights a wedge
- **GO** = pedal toward wedge bearing; handlebar steering **is** wedge selection along an arc
- **Voystick** = warble along wedge arc to **flick to the next linked node** — MediaGraph-style cannon flick, hands-free

## Steering law manifest

**Handlebar steering** obeys steering law (path curvature from wheel angle). **Pie-menu selection**
obeys the same family of laws (movement along an arc to a target). On a Koga, they are **one gesture**:

| Channel | What moves |
|---------|------------|
| Handlebars | Physical trajectory through Amsterdam |
| Virtual focus | Which pie wedge / POI / card stack is active |
| Voice / VoyStick | Skip ahead, jump layer, confirm or veto — **code-switch** NL ↔ gestural |

Fitts's law: pie wedges are **big, nearby targets** — Don's religion since CHI'88. **Outdoor = wide
sloppy fast warbles without social cost** — nobody to bother on the canal.

Incremental revelation: as you **pedal toward and past** things, `pickDescription` LOD steps up
(glance → look → examine) for focus and locality — the graph **unfolds in motion**, not in a scroll
view ([adventure LOD](https://github.com/SimHacker/moollm/blob/main/skills/adventure/CARD.yml)).

## VoyStick (voice as joystick)

**VoyStick** — 2D vocal joystick: **pitch = Y, vowel = X**; **homomorphic** input/output (computer
synthesizes the gestures it tracks — sing along, harmonic blend confirms). Pairs with pies for
accessibility ([PieCraft](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/piecraft/RELATED-PROJECTS.md)).

### Dual-channel voice — NL + gestural, code switching

Urban Safari runs **both** voice modalities in parallel:

| Channel | What it does |
|---------|----------------|
| **Natural language** | SpeechAnalyzer — commands, questions, tool names, guess confirm/veto in words |
| **Gestural (Voystick)** | Continuous pitch+vowel — arc hops along pie wedges, homomorphic confirm |

**Code switching:** select with words, navigate with warbles — or combine ("Invader" + northeast
warble). Pick a tool in NL; flick between linked cards gesturally. Expert riders: mostly gesture,
NL punctuation. Parser/LLM fuses intent from whichever channel is live.

35-year arc: [voystick-correspondence-lineage.md](voystick-correspondence-lineage.md) (1991
homomorphic vocoder → Evan Balster formants → Geoff Lindsey vowel space → GuitarPie 2025).

Urban eBike Safari is the **primary outdoor Voystick application**:

- **Outdoor = wide sloppy fast warbles without social cost** — open air, nobody to bother (Evan: quiet monotone mode too)
- **Continuous pitch+vowel trace steers singing while biking** — flick between linked cards along pie arcs
- **Hop down arcs** between POIs without screen touch or handlebar release
- SpeechAnalyzer handles words; parallel **gestural channel** for wedge hops; **code-switch** NL ↔ warble
- **Diphthong rails** for X: front `(i,e,ɛ,a)` and back `(u,o,ɔ,ɑ)` — skip central schwa ambiguity
- Lineage: Phoneloper → [one-minute-intense](../../../process/one-minute-intense.yml)

### Acoustic vowel space (not the tongue chart)

The IPA quadrilateral maps *guessed* tongue position. Voystick maps **formants** — like color space:

| Axis | Formant | Perception |
|------|---------|------------|
| Vertical | F1 | Open ↔ close |
| Horizontal | F2 | Back ↔ front |

[Geoff Lindsey — *The Vowel Space*](https://www.youtube.com/watch?v=FdldD0-kEcc) ·
[clickable F1/F2 chart](https://www.englishspeechservices.com/ipa-vowels/) ·
MOOLLM [vowel-space.yml](https://github.com/SimHacker/moollm/blob/main/skills/speech/platforms/vowel-space.yml)

```text
    F2 front ────────────────── F2 back
         ↑ pitch (high)              Pink Trombone synthesis
         │    ●  ← trace in F1/F2    feeds back same point
         ↓ pitch (low)               homomorphic with mic input

  trace → pie wedge under virtual focus
```

### GuitarPie + Voystick

[Andreas Fender — GuitarPie](https://andreasfender.com/publications.php) (UIST 2025): fretboard
grid as audio-controlled pie menus. Don on [HN](https://news.ycombinator.com/item?id=45250328):
combine with Voystick — guitar selects operations, voice skips layers on the bike.

## AI memory loop (while riding)

Continuous background work — not blocking the steer:

1. **Remember** — past safaris, cards you lingered on, git audience contributions
2. **Look up** — graph links at approaching POIs, topical layers (Invader, Parker, canal history)
3. **Organize** — cluster by interest profile (MOOLLM rooms, Proxi snow globes)
4. **Project** — rank suggestions onto *your* interests, not generic tourism
5. **Speak** — field narration when proximity triggers; answer questions without menu diving

[simulator-effect](https://github.com/SimHacker/moollm/blob/main/skills/simulator-effect/CARD.yml):
imply the depth; reveal on approach; don't simulate every brick.

## Trail

- [`../../../repo-shows/ideas/urban-ebike-safari.yml`](../../../repo-shows/ideas/urban-ebike-safari.yml) · `steering_pie_ride_game`
- [sutton-one-step-trap.md](sutton-one-step-trap.md)
- [voystick-correspondence-lineage.md](voystick-correspondence-lineage.md)
- [Crazy Idea Jam — Voystick](../../../process/crazy-idea-jam.yml#voystick_homomorphic_vocal_joystick)
- [MOOLLM urban-safari-ride-game.yml](https://github.com/SimHacker/moollm/blob/main/skills/simulation/examples/urban-safari-ride-game.yml)
