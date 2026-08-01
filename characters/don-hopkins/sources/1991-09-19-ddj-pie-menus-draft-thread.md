# The DDJ pie menus article in the making — Don ↔ Ramiro Valdes (Sep–Oct 1991)

Two emails from the editorial thread that produced **"The Design and
Implementation of Pie Menus," Dr. Dobb's Journal, December 1991** (the
published receipt: [ddj-1991-design-implementation-pie-menus.md](ddj-1991-design-implementation-pie-menus.md)).
Don's fresh-typed draft/outline (19 Sep), then editor Ramiro Valdes's
full edit with the DDJ masthead (14 Oct: "Everything is fully
reversible").

## Why this matters

- **"Mark ahead" in manuscript, October 1991.** The edited draft already
  uses the full vocabulary the marking-menu priority fight would later be
  about: "**mark ahead** ('mouse ahead' in the case of a mouse, 'wave
  ahead' in the case of a dataglove)," display preemption/suppression,
  rehearsal ("every time you select from a pie menu, you practice the
  motion to mark ahead"), and muscle memory with the **Jaron Lanier**
  quote: "the mind may forget, but the body remembers." In print two
  months later — all pre-1993.
- **The anti-patent bullet, September 1991.** Don's outline closes:
  "*safer than linear menus, probably not patented* / **league for
  programming freedom**." The patent-freedom stance was in the article
  plan from the first draft — years before the Alias/Buxton patent fight
  (see [pie-menu-fud-misconceptions.md](pie-menu-fud-misconceptions.md)).
- **Design canon in first-draft prose**: the two-point directional
  definition ("clicking the mouse, stroking the pen, touching the screen,
  or waving the hand"); distance as second dimension; leverage increasing
  with radius; nested pies as rooms/streets navigation ("chunk out the
  selection gestures"); the scrolling **spiral** pie ("like walking up or
  down a spiral staircase or parking garage") and the "**Lotto wheel**"
  variant (time substituting for angle); cursor warping rules that
  preserve mark-ahead; the label layout policy (edge-justified at
  non-overlapping radius, "cuts in a pie crust"); the metaphor table
  (2 switch, 4 box, 8 compass, 12 clock).
- **History paragraphs**: X10 uwm (June 1986), the Forth-extensible window
  manager used to run Callahan's experiment, **Mark Weiser's snowed-in
  January 1987 SunView implementation featured in his "SDI" game** (the
  other SDI in the pie menu story), Lite Toolkit NeWS 1.0 (May 1987), and
  TNT/OpenWindows V3 — with source "available for free."
- **Callahan + Fitts + Kurtenbach**: the experiment summary (15% faster,
  fewer errors, all three task groupings) and the even-count/8-item
  results, in the popular-press framing that reached developers instead of
  academics.
- **Listings**: the "8 Days a Week" menu (Today at the top) and the
  object-oriented PostScript layout engine (`/Layout`, `/LayoutItemRadius`
  pushing the radius out until no labels overlap — "Whew, we're done!
  Time to party!").

## Email 1 — Don's draft/outline (19 Sep 1991), verbatim

```
From: hopkins@cirrus (Don Hopkins)
Subject: draft / outline
Date: 19 September 1991 at 22:33:53 GMT+2
To: rayval@well.sf.ca.us
Cc: hopkins@cirrus

This is part way between a draft and an outline. 
I am typing in all new stuff instead of cutting and pasting,         
it seems to make more sense that way. 
There's still more stuff I have to put in of course, as you can see in    
the unexpanded outline parts, which are only a rough reminder to me of
what to talk about, not an enumeration of the points I will cover. 

More soon!

	-Don


* introduction

** definition

Pies are circular menus, 
the selection from which is based on the direction between two points,
specified by clicking the mouse, 
stroking the pen, 
touching the screen, 
or waving the hand. 

A pie menu is centered on the first point, 
which could be the location of the cursor when the mouse button went down, 
the beginning of the pen stroke, 
or whatever location is appropriate for the input device. 
In the center of the pie, where the cursor starts out, 
is an inactive region that selects nothing. 
The wedge shaped slices of the pie, 
adjacent to the cursor but in different directions,
correspond to the menu selections.

** fast and easy

Pies are fast to use, 
because it takes very little cursor motion to choose a slice, 
and selecting a direction does not require visual feedback. 

Pies are easy to use,
because of the wedge shape and large area of the selection regions,
which extend out to the screen edges.
As the cursor moves out from the center of the pie, 
the control over the direction becomes more precise,
giving you more leverage to make the desired selection.

** two dimensional

Pies offer two dimensions of input, 
the direction and the distance between the two points, 
which may be used as parameters to the selection.
The path traveled between the points does not matter, 
just the direction and distance between the endpoints of the path.

** self revealing gestural user interface

Pies are a self revealing gestural user interface, 
because without even looking, you can move in any direction, 
and "click ahead" so fast that the menu doesn't even pop up.  
Only when used more slowly like a traditional menu, 
does a pie menu pop up on the screen, 
to reveal the available selections, 
and teach you to click ahead. 

By clicking and popping up a pie menu, 
looking at the labels, 
moving the cursor in the desired direction, 
then clicking to make a selection, 
you learn the menu and practice the gesture to click ahead.

With a little practice, 
it becomes quite easy to click ahead 
even through nested pie menus.

* explain why they are so defined

Pie menus may be implemented in many ways, but the essential design goal
should be to make gestural selection as smooth and reliable as possible,
given the particular input device.  In particular, this describes how
pie menus can be made to work well with the mouse; in abstract, pie
menus can be made to work with many types of input devices such as the
stylus or touch pad, by adapting the tracking behavior to the
constraints and features of the particular hardware.

When a pie menu pops up, it is ideally centered at the location of the
click that invoked it: where the mouse button was pressed, the screen
was touched, or whatever. The cursor might have moved 
in the time it took to respond to the click, so simply centering the
menu on the current cursor position would interfere with click ahead. 
The center of the pie is inactive, and clicking again in the center
dismisses the menu without making a selection. 

The slices of the pie are all adjacent to the cursor, each in a
different direction. This arrangement minimizes the motion required to
make a selection. As you move the cursor further into the wider area of
a slice, your directional control becomes more precise.  So the active
areas of the slices extend out to the edges of the screen, and you can
move the cursor as far as you want in any direction to select a slice.
The ability to increase the angular accuracy by moving the cursor as far
as you need is another property of pie menus that makes reliable click
ahead possible.

When you pop up a pie menu near the edge of the screen, the menu
window may have to be moved by a certain offset in order to fit
completely on the screen, otherwise you couldn't read the menu. But it
would be quite unexpected were the menu to slip out from under the
click, leaving the cursor pointing at the wrong slice. So whenever the
menu is displayed on the screen, and it must be moved in order to fit,
it is important to "warp" the cursor by the same offset, relative to
its position at the time the menu is displayed. If a selection is
made, but the menu is not popped up on the screen due to click ahead
display premption, the cursor should not be warped. 

* disadvantages and solutions

One disadvantage of pie menus is that the popup window has a large
area because of the circular layout.  Pie menus with long labels or
many items can be very large.  Pie menus with an odd number of items
are less symetric and harder to use. Dynamically changing pie menus
do not work well with click ahead. 

The layout algorithm should minimize the menu size, prevent the labels
from overlapping, and clearly associate each label with its respective
slice. It is not necessary to confine each label to the interior of
its slice -- that could result in enormous menus. Rotated text is also
undesirable, since it's jagged, hard to read, and still results in
large menus. I have implemented a successful layout policy that
justifies the label edges against the center of the slice, at an inner
radius big enough that no two adjacent labels overlap. To delimit the
active areas of the menu, short lines are drawn, like cuts in a pie
crust, between the slices, from the inactive radius to the label
radius.

Pie menus with short labels or square icons tend to be smaller and have
less wasted space, and wider labels can be placed in the top and bottom
positions.  The fewer and evener the number of items in a pie menu, the
easier it is to use.  Certain numbers of items are well suited to
various metaphors.  Dynamically changing pie menus should at least
always have their first (or default) item in the same direction.  Pie
menus that do not change, and are thoughtfully designed, can be
extremely efficient.

One solution to the problem of pie menus with too many items is to
dissolve large menus into smaller logically related submenus. Nested
pies work quite well as a gestural interface, because it's possible to
click ahead through them without visual feedback. If you think of it as
navagating through rooms in a building or city streets, you just
remember the directions, and chunk out the selection gestures one after
the other.

Another way around the problem is the scrolling spiral pie menu, that
encompasses many items, but only displays a fixed number of them at
once. By winding the cursor around the menu center, you can scroll
through all the items, like walking up or down a spiral staircase or
parking garage. 

* explain their speed and accuracy

Pie menus are faster and have a lower error rate than linear "pull down"
menu.  According to Fitt's law, the "seek time" required to point the
cursor at a target depends on the distance to the target and the target
area.  Since the wedge shaped slices of a pie menu are all quite large
and very close to the cursor (their active area extends to the edge of
the screen), Fitt's law predicts good times for pie menus.  But the
rectangular target areas of a linear menu are very small in comparison,
and they're each a different distance (but the same direction) from the
cursor.


Callahan's experiment comparing 8 item pies and linear menus
 Callahan's experiment confirms Fitt's law, by showing ...

Buxton's experiment comparing different sized pie menus and input devices
 8 and 12 very good. rehersal. trackball bad. mouse good. pen great.

* two dimensions: direction and distance
 continuous or discrete
 two dimensional examples: font style/size, color hue/saturation

* metaphor, kinesthetics, and gesture

Idealy, the application designer should arrange the labels and submenus
in directions that reflect their spatial associations and relationships
between them, making it easy to remember which direction does what.
Opposite or complementary items can be places 180 degrees apart, and
orthogonal pairs 90 degrees apart.

A natural pie menu metaphor is geographical navagation:
driving around the intersections and streets of a city,
walking around the halls and rooms of a building, 
or climbing around the branches and leaves of a tree. 

       items		metaphores
	-----		----------
       2		switch confirmation boolean
       4		box room arrows edges corners
	6		hex
	8		compass arrows edges+corners
	10		decimal
	12		clock months

 designing kinesthetically pleasing pie menus
 example: window manager

* implementations and availability
 take a look and feel free
 in X10 for the uwm window manager
 in SunView for the SDI game
 in NeWS for the Lite Toolkit
 in OpenWindows for The NeWS Toolkit
 safer than linear menus, probably not patented
 league for programming freedom
```

## Email 2 — Ray's edit with DDJ masthead (14 Oct 1991), verbatim

```
From: well!rayval@apple.com (Ramiro Valdes)
Subject: Re: the draft
Date: 14 October 1991 at 10:15:48 GMT+1
To: Don.Hopkins@Eng

Don,

Here is the article so far.  I've edited it a bunch.
I hope you won't find the changes too drastic!
Everything is fully reversible.

We still need to fill in some sections and also
a conclusion.  Perhaps we could schedule some
time today or tomorrow to work on it (afternoon
or early evening).

Let me know.  Thanks!

--Ray


=========================DR. DOBB'S JOURNAL======================
ARTICLE:       The Design and Implementation of Pie Menus
ISSUE:         December 1991
SECTION:       Feature
AUTHOR:        Don Hopkins
EDITOR:        RV
FILENAME:      article.txt
LENGTH:        3160 words
DATE SUBMTD:   
HED:           The Design and Implementation of Pie Menus
DEK:           They're fast, easy, self-revealing -- and no calories.
BYLINE:         Don Hopkins
BIO:
    < NEED BIO >

PULLQUOTES:

FIGURE CAPTIONS:

Figure 1: 8 Days a Week
Figure 2: Window Manager Menu
Figure 3: A Color Pie Wheel



================================================================

TEXT:

Although the computer screen is two-dimensional, today most users of
windowing environments control their systems with a one-dimensional
list of choices -- the standard pulldown or dropdown menus such as
found on Microsoft Windows, Presentation Manager or on the Macintosh.

This article describes an alternative user interface technique I call
"pie" menus, which are 2-dimensional and circular, and are in many
ways easier to use and faster than conventional linear menus.  They
also work well with alternative pointing devices such as those found
in stylus or pen-based systems. I developed pie menus at the
University of Maryland in 1986 and have been intermittently studying
and improving them over the last five years.

Over the years, pie menus have implemented by myself and my colleagues
on four different platforms: X10 for the uwm window manager, SunView,
NeWS for the Lite Toolkit, and OpenWindows for The NeWS Toolkit.
Fellow researchers have conducted comparison tests between pie menus
and linear menus, and also with different kinds of pointing devices.

Included with this article are relevant code excerpts from the most
recent NeWS implementation, which is written in Sun's object-oriented
PostScript dialect.


PROPERTIES OF PIE MENUS

In their 2-dimensional form, pie menus are round menus containing
menu items positioned around the cursor -- as opposed to the rows or
columns of traditional linear menus.  The menu item target regions
are shaped like the slices of a pie, and the cursor starts out in the
center, in a small inactive region. The active regions are all
adjacent to the cursor, but each in a different direction. You make a
selection from a pie menu by clicking on the mouse or stylus, and
then moving the pointing device in a particular direction.  

Although there are multiple kinds of pie menus, the most common
implementation uses the relative direction of the pointing device to
determine the selection -- as compared with the absolute positioning
required by linear menus.  The wedge shaped slices of the pie,
adjacent to the cursor but in different directions, correspond to the
menu selections.  Visually, feedback is provided to the user in the
form highlighting the wedge-shaped slices of the pie. In the center
of the pie, where the cursor starts out, is an inactive region that
selects nothing.

When a pie menu pops up, it is centered at the location of the click
that invoked it: where the mouse button was pressed (or the screen was
touched, or the pen was tapped). The center of the pie is inactive, so
clicking again without moving dismisses the menu, making no
selection.  The circular layout minimizes the motion required to make
a selection.  As the cursor moves into the wider area of a slice, you
gain leverage, and your control of direction improves. To exploit
this property, the active target areas can extend out to the edges of
the screen, so you can move the cursor as far as required to select
precisely the intended item.  

You can move into a slice to select it, or move around the menu,
reselecting another slice. As you browse around before choosing, the
slice in the direction of the cursor is highlighted, to show what
will happen if you click (or, if you have the button down, what would
happen if you released the button). When the cursor is in the center,
none of the items are highlighted, because clicking would then select
nothing. 

Pie menus can work with a variety of pointing devices: not just mice,
but also pens, track balls, touch screens, and (if you'll pardon the
hand waving) data gloves.  The look and feel can of course be adapted
to fit the qualities and constraints of the particular device.  For
example, in the case of the data glove, the 2-dimensional circle of a
pie would become a 3-dimensional sphere, and the wedges would become
cones in space.

In all cases, a goal of pie menus is to provide a smooth reliable
gestural style of interaction for both novices and experts.  


ADVANTAGES

Pie menus are faster and more reliable than linear menus, because
pointing at a slice requires very little cursor motion, and the large
area and wedge shape makes them easy targets.

For the novice, pie menus are very easy, because they are a self-
revealing gestural interface: they show what you can do, and direct
you how to do it.  By clicking and popping up a Pie menu, looking at
the labels, moving the cursor in the desired direction, then clicking
to make a selection, you learn the menu and practice the gesture to
"mark ahead" ("mouse ahead" in the case of a mouse, "wave ahead"
in the case of a dataglove) With a little practice, it becomes quite
easy to mark ahead even through nested Pie menus.

For the expert, they're very efficient, because -- without even
looking -- you can move in any direction, and mark ahead so fast
that the menu doesn't even pop up.  Only when used more slowly like a
traditional menu, does a pie menu pop up on the screen, to reveal the
available selections.

Most importantly, novices soon become experts, because every time you
select from a pie menu, you practice the motion to mark ahead, so you
naturally learn to do it by feel!  As Jaron Lanier of VPL has
remarked, "the mind may forget, but the body remembers".  Pie menus
take advantage of the body's ability to remember muscle motion and
direction, even when the mind has forgotten the corresponding
symbolic labels.

By moving the mouse or stylus a larger distance from the pie menu
center, a more accurate selection is assured. This feature
facilitates mark ahead.  Our experience has been that even an
experienced and confident menu user will not mark ahead to a linear
menu item more than two or three from the top, while an experienced
pie menu user can mark ahead to any item on an eight-item Pie menu. 

The ability to increase the angular accuracy by moving the cursor as
far as you need is another property of pie menus that makes reliable
mark ahead possible.  This is especially important in mobile
computing applications, in those situations where the input data
stream is made noisy by any of the following factors: human (hand
jitter), electro-mechanical (mouse jitter or pen skip), environmental
(room or car jitter). 

There are particular applications, such as entering compass
directions, time, angular degrees, and spatially related names, which
work particularly well with pie menus. However, as a later section
shows, pies win over linear menus even for ordinary tasks.


FLAVORS OF PIES

There are many flavors or variants possible.  Pies can easily be used
as pulldown as well as popup menus. In the case of a pulldown menu,
selection only a portion of a Pie can be used, resulting in a
fan-like menu display. 

Although the usual form of pie menus is to use only the directional
angle in determining a selection, there is a variant of pie menus
which offers two parameters of choice with a single user action.  In
this case, both the direction and the distance between the two points
are used as parameters to the selection. The ability to specify two
input parameters at once can be used in situations where the input
space has two ranges of choice.

For example, in a graphics or word processing application, a dual
parameter pie menu will allow you to specify both the size and style
of a typographic font in one gesture.  The direction selects the font
style from a range of styles, and the distance selects the font size
from the range of sizes.  An increased distance from the center
corresponds to an increase in the size of the font.  If used with a
fast outline font renderer, visual feedback can be provided to the
user by making a text sample swell or shrink dynamically as the
pointer is moved to and fro.

A minor variation in the use of pie menus is whether you click-
and-drag as the menu pops up, or whether two clicks are required:
one to make the menu appear, another to make the selection.

Other variants include scrolling pies, spirals, and "Lotto wheel"
style menus which are analogous to scrolling lists in linear
menus.  These variants are discussed in a section further below.


IMPLEMENTATIONS

As mentioned earlier, four implementations exist: X Windows, SunView,
and two NeWs implementations (using two different NeWS toolkits).  

My first attempt at implementing pie menus was on a Sun 3/160 running
the X10 window system, adding them to the "uwm" window manager, in
June 1986.  The user could define nested menus in a ".uwmrc" file,
and bind them to mouse buttons.  The default menu layout was
specified by an initial angle and a radius, which you could override
in any menu whose labels overlapped.  The popup menu was rectanglar,
large enough to hold the labels, with a title at the top.

Then I linked the window manager into Mitch Bradley's Sun Forth, to
make a Forth extensible window manager with pie menus.  I used this
interactivly programmable system to experiment with pie menu tracking
and window management techniques, and to administer and collect data
for Jack Callahan's experiment comparing pie menus with linear menus.

In January 1987, while snowed in at home, Mark Weiser implemented pie
menus for the SunView window system. They are featured in his "SDI"
game, the source code to which is available for free.

I implemented pie menus in round windows, for the Lite Toolkit in
NeWS 1.0, in May 1987. The Lite Toolkit is implemented in object-
oriented PostScript, and pie menus are built on top of the abstract
menu class, so they have the same application interface as linear
menus. Therefore, pie menus can transparently replace the default
menu class, turning every menu in the system into a pie, without
having to modify other parts of the system or applications.  

Because of the equivalence in semantics between pie menus
and linear menus, pies can replace linear menus in any environment
whose architecture is open enough to allow for a user-defined
selection mechanism to preempt the one built into the system
(both Macintosh and Microsoft Windows come to mind as possible
candidates for pie menu implementations).

My most recent implementation of pie menus runs under The NeWS
Toolkit, the most modern object-oriented toolkit for NeWS, shipped
with Open Windows V3.  The source code for my pie menu
implementations, several special purpose subclasses, and application
using pie menus, is available for free.


USABILITY TESTING

Over the years, there have been a number of research projects
studying the human factors aspects of pie menus.

Jack Callahan's study compares the seek time and error rates in
pies versus linear menus. There is a hypothesis known as
Fitts' law [[REFERENCE?]], which states that the "seek time" required to
point the cursor at a target depends on the target's area and
distance.  Since the wedge-shaped slices of a pie menu are all quite
large and very close to the cursor, Fitt's law predicts good times
for pie menus.  In comparison, the rectangular target areas of a
traditional linear menu are very small, and they're each placed
at different distance from the starting location.

Callahan's controlled experiment supports the result predicted by Fitts'
law.  Three types of eight-item menu task groupings were used: Pie tasks
(North, NE, East, etc...), linear tasks (First, Second, Third, etc...),
and unclassified tasks (Center, Bold, Italic, etc...).  Subjects with
little or no mouse experience were presented menus in both linear and
pie formats, and told to make a certain selection from each.  Those
subjects using pie menus were able to make selections significantly
faster, and with fewer errors, for all three task groupings. 

The fewer the items, the faster and more reliable pie menus are,
because of their bigger slices.  But other factors contribute to
their efficiency.  Pies with an even number of items are symmetric,
so the directional angles are convenient to remember and articulate.
Certain numbers of items work well with various metaphors, like a
clock, an on/off switch, or a compass.  Eight-item pies are optimal
for many tasks: They're symmetric, evenly divisibile along vertical,
horizontal, and diagonal axis, with distinct well-known directions.

Gordon Kurtenbach carried out an experiment comparing pie menus with
different feedback styles, numbers of slices, and input devices
[[WHAT KIND OF INPUT DEVICES DID HE USE?]].  One interesting result
was that menus with an even number of items were generally better
than those with odd numbers.  Also, menus with 8 items were
especially fast and easy to learn, because of their primary and
secondary compass directions.

The "8 Days a Week" menu shown in Figure 1 is a contrived example of
eight item symmetry: It has seven items for the days of the week, plus
one for today.  Monday is on the left, going around clockwise to Friday
on the right.  Wednesday is at the bottom, in the middle of the week,
and the weekend floats above on the diagonals.  Today is at the top, so
it's always an easy choice. 


DISADVANTAGES

The main disadvantage of pie menus is that when they pop up, they can
take lots of screen space due to their circular layout.  Long item
labels can make them very large, while short labels or small icons
make them more compact and take up less screen space.

The layout algorithm should have three goals: to minimize the menu size,
to prevent menu labels from overlapping, and to clearly associate labels
with their directions.  It's not necessary to confine each label to the
interior of its slice -- that could result in enormous menus.  In a
naive implementation, you might use text labels rotated around the
center of the pie.  But rotated text turns out not to work well, since
it exaggerates "jaggies" (pixelwise stairstepping of slanted lines). 
This is hard to read without rotating your head, and does not have the
benefit of reducing menu size. 

One successful layout policy that I've implemented centers each label
edge within its slice, at an inner radius big enough that no two
adjacent labels overlap. To delimit the target areas, short lines are
drawn between the slices, inside the circle of labels, like cuts in
a pie crust.

One solution to the problem of pie menus with too many items is to
divide up large menus into smaller logically related submenus. Nested
pies work quite well, and you can mark ahead quickly through several
levels. You remember the route through the menus in the same way you
remember how to drive to a friend's house, by going down familiar
roads and making the correct turn at each intersection.

Another alternative is to use a scrolling pie menu, that encompasses
many items in a spiral, but only displays a fixed number of them at
once.  By winding the cursor around the menu center, you can scroll
through all the items, like walking up or down a spiral staircase.
A pie menu in which all the menu items do fit in the circle, but
the circle itself does not fit on the screen, can be called a
"Lotto wheel" menu.  In this situation, you invoke the menu,
hold the mouse or stylus at a fixed place, and wait for your menu 
choice to spin over to where the pointer is.  This substitutes
the dimension of time for the dimension of angle.


OTHER DESIGN CONSIDERATIONS

Back to standard pies, when you mark ahead quickly to select from a
familiar pie, it can be annoying if the menu pops up after you've
already finished the selection, and then pops down, causing the screen
to repaint and slowing down interaction.  If you don't need to see the
menu, it shouldn't show itself.  When you mark ahead, interaction is
much quicker if the menu display is preempted while the cursor is in
motion, so you never have to stop and wait for the computer to catch up. 
If you click up a menu when the cursor is at rest, it should pop up
immediatly, but if you click and move, the menu should not display until
you sit still.  If you mark ahead and select with a smooth motion
without stopping, the menu should not display at all.  However, it's
quite helpful to give some type of feedback, such as displaying the
selected label on an overlay near the cursor, or previewing the effect
of the selection. 

When you pop up a pie menu near the edge of the screen, the menu may
have to be moved by a certain offset in order to fit completely on
the screen, otherwise you couldn't see or select all the items.  But
it would be quite unexpected were the menu to slip out from under the
click, leaving the cursor pointing at the wrong slice. So whenever
the menu is displayed on the screen, and it must be moved in order to
fit, it is important to "warp" the cursor by the same offset,
relative to its position at the time the menu is displayed. If you
mark ahead so quickly that the menu display is preempted, the cursor
shouldn't be warped.  Pen and touch screen based pie menus can't warp
your pen or finger, so pie menus along the screen edge could pop up
as semicircular fans.

Ideally, pie menu designers should arrange the labels and submenus in
directions that reflect spatial associations and relationships
between them, making it easy to remember the directions.
Complementary items can be opposite each other, and orthogonal pairs
at right angles.  Consistency of choices among applications,
facilitated by object-oriented.

It's difficult to mark ahead into a pie menu whose items are not
always in the same direction, because if the number of items changes,
and they move around, you never know in which directions to expect
them.  pie menus are better for selecting from a constant set of
items, such as a list of commands, and best when the items can be
arranged to exploit the circular layout.


SAMPLE PIE

This is a color wheel that allows you to set the brightness, and 
to select a color from a continuous range of hues and saturations.
The hue varies smoothly around the color wheel with direction, and
the saturation varies smoothly with distance, with pure colors in the
center fading to gray around the edge.  Outside the pale perimeter is
a continuous band of grays from white to black, that looks like the
shadow inside a paint can, and functions as a circular brightness
dial. Dipping into this gray border sets the brightness of the whole
wheel.  You may select any shade of gray around the border, or move
back into the paint can, to select a color at the current brightness.
As you move around, the cursor shows the true color selected, and
since the cursor is displayed even before the menu is popped up, you
can mark ahead and select a color without popping up the menu!

<talk about trade-offs>

<nice illustration>

THE CODE?

CONCLUSION
<NEED REFERENCES>

================================================================
LISTING 1:

% Code to implement the "8 Days a Week" Pie Menu 
% by Don Hopkins

/pie framebuffer /new ClassPieMenu send def
[ (Today)
 (Sunday)
 (Monday) (Tuesday) (Wednesday) (Thursday) (Friday)
 (Saturday)
] /setitemlist pie send
90 /setinitialangle pie send
false /setclockwise pie send

/can framebuffer /new ClassPieMenuCanvas send def
pie /setpiemenu can send
/minsize {100 100} /installmethod can send
/win can framebuffer /new ClassBaseWindow send def
/new ClassEventMgr send /activate win send
/place win send /map win send

================================================================
LISTING 2


   /Layout { % - => -
       PieGSave self setcanvas
           /LayoutInit self send
           /LayoutValidateItems self send
           /LayoutItemRadius self send
           /LayoutOuterRadius self send
       grestore
   } def

   /LayoutInit { % - => -
       % Deflate the menu.
       /Radius 0 def
       % Figure the slice width.
       /SliceWidth 360 /itemcount self send 1 max div def
       % Point the initial slice in the initial angle.
       /ThisAngle InitialAngle store
   } def

   /LayoutValidateItems { % - => -
       % Loop through the items, validating each one.
       ItemList {
           begin % item

               % Measure the item.
               /DisplayItem load DisplayItemSize
               /ItemHeight exch def
               /ItemWidth exch def

               % Remember the angle and the direction.
               /Angle ThisAngle def
               /DX Angle cos def
               /DY Angle sin def

               % Figure the offset from the tip of the inner radius
               % spoke to the lower left item corner, according to
               % the direction of the item.
               %
               % Items at the very top (bottom) are centered on their
               % bottom (top) edge. Items to the left (right) are
               % centered on their right (left) edge.
               %
               DX abs .05 lt { % tippy top or bippy bottom

                   % Offset to the North or South edge of the item.
                   /XOffset ItemWidth -.5 mul def
                   /YOffset
                       DY 0 lt {ItemHeight neg} {0} ifelse
                   def

               } { % left or right

                   % Offset to the East or West edge of the item.
                   /XOffset
                       DX 0 lt {ItemWidth neg} {0} ifelse
                   def
                   /YOffset ItemHeight -.5 mul def

               } ifelse

               % Twist around to the next item.
               /ThisAngle
                   ThisAngle SliceWidth
                   Clockwise? {sub} {add} ifelse
                   NormalAngle
               store

           end % item
       } forall
   } def

   /LayoutItemRadius { % - => -
       % Figure the inner item radius, at least enough to prevent
       % the items from overlapping.
       /ItemRadius RadiusMin def
       /itemcount self send 3 gt { % No sweat if 3 or less.

           % Check each item against its next neighbor.
           0 1 /itemcount self send 1 sub {

               /I exch def
               /NextI I 1 add /itemcount self send mod def

               % See if these two items overlap.
               % If they do, keep pushing the item radius out
               % by RadiusStep until they don't.
               {   I /CalcRect self send
                   NextI /CalcRect self send
                   rectsoverlap not {exit} if % They don't overlap!

                   % They overlap. Push them out a notch and try again.
                   /ItemRadius ItemRadius RadiusStep add def
               } loop

           } for
           % Now that we've gone around once checking each pair,
           % none of them overlap any more!
       } if

       % Add in some more space to be nice.
       /ItemRadius ItemRadius RadiusExtra add def
   } def

   /LayoutOuterRadius { % - => -
       % Now we need to calculate the outer radius, based on the radius
       % of the farthest item corner. During the loop, Radius actually
       % holds the square of the radius, since we're comparing it against
       % squared item corner radii anyway.
       /Radius ItemRadius dup mul def
       ItemList {
           begin % item

               % Remember the location to center the item edge.
               /x DX ItemRadius mul def
               /y DY ItemRadius mul def

               % Remember the location of the item's SouthWest corner.
               /ItemX x XOffset add round def
               /ItemY y YOffset add round def

               % Figure the distance of the item's farthest corner.
               % This is easy 'cause we can fold all the items into
               % the NorthEast quadrant and get the same result.
               DX abs .05 lt { % tippy top or bippy bottom

                   % (|x|,|y|) is South edge: radius^2 of NorthEast corner
                   x abs ItemWidth .5 mul add dup mul
                   y abs ItemHeight add dup mul add

               } { % left or right

                   % (|x|,|y|) is West edge: radius^2 of NorthEast corner
                   x abs ItemWidth add dup mul
                   y abs ItemHeight .5 mul add dup mul add

               } ifelse

               % Remember the maximum corner radius seen so far.
               Radius max /Radius exch store
           end % item
       } forall

       % Take the square root and add some extra space.
       /Radius
           Radius sqrt Gap add Border add ceiling cvi
       store % Whew, we're done! Time to party!
   } def

================================================================

END
```

↑ [Sources index](README.md) · [Published DDJ digest](ddj-1991-design-implementation-pie-menus.md) · [Don's room](../README.md)
