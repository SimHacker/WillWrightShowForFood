import { json } from '@sveltejs/kit';
import { dbConfigured, getDb } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	let postgres = false;
	if (dbConfigured()) {
		try {
			const sql = getDb();
			if (sql) {
				const rows = await sql`SELECT 1 AS ok`;
				postgres = rows[0]?.ok === 1;
			}
		} catch {
			postgres = false;
		}
	}

	return json({
		ok: true,
		service: 'ebike-safari-viewer',
		ts: new Date().toISOString(),
		postgres
	});
};
