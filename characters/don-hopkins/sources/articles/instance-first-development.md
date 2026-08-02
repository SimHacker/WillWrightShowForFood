# Instance-First Development

The canonical merge of a decade of Hacker News comments about Oliver Steele's
Instance-First Development and Instance Substitution Principle: what they are, why
they matter, which languages get them right, and who keeps missing them. All prior
versions are listed in [Provenance](#provenance). Sibling articles:
[Constraints and Prototypes in Garnet and OpenLaszlo](constraints-garnet-openlaszlo.md) ·
[What is OpenLaszlo?](what-is-openlaszlo.md) ·
[Svelte 5 Runes, Heir of OpenLaszlo](svelte-runes-openlaszlo-heir.md)

## Contents

- [The idea](#the-idea)
- [The Instance Substitution Principle](#the-instance-substitution-principle)
- [Why it works](#why-it-works)
- [How LZX did it](#how-lzx-did-it)
- [Who misses it, and how](#who-misses-it-and-how)
- [Oliver Steele](#oliver-steele)
- [Echoes elsewhere](#echoes-elsewhere)
- [Provenance](#provenance)

## The idea

In instance-first development, one implements functionality for a single instance,
and then refactors the instance into a class that supports multiple instances. The
definition and the name are Oliver Steele's, from his 2004 post
[Classes and Prototypes](https://blog.osteele.com/2004/03/classes-and-prototypes/)
([archived](https://web.archive.org/web/20190318072102/https://blog.osteele.com/2004/03/classes-and-prototypes/)).

It is about iteratively programming from the ground up: avoiding premature and
unnecessary abstraction, smoothly and rapidly developing prototypes into reusable
components and working products, organically growing and abstracting only when
needed. Like tacking a sailboat against the wind: first exploring by creating
instances, then refactoring into reusable building block classes, then exploring
further with those.

## The Instance Substitution Principle

Oliver, defining the semantics of LZX class definitions, found this principle
useful:

> Instance substitution principle: An instance of a class can be replaced by the
> definition of the instance, without changing the program semantics.

And it operates at two levels:

> The instance substitution principle can be applied at the level of semantics, or
> at the level of syntax. At the level of semantics, it means that a member can
> equivalently be attached either to a class or its instance. At the level of
> syntax, it means that the means of defining a class member and an instance member
> are syntactically parallel.

Both levels matter. The semantic level requires a prototype-flavored object system:
any attribute that can be attached to a class definition can be attached to an
instance of that class instead. The syntactic level requires that the program text
for "one of these, inline, right here" and "a reusable kind of these" look the same,
so converting between them is a cut-and-paste refactoring, not a rewrite.

## Why it works

Instance-first development lets you quickly and iteratively develop working code
while delaying and avoiding abstraction until it is actually needed, when the
abstraction requirements are better understood and informed by experience with
working code. That results in fewer, more useful abstractions, because they follow
the contours and requirements of the actual working code, instead of trying to
predict and dictate and over-engineer it before it even works.

It works especially well for user interface programming, because so many buttons
and widgets and control panels are one-off specialized objects, each with their own
small snippets of special purpose code, methods, constraints, bindings and event
handlers. It is not necessary to make separate, and myriad, trivial classes for
each one: prototypes let you customize any instance itself. (The same shape of
argument, from the constraint side, is in
[Constraints and Prototypes in Garnet and OpenLaszlo](constraints-garnet-openlaszlo.md#prototypes-and-constraints-together).)

## How LZX did it

In OpenLaszlo you create trees of nested instances with XML tags, and when you
define a class, its name becomes an XML tag you can use to create instances of that
class. The syntax for creating a bunch of objects is parallel to the syntax of
declaring a class that creates the same objects. So you start by just creating a
bunch of stuff in instance space, then later, as you see the need, easily and
incrementally convert only the parts you want to reuse and abstract into classes.

That also means you can create your own domain specific declarative XML languages
for creating and configuring objects, using constraint expressions and XML data
binding, which makes it very powerful. Expressing data and instance declarations in
the same syntax you express code and class definitions is an essential feature that
enables instance-first development, and throwing declarative constraint based
programming into that mix is synergistically powerful and expressive.

I have used OpenLaszlo a lot, and I will testify that the instance-first technique
is great fun, works very well, and is perfect for the kind of exploratory /
productizing programming I like to do. The platform itself is described in
[What is OpenLaszlo, and What's It Good For?](what-is-openlaszlo.md)

## Who misses it, and how

The principle is a sharp lens for evaluating languages, because most fail one of the
two levels:

- **JavaScript 1.0-1.5** was a prototype-based language, but lacked classes as a
  first-class syntactic entity, and lacked the hierarchical syntax that Java, C++,
  and LZX use to define class members. Semantic level only.
- **Python** (and JScript.NET, and JavaScript 2.0 proposals) had class definition
  syntax, but did not use the same syntax to define instance members. Syntactic
  parallel broken.
- **Adobe Flex** copied OpenLaszlo's XML surface but missed instance-first
  development and the instance substitution principle entirely, along with the
  cross-platform point (see
  [where OpenLaszlo sits in history](what-is-openlaszlo.md#where-it-sits-in-history)).
- **The reactive programming craze** took up the mantle of constraint based
  programming, but not instance-first development. These are different but
  complementary features with a lot of synergy, and modern frameworks keep shipping
  one without the other.
- **Svelte** comes philosophically closest: a compiler that wires reactive
  dependencies automatically, components that feel instance-first. But Svelte has
  no instance creation syntax that parallels its class (component) definition
  syntax: you cannot swap an inline definition for a component tag without lifting
  it out into its own file. Almost, but not quite. Details in
  [Svelte 5 Runes, Heir of OpenLaszlo](svelte-runes-openlaszlo-heir.md).
- **Self** honors the semantic level natively; prototypes are the whole object
  model. In the right context prototypes enable instance-first development, which is
  why the Self and OpenLaszlo stories keep converging.
- **Declare** (David Temkin's LLM-era successor to Laszlo, 2026) is the first system
  since LZX designed to satisfy the instance substitution principle on purpose,
  certified by Oliver himself.

## Oliver Steele

Oliver is an old school Lisp Machine hacker, one of the architects of OpenLaszlo,
and also created Dylan at Apple, so OpenLaszlo had a very declarative prototypical
Lispy feel to it. Beyond Classes and Prototypes, his
[Rethinking MVC](https://blog.osteele.com/2003/08/rethinking-mvc) is the companion
piece: constraints, data binding, events and delegates as the alternative to the
noughties MVC cargo cult.

## Echoes elsewhere

The idea keeps being rediscovered under other names. Benedek and Lajos's survey
["Conceptualization and Visual Knowledge Organization"](http://real.mtak.hu/31984/1/2197.pdf)
builds "Bottom Up Live Micro Ontologies" directly on it, citing Oliver's definition:
domain concepts and even meta-level concepts are developed instance first, "going
meta" only through live exploration of concrete exemplars — knowledge architectures
that are "turtles all the way up." The Lua community discussed the same pattern in
[Need good examples of when prototype-based objects are better](http://lua-users.org/lists/lua-l/2007-10/msg00379.html).
And TCL's design rationale — syntax optimized for calling functions with literal
parameters to create and configure objects, like a declarative configuration file —
is the same instinct at the shell-language level.

## Provenance

This article merges and deduplicates the following versions, oldest first. Links in
older versions were checked and updated with archive.org substitutes where dead.

- **MVC alternatives comment** (HN, 2014-05-16): [7756215](https://news.ycombinator.com/item?id=7756215)
  (tacking against the wind)
- **New release of Self** (HN, 2017-05-25): [14418108](https://news.ycombinator.com/item?id=14418108)
  (the full ISP treatment, micro-ontologies)
- **YAML thread on TCL** (HN, 2018-06-20): [17360883](https://news.ycombinator.com/item?id=17360883)
- **Homoiconicity thread** (HN, 2019-12-20): [21841054](https://news.ycombinator.com/item?id=21841054)
  (Flex critique, reactive-without-IFD)
- **Instance-First Development (2004)** (HN, 2020-01-14): [22048896](https://news.ycombinator.com/item?id=22048896)
  (the anthology version; Svelte almost-but-not-quite; Oliver bio)
- **Rich Harris / Vercel thread** (HN, 2021-11-12): [29198119](https://news.ycombinator.com/item?id=29198119)
- **Enduring innovations of Lisp** (HN, 2023-06-02): [36160155](https://news.ycombinator.com/item?id=36160155)
  (data/code declaration symmetry as the enabling feature)
