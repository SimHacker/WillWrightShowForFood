#!/usr/bin/env python3
"""Slice a listing page into overlapping horizontal strips for close reading."""
import sys
from pathlib import Path
from PIL import Image
import numpy as np

X0, X1 = 50, 1980  # listing body column (header PAGE n handled from full view)

def main(page_path: str, out_dir: str, n_strips: int = 8, overlap: int = 50) -> None:
    im = Image.open(page_path).convert("L")
    w, h = im.size
    a = np.array(im)
    dark = a < 128
    rows = dark[:, X0:min(X1, w)].any(axis=1)
    y0 = max(0, int(rows.argmax()) - 10)
    y1 = min(h, int(h - rows[::-1].argmax()) + 10)
    body = im.crop((X0, y0, min(X1, w), y1))
    bw, bh = body.size
    step = max(1, bh // n_strips)
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    stem = Path(page_path).stem
    for i in range(n_strips):
        top = max(0, i * step - (overlap if i else 0))
        bot = min(bh, (i + 1) * step + overlap) if i < n_strips - 1 else bh
        strip = body.crop((0, top, bw, bot))
        strip.save(out / f"{stem}-s{i}.png")
    print(f"{stem}: {n_strips} strips, body {bw}x{bh} (y {y0}..{y1})")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 8)
