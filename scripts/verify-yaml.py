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


def should_scan_markdown(path: Path) -> bool:
    if any(p in SKIP_PARTS for p in path.parts):
        return False
    return path.suffix == ".md"


def check_frontmatter(path: Path) -> str | None:
    """Validate YAML frontmatter in a markdown file. Returns error string or None.

    A file opening with '---' must contain a well-formed frontmatter block:
    the delimiter immediately followed by YAML (no blank line), closed by a
    matching '---' line, and the block must parse as a YAML mapping. WYSIWYG
    markdown editors silently break this (blank lines, '## key:' headings,
    eaten closing delimiter) and GitHub then shows a parse error banner.
    """
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return None
    lines = text.split("\n")
    if len(lines) < 2 or lines[1].strip() == "":
        return "frontmatter: blank line after opening '---' (editor mangling?)"
    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
        if lines[i].startswith("#"):
            return f"frontmatter: markdown heading inside frontmatter at line {i + 1} (editor mangling?)"
    if end is None:
        return "frontmatter: opening '---' never closed by a matching '---' line"
    block = "\n".join(lines[1:end])
    try:
        data = yaml.safe_load(block)
    except Exception as exc:
        return f"frontmatter: {exc}"
    if data is not None and not isinstance(data, dict):
        return "frontmatter: parses but is not a mapping"
    return None


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
    md_count = 0
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file() or not in_scan_root(path):
            continue
        if should_scan(path):
            count += 1
            try:
                yaml.safe_load(path.read_text(encoding="utf-8"))
            except Exception as exc:
                errors.append(f"{path.relative_to(ROOT)}: {exc}")
        elif should_scan_markdown(path):
            md_count += 1
            err = check_frontmatter(path)
            if err:
                errors.append(f"{path.relative_to(ROOT)}: {err}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"YAML OK ({count} files, {md_count} markdown frontmatter)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
