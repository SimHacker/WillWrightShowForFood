/**
 * Same-origin fetch of other systems. First host: gwern.net.
 * Cache on the pet disk. Do not merge his files into ours.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const HOSTS = {
	gwern: { origin: 'https://gwern.net', name: 'gwern.net' }
};

const CACHE_TTL_MS = 60 * 60 * 1000;
const UA = 'HyperTIES/1.0 (+https://hyperties.org; courtesy fetch, not a mirror)';

export function cacheRoot() {
	return process.env.HYPERTIES_CACHE_DIR || '/data/hyperties/cache';
}

function cachePath(url) {
	const h = createHash('sha256').update(url).digest('hex');
	return join(cacheRoot(), h.slice(0, 2), `${h}.json`);
}

export function resolveProxy(hostKey, path) {
	const host = HOSTS[hostKey];
	if (!host) return { error: 'unknown host', status: 404 };
	const rel = String(path || '').replace(/^\/+/, '');
	if (rel.includes('..') || rel.startsWith('/')) return { error: 'bad path', status: 400 };
	const url = rel ? `${host.origin}/${rel}` : `${host.origin}/`;
	return { host, url };
}

export async function fetchUpstream(url) {
	const file = cachePath(url);
	try {
		const raw = await readFile(file, 'utf8');
		const hit = JSON.parse(raw);
		if (Date.now() - hit.at < CACHE_TTL_MS) {
			return { ...hit, cached: true };
		}
	} catch {
		// miss
	}

	const res = await fetch(url, {
		headers: { 'user-agent': UA, accept: 'text/markdown, text/html, text/plain, */*' },
		redirect: 'follow'
	});
	const body = await res.text();
	const rec = {
		at: Date.now(),
		url,
		status: res.status,
		contentType: res.headers.get('content-type') || 'text/plain; charset=utf-8',
		body
	};

	if (res.ok) {
		try {
			await mkdir(join(file, '..'), { recursive: true });
			await writeFile(file, JSON.stringify(rec), 'utf8');
		} catch {
			// cache is best-effort
		}
	}

	return { ...rec, cached: false };
}
