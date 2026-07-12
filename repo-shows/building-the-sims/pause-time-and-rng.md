# Pause, time scale, and RNG discipline

*Why "pause" and "shimmer while paused" are harder than they look — and why cosmetic effects must
not steal simulation random numbers.*
[Portrayal standards](../../schemas/portrayal-standards.md)

## Pixelation shimmer while paused

The modesty bar kept animating when the clock stopped because Don drove shimmer from **per-frame
noise**, not from simulation tick — see [`pixelation-and-modesty.md`](pixelation-and-modesty.md).

**Reunion question:** Was pause implemented as **time scale = 0**, a **separate UI clock**, or
**skip simulation ticks**? Different subsystems (render, audio, SimAntics) may disagree.

## TSO client/server lockstep

**The Sims Online** ran parallel simulations on client and headless server. Any **client-only**
effect that consumed the **game PRNG** could desync the world — pixelation was the memorable case.

**Lesson:** Partition RNG:

| Stream | Use |
|--------|-----|
| Simulation PRNG | Gameplay, motives, autonomous choices — must match server |
| UI / render PRNG | Shimmer, particles, cosmetic-only — client-local |

## ScriptX clock hierarchy (Don HN tangent)

On HN threads about pausing games, Don cited **ScriptX** (Kaleida): clocks formed a **hierarchy**
like transform trees — each node had **time offset** and **time scale** relative to parent.

- `time scale = 0` → paused relative to parent.
- Negative scale → time runs backward (QuickTime-era demos).

Patent context: [US5452435A](https://patents.google.com/patent/US5452435A/en) — synchronized media
clocks.

**Reunion beat:** Would a hierarchical clock have made Sims pause/modesty/particles easier? What did
The Sims actually use?

## Broader pause folklore (industry)

Useful contrast from HN **"Game devs explain pause"** (Kotaku / 2026):

- Grayscale pause (Warcraft palette trick).
- Quake demos as **network packet replay**, not input replay.
- Deterministic lockstep (Doom, RTS) vs authoritative server state.

Not Sims-specific but frames why **RNG + pause + netcode** interact.

## Who to ask

| Guest | Angle |
|-------|-------|
| Eric Bowman | Simulation tick vs render |
| Jamie Doornbos | What paused in SimAntics |
| Luc Barthelet | TSO desync hunts |
| Don Hopkins | Pixelation + ScriptX memory |

## See also

- [`pixelation-and-modesty.md`](pixelation-and-modesty.md)
- [`qa-bug-pile.md`](qa-bug-pile.md)
