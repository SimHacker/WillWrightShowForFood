#!/usr/bin/env bash
# Sync optional ride data volume into the built static client tree before start.
set -euo pipefail

DATA_MOUNT="${EBIKE_DATA_MOUNT:-/data}"
CLIENT_DATA="/app/build/client/data"

if [[ -d "$DATA_MOUNT" ]] && [[ -f "$DATA_MOUNT/manifest.json" ]]; then
	echo "Syncing ride data from $DATA_MOUNT -> $CLIENT_DATA"
	mkdir -p "$CLIENT_DATA"
	rsync -a --delete "$DATA_MOUNT/" "$CLIENT_DATA/"
else
	echo "No ride data at $DATA_MOUNT (using demo data from image build)"
fi

exec "$@"
