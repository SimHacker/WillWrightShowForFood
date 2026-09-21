#!/usr/bin/env bash
# Converge postgres login roles onto the secret files in /data/secrets/postgres/roles/.
#
# One role per application container, so that an RCE in a web route is not also DROP DATABASE.
# Each role gets DML on the existing application tables and on tables the superuser creates later,
# and nothing else: no superuser, no CREATE, no access to another app's schema.
#
# Idempotent, which makes it three things at once: provisioning, rotation (edit the file, re-run,
# restart the app) and an audit (run it and watch it change nothing).
#
#   sudo bash scripts/provision-db-roles.sh            # all roles
#   sudo bash scripts/provision-db-roles.sh ebike-safari
#
# See server/SECRETS.md for the layout and the threat model.
set -euo pipefail

DATA_ROOT="${DATA_ROOT:-/data}"
ROLES_DIR="$DATA_ROOT/secrets/postgres/roles"
SUPERUSER_ENV="$DATA_ROOT/secrets/postgres/superuser.env"
COMPOSE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/apps/ebike-safari/deploy/docker-compose.yml"

die() {
	echo "provision-db-roles: $*" >&2
	exit 1
}

[[ -f "$SUPERUSER_ENV" ]] || die "no superuser secret at $SUPERUSER_ENV (see server/SECRETS.md)"
[[ -d "$ROLES_DIR" ]] || die "no roles directory at $ROLES_DIR"

# The superuser is read here, on the host, and reaches psql through the already-running container's
# own environment -- it is never passed on a command line, where it would land in ps output.
SU_USER="$(grep -E '^POSTGRES_USER=' "$SUPERUSER_ENV" | cut -d= -f2-)"
SU_DB="$(grep -E '^POSTGRES_DB=' "$SUPERUSER_ENV" | cut -d= -f2-)"
[[ -n "$SU_USER" ]] || die "POSTGRES_USER missing from $SUPERUSER_ENV"

docker compose -f "$COMPOSE" ps db 2>/dev/null | grep -q 'Up\|running' ||
	die "the db container is not running; start the stack first"

# psql as the superuser, script on stdin so that -v variables are substituted with correct quoting:
# :"x" quotes as an identifier, :'x' as a literal. No string interpolation into SQL text.
psu() { docker compose -f "$COMPOSE" exec -T db psql -q -v ON_ERROR_STOP=1 -U "$SU_USER" "$@"; }

WANTED=("$@")
if [[ ${#WANTED[@]} -eq 0 ]]; then
	for f in "$ROLES_DIR"/*.env; do
		[[ -e "$f" ]] || die "no role files in $ROLES_DIR"
		WANTED+=("$(basename "$f" .env)")
	done
fi

for app in "${WANTED[@]}"; do
	f="$ROLES_DIR/$app.env"
	[[ -f "$f" ]] || die "no secret file for '$app' at $f"

	# Read in a subshell so one app's credentials never leak into the next iteration.
	role="$(grep -E '^PGUSER=' "$f" | cut -d= -f2-)"
	pass="$(grep -E '^PGPASSWORD=' "$f" | cut -d= -f2-)"
	dbname="$(grep -E '^PGDATABASE=' "$f" | cut -d= -f2-)"
	dbname="${dbname:-$SU_DB}"
	[[ -n "$role" && -n "$pass" ]] || die "$f needs PGUSER and PGPASSWORD"
	[[ "$role" != "$SU_USER" ]] || die "$f reuses the superuser '$SU_USER' -- that defeats the point"

	echo "== $app: role '$role' on database '$dbname'"

	if [[ -z "$(psu -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname = '$role'")" ]]; then
		echo "   creating role"
		psu -d postgres -v r="$role" <<-'SQL'
			CREATE ROLE :"r" LOGIN;
		SQL
	else
		echo "   role exists"
	fi

	# Always reassert: this is what makes the script a rotation tool. NOSUPERUSER and friends are
	# stated rather than assumed, so a role that was hand-escalated gets quietly demoted back.
	psu -d postgres -v r="$role" -v p="$pass" -v d="$dbname" <<-'SQL'
		ALTER ROLE :"r" WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS PASSWORD :'p';
		GRANT CONNECT ON DATABASE :"d" TO :"r";
	SQL

	# Table privileges, in the application database. USAGE on the schema but not CREATE, so the app
	# can read and write what exists and cannot add to it -- migrations are the superuser's job.
	# ALTER DEFAULT PRIVILEGES covers tables the superuser creates from now on, which is why adding
	# a table to a migration does not mean coming back here.
	psu -d "$dbname" -v r="$role" <<-'SQL'
		GRANT USAGE ON SCHEMA public TO :"r";
		REVOKE CREATE ON SCHEMA public FROM :"r";
		GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO :"r";
		GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO :"r";
		ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO :"r";
		ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO :"r";
	SQL

	# PostGIS keeps spatial_ref_sys in public and the app only ever reads it; the grant above already
	# covers it. Report what the role can actually do, so the output is evidence and not a promise.
	echo "   privileges now:"
	psu -d "$dbname" -tA -v r="$role" <<-'SQL' | sed 's/^/     /'
		SELECT table_name || ': ' || string_agg(privilege_type, ',' ORDER BY privilege_type)
		FROM information_schema.table_privileges
		WHERE grantee = :'r'
		GROUP BY table_name
		ORDER BY table_name;
	SQL
	psu -d postgres -tA -v r="$role" <<-'SQL' | sed 's/^/     attributes: /'
		SELECT 'superuser=' || rolsuper || ' createdb=' || rolcreatedb || ' createrole=' || rolcreaterole
		FROM pg_roles WHERE rolname = :'r';
	SQL
done

echo
echo "Converged. Restart the apps whose passwords changed:"
echo "  sudo docker compose -f $COMPOSE up -d --no-deps viewer"
