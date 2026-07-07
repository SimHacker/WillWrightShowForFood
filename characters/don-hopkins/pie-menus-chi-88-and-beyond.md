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

Primary sources in mail archive: Wiseman notes on radial menus in PIXIE; Cambridge colloquia PDFs (see Alan Kay / Engelbart / Brad Myers `media/from-mail/` manifests). Original 1969 film: Cambridge Univ Library archives, digitized by **David Chapman** (credited on YouTube). Don's homage edit: [*Flight of the PIXIE*](https://www.youtube.com/watch?v=jDrqR9XssJI) — clips from that film to [**Yuja Wang**'s *Flight of the Bumblebee*](../../characters/yuja-wang/README.md) (Verbier Festival era; Cziffra arrangement); pie-menu interaction as rapid bumblebee flight; homage to Wiseman, Lemke, and Hiles. Tribute pointer + Instagram share links: [`characters/yuja-wang/`](../../characters/yuja-wang/README.md).

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
- Dr. Dobb's Journal — Ray Valdes pitch, draft outline, Buxton 12-item experiment (Sep 1991): [`sources/1991-09-pie-menus-buxton-ddj-draft.md`](sources/1991-09-pie-menus-buxton-ddj-draft.md)
- Mark Weiser — demo tape, 6×6 alphabetic pies, stylus 26-quadrant hack (Mar 1991): [`sources/1991-03-mark-weiser-pie-menu-tape-stylus.md`](sources/1991-03-mark-weiser-pie-menu-tape-stylus.md)
- [`career/lineage.yml`](career/lineage.yml) — bundle entry + `pie_menus_prehistory`
- DonHopkins `talks/past/pie-menus-chi88.yml`

→ Live demo target: MicropolisCore `@micropolis/render-core` pie holodeck

## PieCraft — player-crafted menus as first-class artifacts

From [HN retrospective](https://news.ycombinator.com/item?id=17098179): pie menus as **in-game
craftable artifacts** — editable, vulnerable in combat, discoverable through pressure and reward.
Teaches Fitts/Steering through play (Monster Hunter: World radial guide as shipped example).

| Show seed | Link |
|-----------|------|
| Edd Coates — pie menus in games | [`../../repo-shows/edd-coates/pie-menus-piecraft.yml`](../../repo-shows/edd-coates/pie-menus-piecraft.yml) |
| Gesture + discoverability | [`gesture-space.md`](gesture-space.md) |

MicropolisCore design: [PieCraft](https://github.com/SimHacker/MicropolisCore/tree/main/documentation/designs/piecraft)

## IE5 — XML + XSLT + HTC (obsolete but instructive)

Museum stack for declarative pie menus on Internet Explorer 5 — ancestor of ConnectedTV Skin Editor.
→ [`ie-jscript-htc-xslt-pie-menus.md`](ie-jscript-htc-xslt-pie-menus.md)

## Living lineage — Wedge for After Effects (Jul 2026)

**Wedge** (Charchit Goyal / u/themotionguy) — context-aware pie menu **inside** After Effects: one shortcut, menu at cursor, verbs scoped to selection (keyframes, masks, shapes, text, comps). Inspired by Blender/Maya; beta via [charchitgoyal.com/plugins/wedge](https://charchitgoyal.com/plugins/wedge).

Reddit: [r/AfterEffects thread](https://www.reddit.com/r/AfterEffects/comments/1uomg6a/im_building_a_contextaware_pie_menu_for_after/) — u/eye-flying: *"i will let don hopkins know. pie menu central."*

Archive: [`media/pie-menus/2026-07-reddit-wedge-after-effects.md`](media/pie-menus/2026-07-reddit-wedge-after-effects.md) · field contact: [`../charchit-goyal/`](../charchit-goyal/)
