# Ideas to explore with Alan Kay 👤

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Alan's
public work and a long documented exchange. Things Don would love to follow **with** Alan;
not quotes, not claims about what he thinks.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest

## What Alan has done

**Alan Kay** — computing visionary: Smalltalk, the Dynabook, personal computing, and
constructionist microworlds. Widely attributed: "the best way to predict the future is to
invent it." Learning-research tradition connecting PARC to OLPC, Etoys, and Snap!.

## Shared ground

Don and Alan have been in correspondence since at least **2008** (Don visited **Qwaq**, the
Croquet spinoff, at Alan's invitation). The threads are not one project — they are a steady
back-and-forth on **live object systems**, **direct manipulation**, and **what "finished"
software gets wrong**. Alan introduced Don to **Dan Ingalls** via the **Fabrik** paper (2018),
connecting pop-up menus to Don's pie menus. Alan reviewed the **Yoot Saito 1993 interview**
transcript (Engelbart demo, PARC, Flex Machine). Recent notes include **MOOLLM** (Jan 2026)
and Alan's public framing of NeWS and HyperCard as almost-right systems that missed the
**live system underneath**. See [`correspondence.yml`](correspondence.yml) for the public-safe digest.

## The hooks

### 1. Microworlds and constructionism — the Repo Show thesis
Alan Kay's lifelong argument: powerful ideas belong in **learner's microworlds**, not black-box
apps. Walk [`repo-shows/alan-kay-microworld/README.md`](../../repo-shows/alan-kay-microworld/README.md) and
build a glass-box segment live — SimCity, Snap!, CAM6 as examples, not sermons.

Kay's **"Sure!"** + **10 things / 20 examples** protocol for microworld libraries — compare Don's
**HAR 2009 Micropolis lightning talk** (constructionist open-source SimCity pitch) and ask Alan if
that's what he means:
[`media/quora-recaps/microworlds-sure-and-ten-things-heuristic.md`](media/quora-recaps/microworlds-sure-and-ten-things-heuristic.md#repo-show-connection--har-2009-micropolis-lightning-talk-dons-guess).
Transcript: [Medium](https://donhopkins.medium.com/har-2009-lightning-talk-transcript-constructionist-educational-open-source-simcity-by-don-3a9e010bf305).

### 2. Pie menus ↔ Fabrik "swiped pie menus"
Alan recalled gesture menus in **Fabrik** (~1986 Apple). Don's pie menus (1986 UMD → CHI '88).
A direct-manipulation archaeology segment with **Dan Ingalls** as the natural co-guest.

### 3. "The live system underneath" — NeWS, HyperCard, MOOLLM
Alan praised NeWS as "the right way to go (except it missed the live system underneath)" and
HyperCard as "finished, smoothed, documented beautifully." What would the **live** layer look
like now? MOOLLM as a Smalltalk-lineage experiment — directory-as-object, skills as prototypes.

**The Korz corollary — views as the HyperCard layer.** Ungar's Korz paper declines to reify
COP's layers in the language: the sea of slots stays minimal, and *the IDE regroups slots into
whatever views the user needs* — the same move Self made when objects absorbed instance and
class and the environment restored the abstractions. A layer becomes a **saved, composable,
shareable view** over a slot soup, with two-way traffic (edits flow back through the view into
the model — HyperCard cards, Morphic, Self 4.0 outliners). ASK Alan: is a user-composable,
bidirectional view layer over a minimal live model *the* missing HyperCard layer he keeps
pointing at? MOOLLM's answer is that the LLM is that layer — views are conversational
projections, materialized on request, and writable. Worked notes:
[Ungar korz-notes](../david-ungar/korz/korz-notes.md), [Korz′](../david-ungar/korz/design.md).

### 4. PIXIE and halos — light-pen menus before the mouse won
**PIXIE** (Engelbart-era light pen, down-facing display sketch) and Smalltalk **halos**
(Ted Kaehler, ~PARC). Preservation thread with **Douglas Engelbart** memorial mode and
[`media/from-mail/`](media/from-mail/) artifacts.

### 5. Yoot Saito × Alan Kay × Engelbart — the 1993 interview on air
Yoot interviewed Alan in Japan for the 25th anniversary of the **1968 demo**. Don OCR-restored
the transcript; Alan reviewed names and timeline. Pair with **Yoot Saito** and screen the
[**published companion**](https://github.com/YootTowerManagement/YootTower/tree/main/Yoot_Saito_Alan_Kay_Interview).

### 6. OLPC SimCity — constructionist response to black-box criticism
Alan encouraged open, explorable SimCity for children. Don shipped OLPC/Micropolis work.
Honest post-mortem: what worked, what EA/licensing constrained, what a **2026 glass-box** sim
should expose (rules, data, runbooks — not just prettier UI).

### 7. Aggregating Alan Kay's writing
Alan has asked collaborators to help **collate his essays and talks**. The repo as a durable,
credited anthology — not a scraper, a **curated microworld** others can extend.

### 8. Wooden Dynabook and physical computing history
Photos in [`media/from-mail/`](media/from-mail/) — Alan's wooden Dynabook model and related
artifacts. Material culture of "a computer for children of all ages."

## More hooks — from Alan's Quora threads (credit Quora)

*Grounded in the recap [`media/quora-recaps/browsers-documents-news-hypercard-hyperlook.md`](media/quora-recaps/browsers-documents-news-hypercard-hyperlook.md)
(Alan's public Quora answer + the discussion Don had with him). Topics Don would follow **with** Alan.*

### 9. "Send a program, not a data structure" — the browser that should have been an OS
Alan's PARC laser-printer story (data structure broke in weeks → send a *program* → JAM → PostScript)
and his claim that a browser should be an **OS that safely runs encapsulated real objects**, not an app.
Live segment: drive something over a socket the HyperLook/NeWS way (delegation over the network) and
contrast it with today's browser lock-in. Co-guests: **James Gosling**, **David Rosenthal**, **Owen Densmore**.

### 10. HyperTalk's real lesson — "end-users could see their own faces"
Alan's regret in the thread: the NeWS/HyperLook crowd "missed the significance … of Hypertalk." His test
for end-user programming is that a reader can turn around and author *in the same terms*. What does a
**second pass** after HyperCard + Etoys look like in 2026? Pair with **Bill Atkinson** (memorial mode) and
**Jens Mönig / Brian Harvey** (Snap! as a living answer).

### 11. Who really invented windows — correcting the record
Alan traces windowing to **Sutherland's Sketchpad (~1962)**, Sketchpad III's four synchronized views,
the **Sutherland–Sproull** paper (~1967, Danny Cohen's midpoint clip), and the **Flex Machine** (Cheadle
& Kay, 1967) — the seed of **MVC** — and flags Teitelman's history as "quite wrong" up front. A
history-restoration segment with **David Rosenthal** (whose blog post grew out of this exchange).

### 12. Glass-box vs black-box simulation — SimCity and the Simulator Effect
Alan's standing critique that SimCity hides its model in a black box, vs Don's reframe via Will Wright's
**Simulator Effect** ("implication is more efficient than simulation") and **Micropolis** as the
constructionist answer. Co-guests: **Will Wright**, **Chaim Gingold**, **Seymour Papert** (memorial).

### 13. "Systems vs. data structures" — messaging, relations, and a hostile Internet
The **Malleable Systems Forum** debated Kay's "computing is about systems, not algorithms/data structures"
and pushed back: on today's hostile net, live systems are hard to make safe, and OOP's "data belongs to its
class" curdled into "data belongs to a corporation." But Kay himself now calls Sketchpad-style
**requirements/constraint programming "relational rather than message-based"** — a live wire for MOOLLM. Full
recap + questions: [`media/discussions/malleable-systems-systems-vs-data.md`](media/discussions/malleable-systems-systems-vs-data.md).
Co-guests: **David Ungar** (Self/live objects), **Dave Ackley** (robust-first), **Richard Stallman** (user control).

### 14. "The successor to OOP" — messaging, relations, and John McCarthy's better-than-semaphores idea
Three Quora threads rhyme: *"What paradigm is the successor to OOP?"*, *"What is the origin of
model-view-controller?"*, and *"What is the idea that is better than semaphores from John McCarthy in the 60s?"*
Together they set up Alan's own move from "the big idea is messaging" toward **relational/requirements-based**
programming. Live segment: build a tiny relational microworld and ask which of MVC, messaging, and constraints
is really the primitive. Co-guests: **David Ungar**, **natecull** (Malleable Systems). Corpus map:
[`media/quora-recaps/quora-corpus-2023-index.md`](media/quora-recaps/quora-corpus-2023-index.md).

**New live wire:** [Palm's *Running on Wetware*](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/running-on-wetware.md) applies "the big
idea is messaging" to minds: humans serialize thoughts as text, LLMs remotely simulate the sender;
LLM characters serialize souls as YAML, wetware simulates them back — a **symmetric asynchronous
RPC** with the repo as message bus. Cells and membranes, opaque interiors, one protocol. Ask Alan:
is a mind-to-mind exchange over git the messaging he meant — and does the simulation on each end
change the semantics of the message?

### 15. "How great research actually worked" — PARC/VPRI as a fundable model
A whole cluster in the corpus: *"What was the staff size at Parc?"*, *"What were interviews like at Xerox
PARC?"*, *"Why was there a mismatch between Xerox management and PARC?"*, *"How did Alan Kay recruit and
interview his researchers at VPRI?"*, *"What became of the work done at VPRI?"*, and why VPRI systems stayed
closed-source. A process episode: how you fund and staff a lab that produces the future, and what kills it.

### 16. The education/media spine — Illich, "misspent youth," Whole Earth, "the revolution hasn't happened"
The corpus keeps circling literacy: *"Why is school & college the way it is, limiting most children's
potential?"*, *"How does Alan Kay think Ivan Illich performed as a problem-finder?"*, *"What was the Whole Earth
Catalog?"*, *"Has the real computer revolution happened yet?"* This is the through-line to the kids-reading
performance idea and constructionism. Co-guests: **Seymour Papert** (memorial), **Cynthia Solomon**, **Walter
Bender**, **Jens Mönig / Brian Harvey**.

### 17. MOOLLM × trust × teaching — is this what you meant?

Kay's Quora answer: copilots for teaching programming — **not a good idea at all**; trust, NCANIPs, correlation
as superstition; need expert systems + special humans + grounded knowledge. We built **MOOLLM** as a microworld
OS (not a copilot) and wrote a **full draft artifact** — our question, guess, architecture, show segments,
and the lead question to ask Alan on air:

**[`moollm-trust-and-teaching-guess.md`](moollm-trust-and-teaching-guess.md)** (canonical)

Quora source recap: [`media/quora-recaps/llms-copilots-trust-and-teaching.md`](media/quora-recaps/llms-copilots-trust-and-teaching.md).

Live segment: side-by-side — LLM explanation vs learner mutates inspectable state vs **kids-reading** a primary
source. Pair **Lenat/Cyc** thread · **Carnegie literacy** hook (#18) · **Dan Ingalls** (Etoys) · **Brian Harvey /
Jens Mönig** (Snap!).

### 18. Carnegie libraries — the two rooms the web forgot
ARPA-PARC wanted to extend **Carnegie's children's room + reading room**, not imitate books on screens. Web =
**"context of no context."** Semi-AI's first job should be **free learn-to-read**. MOOLLM / microworlds as
modern rooms? Recap: [`carnegie-libraries-and-literacy-vision.md`](media/quora-recaps/carnegie-libraries-and-literacy-vision.md).

### 19. Late binding all the way down — Croquet as the OS the Internet deserved
Not "Linux in Smalltalk" but **Reed's whole-Internet OS**, **Croquet**, tiny kernels, **LINDA** inter-module
language, **CYC-about-systems** for dependencies. Recap:
[`late-binding-and-rethinking-the-os.md`](media/quora-recaps/late-binding-and-rethinking-the-os.md). Co-guests:
**Dave Reed**, **Dan Ingalls**, **David Rosenthal**.

### 20. Teitelman's DWIM — UNDO, Advice Taker, and the UI canon before PARC
Warren Teitelman **Pilot** thesis, **DWIM**, deepest early **UNDO** — Petricek's "programming as interaction"
was already in Smalltalk *and* earlier in Teitelman's Lisp. UI reading list: JOSS → Sketchpad → GRAIL → DWIM →
PARC → HyperCard. Recap: [`teitelman-dwim-programming-as-interaction.md`](media/quora-recaps/teitelman-dwim-programming-as-interaction.md).

### 21. Nile / STEPS — 500 lines that replace 100,000
**Dan Amelang's Nile** (runnable math): all 2.5D PC graphics in ~500 lines vs. 50K–100K C++. Open intermodule
problem: **Kaehler method finder**, Lenat **AM**, **LINDA**. MOOLLM hook. Recap:
[`steps-nile-runnable-math.md`](media/quora-recaps/steps-nile-runnable-math.md).

### 22. Engelbart didn't happen — and the web isn't fixing it
Augmentation ≠ tool; collective IQ; Berners-Lee's apology; **inverse vandalism** and media that redefine normal
lower. Same wound as "what happened to Engelbart's goals?" Recap:
[`engelbart-media-inverse-vandalism.md`](media/quora-recaps/engelbart-media-inverse-vandalism.md).

### 23. Watchers, Morphic, and the unsolved inverter (HN 2015)
Post-PARC UI: **views as watchers** (non-mutating), input watchers, **projection** without a satisfactory
automatic **inverter**; Morphic vs MVC; HyperCard as ad hoc view composer; direct manipulation (Shneiderman).
Don↔Alan email on HN. Discussion:
[`media/discussions/hn-mvc-morphic-watchers-2015.md`](media/discussions/hn-mvc-morphic-watchers-2015.md).

### 24. White space, gutter, two computers — Lenat × McCloud × Will
Lenat: automate encyclopedia **white space**, not all the words. LLMs did the opposite. Same architecture as
**McCloud closure** (gutter between frames) and Will's **two computers** (1996 Winograd talk) — sparse
download into commonsense-saturated audience who completes the simulation. Tie to MOOLLM + Kay trust critique:
[`media/quora-recaps/lenat-cyc-knowledge-and-slow-thinking.md`](media/quora-recaps/lenat-cyc-knowledge-and-slow-thinking.md#repo-show-connection--white-space-gutter-two-computers-dons-guess).
Co-guests: **Scott McCloud** · **Will Wright** · **Ken Kahn** (Cyc comment Kay copied).

## Open questions to ask Alan (from the Quora threads)

*Real questions, not claims — credit **Quora**.*

- If a browser had been built as an **OS for encapsulated real objects** (not an app), what's the smallest
  kernel — time, space, encapsulation — you'd insist on, and where would today's web still fit?
- You called "**send a program, not a data structure**" a very big idea that scales. Where do LLM
  tool-calling / prompt protocols repeat the *data-structure* mistake?
- Was **Locus** (process migration across machine types) the missed fork of the Internet — and what would a
  modern Locus + end-user language look like?
- What would a **"Smalltalk from the Blue Book" on the PostScript imaging model** — the NeWS you said Sun
  should have built — have changed?
- After HyperCard and Etoys, what's the **third system** where end-users "see their own faces"? Must it even
  resemble HyperTalk?
- Which "quite wrong" bit of the **received window-system history** most needs correcting for people learning
  this today?
- Rosenthal argues **X also fits your kernel test** — the framebuffer kept the send-side degrees of freedom
  small, so BitBlt sufficed. Does "send a program" only pay off once the send-side freedoms are large, and
  where's that line for the *web*?
- If NeWS "essentially implemented the whole of your recommendations, up to HyperCard," and still lost to X —
  is **"worse is better"** a law, or a failure we keep choosing? (Security/attack-surface included.)
- **HyperCard's >4M scripts** — any surviving user corpus worth mining for what end-users actually wanted?
  ([`hypercard-personal-computing-breakthrough.md`](media/quora-recaps/hypercard-personal-computing-breakthrough.md))
- Could **"100 of anything"** (100 Altos, 100 Ethernet taps) work without a laser-printer profit center?
  ([`parc-vpri-how-research-worked.md`](media/quora-recaps/parc-vpri-how-research-worked.md))
- **VPRI closed source** — necessary for non-incremental research, or a regret?
- Is **pseudotime/fluents** (McCarthy) the missing half of actor/message systems on a hostile net?
  ([`oop-messaging-and-what-comes-next.md`](media/quora-recaps/oop-messaging-and-what-comes-next.md))
- What would a **satisfactory automatic inverter** for view projection look like — and why has it stayed
  experimental? ([`media/discussions/hn-mvc-morphic-watchers-2015.md`](media/discussions/hn-mvc-morphic-watchers-2015.md))
- Are **watchers** the post-MVC replacement for controllers, or a different axis entirely?
  ([`media/discussions/hn-mvc-morphic-watchers-2015.md`](media/discussions/hn-mvc-morphic-watchers-2015.md))
- **Illich + microworlds** — is deschooling incomplete without Etoys/Snap!-class positive models?
  ([`computer-revolution-not-yet.md`](media/quora-recaps/computer-revolution-not-yet.md))
- Do **LLMs** make pop culture's "can't see systems for the bits" worse — or force a literacy crisis?
- Should the **first funded AI application** be a free learn-to-read system — not copilots for coders?
  ([`carnegie-libraries-and-literacy-vision.md`](media/quora-recaps/carnegie-libraries-and-literacy-vision.md))
- **ML + Cyc-style symbolic** — enough for trustworthy tools, or still missing **pseudotime**?
  ([`lenat-cyc-knowledge-and-slow-thinking.md`](media/quora-recaps/lenat-cyc-knowledge-and-slow-thinking.md))
- **MOOLLM × trust × teaching** — is a microworld OS what you meant by an expert teaching system, or still
  a copilot in disguise? Full draft: [`moollm-trust-and-teaching-guess.md`](moollm-trust-and-teaching-guess.md).
  Quora source: [`llms-copilots-trust-and-teaching.md`](media/quora-recaps/llms-copilots-trust-and-teaching.md).
- **Kids-reading** primary sources vs LLM summaries — does oral performance restore trust Harari says language
  lost?
- Will you finish the **Butler Lampson Quora answer** — or is YootTower `People.md` the continuation?
- What are **MOOLLM's 10 things and 20 examples** for microworlds?
  ([`microworlds-sure-and-ten-things-heuristic.md`](media/quora-recaps/microworlds-sure-and-ten-things-heuristic.md))
- **Nile** for Micropolis — could city simulation live in 500 lines of runnable math?
- **Teitelman's DWIM** — should skills/MOOLLM "Do What I Mean" or stay explicit?
- Is the **Xerox got nothing** myth still blocking funding for PARC-style labs?

## Attribution hunt: who coined the "butterfly" outliner?

*A memory question, not a claim — Don's recollection, flagged as unverified.*

Don recalls first hearing "butterfly" for the two-winged outline view — incoming
links fanning left, outgoing right — in an **email from Alan saying how much he
liked it**. The published Butterfly is Mackinlay/Rao/Card's citation browser
(PARC, CHI '95), and Don's own 2007 OLPC post credits **Steve Strassmann** with
"butterfly diagrams" in Mac Common Lisp or Dylan
([source](../will-wright/sources/2007-11-16-olpc-visual-programming-psiber/article.md));
his MediaFlow design comments call for a general "butterfly editor" instead of a
tree editor ([source](../don-hopkins/mediaflow-design-comments.md)). Was the
coiner someone at PARC or MIT? Does Alan remember the email, the term, or the
tool? (Brian Silverman's room holds the other open flag — a possible
butterfly-shaped outliner in the Logo world, unverified.) The full lineage lives
in MOOLLM's [HALLS-AND-ROOMS.md](https://github.com/SimHacker/moollm/blob/main/skills/mind-mirror/HALLS-AND-ROOMS.md).

## Sources (public)

- [`CHARACTER.yml`](CHARACTER.yml) · [`README.md`](README.md)
- [`correspondence.yml`](correspondence.yml) · [`invitation.md`](invitation.md)
- HN reviewed IDs: [`../../process/hn-harvest/alan-kay.md`](../../process/hn-harvest/alan-kay.md)
- **MOOLLM × trust × teaching (draft artifact):** [`moollm-trust-and-teaching-guess.md`](moollm-trust-and-teaching-guess.md)
- **Kay on people in characters/**: [`people-index.yml`](people-index.yml) — per-guest [`../<slug>/from-alan-kay.yml`](../dan-ingalls/from-alan-kay.yml)
- **Quora corpus map** (~620 answers): [`media/quora-recaps/quora-corpus-2023-index.md`](media/quora-recaps/quora-corpus-2023-index.md) — [archive.org/details/alan-kay-quora-2023-11](https://archive.org/details/alan-kay-quora-2023-11)
- Quora recaps: [`media/quora-recaps/README.md`](media/quora-recaps/README.md) — **17 summaries** (see hub table)
- Discussion: [`media/discussions/malleable-systems-systems-vs-data.md`](media/discussions/malleable-systems-systems-vs-data.md) (Malleable Systems Forum — systems vs. data structures)
- HN (2015): [`media/discussions/hn-mvc-morphic-watchers-2015.md`](media/discussions/hn-mvc-morphic-watchers-2015.md) — [Don↔Alan on MVC/Morphic/watchers](https://news.ycombinator.com/item?id=8841428)
- Show seed: [`repo-shows/alan-kay-microworld/README.md`](../../repo-shows/alan-kay-microworld/README.md)
- [`media/from-mail/MANIFEST.yml`](media/from-mail/MANIFEST.yml)
- Yoot interview (OCR-restored): [YootTower repo](https://github.com/YootTowerManagement/YootTower/tree/main/Yoot_Saito_Alan_Kay_Interview)
