# GitHub-backed distribution — catalogs and content on public rails

*Soul City's distribution spine: metadata catalogs **and** free content
in public repos. Machine-readable spec:
[github-distribution-model.yml](github-distribution-model.yml).*

**In one line:** distribute metadata catalogs *and* the content itself
(when not for pay) from public GitHub repos — MOOLLM skills and Soul
City bridge payloads alongside Sims object repos. The TSR browse model
replaced; creator subscriptions federated, not vacuumed.

## The principle

Ship both: CARD/CATALOG indexes **and** the `.iff` / `.fam` / playset
binaries whenever the creator chooses free distribution on git.
Metadata-only entries remain for Internet Archive pointers, paid
storefronts, and rights we don't hold. GitHub is the durable host —
version history, forks, PRs, blame, releases — replacing ad-walled
browse sites and brittle shortlinks for *our* lane while still
federating SimFileShare permanent URLs and the paid archives of
creators like Heather and Steve.

## What each lane replaces

- **The TSR lane** — free files behind ads, VIP for convenience, no git
  lineage, broken links — becomes a searchable CARD catalog in the
  repo: clone it or grab a release zip, install docs in-tree, Steam
  guide links in.
- **The SimFileShare lane** — partially: SFS remains fine for Simblr
  creators, and we index their links in CARD metadata; repo-native free
  objects live *in* GitHub with no alt-tab upload.
- **The Exchange lane** — thesims.ea.com upload plus local HTML becomes
  git PR plus Soul City publish, with an optional Angel tray watcher
  that turns a save into a repo path or release tag.

## The repos

- [**WillWrightShowForFood**](https://github.com/SimHacker/WillWrightShowForFood) —
  show catalog, Sims object repo, and Soul City hub index: federated
  brand dirs in `catalogs/`, portrayal rooms and source bundles in
  `characters/`, episode artifacts and bridge specs in `repo-shows/`.
- [**moollm**](https://github.com/SimHacker/moollm) — skills as
  content: installable protocols in `skills/`, adventure rooms and
  character overlays, Soul City liminal payloads. MOOLLM skills are
  content the same way Sims objects are — forkable, attributable, with
  audience homefun merged back in.
- **MicropolisCore** — the engine and WASM playable projection,
  cross-linking the catalogs.

## Federation rules

Non-extractive by design: send buyers to ZombieSims lifetime deals and
SimFreaks — Soul City is rails, not a loot box
([landscape](../sims1-community-landscape.md)). Free-on-GitHub covers
the SimProv giveaway pattern, Don's composable objects, show artifacts,
and MOOLLM examples; federate-only covers paid sets and VIP
convenience, linked with metadata CARDs. Never in a public repo: EA
game binaries or expansions, paid SKUs without explicit grant, or
executables (prefer `.iff`/`.fam`/`.zip` with a README).

The contrast, surface by surface: TSR's ad/VIP browse becomes git
browse with CARD search and no ads; SimFileShare's central shortlinks
without search become git permanent URLs plus a searchable index;
the Exchange's EA server becomes git PRs and Family Album YAML;
[Tiny Life's Workshop](../../repo-shows/will-wright-premiere/game-bridge-sims-tiny-life.md)
gets federated in CARDs with the soul-file bridge lifting
[Ell](../../characters/ellpeck/README.md), not replacing him; MOOLLM
skill zips become the living `skills/` tree.

## Related

- [Soul City catalog](README.md) · [Browser ecosystem](browser-ecosystem.md)
- [Steam guide strategy](steam-community-guide.md) · [SoulAngel](soul-angel.md)
- [Sims 1 community landscape](../sims1-community-landscape.md)
