#!/usr/bin/env bash
# Versioned releases with an atomic symlink swap. Sourced by apps/*/scripts/deploy-app.sh.
#
#   $RELEASE_ROOT/<app>/releases/<id>/   one build, named for the commit that produced it
#   $RELEASE_ROOT/<app>/current          relative symlink to the release being served
#
# WHY A SYMLINK AND NOT A DIRECTORY WE WRITE INTO
#
# Writing a new build over a live directory means there is a window where half the files are
# new, and a reader during that window gets a page from one build referencing hashed assets
# from the other. Building beside the live one and moving a symlink closes the window: the
# swap is a single rename(2), so every request sees entirely the old release or entirely the
# new one. Rollback is the same operation pointed the other way, with no rebuild.
#
# THE DOCKER TRAP, WHICH IS THE WHOLE REASON THIS FILE HAS A COMMENT THIS LONG
#
# Mount an ANCESTOR of `current`, never `current` itself. A bind mount resolves its source path
# once, when the mount is made, so mounting the symlink pins the container to whatever release it
# pointed at that moment and later swaps are invisible inside the container. Caddy mounts the
# whole of /data/releases and follows `current` on each request, so the swap lands live with no
# restart -- and a new app needs no new mount.
#
# The symlink target is RELATIVE (`releases/<id>`, not `/data/releases/<app>/releases/<id>`) so
# that the link is valid from anywhere the tree is reachable. It happens to be valid absolutely
# too, since /data is the same path in every container -- but a relative link cannot be broken by
# a mount, and this one is followed by a process in a different namespace than the one that wrote
# it.

RELEASES_KEEP="${RELEASES_KEEP:-5}"

# Where releases live: on the DATA DISK on a server ($DATA_ROOT/releases, default
# /data/releases), inside the repo on a laptop so that running a deploy script on a Mac
# exercises the real code path instead of a simulated one.
#
# Never under /srv or /var on the server. Those are the boot disk, the boot disk is cattle, and a
# release directory there is one `gcloud instances delete` from gone.
resolve_release_root() {
	local data="${DATA_ROOT:-/data}"
	if [[ -n "${RELEASE_ROOT:-}" ]]; then
		echo "$RELEASE_ROOT"
	elif [[ -d "$data" ]]; then
		echo "$data/releases"
	else
		echo "$(repo_root)/.releases"
	fi
}

repo_root() {
	git rev-parse --show-toplevel 2>/dev/null || (
		cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd
	)
}

# Name the release after the commit, so what is serving can be traced back to source without
# a deploy log. Dirty trees get a -dirty suffix: uncommitted builds happen on laptops and
# should be impossible to mistake for a commit that exists.
#
# The timestamp in the dirty suffix makes this NOT stable across calls, which is deliberate --
# two uncommitted builds of the same sha are genuinely different artifacts -- and is why build
# records what it produced and deploy reads that record instead of recomputing. On a server the
# tree is clean, both sides compute the same sha, and the handoff is invisible. On a laptop it
# is the difference between working and "nothing staged for <an id you never built>".
release_id() {
	if [[ -n "${RELEASE_ID:-}" ]]; then
		echo "$RELEASE_ID"
		return
	fi
	local sha dirty=""
	sha=$(git rev-parse --short HEAD 2>/dev/null || echo "nogit-$(date +%Y%m%d%H%M%S)")
	if ! git diff --quiet HEAD 2>/dev/null; then
		dirty="-dirty-$(date +%H%M%S)"
	fi
	echo "${sha}${dirty}"
}

# The build/deploy handoff. Written by build-app.sh at the end of a successful build, read by
# deploy-app.sh when no RELEASE_ID was given.
record_staged() {
	local app="$1" id="$2" dir
	dir="$(app_root "$app")/.staging"
	mkdir -p "$dir"
	printf '%s\n' "$id" >"$dir/LATEST"
}

last_staged() {
	local f
	f="$(app_root "$1")/.staging/LATEST"
	[[ -f "$f" ]] || return 1
	tr -d '[:space:]' <"$f"
}

app_root() {
	echo "$(resolve_release_root)/$1"
}

# Stage a build outside releases/ so an interrupted copy can never be activated. Callers
# write their build output here and then call publish_release.
stage_dir() {
	local app="$1" id="$2"
	echo "$(app_root "$app")/.staging/$id"
}

release_path() {
	local app="$1" id="$2"
	echo "$(app_root "$app")/releases/$id"
}

current_target() {
	local app="$1"
	readlink "$(app_root "$app")/current" 2>/dev/null || echo ""
}

# Move a completed staging directory into releases/. Replaces an existing release of the same
# id, which happens when you redeploy the same commit after fixing something outside git.
publish_release() {
	local app="$1" id="$2"
	local staging release
	staging=$(stage_dir "$app" "$id")
	release=$(release_path "$app" "$id")

	[[ -d "$staging" ]] || {
		echo "No staged build at $staging" >&2
		return 1
	}

	mkdir -p "$(dirname "$release")"
	if [[ -e "$release" ]]; then
		rm -rf "$release.replaced.$$"
		mv "$release" "$release.replaced.$$"
	fi
	mv "$staging" "$release"
	rm -rf "$release.replaced.$$"
	echo "$release"
}

# The swap. rename(2) is the only way to replace a symlink without a window where it is
# missing, and neither GNU nor BSD mv exposes it portably for symlinks: GNU needs `mv -T`,
# which macOS does not have, and plain `mv` follows the old symlink and drops the new one
# INSIDE the directory it points at. Python's os.rename is the same syscall, spelled the same
# way on both, and python3 is already a dependency of this repo.
activate_release() {
	local app="$1" id="$2"
	local root release tmp
	root=$(app_root "$app")
	release=$(release_path "$app" "$id")

	[[ -d "$release" ]] || {
		echo "No release at $release" >&2
		return 1
	}

	tmp="$root/.current.$$"
	rm -f "$tmp"
	ln -s "releases/$id" "$tmp"
	python3 -c 'import os,sys; os.rename(sys.argv[1], sys.argv[2])' "$tmp" "$root/current"
	echo "$root/current -> releases/$id"
}

# Keep the last few so rollback does not need a rebuild, drop the rest so a small VM disk
# does not fill up with a year of static sites. Never removes the live release.
prune_releases() {
	local app="$1"
	local root releases live
	root=$(app_root "$app")
	releases="$root/releases"
	[[ -d "$releases" ]] || return 0
	live=$(basename "$(current_target "$app")" 2>/dev/null || echo "")

	local count=0
	# Newest first by mtime, so the count is "keep the N most recent".
	while IFS= read -r dir; do
		local name
		name=$(basename "$dir")
		[[ "$name" == "$live" ]] && continue
		count=$((count + 1))
		if [[ $count -ge $RELEASES_KEEP ]]; then
			rm -rf "$dir"
			echo "pruned $name"
		fi
	done < <(find "$releases" -maxdepth 1 -mindepth 1 -type d -exec ls -dt {} + 2>/dev/null)
}

list_releases() {
	local app="$1"
	local root live
	root=$(app_root "$app")
	live=$(basename "$(current_target "$app")" 2>/dev/null || echo "")
	[[ -d "$root/releases" ]] || {
		echo "  (none at $root/releases)"
		return 0
	}
	while IFS= read -r dir; do
		local name marker=""
		name=$(basename "$dir")
		[[ "$name" == "$live" ]] && marker="  <- current"
		printf '  %-28s %s%s\n' "$name" "$(date -r "$dir" '+%Y-%m-%d %H:%M' 2>/dev/null)" "$marker"
	done < <(find "$root/releases" -maxdepth 1 -mindepth 1 -type d -exec ls -dt {} + 2>/dev/null)
}
