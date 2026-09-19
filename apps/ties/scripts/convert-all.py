#!/usr/bin/env python3
"""Rebuild examples/ from the 1988 archive. The corpus is DERIVED: regenerate, never hand-edit.

    python3 scripts/convert-all.py [--archive DIR]

doc/ is converted whole rather than split by subdirectory, because it had ONE master
index in 1988 and splitting it breaks links that crossed the split.
"""
import argparse
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE.parent
DEFAULT_ARCHIVE = Path.home() / "GroundUp/Leela/git/lloooomm-imports/ties"

# source subdir, output name, recurse into subdirectories
DATABASES = [
    ("newdb", "space-telescope", True),
    ("cookbook", "pie-menu-cookbook", True),
    ("doc", "news-hyperties-docs", True),
    ("global", "control-panel", False),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--archive", type=Path, default=DEFAULT_ARCHIVE)
    args = ap.parse_args()

    if not args.archive.is_dir():
        print(f"archive not found: {args.archive}", file=sys.stderr)
        return 1

    shared = args.archive / "global"
    out_root = APP / "examples"

    for src, name, recurse in DATABASES:
        cmd = [
            sys.executable,
            str(HERE / "st0_to_md.py"),
            str(args.archive / src),
            str(out_root / name),
            "--name",
            name,
        ]
        if not recurse:
            cmd.append("--flat")
        # control-panel IS the shared scope, so it does not also import it
        if src != "global":
            cmd += ["--global-dir", str(shared)]
        if (out_root / name).exists():
            subprocess.run(["rm", "-rf", str(out_root / name)], check=True)
        if subprocess.run(cmd).returncode:
            return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
