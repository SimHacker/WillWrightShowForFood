#!/usr/bin/env bash
# Stage 1: download raw Geofabrik PBF into deploy/osm/raw/
# Usage: bash scripts/osm/download.sh [nl|california|all]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OSM_DIR="${OSM_DATA_DIR:-${ROOT}/deploy/osm}"
RAW="${OSM_DIR}/raw"
TARGET="${1:-all}"

mkdir -p "$RAW"

region_url() {
	case "$1" in
		nl) echo "https://download.geofabrik.de/europe/netherlands-latest.osm.pbf netherlands-latest.osm.pbf" ;;
		california) echo "https://download.geofabrik.de/north-america/us/california-latest.osm.pbf california-latest.osm.pbf" ;;
		*) return 1 ;;
	esac
}

download_one() {
	local slug="$1"
	read -r url file <<<"$(region_url "$slug")"
	local dest="${RAW}/${file}"
	if [[ -f "$dest" ]]; then
		echo "skip ${slug}: ${dest} exists"
		return 0
	fi
	echo "download ${slug} → ${dest}"
	curl -fL --retry 3 --continue-at - -o "${dest}.part" "$url"
	mv "${dest}.part" "$dest"
	curl -fL "${url}.md5" -o "${dest}.md5" 2>/dev/null || true
	echo "done ${slug}: $(du -h "$dest" | awk '{print $1}')"
}

case "$TARGET" in
	all)
		download_one nl
		download_one california
		;;
	nl|california)
		download_one "$TARGET"
		;;
	*)
		echo "Usage: $0 [nl|california|all]" >&2
		exit 1
		;;
esac

echo "Raw PBF in ${RAW}"
