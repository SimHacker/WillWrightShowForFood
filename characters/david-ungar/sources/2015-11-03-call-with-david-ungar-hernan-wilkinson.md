---
type: source-transcript
title: "Call with David Ungar (Hernán Wilkinson, Buenos Aires, 2015)"
date: 2015-11-03
source: https://www.youtube.com/watch?v=8nfrC-YLYqc
hn: https://news.ycombinator.com/item?id=23800625
speakers: [david-ungar, hernan-wilkinson]
provenance: >
  Lightly cleaned from YouTube auto-captions of a live Hangout streamed
  3 Nov 2015 on Hernán Wilkinson's channel (2,270 views). Obvious caption
  errors fixed where certain (Ingalls, Rosch, Lakoff, Hölzle, Bak, Bracha,
  Griswold, Agesen, Korz, Klein, Korzybski, Van De Vanter, Wirfs-Brock,
  Stroustrup, Kevo, Emil Sarpa); guesses marked with ⟦brackets⟧. Original
  wording otherwise preserved. HN comments below are mirrored as posted
  11 July 2020.
---

# Call with David Ungar — Hernán Wilkinson, 3 Nov 2015

A Hangout with [David Ungar](../README.md) and Hernán Wilkinson's
object-oriented programming class in Buenos Aires, posted at
[youtube.com/watch?v=8nfrC-YLYqc](https://www.youtube.com/watch?v=8nfrC-YLYqc).
Submitted to HN five years later by Marcel Weiher:
[Call with David Ungar (2015)](https://news.ycombinator.com/item?id=23800625)
(16 points, 4 comments, 11 July 2020).

They join mid-conversation about polymorphic inline caches. David then
tells the origin of Self, answers the class for two hours, and ends by
wishing he had gotten to know each of them better.

Related in this room: the [2006 Laszlo receipt](2006-08-21-don-to-tom-lord-ungar-at-laszlo.md)
(the factorial demo Don posted in this thread); the
[2014 Stroustrup / Hewitt / Ungar conversation](2014-stroustrup-hewitt-ungar-conversation.md)
(the Channel 9 link Don posted in this thread);
[Korz](../korz/README.md); [Fitts and foveation](../fitts-and-foveation.md);
[Self: The Movie](https://www.youtube.com/watch?v=Ox5P7QyL774)
and Jecel's index of Self/Smalltalk movies.

> Because we had Smalltalk blocks we didn't need a lot of the
> cockamamy Gang of Four patterns, which to me mostly look like
> apologies for poor programming language design.
>
> — David Ungar, [17:48](https://www.youtube.com/watch?v=8nfrC-YLYqc&t=1068s)

## Hooks

- **APL as first language, 1972.** Freshman assembler assignment: classmates
  punch a thousand lines of PL/I; David turns the assembly source into APL
  with a few lines and feeds the string to the interpreter. Code and data
  are the same thing. That is the start of dynamic languages for him.
- **Swimming in a sea of live objects.** Randy Smith's phrase. Dan Ingalls
  changing the highlighting code, in the editor he is using to change the
  highlighting code. The environments most languages ship without.
- **Randy's physical-world test of classes.** Alternate Reality Kit: here's
  an object, it holds water — where's the class? Show them Randy's ARK video
  (Jecel's index). Lieberman's delegation paper: they thought he got it wrong.
- **How people actually categorize.** Elizabeth Rosch; Lakoff & Johnson's
  *Women, Fire, and Dangerous Things*. If the goal is to shrink the gap
  between how people think and what you type, design the language for that
  — not for Aristotelian taxonomies.
- **Simplicity, uniformity, malleability.** Randy's mantra. Small number of
  concepts → everything is the same kind of stuff → everything plugs into
  everything else, like Lego. Java's `int` vs `Integer` as the anti-example;
  Gosling visited the Self group while Oak was a battery-powered remote.
- **Unify state and behavior.** Touching a thing *is* an experiment. You
  don't care whether `x` was stored or computed. Implicit self: the
  difference between OO and procedural is one element of context. Dynamic
  inheritance fell out. [17:48](https://www.youtube.com/watch?v=8nfrC-YLYqc&t=1068s):
  "Because we had Smalltalk blocks we didn't need a lot of the
  cockamamy Gang of Four patterns, which to me mostly look like
  apologies for poor programming language design."
- **The environment is the org chart.** Michael Van De Vanter. Squint test:
  the most salient thing on screen should be the task. Art that hides art.
  Generation scavenging cursor-flash as Ungar's own guilty counterexample.
- **JavaScript.** Brendan Eich inspired by Self, designed over a weekend.
  Prototype system a botch; misspelled variables become globals. Nice to
  point at a famous language influenced by his; he wishes it were a better
  one. Allan Wirfs-Brock on the committees — the class had just had him in
  Argentina.
- **Teach UI at 4 a.m.** Stay up, get tired and stupid, then debug. Self
  vs C: you last hours later because there is no compile wait, no error
  message in another window, you can try an expression in place, identity
  is two arrows to the same box, spatial memory holds piles of objects.
  Cartoon animation offloads cognitive burden. Road Runner: hop in place
  to put the fovea on the bird, then a streak, not interpolated frames.
  This is the same visual-system lecture behind
  [Fitts and foveation](../fitts-and-foveation.md) — motion is a foveation
  summons; only send it where you want the eye.
- **The world needs subjectivity, not another prototype language.** Korz
  (`k r z`). Multiple implicit arguments + multiple dispatch. Colorblind
  user as a new dimension at the last `drawLine`; invert Y for Australia
  (he jokes he should have used Argentina). IBM reassigned him after the
  paper; "almost fired me for spending time on that stuff." He wants to
  get back to a Korz IDE; Swift or JavaScript as a possible host once
  open-sourced.
- **PICs were my idea; the counters might have been Urs's.** Stanford
  grants with few strings, then Sun because Bill Joy and Emil Sarpa hired
  him, "once-in-a-lifetime team." He has not been good at recreating it.
  "I wish someone would just pay me money, leave me alone — or better yet
  pay other people money to work for me and leave us alone." Don's first
  comment in the HN thread is that sentence, pointed at the world.
- **Fired at Sun for Klein.** Self VM written in Self; mirrors let you
  retarget the environment to objects somewhere else; fix-and-continue
  for the VM itself. Sun then did a watered-down Java VM project. Urs
  Hölzle and Lars Bak left, Strongtalk with Gilad Bracha and David
  Griswold, Sun bought it back, HotSpot. Ole Agesen's exact GC in the
  old Sun VM competed with HotSpot inside Sun for a while.
- **Who you are.** The intense joy of Smalltalk at Berkeley is why the
  good stuff happened. Freeze-frame Road Runner for a little boy with a
  VCR. Korzybski at thirteen (via science fiction): every fact is an
  observation with circumstances attached; the map is not the territory.
  Don't amalgamate languages you like. Write your own songs.
- **Programming languages are models, not reality.** Shared-memory
  multiprocessing is the face-to-face illusion of simultaneity; message
  passing is Einstein. Self is Rutherford: throw message-rocks at a
  black box and see what bounces. Functional languages have no time.
  Context of use is the part academics skip (Mars rover vs research
  laptop; APL if you know linear algebra). Same axis as the
  [2014 Channel 9 conversation](2014-stroustrup-hewitt-ungar-conversation.md).
- **C++.** First OO talk he heard was Stroustrup at Bell Labs in the late
  70s. Thought it was too hairy; used it anyway for the Self VM. Respect
  has grown: given "every cycle counts" and multi-paradigm, he doesn't
  know if C++ could have been better. If you are not that worried about
  performance, other languages will be more effective.
- **Senderpath.** Prioritized multiple inheritance with center-path
  tiebreaker looked genius on the blackboard; Craig Chambers implemented
  it in a week; six months of "compiler bugs" that were the rules doing
  what they said. Taken out of the language. His Twitter handle is named
  after his worst career mistake. If inheritance didn't exist, programmers
  would invent it; subjectivity is how you crack single vs multiple.

## As posted on Hacker News

Live at [news.ycombinator.com/item?id=23800625](https://news.ycombinator.com/item?id=23800625),
11 July 2020. Story: [Call with David Ungar (2015) [video]](https://www.youtube.com/watch?v=8nfrC-YLYqc),
16 points by mpweiher.

```
Can somebody with a lot of money please regularly give a bunch of it to Dave Ungar, so he can keep doing what he wants to do? He has generated so much value on so many levels, that's so important and useful to millions of people and companies on a daily basis.
```

[23806310](https://news.ycombinator.com/item?id=23806310)

```
I wrote this in 2006 (a couple years before V8):

I just ran into Dave Ungar (of Self fame), and mentioned how ironic it was that JavaScript pointed to Self as its inspirational prototype (vis-a-vis JavaScript's prototype based object system), but JavaScript totally missed the boat on efficient compile-ability, which is the most interesting thing about Self. (I mean, anybody can make a prototype oop system that runs slow, but it takes a fucking genius to come up all the brilliant stuff in Self, like the aggressive inlining compiler (it has no byte code interpreter, just a bad-ass compiler), incremental compilation, polymorphic inline cache, coupled with dynamic de-optimization to make it debuggable). He gave a cool Self demo of writing a straightforward factorial function, then editing the source to the system's multiplication operator, so it would return a different result if you multiplied something by 1,000,000. Then he showed how it affected the factorial function, as well as the rest of the system, which incrementally recompiled itself as needed. All that and perfect debuggability, too! About JavaScript, he retorted that it was actually possible to efficiently compile JavaScript if you were really devious enough. Too bad the art of designing languages so you don't have to be devious in order to compile them, was lost of so many popular bad language designers (PHP, JavaScript, Perl, etc).

https://en.wikipedia.org/wiki/V8_(JavaScript_engine)
```

[23806654](https://news.ycombinator.com/item?id=23806654)

jecel, parent of the 2006 story:

```
And after that one of Dave's ex-students put the Self technology into Javascript (V8). So you were right.
```

[23807167](https://news.ycombinator.com/item?id=23807167)

```
A Conversation with Bjarne Stroustrup, Carl Hewitt, and Dave Ungar

They have a fascinating (and polite, respectful) argument about shared memory, message passing, locks, synchronization, and lock free message passing!

https://channel9.msdn.com/Blogs/Charles/A-Conversation-with-Bjarne-Stroustrup-Carl-Hewitt-and-Dave-Ungar
```

[23806717](https://news.ycombinator.com/item?id=23806717)

Same 2006 letter, later posted with Tom Lord named:
[Self, V8, and the lost art of compilable language design](../../tom-lord/self-v8-tom-lord-2006-hn-2022.md)
([HN 33527618](https://news.ycombinator.com/item?id=33527618), Nov 2022).

## Transcript

Speakers: **David Ungar**; **Hernán Wilkinson** (host); unnamed students
in the room. Audio starts with hangout echo; they pick up mid-PIC
discussion, then restart.

### 0:00 — Hangout comes up

They fight echo. "Can you see us? I can see you, I can hear you. This
is wonderful. Incredible. Great. I cannot believe the technology."

Hernán: thank you for taking the time. The class is studying Self.
Would like to hear how the idea started, maybe the Treaty of Orlando,
whatever David wants — even soccer.

### 1:56 — APL, 1972: code and data are the same thing

David: start with APL as a freshman. Night time-sharing, 1972. The
assignment: assembler and emulator. Classmates write about a thousand
lines of PL/I, punch cards, wait minutes to hours in a hot room.

He drove to the APL place they let him use free at night. One line of
APL: put a colon after the labels. Another: quotes around the operands.
A few lines later the assembly program that was the *input* had become
an APL program. One more operator: take this string and feed it to the
interpreter. Plus equals pop, push, plus, push — the whole thing in
about twenty lines.

Deadline. Classmates turn in thick stacks of cards that don't work. He
turns in twenty lines of APL, thinks he might flunk for cheating, gets
an A.

The difference: the APL system, like original Lisp, took two things
that were separate in other systems — code and data — and unified them.
In C or Java you type code ahead of time, press go, and *then* there is
data. In APL and Lisp you write code that manipulates code. You turn
code into data, data into code. That's what happened with the assembly
program. That got him started on dynamic languages.

Sadly, many dynamic languages today don't come with a programming
environment. When he discovered Smalltalk as a student it only ran on
special expensive computers so noisy they had to live in a closet —
Xerox Dorado, Dolphin; the Alto could sit in your office but was too
slow to enjoy. They had overlapping windows, debuggers that showed you
what was going on. You could stop a program halfway, make a change, and
see it. You could change the very code putting text on the screen.

Dan Ingalls has a wonderful video where he changes the highlighting
code from a smear of color to an outline, in the editor he is using to
change the highlighting code. That's really powerful. Randy Smith and
David call that **swimming in a sea of live objects**. You don't get
that today.

### 7:52 — Stanford, Xerox, Lieberman, ARK, no classes

Before Stanford he showed how to make Smalltalk run fast on a cheap
microprocessor. Then Stanford, consulting at Xerox: what's Smalltalk-86
going to be? They had Smalltalk-80.

Henry Lieberman had come out with his delegation paper. They didn't
think much of it — "I think he got it all wrong." Randy had the
Alternate Reality Kit — "you ought to show them the video, because
that's amazing."

Everyone thought classes were part of object orientation. Randy's
philosophy was follow the physical world. He's a theoretical physicist.
Here's an object, it's quite useful — where's the class? There's no
class. If you want to find out it can hold water, look at it: it holds
water.

Classes came from two places. One: the Scandinavian school, modeling,
Aristotelian categories — some respect there. But cognitive psychology
has shown people don't actually think that way. Elizabeth Rosch; Lakoff
and Johnson, *Women, Fire, and Dangerous Things* — "the best book I
think Lakoff ever did, maybe because he did it with ⟦Rosch / Johnson⟧."
Experiments on how people think. If your goal is to help people be
creative by minimizing the gap between how they think and what they
have to do to get a computer to do something, keep that in mind when
you design the language.

Educated people inherit a lot from the Greeks, so classes feel natural,
and once you've done something enough it becomes easy. Those paradigms
may work well for the educated. They are less basic, less well
internalized.

The other thing: Smalltalk had seven kinds of variable access. Peter
Deutsch whispered maybe we could unify those. Randy had an eye for
elegance. David has always liked very simple theories.

So Randy and David came up with Self. Radical idea: eliminate classes.
If every thing is an object and a class is an object and every object
has a class, you have an infinite number of classes. Smalltalk loops
meta-classes back; no one ever understood that part. Other languages
solve it by not having classes be classes, which destroys uniformity.

Randy's mantra: **simplicity, uniformity, malleability.** Simplicity:
very small number of basic concepts. That leads to uniformity:
everything built of the same kind of stuff. That leads to malleability:
everything plugs into anything else, like Lego — one kind of round bump,
one kind of spacing.

Java: primitive `int` vs object `Integer`. You can't pass one where you
need the other without making them compatible. In Smalltalk and Self an
integer is an object, so anywhere you can bring an integer you can
bring one of your own things that masquerades as integer.

When Gosling was doing Java — called Oak at the time — he visited the
Self group at Sun Labs. He didn't like making integers objects because
he was afraid of the runtime overhead. They were doing a language for a
battery-operated handheld programmable remote control. That's what Java
was originally for. "They made a lot of stupid mistakes in Java. They
sort of imitated Smalltalk, they made it look like C, they did
something with a lot of bad stuff in it."

Randy and David at the blackboard, drawing pictures of objects:
if an object just knows its own slots, it doesn't need a class. If the
methods can live in objects, you don't need a class. That was the first
aha.

Next aha: unify state and behavior. Why is accessing a variable
different from running a method? They're not. Think of the world. When
I touch this thing I'm performing an operation on it — an experiment —
getting a result that it is hard and solid. Same as asking a Cartesian
point for its x coordinate. You don't care whether x was stored or
computed just in time.

In Smalltalk you had to write `self` in front of one and not the other;
people were always defining setters and getters. A consequence of the
unification: you didn't need to write `self` to do something. That led
to a deep observation: the thing that distinguishes object-oriented
programming from procedural programming is that OO always has **one
element of context**. If you're reading a program and you see `display`
— display what? There's an implicit self. Display is going to display
whatever the receiver is. In Fortran or C, `display` calls some
function that's always going to do the same thing. In OO you send a
message to an object, the computation spins around in the context of
that object without needing to say self, occasionally sends to other
objects, then returns.

Along the way: dynamic inheritance. If inheritance is just a special
kind of link between two objects, why not change the link like any
other reference? That fell out. A really new powerful idea. Singletons
were easy:

> Because we had Smalltalk blocks we didn't need a lot of the
> cockamamy Gang of Four patterns, which to me mostly look like
> apologies for poor programming language design.
>
> — [17:48](https://www.youtube.com/watch?v=8nfrC-YLYqc&t=1068s)

That was the language. Next phases were building it out, the user
interface, the programming environment. He stops for questions.

### 18:37 — Why a minimalist language?

Student: how would a self-consistent language like Lisp, Smalltalk,
Self improve the programming endeavor compared with feature-packed
languages like C++, Java, Ruby?

David: with a minimalist language you build all the features *above*
the language level, and in the book you talk about what those are. You
wouldn't build a spelling corrector as part of the language. You take
the things people want to think in terms of and make them pieces of the
library or the environment.

A lot of folks don't want the simple theory. They want a big cookbook.
Restaurants don't say "we have pizza and you can have pepperoni or
sausage or mushroom." They say we have the stroganoff with all these
meats and we have the vegetarian. Minimalist languages seem not to
catch on as well as languages with a lot of features. If he had to do
it over, the trick would be to talk about all the features — but the
great intellectual achievement is building the minimal thing that
supports all the features in a graceful way.

The way it helps: when things aren't built in, and they don't do what
you think they ought to do, you can look at them in the debugger. Swift
has a huge crazy type system; type errors pop up that don't make sense;
you can't single-step the type checker because it's buried, built in,
uses no algebra that's exposed. In a minimalist language you can dig
down. You can make your own Boolean that's sometimes true depending on
the temperature outside, pass it around anywhere, because Boolean is
not part of the language — Boolean is something you can send `ifTrue:`
and `ifFalse:` to.

Easier to get the tooling right. Swift's compiler growing pains; Java
VMs, security loopholes from the bytecode verifier — languages so big
it's hard to get the tools right. Original Self VM: like seven
bytecodes. When you start optimizing you can have bugs either way. It's
a lot harder when you're implementing something really complicated that
isn't layered appropriately.

### 24:14 — How long for the basic ideas?

A few months, if he had to guess. Randy and he met maybe once a week
when David was consulting, down at PARC. Then a seminar at Stanford
implemented a toy Self in Smalltalk, fleshed more out. Key ideas: a few
months. They knew they didn't like the way Henry did copy-on-write —
his elephant was a child of the prototype elephant, the prototype had
four legs, his elephant didn't have any until you colored a leg red,
then it had a red leg and inherited three. Not physical. Wrong model.
They did inheritance the other way, with parents.

They had Smalltalk, they had ARK. Might have been six months. They knew
where they wanted to go. They hated meta-classes. Randy's ARK had no
classes: a warehouse, copying to make new objects.

### 26:35 — Why don't current languages have environments like Self?

Several reasons. Complexity of the language. A cultural / cognitive-
style fear of dynamicity. And **the environment is the org chart**.
Michael Van De Vanter, Berkeley PhD, looking at environments most of
his career: when I look at your programming environment — Eclipse,
Xcode, whatever — I see your organization chart instead of my program.
Badly designed apps: this group, that group, this piece of the screen,
that piece, instead of the task at hand.

Squint test: squint at Windows, you see window boundaries, bright and
vivid. Squint at a Mac, boundaries fade. The most salient thing on
screen should be the thing that's most important for the task.

A lot of bad design out there, and he's guilty of it. When he did
generation scavenging he was so proud he had the cursor change for
every scavenge, just to show it was so fast. Really annoying.

People who do environments want you to see the environment because
that's what they're proud of. You should see your program. **The art
that hides art.** A good musician, dancer, football team: you don't see
the effort. You don't think "that vibrato was done carefully." You just
think: that's right. That's what environments should do.

Most computer scientists are terrible at this. Conference talks are
awful, especially academics — captive audience, tiny writing on slides,
no excitement, no drama. Interfaces the same way. Xcode is okay, better
than most because it's Apple, still showing so much stuff he doesn't
need right now.

In the Self UI, a piece of your program was a thing. You could move it
around, jump between things. Related methods stacked in a column. The
focus was on your stuff. The things you could do with them receded into
the background.

### 32:52 — JavaScript

Student: how do you feel about JavaScript, so big right now, a
prototype language — does it accomplish anything of what Self
accomplished?

"That is a great question. Thank you for asking it."

Brendan Eich has said he was inspired by Self, and that he did the
basic design over a weekend. JavaScript gets a lot of things wrong. The
prototype inheritance system seems like a botch. Misspell a variable,
you get a new global by default. A lot of things maybe okay for a
three-line program, pretty bad for a twenty-line program, disastrous
for a thousand-line program.

Mixed feelings. Nice to point to a famous language influenced by his.
He sure wishes the language was a much better one. Having to say
`this`. Tries to get functions in there. "It's a mess." People working
to make it better — old Smalltalk cronies like Allan Wirfs-Brock, key
people on the committees for successive versions. Hopefully it will
improve.

Hernán: Allan was just here in Argentina, talking about the changes
he's proposing, leading the group.

### 35:27 — Should curricula include UX?

Yes. The right way to do one of those courses: sit down in front of a
computer running a UI at 3 or 4 a.m. Stay up, drink beer, do whatever
you need to be tired and stupid — or get up before coffee. Then try to
write and debug a tricky program. That's when you see the differences,
because people are so adaptable that well-rested they can paper over a
lot.

When he used to stay up really late, as he got tireder he'd make more
stupid mistakes, then realize he'd spent an hour rewriting with no
progress. It takes that long when he's stupid to notice he's stupid.

What he noticed with Smalltalk, and more so with Self, compared to C:
he could go many hours later. You don't ask for a compile and wait. You
don't look at an error message over there and figure how it connects to
over here. If you're not sure how something works you try the
expression right there in the middle of your program, not in a separate
window. You get boxes and arrows corresponding to the objects at hand,
and if two things point to the same thing you get two arrows to the
same thing — identity, graphically. Randy: a big two-dimensional space,
a pile here and a pile there, scroll around, spatial memory, like
knowing which shelf of the refrigerator has something to eat. Those
abilities are deep. You don't lose them as much when you get tired.

They pioneered cartoon animation techniques in the UI: motion,
transitions, lighting, so the things that drew your eye were the things
that mattered, and when things changed you could see what was going on
without expending conscious effort. Film: the most important action lit
well; the main character's eyes almost always a little more light. You
don't notice. It takes less effort. The phrase in the UI community:
**offloading the cognitive burden.** Take away the effort of managing
the interface so you can put more on your program.

You need to try good interfaces as well as bad. Eclipse, NetBeans,
Visual Studio, Xcode — not enough. Try really good dynamic interfaces.
Maybe even LabVIEW. Video games: designed to be easy to parse. This
explosion just bright enough, this noise just loud enough, this
character moves just enough to put your eye on him. Film-director
thinking. One of the people they talked to for the Self UI was a buff
of old films. Watch black-and-white from the 30s and 40s; look at how
carefully everything is lit.

The human visual system is two systems. Fovea: tiny piece in the middle,
detail and color. Periphery: rods, vague shapes, movement, contrast.
Whenever there's movement somewhere your eye zooms over there, then
your brain gives you the illusion you see all of it at once. You don't.
Experiments: stare at one thing while they slowly change another; you
don't see the change at all. You really have to look at the way humans
work. Most computer scientists just don't.

Road Runner: when he moves off screen he starts by jumping up and down
— that puts your eye on him — then there are no frames of him moving
across; a streak of smoke or dust, and in a twelfth of a second the
Road Runner is somewhere else, dust dissipating. You could draw a box
here in one frame and here in the next as long as you fill the gap with
a streak. In Self UI 1: the object backs up for a moment, then the
streak, then it wiggles for a second. That motion steers your eye. You
don't even notice it when it's done right. Apple has done it to some
extent. You don't see it much on the iPhone. You don't see it in
programming-language environments.

Apple search-next: sometimes the hit goes yellow for a moment, which
attracts the eye; sometimes it doesn't. It should always.

### 45:34 — State of research on prototype-based languages

Earlier that day he sent Hernán a paper. Really good work. IBM
reassigned him after they wrote it, and almost fired him for spending
time on that stuff.

The world doesn't need another prototype-based language. The world
needs a **subjectivity-based** language. The paper is based on
prototypes and subjectivity, but you could bring subjectivity into
other paradigms. That's the direction he thinks is most interesting.

Why? Look at how the world is changing. These things — phone, watch —
are an extension of our nervous system, always with us, more so than
the laptop because they're with us like eyes and ears and hands. A
hammer is an extension of your nervous system when it's in your hand.

Mobile computing has to be sensitive to what you're doing: going
somewhere, sitting down, who's using it, screen size, device. Things
that change while you're using the program. Apple Handoff: bring the
phone near the computer, the program moves.

We need to write programs whose behavior changes in response to
multiple independent dimensions. Screen size independent of who's
using it; whether you're late for an appointment is another. OO gave us
one dimension of variation: the receiver — classes and superclasses, or
prototypes and parents. Walk up to an ontology and add a second
dimension: painful. Vehicle → land/sea, cars and trucks, then
manufacturers, Saab making cars and airplanes — visitor pattern, split
objects into parts that depend on one thing and parts that depend on
the other, a bunch of code.

Better: just as there's one implicit self at all times, there could be
more than one. Combining implicit arguments and multiple dispatch —
**Korz** (k r z). You could evolve the program by changing one little
piece to be more sensitive to other dimensions.

Early-draft example: you want to go to lunch, you have to adapt the
program for colorblind users. Conventionally a global, or pass
"colorblind" down every routine. In Korz you add the dimension, and at
the last point — draw a line on the screen — two methods, one only for
colorblind users, one only for not, and the one maps colors and calls
the other. Then: we're going to sell this in Argentina, reverse all the
images so they're upside down — go to the last place it draws a pixel
and invert the y-coordinate. "I actually use Australia for my example
but hey, you guys are…"

Think of the system as slots in a sparse multi-dimensional space that
group themselves into objects depending on your perspective. Given
values of the n−1 dimensions, slots appear to cluster into objects.
State, behavior, even object identity become dependent on the observer.
Just as in the real world we experience an underlying reality but
everybody has a different perspective, in this language there is an
underlying reality but in any given circumstance the computation
operates on a perspective.

Mechanically a combination of two old ideas, never done this way.
People who've done contextual computing never got it this elegant and
simple and minimal at the bottom. "It broke my heart not to be able to
continue on it in my job. That's okay. Now I'm doing iOS applications
and learning Swift and learning functional programming and learning the
dangers of a language mixing two different styles of programming. It's
a lot of fun. Not as important."

### 55:27 — How does it feel, having done PICs and scavenging, to be writing iOS apps?

"Thank you for asking. I do think polymorphic inline caches were my
idea, and the counters in them might have been Urs's idea, and the
adaptive…"

Really happy to have done stuff that made a difference. Partly worked
hard, partly smart, partly parents. Did well in school, nice position
at Stanford, grants that came easily and didn't have many strings. Self
work funded at Stanford by those grants, then at Sun because Bill Joy
and Emil Sarpa hired him, and they put together the Sun Self team —
"an incredible once-in-a-lifetime team." He hasn't been good at
recreating that situation. Things happen. You get busier, you get
older. "It's sad. I wish someone would just pay me money, leave me
alone — or better yet pay me money, pay other people money to work for
me, and leave us alone. But you just don't get that very often."

The other side: they got that in 2013 when they invented this language.
Fantastic. Working with several other really great guys. Korz.

The US economy, nonlinear complex dynamic systems — a subject he urges
everyone to study. Milton Friedman, von Mises, Hayek. Companies which
rightly need to make money: IBM felt it needed to change how it spent
research money, and it happened to hit him. He didn't get to keep doing
what he was doing.

This — iOS — is incredibly important too. Learning how to make this
happen is important. As long as he's learning, things are pretty good.
Swift: amazingly ambitious, forced him to learn modern functional
programming, what it became after APL. Programming in Swift is
enormously addictive but not productive. Like a video game so hard you
want to keep going, just easy enough that you win often enough to feel
good. If he were doing this in Self he would have gone much faster —
except he wouldn't get the Apple APIs, the UI experience, the hardware,
the efficiency.

Eventually he'll come up with something somewhat important as a result
of doing this. You go through changes. Working on this and learning
about it is a lot better than getting fired. "I've been fired for
working on Self at Sun, and that wasn't a good experience."

The **Klein** virtual machine: a Self VM written in Self. Fix-and-
continue for the virtual machine. Sitting in one Self world, the VM
running in another; the mirror reflective architecture he invented let
you retarget the environment to objects that were somewhere else very
easily. If the VM stopped, you could change the code here and it would
go over there and keep going. "Which is how it ought to be." Fired at
Sun because that was not practical enough; then they did a Java VM
project that was a watered-down version of this. "So what are you gonna
do."

Hardware: when they did Self, object-oriented languages were barely
practical. The tricks and inventions were just being made possible by
hardware getting better. If they hadn't done them, other people would
have eventually — you can't do adaptive optimization until the machine
is so fast you can hide extra compile time, you need memory, you
couldn't do prototypes without enough memory and cycles to pay the
overhead to make the classes underneath invisible. It all connects.
"I'm really very happy these days, but I do want to get back to that
Korz IDE someday. If anyone wants to work on it, let me know. We can
collaborate from afar." Someday Swift is going to be open-sourced; it
would be interesting to get Korz's ideas into an existing language like
JavaScript or Swift.

Student: we really appreciate the work. I read all the Self papers for
my master's. They were amazing.

David: it was an amazing group.

### 1:04:59 — What else to look at, besides coding, to broaden the mind?

"What a wonderful question." First thing that occurred: nothing that
you can do — if students paid their teachers directly instead of paying
the school, education would be much better. That's another story.

The hardest and most important thing is to find out who you are. At
your age many of you know some but not all. What really excites you,
what really doesn't, and why. Everybody is so different. Once you know
what really excites you, figure out how to do that.

When he was making Smalltalk faster at Berkeley he was so excited
because he could program in Smalltalk really quickly — interpretive,
rapid turnaround, windows, menus. Hit him like a ton of bricks. First
language APL, then Fortran which was awful, various others. That
intense joy led to so much of the good stuff they talk about in his
career. Later he could analyze it. You want to figure out what that is
for you, because that'll be the thing where you just won't get enough
sleep.

Follow and learn about other things you love. The cartoon animation
work came because he loved cartoons and had a little boy and bought a
VCR with slow motion so he could freeze-frame Road Runner and Popeye
and look at what they were doing. That led him to read books about it.

Unrelated books: at thirteen, a science-fiction book based on a work of
philosophy — general semantics, Korzybski — using language to think
more clearly. Influenced everything he did. He didn't realize it until
he was thirty and went back and read the book. Every fact in your head
is really an observation, and along with it you need the circumstances:
time, place, what you were feeling, what the light was like. Loved
physics, read a lot about physics.

Don't just do something that's like something else. Too many people
when they build a language throw in the features from all the other
languages they like — "dare I mention Perl or Ruby or any of these
things which I have very little respect for, because they're just
amalgams." Don't do what's been done before. Do your own thing. If
you're a musician, get to the point where you're writing your own songs
or improvising. Those are his values. Other people have different
values. Take risks. Be creative. "That's nothing you haven't heard
before."

Student: it's great coming from you. Inspiring.

David, on "you": "Every time you say something like that with the word
*you* I want to look behind me to see who's there."

### 1:12:03 — Why do universities start with C++ and Java, no environment?

He started having thoughts so he may not have caught all of it. One
important language that's good to learn is assembler. Maybe the second
language, if not the first. Virtue in understanding how computers work.

For first exposure a really good environment would make a huge
difference — but it has to be a good *simple* environment, where you
don't have to learn as much for the environment as for the language.

Human culture is a complex chaotic system. He doesn't think it
optimizes any particular utility function. Ideas spread because they're
catchy, not because they're good — Dawkins, memes. True of how to teach
programming and of academic culture. Teaching the same thing every year
gets boring, so teachers find some new methodology, some new language.
Phonics, whole word, back to phonics. Old math, new math. Just because
something is the way it's done does not mean it optimizes anything
important.

He's sort of burnt out on trying to change the world in any particular
way. If people want to do things that are not effective, fine, let them
do it. Their choice. "How's that for a kind of cynical view."

They have about fifty more minutes. "When you leave you all have to go
drink some beer and then try to write a program."

### 1:16:50 — A universal programming language? Physics envy

Student: physicists look for a unified theory. Is there a convergence
toward one language that unifies how we think and model?

He does not believe physical theories *are* reality. He does not think
electrons are real. Epistemological. The theory of electrons, quantum
mechanics, represent concise descriptions of a bunch of measurements
that also predict what some measurements will do. Electron is an idea
people came up with to explain what needles on meters did, what drops
of oil did. Pretty good explanation: simpler than the experiments, and
new experiments still worked — until they didn't. If a physical theory
is not reality but an interpretation of reality, when the theory
changes you don't have to say reality changed. General semantics: the
map is not the territory, the word is not the idea, the theory is not
the reality.

Same for programming languages. Any given language is not the same as
the idea. He has an idea of what object-oriented programming ought to
be; Self is an embodiment of the idea, not the same as the idea.
Important to keep those separate, to think clearly. Korzybski: "for
the sake of sanity" — the more your thoughts correlate with experience,
the saner you are.

What language designers do is take their favorite model of reality and
embody it in a language.

Parallel programming: when two people talk face to face, the impression
is you're seeing the other person as they do things, you know what they
feel as they feel it. Dissect it: light takes time, fractions of a
second for the nervous system, pattern recognition that can be wrong,
mirror neurons that can be wrong. Impression of instantaneous
communication; sometimes it breaks down — "wait, dogs or cats?" That
experience of reality is what you get in **shared-memory
multiprocessing**: two threads, the implementation lets you think this
thread can read these variables and that one those, no delay, hunky
dory; when it breaks down, repair mechanisms, deadlock detection.

Another model: Einstein was right, we're all little islands, we
communicate at the speed of light, no such thing as simultaneity,
general relativity. That's **distributed programming with message
passing**.

Object-oriented programming itself is kind of their model of the
Rutherford nucleus experiments: throw particles at stuff, look how it
bounces, use that to see what's going on. In Self you send messages at
objects. The messages are like rocks you throw, except the rocks have
objects stuck on them called arguments, and something bounces back —
the result. You don't get to look inside. A real black-boxy model.
Almost like doing experiments.

A functional language: no time, nothing ever changes. You throw data at
the function. Data never changes; it's always there in different forms,
transformed by function after function.

Physics: concise models that agree with measurements. Programming
languages: concise models that let you build things more easily. Very
different. There are probably a lot more ways to build things than
answers you can get to a physical experiment. Models have to fit your
brain either way, but more latitude. Different people think
differently. The things we build have very different contexts. Mars
rover is different than the laptop he does research on. Research
software doesn't have to work — he just fixes it. The rover, if it
breaks, that's really bad.

Most people when they talk about programming languages never talk about
the context in which it will be used. What do people know? If you know
linear algebra, APL is a perfect language. If you don't, APL is a
terrible language.

Academics — not this class — famous exponents of functional programming
in various countries with big bushy beards: they spend their whole
careers telling other people what they know, the other people soak it
up like sponges, they think what they know is universally true. Coal
miners get black lung; people who teach for their whole careers can
suffer thinking their truth is the truth.

He doesn't think we'll ever see one programming-language design.
Too many cultures: mathematics, algebra, group theory, physics,
switchboards, plugging things together, visual thinkers, lexical
thinkers, big-picture first, details first, cycles to burn, cycles that
burn a hole in your pocket. What's incredible is how cheap transistors
have gotten. That's made all these different contexts possible.

### 1:28:25 — Is computer science a science? An engineering?

William Kahan at Berkeley — interval floating point, programming for
the first HP scientific calculator. Never met anyone smarter. He liked
to call it ⟦computo⟧.

Everyone wants to be a scientist because in America the scientists
helped win World War II, and that gave scientists and physics a lot of
prestige. That's why people want to say they're computer scientists.

He's personally more excited by engineering than science, although he
loves the science. He likes to build things that do things. You need
the science and the math, then the technology. What excites him about
computers is using them to do stuff: make lives better or more
interesting or more creative. Anything that contributes to that seems
important to know: how to program, how to program so it can be
maintained, how to design software, how to build hardware so it enables
certain kinds of software. If you're designing a language or an
interface you better study people, cognitive psychology. Confirmation
bias: the error each of us makes every minute, built so deeply into our
nervous systems. We think thoughts that confirm what we already know.
Fighting that is hard but productive.

He hates "informatics" as a word — created to diminish the field. Same
as "health care" without "medicine." A health-care provider could be
anybody; a doctor has put in a lot of effort. An IT person could be the
person who sweeps the dust off the computer.

"Software engineering" has been corrupted: people who need to do a lot
of planning, well-established planning things, problems people already
know how to solve. A payroll system a little different from the last
one, so you do a bunch of UML first. Really, software engineering
should just be building software that works.

### 1:34:09 — Academia and industry

"Boy, you people are just unlocking all of my rants and raves with
these great questions. I'm really having fun. Someday when you've got a
gray beard you'll know what — when people listen it's just an immensely
ego-boosting sort of a thing."

Academia's main purpose is not to make great new discoveries but to
make great new professionals — people who will do things nobody has
done before. To train you to do that, one key ingredient is to have you
watch *me* try to do that. Apprentice-style research, what a lot of PhD
programs are about. Classwork matters too: master things in a social
setting. That's how he learned Morse code — didn't want to look stupid
in front of friends, so he actually practiced. Passed the ham radio
test. Forgotten it now that he's not in the class.

Funding of academia: students usually use money borrowed from the
government, no incentive for universities to spend wisely, tuitions
rise too fast, people take courses that end in the word "studies,"
graduate, can't get jobs, big debts. People themselves are not paying
the cost, so no tight feedback loop to learn things that will help them
make money.

Students need to study things that let them add value to the world.
Best definer of value: what makes money in a free market. Universities
need to do some research to do that. How that's funded is an
interesting question.

Private sector: its only job is to make money, where making money means
creating wealth. Adam Smith: wealth created by division of labor. Farmer
better at wheat, farmer better at cows, trade, both richer. You need
property rights, free trade. If he builds a restaurant and it's cheaper
for you to give him $2 for the hamburger than to make it yourself,
factoring in the value of your time, you both win. Evolutionary system
that leads to creation of value.

Computers — hardware and software together — add value. He paid a lot
of money for this phone because in his judgment what it does is worth
more than the device and the plan: call his girlfriend when he's
running late, jot things down wherever he is, texting.

What's nice: if we create value for others we create value for
ourselves. When he gets paid in the private sector, the paycheck is
worth more to him than the work, they're getting something they can use
to make money, eventual customers getting something worth more than
they pay. Everybody gaining in wealth.

Universities create human capital. Private sector uses it to create
wealth. Some people come out and start companies. As long as the
feedback loops are tight, the system works. When they get too loose, it
doesn't. Large dynamic nonlinear chaotic system: those do not respond
to centralized control. They only work with many little feedback loops
exerting decentralized control.

Student: unexpected response, but thank you.

### 1:44:03 — Why didn't Self become a commercial language?

He would love it to be a commercial success. The project got cancelled
by Sun. They were on time and under budget for what they did versus
what they planned. To make it commercial would have required a lot more
time and people and work. He didn't have the ambition and the resources
to go off and try to do a business, or the inclination. Life was
difficult in other ways. Easiest thing was to stay at Sun and try to
work on the next thing rather than leave and start a company.

When the project got cancelled, two very key people — Urs Hölzle and
Lars Bak — did leave and started a company with somebody else. They
took the virtual machine. Strongtalk. Teamed up with Gilad Bracha and
David Griswold. The code was all publicly usable, so they didn't mind.
When they couldn't sell Strongtalk they did a quickie port to Java, and
Sun ended up buying the company back for lots of money. That became
HotSpot, the JVM.

Hernán: so in some sense you helped Java be more important and fast.

David: he doesn't know if Java would be as successful if it wasn't
based on the Self virtual machine. Funny: the top two VMs — another
grad student who moved to Boston, Ole Agesen, did exact garbage
collection in the old Sun virtual machine, and that and HotSpot
competed for a while within Sun before HotSpot inevitably won.

He wanted it to be used. He wanted people to be more creative as they
would be from using it. He wanted it to be rich and famous.

### 1:48:05 — Implicit self; C++; multiple inheritance

Hernán remembers that at the beginning you always had to write `self`
and then a couple of years later they made it implicit. How does he
feel about that?

It wasn't years. It was days. Smalltalk: `self` to access a method, no
`self` to access a variable, because accessing a variable was not
dispatched, statically bound. They knew they wanted to unify state and
behavior. If they'd followed Smalltalk you'd have had to say `self x`
to access x. Two problems. Small problem: a pain, `self i`, `self j`.
Worst problem: where does `self` come from? `self` is like accessing a
variable, so `self self x`, `self self self x` — it never ends. The
only way to make it end in a consistent way: a bare name means self.
Then he can tell you what `x` means and even what `self` means: `self`
means self.

That's a little bit of what he means about confirmation bias: being
willing to look at the thing and see what the world is telling you
about your design. Languages that require you to write `this` yourself
he thinks are really hokey. They don't understand objects.

Multiple inheritance: back when they did Self, people were struggling
with it, nobody had a good way. Might not have been in at the beginning
but went in very quickly — if a pointer can be a parent pointer, why
not two? Symmetry.

In one version, while Randy was away in England, at Stanford with his
students, he had brilliant ideas for how to do multiple inheritance
right, and public and private: **prioritized multiple inheritance with
center-path tiebreaker**, plus rules for public and private. Thought it
was genius. Warning: if you have any good students who can implement
whatever you can imagine, watch out. He had Craig Chambers, so good he
could make anything work in a week. Craig changed the compiler to make
the design work. For the next six months they kept hitting what they
thought were compiler bugs. Every time they looked, the compiler was
following exactly the rules David had outlined. The rules which looked
so good in examples did very strange things in other cases.

He took prioritized multiple inheritance out, and the center-path
tiebreaker. "You'll only see it now as my Twitter tag, and I don't
Twitter much, is senderpath. So I named it after my worst career
mistake." Getting an error instead of the system doing the wrong thing
is really good. Craig had a solution for a new scheme that might have
been better; they never tried it out.

Better support in the IDE for inheritance. Antero Taivalsaari did
⟦Kevo⟧, where instead of inheritance he just cloned everything in every
place, then had to reinvent a scheme for grouping related behavior —
the real weakness. If God didn't exist, man would invent him; if
inheritance didn't exist, programmers would invent it, because it's
really useful to have a bunch of related methods that correspond to
something in your mind, draw a box around them, call them a thing.

Most of what people have done since, traits and stuff, is just a big
mess. May be incrementally better; doesn't solve the real problem.
Subjectivity again: one view of the world when things are executing —
every method in every object — and another view when you're thinking
about it for programming, things related clustering in boxes. A
principled take on subjectivity is the key to really cracking single vs
multiple inheritance.

### 1:56:42 — C++

First exposure to object-oriented programming: a talk Bjarne Stroustrup
gave at Bell Labs in the late 70s, when David worked there. Didn't
think much of C++ — hairy language, too many things in it — but they
used it to build the Self virtual machine because it let them do OO.
Later it got hairier with templates; he shied away; now realizes the
hair and the problems were a consequence of wanting something really
efficient and multi-paradigm. Given those constraints he doesn't know
if C++ could have been any better than it was. Respect for it has
grown, and respect for Stroustrup has grown to where it always should
have been.

If you're writing a language where every cycle counts and you want to
use any paradigm you want, you will pay a high price in productivity.
That's C++. Even Objective-C is going to be less efficient. People will
blow a lot of smoke about efficiency: unless someone is comparing their
benchmark to a machine running optimized C++, comparing not just speed
but memory and power, they're lying to you. If you're doing a Mars
rover and you're using ten-year-old technology because it has to be
robust — the Apollo mission was programmed in assembler, as he recalls.

Wonderful language. If you are not that caring about performance — and
you have to be really, really, really, really worried about it — there
are languages that'll probably be more effective for you.

### 2:00:04 — Close

Hernán: time to let you go. Really appreciate it. Hope we can do it
again next year. Would like to have you here in Buenos Aires.

David: it's been a real pleasure. Only regret is that he didn't get to
know each of them better, including Hernán — fantastic what he's doing
with this course, looking at the philosophy behind the languages, which
is so very important. Most people just take their own philosophy for
granted as if it's the absolute truth in the world. "It's been a real
blast for me."

↑ [sources](README.md) · [character](../README.md) · [invitation](../invitation.md)
