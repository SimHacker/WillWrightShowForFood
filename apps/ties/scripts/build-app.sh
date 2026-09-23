#!/usr/bin/env bash
# Build HyperTIES into a staged release directory. No docker, no CI vendor: this runs the
# same on a laptop and on the VM, and `deploy-app.sh` moves what it produces into place.
#
# Usage:
#   bash scripts/build-app.sh [--mode static|node]
#
# Env:
#   SVELTE_ADAPTER   static (default) or node. Same variable the viewer uses, on purpose.
#   RELEASE_ID       override the release name (defaults to the short commit sha)
#   RELEASE_ROOT     where releases live ($DATA_ROOT/releases on a server, ./.releases otherwise)
#
# THE NODE FLAG
#
# Today HyperTIES prerenders to files and Caddy serves them, so there is no process to run.
# Set SVELTE_ADAPTER=node and the same source builds a server instead, because the jump is
# an adapter choice rather than a rewrite. What forces that jump is a same-origin proxy
# (gwern .md, include-ranges, annotation fragments — CORS) and saved/shared views.
# Until those ship, static is cheaper and cannot fall over.
# Framing: moollm/designs/webtop/hyperties/THE-GOOD-PARTS.md
# Caddy for that mode: deploy/hyperties-node.Caddyfile
set -euo pipefail

APP="hyperties"
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO="$(cd "$APP_DIR/../.." && pwd)"
# shellcheck source=../../../scripts/lib/release.sh
source "$REPO/scripts/lib/release.sh"

MODE="${SVELTE_ADAPTER:-static}"
while [[ $# -gt 0 ]]; do
	case "$1" in
	--mode)
		MODE="${2:?--mode needs static or node}"
		shift 2
		;;
	-h | --help)
		sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
		exit 0
		;;
	*)
		echo "Unknown argument: $1" >&2
		exit 2
		;;
	esac
done

case "$MODE" in
static | node) ;;
*)
	echo "--mode must be static or node, got: $MODE" >&2
	exit 2
	;;
esac

cd "$APP_DIR"

ID="$(release_id)"
STAGE="$(stage_dir "$APP" "$ID")"

echo "Building $APP $ID (adapter: $MODE)"

# A lockfile that disagrees with package.json should fail the build rather than be quietly
# rewritten, but only where nobody can react to it. On a laptop mid-change, resolving is the
# helpful behaviour. Every CI system sets CI=true, which is why the check is not vendor-specific.
if [[ -n "${CI:-}" ]]; then
	pnpm install --frozen-lockfile
else
	pnpm install
fi

# Workspace packages export from their gitignored dist/, so a fresh checkout has to build
# them first. "ties^..." is every workspace package ties depends on, not ties itself.
pnpm --filter "ties^..." run build

SVELTE_ADAPTER="$MODE" pnpm build

rm -rf "$STAGE"
mkdir -p "$STAGE"

if [[ "$MODE" == "static" ]]; then
	# Prerendered files sit at the release root, so Caddy's root can be `current` with no
	# knowledge of how the build was produced.
	cp -a build/. "$STAGE/"
else
	# A server release carries its own dependencies. node_modules is built here rather than
	# copied from elsewhere because it must match the platform that will run it -- which is
	# the reason deploy builds happen on the VM and not on a Mac.
	cp -a build "$STAGE/build"
	cp -a node_modules "$STAGE/node_modules"
	cp -a package.json "$STAGE/package.json"
fi

# What is serving, recorded next to what is served. Answers "which commit is live" without a
# deploy log, and survives being copied somewhere else.
cat >"$STAGE/RELEASE.txt" <<EOF
app: $APP
release: $ID
adapter: $MODE
commit: $(git -C "$REPO" rev-parse HEAD 2>/dev/null || echo unknown)
built_at: $(date -u '+%Y-%m-%dT%H:%M:%SZ')
built_on: $(uname -s)/$(uname -m)
EOF

record_staged "$APP" "$ID"

if [[ "$MODE" == "node" ]]; then
	# Same id on the image and the file tree. Built on linux — do not ship a Mac image.
	echo "Building image wwsff/hyperties:$ID"
	docker build -t "wwsff/hyperties:$ID" -t wwsff/hyperties:latest -f "$APP_DIR/deploy/Dockerfile" "$APP_DIR"
fi

echo "Staged: $STAGE"
