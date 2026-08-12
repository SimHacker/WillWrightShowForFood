# Semantic taxonomy pyramid — ground-up tags from yaml-jazz

Dynamic **tag abstraction** from any payload: LLM compresses yaml-jazz (comments weighted)
to **10 abstract tags**; clusters **coalesce** into parent tags; hunt uses dot product on
embed **or** tag mass on graph. **Spore** lineage: poop packet + follow gradient.

## Pipeline

```
payload.yml (yaml-jazz)
  → LLM: tags_specific + tags_abstract[10]   # comments 2× weight in prompt
  → embed_full, embed_sim
  → spawn layer L0 on graph

taxonomy tick:
  → merge near-duplicate tags (embed distance)
  → if cluster mass > M: LLM propose parent tag → L1 node
  → repeat → pyramid
```

Same conservation as smell: tag **mass** diffuses; **bounce** recenters; factories **combine**
specifics into generics ([`embedding-views.md`](embedding-views.md)).

## Storage

```yaml
# territory/taxonomy/nodes/cuisine-thai.yml
level: L1
label: cuisine:thai
mass: 482
children: [tag/pad-thai-042, ...]
embedding: weighted_centroid(children)
```

Policy: `abstract_budget: 10`, `merge_tau`, `coalesce_min_mass` in `territory/taxonomy/policy.yml`.

## Pee-to-Pee

Tags are ads; roads distribute tag mass; P2P = no central ontology — **ground-up lexicon**
from peer yaml-jazz. New meme pees L0; if popular, parent tag emerges without committee.

↑ [`peerboard-and-brews.md`](peerboard-and-brews.md) · [`embedding-views.md`](embedding-views.md)
