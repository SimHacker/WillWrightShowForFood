#!/usr/bin/env bash
# Build apps. With no arguments, every app that has a build.
#
# Usage:
#   bash scripts/build-all.sh                  # all of them
#   bash scripts/build-all.sh hyperties        # just one
#   bash scripts/build-all.sh --list
#
# Builds never touch what is serving. A build stages output or produces an image; making it
# live is deploy-all.sh. That split is what lets CI build on every push while deploys stay
# something a person asks for by name.
set -euo pipefail

# shellcheck source=lib/apps.sh
source "$(dirname "$0")/lib/apps.sh"

case "${1:-}" in
--list)
	echo "Apps with a build:"
	apps_with build | sed 's/^/  /'
	exit 0
	;;
-h | --help)
	sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
	exit 0
	;;
esac

read_apps build "$@"
run_phase build "${RESOLVED_APPS[@]}"
