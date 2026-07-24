#!/usr/bin/env python3
"""Stitch per-page PIXIE listing TSVs into module artifacts.

Reads ocr-pages/page-NNN.tsv (see TRANSCRIPTION-SPEC.md) and emits, per module:
  <module>-listing.txt  faithful aligned listing text
  <module>.asm          clean source (labels, instructions, comments)
  <module>.oct          address/octal memory image ("ADDR OCTAL" per word)
plus a stitch-report.txt with sanity-check findings.

Modules: SYMELEC = pages 002-111, RSPPIX = pages 113-127.
Covers (000, 001, 112) are skipped for code output but noted in the report.
"""

from __future__ import annotations
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
PAGES = BASE / "ocr-pages"
OUT = BASE

MODULES = {
    "symelec": range(2, 112),
    "rsppix": range(113, 128),
}

OCTAL_RE = re.compile(r"^[0-7]+$")


def parse_page(path: Path):
    rows = []
    for lineno, line in enumerate(path.read_text().splitlines(), 1):
        if not line.strip() or line.startswith("#"):
            continue
        parts = line.split("\t")
        rows.append((lineno, parts))
    return rows


def main():
    report = []
    for module, page_range in MODULES.items():
        listing_lines = []
        asm_lines = []
        oct_words = []       # (addr_int, addr_str, octal, page, seq)
        seen_addr = {}
        missing = []
        for n in page_range:
            path = PAGES / f"page-{n:03d}.tsv"
            if not path.exists():
                missing.append(n)
                continue
            listing_lines.append("")
            asm_lines.append(f"/ ---- scan page {n:03d} ----")
            prev_seq = None
            for lineno, parts in parse_page(path):
                kind = parts[0]
                if kind == "RAW":
                    text = parts[1] if len(parts) > 1 else ""
                    listing_lines.append(text)
                    if "ASSEMBLED" not in text and "PAGE" not in text.upper()[:60]:
                        # keep titles/comments in source, as-is if already a comment
                        asm_lines.append(text if text.startswith(("/", "*")) else "/" + text)
                    continue
                if kind == "HAND":
                    text = parts[1] if len(parts) > 1 else ""
                    listing_lines.append(f"        {{handwritten: {text}}}")
                    continue
                # normal listing row
                seq, addr, octal, label, instr, comment = (parts + [""] * 6)[:6]
                unsure = len(parts) > 6 and "?UNSURE" in parts[6:]
                if seq and not seq.isdigit():
                    report.append(f"{module} p{n:03d}:{lineno} bad SEQ {seq!r}")
                else:
                    if seq and prev_seq is not None and int(seq) not in (prev_seq + 1, prev_seq):
                        report.append(
                            f"{module} p{n:03d}:{lineno} SEQ jump {prev_seq} -> {seq}")
                    if seq:
                        prev_seq = int(seq)
                for fieldname, value in (("ADDR", addr), ("OCTAL", octal)):
                    if value and not OCTAL_RE.match(value):
                        report.append(
                            f"{module} p{n:03d}:{lineno} non-octal {fieldname} {value!r}")
                if unsure or "?" in addr + octal + label + instr:
                    report.append(f"{module} p{n:03d}:{lineno} UNSURE: "
                                  + " | ".join([seq, addr, octal, label, instr, comment]))
                # faithful listing line
                addr_col = f"{addr:>6}/" if addr else "       "
                line_txt = f"{seq:>5}  {addr_col} {octal:>6}  {label:<8} {instr:<26} {comment}".rstrip()
                listing_lines.append(line_txt)
                # clean source line
                if label or instr or comment:
                    asm_lines.append(f"{label:<8} {instr:<26} {comment}".rstrip())
                # memory image
                if addr and octal and OCTAL_RE.match(addr) and OCTAL_RE.match(octal):
                    a = int(addr, 8)
                    if a in seen_addr and seen_addr[a] != octal:
                        report.append(
                            f"{module} p{n:03d}:{lineno} addr {addr} redefined "
                            f"{seen_addr[a]} -> {octal}")
                    seen_addr[a] = octal
                    oct_words.append((a, addr, octal, n, seq))
        if missing:
            report.append(f"{module}: missing pages {missing}")
        (OUT / f"{module}-listing.txt").write_text("\n".join(listing_lines) + "\n")
        (OUT / f"{module}.asm").write_text("\n".join(asm_lines) + "\n")
        oct_lines = [f"{addr:>6} {octal:>6}" for _, addr, octal, _, _ in
                     sorted(oct_words, key=lambda w: w[0])]
        (OUT / f"{module}.oct").write_text("\n".join(oct_lines) + "\n")
        print(f"{module}: {len(listing_lines)} listing lines, "
              f"{len(oct_words)} words, {len(missing)} missing pages")
    (OUT / "stitch-report.txt").write_text("\n".join(report) + "\n")
    print(f"report: {len(report)} findings -> stitch-report.txt")


if __name__ == "__main__":
    sys.exit(main())
