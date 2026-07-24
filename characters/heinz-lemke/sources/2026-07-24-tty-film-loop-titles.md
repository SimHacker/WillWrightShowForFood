# The TTY film loop — titles, credits, and a diegetic terminal emulator

**From:** Don Hopkins, 24 July 2026, 20:47 (to the PIXIE thread: Heinz Lemke, Leo
Joskowicz, Mario Cypko, Roy Eagleson, Alan Kay, Lars Brinkhoff, Will Wright, Franziska
Schweikert, Andrew Armit, Howard Penner; forwarded 20:51 to Howard)

## The observation

At the end of the [1969 Cambridge film](https://www.youtube.com/watch?v=jDrqR9XssJI)
there is a perfect closing moment: a jacket hanging on the back of a chair in front of a
Teletype — someone has clearly claimed this beloved TTY as their own — then a zoom into
the TTY, watching the print head sweep left to right and perform a CR LF.

**The gift: the paper is completely washed out on film.** No text is visible on the page
or at the print head. Which means any text at all can be composited on, as if the TTY had
printed it.

## The technique (titles and credits)

- Start from the pan/zoom into the TTY, then enter a loopable segment of the head
  traversing and returning.
- Overlay text onto the paper as it "prints"; scroll the page up on each carriage return;
  loop the segment as many times as the text needs.
- Match film grain and camera shake in After Effects — same treatment as the *Flight of
  the PIXIE* title and credits (built from this film and the other reel David Chapman
  digitized).
- Clackity soundtrack, of course.
- Prior art, proudly cited: Bruce Tognazzini's typewriter simulator for the Apple ][
  Integer BASIC demo, [*The Infinite Number of Monkeys*](https://www.youtube.com/watch?v=IfMDWhc_ohU).

Frame beats (stills in Don's email): chair with jacket in front of TTY → facing the TTY →
zooming in → close-up with print head at bottom (loop start) → head at end of line just
before carriage return (loop end).

## The escalation: a diegetic terminal emulator

The same loop works *live*, not just for credits. SIMH's teletype device is a character
stream with CR/LF in it — exactly what the overlay consumes. So in the
[emulation plan](pdp7-reference/EMULATION-PLAN.md)'s SvelteKit-hosted SIMH architecture,
the film loop becomes a **terminal emulator skin**: the PDP-7's console output prints
onto the 1969 paper, the carriage return triggers the filmed carriage return, the clack
track plays per character. The machine's own film footage becomes its display device,
57 years later. Use it for the PIXIE bench console, for PDP-7 UNIX login demos, for show
intros — anywhere a terminal appears, it can appear *in the film*.

Cross-links: [EMULATION-PLAN.md](pdp7-reference/EMULATION-PLAN.md) ·
[cambridge-films-flight-of-the-bumblebee.md](../cambridge-films-flight-of-the-bumblebee.md) ·
Howard Penner's post-production desk ([characters/howard-penner/](../../howard-penner/README.md))
