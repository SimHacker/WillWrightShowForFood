#!/usr/bin/env bash
# Resize ebike-safari-1 machine type (stop → set → start). Disk unchanged.
# Usage: bash scripts/gcp-resize-vm.sh e2-medium|e2-standard-4
set -euo pipefail

PROJECT="${GCP_PROJECT:-ebike-safari}"
ZONE="${GCP_ZONE:-europe-west4-a}"
INSTANCE="${GCP_INSTANCE:-ebike-safari-1}"
MACHINE="${1:?Usage: $0 e2-medium|e2-standard-4}"

gcloud config set project "$PROJECT" >/dev/null
gcloud compute instances stop "$INSTANCE" --zone="$ZONE"
gcloud compute instances set-machine-type "$INSTANCE" \
	--zone="$ZONE" \
	--machine-type="$MACHINE"
gcloud compute instances start "$INSTANCE" --zone="$ZONE"
gcloud compute instances describe "$INSTANCE" --zone="$ZONE" \
	--format='table(name,machineType.basename(),status)'
