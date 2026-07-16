# Pie menus — Buxton 12-item experiment, DDJ pitch, draft outline (1991)

Primary correspondence: Don Hopkins ↔ Bill Buxton (Xerox PARC), Ramiro Valdes (Dr. Dobb's Journal), Sept 1991.

## Buxton experiment — 8 vs 12 items (26 Sep 1991)

Don → **Bill Buxton** (`[email redacted]`):

- Buxton's **12-item** pie (numbers laid out **like a clock**) was **very fast — even faster than 11 items**.
- Don asks how much the **clock metaphor** and numeric labels drove results vs words, colors, or non-clock number order.
- **8-item** menus: primary vertical/horizontal + secondary diagonal gestures; cognitive comfort of **symmetry** and **geographical grounding** — Don was not surprised at 8-item speed.
- **Twelve** exploits clock metaphor well; **eight** has **more metaphors with wider application** and is few enough to **keep in working memory**.
- **8 maps to keypad / touch-tone** — traverse the same menu tree (or virtual city) by mouse, keyboard, or phone.
- **Scrolling 8-item pie** = **spiral staircase** with landings/doors at compass directions; city intersections (N/S/E/W + corner buildings); halls/rooms inside buildings.
- Don plugs **lambda.parc.xerox.com:8888** — **LambdaMOO** ("object oriented programmable multi user dungeon").

Show hook: empirical design debate with Buxton *before* marking-menu patent era — complements [`2008-2023-pixie-buxton-patent-thread.md`](2008-2023-pixie-buxton-patent-thread.md).

## DDJ — Ray Valdes thread (5–6 Sep 1991)

**Ray Valdes** (Technical Editor, Dr. Dobb's Journal) → Don: CHI paper *Pies: Implementation, Evaluation and Application of Circular Menus* (Callahan, Weiser) — theme issue on **User Interfaces** (Dec 1991 target).

Don's reply:

- Rewriting since original submission; interested in **some form** of DDJ article.
- Latest code: **~1400 lines** object-oriented **PostScript** for **The NeWS Toolkit (TNT)** on OpenWindows.
- Techniques on display: event handling, mouse tracking, timers, state machines, **display preemption**, lightweight processes, animation, rubber banding, multiple inheritance.
- **Videotapes**: pie menus, tab windows, **PizzaTool** — offers copy + in-person walkthrough ([phone redacted] / [phone redacted]).

Valdes (6 Sep): two-article split —

1. **UI concept** article (Dec '91): layout, mouse warping, hit detection, screen real estate, mouse-ahead; cite SIG-CHI; code optional if **<500–600 lines** (excerpt PostScript or earlier **uwm** X10 impl).
2. **Graphics / NeWS implementation** article (Jul '92): Sun PostScript display extensions, canvases, dependents, mix-ins; elucidate **ThrowPie**, **PieMotion**, **promote/unpromote**.

## Draft outline sent to Valdes (19 Sep 1991)

Don's working document (typed fresh, not cut-paste) — core design vocabulary still used today:

### Definition

- Circular menus; selection by **direction** between two points (mouse, pen, touch, hand wave).
- Center = **inactive** (dismiss without selection).
- Wedges adjacent to cursor in different directions.

### Fast and easy

- Minimal cursor motion; direction needs no visual feedback.
- Large wedge targets extending to screen edges; precision increases with radius (**leverage** for click-ahead).

### Two dimensions

- **Direction and distance** as parameters; path between endpoints irrelevant.

### Self-revealing gestural UI

- Move any direction and **click ahead** so fast the menu never pops up.
- Slower use: menu pops up, teaches labels + gesture for muscle memory.
- Nested click-ahead through submenus.

### Implementation invariants (mouse)

- Center menu on **button-down** location, not current cursor (click-ahead integrity).
- **Warp cursor** by same offset when menu repositioned for screen edge — only when menu is visibly displayed.
- Active slice areas extend to screen edges.

### Disadvantages + mitigations

- Large popup area; odd item counts less symmetric; **dynamic menus break click-ahead**.
- Layout: justify label edges at inner radius; "pie crust" divider lines.
- **Dissolve** large menus into nested pies; **scrolling spiral** pie for many items.

### Speed / accuracy

- Fitts: large wedges close to cursor vs small distant linear targets.
- **Callahan** experiment (8-item pies vs linear).
- **Buxton** experiment: 8 and 12 very good; rehearsal; trackball bad; mouse good; **pen great**.

### Metaphor table (item count → metaphor)

| Items | Metaphor |
|-------|----------|
| 2 | switch / confirmation boolean |
| 4 | box / room / arrows / edges / corners |
| 6 | hex |
| 8 | compass / arrows / edges+corners |
| 10 | decimal |
| 12 | clock / months |

Geographical navigation: city streets, building halls/rooms, tree branches.

### Implementations cited (1991)

- X10 **uwm** window manager
- SunView SDI game
- NeWS Lite Toolkit
- OpenWindows **TNT**
- "Safer than linear menus, probably not patented" — League for Programming Freedom

## Cross-links

- [`../pie-menus-chi-88-and-beyond.md`](../pie-menus-chi-88-and-beyond.md) — CHI'88 lineage + DDJ primary source slot
- [`../gesture-space.md`](../gesture-space.md) — spiral staircase / city navigation metaphors
- [`1991-03-mark-weiser-pie-menu-tape-stylus.md`](1991-03-mark-weiser-pie-menu-tape-stylus.md) — alphabetic pies + demo tape
- [`1991-pizzatool-provenance-unix-today.md`](1991-pizzatool-provenance-unix-today.md) — tapes Valdes wanted to see
- [`../../mark-weiser/ideas.md`](../../mark-weiser/ideas.md) — memorial CHI'88 hook
- [`../../ben-shneiderman/ideas.md`](../../ben-shneiderman/ideas.md) — co-author table
