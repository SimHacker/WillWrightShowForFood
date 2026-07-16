# PIXIE source recovery 🥧📜 — Heinz has the complete program

**7 July 2026.** Fresh from the CARS Congress 40th anniversary in Nagoya, Heinz Lemke wrote to
the PIXIE trio thread (Don, David Rosenthal, Lars Brinkhoff) with the sentence preservationists
dream about:

> I have the complete PIXIE program as a list of some 5000 words in Assembler/Machine code for
> the PDP 7 and DEC 340 Display. So, if you need to have a look at it, I will make preparations
> to copy this document in due course. It has all the details about light pen handling,
> interrupt management and interactive model building on the PDP 7.

Fifty-seven years after the 1969 CAD Conference paper, the program everyone assumed was lost —
Don had written days earlier, *"I am presuming that most of the PDP-7 software from Cambridge was
lost"* — turns out to have been in Heinz's keeping all along.

## The correction: PIXIE's PDP-7 was not a dumb terminal

The same email corrects the historical record. David Rosenthal had reasonably described the
Cambridge PDP-7 as "simply a display terminal for a program running on Titan" (citing the diagram
on p. 465 of [the PIXIE paper](https://www.donhopkins.com/home/documents/PIXIE%20a%20new%20approach%20to%20man-machine%20communication.pdf)
— "There is only so much you can do with 8K 18-bit words"). Heinz, who wrote the code:

> Please also note, the PDP-7 for PIXIE was NOT simply a display terminal for a program running
> on Titan! The 5000 instructions were primarily designed to interactively build up data
> structures for graph theoretic models (these had to fit in the remaining 3000 words on the
> PDP 7) that could represent electronic circuits, syntax graphs, control systems, etc, which
> were then sent to the Titan computer for simulation and so on.

So the architecture was: **5000 words of interaction code + 3000 words of live graph model** in
8K total — an interactive **model builder** at the display, shipping graph-theoretic structures
(electronic circuits, syntax graphs, control systems) to Titan for simulation. Not a remote
framebuffer; a thin, smart authoring station with the model resident locally. Every byte of that
8K budget is a design decision — and now we can read them all.

David also contributed the light-pen mechanics in the same thread:

> The light pen just noticed when the beam passed underneath it. IIRC the display processor got
> an interrupt when it detected the beam, and you had to figure out what you were drawing at
> that time.

Which is exactly what makes the listing precious: Heinz says it documents **light pen handling,
interrupt management, and interactive model building** — the three things the paper describes in
prose and the code implements for real.

## Why this matters

- **From telecine to source.** The 1969 films (digitized 2019 via David Chapman) let us *watch*
  PIXIE. The listing lets us *run toward* it: Lars Brinkhoff's PDP-7 + Type 340 emulation
  segment gets an authentic target instead of a reconstruction from the paper.
- **Radial menu prehistory, executable.** The earliest known radial/pie menus, in the original
  assembler — the show can walk from Wiseman's notes to the interrupt handler that made the
  light pen point.
- **The show writes history.** A Repo Show invitation thread surfaced a 57-year-old source
  listing and corrected a plausible-but-wrong architecture story within four days. Recording
  season is now.

## Roy Eagleson — lecture synchronicity (7 July 2026)

In Nagoya, Heinz discussed PIXIE with his friend **Roy Eagleson** (Western University / UWO),
who teaches the history of computer graphics in his CS courses. Heinz Cc'd Roy on the trio thread.

Same morning Heinz sent the source-listing email, Roy was preparing an HCI lecture — normally
**Sutherland's Sketchpad**, now **PIXIE** — and reading Don's page on **Buxton's patent-system
abuse** when the login-code prompt and Heinz's message arrived in the same breath. *"What a small
world."* He asked whether to play the video to **Flight of the Bumblebee** in class; Heinz replied
with [the YouTube link](https://www.youtube.com/watch?v=jDrqR9XssJI).

Primary source: [`sources/2026-07-07-pixie-trio-thread.md`](sources/2026-07-07-pixie-trio-thread.md).
Roy is on the correspondence thread — see [`../roy-eagleson/`](../roy-eagleson/) for his educator
room (Sketchpad → [**Geometer's Sketchpad**](https://en.wikipedia.org/wiki/The_Geometer%27s_Sketchpad)
line → PIXIE). [**Ivan Sutherland**](../ivan-sutherland/) — hero / north star.

## Scale update (15 July 2026)

Heinz to Roy Eagleson: hard copy is **~110 A3 pages** (~40–50 instructions/page) plus **15 pages**
for the **RSP** data-structure package — **125 pages total**. Local digitization shop being located.

Primary source: [`sources/2026-07-16-pixie-storyline-thread.md`](sources/2026-07-16-pixie-storyline-thread.md).

## CARS 2027 milestone (29 June 2027, Berlin)

Heinz proposes special **HCI session** at CARS Congress — same date as **60th anniversary** of
first Cambridge Mathematical Laboratory lecture (PIXIE origin):

- UWO students (Roy Eagleson) — PIXIE re-implementation if project proceeds
- **Leo Joskowicz** — ELIZA / Weizenbaum HCI line
- **Mario Cypko** — Human–AI model interaction

→ [`../leo-joskowicz/`](../leo-joskowicz/) · [`../mario-cypko/`](../mario-cypko/)

Thesis Appendix 4 (PIXIE User Manual) + 1969 film:
[pcloud bundle](https://e.pcloud.link/publink/show?code=kZfrboZLdkhmTkNHyFD3D4YsvF18VCDFpq7)

## Andrew Armit parallel archive (16 July 2026)

Same thread: Armit reports **Multipatch** octal listings + PDP-7/340 manuals, **Multiobject** +
Titan extracode, **ICON** sources, **Multipatch film** (shown with Gouraud on US tour). See
[`../andrew-armit/sources/2026-07-16-armit-archive-manifest.md`](../andrew-armit/sources/2026-07-16-armit-archive-manifest.md).

## Next steps

1. Heinz digitizes **125 pages** (in progress, Jul 2026).
2. Scan/receive → file under `media/` here with provenance — **evidence room before interview**
   (Don 7 Jul 2026: papers, magazine articles, films, **especially source code**).
3. Lars: assess against Type 340 manual — assemble/run under SIMH; **virtual light pen drivers**
   from listing interrupt handler; test on emulator.
4. Fold the "not a dumb terminal" correction into the show's interview beats (done — see
   [the show seed](../../repo-shows/pixie-pie-menus-pdp7.yml)).
5. Post-production: [Cambridge telecine jiggle house style](../../process/post-production/cambridge-telecine-jiggle.yml)
   — B&W grain + motion-tracked credits (Don's *Flight of the PIXIE* AE pipeline).

---

↑ [Heinz's room](README.md) · [correspondence](correspondence.md) · [show seed](../../repo-shows/pixie-pie-menus-pdp7.yml) · [pull-in gaps](pull-in-gaps.md)
