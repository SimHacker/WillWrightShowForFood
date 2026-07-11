# The Part Where It Compiles — Elk, Guile, the Tcl War, and Sun's Karma (HN, Jul 2026)

**A barnstorming historical tour. Standalone performance piece, built to be read aloud with full conviction.**

Seventy years of Lisp compilation history deployed as a single wall of text, in a thread about Scarf
abandoning Haskell for Python because GHC was too slow for parallel coding agents. Starts as a
correction ("famous Lisp implementations were pure interpreters" — no), becomes a firsthand tour:
Oliver Laumann's Elk and the SPARC register-window continuation horror, Tom Lord and the origins
of Guile, who really posted "Why you should not use Tcl," why Emacs Lisp could never be replaced,
Sun anointing Tcl then Java then getting eaten by JavaScript, Self's three-way trick of simplicity +
performance + debuggability, NASA debugging Lisp on a spacecraft, and the punchline that SBCL's
compiler was named Python before Python was. Lands the plane on the actual thread topic: batch
versus incremental is the real choice, not interpreted versus compiled, and coding agents are just
the newest programmers to want what Lisp hackers always wanted.

Also a tribute to Tom Lord (d. 2022), written to be shareable with his widow.

**Thread:** [After 7 years in production, Scarf has reluctantly moved away from Haskell](https://news.ycombinator.com/item?id=48859673) (Jul 2026).

**Don's comment:** [48870736](https://news.ycombinator.com/item?id=48870736), replying to pjmlp's "Such as?" challenge to antonvs's claim that "some of the most famous implementations were pure interpreters."

---

## Performance notes

- **Register:** archaeologist with receipts. Every wild claim has a primary source on its own line.
- **Arc:** correction → digression → war story → eulogy → karma → thesis. The Tom tribute is the
  emotional floor; the SBCL-Python punchline is the mic drop before the coda.
- **Beats to hit hard aloud:** "Frightening!", "Nobody stays pure.", "JavaScript took the
  prototypes, which were the cheap part", "Theirs emits machine code.", and the closer:
  "It would be a shame if we rediscovered everything except the part where it compiles."
- **Backstory not in the post:** an earlier, shorter version of the opening was flagged and
  deleted; this is the repost, grown into the full tour.

---

## The post (verbatim)

Even Emacs Lisp has had a byte code compiler since forever, and since Emacs 28 it compiles to native machine code via libgccjit.

Toy lisp interpreters are easy and fun and everywhere, often written in lisp itself, but the same books that teach them go on to teach compilers. SICP chapter 4 is the metacircular evaluator, chapter 5 is the compiler. That ordering is the point: interpretation is the pedagogy, compilation is the destination. Lisp was designed to be easy and efficient to compile (so was Self, and that tech lineage runs straight into HotSpot and V8). The archaeology cuts the other way too: the only famous pure interpreter was LISP I on the 704, and within two years Hart and Levin's Lisp 1.5 compiler (1962) became the first self-hosting compiler in any language, written in Lisp, compiling itself. Lisp practically invented compilation as we know it. And today SBCL doesn't even interpret by default: a form typed at the REPL is native code before it runs. Clojure compiles every form to JVM bytecode.

So antonvs, I'd genuinely like to know which famous implementations you mean, because the honest counterexamples aren't the famous Lisps at all. They're the embeddable extension languages, and I can speak to those from direct experience, not just archaeology.

A digression about Elk, since hardly anybody remembers it and Oliver Laumann deserves the recognition. Elk, the Extension Language Kit, was Laumann's Scheme out of TU Berlin, started in 1987 to be the extension language of the ISOTEXT document editor, released to the world in 1989. Its stated goal was "to end the recent proliferation of mutually incompatible Lisp-like extension languages": instead of inventing yet another one, you linked the Scheme interpreter into your C or C++ application and taught it your app's types and primitives. Emacs-style extensibility as a kit, years before Guile existed. And it was a pure interpreter on purpose. Laumann said it plainly in the USENIX paper: performance was "uninspiring (no compiler is available)" and it didn't matter, because any bottleneck got recoded as a C primitive. The compiled half of an Elk system was the application itself. It shipped that way in real products, including the TELES.VISION video conferencing system, which used Elk continuations as its multithreading mechanism. Elk's embedding design went on to inspire other interpreter authors, including Matz for Ruby.

I hacked on Elk back then and wrote the SPARC port, credited in the Elk 1.2 release notes, and it taught me why "just an interpreter" is never just an interpreter. Elk implemented full call/cc the brute force way: capture the registers setjmp-style, then copy the entire live C runtime stack aside onto the heap, Scheme frames, Xt frames, qsort frames and all, and copy it back whenever the continuation is applied. That works on machines where the stack actually lives in memory. On SPARC it does not: the register windows keep the most recent frames cached in the register file, invisible to any memcpy of the stack. So before copying you trap into the kernel to force every window to spill to RAM (ta ST_FLUSH_WINDOWS), grab the stack while it's momentarily telling the truth, and pray it all lines up with the calling conventions when you copy it back so returns don't sail off into the weeds. Frightening! As hairy as anything inside a code generator. The "simple interpreter" strategy relocates the machine-level work, it doesn't remove it: stack layout, register windows, calling conventions, incremental linking against the running executable so compiled C extensions could be loaded into the interpreter, unexec-style dumping of customized interpreters back out as executables. Compiler and linker work in everything but name.

And look what happened to every extension language that survived: Tcl grew a bytecode compiler in 8.0. Emacs Lisp went from bytecode to native code. Guile, after fifteen years as an interpreter, got a compiler in 2.0 and a JIT in 3.0. Interpreters are how these languages are born. Compilers are how they grow up. Even Ousterhout's own student proved it during the Tcl wars: Adam Sah's Berkeley thesis (TC, 1994, first reader John Ousterhout) got 5-10x by caching parsed representations of values, essentially the design Tcl 8.0 later adopted, and his Rush language with Jon Blow (yes, that Jon Blow) compiled a Tcl-feel language to Scheme at 50-300x stock Tcl. RMS cited Rush by name in the GNU extension language announcement. The Rush source is lost now, which is a small tragedy.

Since Guile came up: Guile existed before the Tcl war, not because of it. Tom Lord had already forked Aubrey Jaffer's SCM into an embeddable library at Cygnus in 1993, called it GEL, and talked RMS into blessing it as the official GNU extension language. The rename to Guile came after trademark trouble, partly because it sounds a bit like "Guy L." The war started when Sun swaggeringly declared Tcl would be "the ubiquitous scripting language of the Internet" and a colleague skunked Tom's Scheme-based GDB GUI project with a quick Tcl/Tk one. Tom vented to RMS, and shortly afterward "Why you should not use Tcl" landed on comp.lang.tcl. Who actually wrote and posted it stayed deliberately murky: the Cygnus NNTP server showed it coming from Tom's dormant gnu.org account, some archived messages have RMS in the From line and Tom's signature at the bottom, and Tom would only ever call it a semi-prank by "the Scheme underground."

Why didn't Guile take over the world? Partly because the plan was always grander than the resources: the idea was one Scheme engine executing many surface languages, including a repaired Tcl and eventually Emacs Lisp itself. But Emacs Lisp turned out to be immovable. It isn't just a Lisp, it's a deeply weird Lisp: dynamic scoping by default, buffer-local variables, text properties, semantics tangled into the C core of the editor. There were decades of plans and experiments to put Emacs on Guile, and Guile 2.x even shipped an Elisp compiler on its VM, but the ecosystem never budged, and in the end Emacs went the other way and grew its own native compiler instead. Guile's own arc is instructive: Andy Wingo gave it a real compiler in 2.0, a register VM in 2.2, a native JIT in 3.0, and it found its killer app in Guix. Not the ubiquitous extension language of GNU, but a living vindication of the design argument Tom was making in 1993: a general Scheme engine underneath, other languages and applications on top.

Tom was a good friend of mine. We argued for decades, about Tcl and Tk and everything else, the way you can only argue with someone who has actually built the thing being argued about. He died suddenly in 2022, and the field is short one fiercely original mind. His body of work and his philosophical posts about extension languages, universal engines, and who gets to control the substrate are a rich source of wisdom that hardly anybody mines. His account of the war is him on the page: brilliant, funny, hard on himself, and fair even to the people who did him wrong. Read it, and the detail I love most for this thread: even Tom, patron saint of the embeddable Scheme interpreter, compiled the performance-critical parts of his Scheme editor with the Hobbit compiler. Nobody stays pure.

An Account of the Tcl War, by Thomas Lord:

https://web.archive.org/web/20110102015130/http://basiscraft.com/0800-0100-the-tcl-war.html

Glenn Vanderburg's archive of the original flamewar:

http://vanderburg.org/old_pages/Tcl/war/

Elk: The Extension Language Kit, Laumann and Bormann, USENIX Computing Systems, 1994:

https://www.usenix.org/legacy/publications/compsystems/1994/fall_laumann.pdf

I was on all sides of that war at once. Tom and I had heated arguments because I was shipping on the other side: I ported SimCity to Unix with Tcl/Tk, and Tk was the driving factor, not Tcl (and Tcl's weaknesses were real, and Tom and RMS's arguments against it were largely correct: I used Tcl/Tk extensively and pushed them in ways they were not originally designed to be used; multiplayer Tk was a challenge, I had to fix multi-head bugs in X resource management and Tcl UI menu and other mouse-tracking code, and I built a fully functional multiplayer coordinating voting collaborative game on top of it instead of just getting it to draw googly eyeballs on two screens at once; I am painfully aware their arguments are right).

But having an extension language at all is a higher-order bit than having a perfect one, especially when you are designing a GUI toolkit, whose concerns partially overlap those of an extension language. Look at what the X toolkit intrinsics and the toolkits and window managers built on top of them abused X resources for: stringly typed nano-domain-specific languages and semantics and protocols between differently named resources in the same file. Key and mouse bindings, user configuration, fonts and colors and measurements and dimensions and scales, state machines, commands, preconditions, postconditions, parameter bindings, and and and I could go on forever. All of that is what a real extension language is for. Tk worked so well precisely because a real scripting language (no matter how arguably weak) was part of its design from day one, so it never had to badly reinvent one, which is Greenspun's Tenth Rule, the curse of every extensible app before and since.

And the ecosystem kept proving the point: Python's tkinter still embeds a Tcl interpreter with each Tk root, assembles Tcl/Tk command strings, and passes them through _tkinter to be evaluated, and you can register Python functions as Tcl commands and trampoline back across the boundary (the same class of plumbing obsession as SWIG: who owns the glue, and what shape is the trampoline?). Tk never really grew a clean pluggable "bring your own scripting language" extension point; Perl Tk, Ruby's tk.rb, and the rest generally still talk Tcl to the toolkit. The design win is simpler and more Self-like than that: assume a scripting language, any scripting language, is available at runtime, and the toolkit can stay small and SIMPLE.

Which loops back to one of the greatest pieces of language design literature the Tcl War left behind, one that historians and archaeologists will study for centuries: what even counts as a scripting language? Ousterhout's answer was the system-programming-language versus glue-language split, two languages for a large system, typelessness and strings as the uniform wire format between components.

Scripting: Higher-Level Programming for the 21st Century, John Ousterhout, IEEE Computer, 1998:

https://web.stanford.edu/~ouster/cgi-bin/papers/scripting.pdf

I even demoed multiplayer SimCity to Ousterhout in his office at Berkeley.

And then Sun, having hired Ousterhout and his team, then anointed Tcl the ubiquitous scripting language of the internet, pivoted on a dime to Java, got its lunch eaten by JavaScript, a language whose deepest debt is to Self, which Sun also starved. The Self people who left applied the ideas at Animorphic, got bought back, and built HotSpot. As an OG NeWS developer I know exactly how it feels to be promised the world by Sun and left on the back porch in the rain, so I have nothing but empathy for the Tcl/Tk and Self teams. I've been posting these receipts for a decade:

https://news.ycombinator.com/item?id=28669698

https://news.ycombinator.com/item?id=25888450

And the one I treasure, a conversation I had with Tom in 2006, two years before V8, about running into Dave Ungar and the irony that JavaScript credits Self for its prototypes while missing everything else the paper was actually about. It's right there in the title: "Self: The Power of Simplicity." Simplicity first.

And behind that, the two hard tricks that made the simplicity affordable: compiling a radically dynamic language to fast native code, and keeping it debuggable at the same time. That last one is the sleeper. Anyone can pick two of simplicity, performance, and debuggability. Self's dynamic deoptimization let you debug fully optimized code as if it were running unoptimized, source-level, mid-flight, and that machinery went straight into HotSpot too. JavaScript took the prototypes, which were the cheap part:

Self: The Power of Simplicity, Ungar and Smith, OOPSLA 1987:

https://bibliography.selflanguage.org/_static/self-power.pdf

Debugging Optimized Code with Dynamic Deoptimization, Hölzle, Chambers, and Ungar, PLDI 1992:

https://bibliography.selflanguage.org/_static/dynamic-deoptimization.pdf

https://news.ycombinator.com/item?id=33527618

Which brings this all the way back to Haskell and the article. timcobb joked about being driven "from Haskell to Lisp," but that move would arguably have been more defensible than Python, because the real lesson of seventy years of Lisp is that interpreted versus compiled was never the actual choice. Batch versus incremental is the choice.

andersmurphy and jwr have it exactly right about the REPL. Common Lisp and Smalltalk systems compile one function at a time, to native code, inside the running program, in milliseconds. Avi's headline brag, fixing a bug before the customer hangs up, was routine practice in Lisp shops in the 1980s. NASA once did it to a Lisp system running on a spacecraft a hundred million miles away: the Remote Agent on Deep Space 1 deadlocked in flight, and they diagnosed and fixed it through a REPL running on the spacecraft itself.

Lisping at JPL, Ron Garret's firsthand account of debugging Deep Space 1 in flight:

https://flownet.com/gat/jpl-lisp.html

giraffe_lady named the two axes precisely: speed and accuracy of feedback. GHC gives you accuracy at the price of batch-world speed. Python gives you speed at the price of accuracy. The Lisp lineage, from Hart and Levin through SBCL to the Self-descended JITs your JavaScript runs on today, has been demonstrating for decades that you can have both, if you design the language and the compiler to work incrementally, together, as one live system. And I can't resist pointing out that SBCL's native code compiler is named Python, and carried that name years before Guido picked it for his language. Lisp hackers have been getting sub-second feedback from Python since the 1980s. Theirs emits machine code.

CMU Common Lisp, whose compiler has been named Python since the mid 1980s:

https://en.wikipedia.org/wiki/CMU_Common_Lisp

Oliver Laumann and Tom Lord were exploring exactly these tradeoffs with practical, load-bearing, shipping code while most of the industry wasn't looking. The agents everyone in this thread is arguing about are just the newest programmers to want what Lisp hackers always wanted: a fast, honest conversation with a running system. It would be a shame if we rediscovered everything except the part where it compiles.

---

## Dramatis personae

| Who | Role in the tour |
|-----|------------------|
| Oliver Laumann | Elk author, TU Berlin; pure interpreter on purpose, and honest about it |
| Tom Lord | GEL/Guile creator at Cygnus; Tcl War instigator/casualty; close friend, d. 2022 |
| Adam Sah | Berkeley, TC thesis + Rush (with Jon Blow); proved Tcl could compile, under Ousterhout |
| John Ousterhout | Tcl/Tk creator; got the multiplayer SimCity demo in his Berkeley office |
| RMS | "Why you should not use Tcl" (authorship deliberately murky) |
| Dave Ungar & Randall Smith | Self: simplicity, compilability, debuggability; lineage into HotSpot and V8 |
| Andy Wingo | Guile's compiler/VM/JIT arc, 2.0 through 3.0 |
| Ron Garret | Lisping at JPL; the Deep Space 1 REPL story |
| Hart & Levin | Lisp 1.5 compiler, 1962, first self-hosting compiler in any language |

## Thread map (who got addressed)

| HN user | Their point | How the post answers |
|---------|-------------|----------------------|
| antonvs | "Some of the most famous implementations were pure interpreters" | The famous ones weren't; the honest counterexamples are extension languages, and even those grew compilers |
| pjmlp | "Such as?" (the challenge Don is answering) | Full receipts |
| timcobb | Joked "from Haskell to Lisp" | Would have been more defensible than Python |
| andersmurphy, jwr | Lisp/Clojure REPL feedback loop is the real win | Confirmed and backdated to the 1980s, plus a spacecraft |
| giraffe_lady | LLMs need speed AND accuracy of feedback | Named as the precise formulation of the thesis |

## The thesis, in one breath

Interpreted versus compiled was never the choice. Batch versus incremental is the choice.
Coding agents want what Lisp hackers always wanted: a fast, honest conversation with a running
system. Haskell's problem is not its types, it's its batch architecture. Python's appeal is not
its semantics, it's its loop. Lisp had both, seventy years ago, and the JITs running everyone's
JavaScript are the proof that the lineage won even where the parentheses lost.

## Repo context

| File | Why |
|------|-----|
| [`../tom-lord/self-v8-tom-lord-2006-hn-2022.md`](../tom-lord/self-v8-tom-lord-2006-hn-2022.md) | The treasured 2006 Tom Lord receipt, preserved in full (in Tom's room) |
| [`java-25-self-hotspot-jens-monig-hn-2021.md`](java-25-self-hotspot-jens-monig-hn-2021.md) | Sun karma receipts: Lars Bak, HotSpot, Ungar, Jens Mönig conversation |
| [`ai-slop-radar-transdar-hn-2026.md`](ai-slop-radar-transdar-hn-2026.md) | The perfect-radar reply, adjacent to the flag/repost backstory |
| [`self-interest-narcissas-mirror-david-ungar.md`](self-interest-narcissas-mirror-david-ungar.md) | Ungar/Self connection, the mirror API lineage |
| [`import-self-from-self.md`](import-self-from-self.md) | Self riffs |
| [`hyperlook-news-postscript-simcity.md`](hyperlook-news-postscript-simcity.md) | The SimCity Unix port lineage (NeWS chapter before the Tcl/Tk chapter) |
| [`axis-of-eval-send-code-not-commands.md`](axis-of-eval-send-code-not-commands.md) | Extension language philosophy, NeWS side |
| [`witty-diatribes.yml`](witty-diatribes.yml) | Registered as repertoire piece `the-part-where-it-compiles` |

## Show fodder

- **Cold open:** the SPARC register window story, told with hands. Trap into the kernel, flush the
  windows, steal the stack while it's momentarily telling the truth.
- **The eulogy beat:** Tom's account of the war, read straight. "Nobody stays pure."
- **The karma beat:** Sun anoints Tcl, pivots to Java, JavaScript eats its lunch wearing Self's
  stolen clothes. NeWS developer nods knowingly.
- **The mic drop:** SBCL's compiler is named Python. "Theirs emits machine code."
- **Guest bait:** Dave Ungar (already in the roster orbit), Adam Sah, Andy Wingo, Ron Garret.
- **Tom's room:** [`characters/tom-lord/`](../tom-lord/README.md) — memorial room seeded by this post; dossier at [`the-tcl-war-and-guile.md`](../tom-lord/the-tcl-war-and-guile.md).
