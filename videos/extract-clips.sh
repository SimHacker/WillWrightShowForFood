#!/usr/bin/env bash
# Extract clips defined in a *.clips.yml sidecar.
# Usage: ./videos/extract-clips.sh the-americans-s02e07-arpanet.clips.yml
set -euo pipefail

SIDECAR="${1:?usage: extract-clips.sh <file.clips.yml>}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
YAML="$ROOT/$SIDECAR"

if [[ ! -f "$YAML" ]]; then
  echo "not found: $YAML" >&2
  exit 1
fi

python3 - "$YAML" <<'PY'
import re, subprocess, sys
from pathlib import Path

yaml_path = Path(sys.argv[1])
text = yaml_path.read_text()

def parse_block(key, src):
    m = re.search(rf"^{key}:\s*(.+)$", src, re.M)
    return m.group(1).strip().strip('"') if m else None

def parse_clips(src):
    clips = []
    for m in re.finditer(r"^\s+-\s+id:\s+(\S+)", src, re.M):
        start = end = out = fades = None
        chunk = src[m.start():]
        body = []
        seen_header = False
        for line in chunk.splitlines():
            if re.match(r"^\s+-\s+id:", line):
                if seen_header:
                    break
                seen_header = True
                continue
            if seen_header:
                body.append(line)
        for line in body[:40]:
            if re.match(r"\s+start:", line) and "start_estimate" not in line:
                start = line.split("start:", 1)[1].strip().strip('"')
            if re.match(r"\s+end:", line) and "end_estimate" not in line:
                end = line.split("end:", 1)[1].strip().strip('"')
            if "output:" in line:
                out = line.split("output:", 1)[1].strip().strip('"')
            if "audio_fade:" in line:
                fades = line.split("audio_fade:", 1)[1].strip().strip('"')
        if start and end:
            clips.append((m.group(1), start, end, out, fades))
    return clips

def to_seconds(ts):
    parts = [int(p) for p in ts.split(":")]
    if len(parts) == 2:
        m, s = parts
        return m * 60 + s
    if len(parts) == 3:
        h, m, s = parts
        return h * 3600 + m * 60 + s
    raise ValueError(ts)

source_m = re.search(r"^\s+source_file:\s*(.+)$", text, re.M)
source = source_m.group(1).strip().strip('"') if source_m else None
if source == "null":
    source = None
if not source:
    raise SystemExit("source_file missing in yaml")
source_path = Path(source).expanduser()
if not source_path.is_file():
    raise SystemExit(f"source not found: {source_path}")

out_dir = yaml_path.parent / "clips" / yaml_path.stem.replace(".clips", "")
out_dir.mkdir(parents=True, exist_ok=True)

crf = None
preset = None
scale = None
fade_in = None
fade_out = None
pad_sec = None
def scalar(line):
    val = line.split(":", 1)[1]
    if '"' in val:
        val = val.split('"')[1]
    else:
        val = val.split("#")[0].strip()
    return val

for line in text.splitlines():
    if line.strip().startswith("crf:"):
        crf = scalar(line)
    if line.strip().startswith("preset:"):
        preset = scalar(line)
    if line.strip().startswith("scale:"):
        preset_val = scalar(line)
        if "force_original" in preset_val or "pad=" in preset_val:
            scale = preset_val
    if line.strip().startswith("fade_in_sec:"):
        fade_in = scalar(line)
    if line.strip().startswith("fade_out_sec:"):
        fade_out = scalar(line)
    if line.strip().startswith("pad_sec:"):
        pad_sec = scalar(line)

crf = crf or "20"
preset = preset or "slow"
scale = scale or "1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2"
fade_in = fade_in or "0.5"
fade_out = fade_out or "0.5"
pad = float(pad_sec or "0")

for clip_id, start, end, out_name, fade_flag in parse_clips(text):
    t0 = max(0.0, to_seconds(start) - pad)
    t1 = to_seconds(end) + pad
    dur = t1 - t0
    if dur <= 0:
        raise SystemExit(f"bad range {clip_id}: {start} -> {end}")
    out = out_dir / (out_name or f"{clip_id}.mp4")
    vf = f"scale={scale}"
    af = "anull"
    if fade_flag and fade_flag.lower() != "false":
        st_out = max(0.0, dur - float(fade_out))
        af = f"afade=t=in:st=0:d={fade_in},afade=t=out:st={st_out}:d={fade_out}"
        vf += f",fade=t=in:st=0:d={fade_in},fade=t=out:st={st_out}:d={fade_out}"
    cmd = [
        "ffmpeg", "-y",
        "-ss", f"{t0:.2f}", "-to", f"{t1:.2f}",
        "-i", str(source_path),
        "-vf", vf,
        "-af", af,
        "-c:v", "libx264", "-crf", crf, "-preset", preset,
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart",
        str(out),
    ]
    print(" ".join(cmd))
    subprocess.run(cmd, check=True)
    print(f"wrote {out}")
PY
