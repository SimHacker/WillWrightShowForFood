# Should web browsers have stuck to being document viewers? — and NeWS, HyperCard, HyperLook

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**Source:** Alan Kay's public **Quora** answer to *"Should web browsers have stuck to being document
viewers?"* and its follow-up discussion.
**Readable reformat:** Don Hopkins, [*"Alan Kay on 'Should web browsers have stuck to being document
viewers?' and a discussion of Smalltalk, HyperCard, NeWS, and HyperLook"*](https://medium.com/@donhopkins/alan-kay-on-should-web-browsers-have-stuck-to-being-document-viewers-and-a-discussion-of-news-5cb92c7b3445)
(Medium, Jan 8, 2023) — which preserves the original Quora links.
**Also drawn from** (all public):
- David S. H. Rosenthal, [*"History Of Window Systems"*](https://blog.dshr.org/2021/03/history-of-window-systems.html)
  (DSHR's Blog, Mar 4 2021) — the primary blog post Don's Medium piece mirrors; quotes Kay's email + comments.
- Liam Proven, [*"How NeWS became yesterday's news in the window system wars"*](https://www.theregister.com/software/2024/07/10/lead-developer-of-original-x-rival-news-looks-at-why-it-died/1190574) (The Register, Jul 10 2024).
- Hacker News thread on the DSHR post ([id 40548500](https://news.ycombinator.com/item?id=40548500)) — Don Hopkins's comments on NeWS≈AJAX, HyperTIES, PIXIE.

**Nature:** This is a **summary** of Alan's public Quora writing and the threaded discussion, with short
**verbatim quotes** in quotation marks; elisions marked `[…]`. It is **not** an edit of his words.
Credit: **Quora** (original answers + comments), **DSHR's Blog**, **The Register**, **Hacker News**. Governed by
[`portrayal-standards.yml`](../../../../schemas/portrayal-standards.yml); Alan may request changes or removal anytime.

---

## The core answer — browsers went the wrong way

Kay's reply flips the question: browsers didn't fail by being *more* than document viewers — they failed by
starting from **too weak a model of "document."**

- "Actually quite the opposite, if 'document' means an imitation of old static text media." Settling for "an
  overly simple text format and formatting scheme — 'for convenience'" pointed "the web media architecture off
  in entirely the wrong direction" — including a reference scheme far weaker than **Engelbart** and **Ted
  Nelson** had already shown. Early-90s web had "the look and feel of an atavistic hack."
- He expected **Netscape** to *fix the architecture*, not just dominate it.
- The tragedy he keeps naming: the web's interactive media has always been "a hefty and qualitative **subset**"
  of the media on the very personal computers running the browser.

## The two recommendations he made at the time (to Apple and the field)

1. **HyperCard should have been the model for the user experience** — scripted, WYSIWYG, and *symmetric*: the
   reader can turn around and author "in the same high-level terms and forms." Build on the Macintosh
   Human-Interface guidelines (credit to **Chris Espinosa** and others).
2. **A browser should be an operating system, not an app** — one whose job is to "protectively and safely run
   encapsulated systems (i.e. 'real objects')" fetched from the web, so content is open-ended (it can even
   bring its own graphics) rather than trapped in the browser's built-in feature subset.

He ties this to the early **Unix** insight: the kernel in supervisor mode should manage only **time**
(scheduling), **space** (memory), and **encapsulation** (processes) — "everything else should be expressible in
the general vanilla processes of the system." Sidebar: **Locus** (Gerry Popek, UCLA, early 80s) let live Unix
processes migrate *across machine types* — Kay tried to get Apple to buy it (~1984); "the powers that be
couldn't see it."

His verdict on today: the Internet forced browsers to become operating systems "but without the design and the
look-aheads that are needed" — a lock-in "hack that grew," measured against **Licklider's vision** that
"the destiny of computing is to become interactive intellectual amplifiers for all humanity pervasively
networked worldwide." That needs *all* media, readable *and* writable, by everyone.

## The big idea: send a program, not a data structure

A **PARC** footnote (prompted by Phillip Remaker) that is the spine of the whole thread:

- Gary Starkweather's **laser printer** needed documents sent to an Alto print server. The first design sent a
  **data structure** — and broke within weeks as new requirements arrived.
- "**Sad realization:** sending a data structure to a server is a terrible idea if the degrees of freedom needed
  on the sending side are large." → "**Happy realization:** sending a *program* to a server is a very good idea"
  — a small universal interpreter has more degrees of freedom than any fixed data structure.
- Warnock & Newell's **JAM** ("John And Martin") — resolution-independent imaging — became **PostScript**.
- "**Key Point: 'sending a program, not a data structure' is a very big idea** (and also scales really well)."

## NeWS — "the right way to go," under-built

Asked about Sun's **Network extensible Window System**, Kay: "I liked NEWS as far as it went. I don't know why
it was so cobbled together — Sun could have done a lot more." The PostScript imaging model was a good base (as
in Gosling's earlier **Andrew** work at CMU), but "PostScript was not well set up to be a general programming
language," and Sun — "very intertwined with university Unix and C" — never made NeWS's high-level part
"high-level enough or comprehensive enough." His concrete counterfactual: **"make a Smalltalk from the 'Blue
Book' and use the PostScript imaging model as a next step for BitBlt."** And: "Hypercard was very much in
evidence… somehow Sun missed its significance."

## Don's thread — HyperLook, PdB→Java, Owen Densmore, PSIBER

Don Hopkins filled in NeWS history Kay hadn't seen:

- **HyperLook** (Arthur van Hoff, Turing Institute): HyperCard reimagined in **NeWS/PostScript** — code,
  graphics, *and* data all PostScript ("the axis of eval") — with HyperCard-style message delegation
  (button→card→background→stack) extended **over the network** to drive **SimCity**, a cellular-automata
  machine, Lisp/Prolog, etc.
- **PdB** (van Hoff): an object-oriented **C→PostScript** compiler; per **Leigh Klotz**, van Hoff then went to
  First Person and wrote a similar compiler for **Oak** — which was renamed **Java**.
- **Owen Densmore**'s `class.ps` — object-oriented PostScript (dictionaries as prototypes, multiple
  inheritance) — was the basis of NeWS's UI toolkit; Warnock called PostScript a **"linguistic motherboard."**
  PostScript descends from **Interpress** (Xerox PARC → Adobe; Geschke & Warnock).
- Don's **PSIBER Space Deck** — a visual PostScript/NeWS debugger in the Smalltalk/ThingLab/Self-Morphic
  spirit.

Kay's reply, kept honest: praise first ("This work is so good — for any time — and especially for its time"),
then, in a *separate* reply, the regret: "your group missed the significance for personal computing of the
design of **Hypertalk** in Hypercard." His case for HyperTalk: "Dan Winkler and Bill Atkinson violated a lot of
important principles of 'good programming language design,' but they achieved the first overall system in which
end-users 'could see their own faces'" — the best end-user programming ever actually shipped to millions. On
HyperLook specifically: "I wish he had done a real **end-user language** for this."

## Window-system history — Kay corrects the record

When David Rosenthal cited the received history, Kay pushed back to the real origins:

- The first *real* windowing system: **Ivan Sutherland's Sketchpad** (~1962) — a virtual "paper" ~⅓ mile a
  side, clipping/zooming/panning in real time; **Sketchpad III** showed four views (front/side/top/3D) of the
  same object, editable from any view — the seed of what Kay's group later called **Model-View-Controller**.
- The **Sutherland–Sproull** paper (~1967, Harvard) generalized windows (incl. 3D) and carried **Danny Cohen's
  midpoint clipping algorithm**. A view had two ends like a telescope: the screen end was the "**viewport**,"
  the virtual-world end was the "**window**" (the names got swapped at PARC while demoing to Xerox execs).
- **Ed Cheadle & Kay's Flex Machine** (1967) also had multiple windows.
- Kay notes **Warren Teitelman's** history is "quite wrong" in its first paragraphs (while crediting Teitelman's
  under-recognized **PILOT** work). This exchange prompted Rosenthal's blog post *"History of Window Systems."*

## SimCity, the Simulator Effect, and constructionism (with Mark Miller)

- Kay's standing critique: **SimCity hides its simulation in a black box** players can't see or change — the
  opposite of a glass-box microworld.
- Don agrees, and reframes the value: **Will Wright's "Simulator Effect"** — players imagine the sim is far
  deeper than it is ("Implication is more efficient than simulation"; a cousin of **apophenia**). Wright
  "designs games to run on two computers at once": the shallow one on the desk and the deep one in the player's
  head.
- The constructive answer: **Micropolis** — SimCity relicensed **GPL** for OLPC and cleaned up by Don — so kids
  can open the box, in the **Papert/Kay constructionist** tradition (then graduate to Logo / a visual language
  and build their own).

## Rosenthal's rebuttal — why X beat NeWS even though NeWS did everything Kay asked

DSHR worked on **both** X (he wrote the ICCCM, holds X patents) and NeWS (with Gosling). His post's punchline:
"NeWS essentially implemented the whole of Kay's recommendations, up to and including HyperCard. And yet it
failed in the marketplace, whereas the X Window System has been an enduring success." Beyond politics, he
argues X won on the merits:

- **X also fits Kay's kernel test.** X only managed time (interleaving), space (virtual framebuffer), and
  encapsulation (windows + cut/paste). Because the framebuffer abstraction meant "the degrees of freedom
  needed on the sending side weren't large," **BitBlt** (+ later alpha) let everything else live in vanilla
  processes — so "X can be viewed as conforming to Kay's recommendations just as NeWS did." The
  send-a-program advantage shrinks when the send-side degrees of freedom are small.
- **PostScript's imaging model assumes high DPI** and hides individual pixels; 80s displays needed that pixel
  control. Display PostScript (NeWS's rendering model without the OS) failed partly for this.
- **NeWS was brutally hard to port.** Rendering PostScript fast enough took "Gosling-level" cycle-counting;
  X only needed BitBlt, which was even amenable to hardware. Plus era-skepticism of interpreters (BASIC,
  UCSD Pascal = slow), and X's familiar single-threaded C vs NeWS's OO, multi-threaded, reverse-polish world.
- **Attack surface.** An "OS" like NeWS has a far larger attack surface than a fixed-function server; X.11
  still shipped security *faux pas*. (Commenter *Blissex2*: "every programmable thingie is a malware vector"
  — echoing jwz — and the "worse is better" argument, Gabriel.)

He also **corrects Kay on a fact**: the **Andrew** window system he and Gosling built at CMU did *not* use
PostScript — the only PostScript they had was the Apple LaserWriter, far too slow for a GUI. Gosling went to
Sun, and only after he showed PostScript rendering "at lightning speed" on a Sun/1 via early **SunDew** did
Rosenthal follow him to build NeWS.

Two gems from the same post: **Owen Densmore (with Rosenthal's help)** turned PostScript's name resolution
into a Smalltalk-like OO environment (threads + GC) — Densmore's 1986 *Object-Oriented Programming in NeWS*
and their 1987 *A User-Interface Toolkit in Object-Oriented PostScript*; and they noticed the **Unix shell's
`PATH` gives the same control as PostScript's dictionaries**, so "in an afternoon" they ported the object
mechanism to the shell — a fully object-oriented shell (US patent 5187786A).

## Kay corrects the record again — the Engelbart display

In the blog comments, "nygeek" credited Engelbart's 1968 demo with a bitmapped display and said PARC built an
"Englebart Terminal" (the Alto). **Kay replied** (quoted with his permission): "The Engelbart display was not
bitmapped — it was a calligraphic (line drawing) display. It had 'panes' but not 'windows' — it especially
didn't have clipping windows. The 'Alto' was not an 'Engelbart terminal' (that was a different project at
Parc). I'm pretty sure that Ivan Sutherland was not present (I was)." He still praised the Engelbart system
as "big and lofty," noting "about half his folks join[ed] Parc in the early 70s." Rosenthal's streams-of-
development sketch (from a /. comment) traces network window systems to **Bob Sproull & Elaine Sonderegger**
at PARC → Andrew, SunDew→NeWS, and W→X.

## The Register's frame, Gosling's second thoughts, and Don's modern proposal

The Register (2024) revisits this via Rosenthal's *"X Window System At 40."* Notes: NeWS (pronounced
"nee-wuz") was Gosling's, "amazing technology," built in the Display-PostScript lineage that NeXTSTEP →
macOS later rode; **chapter 7 of the *Unix Haters' Handbook*** ("The X-Windows Disaster") was compiled by
**Don Hopkins**, who invented pie menus on NeWS and ported SimCity to it. Rosenthal points to Gosling's essay
**"Window System Design: If I had it to do over again in 2002"** — whose conclusion is "much simpler," close
in spirit to **Wayland**. And Don's own modern proposal, quoted by The Register: **"Run a web browser
directly on the hardware as low level as possible, and implement the entire desktop user interface and window
manager in JavaScript, using standard modern web technologies!"** — the send-a-program idea, inverted for the
web era.

## NeWS ≈ a *coherent* AJAX (Don, on Hacker News)

Don's HN comments reframe NeWS as what the web reinvented piecemeal: "NeWS was architecturally similar to
what is now called AJAX, except that NeWS coherently: (1) used PostScript **CODE** instead of JavaScript;
(2) used PostScript **GRAPHICS** instead of DHTML/CSS; (3) used PostScript **DATA** instead of XML/JSON" —
the **axis of eval** (code, graphics, data all one language). Related threads he surfaced:

- **HyperTIES** (HCIL, under **Ben Shneiderman**): the NeWS version was a multimedia hypermedia browser in
  PostScript + FORTH, with an Emacs-MockLisp authoring tool, **pie menus, and embedded interactive PostScript
  "applets" in 1988** — a decade before the web had any of this.
- **Bongo** (Arthur van Hoff): live-editable, dynamically compiled scripts at runtime by calling back into
  the **Java** compiler — the HyperCard-essential feature (edit-while-running) brought to a compiled language.
- **PIXIE** (Cambridge, 1969; Wiseman, **Heinz Lemke**, Hiles): a *networked* graphical UI split across a
  **PDP-7 + Type 340 vector display + light pen** and a **Titan** (Atlas-2 prototype) mainframe — with pie
  menus. Rosenthal was a Cambridge student who used those same machines, so PIXIE plausibly fed forward into
  Andrew, X, and NeWS. (See the repo show [`pixie-pie-menus-pdp7.yml`](../../../../repo-shows/pixie-pie-menus-pdp7.yml).)

## Connects in the repo

- [`../../../don-hopkins/`](../../../don-hopkins/) — the other side of this exchange (NeWS, HyperLook, PSIBER, pie menus, SimCity). HN Mar 2026: [`../../../don-hopkins/hypercard-network-hyperlook-hn-2026.md`](../../../don-hopkins/hypercard-network-hyperlook-hn-2026.md).
- [`../../../arthur-van-hoff/`](../../../arthur-van-hoff/) (HyperLook, PdB→Oak→Java) · [`../../../owen-densmore/`](../../../owen-densmore/) (`class.ps`) · [`../../../james-gosling/`](../../../james-gosling/) & [`../../../david-rosenthal/`](../../../david-rosenthal/) (NeWS authors).
- [`../../../will-wright/`](../../../will-wright/) (Simulator Effect) · [`../../../chaim-gingold/`](../../../chaim-gingold/) (SimCity reverse diagrams, open-sourcing) · [`../../../seymour-papert/`](../../../seymour-papert/) (constructionism).
- [`../../../ben-shneiderman/`](../../../ben-shneiderman/) (HyperTIES / HCIL, direct manipulation) · [`../../../heinz-lemke/`](../../../heinz-lemke/) (PIXIE, 1969 Cambridge).
- Show seeds: [`../../../../repo-shows/james-gosling/`](../../../../repo-shows/james-gosling/) & [`../../../../repo-shows/david-rosenthal/`](../../../../repo-shows/david-rosenthal/) (NeWS / window-system history) · [`../../../../repo-shows/alan-kay-microworld.yml`](../../../../repo-shows/alan-kay-microworld.yml).
