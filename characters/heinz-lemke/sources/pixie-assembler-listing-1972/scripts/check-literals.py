#!/usr/bin/env python3
"""Check numeric literal operands against the literal pool.

For every line `addr/ word  [LABEL,] OP [I] (VALUE` with an octal VALUE,
the pool word at the instruction's address field must hold VALUE. A pool
word that disagrees with all its users suggests the pool is misread; one
user that disagrees with the rest suggests the instruction is.

usage: check-literals.py [symelec-listing.txt] [symelec-literals.oct]
"""
import re
import sys
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).parent.parent
LINE = re.compile(r"^\s*\d*\s+([0-7]{4,5})/\s+([0-7]{1,6})\s+(?:[A-Z][A-Z0-9]*,\s+)?([A-Z]{3})\s+(I\s+)?\((-?[0-7]+)\s*(?:/.*)?$")


def main() -> int:
    listing = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "symelec-listing.txt"
    pool_path = Path(sys.argv[2]) if len(sys.argv) > 2 else HERE / "symelec-literals.oct"
    pool = {}
    for text in pool_path.read_text().splitlines():
        p = text.split()
        if len(p) == 2 and not text.startswith("#"):
            pool[int(p[0], 8)] = int(p[1], 8)
    uses = defaultdict(list)
    for n, text in enumerate(listing.read_text().splitlines(), 1):
        m = LINE.match(text)
        if not m:
            continue
        addr, word, op, _, lit = m.groups()
        value = int(lit, 8) & 0o777777 if not lit.startswith("-") else (-int(lit[1:], 8)) & 0o777777
        uses[int(word, 8) & 0o17777].append((n, addr, int(word, 8), op, value))
    bad = 0
    for target, users in sorted(uses.items()):
        held = pool.get(target)
        for n, addr, word, op, value in users:
            if held != value:
                bad += 1
                others = sorted({f"{v:o}" for *_, v in users})
                where = [a for a, v in pool.items() if v == value]
                hint = f"; ({value:o} is pooled at {', '.join(f'{a:o}' for a in where)})" if where else ""
                pooled = "missing" if held is None else f"{held:o}"
                print(f"line {n}: {addr}/ {word:06o} {op} ({value:o} -> pool {target:o} holds {pooled}; users want {others}{hint}")
    print(f"{sum(map(len, uses.values()))} literal references checked, {bad} mismatches")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
