#!/bin/sh
# Install repo git hooks (pre-push → pnpm run verify). Idempotent.
set -e
root="$(cd "$(dirname "$0")/.." && pwd)"
hooks_dir="$root/.git/hooks"
src="$root/scripts/hooks/pre-push"
dest="$hooks_dir/pre-push"

if [ ! -d "$hooks_dir" ]; then
	echo "install-git-hooks: not a git repo ($hooks_dir missing)" >&2
	exit 1
fi
if [ ! -f "$src" ]; then
	echo "install-git-hooks: missing $src" >&2
	exit 1
fi
cp "$src" "$dest"
chmod +x "$dest"
echo "Installed pre-push hook → pnpm run verify"
