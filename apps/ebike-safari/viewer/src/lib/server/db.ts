import postgres from 'postgres';
import { env } from '$env/dynamic/private';

let sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
	if (!env.DATABASE_URL) return null;
	if (!sql) {
		sql = postgres(env.DATABASE_URL, {
			max: 5,
			idle_timeout: 20,
			connect_timeout: 10
		});
	}
	return sql;
}

export function dbConfigured(): boolean {
	return Boolean(env.DATABASE_URL);
}
