# The mask, and the reveal

*Part of [`designs/faceball-construction-set/`](README.md). One mechanic with a consent rule at its
centre. Separated from the main design because it is elaborative, and kept out of
[`adult-section.md`](adult-section.md) because the consent rules here govern the whole show and need to
stay findable.*

**One line:** the full-screen puppet is a mask you perform behind — and then, only if you want to, you
take it off.

## Anonymity is what makes the performance bold

A full-screen puppet overlay hides who is really on camera. That is not a side effect, it is the
feature: the performer can commit to something they would never do in frame, because nobody can see
them. **Disinhibition produces better performances, and the overlay is the permission.**

This is why the mask belongs to the performer rather than to the show. It is a costume in the
[Maurice](inspirations.md#maurice-the-magnificent--create-a-sim-as-an-agent) sense — worn on purpose,
removable on purpose.

## Whole-body motion drives the puppet

Track the low-frequency motion of the entire video frame — the performer's gross body movement — and
feed it to the soft-body jiggle physics as gain. Dance hard, the puppet wobbles hard.

This is the whole-body sibling of the `amplitude-scrub` mode (mic loudness drives the mouth), and both
descend from the Bounce trick of remapping a gesture so that any audio can be played with any motion.
See [`inspirations.md`](inspirations.md#the-in-house-lineage).

## Losing the mask is losing the game

Wire the overlay to the game state: **you keep the mask as long as you are winning.** Lose a life and
the mask blinks out, and there you are — suddenly visible, alone, undefended on camera.

In the danger zone, or on small penalties, the mask **flickers** rather than dropping outright.
Sometimes it fades far enough that both the performer and the overlay are briefly visible at once. The
jolt is the point: the safety of hiding is exactly what is at stake, so the stakes are felt rather than
displayed on a meter.

That is a rare thing in a game — a stake that is about exposure rather than points, produced entirely
by compositing.

## The reveal, which happens only by consent

The height of the comedy: somebody gives a spectacular performance behind the puppet, and then —
**only with their explicit prior agreement** — the raw behind-the-scenes video runs without the
overlay. Masked Singer energy, for a full-body dance number.

**The consent rules are load-bearing, not fine print:**

- Opt-in, **agreed before the performance**, and revocable up until air.
- The performer owns **both** cuts, masked and raw. Either can stay locked forever at their word.
- **No reveal of anyone who did not consent. Ever.**

Governing documents:
[`puppet-me-consent.yml`](../../characters/don-hopkins/portrayal/puppet-me-consent.yml) ·
[`schemas/portrayal-standards.yml`](../../schemas/portrayal-standards.yml)

## The trope it inverts

The reveal carries a deliberate whiff of kompromat — the dark thrill of *there is raw footage of what
you really did*. That is the trope, and inverting it is the whole design:

| | Kompromat | This |
|---|---|---|
| Agreement | none — that is the horror | given in advance, revocable |
| Who holds the footage | the coercer | the performer |
| What it buys | leverage | applause |

Same dramatic tension, opposite ethics. **The punchline is the consent.** The edge is aimed at the
abuse of power — blackmail itself — and the show's own consenting version is the antidote.

`care: the "there are tapes" premise is an unverified cultural meme, invoked as the trope being`
`parodied and never asserted as fact. The show never fabricates or "reveals" real compromising`
`footage of any real person.`

## See also

- [`README.md`](README.md) — the kit
- [`adult-section.md`](adult-section.md) — the curtained palette, where the frankest version of this lives
- [`physics-and-gags.md`](physics-and-gags.md) — the game states the mask is wired to
- [`bits/gag-vice-not-ice-puppet/`](../../bits/gag-vice-not-ice-puppet/) — the bit where the reveal was worked out
