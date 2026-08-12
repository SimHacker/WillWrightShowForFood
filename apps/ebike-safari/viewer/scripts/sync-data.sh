#!/usr/bin/env bash
# Copy pipeline output into static/data for viewer + Capacitor build.
# Override source: EBIKE_DATA_DIR=/path/to/web/data pnpm run sync:data
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_ROOT="$(cd "$ROOT/.." && pwd)"
SRC="${EBIKE_DATA_DIR:-$APP_ROOT/demo/web/data}"
DST="$ROOT/static/data"
mkdir -p "$DST"
rsync -a --delete "$SRC/" "$DST/"
echo "Synced $SRC -> $DST"
