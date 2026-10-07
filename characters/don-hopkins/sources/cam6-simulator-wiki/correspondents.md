# Who said what on the CAM6 wiki page

Harvested from the [wiki transcript](CAM6_Simulator.transcript.md). The quotes are as Don pasted
them onto his public wiki; each goes to the room of the person who said it.

## Rudy Rucker

Three exchanges, all about the simulator Don was showing him:

1. **The upward drift in Rug.** *"I feel like you might have some kind of bug in your update code,
   an off-by-one thing or a problem with the buffer flipping ... I see persistent upward drift in
   the action."* Don had added it on purpose, as a flame, and rewrote it so the drifts cancel. He
   later found Rudy was also right about an unintended up-and-left drift on top of it.
2. **More rules.** *"You're going good. More nice rules ... FADERS, BALLOONS, ZHABO, and HODGE."*
   All four are in the [CelLab catalogue](../../../rudy-rucker/sources/cellab-celdoc/README.md).
3. **The northwestward drift in Brain Heat and Life Heat**, with his advice to keep an OldBuff and
   a NewBuff and swap pointers, *"I think you're overthinking things with your whirling scan
   update."* Don's answer: it already swaps two buffers, and the drift comes from the dithering being
   non-local, which the rotating scan cancels ([engine techniques](engine-techniques.md#marble-kernels-phase-and-dither)).

The page also has Don's own account of **eco**, derived from Rudy's Ranch.
→ [Rudy's room](../../../rudy-rucker/README.md)

## Chaim Gingold

- *"A GLSL shader that took the compiled rules would allow absurdly huge canvases to run in real
  time."*
- *"I want to be able to see the uncompiled js code on the web page for each configuration!"*,
  suggesting dat.gui and CodeMirror.
- On jvn29: *"Yeah I painted a bit and a universal constructor didn't come out. Hahaha."* And on
  Don's universal nano-constructor cell: *"I dunno. Sounds like it might be dangerous."*

All three became design goals: GPU rules in the CAM Construction Set, live rule source in the
generated docs, and a constructor port into the grid.
→ [Chaim's room](../../../chaim-gingold/README.md)

## Scott Snibbe

A 15 Feb 1999 email from Don, then at Maxis, to Scott at Interval: Don had ported the CA engine to
After Effects as a plug-in and asked for feedback. The interesting part is the colour-map design:
**a 2D image used as an interpolated array of colour maps**, with a phase picking the row (later,
two animated endpoints to sample between), and an overlay layer composited into the cells through
its alpha, so a movie can paint into a running CA.

## Will Wright

Credited with the gutter trick ([engine techniques](engine-techniques.md#the-inner-loop)).
→ [Will's room](../../../will-wright/README.md)

## Usenet, 1988 and 1991

See [cam-hardware-history.md](cam-hardware-history.md).
