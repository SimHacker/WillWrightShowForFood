#!/usr/bin/env python3
"""Check operate instructions against their mnemonics.

An operate line has no operand: `addr/ word  [LABEL,] SPA!CLA`. The word is
the OR of the microinstructions named, so it can be computed. OCR renders
the assembler's `!` as `I` or `1`; both are accepted as separators. A line
whose mnemonic is not all operate names is skipped (it is a macro call or
a data word).

usage: check-operate.py [symelec-listing.txt]
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent.parent
OPR = {
    "NOP": 0o740000, "CMA": 0o740001, "CML": 0o740002, "OAS": 0o740004,
    "RAL": 0o740010, "RAR": 0o740020, "HLT": 0o740040, "SMA": 0o740100,
    "SZA": 0o740200, "SNL": 0o740400, "SKP": 0o741000, "SPA": 0o741100,
    "SNA": 0o741200, "SZL": 0o741400, "RTL": 0o742010, "RTR": 0o742020,
    "CLL": 0o744000, "STL": 0o744002, "RCL": 0o744010, "RCR": 0o744020,
    "CLA": 0o750000, "CLC": 0o750001, "LAS": 0o750004, "GLK": 0o750010,
}
LINE = re.compile(r"^\s*\d*\s+([0-7]{2,5})/\s+([0-7]{1,6})\s+(?:[A-Z][A-Z0-9-]*,\s+)?([A-Z][A-Z0-9!]*)\s*(?:/.*)?$")
PARTS = re.compile("(" + "|".join(OPR) + ")[!I1]?")


def encode(mnemonic: str) -> int | None:
    word, pos = 0, 0
    while pos < len(mnemonic):
        m = PARTS.match(mnemonic, pos)
        if not m:
            return None
        word |= OPR[m.group(1)]
        pos = m.end()
    return word


def main() -> int:
    listing = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "symelec-listing.txt"
    checked = bad = 0
    for text in listing.read_text().splitlines():
        m = LINE.match(text)
        if not m:
            continue
        want = encode(m.group(3))
        if want is None:
            continue
        checked += 1
        got = int(m.group(2), 8)
        if got != want:
            bad += 1
            print(f"{m.group(1):>5}  {m.group(2):>6}  {m.group(3):<10} wants {want:06o}")
    print(f"{checked} operate instructions checked, {bad} mismatches")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
