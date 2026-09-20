// Adapter is chosen at build time by SVELTE_ADAPTER, default static.
//
// HyperTIES prerenders to files today: 138 articles, no process to run, nothing to fall over,
// and Caddy serves the release directory directly. The jump to a server is this one variable,
// because what forces it is a page wanting something only a server can give -- a Mapbox token
// that must not be baked into a public bundle, a postgres query, a session -- and that will
// arrive as a feature rather than as a rewrite.
//
// The import is conditional rather than top-level so a static build never needs adapter-node
// present, which keeps the default path working in a checkout that has not installed it.
const useNode = process.env.SVELTE_ADAPTER === 'node';

const adapter = useNode
	? (await import('@sveltejs/adapter-node')).default()
	: (await import('@sveltejs/adapter-static')).default({ pages: 'build', assets: 'build' });

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		// Every article prerenders to a real HTML file: server-rendered at build time,
		// then hydrated so the popups and target applets are live. One codebase, both modes.
		adapter,
		// Relative asset paths keep a static build servable from any root. A node build is
		// served from its own origin, where absolute paths are correct and relative ones are
		// merely harmless, so this stays on for both.
		paths: { relative: true }
	}
};
