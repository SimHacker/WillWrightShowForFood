#!/usr/bin/env bash
# Run OSM pipeline inside osm-tools container (osmium + python + db network).
# Usage: bash deploy/scripts/osm-docker.sh [download|filter|import|pipeline|status|shell] [args…]
set -euo pipefail

DEPLOY="$(cd "$(dirname "$0")/.." && pwd)"
CMD="${1:-status}"
shift || true

cd "$DEPLOY"
set -a
# shellcheck disable=SC1091
source .env
set +a
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-ebike_safari}"
export OSM_DATA_DIR=/osm

compose=(docker compose -f docker-compose.yml -f docker-compose.tools.yml)

run_osm() {
	"${compose[@]}" run --rm --entrypoint /bin/bash osm-tools -lc "$*"
}

case "$CMD" in
	download)
		run_osm "bash scripts/osm/download.sh $(printf '%q ' "$@")"
		;;
	filter|import|pipeline|status)
		run_osm "bash scripts/osm/${CMD}.sh $(printf '%q ' "$@")"
		;;
	shell)
		"${compose[@]}" run --rm --entrypoint /bin/bash osm-tools
		;;
	build)
		"${compose[@]}" build osm-tools
		;;
	valhalla-up)
		mkdir -p osm/raw osm/filtered osm/valhalla
		# Valhalla reads PBF from /custom_files — symlink filtered+raw for build
		"${compose[@]}" --profile valhalla up -d valhalla
		;;
	*)
		echo "Usage: $0 {build|download|filter|import|pipeline|status|shell|valhalla-up} [args…]" >&2
		exit 1
		;;
esac
