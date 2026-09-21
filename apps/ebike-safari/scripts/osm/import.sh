#!/usr/bin/env bash
# Stage 3: load filtered PBF into PostGIS
# Usage: bash scripts/osm/import.sh [nl|california|all]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TARGET="${1:-all}"

# The import creates and rewrites tables, so it connects as the SUPERUSER -- the one credential
# the application containers deliberately cannot reach. From its single file on the data disk, not
# from a combined .env. See server/SECRETS.md.
if [[ -z "${DATABASE_URL:-}" ]]; then
	# shellcheck disable=SC1091
	source "$(cd "${ROOT}/../.." && pwd)/scripts/lib/secrets.sh"
	DATABASE_URL="$(superuser_url)" || exit 1
	export DATABASE_URL
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
