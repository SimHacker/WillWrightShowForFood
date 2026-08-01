#!/usr/bin/env python3
"""Convert SunView iconedit .h bitmaps to PNG, written next to each .h file.

Sun icon format: a comment header like
  /* Format_version=1, Width=64, Height=64, Depth=1, Valid_bits_per_item=16 */
followed by comma-separated 16-bit hex words, MSB-first, rows padded to
16-bit boundaries. Depth=1: bit set = black (foreground), clear = white.

Usage: python3 sun-icons-to-png.py <dir> [--scale N]
Writes <name>.png (1x) for every .h file in <dir> containing a Sun icon
header. With --scale N also writes <name>-Nx.png nearest-neighbor upscales
for the files listed after --only (or all, if no --only).
"""

import re
import sys
from pathlib import Path

from PIL import Image

HEADER_RE = re.compile(
    r"Format_version=1,\s*Width=(\d+),\s*Height=(\d+),\s*Depth=(\d+),"
    r"\s*Valid_bits_per_item=(\d+)"
)


def convert(path: Path) -> Image.Image | None:
    text = path.read_text(errors="replace")
    m = HEADER_RE.search(text)
    if not m:
        return None
    width, height, depth, bits = map(int, m.groups())
    if depth != 1 or bits != 16:
        print(f"skip {path.name}: unsupported depth={depth} bits={bits}")
        return None
    words = [int(w, 16) for w in re.findall(r"0x[0-9A-Fa-f]+", text[m.end():])]
    words_per_row = (width + 15) // 16
    img = Image.new("1", (width, height), 1)  # 1 = white
    px = img.load()
    for y in range(height):
        for wx in range(words_per_row):
            idx = y * words_per_row + wx
            if idx >= len(words):
                break
            word = words[idx]
            for bit in range(16):
                x = wx * 16 + bit
                if x < width and word & (0x8000 >> bit):
                    px[x, y] = 0  # black
    return img


def main() -> None:
    args = sys.argv[1:]
    scale = 0
    if "--scale" in args:
        i = args.index("--scale")
        scale = int(args[i + 1])
        del args[i : i + 2]
    root = Path(args[0]) if args else Path(".")
    count = 0
    for h in sorted(root.glob("*.h")):
        img = convert(h)
        if img is None:
            continue
        out = h.with_suffix(".png")
        img.save(out)
        count += 1
        if scale:
            big = img.resize((img.width * scale, img.height * scale), Image.NEAREST)
            big.save(h.with_name(f"{h.stem}-{scale}x.png"))
    print(f"converted {count} icons in {root}")


if __name__ == "__main__":
    main()
