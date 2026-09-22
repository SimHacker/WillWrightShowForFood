import { error, redirect } from '@sveltejs/kit';
import { databases, getDatabase } from '$lib/corpus.js';
import { ROOT, articleHref } from '$lib/href.js';

export function entries() {
	return [...databases.keys()].map((db) => ({ db }));
}

export function load({ params }) {
	if (params.db === 'top' || params.db === ROOT) redirect(308, '/');
	if (!getDatabase(params.db)) error(404, `no database ${params.db}`);
	redirect(308, articleHref(params.db));
}
