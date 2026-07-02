---
title: "Breakfast Simplex — Barycentric Direct Manipulation (Dark Breakfast × ECG)"
author: Don Hopkins
era: interval-research
character_id: don-hopkins
tags:
  - barycentric-coordinates
  - simplicial-complex
  - direct-manipulation
  - embedded-constraint-graphics
  - pie-menus
  - interval-research
related:
  - tom-ngo-embedded-constraint-graphics-at-interval.md
  - pie-menus-chi-88-and-beyond.md
  - interval-research-pluggers-and-mediaflow.md
  - ../../process/trails/direct-manipulation.md
hn_sources:
  - url: https://news.ycombinator.com/item?id=12572696
    note: ECG prior art (2016)
  - thread: "The Hunt for Dark Breakfast (moultano, 2025)"
    note: Don's comment applying ECG to breakfast phase space
inspired_by:
  - author: moultano
    title: The Hunt for Dark Breakfast
    url: https://moultano.wordpress.com/
---

# Breakfast Simplex — Barycentric Direct Manipulation

**Applying Tom Ngo's Embedded Constraint Graphics to direct-manipulation breakfast selection** — Don's [Hacker News comment](https://news.ycombinator.com/item?id=12572696) on *The Hunt for Dark Breakfast* (2025), connecting moultano's egg/milk/flour triangle to Interval's [**ECG**](tom-ngo-embedded-constraint-graphics-at-interval.md) patent and to [**pie menus**](pie-menus-chi-88-and-beyond.md).

> *They're not just for breakfast any more.* — but breakfast is a **perfect concrete instance**.

---

## The Breakfast Simplex

moultano plots breakfast recipes on a triangle whose vertices are **egg**, **milk**, and **flour** — normalized so ingredient weights **sum to one** (a **barycentric coordinate system** on a 2-simplex). The mysterious **Dark Breakfast Abyss** is the under-explored interior region heavy on all three.

That is not a vector space (no negative eggs in the standard formulation), but it **is** a simplex — and a **breakfast buffet** is a larger, possibly disconnected **simplicial complex** spanning multiple ingredient families (add butter or sugar → higher dimension; add prep method → adjacent regions).

**Barycentric coordinates:** [Wikipedia](https://en.wikipedia.org/wiki/Barycentric_coordinate_system) — local coordinates **inside** a simplex; weights positive and sum to 1.

**Simplicial complex:** [Wikipedia](https://en.wikipedia.org/wiki/Simplicial_complex) — simplices glued along shared **k-faces** (vertices, edges, triangles, tetrahedra, …).

---

## Same machinery as ECG (Interval, 1996)

Tom Ngo formalized this for animation at Interval:

- **Vertices** = example images (poses, face shapes, character configs).
- **Simplices** = compatible subsets you can interpolate.
- **Drag on screen** → motion mapped into blend space via **Jacobian / Moore–Penrose pseudoinverse** ([inverse kinematics](https://en.wikipedia.org/wiki/Inverse_kinematics) family).

Golan Levin's [**Mouther**](https://www.flong.com/archive/projects/mouther/) faces were built that way — see [Tom Ngo ECG at Interval](tom-ngo-embedded-constraint-graphics-at-interval.md).

Patent: [US5933150](https://patents.google.com/patent/US5933150) (filed Aug 1996; expired ~2016).

---

## Drag breakfast, not sliders

**Pancake**, **crepe**, and **omelette** define a simplex over ingredient ratios:

- Drag toward **eggs** → egg weight increases.
- Drag toward **milk** → move along that axis.
- Cross the **egg–milk edge** shared by crepe `{flour, egg, milk}` and custard `{egg, milk, sugar}` → move from thin batters into **sweet custards** without leaving the manifold.

The **Dark Breakfast** region is an **unoccupied part of a valid simplex** — suggesting adjacent **Dark Custard** subspaces, not forbidden physics.

---

## Pie menus as radial simplices

A **pie menu** is a **radial parameterization of a simplex**: drag in the direction of the crusts and fillings you want; barycentric weights accumulate as you move.

Don's papers:

- [*The Design and Implementation of Pie Menus*](https://donhopkins.medium.com/the-design-and-implementation-of-pie-menus-dr-dobbs-journal-cover-story-1991-8b778d72b517) (Dr. Dobb's, 1991)
- [*An Empirical Comparison of Pie vs. Linear Menus*](https://donhopkins.medium.com/an-empirical-comparison-of-pie-vs-linear-menus-chi-88-3c8e3fdcebb1) (CHI'88, with Callahan, Weiser, Shneiderman)

A **direct-manipulation pie menu over ingredient space** is ECG for brunch.

---

## Beyond breakfast — blend shapes and embeddings

The same geometric intuition appears elsewhere:

| Domain | Simplex view |
|--------|----------------|
| **ARKit** `ARFaceAnchor` blend shapes | Named coefficients (`mouthSmileLeft`, `jawOpen`, …) — drag mouth corners, solve weights instead of sliders |
| **Blender FaceIt** | Performance capture — ECG-style direct manipulation would fit |
| **Mesh blend shapes** | Apple ARKit, Unity `SkinnedMeshRenderer` — weights often overdriven `<0` or `>1` for caricature |
| **LLM embeddings** | High-dimensional weighted blends — implicit geometry; ECG makes simplices **explicit and topologically structured** |

Tom Ngo (post-expiry): *>2 decades of progress since ECG put us in a better position to do something really cool based on direct manipulation.*

---

## HN thread notes

On *Dark Breakfast*, Don also replied to **ccppurcell** clarifying: if breakfasts are **fractions of a whole** (normalized ingredients), you get simplex structure — not a full vector space (no general inverses), but embeddable in **R^d** with barycentric machinery.

On **G9.js** (2016), the same ECG story — see [embedded constraint graphics article](tom-ngo-embedded-constraint-graphics-at-interval.md).

---

## See also

| Link | Why |
|------|-----|
| [Tom Ngo ECG at Interval](tom-ngo-embedded-constraint-graphics-at-interval.md) | Patent, Mouther, 2016 HN comment |
| [Interval Camelot](interval-research-pluggers-and-mediaflow.md) | Where ECG was built |
| [Pie menus CHI'88](pie-menus-chi-88-and-beyond.md) | Radial direct manipulation |
| [Direct manipulation trail](../../process/trails/direct-manipulation.md) | Repo Show thread |
| [Golan Levin](../golan-levin/README.md) | Mouther author |
