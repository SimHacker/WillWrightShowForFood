#!/usr/bin/env python3
"""Import filtered OSM ways PBF into PostGIS osm_ways (region column).

Usage:
  python3 scripts/osm/import_osm_ways.py --region nl
  DATABASE_URL=postgresql://... python3 scripts/osm/import_osm_ways.py --region california

Requires: python3-osmium, psycopg2 (Debian packages in osm-tools image).
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

try:
    import osmium
    import psycopg2
    import psycopg2.extras
except ImportError as exc:
    print(f"Missing dependency: {exc}", file=sys.stderr)
    sys.exit(1)


class WayHandler(osmium.SimpleHandler):
    def __init__(self, region: str, batch_size: int = 5000):
        super().__init__()
        self.region = region
        self.batch_size = batch_size
        self.batch: list[tuple] = []
        self.count = 0
        self.conn = None

    def set_conn(self, conn) -> None:
        self.conn = conn

    def flush(self) -> None:
        if not self.batch or self.conn is None:
            return
        with self.conn.cursor() as cur:
            psycopg2.extras.execute_batch(
                cur,
                """
                INSERT INTO osm_ways (osm_id, region, tags, geom)
                VALUES (%s, %s, %s, ST_SetSRID(ST_GeomFromText(%s), 4326))
                ON CONFLICT (osm_id) DO UPDATE SET
                    region = EXCLUDED.region,
                    tags = EXCLUDED.tags,
                    geom = EXCLUDED.geom,
                    updated_at = now()
                """,
                self.batch,
                page_size=1000,
            )
        self.conn.commit()
        self.batch.clear()

    def way(self, w: osmium.osm.Way) -> None:
        if len(w.nodes) < 2:
            return
        coords = []
        for n in w.nodes:
            if not n.location.valid():
                return
            coords.append((n.lon, n.lat))
        if len(coords) < 2:
            return
        parts = ", ".join(f"{lon} {lat}" for lon, lat in coords)
        wkt = f"LINESTRING({parts})"
        tags = {k: v for k, v in w.tags}
        self.batch.append((w.id, self.region, json.dumps(tags), wkt))
        self.count += 1
        if len(self.batch) >= self.batch_size:
            self.flush()

    def close(self) -> None:
        self.flush()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--region", required=True, choices=["nl", "california"])
    parser.add_argument(
        "--pbf",
        type=Path,
        help="Override filtered PBF path",
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path(os.environ.get("OSM_DATA_DIR", "deploy/osm")),
    )
    args = parser.parse_args()

    pbf = args.pbf or (args.data_dir / "filtered" / f"{args.region}-ways.osm.pbf")
    if not pbf.is_file():
        raise SystemExit(f"Missing {pbf} — run filter.sh {args.region}")

    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        raise SystemExit("Set DATABASE_URL")

    print(f"Import {pbf} → osm_ways (region={args.region})")
    conn = psycopg2.connect(db_url)
    handler = WayHandler(args.region)
    handler.set_conn(conn)
    handler.apply_file(str(pbf), locations=True)
    handler.close()
    conn.close()
    print(f"Imported {handler.count} ways")


if __name__ == "__main__":
    main()
