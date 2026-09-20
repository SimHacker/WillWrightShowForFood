#!/usr/bin/env bash
# Trigger a deploy on the VM from your laptop. Thin on purpose.
#
# Every argument is forwarded verbatim to server-deploy.sh, which owns the pull, the build and
# the deploy. This file knows one thing only: which machine. Apps are discovered from the
# filesystem on the far end, so adding one changes nothing here.
#
# Usage:
#   bash scripts/deploy-remote.sh hyperties
#   bash scripts/deploy-remote.sh ebike-safari hyperties
#   bash scripts/deploy-remote.sh --ref v1.2.3 ebike-safari
#   bash scripts/deploy-remote.sh --list
set -euo pipefail

PROJECT="${GCP_PROJECT:-ebike-safari}"
ZONE="${GCP_ZONE:-europe-west4-a}"
INSTANCE="${GCP_INSTANCE:-ebike-safari-1}"
REPO_DIR="${REPO_DIR:-/opt/WillWrightShowForFood}"
REMOTE_SCRIPT="${REPO_DIR}/scripts/server-deploy.sh"

if [[ $# -eq 0 ]]; then
	echo "Name an app. To see what exists:" >&2
	echo "  bash scripts/deploy-remote.sh --list" >&2
	exit 2
fi

# Quote each argument so refs and flags survive the trip through ssh's remote shell.
REMOTE_ARGS=""
for arg in "$@"; do
	REMOTE_ARGS="${REMOTE_ARGS} $(printf '%q' "$arg")"
done

echo "Deploying to ${INSTANCE} (${ZONE}):${REMOTE_ARGS}"
exec gcloud compute ssh "$INSTANCE" \
	--zone="$ZONE" \
	--project="$PROJECT" \
	--command="sudo bash ${REMOTE_SCRIPT}${REMOTE_ARGS}"
