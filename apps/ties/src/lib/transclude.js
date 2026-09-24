/**
 * Transclusion, static and live.
 *
 * A ```transclude with `article:` is spliced in at parse time. One with `follows:`
 * names an applet on the page and stays a live `follow` segment: its `article:` is a
 * template, `cabinet-{program}`, filled from whatever that applet publishes on the
 * page's board (applets.svelte.js) and re-resolved when the applet changes.
 *
 *     ```transclude
 *     follows: cabinet
 *     article: cabinet-{program}
 *     else: cabinet-other
 *     ```
 *
 * No article of that name renders nothing, or `else:` if given.
 */
import { paginate, parseArticle } from './markdown.js';
import { getArticle, resolve } from './corpus.js';

const MAX_DEPTH = 2;

/** `{key}` filled from state; null while any key is unset. */
export function fillTemplate(template, state) {
	if (template == null) return null;
	let missing = false;
	const out = String(template).replace(/\{(\w+)\}/g, (_, key) => {
		const v = state?.[key];
		if (v == null || v === '') missing = true;
		return missing ? '' : String(v);
	});
	return missing ? null : out;
}

/** The article's segments, expanded, or null if the name resolves to no article. */
export function articleSegments(dbId, name, depth = 0, seeds = {}) {
	if (!name || depth > MAX_DEPTH) return null;
	const found = resolve(dbId, name);
	const art = found?.slug ? getArticle(found.db ?? dbId, found.slug) : null;
	if (!art) return null;
	const fromDb = found.db ?? dbId;
	return expandTranscludes(fromDb, parseArticle(paginate(art.body).join('\n\n'), fromDb), depth + 1, seeds);
}

/**
 * `seeds` collects each cabinet's initial state as the page is expanded, so a follow
 * slot has something to show before the applet mounts, and in prerendered HTML,
 * where it never does.
 */
export function expandTranscludes(dbId, segs, depth = 0, seeds = {}) {
	const out = [];
	for (const segment of segs) {
		if (segment.kind === 'cabinet') {
			seeds[segment.spec.id ?? 'cabinet'] ??= { program: segment.spec.program ?? null };
		}
		if (segment.kind !== 'transclude') {
			out.push({ ...segment, db: segment.db ?? dbId });
			continue;
		}
		if (depth > MAX_DEPTH) continue;
		const { spec } = segment;
		if (spec.path) {
			out.push({ kind: 'repodoc', spec, db: dbId });
			continue;
		}
		const sourceDb = spec.db ?? dbId;
		if (spec.follows) {
			out.push({ kind: 'follow', spec, db: sourceDb, depth, seeds });
			continue;
		}
		const name = spec.article ?? spec.from ?? spec.of;
		const inner = articleSegments(sourceDb, name, depth, seeds);
		out.push(
			...(inner ?? [
				{
					kind: 'html',
					html: `<p class="absent">transclude missed: ${sourceDb}/${name ?? '?'}</p>`,
					db: dbId
				}
			])
		);
	}
	return out;
}

function findArticle(dbId, name) {
	if (!name) return null;
	const found = resolve(dbId, name);
	const db = found?.db ?? dbId;
	const article = found?.slug ? getArticle(db, found.slug) : null;
	return article ? { db, article } : null;
}

/** The { db, article } a follow segment shows for the applet state it sees, or null. */
export function followArticle(segment, state) {
	const { spec, db } = segment;
	const template = spec.article ?? spec.from ?? spec.of;
	return findArticle(db, fillTemplate(template, state)) ?? findArticle(db, spec.else);
}
