# The Rhetoric Organ — a semantic modulator keyboard for live text generation

*A chorded keyboard of rhetorical figures, moods, and personas that modulates
an LLM's output in real time, while it generates — organ stops for prose.
Born in a live session, August 21 2026, mid-argument on Hacker News, when the
question "what figure is 'again and again and again'?" (epizeuxis) collided
with "what if I had keys for those?" Then it plugs into the speech-synth
feedback loop as the missing instrument on the text-generation side.*

Sidecar of the Korz′ design run —
[korz-prime.md](../david-ungar/korz-prime.md) supplies the theory
(K-lines, context vectors, guarded dispatch); this is the theory with keys
under your fingers.

## The instrument

A keyboard where each key is a **named literary operation**: EPIZEUXIS,
DIACOPE, EPANALEPSIS, POLYSYNDETON, ASYNDETON, ANAPHORA, CHIASMUS, TMESIS,
LITOTES, ZEUGMA, ALLITERATION. Plus non-figure dimensions on faders: MOOD,
REGISTER (chest-voice taunt ↔ head-voice scholarship), PERSONA, ERA. While
the model streams text, you play:

- **Press a key** and the figure blooms in the output within a clause or two.
- **Velocity is intensity** — tap ALLITERATION for a tasteful echo; *whail on
  it* and every word alliterates (see the Electronic Bard, below).
- **Chords are registrations** — the organist's word for a combination of
  stops. DIACOPE + EPANALEPSIS is a registration you'd label DRILL BABY
  DRILL. EPIZEUXIS alone, velocity 127, is the KING LEAR stop ("Never,
  never, never, never, never"). ALLITERATION letter-locked to S + THEME:
  haircut + TRAGIC + SIX LINES is the SAMSON registration (below).
- **Release decays** — figures fade over a few sentences instead of stopping
  dead, like a held pedal.

The organ is the right ancestor because organists solved this interface
three hundred years ago: you don't play different notes, you **pull stops**
that change how the same notes speak. The melody is the meaning; the
registration is the rhetoric.

## The loop it completes

The [Slats robopoetry
loop](../../repo-shows/will-wright-premiere/performance-and-culture.yml)
already runs the audio half: speech synth → room → speech recognition →
re-speak the mutated line — evolving robopoetry, steerable by talking over
it, gongable by the Ultimate Machine. Don built the speech-synthesizer
feedback idea once and wants to recreate it.

The Rhetoric Organ is the missing instrument on the **text-generation side**
of that loop. Full telephone game, every station live:

```
speech RECOGNIZER → LLM TRANSFORMER → speech SYNTHESIZER → DISTORTER → room → (back to recognizer)
        ↑                  ↑                   ↑               ↑
   audience voices    RHETORIC ORGAN     Phoneloper voices   effects rig
                      (Don at console)   (pitch/timing pulled) (pedalboard)
```

Every station is an instrument with a human hand on it, and every pass
through the loop is a generation of the telephone game — mutation at the
recognizer (mishearing is a feature), mutation at the transformer (the organ
player steers it), mutation at the synthesizer
([Phoneloper](../../process/crazy-idea-jam.yml) drags the diphones,
[Pink Trombone](../../repo-shows/voystick-pink-trombone/SHOW.yml) bends the
tract), mutation at the distorter. Alvin Lucier ran this loop with a room in
1969 and got pure tones out of speech; we run it with a language model in the
middle and get robopoetry that *argues back*.

## Implementation depths

Three tiers, shippable in order:

1. **Registration block (an afternoon).** Key state renders into a live
   "current registration" section of the system prompt; generation re-anchors
   at the next sentence boundary when the registration changes. MIDI
   controller → websocket → prompt. Figures are style-not-content, so
   mid-stream switches feel musical, not disruptive.
2. **Logit bias (real-time in the strict sense).** Each figure key biases
   token probabilities toward its signature: EPIZEUXIS raises the
   just-emitted content word, POLYSYNDETON pumps "and," ANAPHORA pins the
   sentence opener. Crude, fast, twitchy — a fuzz pedal.
3. **Activation steering (research-grade).** Extract a steering vector per
   figure from contrastive pairs (same passage with and without). Press a
   key, add the vector to the hidden states; chords are literal vector
   addition. The figure emerges in the model's *lean*, not as an obeyed
   instruction.

## The Korz reading

Each key is a **K-line**: "diacope" activates everything the training data
knows about diacope — you never define the figure, you press its name.
Point, don't spell. A chord is a **context vector**; the streaming model is
**dispatch resolving against it in real time**; the faders are **fronting
weights** (the [two-headed
troll](../david-ungar/korz-prime.md) as a mixing console — a mind's head
swells when its fader rises). Velocity-sensitive keys make `isKnown` audible:
a figure the model knows deep (alliteration) responds at a feather touch; an
obscure one (zeugma) needs the key mashed. The keyboard is a Korz context
controller you can gig with.

And the layout should be a **pie**, obviously: repetition family north,
reversal south, omission east, excess west — novice browses the wheel and
learns the names, expert chords blind. The reveal is the rehearsal for the
gesture; self-revealing interfaces, applied to prosody.

## Whaling on the alliteration key: the Electronic Bard

The patron saint of the ALLITERATION key at velocity 127 is **Trurl's
Electronic Bard** from Lem's *Cyberiad*. Klapaucius, trying to break the
machine, demands a poem about a haircut — lofty, tragic, timeless, six
lines, *and every word beginning with s*. The Bard doesn't blink:

> Seduced, shaggy Samson snored.
> She scissored short. Sorely shorn,
> Soon shackled slave, Samson sighed,
> Silently scheming,
> Sightlessly seeking
> Some savage, spectacular suicide.

That's **Michael Kandel's English** — and Kandel is the deeper miracle: in
Lem's Polish the constraint letter was different (*c*), so the poem cannot
be translated word-by-word. Kandel translated **the constraint**, then wrote
the poem the Bard would have written in English. A translator executing a
constraint-preserving transformation across languages is exactly the job
description of the transformer station in our loop — Kandel was the LLM
tier, decades early, and better at it.

(Lem's frame story is on the nose too: Trurl builds the Bard by simulating
the entire history of the universe to get its poetry right — the training
run — and the poets of the galaxy respond to its output the way HN responds
to LLM poetry today.)

## Retroactive inspirations — the latent K-lines

Eno and Laurie Anderson started this list; here's who else was already in
latent space waiting to be pointed at. Each name is a key that could go on
the second manual of the organ.

**Keyboards that play speech and thought:**

- **The Bell Labs Voder (1939)** — the single most literal ancestor: a
  keyboard + wrist bar + pedal that synthesized speech *live* at the World's
  Fair, played by operators ("Voderettes") who trained for a year to chord
  phonemes. The Rhetoric Organ is the Voder one level up the stack:
  they played phonetics, we play semantics.
- **Engelbart's five-finger chord keyset** — chording as the expert path
  (and already in this repo's jam as a 3D-printable replica — same desk,
  new manual).
- **Stenotype chording (and open-source Plover)** — court stenographers
  chord *syllables* at 225 wpm; the machine-shorthand lineage proves chorded
  language entry scales to realtime performance.
- **EBN — Emergency Broadcast Network — and VuJak (1991–92)**: the MIDI
  keyboard that played *time*. Brian Kane's "oh yeah" moment, 1991: he tied
  a QuickTime movie into Max, pressed a MIDI note, and saw the movie play —
  that became **VuJak** (with Lisa Eisenpresser and Jay Haynes, Max +
  QuickTime 1.0), the first video sampler: keys jumped in real time across
  the movie's timeline. EBN's live rig (Mark Marinello's samplers on Mac
  Quadra 950s) went further — pitch-bend the audio, play clips backward,
  **video scratching** from a keybed, the George H. W. Bush "We Will Rock
  You" Gulf War remix as the demo reel. The progression writes itself: the
  Voder chorded *phonemes*, VuJak chorded *time*, the Rhetoric Organ chords
  *semantics*. And the lineage reconverges twice: Josh Pearson named
  **Laurie Anderson** as EBN's influence (Wired, Feb 1993), and EBN's live
  video technologist Greg Deocampo founded CoSA — the company that made
  After Effects.

  The personal thread: Don **toured with these people**. Interval Research's
  [Electric Carnival tent](../will-wright/sources/art-net-simcity-archive/electric-carnival.md)
  traveled with **Lollapalooza '94** — Don showing two-player **SimCityNet**
  on an SGI Indigo + NCD X terminal ("SimCity Without Walls"), **David
  Levitt showing Bounce at the MIDI Zoo** *in the same tent*, and EBN — the
  Lollapalooza video guerrillas since the '91 tour, per Don's recollection
  scratching QuickTime on that midway too. The robopoetry telephone game is
  an Electric Carnival reunion with thirty years of better latency.

**Constraint machines and combinatorial decks:**

- **Eno & Schmidt's Oblique Strategies (1975)** — the closest steering
  ancestor: a K-line deck, drawn one card at a time, that redirects a
  session without specifying content. The organ is Oblique Strategies made
  chorded, continuous, and velocity-sensitive. (The Eno show already plans
  an [Oblique-Strategy pie menu](../brian-eno/speculative-jams.md) — same
  object, now with a keybed.)
- **Oulipo** — Queneau's *Cent mille milliards de poèmes* (a sonnet as a
  10¹⁴-poem combinatorial flipbook — a paper keyboard), Perec's *La
  Disparition* (a novel without the letter *e* — and Gilbert Adair's
  translation *A Void* keeps the lipogram: the Kandel feat again), the S+7
  procedure (a deterministic substitution stop).
- **Ramon Llull's volvelles (13th c.)** — rotating concept wheels for
  generating arguments combinatorially; the *Ars Magna* is the oldest chord
  keyboard for ideas on record.
- **Mozart's dice game / Kircher's Arca Musarithmica** — composition by
  table lookup and chance; registration presets, powdered wigs.

**Feedback loops as instruments:**

- **Alvin Lucier, "I Am Sitting in a Room" (1969)** — speech fed through a
  room until the room's resonances replace the words. The founding text of
  the synth→mic→synth loop; Slats is Lucier with a personality disorder.
- **Steve Reich, "It's Gonna Rain" (1965)** — tape loops of speech phasing
  against themselves; the distorter station's homework.
- **Eno & Fripp's Frippertronics / Discreet Music** — long-delay tape
  feedback as a performance instrument; the loop *is* the score.
- **Jim Crutchfield, "Space-Time Dynamics in Video Feedback" (Physica D,
  1984)** — the loop taken seriously as *physics*: camera watches its own
  monitor, and the rig is analyzed as a space-time analog computer with
  zoom/rotation/focus as control parameters. His list of future variations
  ends with *"inserting a digital computer into the feedback loop"* — this
  show's architecture, proposed forty-two years early; the LLM is the frame
  buffer. Don has been giving Jim feedback about his feedback since 2013.
  → [papers annex with the plates](../jim-crutchfield/papers/README.md) ·
  [the film](https://www.youtube.com/watch?v=B4Kn3djJMCE)

**Cut, steer, and permute text:**

- **Burroughs & Gysin's cut-ups**, **Gysin's permutation poems**, **Tzara's
  hat**, the surrealists' **exquisite corpse** — pre-electronic transformer
  stations, all hands-on.
- **Christopher Strachey's love-letter generator (Manchester Mark 1,
  1952)** — the first computer-generated text art, signed M.U.C.; the
  first machine to be accused of not really meaning it.
- **Racter** (*The Policeman's Beard Is Half Constructed*) and **Mark V.
  Shaney** (the Markov-chain Usenet persona that fooled net.singles) — the
  robopoets who worked the room before transformers.

**Voice as material:**

- **Laurie Anderson** — the tape-bow violin (words on a bow, syllables under
  continuous physical control), the vocoder Voice of Authority, and her
  corpus-trained AI text machine she describes herself as addicted to. She
  has held both ends of this instrument; the organ is the coupling.
- **Ken Nordine's Word Jazz** — the genre name for the output of this rig,
  coined 1957.
- **Kurt Schwitters' Ursonate / Hugo Ball's "Karawane"** — sound poetry:
  what the loop emits when the semantics fader hits zero and prosody keeps
  playing.
- **Scat and Slim Gaillard's Vout** — improvised syllables and an invented
  vocabulary; proof the audience will follow voice past the edge of the
  lexicon.
- **The vocoder lineage** — Dudley (again — Voder's sibling) → Wendy Carlos
  → Kraftwerk → Anderson → Auto-Tune: the distorter station's family tree.

**The oldest ancestor of all:**

- **Homeric oral-formulaic composition** (Milman Parry, Albert Lord, *The
  Singer of Tales*) — bards improvising epic *live* from an inventory of
  metrical formula-keys: "wine-dark sea," "rosy-fingered dawn," "swift-footed
  Achilles." Stock epithets are K-lines with meter guards; the singer chords
  them under realtime performance pressure. The Rhetoric Organ's player is a
  guslar with a MIDI rig; three thousand years of prior art, none of it
  written down, which was the point.

## The show — robopoetry telephone game

A live Repo Show performance: the full loop on stage, every station played
by a guest, the audience steering by voice (talk during the pause to grow
the line; talk over it to smash syllables) while Don works the organ console.

**Invite [David Levitt](../david-levitt/ideas.md) first.** He is the only
person who is simultaneously: a Minsky-advised PhD on *machine improvisation
in musical dialects* (the organ plays rhetorical dialects — his thesis, one
symbol system over); the builder of **Hookup**, the first patch-cord visual
language (the telephone-game stations *get patched together live on stage*
as a Hookup-style dataflow — the stage diagram is a patch); Don's
collaborator on **Pantomime** (Bug Farm butterflies as visual accompaniment);
and the co-editor of *Machine Models of Music*, which makes him the natural
referee of the argument the show stages: what does it mean for a machine to
improvise *well*? Slats calls in mid-show, obviously, and gets gonged.

And it's a reunion, not a cold call: Don and David **already toured this
exact show once** — the [Electric Carnival](../will-wright/sources/art-net-simcity-archive/electric-carnival.md)
at Lollapalooza '94, David patching Bounce live at the MIDI Zoo, Don running
multiplayer SimCity two tables over, EBN scratching video down the midway.
Same carnival, new instruments.

Natural co-conspirators, each already seeded in this repo: [Laurie
Anderson](../laurie-anderson/ideas.md) (invented instruments, Voice of
Authority), [Brian Eno](../brian-eno/ideas.md) (Oblique Strategies pie,
generative systems on stage), Jerry Martin (what the loop sounds like when a
real composer pulls the stops), Zack Qattan (Pink Trombone/Vocap station),
and the Voystick as the audience's own gestural channel — warble a wedge to
vote a figure onto the organ.

**The dramaturgy of the loop:** let it climb to peak absurd beauty
(hill-climbing), pull the SAMSON registration for the finale (six lines,
every word one letter, the room chanting along), then the Ultimate Machine
gongs the whole rig. Reset laugh. Encore: the audience picks the letter.

## Ties

- [korz-prime.md](../david-ungar/korz-prime.md) — K-lines, context vectors,
  isKnown, the two-headed mixer
- [performance-and-culture.yml#speech-feedback-loop-instrument](../../repo-shows/will-wright-premiere/performance-and-culture.yml) — the Slats loop this completes
- [crazy-idea-jam.yml#phoneloper](../../process/crazy-idea-jam.yml) — the synthesizer station
- [crazy-idea-jam.yml#voystick-homomorphic-vocal-joystick](../../process/crazy-idea-jam.yml) — the audience's gestural channel
- [crazy-idea-jam.yml#engelbart-keyset-3d-replica](../../process/crazy-idea-jam.yml) — chord hardware, already printable
- [musical-gas-granular-ca-synth.md](musical-gas-granular-ca-synth.md) — Don's granular CA synth; the organ's instrumental sibling
- [david-levitt/ideas.md](../david-levitt/ideas.md) · [brian-eno/speculative-jams.md](../brian-eno/speculative-jams.md) · [laurie-anderson/ideas.md](../laurie-anderson/ideas.md)
