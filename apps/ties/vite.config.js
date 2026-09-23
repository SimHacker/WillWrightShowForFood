import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';

// The live site and the prerendered site. The offline single file is a separate
// entry point: see vite.bundle.config.js.
export default {
	plugins: [sveltekit()],
	server: {
		// The corpus lives beside the app rather than in static/, so that the same files
		// are imported by the build and inlined into the offline bundle. Dev has to be
		// told they are servable.
		fs: {
			allow: [
				fileURLToPath(new URL('./examples', import.meta.url)),
				fileURLToPath(new URL('../../characters', import.meta.url))
			]
		},

		// Build output is inside the project, so without this a production build makes the
		// running dev server reload all 138 prerendered pages and report each one.
		watch: { ignored: ['**/build/**', '**/dist-bundle/**'] }
	}
};
