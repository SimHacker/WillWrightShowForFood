import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';

// The emailable artifact: one HTML file with the corpus, the images and the reader
// inlined. No router, because file:// has no routes — see src/lib/Reader.svelte.
export default {
	root: fileURLToPath(new URL('./bundle', import.meta.url)),
	base: './',
	plugins: [svelte({ configFile: false }), viteSingleFile()],
	build: {
		outDir: fileURLToPath(new URL('./dist-bundle', import.meta.url)),
		emptyOutDir: true,
		assetsInlineLimit: Number.MAX_SAFE_INTEGER,
		cssCodeSplit: false
	}
};
