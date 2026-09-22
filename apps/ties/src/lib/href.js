/**
 * Permalinks. hyperties occupies `/`. Every other database lives under
 * `/databases/<id>/`, which is the MOOLLM container shape: plural name, one type.
 * Breadcrumbs start at HyperTIES and drill the same path the URL does.
 */
import { getArticle, homeOf, resolve } from './corpus.js';

export const ROOT = 'hyperties';

function slash(path) {
	return path.endsWith('/') ? path : `${path}/`;
}

export function articleHref(db, slug) {
	if (!db) return '/';
	if (db === ROOT && (!slug || slug === homeOf(ROOT))) return '/';
	if (db === ROOT && slug) return slash(`/databases/${ROOT}/${slug}`);
	if (slug && slug === homeOf(db)) return slash(`/databases/${db}`);
	if (slug) return slash(`/databases/${db}/${slug}`);
	return slash(`/databases/${db}`);
}

export function samePath(a, b) {
	return slash(a) === slash(b);
}

/** Display name for a database crumb: the curated door in hyperties, else the id. */
export function dbLabel(db) {
	if (db === ROOT) return 'HyperTIES';
	const door = resolve(ROOT, db);
	return door?.title ?? db;
}

/**
 * Site trail: HyperTIES, then the sub-database, then the article.
 * Being in hyperties itself does not repeat the name.
 */
export function crumbTrail(db, slug) {
	const rootSlug = homeOf(ROOT);
	const crumbs = [{ db: ROOT, slug: rootSlug, label: 'HyperTIES' }];
	if (!db || db === ROOT) {
		if (slug && slug !== rootSlug) {
			const art = getArticle(ROOT, slug);
			if (art) crumbs.push({ db: ROOT, slug, label: art.title });
		}
		return crumbs;
	}
	const dbHome = homeOf(db);
	crumbs.push({ db, slug: dbHome, label: dbLabel(db) });
	if (slug && slug !== dbHome) {
		const art = getArticle(db, slug);
		if (art) crumbs.push({ db, slug, label: art.title });
	}
	return crumbs;
}

function stepLabel(step) {
	if (step.db === ROOT && step.slug === homeOf(ROOT)) return 'HyperTIES';
	return getArticle(step.db, step.slug)?.title ?? step.slug;
}

/**
 * The visit path up to here. Consecutive repeats collapse. HyperTIES is path[0]
 * when the pile was seeded at root; we do not invent a second one.
 */
export function pathTrail(steps = []) {
	const trail = [];
	for (let index = 0; index < steps.length; index++) {
		const step = steps[index];
		const prev = trail[trail.length - 1];
		if (prev && prev.db === step.db && prev.slug === step.slug) continue;
		trail.push({
			db: step.db,
			slug: step.slug,
			label: stepLabel(step),
			index,
			root: step.db === ROOT && step.slug === homeOf(ROOT)
		});
	}
	return trail;
}
