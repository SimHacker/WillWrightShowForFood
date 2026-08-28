import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// Relative import: this file lives outside src/, so $lib does not reach it.
import { broadcastToRoom } from '../../../../../../socket-server.js';

export const prerender = false;

/**
 * Say something into a room over HTTP: { name, text, from?, voiceName?,
 * voiceURI?, rate?, pitch? }. Clients use the socket directly; this exists so
 * a room can be driven from curl or a script.
 */
export const POST: RequestHandler = async ({ params, request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false, error: 'invalid JSON' }, { status: 400 });
	}

	const sent = broadcastToRoom(params.room, body);
	if (!sent) {
		return json(
			{ ok: false, error: 'name and text required, or realtime server unavailable' },
			{ status: 400 }
		);
	}

	return json({ ok: true, id: sent.id, members: sent.members });
};
