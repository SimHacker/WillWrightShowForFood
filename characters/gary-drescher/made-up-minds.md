# Made-Up Minds 🧠✨

*Gary Drescher's pun — and Will Wright's lifelong project — meet the LLM era*

> *"Minds are built, not filled."* — the constructionist through-line

## The pun (it stacks)

**Gary Drescher** titled his 1991 book [*Made-Up Minds*](https://mitpress.mit.edu/9780262517089/made-up-minds/):
a constructivist AI thesis — minds **made up** layer by layer from experience, not downloaded fully
formed. Piaget you can **run**.

**Will Wright** has spent forty years teaching millions of people to do the same thing in play:
**make up minds** — SimCity citizens, Sim agents with Motive bars, Proxi characters, player stories.
Not metaphors. Executable doll-people whose inner life is *implied* more than simulated, yet feels
real enough to mourn, marry, and mod.

Same pun, three readings:

| Reading | Who | What gets "made up" |
|---------|-----|---------------------|
| **Constructivist** | Drescher / Piaget | Schemas — context → action → result — discovered from sensorimotor experience |
| **Microworld** | Will Wright | Agents, motives, possibility spaces — accreted until a toy world lives |
| **Repo Show** | This repo | Soul-files in git — portrayals, characters, skills — authored with consent |

Add a fourth, timely layer: **LLM characters** (Palm, Slats, audience sims) who can *read their own
YAML* — made-up minds that know they're made up. See [Palm's Will Wright Soul For Food](../palm/will-wright-soul-for-food.md).

Will told Terry Winograd in 1996 that simulating real people was nearly hopeless — best you can do is
prop up a convincing illusion. The illusion worked better than he predicted. Drescher named the
*mechanism* behind building illusions that learn. Will shipped the *mass hobby* of building them.

**Interview planned:** we'd love Gary on camera with Will — two different answers to the same question:
*how do made-up minds come to feel real?*

---

## Drescher's thesis (MIT, Marvin Minsky's orbit)

Gary's **MIT PhD** work became the **schema mechanism**:

```
Context → Action → Result
```

An agent starts with almost nothing. It **discovers** reliable patterns (**marginal attribution**),
invents hidden variables when predictions fail (**synthetic items**), and composes **schemas** the
way a Piagetian infant builds object permanence — by acting, not by being told.

Marvin Minsky hailed it as a landmark in learning theory. It sits between Society of Mind's agents
and Piaget's developmental stages: **minds made up from parts that accrete.**

The wall, in 1991: **symbol grounding**. Items were opaque ON/OFF tokens. The mechanism had to
correlate everything from scratch — no commonsense, no language, no "postgres is a database."

---

## Leela AI — where the thesis still runs

**Gary Drescher** is an **adviser to Leela AI** and a longtime friend of **[Henry Minsky](../henry-minsky/README.md)**
(co-founder/CTO) and **[Milan Singh Minsky](../milan-singh-minsky/README.md)** (VP Product) — leaders
carrying MIT AI Lab constructivism into industrial visual intelligence.

Henry reimplemented the schema mechanism in Python — **`pyleela.brain`** in Leela's codebase
(`Schema.py`, planner, synthetic items). **[Steve Kommrusch](../steve-kommrusch/README.md)** works on
**Piaget-schema learning** at Leela — program repair, verifiable equivalence, and the bridge back to
Drescher's book.

Leela's frame: **neuro-symbolic AI** — neural perception (powerful, opaque) + symbolic schemas
(answer *why*). Not either/or. Layered.

Curated live thread (2024–2026): [`schemas-vectors-and-llms.md`](schemas-vectors-and-llms.md) — vectors,
Schema Networks, neural cellular automata, the **200-foot car wash** planning failure, Gary's
questions back.

---

## MOOLLM — operationalized as skills

Don and Leela dog-food **[MOOLLM](https://github.com/SimHacker/moollm)** — a microworld OS where
Drescher's ideas are not just cited but **runnable**:

| Drescher concept | MOOLLM skill | What it does now |
|------------------|--------------|------------------|
| Schema mechanism | [`schema-mechanism`](https://github.com/SimHacker/moollm/tree/main/skills/schema-mechanism) | Context → Action → Result; marginal attribution; synthetic items |
| Build & compose schemas | [`schema-factory`](https://github.com/SimHacker/moollm/tree/main/skills/schema-factory) | Ingest, lint, compose — Henry's factory pattern as Anthropic/MOOLLM skill |
| PLAY → LEARN → LIFT | [`play-learn-lift`](https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift) | Explore → stabilize schemas → publish reusable artifacts |
| Schemapedia | [`schema`](https://github.com/SimHacker/moollm/tree/main/skills/schema) | One registry — Drescher causal units *beside* JSON Schema, frames, K-lines, SQL |
| Constructionism | [`constructionism`](https://github.com/SimHacker/moollm/tree/main/skills/constructionism) | Learn by building microworlds — Papert's room, Drescher's mechanism |

**Why LLMs complete the vision** (MOOLLM's phrase): the Lisp and Python implementations had rigor but
no semantics. Items were tokens. An LLM trained on the world, people, code, and logic can **ground**
the symbolic terms in YAML Jazz comments — imagine theories ([`schema-factory`](https://github.com/SimHacker/moollm/tree/main/skills/schema-factory)),
explain evidence chains, and lift stable patterns into skills **without** losing Drescher's causal
discipline.

> *"The YAML provides the skeleton; the LLM provides the soul."*

That line appears in MOOLLM's schema-mechanism skill — and rhymes with [Palm's incarnation ethics](../palm/will-wright-soul-for-food.md)
and Will's **soul-files** crossing games.

---

## Show segments we'd love

1. **Made-Up Minds, remade** — build on Henry's Python schema factory *with* an LLM for grounding; compare 1991 Lisp, 2020 Python, 2026 skills.
2. **Will meets Gary** — microworld motives vs schema mechanism; player-made minds vs learned schemas; data portability as moving souls between worlds.
3. **The 200-foot car wash** — when LLMs return the common case instead of planning (live thread material).
4. **Good and Real** — determinism, choice, acausal cooperation — if Gary wants the philosophy turn.
5. **Leela group episode** — with Henry, Milan, Steve — neuro-symbolic AI on the whiteboard.

Show seed: [`repo-shows/gary-drescher/`](../../repo-shows/gary-drescher/README.md)

---

## Read next

| | |
|--|---|
| **Landing page** | [`README.md`](README.md) |
| **Leela thread digest** | [`schemas-vectors-and-llms.md`](schemas-vectors-and-llms.md) |
| **Invitation** | [`invitation.md`](invitation.md) |
| **Will Wright** | [`../will-wright/README.md`](../will-wright/README.md) |
| **Marvin Minsky** | [`../marvin-minsky/README.md`](../marvin-minsky/README.md) |
| **Constructionist trail** | [`../../process/trails/constructionist-lineage.md`](../../process/trails/constructionist-lineage.md) |
| **MOOLLM schema-mechanism** | [skills/schema-mechanism/SKILL.md](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/SKILL.md) |

---

↑ [Gary Drescher](README.md) · [Repo Show](../../repo-shows/gary-drescher/README.md)
