#!/usr/bin/env bash
# The VM's deploy entry point. Pull, build, make live — for the apps you name and no others.
#
# Usage:
#   sudo bash scripts/server-deploy.sh hyperties
#   sudo bash scripts/server-deploy.sh ebike-safari hyperties
#   sudo bash scripts/server-deploy.sh --ref v1.2.3 ebike-safari
#   sudo bash scripts/server-deploy.sh --list
#
# Thin by design. Everything below this file is CI-system independent: this adds the two
# things that are true only on a server (the release root must exist, and deploys default to
# origin/main) and then hands off to scripts/deploy-all.sh, which GitHub Actions, cron and a
# person at an ssh prompt all call the same way.
#
# NOTHING DEPLOYS UNLESS YOU NAME IT. There was a version of this file that built one service
# and silently skipped the other, which is how a Caddyfile fix stayed undeployed while
# hyperties.org was down. Named targets and an explicit build step are the fix for that class
# of bug: a deploy that did not happen should be a thing you asked for, not a surprise.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"

if [[ $# -eq 0 ]]; then
	echo "Name an app. To see what exists:" >&2
	echo "  bash scripts/server-deploy.sh --list" >&2
	exit 2
fi

# Releases live outside the checkout so a rollback target survives anything done to git.
# Created here rather than in an installer, because the first deploy after this refactor
# lands on a VM that has never had one.
RELEASE_ROOT="${RELEASE_ROOT:-/srv/wwsff}"
if [[ ! -d "$RELEASE_ROOT" ]]; then
	echo "Creating release root $RELEASE_ROOT"
	mkdir -p "$RELEASE_ROOT"
fi
export RELEASE_ROOT

exec bash "$REPO/scripts/deploy-all.sh" --pull --build "$@"
