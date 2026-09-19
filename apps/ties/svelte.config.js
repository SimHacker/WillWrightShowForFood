import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		// Every article prerenders to a real HTML file: server-rendered at build time,
		// then hydrated so the popups and target applets are live. One codebase, both modes.
		adapter: adapter({ pages: 'build', assets: 'build' }),
		paths: { relative: true }
	}
};
