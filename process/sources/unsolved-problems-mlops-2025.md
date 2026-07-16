# Unsolved Problems in MLOps — Murphy & Underwood (ACM Queue, Jul–Aug 2025)

**Citation:** Niall Richard Murphy and Todd Underwood, *Unsolved Problems in MLOps*, ACM Queue, July–August 2025. DOI [10.1145/3762989](https://doi.org/10.1145/3762989). PDF: [spawn-queue.acm.org](https://spawn-queue.acm.org/doi/pdf/10.1145/3762989).

**Authors (public bios from article):**
- **Niall Murphy** — CEO/founder, Stanza Systems (ML/AI/reliability); ex Amazon/Google/Microsoft Dublin; co-author/editor of SRE and ML reliability books.
- **Todd Underwood** — leads reliability at Anthropic; prior OpenAI Research Platform reliability, Google ML capacity + ML SRE; co-author *Reliable Machine Learning* (O'Reilly, 2022).

**Thesis in one line:** Classical ops assumes deterministic code + versioned binaries; ML ops is stochastic, data-driven, and expensive to roll back — so canarying, SLO alerting, and "ship a new binary" mostly fail.

---

## Five problem clusters (article's framing)

### 1. Measuring model quality

- End-to-end quality is the only metric that matters for ML reliability; production measurement is hard.
- **Replayed Q&A suites** break when a "better" answer is longer or more nuanced than the golden string (example: "how many legs do humans have?").
- **Canarying** is weakened because behavior drifts with user behavior over time and multiple live models contaminate baselines.
- **What actually works (per article):** real user feedback — clicks, thumbs-up, copy-paste — i.e. outsourcing QA to users.
- **Burns / Azure (SRECon Americas 2025, cited in article):** validate new UI models with (a) LLMs judging LLM output and (b) enough employee thumbs-up — "vibes," not a quality gradient.
- **OpenAI sycophantic release (cited):** personality tweak favored overly supportive, disingenuous answers; short-term user feedback reinforced bad behavior.

**Unsolved (article):** bound stochastic responses for testing; canary quality control across multiple models with a stable baseline.

### 2. Model provenance and versioning

- Classical file versioning is solved; model versioning is not widespread.
- Same API name (e.g. "GPT-4o") may differ by time — new weights, system prompt, safety filters, architecture drift.
- Strong versioning should cover: training data, post-training transforms, model artifact, policies (filters, system prompt), architecture changes.
- Data provenance for jurisdiction/use-case (article example: US-trained model used in France) is mostly "cross fingers" or geo-block.
- Pushes validation cost onto every API consumer.

**Unsolved (article):** tooling + agreed versioning surface; dataset management; persuading providers to expose versions to users.

### 3. Monitoring and observability

- 2024 State of Production ML (Institute of Ethical AI & ML, cited): **~50% of practitioners do not monitor model performance in production**; observability is the largest problem category.
- Hard to alert on business/quality metrics when thresholds aren't stable; infra-only alerts miss what matters.
- Organizational ambiguity: who monitors, who pages — Google once had SREs do model-quality tests embedded with model teams.

**Unsolved (article):** org consensus on ownership; best practices for the non-monitoring majority; efficient inspectability without recording every weight lookup.

### 4. Efficiency, cost, stranded GPU capacity

- Latest accelerators are nonlinearly expensive (article: DGX B200 ~$500k in 2024).
- Classical load balancing + query cost estimation (URL path, SQL length) fail for LLMs: tokenization cost, unpredictable output length, many disjoint model pools (size, context, caching, long jobs).
- More pools → more stranded GPUs; batch backfill rarely absorbs slack.

**Unsolved (article):** practical query cost estimation; better load balancing; capacity planning across model proliferation.

### 5. Data leakage, injection, security

- **Leakage:** only reliable prevention cited is *remove secrets from training data* (hallucination still possible).
- **Injection / jailbreaking:** "not preventable in principle"; defense in depth — live monitoring, fast mitigation, failover.
- Egress filters and proprietary safety stacks (article mentions Anthropic RSP / ASL-3) — no shared industry practice yet.

**Unsolved (article):** emit-safe at source while keeping data in training set; universal practical inbound filtering against jailbreaks.

---

## NOT unsolved (article sidebar)

Training fragility to network blips — known mitigations (redundant links, distributed state), just expensive. No novel paradigm required.

---

## Repo Show hooks (process only — not comedy traditions)

| Article pain | Repo Show process answer |
|--------------|--------------------------|
| Model versioning opaque | Git-native artifacts — episodes, CHARACTER.yml, `sources/` cards; `orchestration-gold` labels human-reviewed segments. |
| User-feedback-as-QA | Human authorship on air — AI proposes code/orchestration; people dispose; simulated characters explicitly labeled. |
| LLM judges LLM | **Evidence bounce cut** — claim → artifact on screen → human reaction (see `building-the-sims/evidence-bounce-cut.md`). |
| Provenance / compliance | `process/sources/` digests + green-room consent gates for sensitive instantiation. |

**Scope note:** This digest is about production ML reliability. Comedy traditions (e.g. FlatterBot 2000!) are unrelated — do not cross-wire.

**On-air framing (optional):** Murphy & Underwood ask for a better paradigm or patch for *foundation-model serving*. Our patch for *show* reliability is git + labeled human performance + visible repo history — a different problem domain.

---

## Episode / process ties

- `repo-shows/jason-shankel/SHOW.yml` — optional `mlops-vs-repo-show` segment (AI + skills context).
- `repo-shows/ideas/traditions/make-play-tools-show.yml` — git history as making-of.
- `repo-shows/ideas/themes/human-control-and-authorship.yml` — augmentation not automation.
- `process/orchestration-gold.yml` — training gold / provenance for routing traces.

↑ [sources index](README.md) · [orchestration-gold](../orchestration-gold.yml)
