# Membership model: free local tools, paid compute and services

*Ruling (Don, 2026-08-29). Content is free; tools are the product;
membership buys the parts that cost us money to run. Siblings:
[portals-and-modules.md](portals-and-modules.md),
[stat-u-matic.md](stat-u-matic.md),
[steam-app-strategy.md](steam-app-strategy.md).*

## The shape (RugOMatic showed the way)

Rug-O-Matic proved the clean split in 2004: the tool had a $10
registration, and the content it made circulated freely. The 2026
version, updated for local-first web modules:

1. **Shared content is free to download.** Always. Every statue, rug,
   wig, wall, home, and album published to Soul City is free to
   anyone. (This is also the compliance rule from the
   [community landscape](../sims1-community-landscape.md): free UCC
   plus disclaimer -- we charge for OUR tools, never for content
   derived from anyone's game.)
2. **Sharing is rewarded with social currency**: recognition,
   platforming, community. Great creators get featured, credited,
   curated, and invited -- the catalog is the stage. GitHub-backed to
   start (repos, PRs, stars), a nicer interface over a git or
   Postgres backend as it scales.
3. **The tools are web-based, open source, local-first.** Everything
   a module can do against your own files in your own browser is
   **free for everyone, forever**, and never requires talking to a
   server. Plug in your own LLM key and the AI features are yours
   too, free.
4. **Membership buys the online and AI components.** Hosted AI
   generation, server-side compute, and the online services below are
   metered: a few free uses per week for everyone, subscription
   tiers for more. What sits behind the meter must be *obviously*
   worth it -- the SimCity 2013 lesson is constitutional: nobody is
   forced online, the offline tool is whole, and payment buys power,
   not permission.

## What the meter can sit on (candidates)

The test for every candidate: compute-heavy or service-backed, so
players feel they are paying for something real.

| Candidate | Why it is worth paying for | Tool lineage |
|-----------|---------------------------|--------------|
| AI texture generation and editing | Hosted models, prompt-to-game-ready output (tiling, palette, dimensions) | shared texture plugins ([stat-u-matic.md](stat-u-matic.md)) |
| Statue and object baking | Posed 3D render -> full sprite set (rotations, zooms, z-buffer, alpha) is a render-farm job | Stat-U-Matic |
| Hair pipeline | Multitarget mesh + texture interpolation, AI color maps -- hair is the most-loved CC category there is | WigFabrik |
| Cellular automata generators | Living patterns for rugs, walls, animated objects (fireplaces, TVs, lava lamps, fish tanks) | Rug-O-Matic, CAM-6 lineage |
| Mesh generation | Text/image -> 3D -> game skeleton | TMog mesh tools |
| Batch operations | One object free, a catalog's worth metered: bulk recolor, bulk repair, bulk re-credit | TMog proper |
| Registry services | GUID conflict scans of your Downloads folder: occasional free, continuous monitoring paid | Magic Cookie registry reborn |
| Album and video production | Narrated album -> rendered video (TTS, DVR compositing, machinima export) | SoulAngel, ShowNTell |
| Hosted AI assist | Chatting with God with our keys metered; bring your own key free | sims1 Soul Bridge |
| Restoration | Repair corrupted saves and broken legacy downloads; resurrect dead-link content | TMog save layer |

## What is never behind the meter

- All local read/write/edit/generate against your own files.
- Downloading and installing shared content.
- Publishing and sharing your work (we WANT the content inflow).
- The turnstile, the tote board, and both petitions.
- SoulAngel's core album and DVR (already ruled in
  [soul-angel.yml](soul-angel.yml): subscription "never gates the
  core album and DVR").
- Recognition. **Capability is for sale; rank is not.** Featured
  placement, credits, and curation are earned, never bought --
  bought recognition debases the social currency that makes sharing
  worth more than hoarding. Supporter badges (visible generosity)
  stay visually distinct from creator recognition (earned merit).

## Pricing shapes (to iterate)

- **Free**: all local tools; a few metered uses per week; full
  community membership; share and download without limits.
- **Supporter**: more metered uses; continuous registry monitoring;
  priority render queue; supporter badge.
- **Creator**: batch operations; the full hair/statue/video
  pipelines at working volume; portfolio page.
- **Lifetime unlocks** where they fit: the RugOMatic $10 lesson --
  a one-time price for a tool tier buys goodwill that subscriptions
  burn. Candidate: SoulAngel itself is a paid Steam app (one-time),
  with subscription only for hosted AI.

## Why open source does not break this

Anyone can self-host the modules and bring their own keys -- that is
by design, not a leak. What membership sells is hosted convenience,
compute, and services woven into the community: the render farm, the
registry, the catalog, the provenance, the audience. Precedents: OBS
(free, thrives on services around it), Aseprite (open source, paid
builds), Wallpaper Engine and Lossless Scaling (paid utilities on
Steam with huge communities). The moat is the community and the
convenience, not secrecy.
