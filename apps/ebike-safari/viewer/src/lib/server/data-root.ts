import { existsSync } from 'fs';
import { join } from 'path';

/** Ride JSON served at /data/* — bind-mounted in production, outside sirv cache. */
export function dataRoot(): string {
	const candidates = [
		process.env.EBIKE_DATA_DIR,
		'/app/data',
		join(process.cwd(), 'build', 'client', 'data'),
		join(process.cwd(), 'static', 'data')
	].filter((dir): dir is string => Boolean(dir));
	for (const dir of candidates) {
		if (existsSync(dir)) return dir;
	}
	return candidates[0] ?? join(process.cwd(), 'static', 'data');
}

export function contentType(path: string): string {
	if (path.endsWith('.geojson') || path.endsWith('.json')) {
		return 'application/json; charset=utf-8';
	}
	return 'application/octet-stream';
}
