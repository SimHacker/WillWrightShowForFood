# Blending views with ECG

ECG blends example pictures and lets you drag the result. The same machinery can blend **views**:
saved arrangements of windows, articles, panels and cameras. You rearrange what you're looking at by
direct manipulation, the solver works out which saved views you're moving toward, and you can keep
going toward any of them with a click. This page is the design; the engine underneath is
[DESIGN.md](DESIGN.md).

## A view is a configuration

A view description is a vector of numbers, the same kind of thing an ECG example is:

- for each window: position, size, scroll position, zoom, and opacity;
- for the reader: which article each window shows;
- for the cabinet: which panels are open (memory, source, scan, trace), their sizes, and the time
  scale;
- for the [portrait](../cabinet/PORTRAIT.md#a-camera-you-can-inhabit-steer-and-record): the camera
  pose and lens.

Views that show different sets of windows are made comparable by giving every window that appears in
any of them a slot, with opacity 0 and size 0 where it's absent. Blending then fades a window in or
out as the weights change. Which article a window shows is not a number; it follows the example with
the largest weight among those that show something in that slot, as DESIGN.md does for things that
aren't points.

Saved views are the **examples**. They come from the user, from authored tours
([CAUSE-AND-EFFECT.md](../cabinet/CAUSE-AND-EFFECT.md#views-are-authored)), from other people's shared
views, and from generated ones ("this layout, with this article maximized"). An author, or the system
(below), glues them into **zones**, simplices of views that may blend. The **current view** is a
state: a zone and barycentric weights in it.

## Resizing a window moves you through the views

Grabbing a window's corner and dragging it is a tug on a handle: the window's size numbers. The
solver ([Tugging inside one zone](DESIGN.md#tugging-inside-one-zone)) finds the smallest change in
weights that makes the window the size you're dragging it to. So making a window bigger moves the
blend toward the views in which that article is bigger, and the rest of the layout follows those
views as it goes: neighbouring windows shrink or move aside the way they did when those views were
saved. Hitting a zone boundary and crossing into a neighbouring zone work as in
[DESIGN.md](DESIGN.md#hitting-a-boundary).

Moving a window, scrolling, zooming and steering the camera are tugs on other handles. Several at
once (resize this, keep that one where it is) are handles with pins and priorities.

## Targets you were moving toward

After each manipulation, compare the weights before and after. The examples whose weights grew are
the views the gesture moved toward. List them, largest gain first, as **targets**: thumbnails or
names beside the current view.

Clicking a target moves further toward it: the state moves along the line toward that example,
`λ ← λ + t (eᵢ − λ)`, with `t` a step such as one quarter, animated. Each click goes further; with
the snap radius ([Feel](DESIGN.md#feel)) it lands on the view itself. The list is the recent history
of the last gesture, so it answers "where was I heading?" and lets you finish the move without
dragging again. Clicking a view whose weight fell moves back toward it, which is undo along that
direction.

## Finding views to add near where you are

Direct manipulation can leave you somewhere no saved view describes well: the blend reproduces the
current configuration `c` only approximately, or only with views far away. The system can then look
for an existing view, from the library, that is close to `c` and that, added to the complex, would
put `c` well inside a simplex with substantial weight on the new view, so that the current view
orbits it.

For the current zone's examples `x₁ … xₖ`, and a candidate view `v`:

1. **Fit without it.** The residual `r₀ = min ‖W (X λ − c)‖` over weights `λ ≥ 0` summing to 1,
   which is the distance from `c` to the zone's convex hull. `W` is a diagonal scale that makes
   pixels, zoom levels, angles and seconds comparable.
2. **Fit with it.** The same minimum `r₁` over `x₁ … xₖ, v`, which also gives the weight `λᵥ` the
   best fit puts on `v`.
3. **Score.** A candidate is good when it brings the fit close (`r₁` small, and well below `r₀`),
   carries real weight (`λᵥ` large), and is near (`‖W (v − c)‖` small). Rank by those; show the best
   few as **views near you**.

Each fit is a small problem, a projection onto a simplex of a dozen points or fewer, solved by
non-negative least squares with the sum constraint. To keep it cheap, first take the nearest few
dozen views to `c` in the scaled metric, then fit only those.

**Adding one.** Accepting a candidate glues a new zone onto the complex: the current zone's examples
with the one of smallest weight replaced by `v`. The new zone shares a face with the old one, so the
state crosses into it at the equivalent point, exactly as zone walking already does, and nothing
jumps. If `v` lies in the affine span of the others (the new simplex would be flat), it's rejected,
because the solver can't separate it from the views it duplicates.

Done repeatedly, this grows the complex around where people actually go: the views they make by
hand become places on the map, connected to the views they came from.

## Where it applies

- **The HyperTIES reader** ([apps/ties](../../apps/ties/FORMAT.md)): article windows, the cabinet
  applet inside an article, previews.
- **The cabinet's panels**: the machine, its memory, the source, the scanned listing, the trace, at
  the sizes a person likes for each task.
- **The portrait's camera and tours**: blending camera poses and time scales between authored
  viewpoints.
- **Screen Angel's live views**: windows captured as textures and composed in a space of our own
  ([LIVE-VIEWS.yml](https://github.com/SimHacker/MicropolisCore/blob/main/apps/screen-angel/LIVE-VIEWS.yml)).

## Order of work

1. The solver from DESIGN.md, then a view description type with slots and opacity.
2. Resize-to-blend in a two-window demo, with the weights shown as bars.
3. The targets list and click-to-continue.
4. The library search and "views near you," with the residual and weights shown.
5. Gluing accepted views into the complex, saved as authored content.
6. The reader, the cabinet panels, and the portrait camera.

↑ [README](README.md) · [DESIGN](DESIGN.md) · [COURSE](COURSE.md)
