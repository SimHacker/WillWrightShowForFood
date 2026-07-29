# Don → Tom Lord — Lua / SpiderMonkey / Ungar at Laszlo (21 Aug 2006)

**From:** Don Hopkins `<dhopkins@DonHopkins.com>`  
**To:** Thomas Lord `<lord@emf.net>`, Don Hopkins  
**Subject:** Re: Lua  
**Date:** 21 August 2006 at 05:33:56 GMT+2  
**Forwarded into WWSFF:** 2026-07-29 (Don)

**Why it matters for the OpenLaszlo / Ungar shows:** primary-source receipt that Don **ran into Dave Ungar while Ungar was interviewing at Laszlo Systems**, saw a Self demo (factorial × live-edit of `*`), and argued that JavaScript cribbed Self's prototypes while missing Self's compilability (PICs, incremental compile, dynamic deopt) — two years before V8.

**Already quoted (Ungar graph only) on HN 2022:** [`../self-v8-tom-lord-2006-hn-2022.md`](../self-v8-tom-lord-2006-hn-2022.md)  
**Ungar guest pack:** [`../../david-ungar/`](../../david-ungar/) · extract: [`../../david-ungar/sources/2006-08-21-don-to-tom-lord-ungar-at-laszlo.md`](../../david-ungar/sources/2006-08-21-don-to-tom-lord-ungar-at-laszlo.md)  
**OL reunion:** [`../../../repo-shows/openlaszlo/`](../../../repo-shows/openlaszlo/)

---

## Show-facing extract (Ungar + OpenLaszlo)

I've been doing lots of stuff with OpenLaszlo, which is brilliantly designed by a bunch of lisp-heads with their heads in the right place. The Flash player runs on the Pocket PC, and I can run OpenLaszlo applications in it, but that's too resource intensive for the kind of stuff I want to do with the pie menus, so I'm coding them as close to the metal as possible (while not very close, is a hell of a lot closer than they would be if running in the Flash player or web browser).

…

I just ran into Dave Ungar (of Self fame), and mentioned how ironic it was that JavaScript pointed to Self as its inspirational prototype (vis-a-vis JavaScript's prototype based object system), but JavaScript totally missed the boat on efficient compile-ability, which is the most interesting thing about Self. (I mean, anybody can make a prototype oop system that runs slow, but it takes a fucking genius to come up all the brilliant stuff in Self, like the aggressive inlining compiler (it has no byte code interpreter, just a bad-ass compiler), incremental compilation, polymorphic inline cache, coupled with dynamic de-optimization to make it debuggable). He gave a cool Self demo of writing a straightforward factorial function, then editing the source to the system's multiplication operator, so it would return a different result if you multiplied something by 1,000,000. Then he showed how it affected the factorial function, as well as the rest of the system, which incrementally recompiled itself as needed. All that and perfect debuggability, too! About JavaScript, he retorted that it was actually possible to efficiently compile JavaScript if you were really devious enough. Too bad the art of designing languages so you don't have to be devious in order to compile them, was lost of so many popular bad language designers (PHP, JavaScript, Perl, etc).

Also relevant earlier in the same letter: Don chose SpiderMonkey/JS partly so he could use parts of the OpenLaszlo runtime and eventually run OL apps on a custom simple graphics engine (Pocket PC pie menus + Cepstral speech).

---

## Full email (verbatim)

I'm using SpiderMonkey for some stuff that needs to be "consumer scriptable", but unfortunately there's no SWIG back-end to write my glue code for me. But I ran across something called SpiderApe (which means it's a giant spider monkey, but it has the unfortunate sequence of characters "rape" in it, so, like gimp, it probably won't win any awards for product name design), which is a C++ template library for interfacing native code to the JavaScript interpreter.

I chose JavaScript because one of the big goals is that random joe blow off the street should be able to program it, in as much as possible. That rules out better nice-but-weird languages like Lua , Python or Lisp. The other advantage to using an off-the-shelf standard JavaScript interpreter, is that I can use parts of the OpenLaszlo runtime, and eventually even run OpenLaszlo applications on it (without the DHTML rendering engine, but using my own simple graphics engine instead).

The application is touch-screen talking pie menus for controlling the pocket pc, integrated with Cepstral's speech synthesizer, Windows CE apis (telephony, address book, GPS, etc), and other Windows CE applications (Tomtom Navigator, etc). Windows CE sucks, but it's a lot better than the alternatives. I gave up on programming the Palm, it's much too frustrating, like a Mac in 1995. But the fact that CE sucks actually gives me a low-hanging opportunity to improve it, with pie menus and speech technology!

As a demo, I made a pie menu based dog remote control that speaks commands to your dog when you stroke the screen. Cepstral's speech synthesizer has a barking dog voice, so next version will let you switch it between english and canine voices, and change the pitch and speed to adjust for your dog's size and energy level. Also there's also a cat remote control (which doesn't seem to work -- maybe my cat's remote control receiver is broken), and a pet rock remote control (which does work pretty well, because most rocks are obedient when you tell them to sit, stay, play dead, gather moss, etc).

I've been doing lots of stuff with OpenLaszlo, which is brilliantly designed by a bunch of lisp-heads with their heads in the right place. The Flash player runs on the Pocket PC, and I can run OpenLaszlo applications in it, but that's too resource intensive for the kind of stuff I want to do with the pie menus, so I'm coding them as close to the metal as possible (while not very close, is a hell of a lot closer than they would be if running in the Flash player or web browser).

Ruby in Rails is nice, but it's mainly popular with people who were dumb enough to be suffering with PHP and Java and Perl, and didn't know about Python. Ruby's big advantage is that there is only one web framework to choose from, so neophytes can get up and running without being confused. Which is exactly the opposite problem as Python has, with zillions of web frameworks of varying quality and complexity to choose from. I did a lot of work with Zope/CMF/Plone/Archetypes, and am sick of their pointless complexity, so I've moved on to TurboGears, which instead of inventing a bunch of new stuff, integrates the best Python modules available for its various purposes, and energizes all the communities to work together and evolve. It uses an SQL ORM called SQLObject, which is pretty good but simple and has some limitations. That's what I'm using on my current project. But TurboGears is very modular and accommodating of integrating better ideas as they come along (like various templating systems and ORMs). So the hot new thing now is SQLAlchemy, which is a really cool advanced ORM for Python that separates out the notion of describing the SQL tables, from the notion of mapping them to Python objects, allows full access to the power of SQL (for that that's worth), and optimizes batches of queries by journaling changes and topologically sorting updates so they happen in the right order. It's encouraging that the TurboGears community is flexible and isn't stuck with one set of ideas -- it's unafraid to move on, embrace and extend when something else better comes along. The other popular Python competitor to TurboGears is Django, but that's more insular and not as outward-looking and integration-oriented as TurboGears. That's not something you'll see happening in the Ruby on Rails camp -- they're all drinking the same kool-aid, which only tastes good if you've never tried good wine.

I just ran into Dave Ungar (of Self fame), and mentioned how ironic it was that JavaScript pointed to Self as its inspirational prototype (vis-a-vis JavaScript's prototype based object system), but JavaScript totally missed the boat on efficient compile-ability, which is the most interesting thing about Self. (I mean, anybody can make a prototype oop system that runs slow, but it takes a fucking genius to come up all the brilliant stuff in Self, like the aggressive inlining compiler (it has no byte code interpreter, just a bad-ass compiler), incremental compilation, polymorphic inline cache, coupled with dynamic de-optimization to make it debuggable). He gave a cool Self demo of writing a straightforward factorial function, then editing the source to the system's multiplication operator, so it would return a different result if you multiplied something by 1,000,000. Then he showed how it affected the factorial function, as well as the rest of the system, which incrementally recompiled itself as needed. All that and perfect debuggability, too! About JavaScript, he retorted that it was actually possible to efficiently compile JavaScript if you were really devious enough. Too bad the art of designing languages so you don't have to be devious in order to compile them, was lost of so many popular bad language designers (PHP, JavaScript, Perl, etc).

For fun, I recently took a vacation in Amsterdam, during Queen's Day (the Dutch equivalent of Mardigras). There's a great underground community gay disco called De Trut once a week on Sunday night, that I really enjoyed. Some hot lesbians really loved my KALX Berkeley t-shirt, in fact one was even wearing a Berkeley t-shirt herself! Occasionally the music beat softens and it becomes hard to dance to (by design), and everybody just stands around chit-chatting. You really have to be a regular and know people there, to get the most out of it, though. Since I got back, I've been trying to cope with not being in Amsterdam, by making the most of the Bay Area, going regularly to the End Up for Fag Fridays and Stud for Trannyshack on Tuesdays. Unfortunately you can't smoke joints inside at the dance clubs in the city (except for Zeitgeist and Eagle, but they're not really about dancing), but we have excellent reefer around here, as good as anything in Amsterdam (just not as much hash), and you can pop outside to smoke it.

I also hang out at the Brainwash regularly, especially Thursday night for open mic comedy. There's a great regular psychotic comedian named The Scalesman, who has a hillarious video on his myspace page of doing his routine on the corner of 16th and Mission where all the Jesus freaks hang out. So he's talking shit about Krishna and Jesus, and some homeless woman heckler walks up to him and smacks him in the face with a ham sandwich! Check out the last video on his page, which captures him suffering for his art:

http://profile.myspace.com/index.cfm?fuseaction=user.viewprofile&friendid=80782546

"What would Jesus do?" -one witness to the assault

  -Don


Thomas Lord wrote:
Don Hopkins wrote:
Have you looked at Lua? It's a simple practical not-badly-designed scripting and application extension language, that's used in a lot of games, most notably World of Warcraft (the hugely popular MMPORG which has a lot of extensive user interface mods [google for "cosmos" -- it's the first hit]). The Lua programming environment in WOW is flexible and powerful enough that I'm considering implementing pie menus as an extension, for casting spells, executing macros, etc.

I have looked a bit at Lua.  It's lovely.   I was somewhat aware of its use in games but I haven't really gotten into that domain.

It has some quirks that will always make it slow, but....



Here's an interesting paper that discusses the evolution of Lua:
http://www.tecgraf.puc-rio.br/~lhf/ftp/doc/hopl.pdf


The paper seems to make some interesting points.   I'll have to read it more deeply later.

Cons pairs are certainly suspect and plenty of people make strong and good arguments against C/CC so, I dunno, lua seems like an interesting language from the lisp heritage perspective.


There's some interesting stuff about how and why they decided to use "one shot continuations" and support co-routines. Note that the big constraints they had to work with were ANSI C compatibility, portability and simplicity. One of its hallmarks is that it's easy to call between C and Lua, and they didn't want to break that ability.

I think you can go farther.   Most of the time I don't want full first-class continuations because, well, the module /I'm writing /has no need for them and, worse, anytime I call outside the module now my module has to be re-entrant at the return point?!?!   No way, that's obnoxious.  That's impossible.  That's a nightmare.

I got it /half/-right in Guile where you could have call points that were guaranteed to return only once but also /half/-wrong because that was the expensive case and not the default.

And, yes, full continuations essentially mean that you don't really have a stack except sorta-kinda and well-hidden internally as an optimization of the allocate-everything-on-the-heap semantics you are promising.  That's pretty insane from both pragmatic and theoretic perspectives.



By the way: Wow, you've really buffed out: c(-;

http://site.hugemuscle.com/index.asp?PageAction=VIEWPROD&ProdID=974

"Tom Lord is huge and has a huge dick," -- Google.   I demur to "huge".


I just love the contemplative expression in the top right picture:

http://www.tomlordmuscle.com/index2.htm

  -Don



So what's new?   Aren't you bored with pie menus yet? :-) 
I'm working on a eugenics program^H^H^H^H^H^H^H^H^H^H^H^H^H^H^H  er... research to create inexpensive genetic sequencing technology for Harvard.    Here's a fun technical problem:  quickly generate exactly 12B uniformly distributed random numbers between 0 and 12T and produce them as output -- in sorted order.   Ok, here's an important variation:  the high order bits of your 12B samples should be uniformly distributed but the low-order 10 bits should display a binomial distribution probability density (e.g., tending towards normal).   We'll need several of these per day.    Oh, we also need them shuffled in a fair way.   Oh, and it takes N+1 weeks to get a spec this clear out of the biologists.

You know, there's a lot of terms in that last paragraph I really didn't know a few weeks ago. :-)   Also, 12T (it turns out) is a very big number.

I'm also working/playing with various entrepreneurial possibilities.   I have too many of those irons in the fire and its quickly going to be time to pick one, marshal resources, and execute.   If I'm lucky, of course.

What do you do for fun?

-t

---

*Verbatim archive — typos preserved ("come up all", "lost of", "hillarious", "MMPORG"). Nightlife / comedy paragraphs are personal context in a letter to a close friend; show use should lead with the Ungar + OpenLaszlo extract above.*
