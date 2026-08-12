# Skeleton — exposure log

**Status:** not started  
**Spec:** [`../exposure-pac-man.md`](../exposure-pac-man.md)

## Job

For each traversed edge, tally **place-types on left and right** (frontage, not just centroid distance).

## v0 pellets

`residence`, `cafe`, `library`, `park`, `grocery`, `school`, `playground`, `hospital`, `bridge`, `tree_row`

Map from OSM tags — see exposure-pac-man table.

## Outputs

- Per-edge: [`exposure-pac-man` sketch](../exposure-pac-man.md#semantic-edge-log-sketch)
- Per-ride rollup: counts + meters frontage + **novel types today**

## Demo bar line

> Passed 83 homes, 14 cafes, 3 playgrounds, 2 bridges.

↑ [`../demo-bar.yml`](../demo-bar.yml)
