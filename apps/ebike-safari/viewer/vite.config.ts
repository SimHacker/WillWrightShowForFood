import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const useNode = process.env.SVELTE_ADAPTER === 'node';

export default defineConfig({
	plugins: [
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
