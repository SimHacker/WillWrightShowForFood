#!/usr/bin/env bash
# Copy pipeline output into static/data for local dev + Docker build fallback.
# Production serves deploy/data/ via bind mount (see deploy/docker-compose.yml).
# Override source: EBIKE_DATA_DIR=/path/to/web/data pnpm run sync:data
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_ROOT="$(cd "$ROOT/.." && pwd)"
SRC="${EBIKE_DATA_DIR:-$APP_ROOT/demo/web/data}"
DST="$ROOT/static/data"
mkdir -p "$DST"
find "$DST" -mindepth 1 -delete 2>/dev/null || true
cp -a "$SRC/." "$DST/"
echo "Copied $SRC -> $DST"
