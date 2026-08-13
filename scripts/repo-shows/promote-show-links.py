#!/usr/bin/env python3
"""Rewrite human-facing repo-show links: seed/SHOW/FLIPBOOK yml → README.md front page."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SHOWS = ROOT / "repo-shows"

SKIP_SHOW_DIRS = {"_TEMPLATE", "process"}


def show_front_pages() -> dict[str, set[str]]:
    """Map show dir name → yml basenames that are the public front-door spec."""
    out: dict[str, set[str]] = {}
    for d in SHOWS.iterdir():
        if not d.is_dir() or d.name in SKIP_SHOW_DIRS or d.name.startswith("."):
            continue
        names = {f"{d.name}.yml", "SHOW.yml", "FLIPBOOK.yml"}
        out[d.name] = names
    return out


FRONT = show_front_pages()

# repo-shows/foo/bar.yml  OR  ../foo/bar.yml  OR  full github blob paths
REPO_SHOWS = re.compile(
    r"(?P<prefix>(?:\.\./)*)(?:repo-shows/)?(?P<show>[a-z0-9-]+)/(?P<file>[a-z0-9A-Z_.-]+\.yml)"
)


def promote_path(show: str, file: str) -> str | None:
    if show not in FRONT:
        return None
    if file not in FRONT[show]:
        return None
    return "README.md"


def rewrite_text(text: str) -> tuple[str, int]:
    changes = 0

    def sub(m: re.Match[str]) -> str:
        nonlocal changes
        prefix = m.group("prefix") or ""
        show = m.group("show")
        file = m.group("file")
        new_file = promote_path(show, file)
        if not new_file:
            return m.group(0)
        # preserve repo-shows/ prefix if present in match
        full = m.group(0)
        if "repo-shows/" in full:
            repl = f"{prefix}repo-shows/{show}/{new_file}"
        else:
            repl = f"{prefix}{show}/{new_file}"
        if repl != full:
            changes += 1
        return repl

    return REPO_SHOWS.sub(sub, text), changes


def process_file(path: Path) -> int:
    if path.suffix not in {".md", ".mdc"}:
        return 0
    text = path.read_text(encoding="utf-8")
    new_text, n = rewrite_text(text)
    if n:
        path.write_text(new_text, encoding="utf-8")
    return n


def main() -> int:
    roots = [ROOT]
    moollm = ROOT.parent.parent / "Leela" / "git" / "moollm"
    if len(sys.argv) > 1:
        roots = [Path(p).resolve() for p in sys.argv[1:]]
    elif moollm.exists():
        roots.append(moollm)

    total = 0
    files_touched = 0
    for root in roots:
        for path in root.rglob("*"):
            if not path.is_file():
                continue
            if "node_modules" in path.parts or ".git" in path.parts:
                continue
            n = process_file(path)
            if n:
                print(f"{n:3d}  {path.relative_to(root)}")
                total += n
                files_touched += 1
    print(f"Done: {total} link(s) in {files_touched} file(s)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
