#!/usr/bin/env bash
# Build the ebike-safari viewer image.
#
# Usage: bash scripts/build-app.sh
#
# WHY THIS ONE STILL BUILDS AN IMAGE WHILE HYPERTIES DOES NOT
#
# HyperTIES prerenders to files, so its release is a directory Caddy can serve and a deploy is
# a symlink swap. The viewer is a running Node process with its own HTTP server (server.js,
# so Socket.IO can share the port with SvelteKit) and a node_modules tree that must match the
# platform it runs on. That can move to host-build-plus-bind-mount too, and should, but it is
# a separate change with a separate risk: get it wrong and the site is a process that will not
# start, rather than a directory that is briefly stale.
#
# Compose only builds during `up` when an image is missing, so building explicitly here is the
# whole point of the file. Without it a changed build context keeps serving the old image.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEPLOY_DIR="$APP_DIR/deploy"

cd "$DEPLOY_DIR"

if [[ ! -f .env ]]; then
	echo "Missing $DEPLOY_DIR/.env — copy .env.example and set secrets." >&2
	exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

echo "Building viewer image…"
docker compose build viewer
echo "Built. Deploy it with scripts/deploy-app.sh"
