# apps/

Deployable applications live here — SvelteKit sites, stream overlays, adventure clients, etc.

**Nothing shipped yet.** The monorepo scaffold is ready; first apps will likely include:

| Future app | Idea |
|------------|------|
| `site/` | Public-facing Repo Show site (GitHub Pages or sibling to raw README) |
| `stream-gateway/` | Brain bus — SSE overlay, Twitch/YouTube chat; **subsumed by SoulAngel** (specs stay as design references); spec: [`process/brain-stream.yml`](../process/brain-stream.yml) · seed: [`GLANCE.yml`](stream-gateway/GLANCE.yml) |
| `soul-angel/` | **SoulAngel** — paid Steam companion for ANY game: DVR, Soul Album, machinima, Soul Bridges. Dev home: `MicropolisCore/apps/soul-angel/`; here: show side + [`SCBN.yml`](soul-angel/SCBN.yml); product: [`catalogs/soul-city/soul-angel.yml`](https://github.com/SimHacker/WillWrightShowForFood/tree/main/catalogs/soul-city/soul-angel.yml) |
| `micropolis-angel/` | **Windows host + Sims 1 Soul Bridge** — WinUI 3 + WebView2; [`native/MicropolisAngel.sln`](micropolis-angel/native/MicropolisAngel.sln) · [`WINDOWS-DEV-SETUP.md`](micropolis-angel/WINDOWS-DEV-SETUP.md) |
| `performance-space/` | OBS browser toys — Conan face-puppet, play-along helpers; design: [`process/performance-space/`](../process/performance-space/) |
| `simfaux/` | **SimFaux app hub** — sideways symbiosis: LZX DNA + OL5 + Declare sibling organelles; AV on server; spin-out ready ([`ORGANELLES.yml`](simfaux/ORGANELLES.yml) · [`SPIN-OUT.md`](simfaux/SPIN-OUT.md)) |
| `ebike-safari/` | **Ebike Safari FIT pipeline** — new from scratch; OSM/YAML/Git; legacy Urban Safari in amber; optional speech in/out + feedback lab (vendored MOOLLM speech modules in `viewer/src/lib/speech/`) ([`README.md`](ebike-safari/README.md)) |
| `adventure/` | MOOLLM adventure microworld — **great Will show**: teach him rooms/skills, record it, ship it |

Pattern follows [MicropolisCore](https://github.com/SimHacker/MicropolisCore) `apps/micropolis`, `apps/vitamoospace`.

When you add an app, give it a `package.json` — `pnpm-workspace.yaml` already includes `apps/*`.
