# Faceball Construction Set — inspirations, and why each one earns the credit

*Part of [`designs/faceball-construction-set/`](README.md). The kit is not original and does not want
to be; it is one more entry in a genre with a clear lineage. This file says who did what first, and
what specifically was taken.*

## Bill Budge — Pinball Construction Set (1983)

**The archetype, and the reason the kit is named the way it is.** Instead of shipping one pinball
game, Budge shipped a tool for building *arbitrary* pinball tables: drag bumpers and flippers onto a
playfield from a parts bin, adjust gravity and elasticity, then flip a switch and play the thing you
just built. Save it, share it.

**Why this specifically earns the credit, and not just a nod:** Faceball's three verbs are Budge's
three verbs, in the same order. Snap a part onto the board. Wire up what it does. Play the physics.
The genre convention that a construction set must let you *run* your construction without leaving the
editor — no compile step, no separate play mode you have to export to — is his, and it is the single
most important property Faceball needs to keep.

- **Raster Blaster** (1981, BudgeCo) came first: the Apple II pinball game that established he could
  do the physics at all. PCS is that engine with the authoring turned outward.
- Published by BudgeCo, then by Electronic Arts as one of its earliest titles.
- [Bill Budge](../../characters/bill-budge/README.md) is **living** (b. 1954, retired 2022, still putting tools on GitHub). His entry here is
  an [invitation](../../characters/bill-budge/invitation.md), not a memorial —
  [`characters/bill-budge/`](../../characters/bill-budge/).

A construction set is an **artifactory**: an artifact whose product is other artifacts. That is the
repo's central metaphor and PCS is its canonical instance —
[`process/artifactory.yml`](../../process/artifactory.yml).

## The Incredible Machine and Incredible Toons — Dynamix

**What was taken: consequences that cross the frame.** These are Rube Goldberg sandboxes — a parts
bin of balloons, conveyor belts, cats, gravity, and air pressure, where you assemble a contraption and
then run it to see whether the chain of consequences reaches the end. The parts do not know about each
other; they only know physics, and the comedy comes from the collisions the author did not plan.

That is what Faceball's fluids are for. Tears drench the panel *below*. Confetti crosses cell
borders. The Brady Bunch video grid is a suggestion rather than a set of prison walls, and that
escape hatch is Incredible-Machine energy applied to a Zoom layout —
[`physics-and-gags.md`](physics-and-gags.md).

**Incredible Toons** matters separately: it swapped realistic parts for cartoon ones, where a mouse
and an anvil obey slapstick rules instead of Newton's. Faceball's fluids are cartoon fluids for the
same reason — the point is the gag landing, not the viscosity being right.

`needs-check: Dynamix/Sierra On-Line, produced under Jeff Tunnell Productions, with Kevin Ryan`
`credited on the original design. Exact release years for the series (original, The Even More`
`Incredible Machine, Sid & Al's Incredible Toons) vary between sources — verify before publishing`
`a year.`

## Create-A-Sim — The Sims (Maxis, 2000)

**What was taken: the editor is the front door.** Before you play, you make a person. Create-A-Sim is
placed at the entrance to the game, and the act of building the character is itself the first
pleasurable thing you do — not a configuration chore to get through, but the hook.

Faceball inherits the structure directly: every panel dummy is a **preset bundle** authored before the
show and hot-swapped during it, exactly as a household is authored before play.

It belongs in a larger group of Sims content tools that all did the same job — letting players model
**themselves**, their families, and their homes, rather than only consuming shipped content.
Don's own framing, from his QGCon inclusivity notes: *"Create-a-Sim, SimShow, FaceLift, and
Transmogrifier let players model themselves, families, and homes — personal content for play and
stories"* ([`interview-points.yml`](../../characters/don-hopkins/sources/qgcon-inclusivity-paper/interview-points.yml)).
Don worked at Maxis on The Sims, which makes that first-hand about the room.

The Sims 1 also supplies the kit's **censorship gag**, which is a real credit rather than a joke: the
blur box that chased naked Sims is where `sims1_pixelization` comes from, and leaning all the way into
it is what makes the adult palette platform-survivable — [`adult-section.md`](adult-section.md).

### Maurice the Magnificent — Create-A-Sim as an agent

**The credit Faceball's editor most needs, and the one it currently ignores.**

Maurice is the wooden mannequin who runs the **Coat Room** in MOOLLM's `adventure-4`. The room states
its ancestry outright — *"Inspired by The Sims' Create-a-Sim screen — and appropriately located right
near the entrance! Just like starting a new Sims game, you can customize your character before the
adventure begins."* He has no face, holds a clipboard, uses every pronoun, and his name tag reads
**"HELLO MY NAME IS MAURICE 💅"** over the line *"Let's find YOUR truth, gorgeous."*

- Room: [`examples/adventure-4/coatroom/`](https://github.com/SimHacker/moollm/tree/main/examples/adventure-4/coatroom)
- Character: [`examples/adventure-4/characters/fictional/maurice/CHARACTER.yml`](https://github.com/SimHacker/moollm/blob/main/examples/adventure-4/characters/fictional/maurice/CHARACTER.yml)

He works in a pair. Maurice dresses the outside; the **Mind Mirror** beside him reveals the inside —
that mirror is Timothy Leary's 1985 software, and it edits personality the same way Maurice edits
costume: *"No sliders. Just talk to the mirror."* Together they are a Create-A-Sim that covers
appearance **and** character, which is more than the original screen did.

**Why he deserves the credit, in four specifics:**

1. **He turns a slider panel into a conversation.** Faceball's editor, as specified, is a tool
   palette — `place_googly_eyes`, `define_mouth_hole_polygon`, `tune_vomit_threshold`. Maurice
   performs the same function as an agent who *proposes*. Ask him to combine two saved looks and he
   does not merge two records; he returns a named design with reasons: *"Space Pirate Swagger —
   holographic eyepatch, robot parrot, coat with star maps in the lining,"* offered as
   **ACCEPT / MODIFY / TRY DIFFERENT MIX**. That is an authored interaction, and it is what the
   Faceball editor should be.
2. **He is built out of the thing he is a tribute to.** Maurice carries Sims-1 traits himself
   (charisma 10, creativity 10, nice 10, playful 9) and Mind Mirror axes, and his abilities are not a
   command list but **`advertisements:` with `score_if` conditions** and a `food_chain` chaining
   `CHANGE-NAME → CHANGE-PRONOUNS → REWRITE-BACKSTORY → DESCRIBE-COSTUME`. That is the Sims'
   Find Best Action doing the work, so the homage is structural rather than decorative. The same
   machinery is specified for this repo's menus in
   [`designs/orchestrator-playsets/`](../orchestrator-playsets/).
3. **Saved looks are already Faceball's preset bundle, with a better interaction model.** A look
   saves as a card — a `.yml` identity plus a generated `.svg` portrait sidecar — which can be
   loaded, **composed** with another card, or shared to another room or character. Faceball's
   `per_face_preset` is the same object. Maurice's version can be handed to someone else.
4. **He sets the register for gender play, which this kit badly needs.** *"Corsets are gender
   neutral, sweetie."* Pronouns `they/he/her/it`, use any. `gender: null # Uses every pronoun.
   Gender is a costume.` *"Revenge Dress (all genders)."* Warm, celebratory, and never the butt of
   the joke. Faceball's own stance — celebrate gender play, don't shame anyone, aim satire at power —
   is easy to state and easy to get wrong in tone. Maurice is the working example of getting it
   right, and the adult palette should be read against him.

He is also an **NPC factory**: generate a character, costume them, give them a personality profile,
and dispatch them into the world. That is precisely the guest-puppet pipeline — build a face puppet
for a guest who has no time to record, with their dignity preserved by the bundle.

## Spore Creature Creator (Maxis, 2008)

**What was taken: parts that rig themselves, and the law about what players will build.**

Released standalone ahead of the game, the [Creature Creator](https://en.wikipedia.org/wiki/Spore_Creature_Creator) let you pull a spine, drop on limbs,
mouths, eyes and graspers, and — the part that matters — the animation system **worked out how to move
whatever you made**. You were not choosing from rigged presets; you built an arbitrary body and it
walked.

Faceball's `spore-creature-avatars` takes that promise: pop on mouths and eyes, then capabilities,
tools, armor, and vehicular appendages, with mass and physics per limb, and the rig adapts. It also
takes the **count freedom** — you are not limited to two of a part, or to an even number.

And it supplies the law the kit refuses to fight. Hand people a construction set and they will build a
penis; the only variable is how fast. Spore proved it at scale within days of the Creature Creator's
release. Faceball's position is that a kit which pretends otherwise is lying about its users, so it
ships the part, puts it behind a labeled curtain, and makes the censorship itself the joke —
[`adult-section.md`](adult-section.md).

### Ship the creator first, and drive Time To Penis negative

**The release order is the strategy, and Spore already ran the experiment.** The Creature Creator went
out *months ahead of the game*, so the creatures — and inevitably the Sporn — existed before the
simulated universe they were built for. Measured against the product, **Time To Penis was negative:
the phalluses predate the thing they are in.** Mythic Quest's "Time To Penis" beat treats that as the
engineering nightmare; Spore's release calendar treats it as a launch plan.

**Faceball should do the same, and not only for the joke.** Shipping the construction set standalone,
before the performance space exists, is the [seeds, not showpieces](README.md#seeds-not-showpieces)
thesis expressed as a release order:

- **The kit gets tested by the only people who matter** — the ones who will use it — before anything
  depends on it.
- **A library of parts accumulates ahead of the stage**, so the performance space launches into a
  populated world instead of an empty one. Spore shipped into a creature ecosystem it did not have to
  author.
- **TTP going negative is proof the tool works**, not a defect report. A construction set nobody
  immediately abuses is a construction set nobody is actually using.

`ordering: creator standalone → parts library accumulates → performance space lands on top of it.`
`The roadmap's v0 Canvas2D proof is already the right first rung; this just says publish that rung.`

## LittleBigPlanet — Media Molecule

**What was taken: lights are parts, and "Play, Create, Share" is this kit's thesis with better
marketing.** [LittleBigPlanet](https://en.wikipedia.org/wiki/LittleBigPlanet)
([Media Molecule](https://en.wikipedia.org/wiki/Media_Molecule), 2008) shipped a physics construction
set to a console audience and made authoring the product rather than a bonus mode.

**The specific theft is that you stick lights onto objects.** LBP's creation tools treat lights,
stickers and decorations as things you attach to any object you have built, with the same gesture you
use for everything else — not as scene settings living in a separate lighting panel. Faceball's
[lights](adult-section.md#lights-are-parts-too-and-lighting-is-what-sells-it) follow that exactly:
snap to an anchor, set colour, intensity, falloff and blink, stack freely, including onto a part that is
itself deforming.

**And lighting is why LBP's handmade world reads as tangible.** Fabric, cardboard and zips feel like
objects you could pick up, and almost all of that is how they are lit — the materials would be flat
texture without it. Same lesson here: **a lit, deforming soft body produces moving highlights that
confirm volume and weight, and the same mesh flat-shaded reads as a sticker.** The lighting pass is what
makes the physics legible, which is why it is not cosmetic and why it goes in early.

It is also the closest precedent for the kit's own social shape — build a thing, publish it, let other
people play and remix it — and the closest precedent for the moderation problem that comes with it, since
a construction set with a publish button immediately becomes a moderation product too. Faceball's answer
to that is [pixelated-by-default](adult-section.md#pixelated-by-default-and-that-is-the-joke).

`needs-check: Media Molecule (Guildford), published by Sony Computer Entertainment; first title 2008 on`
`PS3, with LittleBigPlanet 2 and 3 and Dreams following. "Play, Create, Share" is the franchise's own`
`marketing line. Verify the tagline attribution and dates before publishing, and check how the later`
`titles' creation tools handle lights before generalising from the first one.`

## Genital Jousting — Free Lives / Devolver Digital

**What was taken: the floppiness is the joke, and the anatomy is only the excuse.**
[Genital Jousting](https://en.wikipedia.org/wiki/Genital_Jousting) is a local and online party game for
up to eight players controlling detached, entirely uncooperative soft-body genitals, by
[Free Lives](https://en.wikipedia.org/wiki/Free_Lives) and published by
[Devolver Digital](https://en.wikipedia.org/wiki/Devolver_Digital). The
comedy is not the parts — it is that **you cannot make them do what you want.** Free Lives built the
controls to be unwieldy on purpose, so every round is a physics failure with witnesses, and the parts
are just the most efficient available way to make the failure funny. That is exactly the bet the
[adult section](adult-section.md#soft-body-parts) makes when it says the palette is unremarkable and
the modifier stack is the design.

**It is also the commercial precedent, which settles an argument rather than winning it.** This shipped
on Steam, at a price, with a real publisher, and reviewed well. So the platform question has a
documented answer and the answer is *per-surface*: the store was fine with it, and the moment it hit a
**broadcast** surface it became a moderation incident — Genital Jousting turned up prominently in
Steam's early live-streaming rollout, which is remembered as the embarrassment that forced attention
onto how that feature was curated.

**That per-surface split is precisely the wall Faceball is designed around.** Store-like surfaces
tolerate it; broadcast and social surfaces (Twitch, TikTok, Facebook) do not, and those are the ones
Faceball actually lives on. Pixelated-by-default is the answer to the broadcast surface specifically,
not to storefronts — and knowing which surface a rule belongs to is most of the work.

### The part that matters most: it is the uncensored control group

Genital Jousting has **no mosaic.** Everything is fully visible, all the time, and the result is
**goofy.** It reads as slapstick, it got reviewed as a party game, and nobody describes it as
pornographic — because **nothing is hidden, so nothing is imagined, so
[closure](adult-section.md#what-censorship-actually-does) never fires.** Full
visibility is the *tame* configuration.

That is empirical support for the prediction in the adult section, from a shipped commercial product:
the visible end of the asymmetry reads as silly, and the section argues the redacted-and-tracking end
reads as filthy. **A game made entirely of the thing is less obscene than a mosaic that merely follows
it around.**

The consequence is a genuinely funny inversion, and it falls straight out: **the cheat code
de-escalates.** Lifting Faceball's mosaic looks like the transgressive reward, and it is actually the
*milder* view — you unlock your way to Genital Jousting, which is to say to comedy. The censored
default is the spicier build, which is why
[pixelated-by-default](adult-section.md#pixelated-by-default-and-that-is-the-joke) costs the design
nothing.

**The genre also names its physics engines as part of the bit**, which is the register
`meatspin_rotation_engine` is written in: a neighbouring Steam title advertises "our revolutionary
**P.E.N.O.R. physics system**" in the same deadpan-spec-sheet voice. Mock-serious engineering language
applied to soft bodies is an established comic form, not an invention here.

`needs-check: Free Lives (Cape Town — also Broforce, GORN), published by Devolver Digital; Early`
`Access around late 2016 with a 1.0 release in early 2018. Verify both dates, the publisher, and the`
`eight-player figure before publishing. The Steam-broadcasting episode is remembered in the games`
`press and has a Wikipedia mention — get a citation and the actual date rather than repeating the`
`anecdote. Story mode follows "John" seeking a date for a high-school reunion and was received as`
`markedly more earnest than the premise implies; it drew serious critical discussion of its adult`
`themes. Do not characterise that story content from memory — read it up first, because that is the`
`part most easily got wrong. Neighbouring titles (Foreskin Fury, A Shlong Adventure, Penis Simulator)`
`are cited here only as evidence of a genre; the P.E.N.O.R. line is quoted from a store blurb.`

## The in-house lineage

These are the parts of the kit that are not homage but continuation — Don's own prior work, and his
collaborators'.

| Ancestor | What it contributed |
|---|---|
| **HOMER II** — Peter and Coco Conn, HOMER & Assoc., 1977–1997 | The real-time visual mixing console you performed **with your hands**, host programmed in PolyForth by Charles Moore himself. The analog grandparent of the whole kit: perform the mix, record the performance, overdub until it's right. [`homer-forth-flying-logos.md`](../../characters/coco-conn/homer-forth-flying-logos.md) |
| **Mona Eyes** — Don Hopkins, NeWS | Paste-on Eyeball objects on the Mona Lisa whose pupils track the cursor; split them, resize them, nest them. PostScript classes sent to the window server — *send code, not commands*. The direct ancestor of the googly-eye layer. |
| **Tom Ngo's ECG** and **Golan Levin's Mouther** | **The engine, not an influence — promoted out of this table to [its own section in the main design](README.md#the-engine-is-tom-ngos-ecg), because this kit is its showcase.** Tom built Embedded Constraint Graphics at Interval: examples at the vertices of a simplicial complex, drag a feature, and the solver recovers the blend weights. Golan built the vector face cartoons of [Mouther](https://www.flong.com/archive/projects/mouther/) in Tom's editor, with Malcolm Slaney on speech — the proof that ECG makes good cartoon faces, and the direct ancestor of every puppet here. Patent US5933150 lapsed around August 2016, so it is free to build. Essay: [`tom-ngo-embedded-constraint-graphics-at-interval.md`](../../characters/don-hopkins/tom-ngo-embedded-constraint-graphics-at-interval.md) · pair show seeded: [`repo-shows/tom-and-golan-ecg-mouther/`](../../repo-shows/tom-and-golan-ecg-mouther/) |
| **Bounce** — David Levitt and Don, Interval Research | Live TV plus a synchronized closed-caption feed driving simulated puppets who argue about the show, MST3K-style. Its amplitude-scrub trick — remap a gesture so you can play **any** audio with **any** gesture — is the direct ancestor of the `amplitude-scrub` mode. [`interval-research-pluggers-and-mediaflow.md`](../../characters/don-hopkins/interval-research-pluggers-and-mediaflow.md) |
| **SimFaux** — Don, 2006 | OpenLaszlo news parody: pie menus driving live simulated talking heads over real media. The bridge demo. [video](https://www.youtube.com/watch?v=gRodlxUZ9SQ) |
| **[Sarah Cooper](https://en.wikipedia.org/wiki/Sarah_Cooper)'s technique** | Lip-sync a puppet to a public figure's **real, verifiable** audio and let the real audio carry the satire. Method credit, and the reason the kit never needs a voice clone. |

## Ben Shneiderman — direct manipulation

Underneath all of it: the parts are **on screen and you move them with a pointer**, and the result
happens immediately and visibly. That is direct manipulation, and the multi-user frenzy mode is
direct manipulation turned into a party game —
[`process/trails/direct-manipulation.md`](../../process/trails/direct-manipulation.md).

## See also

- [`README.md`](README.md) — the kit itself
- [`physics-and-gags.md`](physics-and-gags.md) — where the [Incredible Machine](#the-incredible-machine-and-incredible-toons--dynamix) credit gets spent
- [`adult-section.md`](adult-section.md) — where the Spore and Sims-1 credits get spent
- [`process/artifactory.yml`](../../process/artifactory.yml) — construction sets as artifact factories
