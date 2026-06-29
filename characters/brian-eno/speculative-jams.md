# Speculative jams — oblique provocations for the Eno show 🎛️🕸️

> **READ THIS FIRST.** Everything below is **speculative, aspirational, creative design** — a pile
> of *what-ifs* to **jam about, prototype, and inspire others to build**. It is **not** real
> events, **not** quotes from Brian Eno (or anyone else), and **not** a commitment from any named
> person. The collaborators named here are **imagined dream casting**, not bookings. Treat this the
> way Brian treats an **Oblique Strategy card**: a provocation that breaks you out of the obvious,
> not a fact. Sort the keepers from the duds *with* the guests, live.
>
> Grounded, real-Eno conversation hooks live next door in [`ideas.md`](ideas.md). This file is the
> playground.

*Origin: AI-brainstormed riffs, harvested and curated by Don. Offered as fuel, flagged as fiction.*

---

## 1. The Musical Pie Menu / Spider Web 🕸️🎵

The strongest provocation: **a pie menu as a musical instrument.** Don's pie menus already treat
**direction as meaning** — so:

- **Eight directions = eight notes / timbres / voices.** The slices are the palette.
- **The music is in the *curves*, not the nodes.** The *path* your gesture takes between slices —
  its **speed, arc, and pressure** — bends pitch, blends voices, and shapes the envelope. A flick
  is a stab; a slow spiral is a swell.
- **The center is empty.** Like the Tao — silence/rest lives at the dead center; you return there
  to stop.
- **It's improvisable and self-revealing** — the same muscle memory that makes pie menus fast makes
  this playable without looking.

**Implementable today** (browser + WebAudio + the SvelteKit pie-menu component): a gestural synth
where a recorded gesture *is* a phrase you can replay, layer, and loop.

## 2. The Oblique-Strategy Pie Menu 🃏

A pie menu whose slices are **Oblique Strategies** — *Use an old idea · Reverse · Simplify ·
Honor thy error · Repetition is change · Remove · Random · Repeat.* Draw one with a gesture and it
**acts on the current state** — bending an image, a sound, or a generative prompt in real time.
The card becomes an executable rule. (This one is genuinely easy to ship and demo on stream.)

## 3. The Collaborative Web — multiple spiders, one silk 🎭

*Speculative casting (imagined, not booked):* a trio where each performer holds their own web/
quadrant and **their gestures perturb the others'**:

- an **ambient/generative** voice (the Eno register),
- an **explosive/transformative** voice (a Nina-Hagen-ish register — rage→joy→screech),
- a **narrative/technological** voice (a Laurie-Anderson-ish register — spoken word, vocoder, tech↔human).

The fun mechanic: **propagated influence** — when one spider plucks the web, the others feel it.
Pseudocode sketch to prototype against:

```
performGesture(performer, gesture):
    if gesture is spiral:  addHarmonic(performer, complexity++)
    if gesture is curveTravel:  blendVoices(gesture.start, gesture.end)
    propagateInfluence(performer, gesture)   # everyone's web vibrates
```

## 4. The venue *is* the web 🏛️

Aspirational, big-room version: **audience members are spiders too.** Phones become gesture
controllers; everyone's movement nudges the music; the space resonates along curved paths; **no two
performances are ever the same.** (A natural fit for the Brain Stream / overlay rig — crowd input
as another instrument.)

## 5. Compose *from* an image 🌅

Eno's generative-from-rules idea, pointed at pictures: feed the system an image and **derive** the
piece from it — rhythms from visual repetition, textures from color frequencies, melodies traced
along **curved paths**, density from busy-vs-empty regions. Pairs perfectly with Scott's Electric
Sheep frames as the *source* material → a sheep that **sings itself**.

## 6. The Recursive Transformation jam 🔄

A game/format: **image → sound → image → …**, where each pass **transforms rather than copies**
(change the medium; shift perspective; add what's missing; remove the obvious). The provocation to
keep: *"the second version is more emotional than the first; the third transcends both."* This is
the **Tiger-Mountain-by-transformation** move (Hilsinger & Beatty 2004) turned into a repeatable
audience activity.

---

## How to use this in the show

- Pick **one** buildable seed (the **Oblique-Strategy pie menu** or the **gestural musical pie
  menu** are the easiest live wins) and actually implement a toy version on stream.
- Keep the rest as **open provocations** the audience can fork into the repo — "homefun," not
  homework.
- Always present these as *Don's speculative pitches inspired by Brian's principles*, never as
  things Brian said or agreed to.

*See also:* [`ideas.md`](ideas.md) (the grounded, real-Eno hooks) · [`README.md`](README.md) ·
[`../../repo-shows/brian-eno/`](../../repo-shows/brian-eno/)
