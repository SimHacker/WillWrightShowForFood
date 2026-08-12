#!/usr/bin/env bash
# Run on the VM: git pull + rebuild viewer + restart stack.
# Usage: sudo bash scripts/server-deploy.sh [git-ref]
set -euo pipefail

REPO_DIR="${REPO_DIR:-/opt/WillWrightShowForFood}"
APP_DIR="${APP_DIR:-${REPO_DIR}/apps/ebike-safari}"
DEPLOY_DIR="${DEPLOY_DIR:-${APP_DIR}/deploy}"
GIT_REF="${1:-}"

if [[ $EUID -ne 0 ]]; then
	echo "Run with sudo"
	exit 1
fi

if [[ ! -d "$REPO_DIR/.git" ]]; then
	echo "Missing git checkout at $REPO_DIR — run server-install.sh first"
	exit 1
fi

cd "$REPO_DIR"
git fetch origin
if [[ -n "$GIT_REF" ]]; then
	git checkout "$GIT_REF"
else
	git pull --ff-only origin "$(git rev-parse --abbrev-ref HEAD)"
fi

cd "$DEPLOY_DIR"
if [[ ! -f .env ]]; then
	echo "Missing ${DEPLOY_DIR}/.env — run server-install.sh first"
	exit 1
fi

mkdir -p data

set -a
# shellcheck disable=SC1091
source .env
set +a

echo "Building viewer on VM (native amd64)…"
docker compose build viewer

echo "Restarting stack…"
docker compose up -d

echo "Done. Check: curl -s http://127.0.0.1/api/health"
