import { json } from '@sveltejs/kit';
import { dbConfigured, getDb } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	let postgres = false;
	let osmWays: Record<string, number> | undefined;
	if (dbConfigured()) {
		try {
			const sql = getDb();
			if (sql) {
				const rows = await sql`SELECT 1 AS ok`;
				postgres = rows[0]?.ok === 1;
				if (postgres) {
					const counts = await sql`
						SELECT region, count(*)::int AS ways
						FROM osm_ways
						GROUP BY region
						ORDER BY region
					`;
					osmWays = Object.fromEntries(counts.map((r) => [r.region, r.ways]));
				}
			}
		} catch {
			postgres = false;
		}
	}

	return json({
		ok: true,
		service: 'ebike-safari-viewer',
		ts: new Date().toISOString(),
		postgres,
		...(osmWays && { osmWays })
	});
};
