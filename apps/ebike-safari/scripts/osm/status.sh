#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OSM_DIR="${OSM_DATA_DIR:-${ROOT}/deploy/osm}"

echo "OSM data dir: ${OSM_DIR}"
echo ""
echo "=== raw ==="
ls -lh "${OSM_DIR}/raw/" 2>/dev/null || echo "(empty)"
echo ""
echo "=== filtered ==="
ls -lh "${OSM_DIR}/filtered/" 2>/dev/null || echo "(empty)"
echo ""
if command -v docker >/dev/null && [[ -f "${ROOT}/deploy/.env" ]]; then
	set -a
	# shellcheck disable=SC1091
	source "${ROOT}/deploy/.env"
	set +a
	docker compose -f "${ROOT}/deploy/docker-compose.yml" exec -T db \
		psql -U "${POSTGRES_USER:-ebike}" -d "${POSTGRES_DB:-ebike_safari}" \
		-c "SELECT region, count(*) AS ways FROM osm_ways GROUP BY region ORDER BY region;" 2>/dev/null \
		|| echo "(db not reachable or osm_ways empty)"
fi
