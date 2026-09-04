# Orchestrator Playsets — Advertisement Dispatch & Hub Protocols

Design documentation for composable SimAntics-style playsets and their Repo Show CARD analogs. Yaml schemas: [`schemas/advertisement-dispatch.yml`](../../schemas/advertisement-dispatch.yml), [`schemas/orchestrator-hub.yml`](../../schemas/orchestrator-hub.yml).

## Core insight

Objects do not wait to be used — they **advertise** what they can do (MOOLLM `advertisement` skill, SimAntics heritage). CARD.yml extends this:

- **Character cards** publish services and protocols others invoke.
- **Orchestrator hubs** merge ads from plugins, gate them by state, spawn NPCs, hand off magazines.
- **Magazines** placed on surfaces turn tables into configuration UIs.
- **Locked menu items** stay selectable and **tell you how to unlock them** — the pie menu is the quest tree.

No semantics tree. Natural-language `score_when` triggers and relationship-matrix edges. Scoring sorts the pie; highest slice at center.

## Dispatch modes (summary)

| Mode | Menu appears on | Ability lives on | Use when |
|------|-----------------|------------------|----------|
| **forward** | Owner | Owner | Default CARD ability |
| **inject** | Another character/object | Owner | Attribution, reciprocal social verbs |
| **hub** | Orchestrator | Owner or hub | Group sagas, show segments |
| **magazine** | Placed surface | Catalog card | Browse/configure/order |
| **spawn** | Hub after transition | Spawned NPC | Planner, priest, photographer |

See [`advertisement-dispatch.yml`](../../schemas/advertisement-dispatch.yml) for fields, coherence merge algorithm, and portrayal rules (`invoke_as` must name the owner).

## CLOS / ScriptX mapping (conceptual)

| Pattern | Lisp shape | CARD shape |
|---------|------------|------------|
| Single dispatch | `(method ((x chuck)) …)` | forward on chuck-blanchard |
| Multimethod | `(method ((hub rebounce) (guest chuck) (topic authorship)) …)` | hub + requires_participants + score_when |
| Inject `:around` | Method on Jaron's menu authored in Chuck's card | `dispatch: inject`, `menu_host: jaron-lanier` |
| Plugin | `(defmethod play …)` on hub without editing hub class | new CARD.yml exports `dispatch: hub` ads |

HyperCard **bubbles up** (room intercepts). Orchestrator playsets also inject **sideways** (peer cards onto host menus) and **down** (hub spawns children).

## Playset catalog (instances)

| Playset | Seed hub | Kind | Orchestrator doc |
|---------|----------|------|------------------|
| **SimProv Wedding** | Hope Chest | Saga + magazines + NPC services | [`catalogs/simprov/ORCHESTRATOR.yml`](../../catalogs/simprov/ORCHESTRATOR.yml) |
| **SliceCity** | Power plant | Seed spawner + modular chain | [`catalogs/simslice/ORCHESTRATOR.yml`](../../catalogs/simslice/ORCHESTRATOR.yml) |
| **Zombie Sims** | Ham radio | Wave / faction controller | [`catalogs/zombie-sims/ORCHESTRATOR.yml`](../../catalogs/zombie-sims/ORCHESTRATOR.yml) |
| **Rebounce** (Repo Show) | Show seed + party deck | Oral-history hub | [`repo-shows/rebounce/party-deck.yml`](../../repo-shows/rebounce/party-deck.yml) |
| **Cult Sims** *(proposed)* | Guru + broadcast | Conversion / recruitment waves | [`cult-sims.md`](cult-sims.md) — bridges SimProv and Zombie Sims |

## SimProv Wedding — Hope Chest saga

Not one object — an **orchestration kit** ([`catalogs/simprov/README.md`](../../catalogs/simprov/README.md)).

**State machine (simplified):** single → flirting → in_love → engaged → planning → rehearsal → ceremony → reception.

- **Cupid** — service; prerequisite romance. Unlocks further Hope Chest ads when love satisfied.
- **Locked ads** — e.g. plan wedding before in_love: selectable, returns guidance ("Summon Cupid first").
- **Wedding planner NPC** — spawns at planning; hands **magazines** (venue, staff, schedule, orders).
- **Magazines on dining table** — browse, configure, schedule, hire staff, order objects in advance.
- **Crowd Sitter** — group controller; seats guests.
- **Buddha statue** — need suppressor for large crowds.
- **Donna set pieces** — craft layer from magazine orders (buffet, cake, tables).
- **Spawned services** — priest, photographer, apex planner as NPC protocol providers.

Built as inclusion procedural rhetoric — [`sims-series-procedural-rhetoric-inclusion-agitprop.md`](../../characters/will-wright/media/sims-series-procedural-rhetoric-inclusion-agitprop.md).

Media: [`transmogrifier-hope-chest-pie-menu-intro`](../../characters/don-hopkins/media/sims-transmogrifier/transmogrifier-hope-chest-pie-menu-intro.yml), [`hope-chest-simone-simbabe`](../../characters/don-hopkins/media/sims-transmogrifier/transmogrifier-hope-chest-simone-simbabe.yml).

## SliceCity — Power plant pageant

Steve Alvey's **SliceCity** — real SimCity nested inside a Sims lot ([`catalogs/simslice/README.md`](../../catalogs/simslice/README.md)). Shipped proof of Will's 1996 games-in-games / data-portability talk.

**Seed orchestrator:** the **power plant** dynamically spawns and automatically places nearby new zones and items — the city grows from a seed object, not a single prefab.

**Modular chain (pageant of interrelated objects):**

```
power plant (seed spawner)
  → zones + items (auto-placed nearby)
  → modular multi-object airport components (snap together)
  → airport absorbs airplanes
  → airplanes drop skydivers
  → skydivers scatter tiny people on the ground
  → tiny people = clone of cockroach critter AI (running around)
  → stomp: red blood stains (not green cockroach slime)
```

Each link **advertises** to the next; the player experiences a nested simulation pageant — Lilliputian SimCity inside the backyard, with its own critters and consequences. Same composable object architecture as SimProv, different saga.

## Zombie Sims — Ham radio hub

Heather + Steve's magnum opus ([`catalogs/zombie-sims/README.md`](../../catalogs/zombie-sims/README.md)). **Ham radio** orchestrates outbreak/wave logic (parallel to Hope Chest's romance state machine). Skins, religion maps, and wave configs plugin onto the hub. Show hook: [`afterlife-zombie-bridge.yml`](../../repo-shows/heather-and-steve/afterlife-zombie-bridge.yml).

SliceCity and Zombie Sims share Steve/Heather craft; ham radio vs power plant are the same **orchestrator-hub** pattern applied to different genres.

## Repo Show mapping

| Sim playset | Repo Show |
|-------------|-----------|
| Hope Chest | Show seed (`repo-shows/<show>/`) |
| Cupid | Inject ad on famous guest's menu (credit Chuck on Jaron) |
| Wedding planner + magazines | Party deck + CARD.md + primary sources on segment desk |
| Crowd Sitter | Audience seats, ensemble roster |
| Locked plan wedding | `guidance_when_locked` / confirm on air |
| Ceremony | Host invokes ability; guest demonstrates if present |

Rebounce party deck: [`repo-shows/rebounce/party-deck.yml`](../../repo-shows/rebounce/party-deck.yml).

## Repo Show — Don Philahue as orchestrator avatar

In Repo Show, the hub is a **virtual character who IS the orchestrator object** — not a
host sitting on top of furniture props. One character wears all three Sims hubs:

| Sims playset hub | Repo Show job |
|------------------|---------------|
| Hope Chest (SimProv) | Saga + locked slices + magazines on the segment desk |
| Ham radio (Zombie Sims) | Wave / faction controller — plugins onto one hub |
| Power plant (SliceCity) | Seed spawner — zones, bits, NPC pageant chain |
| Wedding planner NPC | Philahue spawns gag puppets + menagerie |
| Magazines on table | Party deck + primary sources + segment runbooks |
| Cupid inject | Chuck on Jaron's menu — Philahue fires with honest label |
| Crowd Sitter | audience/INDEX box seats + balcony |

Performed via Conan face-hole + button board. Full spec:
[`characters/don-philahue/ORCHESTRATOR.yml`](../../characters/don-philahue/ORCHESTRATOR.yml)

### Attention pilot

Philahue is an **attention pilot** for the LLM driving the Repo Show vehicle:

- **World** — an explicit GitHub branching-timeline multiverse (commits, branches, PRs,
  TicketPRs as sim state and alternate histories)
- **Eyes** — a visual/language model's space-and-coherence engine (what stays on camera,
  in mind, on the desk)
- **Controls** — scored advertisement pie, segment-desk magazines, spawn bits/NPC
  puppets, GitHub-feed pulse, Q&A ledger

He steers attention; he does not author a central script. The world advertises; he
pilots which ads get the mic, the cut, and the commit.

Philahue merges **every plugin** without recompile:

- Guest `characters/*/CARD.yml`
- Audience TicketPR `audience/*/CARD.yml` + SIMULATION runbooks
- Show seeds + party decks
- Gags [`bits/`](../../bits/INDEX.yml) (gag-*)
- Catalog playsets (SimProv, SliceCity, Zombie Sims orchestrator trees)

Constitution: [`CHARACTER.yml`](../../characters/don-philahue/CHARACTER.yml) (`programmed-by` — audience collectively programs how he orchestrates; `orchestration_model.attention_pilot`).

**Q&A protocol:** [`qa-orchestration.yml`](../../characters/don-philahue/qa-orchestration.yml) — right question, right guest, right time; in-conversation `ASK-NOW`; closing `QA-LEDGER-SWEEP`.

## Engine status

Schemas are **human + LLM rubric** today (like mana DSL). Future: mooco `ambient_injection` bar — parse CARD + hub YAML, score dynamically, inject until budget spent (capability-bar design in Don's planning notes).

## Related

- [`schemas/guest-skills-card.yml`](../../schemas/guest-skills-card.yml)
- [`process/trails/send-code-not-commands.md`](../../process/trails/send-code-not-commands.md) — SliceCity in send-code lineage
- [MOOLLM advertisement skill](https://github.com/SimHacker/moollm/skills/advertisement)
