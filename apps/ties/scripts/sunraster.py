#!/usr/bin/env python3
"""Decode a Sun rasterfile (.can) the way its own header says to.

The 2005 pass produced PNGs whose black and white are inverted for some files and not
others — `rootmenu.can` and `framemenu.can` came out as white-on-black while `move.can`
and `zap.can`, screendumps of the same pie menus, came out black-on-white. The archive
itself is consistent: every one of those files carries an RMT_EQUAL_RGB colormap whose
entry 0 is white and entry 1 is black. The polarity was lost in conversion, not authored.

So read the rasters, not the PNGs. Same reason the converter rereads .tn0 instead of the
2005 SVGs: the original is unambiguous and the derived copy has drift in it.

    struct rasterfile {          magic  0x59a66a95
        int ras_magic;           depth  1, 8, 24
        int ras_width;           type   1 RT_STANDARD, 2 RT_BYTE_ENCODED
        int ras_height;          maptype 0 RMT_NONE, 1 RMT_EQUAL_RGB
        int ras_depth;           maplen  bytes of colormap that follow the header
        int ras_length;
        int ras_type;
        int ras_maptype;
        int ras_maplen;
    };
"""
import struct
import sys
from pathlib import Path

MAGIC = 0x59A66A95
RT_STANDARD, RT_BYTE_ENCODED, RT_FORMAT_RGB = 1, 2, 3
RMT_NONE, RMT_EQUAL_RGB = 0, 1
ESCAPE = 0x80


def unpack_rle(data, want):
    """RT_BYTE_ENCODED: 0x80 0x00 is a literal 0x80, 0x80 n v is n+1 copies of v."""
    out = bytearray()
    i, n = 0, len(data)
    while i < n and len(out) < want:
        b = data[i]
        i += 1
        if b != ESCAPE:
            out.append(b)
            continue
        if i >= n:
            break
        count = data[i]
        i += 1
        if count == 0:
            out.append(ESCAPE)
            continue
        if i >= n:
            break
        out.extend(bytes([data[i]]) * (count + 1))
        i += 1
    return bytes(out)


def read(path):
    """-> PIL.Image in RGB, colormap applied."""
    from PIL import Image

    raw = Path(path).read_bytes()
    magic, width, height, depth, length, typ, maptype, maplen = struct.unpack(
        ">8i", raw[:32]
    )
    if magic != MAGIC:
        raise ValueError(f"{path}: not a Sun rasterfile")

    cmap = raw[32 : 32 + maplen]
    body = raw[32 + maplen :]

    # Rows are padded to a 16-bit boundary.
    row_bytes = ((width * depth + 15) // 16) * 2
    expected = row_bytes * height

    if typ == RT_BYTE_ENCODED:
        body = unpack_rle(body, expected)
    body = body[:expected].ljust(expected, b"\x00")

    if depth == 1:
        img = Image.frombytes("1", (width, height), body, "raw", "1;I", row_bytes)
        # "1;I" inverts, because a set bit means colormap index 1. Index 1 is black in
        # every 1-bit file in this archive, and PIL's "1" mode paints 0 as black.
        img = img.convert("L")
        if maptype == RMT_EQUAL_RGB and maplen >= 6:
            n = maplen // 3
            zero = (cmap[0], cmap[n], cmap[2 * n])
            one = (cmap[1], cmap[n + 1], cmap[2 * n + 1])
            # The bit is an INDEX, so honour what the map says the two colours are.
            img = img.point(lambda v: 255 if v else 0)
            if sum(zero) < sum(one):
                img = img.point(lambda v: 255 - v)
        return img.convert("RGB")

    if depth == 8:
        img = Image.frombytes("L", (width, height), body, "raw", "L", row_bytes)
        if maptype == RMT_EQUAL_RGB and maplen >= 768:
            n = maplen // 3
            palette = bytearray()
            for i in range(n):
                palette += bytes([cmap[i], cmap[n + i], cmap[2 * n + i]])
            p = img.convert("P")
            p.putpalette(bytes(palette))
            return p.convert("RGB")
        return img.convert("RGB")

    if depth == 24:
        img = Image.frombytes("RGB", (width, height), body, "raw", "BGR", row_bytes)
        return img

    raise ValueError(f"{path}: unsupported depth {depth}")


def main():
    for arg in sys.argv[1:]:
        img = read(arg)
        out = Path(arg).with_suffix(".decoded.png")
        img.save(out)
        print(f"{arg}: {img.size} -> {out}")


if __name__ == "__main__":
    sys.exit(main())
