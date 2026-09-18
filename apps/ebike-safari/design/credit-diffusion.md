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

Two things decay is careful **not** to mean:

- **Decay applies to the claim on future thanks, never to the record of the work.** Your 2009
  observation is permanently in the provenance of everything derived from it, at full weight, with your
  name on it if you wanted it there. What fades is your claim on gratitude arriving in 2034 for a street
  you have not looked at since.
- **A stale reading is not a suspect reading.** It was true when it was taken, and it stays true of that
  date forever. Staleness is a statement about our knowledge of *now*, not a demotion of a past
  observation — which is the same point supersession makes below, arrived at from the other side.

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

So: **let people stake against a claim.** But against *which* claim, exactly — and this is the whole
design, not a detail. A challenge does not say "your observation was false." It says **"this is no
longer the case, and I will put something behind saying so."**

> **You short the currency of a fact, never the observation behind it.**

That distinction is structural rather than polite. "Was this ever true?" is a proposition about a
person's competence and it implicates an author. "Is this still true?" has no author at all — it is a
question about a street, and the street is the only thing that can lose. Which means the earlier
observer is not a counterparty because there is nothing for them to be a counterparty *to*, and the
protection needs no policy to enforce it.

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
4. **The observer gets paid either way, from one of two purses.** If the fact stands, the failed
   challenger's stake pays them. If the challenge was right — the street changed, or a reading really
   was mistaken — the stake returns and the **commons pool** pays the fieldwork, because a challenge
   that improved the record produced a public good and should not cost the person who raised it.

That asymmetry is the incentive gradient the system wants: **a correct challenge is free and a wrong
one funds somebody's afternoon.** Neither outcome burns anything, and neither requires anyone to have
been at fault.

Three properties fall out of that structure, and they are why this is worth building rather than merely
arguing about:

- **Disputes self-prioritise the worklist.** The size of the pot on an edge is a better ranking signal
  than staleness, because it measures how much anybody actually cares whether the record is right.
- **Nothing is destroyed.** Stakes are redirected to fieldwork, never burned. A wrong challenge still
  bought the commons a fresh observation, which is why a losing challenger has wasted nothing except
  their own standing.
- **Only re-observable claims are admissible.** A challenge requires that a person at that location
  could still settle it by looking — the `one_look_settles` shape. Two classes are therefore excluded,
  for different reasons: claims that were never decidable (the local's memory of which shop was there in
  1985, where betting would launder an unfalsifiable claim into a settled one —
  [`paid-capture.md`](paid-capture.md#the-rider-is-the-classifier)), and claims that **were** decidable
  but have expired (the van that was in the lane at 14:32, below).

### Supersession is not refutation, and the difference is most of the ethics

When two dated observations disagree, there are four possibilities, and the **most common by a wide
margin is that the street changed.** Someone resurfaced it, ramped the kerb, filled the hole, opened
the shop, closed the shop. Both observations are correct. Neither observer was wrong at any point.

| Outcome | What happened | The earlier observation |
|---|---|---|
| `stands` | Still the case | Confirmed. Share re-earned, decay clock reset |
| `superseded` | **The world changed between the two dates** | Correct then, and now half of a dated change event. Full standing, permanently |
| `both` | They measure different things | Correct. Kept alongside, and the disagreement is the finding |
| `corrected` | Somebody genuinely misread | Correct*ed*, not discredited. No debt, no penalty, no mark |

`superseded` is the default reading, and `corrected` requires **positive evidence of misreading** — an
argument that this specific observer misread this specific thing, made explicitly, never inferred from
the mere fact of disagreement. The register's rule elsewhere is that absence means unknown rather than
false; this is the same rule in the time dimension. *Disagreement means change until shown otherwise.*

`both` is a real and frequent case, not a tie-breaker of last resort. The architecture student who
dates a facade to 1890 against BAG's 1965 has not refuted the registry: it is a renovation year in a
field labelled construction year, and the disagreement is the knowledge
([`paid-capture.md`](paid-capture.md#the-rider-is-the-classifier)).

### A superseded observation gains value. The accounting already says so.

This is the part that needs no generosity, because the algebra chosen at the top of this document
produces it directly.

A change event — *this edge was `sett` on 2009-10-04 and `asphalt` on 2026-09-18, so it was resurfaced
between those dates* — is a **new fact**, and it is **derived jointly from both observations**. In the
provenance semiring, joint use is multiplication: the transition's annotation is the *product* of the
two, not the survival of one. Both observers hold a real share in it, and it could not exist with
either of them missing.

So the earlier observation does not merely avoid a penalty. **It acquires a stake in something that
did not exist before it was contradicted**, and which is often worth more than the original fact was:

- A current-state reading tells you what is there. For *durable* state — surface, kerb height, a
  bollard — anyone can get that by going and looking, which is what makes it cheap. For **ephemeral**
  state it is the reverse, and that case gets its own section below, because almost every rule here
  changes sign.
- A **dated transition** tells you the street changed and roughly when, and that is unobtainable
  without an old observation. It is the entire content of change detection, the thing repeat passes are
  funded to produce ([`paid-capture.md`](paid-capture.md)), and it is why a seventeen-year-old
  photograph is an asset rather than stale data.

Which reverses the naive intuition completely: the moment your 2009 measurement is contradicted is the
moment it starts doing its most valuable work. Nothing about that is charity. It is what the
multiplication in the semiring means.

### How it is said, because that is the whole of "respectful"

Same event, two sentences. Only one of them is true.

| Never | Always |
|---|---|
| "Your claim was overturned." | "Your 2009 observation just dated a resurfacing." |
| ~~`sett`~~ → `asphalt` | `asphalt` since 2026-09-18 · `sett` 2009-10-04 – 2026-09-18 · resurfaced between |
| "Corrected by @someone" | "Superseded. Both readings stand, at their own dates" |

Concretely:

- **No strikethrough, ever.** A struck-out claim is a claim marked as an error, and the overwhelming
  majority of superseded claims are not errors. Superseded readings render as **closed intervals**,
  which is what they are: true from then until then. That is the same stance as claims accumulating and
  never being replaced, with resolution happening at read time.
- **The record is a stratigraphy, not a cache of current state.** Every layer keeps its date and its
  observer. A register that only knows what is true today cannot tell you anything happened, which is
  the difference between a map and a history of a place
  ([`city-record.md`](city-record.md), [`graveyard-soul-city.md`](graveyard-soul-city.md)).
- **This is not a blame view.** `git blame` is attribution wearing the wrong word, and the wrong word
  changes how people read the screen. Nothing here is named for fault: `observed_by`, `superseded_by`,
  and no view anywhere assembles a list of a person's overtaken claims.
- **The notification goes to the earlier observer as news, not as a verdict**, and it carries the
  interesting part: what changed, when it must have happened, and their share in the transition. Being
  told your old work just produced a finding is a different message from being told you were wrong, and
  it is the accurate one.

### Honest error, which is the rare case

Even when a reading really was mistaken, the design does not punish it, for a reason that is about the
dataset rather than about kindness: **if being wrong costs the author, the rational strategy becomes
reporting only certainties.** Every uncertain observation stops being filed, which destroys both
*illegible is a legitimate answer* and *absence means unknown*, and leaves a register containing only
the facts nobody could dispute — the boring ones.

So the stake stays asymmetric, and the author is never a counterparty:

| | Earlier observer | Challenger | Observer who settles it |
|---|---|---|---|
| Stakes anything | **No.** Never | Yes, and it costs, or challenging is free harassment | No |
| Fact `stands` | Share re-earned, decay reset | Stake pays the observer | Paid |
| Fact `superseded` | Full standing kept, **plus a share in the transition** | Stake returned, plus credit | Paid |
| Fact `corrected` | Loses only the share on that value. No debt, no penalty, no mark | Stake returned, plus credit | Paid |

And a correction still names the observation it corrected as its own foundation, because the corrector
needed it to know where to look and what to look at. An error that led somebody to the right place did
more for the record than a silence would have.

### Ephemeral observations, where every rule above changes sign

*This van is blocking the lane, here, now.*

That is a fact, it matters more than most of the durable ones — a hole costs you a rim, a blocked lane
puts you in the traffic lane — and it is **gone in four minutes.** Nobody can go and look. The witness
is the only person who will ever be able to confirm it, and they cannot confirm it twice.

Set the two classes side by side, because the design consequences are not adjustments, they are
inversions:

| | Durable state | Ephemeral event |
|---|---|---|
| Example | `surface=sett`, kerb 4 cm, a bollard | A van in the lane, a flooded underpass, a market stall, a police cordon |
| Re-observable | Yes, by anyone, indefinitely | **Never.** By nobody, from the moment it ends |
| Cheap to acquire | Yes — go and look | **No.** Only a witness who was there, then |
| Can be challenged | Yes. Settlement is a ride | **No.** There is no possible settling observation |
| One observation is | A fact | **A sample** |
| The durable artifact | The reading itself | The **distribution** it belongs to |

**So a challenge against an ephemeral observation is inadmissible, and not for the reason the
undecidable-claims rule gives.** The local's memory of a 1985 shop is unfalsifiable in principle. A van
at 14:32 was perfectly decidable — for about four minutes, by whoever was standing there. It is
unfalsifiable *in practice, permanently, from the instant it ended*, and a dispute mechanism whose
oracle is "somebody rides there and reports" has nothing to offer it. Opening a market on it would just
be adjudicating a rider's word about something nobody can check, which is the worst thing this system
could learn to do.

### The sample is not the fact. The envelope is.

One van is an anecdote. Forty reports at the same twenty metres across three months is
**"this loading bay is blocked most weekday mornings between 08:00 and 09:30"**, and that sentence is
durable, checkable, arguable, and worth a curb redesign.

This is the same move the design already makes three times, and it is worth naming as one rule rather
than rediscovering it per layer:

| Perishable sample | Durable fact it builds |
|---|---|
| One impulse | A pothole cluster at a coordinate ([`bumps-as-input.md`](bumps-as-input.md)) |
| One short pass at a light | A wait envelope by hour and kind of day ([`wait-points.md`](wait-points.md)) |
| One swerve | A hazard, or a puddle where water pools ([`transgression.md`](transgression.md)) |
| One blocked lane | A schedule of obstruction at a curb ([`sources/blocked-bike-lanes-record.md`](sources/blocked-bike-lanes-record.md)) |

> **Credit attaches to the envelope, not to the instance.** You hold a share in the schedule, alongside
> everyone else who ever reported that curb, and the share is proportional and decays exactly like any
> other. Nobody is ever paid, thanked, or scored for a single sighting.

Which resolves the tension cleanly. Ephemeral data is simultaneously the most valuable — it is the only
kind that cannot be bought later at any price, because the moment has gone — and the least verifiable.
Those two facts together are precisely the argument for **funding the aggregate and never adjudicating
the instance.**

### Verification by co-presence, and why passive beats voluntary

Ephemeral events do have a verification route; it is just orthogonal to the one used everywhere else.
Not re-visitation later, but **temporal co-presence**: another rider who passed within the window and
recorded the same thing. Corroboration in the moment is the only kind available, and it is weak,
occasional, and worth having anyway.

The stronger route needs no reports at all, and it is the reason `bumps-as-input.md` matters more than
the camera here. A vehicle in the lane produces a **forced merge** — a lateral displacement out and
back — in every rider who passes it, recorded passively, naming nobody, requiring no decision and no
stop ([`bumps-as-input.md`](bumps-as-input.md#three-axes-not-one)).

That yields the property voluntary reporting can never have: **passive measurement produces negatives.**
A rider who passed and filed nothing tells you almost nothing, because absence means unknown — they may
simply not have bothered. A rider whose trace shows a straight line through that curb at 08:15 is
evidence the lane was clear, and it cost them nothing to provide. You cannot build an honest denominator
out of volunteered sightings; you can build one out of everybody's motion.

### The enforcement fence, which is the same fence as everywhere else

An ephemeral report about a street is a measurement. An ephemeral report about a *van* is an
**accusation**, and the subject is a person. The fork is already recorded
([`sources/blocked-bike-lanes-record.md`](sources/blocked-bike-lanes-record.md), where Bike Bureau's
trophy case for *"licence plates you've captured"* is the road not taken), and the credit rules here
follow from it without needing new principles:

- **No bounty per infraction.** Paying per sighting builds the volume gradient banned everywhere else in
  this project — score the report and never the impact, pay by the minute and never by the finding
  ([`paid-capture.md`](paid-capture.md#the-labour-part-which-is-not-a-footnote)). A per-ticket cut turns
  riders into a commissioned police force, and every argument against that is an argument we already
  make about loot boxes.
- **No plate in the commons.** The envelope needs no plate to exist — a schedule of obstruction is built
  from geometry and time. A fleet of bicycles reading number plates into a shared database is an ANPR
  network, and it would be an ANPR network available to whoever subpoenas it. We are not building that,
  and declining is cheap, because it costs the aggregate nothing.
- **Enforcement is the rider's own act, outside this system.** Their photo, their gallery, the city's own
  reporting channel, no points. Filing a citation is a legitimate thing to do and it earns nothing here.
- **A schedule argues with a curb; a ticket argues with a driver.** The SF study's own policy conclusion
  was loading zones rather than more citations, and the aggregate is the artifact that makes that
  argument.

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

Not a prediction market. A **funding mechanism for fieldwork wearing a market's clothes**: a way for
anyone who doubts the record to convert that doubt into somebody standing on the street, paid. If it
ever starts behaving like an actual market — price discovery, secondary trading, positions held for
profit rather than to trigger an observation — it has drifted and should be cut back.

And the proposition on the table is always *"is this still the case?"*, never *"was this person
wrong?"* — which is why the mechanism can be adversarial about facts while being structurally incapable
of being adversarial about people.

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
facts/{id}.intervals.yml      # every reading as a closed interval: value, from, until, observer
transitions/{id}.yml          # a dated change, derived jointly — both observers hold shares in it
thanks/{id}.yml               # giver token (unlinkable), fact, sentence, one per person per fact
draws/{id}.yml                # lottery: tickets in, winner out, odds as published beforehand
disputes/{id}.yml             # challenge: what it claims instead, stake, frozen payouts, settling report
ledger/pool.yml               # machine-held shares → bounties, and fieldwork on correct challenges
```

↑ [`mechanical-turk-ebike.md`](mechanical-turk-ebike.md#attribution-and-thanks--a-reputation-system-with-the-tensions-named) · [`privacy.md`](privacy.md) · [`paid-capture.md`](paid-capture.md) · [`city-record.md`](city-record.md)
