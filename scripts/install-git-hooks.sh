#!/bin/sh
# Point git at the repo's checked-in hooks (.githooks/) so commits and pushes
# run the same YAML verification as CI. Runs automatically via pnpm prepare.
set -e
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit .githooks/pre-push
echo "Git hooks installed (core.hooksPath = .githooks)."
