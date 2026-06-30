# The Sims 1 Object Exporter — MaxScript pipeline demo

*YouTube: https://www.youtube.com/watch?v=ImLZzXB9asw*

## What it shows

Don's **Transmogrifier-era object export** tooling inside **3D Studio Max** — MaxScript UI driving a C++ plugin that speaks The Sims object/IFF format.

## Pipeline (from 2020 AIFoundation mail)

Don sat with **Ocean Quigley** (lead artist) to learn Biped / Character Studio workflow, then built artist-facing tools rather than programmer-imposed dialogs:

- **Max note tracks** mark animation/object segment boundaries and properties  
- Validation against the **content database**  
- Automatic **source control** check-in/out  
- **Batch export** — reproducible builds without hand-filling exporter dialogs each iteration

MaxScript sample (Turbo-Deluxe edition UI):  
https://donhopkins.com/home/archive/maxscript/maxis-maxscript.ms.txt

## Lineage to Micropolis Home

| Then (1999) | Now (2026) |
|-------------|------------|
| MaxScript + C++ exporter | Web-native Transmogrifier / IFF tools |
| ActiveX ShowNTell previews | IFF renderer + Maxis catalog metadata |
| EA internal content DB | Git CARD dirs + federation |

## Related

- [Character animation exporter](https://www.youtube.com/watch?v=LmB7Q6wSQ9Y) — [`../don-youtube-LmB7Q6wSQ9Y-character-animation-exporter/`](../don-youtube-LmB7Q6wSQ9Y-character-animation-exporter/)
- [Medium — Automating The Sims Character Animation Pipeline with MaxScript](https://medium.com/@donhopkins/automating-the-sims-character-animation-pipeline-with-maxscript-bc490787d7a2)
- [Tools bundle demo (Transmogrifier + Simplifier)](../don-youtube-imu1v3GecB8-simplifier-tools-demo/)
- [`../2004-01-08-showntell-activex-preview/`](../2004-01-08-showntell-activex-preview/)

*Harvest: `DonHopkins/temp/old-email/re-promised-links.txt`*
