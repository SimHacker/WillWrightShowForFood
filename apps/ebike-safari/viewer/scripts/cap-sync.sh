#!/usr/bin/env bash
# Capacitor needs Node 22+ (Cap CLI). Dev/build work on Node 20 with .npmrc.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/viewer"
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck source=/dev/null
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 22
pnpm run sync:data
pnpm run build
npx cap sync ios
echo "Open Xcode: pnpm run cap:ios"
