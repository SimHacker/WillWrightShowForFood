import { json } from '@sveltejs/kit';
import { broadcast, roomSize } from '$lib/server/rooms';
import type { RequestHandler } from './$types';

export const prerender = false;

/** Say something into the room: { name, text, voiceName?, voiceURI?, rate?, pitch? } */
export const POST: RequestHandler = async ({ params, request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false, error: 'invalid JSON' }, { status: 400 });
	}
	const b = body as Record<string, unknown>;
	const name = typeof b.name === 'string' ? b.name.trim().slice(0, 64) : '';
	const text = typeof b.text === 'string' ? b.text.trim().slice(0, 2000) : '';
	if (!name || !text) {
		return json({ ok: false, error: 'name and text required' }, { status: 400 });
	}

	const msg = broadcast(params.room, {
		name,
		text,
		voiceName: typeof b.voiceName === 'string' ? b.voiceName.slice(0, 128) : undefined,
		voiceURI: typeof b.voiceURI === 'string' ? b.voiceURI.slice(0, 256) : undefined,
		rate: typeof b.rate === 'number' ? b.rate : undefined,
		pitch: typeof b.pitch === 'number' ? b.pitch : undefined
	});

	return json({ ok: true, id: msg.id, members: roomSize(params.room) });
};
