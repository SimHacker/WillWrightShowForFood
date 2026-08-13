# Pixelation censorship — engineering notes

*The Sims 1 modesty effect — Don's implementation memory and related bugs. **Story cards:**
[`artifacts/INDEX.md`](artifacts/INDEX.md) (censorship section). HN index in
[`characters/don-hopkins/sims-pixelation-censorship-hn-2022.md`](../../characters/don-hopkins/sims-pixelation-censorship-hn-2022.md).*
**2008:** Jamie Zawinski coined **SimRogenous zones** on LiveJournal — [`characters/don-hopkins/sources/2008-05-jwz-simrogenous-street-view/README.md`](../../characters/don-hopkins/sources/2008-05-jwz-simrogenous-street-view/README.md).
[Portrayal standards](../../schemas/portrayal-standards.md)

## What Don implemented

When Sims showered or used the toilet, the game drew a **pixelation bar** over the body.

- Don injected **random noise every frame** so pixels **shimmered** — including when **time was
  paused** — so it was less obvious the mesh had nothing anatomical to hide.
- Intent (Don's memory): modesty **for the Sims** (implying something worth censoring), not shock
  prevention for players — the underlying bodies were Barbie/GI-Joe smooth.

## Shipped quirks

**Pooping in pants:** Early beta and possibly ship — Sims sat on the toilet **fully clothed**;
no separate pants mesh to swap. Closed as **works as designed** in some cases.

**Beta clip (Mar 1999):** "Dana takes a shower, Michael seeks relief" — shimmer visible while
Michael holds still on toilet.

- https://www.youtube.com/watch?v=ma5SYacJ7pQ

**Will on sex & expansions:** https://www.youtube.com/watch?v=DVtduPX5e-8

## Maid + plunger (fixed before ship)

**Integrated spine:** [`maid-plunger-incident.yml`](maid-plunger-incident.yml) ·
primary source [`sources/maid-plunger-incident-hn-2022.md`](sources/maid-plunger-incident-hn-2022.md) ·
flipbook [`../flipbook-maid-plunger-incident/README.md`](../flipbook-maid-plunger-incident/README.md)

→ [`artifacts/maid-plunger-unnecessary-censorship.md`](artifacts/maid-plunger-unnecessary-censorship.md)

Before **privacy** blocked bathroom entry:

1. Sim sits on toilet (pixelated), poops in trousers.
2. Toilet clogs; **maid** enters.
3. Maid pulls plunger from hammerspace, works it between the Sim's legs — pixelation + motion read
   like **unnecessary censorship** comedy.
4. Fixed with substantial **SimAntics** work (summer intern's service AI; Don's memory).

No saved video located — reunion beat if anyone has a capture.

## The Sims Online — RNG desync

When TSO reused Sims 1 code in **lockstep** client/server simulation:

- Client rendered shimmering pixelation using the **simulation PRNG**.
- Headless server did **not** render pixelation but still advanced RNG on client → **desync**.
- Fix: separate **UI-only** PRNG for cosmetic effects.

Related: [`pause-time-and-rng.md`](pause-time-and-rng.md) · networking determinism.

## HN threads (Don comments)

| Thread | Item |
|--------|------|
| Pixelation redaction (Bishop Fox) | https://news.ycombinator.com/item?id=30350626 |
| Don's top comment | https://news.ycombinator.com/item?id=30359560 |
| Game devs — pausing games | https://news.ycombinator.com/item?id=47793161 |
| Vibe coding (Hot Potty callback) | https://news.ycombinator.com/item?id=46227422 |

## Who to ask

| Guest | Angle |
|-------|-------|
| Jamie Doornbos | SimAntics, privacy, service behaviors |
| Will Wright | Design intent — censorship as player/editor toy |
| Claire Curtin | Player-facing tone, Simlish-era production |
| Luc Barthelet | TSO lockstep and what broke when shipping online |
| Summer intern (maid AI) | If reachable — original service behaviors |
