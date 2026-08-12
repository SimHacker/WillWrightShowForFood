#!/usr/bin/env bash
# Build viewer on Mac and push to Artifact Registry.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# shellcheck disable=SC1091
[[ -f .env ]] && source .env

PROJECT="${GCP_PROJECT:-ebike-safari}"
REGION="${GCP_REGION:-europe-west4}"
REPO="${AR_REPO:-ebike-safari}"
TAG="${1:-latest}"

IMAGE="${REGION}-docker.pkg.dev/${PROJECT}/${REPO}/viewer:${TAG}"

gcloud config set project "$PROJECT" >/dev/null
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

echo "Building ${IMAGE} …"
docker build \
	-f Dockerfile.viewer \
	-t "$IMAGE" \
	..

echo "Pushing …"
docker push "$IMAGE"

echo ""
echo "Done. On the VM, set in .env:"
echo "  VIEWER_IMAGE=${IMAGE}"
echo "Then:"
echo "  docker compose -f docker-compose.yml -f docker-compose.ar.yml pull viewer"
echo "  docker compose -f docker-compose.yml -f docker-compose.ar.yml up -d"
