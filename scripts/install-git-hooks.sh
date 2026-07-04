#!/bin/sh
# Remove pre-push hook if present. No blocking hooks installed.
set -e
root="$(cd "$(dirname "$0")/.." && pwd)"
dest="$root/.git/hooks/pre-push"
if [ -f "$dest" ]; then
	rm -f "$dest"
	echo "Removed pre-push hook."
else
	echo "No pre-push hook installed."
fi
