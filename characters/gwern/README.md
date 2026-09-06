# 🧊 Gwern Branwen

*Public portrayal about a real person — not the person. [Portrayal standards](../../schemas/portrayal-standards.md).
Written under the published pen name; we do not research or discuss identity.*

**[gwern.net](https://gwern.net/)** is a single-author site of long-form, endlessly revised essays —
machine learning, statistics, psychology, genetics, self-experiment — and it is also one of the best
working arguments that a static site can behave like a **research environment** instead of a pile of
documents.

Hover a link and you get a real preview, not a tooltip. The preview drags, resizes, pins, tiles to
half the screen, and cycles focus from the keyboard. Pages are icebergs: a calm surface with most of
the depth collapsed underneath, one click down. Citations carry annotations and local archive
mirrors, so the corpus survives the web rotting around it. And the whole apparatus is documented in
public — including a companion essay listing the features that were **tried and rejected**, which is
rarer and more useful than any changelog.

**It is not a solo work, and "frontend by" undersells it.** The site's design page credits *"much of
Gwern.net design and JavaScript/CSS"* to **[Said Achmiz](../said-achmiz/README.md)** from 2017 onward,
and gwern's own word for the relationship is **"tech co-creator."** So everything here says: *inspired
by the publishing and hypertext system developed by Gwern Branwen and Said Achmiz at gwern.net* — and
declines to guess which of them thought of what, because the public record does not support that
division. Said has [a directory and an invitation of his own](../said-achmiz/README.md), addressed to
the interface work. Receipts:
[`said-achmiz/sources/gwern-net-credits.md`](../said-achmiz/sources/gwern-net-credits.md).

## Why this room exists

Don's MOOLLM webtop — tabs, windows, pie menus, rooms, semantic zoom — inherits from gwern.net **by
name**, in a design pack written before this invitation:
[`designs/webtop-gwern-inheritance/`](https://github.com/SimHacker/moollm/tree/main/designs/webtop-gwern-inheritance).
The central document is
[**GWERN-WHAT-TO-INHERIT.md**](https://github.com/SimHacker/moollm/blob/main/designs/webtop-gwern-inheritance/GWERN-WHAT-TO-INHERIT.md):
what to take, what to reinterpret, and a credit line to carry everywhere.

The thesis in one line: **a popup is not a tooltip, it is a window in a desktop** — and gwern.net's
popup chrome is the seed of a window manager that nobody quite finished building.

## Deep dive

### The pin test

While writing the pack, Don read the popup source. Pinning a popup sets a **flag on the same window
object** — no rewrap, no reparent, no second class of thing.

That is exactly the architecture of Don's **TNT OPEN LOOK** pin-up menus, where menu frames subclass
window frames and promotion is a flag; and it is the opposite of the olwm/ICCCM rewrap dance forced
on X11 by a separate-process window manager with no shared class hierarchy. Two lineages, decades
apart, converging on the same answer because the same constraint bit both of them.

Two splits in the current design that the webtop deliberately does not inherit: pinned popups die on
page navigation (pinning should promote a window onto a persistent, serialized desk), and desktop
popups versus mobile popovers are two windowing engines (one window class with adaptive chrome).
And one piece of stagecraft to restore: the OPEN LOOK push-in / pull-out pin **rotation**, because
the animation is the affordance that teaches what promotion means.

### The inheritance list

Iceberg pages and semantic zoom · progressive enhancement with popups as acceleration · reader mode ·
typography as infrastructure · recursive transclusion with stable back navigation · link metadata
with local archive fallback · backlinks generated from the repo graph · a published keyboard chord
table · a "design of this site" page that is always current.

### The reinterpretations

Where gwern.net stops at popup frames, the webtop goes to a full WIMP shell — tabs, stacks, z-order,
**pie menus** instead of a gear menu, semantic zoom **across repos** rather than within a page, a
git-native build instead of Hakyll, and optional Mac/NeWS/SunView nostalgia over monochrome
minimalism. None of that is a critique. It is a different shell around problems already solved well.

### Neighbors in the building

[**David Temkin**](../david-temkin/README.md) — Declare, with a calendar and a **desktop**, as a
candidate shell language. [**Ted Nelson**](../ted-nelson/README.md) — transclusion, which gwern.net
partially shipped while Xanadu was still arguing about it.
[**Ben Shneiderman**](../ben-shneiderman/README.md) — HyperTIES embedded menus and link previews,
the 1980s ancestor of the popup, with Don on the CHI '88 pie menu paper.

## Room

[`invitation.md`](invitation.md) · [`ideas.md`](ideas.md) · [`CARD.yml`](CARD.yml) ·
[`CHARACTER.yml`](CHARACTER.yml) · [`GLANCE.md`](GLANCE.md)

↑ [characters/](../README.md)
