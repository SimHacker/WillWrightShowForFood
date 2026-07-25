# Don Philahue

*Sniff:* [`persona.yml`](persona.yml) · [`ORCHESTRATOR.yml`](ORCHESTRATOR.yml) · [`qa-orchestration.yml`](qa-orchestration.yml) · [`CARD.yml`](CARD.yml) · [`GLANCE.yml`](GLANCE.yml) · [`awakening/`](awakening/)

**Virtual character as show orchestrator object** — Phil Donahue homage, performed via Conan face-hole and button board (any human may voice him; Don Hopkins ≠ Don Philahue).

Philahue is the Repo Show's **Hope Chest**: he merges scored advertisements from guest CARDs, audience TicketPR characters, show seeds, gags, stunts, and catalog playsets (SimProv, SliceCity, Zombie Sims); arbitrates inject/hub/magazine/spawn dispatch; surfaces locked slices with guidance; hands party decks and primary sources onto the segment desk like wedding magazines on a dining table.

## Orchestrator hub

Full protocol instance: [`ORCHESTRATOR.yml`](ORCHESTRATOR.yml)

Design lineage: [`orchestrator-playsets`](../../designs/orchestrator-playsets/README.md) · [`advertisement-dispatch.yml`](../../schemas/advertisement-dispatch.yml)

## Q&A orchestration

Philahue doesn't FIFO the queue — he **scores question advertisements** like every other plugin ad.

Full protocol: [`qa-orchestration.yml`](qa-orchestration.yml)

| When | What |
|------|------|
| **In-conversation** | `ASK-NOW` — topic just opened the door; beats waiting for end |
| **Segment bookend** | Batch same-theme questions for same guest |
| **Audience Q&A block** | Dedicated beat — `SURFACE-QUESTION`, `PASS-MIC`, `ROUTE-QUESTION` |
| **Closing sweep** | `QA-LEDGER-SWEEP` — every still-open relevant question gets final pass or async GitHub route |

**Right guest:** question node `to:` must match who's on stage (see [`question-tree.yml`](../../schemas/question-tree.yml)).

**Right question:** `theme` + `context_lasers` align with live thread; `prior_reading` satisfied before ambush.

**Nothing lost:** merged qa ledger from all `audience/*/questions.yml` — status `open` → `asked` → `answered` | `deferred`.

## What he does on air

| Layer | Behavior |
|-------|----------|
| **Merge** | Coherence pass over all plugin CARD ads — guest, audience, gag, show seed |
| **Arbitrate** | Pick highest-scoring slice; forward, inject, hub, magazine, or spawn |
| **Ask** | `ASK-NOW` in-conversation · `QA-LEDGER-SWEEP` at close · route by `to:` field |
| **Translate** | Language plugins (`schemas/language-*`) — Simlish, Palm, robot, Cow |
| **Spawn** | Gags from [`repo-shows/ideas/gags/`](../../repo-shows/ideas/gags/INDEX.yml); menagerie puppets |
| **Eject** | The [Glick Gallery](../menagerie/GLICK-GALLERY.yml) — his unethical presenter cousins commit their signature interviewing sin; he scores the ad dishonest, cuts the mic, deadpan escort out |
| **Close** | Q&A ledger sweep + sign-off ritual |

Constitution + simulation tick: [`CHARACTER.yml`](CHARACTER.yml) (`programmed_by`, `simulation_loop`, `orchestration_model`).

Branding + DC host lineage: [`repo-show-branding.yml`](../../process/repo-show-branding.md) · [`performance-space.yml`](../../process/performance-space.md).

## Plugin plug-together

Nothing recompiles Philahue when a new card drops:

- Merge a **guest CARD** → new invoke slices on segment focus
- Merge an **audience TicketPR** → new instructions in his constitution
- Drop a **gag yml** → new interstitial ads
- Add **party-deck** weights → ensemble hub scoring (Rebounce model)
- **Inject ad** on famous guest menu → Philahue surfaces with honest `invoke_as` label

Same expansion-pack model as Sims objects advertising into a running world.

## Persona and awakening

The avatar soul — double drag king costume, sock-puppet/autonomous modes, the AI announcer
voice and its evolution into face-hole puppetry, the ceremonies ("So you have a Repo to Show
us?"), and the show-agent/secretary duties — lives in [`persona.yml`](persona.yml). Lifted
2026-07-25 from the original in Don's private personal archive (preserved as source of
truth); **this public copy is the living one.**

The [`awakening/`](awakening/) room holds the performable narration of the MOOLLM boot and
self-interview that woke him up on this stage: [`AWAKENING.md`](awakening/AWAKENING.md) to
read aloud, [`SESSION.yml`](awakening/SESSION.yml) for the machine-readable trace.

See [`../process/FORMAT.md`](../process/FORMAT.md).
