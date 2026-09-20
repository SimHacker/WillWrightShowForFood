# The box

The server is cattle. The disk is a pet. This directory is what makes that true, and this page is
the runbook for acting on it.

| File | What it is |
|---|---|
| [`MANIFEST.yml`](MANIFEST.yml) | Everything a box is made of: apt packages, docker, node, firewall, disk |
| `../scripts/server-setup.sh` | Converges a machine onto the manifest. Idempotent — run it whenever you want to know the box is right |
| `../scripts/server-deploy.sh` | Pull, build and deploy named apps. Nothing deploys unless you name it |
| `../scripts/reload-ingress.sh` | Validate and gracefully reload Caddy, with no downtime |

## Bring up a replacement server

Roughly ten minutes, most of it apt. Step 2 is skippable and the setup script says so out loud —
with no data disk it puts releases on the boot disk and warns, rather than failing.

```bash
# 1. From your laptop: make the VM. Idempotent — it skips anything that already exists.
bash apps/ebike-safari/deploy/scripts/provision-server.sh

# 2. Attach the pet disk, if it is not already attached.
gcloud compute instances attach-disk ebike-safari-1 \
  --disk=wwsff-data --device-name=wwsff-data \
  --zone=europe-west4-a --project=ebike-safari

# 3. On the box: clone, then converge onto the manifest.
gcloud compute ssh ebike-safari-1 --zone=europe-west4-a --project=ebike-safari
sudo git clone --depth 1 https://github.com/SimHacker/WillWrightShowForFood.git /opt/WillWrightShowForFood
cd /opt/WillWrightShowForFood
sudo bash scripts/server-setup.sh

# 4. Secrets are not in git and never will be. One file, mode 600.
sudo cp apps/ebike-safari/deploy/.env.example apps/ebike-safari/deploy/.env
sudo chmod 600 apps/ebike-safari/deploy/.env
sudo "${EDITOR:-nano}" apps/ebike-safari/deploy/.env   # DOMAIN, ACME_EMAIL, POSTGRES_PASSWORD, MAPBOX_TOKEN

# 5. Deploy.
sudo bash scripts/server-deploy.sh hyperties ebike-safari
```

Check it before trusting it:

```bash
sudo bash scripts/server-setup.sh --dry-run    # should report almost nothing to do
curl -sI https://hyperties.org | head -1
curl -s https://ebike-safari.com/api/health
```

## Why a manifest and an idempotent script, rather than notes

The three scripts that came before this each installed some of the box, and two of them installed
docker and ufw *separately* — `vm-bootstrap.sh` and `server-install.sh` had already drifted, one
opening `443/tcp` only while Caddy advertises HTTP/3 on `443/udp`. A package list buried in an
`apt-get install -y` line is not reviewable, and a setup step that only runs on a fresh box is a
step nobody can verify later.

So: the list lives in YAML where it can be read and argued with, and the script converges rather
than installs. The second run prints "already" and changes nothing, which is what makes it the
answer to *is this box set up correctly* and not merely to *set this box up*.

`vm-bootstrap.sh` and the setup half of `server-install.sh` are superseded. `provision-server.sh`
stays — it builds GCP objects from a laptop, which is a different job.

## What is on the pet disk, and what is still wrongly on the cattle

Being blunt, because the gap matters more than the plan. **As of 2026-09-20 there is no pet disk at
all** — `ebike-safari-1` has one 100G boot disk, so everything below is on the cattle:

| Thing | Where it lives | If you delete the VM today |
|---|---|---|
| App releases | `/srv/wwsff/<app>/releases`, **boot disk** until a data disk is attached | **Destroyed** (rebuildable from git) |
| Postgres data | docker volume `pgdata`, **boot disk** | **Destroyed** |
| Caddy certificates + ACME account key | docker volume `caddy_data`, **boot disk** | **Destroyed** |
| Repo checkout, images, node | boot disk | Destroyed, and correctly so — the manifest rebuilds them |

Releases are the least alarming row: they are a build of a known commit, so losing them costs one
deploy. The other two are the real exposure, and the certificate volume is the one that bites first.
Rebuilding forces re-issuance of six certificates, and Let's Encrypt allows 5 duplicate
certificates per week — so a *second* rebuild inside one week fails and the sites go down on TLS
rather than on anything you did wrong. Postgres is lower stakes today (a users table and a seed)
and becomes the more serious of the two the moment real accounts exist.

### Moving the database and certificates onto the pet disk

The change is small — named volumes become bind mounts under `/srv/wwsff` — but it moves live data,
so it is written down rather than done quietly. Do it in one sitting, with the stack down.

```bash
cd /opt/WillWrightShowForFood/apps/ebike-safari/deploy
sudo mkdir -p /srv/wwsff/{pgdata,caddy/data,caddy/config}

# Stop, so nothing is mid-write. Both sites are down for the duration.
sudo docker compose down

# Copy each volume's contents out, preserving ownership — postgres cares, Caddy cares about mode.
for v in pgdata caddy_data caddy_config; do
  sudo docker run --rm -v "deploy_${v}:/from" -v /srv/wwsff:/to alpine \
    sh -c "cd /from && cp -a . /to/$(echo $v | sed 's/caddy_/caddy\//;s/^pgdata$/pgdata/')"
done

# Then change docker-compose.yml: replace the three named volumes with
#   - /srv/wwsff/pgdata:/var/lib/postgresql/data
#   - /srv/wwsff/caddy/data:/data
#   - /srv/wwsff/caddy/config:/config
# and delete the `volumes:` block at the bottom.

sudo docker compose up -d
sudo docker compose logs --tail 20 db caddy   # expect no permission errors
```

Verify the certificates came across rather than being re-issued — the ACME account key is the file
that matters:

```bash
sudo ls /srv/wwsff/caddy/data/caddy/certificates/*/hyperties.org/
curl -sI https://hyperties.org | head -1
```

Keep the old named volumes for a week before `docker volume rm`, because that is the only rollback.

## Things the box needs that are not packages

- **A data disk that exists.** `gcloud compute disks create wwsff-data --size=50GB --type=pd-balanced
  --zone=europe-west4-a --project=ebike-safari`, then attach with `--device-name=wwsff-data` so it
  appears at the manifest's `device_hint`. The script mounts an existing filesystem and **never**
  formats one, so re-attaching an old disk to a new server is safe by construction.
- **DNS pointing at the static IP.** `provision-server.sh` sets `ebike-safari.com` and `www`. The six
  hyperties names are managed by hand today; each needs an A record before Caddy can pass an ACME
  challenge, and a missing one is the usual cause of a single site failing to get a certificate.
- **`.env`**, mode 600, never in git. Referenced by compose for `POSTGRES_PASSWORD`, `ACME_EMAIL`,
  `DOMAIN` and `MAPBOX_TOKEN`.
