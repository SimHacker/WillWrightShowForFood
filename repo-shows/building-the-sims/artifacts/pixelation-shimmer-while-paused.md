---
id: pixelation-shimmer-while-paused
title: "Pixelation shimmer while paused"
hook: "Don injected per-frame noise so the modesty bar shimmered even when time was frozen."
category: [censorship, rendering, pause]
status: shipped
heat: high
guests: [don-hopkins, eric-bowman, jamie-doornbos]
---

# Pixelation shimmer while paused

## Hook

Pause the game — the Sim holds still on the toilet — but the censorship pixels **keep shimmering**.

## Story

Don implemented the modesty effect with **random noise every frame** so the bar didn't look like a
static sticker revealing that nothing anatomical was underneath (Barbie/GI-Joe smooth bodies).

Side effect: shimmer used **per-frame** updates, not simulation tick — visible under pause.

## Ask on air

- Was pause time-scale zero, or did render/UI keep running?
- Should cosmetic effects use a **UI-only clock** (foreshadowing TSO bug)?

## Sources

- [`../pixelation-and-modesty.md`](../pixelation-and-modesty.md)
- [`../pause-time-and-rng.md`](../pause-time-and-rng.md)
