# Lively Kernel / Lively Web — Morphic in the browser

**Repo:** [LivelyKernel/LivelyKernel](https://github.com/LivelyKernel/LivelyKernel) · **Live:** [lively-web.org](http://lively-web.org/) ·
**Intro talk:** [Dan Ingalls, JSConf 2012](http://youtu.be/QTJRwKOFddc) · **License:** MIT

Richard Karpinski to Don (2008): *"LK is like Squeak Morphic implemented in JavaScript!"*
Jens Mönig (Snap! `morphic.js` acks): Ingalls's LK set a **"Gold Standard"** for self-sustaining live
systems which morphic.js **cannot and does not aspire to meet**.

---

## What it is (vs Snap! morphic.js)

| | **Lively Web (Ingalls)** | **morphic.js (Jens Mönig)** |
|--|--------------------------|-----------------------------|
| **Ambition** | Full browser **runtime + IDE + wiki** — change the system while it runs | **Minimal GUI kernel** for blocks languages |
| **Shape** | Modular `core/lively/` tree (morphic, ide, lang, net, store, persistence…) | Single file [`src/morphic.js`](https://github.com/jmoenig/Snap/blob/master/src/morphic.js) (~13k lines) |
| **Live edit** | Worlds saved/loaded; code morphs; module system | Dev-mode inspector; not a self-hosting OS |
| **License** | MIT | AGPL |
| **Ebike hook** | Serialization, halos, parts bin, scrubbing, connectors — **construction-set OS** | ScrollFrame inertial pan, template peel-off, menus — **lighter overlay patterns** |

Both inherit **Self → Squeak Morphic** semantics; neither is a line-for-line Squeak port.

---

## Repository layout (`core/lively/`)

Entry stub — [`morphic.js`](https://github.com/LivelyKernel/LivelyKernel/blob/master/core/lively/morphic.js)
only loads the complete module bundle:

```javascript
module('lively.morphic').requires('lively.morphic.Complete').toRun(function() {
// just load it
});
```

Sibling packages (same [`core/lively/`](https://github.com/LivelyKernel/LivelyKernel/tree/master/core/lively) tree):

| Module | Role |
|--------|------|
| **`morphic/`** | Morphic kernel + widgets (see below) |
| **`ide/`** | Browser IDE — browsers, workspaces, code windows |
| **`lang/`** | Class system, traits (historical), lively.lang |
| **`ast/`** | JS AST tooling (live eval / refactor) |
| **`net/`** | Network, URLs, collaboration hooks |
| **`persistence/`** · **`store/`** | Save/load worlds, versioning |
| **`presentation/`** | Slides / presentation morphs |
| **`bindings/`** | Data binding between morphs |
| **`PartsBin.js`** | Parts bin — peel widgets off a palette (Scratch/Squeak pattern) |
| **`ModuleSystem.js`** | Dynamic module load — live require while running |
| **`Main.js`** | Bootstrap into a world |

README pitch: *"All development happens live… you change your application and the system while it is
running."* No install required for the public instance; local dev: `npm start` →
[localhost:9001](http://localhost:9001/welcome.html).

---

## `core/lively/morphic/` — file map

Source tree: [github.com/LivelyKernel/LivelyKernel/tree/master/core/lively/morphic](https://github.com/LivelyKernel/LivelyKernel/tree/master/core/lively/morphic)

| File / dir | Purpose |
|------------|---------|
| **`Core.js`** | World, morph tree, stepping — kernel |
| **`Events.js`** | Hand, mouse/touch/gesture dispatch |
| **`Rendering.js`** · **`Canvas.js`** · **`Graphics.js`** | Dirty rects, canvas draw pipeline |
| **`Halos.js`** | Squeak-style **halos** — resize/rotate/duplicate handles around selection |
| **`Serialization.js`** | Persist morph trees — worlds as data |
| **`ScriptingSupport.js`** | Script tiles on morphs (Etoys-like) |
| **`Scrubbing.js`** | Bret-Victor **scrubbing** — drag numbers to change live |
| **`Connectors.js`** | Visual wires between morphs |
| **`constraints/`** | Layout constraints (searchable constraint solver) |
| **`Widgets.js`** · **`Lists.js`** · **`TabMorphs.js`** | UI chrome |
| **`HTML.js`** | HTML-backed morphs (DOM inside Morphic) |
| **`SVG.js`** · **`PathShapes.js`** · **`Shapes.js`** | Vector geometry |
| **`DraggableJavaScript.js`** | Drag code snippets onto morphs |
| **`Clipboard.js`** | Copy/paste morphs and data |
| **`Animation.js`** | Transitions |
| **`Layout.js`** | Submorph layout |
| **`Complete.js`** | Aggregator — everything `morphic.js` requires |
| **`tools/`** | Color chooser, inspector tools |
| **`tests/`** | Morph containment, rendering tests |

Last meaningful morphic commits in upstream repo ~2018–2019 (maintenance mode); architecture still
the reference for **full** browser Morphic.

---

## Lineage position

```
Self Morphic (Smith, Maloney)
  → Squeak Morphic (Maloney, Ingalls)
  → Lively Kernel / Lively Web (Ingalls, Sun ~2008 → lively-web.org)
       └── modular morphic/ + ide/ + persistence — LIVE SYSTEM in the browser
  → morphic.js (Jens Mönig, Snap!) — distilled Canvas kernel, Squeak-flavored
  → SqueakJS (Freudenberg) — full Smalltalk VM + Morphic in JS
```

**Alan Kay's criterion:** NeWS was right *except it missed the live system underneath.* Lively Web is
Ingalls's attempt to put that **live system underneath** in JavaScript — not just widgets on a page.

---

## Ebike Safari / map platform hooks

| LK feature | Game / sim use |
|------------|----------------|
| **`Halos.js`** | Direct-manipulate pinball gadgets, fences, windmills on the map |
| **`PartsBin.js`** | Construction-set palette — peel templates onto OSM graph |
| **`Serialization.js`** + **`store/`** | Git ↔ Postgres sync — worlds as serializable morph trees |
| **`Scrubbing.js`** | Replay scrubber, smell threshold / bounce knobs |
| **`Connectors.js`** | ONI pipes between polders, tanks, refineries |
| **`ScriptingSupport.js`** | YAML-jazz morphs with live scripts (MOOLLM characters tend shops) |
| **Live module load** | Add gadgets without reload — matches "demo tools inside the game" |

For a **web-first demo**, Jens's **`ScrollFrameMorph` inertial pan** may ship faster; for **live
construction-set on a shared world**, study LK's halos + parts bin + serialization.

Cross-refs: [Jens morphic.js digest](../../jens-monig/sources/morphic-js.md) ·
[Alan Kay morphic lineage](../../alan-kay/sources/morphic-lineage.md) ·
[Ebike navigation-smell-steer](../../../apps/ebike-safari/design/navigation-smell-steer.md).

---

## Public sources

| Resource | URL |
|----------|-----|
| GitHub repo | https://github.com/LivelyKernel/LivelyKernel |
| morphic/ directory | https://github.com/LivelyKernel/LivelyKernel/tree/master/core/lively/morphic |
| README (install) | https://github.com/LivelyKernel/LivelyKernel/blob/master/README.md |
| Lively-101 tutorial world | http://lively-web.org/users/robertkrahn/Lively-101.html |
| JSConf '12 talk | http://youtu.be/QTJRwKOFddc |
| Don — pie menus vs halos | [`../../don-hopkins/pie-menus-chi-88-and-beyond.md`](../../don-hopkins/pie-menus-chi-88-and-beyond.md) |

↑ [Dan's room](../README.md) · [Design principles OS quote](design-principles-os-quote.md)
