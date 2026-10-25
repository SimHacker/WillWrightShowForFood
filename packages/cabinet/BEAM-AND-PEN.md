# Slow motion: how the light pen sees the beam

The plan: play the machine back slowly enough to watch the Type 340's beam draw each vector, with a
hand holding the light pen against the glass. You see the blue flash pass under the pen tip, the
photocell's signal rise past its threshold, the 340 freeze, the interrupt, and SYMELEC's 1972 code
move the tracking cross to where the pen is. Then the hand moves faster, the pen slips off the cross
and the net around it between two refreshes, nothing lights under it, and the cross is left behind.
The loss is shown as it happens, at a speed you can follow.

It builds on Lars Brinkhoff's phosphor simulator and on what the cabinet already does, and it is
one stretch of the chain in [CAUSE-AND-EFFECT.md](CAUSE-AND-EFFECT.md): hand, pen, photocell, flag,
interrupt, handler, display file, beam, phosphor, and the pen again.

## What exists

- **The beam, as a stream.** The 340 emulator emits every stroke with its intensity, its pen
  bit, the display-file address that drew it and the machine cycle it was drawn at
  ([GUIDE-PHOSPHOR.md](reference/GUIDE-PHOSPHOR.md)).
- **The phosphor, approximately.** A canvas pass integrates the last 48 refreshes, so a stroke's
  brightness is the fraction of refreshes that drew it. One green layer, no blue flash.
- **The pen, geometrically.** A stroke within the pen's aperture of the pointer counts as a hit;
  the 340 freezes, raises the flag, and the program reads the coordinates
  ([GUIDE-LIGHTPEN.md](reference/GUIDE-LIGHTPEN.md)).
- **Tracking, from the listing.** SYMELEC's cross, its `SRAST` net and the `TRCR` handler run as
  written in 1972, and a test acquires, drags and loses the cross ([TRACKING.md](TRACKING.md)).
- **Slow mode, as an idea.** A time-dilation knob so the beam crawls the display file
  ([PORTRAIT.md](PORTRAIT.md#slow-mode-watch-the-beam-work)).

## First, the honest limit

Today the cabinet loses the cross too easily, and that is our bug. The pointer is sampled once per
browser frame, so the pen sits still for about 47 of the 340's refreshes and then jumps, and
`SRAST` can only catch a jump of about 16 grid units ([ROADMAP §1](ROADMAP.md#1-tracking-the-pen-is-sampled-once-per-browser-frame)).
Heinz Lemke said losing the cross "wasn't much of a problem in 1969," and the arithmetic agrees: a
real pen saw every refresh, and SYMELEC's display file redraws about 2,800 times a second, so the
hand would have to cross the net's width in a third of a millisecond. Interpolating the pen along
its real path between frames has to come first, or the slow motion would show a failure the machine
never had.

With that fixed, the real limit is:

```
fastest drag  ≈  SRAST net reach per refresh  ×  refreshes per second
```

and refreshes per second depends on how much the display file draws. A cross on an empty screen is
nearly impossible to outrun; a busy circuit diagram on the same screen refreshes more slowly, and the
same hand loses the cross at a lower speed. That is the experiment worth showing: same pen, same
code, more picture, earlier loss. The numbers above are from ROADMAP's measurement and are
approximate until the timing is real (see the order of work).

## What to build

**1. The beam in time.** Each stroke already has the cycle it started at. Add how long it took: the
340 moves the beam in incremental steps of about 1.5 µs ([H-340 manual](reference/H-340_Type_340_Precision_Incremental_CRT_System_Nov64.pdf)),
so a vector's duration follows from its length, and a point's from its plot time. With display-file
fetches counted as memory cycles taken from the CPU, the beam's position is known at any instant,
not just per stroke.

**2. The phosphor, borrowed.** Lars's [crt-simulation](https://github.com/larsbrinkhoff/crt-simulation)
was written for these tubes, the Type 30 and Type 340, with a generalized Gaussian spot, separate
point and line shaders, a phosphor decay pass and photos of a real 340. It has no licence yet; ask
Lars to add one, then run it in WebGL2 and port it to WebGPU, fed by the cabinet's beam timeline
([WEB-BENCH.md](WEB-BENCH.md)). Two layers with their own curves: the P7's blue flash, gone in
microseconds, and its yellow-green persistence, lasting seconds. Norbert Landsteiner's masswerk
Spacewar! shows the same dual phosphor on canvas 2D; its code is not openly licensed, so learn from
it and ask before copying anything.

Decay can run in two clocks. In machine time, slowing the machine slows the flash too, so at a
millionth of real speed the blue flash under the pen lasts long enough to see, which is what the
pen sees. In wall time, as the portrait's slow mode describes, the green glow fades normally while
the beam crawls. Both are useful, and the view says which one it is showing.

**3. The pen as a photocell.** Replace "a stroke inside the aperture" with what the Type 370
measured: light. The pen's field of view is a small disk on the phosphor under the tip, larger and
offset when the pen is tilted or held off the glass. Its signal is the blue-flash intensity summed
over that disk, through the spot shape from step 2; it fires when the signal crosses a threshold,
after a short response time, and never sees the green afterglow. Check it against DEC's 1964
[light pen diagnostic](reference/DIGITAL-7-78-M_370LightPenDiag_Apr64.pdf), which already passes
with the geometric test; keep the geometric test as the fast path, and require the two to agree at
normal speed.

**4. The hand.** The tip's position over time, from any of:

- the mouse or a touch, using `getCoalescedEvents()` so the path is the real path;
- a recorded path, so the same drag can be replayed at any speed;
- the [DataHand](HAND-TRACKING.md) webcam hand holding a virtual pen, with the pen's tilt and its
  distance from the glass coming from the hand's pose;
- the portrait's animated operator, Heinz at the console, driven by a recorded performance.

Human motion runs in real time while the machine is slowed, so the scene player's separate clock
domains matter here: hand, PDP-7 cycles, 340 operations, and rendering
([PORTRAIT.md](PORTRAIT.md#scene-player-bodies-devices-and-connected-time-scales)).

**5. The slow-motion view.** The tube close up, with:

- the beam spot moving along the display file, the blue flash and the green glow behind it;
- the pen tip and its field-of-view disk on the glass;
- the photocell's signal as an oscilloscope trace under the tube, with the threshold line;
- at the hit: the 340 freezing, the pen flag, the interrupt, `TRCR` reading the coordinates and
  depositing into `YCROSS` and `XCROSS`, each step linked to its source line and scanned listing
  page, as in [CAUSE-AND-EFFECT.md](CAUSE-AND-EFFECT.md);
- `SRAST` brightening while tracking is hot and dimming between hits;
- a time scale that spans microseconds of beam to seconds of hand, with zoom on the dial.

Recorded walks through it are tours: authored, shareable, and steerable by anyone else.

**6. The demonstration.** A scripted tour, and a test:

1. Acquire: the pen on the parked cross, a hit every refresh.
2. Drag slowly: the cross follows; the signal fires on the cross's arms.
3. Drag faster: the pen slips off the arms and the net catches it.
4. Too fast: between two refreshes the field of view leaves the net, nothing lights under it, no
   hit, and the cross stays where it was.
5. Load a busy drawing and repeat: refresh slows, and step 4 comes at a lower hand speed.

## Order of work

1. Pen interpolation between browser frames ([ROADMAP §1](ROADMAP.md#1-tracking-the-pen-is-sampled-once-per-browser-frame)).
2. Memory-cycle timing in the PDP-7, with the 340's display fetches counted (shared with the
   [AM radio](AM-RADIO.md)).
3. Beam timing inside each stroke, in the segment log.
4. Ask Lars for a licence; the two-layer phosphor in WebGL2, fed by the beam timeline.
5. The photocell model, with the diagnostic and an agreement test against the geometric pen.
6. The slow-motion view with the signal trace and the source links.
7. Recorded paths, the DataHand pen, then the portrait's operator.
8. The demonstration as a tour and as a test, including the busy-screen case.

## Questions for Lars

1. Would you add a licence to crt-simulation so the cabinet can build on it?
2. Did you fit the decay curves to anything measured, or to the photos?
3. Do you know of measurements of the Type 370's photocell: field of view, threshold, response
   time?

↑ [README](README.md) · [TRACKING](TRACKING.md) · [GUIDE-PHOSPHOR](reference/GUIDE-PHOSPHOR.md) · [GUIDE-LIGHTPEN](reference/GUIDE-LIGHTPEN.md)
