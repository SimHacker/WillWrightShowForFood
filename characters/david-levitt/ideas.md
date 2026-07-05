# Ideas to explore with David Levitt 🎹

*Conversation hooks for a Repo Show — **Don's proposed topics**, each grounded in David's public work
and documented connections to this repository. Things Don would love to follow **with** David Levitt;
not quotes, not claims about what they think.*
[Portrayal standards](../../schemas/portrayal-standards.yml) · invitation guest · consent not_yet_asked

## What David has done

Dr. David Levitt — cognitive scientist, entrepreneur, musician; Don's **dear friend** and longtime
collaborator. Under **Marvin Minsky** at MIT, pioneered **AI / algorithmic music** — a PhD on
**computational jazz / improvisation** (thesis *A Representation of Musical Dialects*; co-edited
*Machine Models of Music*, MIT Press) — and built **Hookup**, the real-time patch-cord visual
programming language that (per Mark Coniglio) originated the metaphor behind **Interactor/Isadora**
and **Max**. **VPL Research** — on the team that invented VR, adding the first realistic **gravity,
collisions, and thrown-ball physics** to VR worlds. **Interval Research** — consumer media creation
(**MediaFlow**) and **Bounce** character simulation. Founder/CEO of **ConnectedMedia** (**ConnectedTV**,
built with Don) and **Hip Software / Levity**. Co-founder & CEO of **Pantomime Corporation** (2014),
where **Don Hopkins was Chief Architect**. Also **Atari (Cambridge Research)**.

Don ↔ David, a shared timeline: **VPL Body Electric** (with Jaron Lanier) → **Levity** (Bounce for Mac —
Don serial contract, COM reinvention, **Space Seed** demo) → **Interval Research** (MediaFlow, Bounce
character simulation) → **ConnectedMedia** (ConnectedTV — Palm TV-guide/universal-remote with Don)
→ **Pantomime Corporation** (Don = Chief Architect; JSON object system, plugin/networking/build-config
stack, digital-twin 3D models) → ongoing friendship. Full sourced links: [`media/README.md`](media/README.md).

## Shared ground

*Topics that connect David Levitt's work to this repo — public themes only.*

- **Pantomime** — AR/VR for any device, headset optional; Don's **JSON object system** underneath
- Lineage: **Self / NeWS → Pantomime JSON → Don's JSON/YAML config → MOOLLM** ([slots-all-the-way-down](../david-rosenthal/slots-all-the-way-down.md))
- **Bounce / Body Electric / Hookup** — David's visual-programming line; **Don co-developed Bounce**
- **ConnectedTV** — the Palm tap/**stroke-vs-poke** TV guide + universal remote **Don & David built**
- **Interval Research** — MediaFlow, Bounce character simulation, and other projects
- **VPL Research** — the birth of VR; gravity, collisions, 3D sound
- **AI music / computational jazz** — Minsky-advised; models that *understand* musical dialects
- Sourced links for all of the above: [`media/README.md`](media/README.md)

## The hooks

### 1. Show seed: `music-and-theory` (with Jerry Martin)

David's **AI music** lineage (MIT/Minsky) paired with **Jerry Martin** (The Sims / SimCity 3000
composer). What does algorithmic arrangement mean when the model *understands* musical dialects?
[`repo-shows/REPO-SHOWS.yml#music-and-theory.yml`](../../repo-shows/REPO-SHOWS.yml)

### 2. Pantomime — the JSON object system Don built

The heart of it for this repo. Pantomime grew a **reflective, dynamic, self-inspired object system in
JSON**: **plugin objects**, a **multiplayer networking protocol**, and **multiple inheritance + mixins**
used for templates, classes, object definitions and their variations — *and* for **build
configurations** across **iPhone, iPad, Android, GearVR, laptop, desktop**, driving **digital-twin,
to-scale 3D models** for each. It's the direct ancestor of Don's JSON/YAML config system and MOOLLM.
Walk it with David on air. [`../david-rosenthal/slots-all-the-way-down.md`](../david-rosenthal/slots-all-the-way-down.md) · media [`../don-hopkins/media/pantomime/`](../don-hopkins/media/pantomime/)

### 3. ConnectedTV — stroke vs. poke, touch before touch was cool

The Palm app **David and Don built at ConnectedMedia**: a personalized handheld **TV guide fused with a
universal remote**, usable **one-handed in a dark room without a stylus**. Their trick — repurpose the
Palm's stroke recognizer into **pie-menu buttons** where a tap plus up/down/left/right strokes pack **up
to five functions per finger-sized button** (**"Finger Pies"**), plus **"Touch Tuning"** (touch a show's
*name* to change the channel). A **swipe-to-unlock predecessor**; Sony bundled it on the **CLIÉ**; users
called it "addictive." Firsthand + PenComputing/PCMag reviews + David's own essay:
[`media/README.md`](media/README.md#connectedtv-connectedmedia--david--don).
*(Still to capture from Don: the **XML-based custom-UI editor**, and **IR-code capture + community
sharing** website.)*

### 4. Bounce, Body Electric, and Hookup — the patch-cord lineage

David's visual-programming line is a genuine jewel. **Hookup** (David at MIT, office-mate of **Miller
Puckette**) is credited by **Mark Coniglio** as **the first "patch-cord" visual language** — ancestor of
**Interactor/Isadora** and the metaphor **Max** inherits.

**VPL Research:** David worked with **Jaron Lanier** on **Body Electric** — the original name of **Bounce**.
Jaron gave David rights to **Hookup**; when VPL shut down, David received rights to **Body Electric**.

**Levity** (Hip Software / Levity Novelty) got rights to **develop and sell Bounce for the Mac**. Don
**serial-contracted** there with David — shippable product, dogfooded, reinvented with **plugin COM
datatypes**, **objects on wires**, **plugin components with COM**, and a new **multimedia video renderer**.
Demo name: **"Space Seed."** Don still has the **source** (Pascal → machine-mangled C) — TypeScript
reincarnation candidate.

**Interval Research** followed — Bounce character simulation, MediaFlow, and more with David (parallel
threads, not one port of the other). Don calls Bounce *"one of the most productive, delightful visual
programming languages I've used."*

**Rebounce — the salute + reimplementation jam.** The show that brings it back:
[**Rebounce**](../../repo-shows/rebounce/README.md) — check in the old Bounce source and invite many
people to rewrite it **by hand and with AI, competing and cooperating**, seeded by **David + Don**
(and **Jaron** for the origin story). Don's firsthand stack writeup — the **Swivel 3D transform-tree
skeleton** projected in real time, **UDP → two SGI renderers (one per eye)**, the Atlanta input hub
(MIDI / Polhemus / DataGlove / Convolvotron), live-coding while running, and **typed colored wires
carrying whole JSON-like COM objects** (beating the 6-parameter limit; ancestor of Pantomime JSON →
MOOLLM): [`../don-hopkins/body-electric-bounce-vr-stack.md`](../don-hopkins/body-electric-bounce-vr-stack.md).
Full proposal: [`../don-hopkins/rebounce.md`](../don-hopkins/rebounce.md).

Sourced: [`media/README.md`](media/README.md#bounce--body-electric--hookup-visual-programming-for-vr--music) ·
Trail: [`../../process/trails/visual-programming-patch-cord.md`](../../process/trails/visual-programming-patch-cord.md) ·
Don: [`../don-hopkins/levity-bounce-space-seed.md`](../don-hopkins/levity-bounce-space-seed.md)

### 5. VPL — building the first VR worlds

Realistic gravity, collisions, 3D sound at the company that coined "virtual reality" — David's **three
prerequisites for "good VR"** (reach in 3D · shared reality · physically realistic worlds) are the
straight line from **VPL → Pantomime's** device-optional AR/VR.

### 6. Computational jazz, Minsky, and a Lisp machine — dear friend, in memoriam

David's PhD under **Marvin Minsky** was on **computational jazz / music improvisation**. **Cynthia
Solomon** has **video of young David at the MIT AI Lab in front of a Lisp machine** demoing that
software (also his **Atari Cambridge Research** days). A warm hook for a **dear friend to interview** —
and a chance to **memorialize Minsky** together, and recount the many places Don and David have
coexisted (Levity, Interval, ConnectedMedia, Pantomime). See [`../marvin-minsky/memorial.md`](../marvin-minsky/memorial.md),
[`../cynthia-solomon/`](../cynthia-solomon/).

## Sources (public)

- **Sourced evidence hub (HN permalinks + videos, by project):** [`media/README.md`](media/README.md)
- [`invitation.md`](invitation.md) · [`CHARACTER.yml`](CHARACTER.yml) · [`GLANCE.md`](GLANCE.md)
- Pantomime Corporation — [pantomime.co](https://www.pantomime.co/) (Levitt CEO; Hopkins Chief Architect)
- ConnectedTV review — Geoff Walker, [PenComputing (2002)](http://www.pencomputing.com/palm/Pen44/connectedTV.html); David Levitt, [*iPhone Lovefest — Stroking vs Poking*](https://www.facebook.com/note.php?note_id=106220169912)
- Bounce/Hookup/Body Electric — [Medium: Bounce Stuff](https://medium.com/@donhopkins/bounce-stuff-8310551a96e3) · [c2: BounceLanguage](https://wiki.c2.com/?BounceLanguage)
- David Levitt, *A Representation of Musical Dialects* (MIT); *Machine Models of Music* (MIT Press, co-edited)
