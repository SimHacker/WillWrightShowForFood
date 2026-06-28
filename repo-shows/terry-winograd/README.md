# A Repo Show with Terry Winograd — The Forebear 🐉

> The dragon with the treasure trove. Terry Winograd convened Stanford's **CS547
> "People, Computers, and Design"** seminar — an open, recorded, one-guest-a-week
> public seminar that ran for two decades. It is the **direct forebear of the Repo
> Show**, and its video archive is the trove this whole project stands on.

## The thesis

CS547 already *was* the format: **one luminary a week, open public access, recorded
for posterity, real audience Q&A.** The Repo Show is its descendant — the same shape,
now with a git repo as the stage and AI as an optional instrument. This show stands
explicitly on Terry's shoulders, and on the shoulders of the ~300 guests he hosted.

One of those guests, on **April 26, 1996**, was Will Wright — the talk that drew Don
Hopkins to Maxis and seeded the flagship [Will Wright show](../will-wright/). That
talk is one recording in a catalog of **339**.

## The treasure trove

The full catalog lives here, planted from the source spreadsheet Don supplied:

- **[`ARCHIVE.md`](ARCHIVE.md)** — human-readable catalog, grouped by year, with the
  watchable-now scans up top and every WWSFF guest flagged.
- **[`archive.yml`](archive.yml)** — machine-readable girder (VHS/DVD inventory rows
  collapsed to one entry per talk; SearchWorks scan ids, YouTube uploads, and WWSFF
  character flags merged in).
- **[`catalog.tsv`](catalog.tsv)** — faithful tab-separated mirror of the source.
- **[`build-archive.py`](build-archive.py)** — the generator (`catalog.psv` →
  `catalog.tsv` + `archive.yml` + `ARCHIVE.md`). Edit the data, not the outputs.

**Collection:** Stanford University, CS Dept., HCI Group, CS547 seminar
videorecordings, 1990–2012 — [SC1217](https://oac.cdlib.org/findaid/ark:/13030/c82b926h),
18 linear feet, 598 components, Boxes 1–12.
**Browse:** [SearchWorks](https://searchworks.stanford.edu/catalog?f%5Bcollection%5D%5B%5D=a10637698).

### By the numbers

- **339 talks** catalogued
- **15+** with a known online scan (Stanford SearchWorks) — watchable now. This is a **floor, not a
  ceiling**: only the scans Don cross-referenced from his 2024 HN post are marked. Many more are
  likely already scanned (or easily scannable) — to be dug up and catalogued later, after contacting Terry.
- **25 talks** by people who are already WillWrightShowForFood characters

## WWSFF guests already in the trove

Eleven existing characters gave CS547 talks — the lineage is not abstract, it's a
guest list:

| Character | CS547 talk(s) |
|---|---|
| [will-wright](../../characters/will-wright/) | Interfacing to Microworlds (1996) · Games and Simulation (2003) |
| [james-gosling](../../characters/james-gosling/) | Bringing Behavior to the Internet — Java (1995) |
| [alan-kay](../../characters/alan-kay/) | Croquet: A Collaboration Architecture (2003) |
| [ted-selker](../../characters/ted-selker/) | five talks (1993–2005): TrackPoint, agents, context-aware computing |
| [scott-kim](../../characters/scott-kim/) | VizAbility (1996) · Paper, Plastic, or Playstation? (2004) |
| [ken-kahn](../../characters/ken-kahn/) | Toon Talk / Animated Programs (1993) |
| [ben-shneiderman](../../characters/ben-shneiderman/) | The Eyes Have It (1998) · Leonardo's Laptop (2000) |
| [margaret-minsky](../../characters/margaret-minsky/) | Putting 'Feel' into 'Look and Feel' (1993) |
| [brad-myers](../../characters/brad-myers/) | Mobile Devices for Control (2002) |
| [ken-perlin](../../characters/ken-perlin/) | Recent Research at the NYU Media Research Lab (1999) |
| [terry-winograd](../../characters/terry-winograd/) | host + ~8 of his own talks (1992–2003) |

## Dream guests hiding in the catalog

The trove is also a guest wishlist: Adele Goldberg (Learning Works, 1996), Brenda
Laurel (Gender and Technology; Utopian Entrepreneur), Larry Tesler + David Canfield
Smith (StageCast — Visual Interactive Simulations, 1999), Andy Hertzfeld (Magic Cap),
Jaron Lanier, Don Norman, Jef Raskin, Hiroshi Ishii (Tangible Bits, 1997), Pattie Maes
(Learning Interface Agents, 1994), Bill Buxton, Larry Page ("Google Is Not an
Anomaly," 2002), Marissa Mayer, Joy Mountford.

## Show hooks

- **Decode the 1996 Will Wright talk live** — the throughline that sent Don to Maxis
  ([the centerpiece](../will-wright/sources/1996-04-26-winograd-interfacing-to-microworlds/)).
- **The 1995 Gosling Java talk** — Don on camera asking Java-security questions; the
  NeWS→Java lineage.
- **Walk the catalog for predictions** — which talks called the present? (Larry Page on
  Google before Google; Maes on interface agents; Ishii on tangible bits.)
- **Archive-as-curriculum** — pick a talk, build a modern runnable seed from its idea
  (Micropolis Class continuation).
- **A standing preservation project** — most recordings are VHS/DVD inventory with no
  online scan; help Stanford digitize + caption the historically important ones (Don
  already did this for Will 1996 and Gosling 1995).

## Provenance + ethics

Catalog metadata only is mirrored here (not the recordings). Stanford Special
Collections (SC1217): research/educational use; reproduction requires written
permission from the Head of Special Collections and the copyright owner. The catalog
was supplied by Don Hopkins and cross-referenced against his 2024 Hacker News
inventory ([item 39252103](https://news.ycombinator.com/item?id=39252103)) and the
[OAC finding aid](https://oac.cdlib.org/findaid/ark:/13030/c82b926h). Terry's
portrayal follows [`../../schemas/portrayal-standards.yml`](../../schemas/portrayal-standards.yml);
consent **not yet asked** (see [`invitation`](../../characters/terry-winograd/invitation.md)).

## See also

- [`../../characters/terry-winograd/correspondence.yml`](../../characters/terry-winograd/correspondence.yml) — verified talks + Don's preservation roles
- [`../../process/trails/cs547-seminar-lineage.md`](../../process/trails/cs547-seminar-lineage.md) — the lineage trail
- [`../../process/trails/archive-and-provenance.md`](../../process/trails/archive-and-provenance.md) — primary-source preservation trail
- [`../will-wright/`](../will-wright/) — the flagship show this archive preserved

---

_Goodnight, until tomorrow._
