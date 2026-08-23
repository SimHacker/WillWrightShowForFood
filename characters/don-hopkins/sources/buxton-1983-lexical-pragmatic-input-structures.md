# Buxton (1983) — Lexical and Pragmatic Considerations of Input Structures

Primary source summary. Full text on Buxton's site — not mirrored here.

## Citation

**Buxton, W.** (1983). Lexical and Pragmatic Considerations of Input Structures.
*Computer Graphics*, 17 (1), 31–37.

| Field | Value |
|-------|-------|
| Author | [Bill Buxton](https://www.billbuxton.com/) — University of Toronto, CSRI |
| Venue | SIGGRAPH-era *Computer Graphics* (now *TOG* lineage) |
| Public URL | https://www.billbuxton.com/lexical.html |
| Keywords | pragmatics, input devices, taxonomy, Foley & Van Dam, Moran, chunking, device independence |

## Why it matters here

Don cited this paper on HN [49408130](https://news.ycombinator.com/item?id=49408130) (Aug 2026,
[*I Dream of Quieter Computing*](../slower-phosphor-quieter-computing-hn-2026.md)) after
[mrob](https://news.ycombinator.com/item?id=49407984) claimed graphics need a **mouse** and
[skydhash](https://news.ycombinator.com/item?id=49408091) replied that **tracing wants a pen**
and viewport manipulation wants a spacemouse — the mouse is cheap, not best.

Buxton's answer (1983): **the transducer is not interchangeable**. Spelling tokens (lexical) and
**how you gesture** (pragmatic) are different strata. Picking the wrong device class — treating
all "locators" as equal — breaks the interface.

PIXIE (1969) is the empirical predecessor: **light pen on vector CRT** for tracing and radial
control lightbuttons — not a mouse problem at all. See
[`../../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md`](../../heinz-lemke/cambridge-films-flight-of-the-bumblebee.md).

## Core ideas

### Lexical vs pragmatic

Buxton splits Foley & Van Dam's coarse **lexical** level:

| Level | Covers |
|-------|--------|
| **Lexical** | How tokens are *spelled* — words, icons, key sequences |
| **Pragmatic** | **Gesture, space, and devices** — where things sit, what transducer, what motor skill |

Keystroke models count key pushes (lexical); homing and pointing time are **pragmatic** (Card,
Moran & Newell 1980b). Pencil-and-paper language tests miss muscle memory entirely — "the medium
does affect the message" (McLuhan paraphrase in paper).

### Chunking and closure

Syntax and pragmatics interact. Example (Buxton 1982, cited here): **select-and-drag** —
button-down picks up an object, motion tracks while held, release anchors. The gesture *forces*
correct syntax; no "what do I do next?" tax. Parallel chunking: clutch + accelerator + gear-shift
as one compound act.

Directly relevant to **pie menus** and **marking menus** lineage — see
[`kurtenbach-sellen-buxton-1993-claims-analysis.md`](kurtenbach-sellen-buxton-1993-claims-analysis.md).

### Device independence is a trap

CORE/GSPC "logical devices" (locator, valuator) aid portability for programmers but **erase the
user-facing truth**: four joysticks are not four tablets. Effectiveness often *depends* on a
specific device (Fedorkow, Buxton & Smith 1978 — four-joystick electroacoustic mixer).

### Figure 1 — taxonomy of continuous hand-controlled input

Two-dimensional matrix:

- **Rows:** what is sensed — position, motion, pressure (1D / 2D / 3D)
- **Columns:** dimensionality; sub-columns group **similar motor control**
- **Sub-rows:** mechanical intermediary (**M**, e.g. stylus/light pen) vs touch (**T**)

Key groupings for the HN thread:

| Cluster | Devices | Motor character |
|---------|---------|-----------------|
| Tablet ↔ mouse | Similar planar hand motion | Different from light pen / touch screen |
| Joystick ↔ trackball | Shared isometric/ball motion | Different from tablet/mouse |
| Light pen ↔ touch screen | Same sensing class; pen has mechanical transducer | Tracing / direct pointing |

Buxton: a **tablet** can *emulate* many transducers; the tableau shows **which squares** it
covers and which it cannot. **Mice are not pens**; **isometric joysticks are not mice** (Card,
English & Burr 1978 — text selection study cited in paper).

Metaphor line in paper: *"a tablet is to a mouse what a joystick is to a trackball."*

### Horizontal vs vertical strata

Foley/Van Dam and Moran are **horizontal** (conceptual → semantic → syntactic → lexical).
Transducer choice **leaks upward** — e.g. position vs motion sensing changes whether a shared
slider has a **nulling problem** when switching parameters. Neither horizontal nor vertical view
alone is sufficient.

## Show hooks

| Beat | Prop |
|------|------|
| Read Figure 1 on air while PIXIE film runs | Light pen square vs mouse square |
| mrob/skydhash/Don triangle → Buxton 1983 | [`../slower-phosphor-quieter-computing-hn-2026.md`](../slower-phosphor-quieter-computing-hn-2026.md) |
| Chunking → pie menu press-drag-release | [`../pie-menus-chi-88-and-beyond.md`](../pie-menus-chi-88-and-beyond.md) |
| Buxton ↔ Heinz 2008 PIXIE memory lane | [`../../heinz-lemke/sources/2008-bill-buxton-pixie-memory-lane.md`](../../heinz-lemke/sources/2008-bill-buxton-pixie-memory-lane.md) |

## See also

| File | Why |
|------|-----|
| [`../slower-phosphor-quieter-computing-hn-2026.md`](../slower-phosphor-quieter-computing-hn-2026.md) | Don's HN cite |
| [`../pie-menus-chi-88-and-beyond.md`](../pie-menus-chi-88-and-beyond.md) | Gestural UI lineage |
| [`kurtenbach-sellen-buxton-1993-claims-analysis.md`](kurtenbach-sellen-buxton-1993-claims-analysis.md) | Later Buxton marking-menu paper |
| [`../../heinz-lemke/sources/buxton-2008-wiseman-notes/wiseman-notes-on-radial-menus-in-pixie.md`](../../heinz-lemke/sources/buxton-2008-wiseman-notes/wiseman-notes-on-radial-menus-in-pixie.md) | Buxton on Wiseman radial menus |

## External

| What | URL |
|------|-----|
| Full paper (HTML) | https://www.billbuxton.com/lexical.html |
| Buxton pie menus page | https://www.billbuxton.com/PieMenus.html |
| Foley & Van Dam (1982) | *Fundamentals of Interactive Computer Graphics* |
| Moran (1981) | Command Language Grammar — *IJMMS* 15 |
