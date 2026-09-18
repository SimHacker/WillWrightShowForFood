# Credit diffusion — blended provenance, and paying thanks out proportionally

The proposal: facts are aggregates blended from many riders, so track each contributor's **partial
share** of every derived fact, and when a thank-you arrives at that fact, pay it out to the
contributors in proportion. One vote per person. This rewards verification, because corroborating an
existing fact buys you a stake in it.

This is not a dream. It is two solved problems and one hard one, and it is worth knowing which is
which before building it.

## The accounting is a solved problem, with a catch

Annotating data with where it came from and propagating those annotations through queries is
**provenance semirings** — Green, Karvounarakis and Tannen, PODS 2007
([paper](https://www.cs.ucdavis.edu/~green/papers/pods07.pdf)). Tag each input with a variable, do the
algebra in the semiring of polynomials `N[X]`, and the output carries a polynomial that records not
just *which* inputs contributed but *how*: multiplication means joint use, addition means alternative
derivations. Their example annotation `2s² + rs` reads as *three separate derivations, two of which use
input s twice, the third using r and s*. That is precisely "partial blended provenance", with an
algebra rather than a heuristic.

**The catch, and it lands directly on us:** aggregation breaks it. Amsterdamer, Deutch and Tannen
showed that tuple-level provenance polynomials are inapplicable to queries with aggregation, and that
the fix is to annotate **individual values** rather than tuples, using a tensor construction `K ⊗ M`
that handles `SUM`, `MIN`, `MAX` and grouping ([PODS 2011](https://arxiv.org/abs/1101.1110)).

Every fact this app publishes is an aggregate — a per-edge roughness statistic, a wait envelope, a
traversal count. So the naive design (attach a contributor list to each row) is the exact thing the
literature says does not work. **Annotate the value, not the record.** A roughness figure for an edge
carries its own provenance annotation, and it survives being re-aggregated because the algebra is
closed under the operations we actually use.

## The fair-share question has a name, and an unpleasant complexity

"What is each contributor's share of a joint output" is the **Shapley value**, and it is not one option
among many: it is the unique division satisfying the natural axioms, which is why it keeps being
rediscovered. Applied to exactly our situation — how much did this fact contribute to this answer —
it is Livshits, Bertossi, Kimelfeld and Sebag, ICDT 2020
([journal version](https://lmcs.episciences.org/8437)).

Their results are the practical constraint:

- **PTIME** for hierarchical self-join-free conjunctive queries.
- **FP#P-hard** otherwise.
- Approximable by Monte Carlo sampling (an FPRAS exists), but impractically, since it requires very
  many query executions over subsets. Later work computes it via knowledge compilation to circuits
  ([arXiv 2112.08874](https://arxiv.org/html/2112.08874v2)), and Bienvenu, Figueira and Lafourcade
  develop **tractable responsibility measures** as the deliberate cheap substitute
  ([PACMMOD 2025](https://doi.org/10.1145/3725249)).

The useful consequence for us is a design rule rather than an implementation:

> **Keep the aggregation linear and the fair split is free.** For a plain mean over N independent
> riders, contributions are symmetric and additive, and the Shapley value is exactly `1/N`. Equal
> split is not an approximation there — it is the answer.

Complexity only arrives when we make the game non-additive, and we already have one place where we do:
**the multi-rider publication threshold** in [`privacy.md`](privacy.md) means a fact does not exist
until several independent riders have contributed. That is a coalition with a quorum, not a sum, and it
is where equal division stops being obviously right — the rider who crosses the threshold enabled
everything, and the rider who arrived tenth did not. So:

- Aggregates stay linear wherever possible, and equal-share is used without apology.
- Where a threshold or an unlock exists, use a **tractable responsibility measure**, not exact Shapley,
  and say in the docs that it is an approximation of a known ideal. That is a much better position than
  inventing a formula and calling it fair.

## What must not be divided

A thank-you split forty ways is not a thank-you. One fortieth of a message is nothing, and the whole
value of the gesture is that a specific person found your work useful and said so.

So the two things separate:

| | Divided proportionally | Not divided |
|---|---|---|
| **Standing** — the ledger of shares in facts | Yes, fractionally, forever accumulating | |
| **The message** — the sentence someone wrote | | No. It goes to the contributors above a visibility threshold, whole, with the text |

Fractions accumulate rather than round. The pro-rata streaming pathology is instructive: divide each
event and round it, and the long tail earns a permanent zero. Accumulate the fractions and settle when
they cross something meaningful.

## Shares decay, and that is the point

If the rider who measured a street in 2026 collects a share of every thank-you it earns in 2034, we
have built a landlord. The value of a fact *today* comes mostly from the most recent check that it is
still true — that is the entire argument for freshness in map data, and it is the same argument
against rent that makes a subscription bike app offensive.

So a share **decays with staleness**, and re-verification re-earns it. First measurement is not a
mineral right. This also answers the obvious exploit — measure ten thousand things badly, once, and
retire on the diffusion.

## Does it actually encourage verification? Partly, and it needs a correction

Yes: buying a stake in a fact by corroborating it is a real incentive to verify rather than to hunt for
virgin territory, and it inverts the land grab the same way the existing rule *corroboration pays more
than first report* does.

But it tilts the wrong way on its own. A share of future thanks is worth more on a fact that will
*attract* thanks — the photogenic bike path, the famous junction — so proportional payout quietly
directs verification effort toward the streets that already have plenty. The fix is already in the
system: apply the **neglect multiplier** from [`transgression.md`](transgression.md) to the *share*, so
the first corroborator of a hole in Aalsmeer takes a larger stake than the tenth corroborator of
something on the Damrak. Coverage then spreads itself without anyone assigning work.

## One vote each person is the hard problem

Everything above is accounting. This part is adversarial, and it is where the design is genuinely
uncomfortable, because *one vote per person* requires knowing what a person is — and this app is built
to not know who anyone is.

The tension is real and cannot be waved away: [`privacy.md`](privacy.md) records no identity by
construction, and a reputation ledger with per-person vote limits needs exactly that.

The resolution is that the anchor already exists for another reason, and the vote can be detached from
it:

- **Anchor on the OSM account.** A rider who submits map edits needs one anyway. It is externally
  rate-limited, socially costly to farm, and not ours to hold.
- **Detach the vote with anonymous credentials.** Blind-signature tokens — the Privacy Pass shape — let
  someone prove *"I am one distinct entitled person, and I have not voted on this fact"* without the
  vote being linkable back to the account. This is ordinary applied cryptography, not research, and it
  is the only honest way to have both properties at once.
- **Do not build a trust-diffusion score on top.** EigenTrust and the Advogato metric are the prior art
  for propagating reputation across a graph, and their known failure is entrenchment: weight flows to
  the already-trusted and the graph calcifies. Attack-resistance in Advogato comes from max-flow
  capacity limits, which is worth reading before anyone proposes "just weight by trust."

And the sybil-resistance question has a cheaper partial answer that costs no cryptography: **a vote
from a rider whose own traces corroborate the fact is worth more than a vote from someone who has
never been there.** Presence is not identity, but it is expensive to fake at scale, and we measure it
anyway.

## Agents hold shares too, and cannot be thanked

Under the symmetry rule, a classifier's proposal is recorded identically to a person's
([`mechanical-turk-ebike.md`](mechanical-turk-ebike.md#agents-and-people-at-the-same-level)), so agents
appear in the provenance annotation with real fractional shares. They are not people and have no use
for gratitude.

Proposal, flagged as a choice rather than a conclusion: **machine-held shares accrue to the commons
pool that funds neglected-area bounties.** The alternative — shares accruing to whoever ran the model —
turns the fair-division machinery into a rent-extraction device pointed at the people doing the
riding, which is the failure mode this whole document exists to avoid.

## Data

```
facts/{id}.yml                # value + provenance annotation (value-level, not row-level)
facts/{id}.shares.yml         # contributor → share, decay clock, last re-verification
thanks/{id}.yml               # giver token (unlinkable), fact, sentence, one per person per fact
ledger/pool.yml               # machine-held shares → neglected-area bounties
```

↑ [`mechanical-turk-ebike.md`](mechanical-turk-ebike.md#attribution-and-thanks--a-reputation-system-with-the-tensions-named) · [`privacy.md`](privacy.md) · [`paid-capture.md`](paid-capture.md) · [`city-record.md`](city-record.md)
