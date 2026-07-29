# Seeds — Don → Tom Lord, 21 Aug 2006 (Re: Lua)

**Date:** 21 August 2006 · **From:** Don Hopkins · **To:** Thomas Lord  
**Full letter (private):** DonHopkins `correspondence/attachments/thomas-lord/private/2006-08-21-lua-spidermonkey-ungar-full.md`  
**HN Ungar graph (2022):** [`../self-v8-tom-lord-2006-hn-2022.md`](../self-v8-tom-lord-2006-hn-2022.md)  
**Ungar guest extract:** [`../../david-ungar/sources/2006-08-21-don-to-tom-lord-ungar-at-laszlo.md`](../../david-ungar/sources/2006-08-21-don-to-tom-lord-ungar-at-laszlo.md)

Public room holds **seeds** — plantable beats. Personal nightlife / comedy / muscle jokes stay private.

---

## Seed map (where they grow)

| Seed | Planted / grow in |
|---|---|
| Ungar interviewing at Laszlo; Self factorial/`*` demo; JS "devious enough" | [`david-ungar/`](../../david-ungar/) · [`openlaszlo` show](../../../repo-shows/openlaszlo/) · this + HN excerpt |
| OpenLaszlo "lisp-heads with their heads in the right place"; SpiderMonkey to reuse OL runtime / custom graphics | [`david-temkin/sources/`](../../david-temkin/sources/) · Micropolis OL client |
| Pocket PC talking pie menus + Cepstral; dog / cat / pet-rock remotes | [`don-hopkins/sources/pie-menu-timeline.md`](../../don-hopkins/sources/pie-menu-timeline.md) |
| Lua / WoW Cosmos — considering pie menus as spell/macro UI; Tom on Guile one-shot continuations | this room · Guile dossier · pie-menu ideas |
| Zope/Plone → TurboGears + SQLObject → watching SQLAlchemy; Rails kool-aid vs Python wine | [`nutritionquest-turbogears-genshi-alive-pd.md`](../../don-hopkins/nutritionquest-turbogears-genshi-alive-pd.md) |
| Consumer-scriptable JS (not Lua/Python/Lisp) for "joe blow off the street" | pie-menu / ConnectedTV / OL scripting threads |

---

## Show-facing extracts

### Ungar @ Laszlo (load-bearing)

I just ran into Dave Ungar (of Self fame), and mentioned how ironic it was that JavaScript pointed to Self as its inspirational prototype (vis-a-vis JavaScript's prototype based object system), but JavaScript totally missed the boat on efficient compile-ability, which is the most interesting thing about Self. (I mean, anybody can make a prototype oop system that runs slow, but it takes a fucking genius to come up all the brilliant stuff in Self, like the aggressive inlining compiler (it has no byte code interpreter, just a bad-ass compiler), incremental compilation, polymorphic inline cache, coupled with dynamic de-optimization to make it debuggable). He gave a cool Self demo of writing a straightforward factorial function, then editing the source to the system's multiplication operator, so it would return a different result if you multiplied something by 1,000,000. Then he showed how it affected the factorial function, as well as the rest of the system, which incrementally recompiled itself as needed. All that and perfect debuggability, too! About JavaScript, he retorted that it was actually possible to efficiently compile JavaScript if you were really devious enough. Too bad the art of designing languages so you don't have to be devious in order to compile them, was lost of so many popular bad language designers (PHP, JavaScript, Perl, etc).

### OpenLaszlo

I've been doing lots of stuff with OpenLaszlo, which is brilliantly designed by a bunch of lisp-heads with their heads in the right place. The Flash player runs on the Pocket PC, and I can run OpenLaszlo applications in it, but that's too resource intensive for the kind of stuff I want to do with the pie menus, so I'm coding them as close to the metal as possible…

[Also earlier:] …I can use parts of the OpenLaszlo runtime, and eventually even run OpenLaszlo applications on it (without the DHTML rendering engine, but using my own simple graphics engine instead).

### Pocket PC talking pies (demo beats)

…touch-screen talking pie menus for controlling the pocket pc, integrated with Cepstral's speech synthesizer… As a demo, I made a pie menu based dog remote control that speaks commands to your dog when you stroke the screen… cat remote control (which doesn't seem to work…) … pet rock remote control (which does work pretty well, because most rocks are obedient when you tell them to sit, stay, play dead, gather moss, etc).

### TurboGears era (stack politics)

…sick of [Zope/CMF/Plone/Archetypes] pointless complexity, so I've moved on to TurboGears… SQLObject… the hot new thing now is SQLAlchemy… TurboGears community is flexible… Django… more insular… Ruby on Rails camp — they're all drinking the same kool-aid, which only tastes good if you've never tried good wine.

### Lua ↔ Guile (Tom's half)

Don floated Lua / WoW Cosmos for pie-menu spell casting. Tom: Lua lovely; Guile half-right on one-shot continuations (expensive case not default); full continuations as heap-everything nightmare. HOPL Lua paper link in thread.

---

*Typos in extracts preserved ("come up all", "lost of").*
