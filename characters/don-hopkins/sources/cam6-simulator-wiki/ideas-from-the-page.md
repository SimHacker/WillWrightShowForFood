# Ideas on the CAM6 wiki page, and where they went

Harvested from the [wiki transcript](CAM6_Simulator.transcript.md). Ideas Don floated in passing,
each with where it lives now, or doesn't yet.

| Idea | Where it is now |
|---|---|
| **Webcam into the CA**: dither the camera into the colour map, or use motion or edge detection to drive cells | Not built. CAM-8 did real-time video in hardware; [WarpOMatic](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/cam6-cellular-automata-machine.md) is its video-feedback cousin |
| **GLSL rules for huge canvases** (Chaim Gingold) | The CAM Construction Set's compile-to-shader stage ([cam-construction-set.md](https://github.com/SimHacker/moollm/blob/main/designs/cellular-automata/cam-construction-set.md)) |
| **Show the rule's JavaScript on the page**, with CodeMirror (Chaim) | Partly: generated docs show rule functions; live editing is the cabinet's LIVE CODING panel ([DESIGN.md](../../../../packages/cabinet/DESIGN.md#cartridges-and-live-coding)) |
| **Reified tools**: drawing tools as objects you drop on the cells and adjust by direct manipulation, many at once | moollm's layered-rules pipeline, where tools are ordinary stages |
| **A universal nano-constructor cell**: a port where a script reaches in with a constructor arm, instead of building a gigantic constructor | Not built. Natural on the cabinet's von Neumann 29-state engine ([ARCHITECTURE-AND-LINEAGE.md](../../../../packages/cabinet/ARCHITECTURE-AND-LINEAGE.md)) |
| **A CA snowflake generator** for greeting cards, from the dendrite rule | Not built |
| **Musical gas**: particle collisions play sounds, like granular synthesis | [Musical Gas](../../musical-gas-granular-ca-synth.md) |
| **A 2D image as an animated colour map**, from the 1999 After Effects plug-in | Not built in CAM6.js |
| **Lookup tables for the book's neighbourhoods, defined like CAM-6 Forth** | Done in CAM6.js |
