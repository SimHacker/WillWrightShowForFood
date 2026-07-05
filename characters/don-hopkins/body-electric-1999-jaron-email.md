# Body Electric — the 1999 Jaron↔Don email, and the people around it

*A primary-source companion to the [Body Electric / Bounce VR stack](body-electric-bounce-vr-stack.md)
history. This gathers the sourced material behind the story: the **1999 Jaron Lanier ↔ Don Hopkins
email**, the **Hookup → Bounce → Shockwave** lineage, **Mark Coniglio's** account of Hookup's
patch-cord origins, **Image/ine** at **STEIM**, and the Jaron ephemera worth citing on air. Don's
oral history is warm and largely from memory — items marked **[confirm on air]** are pointers to
verify with the people who were there.*
[Portrayal standards](../../schemas/portrayal-standards.yml) ·
Trail: [visual-programming-patch-cord](../../process/trails/visual-programming-patch-cord.md)

## The correction that matters: Chuck Blanchard

**Body Electric** was VPL Research's real-time visual-programming language for VR, music, and hardware.
Its **lead designer/programmer was [Chuck Blanchard](../chuck-blanchard/README.md)** — not Jaron
Lanier. Jaron **co-founded VPL, coined "virtual reality," and drove the vision**; he and others *used*
Body Electric to build VR sims and virtual instruments. Chuck wrote the custom tools that made it sing
(including the Swivel 3D transform-tree editor built into the environment).

The primary source is the **1999 email exchange between Jaron and Don** (preserved in
[bounce-notes.txt](https://www.donhopkins.com/home/archive/visual-programming/bounce-notes.txt)), where
Jaron himself makes the point:

> "The problem was that Chuck Blanchard wasn't credited as the lead designer/programmer of BE/Bounce
> when David brought the program to Interval. Chuck's name was reduced in stature…"

Per that thread: Chuck lived in San Francisco, had MS, and needed health insurance; Jaron yelled at the
person who ran Interval over how Chuck was treated, and David was still upset with Jaron for making a
fuss. **[confirm on air]** — this is sensitive personal history; treat gently and confirm with those
involved.

## The rights chain (Don's recollection — [confirm on air])

- **[David Levitt](../david-levitt/README.md) created Hookup** at MIT — his own patch-cord visual
  language (credited by Mark Coniglio as the first "patch-cord" metaphor), which he'd turned into a
  **Mac product**.
- David had **granted VPL the rights to market his Hookup Mac product** (and **possibly HarmonyGrid** —
  Don is unsure).
- When VPL was falling apart, **David was given the rights to develop Bounce** — a Mac product based on
  **Body Electric** — **as compensation for losing the rights to his own Mac app(s)** (Don's best
  recollection; David may recall the details better — **confirm**).
- **Sun Microsystems also acquired rights to Body Electric**; Jaron did work on that with Sun. Sun
  refused an open-source release; Jaron could pick up to six sites with free hacking privileges. Source
  was included in patents (so, on paper, released by the US government).
- **Bounce** = David's derivative of **Body Electric** + **Macromedia MMP**; Don helped develop and
  productize it at Levity / Interval Research (COM/ActiveX plug-in datatypes, "jsonic" objects on
  colored typed wires, the Rush Limbaugh / Jesse Jackson closed-caption demo, the *Space Seed* demo).

## Hookup → MMP → Shockwave

**Hookup** incorporated the **Macromedia Director MMP player plug-in**. That **MMP player plug-in →
became Macromedia Shockwave** in the browser. David shared an MIT office with **[Miller
Puckette](../miller-puckette/README.md)** (the "Music Hacker's Hangout").

## Jaron's "UI all the way to the bottom" (Viewpoint / Body Electric parallel)

From the 1999 thread — the idea that the virtual world and the knowledge base should be the same thing:

> "I had always thought the swivel tree was ridiculous… but I liked the idea that the virtual world and
> the knowledge base were the same thing — that unity encourages the visibility and grabbability of the
> underlying concepts… it's user interface all the way to the bottom! What I think would be the coolest
> long-term destination of BE would be extending the scenegraph so that it was as powerful a knowledge
> base as you'd want…"

This is the seed of the conversation Don recounts in the [VR-stack history](body-electric-bounce-vr-stack.md):
is Swivel 3D general enough to represent anything, or do you need a non-visual text config language?
Jaron's answer — the value of the visual 3D tree is that **it forces you to make your objects visible.**

## Body Electric hardware stack (from Don's HN posts — [confirm specifics on air])

MIDI · UDP over Ethernet · **Swivel 3D** 3D skeleton files (animated, state sent over the network) ·
a pair of **SGI** workstations (one per eye) rendering with the **Isaac** engine to VPL **EyePhones** ·
**DataGlove** · **Body Suit** · **Ascension Flock of Birds** · **Polhemus** · **Spaceball** ·
**Convolvotron** (3D spatialized audio).

There is a real **community of Body Electric users** (per the 1999 email) — still building some of the
most interactive 3D worlds; used for ergonomic sims, surgical planners, cognitive-test rigs, and work
with kids.

## Jaron ephemera worth citing

- **Scientific American cover, September 1984** (Computer Software issue) — Jaron designed the musical
  visual program on the cover; Scott Kim cited it in his thesis.
  ([SciAm Sept 1984](https://www.scientificamerican.com/magazine/sa/1984/09-01/))
- **"Programmers at Work" (1986)** — young Jaron on visual programming languages ("you have to simulate
  in your head an enormous elaborate structure…").
  ([interview](https://programmersatwork.wordpress.com/jaron-lanier-1986/))
- **Power Glove (1989)** — Jaron / VPL role.
- **The Lawnmower Man (1992)** — VPL EyePhone featured; Pierce Brosnan played a Jaron-based character.
  ([EyePhone clip](https://www.youtube.com/watch?v=Y4RJetzDyOY&t=28m18s))
- **"The mind may forget, but the body remembers"** — Jaron quote Don uses re: pie menus / muscle
  memory.
- Books: *You Are Not a Gadget*, *Who Owns the Future?*, *Dawn of the New Everything* — the "data
  dignity" line that anchors [Jaron's ideas.md](../jaron-lanier/ideas.md).

## Mark Coniglio & the Hookup patch-cord lineage

**[Mark Coniglio](../mark-coniglio/README.md)** (Interactor / Isadora) documents where the patch-cord
metaphor came from (from [sdela.dds.nl/sfd/isadora.html](http://www.sdela.dds.nl/sfd/isadora.html)):

- **1986** — Morton Subotnick used **David Levitt's Hookup** at MIT.
- Coniglio (a CalArts composition student and strong programmer) hardcoded Mort's ideas → this became
  **Interactor**, used in Mort's 1987 piece *Hungers*.
- **1996** — a Troika Ranch STEIM residency; Coniglio saw **Image/ine** → **Isadora** grew out of
  Interactor.
- Both **Isadora** and **Max** inherit the patch-cord metaphor from **Hookup** — but Isadora shows
  parameter names/values plus real-time graphic feedback per module.

## Image/ine & STEIM

**Image/ine** — real-time video-manipulation software from **STEIM** (Amsterdam), by **[Steina
Vasulka](../steina-vasulka/README.md)** + **[Tom Demeyer](../tom-demeyer/README.md)** (1996–2001),
Mac, plug-ins. The **Mac PowerPC 8600** was "the dream machine." Features were later absorbed into
**Isadora**. (This is also the milieu behind the [Netochka Nezvanova](../netochka-nezvanova/README.md)
rumors — NATO.0+55+3d drew in a similar real-time-video direction.) For the full picture of this
moment, see [Real-time net jamming — the nettime scene](realtime-net-jamming-scene.md).

## Links to preserve

- **bounce-notes.txt** (1999 Jaron thread): https://www.donhopkins.com/home/archive/visual-programming/bounce-notes.txt
- Coniglio / Isadora history: http://www.sdela.dds.nl/sfd/isadora.html
- Image/ine: https://v2.nl/archive/works/image-ine · https://image-ine.org/ · Steina (Vimeo) https://vimeo.com/41196405
- STEIM: https://steim.org/ · https://en.wikipedia.org/wiki/STEIM
- Bounce (Don): https://medium.com/@donhopkins/bounce-stuff-8310551a96e3 · https://wiki.c2.com/?BounceLanguage
- Jaron / VPL: http://www.jaronlanier.com/vpl.html · https://wiki.c2.com/?JaronLanier · https://www.vrs.org.uk/virtual-reality-profiles/vpl-research
- Key HN item IDs: 22788773 (Don's VP survey), 23012948 (Jaron BE discussion), 24266722, 33668198 (Image/ine), 24265876 (Jaron social media)

## Show-wrapper video candidates

- **BT — "This Binary Universe"** (all-Csound procedural music).
- **The Lawnmower Man** (VPL EyePhone).
- **Cynthia Solomon's clip** of young David Levitt playing ragtime on a MIDI Lisp machine (referenced in
  [don-and-david-history](../david-levitt/don-and-david-history.md)).
- **Steina Vasulka** (Vimeo, above).
- **NATO.0+55+3d on El Capitan** (see [Netochka Nezvanova](../netochka-nezvanova/README.md)).

*Status: sourced consolidation of Don's notes + the 1999 email + Coniglio/STEIM history. Quotes are
transcribed from the archived thread and Coniglio's page; verify exact wording against the sources, and
confirm the sensitive personal details (Chuck's treatment at Interval) with the people involved before
airing.*
