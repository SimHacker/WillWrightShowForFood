# Skeleton — animal herding

**Status:** not started  
**Spec:** [`../animal-herding.md`](../animal-herding.md)

## Job

Simulate flocks on **2D pastures** (block polygons) and **1D paths** (road edges). Gates transfer
between spaces. Lures/repels, burst actions, collie agents. Consume/produce hooks to garden.

## Modules

| Module | Input | Output |
|--------|-------|--------|
| `load_pasture` | block id + fence YAML | pasture polygon |
| `load_gate` | gate YAML | pasture ↔ edge portal |
| `tick_flock` | flock state + fields | updated positions |
| `diffuse_pasture` | flock in 2D polygon | positions |
| `walk_path` | flock on edge graph | edge progression |
| `apply_lure` | item equip + TTL | attract/repel field |
| `burst_action` | disperse \| converge | instant velocity impulse |
| `tick_collie` | collie policy | nudge nearest flock |
| `transfer_gate` | open gate + throughput | pasture ↔ path counts |
| `consume_produce` | flock at cell | garden/brew deltas |
| `graze_layer` | flock + layers at edge | bite strength; poo spawn |
| `hill_climb_taste` | flock + diet vector | next edge/direction |
| `tick_slime` | slime mass on graph | extend/retract; subdivide/join |
| `render_cozy` | state | MapLibre overlay GeoJSON + style hints |

## v0 → v2

- v0: pigeons on one path; whistle converge; pollinate bed on contact
- v1: pasture + gate + salt lick; collie patrol
- v2: multi-species; cozy vs realistic style toggle
- v3: semantic layer grazing; lifecycle; vegan mode
- v4: slime mold multi-cell characters; subdivide/join

↑ [`../animal-herding.md`](../animal-herding.md)
