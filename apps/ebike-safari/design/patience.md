# Patience — the civic meter

Stopping at lights, signals, and signs is easy to recognize. That wait mints
**patience**. Transgression ([`transgression.md`](transgression.md)) is not
the opposite meter. The two feed each other.

Same zero-speed event as the brake-lever flipper
([`city-record.md`](city-record.md)). Different grain. Flipper `STOP` is
*look* — you declared interest. Patience `STOP` is *wait* — the city asked,
and you stayed a reasonable time.

## They feed each other

A wait charges the wallet. A transgression can spend that charge — fuel for
the clockwise undo, the grass cut, the night cherry. A transgression can
also *mint* a claim on the next wait: you came in hot, the light is where
you settle. Daylight patience makes the full-moon tape affordable. The
night tape leaves a debt the morning lights pay down.

Two fluids on the same graph. They mix. Neither cancels the other.

## Recognize the wait

Snap the dwell to a **wait point** ([`wait-points.md`](wait-points.md)) —
OSM-born, ride-learned (anchor + radius, time of day and weekday, the
TomTom trick), or a pin someone dropped.

| Control | Tags (when OSM) |
|---------|------|
| Traffic light | `highway=traffic_signals`, `crossing=traffic_signals` |
| Stop sign | `highway=stop` |
| Yield / give way | `highway=give_way` |
| Crossing with signals | `highway=crossing` + signal |
| Drawbridge | `bridge=movable` / `bridge:movable=*` — fat typical, lottery |
| Ferry / bus / tram | terminal, stop, platform — gathering is the pastime; `p` = 0 |

A rolling stop mints nothing. Sitting all afternoon farms nothing. Credit
lands when dwell is in the **typical band for that wait point** at this
weekday and hour — start from a table by control type, then the envelope
learned from rides. Rush-hour lights have a longer typical. Empty 3am
give-ways have a short one. The map adapts as traces pile up.

Short of the band: no patience. The wait point's `p` may still draw a
transgression fine. Same pass, two meters, no light-color.

A **fake wait** — you performed the sit when the point was probably not
asking — still mints patience. You waited. Transgression may tick too
([`wait-points.md`](wait-points.md)).

```
delta = typical(node) * wait_quality * time_of_day * traffic
```

`wait_quality` is a hump: 0 below the band, 1 inside, decay above the cap.
Vampire clock inverted: daylight and the school-run *pay*. Late night is
cheap patience — the light is already with you.

## Spend it somewhere else

Points are a wallet, not a trophy at the pole. Mint here, spend there —
a garden bed that needs a turn, a wild edge that wants a visit, someone
else's wait you cover, a transgression that wants fuel. The engine emits
the mint and the spend. Stories interpret.

## Flowing heat map

The city shows **where patience has been generated**. Not a static
choropleth — a flowing field. Each credited wait is a pulse at the node.
Pulses follow the graph, pool at busy crossings, cool as they travel,
fade with time.

Rush hour the map runs hot along the arterials. Sunday morning it is a
few glowing dots. Full-moon night the patience field cools and the
transgression tape is the one that plays — the two fields still share the
graph; one running does not erase the other.

Viewer: the same MapLibre overlay as skywriting, a second channel.
Generation sites pulse. Flow is the heat moving down ways. Your wallet
is a number; the map is the civic weather.

## Outputs

`trips/{id}.patience.json` — `{ node, control, t, dwell, typical, wait_quality, time_of_day, traffic, delta, running }`

City field (rebuild from rides, same fade as brews):
`patience/nodes/{id}` pulses · `patience/ways/{id}` flow

↑ [README.md](README.md) · [transgression.md](transgression.md) · [city-record.md](city-record.md)
