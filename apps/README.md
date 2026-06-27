# apps/

Deployable applications live here — SvelteKit sites, stream overlays, adventure clients, etc.

**Nothing shipped yet.** The monorepo scaffold is ready; first apps will likely include:

| Future app | Idea |
|------------|------|
| `site/` | Public-facing Repo Show site (GitHub Pages or sibling to raw README) |
| `stream-gateway/` | Twitch/chat telemetry bridge for live shows |
| `adventure/` | MOOLLM adventure microworld — **great Will show**: teach him rooms/skills, record it, ship it |

Pattern follows [MicropolisCore](https://github.com/SimHacker/MicropolisCore) `apps/micropolis`, `apps/vitamoospace`.

When you add an app, give it a `package.json` — `pnpm-workspace.yaml` already includes `apps/*`.
