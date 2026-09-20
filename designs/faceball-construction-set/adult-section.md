# The adult section

> **Opt-in, curtained, and labeled.** This file exists so the
> [main design](README.md) does not have to carry it. Nothing here is on by default, nothing here is
> pointed at a private person, and the uploadable default cut is the censored one.

*Part of [`designs/faceball-construction-set/`](README.md).*

**Read in order.** The first half is about how censorship behaves, and it is general — it would read the
same if this palette were hats. The anatomy arrives in the second half, as the demonstration. That
ordering is deliberate: the claim being made here is counterintuitive enough that leading with jiggling
body parts would make it look like a joke dressed as an argument, when it is an argument that happens to
be funny.

## How it is gated

A conspicuously labeled corner of the parts palette, behind curtains you choose to walk through, with
a visible cue that you are entering it. The rest of the kit — googly eyes, umbrella hats, creature
avatars — stays out front and all-ages.

**The register is cheezy on purpose.** Spencer's Gifts bachelor party, not a porn store; the
self-deprecating we-know-it's-dumb cheesiness is what keeps it fun rather than gross.

**It is there for everybody and aimed at nobody.** No presumption is made about any guest. Showing
someone the tools and mentioning that this opt-in section exists is the entire interaction; whether
anyone walks through the curtain is their business, with no expectation either way.

The tonal model to read this against is
[Maurice](inspirations.md#maurice-the-magnificent--create-a-sim-as-an-agent), who manages costume,
gender and body play as celebration rather than as a punchline. If a gag here reads as shaming
somebody rather than as absurd, it is wrong and Maurice is the check.

## Abstraction instead of anyone's photograph

The design rule that makes the satire both safer and funnier, and the one every other rule here depends
on: **abstract the gag away from any real photograph or name.** Ship a generic cartoon part that
everyone recognizes instantly, snappable onto any body, rather than a specific person's image.

No photo means no copyright exposure and nobody outed. And the cartoon is simply the better joke — the
recognition does the work, so naming a target adds nothing. Parameters are knobs precisely because the
comedy is in the physics misbehaving, not in whose body it is.

## Modifiers are the actual design idea

The parts are unremarkable. **The composability is the point**, and it is the same modifier protocol
the rest of the kit uses — stackable filters, chained in any order, on any part.

| Modifier | What it does |
|---|---|
| **Size filter** | Scales a part from its base anchor; the root stays pinned and it grows outward, with optional taper and curve |
| **Rotation engine** | Spins a part on its axis, helicopter style, optionally synced to music BPM |
| **Pixelization** | Attaches a bounding box that drives a censorship mosaic of the layer underneath |
| **Lights** | Attachable emitters with colour, intensity, falloff and blink — see [lighting](#lights-are-parts-too-and-lighting-is-what-sells-it) |

They are the visual cousins of [Laurie Anderson](../../characters/laurie-anderson/README.md)'s pitch-shifted **"Voice of Authority"** — a filter that
manufactures authority — and the size filter is marketed deadpan as its anatomical equivalent, which is
the satire of male carte blanche rather than an endorsement of it.
See [`characters/laurie-anderson/ideas.md`](../../characters/laurie-anderson/ideas.md).

**Everything in the second half of this document is these modifiers stacked.** No new subsystems, which
is the test any addition to this kit has to pass.

## What censorship actually does

This is the part worth reading even if the palette does not interest you, because it is a claim about
redaction in general and it is not obvious.

**The prediction this section adopts: a tightly tracking mosaic is considerably more obscene than the
uncensored thing would have been.** Not a paradox, not a joke about prudes, and not specific to bodies —
a predictable consequence of three mechanisms, two of which have decades of evidence behind them.

### 1. The occluder is evidence

A redaction is an assertion by the producer that something here needed covering. Remove the thing, keep
the certificate that the thing was worth removing, and the audience is handed a maximal version for
free. **The mosaic does not conceal a claim; it makes one.**

**The political version is why this deserves a design document rather than a snicker.** Effort spent
suppressing a document is read by everybody as a measurement of what the document contains, and the
harder the fight, the larger the thing the public constructs. That is why the long battle over the
Epstein files functions as an accusation in its own right: the resistance is legible even when the
contents are not, and audiences — correctly recognising that nobody fights this hard over nothing —
update accordingly.

**Two things are true at once, and this section needs both.** Updating on suppression effort is
rational, because concealment really is correlated with content. And that update is *not* proof, because
**the same mechanism fires when there is nothing behind the occluder at all.** A redaction produces
conviction without evidence, and the conviction does not care whether it is warranted.

Which makes suppression self-defeating rather than merely risky, and it is
[the Streisand argument](#why-any-of-this-is-in-a-construction-set-the-streisand-argument) with real
stakes: once the fight itself is the signal, you cannot climb back out by winning it. Even a full release
lands as a partial one, because an audience that inferred the contents from the concealment has no reason
to accept the concealer's accounting.

`needs-check: keep this at the level of the mechanism. Documented: a years-long Trump-Epstein social`
`association, Trump's own 2002 remarks about Epstein, and a protracted public and legal fight over`
`disclosure of Epstein-related files. NOT asserted here: any specific claim about what the files say`
`about Trump, or that being named in a document constitutes wrongdoing — many people are named in such`
`files incidentally. Verify dates, statutes and filings before any of this appears in a published script.`

There is a neat closing of the loop inside this very file: the
[`trump_mushroom` preset's stated basis](#satirical-presets-aim-at-power-never-at-private-people) already
rests on the same structure — **a payment made to keep a story quiet is what gave the story its weight.**
The repo had occluder-as-evidence recorded as a joke's justification before it was recognised as the
principle running the whole section.

### 2. Closure does the rest, and it is McCloud's law

[Scott McCloud](../../characters/scott-mccloud/README.md) — whose *Understanding Comics* was a design
bible on The Sims team, which is why this is in-house theory rather than a borrowed flourish — names the
three mechanisms that stack here exactly:

| McCloud's concept | What the mosaic does with it |
|---|---|
| **Closure** — the imagination completes what falls between the panels | The mosaic is a gutter with an outline. The viewer completes it, privately, and always flatteringly to their own taste |
| **Masking** — abstract figures inside detailed worlds are where the viewer projects | An abstract region in a photoreal frame is the most projectable surface available |
| **Amplification through simplification** | A mosaic is maximal simplification, so by his own law it *amplifies*. It does not tone anything down |

Sims characters were identifiable because they were abstract enough to be anyone. **Point that same
mechanism at a redaction and it works just as reliably, for the same reason.**

### 3. Tracking turns the occluder into a motion oracle

This is the part specific to Faceball, and it is the only one that is new. Couple the bounding box to a
deforming mesh and the mosaic transmits the **full dynamics** — amplitude, rate, phase, deformation
under gravity — while transmitting **zero surface information.**

**Motion was always the suggestive channel; texture was the incidental one.** So the arrangement deletes
the boring signal and forwards the entire suggestive payload, over an official redaction, with excellent
temporal fidelity.

### Two existence proofs, one of them on network television for years

**Jimmy Kimmel's "This Week in Unnecessary Censorship"** is the large-scale demonstration, and it is
already this repo's [named tradition](../../bits/tradition-unnecessary-censorship/tradition-unnecessary-censorship.yml).
Bleep and blur entirely innocuous footage and audiences reliably construct something far dirtier than
anything that was said or shown — reliably enough to sustain a recurring network segment for years. It
satisfies the letter of broadcast standards while being filthier than its own source material. **The bit
is not a joke about censorship; it is a demonstration that censorship manufactures content.**

**"Bubble porn" (also called Mormon porn)** is the pure case, and the cleanest proof available: take a
photograph of a fully clothed person and add an opaque bubble over the *clothing*, so the subject reads as
nude. Nothing was removed, because there was nothing there to remove. **The entire erotic content is the
occluder.** That is the mechanism isolated in a laboratory, and it is the reason mechanism 1 cannot be
treated as proof of anything: here it fires on empty.

**And the control group is a shipped commercial product.**
[Genital Jousting](inspirations.md#the-part-that-matters-most-it-is-the-uncensored-control-group) is this
subject matter with **no mosaic at all** — fully visible, all the time — and it reads as *slapstick*.
It was reviewed as a party game, not as pornography, because nothing is hidden and therefore nothing is
imagined, so closure never fires. **Full visibility is the tame configuration**, which is the prediction's
other end confirmed by something that actually sold at a price.

Which means **the cheat code de-escalates.** Lifting a mosaic looks like the transgressive reward and is
in fact the milder view — you unlock your way from implication down to goofiness. That inversion is the
best argument for [pixelated-by-default](#pixelated-by-default-and-that-is-the-joke) in this document,
because it makes the compliant render the preferred one at no cost.

The Sims 1 blur belongs on this list too, which is why it is the [Sims credit](inspirations.md#create-a-sim--the-sims-maxis-2000)
that keeps paying: it became an iconic, instantly legible signifier, and a modding culture grew up around
removing it. Nobody builds a scene remover for something unremarkable.

### What this means for the platform claim, stated honestly

**Pixelation is classifier evasion, not suggestiveness reduction, and this document should not pretend
otherwise.** Automated moderation measures skin tone, anatomical geometry, and pixel statistics; humans
measure implication. The mosaic scores near zero on the first and maximal on the second. So:

- ✅ **"Survives automated moderation"** — holds, and it is the reason the bit is publishable at all.
- ❌ **"Therefore tamer"** — does not hold, and claiming it would be dishonest. It is *more* suggestive.
- ⚠️ **Human reviewers and platform policy are a different matter entirely.** A person applying a
  judgement standard can read the implication as well as anyone else, and an appeal that says "but it was
  only ever pixels" is technically true and beside the point.

**This is leaning into a loophole on purpose, and naming it is the price of using it.** The loophole
works because the measurement is pixel-shaped and the effect is imagination-shaped. Nothing about that
changes where the ethical line sits — satire aimed at power, no private people, consenting guests only —
because those constraints were never derived from what a classifier can detect.

### The useful consequence: the asset underneath can be nothing

If the redaction carries the payload, **the geometry under the mosaic never has to be authored.** A grey
capsule with plausible mass, stiffness and damping produces the identical result, because the only
channel reaching the viewer is silhouette dynamics. Nobody will ever see the surface.

That is a real simplification rather than a squeamish dodge: fewer assets, nothing explicit in the
repository, the same effect, and the cheat code lifts a mosaic off a featureless blob — which is funnier
than whatever was expected, and the best possible punchline for the whole section.

**Everything from here down is the demonstration.** The argument above is already complete; what follows
is the proof that it produces something you can build, and it is where the parts finally get named.

## Soft-body parts

Plug-in jiggle parts driven by the Sanspiel soft-body pass, using the **same construction-kit verbs as
every other part**: snap to a named anchor, tune mass, stiffness, damping, jiggle gain, gravity, and
collision, then play. Anchors are the ordinary ones — chassis, shoulders, and a crotch anchor — plus
any custom anchor a YAML file declares.

**The precedent this rests on is
[Genital Jousting](inspirations.md#genital-jousting--free-lives--devolver-digital)**, which shipped on
Steam and established the load-bearing point: **the floppiness is the joke and the anatomy is only the
excuse.** [Free Lives](https://en.wikipedia.org/wiki/Free_Lives) made the parts deliberately uncooperative, so the comedy is a physics failure with
witnesses. That is why the parts here are unremarkable on purpose and the
[modifiers](#modifiers-are-the-actual-design-idea) carry the design.

**Their shapes are [ECG blends](README.md#the-engine-is-tom-ngos-ecg), which is not incidental** — these
are the *parameterized parts* Don named as the reimplementation target when
[Tom Ngo](../../characters/tom-ngo/README.md)'s patent expired.
Draw a handful of example states, then drag; the solver recovers the weights. No sliders, and no new
subsystem for any of it.

### Balloon boobs, and why you want more than two

**`balloon_boobs` is the marquee part** — cartoon-oversized, high jiggle gain, low stiffness, snapping
to the chassis or any declared anchor. It is the part that sells the whole palette in one glance,
because a balloon reads as a balloon: **nobody has ever mistaken one for anatomy**, and that is the
[abstraction rule](#abstraction-instead-of-anyones-photograph) paying off rather than a compromise.

**Count freedom is the feature, and it is not a novelty knob.** The
[Spore Creature Creator](inspirations.md#spore-creature-creator-maxis-2008) credit says you are not
limited to two, or to an even number, and there are two independent reasons to spend it here.

> **Aside, because in this file every knob is a novelty knob.** A soft-body physics API arrives
> pre-loaded with `stiffness`, `damping`, `jiggle_gain`, `rigid`, `tight coupling`, `penetration depth`
> and `hot path` before anybody has tried to be funny even once. Point that vocabulary at anatomy and
> the reader supplies the rest — which is [closure](#2-closure-does-the-rest-and-it-is-mcclouds-law)
> running on *words* instead of pixels, and the same free labour the mosaic gets. **The prose is not
> being filthy; the prose is being technical, and you are doing the work.** Hence
> [the deliberately cheezy register](#how-it-is-gated), and hence no dirty word anywhere in this
> document has to do any lifting. The spec sheet was always going to be the dirtiest file in the repo.

**First, the physics genuinely needs it.** Two soft bodies can only bounce. **Put six in a chain at
graded mass and stiffness and you get wave propagation** — a ripple that travels, overshoots, comes
back, and goes out of phase with itself. That is a whole motion vocabulary that literally cannot exist
at n=2:

| Count | What the simulation can do |
|---|---|
| **2** | Bounce, and bounce out of phase. That is the entire repertoire |
| **4–6** | **Travelling waves.** Newton's cradle, caterpillar ripple, a stadium wave down the chain |
| **odd (3, 5, 7)** | No axis of symmetry, so the whole thing reads as a *machine* rather than a body |
| **absurd (12+)** | Parade float. Xylophone. The physics becomes the instrument and the anatomy is gone |

**Second, and this is the useful part: raising the count de-escalates.** Two is the anatomical read.
Six is unmistakably a cartoon, and twelve is a marching band. **Adding parts makes the gag less
suggestive and more absurd at the same time** — the same inversion as the cheat code, where more
visibility turned out to be tamer. More is milder. So the knob that looks like the most gratuitous one
in the kit is actually the safety valve, and it is funnier in the same direction it is safer, which is
the only kind of safety feature anyone ever actually uses.

None of it is a new subsystem. Count is a part parameter, the shapes are ECG blends, and the wave is
just the soft-body pass doing its job on a list instead of a pair.

### Dancing pixels

**`meatspin_rotation_engine` × Sanspiel soft-body × `sims1_pixelization` = dancing pixels.** Stack all
three and something nobody designed falls out of the arrangement — this is
[mechanism 3](#3-tracking-turns-the-occluder-into-a-motion-oracle) made concrete.

The mosaic's bounding box tracks the **deformed** mesh rather than a static rectangle. The rotation
engine spins the part; the soft-body pass wobbles and squashes it while it spins; the censorship region
is recomputed from that live silhouette every frame. **So the mosaic is not a block sitting on top of
the gag — the mosaic is the gag, and it is choreographed.**

One parameter decides which effect you get, and both are worth having:

| `grid_space` | What you see |
|---|---|
| **screen** | The part travels through a fixed pixel lattice; cells pop and boil as coverage crosses cell boundaries. Strobing, nervous, cheap. |
| **mesh** | Cells are locked to the surface, so they stretch, shear and rotate with the soft body. **The pixels themselves dance as one coherent object.** |

Now recall that the rotation engine already carries `sync_to_music_bpm`, and that the spec names Dead
or Alive's **"You Spin Me Round (Like a Record)"** as the homage. Mesh-locked mosaic plus BPM-synced spin
plus jiggle gain **is a music visualizer built entirely out of redaction.** Censorship on the beat.

**This inverts the usual censorship economics.** Normally the safe-for-upload cut is the degraded one and
you ship it grudgingly. Here the fully censored cut is the *better* cut — more motion, more legibility,
funnier — so [pixelated-by-default](#pixelated-by-default-and-that-is-the-joke) stops being a compliance
tax and becomes the preferred render. Nothing is hidden reluctantly; the redaction is the performance.

It is also the [Incredible Machine](inspirations.md#the-incredible-machine-and-incredible-toons--dynamix)
credit collecting: three parts that know only their own physics, colliding into a consequence the author
did not plan. If this had required a `dancing_pixels` subsystem, the kit would have failed. It required
three modifiers already present and one enum.

### Lights are parts too, and lighting is what sells it

**Attach lights to models the same way you attach anything else** — snap to an anchor, set parameters,
stack freely. A light is a part, not a scene setting, and that single decision is what makes the rest of
this work.

The precedent is **[LittleBigPlanet](inspirations.md#littlebigplanet--media-molecule)**
([Media Molecule](https://en.wikipedia.org/wiki/Media_Molecule), 2008), whose creation tools let players stick lights, stickers and decorations onto any object, and whose
handmade fabric-and-cardboard world reads as *tangible* almost entirely because of how it is lit. Its
motto was **Play, Create, Share**, which is this kit's thesis with better marketing.

| Parameter | Notes |
|---|---|
| `colour` | Per-light, and the caricature signifier lives here rather than in any photograph |
| `intensity`, `falloff` | The physical read — how much volume the light implies |
| `blink` | Pattern or rate, and `sync_to_music_bpm` for consistency with the rotation engine |
| `attach_to` | Any anchor, including a part that is itself deforming |

**Lighting is what makes a soft body read as having mass.** A lit, deforming surface produces moving
highlights and shadows that confirm volume and weight; the same mesh flat-shaded reads as a sticker.
So the lighting pass is not decoration here, it is the thing that makes the physics legible — and it
works in 2D as readily as 3D, which is the [PaRappa-style mixed
scene](README.md#2d-and-3d-parts-in-one-scene-parappa-style) paying off.

**And a light attached to a redaction is the whole thesis in one object.** A mosaic that *emits* is a
redaction pointing at itself, dragging the eye to the region it claims to suppress. Mechanism 1 with a
lamp in it.

### The worked bit: the side-by-side

Everything above assembles into one shot, scored to the song, and it needs **no anatomical art at all.**

Split screen, both figures spinning on the same beat. On the left, an anonymous cartoon man. On the
right, the [`trump_mushroom`](#satirical-presets-aim-at-power-never-at-private-people) preset.

| | Left: a generic man | Right: the caricature |
|---|---|---|
| Mosaic area | huge, pendulous, swinging with the beat | a tiny patch that barely distends |
| **Cell size** | **enormous chunky blocks — a handful across the whole region** | **fine, dense little pixels** |
| Attached light | none | **bright orange, blinking on the beat**, bloom leaking out of the mosaic |
| Under the mosaic | a grey capsule | a smaller grey capsule |

#### Cell size is the punchline, and it is one parameter

The joke works because of how the mosaic is subdivided. Give `sims1_pixelization` a **fixed cell count
across the bounding box** rather than a fixed cell size in screen pixels, and **cell size becomes
proportional to the thing being hidden.** A big region resolves into a few giant blocks; a small region
resolves into tiny fine ones.

```yaml
sims1_pixelization:
  cell_sizing: relative      # N cells across the box — cell size scales WITH the subject
  cells_across: 6            # left figure: 6 huge blocks. right figure: 6 tiny ones.
  grid_space: mesh           # cells ride the deforming surface — see dancing pixels
light:
  colour: "#ff6a00"          # the caricature signifier, with no photograph involved
  blink: sync_to_music_bpm   # on the beat, same clock as the spin
  attach_to: the_part        # so the glow deforms with it
```

**So the censorship reports the measurement it exists to withhold.** Nobody is shown anything, and the
audience is told the number precisely, in the resolution of the redaction itself. That is the cleanest
possible demonstration of this document's thesis: the occluder is the content, and here it is the content
*quantitatively*.

**The blinking orange light is what sells it**, and it is doing three jobs at once: it carries the
caricature signifier without a photograph or a name, it pulls the eye to the censored region, and — by
pulsing on the same clock as the spin — it ties the redaction to the music so the whole shot reads as
choreography rather than as compliance.

#### Why it stays inside the rules

- **The right side is a public figure and the satire is aimed at power** — comic self-importance and
  global havoc, which is the `reads_as` already recorded for that preset. No private person is involved.
- **The left side is deliberately nobody.** A generic cartoon, per
  [abstraction instead of anyone's photograph](#abstraction-instead-of-anyones-photograph). Using a real
  man's body — even a willing one — would be worse comedy and worse ethics: it would make a real person
  the instrument of a joke about someone else. The anonymous cartoon is the funnier read *and* the safe
  one, which is the usual outcome when that rule is followed.
- **Nothing explicit exists in the repo.** Two capsules, two mosaics, one lamp, one BPM. The
  uncensorable version was never authored, so there is nothing to leak, nothing to moderate, and nothing
  to regret.

`rights:` the obvious track is Dead or Alive's
[**"You Spin Me Round (Like a Record)"**](https://en.wikipedia.org/wiki/You_Spin_Me_Round_(Like_a_Record))
(1985) — already the
`named homage behind meatspin_rotation_engine. It is a commercial master: license it, or use a soundalike`
`at the same BPM. Do not ship the real recording on the assumption that parody covers the sync.`

## Pixelated by default, and that is the joke

**The censorship mosaic is on unless you have the cheat code to lift it.** The uploadable default cut
is self-censored; the uncensored view is a local, opt-in reveal, never the default upload.

This is a direct lift from **The Sims 1**, where a blur box chased naked Sims around the house, and the
kit leans all the way into it. Two consequences, one practical and one comedic:

- **It survives platform moderation.** TikTok and Facebook flag cartoon and puppet anatomy, and a
  strike can kill an account. Shipping censored-by-default is what makes the bit publishable at all.
- **The punchline becomes the censorship rather than the anatomy**, which is funnier. Pass a pixelated
  joint and it pixelates your *head* — the mosaic follows the contraband. The blur box tracks the
  bounding box, deadpan and self-aware.

See [`bits/tradition-unnecessary-censorship/`](../../bits/tradition-unnecessary-censorship/).

## Satirical presets aim at power, never at private people

Preset filter stacks aimed at **public figures**, as political caricature — protected parody and
opinion, grounded where possible in public record, and never at anyone private.

The worked example in the spec is a caricature of a sitting public official built from a size filter,
the rotation engine, and a Mario-mushroom substitution, with the spec recording its own factual basis
and marking the whole thing as satire rather than as a clinical claim. The running gag attached to it
is a Philip K. Dick one: cans of **[Ubik](https://github.com/SimHacker/moollm/blob/main/designs/pkd/ubik.md)**,
the reality-propping aerosol, sprayed on for a
short-lived potency boost that always wears off — borrowed, decaying power, which is the actual
subject.

**The house test for whether a preset earns its place is what it rests on.** That caricature rests on
public record — matters of legal record and an on-the-record published account. A preset resting on a
single tabloid relay does not clear the same bar, and the difference is not squeamishness: a satirical
claim inherits the reliability of its source, and a bit whose own punchline is *"That's not AI. THIS is
AI"* cannot afford a fabricated image in its setup.

The performance technique is **[Sarah Cooper](https://en.wikipedia.org/wiki/Sarah_Cooper)'s**: lip-sync the puppet to the figure's *real, verifiable*
public audio and let the real audio carry the satire. Never fabricated words. That is also why the kit
needs no voice cloning — it is the `amplitude-scrub` mode doing exactly what it was built for.

## The Bowie video puppet

A buildable preset reconstructing the articulated lower-body video puppet from Bowie's 1979 SNL
performance — the bit NBC censored — as something a performer can drive live. Historical detail
(the puppet, the censorship, Klaus Nomi and Joey Arias) lives in
[`characters/brian-eno/bowie-snl-1979.md`](../../characters/brian-eno/bowie-snl-1979.md); here it is
just the preset plus the live reaction shot.

## Why any of this is in a construction set: the Streisand argument

**The brand is the Streisand effect aimed at censorship itself.** When a gag gets censored it only
becomes more wanted — NBC pulling the Bowie video is exactly why it is iconic. The response is not to
mourn a takedown but to **hand everyone the tools to rebuild and remix the censored bit themselves.**

That is why these are composable modifiers rather than one-off assets. A single forbidden upload is
fragile and can be removed. A construction set that lets anyone rebuild the joke, restyle it, and pass
it on cannot be. Suppress it and it multiplies.

## Consent and care

Non-negotiable, and identical to the rest of the kit:

- Self-authored avatars and consenting guests only.
- **Celebrate** gender play; never shame anyone.
- Aim satire at power and hypocrisy, **never at private people**.
- A human mouth through a hole. No voice clones.

Governing documents:
[`puppet-me-consent.yml`](../../characters/don-hopkins/portrayal/puppet-me-consent.yml) ·
[`schemas/portrayal-standards.yml`](../../schemas/portrayal-standards.yml) ·
[`bits/gag-vice-not-ice-puppet/`](../../bits/gag-vice-not-ice-puppet/)

## See also

- [`README.md`](README.md) — the kit, with none of this on the front page
- [`mask-and-reveal.md`](mask-and-reveal.md) — the anonymizing overlay and the consent-gated reveal
- [`inspirations.md`](inspirations.md) — where the Spore, Sims-1, Genital Jousting and LittleBigPlanet credits come from
