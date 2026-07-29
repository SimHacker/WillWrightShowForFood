# LinkedIn DM — Don ↔ David Temkin (Declare reveal)

**Channel:** LinkedIn Messages  
**Dates:** Don outreach ~Tue Jul 2026; David's Declare reveal ~Wed/Thu Jul 2026; Don replies ~29 Jul 2026  
**Status:** David not yet ready to post Declare publicly when he sent the link ("wet cement"); show prep should treat Declare as shared-but-sensitive until he LinkedIn-posts.

---

## Don → David (outreach)

Hey David — works with Henry Minsky at Leela; Henry showed David's email about AI reincarnating OpenLaszlo. Wants to reconnect; has old OL code (video component / SimFaux). Points at PIXIE recovery + Facebook guessing game.

- SimFaux: https://www.youtube.com/watch?v=gRodlxUZ9SQ
- PIXIE transcription: `characters/heinz-lemke/sources/pixie-assembler-listing-1972/TRANSCRIPTION-REPORT.md`
- Titan link: `…/pdp7-reference/TITAN-LINK-PROTOCOL.md`
- Guessing game: `…/2026-07-24-facebook-guessing-game.md`

## David → Don

In SF; Don still Amsterdam? Thursday or next week. OpenLaszlo work sparked "next-level manic coding binge" — up Don's alley (saw Svelte use). Lots of wet cement; will LinkedIn when settled.

**https://github.com/davidtemkin/declarelang**  
→ See it live → propaganda → try **Calendar** and **Desktop**

## Don → David (29 Jul 2026 morning — queued while "pretending to be an LLM" learning Declare)

### Svelte / training / Declare lineage

1. Loves Svelte — "the Laszloiest thing out there"; Rich Harris learns from other approaches; Svelte 4→5 / Runes big but loved. Micropolis uses non-DOM reactive modules to bind Wasm sim to TS (works on Node servers too).
2. Fitting LLM context windows: lean into training; don't humansplain ([no-ai-humansplaining](https://github.com/SimHacker/moollm/blob/main/skills/no-ai-humansplaining/SKILL.md)). Humansplaining is the opposite direction of ai-slop.
3. Declare benefits: (1) **declares** it inherits from (but does not reimplement) OpenLaszlo; (2) OpenLaszlo is in the training data.

### Clarification — "not a reimplement" = reimagine (cinematography)

By "but does not reimplement" Don meant what David said ("is not a port"). Better still: it doesn't just reimplement — it **reimagines**, which is necessary now that we have LLMs.

> Just reimplementing is like pointing a movie camera at a stage, without realizing there's cinematography to be invented.

But reimplementing OL with modern tech was a **good first step**: working artifact to triangulate on; reincarnate OpenLaszlo apps **without rewriting** them; and LLMs should find **OL → Declare rewrites** easy because the models are aligned in many ways.

### Speed-of-light / colocating agents

Still mid-reading Declare ("pretending to be an LLM following the instructions"). Queuing tokens. Soon: same audio/visual space over chat — not quite speed-of-light, but see [MOOLLM speed-of-light](https://github.com/SimHacker/moollm/tree/main/skills/speed-of-light) (colocating agents in the same completion call vs token ping-pong).

### Open question for Oliver + David

**Does Declare follow Oliver's Instance Substitution Principle?**  
(→ Oliver solo show [`repo-shows/oliver-steele/`](../../../repo-shows/oliver-steele/README.md); LZX obeyed ISP; JS often doesn't.)

Provisional sniff (Don/show prep, not David's answer): Declare lets any instance declare its own members with the compiler synthesizing an anonymous subclass — promote to `class` when instantiated twice. That is instance-first flavored; ask Oliver whether it fully satisfies ISP (instance ≡ its own definition / slide between instance and class).

### Self / Ungar / MOOLLM object system

Reading of MOOLLM object system design — Self reimagined for LLMs that multiply inherit from latent space and concrete documents. Dave Ungar interviewed at Laszlo and **got** Laszlo. Pull him into this discussion (group and/or 1:1).

YouTube — *MOOLLM Designs: Object System README*: https://www.youtube.com/watch?v=0uBO6ZAcVTE  
- **16:16** — full heritage, one line each  
- **19:10** — agent flame / speed-of-light digression  

**Public framing (for invites / show):** k-line inheritance — paper (*Self: The Power of Simplicity*),
patent (US 5,187,786), mixin words (`git`, `prototype` → skill + latent), skills as primary words.
→ [`../../david-ungar/sources/moollm-kline-inheritance.md`](../../david-ungar/sources/moollm-kline-inheritance.md)

Dream guest pack: [`characters/david-ungar/`](../../david-ungar/) · [`repo-shows/david-ungar/`](../../../repo-shows/david-ungar/)

### Location / cats / gorilla

Still in Amsterdam area — house just outside, village between Amsterdam and the airport (Badhoevedorp). Backyard garden, cats, Stone Zen Garden Gorilla. Offers cat and gorilla pics if David consents.

Reactions: 👏 👍 😊

---

## Show note

This DM is the private spark; the LinkedIn OpenLaszlo 5.0 thread is the public reunion. Declare repo is public; ask before quoting "wet cement" / manic binge / personal location jokes on air.

**Cast expansion from this thread:** David Ungar (Self × Laszlo interview lore) next to Oliver (ISP) next to David Temkin (Declare) — three-way or sequential shows.

↑ [declarelang sniff](declarelang.md) · [sources](README.md)
