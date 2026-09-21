#!/usr/bin/env bash
# Converge this machine onto server/MANIFEST.yml. Safe to run repeatedly.
#
# Usage:
#   sudo bash scripts/server-setup.sh                    # everything
#   sudo bash scripts/server-setup.sh --only packages    # one phase
#   sudo bash scripts/server-setup.sh --dry-run          # print, change nothing
#   sudo bash scripts/server-setup.sh --list             # phases and what they do
#
# Env:
#   DATA_DISK   device for the persistent disk, overriding the manifest's device_hint
#   NO_DISK=1   skip the disk phase entirely (a laptop, or a box with no second disk)
#
# IDEMPOTENT MEANS IDEMPOTENT. Every phase checks before it acts, so the second run prints a lot
# of "already" and changes nothing. That is what makes this usable as the answer to "is the box
# set up right?" rather than only as a first-boot script -- and it is why it replaces
# vm-bootstrap.sh and the setup half of server-install.sh, which each installed docker and ufw
# separately and had already drifted apart.
#
# The one thing this will not do is format a disk that already has a filesystem. It refuses and
# tells you what it found, because that is the only mistake here you cannot undo.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$REPO/server/MANIFEST.yml"

DRY=0
ONLY=""
PHASES="packages docker repo node firewall disk"

while [[ $# -gt 0 ]]; do
	case "$1" in
	--dry-run)
		DRY=1
		shift
		;;
	--only)
		ONLY="${2:?--only needs a comma-separated phase list}"
		shift 2
		;;
	--list)
		cat <<'EOF'
Phases, in order:
  packages   apt packages from the manifest, grouped base/dev/ops
  docker     Docker Engine + compose plugin from Docker's repo; docker group membership
  repo       clone the repo if absent, and make it usable by root's git
  node       Node (major from manifest) + pnpm via corepack, pinned by package.json
  firewall   ufw defaults and the allow list, including 443/udp for HTTP/3
  disk       mount the persistent disk at the manifest's mount point, and fstab it

Everything is idempotent. --only takes a comma list: --only node,firewall
EOF
		exit 0
		;;
	-h | --help)
		sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'
		exit 0
		;;
	*)
		echo "Unknown argument: $1" >&2
		exit 2
		;;
	esac
done

[[ -f "$MANIFEST" ]] || {
	echo "No manifest at $MANIFEST" >&2
	exit 1
}

if [[ $DRY -eq 0 && ${EUID:-$(id -u)} -ne 0 ]]; then
	echo "Run with sudo, or pass --dry-run to see what it would do." >&2
	exit 1
fi

run() {
	if [[ $DRY -eq 1 ]]; then
		echo "    would: $*"
	else
		"$@"
	fi
}

want_phase() {
	[[ -z "$ONLY" ]] && return 0
	[[ ",$ONLY," == *",$1,"* ]]
}

export DEBIAN_FRONTEND=noninteractive

# Phase 0, not optional and not in the manifest's own vocabulary: the parser this script needs in
# order to read the manifest at all. Chicken and egg, resolved explicitly rather than by
# reimplementing YAML in sed.
if ! python3 -c 'import yaml' 2>/dev/null; then
	echo "== bootstrap: python3-yaml (needed to read the manifest)"
	run apt-get update -qq
	run apt-get install -y -qq python3-yaml
	if [[ $DRY -eq 1 ]]; then
		echo "    (dry run cannot parse the manifest without it; showing phases only)"
		exit 0
	fi
fi

# Read a dotted path out of the manifest. Prints nothing for a missing key rather than raising,
# so a manifest that predates a phase degrades to "that phase has nothing to do".
m() { python3 -c "
import sys, yaml
d = yaml.safe_load(open('$MANIFEST'))
for k in sys.argv[1].split('.'):
    d = d.get(k) if isinstance(d, dict) else None
    if d is None: sys.exit(0)
if isinstance(d, list):
    print(' '.join(str(x) for x in d))
elif isinstance(d, dict):
    print(' '.join(d.keys()))
else:
    print(d)
" "$1"; }

if want_phase packages; then
	echo "== packages"
	PKGS=""
	for group in $(m packages); do
		PKGS="$PKGS $(m "packages.$group")"
	done
	# shellcheck disable=SC2086
	MISSING=$(for p in $PKGS; do dpkg -s "$p" >/dev/null 2>&1 || echo "$p"; done | sort -u | tr '\n' ' ')
	if [[ -z "${MISSING// /}" ]]; then
		echo "   all present"
	else
		echo "   installing:$MISSING"
		run apt-get update -qq
		# shellcheck disable=SC2086
		run apt-get install -y -qq $MISSING
	fi
fi

if want_phase docker; then
	echo "== docker"
	KEYRING="$(m docker.keyring)"
	if [[ ! -f "$KEYRING" ]]; then
		echo "   adding Docker's apt repo"
		run install -m 0755 -d "$(dirname "$KEYRING")"
		run sh -c "curl -fsSL $(m docker.repo)/gpg -o $KEYRING"
		run chmod a+r "$KEYRING"
		run sh -c "echo \"deb [arch=\$(dpkg --print-architecture) signed-by=$KEYRING] $(m docker.repo) \$(. /etc/os-release && echo \${VERSION_CODENAME:-noble}) stable\" > /etc/apt/sources.list.d/docker.list"
		run apt-get update -qq
	else
		echo "   repo already configured"
	fi

	DPKGS="$(m docker.packages)"
	# shellcheck disable=SC2086
	DMISSING=$(for p in $DPKGS; do dpkg -s "$p" >/dev/null 2>&1 || echo "$p"; done | tr '\n' ' ')
	if [[ -z "${DMISSING// /}" ]]; then
		echo "   engine present: $(docker --version 2>/dev/null || echo unknown)"
	else
		echo "   installing:$DMISSING"
		# shellcheck disable=SC2086
		run apt-get install -y -qq $DMISSING
	fi

	for u in $(m docker.group_members) ${SUDO_USER:-}; do
		[[ -z "$u" ]] && continue
		id "$u" &>/dev/null || continue
		if id -nG "$u" | tr ' ' '\n' | grep -qx docker; then
			echo "   $u already in docker group"
		else
			echo "   adding $u to docker group (re-login required)"
			run usermod -aG docker "$u"
		fi
	done
fi

if want_phase repo; then
	echo "== repo"
	DIR="$(m repo.dir)"
	if [[ ! -d "$DIR/.git" ]]; then
		echo "   cloning $(m repo.url) -> $DIR"
		run git clone --depth "$(m repo.clone_depth)" "$(m repo.url)" "$DIR"
	else
		echo "   present at $DIR"
	fi

	# Deploys run git as root against a tree root does not own, and git refuses that outright
	# ("detected dubious ownership"), which fails the pull before a single file is built. Root
	# declaring this one path safe is the entire fix. It belongs here because otherwise every
	# rebuilt box rediscovers it the hard way, during a deploy, with the site down.
	if git config --global --get-all safe.directory 2>/dev/null | grep -qx "$DIR"; then
		echo "   already safe.directory for root"
	else
		echo "   marking $DIR safe.directory for root"
		run git config --global --add safe.directory "$DIR"
	fi
fi

if want_phase node; then
	echo "== node"
	WANT_MAJOR="$(m node.major)"
	HAVE=""
	command -v node >/dev/null && HAVE="$(node --version | sed 's/^v//; s/\..*//')"
	if [[ "$HAVE" == "$WANT_MAJOR" ]]; then
		echo "   node $(node --version) present"
	else
		echo "   installing node ${WANT_MAJOR} (have: ${HAVE:-none})"
		run sh -c "curl -fsSL https://deb.nodesource.com/setup_${WANT_MAJOR}.x | bash -"
		run apt-get install -y -qq nodejs
	fi

	# pnpm version comes from the repo, never from the manifest, so the box cannot disagree with
	# CI. corepack reads packageManager out of package.json itself; this just activates it.
	if [[ -f "$REPO/package.json" ]]; then
		PM=$(python3 -c "import json;print(json.load(open('$REPO/package.json')).get('packageManager',''))" | cut -d+ -f1)
		if [[ -n "$PM" ]]; then
			if command -v pnpm >/dev/null && [[ "pnpm@$(pnpm --version 2>/dev/null)" == "$PM" ]]; then
				echo "   $PM present"
			else
				echo "   activating $PM via corepack"
				run corepack enable
				run corepack prepare "$PM" --activate
			fi
		fi
	else
		echo "   no repo checkout yet; pnpm deferred until after clone"
	fi
fi

if want_phase firewall; then
	echo "== firewall"
	run ufw default "$(m firewall.default_incoming)" incoming
	run ufw default "$(m firewall.default_outgoing)" outgoing
	for rule in $(m firewall.allow); do
		# `ufw allow` is already idempotent, so this check exists only to make the output say
		# which rules were actually new. Guarded because ufw may not be installed yet on a first
		# run, or at all when this is dry-run from a laptop.
		if command -v ufw >/dev/null && ufw status 2>/dev/null | grep -q "${rule%%/*}"; then
			echo "   $rule already allowed"
		else
			echo "   allowing $rule"
		fi
		run ufw allow "$rule"
	done
	run ufw --force enable
fi

if want_phase disk && [[ -z "${NO_DISK:-}" ]]; then
	echo "== disk"
	MOUNT="$(m disk.mount)"
	DEV="${DATA_DISK:-$(m disk.device_hint)}"
	FSTYPE="$(m disk.fstype)"

	if mountpoint -q "$MOUNT" 2>/dev/null; then
		echo "   $MOUNT already mounted from $(findmnt -n -o SOURCE "$MOUNT")"
	elif [[ ! -b "$DEV" ]]; then
		# A hard stop, not a warning. An earlier version of this script shrugged and used the
		# boot disk, which is how the database and the ACME account key ended up on cattle for
		# weeks while a manifest described a disk that had never been created. If the pet disk
		# is missing, the correct outcome is that nothing proceeds.
		echo "   NO DATA DISK at $DEV." >&2
		echo >&2
		echo "   Everything stateful belongs on it, so setup stops here rather than quietly" >&2
		echo "   putting state on the boot disk. Create and attach it:" >&2
		echo >&2
		echo "     gcloud compute disks create wwsff-data --size=100GB --type=pd-balanced \\" >&2
		echo "       --zone=europe-west4-a --project=ebike-safari" >&2
		echo "     gcloud compute instances attach-disk \$(hostname -s) --disk=wwsff-data \\" >&2
		echo "       --device-name=data --zone=europe-west4-a --project=ebike-safari" >&2
		echo >&2
		echo "   Then re-run: sudo bash scripts/server-setup.sh --only disk" >&2
		echo "   Deliberately running without one (a laptop, a throwaway): NO_DISK=1" >&2
		exit 1
	else
		EXISTING="$(blkid -o value -s TYPE "$DEV" 2>/dev/null || true)"
		if [[ -z "$EXISTING" ]]; then
			if [[ "$(m disk.format_if_empty)" == "True" || "$(m disk.format_if_empty)" == "true" ]]; then
				echo "   $DEV is blank; creating $FSTYPE"
				run mkfs."$FSTYPE" -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard "$DEV"
			else
				echo "   $DEV is blank and format_if_empty is false. Refusing." >&2
				exit 1
			fi
		else
			echo "   $DEV already has $EXISTING — mounting, never formatting"
		fi
		run mkdir -p "$MOUNT"
		run mount -o discard,defaults "$DEV" "$MOUNT"
	fi

	# UUID rather than device name: GCP device ordering is not a promise, and an fstab that
	# names /dev/sdb will eventually mount the wrong disk or fail to boot.
	if [[ -b "$DEV" ]] && [[ $DRY -eq 0 ]]; then
		UUID="$(blkid -o value -s UUID "$DEV" 2>/dev/null || true)"
		if [[ -n "$UUID" ]] && ! grep -q "$UUID" /etc/fstab; then
			echo "   adding UUID=$UUID to /etc/fstab"
			printf 'UUID=%s %s %s discard,defaults,nofail 0 2\n' "$UUID" "$MOUNT" "$FSTYPE" >>/etc/fstab
		else
			echo "   fstab already has it"
		fi
	fi

	# The full layout, from the manifest's disk.contains keys, so adding a directory there is the
	# only edit needed to have it created here.
	for d in $(m disk.contains); do
		run mkdir -p "$MOUNT/$d"
	done

	# The secret lives on the pet disk and the checkout points at it. Two reasons this is a
	# symlink rather than a copy: a reclone cannot lose the secret, and there is exactly one
	# file to protect instead of one per checkout.
	ENV_LINK="$REPO/apps/ebike-safari/deploy/.env"
	ENV_REAL="$MOUNT/secrets/ebike-safari.env"
	if [[ -L "$ENV_LINK" ]]; then
		echo "   .env already linked to $(readlink "$ENV_LINK")"
	elif [[ -f "$ENV_LINK" ]] && [[ ! -f "$ENV_REAL" ]]; then
		echo "   moving .env onto the data disk and linking it back"
		run mv "$ENV_LINK" "$ENV_REAL"
		run chmod 600 "$ENV_REAL"
		run ln -s "$ENV_REAL" "$ENV_LINK"
	elif [[ -f "$ENV_REAL" ]]; then
		echo "   linking .env to $ENV_REAL"
		run rm -f "$ENV_LINK"
		run ln -s "$ENV_REAL" "$ENV_LINK"
	else
		echo "   no .env yet — create $ENV_REAL (mode 600), it will be linked on the next run"
	fi
fi

echo
echo "Converged. $( [[ $DRY -eq 1 ]] && echo '(dry run — nothing changed)')"
echo "Next: sudo bash scripts/server-deploy.sh --list"
