---
title: Tom Ngo's Embedded Constraint Graphics (ECG) at Interval
author: Don Hopkins
era: interval-research
character_id: don-hopkins
tags:
  - embedded-constraint-graphics
  - ecg
  - tom-ngo
  - golan-levin
  - interval-research
  - direct-manipulation
  - simplicial-complex
  - barycentric-coordinates
  - patent
patent:
  number: US5933150
  filed: 1996-08-06
  expired: ~2016-08
related:
  - interval-research-pluggers-and-mediaflow.md
  - breakfast-simplex-barycentric-direct-manipulation.md
  - pie-menus-chi-88-and-beyond.md
  - ../golan-levin/README.md
  - ../../process/trails/direct-manipulation.md
hn_sources:
  - url: https://news.ycombinator.com/item?id=12572696
    thread: "Show HN: G9.js – Automatically Interactive Differentiable Graphics (2016)"
---

# Tom Ngo's Embedded Constraint Graphics (ECG) at Interval

**Embedded Constraint Graphics (ECG)** — Tom Ngo's constraint-based animation system at **Interval Research Corporation**. Example images at the **vertices** of a **simplicial complex**; drag a feature on screen and the system maps your motion into **barycentric blend weights** in the state space. Patent filed **6 August 1996**; expired roughly **twenty years later** (Don noticed when commenting on **G9.js** in September 2016).

> *Gluing high-dimensional simplices at their edges and faces is an extremely general way to represent blending manifolds — in the same way that gluing polygons together has done us so much good in 3D modeling.* — **Tom Ngo** (to Don, after the patent expired)

**In this repo:** Interval overview · [Dark Breakfast / breakfast simplex](breakfast-simplex-barycentric-direct-manipulation.md) · [MediaFlow](mediaflow-design-comments.md) · [Golan Levin](../golan-levin/README.md) · [Direct manipulation trail](../../process/trails/direct-manipulation.md)

---

## What ECG does

ECG builds **directly manipulable interactive graphics from target examples**:

1. **Example states** live at **vertices** of a geometric shape (triangle, tetrahedron, higher simplex).
2. **Compatible subsets** of examples span **simplices** (*zones*).
3. All zones glued along shared faces form a **simplicial complex** — the full **state space**.
4. A point **inside** a simplex is a **barycentric blend** of the corner examples (weights sum to 1, all positive in the standard formulation).
5. When you **drag** eyes, mouth, or limbs on screen, the system maps **direction and amount** of drag at that location into movement in the **n-dimensional interpolation space** — typically via the **Moore–Penrose pseudoinverse** of a **Jacobian** (same linear algebra family as **inverse kinematics**).

You do not twiddle abstract sliders for blend weights. You manipulate **concrete outcomes**; the solver recovers coordinates.

Patent abstract (condensed): examples grouped into subsets that interpolate; animations as sequences of blended states; **clip motion**, **clip character**, **clip art** as composable components; automatic registration so frames do not drift unnaturally as the animation proceeds.

**Patent:** [US5933150 — System for image manipulation and animation using embedded constraint graphics](https://patents.google.com/patent/US5933150)

**Simplicial complex:** [Wikipedia](https://en.wikipedia.org/wiki/Simplicial_complex) · **Barycentric coordinates:** [Wikipedia](https://en.wikipedia.org/wiki/Barycentric_coordinate_system)

---

## Mouther — Golan Levin, Malcolm Slaney, Tom Ngo

**Golan Levin** used the ECG graphical editor to build the vector face cartoons for [**Mouther**](https://www.flong.com/archive/projects/mouther/) — drag eyes, mouth, and features on the drawing the way you naturally want to. Brilliant for cartoony direct-manipulation UI widgets.

Interval colleagues on the same Camelot floor as [MediaFlow](mediaflow-design-comments.md), [Bounce TV bots](interval-research-pluggers-and-mediaflow.md), and the [Pluggers](https://donhopkins.com/home/interval/pluggers) survey.

---

## Don's HN comment when the patent expired (2016)

Thread: [**Show HN: G9.js – Automatically Interactive Differentiable Graphics**](https://news.ycombinator.com/item?id=12572696) (September 2016)

Don's comment (abridged):

> That is a neat idea! It reminds me of another cool constraint based animation system called **Embedded Constraint Graphics** that Tom Ngo developed at Interval Research Corporation… So hey, didn't that patent just expire a month ago?
>
> Golan Levin used the ECG graphical editor to create the vector based face cartoons for his **Mouther** project, by simply dragging the eyes and mouth and other features around like you'd naturally want to be able to do.
>
> It's a really brilliant way to automatically create directly manipulatable interactive graphics from target examples, which you can interpolate between along multiple dimensions at once (**zones of a simplicial complex**), by dragging different parts of the graphics appropriately.

Don quoted the patent's explanation of two triangles **ABC** and **ABD** sharing edge **AB**, barycentric weights like `(0.6, 0.3, 0.1)` for a point inside triangle **ABC**, and motion along edges as smooth transitions between figure poses.

**Antimatter15** (Carbide / G9) replied that ECG is fascinating prior art; Don agreed about **Sketchpad** lineage and pointed to **James Gosling**'s CMU thesis *The Algebraic Manipulation of Constraints* ([CMU-CS-83-13](http://reports-archive.adm.cs.cmu.edu/anon/scan/CMU-CS-83-13.pdf)).

---

## Modern echoes

| System | Echo of ECG |
|--------|-------------|
| [**G9.js**](https://github.com/bijection/g9) / Carbide | Gradient descent on constraint cost while dragging shapes |
| **Apple ARKit** `ARFaceAnchor` blend shapes | Named facial coefficients (`mouthSmileLeft`, `jawOpen`, …) driving a mesh |
| **Blender FaceIt**, Unity `SkinnedMeshRenderer` | Blend-shape weights — often slider-driven; ECG asks: **drag the face, solve the weights** |
| **LLM embeddings** | High-dimensional weighted blends — implicit simplex geometry, learned not authored |

Don's later [**breakfast simplex**](breakfast-simplex-barycentric-direct-manipulation.md) essay applies the same machinery to moultano's *Dark Breakfast* triangle — and to [**pie menus**](pie-menus-chi-88-and-beyond.md) as radial simplex parameterization.

---

## See also

| Link | Why |
|------|-----|
| [Interval Research — Camelot](interval-research-pluggers-and-mediaflow.md) | Era context — Director plugins, Bounce, MediaFlow, visiting speakers |
| [Breakfast simplex & barycentric UI](breakfast-simplex-barycentric-direct-manipulation.md) | Don's 2025 HN essay — ECG applied to egg/milk/flour space |
| [Pie menus CHI'88](pie-menus-chi-88-and-beyond.md) | Direct manipulation in practice — radial menus as simplex UI |
| [Golan Levin](../golan-levin/README.md) | Mouther, computational media at Interval and CMU |
| [Direct manipulation trail](../../process/trails/direct-manipulation.md) | Broader Repo Show thread |

*HN primary source:* [news.ycombinator.com/item?id=12572696](https://news.ycombinator.com/item?id=12572696)
