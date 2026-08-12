#!/usr/bin/env python3
"""Rebuild coverage GeoJSON (routes + heatmap) from existing trip assets."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from build_web_assets import build_coverage


def main() -> int:
    parser = argparse.ArgumentParser(description="Rebuild heatmap from trip JSON on disk")
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path("web/data"),
        help="Directory with manifest.json and trips/",
    )
    args = parser.parse_args()

    out_dir = args.data_dir.resolve()
    manifest_path = out_dir / "manifest.json"
    if not manifest_path.is_file():
        print(f"Missing {manifest_path}", file=sys.stderr)
        return 1

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    entries = manifest.get("trips") or []
    if not entries:
        print("No trips in manifest.", file=sys.stderr)
        return 1

    coverage = build_coverage(out_dir, entries)
    manifest["coverage"] = coverage
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(
        f"Rebuilt coverage: {coverage['cell_count']} heat cells, "
        f"{coverage['trip_count']} trips → {out_dir / 'coverage'}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
