# Tom Ngo 🔺

*Portrayal of a real invitee, written by Don — not Tom.*
[Portrayal standards](../../schemas/portrayal-standards.md)

**Tom Ngo** built **Embedded Constraint Graphics (ECG)** at **[Interval Research](../don-hopkins/interval-research-pluggers-and-mediaflow.md)** —
a constraint-based animation system where example poses live at the vertices of a **simplicial
complex**: drag the eyes, mouth, or limbs the way you naturally want to, and the system solves
your motion into **barycentric blend weights**. Patent
[US5933150](https://patents.google.com/patent/US5933150) (filed 1996, expired ~2016 — free to
reimplement). **[Golan Levin](../golan-levin/)** used the ECG editor to build the vector faces of
**[Mouther](https://www.flong.com/archive/projects/mouther/)** (with Malcolm Slaney on speech).

> *Gluing high-dimensional simplices at their edges and faces is an extremely general way to
> represent blending manifolds — in the same way that gluing polygons together has done us so
> much good in 3D modeling.* — Tom Ngo, to Don, after the patent expired

*(Hypertext house rule: if we name it, we link it — [Ted Nelson](../ted-nelson/) smiles.)*

---

## Repo Show heartbeat

**The ask is conversation, not code.** Brainstorm how you'd go about a design, the alternatives
and tradeoffs, the elegant solution — we throw those notes into the public repo for others to
play with. Zero homework; optional *homefun* later.
([brainstorm-heartbeat.md](../../process/brainstorm-heartbeat.md) · Will’s
[guest prototype](../will-wright/guest-prototype.yml))

**[Will Wright](../will-wright/) is in** — [premiere](../../repo-shows/will-wright-premiere/README.md).

---

## Why Tom

Don and Tom were Interval colleagues on the Camelot floor; the conversation never stopped.
Since the patent expired they've discussed **applying ECG to morph-target 3D facial animation** —
drag the face, solve blend-shape weights ([ARKit](https://developer.apple.com/documentation/arkit),
FaceIt, etc.) instead of hand-tuning sliders. That idea loads the
[Faceball Construction Set](../../apps/performance-space/faceball-construction-set.yml):
**HOMER → NeWS Mona Eyes → Tom Ngo ECG / Mouther → Bounce → SimFaux → Squares in a Box.**

The **public product showcase** is Soul City's **[WigFabrik](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/the-computer-as-portal.md#6-wigfabrik--wigomatic-and-the-character-customization-studio)**
(aka Wig-M-Porium; WigOMatic is the in-game wig-manager appliance the shop sells): multitarget mesh + texture interpolation, AI-generated texture maps
and hair patterns as *ECG targets*, drag-to-solve blend weights → Sims-1 head-skin IFF. Camp
storefront; Interval math. Tom would be thrilled to discuss it.

Dream segment: **[Tom + Golan](../../repo-shows/tom-and-golan-ecg-mouther/)** — engine builder and
artist — WigFabrik as the teaching demo; reverse-engineer or recover Mouther cartoons; whiteboard
SVG / Canvas / WebGPU ECG paths. Nobody ships code on air.

Full mechanism + G9.js HN thread:
[`tom-ngo-embedded-constraint-graphics-at-interval.md`](../don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md).

---

## Links

| What | Link |
|------|------|
| [Invitation](invitation.md) | Guest-facing ask |
| [ideas.md](ideas.md) | Brainstorm hooks |
| [Pair show — ECG & Mouther](../../repo-shows/tom-and-golan-ecg-mouther/) | With Golan |
| [ECG essay](../don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md) | Patent + HN |
| [Patent US5933150](https://patents.google.com/patent/US5933150) | Expired ~2016 |
| [HN — G9.js / ECG](https://news.ycombinator.com/item?id=12572696) | Don + prior art |
| [Mouther (flong)](https://www.flong.com/archive/projects/mouther/) | Golan + Slaney + Tom |
| [Golan Levin](../golan-levin/) | Dream co-guest |
| [WigFabrik (portal §6)](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/the-computer-as-portal.md#6-wigfabrik--wigomatic-and-the-character-customization-studio) | ECG showcase craft shop |
| [Faceball Construction Set](../../apps/performance-space/faceball-construction-set.yml) | `ecg_blend` |
| [Breakfast simplex](../don-hopkins/breakfast-simplex-barycentric-direct-manipulation.md) | Barycentric cousin |
| [Direct manipulation trail](../../process/trails/direct-manipulation.md) | Lineage |

↑ [Characters](../) · [Don Hopkins](../don-hopkins/)

*Quiet mode while invitations go out — please don't share links publicly just yet.*
