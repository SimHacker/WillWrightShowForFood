# Foursquare lineage — lifelogging reference

Ebike Safari shares problem space with location lifelogging pioneers — useful context,
not a product to copy.

## Timeline (compressed)

| Era | Product | Relevance |
|-----|---------|-----------|
| 2003 | [Dodgeball](https://en.wikipedia.org/wiki/Dodgeball_(service)) | SMS check-ins; acquired by Google 2005 |
| 2009 | [Foursquare City Guide](https://en.wikipedia.org/wiki/Foursquare_City_Guide) | Check-ins; **OSM maps**; gamification |
| 2014 | [Swarm](https://en.wikipedia.org/wiki/Foursquare_Swarm) | Lifelog split; personal place history |
| 2011+ | Pilgrim → Movement SDK | Stop-detection, snap-to-place |
| 2016+ | Marsbot / audio tips | Context-aware suggestions |
| 2024–25 | City Guide sunset | Consumer lifelog consolidates |

Co-founder [Naveen Selvadurai](https://en.wikipedia.org/wiki/Naveen_Selvadurai): OSM-backed
maps, opt-in check-in framing.

## What Ebike Safari does differently

| Foursquare / Swarm | Ebike Safari |
|--------------------|--------------|
| Manual check-in | Continuous ride trace |
| Point POI database | OSM graph + **both sides** frontage |
| Gamified mayorships | Semantic gestures + novel exposure |
| Enterprise location cloud | Git + YAML + static JSON |
| Phone app centric | **Bicycle** as instrument |

## Design hooks

- Ride *is* the check-in stream — no tap per venue
- Geometry spells on real streets (roundabout = recognized loop)
- Exposure report richer than "you visited 3 places"
- LLM narrates **detected** event sequences — engine stays honest

↑ [../exposure-pac-man.md](../exposure-pac-man.md)
