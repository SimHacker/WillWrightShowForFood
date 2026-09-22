# Secrets

One secret, one file, one owner. Factored by **what the secret is**, not by which app happens to
want it, and delivered to exactly the containers that need it.

```
/data/secrets/                          0700 root:root
  postgres/
    superuser.env                       POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB   -> db
    roles/
      ebike-safari.env                  PGHOST PGPORT PGDATABASE PGUSER PGPASSWORD    -> viewer
      hyperties.env                     PGHOST PGPORT PGDATABASE PGUSER PGPASSWORD    -> hyperties
      <app>.env                         one per app that talks to postgres
  mapbox/
    token.env                           MAPBOX_TOKEN                                  -> viewer
  acme/
    email.env                           ACME_EMAIL                                    -> caddy
```

The right-hand column is exhaustive. Each service lists the files it needs in `env_file:`, so
`docker compose config` is a complete, auditable map of who can read what:

| Service | Reads | Cannot read |
|---|---|---|
| `db` | `postgres/superuser.env` | the Mapbox token, any app role password, the ACME email |
| `viewer` | `postgres/roles/ebike-safari.env`, `mapbox/token.env` | **the postgres superuser password** |
| `hyperties` | `postgres/roles/hyperties.env` | the superuser password, the Mapbox token |
| `caddy` | `acme/email.env` | every credential in the system |

## A postgres account per container

The viewer used to connect as the superuser, which meant an RCE in a SvelteKit route was also
`DROP DATABASE`. Each app now gets its own login role with DML on the application tables and
nothing else: no superuser, no `CREATE`, no ability to read another app's future tables.

`scripts/provision-db-roles.sh` converges the roles onto the files in `postgres/roles/`. It is
idempotent, so it is also how you rotate a password: edit the file, re-run it, restart the app.

The superuser stays for migrations and `psql` from the host. It is deliberately *not* reachable
from any application container.

## Why files and not one .env

There used to be a single `.env` holding every secret, auto-loaded by compose and interpolated into
the compose file. Two problems, both structural:

1. **Everything in it reached every service.** `${POSTGRES_PASSWORD}` interpolated into a
   `DATABASE_URL` for the viewer was the superuser password, sitting in the viewer's environment
   where `docker inspect` and `/proc/1/environ` could read it.
2. **Adding a service meant editing the one file every service reads.** The blast radius of a typo
   was the whole stack, and the file's contents were the union of every app's needs forever.

Per-secret files invert both: a service that does not name a file cannot see it, and a new app adds
a file of its own without touching anyone else's.

## Rotating

```bash
sudoedit /data/secrets/mapbox/token.env                 # or postgres/roles/<app>.env
sudo bash scripts/provision-db-roles.sh                 # only for postgres role changes
sudo docker compose -f apps/ebike-safari/deploy/docker-compose.yml up -d --no-deps viewer
```

Nothing is baked into an image, so rotation is a restart of the one service that holds it. Values
are not in git and never will be; `.env.example` documents the *names*.

## Creating them on a new disk

A genuinely new disk has an empty `secrets/`. `server-setup.sh` creates the tree with mode 0700 and
lists what is missing. Generate passwords rather than choosing them:

```bash
sudo install -d -m 700 /data/secrets/postgres/roles /data/secrets/mapbox /data/secrets/acme

# Superuser, db container only.
printf 'POSTGRES_USER=ebike\nPOSTGRES_PASSWORD=%s\nPOSTGRES_DB=ebike_safari\n' \
  "$(openssl rand -base64 33 | tr -d /+=)" | sudo tee /data/secrets/postgres/superuser.env >/dev/null

# One role per app. PGHOST is the compose service name; postgres.js reads all of these natively.
printf 'PGHOST=db\nPGPORT=5432\nPGDATABASE=ebike_safari\nPGUSER=ebike_safari_app\nPGPASSWORD=%s\n' \
  "$(openssl rand -base64 33 | tr -d /+=)" \
  | sudo tee /data/secrets/postgres/roles/ebike-safari.env >/dev/null

printf 'MAPBOX_TOKEN=pk.…\n'        | sudo tee /data/secrets/mapbox/token.env >/dev/null
printf 'ACME_EMAIL=you@example.com\n' | sudo tee /data/secrets/acme/email.env >/dev/null

sudo chmod 600 /data/secrets/*/*.env /data/secrets/*/*/*.env
sudo bash scripts/provision-db-roles.sh
```

Changing the superuser password in that file after the database exists does **not** change it in
postgres — the image only reads it at `initdb`. Use `ALTER ROLE` and edit the file to match.

## The shape generalises

The same factoring applies to any shared non-secret data: it lives in one place under `/data`, at
one path, mounted `:ro` by every consumer and `:rw` by exactly one producer. `/data/releases` is
that pattern for static builds. Secrets are the case where the mount list is also the threat model.
