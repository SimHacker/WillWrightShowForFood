import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';
import { attachSocketServer } from './socket-server.js';

const useNode = process.env.SVELTE_ADAPTER === 'node';

/**
 * Socket.IO needs the underlying HTTP server, which SvelteKit endpoints never
 * see. In production `server.js` owns that; here we borrow Vite's.
 */
const socketIO: PluginOption = {
	name: 'voice-rooms-socket-io',
	configureServer(server) {
		if (server.httpServer) attachSocketServer(server.httpServer);
	},
	configurePreviewServer(server) {
		if (server.httpServer) attachSocketServer(server.httpServer);
	}
};

export default defineConfig({
	plugins: [
		socketIO,
		sveltekit({
			adapter: useNode
				? adapterNode()
				: adapterStatic({
						fallback: 'index.html'
					}),
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			}
		})
	],
	optimizeDeps: {
		exclude: ['maplibre-gl']
	},
	server: {
		// Reachable as https://<host>.<tailnet>.ts.net via `tailscale serve`,
		// which phones need: microphone access requires a secure context.
		allowedHosts: ['.ts.net']
	}
});
