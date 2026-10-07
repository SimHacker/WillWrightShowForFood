# CAM6 Simulator: Don's wiki page and its neighbours, backed up

`donhopkins.com/mediawiki` is gone, so the page about the CAM6 simulator, with Rudy Rucker's
drift-bug exchange, Chaim Gingold's notes, and the 1988–1991 CAM-6 and CAM-PC Usenet posts,
lives here now. Everything was fetched raw (`id_`, unmodified) from the Wayback Machine on
2026-10-07.

| File | What | Original | Wayback capture |
|---|---|---|---|
| [`CAM6_Simulator.wayback-20180909.html`](CAM6_Simulator.wayback-20180909.html) | Don's wiki page "CAM6 Simulator", last edited 25 Oct 2013 | `http://donhopkins.com/mediawiki/index.php/CAM6_Simulator` | [9 Sep 2018](https://web.archive.org/web/20180909074032/http://donhopkins.com/mediawiki/index.php/CAM6_Simulator) |
| [`hyperlook-CAM.gif`](hyperlook-CAM.gif) | Screenshot: the CAM simulator in HyperLook on NeWS, with HyperDraw tiles, a CA lava lamp, and the cell editor | `donhopkins.com/home/catalog/hyperlook/CAM.gif` | [29 Jul 2021](https://web.archive.org/web/20210729100117/https://www.donhopkins.com/home/catalog/hyperlook/CAM.gif) |
| [`drupal-node-41-vonneumann-openlaszlo.wayback-20161029.html`](drupal-node-41-vonneumann-openlaszlo.wayback-20161029.html) | "John von Neumann's 29 state Cellular Automata Implemented in OpenLaszlo", 18 Sep 2005, with pie-menu editing and signal-crossing organs | `donhopkins.com/drupal/node/41` | [29 Oct 2016](https://web.archive.org/web/20161029142804/http://www.donhopkins.com/drupal/node/41) |
| [`vonNeumann_real_time_crossing.jpg`](vonNeumann_real_time_crossing.jpg) | That post's screenshot: a real-time signal crossing | `donhopkins.com/home/images/vonNeumann_real_time_crossing.jpg` | same capture |
| [`rucker-cellab-sjsu.wayback-20170821.html`](rucker-cellab-sjsu.wayback-20170821.html) | Rudy's SJSU "Cellab Downloads" page, which the wiki links to: CelLab is public-domain freeware, the manual text © 1997 Rucker and Walker | `cs.sjsu.edu/faculty/rucker/cellab.htm` | [21 Aug 2017](https://web.archive.org/web/20170821110731/http://www.cs.sjsu.edu/faculty/rucker/cellab.htm) |

## Read it

- [`CAM6_Simulator.transcript.md`](CAM6_Simulator.transcript.md): the whole page as Markdown,
  unedited apart from redacted email addresses and phone numbers. The wall of text, kept whole.
- Harvested from it, by subject:
  - [`engine-techniques.md`](engine-techniques.md): the gutter, the sliding window, lookup-table
    rules and neighbourhoods, marble's kernels and dither, the rotating scan, frob and tools.
  - [`correspondents.md`](correspondents.md): Rudy Rucker's three exchanges, Chaim Gingold's
    suggestions, the Scott Snibbe After Effects email, Will Wright's gutter.
  - [`cam-hardware-history.md`](cam-hardware-history.md): CAM-6 prices (1988), CAM-PC (1991),
    CAM-8 (1993), Toffoli's lattice-gas retrospective.
  - [`ideas-from-the-page.md`](ideas-from-the-page.md): webcam CA, GLSL, reified tools, the
    nano-constructor port, and where each idea went.

## What the wiki page holds

Don's running notes on his CAM6 simulator (C and Forth, then PostScript, C++, Python, and finally
JavaScript), pasted from his messages to people:

- **How it works**: Will Wright's gutter trick (copy the wrapping edges into a one-cell border so
  the inner loop never checks edges); scrolling a 3×3 window and loading only the leading edge;
  the frob; marble's 16 convolution kernels chosen by a spatio-temporal phase; error-diffusion
  dithering carried from cell to cell, and rotating the scan 90° every frame to cancel its drift.
- **Rudy Rucker's bug reports.** First an upward drift in Rug, which Don had put in on purpose, as
  a flame, then fixed so it cancels. Then a northwestward drift in Brain Heat and Life Heat, and
  Rudy's advice: just use two buffers and swap them. Don's answer: it already does, and the drift
  comes from the dithering being non-local. Plus Rudy's list of CelLab rules to port: Faders,
  Balloons, Zhabo, Hodge.
- **The eco rule, in Don's words**: *"Another rule of Rudy Rucker's I liked was one that
  multiplexed LIFE and BRAIN over space depending on another plane in which it was running ANNEAL
  ... I found that running ANTILIFE aka DEATH in the land phase was better, since then they
  stimulated each other along the shores."* Then the RUGS heat layer in the leftover bits that
  the critters pollute. This is the origin of eco in SimCity ([Rudy's room](../../../rudy-rucker/README.md#symbiotic-programming-on-the-cam-6-1989)).
- **Chaim Gingold**: GLSL for huge canvases; show the uncompiled JS for each rule; CodeMirror and
  dat.gui.
- **The neighbourhoods and rule compiler**: Moore, von Neumann, Margolus, with echo and heat
  options; a rule function run over every combination of neighbour bits into a lookup table. Also
  dendrite, jvn29, and the "universal nano-constructor cell" idea.
- **History**: the Sun Forth rule compiler, the C simulator writing Sun raster files animated in
  NeWS, the HyperLook CA lab (the GIF above), Toffoli's floppies, the Python rule compiler in
  MicropolisCore, the OpenLaszlo jvn29.
- **A 1999 email to Scott Snibbe** about porting the CA engine to After Effects as a plug-in, with
  a 2D image used as an interpolated array of colour maps.
- **Usenet**: Frank McKenney, comp.theory.cell-automata, 25 Sep 1988, CAM-6 prices from Systems
  Concepts ($1,500 for the package, $30 for the book); David Hiebeler, 20 Dec 1991, Automatrix's
  CAM-PC press release ($1,950, Margolus neighbourhoods in hardware).
- **Tommaso Toffoli's abstract**, "Lattice-gas vs cellular automata: the whole story at last"
  (Automata 2008).

The public parts are Don's own writing and public Usenet posts. The emails it quotes are Don's
own and Chaim's and Rudy's replies to his CA demos; they were already public on the wiki.
