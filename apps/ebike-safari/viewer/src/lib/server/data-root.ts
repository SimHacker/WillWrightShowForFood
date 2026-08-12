import { existsSync } from 'fs';
import { join } from 'path';

/** Ride JSON served at /data/* — bind-mounted in production. */
export function dataRoot(): string {
	const candidates = [
		join(process.cwd(), 'build', 'client', 'data'),
		join(process.cwd(), 'static', 'data')
	];
	for (const dir of candidates) {
		if (existsSync(dir)) return dir;
	}
	return candidates[0];
}

export function contentType(path: string): string {
	if (path.endsWith('.geojson') || path.endsWith('.json')) {
		return 'application/json; charset=utf-8';
	}
	return 'application/octet-stream';
}
