# Whatsa Controller Anyway? — Baypiggies (2005) + Lua-l (2006)

*Primary mail posts Don later quoted in the [2011 Reddit MVC flame](2011-reddit-mvc-flame-morphic.md).*
[Portrayal standards](../../../schemas/portrayal-standards.md)

| When | Where | Link |
|------|-------|------|
| 2005-04-24 | BayPIGgies — *Whatsa Controller Anyway?* | [Wayback](https://web.archive.org/web/20081027202900/https://deirdre.org/pipermail/baypiggies/2005-April/000918.html) · [live if up](https://deirdre.org/pipermail/baypiggies/2005-April/000918.html) |
| 2006-08-29 | lua-l — *Re: Lua MVC web framework?* | [MARC](https://marc.info/?l=lua-l&m=115687537130296) |

**Show fuel:** [Craig Latta / Morphic](../../craig-latta/ideas.md) · [Reddit harvest](2011-reddit-mvc-flame-morphic.md) · [ScriptX DreamScape room essay](../kaleida-scriptx-dreamscape-multimedia-lisp-machine.md)

---

## Arc

Ilia Iourovitski (Baypiggies): in Smalltalk land MVC was replaced by **Morphic** ([Squeak wiki](http://minnow.cc.gatech.edu/squeak/30)).

Don’s reply (2005), then shortened for Lua-l (2006):

1. **Web MVC ≠ Smalltalk MVC** — shoehorning Struts-style request/response into the Smalltalk trinity is cargo cult.
2. **GUI controllers are obsolete** — use centralized **services** (NeWS TNT tracking, ScriptX TrackService), not a controller between every view and model.
3. **Morphic / Self** — exploratory programming mattered more than the MVC boxes; Randy Smith’s Morphic for Self → Squeak; tangled inheritance Self ↔ Smalltalk.
4. **Swing** already merged view+controller into one UI delegate for the same brittleness reason.
5. **Conscientious Objector** to “MVC is the new thing for all situations.”

---

## Sound bites (verbatim-ish)

- Controllers can be like having **Gilbert Godfrey** along as a third leg on a date. *(Lua-l 2006)*
- Why not call it **Model/View/Session/Request/Response/Container** and be honest?
- Fuzzy Logic Design + Cargo Cult Design.
- Sun overloading “MVC” (and “JavaScript”) is marketing, not engineering — like LiveScript → JavaScript.
- Jobs paraphrase: *If you're telling me you can just put another layer on top of something, you don't have a solution and you're just wasting my time.*
- TNT 2.0 goal: **Twice the Speed and Half the Size** — by factoring services, not MVC.
- DreamScape WWDC 1995: *lots of views and models, a few services, a couple of frameworks, but **no controllers**.*

### Two basic points (both posts)

1. **Web frameworks:** “Controller” means something else than Smalltalk GUIs; lumping leftovers into one Controller class to ape Smalltalk is Cargo Cult Design.
2. **GUI frameworks:** Controllers aren’t OO, break encapsulation, add brittle interfaces — problems simpler solutions already solve.

---

## NeWS / ScriptX — services, not controllers (Baypiggies long form)

**NeWS Open Look Toolkit 2.0 (1990):** global event manager; strict sync; `KeyboardService` / `TrackingService` / `SelectionService`; Canvas subclasses set `Trackable` — mouse events without per-view controller objects.

**ScriptX Tracking Service (Don, 1995):**

- Docs: http://www.art.net/~hopkins/Don/lang/scriptx/tracking.html  
- `TrackService` + `Tracker` mixin; coordinate transform via `TwoDMatrix`; delegate tracking to nested / offscreen presenters or **directly to the model**; `trackStart` handshake then direct delivery (no intermediate controllers).

**ScriptX Web module (no Controllers either):**

- http://www.art.net/~hopkins/Don/lang/scriptx/web.html  
- Different architecture from tracking — don’t overload the same buzzword.

**Link Globally, Interact Locally (1995):**

- http://www.art.net/~hopkins/Don/lang/scriptx/scriptx-www.html  
- Distributed ScriptX → path to OpenLaszlo (Don notes he’s on OL when writing Baypiggies).

**DreamScape WWDC demo (1995-05-11):**

- http://www.art.net/~hopkins/Don/lang/scriptx/demo/index.html  
- Live GUI via tracking service + Netscape image-map inspect of ScriptX objects.

**DreamScape philosophy → Sims plugins:**

- http://www.art.net/~hopkins/Don/lang/scriptx/philosop.html

---

## Morphic (from Ilia + Don)

> In Squeak, MVC is available as one of the user interface environments… The other… is Morphic, which is somewhat newer, originally developed for the language Self, and then ported to Squeak.

Don: Self’s exploratory GUI was cooler than MVC and harder to imitate — *you could click around and explore everything about the system.* Morphic is Smalltalk → Self → Smalltalk again (“prototypical” tangled web of inheritance).

---

## Lua-l short form (2006)

[MARC archive](https://marc.info/?l=lua-l&m=115687537130296) — same two points + Gilbert Godfrey line + pointers to Baypiggies, OpenLaszlo constraints/binding, NeWS/ScriptX services, Spring IoC. Explicit: Smalltalk people moved beyond MVC years ago; Java calmed down to Models and Views.

---

## Show hooks

| Guest / thread | Angle |
|----------------|-------|
| **Craig Latta** | Morphic-in-browser (Caffeine) = the living rebuttal to web-MVC cargo cult |
| **David Ungar** | Self Morphic origin — Randy Smith |
| **Dan Ingalls** | Squeak Morphic port |
| **Pie menus / tracking** | ScriptX TrackService designed for DM, painting, **pie menus**, widgets |
| **Soul City / MicropolisCore** | Services + constraints, not Controller-per-widget |

---

↑ [Don sources](README.md) · [2011 Reddit flame](2011-reddit-mvc-flame-morphic.md) · [Craig ideas](../../craig-latta/ideas.md)
