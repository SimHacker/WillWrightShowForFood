# The TrackPoint transfer function

**What this is:** Ted Selker's TrackPoint work, written up from Don's own accounts, because the
design content — the pressure-to-speed mapping — has been sitting in raw HN harvest and is directly
load-bearing for current interface design work.

**Primary sources:** Don Hopkins on HN,
[9438461](https://news.ycombinator.com/item?id=9438461) (2015-04-25) — the long account, told from
stories Selker told him verbally over the years — and
[24106409](https://news.ycombinator.com/item?id=24106409) (2020-08-10), the coffee-shop excerpt.
Selker's own published account is in
[Buxton's collection](https://www.billbuxton.com/). Video: [IBM Pointing Stick Roll-In,
1991-10-08](https://www.youtube.com/watch?v=6hhnlaUxsL8) · [Selker explaining the theory and
story](https://www.youtube.com/watch?v=H6guBllqPPY).

Second-hand via Don, so this is testimony rather than documentation. Selker can correct any of it.

---

## The measurement that started it

> In 1984 he observed that it took **0.75 – 1.75 seconds** to reposition the hand from the keyboard
> to the mouse, which is a long time for something that you do quite often.

That number is the whole design brief. Not "mice are bad" — mice are better for tasks that are mostly
pointing. The claim is narrower and survives: for **mixed typing and pointing**, which is how most
people use a computer most of the time, the hand-transit penalty is paid so often that it dominates.

## Rate control, and why nulling does not apply

Don frames the core difficulty as relative-versus-absolute:

> …the fundamental problem with it that you can't get around is that it's a **relative** positioning
> device, not an absolute positioning device like a mouse. So he had to come up with ways of
> overcoming that problem.

Worth being precise about what the distinction actually is, because it matters for what the transfer
function had to do. A mouse is **isotonic position control**: you displace it, the cursor displaces.
The TrackPoint is **isometric rate control**: you apply force, the cursor acquires *velocity*. It
barely moves at all.

Which has an underappreciated consequence. Buxton's **nulling problem** — that taking hold of an
absolute device requires reconciling its position against the controlled value, so either the value
jumps or you must move to meet it — **cannot occur on a rate-control device.** The spring guarantees
that rest maps to zero velocity, every time, with nothing to reconcile. The stick nulls itself.

The price is that *nothing* about the mapping is given by physics. With a mouse, one inch is one
inch and the transfer function is a tuning detail. With an isometric stick, the transfer function
**is the entire device.** Which is why years went into it.

## Two plateaus

Two observations set the shape:

> …when the cursor moved above **eye tracking speed**, you tended to lose track of it. And also…
> some of the time you needed to position it finely around a small area, and other times you needed
> to move it quickly across a large area.

The resulting non-linear pressure-to-speed mapping, in Don's description:

| Pressure | Speed | Why |
|---|---|---|
| **wide range of light pressure** | one exact slow **predictable** speed | *plateau* — cruise smoothly at a speed good for exact positioning |
| rising | smoothly sloping up | transition |
| **wide range of harder pressure** | fast, but just below **eye-tracking speed** | *plateau* — coarse positioning without losing the cursor |
| hardest | very fast | flick across the screen |

> They did lots of user studies and took lots of measurements and performed lots of experiments to
> determine the best parameters… and finally came up with one that was measurably good enough to make
> IBM happy and ship in products.

### The plateau is a detent, one derivative up

This is the part worth carrying forward. **A plateau maps a wide range of input onto one output —
which is a zeroed derivative over a range, which is exactly a detent.** Selker's plateau makes a
*speed* easy to hold; a snap detent makes a *position* easy to hold. Same construct, applied one
derivative apart, and both exist because human motor output is noisy and a flat region converts that
noise into stability instead of error.

The two-plateau structure is also a **coarse/fine pair**, which keeps being independently
rediscovered: eyeball-then-dial in the
[Precision Pie](https://github.com/SimHacker/moollm/blob/main/designs/pie-stack-views/RADIAL-DIMENSIONS.md),
and coarse-direction-then-relative-push in the
[window resize pie](https://github.com/SimHacker/moollm/blob/main/designs/pie-stack-views/WINDOW-RESIZE-PIE.md).
Three arrivals at one two-regime shape.

## Shipping it

> IBM wouldn't let him ship it until it was **measurably as efficient as a mouse** for common tasks.

An unusually honest gate, and the reason the transfer function got the study effort it did — the
device could not argue its way in on novelty. The naming fight went the other way:

> …after pooh-pooh-ing the name "Joy Button", IBM finally settled on and trademarked the name
> "Trackpoint." But one concession they made, was when they published a two page ad spread in Time
> Magazine with a close-up of the trackpoint, above the slogan **"So hot, we had to make it red!"**

## His father made the rubber

> He had his **father, a material scientist**, help by designing the special non-skid rubber that the
> [cap] was made from.

The grip is not a detail. On an isometric device the cap is the entire input surface, and a fingertip
that slips is force applied in an unintended direction — noise injected upstream of the transfer
function that no amount of curve design can remove.

## The coffee shop

> Once I was sitting in a coffee shop in Mountain View hacking on my Thinkpad, and Ted and his wife
> Ellen rolled in, sat down, and started chatting. Ted noticed that my Thinkpad's Joy Button was all
> worn down, and he was **mortified** and quickly excused himself to go out to the car. Ellen rolled
> her eyes and shrugged, explaining that he was always like that. Then he came back with a big bag of
> red Joy Buttons, and **replaced my worn-out one right there in the coffee shop**, and gave me a few
> extras as spares!

A worn cap is a degraded input surface, so this is the same concern as his father's rubber, carried
around in a bag for twenty years.

## The two-TrackPoint prototype

> He also made a prototype Thinkpad with **TWO** hot red trackpoints on the keyboard… It was very
> popular with everyone he tested it on, but unfortunately **OS/2 had no idea how to cope with two
> pointing devices**, so there wasn't much use for it.

Worth recording precisely, because it is a clean receipt for a claim being made elsewhere: the
hardware for two simultaneous cursors existed and tested well, and the blocker was that **the system
had no model for more than one pointer.** Not ergonomics, not demand — an absent abstraction. See
[reading cursors](https://github.com/SimHacker/moollm/blob/main/designs/webtop/READING-CURSORS.md),
where multiple cursors are still waiting on a user model rather than on input hardware.

## Open questions

- **"IBM Alameda Research Lab"** appears twice in the 2015 post; IBM's lab is **Almaden**, and this
  repo uses Almaden elsewhere. Presumed transcription slip, worth confirming with Don.
- The **actual plateau parameters** — speeds, pressure ranges, the eye-tracking-speed threshold they
  settled on. Selker's published account may have them; the numbers would make the plateau/detent
  equivalence quantitative rather than structural.
- Whether the two-plateau design **shipped** or was simplified for production.
- The 1993 CS547 TrackPoint lecture is [still tape-only](cs547-lectures.md) and would be the primary
  source for all of this in his own voice.

---

↑ [Ted Selker](../README.md) · [CS547 lectures](cs547-lectures.md) · [NPUC Reunion](../../../repo-shows/npuc-reunion/README.md)
