# Chuck Blanchard — Body Electric dev system & screenshots (Feb 2020)

**From:** Chuck Blanchard \<[email redacted]\>  
**To:** Don Hopkins  
**Date:** 17 February 2020  
**Subject:** Re: Body Electric / Bounce / Visual Programming Languages  
**Cc:** Jaron Lanier, David Levitt, Barry Threw, Chaim Gingold, Alan Kay

Chuck confirms contact and offers to help. Still has a **circa-2001 MacBook** dev system:

| Component | Status |
|-----------|--------|
| Mac OS 9 | ✓ |
| CodeWarrior | ✓ |
| Swivel app | ✓ (no source) |
| Body Electric source | compiles to app |
| OpenGL window | local Isaac SGL renderer (no Isaac source) |

Attached screenshots → [`../media/body-electric/`](../media/body-electric/)

---

## What the screenshots show

### `redgreen.DM`

- **3D viewport** — green cube, spiked red cylinder, spiked blue sphere (Isaac/OpenGL)
- **Dataflow canvas** — Clock, Slider, Scale/Offset, Register, SetField, Not; red/green/black wires
- **Names palette** — PassRaw, Range, Constant, StripChart, etc.
- **Log:** Body Electric **6.0.1a8**; connects to "Isaac's"; OpenGL rendering; *"One packet holds 30 nodes"*

### `Move Flock` / `Move one bird` (nested DMs)

- **Flocking simulation** — pink/green bird-like objects in 3D view
- **Move Flock.NestedDM** — While "Move Birds" + NestedDM "Random Center"
- **Move one bird.NestedDM** — GetField on Current Vector; 3Minus/3Plus/Scale/Offset; "Add Vector to bird"
- Comment on canvas: *"Move one bird by moving the bird along it's current vector and also adding to it's vector to point towards the center of the flock."*

Classic **live dataflow VPL**: nested DMs, typed wires, 3D preview while patching.

---

## Thread context (same mail chain)

**Don (16 Feb 2020)** — reviving Bounce/VPL article; asks for video tapes, Rush/Jesse closed-caption Interval demo, Barry Threw contact ("BigTwin").

**Barry Threw (16 Feb 2020)** — has **Body Electric 1a1 archive** saved for years; blocked on SheepShaver / OS version; coffee-table book idea (historic patch screenshots + designer essays).

**Jaron (13 Jun 2020, separate thread)** — **Swivel 3D written in FORTH** by "young Harvill"; hard to scale; namespace ran out → lost to other modelers.

→ [`../../don-hopkins/sources/2020-06-swivel3d-forth-jaron.md`](../../don-hopkins/sources/2020-06-swivel3d-forth-jaron.md)

**Eric Hosick / Ben Shneiderman (2014)** — VPL snapshots page; "All the Widgets for VPLs" idea.

→ [`../../don-hopkins/sources/2014-vpl-snapshots-eric-hosick-thread.md`](../../don-hopkins/sources/2014-vpl-snapshots-eric-hosick-thread.md)

---

## Rebounce / emulator beats

1. Chuck's OS9 + CodeWarrior box = **reference hardware path** for Rebounce archaeology
2. Barry's **1a1 archive** + SheepShaver = parallel resurrection attempt
3. Screenshots = **show set** until live emulator runs (redgreen.DM, flock nested DMs)
4. Isaac/Swivel source **missing** — Chuck has apps, not sources

## Show pairing

| Guest | Topic |
|-------|-------|
| **Chuck Blanchard** | Lead author walks the patches |
| **David Levitt** | Hookup → Bounce derivative |
| **Jaron Lanier** | Vision + Swivel3D/FORTH scaling story |
| **Barry Threw** | Archive custodian |
