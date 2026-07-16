# The Design and Implementation of Pie Menus — Dr. Dobb's Journal, Dec 1991

**Author:** Don Hopkins · Cover story, user interface issue.
**Medium reprint:** https://donhopkins.medium.com/the-design-and-implementation-of-pie-menus-80db1e1b5293

The load-bearing **published receipt** in the marking-menu dispute: every feature the 1993
Kurtenbach/Sellen/Buxton paper and the 1995 Alias patent framed as marking-menu-unique is
described here, in print, two years and four years earlier respectively — and this article is
in the patent's own references.

## The receipts, verbatim

**Self-revealing + novice rehearsal → expert transition:**

> For the novice, pie menus are easy because they are a **self-revealing gestural interface**…
> you learn the menu and **practice the gesture to "mark ahead"**… Most importantly, **novices
> soon become experts**, because every time you select from a pie menu, you practice the motion
> to mark ahead, so you naturally learn to do it by feel!

**Mark-ahead with display suppression:**

> For the expert, they're efficient because — without even looking — you can move in any
> direction, and **mark ahead so fast that the menu doesn't even pop up**… If you mark ahead,
> selecting with a smooth continuous motion, **the menu should not display at all**.

**Reselection / browsing:**

> You can move into a slice to select it, or **move around the menu, reselecting another
> slice**. As you browse around before choosing, the slice in the direction of the cursor is
> highlighted.

Note the vocabulary: Don was already saying **"mark ahead"** in 1991 — "'mouse ahead' in the
case of a mouse, 'wave ahead' in the case of a dataglove." The Jaron Lanier line is here too:
*"The mind may forget, but the body remembers."*

## Other content

- Fitts's-law analysis; leverage property (wider slice with distance); noisy-input robustness
  (pen skip, vehicle motion, "tectonic activity")
- **Kurtenbach's own experiment cited approvingly**: even beats odd, 8 items optimal, pen >
  mouse > trackball — the collaboration was real before the patent
- Four implementations to date: X10 uwm, SunView (Weiser's SDI), NeWS Lite, TNT
- Eight Days a Week menu; window-management pie; pull-out color wheel (hue = direction,
  saturation = distance, gray brightness dial rim); screen-edge cursor warping
- Full NeWS object-oriented PostScript layout listing
- Momenta "Command Compass" sidebar (editors): pentop pie menus, "visually faithful
  implementation of pie menus as described in this article"
- Steve Witham comment (2020): Ted Nelson credits "self-revealing" to Klaus Landberg
  (Datapoint RMS) — see [`2020-ted-nelson-klavs-landberg-self-revealing.md`](2020-ted-nelson-klavs-landberg-self-revealing.md)

## Show use

Read the 1991 mark-ahead paragraph on air, then the 1993 paper's "Marking menus are also
unique…" sentence, then Kurtenbach's 1990 email. Three documents, no commentary needed.

→ [`pie-menus-30-year-retrospective.md`](pie-menus-30-year-retrospective.md) ·
[`pie-menu-fud-misconceptions.md`](pie-menu-fud-misconceptions.md) ·
[`pie-menu-timeline.md`](pie-menu-timeline.md)
