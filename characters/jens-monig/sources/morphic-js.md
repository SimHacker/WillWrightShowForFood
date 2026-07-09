# Morphic.js — Jens Mönig's live IDE substrate

**Live code:** [morphic.js in the Snap! repo](https://github.com/jmoenig/Snap/blob/master/morphic.js) ·
[Snap! source](https://github.com/jmoenig/Snap) · [snap.berkeley.edu](https://snap.berkeley.edu/)

---

## The hook

Direct-manipulation objects all the way down — in the browser, no install. Snap! isn't just blocks
on a canvas; the **IDE itself** is malleable Morphic-style, inheriting Smalltalk's live-system ethos
without requiring Squeak on every student's laptop.

## Heritage

```
Self Morphic → Squeak/Scratch morphs → Dan Ingalls Lively Kernel → Morphic.js → Snap!
```


| Step                 | Who / what                     | Note                                                            |
| -------------------- | ------------------------------ | --------------------------------------------------------------- |
| **Self**             | David Ungar & Randall Smith    | Object soup on screen — morphs you grab and reshape             |
| **Squeak / Scratch** | MIT lineage                    | Morphs in every student's hands before blocks languages split   |
| **Lively Kernel**    | Dan Ingalls                    | Morphic in the browser — live objects while the page runs       |
| **Morphic.js**       | Jens Mönig                     | Single-file framework; Snap!'s canvas, menus, halos, IDE chrome |
| **Snap!**            | Jens + Brian Harvey's pedagogy | Blocks on top; Morphic underneath                               |


Alan Kay's test: NeWS was "the right way to go — **except it missed the live system underneath**."
Snap! + Morphic.js is the browser answer — see
[Alan Kay on MVC, Morphic, and watchers](../../alan-kay/media/discussions/hn-mvc-morphic-watchers-2015.md).

## What Morphic means here (not MVC)

- **Morph** — every on-screen thing is an object you can pick up, resize, embed, script.
- **Not an application** — a soup of morphs; the environment is editable while it runs.
- **Contrast with MVC** — textbooks teach controllers; Morphic teaches **direct manipulation** and
**watchers** (Alan Kay's post-PARC stance in Don's [2011 email thread](../../alan-kay/media/discussions/hn-mvc-morphic-watchers-2015.md)).

Jens's path: MIT Scratch → **GP under Alan Kay** ([lineage digest](gp-alan-kay-lineage.yml)) →
architected Snap! on his own Morphic.js with Brian shaping "first-class everything"
([snap-first-class-everything.yml](snap-first-class-everything.yml)).

## Show hooks

- **Morphic.js demo** — edit the IDE while you're teaching in it.
- **Kay's live-system criterion** — Snap! as the browser answer.
- **Morphic vs MVC cargo-cult** — why textbooks teach controllers, not morphs.
- **Pair with Brian** — the turtle (Logo) and the morph (Smalltalk) in one classroom tool
([pair show](../../../repo-shows/snap-logo-brian-jens/README.md)).



## Deeper links


| Topic                              | Where                                                                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| GP → Snap! under Kay               | [gp-alan-kay-lineage.yml](gp-alan-kay-lineage.yml)                                                                    |
| Blocks + metaprogramming           | [Brian's macros digest](../../brian-harvey/sources/snap-macros-metaprogramming.md)                                    |
| Micropolis × Snap! (2018)          | [micropolis-snap-2018.yml](micropolis-snap-2018.yml) · [readable](../../brian-harvey/sources/micropolis-snap-2018.md) |
| Constraint bridge (runes + blocks) | [micropolis-svelte-snap-constraint-bridge.md](../../don-hopkins/sources/micropolis-svelte-snap-constraint-bridge.md)  |
| Dan Ingalls — Lively lineage       | [Dan's room](../../dan-ingalls/README.md)                                                                             |
| David Ungar — Self / Morphic birth | [David's room](../../david-ungar/README.md)                                                                           |
| Palmhoo shelf                      | [Code & Craft — Morphic.js](../../../palmhoo/code-and-craft/README.md)                                                |
| Palm's Snap! questions             | [questions.yml](../../../repo-shows/snap-logo-brian-jens/audience/palm/questions.yml)                                 |


↑ [Sources index](README.md) · [Jens's room](../README.md) · [Invitation](../invitation.md) · [Pair show](../../../repo-shows/snap-logo-brian-jens/README.md)