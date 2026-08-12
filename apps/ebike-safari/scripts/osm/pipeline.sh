#!/usr/bin/env bash
# Run download → filter → import for one region or all
# Usage: bash scripts/osm/pipeline.sh [nl|california|all]
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-all}"

bash "${DIR}/download.sh" "$TARGET"
bash "${DIR}/filter.sh" "$TARGET"
bash "${DIR}/import.sh" "$TARGET"
