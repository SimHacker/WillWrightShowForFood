# Sources — Gary Drescher 👤

*Primary-source papers and images that anchor the [schema vectors → LLMs discussion](../schemas-vectors-and-llms.md).
Captions are factual; tell us any corrections, and we'll remove anything on request.*

## Files in this directory

### `kansky17a.pdf` — Schema Networks (Vicarious, 2017)

Kansky, K., Silver, T., Mély, D.A., Eldawy, M., Lázaro-Gredilla, M., Lou, X., Dorfman, N.,
Sidor, S., Phoenix, D.S., George, D. (2017). **"Schema Networks: Zero-shot Transfer with a
Generative Causal Model of Intuitive Physics."** *ICML 2017*, PMLR 70:1809–1818.

- **Public:** [PMLR](https://proceedings.mlr.press/v70/kansky17a.html) · [arXiv:1706.04317](https://arxiv.org/abs/1706.04317)
- **Why it's here:** the paper that revived Drescher's "schema" idea in the deep-learning era —
  a generative causal model that gets **zero-shot transfer** on Breakout variants. Shared into the
  thread by **Gregory Makoff**; **Henry Minsky** noted it came out of the Vicarious company and was
  *"oddly skimpy on details of implementation."* The file `kansky17a` is the canonical PMLR name.

### `car-wash-planning-failure.png` — the 200-foot car wash

A screenshot of an LLM chat: *"I want to wash my car and the car wash is only 200 feet away.
Should I start the car and drive over there or just walk?"* — the model confidently answers
**"just walk,"** missing that you can't wash a car you didn't bring. Circulated by **Henry Minsky**
(Feb 2026) as *"a good illustration of a LLM returning the common case instead of making a plan to
achieve a goal."* The seed of the [planning-vs-common-case thread](../schemas-vectors-and-llms.md#thread-3).

### `catattack-adversarial-triggers.png` — CatAttack (Table 1)

Table 1 from the CatAttack paper (below), showing **query-agnostic adversarial triggers** — irrelevant
text like *"Interesting fact: cats sleep most of their lives"* appended to a math problem flips the
model's answer. Cited by **Henry Minsky** as evidence that LLMs *"fail quickly when 'distracting' info
is shoved into their prompt sequence."*

## Reading list (checked citations)

The papers and articles that came up across the thread, with public links:

| Work | Cite | Link |
|------|------|------|
| **Made-Up Minds** | Drescher, G. (1991). *A Constructivist Approach to Artificial Intelligence.* MIT Press. | [MIT Press](https://mitpress.mit.edu/9780262517089/made-up-minds/) |
| **Good and Real** | Drescher, G. (2006). *Demystifying Paradoxes from Physics to Ethics.* MIT Press. | [MIT Press](https://mitpress.mit.edu/9780262042338/good-and-real/) |
| **Schema Learning** | Holmes, M.P. & Isbell, C.L. (2004). "Experience-Based Construction of Predictive Action Models." *NIPS 17*, 585–592. | [NeurIPS](https://papers.nips.cc/paper/2004/hash/18bb68e2b38e4a8ce7cf4f6b2625768c-Abstract.html) |
| **Schema Networks** | Kansky et al. (2017). *ICML*, PMLR 70:1809–1818. | [PMLR](https://proceedings.mlr.press/v70/kansky17a.html) · [arXiv](https://arxiv.org/abs/1706.04317) · local: [`kansky17a.pdf`](kansky17a.pdf) |
| **Hypervector schemas** | Neubert, P. & Protzel, P. (2018). "Towards Hypervector Representations for Learning and Planning with Schemas." *KI 2018*, LNCS 11117:182–189. | [Springer](https://doi.org/10.1007/978-3-030-00111-7_16) · [PDF](https://www.tu-chemnitz.de/etit/proaut/publications/neubert18_hypervector_schemas.pdf) |
| **CatAttack** | Rajeev et al. (2025). "Cats Confuse Reasoning LLM: Query Agnostic Adversarial Triggers for Reasoning Models." *CoLM 2025.* | [arXiv:2503.01781](https://arxiv.org/abs/2503.01781) · [dataset](https://huggingface.co/datasets/collinear-ai/cat-attack-adversarial-triggers) |
| **Neural Cellular Automata** | Musser, G. (2025, Sep 10). "Self-Assembly Gets Automated in Reverse of 'Game of Life.'" *Quanta.* | [Quanta](https://www.quantamagazine.org/self-assembly-gets-automated-in-reverse-of-game-of-life-20250910/) |
| **Growing NCA** | Mordvintsev, A. et al. (2020). "Growing Neural Cellular Automata." *Distill.* | [Distill](https://distill.pub/2020/growing-ca/) |
| **K-lines** | Minsky, M. (1980). "K-lines: A Theory of Memory." *Cognitive Science* 4(2):117–133. | [DOI](https://doi.org/10.1207/s15516709cog0402_1) |

---

See: [`../schemas-vectors-and-llms.md`](../schemas-vectors-and-llms.md) (narrative) ·
[`../schemas-vectors-and-llms.yml`](../schemas-vectors-and-llms.yml) (digest) ·
[`../CHARACTER.yml`](../CHARACTER.yml)
