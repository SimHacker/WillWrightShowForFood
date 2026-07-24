#!/usr/bin/env python3
"""Cross-check transcribed PDP-7 mnemonics against transcribed octal words.

The listing prints each instruction twice: as an assembled octal word and as
source text. The PDP-7 memory-reference opcode lives in the top bits, so the
first two octal digits are opcode+indirect and must match the mnemonic:

  CAL=00 DAC=04 JMS=10 DZM=14 LAC=20 XOR=24 ADD=30 TAD=34
  XCT=40 ISZ=44 AND=50 SAD=54 JMP=60      (+2 on 2nd digit if indirect: 'I')

The address field is 13 bits, so its top bit is part of the second octal
digit: a direct op accepts top digits base..base+1 and an indirect op
base+2..base+3 (e.g. LAC I 11764 prints as 231764).

Known 1972 idiom (image-verified, see TRANSCRIPTION-REPORT.md): symbols
defined `X=JMS,` carry the JMS opcode in their value, so `AND I X`
assembles to 52xxxx + 10xxxx = 62xxxx = JMP I — the subroutine-return
pun. `AND I` rows whose word tops 62/63 are therefore accepted and
counted separately, not flagged.

Also checked: LAW = 76xxxx/77xxxx (load accumulator with).
Skipped: literals, IOT (70xxxx), operate (74xxxx), display words (PAR/POH/
POV/VEC/DJS/DJP/DDS/PXD and friends), and rows without both fields.

Output: one line per mismatch -> opcheck-report.txt
"""

from __future__ import annotations
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
PAGES = BASE / "ocr-pages"

OPS = {"CAL": 0o00, "DAC": 0o04, "JMS": 0o10, "DZM": 0o14, "LAC": 0o20,
       "XOR": 0o24, "ADD": 0o30, "TAD": 0o34, "XCT": 0o40, "ISZ": 0o44,
       "AND": 0o50, "SAD": 0o54, "JMP": 0o60}
OCTAL_RE = re.compile(r"^[0-7]+$")

findings = []
checked = 0
idiom_returns = 0
for path in sorted(PAGES.glob("page-*.tsv")):
    for lineno, line in enumerate(path.read_text().splitlines(), 1):
        if not line.strip() or line.startswith(("#", "RAW\t", "HAND\t")):
            continue
        parts = (line.split("\t") + [""] * 6)[:6]
        seq, addr, octal, label, instr, comment = parts
        if not octal or not instr or not OCTAL_RE.match(octal):
            continue
        toks = instr.split()
        if not toks or toks[0] not in OPS and toks[0] != "LAW":
            continue
        word = int(octal, 8)
        if len(octal) < 6:
            word = int(octal.rjust(6, "0"), 8)
        top = word >> 12  # first two octal digits
        if toks[0] == "LAW":
            ok = top in (0o76, 0o77)
            expect = "76/77"
        else:
            indirect = len(toks) > 1 and toks[1] == "I"
            base = OPS[toks[0]] + (0o02 if indirect else 0)
            ok = top in (base, base + 1)
            expect = f"{base:02o}/{base + 1:02o}"
            if not ok and toks[0] == "AND" and indirect and top in (0o62, 0o63):
                ok = True  # AND I <JMS-valued symbol> return idiom
                idiom_returns += 1
        checked += 1
        if not ok:
            findings.append(f"{path.name}:{lineno} seq {seq}: octal {octal} "
                            f"(top {top:02o}) vs {instr!r} (expect {expect})")

out = BASE / "opcheck-report.txt"
out.write_text("\n".join(findings) + "\n")
print(f"checked {checked} memory-reference rows, {len(findings)} mismatches "
      f"({idiom_returns} AND-I return idioms accepted) -> {out.name}")
