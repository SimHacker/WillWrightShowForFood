# Credit diffusion — blended provenance, and paying thanks out proportionally

The proposal: facts are aggregates blended from many riders, so track each contributor's **partial
share** of every derived fact, and when a thank-you arrives at that fact, pay it out to the
contributors in proportion. One vote per person. This rewards verification, because corroborating an
existing fact buys you a stake in it.

This is not a dream. It is two solved problems and one hard one, and it is worth knowing which is
which before building it.

Two mechanisms arrive later in the document and change its shape, so they are worth flagging here. A
**lottery** is how an indivisible thing gets allocated in proportion to a continuous share — dithering,
with the participant's self-interest supplying the consent that noise never gets. And a **short side**:
without a way to stake *against* a fact, every incentive here rewards adding and agreeing, and the
record inflates.

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

## The lottery — dithering a continuous share into an indivisible thing

Accumulation is one answer to indivisibility. The other is a **lottery**, and it is the better one for
the message, because a lottery is how you dither a continuous probability into a discrete outcome
*with the participant's own motive supplying the consent*.

That is the part that makes it more than a rounding trick. Randomisation is normally something done
**to** data, and it is resented accordingly — nobody wants noise added to their contribution. A
lottery is the identical operation with a stake attached, so nobody has to be talked into the
randomness; they are already leaning in. **If you must randomise, make the randomness a prize.**

This app already runs on that principle without having named it. A short pass at a wait point draws
`Bernoulli(p)` and the coin, not a verdict, decides the fine
([`transgression.md`](transgression.md#dithered-fine-at-wait-points)); every drawbridge is a lottery
([`wait-points.md`](wait-points.md#drawbridges-are-the-lottery)). Those work because the entropy is
*fun* — a fine you might dodge is a game, and the same fine issued by a certainty engine is a
speeding camera.

### The precedent is lottery scheduling

Proportional-share allocation of an indivisible resource by weighted lottery is
Waldspurger and Weihl, **OSDI 1994**
([paper](https://www.usenix.org/legacy/publications/library/proceedings/osdi/full_papers/waldspurger.pdf)):
hand out tickets in proportion to entitlement, draw one at random, and the winner gets the whole time
slice. Expected allocation is proportional to tickets, and the resource never has to be divisible.

The mapping onto this problem is exact, which is worth stating because it means the mechanism is
borrowed rather than invented:

| Lottery scheduling | Here |
|---|---|
| Tickets | Your share of the fact, from the provenance annotation |
| The indivisible resource | One thank-you message, whole, with its sentence |
| Expected share of CPU ∝ tickets | Expected share of gratitude ∝ contribution |
| Ticket inflation / transfer | Share decay, and the neglect multiplier issuing extra tickets |
| Currencies for delegation | Machine-held shares assigned to the commons pool |

Its known weakness transfers too, and matters more here than it did for CPU: a lottery is fair *in
expectation*, and over a small number of draws it is lumpy. A scheduler runs a million lotteries a
minute so variance vanishes; a fact might collect four thank-yous ever, and the rider who did most of
the work can easily receive none of them. Gratitude is not a time slice — losing three draws in a row
reads as being ignored, not as variance.

So the two mechanisms compose rather than compete, and they split along the line the table above
already draws:

| | Mechanism | Why that one |
|---|---|---|
| **The message** | Weighted lottery, drawn per thank-you | Must arrive whole and now. Indivisible, so expectation is the only honest proportionality available |
| **Standing** | Accumulated exact fractions | A ledger can afford arithmetic. No variance, no luck, and it is what routing decisions read |

Lumpiness in the message is then survivable, because the ledger is not lumpy: nobody's record of what
they contributed depends on whether they won a raffle.

### The fence, because this is a gambling mechanic

A weighted lottery for money, in an app that asks people to ride bicycles in traffic, is a loot box
with a road hazard attached. Four rules, and they are structural rather than intentions:

- **Never for pay.** Paid capture pays by the minute, deterministically
  ([`paid-capture.md`](paid-capture.md#the-labour-part-which-is-not-a-footnote)). Converting wages
  into a draw is wage theft with a casino on top. Lotteries allocate *indivisible symbolic* goods
  only: a message, an attribution slot, a ceremony, a review slot.
- **No odds that improve with physical risk.** The tickets come from the completeness of a report,
  never from the size of an impulse ([`bumps-as-input.md`](bumps-as-input.md#the-sacrificial-hit)).
  A lottery whose odds rise when you hit the pothole harder is a machine for breaking wrists.
- **Published odds.** You can read your ticket count and the draw size before the draw. A `p` the
  participant cannot see is a slot machine — the same rule that makes buffs visible
  ([`transgression.md`](transgression.md#buffs--the-multipliers-are-data-and-they-say-where-they-came-from)).
- **No near-miss theatre.** No "you were one ticket away." The draw resolves and says who won. Near-miss
  presentation is the specific mechanic that makes slot machines addictive, and it would be trivial to
  add here, which is why it is banned here.

### Where else a lottery is the right shape

- **Worklist assignment.** Neglect-weighted tickets mean an unchecked edge in Nieuw-West is drawn more
  often than the Damrak, so coverage spreads without anyone assigning work
  ([`mechanical-turk-ebike.md`](mechanical-turk-ebike.md)). Lottery scheduling, applied to attention.
- **Review sampling.** Which confirmed claims get audited anyway. Weighted by reputation *inversely* —
  routing, never permission.
- **Which ghost gets a ceremony this week.** A drawn spot is an invitation; a ranked list is a chore.

Every one of those draws is safe to re-flip, because in all of them **convergence is the feature**: we
*want* the long run to track the tickets. That is exactly the property a coin must not have when it is
hiding something, which is the distinction drawn in
[`publishing.md`](publishing.md#the-coin-that-must-not-be-re-flipped).

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

That is only the smaller correction. The larger one is that everything above is a **long position.**

## Betting against a fact — the short side, and why the system needs one

Thanks, shares, corroboration and standing all point the same way: they reward *adding* and
*agreeing*. Nobody in that system is paid to find out that something is **wrong**. A reputation
market with only a thank-you button is a market with no short side, and it will inflate — a wrong fact
with three confirmations becomes harder to dislodge than a missing fact is to add, which is precisely
how map data rots. The unglamorous truth about markets finding fraud is that the short sellers found
it, because they were the only participants being paid to look.

So: **let people stake against a claim.** A challenge says *I think this is false, and I will put
something behind saying so.*

### The settlement problem is the whole payoff

Every betting scheme dies on the oracle question — who decides who won? Here the answer is unusually
good, because the thing that settles a dispute about a street is **somebody going and looking at the
street**, and that is the exact activity this entire app exists to produce.

So a challenge does not open a market. It opens a **funded task**:

1. Someone stakes against a fact. The fact is flagged disputed, and its share payouts freeze.
2. The stake becomes a bounty on a worklist entry at that location
   ([`mechanical-turk-ebike.md`](mechanical-turk-ebike.md)), with the disagreement written into the
   task so the observer knows what is actually in question.
3. Somebody rides there and reports. That report settles it.
4. **The loser's stake pays the observer.** Either way, the person with the muddy shoes gets paid, the
   fact gets a fresh measurement, and the dispute is resolved by evidence rather than by vote.

Three properties fall out of that structure, and they are why this is worth building rather than merely
arguing about:

- **Disputes self-prioritise the worklist.** The size of the pot on an edge is a better ranking signal
  than staleness, because it measures how much anybody actually cares whether the record is right.
- **Nothing is destroyed.** Stakes are not burned; they are redirected to fieldwork. A wrong challenge
  still bought the commons a fresh observation, which is why a losing challenger has not wasted
  anything except their own standing.
- **Undecidable claims are excluded by construction.** A challenge is only admissible against a claim a
  person at a location could settle by looking — the `one_look_settles` shape. The architecture
  student's dated facade qualifies; the local's memory of which shop was there in 1985 does not, and
  betting on it would launder an unfalsifiable claim into a settled one
  ([`paid-capture.md`](paid-capture.md#the-rider-is-the-classifier), where testimony is recorded as
  testimony and never promoted automatically).

### The version that fails, and the asymmetry that fixes it

The obvious design — both sides stake, winner takes the pot — is fatal here, and it is worth being
precise about why. If being wrong costs the author, the rational strategy becomes **reporting only
certainties**, and every uncertain observation stops being filed. That would destroy the two rules
this project most depends on: *illegible is a legitimate answer* and *absence means unknown*. A system
that punishes honest error collects only the boring facts.

So the stake is **asymmetric, and the author is never a counterparty:**

| | Author of the fact | Challenger | Observer who settles it |
|---|---|---|---|
| Stakes anything | **No.** Never | Yes, and it costs, or challenging is free harassment | No |
| If the fact stands | Keeps their share | Stake pays the observer | Paid |
| If the fact falls | Loses the *share*, keeps everything else. No debt, no penalty, no mark | Stake returned, plus credit for having been right | Paid |

Being honestly wrong therefore costs you a share that was decaying anyway, and nothing more. There is
no mark on a person for having reported something that turned out to be false, because the alternative
is a register full of only the things nobody could dispute.

### Fences, most of which already exist

- **You bet against a claim, never against a person.** The contributors to a fact are not shown to a
  challenger, and there is no record anywhere of who has been proven wrong how often. That number would
  be the most destructive statistic in the system, and it is therefore not computed.
- **Stakes are standing, not money.** Non-transferable, non-cashable, rate-limited by the same
  one-person budget as votes. This kills the whale — someone rich cannot challenge everything — kills
  the gambling-regulation problem, and keeps the mechanism inside the fence already drawn above:
  lotteries and stakes allocate indivisible symbolic goods, never wages.
- **A challenge must say what it claims instead.** "This is wrong" is not admissible; "this is
  `surface=asphalt`, not `sett`" is. An unfalsifiable challenge is just a downvote with extra steps,
  and it puts no obligation on the challenger to have looked at anything.
- **Standing cannot gate a challenge.** A newcomer's first challenge must be able to overturn a
  veteran's fact — reputation routes, never permits, and that rule does not get an exception because
  money-shaped tokens are now involved.

### What this is, in one line

Not a prediction market. A **bug bounty on the map**, where the bounty is paid by whoever was wrong and
collected by whoever went outside. The betting is a funding mechanism for fieldwork wearing a market's
clothes, and if it ever starts behaving like a market — price discovery, secondary trading, positions
held for profit rather than to trigger an observation — it has drifted and should be cut back.

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
draws/{id}.yml                # lottery: tickets in, winner out, odds as published beforehand
disputes/{id}.yml             # challenge: what it claims instead, stake, frozen payouts, settling report
ledger/pool.yml               # machine-held shares → neglected-area bounties
```

↑ [`mechanical-turk-ebike.md`](mechanical-turk-ebike.md#attribution-and-thanks--a-reputation-system-with-the-tensions-named) · [`privacy.md`](privacy.md) · [`paid-capture.md`](paid-capture.md) · [`city-record.md`](city-record.md)
