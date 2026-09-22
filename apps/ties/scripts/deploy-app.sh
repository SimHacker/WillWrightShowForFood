#!/usr/bin/env bash
# Publish a staged HyperTIES build and make it live by swapping a symlink.
#
# Usage:
#   bash scripts/deploy-app.sh [--build] [--rollback <id>] [--list]
#
# Options:
#   --build           Run build-app.sh first instead of requiring a staged build.
#   --rollback <id>   Point `current` at an existing release. No rebuild.
#   --list            Show releases and which one is live.
#
# There is no HyperTIES container. The build is prerendered files, Caddy is the official
# upstream image with no Dockerfile of ours, and the release directory is bind-mounted in.
# So a deploy is a symlink rename and nothing restarts -- which is why it is atomic and why
# rollback costs nothing.
set -euo pipefail

APP="hyperties"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$APP_DIR/../.." && pwd)"
# shellcheck source=../../../scripts/lib/release.sh
source "$REPO/scripts/lib/release.sh"

DO_BUILD=0
ROLLBACK=""
while [[ $# -gt 0 ]]; do
	case "$1" in
	--build)
		DO_BUILD=1
		shift
		;;
	--rollback)
		ROLLBACK="${2:?--rollback needs a release id}"
		shift 2
		;;
	--list)
		echo "$APP releases in $(app_root "$APP"):"
		list_releases "$APP"
		exit 0
		;;
	-h | --help)
		sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
		exit 0
		;;
	*)
		echo "Unknown argument: $1" >&2
		exit 2
		;;
	esac
done

if [[ -n "$ROLLBACK" ]]; then
	activate_release "$APP" "$ROLLBACK"
	echo "Rolled back to $ROLLBACK"
	exit 0
fi

if [[ $DO_BUILD -eq 1 ]]; then
	bash "$APP_DIR/scripts/build-app.sh"
fi

# Deploy what was built, not what this process would have named a build. An explicit
# RELEASE_ID still wins; otherwise take the id build-app.sh recorded, and only fall back to
# computing one when there is no record at all.
if [[ -n "${RELEASE_ID:-}" ]]; then
	ID="$RELEASE_ID"
elif ID="$(last_staged "$APP")" && [[ -n "$ID" ]]; then
	:
else
	ID="$(release_id)"
fi

STAGE="$(stage_dir "$APP" "$ID")"
if [[ ! -d "$STAGE" ]]; then
	if [[ -d "$(release_path "$APP" "$ID")" ]]; then
		# Already published, so this is a re-point rather than an error. Happens when deploy
		# runs twice on one commit.
		activate_release "$APP" "$ID"
		echo "Re-pointed at existing release $ID"
		exit 0
	fi
	echo "Nothing staged for $ID. Run with --build, or run scripts/build-app.sh first." >&2
	exit 1
fi

mkdir -p "$(app_root "$APP")/releases"
publish_release "$APP" "$ID" >/dev/null
activate_release "$APP" "$ID"
prune_releases "$APP"

COMPOSE="$REPO/apps/ebike-safari/deploy/docker-compose.yml"
if docker image inspect "wwsff/hyperties:$ID" >/dev/null 2>&1; then
	echo "Recreating hyperties container (image $ID)…"
	mkdir -p "${DATA_ROOT:-/data}/hyperties/cache"
	HYPERTIES_RELEASE="$ID" docker compose -f "$COMPOSE" up -d --no-deps --force-recreate hyperties
else
	echo "No image wwsff/hyperties:$ID — files only. Caddy still serves current."
fi

echo
echo "hyperties $ID is live."
echo "Articles are the symlink. /proxy /view /api are the container, if the image exists."
echo "Verify:"
echo "  curl -sI https://hyperties.org | head -1"
echo "  curl -sI https://hyperties.org/proxy/gwern/xanadu.md | head -1"
echo "  cat $(app_root "$APP")/current/RELEASE.txt"
