import { contentType, dataRoot } from '$lib/server/data-root';
import { error } from '@sveltejs/kit';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { join, normalize } from 'path';
import { Readable } from 'stream';

export const prerender = false;

export async function GET({ params }) {
	const rel = params.path ?? '';
	if (!rel || rel.includes('..')) {
		throw error(400, 'Bad path');
	}

	const root = normalize(dataRoot());
	const file = normalize(join(root, rel));
	if (!file.startsWith(root + '/') && file !== root) {
		throw error(400, 'Bad path');
	}

	let info: Awaited<ReturnType<typeof stat>>;
	try {
		info = await stat(file);
	} catch {
		throw error(404, 'Not found');
	}
	if (!info.isFile()) {
		throw error(404, 'Not found');
	}

	const body = Readable.toWeb(createReadStream(file)) as ReadableStream<Uint8Array>;
	return new Response(body, {
		headers: {
			'Content-Type': contentType(file),
			'Content-Length': String(info.size),
			'Cache-Control': 'no-store'
		}
	});
}
