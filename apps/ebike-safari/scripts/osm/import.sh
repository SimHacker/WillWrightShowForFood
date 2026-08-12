#!/usr/bin/env bash
# Stage 3: load filtered PBF into PostGIS
# Usage: bash scripts/osm/import.sh [nl|california|all]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TARGET="${1:-all}"

if [[ -z "${DATABASE_URL:-}" ]]; then
	if [[ -f "${ROOT}/deploy/.env" ]]; then
		set -a
		# shellcheck disable=SC1091
		source "${ROOT}/deploy/.env"
		set +a
		export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-ebike_safari}"
	fi
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
	echo "Set DATABASE_URL or deploy/.env" >&2
	exit 1
fi

export OSM_DATA_DIR="${OSM_DATA_DIR:-${ROOT}/deploy/osm}"

run_sql() {
	psql "$DATABASE_URL" -v ON_ERROR_STOP=1 "$@"
}

echo "Apply schema patch 005_osm_region.sql (idempotent)…"
run_sql < "${ROOT}/db/init/005_osm_region.sql"

import_one() {
	local slug="$1"
	echo "=== import ${slug} ==="
	python3 "${ROOT}/scripts/osm/import_osm_ways.py" --region "$slug"
}

case "$TARGET" in
	all)
		import_one nl
		import_one california
		;;
	nl|california)
		import_one "$TARGET"
		;;
	*)
		echo "Usage: $0 [nl|california|all]" >&2
		exit 1
		;;
esac

echo "Row counts:"
run_sql -c "SELECT region, count(*) FROM osm_ways GROUP BY region ORDER BY region;"
