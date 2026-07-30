# Ideas to explore with Gary Drescher 👤

*Conversation hooks — Don's proposed topics, grounded in Gary's public work and documented
connections. Not quotes, not claims about what Gary thinks.*
[Portrayal standards](../../schemas/portrayal-standards.md) · interview planned · consent not_yet_asked

## Anchor essay

Read first: [**Made-Up Minds**](made-up-minds.md) — the pun (Drescher ↔ Will ↔ soul-files ↔ LLM),
PhD lineage, Leela, MOOLLM skills.

## The hooks

### 1. Made-Up Minds — the pun at many levels

- **Constructivist:** minds built from schemas, not filled from above (Piaget → Drescher)
- **Will Wright:** players make up minds in Sims, Proxi, stories — hobby-scale constructivism
- **Fictional:** made-up as in invented — a made-up story, a made-up friend, a Sim
- **Decisive/reflexive:** "make up your mind" — the act only the owner can perform
- **Repo Show:** soul-files in git — consented portrayals ([Palm](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/pub/stage/palm-nook/study/will-wright-soul-for-food.md))
- **LLM era:** made-up minds that read their own CHARACTER.yml

**Dream crossover:** Gary + Will on camera — mechanism vs microworld; Motive bars vs schemas.

### 1b. The presupposition trap — who does the making?

Does "making up minds" presuppose an existing mind to do the making? Drescher's answer is no: the
schema mechanism is a mind **making itself up** from raw experience — no homunculus, no regress.
Will's answer is also no, differently: he authors *conditions*, players complete the Sim's mind in
their heads (the simulator effect). An LLM adds a twist — its own assistant persona is a made-up
mind, so animating Palm is a made-up mind making up a made-up mind. And the idiom's rule holds the
ethics: **existing minds make themselves up; other minds can only persuade** — which is
[portrayal standards](../../schemas/portrayal-standards.md) in one sentence. Full argument:
[`made-up-minds.md`](made-up-minds.md#who-makes-up-a-mind-the-presupposition-trap).

**Show question:** where does the making-up happen — mechanism, author, observer, or grammar?

### 2. Made-Up Minds, remade (show seed)

[`repo-shows/gary-drescher/`](../../repo-shows/gary-drescher/) — build live:

| Era | Substrate |
|-----|-----------|
| 1991 | Drescher's Lisp — rigorous, ungrounded items |
| 2020s | Henry's Python `pyleela.brain` — schema factory |
| 2026 | MOOLLM skills + LLM — grounded semantics in YAML Jazz |

MOOLLM claim: *"The YAML provides the skeleton; the LLM provides the soul."*

### 3. Symbol grounding — finally?

1991 wall: opaque tokens, correlate from scratch. LLM training (world, people, logic, code) grounds
abstract schema terms. [`schema-mechanism` SKILL](https://github.com/SimHacker/moollm/blob/main/skills/schema-mechanism/SKILL.md) — *Why LLMs Complete Drescher's Vision*.

### 4. play-learn-lift ↔ schema learning

[`play-learn-lift`](https://github.com/SimHacker/moollm/tree/main/skills/play-learn-lift): PLAY surfaces
patterns → LEARN stabilizes schemas → LIFT publishes skills. [`schema-factory`](https://github.com/SimHacker/moollm/tree/main/skills/schema-factory): imagine theories to explain evidence chains and statistical regularities.

### 5. Leela thread — vectors, NCAs, 200-foot car wash

[`schemas-vectors-and-llms.md`](schemas-vectors-and-llms.md) — real 2024–2026 exchange with Henry,
Steve, Gregory Makoff, Andy Goris. Gary's hard questions back.

### 6. Leela group episode

With [Henry](../henry-minsky/README.md), [Milan](../milan-singh-minsky/README.md), [Steve](../steve-kommrusch/README.md) — neuro-symbolic AI; Piaget-schema learning; adviser role.

### 7. Good and Real

Determinism, genuine choice, acausal/subjunctive cooperation — philosophy turn if Gary prefers.

### 8. Marvin Minsky memorial through-line

PhD orbit → Society of Mind → schema mechanism → MOOLLM schemapedia. [`../marvin-minsky/`](../marvin-minsky/README.md) 🕯️

Now with a specific thread to pull (hooks 9–10 below): Memo 603, the censors, and the koan canon —
and a co-memorial angle with [David Levitt](../david-levitt/README.md), who is *thanked in the memo's
acknowledgments* alongside Danny Hillis and RMS.

### 9. Censors ↔ schemas — the advisor conversations we can only reconstruct

Minsky's **AI Memo 603** (*Jokes and their Relation to the Cognitive Unconscious*, Nov 1980 —
[digest + commentary](https://github.com/SimHacker/moollm/blob/main/skills/no-ai-joking/MINSKY-JOKES.md))
patches Freud: censors suppress not just forbidden *content* but defective *reasoning* — and this
"negative meta-knowledge… may be a large portion of all we know." The memo never specifies how
censors get **learned**. The proposed resolution (derived live in a
[MOOLLM transcript](https://github.com/SimHacker/moollm/blob/main/skills/no-ai-joking/examples/2026-07-30-difference-between-a-duck-transcript.md),
now wired into the [soul model](https://github.com/SimHacker/moollm/blob/main/skills/soul-city/SOUL-MODEL.md#minds-all-the-way-down--minsky-to-drescher)):
**a censor is a schema with the sign bit flipped** — same context/action/result triple, result marked
*harmful*, response *suppress*; **marginal attribution over one's own failures** is the missing
learning rule; **laughter is the training signal** that mints a censor.

**Ask Gary directly** — the memo is Nov 1980, his thesis years are the same lab, same decade:

- Did he and Marvin ever discuss censors as *learnable* — was this mapping on a blackboard somewhere?
- Does he buy it? Could the schema mechanism grow censors by running attribution over its own bugs?
- Are synthetic items the right account of what a censor's trigger *is* (a minted concept over the
  mind's own states — the mechanism pointed inward)?
- Both halves refuse to fix the kernel (Minsky: "it hardly ever pays to alter a general mechanism to
  correct a particular bug"; the schema mechanism never rewrites itself). Was that shared
  epistemology explicit between them, or convergent?

### 10. The toaster koan — Gary is in the canon

**"Drescher and the Toaster"** is one of the classic AI koans compiled by **Danny Hillis** at the
MIT AI Lab (Jargon File canon): a proselytizer offers Gary a personality test *"because I want you
to be happy"* — Gary puts it in the toaster: *"I wish the toaster to be happy, too."*
([MOOLLM analysis](https://github.com/SimHacker/moollm/blob/main/skills/no-ai-joking/examples/hacker-koans-drescher-toaster.yml))

The loop that makes it heavy: Hillis, who compiled the koan, is *thanked in Memo 603* — the koan
culture and the humor paper are the same lab, the same people, the same years. Gary is
simultaneously a *subject* of the lab's humor canon and the author of the mechanism that explains
why the canon is funny (the koan is a censor demonstration: refusing an invited frame by extending
it to absurdity).

**Ask Gary:** did it really happen? Who was the proselytizer — and was it a Scientology personality
test, as the MOOLLM analysis suspects? How does it feel to *be* a koan? What's the story he'd tell
about lab humor as its own oral tradition — and would he memorialize Marvin through it?

## Sources

- [`made-up-minds.md`](made-up-minds.md)
- [`schemas-vectors-and-llms.md`](schemas-vectors-and-llms.md)
- [`invitation.md`](invitation.md)
- [`CHARACTER.yml`](CHARACTER.yml)
- [Made-Up Minds (MIT Press)](https://mitpress.mit.edu/9780262517089/made-up-minds/)
