import { error, redirect } from '@sveltejs/kit';
import { databases, getDatabase, homeOf, reserved } from '$lib/corpus.js';
import { ROOT, articleHref } from '$lib/href.js';

export function entries() {
	return [...databases.keys()].map((db) => ({ db }));
}

export function load({ params }) {
	if (params.db === 'top' || params.db === ROOT) redirect(308, '/');
	const db = getDatabase(params.db);
	if (!db) error(404, `no database ${params.db}`);
	return {
		id: db.id,
		home: homeOf(db.id),
		href: articleHref(db.id),
		hasIndex: Boolean(reserved(db.id, 'index')),
		hasTopics: Boolean(reserved(db.id, 'topics'))
	};
}
