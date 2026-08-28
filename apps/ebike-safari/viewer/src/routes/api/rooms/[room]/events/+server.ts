import { joinRoom, roomSize } from '$lib/server/rooms';
import type { RequestHandler } from './$types';

export const prerender = false;

/** SSE stream of everything said in the room. */
export const GET: RequestHandler = ({ params }) => {
	const room = params.room;
	const encoder = new TextEncoder();
	let leave: (() => void) | null = null;
	let heartbeat: ReturnType<typeof setInterval> | null = null;

	const stream = new ReadableStream({
		start(controller) {
			const send = (chunk: string) => controller.enqueue(encoder.encode(chunk));
			leave = joinRoom(room, { send });
			send(`event: joined\ndata: ${JSON.stringify({ room, members: roomSize(room) })}\n\n`);
			heartbeat = setInterval(() => {
				try {
					send(': ping\n\n');
				} catch {
					/* closed */
				}
			}, 25000);
		},
		cancel() {
			if (heartbeat) clearInterval(heartbeat);
			leave?.();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-store',
			Connection: 'keep-alive'
		}
	});
};
