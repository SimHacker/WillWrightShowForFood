# Read a secret from the one place it lives.
#
# Host-side scripts source this instead of a combined .env, so that "where does this credential come
# from" has one answer for containers and for people. Containers get theirs through env_file in the
# compose file; this is the same files, same paths, read by a shell.
#
#   source "$(dirname "$0")/../../scripts/lib/secrets.sh"
#   load_secret postgres/superuser.env      # exports POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
#   superuser_url                           # echoes a psql URL built from them
#
# Layout and threat model: server/SECRETS.md.

SECRETS_ROOT="${SECRETS_ROOT:-${DATA_ROOT:-/data}/secrets}"

# Export every KEY=VALUE in one secret file. Fails loudly: a script that silently continues without
# a credential ends up reporting a connection error that sends you looking in the wrong place.
load_secret() {
	local rel="$1" path="$SECRETS_ROOT/$1"
	if [[ ! -f "$path" ]]; then
		echo "missing secret: $path" >&2
		echo "  server/SECRETS.md has the layout. On a laptop, set SECRETS_ROOT or DATABASE_URL." >&2
		return 1
	fi
	set -a
	# shellcheck disable=SC1090
	source "$path"
	set +a
}

# A superuser connection string for host-side maintenance: migrations, the OSM import, psql. The
# application containers never use this -- they have their own roles, with DML and nothing else.
superuser_url() {
	load_secret postgres/superuser.env || return 1
	local host="${1:-db}" port="${2:-5432}"
	echo "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${host}:${port}/${POSTGRES_DB}"
}
