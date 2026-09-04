# Rudy Rucker 🌀🐜 *(mathematician · cyberpunk · cellular automata)*

*Portrayal of a real correspondent, written by Don — not Rudy, and not his words.
He may correct, shape, reduce, or delete any of it.*
[Portrayal standards](../../schemas/portrayal-standards.md) · authored by Don Hopkins

## Who

**Rudy Rucker** (Rudolf von Bitter Rucker, b. 1946) is a set theorist turned
**cyberpunk** founder turned **cellular-automata** evangelist — the rare person who
is equally at home in a proof, a psychedelic novel, and a rule table. PhD in
mathematical logic; professor of computer science at **San José State University**
(1986–2004); author of the **Ware Tetralogy** (*Software*, *Wetware*, *Freeware*,
*Realware*), the first two of which won **Philip K. Dick Awards**. He coined the
literary style **transrealism**, wrote *Infinity and the Mind* and *The Fourth
Dimension*, and is — genuinely — four generations removed from **Hegel**.

## The CAM-6 in the box of styrofoam peanuts (1987)

His own account, in the [CelLab manual, ch. 5](https://www.fourmilab.ch/cellab/manual/chap5.html):
he talked the **San José State** Math & CS department into ordering a **CAM-6** from Systems
Concepts for about $1500, waited months, finally told them SJSU would have to cancel the purchase
order — and got the board the next week. **August 1987.** A bare three-by-twelve-inch rectangle of
chips in a plastic bag in a box of styrofoam peanuts. No cables, no software, no documentation. A
department tech, Steve Ware, made him a cable; Toffoli mailed him the Forth. *"If I needed to know
Forth to see cellular automata, then by God I'd know Forth."*

That October he carried the AT with the board still in it to **Hackers 3.0**, the annual Hackers
conference at a camp near Saratoga, invited by **Jim Blinn**, and demoed all night. Nobody was
lining up to pay $1500, beg Systems Concepts for delivery, and learn Forth. And the hackers made
him pull the board out to look at it — no special processors, just **a few latches and a lot of
fast RAM**, which is [the whole partial-evaluation
argument](../don-hopkins/cam-construction-set.md#the-move-has-a-name-partial-evaluation-and-one-more-thing)
delivered as a shrug by people who could read a board.

**Don was at that Hackers, and they traded demos** — the start of the thread below, and the seed of
a lot of what's in this repo. *(⚠️ Don doesn't remember which year; Rucker's account fixes his
CAM-6 night as Hackers 3.0, 1987. But Don thinks it was after 1990, and Mark Weiser was there. 
Confirm before it goes on air.)*

## The Autodesk CA years

Hired by **John Walker** of Autodesk after the 1987 Hackers conference, Rudy spent
1988–1992 shipping cellular-automata software: **CA Lab: Rudy Rucker's Cellular
Automata Laboratory** (now free as [**CelLab**](https://www.fourmilab.ch/cellab/)),
**James Gleick's CHAOS: The Software**, and **BOPPERS: Artificial Life Laboratory**.
That stint became the raw material for his novel *The Hacker and the Ants*. The
[CelLab demo video](https://www.youtube.com/watch?v=lyZUzakG3bE) is a small
masterpiece — beautiful Belousov–Zhabotinsky scrolls, capped with a straight-faced
**late-night-TV 1-800 order number**. It is the platonic infomercial for chaos.

## Don & Rudy — the CA thread

Don and Rudy have a long, playful email friendship about cellular automata (there's
even a documented exchange on [Don's CAM6 wiki](https://donhopkins.com/mediawiki/index.php/CAM6_Simulator)
where Rudy caught a scan-order-drift bug years ago). The best of it is a **May 2020
thread** that started innocently as "History of Logo!" and mutated into Don dragging
Rudy into **Dave Ackley's Movable Feast Machine**. Rudy's response is a whole comedy
routine in one inbox: buried in links, he asked for *"a video with pretty pictures
of CAs, and not a guy talking"* — which is exactly how the MFM **city-generation
demo** became the thing that finally landed. He riffed that ordinary CAs are too
**UPTIGHT** with their rigid full-parallel synchrony, delighted in Ackley loosening
it, and argued that **Zhabotinsky-style rules** are practically a fifth class of
their own. (The narrated version lives in the
[**CA correspondence story**](../dave-ackley/ca-correspondence-story.md); the raw
emails stay private, by design.)

## What Don wants to build with him

- **A MOOLLM cellular-automata skill**, co-designed with Rudy, seeded from **CelLab's
  rule catalog** + CAM6 + the MFM — see [ideas.md](ideas.md).
- **A brand-new "commercial plug"** for cellular automata, in the CelLab
  1-800-infomercial spirit. Order your CAs now.
- The **"why not 3D?"** question, posed to Rudy alongside Ackley, Margolus, and Draves.

## Links

| | |
|---|---|
| **Warm invitation** (draft) | [invitation.md](invitation.md) |
| **Show hooks** | [ideas.md](ideas.md) |
| **CA correspondence story** (the MFM thread) | [`../dave-ackley/ca-correspondence-story.md`](../dave-ackley/ca-correspondence-story.md) |
| **CelLab** | [fourmilab.ch/cellab](https://www.fourmilab.ch/cellab/) · [rudyrucker.com](https://www.rudyrucker.com/) |
| **CA Lab demo** (with the 1-800 gag) | [youtube.com/watch?v=lyZUzakG3bE](https://www.youtube.com/watch?v=lyZUzakG3bE) |
| **CA jam co-guests** | [Norman Margolus](../norman-margolus/) · [Jim Crutchfield](../jim-crutchfield/) · [Dave Ackley](../dave-ackley/) |
| **What the CAM-6 became** | [CAM Construction Set](../don-hopkins/cam-construction-set.md) — the board's architecture rebuilt as rewireable components |
| **The rule catalog, as code** | [`margolus-rules.md`](../david-ungar/korz/examples/margolus-rules.md) — block rules written as Korz slots, compiled to tables or shaders |
| **The 1984 room and the 1987 one** | [`jim-crutchfield/ideas.md`](../jim-crutchfield/ideas.md) — where CAM was first shown, and where it landed three years later |

Sources in [CHARACTER.yml](CHARACTER.yml). Subject may request correction or removal anytime.
