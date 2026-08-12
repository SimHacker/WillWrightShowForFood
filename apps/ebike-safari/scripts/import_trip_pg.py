#!/usr/bin/env python3
"""Import web/data trip JSON into Postgres (PostGIS).

Reads manifest + trips/*.geojson, *.series.json, *.meta.json and upserts
into rides + ride_points tables (see db/init/002_schema.sql).

Usage:
  python import_trip_pg.py --data-dir ../demo/web/data
  python import_trip_pg.py --data-dir ../demo/web/data --trip demo-loop
  DATABASE_URL=postgresql://localhost/ebike_safari python import_trip_pg.py ...

Requires: psycopg2, PostGIS
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("Install psycopg2: pip install psycopg2-binary", file=sys.stderr)
    sys.exit(1)


KNOWN_POINT_KEYS = frozenset(
    {"t", "lat", "lon", "alt_m", "speed_kmh", "power_w", "cadence_rpm", "distance_m"}
)


def point_extras(point: dict) -> dict:
    return {k: v for k, v in point.items() if k not in KNOWN_POINT_KEYS}


def line_wkt(coords: list[list[float]]) -> str:
    parts = [f"{lon} {lat}" for lon, lat in coords]
    return f"LINESTRING({', '.join(parts)})"


def envelope_wkt(bounds: list[float]) -> str:
    min_lon, min_lat, max_lon, max_lat = bounds
    return (
        f"POLYGON(({min_lon} {min_lat}, {max_lon} {min_lat}, "
        f"{max_lon} {max_lat}, {min_lon} {max_lat}, {min_lon} {min_lat}))"
    )


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def import_trip(conn, data_dir: Path, trip_id: str | None) -> list[str]:
    manifest = load_json(data_dir / "manifest.json")
    trips = manifest.get("trips") or []
    if trip_id:
        trips = [t for t in trips if t["id"] == trip_id]
        if not trips:
            raise SystemExit(f"Trip not found in manifest: {trip_id}")

    imported: list[str] = []
    with conn.cursor() as cur:
        for trip in trips:
            tid = trip["id"]
            geo_path = data_dir / trip["geojson"]
            series_path = data_dir / trip["series"]
            meta_path = data_dir / trip.get("meta") or f"trips/{tid}.meta.json"

            geo = load_json(geo_path)
            series = load_json(series_path)
            meta = load_json(meta_path) if meta_path.exists() else {}

            feature = geo["features"][0]
            coords = feature["geometry"]["coordinates"]
            if not coords:
                print(f"skip {tid}: empty geometry", file=sys.stderr)
                continue

            bounds = trip.get("bounds") or meta.get("bounds")
            started = trip.get("started_at") or meta.get("started_at")
            if not started:
                raise SystemExit(f"Trip {tid} missing started_at")

            distance_km = trip.get("distance_km") or meta.get("distance_km")
            duration_min = trip.get("duration_min") or meta.get("duration_min")
            distance_m = float(distance_km) * 1000 if distance_km else None
            duration_s = float(duration_min) * 60 if duration_min else None

            path_wkt = line_wkt(coords)
            bounds_wkt = envelope_wkt(bounds) if bounds else None

            source_format = (
                meta.get("source_format") or trip.get("source_format") or "fit"
            )
            source_uri = trip.get("source_fit") or meta.get("source_fit")

            cur.execute(
                """
                INSERT INTO rides (
                    id, title, started_at, distance_m, duration_s,
                    source_fit, source_format, source_uri,
                    bounds, path, meta
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s,
                    CASE WHEN %s IS NULL THEN NULL
                         ELSE ST_SetSRID(ST_GeomFromText(%s), 4326) END,
                    ST_SetSRID(ST_GeomFromText(%s), 4326),
                    %s::jsonb
                )
                ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    started_at = EXCLUDED.started_at,
                    distance_m = EXCLUDED.distance_m,
                    duration_s = EXCLUDED.duration_s,
                    source_fit = EXCLUDED.source_fit,
                    source_format = EXCLUDED.source_format,
                    source_uri = EXCLUDED.source_uri,
                    bounds = EXCLUDED.bounds,
                    path = EXCLUDED.path,
                    meta = EXCLUDED.meta
                """,
                (
                    tid,
                    trip.get("title") or meta.get("title") or tid,
                    started,
                    distance_m,
                    duration_s,
                    source_uri,
                    source_format,
                    source_uri,
                    bounds_wkt,
                    bounds_wkt,
                    path_wkt,
                    json.dumps(meta),
                ),
            )

            cur.execute("DELETE FROM ride_points WHERE ride_id = %s", (tid,))

            points = series.get("points") or []
            rows = []
            for seq, p in enumerate(points):
                extras = point_extras(p)
                rows.append(
                    (
                        tid,
                        seq,
                        p["t"],
                        p["lon"],
                        p["lat"],
                        p.get("alt_m"),
                        p.get("speed_kmh"),
                        p.get("power_w"),
                        p.get("cadence_rpm"),
                        p.get("distance_m"),
                        json.dumps(extras),
                    )
                )

            if rows:
                psycopg2.extras.execute_values(
                    cur,
                    """
                    INSERT INTO ride_points (
                        ride_id, seq, recorded_at, geom,
                        alt_m, speed_kmh, power_w, cadence_rpm, distance_m, extras
                    ) VALUES %s
                    """,
                    rows,
                    template="""(
                        %s, %s, %s::timestamptz,
                        ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                        %s, %s, %s, %s, %s, %s::jsonb
                    )""",
                )

            imported.append(tid)
            print(f"imported {tid}: {len(rows)} points, {len(coords)} line vertices")

    conn.commit()
    return imported


def main() -> None:
    parser = argparse.ArgumentParser(description="Import trips into PostGIS")
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path(__file__).resolve().parent.parent / "demo" / "web" / "data",
        help="Directory containing manifest.json and trips/",
    )
    parser.add_argument("--trip", help="Import single trip id (default: all in manifest)")
    parser.add_argument(
        "--database-url",
        default=os.environ.get("DATABASE_URL", "postgresql://localhost/ebike_safari"),
    )
    args = parser.parse_args()

    data_dir = args.data_dir.resolve()
    if not (data_dir / "manifest.json").exists():
        raise SystemExit(f"No manifest.json in {data_dir}")

    conn = psycopg2.connect(args.database_url)
    try:
        imported = import_trip(conn, data_dir, args.trip)
    finally:
        conn.close()

    if not imported:
        raise SystemExit("Nothing imported")
    print(f"Done: {', '.join(imported)}")


if __name__ == "__main__":
    main()
