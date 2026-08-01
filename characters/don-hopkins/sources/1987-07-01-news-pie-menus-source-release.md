# NeWS pie menus source release — 1 July 1987 (the code receipt)

**Posted:** Don Hopkins → NeWS-makers@brillig.umd.edu, Wed 1 Jul 1987 23:04 EDT — `piemenu.ps`,
the object-oriented PostScript pie menu class for NeWS, full source, free for unrestricted use.

The earliest *published free-software* receipt in the marking-menu dispute: announcement,
license, and code comments all in one artifact, four months before Kurtenbach's first email
and six years before the 1993 paper.

## The announcement describes mouse-ahead

> Pie Menu choices may be positioned in intuitively correct directions… Pie Menus are easy to
> learn, using "muscle memory", because you remember directions, not order. **Because you
> don't need to look at the menu to choose a direction, you can mouse ahead dependably with
> menus you're familiar with.**

## The code's "Things to do" describes display suppression

From the `piemenu.ps` header comments, 1 Jul 1987:

> % Don't bother putting up a menu (or even moving the menu to be  
> %   completely on screen), **if the button event that would make  
> %   the selection is already in the input queue.**  

— i.e., mouse-ahead **display suppression**, specified in the shipped code's TODO and
implemented in subsequent versions (the X10 uwm implementation already had it in 1986; the
1989 PSIBER paper names it in print). In 2018 Don offered Kurtenbach the follow-up versions
implementing it, for the record.

## The license: unrestricted, with a poem

> % Simple Simon popped a Pie Men-  
> %    u upon the screen;  
> % With directional selection,  
> %    all is peachy keen!  
> %  
> % Pie Menus are provided for **UNRESTRICTED use** provided that this  
> % copyright message is preserved on all copies and derivative works.  

The 1987 Usenix summary closes the same way: "they are **not proprietary, patented, or
restricted in any way**, so take a look and feel free!" The free-culture position was in the
license and the abstract from the first release — eight years before the Alias patent filing.

## Why this receipt matters

The 1993 paper's defenders sometimes fall back to "there was no *publication* describing
mouse-ahead" (Catherine Plaisant recalls the marking-menu crew making exactly that argument).
This artifact answers it on its own terms: a public mailing-list post with the feature in the
announcement text and the suppression mechanism in the distributed source — heavily commented,
free to read, cited by Don to Kurtenbach directly. "My work is my code, and my code and ideas
are free" (Don → Kurtenbach, 16 May 2018).

→ [`pie-menu-timeline.md`](pie-menu-timeline.md) ·
[`kurtenbach-sellen-buxton-1993-claims-analysis.md`](kurtenbach-sellen-buxton-1993-claims-analysis.md) ·
[`pie-menu-fud-misconceptions.md`](pie-menu-fud-misconceptions.md)
