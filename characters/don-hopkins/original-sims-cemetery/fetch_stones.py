#!/usr/bin/env python3
"""Cache every tombstone image the epitaphs museum shows, so the page never waits on the Archive.

Reads README.md for stone ids (<Kind>Tombstone_<id>, in image paths and in the list of stones
without pictures), fetches each stone's .bmp from the Wayback Machine, and writes
stones/<Kind>Tombstone_<id>.png. The museum's <img> tags point at those PNGs.

Tries every 200 capture the CDX index knows, oldest first. Some captures the index lists as 200
play back as 404; those stones stay missing. The Archive rate-limits hard (429, then refused connections), so
requests are serial, spaced, and back off on refusal. Stones already cached are skipped, so a
rerun only fills gaps.

Usage: python3 fetch_stones.py            # fill missing PNGs
       python3 fetch_stones.py --check    # list stones without a PNG, fetch nothing
"""

import io
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
MUSEUM = HERE / "README.md"
STONES = HERE / "stones"
ORIGIN = "http://www.originalsims.com/Objects/Personalized/Simslice-{sid}.bmp"
CDX = "https://web.archive.org/cdx/search/cdx?url={url}&filter=statuscode:200&fl=timestamp&output=json"
UA = {"User-Agent": "WillWrightShowForFood tombstone cache (github.com/SimHacker)"}
PAUSE_S = 3
BACKOFF_S = [60, 120, 240, 480]


def museum_stones() -> list[str]:
    return list(dict.fromkeys(re.findall(r"\b((?:Halloween|Solemn)Tombstone_\d{12})\b", MUSEUM.read_text())))


def get(url: str) -> bytes | None:
    """Fetch with backoff on rate limiting. None means the Archive answered and has nothing."""
    for wait in [0, *BACKOFF_S]:
        if wait:
            print(f"    rate limited, sleeping {wait}s", flush=True)
            time.sleep(wait)
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                continue
            return None
        except (urllib.error.URLError, TimeoutError, ConnectionError):
            continue
        finally:
            time.sleep(PAUSE_S)
    return None


def captures(sid: str) -> list[str]:
    raw = get(CDX.format(url=ORIGIN.format(sid=sid).removeprefix("http://")))
    if not raw:
        return []
    rows = json.loads(raw or b"[]")[1:]
    return sorted({r[0] for r in rows})


def fetch(sid: str) -> bool:
    for ts in captures(sid):
        if save(sid, get(f"https://web.archive.org/web/{ts}id_/{ORIGIN.format(sid=sid)}")):
            print(f"  {sid}: {ts}", flush=True)
            return True
    print(f"  {sid}: no playable capture", flush=True)
    return False


def save(sid: str, data: bytes | None) -> bool:
    if not data or data[:2] != b"BM":
        return False
    Image.open(io.BytesIO(data)).save(STONES / f"{sid}.png", optimize=True)
    return True


def main() -> int:
    STONES.mkdir(exist_ok=True)
    stones = museum_stones()
    missing = [s for s in stones if not (STONES / f"{s}.png").exists()]
    print(f"{len(stones)} stones in the museum, {len(missing)} without a cached PNG", flush=True)
    if "--check" in sys.argv:
        for s in missing:
            print(f"  {s}")
        return 1 if missing else 0
    failed = [s for s in missing if not fetch(s)]
    print(f"done; {len(failed)} still missing: {failed}" if failed else "done; all cached", flush=True)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
