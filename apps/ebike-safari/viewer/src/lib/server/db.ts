import postgres from 'postgres';
import { env } from '$env/dynamic/private';

let sql: ReturnType<typeof postgres> | null = null;

const options = { max: 5, idle_timeout: 20, connect_timeout: 10 };

/**
 * In production the connection comes from discrete PG* variables, which postgres.js reads on its
 * own: PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD. They arrive from this app's own secret file
 * (/data/secrets/postgres/roles/ebike-safari.env), naming a role that has DML on the application
 * tables and nothing more.
 *
 * Discrete variables rather than a URL because a URL embeds the password in a string that gets
 * logged, and because assembling one here would mean this app's credentials and the superuser's
 * once shared a spelling. DATABASE_URL is still honoured for a laptop pointing at a local postgres.
 */
export function getDb() {
	if (!dbConfigured()) return null;
	if (!sql) {
		sql = env.DATABASE_URL ? postgres(env.DATABASE_URL, options) : postgres(options);
	}
	return sql;
}

export function dbConfigured(): boolean {
	return Boolean(env.DATABASE_URL || env.PGPASSWORD || env.PGUSER);
}
