# Soul City bridge — Tiny Life ⇔ The Sims

**Soul City** is the liminal heaven where souls lay over between worlds — the waystation in Will's
Repo Show invitation, not a separate "Soul City" hub. A **soul-file** carries identity, relationships,
story text, and memories; each game **re-renders** it in its own medium (Will's train-set hobby model).

Ell's [**Tiny Life**](https://tinylifegame.com/) already speaks this language:

| Tiny Life today | Soul City lane | Sims 1 Legacy Collection |
|-----------------|----------------|---------------------------|
| Export household + lot json | Soul-file facet (names, skills, relationships, descriptions) | Compile to `.fam` / house `.iff` bundle |
| Story descriptions on Tinies and lots | Family Album markdown in git | Soul City catalog CARD |
| Steam Workshop subscribe | Federated permanent link in CARD metadata | Install path docs for owned Steam copy |
| C# mods | MOOLLM skills parallel (moollm repo) | Transmogrifier-era object injection |

## Happy-path demo (show segment)

1. Export the **Walden household** from Tiny Life — bios and lot description intact.
2. Lay over in **Soul City** — optional beat from [Soul City procreation](../../../repo-shows/will-wright-premiere/game-bridge-soul-city-procreation.yml) (pure content injection, no engine hacks).
3. **Compile out** to Sims 1 — objects, skins, album pages, or a Soul City git drop for players who lost the Exchange.

Reverse: Sims Exchange-style Family Album yaml in GitHub → soul-file → Tiny Life household import.

## What we do not do

- Replace Ell's Workshop or Discord — **lift** traffic to [tinylifegame.com](https://tinylifegame.com/).
- Imply endorsement without Ell's consent.
- Ship schema without Ell at the keyboard for export format details.

Machine spec: [`game-bridge-sims1-tinylife.yml`](../../../repo-shows/will-wright-premiere/game-bridge-sims1-tinylife.yml)

↑ [Ell](../README.md) · [Will premiere](../../../repo-shows/will-wright-premiere/)
