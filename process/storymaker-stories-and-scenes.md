# StoryMaker — stories & scenes

[ShowMaker inheritance](showmaker-network.md) · [Don's StoryMaker media](../characters/don-hopkins/media/storymaker/)

---

## The hook

Treat stories as **lightweight, card-based** things. **A scene is the universal StoryMaker card** — container with optional standard properties plus arbitrary JSON and files. Evolves: written description → shot → takes uploaded into card.

ShowMaker inherits this substrate — see [showmaker-network.md](showmaker-network.md#storymaker-inheritance). Tenant/worlds layer above this is still pending.

## Directory layout

```
stories/<slug>/STORY.yml
stories/<slug>/000-the-sun-rises/   # numbered scene dirs — big-endian order
```

Flat `stories/` top level. Scenes order by numeric prefix. Sub-stories group by shared prefix in same flat dir.

## Scene card properties (all optional)

title · text · photo · gps_coords · metadata · links · embedded_video

Video: TikTok-length or longer; hosted anywhere or stored in card.

## Show hooks

- **StoryMaker demo as playlist:** Modular incrementally-assembled playlist IS a StoryMaker story.
- **Bar Karma lineage:** SFC iPhone StoryMaker progenitor named on stream.

## Deeper links

| Topic | Where |
|-------|--------|
| Urban Safari StoryMaker | [../characters/don-hopkins/media/storymaker-urban-safari/](../characters/don-hopkins/media/storymaker-urban-safari/) |
| 1MM sandwich playlists | [one-minute-movie-sandwich.md](one-minute-movie-sandwich.md) |

↑ [process index](README.md) · Girder: `storymaker-stories-and-scenes.yml`
