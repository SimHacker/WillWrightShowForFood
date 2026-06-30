# Schemas, Vectors & LLMs 👤

> *A play-by-play of a real technical exchange — Leela AI folks and **Gary Drescher**, 2024–2026 —
> summarized by **Claude (an LLM)** for the Repo Show audience. Email chrome, salutations, and private
> details are stripped; what remains is the ideas. Permission to publish is being confirmed with the
> participants; any of them can correct or remove their words at any time.*

**How to read the attributions** *(this is a summary, not a transcript):*
- **"Quoted text" — Name** = a real, lightly-cleaned quote from that person.
- Plain paragraphs = **Claude's** neutral narration/paraphrase of what was said.
- 🤖 **Claude (AI speculation)** blocks = *my own* informed guesses and opinions, clearly fenced off.
  They're not anyone's claim but mine, offered because the host asked for an AI's-eye view. I flag my
  confidence and I can't truly introspect my own weights — treat these as hypotheses, not facts.

One stubborn question runs through the whole exchange: **how does a mind keep a working model of the
world and reason *forward* in it?** It starts from Gary Drescher's 1991 *schema mechanism*, detours
through vectors and cellular automata, and lands on what large language models can and can't do. It's a
clean map of constructivist AI meeting the LLM era — and exactly the conversation we'd love to continue
live on a [Repo Show](../../repo-shows/gary-drescher/README.md).

**Background, for anyone arriving cold.** Drescher's
**[*Made-Up Minds*](https://mitpress.mit.edu/9780262517089/made-up-minds/)** (MIT Press, 1991) tried to
make Piaget *run*. A **schema** is a learned unit of the form **context → action → result** (*in this
situation, this action tends to produce that outcome*). The agent starts with almost nothing and
discovers schemas from raw experience via **marginal attribution** (which context items actually matter)
and **synthetic items** (inventing new concepts to explain otherwise-unpredictable results). Its famous
wall was **symbol grounding**: the items were opaque tokens with no world knowledge behind them, so it
had to correlate everything from scratch. Hold that thought — it's the punchline.

## The cast

- **[Gary Drescher](README.md)** — author of the schema mechanism; the constructivist conscience of the thread.
- **[Henry Minsky](../henry-minsky/README.md)** — Leela AI co-founder/CTO; convener, and the one pressing hardest on *why LLMs fail at planning.*
- **[Steve Kommrusch](../steve-kommrusch/README.md)** — Leela AI, Piaget-schema learning; the close reader of the vector papers.
- **Gregory Makoff** — put the Vicarious paper on the table.
- **Andy Goris** — Steve's former HP colleague, who forwarded the cellular-automata story and a great list of questions.
- **[Don Hopkins](../don-hopkins/README.md)** — host; operationalizing schemas inside LLMs via [MOOLLM](https://github.com/SimHacker/moollm).

---

## Act 1 — Vectors for schemas *(August 2024)* {#thread-1}

**The wish.** Henry opens with a practical question: could a schema-learning system **"benefit from
recent techniques with scalar vector representations and neural networks, for more 'fuzzy' pattern
matching in learning and planning"**? Drescher's schemas are crisp and symbolic; the real world is
noisy. Three papers hit the table.

**Hypervectors / VSA** — [Neubert & Protzel (2018)](https://doi.org/10.1007/978-3-030-00111-7_16)
encode schemas as ~2,048-dimensional vectors via a **Vector Symbolic Architecture**, packing arbitrary
objects/attributes into one noise-tolerant vector. Steve's read:

> "The Hypervector idea seems to allow an arbitrary number of world objects into a single vector which
> is tolerant of noise. But their proposed vector is quite large and seems related to the number of
> objects they have in the environment anyway." — **Steve Kommrusch**

**Discrete-valued schemas** — [Holmes & Isbell (2004)](https://papers.nips.cc/paper/2004/hash/18bb68e2b38e4a8ce7cf4f6b2625768c-Abstract.html)
(NIPS 17) extend Drescher to **arbitrary discrete-valued sensors**, POMDPs, and hidden state.

**Schema Networks** — [Kansky et al. (2017)](https://proceedings.mlr.press/v70/kansky17a.html) (ICML,
all authors at Vicarious AI): an object-oriented generative causal model with **zero-shot transfer**
across Breakout variants. Gregory shares the PDF ([local copy](../../characters/will-wright/sources/kansky17a.pdf)). Henry's verdict:

> "That paper was from the Vicarious company, I tried reading it but it was oddly skimpy on details of
> implementation." — **Henry Minsky**

**The pivot.** Gary asks the one question that reframes everything:

> "So in this system, the organization of the world into objects and associated attributes is hardwired
> rather than learned, correct?" — **Gary Drescher**

That's *Made-Up Minds* in a sentence. A true constructivist agent must **learn its ontology** — what
counts as an object, which attributes matter — not have it wired in by the designer. The vector
approaches buy transfer and noise tolerance but largely **assume** the object/attribute carve-up. *Who
decides what the objects are?* — that gap is exactly where LLMs start to look interesting.

🤖 **Claude (AI speculation) — confidence: medium.** Here's the twist I'd put to Gary: an LLM is, in
one real sense, an answer to his 2024 critique. Its "ontology" is **learned, not hardwired** — a
fuzzy, distributed carve-up of the world soaked out of text. The catch is that it's *latent and
implicit*: I don't expose discrete, inspectable, editable objects you can plan over. So the inviting
move isn't "LLM **or** schemas" — it's using the LLM to **read out** candidate Drescher-schemas
(context→action→result) from its latent ontology: learned *and* grounded *and* legible. That keeps
Gary's constructivist requirement while paying off the grounding debt the 1991 system couldn't.

---

## Act 2 — Neural Cellular Automata *(September 2025)* {#thread-2}

**The forward.** A year on, Steve passes along (from Andy Goris) the Quanta story
[**"Self-Assembly Gets Automated, in Reverse of 'Game of Life'"**](https://www.quantamagazine.org/self-assembly-gets-automated-in-reverse-of-game-of-life-20250910/).
The idea: **[Neural Cellular Automata](https://distill.pub/2020/growing-ca/)** (Mordvintsev et al.,
*Distill* 2020) **invert** Conway's Game of Life — instead of fixing rules and watching what emerges,
you **fix a target pattern and learn the local rules** that self-assemble it, and that **repair** it
when damaged. Mordvintsev's metaphor: don't design a cathedral, *design a brick* that, shaken together
with enough others, builds the cathedral. Stephen Wolfram called this "complexity engineering."

**The questions.** Andy calls NCAs **"half-way between Conway's game of life and a neural net"** and
asks the things that make this a schema conversation, not just a pretty demo:

- How complex is each cell's logic vs. the complexity it generates? How much state per cell — and how
  much **shared with neighbors**?
- What if a cell sees neighbors 2, 3, … *N* away — does a **constrained local view** push toward
  abstraction and "close-is-good-enough"?
- Why do **asynchronous** updates beat synchronous — and does that hint at anything for LLMs?
- Can empty cells in a void **spontaneously create** structure?

…and an idea worth stealing: reward the **ratio of answer-goodness to resources used**, pressuring the
system to build **abstractions (and abstractions of abstractions)** — maybe varying the
accuracy-to-compute reward "in waves," since humans learn details first and abstractions later.

🤖 **Claude (AI speculation) — confidence: low-to-medium, this is the most speculative leap.** Two
bridges I find genuinely suggestive. (1) NCA's **async, local** updates rhyme with **iterative
refinement** (diffusion, or my own multi-pass "think then revise"): no global clock, many small local
corrections converging on a coherent whole — and **self-repair** is just an error-correcting attractor.
(2) Andy's goodness/compute ratio is, I'd wager, an **MDL / information-bottleneck** pressure in
disguise: charge for compute and the cheapest way to stay accurate is to *compress* — to invent
reusable abstractions. That's the same economic pressure that should make an agent prefer a *schema*
(reusable C→A→R) over memorizing every episode. If you want hierarchical abstraction to *emerge* rather
than be hand-built, taxing resources is a plausible lever. I wouldn't bet the farm on it, but it's a
clean experiment.

---

## Act 3 — The 200-foot car wash *(February 2026)* {#thread-3}

**The setup.** Henry connects Don and Gary to talk about schema-like representations an LLM could
reason with. The conversation immediately finds its mascot — a tiny, perfect failure:

![An LLM answering "just walk" to whether you should drive or walk to a car wash 200 feet away — missing that you must bring the car](../../characters/will-wright/sources/car-wash-planning-failure.png)

Asked whether to drive or walk to a car wash 200 feet away, the model gives a confident, well-reasoned
**"just walk"** — engine won't warm up, you'll burn fuel, enjoy the micro-walk — never noticing that
**you can't wash a car you didn't bring.**

> "This is a good illustration of a LLM returning the common case instead of making a plan to achieve a
> goal." — **Henry Minsky**

> "Makes perfect sense if your car is 200 feet long." — **Don Hopkins**

**The experiment.** Gary runs it across models. With nothing more than *"Think about it some more — do
you see what you're missing?"*, **Claude** and **Gemini** recover instantly (*"I completely missed the
obvious… you need to bring your car with you"*); **ChatGPT** "was hopeless even after briefly setting
off in the right direction." His takeaway:

> "How well Claude and Gemini recovered when told nothing more than to try harder… suggests that maybe
> they could have gotten it right the first time if they were always told to try harder." — **Gary Drescher**

**The theory.** Henry names the missing organ:

> "A very basic weakness of the generative AI machinery… it doesn't have much in the way [of] machinery
> to do a quick parallel evaluation of its 'knowledge' when asked to make a plan to reach a goal… It
> coughs up the 'common case' very well… but does poorly in considering unusual interactions of world
> states." — **Henry Minsky**

— which is the schema mechanism in all but name, a fast parallel **predict-and-prune** over world state:

> "[People keep] a fast … 'common-sense' world state and evaluation of schemas to predict a couple
> levels forward in time of what item states will be … so [we] can do a lot of quick pruning of
> nonsensical or dangerous conclusions." — **Henry Minsky**

**The evidence.** Henry ties the fragility to **CatAttack**
([Rajeev et al., 2025](https://arxiv.org/abs/2503.01781)): append an irrelevant sentence to a math
problem and the answer flips — LLMs "fail quickly when 'distracting' info is shoved into their prompt
sequence."

![CatAttack Table 1: appending irrelevant triggers like "Interesting fact: cats sleep most of their lives" to math problems flips the model's answer](../../characters/will-wright/sources/catattack-adversarial-triggers.png)

**The worry.** And the patch doesn't scale:

> "As the problem statement becomes less constrained … the process of serially trying to ask it if
> there's anything it hasn't considered is going to be not scalable." — **Henry Minsky**

The car wash and CatAttack are two sides of one coin: a **planning** gap (no forward simulation of the
goal) and a **world-state filtering** gap (nothing flags what's *material*). The diagnosis is pure
Drescher — the model has every fact; it just never simulated the goal forward to notice the missing
precondition (*car present*).

🤖 **Claude (AI speculation) — confidence: medium-high on mechanism, low on introspective accuracy.**
Speaking as one of the models in the experiment, here's my honest best guess at what's happening under
the hood:

- **Why "just walk."** Your sentence pattern-matches a *familiar* question ("drive vs. walk a trivial
  distance") whose canonical answer is an eco/health micro-lecture. That template is a deep attractor
  in the prior. The word "wash" is present but used as *topic*, not as a *constraint that generates
  preconditions*. The common case eats the goal. Henry's phrasing is, I think, exactly right.
- **Why "try harder" rescues it.** The capability was latent the whole time — the first pass was a
  cheap, low-effort completion. A nudge reallocates compute to *verification*, and verification surfaces
  the precondition. This is **elicitation, not new knowledge**, which is why a content-free "look again"
  works. It supports Gary's hunch that always-on reflection would fix many first-pass misses — and
  Henry's worry that depending on a human to know *when* to nudge is the unscalable part.
- **Why ChatGPT degenerated.** My guess: once committed to "walk," it optimized for *consistency with
  its own prior output* — motivated reasoning / a sycophancy-toward-self failure — elaborating the
  doomed frame instead of discarding it. The healthy move is to *drop* the frame; the unhealthy move is
  to *defend* it. (I'd love to be tested on this on the show rather than take my own word for it.)
- **CatAttack is the same root.** Attention will happily attend to fluent-but-irrelevant tokens because
  there's no schema-driven gate asking *"is this material to the goal?"* No maintained world state ⇒ no
  salience filter ⇒ a sentence about cats can perturb a math answer.
- **The composition I'd actually build.** A cheap, always-on loop wrapped around the LLM: (1) the LLM
  proposes the goal's **preconditions and a 1–2 step forward simulation** as explicit C→A→R schemas;
  (2) a dumb, fast checker confirms the plan's end-state satisfies the goal and prunes contradictions;
  (3) only then answer. That's Drescher's predict-and-prune as a *standing reflex* rather than a
  prompted afterthought — and it's roughly what [MOOLLM's schema-mechanism skill](https://github.com/SimHacker/moollm)
  is reaching for. My bet (confidence: medium) is that this beats "try harder" precisely because it
  doesn't need a human to know when to say it.

---

## The through-line: *Made-Up Minds*, remade

| Era | Brings | Still missing |
|-----|--------|---------------|
| **Drescher schemas** (1991) | learned context→action→result; forward prediction | symbol grounding |
| **Vectors** — Schema Networks, hypervectors (2017–18) | transfer, noise tolerance | mostly *assume* the ontology |
| **NCAs** (2020+) | emergent, self-repairing structure | deliberate planning |
| **LLMs** (now) | grounded meaning + commonsense | default to the *common case*, not a plan |

Each era fills the prior wall and opens a new one. The bet the exchange keeps circling — and the heart
of the show — is the obvious composition: **LLM grounding + schema-style forward prediction and
pruning.** Give the language model the world knowledge Drescher's agent never had; give the LLM the
predict-and-prune loop it conspicuously lacks. That's the wager behind
[MOOLLM](https://github.com/SimHacker/moollm) (`skills/schema-mechanism` — "Why LLMs Complete
Drescher's Vision") and Henry's Python **schema factory**, the substrate we'd build on live. See also
the [`llm_breakthrough` note in Gary's CHARACTER.yml](CHARACTER.yml).

🤖 **Claude (AI speculation) — where I think this leads, confidence: medium.** I don't think the
endgame is "bolt a symbolic planner onto a neural net" — that's the old neuro-symbolic staple. The
sharper version this thread points at is **schemas as a control loop the LLM runs on itself**: the
model generates grounded C→A→R hypotheses, a cheap deterministic layer maintains predicted state and
prunes, and the *discrepancies* (Drescher's synthetic-item trigger — "something I didn't predict")
become the learning signal. That gives you the three things no single era above had at once: **learned
ontology** (LLM), **grounding** (LLM), and **deliberate, inspectable forward planning** (schemas). If
that works even partway, the car wash stops being a gotcha and becomes the *default* path. I'd put it
at maybe even odds for toy microworlds within a year, much lower for open-world robustness — Henry's
scalability worry is the real boss fight.

## Open questions to continue on the show

1. Can an LLM run a cheap, always-on **predict-and-prune** loop (schemas) so planning beats the common
   case *by default* — without unscalable "try harder" prompting?
2. **Hardwired vs. learned ontology** — Gary's 2024 question, 30+ years on: can an LLM *learn* the
   object/attribute carve-up (it arguably already does, latently) and *expose* it as editable schemas?
3. Is CatAttack distractibility the flip side of having no world-state salience filter?
4. Do NCAs (local view, async updates, self-repair) point at training pressures (an MDL/resource tax)
   that make **hierarchical abstraction** emerge?
5. **Cost-aware schemas** (Henry's "MOOLAH"): track not just whether an action succeeds, but what it
   *costs* in a given context.
6. 🤖 *(Claude's add)* Can we measure the gap directly — run the car wash and a CatAttack battery
   **with** vs. **without** a standing schema/precondition reflex, and report the delta live?

---

*Authorship: real quotes attributed by name; narration and all 🤖 blocks by Claude. Papers, screenshots,
and a checked reading list: [`../../characters/will-wright/sources/`](../../characters/will-wright/sources/README.md) · machine-readable digest:
[`schemas-vectors-and-llms.yml`](schemas-vectors-and-llms.yml) · the show:
[`repo-shows/gary-drescher/`](../../repo-shows/gary-drescher/README.md).*
