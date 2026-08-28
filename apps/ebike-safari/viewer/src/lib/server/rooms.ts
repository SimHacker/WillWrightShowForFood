/** In-memory SSE rooms: good for LAN sessions and demos; state resets on restart. */

export type RoomMessage = {
	id: number;
	atMs: number;
	room: string;
	/**
	 * Per-tab sender id. Identity must not be the display name: two devices
	 * both left at the default name would each treat the other's messages as
	 * their own and stay silent.
	 */
	from?: string;
	name: string;
	text: string;
	/** Exact voice as named on the sender's device; receivers match by name. */
	voiceName?: string;
	/** Device-local identifier — only useful when sender and receiver match. */
	voiceURI?: string;
	rate?: number;
	pitch?: number;
};

type Client = { send: (chunk: string) => void };

const rooms = new Map<string, Set<Client>>();
let nextId = 1;

function announcePresence(room: string): void {
	const members = rooms.get(room);
	if (!members) return;
	const chunk = `event: presence\ndata: ${JSON.stringify({ room, members: members.size })}\n\n`;
	for (const client of members) {
		try {
			client.send(chunk);
		} catch {
			// Dead stream; its cancel handler reaps it.
		}
	}
}

export function joinRoom(room: string, client: Client): () => void {
	let members = rooms.get(room);
	if (!members) {
		members = new Set();
		rooms.set(room, members);
	}
	members.add(client);
	announcePresence(room);
	return () => {
		members.delete(client);
		if (members.size === 0) rooms.delete(room);
		else announcePresence(room);
	};
}

export function roomSize(room: string): number {
	return rooms.get(room)?.size ?? 0;
}

export function broadcast(
	room: string,
	msg: Omit<RoomMessage, 'id' | 'atMs' | 'room'>
): RoomMessage {
	const full: RoomMessage = { id: nextId++, atMs: Date.now(), room, ...msg };
	const chunk = `data: ${JSON.stringify(full)}\n\n`;
	for (const client of rooms.get(room) ?? []) {
		try {
			client.send(chunk);
		} catch {
			// Dead stream; it will be reaped by its own cancel handler.
		}
	}
	return full;
}
