# SimFaux — app hub (WWSFF stage)

**Center of gravity for SimFaux development.** Public live work happens here on the
Will Wright Show For Food stage. Character dirs and Repo Shows are **portfolio wrappers**.
When the lineage runs, this tree spins out into its own repo with minimal surgery.

Interactive TV-station simulator. OpenLaszlo / Flash parody of Fox News for the
Huffington Post Contagious Festival (2006). Pie menus, channel surf, keyword-tagged
characters, video bites, surveys, games.

*Sniff:* [`GLANCE.yml`](GLANCE.yml) · [`CARD.yml`](CARD.yml) · [`ORGANELLES.yml`](ORGANELLES.yml)

## Sideways symbiosis (the architecture)

Like **multiple souls in Soul City** — sibling sub-directory organelles in parallel,
sharing this hub as cytoplasm. The 2006 LZX app becomes a **sub-organelle used as DNA**
(not required to execute). It is **transcribed** into an OpenLaszlo 5.0 app that works,
then / also into a Declare app. No succession-by-erasure.

| Organelle | Path | Role |
|---|---|---|
| DNA | [`original-lzx/`](original-lzx/) | 2006 OpenLaszlo tree — genome, not the required runtime |
| Camera | [`openlaszlo-5/`](openlaszlo-5/) | Transcription on [OL 5.0](https://github.com/davidtemkin/openlaszlo-5.0) |
| Cinematography | [`declare/`](declare/) | Transcription in [Declare](https://github.com/davidtemkin/declarelang) |

Frame: [`ORGANELLES.yml`](ORGANELLES.yml) ·
[`../../process/character-endosymbiosis.yml`](../../process/character-endosymbiosis.yml)

## Shared cytoplasm

| Path | What |
|---|---|
| [`media/`](media/) | Screenshots + YAML specs |
| [`archives/`](archives/) | Wayback / Drupal essays & README |
| [`deploy.md`](deploy.md) | Runtime AV on **donhopkins.com** — not in this repo |
| [`../../bits/gag-simfaux-repo-show-prototype/`](../../bits/gag-simfaux-repo-show-prototype/) | Canonical gag; local stub in `ideas/gags/` |
| [`SPIN-OUT.md`](SPIN-OUT.md) | Extract checklist for a dedicated SimFaux repo |

## Media policy

**Audio / video / SWF stay on the server.** Point at https://donhopkins.com/home/new/.
Do not rsync FLV/SWF/AVI into WWSFF. Details: [`deploy.md`](deploy.md).

## Thesis

2006 SimFaux was already a **Repo Show economy**. 2026: keep the genome, grow sibling
runtimes, use Declare-SimFaux as the live / recorded switchboard (video + infovis +
pie-menu direction).

## Wrappers (contextualize, don't own)

- Don portfolio: [`characters/don-hopkins/media/simfaux/`](../../characters/don-hopkins/media/simfaux/)
- Code map: [`characters/don-hopkins/code/simfaux/`](../../characters/don-hopkins/code/simfaux/)
- Will YouTube seed: [`characters/will-wright/sources/don-youtube-gRodlxUZ9SQ-simfaux/`](../../characters/will-wright/sources/don-youtube-gRodlxUZ9SQ-simfaux/)
- OpenLaszlo reunion: [`repo-shows/openlaszlo/`](../../repo-shows/openlaszlo/)
- SimFaux show: [`repo-shows/simfaux/`](../../repo-shows/simfaux/)
