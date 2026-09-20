#!/usr/bin/env bash
# Recreate the ebike-safari viewer from its built image.
#
# Usage: bash scripts/deploy-app.sh [--build]
#
# Scoped to the viewer on purpose. Bringing the whole stack up would recreate Caddy, which
# terminates TLS for HyperTIES as well, so a viewer deploy would interrupt an unrelated site.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_DIR="$APP_DIR/deploy"

DO_BUILD=0
[[ "${1:-}" == "--build" ]] && DO_BUILD=1

cd "$DEPLOY_DIR"

if [[ ! -f .env ]]; then
	echo "Missing $DEPLOY_DIR/.env" >&2
	exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

[[ $DO_BUILD -eq 1 ]] && bash "$APP_DIR/scripts/build-app.sh"

mkdir -p "$DEPLOY_DIR/data"

# Start anything that is down (db, and caddy on a cold VM) without disturbing what is already
# running, so a scoped deploy still has its dependencies.
echo "Ensuring dependencies are up…"
docker compose up -d --no-recreate

echo "Recreating viewer…"
docker compose up -d --force-recreate viewer

echo
echo "Verify:"
echo "  docker compose ps"
echo "  curl -s https://${DOMAIN:-ebike-safari.com}/api/health"
