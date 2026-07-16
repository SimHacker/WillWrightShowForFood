# "Demo of Marking Menus" — Kurtenbach's straw-man pie menu, on video

**Video:** [youtube.com/watch?v=dtH9GdFSQaw](https://www.youtube.com/watch?v=dtH9GdFSQaw) —
"Demo of Marking Menus," GordKurtenbach channel, posted 4 Mar 2008 (research-era footage).
Description: "A demonstration of the differences between marking menus, linear menus, and pie
menus is shown. Shows the 'marking' property of marking menus and the property of scale
independence."

**Companion videos** (GordKurtenbach + Alias footage):

| Video | URL | Role |
|-------|-----|------|
| Alias / Z-Ray promo ("Marking Menus", McGuffin upload) | [dKaXJ14BkjA](https://www.youtube.com/watch?v=dKaXJ14BkjA) | Smoking-gun ad; zLab About box asserts patents |
| Alias short demo (2000 footage) | [wLNPGsKyUls](https://www.youtube.com/watch?v=wLNPGsKyUls) | Same ~2000 Alias software, shorter cut |
| Marking Menu Versus Linear Menus | [8c58bN6ajJ4](https://www.youtube.com/watch?v=8c58bN6ajJ4) | Kurtenbach comparison demo |
| Marking Menus in ConEd Example | [BOmb8-pQXwQ](https://www.youtube.com/watch?v=BOmb8-pQXwQ) | Kurtenbach product-example demo |

The straw-man demo makes the false technical distinction; the Alias ad sells the patent on
the strength of it. **About-box screenshot** (patents #5,689,667 and #5,926,178 named
in-product):
[`../media/zlab-2000-about-box-marking-menu-patents.png`](../media/zlab-2000-about-box-marking-menu-patents.png)
· [`../media/zlab-2000-about-box-marking-menu-patents.yml`](../media/zlab-2000-about-box-marking-menu-patents.yml).
See also [Buxton thread](2008-2023-pixie-buxton-patent-thread.md).

## The straw man, in his own words (transcript)

> first let's look at **a typical implementation of radial menus** in this case a pie style
> of menu display is used… **The implementation does not support scale independence.** note
> if I do the same movements but at a larger scale **I get the wrong selection or I get no
> selection**, and if I do the same movements but at a smaller scale I get a different
> selection…
>
> [marking menus:] my movements are scale independent… **in contrast with pie menus I have to
> carefully control the size of my movement to get the right selection.** also note that
> **flashing menus are much more visually taxing than the stationary ink trail** of the mark.

## Why it's a straw man

A pie menu whose selection changes with gesture *size* is not a pie menu by any published
definition — pie menus select by **direction only**, with distance explicitly independent:

| Receipt | Text |
|---------|------|
| Jun 1986 X10 code | Direction-based selection; scale-independent by construction ([timeline](pie-menu-timeline.md)) |
| Apr 1988 [UMD proposal](1988-04-10-umd-tech-writing-proposal.md) | "**The distance of movement is independent of the direction**, so it may serve to modify the choice" |
| Mar 1988 "How to Choose" | Target areas "extend out beyond the menu radius, **to the edge of the screen**" — bigger gestures give *more* precision, never wrong selection |
| Dec 1991 [DDJ](ddj-1991-design-implementation-pie-menus.md) | "the active target areas can extend out to the edges of the screen, so you can move the cursor as far as required to select precisely the intended item" |

The demo's "typical implementation" caps the target at the menu's outer radius so that a
large stroke overshoots into "no selection" — a behavior found in no Hopkins implementation
or publication. Building the defect in, labeling it "typical," and then demonstrating the
patented alternative curing it is the video's whole argument.

The "flashing menus are visually taxing" line runs the same play: pie menus with mouse-ahead
**display preemption** (X10 1986; PSIBER 1989 "mouse ahead display suppression"; DDJ 1991
"the menu should not display at all") don't flash during expert use — the comparison assumes
a pie menu that always pops up, i.e., one stripped of the feature Don had explained to
Kurtenbach in 1990.

## Already rebutted in the comments (2013)

Don's public comment on the video, standing for 13 years:

> These "typical pie menus" are not at all typical — they're just "**straw man pie menus**".
> Typical pie menus (like the pie menus in The Sims) don't behave the way this straw man
> implementation demonstrates… Typical pie menus support "mouse ahead" gestures and **scale
> independence**, and it's disappointing that the authors of this video weren't aware of
> that, and attempt to define marking menus in terms of a straw man definition of pie menus.

"Weren't aware" is the charitable reading; the 1990 correspondence forecloses it.

## Show use

Play the 1:18–2:11 segment (straw-man failure demo), then show the April 1988 proposal line
"the distance of movement is independent of the direction," then The Sims pie menus working
at any scale. The 12,000-view video that defined pie menus falsely for a generation of UI
designers, refuted by a class assignment written five years before it was staged.

→ [`pie-menu-fud-misconceptions.md`](pie-menu-fud-misconceptions.md) ·
[`kurtenbach-sellen-buxton-1993-claims-analysis.md`](kurtenbach-sellen-buxton-1993-claims-analysis.md) ·
[`2008-2023-pixie-buxton-patent-thread.md`](2008-2023-pixie-buxton-patent-thread.md) ·
[`../media/zlab-2000-about-box-marking-menu-patents.yml`](../media/zlab-2000-about-box-marking-menu-patents.yml)
