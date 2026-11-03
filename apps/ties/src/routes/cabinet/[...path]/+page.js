import { error } from '@sveltejs/kit';
import { catalog, DEFAULT_ENTRY } from '$lib/catalog.js';

/** Every place in the catalog's tree, and every old path, so each is a real file. */
export function entries() {
	const paths = new Set(['']);
	/** @param {import('@wwsff/catalog').CatalogNode} node */
	const walk = (node) => {
		if (node.link) return;
		if (node.path) paths.add(node.path);
		for (const child of node.children) walk(child);
	};
	const root = catalog.tree();
	if (root) walk(root);
	for (const entry of catalog.entries) for (const old of entry.was) paths.add(old);
	return [...paths].map((path) => ({ path }));
}

export function load({ params }) {
	const asked = params.path ?? '';
	const at = asked ? catalog.resolve(asked) : catalog.resolve(catalog.entry(DEFAULT_ENTRY)?.path ?? '');
	if (!at) error(404, `nothing in the catalog at ${asked}`);
	return { asked, path: at.path, redirect: asked ? (at.redirect ?? null) : null, home: !asked };
}
