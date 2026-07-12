---
id: tso-pixelation-rng-desync
title: "TSO pixelation RNG desync"
hook: "Client shimmer consumed the simulation PRNG; headless server diverged in lockstep TSO."
category: [online, rng, censorship]
status: fixed
heat: high
guests: [luc-barthelet, jamie-doornbos, don-hopkins]
---

# The Sims Online — pixelation RNG desync

## Hook

The same random numbers that made censorship shimmer also drove **gameplay** — until client and
server worlds quietly disagreed.

## Story

**The Sims Online** reused Sims 1 code with **lockstep** client + headless server.

- Client rendered pixelation shimmer → consumed **simulation PRNG** each frame.
- Server didn't render pixelation but RNG streams diverged → subtle, nasty desync bugs.

**Fix:** separate **UI-only PRNG** for cosmetic effects; simulation PRNG untouched.

## Ask on air

- How did you *find* desyncs like this — checksums, replay, player reports?
- What other client-only effects were suspects?
- Lesson for Soul City / Exchange revival?

## Sources

- [`../pause-time-and-rng.md`](../pause-time-and-rng.md)
- HN https://news.ycombinator.com/item?id=30359560
