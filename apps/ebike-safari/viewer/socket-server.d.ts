import type { Server as HttpServer } from 'node:http';
import type { Http2SecureServer } from 'node:http2';
import type { Server } from 'socket.io';

export type RoomMessage = {
	id: number;
	atMs: number;
	room: string;
	from: string;
	name: string;
	text: string;
	voiceName?: string;
	voiceURI?: string;
	rate?: number;
	pitch?: number;
};

/** Vite's dev server may expose an HTTP/2 server; Socket.IO accepts both. */
export function attachSocketServer(httpServer: HttpServer | Http2SecureServer): Server;

export function broadcastToRoom(
	room: string,
	raw: unknown
): (RoomMessage & { members: number }) | null;
