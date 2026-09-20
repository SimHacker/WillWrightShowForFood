#!/usr/bin/env bash
# Reload shared Caddy config. Validates first, and never drops a connection.
#
# Usage:
#   bash scripts/reload-ingress.sh              # validate, then reload
#   bash scripts/reload-ingress.sh --validate   # validate only
#   bash scripts/reload-ingress.sh --recreate   # last resort, interrupts TLS briefly
#
# Caddy is shared ingress: it terminates TLS for ebike-safari and serves HyperTIES. So this
# is the one operation on the VM that can affect every site at once, which is why it is its
# own script and not folded into an app deploy.
#
# `caddy reload` swaps config in the running process with no downtime, so a Caddyfile edit
# costs nothing. Recreating the container is what interrupts TLS, and is only needed when
# compose itself changed -- image, ports, volumes.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_DIR="$REPO/apps/ebike-safari/deploy"
CONFIG=/etc/caddy/Caddyfile

MODE=reload
case "${1:-}" in
--validate) MODE=validate ;;
--recreate) MODE=recreate ;;
-h | --help)
	sed -n '2,16p' "$0" | sed 's/^# \{0,1\}//'
	exit 0
	;;
"") ;;
*)
	echo "Unknown option: $1" >&2
	exit 2
	;;
esac

cd "$COMPOSE_DIR"
set -a
# shellcheck disable=SC1091
[[ -f .env ]] && source .env
set +a

# Validate in a THROWAWAY container built from the compose service, not in the running one.
# Three reasons, all of which bit: the config lives at container paths, so validating on the
# host checks a different filesystem; the running container may predate a mount this config
# needs, so it would validate the old world; and `compose run` publishes no ports, so this
# cannot collide with the Caddy currently holding 443.
#
# Validating before a reload matters more here than usual, because Caddy is shared ingress: a
# config error does not break one site, it breaks TLS for all of them.
echo "Validating $CONFIG…"
docker compose run --rm --no-deps caddy caddy validate --config "$CONFIG"
echo "Config is valid."
[[ "$MODE" == validate ]] && exit 0

if [[ "$MODE" == recreate ]]; then
	echo "Recreating caddy — every site on this VM will see a brief TLS interruption."
	# --no-deps or compose recreates the viewer too, because caddy depends_on it and its
	# container predates the current compose file. An ingress operation restarting an app is
	# the collateral redeploy this whole refactor exists to stop, so say no explicitly.
	docker compose up -d --force-recreate --no-deps caddy
else
	echo "Reloading in place (no downtime)…"
	docker compose exec -T caddy caddy reload --config "$CONFIG"
fi

echo
echo "Verify:"
echo "  curl -sI https://hyperties.org | head -1"
echo "  curl -sI https://hyperties.net | head -1   # expect 301 to .org"
echo "  curl -sI https://${DOMAIN:-ebike-safari.com} | head -1"
