# Text pixelation redaction — Sims censorship implementation (Don HN notes)

Don's comments on **Don't use text pixelation to redact sensitive information** ([HN 30350626](https://news.ycombinator.com/item?id=30350626), Feb 2022, Bishop Fox).

Thread theme: reversing text pixelation; subpixel rendering leaks structure. Don's top comment pivots to **The Sims 1 censorship** — implementation detail, TSO RNG divergence, maid/plunger bug, SimAntics.

**Reunion hub:** [`../../repo-shows/building-the-sims/pixelation-and-modesty.md`](../../repo-shows/building-the-sims/pixelation-and-modesty.md)

**Maid plunger spine:** [`../../repo-shows/building-the-sims/maid-plunger-incident.yml`](../../repo-shows/building-the-sims/maid-plunger-incident.yml) ·
primary source [`../../repo-shows/building-the-sims/sources/maid-plunger-incident-hn-2022.md`](../../repo-shows/building-the-sims/sources/maid-plunger-incident-hn-2022.md)

→ [`../will-wright/adorable-minutes.md`](../will-wright/adorable-minutes.md) · SimAntics / Edith trail in MicropolisCore docs

## Don's comments (selected)

| HN id | Beat |
|-------|------|
| [30359560](https://news.ycombinator.com/item?id=30359560) | **Pixelation shimmer** — injected random noise every frame (even when paused) so players couldn't tell Sims had **no anatomical mesh** under the bar; modesty for the Sims, not the player |
| [30359560](https://news.ycombinator.com/item?id=30359560) | **TSO lockstep bug** — client UI RNG for pixelation desynced headless server simulation; fixed with separate UI PRNG |
| [30359560](https://news.ycombinator.com/item?id=30359560) | **Maid + plunger** — "unnecessary censorship" toilet scene; fixed in SimAntics before ship |
| [30359690](https://news.ycombinator.com/item?id=30359690) | PDF black-bar redaction failures (Manafort, UK MoD) — **print/flatten** beats overlay |
| [30360424](https://news.ycombinator.com/item?id=30360424) | Medium article index + Sims YouTube links (beta shower, Will on sex, pie menus, Crowd Sitter, etc.) |

## Video / article hooks (from 30360424)

| Clip | URL |
|------|-----|
| Sims 1 beta — shower / toilet | https://www.youtube.com/watch?v=ma5SYacJ7pQ |
| Will Wright on sex & expansions | https://www.youtube.com/watch?v=DVtduPX5e-8 |
| Pie menus / SimAntics demo | https://www.youtube.com/watch?v=-exdu4ETscs |
| Steering committee (Jun 1998) | https://www.youtube.com/watch?v=zC52jE60KjY |

SimAntics background: [HN 22987435](https://news.ycombinator.com/item?id=22987435) · [SimAntics wiki](https://simstek.fandom.com/wiki/SimAntics)

## Show hooks

| Guest / bit | Angle |
|-------------|-------|
| **Will Wright** | Censorship as **editor toy** metaphor — bars imply function the mesh lacks |
| **Don Hopkins** | SimAntics war stories — RNG discipline for networked sims |
| **Steve & Gerri ad-lib** | "Pixelate" joke in wedding transcripts — [`steve-and-gerri-simlish-adlib`](../will-wright/sources/steve-and-gerri-simlish-adlib/README.md) |
| **Retrospective** | Same compression hub: procedural body vs cosmetic bar |

Unrelated but paired in thread: proper redaction = delete + black bar + rasterize, not pixelate.
