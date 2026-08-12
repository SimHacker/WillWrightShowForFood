# Ebike Safari viewer

SvelteKit 5 + MapLibre map replay for the FIT pipeline. Static SPA — same build for web and Capacitor iOS.

## Quick start

```bash
cd apps/ebike-safari/viewer
pnpm install
pnpm run sync:data
pnpm run dev
```

Open http://localhost:5173 — all rides overlay + heatmap by default.

Private instance (40 rides):

```bash
EBIKE_DATA_DIR=~/GroundUp/git/Marconistraat25/ebike/web/data pnpm run sync:data
pnpm run dev
```

## Map modes

| Mode | Shows |
|------|--------|
| **Both** | Route lines + visit heat (hot = often ridden) |
| **Routes** | All selected polylines |
| **Heat** | Frequency only — gaps = not yet |

Trip picker: All / None / individual checkboxes. Select **one** ride for replay scrubber.

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm run sync:data` | Copy `../demo/web/data/` → `static/data/` |
| `pnpm run dev` | Vite dev server (laptop loop) |
| `pnpm run build` | Static output → `build/` |
| `pnpm run cap:sync` | Build + copy to iOS project |
| `pnpm run cap:ios` | Open Xcode |

Runbooks: [`../design/runbooks/`](../design/runbooks/) · Production deploy: [`../deploy/README.md`](../deploy/README.md)

## Stack

- SvelteKit 2.7x / Svelte 5 / Vite 8
- MapLibre GL 6
- `@sveltejs/adapter-static` (Capacitor-friendly SPA)
- Capacitor 8 (iOS shell — run `npx cap add ios` once)

Node 22 recommended; Node 20 works with `engine-strict=false` in `.npmrc`.

## Optional login (Postgres)

The map stays public. **Log in** appears top-right when `DATABASE_URL` is set.

Local Postgres:

```bash
cd apps/ebike-safari/deploy
docker compose -f docker-compose.dev.yml up -d
cd ../viewer
DATABASE_URL=postgresql://ebike:ebike@localhost:5432/ebike_safari pnpm dev
```

Seed user (first boot): `don` / `changeme` — change password in DB before production.

↑ [`../README.md`](../README.md)
