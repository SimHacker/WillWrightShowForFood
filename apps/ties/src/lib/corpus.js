/**
 * The corpus, loaded at build time. No fetch, therefore no CORS, therefore the same
 * code path serves dev, prerender and the offline single-file bundle.
 *
 * Weiland's index manager held three parallel namespaces:
 *
 *     struct index *documents, *pictures, *targets;
 *
 * and each index counted principals (titles) separately from entries (titles plus
 * synonyms), so resolving an alias cost what resolving a title cost. Both properties
 * are reproduced here.
 */
import { load as parseYaml } from 'js-yaml';

const markdown = import.meta.glob('../../examples/*/articles/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});
const shapes = import.meta.glob('../../examples/*/shapes/*.svg', {
	query: '?raw',
	import: 'default',
	eager: true
});
const images = import.meta.glob('../../examples/*/images/*.png', {
	import: 'default',
	eager: true
});
const indexes = import.meta.glob('../../examples/*/index.json', {
	import: 'default',
	eager: true
});

/** The resolution key: case-insensitive, tolerant of sentence punctuation.
 *  The archive writes ~Direction~ and declares the synonym "direction".
 *
 *  A leading `!` survives, being HyperTIES's marker for a reserved name (!home, !index,
 *  !topics, !OptionBack); folding it away would let prose ~home~ land on the database's
 *  home article. A trailing `!` is sentence punctuation and goes, which is how the
 *  cookbook's declared synonym `Reshape!` resolves to Reshape.
 *  Must stay in step with fold() in scripts/st0_to_md.py. */
export function fold(name) {
	return String(name)
		.toLowerCase()
		.trim()
		.replace(/^[\s.,;:?]+/, '')
		.replace(/[\s.,;:!?]+$/, '')
		.replace(/\s+/g, ' ');
}

function splitFrontmatter(text) {
	const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
	if (!m) return { meta: {}, body: text };
	return { meta: parseYaml(m[1]) ?? {}, body: text.slice(m[0].length) };
}

function pathParts(path) {
	const m = /examples\/([^/]+)\/(?:articles|shapes|images)\/(.+)\.(md|svg|png)$/.exec(path);
	return m ? { db: m[1], name: m[2] } : null;
}

function buildDatabases() {
	const dbs = new Map();

	const ensure = (id) => {
		if (!dbs.has(id)) {
			dbs.set(id, {
				id,
				articles: new Map(), // slug -> article
				documents: new Map(), // folded name -> { slug, alias }
				pictures: new Map(), // folded name -> { image }
				targets: new Map(), // folded name -> { svg, class }
				principals: 0
			});
		}
		return dbs.get(id);
	};

	for (const [path, raw] of Object.entries(markdown)) {
		const p = pathParts(path);
		if (!p) continue;
		const db = ensure(p.db);
		const { meta, body } = splitFrontmatter(raw);
		const article = {
			slug: p.name,
			title: meta.title ?? p.name,
			definition: meta.definition ?? '',
			synonyms: meta.synonyms ?? [],
			controls: Boolean(meta.controls),
			// fmt.f's found-contents? flag, decided at format time: an article with no
			// `.contents` directive never drew a FULL ENTRY button. Absent means true,
			// since the converter only writes the flag to record its absence.
			contents: meta.contents !== false,
			source: meta.source ?? '',
			body
		};
		db.articles.set(article.slug, article);
		db.documents.set(fold(article.title), { slug: article.slug, alias: false });
		db.principals += 1;
		for (const syn of article.synonyms) {
			const key = fold(syn);
			if (!db.documents.has(key)) db.documents.set(key, { slug: article.slug, alias: true });
		}
	}

	for (const [path, svg] of Object.entries(shapes)) {
		const p = pathParts(path);
		if (!p) continue;
		// Carry the path data, not the markup, so the reader renders a real <path> element
		// instead of injecting HTML.
		const cls = /data-class="([^"]+)"/.exec(svg)?.[1] ?? 'Target';
		const name = /data-name="([^"]+)"/.exec(svg)?.[1] ?? p.name;
		const d = /\sd="([^"]+)"/.exec(svg)?.[1] ?? '';
		ensure(p.db).targets.set(fold(name), { d, class: cls, slug: p.name });
	}

	for (const [path, url] of Object.entries(images)) {
		const m = /examples\/([^/]+)\/images\/(.+)$/.exec(path);
		if (!m) continue;
		const db = ensure(m[1]);
		db.images ??= new Map();
		db.images.set(m[2], url); // keyed by full filename, as index.json spells it
	}

	// index.json carries the picture namespace: picture name -> image file.
	for (const [path, idx] of Object.entries(indexes)) {
		const id = /examples\/([^/]+)\/index\.json$/.exec(path)?.[1];
		if (!id) continue;
		const db = ensure(id);
		db.title = idx.database ?? id;
		db.unresolved = idx.unresolved ?? [];
		const pics = idx.namespaces?.pictures?.index ?? {};
		for (const [name, entry] of Object.entries(pics)) {
			const file = entry.image?.replace(/^images\//, '');
			db.pictures.set(fold(name), { image: file ? db.images?.get(file) : null, name });
		}
	}

	return dbs;
}

export const databases = buildDatabases();

export function listDatabases() {
	return [...databases.values()]
		.map((db) => ({
			id: db.id,
			articles: db.articles.size,
			principals: db.principals,
			entries: db.documents.size,
			synonyms: db.documents.size - db.principals,
			targets: db.targets.size,
			pictures: db.pictures.size,
			unresolved: db.unresolved?.length ?? 0
		}))
		.sort((a, b) => b.articles - a.articles);
}

export function getDatabase(id) {
	return databases.get(id);
}

export function getArticle(dbId, slug) {
	return databases.get(dbId)?.articles.get(slug) ?? null;
}

/**
 * Resolve a ~name~ across the three namespaces, documents first.
 * Returns { space, ... } or null. Never throws: an unresolved name is a fact
 * about the corpus, and the reader renders it as plain text.
 */
export function resolve(dbId, name) {
	const db = databases.get(dbId);
	if (!db) return null;
	const key = fold(name);
	const doc = db.documents.get(key);
	if (doc) {
		const article = db.articles.get(doc.slug);
		return {
			space: 'documents',
			db: dbId,
			slug: doc.slug,
			alias: doc.alias,
			title: article?.title ?? doc.slug,
			definition: article?.definition ?? ''
		};
	}
	if (db.pictures.has(key)) return { space: 'pictures', ...db.pictures.get(key) };
	if (db.targets.has(key)) return { space: 'targets', ...db.targets.get(key) };
	return null;
}

/**
 * A reserved name, or null. HyperTIES marks the articles the browser itself needs with a
 * leading bang and finds them through the ordinary index, as synonyms of ordinary
 * articles -- doc/aut-homearticle.st0 says so outright: "An ordinary article which has
 * `!home` as a synonym. The home article is accessed when the browser starts, and when
 * the HOME option of the control panel is selected."
 *
 * So the entry point is data. A database says where it opens by declaring a synonym, and
 * nothing in the reader hardcodes a slug.
 */
export function reserved(dbId, name) {
	return resolve(dbId, name.startsWith('!') ? name : `!${name}`);
}

/** Where a database opens: its !home article, else its index, else the first article. */
export function homeOf(dbId) {
	const db = databases.get(dbId);
	if (!db) return null;
	return (
		reserved(dbId, 'home')?.slug ??
		reserved(dbId, 'index')?.slug ??
		[...db.articles.keys()][0] ??
		null
	);
}

export function articleList(dbId) {
	const db = databases.get(dbId);
	if (!db) return [];
	return [...db.articles.values()].sort((a, b) => a.title.localeCompare(b.title));
}
