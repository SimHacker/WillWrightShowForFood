# Cambridge PDP-7/340 memories — David S. H. Rosenthal

**Author:** David S. H. Rosenthal  
**Date:** July 2026 (draft for PIXIE Repo Show)  
**Source:** [pdp7.html](https://www.abitare.org/~dshr/tmp/pdp7.html)  
**Permission:** Don may share with Lars and Heinz ([correspondence](correspondence.md))

Same **PDP-7 + Type 340 + Titan** stack as [**PIXIE**](https://www.donhopkins.com/home/documents/PIXIE%20a%20new%20approach%20to%20man-machine%20communication.pdf) (~1969, [Heinz Lemke](../heinz-lemke/README.md)); David was at Cambridge ~1970. Show: [PIXIE trio](../../repo-shows/pixie-pie-menus-pdp7/pixie-pie-menus-pdp7.yml).

[Portrayal standards](../../schemas/portrayal-standards.md)

---

From age 11 to 18 I was extraordinarily fortunate to attend the Haberdasher's Aske's School. In my last two years there I was introduced to programming, FORTRAN on coding forms which were sent off to the local technical college to be punched up and run on their IBM 1401. Debugging with a one-week turn-round taught great care, which subsequent developments eroded.

So when I arrived at Cambridge University in 1968 I was disappointed to learn that undergraduate programming courses didn't exist. But I eventually discovered that members of The Archimedeans, the mathematical society, could use the machines in the Mathematical Laboratory after midnight. Sometime in my second year, a friend and I discoverd in the basement a PDP-7 with a 340 display. It was linked to the University's Titan time-sharing system to be used as a graphics peripheral, but we never figured out how to do that.

There were more interesting things to do. At first we spent our time playing *Spacewar!* and *Lunar Lander*. But these inspired us to try writing our own game, based on Piet Hein's *Hex*.

The PDP-7 had 8K 18-bit words into which we had to squeeze the code, the data, and the program for the 340's display processor. So as well as spending time at the machine in the early hours, we spent a lot of time when we could have been studying racking our brains trying to use as many of the 8K as we could as at least two of these, if not all three.

We managed to get the game to be sort-of playable provided you let the machine win. It you tried to win the machine would cheat, and we ran out of time to find the bug.

When we returned for our final year two things prevented us returning to work with the PDP-7/340. First, finals loomed and our studies had to take priority. Second,we were both studying physics, which for the first time that year gave final year undergraduates accounts on Titan which could be used during the day. And, wonder of wonders, one of the choices for a final-year project was to implement Newton's method. The instructor expected a program written in Fortran. But after my PDP-7 experience I loved programming Titan in machine language, and it had a bank of 128 half-word index registers that could be addressed indirectly. So I turned in a machine code implementation that kept the stack for the recursion in the index registers. It was blazingly fast but the instructor couldn't understand it. So I got marked down and had to write a Fortran version.

But this experience meant that the year we graduated my friend and I were likely the only UK graduates who knew anything about computer graphics. My friend, who had done better than I through not being arrogant about his final-year project, went on to study physics for real. And I got to do a Mechanical Engineering Ph. D. at Imperial which was funded by the UK Atomic Energy Authority. It involved writing a graphics program that ran on the University of London's CDC 6600 linked by a 40Kbaud line to a CDC 274 display. The 274 was a big round CRT with a line-drawing display processor, conceptually similar to but more powerful than the 340.

---

## Hooks in this repo

| Thread | Link |
|--------|------|
| **Let the machine win** — Hex cheats if you try to win | [literary/authority-without-truth.md](literary/authority-without-truth.md) (Lem *Cyberiad* 2+2=7) |
| Sidecar / structured fields | [media/pdp7-hex-let-machine-win.md](media/pdp7-hex-let-machine-win.md) |
| Email thread (Don liked the draft) | [sources/2026-07-03-pixie-moollm-lem-rautavaara-thread.md](sources/2026-07-03-pixie-moollm-lem-rautavaara-thread.md) |
| DSHR on PIXIE as “display terminal” (4 Jul) vs Heinz correction | [../heinz-lemke/sources/2026-07-07-pixie-trio-thread.md](../heinz-lemke/sources/2026-07-07-pixie-trio-thread.md) |
| Three-way 8K squeeze (code / data / 340 display program) | [../heinz-lemke/pixie-source-recovery.md](../heinz-lemke/pixie-source-recovery.md) |
| Titan / PDP-7 link software (1965) | [Cambridge Supervisor Planning Document 10](https://cucps.soc.srcf.net/titan/supplan/pd10.htm) |
| *Flight of the PIXIE* | [youtube.com/watch?v=jDrqR9XssJI](https://www.youtube.com/watch?v=jDrqR9XssJI) |

↑ [David's room](README.md) · [CHARACTER.yml](CHARACTER.yml) · [invitation](invitation.md)
