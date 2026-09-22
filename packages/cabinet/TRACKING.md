# Tracking: how a photodetector becomes a pointing device

A light pen reports *when* it sees light, never *where it is*. That
asymmetry splits its two uses:

- **Pointing at existing content is free.** The pen sees the lightbutton
  or line being drawn beneath it; the hit freezes the display and the
  display-file address identifies the item. The IDSP/location-3 dispatch
  machinery, no scan required.
- **Drawing needs a position source where nothing exists yet** — so
  software displays something *for the pen to see* and moves it wherever
  the pen goes. That is the tracking cross, and the machinery around it
  is the subject of this note. All of it is in SYMELEC's 1972 listing,
  all of it runs in the cabinet today, and the acceptance test
  `SYMELEC's 1972 tracking loop follows the virtual pen` exercises it
  end to end.

## The four pieces, from the listing

**The cross is a self-modifying display file.** `TRACK` (0o5637) is 13
display words: a pen-enabled point whose two position words are named
core locations, followed by tiny stroke vectors forming the cross:

```3349:3352:characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt
  367    5637/  34117  TRACK,   PAR PO PN SC0 IN7          /TRACKING CROSS
  368    5640/ 220400  YCROSS,  POV PO 400
  369    5641/ 100400  XCROSS,  POH VE 400
  370    5642/    400           VEC 0 1
```

Moving the cross means depositing new coordinates into `YCROSS`/`XCROSS`
— the CPU patches the display processor's running program in place.

**`TRCR` (0o5466) recenters on every hit.** The pen interrupt reads the
packed hit coordinates with `IDRC` twice — one left rotate for Y, four
right rotates (a shift of 8) for X, each masked with `1776`. That
unpack is the receipt for the cabinet's packing formula
`(x>>1)<<9 | (y>>1)`, and the unit test asserts the round trip. Then
`POSCR` adds the position-word opcode bases and deposits into
`YCROSS`/`XCROSS` — and ANDs with `GRID`, so the logical point SYMELEC
stores is grid-snapped while the cross follows the pen smoothly.

**`SRAST` (0o5656) is the reacquisition net — local, not full-screen.**
Immediately after the cross in the display file sits an 11-word "SMALL
RASTER": an expanding zigzag of vectors at scale 3 (8–32 grid units per
stroke) swept around the cross position. If the pen slipped off the
cross arms between frames, the wider net catches it and the next hit
recenters. The interrupt handlers modulate its parameter word — the pen
interrupt deposits `100177` ("HIGH INTENSITY"), the stop-code interrupt
deposits `100170` ("LOW INTENSITY") — brightening the net while
tracking is hot, dimming it between.

**Edges and dispatch.** `EDGEV`/`EDGEH` — the edge-violation interrupts
— clamp the cross back on-screen when a drag hits the boundary. And the
cross carries its own pen-dispatch identity: the display file deposits
a `JMP STRCR` linkage before jumping to `TRACK`, so a hit anywhere on
the cross or raster routes to `TRCR` with no mode setup:

```3052:3057:characters/heinz-lemke/sources/pixie-assembler-listing-1972/symelec-listing.txt
   85    5304/ 404441  TOTEMP,  DJP TEMPDF                 /TO TEMPORARY DISPLAY FILE
   86    5305/ 160000           PAR SB
   87    5306/ 765310           DJS SB , 2
   88    5307/ 606252           JMP STRCR
   89    5310/ 360003           DDS SB 3
   90    5311/ 405637           DJP TRACK                  /TO TRACKING CROSS
```

## Acquisition without a scan: the Promethean handoff

SYMELEC never rasters the whole screen to find the pen. Initial
acquisition is "put the pen on something already lit": the cross parks
at a known start position (`TEMPX, 400` — the center-left of the grid),
and `ENDPOI` ("PUT CROSS ON ENDPOINT OF LINE") warps the cross to a
picked line's endpoint, where the pen is already sitting. Pointing
hands off to tracking with no search. The full-screen locate scan of
light-pen folklore exists on other systems; PIXIE's design makes it
unnecessary.

Name the pattern for what it is. A pen with no fire of its own must be
lit from something already burning — and the lightbutton is the hearth
that never goes out. Touch the pen to a button and the hit hands the
flame to the tracking cross, which from then on travels with the pen
tip as its own portable light. **That is why the menu can get out of
the way while you draw**, as the 1969 film shows: the button's job was
ignition, not steering. Once the flame is handed off, steering belongs
to the cross-and-raster loop, and the drawing surface is all yours.
Pie menus inherit the principle directly — flare up at the press, hand
the selection its fire, retreat.

The retreat is not total, and the residue is the interesting part: the
*control* lightbuttons ride with the cross — `LBD` is commented
`/LB'S AT CROSS`, its single-letter buttons positioned by small vector
offsets (`PSD/PAD/PRD/PCD/PLD/PXD`) around the tracking position. The
big menu retreats; a small radial menu of in-flight verbs follows the
pen. 1972.

## How complex

Small — roughly **50 CPU instructions plus ~27 display words**:

| Piece | Size |
|---|---|
| `TRCR` read + unpack | 14 instructions |
| `POSCR` patch + grid snap | 14 instructions |
| `EDGEV` + `EDGEH` clamps | ~20 instructions |
| `TRACK` cross | 13 display words |
| `SRAST` raster | 11 display words |
| dispatch fragment + mode flags | a handful |

The display processor carries the real load: the cross redraws itself
every refresh for free, and the CPU runs only on interrupts.

## It just happens

Tracking needs no trigger. The boot display file draws the cross parked
at (0o400, 0o400) with the `JMP STRCR` linkage already deposited, the
pen interrupt is wired at boot, and the first hit recenters. The
acceptance test proves it in three movements:

1. **Acquire** — park the virtual pen on the parked cross; hits
   recenter it in place.
2. **Drag** — 25 small steps; `TRCR` → `POSCR` patch `XCROSS`/`YCROSS`
   in core and the cross follows to within a raster-net radius.
3. **Lose** — teleport the pen far beyond the `SRAST` net; no hits, the
   cross stays behind. The authentic failure mode, asserted.

No emulator surface was added for this: interrupts, `IDRC` packing,
`IDRS` resume, edge flags, and `DDS` linkage were already the contract.
The 1972 software does the tracking.

## On the web bench

The pointer is secretly a true position source, which sets up the
`honest`/`assist` dial in [DESIGN.md](DESIGN.md): honest mode feeds the
pointer to the pen input and lets this machinery track — including the
period-correct maximum drag speed (the `SRAST` net radius times the
refresh rate) and the period-correct way to lose the cross. Assist mode
teleports. The demo is honest mode, because the point of the cabinet is
that the cross follows the mouse *because 1972 software tracks it*.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [SIMH-MAP](SIMH-MAP.md)
