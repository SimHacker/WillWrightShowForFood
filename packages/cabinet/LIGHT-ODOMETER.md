# The light odometer: how much light a program puts on the 340

A plan, not built yet. How much light the Type 340's beam puts into the phosphor, over the life
of a session and over the last second, minute and quarter hour, the way UNIX shows its load
average. ^T shows it on the teletype paper, with the machine's other stats. A cheap estimate
from the strokes the 340 already emits stands in for a phosphor simulation; when the WebGPU
phosphor runs, its own measure takes over.

It sits next to [BEAM-AND-PEN.md](BEAM-AND-PEN.md), which wants the same beam timeline, and
[GUIDE-PHOSPHOR.md](reference/GUIDE-PHOSPHOR.md), which describes the strokes.

## The measure

Light put in is dwell times beam strength, summed over every spot the beam lights. The 340's
strokes already carry what that needs: each `Segment` (plugins/type340.ts) has its kind (point,
vector, character), its ends, `intensity` 0 to 7, `scale`, the pen bit, the display-file address
and the cycle it was drawn at.

- **Spots.** A point is one spot. A vector is one spot a raster step: its length over its scale.
  A character is its dots.
- **Weight.** Each spot counts `w[intensity]`, a table of 8, full intensity 1. Linear until we
  know the 340's curve.
- **Unit.** The full-intensity spot. Joules or lumens need the beam current and voltage, the
  dwell per step, and the efficiency of the 340's phosphor; those are questions below, and the
  unit changes only by a constant when they are answered.

The sum is one pass over each refresh frame's segments, which the cabinet makes anyway.

## The metrics

- **Odometer.** Light since the machine was switched on, and since the cabinet first ran this
  program (kept with the program's other settings in the browser).
- **Rate.** Light a second, from cycles, not the wall clock, so it means the same at 0.01× and at
  MAX.
- **Load averages, three resolutions.** Light a second, damped exponentially over 1 second,
  1 minute and 15 minutes of machine time, as UNIX damps its run queue over 1, 5 and 15 minutes:
  each sample `avg = avg·e^(−dt/T) + rate·(1 − e^(−dt/T))`, sampled once a refresh. Three numbers,
  so a flash, a busy minute and a steady glow read differently.
- **Duty.** The fraction of machine time the beam is lit. Tells a busy display from a bright one.
- **Refreshes a second and the longest gap.** The flicker a viewer would have seen: a display file
  that takes too long to draw goes dim and blinks on real phosphor.
- **Overdraw.** Spots lit more than once in a refresh, as a fraction. A program that redraws the
  same dot wastes beam and burns that dot.
- **Burn map.** The same weights added into a 64×64 grid of the screen, decaying never: where this
  program would have burned the tube. An overlay on the display, and a heatmap image to save.
- **The pen.** Hits a second, and the light under the pen when it last saw the beam, which is what
  the photocell needed (BEAM-AND-PEN.md).

## ^T

One line on the paper, without the program's help, in the teletype driver on the host side:

```
SPACEWAR  PC 1234  2.0x  load 0.42 0.38 0.31  light 1.2M spots  duty 18%  41 Hz  burn 3.1%
```

- **The OS adds its own.** The cartridge's OS can register a status hook, and ^T prints what the
  hook returns after the cabinet's line: UNIX its process table and what each waits on, Forth its
  stacks, a game its score.
- **Once a second.** ^T is rate-limited to about one line a second, and autorepeat is ignored.
  At UMD the ^T hacked into the kernel's tty driver had the same limit, because holding it down
  bogged the system down and raised the very load it reported.
- **Not in the machine.** The line is printed by the teletype, not typed to the program, so it
  never reaches the PDP-7's keyboard buffer and costs the emulated machine nothing.

## The phosphor takes over

All of it reads one small meter, so nothing that shows a number knows where it came from:

```ts
type LightMeter = {
	frame(f: Frame): void; // each refresh's segments, with cycle stamps
	total: number;         // full-intensity spots since power on
	rate: number;          // a second of machine time
	load: [number, number, number]; // 1 s, 1 min, 15 min
	burn: Float32Array;    // 64x64
	source: 'estimate' | 'phosphor';
};
```

The estimate implements it from segments. When the WebGPU phosphor simulation runs, it reports
the excitation it actually deposited each frame, and a reduction on the GPU sums it and its burn
texture. The meter takes those in place of the estimate and says `source: 'phosphor'`; the load
averages and the odometer carry on from the same totals, so the switch is not a jump to zero.

## Uses

- The dance: light a second is a gauge like speed and free memory, so a brighter screen plays
  louder or fuller.
- Comparing programs and versions: the same game before and after an optimization, in light and
  overdraw as well as cycles.
- Museums: a session's burn map is what the 340 at a museum would have suffered, and a reason
  given in numbers for running the emulator, not the tube.

## Order of work

1. The estimator and the meter, in packages/cabinet, with tests on known display files: a single
   point, a full-screen vector, a character string at each scale and intensity.
2. Odometer, rate, duty and the three load averages in the PDP-7 page's register panel.
3. ^T in the teletype driver, rate-limited, with the OS status hook.
4. The burn map overlay and its saved image.
5. The WebGPU phosphor's measure, when that simulation is in (BEAM-AND-PEN.md, step 4).

## Questions

- The 340's dwell per vector step and per point, and its intensity curve: the manual or Lars.
- Its beam current and accelerating voltage, and its phosphor's efficiency: a museum with a running
  340, or the CRT's data sheet.
- Whether real 340s burned, and where: an operator's memory is worth more than the model.
