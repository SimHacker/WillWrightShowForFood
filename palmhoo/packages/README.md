# 📦 Packages

*Palmhoo topic — the reusable-module layer across all three repos: monorepo packages, plus the
Python/TypeScript modules living inside skills.*
↑ [Palmhoo root](../README.md) · [Constitution](../CONSTITUTION.md) ·
sibling: [Under Development](../under-development/README.md) (status) — this shelf is about
*shape* (how code should be factored), that one is about *motion*.

## The uplift doctrine

🐒✋ *This is the shelf's law, so it goes first.*

**Play-learn-lift's true goal is not producing skills. It is uplifting skills into deterministic
code.** A skill that needs LLM tokens forever is a first draft. The full ladder:

1. **Play** — explore the problem in conversation; the skill is born as convention.
2. **Learn** — the skill stabilizes; its steps become predictable; the LLM is now executing the
   same program every time, expensively.
3. **Lift** — extract the predictable core into a **well-factored, reusable Python or TypeScript
   (or C++, in Micropolis's case) module** that runs perfectly, reliably, deterministically,
   testably — with **zero or fewer LLM tokens**.

The lifted artifact has a required shape:

| Layer | Requirement |
|-------|-------------|
| **Module** | Reusable functions/classes other code can embed — the real product. Higher-level tools and apps get built *out of it*, not around it. |
| **CLI** | A thin but **faithful and complete** shell interface over the module — everything the module does, the CLI exposes; nothing lives only in the CLI. |
| **Doc up front** | The command language defined and documented *at the top of the source* ([sniffable-python](https://github.com/SimHacker/moollm/tree/main/skills/sniffable-python) style) — so an LLM understands the interface from the self-generated doc **without running `--help`**, and a human understands it without running anything. |
| **Formats & schemas** | Compatibility comes from **sharing the same code** — readers and writers import one module; the schema is the module's public contract, not a parallel document that drifts. |
| **Installation** | Either the tool installs on the system (with instructions in the skill) or it's embedded in the skill itself. Single-file monolith scripts are acceptable drafts; the factored module+CLI is the ideal. |

Why it matters: **people and LLMs get to build software on top of deterministic, testable code**
— LLM-generated or human-generated — using skills to uplift designs into shipping code. The
tokens get spent on the *frontier* (new designs), not on re-executing solved problems.

## The monorepo packages layer

| Entry | 🐒✋ Why you'd look |
|-------|--------------------|
| [**MicropolisCore packages/**](https://github.com/SimHacker/MicropolisCore/tree/main/packages) | The gold standard of the doctrine at C++ scale: `micropolis-engine` (simulation core → WASM), `tile-renderer` + `render-core` (display, factored so ttycity could swap in emoji), `sims-io` (formats-as-shared-code — the data-portability crown jewel), `mooshow`, `vitamoo`. |
| [**WWSFF packages/**](../../packages/README.md) | The `@wwsff/*` layer — where code that generalizes across shows gets extracted from show harvests. Explicitly the lift step of this repo's cauldron. |
| [**WWSFF apps/**](../../apps/README.md) | Deployables built *on* packages — the proof that the module layer is real. |
| [**MOOLLM kernel/**](https://github.com/SimHacker/moollm/tree/main/kernel) | Not a package but the floor packages stand on: protocols, naming, drivers. |

## Packages living inside skills

Many MOOLLM skills enclose CLI tools today — at every rung of the ladder:

| Entry | Rung | 🐒✋ Note |
|-------|------|----------|
| [**cursor-mirror**](https://github.com/SimHacker/moollm/tree/main/skills/cursor-mirror) | lifted | The exemplar: `scripts/cursor-mirror.py` is a real tool (tail, timeline, grep, deep-snitch) with a documented command language, wrapped by a skill that teaches *when* to reach for it. |
| [**sister-script**](https://github.com/SimHacker/moollm/tree/main/skills/sister-script) | doctrine | Doc-first automation — the skill that *describes* this ladder: write the doc, then the script that obeys it. |
| [**sniffable-python**](https://github.com/SimHacker/moollm/tree/main/skills/sniffable-python) | doctrine | How to structure the lifted module so LLMs comprehend it at a sniff — doc up front, structure as signage. |
| [**skill-snitch**](https://github.com/SimHacker/moollm/tree/main/skills/skill-snitch) | lifting | Audit protocol (SCAN/AUDIT/SNITCH) partially backed by cursor-mirror's deterministic scanner — a hybrid mid-lift. |
| [**WWSFF skills/repo-show**](../../skills/repo-show/README.md) | learning | Still convention-heavy; its predictable parts (show scaffolding, seat creation) are lift candidates. |

## Lift queue

🐒✋ *Skills whose predictable cores are ripe for extraction — journalists welcome.*

- **Palmhoo itself** — the staleness detector ([JOURNALISM.md](../JOURNALISM.md) automation
  ledger) is a dozen lines of `git log` per manifest entry: a perfect first lift.
- **Coherence manifest tooling** — parse [coherence.yml](../coherence.yml), flag stale
  summaries, open issues. Module first, GitHub Action as the thin CLI's second caller.
- **The worm colony** — the [worms](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.yml)
  are this doctrine wearing a costume: **trained** by before/after examples and natural-language
  instructions (play), those instructions **compiled** to deterministic procedural code (lift),
  with an escape hatch that **calls back out to an LLM** for the hard 1% (advice, fuzzy matching,
  whimsy). Cheap by default, intelligent on demand — and the before/after pairs double as the
  regression test. Each worm is a module with two cursors for an interface.

🐒✋ *A skill is a promise; a package is a promise kept without asking the LLM twice.*
