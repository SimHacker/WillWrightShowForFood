# rigs/

**Reproducible rig definitions** — extensible yaml with full lifecycle:

**download → install → configure → use → replicate → mash up**

Each rig ships **`rigs/<slug>.rig.yml`** plus **`rigs/<slug>.SETUP.md`** — **Rig DNA**: emailable, sniffable markdown (why / what / CTA), canonical raw GitHub URLs for latest yaml, and an **LLM idempotent install protocol** that preserves user data in `.rig/<slug>/state.yml`. You read the head; you decide whether your agent runs the protocol.

Template: [`_TEMPLATE.SETUP.md`](_TEMPLATE.SETUP.md) · DNA schema: [`../schemas/rig-setup-dna.yml`](../schemas/rig-setup-dna.yml)

Schema: [`../schemas/rig-schema.yml`](../schemas/rig-schema.yml) · Challenge family: [`../process/challenges/retrocomputing-drive.yml`](../process/challenges/retrocomputing-drive.yml)

| File | Rig |
|------|-----|
| [`_TEMPLATE.rig.yml`](_TEMPLATE.rig.yml) + [`_TEMPLATE.SETUP.md`](_TEMPLATE.SETUP.md) | Copy me |
| [`artisanal-vscode.rig.yml`](artisanal-vscode.rig.yml) | Hand-only VS Code |
| [`stick-shift-composer-moollm.rig.yml`](stick-shift-composer-moollm.rig.yml) | Host seed — stick shift + Composer + MOOLLM |
| [`apple2-flair-lap.rig.yml`](apple2-flair-lap.rig.yml) + [`.SETUP.md`](apple2-flair-lap.SETUP.md) | Retro — ][ |
| [`pdp10-maclisp-flair-lap.rig.yml`](pdp10-maclisp-flair-lap.rig.yml) + [`.SETUP.md`](pdp10-maclisp-flair-lap.SETUP.md) | MACLISP on ITS |
| [`lisp-machine-symbolics.rig.yml`](lisp-machine-symbolics.rig.yml) | Hack-Off — Symbolics camp |
| [`lisp-machine-lmi.rig.yml`](lisp-machine-lmi.rig.yml) | Hack-Off — LMI camp |

**Submit yours:** PR `rigs/<slug>.rig.yml` + `rigs/<slug>.SETUP.md` + line in [`INDEX.yml`](INDEX.yml). Compete on [**Micropolis AI Drag Race**](../process/micropolis-ai-drag-race.yml).

**Mash up:** `extends:` parent rig + `lifecycle.mash_up.graft` — document forks in SETUP.md **Mod this rig** section.

See [`../process/repo-show-format.yml`](../process/repo-show-format.yml) · [`../process/code-that-spec.yml`](../process/code-that-spec.yml)
