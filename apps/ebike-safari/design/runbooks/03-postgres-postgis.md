# Runbook 03 — Postgres + PostGIS

**Goal:** Local Postgres with geo extensions for ride storage, map-matching, isochrones later.  
**Design:** [`../git-postgres-sync.md`](../git-postgres-sync.md) — Git YAML remains source of truth; Postgres is hot query plane.

## Prerequisites

- PostgreSQL 15+ (16 recommended)
- Superuser or role that can `CREATE EXTENSION`

## Create database

```bash
createdb ebike_safari
psql ebike_safari -f apps/ebike-safari/db/init/001_extensions.sql
psql ebike_safari -f apps/ebike-safari/db/init/002_schema.sql
```

Or as postgres superuser if extensions need it:

```bash
psql -d ebike_safari <<'SQL'
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;  -- optional, for graph work later
SQL
```

## Verify PostGIS

```sql
SELECT PostGIS_Version();
SELECT ST_AsText(ST_MakePoint(4.789, 52.333)::geography);
```

## Connection string (local dev)

```bash
export DATABASE_URL="postgresql://localhost/ebike_safari"
# or postgresql://user:pass@localhost:5432/ebike_safari
```

Viewer v0 does **not** require Postgres — static JSON only. Postgres enters when:

- [`skeleton/road-graph.md`](../skeleton/road-graph.md) — snap GPS to OSM ways
- [`skeleton/territory-layer.md`](../skeleton/territory-layer.md) — smell diffusion on edges
- Git ↔ PG sync action ([`git-postgres-sync.md`](../git-postgres-sync.md))

## Optional extensions (later)

| Extension | Use |
|-----------|-----|
| `pgvector` | embed_full / embed_sim from yaml-jazz |
| `h3` | hex territory buckets |
| `timescaledb` | ride event time series at scale |

## Import one ride from pipeline (manual smoke)

```bash
python scripts/import_trip_pg.py --data-dir demo/web/data
psql ebike_safari -c "SELECT id, ST_NPoints(path) FROM rides;"
```

Future: wire into `pipeline.py --postgres` flag.

↑ [`README.md`](README.md)
