# Git ↔ Postgres — yaml-jazz as source of truth

**Schema-strict in Postgres; comments and unknown fields in Git.** Humans and LLMs edit
yaml-jazz in GitHub; **GitHub Actions** sync into Postgres for GIS, sim, vectors. Changes
in Postgres merge **carefully** back to Git without losing comments.

## Split

| Git (PR-worthy, intent) | Postgres (hot, queryable) |
|-------------------------|---------------------------|
| Full yaml-jazz + comments | Typed rows per schema |
| Unknown fields, `# solidarity` | Stored in `payload_raw` or ref only |
| Game contracts, factory recipes | `emitters`, `layer_strength`, graph geom |
| Ride event jsonl archive | `territory_events`, replay checkpoints |
| Branch ride forks | optional mirror + `git_ref` pin |

## Sync GitHub → Postgres (Action)

```
on push to territory/**, story/**, garden/**:
  1. Parse YAML against JSON Schema / pydantic (known fields)
  2. Upsert typed columns
  3. embed_full = embed(file_text_with_comments)
  4. embed_sim = embed(schema_canonical_json_only)
  5. llm_tags_10 = taxonomy plugin (optional on path)
  6. Invalidate materialized views for affected polders/layers
  7. Pin payload_sha on layer rows
```

**Embed includes comments** so author intent affects similarity — "don't complete" sits
near other commons tags because the comment said so, not because a field name matched.

## Sync Postgres → Git (careful merge)

When sim or admin UI edits Postgres (pump τ, gate open, offering):

```
1. Export row → canonical schema fields only
2. Load existing Git file by payload_ref + sha
3. Three-way merge: base sha, Git head, PG export
4. Preserve all comment blocks and unknown keys from Git
5. Apply field updates from PG to schema portion only
6. PR or bot commit; never silent overwrite of jazz
```

Comments never live **only** in Postgres unless explicitly copied to `comment_snapshot` for audit.

## Pointer pattern

```yaml
# postgres layer row (conceptual)
layer_id: L-0042
payload_ref: github:org/repo@abc123:territory/payloads/foo.yml
payload_sha: abc123
embed_full: vector
embed_sim: vector
filter_tau: 0.55        # may originate PG edit → merge back to polder YAML
```

## Why both embeddings

| Embedding | Controls |
|-----------|----------|
| **embed_full** | LLM bots, author "what rhymes", MOOLLM player proximity |
| **embed_sim** | Deterministic factory join, regression tests, sim without LLM |

See [`embedding-views.md`](embedding-views.md) for plugin list.

↑ [`map-game-platform.md`](map-game-platform.md) · [`oni-map-platform.md`](oni-map-platform.md)
