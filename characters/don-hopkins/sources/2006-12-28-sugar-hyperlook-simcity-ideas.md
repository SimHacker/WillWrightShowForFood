# Sugar development ideas — HyperLook, NeWS, visual programming (Dec 2006)

**From:** Don Hopkins \<dhopkins@DonHopkins.com\>  
**To:** sugar@laptop.org, Walter Bender, [email redacted]  
**Date:** 28 December 2006  
**Context:** SimCity running on OLPC beta laptop; EA open-source negotiations; Sugar/Python/GTK pivot.

Full forward re-archived in WillWrightShowForFood 2026-07-06. Also embedded in Don→Jaron mail 30 Dec 2006.

---

## Thesis

Combine **Smalltalk / EToys / HyperCard** with visual programming lineage: Robot Odyssey, KidSim, Klik-and-Play, **SimAntics**, **Body Electric/Bounce**, **Max/MSP/Jitter**, **PSIBER**.

Sugar should support **pluggable visual programming languages** on **Python** as internal machine language (SWIG for C++ SimCity core).

> Just imagine a visually scriptable version of SimCity, that lets you clone and edit the monster, and reprogram him to tend the forests instead of stomping on buildings!

---

## HyperLook + NeWS (PostScript stack)

HyperLook = PostScript UI dev environment for **NeWS** (Arthur van Hoff, Turing Institute). Don ported SimCity; commercial editable runtime + stripped shipping runtime.

**NeWS was like AJAX, but with:**

1. PostScript code instead of JavaScript  
2. PostScript graphics instead of DHTML  
3. PostScript data instead of XML  

Unified programming/graphics/data/networking — Smalltalk-like objects on PostScript dict stack, multiple inheritance, runtime class modification.

HyperLook features Don highlights for Sugar:
- User-editable structured graphics (above raw PS; PDF/SVG/PNG equivalents)
- Reusable graphics editor component in every property sheet
- HyperCard delegation over network client/server messages
- Warehouse of object templates; property sheets as stacks
- SimCity as acid test — map/graph/editor components copy-paste anywhere
- CAM-6 cellular automata lab — paste PS graphics into live CA, clock faces from SimCity maps

Catalog: http://www.donhopkins.com/home/catalog/hyperlook/  
Demo: http://www.donhopkins.com/home/movies/HyperLookDemo.mov

---

## Visual programming philosophy

> There will never be one true visual programming language… the system should accommodate different languages and skill levels.

Lisp for meta mini-languages → want same for **application-specific visual languages** (Eclipse Visual Editor idea, but Python not Java).

**PSIBER** = visual interface to PostScript; **Max/Jitter** = JS inside icons on wires.

---

## Scripting language notes (appendix in mail)

| Language | Don's 2006 take |
|----------|-----------------|
| **Python** | Primary choice; Sugar alignment; SWIG |
| **Lua** | Lightweight, game-industry, 6.6× C in shootout vs Python 7.3 |
| **JavaScript** | "Horribly designed"; SpiderMonkey 31× C; memory worse |
| **Tamarin/AVM2** | Adobe donated Flash 9 VM; OpenLaszlo Legals compiler; Mozilla acceleration path |

---

## Work references (tail of mail)

| System | Role |
|--------|------|
| NeWS / pie menus / TNT | http://www.donhopkins.com/drupal/node/92 |
| HyperTIES | Ben Shneiderman / HCIL |
| HyperLook SimCity | Multiplayer TCL/Tk later |
| **PSIBER** | Visual PostScript debugger — node/97 |
| **Bounce / Body Electric** | VPL; Chuck Blanchard; Jaron primary user |
| **SimAntics** | The Sims / Edith |
| Dumbold Voting Machine | SimAntics agit-prop |

---

## Show beats

- **Walter Bender / OLPC show** — Sugar as heir to HyperLook editable microworlds  
- **NeWS reunion** — "send a program not a data structure" in 2006 Sugar terms  
- **Rebounce** — Body Electric named explicitly as Sugar inspiration  
- **PostScript lineage** — structured graphics requirement = Distillery/PDF/SVG thread  

→ [`../../walter-bender/`](../../walter-bender/) · [`../../jaron-lanier/sources/2007-01-02-olpc-rebounce-keith-mcmillen.md`](../../jaron-lanier/sources/2007-01-02-olpc-rebounce-keith-mcmillen.md) · [`../../repo-shows/rebounce/`](../../repo-shows/rebounce/)
