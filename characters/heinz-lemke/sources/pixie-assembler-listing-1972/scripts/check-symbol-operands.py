#!/usr/bin/env python3
"""Check memory-reference address fields against the listing's symbol table.

For every line `addr/ word  [LABEL,] OP [I] SYM[+-n]` whose OP is a PDP-7
memory-reference instruction, the low 13 bits of `word` must equal SYM+n.
MACRO-7 also writes `SYM n` for SYM+n. Operands that are literals, `.`, or
expressions this parser does not understand are skipped, not guessed at.

usage: check-symbol-operands.py [symelec-listing.txt]
"""
import re
import sys
from pathlib import Path

MEMREF = {
    "CAL": 0o00, "DAC": 0o04, "JMS": 0o10, "DZM": 0o14, "LAC": 0o20,
    "XOR": 0o24, "ADD": 0o30, "TAD": 0o34, "XCT": 0o40, "ISZ": 0o44,
    "AND": 0o50, "SAD": 0o54, "JMP": 0o60,
}
LINE = re.compile(r"^\s*\d+\s+([0-7]{4,5})/\s+([0-7]{1,6})\s+(?:[A-Z][A-Z0-9]*,\s+)?(.*)$")
SYMDEF = re.compile(r"([A-Z][A-Z0-9]*)\s+=\s*\*?([0-7]+)")
OPERAND = re.compile(r"^([A-Z][A-Z0-9]*)(?:\s*([+-])\s*([0-7]+)|\s+([0-7]+))?$")


def main() -> int:
    path = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).parent.parent / "symelec-listing.txt")
    lines = path.read_text().splitlines()
    symbols: dict[str, int] = {}
    for text in lines:
        if "/" in text[:20]:
            continue
        for name, value in SYMDEF.findall(text):
            symbols.setdefault(name, int(value, 8))
    checked = bad = 0
    for n, text in enumerate(lines, 1):
        m = LINE.match(text)
        if not m:
            continue
        addr, word, rest = m.group(1), int(m.group(2), 8), m.group(3).split("/")[0].strip()
        parts = rest.split(None, 1)
        if parts and parts[0] not in MEMREF and symbols.get(parts[0], 0) > 0o17777 and len(parts) == 1:
            # a bare call like COMPIL, defined COMPIL=JMS . : the word is the symbol's value
            checked += 1
            if word != symbols[parts[0]]:
                bad += 1
                print(f"line {n}: {addr}/ {word:06o}  {parts[0]}  expected {symbols[parts[0]]:06o}")
            continue
        if not parts or parts[0] not in MEMREF:
            continue
        op, operand = parts[0], parts[1].strip() if len(parts) > 1 else ""
        indirect = operand.startswith("I ")
        if indirect:
            operand = operand[2:].strip()
        om = OPERAND.match(operand)
        if not om or om.group(1) not in symbols or symbols[om.group(1)] > 0o17777:
            continue
        offset = int(om.group(3) or om.group(4) or "0", 8) * (-1 if om.group(2) == "-" else 1)
        want = (MEMREF[op] << 12) | (0o20000 if indirect else 0) | ((symbols[om.group(1)] + offset) & 0o17777)
        checked += 1
        if word != want:
            bad += 1
            print(f"line {n}: {addr}/ {word:06o}  {op} {'I ' if indirect else ''}{operand}  expected {want:06o}")
    print(f"{checked} symbolic memory references checked, {bad} mismatches")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
