# Tom Ngo 🔺

*Invitation portrayal — a respectful, source-grounded sketch, not Tom Ngo and not his words.*
[Portrayal standards](../../schemas/portrayal-standards.md) · consent not yet asked · authored by Don Hopkins

## Who

**Tom Ngo** built **Embedded Constraint Graphics (ECG)** at **Interval Research** — a
constraint-based animation system where example poses live at the vertices of a **simplicial
complex**: drag the eyes, mouth, or limbs of a drawing the way you naturally want to, and the
system solves your motion into **barycentric blend weights** (the same linear-algebra family as
inverse kinematics). You manipulate concrete outcomes; the solver recovers the coordinates.
Patent [US5933150](https://patents.google.com/patent/US5933150) (filed 1996, expired ~2016 —
free to reimplement now). **[Golan Levin](../golan-levin/README.md)** used the ECG editor to
build the vector faces of **[Mouther](https://www.flong.com/archive/projects/mouther/)**.

> *Gluing high-dimensional simplices at their edges and faces is an extremely general way to
> represent blending manifolds — in the same way that gluing polygons together has done us so
> much good in 3D modeling.* — Tom Ngo, to Don, after the patent expired

Full mechanism, patent walkthrough, and the G9.js Hacker News thread:
[`tom-ngo-embedded-constraint-graphics-at-interval.md`](../don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md).

## Why a Repo Show

Don and Tom were Interval colleagues on the Camelot floor, and the conversation never stopped:
since the patent expired they've been discussing **applying ECG to morph-target-based 3D facial
animation** — drag the face on screen, solve the blend-shape weights (ARKit `ARFaceAnchor`
coefficients, Blender FaceIt rigs) instead of hand-tuning sliders. That idea is a load-bearing
part of the [Faceball Construction Set](../../apps/performance-space/faceball-construction-set.yml):
ECG is the example-based blend engine for its puppet faces and parameterized soft-body parts, in
the kit's stated lineage — **HOMER → NeWS Mona Eyes → Tom Ngo ECG / Mouther → Bounce commentary
bots → SimFaux → Squares in a Box panel dummies.**

Dream segment: **Tom and Golan together** — the engine builder and the artist who played it —
reimplementing a patent-free ECG live, then driving a 3D morph-target face with it.

## Browse

- ECG essay: [`../don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md`](../don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md)
- Golan Levin / Mouther: [`../golan-levin/`](../golan-levin/README.md)
- Faceball Construction Set: [`../../apps/performance-space/faceball-construction-set.yml`](../../apps/performance-space/faceball-construction-set.yml)
- Direct manipulation trail: [`../../process/trails/direct-manipulation.md`](../../process/trails/direct-manipulation.md)
