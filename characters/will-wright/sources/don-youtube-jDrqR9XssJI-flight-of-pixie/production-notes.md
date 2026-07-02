# Production notes — *Flight of the PIXIE*

Homage edit: https://www.youtube.com/watch?v=jDrqR9XssJI

## Pipeline

1. **Source** — Two 1969 PIXIE films digitized by David Chapman, Cambridge Univ Library (2019).
2. **Select** — Highlight cuts of radial-menu interaction (fast, fluid light-pen work).
3. **Sync** — Rimsky-Korsakov *Flight of the Bumblebee*, Yuja Wang piano (archive.org).
4. **Telecine match** — After Effects **motion tracking** on the digitized film; blur + glow on
   title/credit text overlays to reproduce **telecine jiggle** at head and tail ([HN 22718422](https://news.ycombinator.com/item?id=22718422), Mar 2020 — Don commenting on a TV-logo telecine thread).
5. **Credits** — Wiseman, Lemke, Hiles, Chapman.

## Repo Show reuse — same track on titles and credits

The motion track and blur/glow stack above is **reusable post-production** for Repo Show episodes
that intercut this archive — especially [`pixie-pie-menus-pdp7.yml`](../../../../repo-shows/pixie-pie-menus-pdp7.yml).

Apply the **same driver track** to:

- Opening title and episode slug
- Guest name slates and segment chapter cards
- On-screen jokes, dedication blocks, sign-off lines
- End credits roll

Result: graphics wobble like **Cambridge University Library telecine** at the head and tail of the
1969 films — not sharp vector overlays on top. Spec: [`../../../../process/post-production/cambridge-telecine-jiggle.yml`](../../../../process/post-production/cambridge-telecine-jiggle.yml).

## Not the original film

The YouTube piece is Don's commentary layer. The archival films live at
https://www.cl.cam.ac.uk/library/archives.html

## Hardware context

PDP-7 + Type 340 vector display + light pen, Titan link. Manual:
http://bitsavers.trailing-edge.com/pdf/dec/graphics/7-13_340_Display_Programming_Manual.pdf

## Related evidence

- [`../../../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md`](../../../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md)
- [`article.md`](article.md)
