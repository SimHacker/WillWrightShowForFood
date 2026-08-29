# Game bridge — The Sims ⇔ Soul City ⇔ Tiny Life

*The first federation spoke: Ell's indie life sim as the landing world
for evacuated Sims souls. Machine-readable seed:
[game-bridge-sims1-tinylife.yml](game-bridge-sims1-tinylife.yml).*

**In one line:** [Tiny Life](https://tinylifegame.com/) exports
households and lots with story text — lay over in Soul City, compile to
Sims 1 and other game content; lift Ell's Workshop, don't replace it.

## Soul City as waystation

Soul City is the liminal heaven where souls lay over between worlds —
the waystation in Will's Repo Show invitation (Proxi ⇔ Soul City ⇔ The
Sims). The soul-file travels; each world re-renders it in its own
medium. The compiler turns soul events into Sims 1 pure content
injection: objects, skins, album pages.

## Why Ell

[Ellpeck](../../characters/ellpeck/README.md) (Ell, @ellpeck.bsky.social,
studio Ellpeck Games) is a friend — Don has talked with Ell before, and
Don's quote is on the game's Praise page. Tiny Life is a solo queer
dev's Early Access life sim: no GenAI, hand pixelart, C#, full
open-world simulation running off-screen — the indie answer to
corporate life-sim churn.

The alignment already exists on both sides. Tiny Life ships
export/import of households and lots, story descriptions embedded in
shared content, and a Steam Workshop plus C# mod API. The Sims side has
the gap:
[the Legacy Collection shipped without the Exchange, the Internet
button, or Sims Creator](../../characters/will-wright/sources/sims1-legacy-collection-exchange-gap/README.md).

## The demo, happy path

1. Export the Walden household from Tiny Life — lot description plus
   Tiny bios.
2. Soul City layover — a soul-file facet: names, relationships,
   skills, story markdown.
3. Optional procreation or memorial beat from the sibling seed.
4. Compile to a Sims 1 `.fam` / house bundle, or a Soul City git drop
   for Legacy Collection players.

And in reverse: Family Album YAML in git → soul-file → Tiny Life
household import JSON.

## Live show beats

- Don's site quote read back to Ell — then build the bridge live:
  pair-program the Soul City facet schema from Tiny Life's export
  format.
- Plumbella and James Turner praised Tiny Life while the EA Creator
  Network exodus ran — indie solidarity, not a pile-on.
- Ell's Paralives anxiety, answered with the Stardew lesson: inspired
  games lift the genre.
- Workshop versus git PR — two permanent-URL cultures, complementary
  rails, one soul-file.

## Non-goals

Replace Steam Workshop or Ell's Discord community; imply EA or Tiny
Life endorsement without consent; ship the bridge without Ell's
cooperation on the export format.

## Related

- [Ell's bridge page](../../characters/ellpeck/bridge/soul-city-bridge.md) · [Ell's invitation](../../characters/ellpeck/invitation.md)
- [Soul City catalog](../../catalogs/soul-city/README.md)
- [The 2026 thesis — Soul City + Soul Saver](../../characters/don-hopkins/sources/qgcon-inclusivity-paper/soul-city-soul-saver-thesis.md)
