#!/usr/bin/env bash
# Everything PR Checks does. Run it locally to find out what CI will say:
#
#   bash scripts/ci-verify.sh
#
# The workflow provisions toolchains and then calls this. Adding a check means editing this
# file, where you can run it, rather than a YAML file you can only test by pushing.
#
# Options:
#   --no-install   Skip dependency installation and only run the checks.
set -euo pipefail

cd "$(dirname "$0")/.."

INSTALL=1
# `if`, not `[[ ... ]] && INSTALL=0`: under `set -e` the test failing is a nonzero command and
# would end the script before a single check ran, whenever the flag was absent.
if [[ "${1:-}" == "--no-install" ]]; then
	INSTALL=0
fi

if [[ $INSTALL -eq 1 ]]; then
	# --frozen-lockfile in CI so a stale lockfile fails instead of being silently updated.
	# Locally an out-of-date lockfile is a normal state mid-work, so let pnpm resolve it.
	if [[ -n "${CI:-}" ]]; then
		pnpm install --frozen-lockfile
	else
		pnpm install
	fi
	pip install -q -r requirements.txt
fi

pnpm run verify:yaml

# Build every app that has a build. Catching a broken build here is the point: a deploy pulls
# and builds on the VM, so without this the first thing to discover a compile error is
# production. Deliberately `pnpm -r`, not scripts/build-all.sh -- the app build scripts stage
# releases and the viewer's needs docker and a secrets file, neither of which belongs in a PR
# check. Same compilers, no deploy side effects.
pnpm run build

echo "verify: ok"
