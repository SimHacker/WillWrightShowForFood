#!/usr/bin/env python3
"""Rebuild the clean captions from YouTube's, applying corrections.tsv.

  transcript-cache/youtube-uploaded-en-US.vtt   YouTube's track, as downloaded; never edited
  corrections.tsv                               what YouTube heard -> what was said
  transcript.vtt                                the same cues and timestamps, corrected: upload this
  transcript.md                                 the same text, one cue a line, for reading

A correction may span a line break inside a cue, so each cue is corrected as one line of text,
then wrapped back to YouTube's two lines. A correction can't span two cues: split it at the cue.
"""
import html
import re
from pathlib import Path

HERE = Path(__file__).parent
RAW = HERE / "transcript-cache" / "youtube-uploaded-en-US.vtt"


def corrections():
    out = []
    for line in (HERE / "corrections.tsv").read_text().splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        heard, said = line.split("\t")
        out.append((heard, said))
    return out


def cues(text):
    """(start, end, text) per cue; text joined to one line, entities decoded, spaces collapsed."""
    for block in re.split(r"\n\s*\n", text.strip()):
        lines = block.splitlines()
        timing = next((i for i, l in enumerate(lines) if "-->" in l), None)
        if timing is None:
            continue
        start, end = (t.strip() for t in lines[timing].split("-->"))
        body = " ".join(lines[timing + 1 :])
        body = re.sub(r"\s+", " ", html.unescape(body).replace("\u00a0", " ")).strip()
        yield start, end.split()[0], body


def fix(text, rules):
    for heard, said in rules:
        text = re.sub(r"(?<![\w-])" + re.escape(heard) + r"(?![\w-])", said, text)
    return text


def wrap(text, width=46):
    """Two lines, as YouTube shows them: split at the space nearest the middle."""
    if len(text) <= width:
        return text
    mid = len(text) // 2
    spaces = [m.start() for m in re.finditer(" ", text)]
    if not spaces:
        return text
    cut = min(spaces, key=lambda i: abs(i - mid))
    return text[:cut] + "\n" + text[cut + 1 :]


def stamp(t):
    h, m, s = t.split(":")
    total = int(h) * 3600 + int(m) * 60 + float(s)
    mm, ss = divmod(int(total), 60)
    hh, mm = divmod(mm, 60)
    return f"{hh}:{mm:02d}:{ss:02d}" if hh else f"{mm}:{ss:02d}"


def main():
    rules = corrections()
    fixed = [(s, e, fix(t, rules)) for s, e, t in cues(RAW.read_text())]
    vtt = ["WEBVTT", "Kind: captions", "Language: en-US", ""]
    for s, e, t in fixed:
        vtt += [f"{s} --> {e}", wrap(t), ""]
    (HERE / "transcript.vtt").write_text("\n".join(vtt))
    md = [
        "# PIXIE and FORTH on PDP-7 Cabinet Emulator with Type 340 Vector Graphics Display",
        "",
        "Don Hopkins, 9 October 2026. https://www.youtube.com/watch?v=lo8kdY-5i6c",
        "",
        "YouTube's captions, corrected by [corrections.tsv](corrections.tsv) and rebuilt by "
        "[build.py](build.py): misheard names and terms fixed, spoken phrasing kept. "
        "[transcript.vtt](transcript.vtt) is the same text with YouTube's timestamps, for uploading.",
        "",
    ]
    md += [f"[{stamp(s)}] {t}  " for s, e, t in fixed]
    (HERE / "transcript.md").write_text("\n".join(md) + "\n")
    print(f"{len(fixed)} cues, {len(rules)} corrections")


if __name__ == "__main__":
    main()
