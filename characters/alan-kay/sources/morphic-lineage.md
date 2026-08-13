# Morphic — where it lives (lineage map)

**Morphic did not start in Smalltalk.** It began in **Self** (Ungar & Smith, Sun Labs, ~1992), then was
ported to **Squeak** by Dan Ingalls and collaborators. Alan Kay's Sugar/OLPC emails discuss **Etoys**
(which *is* Morphic) and "windows without windows" — not Morphic's invention, but the **constructionist
carrier** he wanted integrated across media objects.

Don Hopkins ↔ Alan Kay on **MVC vs Morphic vs watchers**:
[`../media/discussions/hn-mvc-morphic-watchers-2015.md`](../media/discussions/hn-mvc-morphic-watchers-2015.md).

**OLPC / Etoys / Snap!** (Alan emails quoted by Don, HN Nov 2025):
[`../../david-ungar/sources/hn-self-1989-selfishscript-45706924.md`](../../david-ungar/sources/hn-self-1989-selfishscript-45706924.md)
(comment [45715306](https://news.ycombinator.com/item?id=45715306)) — "Children First!", windows-without-windows, Python-vs-Squeak integrative base.

Richard Karpinski to Don (2008): **Lively Kernel** = "Squeak Morphic implemented in JavaScript" — pie menus
vs tiny halo spots ([`../../don-hopkins/pie-menus-chi-88-and-beyond.md`](../../don-hopkins/pie-menus-chi-88-and-beyond.md)).

---

## The chain (Self → browser)

```
Self (1992) — Morphic invented
  └── handbook: https://handbook.selflanguage.org/2017.1/morphic.html
  └── intro: https://sin-ack.github.io/posts/morphic-intro/
  └── 1989 JIT paper (HN 2025): Don + Ungar "SelfishScript" / pessimization — [`../../david-ungar/sources/hn-self-1989-selfishscript-45706924.md`](../../david-ungar/sources/hn-self-1989-selfishscript-45706924.md)
  └── open runtime: https://github.com/russellallen/self

Squeak Smalltalk — Morphic port; Etoys, Scratch 1.x lineage
  └── live in browser: https://try.squeak.org/ (SqueakJS — VM in JS, full Morphic)
  └── Squeak 6.1 "Vanessa" — tree morphs, Objectland, Etoys ([release notes](https://squeak.org/release_notes/6.1/))

Dan Ingalls — Lively Kernel / Lively Web (Sun ~2008 → lively-web.org)
  └── Full live system in JS — not a library; MIT license
  └── core/lively/morphic/ — Core, Events, Halos, Serialization, Scrubbing, Connectors, constraints…
  └── core/lively/ide, store, persistence, PartsBin, ModuleSystem — wiki + save worlds
  └── morphic.js stub → requires lively.morphic.Complete
  └── JSConf '12: http://youtu.be/QTJRwKOFddc
  └── digest: ../../dan-ingalls/sources/lively-kernel-morphic.md
  └── Karpinski: "Squeak Morphic implemented in JavaScript!"

Snap! (Berkeley — Brian Harvey, Jens Mönig)
  └── Morphic.js — Canvas+JS reimplementation (NOT a direct Squeak port; Squeak treasure-trove)
  └── src/morphic.js + docs/morphic.txt — single-file kernel (~13k lines, AGPL)
  └── World/Hand/stepping/dirty-rects; template peel-off; Inspector dev mode
  └── Scratch lineage (Scratch 1 = Squeak); Snap! = blocks on Morphic for web + CS education
  └── digest: ../../jens-monig/sources/morphic-js.md

SqueakJS / Caffeine / Croquet line
  └── Vanessa Freudenberg — Squeak in JS, Croquet microverses
  └── Alan Kay memorial arc: [`../../vanessa-freudenberg/`](../../vanessa-freudenberg/)

Pharo / Glamorous Toolkit — alternate Smalltalk UI stacks (not pure Morphic; GT is moldable tools)
```

---

## Snap! morphic.js vs Lively Web — same code?

**No. Totally different codebases.** Same *family* (Self → Squeak Morphic), not the same fork.

| Question | Answer |
|----------|--------|
| **Same source?** | No. Zero shared files. `diff` between them is all differences. |
| **Same architecture?** | **Conceptually yes**, **engineering no** — both have morph trees, world/hand, stepping, drag/drop; different class systems, render pipelines, scope. |
| **Did Snap fork LK?** | No. Jens wrote **morphic.js independently** (~2010, for BYOB4). He names Ingalls's LK as gold standard and Maloney/Squeak as literal source for *some* methods — not as a code fork. |
| **When did Snap get morphic.js?** | **Day one.** Snap repo created **2013-03-16** with `morphic.js` already ~10.5k lines. [349 commits](https://github.com/jmoenig/Snap/commits/master/src/morphic.js) since; active through **2026** (`morphicVersion = '2026-May-11'`). |
| **Standalone library?** | Yes — [github.com/jmoenig/morphic.js](https://github.com/jmoenig/morphic.js) mirrors `Snap/src/morphic.js` (same file today). |

### Timelines (parallel, not sequential)

```
~1992  Self Morphic (Smith, Maloney)
~1996  Squeak Morphic (Maloney, Ingalls) — Etoys, Scratch 1
~2006–2008  Lively Kernel (Ingalls, Sun) — first browser LIVE SYSTEM
~2010  morphic.js started (Jens) — Canvas library for BYOB4, not LK extraction
2013-03-16  Snap! git repo — morphic.js bundled at creation
2014+  LK morphic/ module tree matures (Core.js, Halos, Serialization…)
2026  Both still exist; Snap morphic.js ~13k lines; LK ~40 morphic modules + full IDE stack
```

### Engineering comparison

| | **Lively Web** [`core/lively/morphic/`](https://github.com/LivelyKernel/LivelyKernel/tree/master/core/lively/morphic) | **Snap! morphic.js** [`src/morphic.js`](https://github.com/jmoenig/Snap/blob/master/src/morphic.js) |
|--|--|--|
| **Author / era** | Ingalls et al., Sun ~2008 | Jens Mönig, ~2010 |
| **Lines** | ~40 modules (`Core.js` alone ~1.4k; whole tree much larger) | **Single file ~13k** |
| **Class system** | `Object.subclass('lively.morphic.Morph', …)` — Lively kernel classes | `function Morph()` + `Morph.prototype = new Node()` — Squeak-*flavored* JS prototypes |
| **Rendering** | **HTML + Canvas** render contexts (`HTML.RenderContext` default); SVG paths | **Canvas only** — no DOM widgets |
| **Transforms** | Rotation, scale on morphs | No general morph rotation in kernel |
| **Selection UI** | **`Halos.js`** — Squeak-style halo handles | `HandleMorph`, dev-mode context menus |
| **Persistence** | **`Serialization.js`**, store, persistence modules | `fullCopy()` (Squeak port, Jens says literally) |
| **Scope** | Full OS: IDE, module loader, wiki, parts bin, live eval | GUI kernel only; Snap's `gui.js` / `blocks.js` sit on top |
| **License** | MIT | AGPL |
| **Jens's verdict** | Gold standard self-sustaining system | *"Not a direct port of Squeak's Morphic… if it looks, feels and smells like Squeak, I'll take it as a compliment."* |

### What they share (Squeak DNA, not each other)

Both inherit **ideas** from Squeak Morphic, not code from each other:

- Tree of submorphs, event bubbling, drag-and-drop ownership changes
- World coordinates + invisible hand/cursor dispatch
- Stepping + incremental redraw (LK: render contexts; Snap: `broken[]` dirty rects + `doOneCycle()`)
- Direct manipulation over MVC controllers

Snap-specific ports Jens documents from **Squeak** (not LK): e.g. `fullCopy()` / `copyRecordingReferences()`, `Point` `@` notation, `amountToTranslateWithin` comment *"Taken from Squeak."*

LK-specific: `morphicSetter`/`morphicGetter`, `ObjectGraphLinearizer`, constraint solvers, wormhole-style live coding — **no equivalents in morphic.js**.

### Where Snap! sits in the lineage

Snap! **includes** morphic.js as its entire interactive substrate — not a plugin, not a subset of LK.
Blocks, scripts, IDE chrome (`gui.js`) are Morphic morphs running on Jens's kernel. See
[Squeak wiki Morphic.js overview](https://wiki.squeak.org/squeak/6550) and
[Wikipedia Morphic (software)](https://en.wikipedia.org/wiki/Morphic_(software)) — both list LK and morphic.js as **separate** JavaScript Morphic implementations.

---

## Multiple inheritance? Traits? Copying?

**Neither JS port uses JavaScript multiple inheritance.** More importantly: **Self Morphic didn't use classical MI either.**

### Self (~1992) — traits + prototypes + delegation

From the [Self handbook §7.3](https://handbook.selflanguage.org/2017.1/morphic.html):

- **Parallel hierarchies:** a **traits** object (shared behavior) and a **prototype** (shared structure/slots).
- Instances delegate to traits via a **`parent*`** slot — not subclassing in the Smalltalk sense.
- **Copy-down:** derived prototypes are described differentially ("just like parent except these slots added/changed/removed") — can *replace* slots, not only extend them.
- **Bottom-up creation:** `morph copy` → tweak slots → factor shared behavior into a new traits object ("arrow-dragging").

That is **composition through delegation + copying**, not C++-style MI. Self the language *can* use multiple parent slots, but Morphic's documented idiom is a **traits chain** (`traits morph` at the root).

### Squeak — single inheritance classes

Maloney/Ingalls port = **one superclass per morph class**. Squeak later got **Traits** (Schärli et al.) as a compositional add-on, but classic Etoys Morphic is a straight class tree.

### Lively Web — single inheritance + explicit Trait cheat

LK classes are **`Object.subclass('lively.morphic.Morph', …)`** — one superclass chain (`MiniBase.js`).

The cheat for "multiple behavior sources" is **`lively.Traits`** (`core/lively/Traits.js`):

```javascript
lively.morphic.Morph.subclass('lively.morphic.Window',
    Trait('lively.morphic.DragMoveTrait').derive({override: ['onDrag',…]}),
    …);
lively.morphic.Morph.subclass('lively.morphic.Text', Trait('TextChunkOwner'), …);
```

Traits can **`.applyToClass()`**, **`.applyToObject()`**, or **`.mixin()`** (prototype-chain surgery via `__proto__`). Scrubbing, style sheets, drag-move, text chunks — all trait-composed. **Not MI — deliberate Smalltalk-Traits-style composition ported to JS.**

### Snap! morphic.js — single inheritance + Squeak copying

No trait system. Classic pseudo-classical JS:

```
Node → Morph → FrameMorph / HandMorph / MenuMorph / …
     XMorph.prototype = new Morph();  XMorph.uber = Morph.prototype;
```

The Self/Squeak idiom survives as **copying**, not delegation:

| Mechanism | Role |
|-----------|------|
| **`copy()`** | Shallow instance duplicate (`Object.create` + field copy) |
| **`fullCopy()`** | Jens: ported **almost literally from Squeak** — tree copy + reference rewiring |
| **`copyRecordingReferences(map)`** | Squeak comment preserved in source |
| **`isTemplate` peel-off** | Construction-set palette — copy prototype morph at grab time |

So Snap "cheats" differently from LK: **uber-calls + literal copy**, not traits. For peel-off gadgets and `fullCopy()` duplication, copying *is* the architecture.

### Was giving up MI a huge change?

**Less than it looks** — because the Morphic line was never MI-centric:

| Layer | Inheritance model | Composition cheat |
|-------|-------------------|-------------------|
| **Self Morphic** | Traits + prototypes + delegation | Copy-down, `morph copy` |
| **Squeak Morphic** | Single-inheritance classes | (Later: Traits) |
| **Lively Web** | Single-inheritance JS classes | **`Trait(...)` mixins** |
| **Snap morphic.js** | Single-inheritance JS prototypes | **`fullCopy()` + template peel-off** |

The live-system feel comes from **copyable morph trees + shared behavior objects**, not from MI. LK rebuilt shared behavior with Traits; Jens rebuilt duplication with Squeak's `fullCopy()` and skipped traits entirely — smaller kernel, blocks IDE doesn't need LK's trait algebra.

---

## What Morphic *is* (one paragraph)

**Live morphs** — graphical objects that are **first-class** in the runtime: nested, scripted, halos,
direct manipulation, no separate "application" shell. Contrast MVC's controller baggage (Kay: views as
**watchers** that don't mutate the model; never solved **automatic inverter** for projection loss).
Self reflection: edit booleans, numbers, colors on the morph itself — "soup of objects" (HN **doublec**).

### Morphic in the browser — two JS implementations

**Lively Web (Dan Ingalls)** — [github.com/LivelyKernel/LivelyKernel](https://github.com/LivelyKernel/LivelyKernel):
the **full live system**. Modular [`core/lively/morphic/`](https://github.com/LivelyKernel/LivelyKernel/tree/master/core/lively/morphic)
(~40 files: `Core.js`, `Halos.js`, `Serialization.js`, `Scrubbing.js`, `Connectors.js`, `constraints/`…)
sits beside `ide/`, `store/`, `persistence/`, `PartsBin.js`, `ModuleSystem.js`. Worlds persist; code and
morphs edit while running. Jens Mönig's ack: gold standard morphic.js *does not aspire to meet*. Digest:
[`../../dan-ingalls/sources/lively-kernel-morphic.md`](../../dan-ingalls/sources/lively-kernel-morphic.md).

**morphic.js (Jens Mönig, Snap!)** — single-file **minimal kernel** for blocks IDEs: World/Hand/stepping,
template peel-off, ScrollFrame inertial pan. Practical substrate without LK's wiki/OS scope. Digest:
[`../../jens-monig/sources/morphic-js.md`](../../jens-monig/sources/morphic-js.md).

| Feature | Lively Web | Snap! morphic.js |
|---------|------------|------------------|
| Halos on selection | `Halos.js` | `HandleMorph`, dev menu |
| Parts bin palette | `PartsBin.js` | `isTemplate` peel-off |
| Number scrubbing | `Scrubbing.js` | `useSliderForInput` |
| Visual connectors | `Connectors.js` | — |
| Save/load worlds | `Serialization.js` + store | `fullCopy()` only |
| HTML inside morphs | `HTML.js` | canvas-only |

Key distinction from Squeak Morphic in **Jens's kernel**: no general rotation on arbitrary morphs;
turtle via `PenMorph`. LK's **`Halos.js`** is closer to Squeak's full direct-manipulation chrome.
**ScrollFrameMorph** (Jens) and **Scrubbing.js** (LK) both cover inertial/scrub interaction families
relevant to map navigation and replay UI.

---

## Alan Kay on Etoys / Sugar (June 2007)

From Sugar list ([full thread in Don's forwards](../../don-hopkins/)) — Kay on Rebecca Gettys' "scratchpad" idea:

- **Etoys already is** the scratchpad (draw, write, calculate, multimedia collage).
- **Integration:** "Sugar can and should be a lot more integrated… media objects combined freely… populate any
  **document** or **project**." Etoys uses one way; not the only way.
- **"Windows without windows":** compositing graphical front-ends (X without frames) — same graphical
  properties, different back-end drivers (Python, JS, Squeak plugins).
- **Etoys per se less important than authoring power for children** — working on richer next environment.
- **External formats:** Etoys documents can be stored on servers, passed as homework (s-expressions / XML).
- **MathMorphs / MorphicWrappers** (Argentinian Squeak community): type-anywhere math on morphs —
  http://www.dm.uba.ar/MathMorphs/ · [Squeak wiki 5855](http://wiki.squeak.org/squeak/5855)

Follow-up P.S.: Python could parse Etoys file format and unify on XO — but **integrated multi-media
architecture** still needed.

---

## Best resources (HN + primary)

| Resource | URL | Notes |
|----------|-----|-------|
| **Self Morphic handbook** | https://handbook.selflanguage.org/2017.1/morphic.html | Start here (pjmlp / davexunit thread) |
| **Morphic intro (blog)** | https://sin-ack.github.io/posts/morphic-intro/ | Accessible architecture tour |
| **Try Squeak / SqueakJS** | https://try.squeak.org/ | Squeak 6.1 in browser; drop images |
| **Squeak 6.1 release notes** | https://squeak.org/release_notes/6.1/ | Objectland, tree morph overhaul |
| **HN Morphic architecture ask** | https://news.ycombinator.com/item?id=49242653 | Squeak 6.1 thread; davexunit question |
| **HN MVC/Morphic/watchers** | https://news.ycombinator.com/item?id=8841428 | Don ↔ Alan quotes |
| **Dan Ingalls / LK** | [`../../dan-ingalls/`](../../dan-ingalls/) | Lively Kernel, Smalltalk Zoo |
| **Lively Web repo** | https://github.com/LivelyKernel/LivelyKernel | Full live Morphic + IDE |
| **LK morphic/ tree** | https://github.com/LivelyKernel/LivelyKernel/tree/master/core/lively/morphic | Halos, Serialization, Scrubbing… |
| **LK digest (WWSFF)** | [`../../dan-ingalls/sources/lively-kernel-morphic.md`](../../dan-ingalls/sources/lively-kernel-morphic.md) | Module map + Ebike hooks |
| **Ingalls JSConf '12** | http://youtu.be/QTJRwKOFddc | Live edit demo |
| **David Ungar / Self** | [`../../david-ungar/`](../../david-ungar/) | Morphic origin |
| **Snap! show seed** | [`../../repo-shows/snap-logo-brian-jens/`](../../repo-shows/snap-logo-brian-jens/) | Living blocks + Morphic UX |
| **Morphic.js source** | https://github.com/jmoenig/Snap/blob/master/src/morphic.js | Jens; inline programming guide |
| **Morphic.js standalone** | https://github.com/jmoenig/morphic.js | Same file as Snap; library extract |
| **Squeak wiki morphic.js** | https://wiki.squeak.org/squeak/6550 | BYOB4 / ~2010 origin |
| **Morphic.js docs** | https://github.com/jmoenig/Snap/blob/master/docs/morphic.txt | Standalone copy of header docs |
| **Morphic.js digest (WWSFF)** | [`../../jens-monig/sources/morphic-js.md`](../../jens-monig/sources/morphic-js.md) | Architecture + Ebike hooks |
| **Brad Myers *Pick, Click, Flick!*** | https://www.ixtbook.com/ | Don chapter 33; interaction techniques |

---

## Repo characters (who to read)

| Person | Role in Morphic line |
|--------|----------------------|
| [David Ungar](../../david-ungar/) | Self — Morphic invented |
| [Dan Ingalls](../../dan-ingalls/) | Squeak port, Lively Kernel JS |
| [Alan Kay](../README.md) | Etoys advocacy, watchers, not Morphic author |
| [Don Hopkins](../../don-hopkins/) | Pie menus in Morphic worlds; MVC flame; PIXIE |
| [Vanessa Freudenberg](../../vanessa-freudenberg/) | SqueakJS, Croquet |
| [Brian Harvey](../../brian-harvey/) · [Jens Mönig](../../jens-monig/) | Snap! |
| [Bert Freudenberg](../../bert-freudenberg/) | Sugar/Etoys on XO (quoted in Sugar thread) |

---

## Ebike Safari / map UI hook

Our **MediaGraph inertial pan + pie menu smell steer** ([`../../../apps/ebike-safari/design/navigation-smell-steer.md`](../../../apps/ebike-safari/design/navigation-smell-steer.md))
inherits the same direct-manipulation ethic: **grab the map anytime**, default wedge pre-selected,
projection without losing agency — Morphic on a street graph instead of a Project.

Concrete precedents:

**Snap! morphic.js** ([`../../jens-monig/sources/morphic-js.md`](../../jens-monig/sources/morphic-js.md)):

- **`ScrollFrameMorph`** — drag-scroll + velocity/friction decay (inertial map pan).
- **`MenuMorph.popUpAtHand`** — goal picking at the hand; keyboard arrow navigation.
- **`isTemplate` peel-off** — construction-set palette for pinball gadgets.
- **`world.isDevMode` + `InspectorMorph`** — debug/replay tools inside the game.

**Lively Web** ([`../../dan-ingalls/sources/lively-kernel-morphic.md`](../../dan-ingalls/sources/lively-kernel-morphic.md)):

- **`Halos.js`** — Squeak-style manipulation handles on selected gadgets.
- **`PartsBin.js`** + **`Serialization.js`** — persistent construction-set worlds.
- **`Scrubbing.js`** — replay scrubber and live parameter tweakers.
- **`Connectors.js`** — visual pipes between ONI fluid layers.

↑ [`../README.md`](../README.md) · [`../ideas.md`](../ideas.md) §23 Watchers/Morphic
