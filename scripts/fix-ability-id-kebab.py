#!/usr/bin/env python3
"""
One-time migration: SCREAMING_SNAKE ability ids → SCREAMING-KEBAB (MOOLLM convention).
Updates characters/*/CARD.yml ability id fields and combos_with cross-refs.
Run: python3 scripts/fix-ability-id-kebab.py
"""

from __future__ import annotations

import re
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CHARS = REPO / "characters"

ID_LINE = re.compile(r"^(\s*- id: )([A-Z0-9_]+)\s*$")
COMBO_ITEM = re.compile(r"^(\s+- )([A-Z0-9_ -]+)\s*$")


def screaming_kebab(token: str) -> str:
    return token.replace("_", "-")


def fix_combo_line(line: str) -> str:
    m = COMBO_ITEM.match(line)
    if not m:
        return line
    prefix, value = m.group(1), m.group(2)
    if " " in value:
        word, rest = value.split(" ", 1)
        return f"{prefix}{screaming_kebab(word)} {rest}"
    return f"{prefix}{screaming_kebab(value)}"


def fix_card(path: Path) -> int:
    lines = path.read_text(encoding="utf-8").splitlines()
    changed = 0
    out: list[str] = []
    in_combos = False
    for line in lines:
        if line.strip() == "combos_with:":
            in_combos = True
            out.append(line)
            continue
        if in_combos:
            if line.startswith("  ") and not line.startswith("    ") and not line.lstrip().startswith("-"):
                in_combos = False
            elif re.match(r"^\s*- id:", line):
                in_combos = False
            elif line.lstrip().startswith("- "):
                new_line = fix_combo_line(line)
                if new_line != line:
                    changed += 1
                out.append(new_line)
                continue
            else:
                in_combos = False

        m = ID_LINE.match(line)
        if m:
            old_id = m.group(2)
            new_id = screaming_kebab(old_id)
            if new_id != old_id:
                changed += 1
            out.append(f"{m.group(1)}{new_id}")
            continue

        out.append(line)

    if changed:
        path.write_text("\n".join(out) + "\n", encoding="utf-8")
    return changed


def fix_scaffold(path: Path) -> int:
    text = path.read_text(encoding="utf-8")
    # A("FOO_BAR", ...) and combos=["WILL-FOO_BAR"]
    def repl_string(m: re.Match[str]) -> str:
        return m.group(0).replace("_", "-")

    new = re.sub(r'A\("[A-Z0-9_]+"', repl_string, text)
    new = re.sub(r'combos=\[[^\]]+\]', lambda m: m.group(0).replace("_", "-"), new)
    if new != text:
        path.write_text(new, encoding="utf-8")
        return 1
    return 0


def main() -> None:
    total = 0
    for card in sorted(CHARS.glob("*/CARD.yml")):
        n = fix_card(card)
        if n:
            print(f"  {card.relative_to(REPO)}: {n} changes")
            total += n
    scaffold = REPO / "scripts" / "scaffold-guest-skills-cards.py"
    if fix_scaffold(scaffold):
        print("  scripts/scaffold-guest-skills-cards.py: updated")
    print(f"Done. {total} field changes in CARD.yml files.")


if __name__ == "__main__":
    main()
