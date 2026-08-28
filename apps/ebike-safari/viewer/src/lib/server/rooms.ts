/** In-memory SSE rooms: good for LAN sessions and demos; state resets on restart. */

export type RoomMessage = {
	id: number;
	atMs: number;
	room: string;
	name: string;
	text: string;
	voiceType?: string;
	rate?: number;
	pitch?: number;
};

type Client = { send: (chunk: string) => void };

const rooms = new Map<string, Set<Client>>();
let nextId = 1;

export function joinRoom(room: string, client: Client): () => void {
	let members = rooms.get(room);
	if (!members) {
		members = new Set();
		rooms.set(room, members);
	}
	members.add(client);
	return () => {
		members.delete(client);
		if (members.size === 0) rooms.delete(room);
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
