# Sketchpad → Geometer's Sketchpad → PIXIE — educators' bridge

**Roy Eagleson** normally opens his HCI / graphics-history unit with [**Ivan Sutherland's
Sketchpad**](https://en.wikipedia.org/wiki/Sketchpad) (1963, MIT Lincoln Lab TX-2). **Heinz Lemke**
co-authored [**PIXIE**](https://www.donhopkins.com/home/documents/PIXIE%20a%20new%20approach%20to%20man-machine%20communication.pdf)
(1969, Cambridge PDP-7/Titan). This project treats both as one continuous story — not competing
origin myths.

[Portrayal standards](../../schemas/portrayal-standards.md)

---

## North star: Sketchpad

[**Ivan Sutherland**](../ivan-sutherland/README.md) — hero of this repo's direct-manipulation and
constraint-solving lineage. Sketchpad (~1963):

- Light pen + CRT; **master–slave** duplication and **constraints**
- Interactive geometry and engineering drawings — "the first graphical user interface" in the
  textbook sense
- Show the system **what** you want; let it solve the **how**

Alan Kay's reading list in-repo traces Sketchpad → Sketchpad III → Flex → Smalltalk → NeWS.
See [`../alan-kay/media/quora-recaps/declarative-whats-vs-hows.md`](../alan-kay/media/quora-recaps/declarative-whats-vs-hows.md).

---

## Descendants we love: the Geometer's Sketchpad line

**The Geometer's Sketchpad** (GSP) — [**Nick Jackiw**](https://en.wikipedia.org/wiki/The_Geometer%27s_Sketchpad),
Key Curriculum Press (1980s–2010s) — brought Sketchpad's spirit into **classrooms**:

- Dynamic geometry: drag a point, constrained figures update
- Mathematical exploration, not just drawing — proof-like play
- A whole generation learned that software could **hold mathematical relationships** visible

Related dynamic-geometry cousins (same family tree, different branches): Cabri, Cinderella,
[**GeoGebra**](https://www.geogebra.org/) (much of the GSP audience migrated here). We cite GSP
by name because it is the clearest **educational** descendant of Sutherland — the line Roy's students
already know before PIXIE enters the lecture.

Don's Bounce notes even wish for **Geometer's Sketchpad-style recursion by demonstration**
([`../don-hopkins/mediaflow-design-comments.md`](../don-hopkins/mediaflow-design-comments.md)).

---

## PIXIE — Cambridge, six years later

**PIXIE** (Wiseman, Lemke, Hiles; 1969 CAD Conference):

- **PDP-7 + Type 340** vector display + light pen — same pen-and-beam era as Sketchpad
- **Radial / pie menus** ("lightbuttons") — earliest known radial menus in the literature Don credits
- **Distributed CAD**: interactive graph-model builder on the satellite (~5000 + 3000 words in 8K);
  simulation on **Titan** — [Heinz's correction](../heinz-lemke/pixie-source-recovery.md) (July 2026)

PIXIE is not "Sketchpad on a minicomputer" — different lab, different economics, different domain
(electronic circuits, syntax graphs, control systems). But for **teaching**, Roy's pivot makes sense:
both are **constraint-aware, pen-driven, model-building** systems from the same decade when GUIs
were invented twice.

---

## Roy's classroom (7 July 2026)

| Usual anchor | That day's pivot |
|--------------|------------------|
| Sutherland · Sketchpad | Heinz · PIXIE · complete listing offer |
| MIT · TX-2 · 1963 | Cambridge · PDP-7/340 · 1969 |
| Constraints in geometry | Graph models + radial menus + Titan link |
| Static textbook diagram | [**Flight of the PIXIE**](https://www.youtube.com/watch?v=jDrqR9XssJI) in lecture |

Source: [`../heinz-lemke/sources/2026-07-07-pixie-trio-thread.md`](../heinz-lemke/sources/2026-07-07-pixie-trio-thread.md)

**Heinz** is not only an archive — he is a **living co-author** Roy can put beside Sutherland in
the same syllabus. **Don** supplies the films, the Bumblebee edit, and the preservation thread.
**Lars Brinkhoff** maps the iron; **David Rosenthal** holds Cambridge ~1970 memory on the same stack.

---

## Repo links

| Topic | Where |
|-------|-------|
| Ivan Sutherland · Sketchpad hero room | [`../ivan-sutherland/`](../ivan-sutherland/) |
| Heinz · PIXIE · source recovery | [`../heinz-lemke/pixie-source-recovery.md`](../heinz-lemke/pixie-source-recovery.md) |
| Roy · character room | [`README.md`](README.md) |
| PIXIE show seed | [`../../repo-shows/pixie-pie-menus-pdp7/README.md`](../../repo-shows/pixie-pie-menus-pdp7/README.md) |
| Don · pie menus retrospective (PIXIE credit) | [`../don-hopkins/pie-menus-chi-88-and-beyond.md`](../don-hopkins/pie-menus-chi-88-and-beyond.md) |

↑ [Roy's room](README.md) · [Heinz](../heinz-lemke/) · [Sutherland](../ivan-sutherland/)
