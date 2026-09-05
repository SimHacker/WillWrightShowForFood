# Ideas to explore with Steve Alvey 🏙️

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in Steve's
public work and documented connections to this repository. Things Don would love to follow
**with** Steve Alvey; not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.md) · invitation guest · consent asked (invited Aug 2026)

## What Steve has done

Steve Alvey — **SimSlice** / **SliceCity** (SimCity running *inside* The Sims): the shipped precedent for Will's nested-games vision. Married to **Heather Castillo** (SimFreaks) after years as parallel fan-site creators. Co-ships **Zombie Sims**. **Gallium / Proxi** with Will. **Soul City** publishing with Don now.

## The hooks

### 1. Fan band back (and still) together ★
Origin story: [`../../repo-shows/heather-and-steve/sources/fan-band-marriage-arc.md`](../../repo-shows/heather-and-steve/sources/fan-band-marriage-arc.md)  
SimSlice about page timeline: ~10 years online before meeting, ~7 years to marriage ([simslice.com/about](https://www.simslice.com/about/index.shtml)).

### 2. SliceCity — data portability crown jewel
SimCity in the back yard — Wired-era coverage; Will's 1996 dream actually shipped.  
→ [`../../bits/theme-data-portability-crown-jewel/theme-data-portability-crown-jewel.md`](../../bits/theme-data-portability-crown-jewel/theme-data-portability-crown-jewel.md)

### 3. Show seed: `repo-shows/heather-and-steve/`
Whole-career pair show; Afterlife × ZombieSims flagship episode.

### 4. Zombie Sims with Heather
Magnum-opus pack still shipping — the project they build *together* after the fan-site era.

### 5. Soul City + Soul City bridges
Round-tripping saves; federated catalogs — [`../../catalogs/soul-city/README.md`](../../catalogs/soul-city/README.md).

### 6. Gallium / Proxi
What nested-simulation craft meant inside Will's AI life-sim experiment.

### 7. The Hierarchy of Bleeds — clone the blue flood
Did you clone the blue flood into a red blood flood? Or chum flood with lots of niblets? 😉
Chum replaces blood, blood replaces water, never backward — Maslow for fluids, plus diarrhea
floods, the pee-puddle question, moveable-feces combination rules, z-buffered layer
compositing, and plate-style attachment slots on every layer.
→ [`../../repo-shows/heather-and-steve/sources/2026-08-20-brain-flurries-and-the-hierarchy-of-bleeds.md`](../../repo-shows/heather-and-steve/sources/2026-08-20-brain-flurries-and-the-hierarchy-of-bleeds.md)

### 8. QR codes — giving a linkless game links, 26 years late ★
Don's proposal: Sims objects carry a QR code, either as an in-world sprite with a forward-pushed
z-buffer toggled by a **"QR Code"** action, or — far cheaper — as a BMP injected into an **About**
dialog. Point your phone at the screen and you are on the creator's page. Steve is in, and moved the
idea somewhere better than where it started (below).

**Why it feels obvious yet nobody did it: it was impossible while the game was current.** The Sims 1
shipped in 2000. QR existed (Denso Wave, 1994), but phone cameras were not practical scanners until
roughly 2010 and OS-level scanning came later still. This is not a gap someone overlooked — it is a
**genuinely new affordance for a 26-year-old runtime**, which is a much better story.

**The move underneath it:** an optical hyperlink out of a runtime with no link affordance at all. The
Sims 1 has no browser, no clipboard bridge, no URL type, and needs none, because **the resolver is
the player's phone.** The host application never has to cooperate or even know. Any closed, finished
platform that can draw a bitmap can be given links after the fact.

**Steve's version is the stronger one.** Don proposed attribution — link back to my site. Steve
proposed pedagogy — link to *what this object teaches*, so a player can scan a prop and learn about
the real thing. That is a **citation apparatus for a game world**: every object footnoted, sourced,
and followable. It is the version worth building first.

**Where it landed: Wikipedia.** An educational object scans through to the real thing's Wikipedia
article — which also solves the durability problem, since the creator only maintains a mapping from
object to article instead of keeping a destination page alive for 26 years.

**The dialog wins; the sprite becomes a game mechanic.** Popup dialog images are the practical
answer — more pixels, no compositing, no occlusion. The in-world floating sprite loses to something
error correction cannot fix: *dumb Sims walk in front of it*, which makes scanning intermittent
rather than cleanly broken. But that failure is a brief for a different feature. A code you can only
catch briefly, partially, from the right angle, is a code you have to **catch** — the Pokémon
mechanic arriving backwards. Occlusion is a bug in a citation and a feature in a hunt.

Design questions worth working out together on camera:
- A short URL is mandatory. At 800×600, a Version-1 QR (21×21 modules) at 2px/module plus quiet zone
  is ~50px — plenty for a redirector, nowhere near enough for a raw GitHub URL.
- QR error correction (Reed–Solomon, 7–30% recovery by level) means a partly-occluded in-world sprite
  may still scan — which softens the z-buffer problem the sprite approach exists to solve.
- **Link rot is the real risk.** A 26-year catalog will outlive its URLs. Bake in a redirector the
  creator controls, not destination URLs frozen into objects forever.

Generalized as a dispenser pattern — the object issues the ticket, the ticket points back at the
object — in [`moollm/designs/webtop/DISPENSERS-AND-SOUVENIRS.md`](https://github.com/SimHacker/moollm/blob/main/designs/webtop/DISPENSERS-AND-SOUVENIRS.md).

### 9. The TypeScript object compiler — and decompiling 26 years ★
Don is writing an isomorphic TypeScript pipeline (browser *and* Node) for reading, writing, and
generating Sims objects, with **SimAntics written as YAML**. Source is a directory: throw images and
YAML in a folder, run the compiler. YAML because it has comments — which disqualifies JSON, and
Transmogrifier supplied a lifetime's worth of XML.

It runs in the browser on purpose. The people who make Sims content are mostly **artists, not
programmers**, so a CLI would exclude the audience the tool exists for. Pointy and clicky is the
requirement.

**The topic for Steve:** running the compiler *backward*. If existing IFF behaviors decompile into
the same readable YAML, his ~26-year catalog stops being opaque binaries and becomes greppable,
diffable source — simultaneously the best documentation the format could have and a corpus of the
community's own idioms. He is also the ideal first non-Don user and the honest test of the
artist-not-programmer claim.

The format trap and why the YAML has to be a real language rather than a bytecode dump:
[`moollm/designs/sim-obliterator/BRIDGE.md`](https://github.com/SimHacker/moollm/blob/main/designs/sim-obliterator/BRIDGE.md).

## Sources (public)

- [`invitation.md`](invitation.md)
- Story arc: [`../../repo-shows/heather-and-steve/sources/fan-band-marriage-arc.md`](../../repo-shows/heather-and-steve/sources/fan-band-marriage-arc.md)
- Show seed: [`../../repo-shows/heather-and-steve/`](../../repo-shows/heather-and-steve/)
- [`CHARACTER.yml`](CHARACTER.yml)
- SliceCity gallery: [`../will-wright/media/sims-simslice-README.md`](../will-wright/media/sims-simslice-README.md)
