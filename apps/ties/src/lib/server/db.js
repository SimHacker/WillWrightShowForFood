import postgres from 'postgres';

let sql = null;

const options = { max: 5, idle_timeout: 20, connect_timeout: 10 };

/**
 * Discrete PG* variables from /data/secrets/postgres/roles/hyperties.env.
 * DATABASE_URL is for a laptop. Never the superuser.
 */
export function getDb() {
	if (!dbConfigured()) return null;
	if (!sql) {
		sql = process.env.DATABASE_URL ? postgres(process.env.DATABASE_URL, options) : postgres(options);
	}
	return sql;
}

export function dbConfigured() {
	return Boolean(process.env.DATABASE_URL || process.env.PGPASSWORD || process.env.PGUSER);
}
