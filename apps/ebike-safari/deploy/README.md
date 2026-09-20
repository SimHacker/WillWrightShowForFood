# Deploy ebike-safari.com on GCP

Production stack on a single Ubuntu VM:

```
Internet → Caddy (:443 TLS) → SvelteKit viewer (:3000) → static ride JSON
                              ↘ PostGIS (:5432, internal only)
```

No GCLB — Caddy obtains Let's Encrypt certs directly. Use **Google Cloud DNS** (not GCS) for the domain.

## GCP account (Don personal)

| Setting | Value |
|---------|--------|
| Account | `simhacker@gmail.com` |
| Target project | `ebike-safari` |
| Region | `europe-west4` (Netherlands — near Badhoevedorp rides) |

```bash
gcloud config set account simhacker@gmail.com
gcloud config set project ebike-safari
```

**Billing:** this is **not** a spend or VM quota issue. Google limits how many **projects** one billing account can attach (yours already has **5**):

`geocoder-389217`, `hackernews-452415`, `lloooomm-464314`, `normlink`, `stashbox-390316`

Fix **without** a quota increase — unlink billing from a project you no longer need, then link `ebike-safari`:

```bash
# example: stop billing on lloooomm (project stays; APIs won't run until re-linked)
gcloud billing projects unlink lloooomm-464314
gcloud billing projects link ebike-safari --billing-account=0112F8-459E7B-E9C1E4
```

Or [request a project-count increase](https://support.google.com/code/contact/billing_quota_increase) if you want all six billed.

## Deploy workflow (git checkout + build on VM)

Push changes to GitHub from your Mac (`gh`/git). On the VM, pull and rebuild — no Mac docker, no Cloud Build, no rsync.

Deploys are scoped to named projects, and nothing deploys unless you say its name. Trigger one
without leaving your laptop:

All the deploy scripts now live at the repo root in `scripts/`, because they serve every app
rather than this one. Run them from the repo root:

```bash
git push origin main
bash scripts/deploy-remote.sh hyperties          # HyperTIES content
bash scripts/deploy-remote.sh ebike-safari       # the viewer app
bash scripts/deploy-remote.sh --list             # what exists, and what each deploy does
```

`deploy-remote.sh` knows one thing: which VM to ssh into. It forwards every argument to
`scripts/server-deploy.sh`, which adds the two server-only facts (create the release root,
default to `origin/main`) and hands off to `scripts/deploy-all.sh`. Same thing by hand on the box:

```
VM:   sudo bash scripts/server-deploy.sh hyperties
```

### The three layers, and why each exists

| Layer | Files | Knows about |
|---|---|---|
| Per app | `apps/*/scripts/build-app.sh`, `deploy-app.sh` | How *this* app builds and goes live |
| Aggregate | `scripts/build-all.sh`, `deploy-all.sh` | Which apps exist — by looking, not from a list |
| Entry points | `scripts/server-deploy.sh`, `deploy-remote.sh` | Which machine, which git ref |

Apps are discovered by convention: anything with `apps/<name>/scripts/deploy-app.sh` is
deployable. There is no registry to update, so adding an app changes no file above it — which is
the property that keeps the CI workflow from needing an edit per app.

Every layer runs identically on a laptop and on the VM. `RELEASE_ROOT` is `/srv/wwsff` on a
server and `.releases/` in the repo otherwise, so testing a deploy locally exercises the real
code path rather than a simulation of it. Worth doing, too: the build/deploy handoff broke the
first time precisely because a dirty working tree names releases differently, and only a laptop
has one.

### What each deploy actually does

- **hyperties** builds to `$RELEASE_ROOT/hyperties/releases/<commit>` and swaps the `current`
  symlink with `rename(2)`. Caddy resolves that symlink per request, so **nothing restarts and
  no request sees a half-published site.** Rollback is the same rename backwards:
  `bash apps/ties/scripts/deploy-app.sh --rollback <id>`, with `--list` to see the options.
- **ebike-safari** rebuilds its image and recreates the viewer container. Brief 502s while it
  comes back, which Caddy serves on its own.
- **Neither recreates Caddy**, so neither interrupts TLS for the other site.

A Caddyfile or redirect change is a separate, gentler operation: `bash scripts/reload-ingress.sh`
validates the config in a throwaway container and then reloads the running Caddy in place, with no
downtime at all. Only a change to compose itself — image, ports, volumes — needs
`--recreate`, and that is the one operation that briefly interrupts TLS for everything.

Two failure modes this replaced, kept because both actually happened:

- **Caddy used to be built from a Dockerfile** with the HyperTIES build baked in. Compose only
  builds during `up` when an image is missing, so a changed build context silently kept serving
  the old image — which is how the `hyperties.Caddyfile` fix sat undeployed while the site was
  down. Releases are bind-mounted now, and there is no image to forget to rebuild.
- **Caddy used to wait for the viewer to be healthy** before starting. That made hyperties.org
  hostage to an unrelated app's healthcheck. It is `service_started` now; a dead upstream is a
  502 from Caddy, not an unserved static site.

First boot on a fresh VM:

```bash
gcloud compute ssh ebike-safari-1 --zone=europe-west4-a --project=ebike-safari
sudo bash /opt/WillWrightShowForFood/apps/ebike-safari/deploy/scripts/server-install.sh
```

Checkout lives at `/opt/WillWrightShowForFood`. Secrets in `deploy/.env` (gitignored, created once on VM).

## Prerequisites

- Domain **ebike-safari.com** registered
- GCP project with billing
- Git clone access to `WillWrightShowForFood` (public repo)

## 1. GCP VM

Create an **e2-medium** (or e2-standard-2) instance:

| Setting | Value |
|---------|--------|
| OS | Ubuntu 24.04 LTS |
| Boot disk | 100 GB standard PD (PostGIS + Docker + ride data) |
| Firewall | Allow HTTP + HTTPS (tags `http-server`, `https-server`) |
| Static IP | Reserve external IP — point DNS here |

SSH in as your user.

## 2. Cloud DNS

In GCP **Network services → Cloud DNS**:

1. Create zone `ebike-safari-com` for `ebike-safari.com`
2. At your registrar, set nameservers to the 4 NS records Cloud DNS gives you
3. Add records:

| Name | Type | TTL | Data |
|------|------|-----|------|
| `@` | A | 300 | `<VM_STATIC_IP>` |
| `www` | A | 300 | `<VM_STATIC_IP>` |

Wait for propagation (`dig ebike-safari.com +short`).

## 3. Bootstrap VM

```bash
git clone https://github.com/<you>/WillWrightShowForFood.git
cd WillWrightShowForFood/apps/ebike-safari/deploy

sudo bash scripts/vm-bootstrap.sh
# log out/in if added to docker group
```

## 4. Secrets (never commit)

```bash
cp .env.example .env
chmod 600 .env
nano .env
```

Generate a Postgres password:

```bash
openssl rand -base64 32
```

Set:

- `DOMAIN=ebike-safari.com`
- `ACME_EMAIL=` your email (Let's Encrypt)
- `POSTGRES_PASSWORD=` generated secret
- `ORIGIN=https://ebike-safari.com`
- `MAPBOX_TOKEN=` see below

`.env` is gitignored.

### Mapbox token

**Where it lives:** 1Password, Ground Up Software account (`don@donhopkins.com`), item
**Mapbox**, vault **Employee**. That item carries two tokens, and production wants the
restricted one:

| Field | Reference | Use |
|---|---|---|
| `ebike-safari-token` | `op://Employee/Mapbox/ebike-safari-token` | **production** — URL-restricted to `ebike-safari.com` |
| `token` | `op://Employee/Mapbox/token` | the unrestricted default; local dev fallback only |

```bash
# print it (local machine, not the VM)
op read "op://Employee/Mapbox/ebike-safari-token" --account groundupsoftware.1password.com

# local dev — regenerate the gitignored file the viewer reads
op read "op://Employee/Mapbox/ebike-safari-token" --account groundupsoftware.1password.com \
  | sed 's/^/MAPBOX_TOKEN=/' > ../viewer/.env.local

# the VM — append to deploy/.env over ssh, without it touching your shell history
op read "op://Employee/Mapbox/ebike-safari-token" --account groundupsoftware.1password.com \
  | ssh ebike-safari-1 'umask 077; sed "s/^/MAPBOX_TOKEN=/" >> /opt/WillWrightShowForFood/apps/ebike-safari/deploy/.env'
```

**The restriction is real, and it blocks the dev server.** Measured 2026-09-20 against
`api.mapbox.com/v4/…vector.pbf` with the production token:

| `Referer` | Result |
|---|---|
| `https://ebike-safari.com` | **200** |
| `http://localhost:5173` | **403** |
| `http://127.0.0.1:5173` | **403** |
| none | **403** |

Two consequences. Requests with no referer are refused, so the token is useless pasted into
a terminal — which is most of the value. And local dev will not render tiles unless you
either add `http://localhost:5173` to the token's URL list in the console, or fall back to
the unrestricted default token (`viewer/.env.local` ships that line commented out, ready).

Note that the style *metadata* endpoint (`/styles/v1/…`) answers 200 regardless of referer;
enforcement lands on the tile and data requests, which is where the billing is.

**Scopes can be changed later without reissuing.** Editing a public token's scopes or URL
restrictions in the console leaves the token string unchanged, so nothing needs
redeploying — the one thing you cannot do is add a *secret* scope to a `pk.` token, since
secret scopes produce an `sk.` token that is displayed once and must never reach a browser.
This token deliberately carries `DATASETS:READ` and `VISION:READ` for experimentation; both
are read-only, and the only thing to keep in mind is that the token is served to browsers,
so anything readable through those scopes is readable by anyone who lifts it from the page.

**Why the name has no `PUBLIC_` prefix.** The viewer prerenders with `ssr = false`, so
anything named `PUBLIC_*` is compiled into the static bundle at `pnpm build` and ends up in
the Docker image layer — committing you to a rebuild to rotate. `MAPBOX_TOKEN` stays private,
is read at runtime with `$env/dynamic/private` inside a `+server.ts`, and handed to the
browser by an endpoint. Rotating it is then `docker compose restart viewer`.

**What this does and does not protect.** Keeping it out of the repo and out of the image is
real and worth doing. But a `pk.*` token that draws map tiles in a browser is *sent to every
visitor* — it cannot be secret, and no amount of secret management changes that. The control
that actually matters is a **URL restriction on the token itself**, and the current default
public token has `URLs: N/A`, meaning unrestricted. Before launch, create a token in the
[Mapbox console](https://console.mapbox.com/account/access-tokens/) scoped to
`ebike-safari.com`, use that one here, and leave the unrestricted default out of production.

If the token must never reach the browser — for a server-side API such as
[Isochrone](../design/peerboard-and-brews.md) — then keep it server-only and proxy the call,
which the Node server is already positioned to do.

**Optional hardening: Secret Manager instead of a file on disk.** The `.env` pattern above is
the house standard and satisfies "not in the repo". To move the source of truth into GCP:

```bash
# once, from your machine
op read "op://Employee/Mapbox/ebike-safari-token" --account groundupsoftware.1password.com \
  | gcloud secrets create mapbox-token --data-file=- --project=ebike-safari

# grant the VM's service account read access
gcloud secrets add-iam-policy-binding mapbox-token --project=ebike-safari \
  --member="serviceAccount:$(gcloud compute instances describe ebike-safari-1 \
      --zone=europe-west4-a --project=ebike-safari \
      --format='value(serviceAccounts[0].email)')" \
  --role=roles/secretmanager.secretAccessor

# on the VM, before `docker compose up` — fetch into the env it already reads
echo "MAPBOX_TOKEN=$(gcloud secrets versions access latest --secret=mapbox-token)" \
  >> deploy/.env
```

That keeps rotation in one place and leaves the deploy flow unchanged, since the container
still reads `MAPBOX_TOKEN` from the environment either way.

## 5. Deploy

```bash
bash scripts/deploy.sh
```

First build takes several minutes (Node install + SvelteKit build). Caddy requests TLS once DNS resolves.

Verify:

```bash
docker compose ps
curl -s http://localhost/api/health    # before TLS propagates, via Caddy :80
curl -s https://ebike-safari.com/api/health
```

## 6. Ride data (host volume, zero-copy)

Ride GeoJSON is **not** in git (`deploy/data/` is gitignored). The viewer bind-mounts it read-only:

```
deploy/data/  →  /app/build/client/data  →  https://ebike-safari.com/data/*
```

No rsync, no entrypoint copy. Whatever is on the VM host at `deploy/data/` is what the site serves.

Populate once on the VM (example — pipeline output from FIT corpus):

```bash
cd /opt/WillWrightShowForFood/apps/ebike-safari
python scripts/pipeline.py --sync --trips-dir demo/rides --out deploy/data \
  --home-label "Marconistraat 25, Badhoevedorp" --home-lat 52.3382 --home-lon 4.7854
```

Or copy an existing `web/data/` tree into `deploy/data/`. Then restart:

```bash
sudo bash scripts/server-deploy.sh ebike-safari
```

Demo data is baked into the image for local builds only; production requires `deploy/data/manifest.json` on the host.

## 7. Postgres smoke test

PostGIS initializes from `db/init/` on first boot.

```bash
docker compose exec db psql -U ebike -d ebike-safari -c "SELECT PostGIS_Version();"
```

Import rides from the host (needs Python + psycopg2 on VM, or run one-off container later):

```bash
cd ../..
pip install psycopg2-binary
DATABASE_URL="postgresql://ebike:YOUR_PASSWORD@localhost:5432/ebike-safari" \
  python scripts/import_trip_pg.py --data-dir deploy/data
```

(Publish port 5432 temporarily or use `docker compose exec` — by default Postgres is **not** exposed to the internet.)

## Architecture notes

| Component | Role |
|-----------|------|
| **Caddy** | TLS termination, reverse proxy to viewer |
| **viewer** | SvelteKit adapter-node; serves SPA + `/api/health` |
| **db** | PostGIS 16; ready for OSM cache / ride queries |

Viewer v0 still serves **static JSON** for the map. Postgres is provisioned for the next phase (map-match, exposure API). No secrets in git.

## Capacitor / local dev unchanged

```bash
cd ../viewer
pnpm install
pnpm run sync:data
pnpm run dev          # adapter-static (default)
SVELTE_ADAPTER=node pnpm run build   # same as Docker production build
```

## Updates

On the VM after `git push` from your Mac — name the app, since nothing deploys unless you do:

```bash
sudo bash /opt/WillWrightShowForFood/scripts/server-deploy.sh ebike-safari
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Caddy no cert | DNS not pointing at VM yet; check `dig ebike-safari.com` |
| 502 from Caddy | `docker compose logs viewer` — build or ORIGIN mismatch |
| Empty map | Copy ride data to `deploy/data/` and restart viewer |
| Postgres reset | `docker compose down -v` wipes `pgdata` (destructive) |

↑ [`../design/runbooks/03-postgres-postgis.md`](../design/runbooks/03-postgres-postgis.md)
