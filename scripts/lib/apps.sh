#!/usr/bin/env bash
# App discovery by convention. Sourced by scripts/build-all.sh and scripts/deploy-all.sh.
#
# An app joins the build and deploy system by containing scripts/build-app.sh or
# scripts/deploy-app.sh. There is no registry to edit, because a registry in a third file is a
# registry someone forgets: the aggregators find what exists. Adding an app is adding a
# directory, and the CI workflow that calls the aggregator never changes.

apps_root() {
	echo "$(dirname "${BASH_SOURCE[0]}")/../../apps"
}

# Apps providing the given phase ("build" or "deploy"), one per line, alphabetical.
apps_with() {
	local phase="$1" root
	root="$(cd "$(apps_root)" && pwd)"
	local d
	for d in "$root"/*/; do
		[[ -d "$d" ]] || continue
		[[ -f "${d}scripts/${phase}-app.sh" ]] && basename "$d"
	done | sort
}

app_script() {
	local app="$1" phase="$2" root
	root="$(cd "$(apps_root)" && pwd)"
	echo "$root/$app/scripts/${phase}-app.sh"
}

# The directory is apps/ties; the site, the release root and everyone's fingers say
# "hyperties". Rather than rename a directory or correct people, accept both and canonicalise
# to the directory. Postel: liberal in what you accept.
app_alias() {
	case "$1" in
	hyperties) echo ties ;;
	ebike | safari) echo ebike-safari ;;
	*) echo "$1" ;;
	esac
}

# Resolve requested names against what exists, failing before any work starts rather than
# halfway through a multi-app deploy.
resolve_apps() {
	local phase="$1"
	shift
	local available
	available="$(apps_with "$phase")"

	if [[ $# -eq 0 ]]; then
		echo "$available"
		return 0
	fi

	local app canon ok=1 resolved=()
	for app in "$@"; do
		canon="$(app_alias "$app")"
		if grep -qx "$canon" <<<"$available"; then
			resolved+=("$canon")
		else
			echo "No apps/$canon/scripts/${phase}-app.sh" >&2
			ok=0
		fi
	done
	[[ $ok -eq 1 ]] || {
		echo >&2
		echo "Apps providing ${phase}: $(tr '\n' ' ' <<<"$available")" >&2
		echo "Also accepted: hyperties (=ties), ebike or safari (=ebike-safari)" >&2
		return 2
	}
	printf '%s\n' "${resolved[@]}"
}

# Read a resolve_apps result into a named array. Deliberately not `mapfile`, which is bash 4:
# macOS still ships bash 3.2 as /bin/bash, and a deploy script that only runs on the server is
# a deploy script nobody tests before deploying.
read_apps() {
	local phase="$1" list
	shift
	list="$(resolve_apps "$phase" "$@")" || return $?
	RESOLVED_APPS=()
	local a
	while IFS= read -r a; do
		[[ -n "$a" ]] && RESOLVED_APPS+=("$a")
	done <<<"$list"
	[[ ${#RESOLVED_APPS[@]} -gt 0 ]] || {
		echo "No apps provide ${phase}." >&2
		return 1
	}
}

# Run one phase across apps, reporting per-app outcome and failing loudly at the end rather
# than stopping at the first error, so one broken app does not hide the state of the others.
run_phase() {
	local phase="$1"
	shift
	local apps=("$@")
	local failed=()

	local app
	for app in "${apps[@]}"; do
		echo
		echo "=== ${phase}: ${app} ==="
		if bash "$(app_script "$app" "$phase")"; then
			echo "--- ${app}: ok"
		else
			echo "--- ${app}: FAILED" >&2
			failed+=("$app")
		fi
	done

	echo
	if [[ ${#failed[@]} -gt 0 ]]; then
		echo "${phase} failed for: ${failed[*]}" >&2
		return 1
	fi
	echo "${phase} ok for: ${apps[*]}"
}
