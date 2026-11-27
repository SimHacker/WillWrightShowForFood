import { createReadStream, existsSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';

/**
 * In dev, the PDP-10's disk packs at /packs/its/, with Range requests, from ITS_PACKS. The live
 * site serves them from the data disk (packages/cabinet/its/README.md); they are never built in.
 * @returns {import('vite').Plugin}
 */
function itsPacks() {
	const dir = process.env.ITS_PACKS ?? join(homedir(), 'GroundUp/git/its/dl/pdp10-ka');
	return {
		name: 'its-packs',
		configureServer(server) {
			server.middlewares.use('/packs/its/', (req, res, next) => {
				const name = (req.url ?? '').split('?')[0].replace(/^\//, '');
				const file = join(dir, name);
				if (!/^rp03\.[0-3]$/.test(name) || !existsSync(file)) return next();
				const size = statSync(file).size;
				const m = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range ?? '');
				res.setHeader('Accept-Ranges', 'bytes');
				res.setHeader('Content-Type', 'application/octet-stream');
				if (!m) {
					res.setHeader('Content-Length', size);
					return createReadStream(file).pipe(res);
				}
				const start = Number(m[1]);
				const end = Math.min(size - 1, m[2] ? Number(m[2]) : size - 1);
				res.statusCode = 206;
				res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
				res.setHeader('Content-Length', end - start + 1);
				createReadStream(file, { start, end }).pipe(res);
			});
		}
	};
}

// The live site and the prerendered site. The offline single file is a separate
// entry point: see vite.bundle.config.js.
export default {
	plugins: [sveltekit(), itsPacks()],
	// The PDP-10's worker imports the KA10, so it is a module.
	worker: { format: 'es' },
	server: {
		// The corpus lives beside the app rather than in static/, so that the same files
		// are imported by the build and inlined into the offline bundle. Dev has to be
		// told they are servable.
		fs: {
			allow: [
				fileURLToPath(new URL('./examples', import.meta.url)),
				fileURLToPath(new URL('../../characters', import.meta.url)),
				fileURLToPath(new URL('../../packages/cabinet', import.meta.url)),
				fileURLToPath(new URL('../../packages/pixie', import.meta.url)),
				fileURLToPath(new URL('../../repo-shows', import.meta.url))
			]
		},

		// Build output is inside the project, so without this a production build makes the
		// running dev server reload all 138 prerendered pages and report each one.
		watch: { ignored: ['**/build/**', '**/dist-bundle/**'] }
	}
};
