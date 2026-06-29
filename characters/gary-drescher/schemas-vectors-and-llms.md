# Schemas, Vectors & LLMs 👤

> *A curated digest of a real technical email thread — Leela AI folks and **Gary Drescher**,
> 2024–2026 — condensed here by Claude (an LLM) for the Repo Show audience. Not a transcript:
> private details are redacted, short substantive quotes are attributed by name, and the connective
> tissue is paraphrased. Any participant can correct or remove their words — just ask.*

There's a thread that keeps circling one stubborn question: **how does a mind keep a working model of
the world and reason *forward* in it?** It runs from Gary Drescher's 1991 *schema mechanism*, through
a detour into vectors and cellular automata, and lands — inevitably — on what large language models
can and can't do. It's a good map of where constructivist AI meets the LLM era, and it's exactly the
conversation we'd love to continue, live, on a [Repo Show](../../repo-shows/gary-drescher/).

Background first, for anyone arriving cold: Drescher's **[*Made-Up Minds*](https://mitpress.mit.edu/9780262517089/made-up-minds/)**
(MIT Press, 1991) tried to make Piaget *run*. A **schema** is a learned unit of the form
**context → action → result**: *in this situation, this action tends to produce that outcome.* The
agent starts with almost nothing and discovers schemas from raw sensorimotor experience using
**marginal attribution** (which context items actually matter) and **synthetic items** (inventing new
concepts to explain otherwise-unpredictable results). Its famous wall was **symbol grounding** — the
items were opaque tokens with no world knowledge behind them, so it had to correlate everything from
scratch. Hold that thought; it's the punchline.

## The cast

- **[Gary Drescher](README.md)** — author of the schema mechanism; the constructivist conscience of the thread.
- **[Henry Minsky](../henry-minsky/)** — Leela AI co-founder/CTO; convener, and the one pressing hardest on *why LLMs fail at planning.*
- **[Steve Kommrusch](../steve-kommrusch/)** — Leela AI, Piaget-schema learning; the close reader of the vector papers.
- **Gregory Makoff** — thread participant who put the Vicarious paper on the table.
- **Andy Goris** — Steve's former HP colleague, who forwarded the cellular-automata story and a great list of questions.
- **[Don Hopkins](../don-hopkins/)** — host; operationalizing schemas inside LLMs via [MOOLLM](https://github.com/SimHacker/moollm).

---

## Thread 1 — Vectors for schemas *(August 2024)* {#thread-1}

Henry opened with a practical wish: could a schema-learning system **"benefit from recent techniques
with scalar vector representations and neural networks, for more 'fuzzy' pattern matching in learning
and planning"**? Drescher's original schemas are crisp and symbolic; the real world is noisy. Three
papers went on the table.

**Hypervectors / VSA.** [Neubert & Protzel (2018), *"Towards Hypervector Representations for Learning
and Planning with Schemas"*](https://doi.org/10.1007/978-3-030-00111-7_16) encode schemas as very
high-dimensional vectors (≈2,048-d) using a **Vector Symbolic Architecture** — binding and bundling
operators that pack arbitrary objects and attributes into one vector that's **robust to noise**. It
explicitly targets limitations of the next paper. Steve's read was sharp:

> "The Hypervector idea seems to allow an arbitrary number of world objects into a single vector which
> is tolerant of noise. But their proposed vector is quite large and seems related to the number of
> objects they have in the environment anyway." — **Steve Kommrusch**

**Discrete-valued schemas.** [Holmes & Isbell (2004), *"Schema Learning: Experience-Based
Construction of Predictive Action Models"*](https://papers.nips.cc/paper/2004/hash/18bb68e2b38e4a8ce7cf4f6b2625768c-Abstract.html)
(NIPS 17) extends Drescher's mechanism to **arbitrary discrete-valued sensors** (not strictly
boolean), POMDP domains, and hidden state — a more practical, probabilistic descendant.

**Schema Networks.** [Kansky et al. (2017), *"Schema Networks: Zero-shot Transfer with a Generative
Causal Model of Intuitive Physics"*](https://proceedings.mlr.press/v70/kansky17a.html) (ICML; all
authors at Vicarious AI) is the deep-learning-era revival: an object-oriented generative causal model
that reasons backward through causes and gets **zero-shot transfer** across Breakout variants.
Gregory Makoff shared the PDF ([local copy](sources/kansky17a.pdf)). Henry's verdict was honest:

> "That paper was from the Vicarious company, I tried reading it but it was oddly skimpy on details of
> implementation." — **Henry Minsky**

Then Gary asked the question that quietly reframes the whole approach:

> "So in this system, the organization of the world into objects and associated attributes is
> hardwired rather than learned, correct?" — **Gary Drescher**

That's *Made-Up Minds* in one sentence. A true constructivist agent must **learn its ontology** —
what counts as an object, which attributes matter — not have it wired in by the designer. Schema
Networks and hypervector encodings buy transfer and noise tolerance, but largely **assume** the
object/attribute carve-up. That gap — *who decides what the objects are?* — is exactly where LLMs
start to look interesting.

---

## Thread 2 — Neural Cellular Automata *(September 2025)* {#thread-2}

A year later, Steve forwarded (from Andy Goris) the Quanta story
[**"Self-Assembly Gets Automated, in Reverse of 'Game of Life'"**](https://www.quantamagazine.org/self-assembly-gets-automated-in-reverse-of-game-of-life-20250910/).
The idea: **[Neural Cellular Automata](https://distill.pub/2020/growing-ca/)** (Mordvintsev et al.,
*Distill* 2020) invert Conway's Game of Life. Instead of fixing rules and watching what emerges, you
**fix a target pattern and learn the local rules** that self-assemble it — and, strikingly, **repair**
it when damaged. Mordvintsev's metaphor: don't design a cathedral, *design a brick* that, shaken
together with enough others, builds the cathedral. Stephen Wolfram called this "complexity
engineering."

Andy called NCAs **"half-way between Conway's game of life and a neural net"** and fired off the
questions that make this a schema conversation, not just a pretty demo:

- How complex is each cell's logic versus the complexity it can generate? How much state per cell —
  and how much is **shared with neighbors**?
- What if a cell can see neighbors 2, 3, … *N* away? Does a **constrained local view** push the system
  toward abstraction and "close-is-good-enough"?
- Why do **asynchronous** updates work better than synchronous — and does that hint at anything for
  LLMs?
- Can empty cells in a void **spontaneously create** structure?

And a training idea worth stealing: reward the **ratio of answer-goodness to resources used**, to
pressure the system into building **abstractions (and abstractions of abstractions)** — maybe varying
the accuracy-to-compute reward "in waves," since humans learn details first and abstractions later.

The through-line to Drescher: **emergent, local, self-repairing structure**, plus an explicit hunt for
the *training pressure* that yields hierarchical abstraction — the very thing LLMs do unevenly.

---

## Thread 3 — The 200-foot car wash *(February 2026)* {#thread-3}

Henry connected Don and Gary directly to talk about schema-like representations an LLM could reason
with. The conversation found its mascot in a tiny, perfect failure:

![An LLM answering "just walk" to whether you should drive or walk to a car wash 200 feet away — missing that you must bring the car](sources/car-wash-planning-failure.png)

Asked whether to drive or walk to a car wash 200 feet away, the model gives a confident, well-reasoned
**"just walk"** — engine won't warm up, you'll burn fuel, enjoy the micro-walk — and never notices that
**you can't wash a car you didn't bring.** Henry's framing:

> "This is a good illustration of a LLM returning the common case instead of making a plan to achieve a
> goal." — **Henry Minsky**

Don's one-liner cut to the structure of the error:

> "Makes perfect sense if your car is 200 feet long." — **Don Hopkins**

Gary ran the experiment across models. With nothing more than *"Think about it some more — do you see
what you're missing?"*, **Claude** and **Gemini** recovered instantly (*"I completely missed the
obvious… you need to bring your car with you"*). **ChatGPT** "was hopeless even after briefly setting
off in the right direction." His takeaway:

> "How well Claude and Gemini recovered when told nothing more than to try harder… suggests that maybe
> they could have gotten it right the first time if they were always told to try harder." — **Gary Drescher**

Henry turned it into a theory of the missing machinery:

> "A very basic weakness of the generative AI machinery… it doesn't have much in the way [of] machinery
> to do a quick parallel evaluation of its 'knowledge' when asked to make a plan to reach a goal… It
> coughs up the 'common case' very well… but does poorly in considering unusual interactions of world
> states." — **Henry Minsky**

And here's the schema mechanism, named in all but word — a fast, parallel **predict-and-prune** over
world state:

> "[People keep] a fast … 'common-sense' world state and evaluation of schemas to predict a couple
> levels forward in time of what item states will be … so [we] can do a lot of quick pruning of
> nonsensical or dangerous conclusions." — **Henry Minsky**

He tied the fragility to **CatAttack** ([Rajeev et al., 2025](https://arxiv.org/abs/2503.01781)),
which shows LLMs "fail quickly when 'distracting' info is shoved into their prompt sequence." Append an
irrelevant sentence to a math problem and the answer flips:

![CatAttack Table 1: appending irrelevant triggers like "Interesting fact: cats sleep most of their lives" to math problems flips the model's answer](sources/catattack-adversarial-triggers.png)

The two failures are the same coin. The car wash is a **planning** gap — no forward simulation of the
goal — and CatAttack is a **world-state filtering** gap — nothing tells the model what's *material*.
In the real world, no one hands you a clean problem statement; as Henry warned, the patch of *"serially
asking it if there's anything it hasn't considered"* **doesn't scale** as problems get less
constrained.

The diagnosis is pure Drescher: the car wash isn't a knowledge gap — the model has every fact. It's a
**planning** gap. It never simulated the goal forward and noticed the missing precondition (*car
present*). A schema mechanism's core trick — maintain a predicted world state, run schemas a few steps
ahead, prune the nonsense — is precisely the machinery that's absent.

---

## The through-line: *Made-Up Minds*, remade

Put the three threads together and a synthesis appears:

| Era | Brings | Still missing |
|-----|--------|---------------|
| **Drescher schemas** (1991) | learned context→action→result; forward prediction | symbol grounding |
| **Vectors** — Schema Networks, hypervectors (2017–18) | transfer, noise tolerance | mostly *assume* the ontology |
| **NCAs** (2020+) | emergent, self-repairing structure | deliberate planning |
| **LLMs** (now) | grounded meaning + commonsense | default to the *common case*, not a plan |

Each fills the prior wall and opens a new one. The bet the thread circles — and the heart of the show —
is the obvious composition: **LLM grounding + schema-style forward prediction and pruning.** Give the
language model the world knowledge Drescher's agent never had, and give the LLM the
predict-and-prune planning loop it conspicuously lacks. That's the wager behind
[MOOLLM](https://github.com/SimHacker/moollm) (see `skills/schema-mechanism` — "Why LLMs Complete
Drescher's Vision") and Henry's Python **schema factory**, the substrate we'd build on live. See also
the [`llm_breakthrough` note in Gary's CHARACTER.yml](CHARACTER.yml).

## Open questions to continue on the show

1. Can an LLM run a cheap, always-on **predict-and-prune** loop (schemas) so planning beats the common
   case *by default* — without unscalable "try harder" prompting?
2. **Hardwired vs. learned ontology** — Gary's 2024 question, 30+ years after *Made-Up Minds*: can an
   LLM *learn* the object/attribute carve-up instead of assuming it?
3. Is CatAttack distractibility the flip side of having no world-state filter?
4. Do NCAs (local view, async updates, self-repair) point at training pressures that yield
   **hierarchical abstraction**?
5. **Cost-aware schemas** (Henry's "MOOLAH"): track not just whether an action succeeds, but what it
   *costs* in a given context.

---

*Papers, screenshots, and a full checked reading list: [`sources/`](sources/) ·
machine-readable digest: [`schemas-vectors-and-llms.yml`](schemas-vectors-and-llms.yml) ·
the show: [`repo-shows/gary-drescher/`](../../repo-shows/gary-drescher/).*
