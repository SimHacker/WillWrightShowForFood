# TheSimsAITest — bare-bones Sims needs loop (Nov 2006)

*Sniff:* [`CARD.yml`](CARD.yml) · [`GLANCE.yml`](GLANCE.yml) · [`PROVENANCE.yml`](PROVENANCE.yml)

A **Mats Knutsen** C# console sketch (Nov 2006) — not Maxis shipping code. Mats attached **`thesimsaitest.zip`**; **Don Hopkins replied the same day** with a full Sims AI design tour → [`don-reply-to-mats-knutsen.md`](don-reply-to-mats-knutsen.md).

Compare against Will Wright's **[Motive.c (1997)](../2008-02-10-soul-of-the-sims/Motive.c)** and Jamie Doornbos's **SimAntics** layer on the [building-the-sims](../../../../repo-shows/building-the-sims/README.md) show arc.

## What it is

| Piece | Role |
|-------|------|
| [`Needs.cs`](source/Needs.cs) | Four motives: Hunger, Bladder, Fun, Hygiene — range −100…100, start at 100 |
| [`SimulationTimer.cs`](source/SimulationTimer.cs) | 1 tick = 1 sim-minute; every 30 ticks all four needs −5 |
| [`Sim.cs`](source/Sim.cs) | Agent wrapper; registers with `GameContainer` |
| [`GameContainer.cs`](source/GameContainer.cs) | Static arrays for sims + objects (author: *"can't be assed to figure out a way to do it right now"*) |
| [`InteractionObject.cs`](source/InteractionObject.cs) | **Empty stub** — no smart-object advertising yet |
| [`Program.cs`](source/Program.cs) | Spins timer + one test Sim; prints day name in a loop |

Visual Studio 2005-era project (`.csproj`, `.sln` in zip). Console output only — no graphics, no utility AI, no object choice.

## What it is *not*

- Not SimAntics, Edith, or retail Sims 1 AI
- No personality traits, social motives, or failure cascades (cf. Motive.c's 16-motive graph)
- No autonomous action selection — needs decay but nothing satisfies them

## Compare: three layers of "Sims AI"

| Layer | When | What |
|-------|------|------|
| **Motive.c** | Jan 1997 | Will's 16-motive harness — energy/alertness feedback, stress, social, environment |
| **TheSimsAITest** | Nov 2006 | Student-style decay timer on four retail motives — teaching skeleton |
| **SimAntics** | 1998–2000 ship | Jamie Doornbos's behavior VM — smart objects advertise, threads, utility choice |

The gap between row 2 and row 3 is the whole show: *why* smart objects + SimAntics beat a naked needs array. Don's reply names the missing pieces Mats hadn't built yet: **advertisement scoring**, **top-5 random choice**, **favorite-bed relationships**.

## Don's reply (primary source)

**[don-reply-to-mats-knutsen.md](don-reply-to-mats-knutsen.md)** — 7 Nov 2006 email. Key beats:

- Object threads + async animation; interrupt-level condition checks on advertisements
- C# classes > byte-code emulation for experimentation
- Score top ~5 actions → **pick randomly** (player help matters)
- Advertisements serve **pie menus** and **autonomous AI**
- Favorite bed: relationship +1.0 per sleep, **×0.95 nightly decay** — or burn the old bed in the yard

## Show hooks

| Guest | Angle |
|-------|-------|
| **Jamie Doornbos** | Walk this code vs. SimAntics — what's missing and why it matters |
| **Will Wright** | Did outsiders ever send you reimplementations like this? |
| **Don Hopkins** | Pie menus + object advertising — the UI half of the same design |

## In this repo

- [`don-reply-to-mats-knutsen.md`](don-reply-to-mats-knutsen.md) — Don's Sims AI explanation (public excerpt)
- [`source/`](source/) — Mats's C# source + `.csproj` (no binaries)
- [`original/thesimsaitest.zip`](original/thesimsaitest.zip) — bit-identical archive from Documents
- [`characters/mats-knutsen/`](../../../mats-knutsen/CHARACTER.yml) — correspondence portrayal

## Related

- [Soul of The Sims / Motive.c](../2008-02-10-soul-of-the-sims/README.md)
- [1998 steering committee demo](../1998-06-04-sims-steering-committee-demo/README.md) — SimAntics on camera
- [`characters/jamie-doornbos/`](../../../jamie-doornbos/README.md)
- [`don-hopkins/sims-pixelation-censorship-hn-2022.md`](../../../don-hopkins/sims-pixelation-censorship-hn-2022.md) — SimAntics war stories

---

↑ [sources](../README.md) · [Motive.c](../2008-02-10-soul-of-the-sims/README.md) · [show](../../../../repo-shows/will-wright-premiere/README.md)

*Raw directory:* [browse files in this folder](./)
