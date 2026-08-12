#!/usr/bin/env python3
"""Import filtered OSM ways PBF into PostGIS osm_ways via osmium export.

Usage:
  python3 scripts/osm/import_osm_ways.py --region nl
  DATABASE_URL=postgresql://... python3 scripts/osm/import_osm_ways.py --region california
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

try:
    import psycopg2
    import psycopg2.extras
except ImportError as exc:
    print(f"Missing dependency: {exc}", file=sys.stderr)
    sys.exit(1)


def linestring_wkt(coords: list[list[float]]) -> str | None:
    if len(coords) < 2:
        return None
    parts = ", ".join(f"{lon} {lat}" for lon, lat in coords)
    return f"LINESTRING({parts})"


def import_geojsonseq(path: Path, region: str, conn) -> int:
    count = 0
    batch: list[tuple] = []
    batch_size = 5000

    def flush() -> None:
        nonlocal batch
        if not batch:
            return
        with conn.cursor() as cur:
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
                batch,
                page_size=1000,
            )
        conn.commit()
        batch = []

    with path.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            feat = json.loads(line)
            props = feat.get("properties") or {}
            osm_id = props.get("id") or props.get("@id")
            if osm_id is None:
                continue
            geom = feat.get("geometry") or {}
            if geom.get("type") != "LineString":
                continue
            wkt = linestring_wkt(geom.get("coordinates") or [])
            if not wkt:
                continue
            tags = {k: v for k, v in props.items() if not str(k).startswith("@")}
            batch.append((int(osm_id), region, json.dumps(tags), wkt))
            count += 1
            if count % 100_000 == 0:
                print(f"  … {count:,} ways", flush=True)
            if len(batch) >= batch_size:
                flush()
    flush()
    return count


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--region", required=True, choices=["nl", "california"])
    parser.add_argument("--pbf", type=Path)
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

    with tempfile.TemporaryDirectory() as tmp:
        seq = Path(tmp) / "ways.geojsonseq"
        print(f"Export {pbf} → geojson seq…")
        subprocess.run(
            [
                "osmium",
                "export",
                str(pbf),
                "-o",
                str(seq),
                "-f",
                "geojsonseq",
                "--geometry-types",
                "linestring",
                "--attributes",
                "id",
            ],
            check=True,
        )
        print(f"Import → osm_ways (region={args.region})")
        conn = psycopg2.connect(db_url)
        count = import_geojsonseq(seq, args.region, conn)
        conn.close()
        print(f"Imported {count} ways")


if __name__ == "__main__":
    main()
