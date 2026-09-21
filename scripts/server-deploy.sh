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

# Releases live on the DATA DISK, outside the checkout, so a rollback target survives both
# anything done to git and the VM being deleted. If $DATA_ROOT is not a mount point the deploy
# refuses: writing releases onto the boot disk is how state ends up on cattle, and a loud stop
# beats a silent fallback that works until the day it matters.
DATA_ROOT="${DATA_ROOT:-/data}"
RELEASE_ROOT="${RELEASE_ROOT:-$DATA_ROOT/releases}"

if ! mountpoint -q "$DATA_ROOT" 2>/dev/null; then
	echo "REFUSING TO DEPLOY: $DATA_ROOT is not a mounted filesystem." >&2
	echo >&2
	echo "That means the data disk is missing, and deploying would write state onto the boot" >&2
	echo "disk, which is the one thing this setup exists to prevent. Attach it:" >&2
	echo >&2
	echo "  gcloud compute instances attach-disk \$(hostname -s) --disk=wwsff-data \\" >&2
	echo "    --device-name=data --zone=europe-west4-a --project=ebike-safari" >&2
	echo "  sudo bash scripts/server-setup.sh --only disk" >&2
	echo >&2
	echo "To deploy somewhere else on purpose, set DATA_ROOT explicitly. See server/README.md." >&2
	exit 1
fi

mkdir -p "$RELEASE_ROOT"
export RELEASE_ROOT DATA_ROOT

exec bash "$REPO/scripts/deploy-all.sh" --pull --build "$@"
