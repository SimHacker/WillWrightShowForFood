# YouTube Bridge skill

[Lift pipeline](lift-pipeline.md) · [1MM Sandwich](one-minute-movie-sandwich.md) · [Don playlist index](../characters/will-wright/sources/don-youtube-playlist-index/)

---

## The hook

**Production dev TODO:** a repo show MOOLLM skill for managing and bridging back and forth to YouTube — sync metadata, comments, statistics, transcripts; cut long→short and remix; render descriptions with link networks + CTAs; **dig the grooves** (prev/next per playlist from YAML show network).

Architecture has **SimFaux's fingerprints** — Don's 2006 OpenLaszlo video mixing demo: clips wrapped in metadata, fuzzy scoring driving sequencing, simulated characters commenting. Same design, reimplemented on GitHub + YouTube + MOOLLM.

## Render pipeline

FFMPEG tools composing playlists as full videos — music, captions, link overlays, chapters — configured with YAML Jazz. Bootstrap: Cursor runs utils by hand, then play-learn-lift into CLI. This is the **plywood→mahogany** promotion machine.

## Show hooks

- **Groove automation demo:** Script reads playlist yaml → writes prev/next into video descriptions.
- **SimFaux lineage beat:** 2006 demo clip + today's bridge skill side by side.

## Deeper links

| Topic | Where |
|-------|--------|
| Participation funnels | [participation-funnels.md](participation-funnels.md) |
| StoryMaker scenes | [storymaker-stories-and-scenes.md](storymaker-stories-and-scenes.md) |
| SimFaux source bundle | [../characters/will-wright/sources/don-youtube-gRodlxUZ9SQ-simfaux/](../characters/will-wright/sources/don-youtube-gRodlxUZ9SQ-simfaux/) |

↑ [process index](README.md) · Girder: `youtube-bridge-skill.yml`
