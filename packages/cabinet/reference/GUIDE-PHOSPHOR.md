# The P7 tube: phosphor

The 340's 16ADP7 tube has a double phosphor, P7. Where the beam hits, a bright blue flash, gone
in microseconds; under it a yellow-green layer that glows on for seconds. The light pen sees only
the blue flash. People see mostly the green afterglow. The same tube family drew Spacewar on the
PDP-1's Type 30.

## What the bench does now

- **The segment stream is the picture.** The 340 emulator emits every stroke with its intensity,
  scale and the cycle it was drawn at; nothing else draws.
- **Integration, not the last frame.** The 340 refreshes far faster than the browser draws. The
  applet keeps the last 48 refreshes and gives each stroke a brightness from the fraction of them
  that drew it, as the eye did on glass. A blinking ring around the cross reads as dim, not as
  flicker.
- **Four knobs** (`PHOSPHOR` in `CabinetApplet.svelte`): brightness, contrast, gamma and floor.
  Floor and gamma lift the 340's dimmest intensities so they read on a modern screen.
- **Canvas 2D,** green on near-black, 1024 by 1024.
- **Steady or machine.** "Machine" shows the 340's own refreshes, flicker and all, as a slow CPU
  would on real glass; "steady" draws memory as it is now through the shadow 340, every frame.

## Plans

- **Next:** the four knobs in CONFIG, with a high-contrast preset
  ([ROADMAP §2](../ROADMAP.md#2-contrast-display-knobs-in-config)).
- **Will:** borrow Lars Brinkhoff's GLSL
  [crt-simulation](https://github.com/larsbrinkhoff/crt-simulation), written for the Type 30 and
  340 with photos of a real 340, once he adds a licence: blue flash and green decay as two layers
  with their own curves, in WebGL2 first, then WebGPU, fitted against calibration footage
  ([AM-RADIO.md](../AM-RADIO.md)). Norbert Landsteiner's masswerk Spacewar shows the dual
  phosphor on canvas 2D is enough for a first version; its code isn't openly licensed, so learn
  from it and ask before copying ([WEB-BENCH.md](../WEB-BENCH.md)).
- **Will:** colour. Default P7 green; each pen an RGB colour, and what it draws painted in it;
  procedural colour (gradients, marching ants, blink, flicker) later
  ([ROADMAP §14](../ROADMAP.md#14-small-items)).
- **Will:** watch the beam. At slow speeds, draw each stroke growing from its start at the 340's
  own pace, using the cycle stamps, with the spot on top; the decay runs in real time while the
  machine crawls ([PORTRAIT.md](../PORTRAIT.md#slow-mode--watch-the-beam-work)).
- **Could:** the tube in 3D: the canvas as a texture on curved glass inside the photographed
  PDP-7, with reflections ([PORTRAIT.md](../PORTRAIT.md)).
- **Could:** measure a real P7 tube, if a museum lets us film one, and fit the curves to it.

↑ [GUIDE](GUIDE.md) · [reference library](README.md)
