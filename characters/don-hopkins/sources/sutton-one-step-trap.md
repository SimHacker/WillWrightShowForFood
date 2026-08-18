# Sutton — The One-Step Trap (and Urban Safari)

Rich Sutton essay ([incompleteideas.net](http://incompleteideas.net/IncIdeas/OneStepTrap.html), Jul 18 2024).
HN discussion: [48883415](https://news.ycombinator.com/item?id=48883415).

## Sutton's claim

The **one-step trap**: assuming a learned one-step transition model can be iterated to predict
long-horizon consequences — like rolling out a physics simulator step by step.

- Grain of truth: perfect one-step accuracy → perfect rollout.
- Practice: errors compound; stochastic futures are trees, not trajectories; complexity is
  exponential in horizon → infeasible.
- Prevalent in POMDPs, Bayesian control, compression theories of AI — still appealing, still hopeless.

**Sutton's fix:** temporally abstract models — **options** and **GVFs** (general value functions),
not microscopic rollout. See Sutton–Precup–Singh (1999), Horde (2011), reward-respecting subtasks (2023).

## HN thread — useful frames

| Commenter | Point |
|-----------|-------|
| **ssivark** | Multi-step world models help, but prefers temporal abstraction. **"Tyranny of the specific"** — long planning cares where you end up, not exactly when. Successor features, GVFs, F-B reps beat exponential search trees from microscopic models. [arXiv:2410.05364](https://arxiv.org/abs/2410.05364) |
| **ssivark** (reply) | Conference trip: need flight legs + 15–18 hours, not every turn to the airport. Zoomed-out picture; fill detail **hierarchically on demand**. |
| **smokedetector1** | The fallacy: `f(t+N)` obtained by iterating `f(t+1)` N times — that iteration is the trap. |
| **mxwsn** | LeCun-style compounding-error argument vs LLMs that improve with more tokens / self-correction ("Wait" in S1). Counterpoint, not refutation. |
| **tipsytoad** | First-principles traps can be convincing and wrong — hold lightly. |

## eBike Safari — already on Sutton's side

Product seed: [`../../../repo-shows/ebike-safari/README.md`](../../../repo-shows/ebike-safari/README.md)

| One-step trap (avoid) | Safari design (use) |
|-----------------------|---------------------|
| Roll out map physics turn-by-turn as the primary model | **Scene cards at POIs** — temporally abstract stops, not tile simulation |
| Micromanage every edge while riding | **Virtual focus** hops POI → card stack → topical links; rider never sees the graph |
| Single trajectory planning | **Story graph** — branches, layers, contributor cards (tree of possibilities at authoring time; options at ride time) |
| Always-on turn-by-turn | **"Set destination"** commits routing; Bosch/Apple fill micro detail only after abstract intent locks |
| Iterate local transitions for "what's interesting ahead?" | Voice **options**: "next Invader", "that canal", "what Will's son filmed here" — semi-MDP commands |

**ssivark's flight analogy maps directly:** safari voice layer = flight legs; Bosch turn-by-turn = traffic lights
to the airport. You do not narrate at traffic-light granularity.

**Lineage:** Logo Adventure REPL-as-parser → StoryMaker geolocated scenes → dual-location nav. Adventure
games never rolled out world physics one step at a time for the player; they offered **verbs on abstract
locations**.

**LLM layer nuance:** mxwsn's counter applies here — field narration can self-correct with more context
(GPS, vision, "wait, I meant the *other* canal"). That does not rehabilitate one-step *world models*;
it says the **language interface** can recover. The **navigation model** should still be options + graph,
not iterated tile prediction.

## MOOLLM skills (simulation stack)

Sutton's fix is what MOOLLM adventures already do — documented in the simulation skill room:

| MOOLLM skill | Role |
|--------------|------|
| [simulation/ONE-STEP-TRAP.md](https://github.com/SimHacker/moollm/blob/main/skills/simulation/ONE-STEP-TRAP.md) | Hub doc — trap, options, tyranny of the specific |
| [simulation/examples/one-step-trap.yml](https://github.com/SimHacker/moollm/blob/main/skills/simulation/examples/one-step-trap.yml) | Machine-readable cross-links |
| [adventure](https://github.com/SimHacker/moollm/blob/main/skills/adventure/SKILL.md) | Verbs on rooms = semi-MDP options |
| [exit](https://github.com/SimHacker/moollm/blob/main/skills/exit/CARD.yml) | Graph edges between abstract locations |
| [time](https://github.com/SimHacker/moollm/blob/main/skills/time/CARD.yml) | `TICK` = game turn, not physics step |
| [memory-palace](https://github.com/SimHacker/moollm/blob/main/skills/memory-palace/GLANCE.yml) | iLoci / method of loci on filesystem |
| [simulator-effect](https://github.com/SimHacker/moollm/blob/main/skills/simulator-effect/CARD.yml) | Seeds not simulation — allied constraint |
| [speech](https://github.com/SimHacker/moollm/blob/main/skills/speech/CARD.yml) | Voice parser = option interface on bike |

Parser lineage in product seed explicitly cites MOOLLM adventure → SpeechAnalyzer voice parser.

**Ride game (steering + pie + VoyStick):** [urban-safari-steering-voystick-pie-network.md](urban-safari-steering-voystick-pie-network.md) · [MOOLLM ride-game.yml](https://github.com/SimHacker/moollm/blob/main/skills/simulation/examples/urban-safari-ride-game.yml)

## Adjacent threads

- SpeechAnalyzer on bike: HN [48894752](https://news.ycombinator.com/item?id=48894752) — same week as
  Sutton trap thread; cited in `ebike-safari.yml` voice_stack.
- Spore GDC belief gate: revisit weird ideas once abstract model is believed buildable — partner pitch
  is logistics, not physics simulation.

## Trail

- [`../../../repo-shows/ebike-safari/README.md`](../../../repo-shows/ebike-safari/README.md) · `temporal_abstraction`
- [`../../media/storymaker-urban-safari/storymaker-urban-safari.yml`](../media/storymaker-urban-safari/storymaker-urban-safari.yml)
- [`../../../process/crazy-idea-jam.yml`](../../../process/crazy-idea-jam.yml#iloci-memory-palace)
- [MOOLLM simulation/ONE-STEP-TRAP.md](https://github.com/SimHacker/moollm/blob/main/skills/simulation/ONE-STEP-TRAP.md)
- [MOOLLM urban-safari-ride-game.yml](https://github.com/SimHacker/moollm/blob/main/skills/simulation/examples/urban-safari-ride-game.yml)
- [`urban-safari-steering-voystick-pie-network.md`](urban-safari-steering-voystick-pie-network.md)
