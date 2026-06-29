# Will Wright show — primary sources (Drupal + Medium)

Clean, republishable markdown extracted from Don Hopkins's archival prompts (`DonHopkins/temp/big-prompts.txt`, `google-docs.txt`).

**Regenerate Drupal:** `python3 DonHopkins/projects/willwrightshowforfood/tools/extract_donhopkins_articles.py --force`  
**Fetch Medium + images:** `python3 DonHopkins/projects/willwrightshowforfood/tools/fetch_medium_article.py --url … --dest …`

| Status | Slug | Title | Original |
|--------|------|-------|----------|
| complete + images | [1996-04-26-winograd-interfacing-to-microworlds](1996-04-26-winograd-interfacing-to-microworlds/) | Designing User Interfaces to Simulation Games (1996) | [Medium](https://donhopkins.medium.com/designing-user-interfaces-to-simulation-games-bd7a9d81e62d) |
| complete + images | [2018-04-23-sims-crowd-sitter](2018-04-23-sims-crowd-sitter/) | The Sims 1 Crowd Sitter | [Medium](https://donhopkins.medium.com/the-sims-1-crowd-sitter-1f478b645148) |
| complete + images | [2018-04-24-dumbold-voting-machine](2018-04-24-dumbold-voting-machine/) | Dumbold Voting Machine for The Sims 1 | [Medium](https://donhopkins.medium.com/dumbold-voting-machine-for-the-sims-1-3e76f394452c) |
| text | [2008-02-10-soul-of-the-sims](2008-02-10-soul-of-the-sims/) | The Soul of The Sims, by Will Wright | [Drupal node/79](http://www.donhopkins.com/drupal/node/79) |
| text | [2004-02-21-chris-trottier-tuned-emergence](2004-02-21-chris-trottier-tuned-emergence/) | Chris Trottier — Tuned Emergence & Design by Accretion | [Drupal node/31](http://www.donhopkins.com/drupal/node/31) |
| text | [2007-11-16-simcity-rules-alan-kay](2007-11-16-simcity-rules-alan-kay/) | SimCity Rules (Alan Kay / OLPC thread) | [Drupal node/9](http://www.donhopkins.com/drupal/node/9) |
| text | [2004-01-12-winograd-ui-simulation-games-drupal](2004-01-12-winograd-ui-simulation-games-drupal/) | Winograd UI talk (Drupal text, 2004) | [Drupal node/8](http://www.donhopkins.com/drupal/node/8) |
| text | [2007-11-16-olpc-visual-programming-psiber](2007-11-16-olpc-visual-programming-psiber/) | OLPC Visual Programming / PSIBER | [Drupal node/97](http://www.donhopkins.com/drupal/node/97) |
| stub | [2005-03-11-spore-gdc-future-of-content](2005-03-11-spore-gdc-future-of-content/) | Spore GDC 2005 — Future of Content | [Medium 404](https://donhopkins.medium.com/the-future-of-content-will-wrights-spore-demo-at-gdc-3-11-2005-568857a2e6e9) |

## Drupal blog — extracted (figures pending)

| Slug | Drupal | Topic |
|------|--------|-------|
| [drupal-node-2](drupal-node-2/) | node/2 | RSS 2.0 Sims Module, MySim / Radio UserLand |
| [drupal-node-5](drupal-node-5/) | node/5 | Bunny Wuffles School of Sims Transmogrification |
| [drupal-node-6](drupal-node-6/) | node/6 | From Barbie to Mortal Kombat (Henry Jenkins) |
| [drupal-node-10](drupal-node-10/) | node/10 | RugOMatic tutorial |
| [drupal-node-11](drupal-node-11/) | node/11 | XML Pie Menus |
| [drupal-node-16](drupal-node-16/) | node/16 | Redesigning SimCity UI for OLPC |
| [drupal-node-17](drupal-node-17/) | node/17 | Third-party content authoring tools proposal |
| [drupal-node-18](drupal-node-18/) | node/18 | Transmogrifier renovation plan |
| [drupal-node-19](drupal-node-19/) | node/19 | Educational multiplayer SimCity for Linux |
| [2004-02-19-maxscript-animation-pipeline](2004-02-19-maxscript-animation-pipeline/) | node/30 | MaxScript character animation pipeline |
| [drupal-node-30-spore-gdc](drupal-node-30-spore-gdc/) | node/30 | **Deprecated slug** — see `2004-02-19-maxscript-animation-pipeline` |
| [drupal-node-36](drupal-node-36/) | node/36 | RSS Sims module (variant) |
| [drupal-node-38](drupal-node-38/) | node/38 | Laszlo database interface (component) |
| [drupal-node-43-transmogrifier](drupal-node-43-transmogrifier/) | node/43 | SimFreaks content catalog (OpenLaszlo + Python) |
| [drupal-node-44-original-sims](drupal-node-44-original-sims/) | node/44 | Laszlo database interface (Drupal post) |
| [2005-09-22-halloween-tombstones-original-sims](2005-09-22-halloween-tombstones-original-sims/) | — | Original Sims tombstone site (Wayback) |

## Still to extract or enrich

- **Soul of The Sims** — scanned `Motive.c` pages on donhopkins.com (images/OCR)
- **Spore GDC 2005** — full article text (Medium removed; stub only)
- **Drupal node/148** — Wayback pointer in big-prompts is jumbled with Original Sims captures; SimFreaks CMS narrative is largely in node/43
- **Drupal node/1, 15** — present in Wayback dumps; not yet cleanly split
- **Original Sims site screenshots** — cemetery, halloween, dumbold pages embedded in big-prompts (~2990–4600)

Canonical extraction copies: `DonHopkins/projects/willwrightshowforfood/research/sources/drupal/` and `.../medium/`.
