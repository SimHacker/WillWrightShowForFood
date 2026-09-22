import { error } from '@sveltejs/kit';
import { getDatabase, homeOf } from '$lib/corpus.js';
import { ROOT } from '$lib/href.js';

export function load() {
	const db = getDatabase(ROOT);
	if (!db) error(404, 'no hyperties database');
	return { db: ROOT, home: homeOf(ROOT) };
}
