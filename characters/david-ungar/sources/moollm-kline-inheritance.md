# MOOLLM k-line inheritance — Self's simplicity for LLMs

Public show note (Don's framing). Ties Self × MOOLLM to the OpenLaszlo / Declare reunion.

## The move

Inherit by **naming**, don't **humansplain** what's already in latent space
([no-ai-humansplaining](https://github.com/SimHacker/moollm/tree/main/skills/no-ai-humansplaining)).

MOOLLM's object system multiply-inherits from well-defined systems via different **k-line types**
([k-lines](https://github.com/SimHacker/moollm/tree/main/skills/k-lines)):

| K-line type | Example | What it activates |
|---|---|---|
| Paper (title + authors + venue) | **Self: The Power of Simplicity** — Ungar & Smith, OOPSLA 1987 | Prototype object system in training data + bibliography |
| US patent number | **[US 5,187,786](https://patents.google.com/patent/US5187786A)** — Densmore & Rosenthal | Paths/shell → executable object tree (expired; NeWS/TNT lineage) |
| Ordinary word / see-also mixin | `the Unix file system`, `git`, `github`, `prototype` | Latent meaning **and** a MOOLLM skill |

`prototype` is special: one word → Self idea-space **plus**
[`skills/prototype`](https://github.com/SimHacker/moollm/tree/main/skills/prototype).

## Accessibility on three axes (constitutional)

Lifted to MOOLLM constitution — not merely a yaml-jazz taste call:

- **Constitution:** [kernel/constitution-core.md §3](https://github.com/SimHacker/moollm/blob/main/kernel/constitution-core.md) — *Three-Axis Accessibility (why we Jazz)*
- **Protocol K-line:** `THREE-AXIS-ACCESSIBILITY` in [PROTOCOLS.yml](https://github.com/SimHacker/moollm/blob/main/PROTOCOLS.yml)
- **Skill (how):** [yaml-jazz](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz)

| Axis | What "access" means |
|---|---|
| **Human** | Readable, navigable, intent visible; comments respected |
| **LLM** | Snifftable, k-lineable, fits context; lean into training |
| **Program** | Parseable structure; round-trippable; machine-usable |

Prefer expressions that serve all three. JSON still has jobs (strict interchange) but orphans the
comment channel. Comments: **respect**, **round-trip**, **generate**.

## Skills as primary words

These fuzzy ideas get focused, contextualized, interconnected, and composed by importing them into
the microworld as **skills** — not only Anthropic-style skill files, but MOOLLM skills you can
**instantiate**, **inherit from**, use as **prototypes**; that carry **examples** and
**empathic templates**; that are **artifactories**. Skills are the primary words of the MOOLLM
language — purposefully aligned and harmonized with the training data and with each other.

## Skills mentioned (pointers)

| Skill | Role here |
|---|---|
| [yaml-jazz](https://github.com/SimHacker/moollm/tree/main/skills/yaml-jazz) | Three-audience YAML; comments as data; lean format |
| [k-lines](https://github.com/SimHacker/moollm/tree/main/skills/k-lines) | Symbolic activators / inheritance by name |
| [no-ai-humansplaining](https://github.com/SimHacker/moollm/tree/main/skills/no-ai-humansplaining) | Point at latent knowledge; don't respel |
| [prototype](https://github.com/SimHacker/moollm/tree/main/skills/prototype) | Skill + Self idea-space |
| [empathic-templates](https://github.com/SimHacker/moollm/tree/main/skills/empathic-templates) | Templates that travel with skills |
| [artifactory](https://github.com/SimHacker/moollm/tree/main/skills/artifactory) | Skills as artifact factories |
| [file-system-object](https://github.com/SimHacker/moollm/tree/main/skills/file-system-object) | Unix filesystem mixin |
| [github](https://github.com/SimHacker/moollm/tree/main/skills/github) | GitHub mixin |
| [speed-of-light](https://github.com/SimHacker/moollm/tree/main/skills/speed-of-light) | Colocate agents in one completion |
| [play-learn-lift](https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift) | Explore → patterns → share (skill lifecycle) |
| [skill](https://github.com/SimHacker/moollm/tree/main/skills/skill) | Meta — what a MOOLLM skill *is* |

Index: [skills/INDEX.yml](https://github.com/SimHacker/moollm/blob/main/skills/INDEX.yml) ·
MOOLLM: [SimHacker/moollm](https://github.com/SimHacker/moollm)

## Token economics (order of magnitude)

Pointing at the two load-bearing parents (~70–120 tokens of framing + k-lines) vs humansplaining
Self + the patent + Unix/git/GitHub/prototype-theory (~1,500–4,500+). Pointing wins by roughly
an order of magnitude — and that **stays true to Self's essential simplicity**: prototypes were
the means; simplicity was the thesis
([bibliography](https://bibliography.selflanguage.org/self-power.html)).

## Why this lands on the OpenLaszlo show

David Temkin's **Declare** does an analogous move: *declares* OpenLaszlo inheritance without
reimplementing LZX — reimagines for the LLM era
([declarelang sniff](../../david-temkin/sources/declarelang.md)). Ungar interviewed at Laszlo and
got it. Pull him into the reunion circle and/or solo Narcissa's Mirror.

↑ [invitation](../invitation.md) · [character](../README.md) · [openlaszlo show](../../../repo-shows/openlaszlo/)
