# Open-sourcing SimCity for OLPC — the Micropolis saga

**2006–2008:** John Gilmore → Will Wright → EA Legal → **GPL Micropolis** on the OLPC XO **Sugar** laptop. One of the best-documented open-source clearance stories in games.

## Why it mattered

- **Constructionist computing** — Alan Kay, Walter Bender, Papert lineage: kids need to open the hood
- **Chain of custody** — DUX ↔ Maxis contracts, 10-year clause, EA ↔ OLPC agreement
- **Charles Norman** — inside EA shepherd through Legal and QA

## Don's implementation arc

1. Python **Sugar adaptor** around existing Tcl/Tk/X11 SimCity
2. Native **PyGTK** desktop UI — Cairo tiles, Pango text
3. Later: **MicropolisCore** C++ → WASM + SvelteKit + WebGPU

## Primary sources in this repo

| Artifact | Path |
|----------|------|
| Timeline + contracts | [`career/simcity-lineage.yml`](career/simcity-lineage.yml) |
| Contract scans | [`career/contracts/`](career/contracts/README.md) |
| Will Wright mail saga | [`../../characters/will-wright/sources/simcity-open-source-saga/`](../../characters/will-wright/sources/simcity-open-source-saga/README.md) |
| Full evidence room map | [`../will-wright/primary-sources-evidence-room.md`](../will-wright/primary-sources-evidence-room.md) |
| Chaim Gingold account | [Open Sourcing SimCity on Medium](https://donhopkins.medium.com/open-sourcing-simcity-58470a275446) |

**2026 downstream:** Andrew Dunn's [Hallucinating Splines](https://hallucinatingsplines.com) — LLM (and one evolutionary) agents as mayors on micropolisJS / Cloudflare. Don on the [Show HN](https://news.ycombinator.com/item?id=46946593): call it Micropolis; Toho/$50k; prefer MicropolisCore. Harvest: [`../will-wright/sources/2026-02-dunn-hallucinating-splines.md`](../will-wright/sources/2026-02-dunn-hallucinating-splines.md)

→ Python/Sugar detail: [`olpc-micropolis-python-pygtk.md`](olpc-micropolis-python-pygtk.md)
