# PIXIE thread — 30 July 2026 (the draftsman origin of radial menus; how to start PIXIE)

**Subject:** AW: PIXIE/Rainbow, Sketchpad, and Object-Oriented Design
**Span this day:** Heinz → Roy + Don (15:37) — answering Roy's 28 July SIMH progress

[Portrayal standards](../../../schemas/portrayal-standards.md) · Index: [`THREAD-INDEX.md`](THREAD-INDEX.md)

---

## Heinz → Roy + Don (15:37) — where the radial menus actually came from

The origin story, in Heinz's own words. Before PIXIE, **Heinz was a technical
draftsman** in a number of German companies through the 1950s and early 1960s.
He attached a **1m × 2.5m technical drawing from 1960** — his own work,
digitized days before this email.

The 1950s drafting workflow: frequent special symbols (circles, squares,
arrows, valves, nuts and bolts) entered on a **vertically positioned but
slightly tilted drawing board**, with a **pencil in one hand and a symbol
template held in the other**.

> In PIXIE, I simply translated this into the light pen with the templates
> being simulated by a radial menu of symbols (PIXIE's control light buttons)
> that can be dynamically adapted to the technical content of the drawing.
> Both, the light pen and the template can then be operated with one hand,
> leaving the other hand free to enter data, for example on the TTY.

So the earliest known radial menus are a **digitization of the draftsman's
symbol template** — a physical tool held in the non-dominant hand became a
dynamically adaptive on-screen ring, freeing that hand for the TTY. The
1969 PIXIE paper describes the mechanism; this email supplies the *why*.

**The Rainbow framing, restated:** drawing gestures and components translate
into a computational model on the small computer (PDP-7), which after
completion is analysed or simulated on the larger one (Titan) — "a winning
situation all round."

**The elegy:** what's missing now, Heinz observes, is the tilted drawing board
itself as a **social meeting point** for colleagues in the drawing
departments:

> This may be the loosing part of the advances in computer graphics.

Show gold: the pie-menu lineage doesn't start with a computer at all — it
starts with a template in a draftsman's left hand, and the thing we lost
wasn't a device but a *gathering place*.

---

## Heinz answers Roy's blank-screen mystery — no light pen needed

Roy (28 July) had PIXIE loading in SIMH but stopping on GO with nothing
displayed, suspecting missing light-pen interrupts. Heinz, from **p. 189 of
the PhD thesis**:

> PIXIE does a clean start after loading and displays a blank frame on the
> screen. A clean start can be obtained any time by setting the address
> switches to **22** and pressing START.

No light-pen interrupt is required to boot: after a clean start, the
**command light buttons and radial control buttons with tracking cross** are
displayed and become light-pen sensitive. So Roy's next test is address
switches 22 + START — the display should come alive before any pen exists.

→ Roy's progress file: [`../../roy-eagleson/sources/2026-07-28-simh-oct-to-rim-loaded.md`](../../roy-eagleson/sources/2026-07-28-simh-oct-to-rim-loaded.md)
→ Emulation plan: [`pdp7-reference/EMULATION-PLAN.md`](pdp7-reference/EMULATION-PLAN.md)

---

## Pull-in

- **The 1960 drawing** — 1m × 2.5m technical drawing, digitized by Heinz,
  attached to this email. The physical prehistory of PIXIE's symbol menus.
  → [`../pull-in-gaps.md`](../pull-in-gaps.md) `heinz_1960_draftsman_drawing`

---

↑ [THREAD-INDEX](THREAD-INDEX.md)
