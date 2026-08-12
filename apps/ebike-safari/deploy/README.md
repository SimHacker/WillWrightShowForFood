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

```
Mac:  git push origin main
VM:   sudo bash scripts/server-deploy.sh
```

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

`.env` is gitignored.

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
sudo bash deploy/scripts/server-deploy.sh
```

Demo data is baked into the image for local builds only; production requires `deploy/data/manifest.json` on the host.

## 7. Postgres smoke test

PostGIS initializes from `db/init/` on first boot.

```bash
docker compose exec db psql -U ebike -d ebike_safari -c "SELECT PostGIS_Version();"
```

Import rides from the host (needs Python + psycopg2 on VM, or run one-off container later):

```bash
cd ../..
pip install psycopg2-binary
DATABASE_URL="postgresql://ebike:YOUR_PASSWORD@localhost:5432/ebike_safari" \
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

On the VM after `git push` from your Mac:

```bash
sudo bash /opt/WillWrightShowForFood/apps/ebike-safari/deploy/scripts/server-deploy.sh
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Caddy no cert | DNS not pointing at VM yet; check `dig ebike-safari.com` |
| 502 from Caddy | `docker compose logs viewer` — build or ORIGIN mismatch |
| Empty map | Copy ride data to `deploy/data/` and restart viewer |
| Postgres reset | `docker compose down -v` wipes `pgdata` (destructive) |

↑ [`../design/runbooks/03-postgres-postgis.md`](../design/runbooks/03-postgres-postgis.md)
