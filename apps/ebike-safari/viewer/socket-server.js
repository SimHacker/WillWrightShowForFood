/**
 * Voice Rooms realtime layer — Socket.IO.
 *
 * Plain JS on purpose: this module is imported by both `vite.config.ts` (dev
 * and preview) and `server.js` (the adapter-node production entry), neither of
 * which runs through a TypeScript build step. Types are declared in
 * `socket-server.d.ts`.
 *
 * Socket.IO supplies the parts previously hand-rolled: rooms, join/leave
 * bookkeeping, presence counts, reconnection, and transport fallback when
 * WebSocket is blocked.
 */
import { Server } from 'socket.io';

/** @typedef {{ id: number, atMs: number, room: string, from: string, name: string, text: string, voiceName?: string, voiceURI?: string, rate?: number, pitch?: number }} RoomMessage */

let nextId = 1;

/** How many sockets are in a room right now. */
function memberCount(io, room) {
	return io.sockets.adapter.rooms.get(room)?.size ?? 0;
}

function announcePresence(io, room) {
	io.to(room).emit('presence', { room, members: memberCount(io, room) });
}

/** Normalize an untrusted payload into a message, or null if unusable. */
function toMessage(room, raw) {
	if (!raw || typeof raw !== 'object') return null;
	const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 64) : '';
	const text = typeof raw.text === 'string' ? raw.text.trim().slice(0, 2000) : '';
	if (!name || !text) return null;
	return {
		id: nextId++,
		atMs: Date.now(),
		room,
		from: typeof raw.from === 'string' ? raw.from.slice(0, 64) : '',
		name,
		text,
		voiceName: typeof raw.voiceName === 'string' ? raw.voiceName.slice(0, 128) : undefined,
		voiceURI: typeof raw.voiceURI === 'string' ? raw.voiceURI.slice(0, 256) : undefined,
		rate: typeof raw.rate === 'number' ? raw.rate : undefined,
		pitch: typeof raw.pitch === 'number' ? raw.pitch : undefined
	};
}

/**
 * Attach a Socket.IO server to an existing HTTP server.
 * Also published on globalThis so SvelteKit endpoints in the same process
 * (used for curl-friendly REST posting) can broadcast through it.
 */
export function attachSocketServer(httpServer) {
	if (globalThis.__voiceRoomsIO) return globalThis.__voiceRoomsIO;

	const io = new Server(httpServer, {
		path: '/socket.io',
		serveClient: false,
		cors: { origin: false }
	});

	io.on('connection', (socket) => {
		/** @type {string | null} */
		let current = null;

		socket.on('join', (roomRaw, ack) => {
			const room = String(roomRaw || 'lobby').slice(0, 64);
			if (current) {
				socket.leave(current);
				announcePresence(io, current);
			}
			socket.join(room);
			current = room;
			announcePresence(io, room);
			if (typeof ack === 'function') ack({ ok: true, room, members: memberCount(io, room) });
		});

		socket.on('say', (raw, ack) => {
			const room = current;
			if (!room) {
				if (typeof ack === 'function') ack({ ok: false, error: 'join a room first' });
				return;
			}
			const msg = toMessage(room, raw);
			if (!msg) {
				if (typeof ack === 'function') ack({ ok: false, error: 'name and text required' });
				return;
			}
			io.to(room).emit('said', msg);
			if (typeof ack === 'function') ack({ ok: true, id: msg.id, members: memberCount(io, room) });
		});

		socket.on('leave', () => {
			if (!current) return;
			socket.leave(current);
			const was = current;
			current = null;
			announcePresence(io, was);
		});

		socket.on('disconnect', () => {
			if (current) announcePresence(io, current);
		});
	});

	globalThis.__voiceRoomsIO = io;
	return io;
}

/** Broadcast from outside a socket handler (used by the REST endpoint). */
export function broadcastToRoom(room, raw) {
	const io = globalThis.__voiceRoomsIO;
	if (!io) return null;
	const msg = toMessage(room, raw);
	if (!msg) return null;
	io.to(room).emit('said', msg);
	return { ...msg, members: memberCount(io, room) };
}
