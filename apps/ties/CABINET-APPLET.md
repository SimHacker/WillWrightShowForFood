# The cabinet applet — a running PDP-7 inside a HyperTIES article

The lineage demo, closed into a loop: HyperTIES (1988, the embedded-menu
ancestor) transcludes PIXIE (1969–72, the radial-menu ancestor) **running
live** — SYMELEC's own lightbutton ring on the Type 340, operated by the
reader's pointer standing in as a light pen. The menus are not a
screenshot and not a re-creation; they are the 1972 display file,
executed, pen-tested, drawn.

This fulfils [WEB-BENCH](../../packages/cabinet/WEB-BENCH.md) item 8
("a cabinet manifest per page, PCjs-style") with a mechanism the ties
app already owns: the fenced YAML applet block.

## The block

````markdown
```yaml cabinet
machine: pdp7                  # cabinet plugin set
program: symelec               # .oct + literals, resolved from the repo
boot: idla                     # run until the display starts, then settle
pens: [pointer]                # reader's pointer joins the quiver
mode: honest                   # honest | assist (DESIGN.md pen modes)
size: 512                      # CSS pixels; grid is always 1024
```
````

Same contract as every ties applet: **a reader that has not loaded the
applet module still shows readable YAML** — graceful degradation, the
house rule. A reader that has loaded it replaces the block with a live
tube.

## The component

`CabinetApplet.svelte`, thin by design — every hard part already exists
in [`@wwsff/cabinet`](../../packages/cabinet/):

- boot: `loadOct` both files, run in chunks off-thread-friendly budgets
  until `IDLA` (the same chunked loop as the acceptance test);
- draw: stroke the segment log to a canvas each `requestAnimationFrame`,
  cycles-per-frame budget, pause on `visibilitychange`;
- pen: `setPointerCapture` + `touch-action: none`, pointer position →
  `LightPen.point()` in grid coordinates; `pointerType === "pen"` and
  touch get wider apertures (WEB-BENCH item 6);
- print screen: a control that downloads `toSvg(lastFrame)` — every
  reader can take home a provenance-carrying snapshot.

No new emulator surface. The applet consumes the same four seams as
every other consumer: loader, run budget, segment log, pen input.

## Corpus discipline

The converted 1988 corpus in `examples/` is derived and stays derived.
The PIXIE article is **authored**, in its own database directory — new
prose about a 1972 program, linked into the reader like any article,
with the cabinet block where a `picture` block would go. Its `definition`
(the single-click preview) can be the boot-picture SVG, static; the
double-click article gets the live machine.

## Ladder

1. **Static first:** the article ships with `snapshots/symelec-boot.svg`
   as its picture — zero new code, corpus entry proves the article side.
2. **Live tube:** `CabinetApplet.svelte` boots SYMELEC, draws frames.
   Accept: the boot picture matches the static SVG pixel-for-pixel.
3. **The pen:** pointer joins `pens`, tracking cross follows (PIXIE's
   `TRCR` doing the work). Accept: pen-hit a lightbutton, location 3
   carries the dispatch linkage.
4. **Two pens:** a second pointer (multitouch) or a presence-channel
   visitor. Stock SYMELEC cannot tell; an IDPN-aware build can.

↑ [GLANCE](GLANCE.yml) · [FORMAT](FORMAT.md) ·
[cabinet DESIGN](../../packages/cabinet/DESIGN.md) ·
[WEB-BENCH](../../packages/cabinet/WEB-BENCH.md)
