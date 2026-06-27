# rigs/

**Reproducible rig definitions** — extensible yaml with full lifecycle:

**download → install → configure → use → replicate → mash up**

Schema: [`../schemas/rig-schema.yml`](../schemas/rig-schema.yml)

| File | Rig |
|------|-----|
| [`_TEMPLATE.rig.yml`](_TEMPLATE.rig.yml) | Copy me |
| [`artisanal-vscode.rig.yml`](artisanal-vscode.rig.yml) | Hand-only VS Code |
| [`stick-shift-composer-moollm.rig.yml`](stick-shift-composer-moollm.rig.yml) | Host seed — stick shift + Composer + MOOLLM |

**Submit yours:** PR `rigs/<slug>.rig.yml` + line in [`INDEX.yml`](INDEX.yml). Compete on [**Micropolis AI Drag Race**](../process/micropolis-ai-drag-race.yml).

**Mash up:** `extends:` parent rig + `lifecycle.mash_up.graft` — breed technique DNA honestly.

See [`../process/repo-show-format.yml`](../process/repo-show-format.yml) · [`../process/code-that-spec.yml`](../process/code-that-spec.yml)
