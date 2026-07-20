# HN Thread, December 2023 — Croquet Jasmine, SqueakJS GC, WASM, Self, and "to be honest, fun"

**Story:** [Croquet: Live, network-transparent 3D gaming](https://news.ycombinator.com/item?id=38769416)
(HN 38769416, an article by Liam Proven, December 2023)

**Why this is preserved:** This is the longest and richest public technical exchange between
Don Hopkins and Vanessa Freudenberg — her VM philosophy in her own words: why she chose
JavaScript over WebAssembly, how she planned to make the SqueakJS JIT ride on top of the
JavaScript JIT, and the Self → Strongtalk → HotSpot → V8 lineage she placed her work in.
It is also where she pointed the world at her JIT "brain dumps," preserved alongside this
file in [`jit-notes/`](jit-notes/).

All comment text is verbatim, fetched from the HN Algolia API on 2026-07-20, with parentage
verified. Formatting (headers, blockquotes) added for readability; words untouched.

---

## The plug

**[DonHopkins, 2023-12-26](https://news.ycombinator.com/item?id=38769753):**

> Excellent article -- Liam Proven does it again!
>
> Speaking of a big Plate of Shrimp -- https://www.youtube.com/watch?v=rJE2gPQ_Yp8 ...
>
> The incredible Smalltalk developer Vanessa Freudenberg -- who besides being Croquet's
> devops person, also developed Squeak Smalltalk, EToys, Croquet, and the SqueakJS VM
> written in JavaScript, and worked extensively with Alan Kay -- was just tweeting (yeah,
> it's ok to deadname Twitter!) about reviving Croquet from 20 years ago:
>
> https://twitter.com/codefrau/status/1738778761104068754
>
> Vanessa Freudenberg @codefrau
>
> I've been having fun reviving the Croquet from 20 years ago using @SqueakJS . It's not
> perfect yet, but a lot of the old demos work (sans collaboration, so far). This is pretty
> close to the version Alan Kay used to give his Turing Award lecture in 2004:
>
> https://github.com/codefrau/jasmine
>
> Live version: https://codefrau.github.io/jasmine
>
> This is a version of Croquet Jasmine running on the SqueakJS virtual machine. Here is an
> early demo of the system from 2003. Alan Kay used it for his Turing Award lecture in 2004.
> While working on that demo, David Smith posted some blog entries (1, 2, 3, 4, 5), with
> screenshots uploaded to his Flickr album.
>
> This is work-in-progress. Contributions are very welcome.
>
> — Vanessa Freudenberg, December 2023
>
> Dan Ingalls @daningalls
>
> Yay Vanessa!  This is awesome.  These are mileposts in our history that now live again!
>
> https://twitter.com/codefrau/status/1526618670134308864
>
> Vanessa Freudenberg @codefrau 7:40 PM · May 17, 2022
>
> My company @CroquetIO announced #MicroverseBuilder today.
>
> Each microverse is "just" a static web page that you can deploy anywhere, but it is fully
> 3D multiplayer, and can be live-coded. Portals show and link to other developer's worlds.
>
> This is our vision of the #DemocratizedMetaverse as opposed to the "Megaverses" owned by
> Big Tech.
>
> It runs on #CroquetOS inside your browser, which provides the client-side real-time
> synchronized JS VMs that you already know from my other posts.
>
> #MicroverseBuilder is in closed alpha right now because we don't have enough #devrel
> people yet (we're hiring!) but you can join our Discord in the mean time and the open
> beta is not far away.
>
> We are also looking for summer interns! #internships
>
> https://www.youtube.com/watch?v=CvvuAbjh11U
>
> And of course #CroquetOS itself is already available for you to build multiplayer apps,
> as is our #WorldcoreEngine, the game engine underlying #MicroverseBuilder.
>
> Learn more at https://croquet.io/docs/ and let's get hacking :)
>
> And as of today, #MicroverseBuilder is Open Source!

**[lproven (Liam Proven, the article's author), 2023-12-26](https://news.ycombinator.com/item?id=38770937):**

> Thanks Don!
>
> This is my original submission from back at the time:
>
> https://news.ycombinator.com/item?id=35302162
>
> HN really needs a better automatic-deduplication engine. E.g. If the same link is posted
> again months later, mark the original post as new again with an upvote, and the caption
> (if changed) as a comment...

## Vanessa arrives

**[codefrau (Vanessa Freudenberg), 2023-12-26](https://news.ycombinator.com/item?id=38773689):**

> Haha, thanks for the plug, Don!
>
> I just fleshed out the README for my Croquet resurrection yesterday so others may have an
> easier time trying it. It maybe even contribute :)
>
> https://github.com/codefrau/jasmine

## Squaring the circle: the hybrid GC, and the WASM question

**[DonHopkins, 2023-12-26](https://news.ycombinator.com/item?id=38774059):**

> Vanessa, it has always amazed me how you managed to square the circle and pull a rabbit
> out of a hat by the way you got garbage collection to work efficiently in SqueakJS, making
> Smalltalk and JavaScript cooperate without ending up with two competing garbage collectors
> battling it out. (Since you can't enumerate "pointers" with JavaScript references by just
> incrementing them.)
>
> https://freudenbergs.de/bert/publications/Freudenberg-2014-SqueakJS.pdf
>
> >The fact that SqueakJS represents Squeak objects as plain JavaScript objects and
> integrates with the JavaScript garbage collection (GC) allows existing JavaScript code to
> interact with Squeak objects. [...]
>
> >• a hybrid garbage collection scheme to allow Squeak object enumeration without a
> dedicated object table, while delegating as much work as possible to the JavaScript GC,
>
> Have you ever thought about implementing a Smalltalk VM in WebAssembly, and how you could
> use the new reference types for that?
>
> https://bytecodealliance.org/articles/reference-types-in-wasmtime

## Her answer — the philosophy, in four paragraphs

**[codefrau (Vanessa Freudenberg), 2023-12-26](https://news.ycombinator.com/item?id=38774277):**

> I would like to speed up some parts of SqueakJS using web assembly. For example BitBlt
> would be a prime target.
>
> For the overall VM, however, I'll leave that to others (I know Craig Latta has been making
> progress).
>
> I just love coding and debugging in a dynamic high-level language. The only thing we could
> potentially gain from WASM is speed, but we would lose a lot in readability, flexibility,
> and to be honest, fun.
>
> I'd much rather make the SqueakJS JIT produce code that the JavaScript JIT can optimize
> well. That would potentially give us more speed than even WASM.
>
> Peep my brain dumps and experiments at https://squeak.js.org/docs/jit.md.html

*Those brain dumps are preserved in [`jit-notes/`](jit-notes/).*

**[DonHopkins, 2023-12-26](https://news.ycombinator.com/item?id=38774907):**

> Glad I asked! Fun holiday reading to curl up with a cat to read. Thanks!
>
> I love Caffeine, and I use Craig's table every day! Not a look-up table, more like a big
> desk, which I bought from him when he left Amsterdam. ;)

## Self, dynamic deoptimization, and the V8 lineage

**[DonHopkins, 2023-12-28](https://news.ycombinator.com/item?id=38796583):**

> >Where this scheme gets interesting is when the execution progressed somewhat deep into a
> nested call chain and we then need to deal with contexts. It could be that execution is
> interrupted by a process switch, or that the code reads some fields of thisContext, or
> worse, writes into a field of thisContext. Other "interesting" occasions are garbage
> collections, or when we want to snapshot the image. Let's look at these in turn.
>
> This sounds similar to Self's "dynamic deoptimization" that it uses to forge virtual stack
> frames representing calls into inlined code, for the purposes of the debugger showing you
> the return stack that you would have were the functions not inlined.
>
> I always thought that should be called "dynamic pessimization".
>
> Debugging Optimized Code with Dynamic Deoptimization.
> Urs Hölzle, Craig Chambers, and David Ungar, SIGPLAN Notices 27(7), July, 1992.
>
> https://bibliography.selflanguage.org/dynamic-deoptimization.html
>
> That paper really blew my mind and cemented my respect for Self, in how they were able to
> deliver on such idealistic promises of simplicity and performance, and then oh by the way,
> you can also debug it too.

**[codefrau (Vanessa Freudenberg), 2023-12-28](https://news.ycombinator.com/item?id=38796924):**

> Absolutely. And you know Lars Bak went from Self to Strongtalk to Sun's Java Hotspot VM to
> Google's V8 JavaScript engine.
>
> My plan is to do as little as necessary to leverage the enormous engineering achievements
> in modern JS runtimes.

---

## The X thread the plug quoted (December 2023)

Preserved from [x.com/codefrau/status/1738778761104068754](https://x.com/codefrau/status/1738778761104068754),
as reposted by Don. Highlights, verbatim:

> **Vanessa Freudenberg @codefrau** — I've been having fun reviving the Croquet from 20
> years ago using @SqueakJS . It's not perfect yet, but a lot of the old demos work (sans
> collaboration, so far). This is pretty close to the version Alan Kay used to give his
> Turing Award lecture in 2004: https://github.com/codefrau/jasmine
> *(5:28 AM · Dec 24, 2023)*

> **Dan Ingalls @daningalls** — Yay Vanessa!  This is awesome.  These are mileposts in our
> history that now live again!

> **David A Smith @gocroquet** — Amazing. Thanks so much for bringing this back to life!

> **Don Hopkins @xardox** — That's some high order holiday pleasure hacking!

And a characteristic exchange — @SirFizX207 asked whether the default material diffuse
should be `[1, 1, 1, 1]`, pointing at a line of `jasmine-opengl.js`. Vanessa, on Christmas
Day:

> Yes, you are right. According to the spec: "The initial value for GL_LIGHT0 is
> (1, 1, 1, 1); for other lights, the initial value is (0, 0, 0, 1)."
>
> I just fixed that. But it makes no difference, since Croquet sets all light parameters in
> every frame and does not use the defaults.

She read the spec, fixed the bug, *and* explained why it didn't matter — in one reply, on
a holiday.

---

## Afterlives of the thread

Don reposted and extended this exchange twice, keeping it in circulation:

- **[HN 40917424](https://news.ycombinator.com/item?id=40917424)** (July 2024, on
  *Dynamic translation of Smalltalk to WebAssembly*) — recaps the whole thread and appends
  a distilled exchange:

  > Vanessa> Our guiding principle will be to keep our own optimizations to a minimum in
  > order to have quick compiles, but structure the generated code in a way so that the
  > host JIT can perform its own optimizations well.
  >
  > Don> That's the beautiful thing about layering the SqueakJS VM on top of the JS VM:
  > you've already paid for it, it works really well, so you might as well use it to its
  > full extent!
  >
  > Very different set of trade-offs than implementing Self in C++.
  >
  > Vanessa> Precisely. My plan is to do as little as necessary to leverage the enormous
  > engineering achievements in modern JS runtimes.

- **[HN 42133745](https://news.ycombinator.com/item?id=42133745)** (November 2024, on a
  submission of her SqueakJS paper itself) — introduces the paper and links the recap above.

## Related primary sources in this directory

- [`Freudenberg-2014-SqueakJS-memorial-edition.pdf`](Freudenberg-2014-SqueakJS-memorial-edition.pdf) — the paper under discussion
- [`hn-thread-2021-squeakjs.md`](hn-thread-2021-squeakjs.md) — the 2021 thread where she asked not to be deadnamed
- [`jit-notes/`](jit-notes/) — the brain dumps she pointed to in this thread
- [Vanessa's philosophy (MOOLLM)](https://github.com/SimHacker/moollm/blob/main/designs/vanessa-freudenberg-philosophy.md) — essay tying this thread, the paper, and MOOLLM together
