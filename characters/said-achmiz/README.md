# 📐 Said Achmiz

*Public portrayal about a real person — not the person. [Portrayal standards](../../schemas/portrayal-standards.md).*

The interface half of [gwern.net](https://gwern.net/) — and the site says so itself. From its design
page: *"Much of Gwern.net design and JavaScript/CSS was developed by [Said
Achmiz](https://wiki.obormot.net/), 2017–202?."* Gwern's own word for the relationship, written on
Hacker News, is **"tech co-creator."** Not "frontend by."

The named pieces on that page include `sidenotes.js`, `image-focus.js`, and — with **Shawn Presser**
— the generalized popup system that turns every link on the site into a previewable, draggable,
pinnable, tileable window. He also designed the themes and wrote much of the frontend JavaScript for
**[GreaterWrong](https://www.greaterwrong.com/)**, the alternate reader built by `clone of saturn`,
and shipped its 2018 run of releases: appearance customization, the theme tweaker, accesskeys
throughout, adjustable text size, a better mobile layout. He publishes at
[wiki.obormot.net](https://wiki.obormot.net/) and mirrors gwern.net at
[gwern.obormot.net](https://gwern.obormot.net/).

Receipts for all of it, checked by hand rather than assumed:
[`sources/gwern-net-credits.md`](sources/gwern-net-credits.md).

**One thing this directory will not do:** guess which of the two of them thought of what. The public
record does not support that division, and pretending otherwise is the specific rudeness worth
avoiding when you are about to write to both.

## Why this room exists

Don read the popup source while writing a design pack that inherits from gwern.net, and found his own
architecture in it.

Pinning a popup **sets a flag on the same window object.** No rewrap. No reparent. No second class of
thing.

That is exactly how Don's **TNT OPEN LOOK** pin-up menus worked — menu frames subclass window frames,
promotion is a flag — and it is the opposite of the olwm/ICCCM rewrap dance that X11 forced on anyone
building a separate-process window manager with no shared class hierarchy. Two lineages, decades
apart, no contact, same answer, because the same constraint bit both of them.

The thesis of the whole pack follows from it: **a popup is not a tooltip, it is a window in a
desktop** — and gwern.net's popup chrome is the seed of a window manager nobody quite finished
building.

The pack: [`designs/webtop/`](https://github.com/SimHacker/moollm/tree/main/designs/webtop), which
has a route written specifically for this reader, and the earlier source-level study at
[`designs/webtop-gwern-inheritance/`](https://github.com/SimHacker/moollm/tree/main/designs/webtop-gwern-inheritance).

## Deep dive

### Two disagreements, offered as disagreements

The point of the invitation is not applause. Both of these are about the current design, and both
could be wrong for reasons only an implementor would know:

**Pinned popups die on page navigation.** If pinning is promotion, promotion should survive the
document — a pinned window belongs on a persistent, serialized desk, not to the page that spawned it.
This is the single change with the largest consequence and the largest cost.

**Desktop popups and mobile popovers are two engines.** One adaptive window class with different
chrome per viewport, rather than two implementations that must be kept in agreement forever. Said may
have already tried this and rejected it, in which case the interesting artifact is *why*.

And one piece of stagecraft to restore rather than change: the OPEN LOOK push-in / pull-out pin
**rotation**. The animation is the affordance — it is what teaches a first-time user what promotion
means, without a word of documentation.

### Reader control over presentation, already shipped

GreaterWrong's **theme tweaker** lets a reader invert colors and adjust brightness, contrast,
saturation and hue over any of nine themes, on mobile as well as desktop. That is not a preference
pane; it is the reader taking authority over presentation the author chose.

Which is the same move the webtop's **Know Knob** applies one layer up — reader-adjustable rendering
of *epistemic* state rather than color, so a corpus can be read as clean narrative, or with certainty
markers and attribution, or with assumptions and provenance exposed, or with counterevidence expanded.
Gwern.net tags a page with an author's confidence. The knob asks whose confidence, in which claim, on
what evidence, and lets the reader turn it.

The prior art is his, on the presentation layer, years earlier.

### Keyboard navigation as an invariant, not a feature

Accesskeys across GreaterWrong with the full list published on its About page; a published keyboard
chord table for gwern.net's popup windows. Two systems where the keyboard is documented rather than
vestigial.

The webtop states it as a lint: **every structural operation must be reachable by keyboard, by pie
menu, and by drag — all three dispatching the same named command.** Not three code paths that
happen to agree, one command with three gestures bound to it. That is
[`TREE-NAVIGATION.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/TREE-NAVIGATION.md),
and it is the document most likely to contain an error he can find on sight.

### He argues back, publicly, with numbers

Documented in gwern's own words: the font cannot go a touch bigger because of fractional sizes and
rounding; there are not enough pixels left to lower the sidenote breakpoint, *"when all is said & done"*
— an argument gwern says he has had several times and lost. And in the other direction, from the design
page: *"Said Achmiz convinced me to just switch to self-hosting the 'screen serif' Source family."*

This is the most useful thing to know before handing him a design to review, and the reason the
invitation asks for objections rather than blessing.

### Neighbors in the building

[**Gwern**](../gwern/README.md) — invited in parallel, same credit line, different conversation.
[**Ben Shneiderman**](../ben-shneiderman/README.md) — HyperTIES embedded menus and link previews, the
1980s ancestor of the popup, with Don on the CHI '88 pie menu paper and unpublished primary sources
from the team. [**Ted Nelson**](../ted-nelson/README.md) — transclusion, partially shipped on
gwern.net while Xanadu was still arguing about it. [**David Temkin**](../david-temkin/README.md) —
Declare and Mesa: in-browser window management approached as a language problem.

## Room

[`invitation.md`](invitation.md) · [`ideas.md`](ideas.md) · [`CARD.yml`](CARD.yml) ·
[`CHARACTER.yml`](CHARACTER.yml) · [`GLANCE.md`](GLANCE.md) ·
[`sources/`](sources/gwern-net-credits.md)

↑ [characters/](../README.md)
