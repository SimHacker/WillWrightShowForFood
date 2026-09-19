import { error } from '@sveltejs/kit';
import { databases, getDatabase, homeOf, reserved } from '$lib/corpus.js';

export function entries() {
	return [...databases.keys()].map((db) => ({ db }));
}

export function load({ params }) {
	const db = getDatabase(params.db);
	if (!db) error(404, `no database ${params.db}`);

	// A database says where it opens by declaring `!home` as a synonym, and the browser
	// starts there rather than at a list. doc/aut-homearticle.st0, which is itself an
	// article in the corpus, states the rule: "An ordinary article which has !home as a
	// synonym. The home article is accessed when the browser starts, and when the HOME
	// option of the control panel is selected."
	//
	// So the list is not the front door. The master index is an ordinary article too, and
	// the control panel's INDEX button reaches it the same way anything else is reached.
	return {
		id: db.id,
		principals: db.principals,
		entries: db.documents.size,
		home: homeOf(db.id),
		hasIndex: Boolean(reserved(db.id, 'index')),
		hasTopics: Boolean(reserved(db.id, 'topics'))
	};
}
