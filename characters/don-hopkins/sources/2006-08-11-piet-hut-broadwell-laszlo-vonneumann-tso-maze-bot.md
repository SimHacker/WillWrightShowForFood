# Berkeley Espresso, 11 August 2006 — Piet Hut, Peter Broadwell, OpenLaszlo, and von Neumann in a browser

*Primary source. Don met **Piet Hut** and **Peter Broadwell** at the Berkeley Espresso
coffee shop and wrote them the next morning, copying **[Jim Mackraz](../../jim-mackraz/README.md)**.
One mail carries four threads: the 29-state von Neumann cellular automaton he had just
implemented in OpenLaszlo, a wanted-ad for a SpiderMonkey/SWIG/ActiveX platform for pie-menu
Pocket PC shells, OpenLaszlo as a compiler that treats JavaScript and SWF as machine
language — and, as "a digression," the screen-scraping bot that printed two million
simoleans an hour in The Sims Online.*

*Spelling, typos, and the broken* `http;//` *are as received.*

## Who was in the room

**Piet Hut** — `piet@ias.edu`, astrophysicist at the Institute for Advanced Study, and the
Hut of the **Barnes–Hut tree algorithm** (1986), the hierarchical N-body approximation that
made large gravitational simulations tractable. A coffee with someone who compressed the
N-body problem is a reasonable place to bring up cellular automata.

**Peter Broadwell** — `peter@plasm.com`, of **Plasm**. With Rob Myers and Becky Fuson he
built **Plasm: Yer Mug** for the SIGGRAPH '96 Digital Bayou in New Orleans: a 50s-themed
diner counter whose mirror is a life-size rear projection, where on-screen **breakfast
reassembles itself into characters** that react to customers. Behavioral "bacon," "eggs," and
"toast" artificial-life elements, driven by optical recognition plus **force-sensing stools
and countertop**. The geomorphs mutate and are inherited by later visitors, so the ones you
meet are not the ones the artists installed.

The title is a double pun that earns its place: *mug* as face, *mug* as coffee cup. Ten years
later Don is meeting him in a coffee shop.

### A correction to the secondary literature

Steve Dixon places the piece in *Digital Performance: A History of New Media in Theater,
Dance, Performance Art, and Installation* (MIT Press, 2007), in the section **"The Spirit of
Narcissus,"** alongside Nicholas Anatol Baginsky's *The Narcissism Enterprise* (1998), which
composites your face with features harvested from previous visitors, and Alba d'Urbano's
*Touch Me* (1995), where touching the artist's on-screen portrait replaces that patch with
the corresponding part of your own face. Dixon writes that Yer Mug is

> an eerie electronic mirror [that] merges "reflections" of visitors' faces with graphical,
> mutating ArtificialLife forms housed in the computer's memory.

**The face-merging is wrong.** Dixon's own two flanking examples are face-composite works, and
the detail appears to have bled sideways onto Yer Mug. The primary descriptions — plasm.com,
the ACM SIGGRAPH history archive entry, and a contemporaneous Media Lab survey — agree that
Yer Mug tracks **body language and posture**, via video envelope plus force sensors in the
stools and counter, and reflects it as mutating a-life geomorphs. Nobody's nose gets grafted
onto anybody. Dixon also gives the third artist as "Rebecca Fulson"; plasm.com credits
**Becky Fuson**.

The thesis survives the error — an inheritance-based mirror that hands your leavings to the
next visitor is squarely a Narcissus machine — but cite the primary sources for the
mechanism.

**Jim Mackraz** — `jim@trickybit.com`, copied. Amiga Intuition, later Tricky Bit; he has his
own room [here](../../jim-mackraz/README.md).

## The email, in full

> From: Don Hopkins [dhopkins@DonHopkins.com](mailto:dhopkins@DonHopkins.com)
> Subject: Nice meeting you this evening!
> Date: 11 August 2006 at 11:08:19 GMT+2
> To: [piet@ias.edu](mailto:piet@ias.edu), [peter@plasm.com](mailto:peter@plasm.com), Don Hopkins [dhopkins@DonHopkins.com](mailto:dhopkins@DonHopkins.com), 'Jim Mackraz' [jim@trickybit.com](mailto:jim@trickybit.com)
>
> We (Peter Broadwell and Piet hut and I) met at the Berkeley Espresso coffee shop this evening -- it was fun talking with you!
> How's it going? Please send me some links to the platform stuff you're working on, I'm quite interested in that kind of stuff!
>
> I've been doing lots of stuff with OpenLaszlo, which you could use for building user interfaces and browsers and controllers for simulations running over the net.
>
> OpenLaszlo is what I wrote the classic von Neumann 29 state cellular automata machine. It's all implemented in OpenLaszlo -- no server side: it all runs in the Flash player. It is an incredibly inefficient implementation that I wrote to be easy to understand and verify that it was doing the right thing. Fortunately, thanks to the extreme inefficiency, it runs slow enough that you can see what's going on! In the real world, I'd implement the cellular automata engine in C++ on the server side and wrap it with SWIG so I could call it from Python (well in the real world I have already done that part), and then use OpenLaszlo as a general purpose cell browser/editor/viewer (which I'd do if I had the time -- but this is only a hobby).
>
> Here's a link to the article I wrote describing it, with links to the source code and live demo. It uses the pie menu component I developed for OpenLaszlo. The interface is kinda goofy in a lot of ways, because I was just playing around learning OpenLaszlo.
>
> Article:
>
> [http://www.donhopkins.com/drupal/node/41](http://www.donhopkins.com/drupal/node/41)
>
> Demo (requires Flash player):
>
> [http://www.donhopkins.com/lzxnet/my-apps/vonNeumann/vonNeumann.lzx](http://www.donhopkins.com/lzxnet/my-apps/vonNeumann/vonNeumann.lzx)
>
> Here's the source code, which is written in a combination of XML and JavaScript (with nice long descriptive function names like "wellFlankedByConfluentExcitedState"):
>
> [http://www.donhopkins.com/lzxnet/my-apps/vonNeumann/vonNeumann.lzx?lzt=source](http://www.donhopkins.com/lzxnet/my-apps/vonNeumann/vonNeumann.lzx?lzt=source)
>
> On the topic of "I Hate Flash", so do I, and fortunately OpenLaszlo now supports alternative runtimes than Flash, including DHTML+JavaScript running in ordinary web browsers without Flash. Think of it as a high level portable language compiler, that targets multiple instruction sets, treating JavaScript and SWF as machine language. The OpenLaszlo language is purposefully independent of Flash, the same way C++is independent of the VAX instruction set (though certainly influenced by it, even the reference to register indirect post-decrement addressing mode in C++'s name!).
>
> Details about "Project Legals" OpenLaszlo for multiple runtimes:
> http;//[www.OpenLaszlo.org](http://www.OpenLaszlo.org)
>
> Anyway, I've also been programming the Pocket PC. There's a great port of Python to the Pocket PC, but it's pretty big, and I'm interested in making a more consumer-oriented product, that pro-sumers can customize and script, so JavaScript's the natural language to use for that. And of course SpiderMonkey, the original JavaScript interpreter written in C that powers Mozailla/Firefox/etc, is the obvious JavaScript implementation to use. But extending it and integrating it into applications is too painful.
>
> Unfortunately, I can't find a SWIG back-end for SpiderMonkey that's useful. Somebody has an old half-done attempt against an crusty version of SWIG, but SWIG has evolved a lot since then, and I need full-fledged support for calling back and forth between C++ and JavaScript objects.
>
> The other thing I need, which is actually implemented by a cool project called "jsdb" ([www.jsdb.org](http://www.jsdb.org)), is ActiveX integration into SpiderMonkey, so I can create and control COM objects from JavaScript. The "jsdb" code is brilliant but messy, and as far as I can decypher the code, the ActiveX integration seems to be missing the difficult technique of handing OLE generated events from JavaScript code (IConnectionPointContainer, etc). But it's intricate and useful enough code that it's worth cleaning up and finishing, if I can find the time, because it will surely save a lot more time that it will take to do.
>
> If I had a good SWIG back-end for the latest version of SpiderMonkey (which has XML support built in), and an industrial strength ActiveX interface for JavaScript, I think that would be a first class development platform for the Pocket PC (and the desktop and server as well). JavaScript sucks in a lot of ways, but they got enough important stuff right, it's totally ubiquitous, and a lot of people know it.
>
> Since you're interested in cool frameworks, definitely check out what "jsdb" can do -- it's an amazing application of SpiderMonkey, but too big and feature-rich for what I want to do on the Pocket PC at this stage.
>
> I'm focusing on using JavaScript to integrating existing SDKs (speech synthesis, GPS, MAPI, etc) and applications (TomTom Navigator, phone, text messaging, etc) via my own touch screen pie menu based user interface. Like an alternative shell and scriptable QuickKeys, with touch screen pie menus for handheld phones and pdas. It will be able to capture and synthesize Windows events, and even do a certain amount of screen scraping, to overlay and drive existing applications' user interfaces.
>
> The cool thing about using SpiderMonkey, is that OpenLaszlo targets that very same JavaScript interpreter, so I'll be able to use bits and pieces of OpenLaszlo which project Legals has factored out (like events and constraints and XML data binding), and once it has a decent rendering module (OpenGL, anyone? It's been SWIGified!), it will be an ideal alternative platform for OpenLaszlo. What I really want to come out of this, is a runtime for OpenLaszlo integrated with a kick-ass 3D rendering engine, that's easy to plug other code into (with SWIG), and integrate with ActiveX components, xml, web services, etc.
>
> A digression: A few years ago, I wrote a screen-scraping bot for The Sims Online that ran two different sessions of The Sims Online client, and remotely controlled each end of a two-player maze game, by screen scraping, solving mazes, and sending fake window events, to generate more than $2,000,000 simoleans an hour. My friend and I made a little more than a real grand selling Simoleans on eBay, but eventually other people started making their own maze bots -- and selling them, and then of course people would occasionally discover outrageous duping exploits in the game, so the bottom fell out of the market.
>
> Delivering Simolians to psychotic kids and evil grandmothers in The Sims Online was a customer service nightmare. You had to show up in virtual person, and hand over the cash in small units. The first million we delivered was limited to $5000 at a time: that was the limit of what you could transfer at once, with a tip jar. So I had to fill 200 tip jars with $5000 each. The customer would make a long row of tip jars, and follow behind me, emptying them as I filled them one by one, with the help of a bot macro. Delivery took longer than actually manufacturing the money! And it's very suspicious looking -- attracting the wrong kind of attention.
>
> Once I was delivering some money by filling a customer's long row of tip jars, and their roommate walked in on us. She sized up the situation, and then cleverly snuck over and put her tip own jar at the end of the row. So I accidentally delivered $5000 simolians to her jar  ,instead of to our customer's! But it was so funny I forgave her and let her keep the money, as a reward for her ingenuity. (Anyway to was too late, she'd hustled me and it was hers!)
>
> It was fun, but took way too much time. But it was great for my friend's eBay reputation, because the maze milking machine gave us so much of a supply, that we'd always tip our customers generously! But eventually we got out of the virtual money printing business, after a brief but entertaining experiment in screen scraping bot-o-mation and virtual e-conomics.
>
>   -Don



## What's in there, unpacked

**Deliberate slowness as a debugging affordance.** The von Neumann implementation is "incredibly
inefficient" *on purpose* — written to be easy to verify, and slow enough that you can watch
the rule fire. Don names the fast version in the same breath and says he already built it:
C++ engine, SWIG-wrapped, callable from Python. So this is not a limitation being excused; it
is a second implementation with a different job, and legibility is the job. Function names
like `wellFlankedByConfluentExcitedState` are the same instinct applied to the source.

**The 29-state rule as a recurring test case.** It shows up again in
`[cam6-cellular-automata-machine.md](../cam6-cellular-automata-machine.md)` as the
`JohnVonNeumann29` rule, and the self-reproduction argument runs through
`[cam-construction-set.md](../cam-construction-set.md)`. The 2006 OpenLaszlo build is the
browser-side, hobby-scale, watch-it-think member of that family.

**Compilers that treat JavaScript as machine language.** OpenLaszlo targeting both SWF and
DHTML, with the C++/VAX analogy — and the aside that `++` is itself a nod to register-indirect
post-decrement. Twenty years on, this is the ordinary condition of web development, and it is
also exactly the framing MOOLLM uses for compiling prose into runnable snippets.

**A platform wanted-ad that never got filled.** SpiderMonkey plus a modern SWIG backend plus
industrial-strength ActiveX, aimed at a pie-menu touch shell for phones and PDAs, with speech
synthesis, GPS, MAPI, and TomTom driven through it — plus event synthesis and screen scraping
to "overlay and drive existing applications' user interfaces." Nobody shipped that stack. The
pie-menu-on-a-touchscreen thread continues in
`[connectedtv-touch-tuning-finger-pies.md](../connectedtv-touch-tuning-finger-pies.md)` and
`[ie-jscript-htc-xslt-pie-menus.md](../ie-jscript-htc-xslt-pie-menus.md)`.

Note what the last two threads share: **driving somebody else's application from outside it,
by faking input and reading pixels.** He proposes it as a product architecture in one
paragraph and reports having already built it against a live game in another.

## Driving the game from outside — the adversarial ancestor of the angel

Two Sims Online clients, one bot, playing both ends of a two-player maze game against itself:
screen-scrape the maze, solve it, send synthetic window events. More than two million simoleans
an hour. A little over a thousand real dollars on eBay. The joke of the ratio is the point —
industrial virtual output, pizza-money real revenue, and delivery still cost more than
manufacturing.

Three things in the architecture are load-bearing beyond the anecdote.

**All the intelligence lives outside, and the game never knows.** The bot is out-of-band
automation of a Sims game, unmodified and unaware. It had to scrape pixels and forge input
because there was no way to *ask* — no channel for the game to state a request or receive an
answer. The cooperative version of the same topology is the
[angel event bus](https://github.com/SimHacker/moollm/blob/main/designs/sim-obliterator/ANGEL-EVENT-BUS.md),
where the game emits requests and the outside intelligence answers them. Same architecture,
opposite consent.

**A rate-limited transfer primitive turns a solved problem into a logistics problem.** Producing
the thing was automated and effectively free; *moving* it was capped per transaction, so the
work collapsed into carrying it across in many small identical steps. Delivery cost more than
production. That is the same shape as moving marriage licenses between lots in the
[life events playset](../../../designs/orchestrator-playsets/life-events-playset.md), where the
cross-household channel, not the artifact, is the hard part.

**An automaton that trusts position can be hustled by appending one more element.** The delivery
loop filled *the next container in the row* with no check on who owned it, so a bystander who set
her own container down at the end received deliveries meant for someone else. Don later filed
this under [off-by-one error](https://en.wikipedia.org/wiki/Off-by-one_error) — a fencepost bug
committed in furniture, where the attacker extends the array by walking into the room. His ruling
at the time: she'd out-thought him, so it was hers.

Full telling, references, and the show framing:
[TSO stories](../../../repo-shows/luc-barthelet-sims-online/tso-stories.md).

## Where it connects


| This mail                                 | Room it belongs to                                                                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| von Neumann 29-state, `JohnVonNeumann29`  | `[cam6-cellular-automata-machine.md](../cam6-cellular-automata-machine.md)` · `[cam-construction-set.md](../cam-construction-set.md)`                               |
| OpenLaszlo, constraints, XML data binding | `[garnet-to-svelte-constraint-ui-lineage.md](../garnet-to-svelte-constraint-ui-lineage.md)`                                                                         |
| Pie menus on touch devices                | `[connectedtv-touch-tuning-finger-pies.md](../connectedtv-touch-tuning-finger-pies.md)` · `[ie-jscript-htc-xslt-pie-menus.md](../ie-jscript-htc-xslt-pie-menus.md)` |
| Electronic mirrors, video in the loop     | `[warpomatic-video-background-removal.md](../warpomatic-video-background-removal.md)`                                                                               |
| Narcissus, mirrors, reflection            | `[self-interest-narcissas-mirror-david-ungar.md](../self-interest-narcissas-mirror-david-ungar.md)`                                                                 |
| Driving a Sims game from outside it       | [angel event bus](https://github.com/SimHacker/moollm/blob/main/designs/sim-obliterator/ANGEL-EVENT-BUS.md)                                                         |
| Jim Mackraz, copied                       | `[../../jim-mackraz/README.md](../../jim-mackraz/README.md)`                                                                                                        |




## On-air hooks

- **"I wrote it slow on purpose."** The fast one already existed. Show the OpenLaszlo von
Neumann crawling, and let a viewer watch a 29-state rule actually fire — then name the
C++/SWIG/Python version that does it fast and invisibly. Legibility as an engineering goal
with a receipt.
- **Two hundred tip jars.** The customer walking behind him emptying jars, and the roommate
who parked hers at the end of the line. Then the turn: this is what a rate-limited transfer
primitive does to you, and we hit the same wall moving marriage licenses between lots.
- **The same architecture, twice, one paragraph apart.** Screen-scrape and forge events to
drive an app you cannot modify — proposed as a phone shell, confessed as a money printer.
The angel bus is that idea with the game's consent.
- **Verify your sources.** A published MIT Press history describes Broadwell's piece as
merging visitors' *faces*; the primary sources say posture and force-sensing stools. Good
segment on how a plausible detail migrates between neighboring examples.

