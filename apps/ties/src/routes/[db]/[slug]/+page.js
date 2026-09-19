import { error } from '@sveltejs/kit';
import { databases, getArticle } from '$lib/corpus.js';

export function entries() {
	const out = [];
	for (const [db, data] of databases) {
		for (const slug of data.articles.keys()) out.push({ db, slug });
	}
	return out;
}

export function load({ params }) {
	const article = getArticle(params.db, params.slug);
	if (!article) error(404, `no article ${params.slug} in ${params.db}`);
	return { db: params.db, article };
}
