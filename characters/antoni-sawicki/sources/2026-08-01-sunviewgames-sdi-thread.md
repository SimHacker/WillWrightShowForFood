# sunviewgames → Weiser's SDI resurrection (1 Aug 2026)

Don, "cyber snooping" around Antoni's repos, finds **sunviewgames** — and
sends him the challenge: get **Mark Weiser's SunView "SDI" game** running
again. The email encloses three receipts from 1987–88, including Mark's
own snowed-in report, and the same day Don dug the full source out of his
big-bag-of-old-code: it now lives in
[Mark's software collection](../../mark-weiser/software/README.md).

## Why this matters

- **The snowed-in receipt, firsthand.** Mark Weiser, 24 Jan 1987: "**I
  used the snow to hack pies into sunview.** It works now without walking
  menus. Will have walking over th weekend." The CHI'88 "(snowed-in)
  weekend" and every retelling since trace to this email — now paired
  with the actual `piemenu_track.c` in the recovered source.
- **The 1988 NeWS-makers post** (7 Apr 1988) documents the **1987 Usenix
  Computer Graphics workshop demo tape** — Ben Shneiderman lent Don his
  camera for a week; three implementations on a Sun 3/50 (X10 uwm,
  Weiser's SDI SunView pies, NeWS LiteMenu subclass) —
  [the video](https://www.youtube.com/watch?v=WTtEPbIE10I). It also
  contains the label-layout algorithm, the **Zork navigation** metaphor
  for nested pies ("like navigating from room to room in Zork… mouse
  ahead through familiar menus, without having to look at the screen"),
  the 8-item "Today" weekday menu in ASCII art, and the Callahan
  experiment summary — mouse-ahead on Usenet, April 1988.
- **Distribution receipt** (1 May 1988): Weiser "posted it to mod.sources
  a while ago. SDI is on the latest Sun Users Group tape, too."
- **A ttycity-shaped invitation.** Antoni already resurrects Micropolis
  onto any TTY and NT RISC; SDI is the same move for SunView — and Don's
  sign-off suggests the browser port: "Claude Code would probably have a
  field day translating it into typescript… I wouldn't ask it to
  translate it to View, that would just be mean, to Claude and to
  users. ;)"

## The email, verbatim

```
From: Don Hopkins <don@donhopkins.com>
Subject: Re: Micropolis for the terminal with Unicode emojis
Date: 1 August 2026 at 14:42:10 GMT+2
To: Antoni Sawicki <antoni@sawicki.cc>
Cc: Don Hopkins <don@donhopkins.com>

I was cyber snooping around your repos, and saw you had one called sunviewgames!!! 

Do you have a Sun to run them on, or a good emulator? 

You should see if you can get Mark Weiser's SunView "SDI" game running again, it was really great! 

And he implemented pie menus for it while he was snowed in during the Washington DC blizzard. 

He even had a self revealing pie menu that showed you its source code.

Sorry the video quality is so horrible, when I compressed it, the internet was really slow. 

https://www.youtube.com/watch?v=WTtEPbIE10I

He posted it to usenet, mod.sources I think. I'll see if I can dig up a copy. 

I found it in my big-bag-of-old-code! 



Enclosed is some email that mentions it.

It's a circa-1987 version of SunView but Claude Code would probably have a field data translating it into typescript so it runs in the browser! ;) 

I wouldn't ask it to translate it to View, that would just be mean, to Claude and to users. ;)

-Don

From: mark@markssun.cs.umd.edu (Mark Weiser)
Subject: pies in sunview
Date: 24 January 1987 at 02:12:37 GMT+1
To: don@mimsy.umd.edu

I used the snow to hack pies into sunview.  It works now without walking menus.
Will have walking over th weekend.
-mark

From: brillig.umd.edu!don@mimsy.umd.edu (Don Hopkins)
Subject: Re: pie menus
Date: 7 April 1988 at 17:53:03 GMT+2
To: NeWS-makers@brillig.umd.edu

In article <1727@homxc.UUCP> lewisd@homxc.UUCP (David Lewis) writes:
In article <5104@sigi.Colorado.EDU>, andreas@sigi.Colorado.EDU (Andreas C. Lemke) writes:
I've heard of a (new) kind of menus in which items are arranged like a
pie chart.  The menu pops up with the mouse cursor in the center so
that each item can be reached by moving the mouse in the corresponding
direction.  This supposedly improves performance for skilled users who
know which item is where.  Accessing an item in a regular vertical
list menu requires more feedback from the eye to tell whether the
correct item has been reached.
...
I've been thinking of writing one of these circular menus for X11R2 since
seeing a taped demonstration of one shown by Ben Schneiderman (of
"Designing the User Interface" fame) on some unspecified system; I think
it was an Apple II or Atari micro.

Ben Shneiderman was kind enough to trust me with his camera for a week
to make that video tape, which I showed at my talk at the 1987 Usenix
Computer Graphics workshop in Cambridge, Massachusetts. The tape
demonstrates three implementations of pie menus, running on a Sun 3/50
workstation: My first implementation, square pie menus hacked into the
X10 "uwm" window manager; Mark Weiser's SunView pie menus, used in his
wonderful game "SDI"; and finally my NeWS pie menus in round windows,
written in NeWS's object oriented extended PostScript, as a subclass
of LiteMenu.  I'll be making a more up-to-date tape for CHI'88, soon.

I was planning to have the outside circular.

You're going to have a hard time doing that with X11! Good luck!

There is a small dead spot in the center.  Note that this
arrangement allows for two-item selection; for example, which pie
slice you are in could select color, and how far out from the center
you are in could select intensity; or the wedge selects the font and the
distance selects the type size.
Andreas, they exist, but I don't know of any commercial implementation.

My implementation of pie menus for NeWS is free and in the public
domain.  I've just posted the source code for NeWS 1.1 pie menus to
the NeWS-makers mailing list (comp.windows.news). (Make sure you get
the bug fix I posted subsequently!)  Because of the nature of NeWS,
you don't have to change applications to use pie menus -- they use
whatever is the DefaultMenu at the time they are started. So after
you've loaded in piemenu.ps, you'll get pie menus everywhere!

Problems that I am running into: 1) How to fit the label into the box.

If you don't confine menu labels to their wedge shaped sectors, the
label layout problem is much simpler! You just need to ensure that
none of the labels overlap, and that it's visually obvious which
sector is associated with which label.

The NeWS implementation calculates an inner label radius, inside of
which it draws lines to delimit the sectors, and around the outside of
which it justifies the labels. The round menu window's radius is just
big enough to encompass all of the labels plus a border.

Labels are positioned so that (respectively) the labels on the
(left/right) side of the menu have their (right/left) edge vertically
centered at points on the inner radius, and the very (top/bottom)
labels are horizontally centered on their (bottom/top) edge. i.e.:

+---B---+
R label L
+---T---+

Labels on the (Right/Left/very Bottom/very Top) of the menu are
positioned so that point (R/L/B/T) is on the inner radius, in the
direction of the center of its sector.

The inner label radius is calculated by starting with a minimum
radius, and going around the menu checking to see of the bounding
boxes of any two adjacent labels overlap. If they do, the radius is
pushed out until they don't, and the loop is continued. Once you've
checked each pair of neighbors, the inner radius will be big enough so
that no labels will overlap. The outer menu window radius is then
calculated by finding the distance of the furthest label outer corner
from the menu center.

2) How to deal with a menu containing a large number of items.

With both pie menus and linear menus, the fewer the items, the easier
the menus are to use.  With linear menus of many items, the cursor
must move further on the average, but the target areas are the same
size as with smaller menus.  With pie menus of many items, the cursor
must move the same distance, but the target areas are smaller.
However, the user may trade off cursor movement for target size, by
moving the cursor further out, to where the wedge shaped target
regions are wider! The active regions can extend out beyond the edge
of the menu window, all the way to the screen edge.

It's good practice to group items into logically related submenus, to
keep the number of items in the menu low. Pie menus work very well for
nested menu selection, especially for experienced users. They have a
nice kinesthetic feel, and make good use of muscle memory. You
remember a path through a tree of nested menus as a series of
directions, sort of like navigating from room to room in Zork.  Since
menu selection is defined by direction, and delimited by mouse clicks,
you can rapidly mouse ahead through familiar menus, without having to
look at the screen.  It feels somewhat like shifting gears with a
manual transmission.

Quite coincidentally, my group today interviewed a PhD in Human Factors,
and in discussion of user interaction styles this question came up.
She said that this sort of menu is useful only for certain situations:
where the labels are VERY short; where the labels are clearly attached
to something (example: a,b,c,d,e for a multiple-choice answer); or
for graphic use in choosing color or something similar. They'd
also be useful in a menu with icons.

While a pie menu will generally take up more screen real estate than
the same linear menu, I find that with the layout scheme described
above, one or two word menu items work just fine. If you can plan your
menus so that long lines are near the top or bottom of the menu,
instead of to the left or right, their outer radius will tend to be
smaller.

Jack Callahan performed an experiment comparing the selection time and
error rates of pie menus and linear menus. The menus had 8 items, and
the subjects were novices without any mouse experience. Menu tasks
were classified in three categories, by the type of their selection,
as pie (N, NE, E...), linear (A, B, C...), and unclassified (Open,
Copy, Delete...).  Using pie menus, the subjects made selections
faster, and with fewer errors, for all three task types.

They're also  useful in situations
in which the menu is not ordered (as long as it fits the other requirements);
otherwise, the eye has trouble deciding which pie wedge to scan first.
--
David B. Lewis    {ihnp4,allegra,ulysses,rutgers!mtune}!homxc!lewisd
"New Jersey -- Landfill of Enchantment"

There are certain types of task for which a pie menu's circular layout
is especially appropriate. They're useful in situations with pairs of
complementary menu items, which can be placed in opposite directions,
and orthogonal pairs, which can be placed at right angles.

As well as the obvious compass rose and clock face, there are other
types of groupings that also work well. For example:

     Wednesday
Tuesday \ / Thursday
Monday  > O <  Friday
 Sunday / \ Saturday
       Today

(I claim that this is an easy-to-remember menu, because it has 8 items
[which is an all around symmetric, asthetically pleasing number], and
the weekdays are in a natural left to right order. Plus it's always
easy to choose today!)

	-Don

From: Don Hopkins <don@brillig.umd.edu>
Subject: Availability of Pie Menus for X11 and Suntools
Date: 1 May 1988 at 08:52:26 GMT+2
To: hplabs!qantel!avsd!headroom!wja@rutgers.edu
Cc: don@brillig.umd.edu

Thanks for your interest in pie menus!  I will try to get copies of my
papers into the mail to you as soon as possible (which may not be as
soon as I'd like, but I'll try!). I'll include some screen dumps from
NeWS, as well. If you have NeWS 1.1, I can email my latest
implementation in object oriented PostScript to you! Mark Weiser's
SunView implementation of pie menus is part of his game "SDI", which
he posted to mod.sources a while ago. SDI is on the latest Sun Users
Group tape, too.

	-Don
```

↑ [Antoni's room](../README.md) · [SDI source in Mark's room](../../mark-weiser/software/README.md) · [ttycity thread](2026-07-08-ttycity-email-thread.md) · [Pie lineage index](../../don-hopkins/sources/README.md#pie-menu-lineage-medium-canon-ingested-jul-2026)
