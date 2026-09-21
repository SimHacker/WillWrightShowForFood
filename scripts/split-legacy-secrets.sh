#!/usr/bin/env bash
# One-time: split the combined .env into one file per secret, and give each app its own postgres role.
#
# The old layout was a single file holding every secret, auto-loaded by compose and interpolated
# into the compose file, so every value reached every service -- including the postgres superuser
# password, which sat in the viewer's environment inside a DATABASE_URL.
#
# Idempotent and safe to re-run: it refuses if the per-secret files already exist rather than
# regenerating a password that services are currently using. Layout: server/SECRETS.md.
#
#   sudo bash scripts/split-legacy-secrets.sh            # split
#   sudo bash scripts/split-legacy-secrets.sh --finish   # delete the legacy file, once verified
set -euo pipefail

DATA_ROOT="${DATA_ROOT:-/data}"
S="$DATA_ROOT/secrets"
LEGACY="${LEGACY:-$S/ebike-safari.env}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LEGACY_LINK="$REPO/apps/ebike-safari/deploy/.env"

NEW=(
	"$S/postgres/superuser.env"
	"$S/postgres/roles/ebike-safari.env"
	"$S/mapbox/token.env"
	"$S/acme/email.env"
)

if [[ "${1:-}" == "--finish" ]]; then
	for f in "${NEW[@]}"; do
		[[ -f "$f" ]] || {
			echo "not split yet: $f is missing. Run without --finish first." >&2
			exit 1
		}
	done
	# The symlink goes too: compose no longer reads a combined file, and leaving one would make it
	# a second source of truth that silently wins for anything using interpolation.
	[[ -L "$LEGACY_LINK" ]] && rm -v "$LEGACY_LINK"
	[[ -f "$LEGACY" ]] && shred -u "$LEGACY" && echo "shredded $LEGACY"
	echo "Done. Secrets are per-file under $S; see server/SECRETS.md."
	exit 0
fi

[[ -f "$LEGACY" ]] || {
	echo "no legacy file at $LEGACY -- nothing to split." >&2
	exit 1
}
for f in "${NEW[@]}"; do
	[[ -e "$f" ]] && {
		echo "already split: $f exists. Re-running would rotate a password in use." >&2
		echo "To start over, remove the per-secret files deliberately." >&2
		exit 1
	}
done

val() { grep -E "^$1=" "$LEGACY" | head -1 | cut -d= -f2-; }

PG_USER="$(val POSTGRES_USER)"
PG_PASS="$(val POSTGRES_PASSWORD)"
PG_DB="$(val POSTGRES_DB)"
MAPBOX="$(val MAPBOX_TOKEN)"
ACME="$(val ACME_EMAIL)"
[[ -n "$PG_USER" && -n "$PG_PASS" && -n "$PG_DB" ]] || {
	echo "$LEGACY is missing POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB" >&2
	exit 1
}
[[ -n "$ACME" ]] || {
	echo "$LEGACY is missing ACME_EMAIL -- Caddy needs it" >&2
	exit 1
}

install -d -m 700 "$S" "$S/postgres/roles" "$S/mapbox" "$S/acme"
umask 077

# The superuser keeps the EXISTING password: the postgres image only reads POSTGRES_PASSWORD at
# initdb, so writing a new one here would change nothing in the database and would leave a file
# that lies about how to connect.
printf 'POSTGRES_USER=%s\nPOSTGRES_PASSWORD=%s\nPOSTGRES_DB=%s\n' \
	"$PG_USER" "$PG_PASS" "$PG_DB" >"$S/postgres/superuser.env"

# The app's own role, with a password generated here and shared with nothing else. Discrete PG*
# variables rather than a URL: postgres.js reads them natively, and a URL would put the credential
# into a string that gets logged.
printf 'PGHOST=db\nPGPORT=5432\nPGDATABASE=%s\nPGUSER=%s\nPGPASSWORD=%s\n' \
	"$PG_DB" "ebike_safari_app" "$(openssl rand -base64 33 | tr -d '/+=')" \
	>"$S/postgres/roles/ebike-safari.env"

printf 'MAPBOX_TOKEN=%s\n' "$MAPBOX" >"$S/mapbox/token.env"
printf 'ACME_EMAIL=%s\n' "$ACME" >"$S/acme/email.env"

chmod 600 "${NEW[@]}"

echo "Split into:"
for f in "${NEW[@]}"; do
	printf '  %s %s\n' "$(stat -c '%a' "$f")" "$f"
	sed 's/=.\+/=<set>/' "$f" | sed 's/^/      /'
done
echo
echo "The legacy file is left in place as the rollback. Next:"
echo "  sudo bash scripts/provision-db-roles.sh          # create the app role in postgres"
echo "  sudo bash scripts/server-deploy.sh ebike-safari  # restart on the new credentials"
echo "  sudo bash scripts/split-legacy-secrets.sh --finish   # once verified"
