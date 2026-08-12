#!/usr/bin/env bash
# Stage 2: filter raw PBF → deploy/osm/filtered/{region}-ways.osm.pbf
# Usage: bash scripts/osm/filter.sh [nl|california|all]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OSM_DIR="${OSM_DATA_DIR:-${ROOT}/deploy/osm}"
RAW="${OSM_DIR}/raw"
OUT="${OSM_DIR}/filtered"
TARGET="${1:-all}"

mkdir -p "$OUT"

region_file() {
	case "$1" in
		nl) echo "netherlands-latest.osm.pbf" ;;
		california) echo "california-latest.osm.pbf" ;;
		*) return 1 ;;
	esac
}

filter_one() {
	local slug="$1"
	local src_file out_file
	src_file="$(region_file "$slug")"
	out_file="${slug}-ways.osm.pbf"
	local src="${RAW}/${src_file}"
	local dest="${OUT}/${out_file}"
	if [[ ! -f "$src" ]]; then
		echo "missing ${src} — run download.sh ${slug}" >&2
		exit 1
	fi
	if [[ -f "$dest" ]]; then
		echo "skip ${slug}: ${dest} exists (rm to redo)"
		return 0
	fi
	echo "filter ${slug} → ${dest}"
	osmium tags-filter "$src" \
		w/highway w/cycleway w/waterway w/natural=coastline w/barrier \
		--overwrite -o "$dest"
	if [[ ! -s "$dest" ]]; then
		echo "filter failed: empty output ${dest}" >&2
		exit 1
	fi
	osmium fileinfo -e "$dest" >/dev/null
	echo "done ${slug}: $(du -h "$dest" | awk '{print $1}')"
}

case "$TARGET" in
	all)
		filter_one nl
		filter_one california
		;;
	nl|california)
		filter_one "$TARGET"
		;;
	*)
		echo "Usage: $0 [nl|california|all]" >&2
		exit 1
		;;
esac

echo "Filtered PBF in ${OUT}"
