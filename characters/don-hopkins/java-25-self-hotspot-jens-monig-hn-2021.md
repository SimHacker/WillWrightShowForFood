# Sun politics, Self, HotSpot, and a conversation with Jens Mönig (HN, Jan 2021)

**Thread:** [Java 1.0 Turns 25](https://news.ycombinator.com/item?id=25887710) (Jan 2021).

**Context:** **ChuckMcM** (ex-First Person) described Sun defunding First Person in the Feb '95 budget meeting, then everyone claiming credit overnight once Java hit: "a classic accidental disruption." **patrec** marveled that Sun only profited from Java because a manager was nice enough to let it happen.

**Don's comment:** [25888111](https://news.ycombinator.com/item?id=25888111) (5 points) — the same credit-grabbing pattern hit Self and HotSpot, with receipts, ending in a full conversation with **Jens Mönig** (Snap! author) about Morphic, Self, and irony.

---

## The comment

Sun politics, and opportunistic retroactive credit-takers, pfff! The same kind of bullshit happened with Self and HotSpot. Lars Bak developed the JIT compiler for Self at Sun, which they didn't appreciate, so he left for another company, applied his ideas to Java, and they bought his company back, and made HotSpot!

Lars Bak (computer programmer), Wikipedia:

https://en.wikipedia.org/wiki/Lars_Bak_(computer_programmer)

> After participating in the design and implementation of the BETA Mjølner System, in 1991 he joined the Self group at Sun Microsystems Laboratories in Cupertino, California. During his time there, he developed a programming environment for Self and added several enhancements to the virtual machine.
>
> In 1994, he joined LongView Technologies LLC, where he designed and implemented high performance virtual machines for both Smalltalk and Java. After Sun Microsystems acquired LongView in 1997, Bak became engineering manager and technical lead in the HotSpot team at Sun's Java Software Division where he developed a high-performance Java virtual machine.

Java's Forgotten Forebear (2009), IEEE Spectrum, HN discussion:

https://news.ycombinator.com/item?id=18691446

https://spectrum.ieee.org/computing/software/javas-forgotten-forebear

Call with David Ungar (2015), video, HN discussion:

https://news.ycombinator.com/item?id=23800625

https://www.youtube.com/watch?v=8nfrC-YLYqc

From an earlier comment on Lua and the time machine fantasy:

https://news.ycombinator.com/item?id=20377077

> Lua's main problem is that it isn't JavaScript (i.e. in JavaScript's enviably lucky position of ubiquitous dominance).
>
> If I had a time machine, I'd go back and try to convince Netscape to use Lua 2.1 instead of inventing JavaScript (released December 4, 1995). And hire the Self guys (Dave Ungar, Randy Smith and the crew who eventually made the Java HotSpot compiler) away from Sun, and Mike Pall (LuaJIT) from wherever he was!

Lua version history (Lua 2.1 shipped 07 Feb 1995, extensible semantics via fallbacks, OOP support, free for commercial use):

https://www.lua.org/versions.html

---

## The Jens Mönig conversation

Here's some discussion with Jens Mönig about Self's roots and Morphic's evolution, and Lars Bak on JIT compilation.

Jens Mönig (the author of Snap!) talked all about the new version of Snap! and the new HyperBlocks feature (APL like arrays) in the Snap!Con20 Keynote! His delight in programming is so contagious even with social distancing and teleconferencing!

https://www.youtube.com/watch?v=K1qR4vTAw4w

I asked him about the architectural changes, and we discussed them and he sent me this:

**Don:** Hi Jens! I'm catching up with all the work you've done since the Snap 5 release! You've made excellent progress! The problems you had and optimizations you made for Chrome sound interesting! Is there a summary or design document or discussion thread about it that I can read to catch up with it? Watching your Snap!Con20 keynote on Hyperblocks. Your delight in programming is so contagious even with social distancing and teleconferencing!

**Jens:** Thanks, Don! The architectural changes were kinda profound, and I wasn't too eager about them had it not been for Chrome's suckiness. Now I'm really glad that all the work paid off, and Snap! has become much better, more stable and faster on all browsers, especially also on mobile ones. I don't really have a document aside from the short "migration guide" in the Github repo, but that doesn't discuss the architecture. That was a discussion between moi, John Maloney and some others.

**Don:** Was there a Buddha Nature of the changes, or did everything change?

**Jens:** Not everything changed.

**Don:** I find architectural evolutionary stuff fascinating, like watching people solve the trolley problem for sport!

**Jens:** I basically reverted to a Squeak model of display refreshing, instead of pre-rendering and caching every morph in advance. So the changes were mostly "surgical" and only affected parts of the whole thing.

**Don:** Bert's paper about SqueakJS was a delightful mind-blower! His solution to the GC problem!

**Jens:** Now that I mention is, I do have some slides that I drew for SAP management in April that talk about architecture - even though they didn't understand any of it. Let me see whether I still have them...

**Don:** I loved reading the original Self papers back in 91 or so. I was visiting Amsterdam for the first time and had printed them out, and was reading them in a coffeeshop smoking weed. MIND=BLOWN!

**Jens:** [shares slides] Oh, yes the SELF papers were all wonderful, and Bert's / Vanessa's SqueakJS is the most awesome piece of software. Yep, Morphic came all from SELF, that's right. Of course, I first saw it in Squeak, and hated it at first, haha.

**Don:** The self papers just kept piling on layer after layer of amazing stuff: clean model. efficient implementation. jit compiler. but actually debuggable, with dynamic deoptimization! And they made it clear in those papers that those ideas could be applied to other languages, not just Self. They meant Smalltalk but didn't realize that Java would be the main beneficiary soon (then JavaScript).

When I was working for Kaleida and evangelizing ScriptX (like CLOS-y object oriented scheme, kinda like dylan, with a multimedia library), the Python people really annoyed me because they were so smug and happy with their language, and I had a kind of envy for them, clinging to my sinking language. Then I became one of them and it was ok. I still do Python, but it's not my focus now, and I'd start new stuff in JavaScript now.

**Jens:** Yeah, it's somewhat ironic that V8 turned out to be the main beneficiary of Lars Bak's work, not a Smalltalk system, isn't it?

**Don:** Yes, and sadly ironic that David Ungar stayed loyally at Sun while the other guys forked off their own company that got bought by Sun for lots of money, and poor Dave didn't cash in on the reward he deserved. Well maybe ironic is the wrong word, just too bad Sun didn't treat Dave better, for all his work. But leaving a company, doing something cool, then selling it back to the company is a great "we told you so" move!

All those ideas from Self were portable, and migrated out of Self to Java then to JavaScript, and lots of other places too, like LuaJIT! But they called in in the original papers, it was not language specific.

---

## Beats worth lifting

- **The Sun karma pattern, stated twice in one thread:** First Person/Java (ChuckMcM) and Self/HotSpot (Don). Same company, same year, same move.
- **The Lars Bak arc in one sentence:** unappreciated at Sun, leaves, applies Self ideas to Java at LongView, Sun buys him back, HotSpot. Later: V8.
- **The Ungar tragedy:** Dave stayed loyal and never cashed in; the leavers got bought back rich. "A great 'we told you so' move!"
- **The Amsterdam coffeeshop beat:** reading the Self papers in Amsterdam in '91, MIND=BLOWN. First visit to the city Don would later move to.
- **The time machine fantasy:** Netscape ships Lua 2.1, hires the Self team and Mike Pall. No JavaScript.
- **Morphic lineage confirmed by its keeper:** "Yep, Morphic came all from SELF."

## Repo context

| File | Why |
|------|-----|
| [`the-part-where-it-compiles-hn-2026.md`](the-part-where-it-compiles-hn-2026.md) | The Sun karma section draws on this receipt |
| [`self-v8-tom-lord-2006-hn-2022.md`](self-v8-tom-lord-2006-hn-2022.md) | The 2006 Tom Lord conversation, same lineage |
| [`self-interest-narcissas-mirror-david-ungar.md`](self-interest-narcissas-mirror-david-ungar.md) | Dream Repo Show episode with Ungar |
| [`snap-visual-engines-fundable-goals.md`](snap-visual-engines-fundable-goals.md) | Jens Mönig / Snap! connection |
| [`kaleida-scriptx-dreamscape-multimedia-lisp-machine.md`](kaleida-scriptx-dreamscape-multimedia-lisp-machine.md) | The Kaleida/ScriptX sinking-language chapter |
