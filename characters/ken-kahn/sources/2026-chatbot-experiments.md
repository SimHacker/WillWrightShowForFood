# Ken Kahn's 2026 chatbot experiments — public posts and documents

*Ken has been publishing a steady stream of small, complete, documented
AI-collaboration experiments — each one a Learner's Apprentice chapter
happening in public. Collected from his public Facebook posts, Google
Docs, and the published page, July 2026.*

## The centerpiece: two AI-history myths, examined against the record

**The published essay:**
[Two claims, examined against the historical record — "The book that
killed a field, and the rules that were too
brittle"](https://toontalk.github.io/misc/ai-history-two-claims.html)
(toontalk.github.io, July 2026).

**The making-of write-up:**
["Claude, with feedback from ChatGPT, writes a history of
AI"](https://docs.google.com/document/d/1SuekouRgA8NrQMOJdmpfowesV4-qTQxmhOe54aTYyw8/edit)
(July 17, 2026), and the
[shared ChatGPT review session](https://chatgpt.com/share/6a5a4d37-3a00-83eb-9814-c46a9e15d9c9).

Having lived the history first-hand (MIT AI Lab, 1973 onward), Ken aimed
at two misconceptions he'd disliked for decades:

1. That Minsky and Papert's *Perceptrons* (1969) killed neural-network
   funding — some versions say deliberately.
2. That pre-AlexNet AI was dominated by rule-based systems doomed by the
   brittleness of rules — which doesn't match his memory of MIT and Yale
   AI in the 70s and 80s.

**The method is the story.** He prompted **Claude Fable 5** with sources
(Olazaran's sociology-of-science papers, Minsky's 1991 "Logical Versus
Analogical," Minsky's 1995 *Discrete Neural Computation* foreword) and
had it research and write a balanced essay. Then he uploaded the draft to
**ChatGPT 5.6** — "any comments on this? and are the images correct?" —
and carried critique back and forth between the models "until they were
happy with the result."

The exchange, preserved in the share link, is a small masterclass in
adversarial collaboration:

- **ChatGPT's review** found real errors: the spiral figure was
  topologically wrong (two SVG paths whose geometry overlapped — "the
  DOM contains two paths, but the picture does not contain two
  disconnected curves"); "made backprop work at scale in 1986" overstated
  Rumelhart–Hinton–Williams; a bounded-fan-in claim was refuted with the
  parity counterexample; "every neural-network group of the era had
  failed" ignored Ivakhnenko's GMDH; the MIT/Yale framing looked
  cherry-picked next to Stanford/CMU's genuinely rules-heavy tradition.
- **Claude pushed back where the reviewer overreached**: demanded a
  source for ChatGPT's confident left/right attribution of the 1969
  cover ("neither of your two links establishes which side was which");
  defended "~16%" for AlexNet as a hedge between the paper's 15.3% and
  the ILSVRC retrospective's 16.4% (resolution: 15.3% headline, 16.4% in
  a tooltip); traced the bounded-fan-in claim to Minsky's own foreword
  and fixed it by *attribution* rather than deletion; and asked for a
  page reference for the Rosenblatt funding tribute — **which ChatGPT
  produced**: Olazaran 1993, printed page 379, Richard O'Brien,
  "hundreds of thousands of dollars a year."
- **Verdicts that survived:** Claim 1 — "partly true, causally inflated,
  and twice curated" (Olazaran's finding that the official history was
  written twice, once by each round's winners). Claim 2 — "a real
  diagnosis attached to a false history" (two transitions fused: hand-
  authored knowledge → statistical learning c. 1985–95; engineered
  features → learned features, 2012).

**The spiral saga** deserves its own paragraph. The *Perceptrons* cover
shows two spirals — one connected, one not — that no diameter-limited
perceptron can tell apart (and, per David Block's contemporaneous review,
neither can a human at a glance). Both models wrote fluently about *why*
the figure is hard while repeatedly failing to *draw* it: their spirals
were easy for humans to tell apart. ChatGPT finally diagnosed both the
topology (overlapping path segments made the "two" curves one connected
ink-blob) and the *psychology* — Claude kept hiding a break in the outer
windings, where a gap reads instantly as "broken line"; the cover's trick
is that the ambiguity hides in the central entanglement, forcing serial
tracing. ChatGPT shipped a `splitBridge()` code insert putting a 7.5px
gap at the center join. The book's famous unsolvable-for-perceptrons
figure was, for a while, unsolvable for the language models at the
rendering level while they wrote expert prose about its unsolvability.

Ken's reflection: "I think the resulting historical essay is better than
anything I could have created. Perhaps this should not be so surprising
considering how all the sources and many more are in their training
data."

## The others (2026, from his public posts)

- **Word-age fonts:** a browser extension, built easily with Claude, that
  sets the font of each word on a page to match the age of the word.
- **English-rules Lemmings:** a Lemmings-like game where players control
  creatures by entering rules in English — Claude brainstormed and
  implemented; **GPT Codex tested the game and worked with Claude to
  improve it** (agents QA-ing each other's game).
- **NotebookLM artifacts:** over a dozen artifacts from his book in nine
  formats (videos, quizzes, podcasts...).
- **The unicorn app:** a 5-year-old's adventures as a unicorn who meets
  fairies, a mermaid, and "an initially very friendly shark," in an app
  he co-created with Gemini.

## The book behind them

**The Learner's Apprentice: AI and the Amplification of Human
Creativity** — how anyone can use chatbots to co-create apps, adventures,
illustrated stories, and discussions; the experiments above are the
method practiced in public. (Fifty years researching AI, creativity, and
education, starting with his MIT AI Lab PhD.)

## Why the show cares

- The Claude+ChatGPT ping-pong is exactly this repo's production method —
  human as editor-in-chief carrying critique between models, receipts
  kept, disagreements preserved instead of smoothed. And the model that
  wrote Ken's essay is the model that runs this repo's production.
- The Perceptrons historiography connects straight to Marvin Minsky's
  room: Ken was *in the Logo group*, Minsky and Papert reported on his
  committee, and he's publicly correcting the folk history of their most
  notorious book — including Minsky's own too-strong 1995 claim, fixed by
  attribution rather than deletion. Portrayal ethics as citation
  practice.
- Bitic literature, nonfiction register: declared machine-written history
  with a human witness who lived it — the sibling of moollm's
  COVFEFE-FUTURES, and the page ends the way this repo's documents do:
  "Corrections welcome — that is rather the point."
