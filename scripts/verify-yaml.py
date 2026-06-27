#!/usr/bin/env python3
"""Parse-check YAML under MOOLLM content dirs. Exit 1 on first batch of errors."""

from __future__ import annotations

import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
SCAN_ROOTS = [
    ROOT / "repo-shows",
    ROOT / "characters",
    ROOT / "schemas",
    ROOT / "process",
    ROOT / "kernel",
    ROOT,  # root MOOLLM.yml, CARD.yml, etc.
]
SKIP_PARTS = {".git", "node_modules", ".venv"}


def should_scan(path: Path) -> bool:
    if any(p in SKIP_PARTS for p in path.parts):
        return False
    return path.suffix in {".yml", ".yaml"}


def in_scan_root(path: Path) -> bool:
    for root in SCAN_ROOTS:
        try:
            path.relative_to(root)
            return True
        except ValueError:
            continue
    return False


def main() -> int:
    errors: list[str] = []
    count = 0
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file() or not should_scan(path) or not in_scan_root(path):
            continue
        count += 1
        try:
            yaml.safe_load(path.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"{path.relative_to(ROOT)}: {exc}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"YAML OK ({count} files)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
