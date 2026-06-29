# Will Wright show — primary sources (Drupal + Medium)

Clean, republishable markdown extracted from Don Hopkins's archival prompts (`DonHopkins/temp/big-prompts.txt`, `google-docs.txt`).

**Regenerate:** `python3 DonHopkins/projects/willwrightshowforfood/tools/extract_donhopkins_articles.py --force`

| Status | Slug | Title | Original |
|--------|------|-------|----------|
| complete + images | [1996-04-26-winograd-interfacing-to-microworlds](1996-04-26-winograd-interfacing-to-microworlds/) | Designing User Interfaces to Simulation Games (1996) | [Medium](https://donhopkins.medium.com/designing-user-interfaces-to-simulation-games-bd7a9d81e62d) |
| text | [2018-04-23-sims-crowd-sitter](2018-04-23-sims-crowd-sitter/) | The Sims 1 Crowd Sitter | [Medium](https://donhopkins.medium.com/the-sims-1-crowd-sitter-1f478b645148) |
| text | [2018-04-24-dumbold-voting-machine](2018-04-24-dumbold-voting-machine/) | Dumbold Voting Machine for The Sims 1 | [Medium](https://donhopkins.medium.com/dumbold-voting-machine-for-the-sims-1-3e76f394452c) |
| text | [2008-02-10-soul-of-the-sims](2008-02-10-soul-of-the-sims/) | The Soul of The Sims, by Will Wright | [Drupal node/79](http://www.donhopkins.com/drupal/node/79) |
| text | [2004-02-21-chris-trottier-tuned-emergence](2004-02-21-chris-trottier-tuned-emergence/) | Chris Trottier — Tuned Emergence & Design by Accretion | [Drupal node/31](http://www.donhopkins.com/drupal/node/31) |
| text | [2007-11-16-simcity-rules-alan-kay](2007-11-16-simcity-rules-alan-kay/) | SimCity Rules (Alan Kay / OLPC thread) | [Drupal node/9](http://www.donhopkins.com/drupal/node/9) |

## Drupal blog — extracted (figures pending)

| Slug | Drupal | Topic |
|------|--------|-------|
| [drupal-node-2](drupal-node-2/) | node/2 | RSS 2.0 Sims Module, MySim / Radio UserLand |
| [drupal-node-5](drupal-node-5/) | node/5 | Bunny Wuffles School of Sims Transmogrification |
| [drupal-node-6](drupal-node-6/) | node/6 | From Barbie to Mortal Kombat (Henry Jenkins) |
| [drupal-node-10](drupal-node-10/) | node/10 | RugOMatic tutorial |
| [drupal-node-11](drupal-node-11/) | node/11 | XML Pie Menus |
| [drupal-node-16](drupal-node-16/) | node/16 | Sims proposals & documentation index |
| [drupal-node-17](drupal-node-17/) | node/17 | Third-party content authoring tools proposal |
| [drupal-node-18](drupal-node-18/) | node/18 | Transmogrifier renovation plan |
| [drupal-node-19](drupal-node-19/) | node/19 | Educational multiplayer SimCity for Linux |
| [drupal-node-20](drupal-node-20/) | node/20 | MaxScript character animation pipeline |
| [drupal-node-21](drupal-node-21/) | node/21 | (duplicate topic — verify against node/20) |
| [drupal-node-22](drupal-node-22/) | node/22 | Educational multiplayer SimCity (variant) |
| [drupal-node-24](drupal-node-24/) | node/24 | MaxScript pipeline (variant) |
| [drupal-node-30-spore-gdc](drupal-node-30-spore-gdc/) | node/30 | MaxScript pipeline email (not Spore GDC — rename pending) |
| [drupal-node-36](drupal-node-36/) | node/36 | RSS Sims module (variant) |
| [drupal-node-38](drupal-node-38/) | node/38 | Laszlo database interface |
| [drupal-node-43-transmogrifier](drupal-node-43-transmogrifier/) | node/43 | Transmogrifier |
| [drupal-node-44-original-sims](drupal-node-44-original-sims/) | node/44 | Sims content catalog / Laszlo |

## Still to extract or enrich

- **Drupal node/148** — SimFreaks CMS / content catalog narrative (in big-prompts; needs dedicated pass)
- **Drupal node/97** — pie menus / early post
- **Drupal node/1, 8, 15** — present in Wayback dumps; not yet cleanly split
- **Spore GDC 2005** — Medium article not in temp file; fetch separately
- **Soul of The Sims** — scanned `Motive.c` pages on donhopkins.com (images/OCR)
- **All Medium figures** — wire images like Winograd (`fetch_images.py` + miro.medium.com CDN)

Canonical extraction copies: `DonHopkins/projects/willwrightshowforfood/research/sources/drupal/` and `.../medium/`.
