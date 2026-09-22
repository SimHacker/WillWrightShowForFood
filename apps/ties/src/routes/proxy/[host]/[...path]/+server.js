import { fetchUpstream, resolveProxy } from '$lib/server/proxy.js';

export const prerender = false;

export async function GET({ params }) {
	const resolved = resolveProxy(params.host, params.path);
	if (resolved.error) {
		return new Response(resolved.error, { status: resolved.status });
	}

	let rec;
	try {
		rec = await fetchUpstream(resolved.url);
	} catch (err) {
		return new Response(`upstream: ${err.message}`, { status: 502 });
	}

	return new Response(rec.body, {
		status: rec.status,
		headers: {
			'content-type': rec.contentType,
			'x-proxy-source': rec.url,
			'x-proxy-cached': rec.cached ? '1' : '0',
			'cache-control': 'public, max-age=300'
		}
	});
}
