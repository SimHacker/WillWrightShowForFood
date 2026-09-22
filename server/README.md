# The box

The server is cattle. The disk is a pet. This directory is what makes that true, and this page is
the runbook for acting on it.

| File | What it is |
|---|---|
| [`MANIFEST.yml`](MANIFEST.yml) | Everything a box is made of: apt packages, docker, node, firewall, disk |
| [`CHECKOUTS.md`](CHECKOUTS.md) | Deploy clone vs model clone vs simulate clone. Same repo, different rules |
| `../scripts/server-setup.sh` | Converges a machine onto the manifest. Idempotent — run it whenever you want to know the box is right |
| `../scripts/server-deploy.sh` | Pull, build and deploy named apps. Nothing deploys unless you name it |
| `../scripts/reload-ingress.sh` | Validate and gracefully reload Caddy, with no downtime |

## Bring up a replacement server

Roughly ten minutes, most of it apt. Step 2 is not optional: without the disk, step 3 stops and step
5 refuses, on purpose.

```bash
# 1. From your laptop: make the VM. Idempotent — it skips anything that already exists.
bash apps/ebike-safari/deploy/scripts/provision-server.sh

# 2. Attach the pet disk. --device-name=data is what puts it at the manifest's device_hint.
gcloud compute instances attach-disk ebike-safari-1 \
  --disk=wwsff-data --device-name=data \
  --zone=europe-west4-a --project=ebike-safari

# 3. On the box: clone, then converge onto the manifest. Mounts /data, never formats a disk that
#    already has a filesystem, and links .env out of /data/secrets.
gcloud compute ssh ebike-safari-1 --zone=europe-west4-a --project=ebike-safari
sudo git clone --depth 1 https://github.com/SimHacker/WillWrightShowForFood.git /opt/WillWrightShowForFood
cd /opt/WillWrightShowForFood
sudo bash scripts/server-setup.sh

# 4. Only for a genuinely new disk — an existing one already carries the secret, and step 3
#    symlinked the checkout at it.
sudo test -f /data/secrets/ebike-safari.env || {
  sudo cp apps/ebike-safari/deploy/.env.example /data/secrets/ebike-safari.env
  sudo chmod 600 /data/secrets/ebike-safari.env
  sudo "${EDITOR:-nano}" /data/secrets/ebike-safari.env  # DOMAIN, ACME_EMAIL, POSTGRES_PASSWORD, MAPBOX_TOKEN
  sudo bash scripts/server-setup.sh --only disk          # make the symlink
}

# 5. Deploy.
sudo bash scripts/server-deploy.sh hyperties ebike-safari
```

The database, the certificates and the rides are already on the disk, so this is a rebuild, not a
restore — nothing is re-issued and nothing is re-imported.

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

## What is on the pet disk

All of it. `wwsff-data`, 100GB pd-balanced, mounted at `/data`, attached with `--device-name=data`.
The rule is not "the important things" — it is that **if deleting the VM would lose it, it is on
`/data`**, and anything left on the boot disk must be reconstructible from git plus `MANIFEST.yml`.

| On `/data` — survives the VM | | On the boot disk — destroyed, correctly |
|---|---|---|
| `postgres` | the database, 3.7G | docker images (a deploy rebuilds them) |
| `caddy/data` | ACME account key + 8 certs | `node_modules` (pnpm, from the lockfile) |
| `caddy/config` | Caddy's autosaved JSON | `apps/*/build`, `.svelte-kit` (a build) |
| `releases` | per-commit builds, `current` symlink | the repo checkout (the `repo` phase) |
| `ebike-safari/rides` | ride GeoJSON; no other copy | |
| `ebike-safari/osm` | OSM extracts, 3.7G | |
| `secrets` | `.env`, mode 600, symlinked into the checkout | |
| `models/` | **not yet** — working trees that *are* a site. See [`CHECKOUTS.md`](CHECKOUTS.md) | |

Two of those rows are why this is not merely tidy. The certificate directory bites first: rebuilding
without it re-issues eight certificates, and Let's Encrypt allows 5 duplicates per week, so a
*second* rebuild inside one week fails and the sites go down on TLS with nothing to do but wait out
the window. The rides are the unrecoverable row — they are not in git and there is no second copy.

There are no docker named volumes anywhere in the compose file, deliberately. A named volume lands
in `/var/lib/docker` on the boot disk, which reads as persistent because it survives a restart, and
is not, because it does not survive the instance.

### Both scripts stop rather than improvise

`server-setup.sh` exits if there is no disk at the manifest's `device_hint`, and `server-deploy.sh`
refuses unless `/data` is a mount point. An earlier version of the setup script printed a warning and
used the boot disk, which is exactly how this manifest came to describe a pet disk that had never
been created while the database sat on cattle for five weeks. A warning in a log nobody reads is not
a safeguard. Override deliberately with `NO_DISK=1` or an explicit `DATA_ROOT`.

### Snapshots

`wwsff-data-daily` — daily at 03:00, 14 days retention, `--on-source-disk-delete=keep-auto-snapshots`,
attached to both disks. Before 2026-09-21 the project had **zero** snapshots, which meant the single
copy of the database was also the only copy.

```bash
# On demand, before anything risky:
gcloud compute snapshots create wwsff-data-$(date +%Y%m%d-%H%M) \
  --source-disk=wwsff-data --source-disk-zone=europe-west4-a --project=ebike-safari

# Restore: build a disk from a snapshot, attach it as `data`, converge, deploy.
gcloud compute disks create wwsff-data-restored --source-snapshot=<snap> \
  --type=pd-balanced --zone=europe-west4-a --project=ebike-safari
```

A snapshot of a running postgres is crash-consistent, not clean — it restores the way a power cut
would, which postgres recovers from via WAL replay. Good enough for a daily; take a `pg_dump` before
a migration.

## Things the box needs that are not packages

- **The data disk, attached as `data`.** It exists (`wwsff-data`); this is only for a new server:
  `gcloud compute instances attach-disk <vm> --disk=wwsff-data --device-name=data
  --zone=europe-west4-a --project=ebike-safari`. The `--device-name` is what makes it appear at the
  manifest's `device_hint`. The script mounts an existing filesystem and **never** formats one, so
  re-attaching the old disk to a new server is safe by construction.
- **DNS pointing at the static IP.** `provision-server.sh` sets `ebike-safari.com` and `www`. The six
  hyperties names are managed by hand today; each needs an A record before Caddy can pass an ACME
  challenge, and a missing one is the usual cause of a single site failing to get a certificate.
- **`.env`**, mode 600, never in git. It lives at `/data/secrets/ebike-safari.env` and the checkout
  symlinks to it, so a reclone cannot lose it. Referenced by compose for `POSTGRES_PASSWORD`,
  `ACME_EMAIL`, `DOMAIN` and `MAPBOX_TOKEN`.

## The old named volumes

`deploy_pgdata`, `deploy_caddy_data` and `deploy_caddy_config` still exist on the boot disk, holding
the state as it was at the moment of the move. Nothing mounts them. They are the rollback, so leave
them until the `/data` copies have a week of daily snapshots behind them, then:

```bash
sudo docker volume rm deploy_pgdata deploy_caddy_data deploy_caddy_config
```
