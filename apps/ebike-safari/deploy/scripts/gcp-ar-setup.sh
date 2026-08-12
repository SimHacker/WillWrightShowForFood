#!/usr/bin/env bash
# One-time: enable APIs, create Artifact Registry repo ebike-safari, configure Docker auth.
# Requires: billing linked on project ebike-safari, gcloud auth as simhacker@gmail.com
set -euo pipefail

PROJECT="${GCP_PROJECT:-ebike-safari}"
REGION="${GCP_REGION:-europe-west4}"
REPO="${AR_REPO:-ebike-safari}"

gcloud config set project "$PROJECT"

echo "Enabling APIs…"
gcloud services enable \
	artifactregistry.googleapis.com \
	compute.googleapis.com \
	dns.googleapis.com \
	--project="$PROJECT"

echo "Creating Artifact Registry docker repo: $REPO ($REGION)…"
if gcloud artifacts repositories describe "$REPO" \
	--location="$REGION" --project="$PROJECT" &>/dev/null; then
	echo "Repository $REPO already exists."
else
	gcloud artifacts repositories create "$REPO" \
		--repository-format=docker \
		--location="$REGION" \
		--description="Ebike Safari viewer images" \
		--project="$PROJECT"
fi

gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

IMAGE="${REGION}-docker.pkg.dev/${PROJECT}/${REPO}/viewer:latest"
echo ""
echo "Registry ready."
echo "  IMAGE=$IMAGE"
echo ""
echo "Add to deploy/.env:"
echo "  VIEWER_IMAGE=$IMAGE"
echo ""
echo "Build and push from Mac:"
echo "  bash scripts/build-push.sh"
