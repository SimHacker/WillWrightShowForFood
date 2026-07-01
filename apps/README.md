# apps/

Deployable applications live here — SvelteKit sites, stream overlays, adventure clients, etc.

**Nothing shipped yet.** The monorepo scaffold is ready; first apps will likely include:

| Future app | Idea |
|------------|------|
| `site/` | Public-facing Repo Show site (GitHub Pages or sibling to raw README) |
| `stream-gateway/` | Brain bus — SSE overlay, Twitch/YouTube chat; spec: [`process/brain-stream.yml`](../process/brain-stream.yml) · seed: [`GLANCE.yml`](stream-gateway/GLANCE.yml) |
| `micropolis-angel/` | **Windows companion** — WinUI 3 + WebView2; [`native/MicropolisAngel.sln`](micropolis-angel/native/MicropolisAngel.sln) · [`WINDOWS-DEV-SETUP.md`](micropolis-angel/WINDOWS-DEV-SETUP.md) |
| `performance-space/` | OBS browser toys — Conan face-puppet, play-along helpers; design: [`process/performance-space/`](../process/performance-space/) |
| `adventure/` | MOOLLM adventure microworld — **great Will show**: teach him rooms/skills, record it, ship it |

Pattern follows [MicropolisCore](https://github.com/SimHacker/MicropolisCore) `apps/micropolis`, `apps/vitamoospace`.

When you add an app, give it a `package.json` — `pnpm-workspace.yaml` already includes `apps/*`.
