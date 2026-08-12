#!/usr/bin/env bash
# Build and start the production stack from apps/ebike-safari/deploy/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
	echo "Missing .env — copy from .env.example and set secrets:"
	echo "  cp .env.example .env && chmod 600 .env"
	exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

if [[ "${POSTGRES_PASSWORD:-}" == *change-me* ]] || [[ -z "${POSTGRES_PASSWORD:-}" ]]; then
	echo "Set a strong POSTGRES_PASSWORD in .env before deploying."
	exit 1
fi

if [[ "${ACME_EMAIL:-you@example.com}" == "you@example.com" ]]; then
	echo "Set ACME_EMAIL in .env for Let's Encrypt."
	exit 1
fi

echo "Building viewer image…"
docker compose build viewer

echo "Starting stack…"
docker compose up -d

echo ""
echo "Stack up. Check:"
echo "  docker compose ps"
echo "  docker compose logs -f caddy viewer"
echo ""
echo "After DNS points to this VM:"
echo "  curl -s https://${DOMAIN}/api/health"
