# Embedding views — math, factories, multi-plugin transforms

**Pure embeddings + concentration diffusion** is the default: fixed vector per layer, scalar
` s(L,e) ` moves on the graph. **Factories** add discrete algebra on top — combine, split,
measure — without replacing diffusion.

## What math on embeddings?

| Operation | Use | Notes |
|-----------|-----|-------|
| **Dot product** `q·e` | Hunt steering, filter τ, nostril | Primary navigation math — no interp needed |
| **Cosine** | Same, normalized | Compare layer to goal text after embed |
| **Weighted sum** `Σ w_i e_i` | Factory **output** embed from inputs | Weights from **measured concentrations** |
| **Linear interp** `(1-α)e_a + α e_b` | Rare — only if both layers same semantic class | Loses norm; re-normalize; prefer factory node |
| **Cluster centroid** | Taxonomy coalesce L0→L1 | Parent tag embed = mass-weighted mean |
| **PCA / random proj** | MapLibre color only | Display, not sim truth |
| **Nearest neighbor** | "Smells like this YAML" | pgvector / sqlite |
| **No arbitrary interp** | — | Midpoint of `cuisine:thai` and `feral_pigeon` is not meaningful unless factory recipe says so |

**Interpolation between arbitrary high-D embeddings is weak semantics.** Prefer:

1. **Diffusion** moves **mass**, not meaning.
2. **Factories** declare **recipes** with proportions.
3. **LLM** reads/writes **text**; re-embed after textual transform.

## Embedding factories (refinery / chemical plant)

When several **low-concentration specific** layers meet threshold at a node/edge:

```yaml
# territory/factories/generic-fruit-blend.yml
id: factory/generic-fruit-blend
inputs:
  - layer_class: L0
    min_s: 0.05
    tags_any: [tomato, apple, pear]
output:
  layer_id: ambient/L1-generic-fruit
  embedding: weighted_centroid(inputs)   # or fixed centroid in centroids.yml
  yield: proportional_to_min(input_s)    # ONI refinery feel
mode: combine   # combine | crack | filter
```

| Mode | Effect |
|------|--------|
| **combine** | N specifics → one **generic** layer + conserved mass |
| **crack** | One layer → **standard ingredients** in measured proportions (YAML recipe) |
| **filter** | Windmill τ — pass/reject by dot product |
| **measure** | Sample embed + report concentrations — dashboard only |

**Crack** example: `cuisine:dutch` ad → `{ herring: 0.4, cheese: 0.35, stroop: 0.25 }` as
child layer strengths — precise proportions in YAML, not fuzzy interp.

## LLM ↔ embed loop (text is source of truth in Git)

```
YAML jazz (Git) ──► embed_full(comments+schema)     ──► hunt / LLM proximity
                 ──► embed_sim(schema_only)        ──► deterministic sim join
                 ──► tags_10 = LLM abstract(payload) ──► taxonomy pyramid

text = decode(payload_ref)           # generate from stored YAML
payload' = LLM summarize|elaborate|abstract(text)
e' = embed(payload')                 # re-embed after edit; new layer or version
keywords = LLM weighted_keywords(text)  # cheap; no new layer until peed
```

| Step | Who |
|------|-----|
| Author edits yaml-jazz | Human/LLM in Git |
| `embed_*` plugins | CI / GitHub Action → Postgres |
| Sim tick | Uses `embed_sim` + strength only |
| Story / bots | Use `embed_full` + payload text |

## Multi-embedding plugin views

One Git object, many **projections** — like SQL views:

```yaml
# territory/views/embed-plugins.yml
plugins:
  raw_yaml_jazz:
    include: [comments, unknown_fields, schema]
    embed: true
    store: pgvector column embed_full

  schema_strict:
    include: [schema_fields_only]
    embed: true
    store: embed_sim

  tags_abstract:
    derive: llm_summarize_to_10_tags
    store: taxonomy_nodes

  maplibre_color:
    derive: pca_3(embed_sim)
    store: none   # ephemeral at build

  print_as_yaml:
    # for export back to Git — always lossless on comments
    format: yaml_jazz
```

**Print this object as YAML** for a plugin: `render(payload_ref, plugin=raw_yaml_jazz)`.

Factories and pumps run on **embed_sim**; authors and MOOLLM bots steer with **embed_full**
(comments included) — natural language control of "what is close to what."

↑ [`semantic-taxonomy-pyramid.md`](semantic-taxonomy-pyramid.md) · [`git-postgres-sync.md`](git-postgres-sync.md) · [`peerboard-and-brews.md`](peerboard-and-brews.md)
