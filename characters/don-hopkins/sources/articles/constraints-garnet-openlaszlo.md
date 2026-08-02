# Constraints and Prototypes in Garnet and OpenLaszlo

The canonical merge of a blog post and twenty years of Hacker News comments about
constraint based user interface programming: what constraints are, how Garnet and
OpenLaszlo each implemented them, the pull versus push trade-off, and why the idea
keeps getting reinvented. Sources and every prior version are listed in
[Provenance](#provenance). Sibling articles:
[What is OpenLaszlo?](what-is-openlaszlo.md) ·
[Instance-First Development](instance-first-development.md) ·
[Svelte 5 Runes, Heir of OpenLaszlo](svelte-runes-openlaszlo-heir.md)

## Contents

- [The pitch](#the-pitch)
- [What constraints are](#what-constraints-are)
- [Garnet: KR frames and pull constraints](#garnet-kr-frames-and-pull-constraints)
- [Prototypes and constraints together](#prototypes-and-constraints-together)
- [OpenLaszlo: compiler-wired push constraints](#openlaszlo-compiler-wired-push-constraints)
- [Pull versus push](#pull-versus-push)
- [A taxonomy of constraint systems](#a-taxonomy-of-constraint-systems)
- [What is holding back constraint programming?](#what-is-holding-back-constraint-programming)
- [Garnet war stories](#garnet-war-stories)
- [The lineage forward](#the-lineage-forward)
- [Provenance](#provenance)

## The pitch

Constraints are like structured programming for variables. In the same way that it
is better to use loops and conditionals instead of gotos, it is better to use
declarative programming that says what you mean, instead of imperative peeks and
pokes and side effects.

Once you have tasted a programming language with constraints, you will not want to
go back. Programming without constraints is like writing in machine language: error
prone, low level, tedious, inefficient and mind numbing.

Garbage collection is the right analogy. The computer can do a much better job than
the human at performing the task perfectly, so spending some cpu time on automatic
garbage collection and constraint maintenance is well worth the significant increase
in programmer productivity and software reliability.

## What constraints are

A constraint is an object attribute whose value is defined as a formula over other
attributes, like a spreadsheet cell. You declare the variable and the formula that
defines it in one place, and the system keeps track of all the dependencies and
updates the value when anything it depends on changes.

With constraints, you can make a button inside a window and define its left edge to
be `((parent.width - self.width) / 2)`, and it will automatically remain horizontally
centered in the window from then on, without you the programmer having to worry
about what to do when the parent window's size changes.

Without constraints, you have to manually write all the code that changes the button
position whenever the window size changes, which results in code scattered all over
the place in different classes and handlers and intermediate objects. Constraints
are much easier to use and more general purpose than resize handlers, springs and
struts, complex MVC updating schemes, and other Rube Goldberg devices. Look at any
MFC program to see how bad it can get without them.

Constraints are especially useful for user interface programming because they
eliminate the boiler plate of update handling: registering, chasing down
dependencies, detecting changes, notifying updates, all happen automatically. But
they are useful anywhere in a program where one value is defined in terms of other
values that might change at any time.

## Garnet: KR frames and pull constraints

[Garnet](https://www.cs.cmu.edu/afs/cs.cmu.edu/project/garnet/www/garnet-home.html)
was Brad Myers' research user interface development environment, written in Common
Lisp on X11 at CMU starting around 1990. I worked for Brad on Garnet in 1992-93.
One thing I like about Brad is that he is a strong programmer as well as an
excellent researcher, so he had a first-hand understanding of the real-world issues
involved in programming languages and user interface architecture, unlike many
academics who talk a lot of theory but never get their hands dirty. Brad understands
where the rubber hits the road, and how important it is to have good tires.

Garnet's object system was KR: Knowledge Representation, classic AI frames with
slots and inheritance. KR was extended with an automatic constraint system,
implemented as Lisp macros that parsed the formula expressions, recognized certain
forms like `gvl` ("get value") and named path expressions, and wired up and
maintained the dependency graph from that information.

An expression like `((parent.width - self.width) / 2)` depends on self's width slot,
self's parent slot, and parent's width slot. If any of them changed, the formula was
automatically invalidated, and only recalculated on demand when it, or something
that depended on it, was next read. That is a lazy "pull" system.

KR did not understand the mathematical expressions themselves. At the time I worked
on it, it did not know how to figure out which branches of conditional expressions
mattered, so it assumed a formula depended on everything it mentioned. In an
expression like `size = window.landscape ? parent.width : parent.height`, only one
of the two branches actually matters at a time, but KR conservatively tracked both.

## Prototypes and constraints together

Garnet had a true prototype based object system, somewhat like Self, and the
combination with constraints is where the magic was. Guis have so many objects that
look and behave like each other except for a few little customizations: the layout,
graphical style, data source, and call-back behavior. Prototypes fit that shape.

You can make a prototype object, like a button, which has sub-structures: a label,
border, drop shadow. The sub-structures are constrained to the button's dimensions;
the label is centered in the border, the drop shadow floats below and to the right,
so the button's layout updates automatically when it moves or resizes. The text
color and border fill can depend on the button's `hilight` variable, so they switch
between bright and dark when you press the button: the input handler just toggles
one variable, and the graphics that depend on it follow.

Now that you have composed and constrained a button to look and feel how you want,
you use it as a prototype to make other customizable button instances. Each instance
can override the prototype's graphical properties, label text, action. Instances of
a prototype magically inherit instances of the sub-structure of the prototype. It
all just works the way you would expect, with a lot of plumbing going on
automatically behind the scenes. There is no need to make a separate class for each
different style of button or action: prototypes let you customize any instance
itself. That workflow has a name and its own article:
[Instance-First Development](instance-first-development.md).

## OpenLaszlo: compiler-wired push constraints

[OpenLaszlo](what-is-openlaszlo.md) arrived a decade later with many of Garnet's
"natural programming" features: prototypes, constraints, declarative programming.
Its constraints are JavaScript expressions written inline in XML attributes as
`${...}`. The OpenLaszlo compiler parses them and generates JavaScript data and
hidden methods behind the scenes that go along with the class, used at runtime to
keep track of all the dependencies. Both systems used a compiler to automatically
determine the dependencies of constraint expressions; Garnet just got it almost for
free with Lisp macros, while OpenLaszlo had to build a real compiler.

You did not need special syntax to read values inside a constraint, but you did have
to write values with `object.setAttribute("key", value)`. That was because OpenLaszlo
targeted the Flash player runtime, and Flash's ActionScript did not support property
setters the way modern JavaScript does, so an explicit setter method was the most
efficient trade-off available.

Calling the setter propagated all dependent changes forward immediately: an eager
"push" model, chosen because that was the best trade-off at the time for speed and
usability in the Flash player for the expected usage and workload. Underneath, the
constraints were built on OpenLaszlo's events and delegates, so a constraint was
sugar for wiring a delegate to every dependency's change event.

## Pull versus push

Neither strategy is right; they are tuned to different bottlenecks.

Garnet's lazy pull model recalculates a formula only when someone reads it. That fits
an environment where evaluation is expensive relative to invalidation, and where
many invalidated values may never be read at all before being invalidated again.
Over high-latency X11 round trips, not recomputing what nobody looks at is a win.

OpenLaszlo's eager push model recalculates everything downstream of a change at
write time. That fits a rendering runtime like Flash where the whole point of state
is to be displayed this frame: nearly every value is read every time it changes, so
laziness buys nothing and costs bookkeeping.

With modern property getters and setters you could implement a more convenient
constraint system that did not put so many constraints on the programmer. That is
essentially what happened: Svelte 5's runes are a compiler-wired push system with
pull-flavored refinements (lazy derived values, batched effects), and the story of
how that maps back onto LZX is its own article,
[Svelte 5 Runes, Heir of OpenLaszlo](svelte-runes-openlaszlo-heir.md). The
[Micropolis OpenLaszlo retrospective](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/openlaszlo/README.md)
goes into exquisite detail on the trade-off, including how wasm shared memory
obliterated the network bottleneck that made pull precious.

## A taxonomy of constraint systems

There are tricky two-way mathematical constraints, like Ivan Sutherland's
[Sketchpad](https://en.wikipedia.org/wiki/Sketchpad) (1963), its descendant
[The Geometer's Sketchpad](https://en.wikipedia.org/wiki/The_Geometer%27s_Sketchpad),
and James Gosling's CMU PhD thesis on
[algebraic constraints](http://digitalcollections.library.cmu.edu/awweb/awarchive?type=file&item=362626),
where the system understands the constraint expressions mathematically and
transforms them algebraically.

And there are simpler one-way data flow constraints, like Apple's
[Key-Value Observing](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/KeyValueObserving/KeyValueObserving.html),
Garnet's KR based constraints, and OpenLaszlo's event/delegate based constraints.
KVO constraints simply say that `object.x = otherObject.y`, so there is not much to
them. Garnet and OpenLaszlo sit in the middle: one-way data flow, but over arbitrary
expressions with automatically derived dependencies.

The term "Reactive Programming" describes a popular old idea: what spreadsheets had
been doing for decades. The mantle of constraint based programming has been taken up
by the reactive craze, which is great, but would be better with a language that also
supported instance-first development and the instance substitution principle, which
are different but complementary features with a lot of synergy.

## What is holding back constraint programming?

All the constraints. ;)

Seriously: one thing holding back constraint programming is that constraints require
an interpreter or compiler to understand them, or the programmer to write code in a
constrained syntax. Garnet needed Lisp macros. OpenLaszlo needed a whole
XML/JavaScript compiler. Svelte needs its compiler. You cannot bolt a good
constraint system onto a language as a mere library without giving something up;
the systems that feel magical are the ones where the compiler does the wiring.

## Garnet war stories

I worked on Garnet's PostScript printing driver. Brad is really into mineral
acronyms, and I came up with one he liked: "GLASS: Graphical Layer And Server
Simplifier".

The problem we ran into with supporting PostScript is that we wanted to use Display
PostScript, but Garnet was using CLX, the Common Lisp X protocol library, which was
of course totally written purely in Lisp, and had no way to use any client side
libraries that depended on XLib itself. I'd steer clear of anything that depends on
CLX for anything modern.

Brad also produced "All the Widgets", the ACM CHI 1990 video telling the history of
widgets up until then, which must have some Garnet demos in there somewhere:
https://www.youtube.com/watch?v=9qtd8Hc90Hw

## The lineage forward

Sketchpad (1963) → Gosling's thesis → Garnet (1990, pull) → OpenLaszlo (2001, push)
→ the reactive programming craze → Svelte 5 runes (push with pull refinements,
compiler-wired, escaping the DOM entirely). Each step is covered at depth in its own
place rather than repeated here:

- [What is OpenLaszlo, and what's it good for?](what-is-openlaszlo.md) — the platform itself
- [Instance-First Development](instance-first-development.md) — the prototype side of the story
- [Svelte 5 Runes, Heir of OpenLaszlo](svelte-runes-openlaszlo-heir.md) — the modern era
- [Micropolis in OpenLaszlo retrospective](https://github.com/SimHacker/MicropolisCore/blob/main/documentation/openlaszlo/README.md) — all of it applied to one real application, twice, twenty years apart

## Provenance

This article merges and deduplicates the following versions, oldest first. Links in
older versions were checked and updated with archive.org substitutes where dead.

- **Constraints and Prototypes in Garnet and Laszlo** (blog, 2005-09-18):
  [archive.org](https://web.archive.org/web/20160405015129/http://www.donhopkins.com/drupal/node/69) ·
  [Medium re-edition](https://donhopkins.medium.com/constraints-and-prototypes-in-garnet-and-laszlo-84533c49c548)
- **MVC alternatives comment** (HN, 2014-05-16): [7756215](https://news.ycombinator.com/item?id=7756215)
- **Garnet toolkit thread** (HN, 2016-03-06): [11232154](https://news.ycombinator.com/item?id=11232154)
  (GLASS, PostScript driver, CLX) and [11234280](https://news.ycombinator.com/item?id=11234280)
  (pull vs push mechanics, taxonomy, "All the constraints")
- **YAML/TCL thread recap** (HN, 2018-06-20): [17360883](https://news.ycombinator.com/item?id=17360883)
- **Homoiconicity thread** (HN, 2019-12-20): [21841054](https://news.ycombinator.com/item?id=21841054)
  (Sketchpad lineage, reactive-programming-as-spreadsheets)
- **Spreadsheets are all you need** (HN, 2024-03-14): [39708468](https://news.ycombinator.com/item?id=39708468)
  (visual constraint programming context, Peridot, Myers bibliography)
