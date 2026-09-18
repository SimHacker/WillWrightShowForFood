# Publishing — the darkroom, and why redaction is the medium

Publishing a ride is not a button. The auto-redaction runs, and then the result opens in an editor
where you see **the exact artifact that will leave**, on a map, and work on it until it says what you
meant. Review, re-clip, abstract, annotate, style, and only then send.

That editor turns out to be the expressive centre of the app rather than a safety dialog bolted to the
front of it, and there is a specific reason why: **the control that protects you and the control that
makes the ride worth looking at are the same control.** Both are reductions in resolution, and
McCloud already explained why lowering resolution is a purchase rather than a loss.

## One distinction the whole design rests on

Two operations happen in this editor and they must never share a control.

| | **Subtraction** | **Addition** |
|---|---|---|
| Verbs | Clip, drop, coarsen, snap, bin, blur | Name, frame, annotate, style, emphasise, narrate |
| Does for you | Safety | Authorship |
| Published as | Fewer measurements | Claims *by you*, marked authored |
| Feeds aggregates | Yes | **Never** |
| In the darkroom | You may always subtract more, never less | Unlimited |

Confusing them is the one way to get this wrong, and it has a precise technical form.

**Coarsening is subtraction. Jitter is addition. They are not variations on each other.** Dropping
your trace to the street graph, or to a district-level squiggle, throws information away and no amount
of repeated publishing brings it back. Adding a random offset keeps the information and hides it
behind a zero-mean random variable — which multiple correlated publications **average out**. That is
not a hunch; it is countermeasure C2 in the CCS 2022 evaluation, measured at *no change in attack
success rate* ([`sources/strava-privacy-zones.md`](sources/strava-privacy-zones.md)). C3, shifted
endpoints, failed the same way for the same reason. The one that worked was C4: truncate, and do not
count the hidden part in anything published.

So: **a noise slider is offered as a style and refused as a defence.** Nothing in the interface may
suggest that hand-applied wobble protects you, because a rider who believes it publishes more, not
less. If a control makes you safer, it removes something. If it makes the ride prettier, it adds
something. No control does both, and the two live in different panels.

## The coin that must not be re-flipped

The app is full of coins, and they are not all the same coin. A short pass at a wait point draws
`Bernoulli(p)` and takes the fine or does not; a swerve draws at low `p`; every drawbridge is a lottery;
a thank-you is allocated by weighted draw
([`transgression.md`](transgression.md#dithered-fine-at-wait-points),
[`credit-diffusion.md`](credit-diffusion.md#the-lottery--dithering-a-continuous-share-into-an-indivisible-thing)).
All of those are dithering — a continuous quantity turned into discrete outcomes that track it in
aggregate — and all of them are re-flipped every time, deliberately.

So the rule cannot be "randomness good" or "randomness bad." It is:

> **Dither where convergence is the feature. Freeze where convergence is the attack.**

| | Wait-point fine | Privacy jitter |
|---|---|---|
| What the long run should do | Track `p` exactly. That *is* the score | Reveal nothing. Ever |
| Effect of re-flipping | Correctness. One light is a coin, not a verdict | Fatal. Repeated publication averages the offset away |
| Therefore | Fresh coin per event | A fresh coin per publication is the bug |

That is the whole content of CCS 2022's C2 result, stated as a design rule rather than a measurement.
Averaging is what makes the dithered fine honest and what makes noisy geometry useless.

Which means noise about a secret is not categorically hopeless — it has one hard requirement. **The
coin must be a function of the secret, not of the moment:** flipped once, memoized against that value,
and reused forever, so repeated publication yields the same answer and there is nothing to average.
This is *permanent randomized response*, the mechanism at the centre of Google's RAPPOR
(Erlingsson, Pihur, Korolova, CCS 2014 —
[paper](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/42852.pdf)),
built for exactly this failure: a memoized per-value response defeats longitudinal averaging, with a
fresh layer over the top for unlinkability. The lineage runs back to Warner's randomized response
(1965), which is older than the problem we are applying it to.

Two things follow, one of which the design was already doing without naming it:

- **`no regenerated boundaries` is a frozen coin.** A private region is resolved once and kept
  ([`privacy.md`](privacy.md#private-regions--you-declare-them-the-app-works-out-the-shape)), because
  re-randomising per ride hands an attacker independent samples of the same protected location. That
  rule generalises: any randomness protecting a fixed secret is memoized against the secret.
- **The style jitter in the darkroom stays frozen too**, per publication and per ride, not because it
  protects anything, but because a wobble that redraws itself on every render is a tell about the
  underlying line, and consistency is what makes it read as a drawing rather than as an artifact.

## The McCloud knob

> **You can trade resolution for identification.** That is the essence of *Understanding Comics*, and
> it is an exchange rate, not a compromise.
> — [`skills/design-sense/lenses/masking.md`](https://github.com/SimHacker/moollm/blob/main/skills/design-sense/lenses/masking.md) (moollm)

The image that goes with it: *lowering the resolution is like taking the batteries out of a talking
doll.* A doll that talks says the same sentence forever in someone else's voice. Take the batteries
out and it says whatever the child needs it to say this afternoon.

A metre-accurate polyline with timestamps is the talking doll. It says one sentence forever, that
sentence is *this specific person went from this door to that door at 07:41*, and it is simultaneously
the least shareable and least evocative version of the ride. Abstract it and two things arrive at
once: the attacker loses the input, and the reader gets somewhere to stand. A squiggle through the
Jordaan is anybody's Tuesday, which is exactly why it can be yours.

The knob has rungs, and each one is a real publication format rather than a degradation of the good
one:

| Rung | What leaves | What a reader gets | What an attacker gets |
|---|---|---|---|
| **Trace** | Clipped polyline, coarse times | The actual line, for a route somebody could ride | The most. Reserved for named audiences |
| **Snapped** | Sequence of OSM way IDs, no geometry of yours | A route, replayable, with none of your GPS in it | Way IDs everyone already has |
| **Named** | Ordered street names, no coordinates | "Marnixstraat, then the Jordaan, then along the Amstel" — the way people actually describe a ride | Word order |
| **Squiggle** | A hand-drawn-looking line through districts | The shape and the feel; a postcard | A shape, matching thousands of rides |
| **Sentence** | "A wet Tuesday in the west, 22 km, three appalling junctions" | The whole point of the ride, often | Nothing useful |
| **Findings only** | The per-edge contributions, no ride at all | Surface, bumps, waits — the commons material | Nothing. This is the default |

The default publication is the bottom row: findings with no ride attached
([`privacy.md`](privacy.md)). Everything above it is a deliberate act of authorship, and the ladder
runs *downward* into more expression, not less.

## You look at the artifact, not at a promise about it

Strava's privacy zone is invisible. You cannot open the thing you published and see the hole; you
trust that it worked, and for 84% of users it did not
([`sources/strava-privacy-zones.md`](sources/strava-privacy-zones.md)). That failure is a UI failure
before it is a cryptographic one.

This is Ted Nelson's complaint about the clipboard, one domain over: he coined *cut and paste* for the
visible rearrangement of writing, and the desktop took the words and attached them to a hidden,
single-slot buffer with no history, no identity, and no way to see what it holds — *a thing that holds
something of yours that you are not allowed to look at*
([`designs/pie-stack-views/VIEWS-AS-TESTIMONY.md`](https://github.com/SimHacker/moollm/blob/main/designs/pie-stack-views/VIEWS-AS-TESTIMONY.md#visible-clipboards-and-conveyor-belts)).
A publication is a much more consequential invisible buffer than a clipboard, and it gets the opposite
treatment:

- **The pane shows the artifact, not a preview of one.** What is rendered is the file that uploads,
  parsed back from the bytes that will be sent. Not a mock-up of it, not the local ride with a mask
  drawn over it. If those two can disagree, the bug is unfindable by exactly the person who needs to
  find it.
- **Two panes, and a diff.** What you rode, beside what leaves, with the difference drawn. The clip is
  legible as a clip — you can see that three minutes and 900 metres are gone from each end, without
  being shown what was in them.
- **It has a name, a history, and a home.** Every publication is a file on your disk with a date, a
  recipe and a diff against the last one. Unpublishing is deleting a thing you can point at.
- **`hide_existence` is visible too.** The pane that shows "nothing about today leaves" is as
  important as the one showing a route, because silence is a publication decision and needs the same
  confirmation surface.

## The negative and the print

The ride on your device is a negative. A publication is a print, and the darkroom never touches the
negative.

Every redaction is therefore a **recipe** — an ordered, named, non-destructive stack over an immutable
local original, the way a raw photo edit is a list of operations rather than a modified file. Which
answers your *dedactor* directly: un-redaction is always available locally, because nothing was
destroyed, and the stack runs backwards on demand.

Consequences that fall out for free:

- **One negative, many prints.** Your partner gets the trace rung. Your riding club gets snapped. The
  public gets the squiggle. The municipality gets findings-only plus three annotated potholes. Same
  ride, four prints, four audiences, one source, no duplicate truth.
- **Presets, and they are a style.** "My usual" is a saved recipe. It can be *shared without sharing
  any ride* — a redaction style is a publishable artifact of its own, and a good one from someone who
  has thought hard about it is worth more to a newcomer than a settings page.
- **Dodge and burn.** Emphasis is a local operation: this junction at full detail because it is the
  point, the rest at squiggle resolution because it is context. Uniform resolution across a whole ride
  is a technical default, not a design.
- **Reproducible.** Recipe plus negative equals print, deterministically, so a publication can be
  re-rendered when the rungs improve, and a bug in a rung is fixable retroactively for anything not
  yet sent.

## Publication is where you choose what the ride *was*

The engine emits facts. It does not decide what they meant — that is the construction-set layer
([`transgression.md`](transgression.md#where-a-swerve-means-something-the-construction-set-level)),
where one `SWERVE` reads as a transgression to a vampire, a wobble to a cargo-bike parent, and a
puddle to the surface survey.

The darkroom is where the **rider** takes that same position over their own afternoon. One set of
measurements, and a choice of what to make of it:

| Published as | Foregrounds | Drops |
|---|---|---|
| Surface survey | Roughness per edge, the sacrificial hits | The route, the times, you |
| Photo essay | Six frames and what you said at them | Everything between them |
| Transgression scorecard | The meter, the buffs, the dismounts | Where, mostly |
| Architecture walk | Gables, periods, the misattributions | Speed, effort, hazards |
| One complaint | A single junction, in full detail | The other 21 km |
| The shape of a day | The squiggle and a sentence | All of it, gladly |

Choosing among those is the authorship, and it is not a metadata chore — it is the same act as a
saved view being *an opinion about what matters, recorded as data*
([`VIEWS-AS-TESTIMONY.md`](https://github.com/SimHacker/moollm/blob/main/designs/pie-stack-views/VIEWS-AS-TESTIMONY.md)).
A published ride is testimony about what mattered on it, and because the recipe is data, publications
are comparable, diffable and remixable: two riders down the same street who published different rides
have a documented disagreement about what that street is, which is more interesting than either
publication alone.

## The trap, named

A review step everyone clicks through is worse than no review step, because it launders the
responsibility onto the rider. Consent theatre with a map in it.

Four rules keep it out:

1. **The default must be safe unreviewed.** The clip happens at the source, before a ride record
   exists ([`privacy.md`](privacy.md)); the darkroom cannot un-clip it. Review makes the artifact
   *better*, never *safer*. Anything whose safety depends on the rider opening this editor is
   misdesigned, because most people will not open it most days, and they are right not to.
2. **Never ask for approval of something only an expert could judge.** "Publish these 47 per-edge
   contributions?" is not a question, it is an abdication. The rung is the unit of consent, because a
   rider can actually see what a rung means.
3. **No confirmation dialogs. Show the artifact.** An "are you sure?" transfers liability without
   transferring understanding — same failure as the bump interpreted as an undo gesture
   ([`bumps-as-input.md`](bumps-as-input.md)).
4. **The one-day buffer is what makes review unhurried.** Publishing defaults to yesterday's ride, so
   the darkroom is never a checkpoint standing between you and getting off the bike.

## Fiction is allowed, and it is fenced

Decoy routes and invented rides poison a commons that everyone's routing depends on, so
[`privacy.md`](privacy.md) refuses them — the objection being that there was no way to mark a ride as
fiction. The recipe *is* that mark. So the rule lands precisely:

- Anything added in the darkroom carries `source: authored`, and **aggregates consume `measured`
  only.** A drawn line, an imagined detour, a wobble applied for looks, a ride through the canal are
  all publishable as pictures and are structurally incapable of becoming a surface statistic.
- Authored material renders visibly as authored, on the figure-ground principle that commentary must
  read as commentary and not as the thing commented on
  ([`PERIPHERAL-VIEWS.md`](https://github.com/SimHacker/moollm/blob/main/designs/pie-stack-views/PERIPHERAL-VIEWS.md)).
- What is still refused is *unmarked* fiction — an authored line that claims `measured`. Not because
  it is dishonest to the reader, but because it is dishonest to the arithmetic.

## The recipe

```yaml
publication:
  id: 2026-09-17-jordaan
  negative: rides/2026-09-17T14:03.fit    # never leaves, never modified
  audience: public                        # public | link | named:<who> | municipality
  rung: squiggle

  subtract:                               # safety. Ordered, and applied before anything else
    - clip: private_regions               # from privacy.md. Not optional, not visible as a toggle
    - coarsen: { time: 1h, geometry: district }
    - drop: [speech, frames, elevation]

  add:                                    # expression. Marked authored, excluded from aggregates
    - annotate:
        at: way/8823771
        text: "This junction has been wrong since the roadworks and everyone here knows it."
    - emphasise: { at: way/8823771, rung: trace }   # dodge and burn
    - style: { line: hand_drawn, jitter: 12m }      # a look. NOT a defence, and labelled as such

  findings:                               # measured, feeds the commons, independent of the above
    publish: true
    threshold: multi_rider                # from privacy.md

  diff_against: 2026-09-10-jordaan
```

Two properties of that file matter more than its fields. `subtract` runs first and cannot be reordered
after `add`, so no authored material can survive a clip that should have removed it. And `findings`
is a separate decision from the whole rest of the document, because contributing to the commons should
not require publishing a ride at all — which is the default, and the reason most riders will never
open the darkroom and will still be the people this app is for.

↑ [`privacy.md`](privacy.md) · [`transgression.md`](transgression.md) · [`camera.md`](camera.md) · [`embedding-views.md`](embedding-views.md) · [`sources/strava-privacy-zones.md`](sources/strava-privacy-zones.md)
