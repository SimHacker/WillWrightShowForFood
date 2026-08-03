# Ideas to explore with David Temkin 👤

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in David's
public work and documented connections to this repository. Things Don would love to follow
**with** David Temkin (and Henry Minsky, Oliver Steele, the LinkedIn Laszlo Cc list); not
quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## What David has done

Founder (then CTO/VP Eng) of Laszlo Systems; created OpenLaszlo / LZX. In 2026 shipped
**OpenLaszlo 5.0** — AI-assisted TypeScript revival of the 4.9 DHTML toolchain — then
**Declare** (`declarelang`): a new UI DSL that *declares* OpenLaszlo inheritance and
**reimagines** it for LLMs (not a port). Also **Mesa**, **In Formation** magazine revival,
Claude Code port of a 1991 Mac stereo game. Don worked with him, Henry Minsky, and
Oliver Steele on OpenLaszlo.

## The hooks

### 1. Invite formats — group and/or 1:1
[`invitation.md`](invitation.md): **A** OpenLaszlo reunion → Declare (Henry, Oliver, Don, + Ungar
optional) · **B** one-on-one Declare/OL deep dive · **C** whatever works. Five-act reunion spine:
**I** OL 5.0 · **II** Declare · **III** Svelte 5 / Micropolis · **IV** ISP + Ungar / Self ·
**V** Mesa + In Formation.

### 2. Reimplement → reimagine (cinematography)
OL 5.0 = point the camera at the stage (necessary triangulation; reincarnate apps without rewrite).
Declare = invent cinematography for the LLM era. Bet: LZX → Declare rewrites are easy because
the models align. Stress-test live with a small LZX sample.

### 3. Declare vs Svelte vs OpenLaszlo (the triangle)
Does Declare use Svelte? **No.** Resemble Svelte 5? **Yes, in grain** — assignment notifies,
derived stays true, no VDOM — but `[ ]`/`{ }` language, no CSS/DOM-as-language, datapath
replication, State/Spring, dual canvas, LLM-first docs/skill. OL: conceptual heir, not a port.
Don's claim: Declare benefits because it *names* OL lineage and OL is in training data
([no-ai-humansplaining](https://github.com/SimHacker/moollm/blob/main/skills/no-ai-humansplaining/SKILL.md)).
→ [`sources/declarelang.md`](sources/declarelang.md)

### 4. Does Declare obey Oliver's Instance Substitution Principle?
Open question Don queued in the DM. Instance may grow members → anonymous subclass; promote
to `class` when twice-instantiated. Looks instance-first — ask Oliver whether it fully satisfies
ISP (instance ≡ its own definition). Couple with Oliver solo show
[`repo-shows/oliver-steele/`](../../repo-shows/oliver-steele/).

### 5. Language as the reviewer when writing is free
David's Declare thesis: producing code is nearly free; trusting it isn't. React verifies by
resemblance; Declare makes tree/state/layout first-class so the compiler (and diagnostics
aimed at models) are load-bearing. Pair with verify ladder + Inspector (`⌥⌘D`).

### 6. Agentmaxxing + speed-of-light
Which models? Oracle / differential harness? Calendar: ~484 lines, 0 by hand.
[cauldron](https://github.com/SimHacker/moollm/tree/main/skills/cauldron) ·
[cursor-mirror](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) ·
[speed-of-light](https://github.com/SimHacker/moollm/tree/main/skills/speed-of-light)
(colocating agents in one completion vs token ping-pong — Don queued Declare learnings this way).

### 7. Continuity as the grain
Declare's calendar: four views as one surface through a moving zoom rectangle — Spring/State,
not bespoke motion projects. Same anti-discrete cut as Mesa zoom and Micropolis map zoom.

### 8. Run old apps on 5.0 — then port one to Declare
Micropolis LZX (AMF server gap):
https://github.com/SimHacker/MicropolisCore/tree/main/documentation/openlaszlo  
SimFaux, myAlive, weather.lzx, Grig's calendar. Two tracks: (a) reincarnate without rewrite on 5.0;
(b) LLM rewrite one app into Declare and compare alignment.

### 9. Pull Dave Ungar into the circle
Ungar interviewed at Laszlo and got it. Self × MOOLLM object system reading:
https://www.youtube.com/watch?v=0uBO6ZAcVTE (@16:16 heritage; @19:10 speed-of-light).
Dream guest: [`../david-ungar/`](../david-ungar/) · show [`../../repo-shows/david-ungar/`](../../repo-shows/david-ungar/).
Group with Temkin + Oliver, and/or 1:1s.

### 10. Constraints & prototypes before it was cool
Garnet / Brad Myers lineage; "YOU WERE HERE / YOU COULD BE HERE" trade-off gadgets;
what Svelte 5 + Wasm Micropolis rediscovered; what Declare makes first-class again.

### 11. Software shelf life ↔ preservation
David's LinkedIn rant (books/movies last; software expires) next to PIXIE recovery and
Repo Show as backing store. SPS recruiting? Declare as *forward* preservation of the model.

### 12. Mesa + In Formation (Act V)
Chat window as OS vs shared spatial canvas. "Computers make people easier to use" —
print satire as moral spine; Repo Show as git answer; Declare as UI-language answer.

### 13. Henry + Oliver + Marvin lineage
Instance-first / LZX design; Henry at Leela; Oliver as Marvin's son-in-law; Adam Wolff on
Claude Code *and* "laszlo reunion wen?" — LinkedIn Cc list as guest bench.

### 14. Sniffable Python jazz ↔ Declare grain
Same lean-into-training move, different surface: Jesus Mouse memorial expresses Self
inheritance as ordinary Python imports (not a new DSL) — decorate a generic latent object
with specific traits on the import line (`props.jester_head.purple` + comment), then `|` scat
the locals into a look chord. Declare does the cousin move for UI: name OL lineage, keep the
language small enough for an LLM context. Show candy if the reunion lands on "what syntax
do models already know how to read?"
→ [`../jesus-mouse/sources/latent-imports.md`](../jesus-mouse/sources/latent-imports.md)
· apex: [SOUL-MODEL.md](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md#differently-architected-examples-same-cartoon-grammar)

### 15. Push vs pull — David answers on the record (Aug 2026)
Declare = **push**, spreadsheet model, compiler-derived dependency tree (sees into functions).
Garnet parsed expressions but was pull; OL chose push for Flash workload. David reading Don's
[constraints article](../../don-hopkins/sources/articles/constraints-garnet-openlaszlo.md) pre-call.
→ [`sources/2026-08-03-declare-constraints-thread.md`](sources/2026-08-03-declare-constraints-thread.md)

### 16. JSON bridge + wasm embedding
Cross-boundary reactivity = JSON datasets (network, baked, or future bridge from Svelte/worker).
Mesa uses worker offscreen render → main; Micropolis wasm pattern is interesting but not David's
default path. "Not combo-plate JS/CSS/HTML."
→ Desktop demo: https://davidtemkin.github.io/declarelang/ (press Desktop)

### 17. Window manager stress test
Don: Kando overlay WM + NeWS ICCCM history. David: in-app WM yes (Desktop demo); native overlay
needs Electron cells + compiler support — edge of design. macOS permissions reality check.
→ [`pie-menus-window-management.md`](../don-hopkins/sources/articles/pie-menus-window-management.md)

## Sources (public)

- [`sources/declarelang.md`](sources/declarelang.md) — deep sniff
- [`sources/2026-linkedin-dm-declare.md`](sources/2026-linkedin-dm-declare.md) — DM spark
- [`sources/2026-openlaszlo-5.0-linkedin-thread.md`](sources/2026-openlaszlo-5.0-linkedin-thread.md)
- [`sources/mesa-and-in-formation.md`](sources/mesa-and-in-formation.md)
- [`invitation.md`](invitation.md)
- Show seed: [`repo-shows/openlaszlo/`](../../repo-shows/openlaszlo/)
- [`CHARACTER.yml`](CHARACTER.yml)
