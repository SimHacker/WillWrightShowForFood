# Ideas to explore with Tom Ngo 🔺

*Don’s proposed topics — not Tom’s words.*
[Portrayal standards](../../schemas/portrayal-standards.md) · warm contact · consent not_yet_asked

**Heartbeat:** [brainstorm-heartbeat.md](../../process/brainstorm-heartbeat.md) — talk designs; others implement.

Audience README: [`README.md`](README.md) · Pair show: [`tom-and-golan-ecg-mouther`](../../repo-shows/tom-and-golan-ecg-mouther/)

---

## What we’d love to brainstorm (no coding required)

### ECG — then and now

- What the Interval editor actually felt like day-to-day
- Simplicial complexes / barycentric blends — teaching-size explanation for the audience
- What sliders still get wrong that drag-to-solve got right
- Patent expiry (~2016) — what became free; what still needs rediscovery
- Essay: [`../don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md`](../don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md)
- Patent: [US5933150](https://patents.google.com/patent/US5933150) · HN: [12572696](https://news.ycombinator.com/item?id=12572696)

### Mouther + [Golan Levin](../golan-levin/)

- Golan’s vector faces in the ECG editor; Malcolm Slaney’s phoneme path ([flong](https://www.flong.com/archive/projects/mouther/))
- Do source cartoons / editor files still exist somewhere — or reverse-engineer from archive stills + memory?
- Viseme set: what to keep cartoony vs “realistic”
- Dream pair segment — engine + artist — [SHOW](../../repo-shows/tom-and-golan-ecg-mouther/)

### Reimplement paths (whiteboard only)

| Path | Attractive when… | Tradeoffs |
|------|------------------|-----------|
| **SVG** | Teaching, DOM inspectability, CSS | Performance on dense meshes |
| **Canvas 2D** | Immediate-mode demos, easy pies | Harder constraint debug |
| **WebGPU** | Morph targets, many faces, FBCS stage | Heavier; overkill for first toy |

Ask Tom: which path is elegant for a *first* public ECG toy? What’s a beautiful dead end?

### WigFabrik — the shippable ECG showcase

Soul City craft shop ([portal §6](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/designs/the-computer-as-portal.md#6-wigfabrik--wigomatic-and-the-character-customization-studio)):
aka **Wig-M-Porium** / **WigOMatic**.

- Multitarget **mesh** interpolation (hair-cap / silhouette / volume at simplex vertices)
- Multitarget **texture** interpolation (same weights over SPR2 / UV atlases)
- **AI image-gen** for texture maps + hair patterns *as targets* — not as a replacement for ECG solve
- Optional AI-authored mesh targets; drag UI still solves weights (Moore–Penrose / Jacobian path)
- Compiles to Sims-1 head-skin IFF — camp product, Interval math
- Ask Tom: where AI should stop and direct manipulation should start; teaching-size simplex for a wig

### Morph-target / Faceball thread

- Drag the face → solve ARKit / FaceIt / blend-shape weights (Don↔Tom ongoing)
- [Faceball Construction Set](../../apps/performance-space/faceball-construction-set.yml) — `ecg_blend` lineage
- Soft-body / parameterized parts as ECG clips
- Breakfast simplex cousin: [barycentric UI essay](../don-hopkins/breakfast-simplex-barycentric-direct-manipulation.md)

### Homefun later (optional — never required)

- Someone implements a tiny SVG ECG after the show
- Credit: Tom invents; Golan arts; implementer ships; Don stages the repo

---

## Sources

- [`invitation.md`](invitation.md) · [`CHARACTER.yml`](CHARACTER.yml)
- [`../golan-levin/`](../golan-levin/)
- [Mouther](https://www.flong.com/archive/projects/mouther/)
