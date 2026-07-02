# Pie menus — CHI'88 and forty years of gestural verb-pickers

Radial menus you select by **direction**, not distance — fast, reliable, eyes-on-the-work direct manipulation.

## Deep prehistory — PIXIE (1969)

Don does **not** claim to have invented pie/radial menus. That honor belongs earlier:

- **PIXIE** — *A New Approach to Graphical Man-Machine Communication* (1969 CAD Conference, Southampton; IEEE Conf. Pub. 51, pp. 463–471). Radial menus on **PDP-7/Titan**, light-pen era — **Neil E. Wiseman**, **Heinz U. Lemke**, **John O. Hiles**, and colleagues.
- Don's role: **study, implement, evaluate, and ship** — then bake them into modeled worlds for forty years.

**Repo Show priority (ASAP):** episode with **Heinz U. Lemke** on PIXIE → CHI'88 → now.

| Show seed | Link |
|-----------|------|
| Solo — PIXIE on PDP-7/Titan | [`../../repo-shows/INDEX.yml`](../../repo-shows/INDEX.yml) → `pixie-pie-menus-pdp7.yml` |
| Group — Ben Shneiderman + Heinz | `ben-and-heinz-pie-menus.yml` |
| Don's hook list | [`ideas.md`](ideas.md) |

Primary sources in mail archive: Wiseman notes on radial menus in PIXIE; Cambridge colloquia PDFs (see Alan Kay / Engelbart / Brad Myers `media/from-mail/` manifests). Original 1969 film: Cambridge Univ Library archives, digitized by **David Chapman** (credited on YouTube). Don's homage edit: [*Flight of the PIXIE*](https://www.youtube.com/watch?v=jDrqR9XssJI) — clips from that film to Yuja Wang's *Flight of the Bumblebee*; pie-menu interaction as rapid bumblebee flight; homage to Wiseman, Lemke, and Hiles.

## CHI'88 — cooking them up at UMD HCIL

- **UMD HCIL CHI'88** — with John Callahan, Mark Weiser, Ben Shneiderman: empirical comparison (Fitts, error rates), implementations, demos
- Don's through-line: the **verb-picker for a modeled world** — SimCity tools, The Sims, MOOLLM skills

## Where they shipped

**NeWS lineage:** Sun **NeWS Toolkit** under **Warren Teitelman** (Don's manager ~1990–1991). Alvey 1985
*Methodology of Window Management* — Gosling **SunDew**, Rosenthal **Andrew**, Teitelman retrospective
([`../david-rosenthal/window-systems-lineage.yml`](../david-rosenthal/window-systems-lineage.yml)).

| Era | Platform |
|-----|----------|
| 1980s–90s | NeWS / PostScript, X11 / Tcl-Tk multiplayer SimCity |
| 1997–2000s | The Sims (core UI pattern) |
| 2006–2008 | OLPC Micropolis on XO |
| 2000s–now | Web, Unity, MicropolisCore holodeck pie layer ([PieCraft](https://github.com/SimHacker/MicropolisCore/tree/main/documentation/designs/piecraft)) |

## Primary sources

- CHI'88 paper (linked from [`portrayal/presentations.yml`](portrayal/presentations.yml))
- Dr. Dobb's Journal pie menu implementation article
- [`career/lineage.yml`](career/lineage.yml) — bundle entry + `pie_menus_prehistory`
- DonHopkins `talks/past/pie-menus-chi88.yml` (full talk package in private archive)

→ Live demo target: MicropolisCore `@micropolis/render-core` pie holodeck
