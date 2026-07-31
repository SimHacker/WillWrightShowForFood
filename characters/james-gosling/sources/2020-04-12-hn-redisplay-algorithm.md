# HN — Don on Gosling's Emacs redisplay algorithm (12 Apr 2020)

Source: [HN 22849522](https://news.ycombinator.com/item?id=22849522) — Don's comment
(24 points) on "Enemy AI: chasing a player without Navigation2D", connecting game
pathfinding to Gosling's redisplay algorithm. Resurfaced 31 Jul 2026 when a commenter in
the [r/programming retirement thread](2024-07-05-reddit-retirement-thread.md) linked it as
their way into the "redisplay algorithms rabbit hole."

The paper itself is archived here: [`EmacsRedisplayAlgorithm.pdf`](EmacsRedisplayAlgorithm.pdf)
(from [donhopkins.com](https://donhopkins.com/home/documents/EmacsRedisplayAlgorithm.pdf) ·
[ACM DL](https://dl.acm.org/doi/10.1145/1159890.806463)).

## Don's comment

> James Gosling's Emacs screen redisplay algorithm also used similar "dynamic programming
> techniques" to compute the minimal cost path through a cost matrix of string edit
> operations (the costs depended i.e. on the number of characters to draw, length of the
> escape codes to insert/delete lines/characters, padding for slow terminals, etc).
> https://en.wikipedia.org/wiki/Gosling_Emacs
>
> > Gosling Emacs was especially noteworthy because of the effective redisplay code, which
> > used a dynamic programming technique to solve the classical string-to-string correction
> > problem. The algorithm was quite sophisticated; that section of the source was headed by
> > a skull-and-crossbones in ASCII art, warning any would-be improver that even if they
> > thought they understood how the display code worked, they probably did not.
>
> https://donhopkins.com/home/archive/emacs/skull-and-crossbones.txt
>
> Trivia: That "Skull and Crossbones" ASCII art is originally from **Brian Reid's Scribe**
> program, and is not copyrighted.

Follow-up (on why it was worth it): definitely worth it on a 300 baud modem with a lightly
loaded VAX; overkill at higher baud rates. Same family as diff — string-to-string
correction (Wagner & Fischer, [JACM 1974](https://dl.acm.org/doi/10.1145/321796.321811)),
Levenshtein distance, dynamic programming through a cost matrix.

## The cost matrix (from display.c)

The comment block at the heart of [`display.c`](https://donhopkins.com/home/archive/emacs/mw/display.c)
(University of Maryland copy, 1983 — "Original code copyright (c) James Gosling, January
1980 / Severe munging and destruction by Chris Torek, 1982,1983"):

```
/*  1   2   3   4   ....            Each Mij represents the minumum cost of
      +---+---+---+---+-----        rearranging the first i lines to map onto
    1 |   |   |   |   |             the first j lines (the j direction
      +---+---+---+---+-----        represents the desired contents of a line,
    2 |   |  \| ^ |   |             i the current contents).  The algorithm
      +---+---\-|-+---+-----        used is a dynamic programming one, where
    3 |   | <-+Mij|   |             M[i,j] = min( M[i-1,j],
      +---+---+---+---+-----                      M[i,j-1]+redraw cost for j,2
    4 |   |   |   |   |                           M[i-1,j-1]+the cost of
      +---+---+---+---+-----                        converting line i to line j);
    . |   |   |   |   |             Line i can be converted to line j by either
    .                               just drawing j, or if they match, by moving
    .                               line i to line j (with insert/delete line)
 */
```

From the paper's conclusion: full-screen redraw ~0.12s CPU on a VAX 11/780; ~0.004 CPU
seconds per keystroke, with one redisplay call per keystroke.

## The skull and crossbones

Headed the "Ultra-hot screen management package"
([full text](https://donhopkins.com/home/archive/emacs/skull-and-crossbones.txt)).
**Originally from Brian Reid's Scribe** — not copyrighted. Same Brian Reid as
[`../../brian-reid/`](../../brian-reid/), the fa.laser-lovers PostScript-vs-Interpress
historian in the wave-2 PostScript-lineage batch. Scribe to Gosling Emacs to this repo:
the warning label has better provenance than most software.

```
                        All ye who enter here:
                    Most of the code in this module
                       is twisted beyond belief!

                           Tread carefully.

                    If you think you understand it,
                              You Don't,
                            So Look Again.
```

## The kicker

The reply from HN user carapace:

> Cheers! I'm a big fan of yours BTW. Long ago, in a forum far away, your were the one to
> clue me in to NeWS (and pie menus too!) Blew open my concepts of what a display system
> could be. I'll always be grateful to you Don Hopkins.

Same lineage the show runs on: Gosling's cost matrix, Don's NeWS evangelism, and a
stranger still grateful decades later.
