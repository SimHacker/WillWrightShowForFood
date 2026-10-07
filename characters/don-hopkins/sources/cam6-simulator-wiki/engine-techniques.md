# CAM6 engine techniques, from Don's wiki notes

Harvested from the [wiki transcript](CAM6_Simulator.transcript.md). Each technique is Don's, in
CAM6.js, unless credited. The design discussion that grew out of them lives in moollm's
[cam-construction-set.md](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/cam-construction-set.md)
and [schedulers.md](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/schedulers.md).

## The inner loop

- **The gutter (Will Wright's trick).** Give the cell grid a one-cell border. Before each step,
  copy the wrapping edges into it. The rule then runs over the interior with no edge tests and no
  wrap arithmetic. SimCity's own CA loop in MicropolisCore (`CLIPPER_LOOP_BODY`) does the same.
- **The sliding 3×3 window.** Scroll a 3×3 window along each row and load only the three cells on
  its leading edge per step, so each cell is read once per row pass, not nine times.
- **Two buffers, pointer swap.** Past and future buffers swap pointers each step, so cells aren't
  copied an extra time. Updating in place is the classic CA bug: the w, nw, n and ne neighbours
  are already from the new step.

## Lookup-table rules

- **Neighbourhoods** (Moore, von Neumann, Margolus) define the neighbour names and the order their
  bits make a table index.
- **A rule** is a function from a dict of neighbour names to bits, returning the next state. The
  rule compiler runs it over every combination and fills the table; the table is cached in the
  rule. That is the CAM-6 Forth rule compiler's contract, kept from Sun Forth through Python
  (`cellrulecompiler.py`) to JavaScript.
- **Margolus neighbourhood** names: `c0 c1` (centre), `cw0 cw1` (clockwise), `ccw0 ccw1`
  (counter-clockwise), `opp0 opp1` (opposite), and `pha0 pha1`, the even/odd time phase.
- **Echo and heat options** on table rules: echo shifts the previous low bits into the high bits for
  coloured trails; heat runs dithered heat diffusion in the high bits, fed by the low bits, with
  `heatShiftPollution` setting how much each critter emits.
- **`steps`**: how many steps between displays, set to 2 for rules that blink.

## Marble: kernels, phase and dither

- **Sixteen 3×3 convolution kernels**, each summing to 16, chosen per cell by a "spatio-temporal
  cell phase" built from x, y, the cell value and the step, each shifted right by its own slider,
  plus a phase offset. Shifting an input all the way right removes it.
- **Error-diffusion dither, cell to cell.** The leftover from each weighted average carries to the
  next cell, so the field looks like a GIF with error diffusion. That makes it non-local:
  leftovers can travel many cells in a step.
- **The drift and its fix.** Carrying error only rightward (and down at the row wrap) biases flow
  right and down, which builds up over iterations. Rudy Rucker spotted it. Don's fix: rotate the
  scan direction 90° every frame, cycling left-right, top-bottom, right-left and bottom-top, and
  un-rotate the kernels so their intended bias stays put. It's cheaper than Floyd–Steinberg's
  scanline buffer and serpentine (boustrophedon) scanning, and works only because a CA iterates.
  moollm's schedulers.md later showed serpentine and four-rotation cancel different symmetries
  and are best used together.
- **The isothermal line.** The colour map puts 127 at black and 128 at white in the middle of the
  greys, so scrolling the histogram peak there draws a wiggling contour.
- **An old bug kept as a feature.** The original C version on a Sun never initialised the error
  accumulator, so it picked up whatever was on the stack: the dither shivered when Don typed in a
  terminal. CAM6.js seeds it with a random number on purpose.

## The frob, tools and recording

- **Frob**: a constant added to every cell each step, springing back to a "frob neutral"; the
  mouse wheel scrolls every cell value up or down, wrapping at 0/255.
- **Histogram**: live cell population over the colour map; click it to set the drawing value.
- **Shift-click** leaves a drawing tool running in place while you adjust its sliders: the seed of
  reified tools as objects on the cells.
- **Session recording and playback** of state snapshots and scripts.
- **Generated documentation** of every rule, neighbourhood, parameter, tool and command, from the
  built-in metadata, including the rule functions' source.

## Rules on the page

Rug, Marble (Fuzzy, Twisty, Spin, Flower), Life, Brain, **eco** (Anneal splitting land and sea,
Brain in the sea, AntiLife on land, a heat layer the critters pollute; [origin](../../../rudy-rucker/README.md#symbiotic-programming-on-the-cam-6-1989)),
Dendrite (Margolus diagonal gas freezing on "ice nine"), spins-only, and John von Neumann's
29-state rule.
