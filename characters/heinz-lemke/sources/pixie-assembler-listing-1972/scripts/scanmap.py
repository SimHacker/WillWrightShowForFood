#!/usr/bin/env python3
"""Scan source map: link every line of a corrected listing transcription to rectangles on its scan.

The transcription is the truth; OCR only says where things are. The lineprinter's fixed line and
character pitch carry most of the weight, so a line the OCR misses still gets a predicted rectangle.

    python3 scripts/scanmap.py symelec-listing.txt --offset 1 --out scanmap/symelec
    python3 scripts/scanmap.py rsppix-listing.txt --offset 112 --out scanmap/rsppix

--offset: scan page index of listing page p is p + offset (pages/page-NNN.png).
Per page it records the paper geometry (left edge, sprocket holes), the line and character
pitch, the crop it OCRed and its transform back to the page, and per listing line the rectangles
of its label, statement and comment, each from OCR or predicted. All coordinates are normalized
to the page image, top-left origin, so they double as texture coordinates.
Writes <out>.json, <out>-overlays/page-NNN.svg and <out>-REPORT.md. OCR results are cached in
.build/ (not committed).
"""
from __future__ import annotations

import argparse
import difflib
import json
import re
import statistics
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / ".build"
VISION_SRC = ROOT / "scripts" / "vision_boxes.swift"
VISION_BIN = BUILD / "vision_boxes"

CODE = re.compile(r"^\s*(\d+)\s+([0-7]+)/\s*([0-7]+)(?![0-7/])")
NUMBERED = re.compile(r"^\s*(\d+)(?:\s|$)")
HEADER = re.compile(r"\bPAGE\s+(\d+)\s*$")
OCR_ADDR = re.compile(r"^([0-7]{2,5})\s*/")


def vision(page: Path, out: Path, crop: tuple[int, int, int, int] | None = None, scale: float = 1) -> dict:
    if not VISION_BIN.exists() or VISION_BIN.stat().st_mtime < VISION_SRC.stat().st_mtime:
        BUILD.mkdir(exist_ok=True)
        subprocess.run(["swiftc", "-O", "-o", str(VISION_BIN), str(VISION_SRC)], check=True)
    if not out.exists():
        args = [str(VISION_BIN), str(out), str(page)]
        if crop:
            args += [str(v) for v in crop] + [str(scale)]
        subprocess.run(args, check=True)
    return json.loads(out.read_text())


def norm_digits(s: str) -> str:
    return s.translate(str.maketrans({"O": "0", "o": "0", "Q": "0", "D": "0", "I": "1", "l": "1", "|": "1", "i": "1", "!": "1"}))


def segments(raw: str, start: int) -> list[tuple[int, str]]:
    """Runs of text from column `start` on, split where two or more spaces separate them."""
    out = []
    for m in re.finditer(r"\S+(?: \S+)*", raw[start:]):
        out.append((start + m.start(), m.group(0)))
    return out


def listing_pages(text: str) -> dict[int, list[dict]]:
    """Listing page number -> its lines after the header, each with its 1-based line in the file."""
    pages: dict[int, list[dict]] = {}
    current = None
    for n, raw in enumerate(text.split("\n"), start=1):
        h = HEADER.search(raw)
        if h:
            current = int(h.group(1))
            pages[current] = []
            continue
        if current is None:
            continue
        m = CODE.match(raw)
        if m:
            slash = raw.index("/")
            segs = segments(raw, slash + 8)
            pages[current].append({"line": n, "seq": int(m.group(1)), "seq_col": m.start(1), "addr": int(m.group(2), 8), "addr_col": m.start(2), "addr_len": len(m.group(2)) + 1, "segs": segs})
        elif NUMBERED.match(raw):
            nm = NUMBERED.match(raw)
            pages[current].append({"line": n, "seq": int(nm.group(1)), "seq_col": nm.start(1), "addr": None, "segs": segments(raw, 22)})
        elif re.match(r"^\s*[0-7]{3,5}/\s*[0-7]+", raw):
            # variable and literal blocks: `11764/      0  BSBWOR`, maybe indented; only the name is text
            am = re.match(r"^\s*([0-7]{3,5})/\s*([0-7]+)", raw)
            pages[current].append({"line": n, "seq": None, "addr": int(am.group(1), 8), "addr_col": am.start(1), "addr_len": len(am.group(1)) + 1, "segs": segments(raw, am.end())})
        else:
            pages[current].append({"line": n, "seq": None, "addr": None, "segs": segments(raw, 0) if raw.strip() else []})
    return pages


def ink(page: Path) -> np.ndarray:
    return np.array(Image.open(page).convert("L")) < 128


def paper(im: np.ndarray, text_left: float) -> dict:
    """The paper's left edge and the sprocket holes in the margin between it and the text."""
    H, W = im.shape
    col = im[:, : W // 25].mean(axis=0)
    edge = int(np.argmax(col > 0.3)) if (col > 0.3).any() else 0
    x0, x1 = edge + 12, max(edge + 40, int(text_left * W) - 12)
    band = im[:, x0:x1]
    rows = band.sum(axis=1)
    holes, y = [], 0
    while y < H:
        if rows[y] > 4:
            y0 = y
            while y < H and rows[y] > 1:
                y += 1
            if 15 < y - y0 < 90:
                xs = np.nonzero(band[y0:y].any(axis=0))[0]
                cx = x0 + (xs.min() + xs.max()) / 2
                holes.append([round(cx / W, 5), round((y0 + y) / 2 / H, 5), round((y - y0) / 2 / W, 5)])
        y += 1
    return {"edge_left": round(edge / W, 5), "holes": holes}


def ink_runs(im: np.ndarray, y_top: float, y_bot: float, x_left: float, x_right: float, gap: float) -> list[tuple[float, float, float, float]]:
    """Runs of printed characters in one line band, split where the gap is at least `gap` wide."""
    H, W = im.shape
    t, b = max(0, int(y_top * H)), min(H, int(y_bot * H) + 1)
    l, r = max(0, int(x_left * W)), min(W, int(x_right * W))
    band = im[t:b, l:r]
    cols = np.nonzero(band.sum(axis=0) > 1)[0]
    if not len(cols):
        return []
    runs, start, prev, g = [], cols[0], cols[0], gap * W
    for c in cols[1:]:
        if c - prev > g:
            runs.append((start, prev))
            start = c
        prev = c
    runs.append((start, prev))
    out = []
    for s, e in runs:
        rows = np.nonzero(band[:, s : e + 1].any(axis=1))[0]
        out.append(((l + s) / W, (t + rows.min()) / H, (e - s + 1) / W, (rows.max() - rows.min() + 1) / H))
    return out


def fit(xs: list[float], ys: list[float]) -> tuple[float, float]:
    b, a = np.polyfit(xs, ys, 1)
    return float(a), float(b)


def map_page(lines: list[dict], page: Path, cache: Path) -> dict:
    full = vision(page, cache / f"{page.stem}-full.json")
    W, H = full["width"], full["height"]
    # Anchors: OCR address tokens that read exactly as a listing line's address.
    by_addr = {ln["addr"]: (k, ln) for k, ln in enumerate(lines) if ln["addr"] is not None}
    by_seq = {ln["seq"]: (k, ln) for k, ln in enumerate(lines) if ln.get("seq") is not None}
    anchors = []
    for o in full["lines"]:
        words = o.get("words") or [{"text": o["text"], "box": o["box"]}]
        for wd in words:
            t = norm_digits(wd["text"])
            x, y, w, h = wd["box"]
            am = re.fullmatch(r"([0-7]{2,5})/?", t)
            if am and int(am.group(1), 8) in by_addr and (t.endswith("/") or "/" in o["text"]):
                k, ln = by_addr[int(am.group(1), 8)]
                anchors.append({"k": k, "x": x, "yc": y + h / 2, "h": h, "w_char": w / len(t), "col": ln["addr_col"]})
            elif re.fullmatch(r"\d{1,4}", t) and int(t) in by_seq and x < 0.2 + (lines and 0):
                k, ln = by_seq[int(t)]
                # The sequence number is right-aligned at a fixed column; its last digit fixes x.
                col = ln["seq_col"] + len(str(ln["seq"])) - len(t)
                anchors.append({"k": k, "x": x, "yc": y + h / 2, "h": h, "w_char": w / len(t), "col": col})
    # Keep anchors consistent with a straight line of line index against y; drop OCR digits read wrong.
    # Robust: the line through some pair of anchors that agrees with the most others (an octal word read
    # as an address is a wild outlier, and least squares would bend to it).
    if len(anchors) >= 3:
        best: list[dict] = []
        for i in range(len(anchors)):
            for j in range(i + 1, len(anchors)):
                a, b = anchors[i], anchors[j]
                if a["k"] == b["k"]:
                    continue
                p_ = (b["yc"] - a["yc"]) / (b["k"] - a["k"])
                if not 0.008 < p_ < 0.03:
                    continue
                y0_ = a["yc"] - p_ * a["k"]
                inl = [c for c in anchors if abs(c["yc"] - (y0_ + p_ * c["k"])) < 0.3 * p_]
                if len(inl) > len(best):
                    best = inl
        anchors = best
    if len(anchors) < 3:
        return {"error": f"only {len(anchors)} anchors", "lines": []}
    ks = [a["k"] for a in anchors]
    y0, pitch = fit(ks, [a["yc"] for a in anchors])
    # Character pitch: from the address's first digit to the octal word's last is len(addr) + 7 columns,
    # since the slash follows the address and the word is right-aligned seven columns after the slash.
    spans = []
    for o in full["lines"]:
        ws = o.get("words", [])
        for i in range(len(ws) - 1):
            a, b = norm_digits(ws[i]["text"]).strip("/"), norm_digits(ws[i + 1]["text"])
            if re.fullmatch(r"[0-7]{2,5}", a) and re.fullmatch(r"[0-7]{1,6}", b):
                right = ws[i + 1]["box"][0] + ws[i + 1]["box"][2]
                spans.append((right - ws[i]["box"][0]) / (len(a) + 7))
    char = statistics.median(spans) if len(spans) >= 3 else statistics.median(a["w_char"] for a in anchors)
    x0, dx = fit(ks, [a["x"] - a["col"] * char for a in anchors])
    glyph = statistics.median(a["h"] for a in anchors)
    ypos = lambda k: y0 + pitch * k
    xpos = lambda k, col: x0 + dx * k + col * char

    # OCR again, cropped to the text columns only: right of the octal word, to the last character.
    text_cols = [s[0] for ln in lines for s in ln["segs"] if ln["addr"] is not None]
    left_col = min(text_cols) if text_cols else 30
    kmax = len(lines) - 1
    left = min(xpos(0, left_col), xpos(kmax, left_col)) - char
    right = max((o["box"][0] + o["box"][2] for o in full["lines"]), default=1)
    top, bottom = ypos(0) - pitch, ypos(kmax) + pitch
    crop = (int(left * W), int(top * H), int((right - left) * W) + 4, int((bottom - top) * H))
    scale = 2.0
    cut = vision(page, cache / f"{page.stem}-text.json", crop, scale)
    words = [(w, o) for o in cut["lines"] for w in o["words"]] or [({"text": o["text"], "box": o["box"]}, o) for o in cut["lines"]]
    rows: dict[int, list[dict]] = {}
    for w, _ in words:
        x, y, ww, hh = w["box"]
        k = round((y + hh / 2 - y0 - dx * 0) / pitch)
        if 0 <= k <= kmax:
            rows.setdefault(k, []).append(w)

    # The text column's ink, line by line: the transcription's segments are the runs, in order.
    im = ink(page)
    out_lines = []
    found = predicted = 0
    for k, ln in enumerate(lines):
        if not ln["segs"]:
            continue
        yc = ypos(k)
        # Search from just before this line's own first text column, which varies by block.
        x_from = min(left, xpos(k, ln["segs"][0][0]) - char)
        segs = [s for _, s in ln["segs"]]
        band = (yc - pitch * 0.45, yc + pitch * 0.45)

        def merged(runs: list) -> list:
            # Two spaces in the print can be one space in the transcription; merge runs until the counts agree.
            while len(runs) > len(segs) and len(runs) > 1:
                gaps = [runs[i + 1][0] - (runs[i][0] + runs[i][2]) for i in range(len(runs) - 1)]
                i = int(np.argmin(gaps))
                a, b = runs[i], runs[i + 1]
                y0_ = min(a[1], b[1])
                runs[i : i + 2] = [(a[0], y0_, b[0] + b[2] - a[0], max(a[1] + a[3], b[1] + b[3]) - y0_)]
            return runs

        runs = merged(ink_runs(im, *band, x_from, right + char, char * 1.6))
        if len(runs) != len(segs) and ln["addr"] is not None:
            # The print can put a block in other columns than the transcription does (RSPPIX's variables
            # sit further left). Read the whole line and drop the number fields: seq?, address, word.
            whole = ink_runs(im, *band, xpos(k, 0) - 2 * char, right + char, char * 1.6)
            lead = 3 if ln["seq"] is not None else 2
            if len(whole) > lead:
                runs = merged(whole[lead:])
        rects = []
        if len(runs) == len(segs):
            for seg, r in zip(segs, runs):
                rects.append({"text": seg, "box": [round(v, 5) for v in r], "from": "ink"})
                found += 1
        else:
            for col, seg in ln["segs"]:
                rects.append({"text": seg, "box": [round(v, 5) for v in (xpos(k, col), yc - glyph / 2, len(seg) * char, glyph)], "from": "predicted"})
                predicted += 1
        got = " ".join(w["text"] for w in sorted(rows.get(k, []), key=lambda w: w["box"][0]))
        want = " ".join(segs)
        conf = difflib.SequenceMatcher(None, want.upper(), got.upper()).ratio() if got else 0.0
        out_lines.append({"line": ln["line"], "seq": ln["seq"], "addr": ln["addr"], "rects": rects, "ocr": got, "conf": round(conf, 3)})

    return {
        "image": page.name,
        "width": W,
        "height": H,
        "paper": paper(im, xpos(0, 0)),
        "pitch": {"line": round(pitch, 6), "char": round(char, 6), "glyph": round(glyph, 6), "y0": round(y0, 6), "x0": round(x0, 6), "skew_dx_per_line": round(dx, 8), "anchors": len(anchors)},
        "text_crop": {"pixels": list(crop), "scale": scale, "to_page": "x_page = (crop_x + x_crop * crop_w) / width; y likewise, top-left origin"},
        "stats": {"segments_ink": found, "segments_predicted": predicted},
        "lines": out_lines,
    }


def overlay(page_doc: dict, scan_href: str) -> str:
    W, H = page_doc["width"], page_doc["height"]
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W // 3}" height="{H // 3}">',
             f'<image href="{scan_href}" width="{W}" height="{H}"/>']
    x, y, w, h = page_doc["text_crop"]["pixels"]
    parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" stroke="#08f" stroke-dasharray="12 8" stroke-width="3"/>')
    for cx, cy, r in page_doc["paper"]["holes"]:
        parts.append(f'<circle cx="{cx * W:.1f}" cy="{cy * H:.1f}" r="{r * W:.1f}" fill="none" stroke="#f80" stroke-width="3"/>')
    for ln in page_doc["lines"]:
        for r in ln["rects"]:
            bx, by, bw, bh = r["box"]
            color = "#0a0" if r["from"] == "ink" else "#e00"
            parts.append(f'<rect x="{bx * W:.1f}" y="{by * H:.1f}" width="{bw * W:.1f}" height="{bh * H:.1f}" fill="{color}" fill-opacity="0.12" stroke="{color}" stroke-width="2"><title>line {ln["line"]}: {r["text"]}</title></rect>')
    parts.append("</svg>")
    return "\n".join(parts)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("listing", type=Path)
    ap.add_argument("--offset", type=int, required=True)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--pages", help="listing pages, e.g. 39 or 1-110")
    a = ap.parse_args()
    listing = (ROOT / a.listing) if not a.listing.is_absolute() else a.listing
    out = (ROOT / a.out) if not a.out.is_absolute() else a.out
    pages = listing_pages(listing.read_text())
    want = sorted(pages)
    if a.pages:
        lo, _, hi = a.pages.partition("-")
        want = [p for p in want if int(lo) <= p <= int(hi or lo)]
    cache = BUILD / out.name
    cache.mkdir(parents=True, exist_ok=True)
    ov = out.parent / f"{out.name}-overlays"
    ov.mkdir(parents=True, exist_ok=True)
    doc = {"listing": listing.name, "scan_dir": "pages", "page_offset": a.offset, "pages": {}}
    if out.with_suffix(".json").exists():
        doc["pages"] = json.loads(out.with_suffix(".json").read_text())["pages"]
    report = []
    for p in want:
        scan = ROOT / "pages" / f"page-{p + a.offset:03d}.png"
        d = map_page(pages[p], scan, cache)
        doc["pages"][str(p)] = d
        if "error" in d:
            print(f"page {p}: {d['error']}", file=sys.stderr)
            continue
        (ov / f"{scan.stem}.svg").write_text(overlay(d, f"../pages/{scan.name}"))
        s = d["stats"]
        n = len(d["lines"])
        print(f"page {p}: {n} lines, {s['segments_ink']} segments from ink, {s['segments_predicted']} predicted, {d['pitch']['anchors']} anchors, {len(d['paper']['holes'])} holes")
    out.with_suffix(".json").write_text(json.dumps(doc, separators=(",", ":")))
    ink_total = pred_total = 0
    for p, d in sorted(doc["pages"].items(), key=lambda kv: int(kv[0])):
        scan_name = f"page-{int(p) + a.offset:03d}.png"
        if "error" in d:
            report.append(f"| {p} | {scan_name} | {d['error']} | | | |")
            continue
        s = d["stats"]
        ink_total += s["segments_ink"]
        pred_total += s["segments_predicted"]
        low = sum(1 for ln in d["lines"] if ln["conf"] < 0.6)
        report.append(f"| {p} | {scan_name} | {len(d['lines'])} | {s['segments_ink']} | {s['segments_predicted']} | {low} |")
    report.insert(0, f"| all | | | {ink_total} | {pred_total} | |")
    # Compact form for apps: listing file line -> [[x, y, w, h, from_ink], ...] in page pixels.
    compact = {"listing": listing.name, "page_offset": a.offset, "pages": {}, "lines": {}}
    for p, d in sorted(doc["pages"].items(), key=lambda kv: int(kv[0])):
        if "error" in d:
            continue
        W, H = d["width"], d["height"]
        compact["pages"][p] = [W, H]
        for ln in d["lines"]:
            compact["lines"][str(ln["line"])] = [[round(r["box"][0] * W), round(r["box"][1] * H), round(r["box"][2] * W), round(r["box"][3] * H), int(r["from"] == "ink")] for r in ln["rects"]]
    (out.parent / f"{out.name}-lines.json").write_text(json.dumps(compact, separators=(",", ":")))
    (out.parent / f"{out.name}-REPORT.md").write_text(
        f"# Scan map report: {listing.name}\n\nGenerated by `scripts/scanmap.py`. Green boxes in the overlays are measured from the ink, red ones predicted from the\nline and character pitch where the ink runs and the transcription's segments didn't line up; the dashed blue box is the\nOCR crop, orange circles the sprocket holes. Low confidence means the OCR text of the line differs a lot from the\ntranscription, which is expected on this print and only worth a look when it's near zero.\n\n"
        "| Listing page | Scan | Lines with text | Segments from ink | Predicted | Low-confidence lines |\n|---:|---|---:|---:|---:|---:|\n" + "\n".join(report) + "\n"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
