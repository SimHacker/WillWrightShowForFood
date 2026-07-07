# Alan Kay's Quora corpus (2015–2023) — a navigable index

*Guest hub:* [`../../README.md`](../../README.md) · *Recaps hub:* [`README.md`](README.md)

**What this is:** a **themed map** of Alan Kay's ~**620 public Quora answers** (profile joined Dec 2015;
~21.8K followers; Top Writer 2017 & 2018) — a book-length body of writing on programming, PARC history,
education, media, and music. It is an **index with pointers**, not a copy: the corpus itself stays at the
source below.

**Source & provenance (all public):**
- Alan Kay's Quora profile: <https://www.quora.com/profile/Alan-Kay-11>
- **natecull** downloaded the corpus (through Nov 2023) and archived it as a PDF on the **Internet Archive**:
  [*"Alan Kay Quora 2023 11"*](https://archive.org/details/alan-kay-quora-2023-11) — surfaced via the
  [Malleable Systems Forum thread](https://forum.malleable.systems/t/alan-kays-quora-dialogues-and-the-philosophical-dilemma-of-systems-thinking/173)
  (see [`../discussions/malleable-systems-systems-vs-data.md`](../discussions/malleable-systems-systems-vs-data.md)).
- Don holds a local OCR text of that PDF (`DonHopkins/temp/AlanKeyQuoraArchive.txt`, ~39.7K lines) — **not
  republished here**; this file only catalogs it.

> ⚠️ **OCR caveat.** The archive is machine-OCR'd and noisy (e.g. "Baccus"→Backus, "Al"→AI, garbled math,
> merged/wrapped lines). **Treat question titles below as approximate and verify any quote against the Quora
> source before citing.** Nothing here should be quoted as Kay's exact words without checking the original.

Credit: **Quora** (Alan Kay's answers) and the **Internet Archive** (natecull's capture). Governed by
[`portrayal-standards.md`](../../../../schemas/portrayal-standards.md); represents *about* Alan — no
impersonation, sourced-only quoting.

---

## Themes (with representative real question titles)

### Biography & self
- "Why does Alan Kay call his youth misspent?" · "Why did Alan Kay move to London?" · "Why did you major in
  mathematics?" · "What is Alan Kay's MBTI type?" · "How is the food at CU Boulder?"

### PARC / VPRI — how great research actually worked
- "What was the staff size at Parc?" · "How did Xerox PARC invent the mouse?" · "Why was there a mismatch
  between Xerox management and PARC?" · "What did people at Xerox PARC think of the work Apple was doing?" ·
  "What were interviews like at Xerox PARC?" · "How was version control handled in the early days of PARC?" ·
  "How did Alan Kay recruit and interview his researchers at VPRI?" · "What became of the work done at VPRI?" ·
  "What is the significance of Butler Lampson's work?" *(→ YootTower `People.md`; recap:
  [`parc-vpri-how-research-worked.md`](parc-vpri-how-research-worked.md))*

### Programming-language history
- "What was the historical significance of FORTRAN?" · "What was the world's first high level programming
  language in 1957?" · "Has Lisp ever been implemented iteratively?" · "What caused ADA to be created?" ·
  "Why did Unix succeed and not Multics?" · "Did Alan Kay give advice to Guido van Rossum on … Python?" ·
  "Did Atari use the Forth language …?" · "What is the significance of late binding?"

### OOP, messaging, and "what's next"
- "What did Alan Kay mean by 'I made up the term object-oriented …'?" · "What paradigm is the successor to
  OOP?" · "What is the origin of model-view-controller?" · "What is the idea that is better than semaphores
  from John McCarthy in [the] 60s?" · "What is Alan Kay's opinion on the Akka actor library?" · "How do I
  master the art of Smalltalk?" · "What will happen if one rewrites the entire Linux using Smalltalk?"
  *(→ recap: [`oop-messaging-and-what-comes-next.md`](oop-messaging-and-what-comes-next.md))*

### Sketchpad, GUI & the first personal computer
- "What are some notable reimplementations of SketchPad by Sutherland?" · "What is considered an early version
  of a graphical user interface (GUI)?" · "Who created the first computer with GUI and in which language?" ·
  "What is the history of the first personal computer?" · "What old computers were way ahead of their time?"

### Education, children & learning
- "Do you think that Alan Kay was more focused on children than education? Why?" · "Why is school & college
  the way it is, limiting most children's potential?" · "How does Alan Kay think Ivan Illich performed as a
  problem-finder?" · "Should writing code be fun?" · "Will plain English ever be a programming language, as in
  Star Trek?" · the Dynabook's "teacher for every learner."

### Media, literacy & thinking (McLuhan territory)
- "Why do some media amplify cognition more than others?" · "What was the Whole Earth Catalog?" · "How was
  personal computing influenced by the hippie movement?" · "What is the list of civilization's most 'powerful
  ideas'?" · "Has the real computer revolution happened yet?" · "Should web browsers have stuck to being
  document viewers?" *(→ full recap: [`browsers-documents-news-hypercard-hyperlook.md`](browsers-documents-news-hypercard-hyperlook.md))*
  · *education/literacy recap:* [`computer-revolution-not-yet.md`](computer-revolution-not-yet.md)
  · *HyperCard:* [`hypercard-personal-computing-breakthrough.md`](hypercard-personal-computing-breakthrough.md)

### AI / ML / LLMs (recent)
- questions on copilots & LLMs · "Why is Machine Learning so hard to explain?" · "What does Alan Kay think
  about Douglas Lenat's Cyc?"

### Ada Lovelace, looms & origins
- "What Did Ada Lovelace's Program Actually Do?" · "Is it true that the first computer was a loom? How is a
  loom a computer?"

### Music (his other life)
- questions on harmonics & avoiding drift, transcribing guitar tab from audio, instruments vs "air guitar."

### Life & method
- "What's the point of life?" · "'the best way to predict the future is to invent it'? How can this be applied
  to any field of work?" · "How far and large can we go before … too much abstraction?" (CS-101 answer).

## Mining priorities (what to turn into recaps next)

1. ~~**"Successor to OOP" + "MVC origin" + McCarthy-vs-semaphores**~~ → [`oop-messaging-and-what-comes-next.md`](oop-messaging-and-what-comes-next.md) ✅
2. ~~**PARC/VPRI "how research worked"**~~ → [`parc-vpri-how-research-worked.md`](parc-vpri-how-research-worked.md) ✅
3. **Butler Lampson significance** (long in-progress Quora answer) → fold verified points into YootTower `People.md`; optional short recap
4. ~~**Education cluster** (Illich, school's limits, Dynabook)~~ → [`computer-revolution-not-yet.md`](computer-revolution-not-yet.md) ✅
5. ~~**HyperCard deep dive**~~ → [`hypercard-personal-computing-breakthrough.md`](hypercard-personal-computing-breakthrough.md) ✅ (browsers recap covers NeWS angle)
6. ~~**Douglas Lenat / Cyc**~~ → [`lenat-cyc-knowledge-and-slow-thinking.md`](lenat-cyc-knowledge-and-slow-thinking.md) ✅
7. ~~**LLMs & copilots**~~ → [`llms-copilots-trust-and-teaching.md`](llms-copilots-trust-and-teaching.md) ✅
8. ~~**Public libraries / Carnegie vision**~~ → [`carnegie-libraries-and-literacy-vision.md`](carnegie-libraries-and-literacy-vision.md) ✅
9. ~~**Late binding / rewrite OS / Croquet**~~ → [`late-binding-and-rethinking-the-os.md`](late-binding-and-rethinking-the-os.md) ✅
10. ~~**Butler Lampson** (partial Quora answer)~~ → [`butler-lampson-significance.md`](butler-lampson-significance.md) ✅ + YootTower `People.md`
11. **Programming as interaction** / Teitelman Pilot — Kay points to Warren Teitelman's 1965 DWIM work
    → [`teitelman-dwim-programming-as-interaction.md`](teitelman-dwim-programming-as-interaction.md) ✅
12. **Michael Jackson Problem Frames** — requirements qualitatively better; Kay wants runnable design philosophy
    → partial in [`declarative-whats-vs-hows.md`](declarative-whats-vs-hows.md)
13. **Microworlds libraries** — Kay's "Sure!" + 10 things / 20 examples heuristic
    → [`microworlds-sure-and-ten-things-heuristic.md`](microworlds-sure-and-ten-things-heuristic.md) ✅
14. ~~**Inverse vandalism / media / Engelbart**~~ → [`engelbart-media-inverse-vandalism.md`](engelbart-media-inverse-vandalism.md) ✅
15. ~~**STEPS / Nile / intermodule**~~ → [`steps-nile-runnable-math.md`](steps-nile-runnable-math.md) ✅
16. ~~**Xerox failed myth**~~ → [`xerox-parc-myths-and-exploitation.md`](xerox-parc-myths-and-exploitation.md) ✅
17. **Inheritance in OOP** — Kay's Simula→Smalltalk-72 differential programming; Plato's joints
18. **Smalltalk 50th** — celebrate Ingalls + Thacker; story-form history removes richness
19. **Cloud computing / information utility** — 50s origins, SAGE

*Each recap should quote only after verifying against the Quora original (OCR is unreliable).*
