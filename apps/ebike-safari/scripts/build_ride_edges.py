#!/usr/bin/env python3
"""Build high-level edge/event track for a ride by snapping GPS points to osm_ways.

v0: nearest way within tolerance (PostGIS). Valhalla map-match replaces this later.

Usage:
  DATABASE_URL=postgresql://... python3 scripts/build_ride_edges.py --ride-id demo-loop
  python3 scripts/build_ride_edges.py --ride-id my-ride --out deploy/data/trips/my-ride.edges.json

Output: ordered segments with osm_id, highway tag, duration estimate from point timestamps.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    print("Install psycopg2-binary", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ride-id", required=True)
    parser.add_argument("--tolerance-m", type=float, default=40.0)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()

    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        raise SystemExit("Set DATABASE_URL")

    conn = psycopg2.connect(db_url)
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(
            """
            SELECT seq, recorded_at, geom,
                   ST_X(geom) AS lon, ST_Y(geom) AS lat
            FROM ride_points
            WHERE ride_id = %s
            ORDER BY seq
            """,
            (args.ride_id,),
        )
        points = cur.fetchall()
        if not points:
            raise SystemExit(f"No ride_points for {args.ride_id}")

        events: list[dict] = []
        prev_way: int | None = None
        segment_start = 0

        for i, pt in enumerate(points):
            cur.execute(
                """
                SELECT w.osm_id, w.region, w.tags,
                       ST_Distance(w.geom::geography, %s::geography) AS dist_m
                FROM osm_ways w
                WHERE ST_DWithin(w.geom::geography, %s::geography, %s)
                ORDER BY dist_m
                LIMIT 1
                """,
                (pt["geom"], pt["geom"], args.tolerance_m),
            )
            hit = cur.fetchone()
            way_id = hit["osm_id"] if hit else None

            if way_id != prev_way and prev_way is not None:
                tags = events[-1]["tags"] if events else {}
                events.append(
                    {
                        "type": "way_segment",
                        "osm_id": prev_way,
                        "from_seq": segment_start,
                        "to_seq": i - 1,
                        "highway": (tags or {}).get("highway"),
                        "region": events[-1].get("region") if events else None,
                    }
                )
                segment_start = i

            if hit:
                prev_way = way_id
                if not events or events[-1].get("osm_id") != way_id:
                    events.append(
                        {
                            "type": "snap",
                            "seq": pt["seq"],
                            "osm_id": way_id,
                            "region": hit["region"],
                            "dist_m": round(float(hit["dist_m"]), 1),
                            "tags": dict(hit["tags"]),
                        }
                    )

        if prev_way is not None:
            events.append(
                {
                    "type": "way_segment",
                    "osm_id": prev_way,
                    "from_seq": segment_start,
                    "to_seq": len(points) - 1,
                }
            )

    out_doc = {
        "ride_id": args.ride_id,
        "matcher": "postgis_nearest",
        "tolerance_m": args.tolerance_m,
        "events": events,
    }

    text = json.dumps(out_doc, indent=2)
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(text + "\n", encoding="utf-8")
        print(f"Wrote {args.out}")
    else:
        print(text)


if __name__ == "__main__":
    main()
