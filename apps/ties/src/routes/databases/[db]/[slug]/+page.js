import { error, redirect } from '@sveltejs/kit';
import { databases, getArticle } from '$lib/corpus.js';
import { ROOT, articleHref } from '$lib/href.js';

export function entries() {
	const out = [];
	for (const [db, data] of databases) {
		for (const slug of data.articles.keys()) out.push({ db, slug });
	}
	return out;
}

export function load({ params }) {
	const db = params.db === 'top' ? ROOT : params.db;
	const article = getArticle(db, params.slug);
	if (!article) error(404, `no article ${params.slug} in ${db}`);
	const href = articleHref(db, article.slug);
	if (params.db === 'top' || href === '/') redirect(308, href);
	return { db, slug: article.slug };
}
