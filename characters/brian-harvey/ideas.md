# Ideas to explore with Brian Harvey 🐢

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Brian's
public work and documented connections to this repository. Things Don would love to follow
**with** Brian Harvey; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent not_yet_asked

## What Brian has done

Brian Harvey (he/him) — UC Berkeley CS educator (Teaching Professor Emeritus), a lifelong force in computer science education. Developed Berkeley Logo, co-developed Snap! (design + documentation) with Jens Mönig, and co-created The Beauty and Joy of Computing (BJC) curriculum with Dan Garcia. Author of *Computer Science Logo Style* (3 vols, MIT Press) and *Simply Scheme* (with Matthew Wright, foreword by Hal Abelson); taught the legendary SICP-based CS 61A. Won the 2024 ACM Karl V. Karlstrom Outstanding Educator Award (with Dan Garcia, for BJC) and Berkeley's Distinguished Teaching Award (1995). BS Math (MIT, 1969), MS CS (Stanford, 1975), PhD Science & Math Education (UC Berkeley, 1985).

## Shared ground

*Topics that connect Brian's work to this repo — public themes and documented threads only.*

- **Pair show with Jens** — Snap! is shared work; Karlstrom citation names Jens as principal developer ([sources/beauty-and-joy-of-computing.yml](sources/beauty-and-joy-of-computing.yml))
- **Micropolis × Snap! (2018)** — Don's thread; Brian looped in Jens ([sources/micropolis-snap-2018.yml](sources/micropolis-snap-2018.yml))
- **Logo → Snap! lineage** — Papert's turtle through Berkeley Logo to BJC; Palm's field notebook names Theo the Logo Turtle
- **Kay's HyperCard bar** — Snap! as end-user programmable media ([from-alan-kay.yml](from-alan-kay.yml))
- **Snap!Con Barcelona / old band** — TurtleStitch, Cynthia Solomon, inclusive constructionism Don witnessed live
- **Open SimCity / Soul City** — making Will's simulator teachable, not sealed

## The hooks

### 1. Show seed: `repo-shows/snap-logo-brian-jens/`

Default interview is the **pair show** — Brian on books + pedagogy, Jens on implementation. Optional solo for Brian's books only if depth would dilute the pair episode.

### 2. The books — *CS Logo Style* and *Simply Scheme*

[sources/computer-science-logo-style.yml](sources/computer-science-logo-style.yml) · [sources/simply-scheme.yml](sources/simply-scheme.yml) — three volumes of real CS through Logo; Scheme with Hal Abelson's foreword. What makes a hard idea teachable?

### 3. Berkeley Logo and a lifetime of Logo for learners

[sources/berkeley-logo-and-cs61a.yml](sources/berkeley-logo-and-cs61a.yml) — UCBLogo, CS 61A, the turtle as through-line. Compare with [Palm's Theo sighting](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.md).

### 4. The Beauty and Joy of Computing (BJC)

[sources/beauty-and-joy-of-computing.yml](sources/beauty-and-joy-of-computing.yml) — CSforALL curriculum; 2024 Karlstrom award; 50%+ female enrollment at Berkeley; Spanish edition and BJC Sparks.

### 5. Snap!Con 2025 Karlstrom address — CCUS, not curriculum

[sources/snapcon-2025-karlstrom-address.yml](sources/snapcon-2025-karlstrom-address.yml) — Brian's evening talk (introduced by Jens): Lincoln-Sudbury Computer Center Users Society, no grades, keys to the room, "my friend" naming; curriculum/assessment critique; lambda as Snap! contribution; skeptical take on AI in K-12.

**The standing ask: give us the director's cut.** A 44-minute version was announced alongside
the public recording, and ACM's People of ACM interview cut the dinner-and-California material
("So, I hate the 21st century. Thank you."). The Repo Show has no time slot and no editors —
Brian delivers the 44 minutes, or longer; whatever the talk wants to be.

### 6. Teaching CS 61A and SICP at Berkeley

The legendary course — what Brian kept, translated, and refused to dumb down.

### 7. Snap! design + documentation — pedagogy behind the blocks

Why first-class everything matters for *beginners*. Pair beat: Brian explains *why*, Jens shows *how* (Y combinator live). Brian's own claim: **anonymous procedures (lambda)** are his main Snap! code contribution.

### 8. Micropolis × Snap! in the classroom

[sources/micropolis-snap-2018.yml](sources/micropolis-snap-2018.yml) — finish the 2018 thread: open SimCity + CAM6 CA rules from blocks. Soul City meets BJC.

### 9. Kay's criterion — HyperCard second pass with Snap!

[from-alan-kay.yml](from-alan-kay.yml) — end-user programmable media with a live system underneath; Brian's line as Kay's constructionist answer.

### 10. Snap!Con Barcelona — constructionism for real

TurtleStitch, Cynthia Solomon, kids of every background coding and sewing with zero self-consciousness. Not a slogan — a room Don was in.

### 11. Every kid needs a "me teacher" — grades vs friendship

From the Karlstrom Q&A: institutions conspire against teacher-student friendship; one caring connection can change a kid's trajectory. Martin Buber; Dan Garcia on decals and after-school clubs as partial heirs to CCUS.

### 12. ACM Machinery vs HCIL Human — who goes first in the acronym

[sources/snapcon-2025-karlstrom-address.yml](sources/snapcon-2025-karlstrom-address.yml) · [../ben-shneiderman/sources/hcil-human-first-naming.yml](../ben-shneiderman/sources/hcil-human-first-naming.yml) — Brian notes ACM's embarrassment that **Machinery** centers machines; Shneiderman insisted **Human**-Computer Interaction (HCIL not CHIL) while ACM chose computer-first **CHI** for pronounceability. Don's orbit: CHI'88 at HCIL.

### 13. Logo → Scheme → Smalltalk → Snap! — tell it once, together

The heritage episode. Optional cold open: Berkeley Logo turtle next to Snap! blocks next to Micropolis zoning.

### 14. Dynamic binding — Brian's controversial Logo position vs Snap! lexical scope

[sources/snap-macros-metaprogramming.yml](sources/snap-macros-metaprogramming.yml) (`dynamic_binding_and_scope`) — Brian **for** dynamic binding for kids (Logo MAP/?, REPL debugging, one-off helpers); Jens **against** (interchangeable blocks, interpreter cost). Snap! ships lexical + rings + `of` + debug exception — no fluid-let, hybrid scope, or DYNAMIC VARIABLES primitive. Palm asks for/against on air: RISC primitive or Rube Goldberg?

### 15. Rings as quote, AST metaprogramming, and Lisp-family macros

[sources/snap-macros-metaprogramming.yml](sources/snap-macros-metaprogramming.yml) — gray rings = visible `quote`; Ch. 11 `split`/`join`/`define` (v8+) = blocks as syntax trees; macros follow Lisp tradition (unevaluated inputs, expand in caller) — not C `#define` — but hygiene and the block-editor macro checkbox are unfinished. Brian's FEXPR-first pedagogy vs Racket hygiene; honest SICP scorecard for HN accuracy. **Palm's audience questions:** [questions.md (readable)](../../repo-shows/snap-logo-brian-jens/audience/palm/questions.md) · [questions.yml (SSOT)](../../repo-shows/snap-logo-brian-jens/audience/palm/questions.yml).

## Audience questions (planted)

Palm (and Don on air) can pose questions from the pair-show TicketPR tree — rings, macros, Theo turtle, Micropolis beat:

- [../../repo-shows/snap-logo-brian-jens/audience/palm/questions.md](../../repo-shows/snap-logo-brian-jens/audience/palm/questions.md) — readable; [YAML SSOT](../../repo-shows/snap-logo-brian-jens/audience/palm/questions.yml)
- Digest for guests: [sources/snap-macros-metaprogramming.yml](sources/snap-macros-metaprogramming.yml)

## Sources (public + documented threads)

- [`invitation.md`](invitation.md)
- [`sources/README.md`](sources/README.md)
- [`correspondence.yml`](correspondence.yml)
- Show seed: [`repo-shows/snap-logo-brian-jens/`](../../repo-shows/snap-logo-brian-jens/)
- [`CHARACTER.yml`](CHARACTER.yml)
- [Palm's field notebook](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/palm-on-worms-fieldnotes.md)

