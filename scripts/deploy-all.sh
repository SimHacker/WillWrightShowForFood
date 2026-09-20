#!/usr/bin/env bash
# Make built apps live. With no app named, every app that has a deploy.
#
# Usage:
#   bash scripts/deploy-all.sh                      # deploy everything already built
#   bash scripts/deploy-all.sh hyperties            # one app
#   bash scripts/deploy-all.sh --pull --build       # the whole VM cycle: pull, build, deploy
#   bash scripts/deploy-all.sh --ref v1.2 --build hyperties
#   bash scripts/deploy-all.sh --list
#
# Options:
#   --pull        git fetch + checkout before building. Server use.
#   --ref <ref>   With --pull, deploy this ref instead of origin/main.
#   --build       Build first. Without it, deploys whatever is already staged or imaged.
#   --list        Apps, and what each one's deploy actually does.
#
# CI-system independent on purpose. GitHub Actions, a cron job and a person on the box all
# call this same file with the same arguments, so the thing CI does is the thing you can
# reproduce by hand when CI is the problem.
set -euo pipefail

# shellcheck source=lib/apps.sh
source "$(dirname "$0")/lib/apps.sh"
REPO="$(cd "$(dirname "$0")/.." && pwd)"

PULL=0
BUILD=0
REF=""
APPS=()

while [[ $# -gt 0 ]]; do
	case "$1" in
	--pull)
		PULL=1
		shift
		;;
	--build)
		BUILD=1
		shift
		;;
	--ref)
		REF="${2:?--ref needs a git ref}"
		shift 2
		;;
	--list)
		echo "Apps with a deploy:"
		apps_with deploy | sed 's/^/  /'
		echo
		echo "What each deploy does:"
		echo "  hyperties     — swaps a symlink. Caddy follows it per request, so nothing restarts."
		echo "  ebike-safari  — recreates the viewer container from its image. Brief 502s."
		echo
		echo "Neither one recreates Caddy, so neither interrupts TLS for the other site."
		echo "A Caddyfile change is scripts/reload-ingress.sh, which is a graceful reload."
		exit 0
		;;
	-h | --help)
		sed -n '2,19p' "$0" | sed 's/^# \{0,1\}//'
		exit 0
		;;
	-*)
		echo "Unknown option: $1" >&2
		exit 2
		;;
	*)
		APPS+=("$1")
		shift
		;;
	esac
done

# Resolve names before pulling or building, so a typo costs nothing instead of leaving the
# checkout moved and nothing deployed.
read_apps deploy ${APPS[@]+"${APPS[@]}"}
TARGETS=("${RESOLVED_APPS[@]}")

if [[ $PULL -eq 1 ]]; then
	cd "$REPO"
	echo "=== pull ==="
	git fetch --prune origin
	if [[ -n "$REF" ]]; then
		git checkout --detach "$REF"
	else
		git checkout main
		git reset --hard origin/main
	fi
	git --no-pager log -1 --format='at %h %s (%an, %ar)'
fi

if [[ $BUILD -eq 1 ]]; then
	bash "$REPO/scripts/build-all.sh" "${TARGETS[@]}"
fi

run_phase deploy "${TARGETS[@]}"
