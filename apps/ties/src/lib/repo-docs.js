/**
 * WillWrightShowForFood files a `transclude` fence can splice by `path:`.
 *
 * Lazy on purpose: each file is its own chunk, fetched only when an article shows it, so
 * the Heinz room's ~800 KB of markdown never rides along with every page. The globs are
 * the allow-list; a path outside them renders as a link to GitHub instead.
 */
import MarkdownIt from 'markdown-it';

const REPO_URL = 'https://github.com/SimHacker/WillWrightShowForFood';
const BRANCH = 'main';

const loaders = import.meta.glob(
	[
		'../../../../characters/heinz-lemke/**/*.md',
		'../../../../characters/lars-brinkhoff/**/*.md',
		'../../../../characters/roy-eagleson/**/*.md',
		'../../../../packages/cabinet/*.md',
		'../../../../repo-shows/pixie-pie-menus-pdp7/**/*.md',
		'../../../../repo-shows/ben-and-heinz-pie-menus/**/*.md',
		'!**/node_modules/**'
	],
	{ query: '?raw', import: 'default' }
);

const PREFIX = '../../../../';
const byPath = new Map(Object.entries(loaders).map(([k, v]) => [k.slice(PREFIX.length), v]));

export function hasRepoDoc(path) {
	return byPath.has(normalize(path));
}

export function githubUrl(path, kind = 'blob') {
	return `${REPO_URL}/${kind}/${BRANCH}/${normalize(path)}`;
}

function normalize(path) {
	return String(path ?? '')
		.replace(/^\/+/, '')
		.replace(/^\.\//, '');
}

function dirname(path) {
	const i = path.lastIndexOf('/');
	return i < 0 ? '' : path.slice(0, i + 1);
}

function joinPath(base, rel) {
	const parts = (dirname(base) + rel).split('/');
	const out = [];
	for (const p of parts) {
		if (p === '..') out.pop();
		else if (p !== '.' && p !== '') out.push(p);
	}
	return out.join('/');
}

const md = new MarkdownIt({ html: false, linkify: true, typographer: false });

// Relative links in a repo doc point at its neighbours on disk. On this site they would
// resolve against the article URL, so send them to GitHub, where the neighbours are.
function rewrite(attr, kind) {
	return (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		const value = token.attrGet(attr);
		if (value && !/^([a-z]+:|#|\/\/)/i.test(value)) {
			const [file, hash] = value.split('#');
			const target = file ? joinPath(env.path, file) : normalize(env.path);
			token.attrSet(attr, githubUrl(target, kind) + (hash ? `#${hash}` : ''));
		}
		if (attr === 'href' && /^https?:/i.test(token.attrGet('href') ?? '')) {
			token.attrSet('target', '_blank');
			token.attrSet('rel', 'noopener');
		}
		return self.renderToken(tokens, idx, options);
	};
}
md.renderer.rules.link_open = rewrite('href', 'blob');
const defaultImage = md.renderer.rules.image;
md.renderer.rules.image = (tokens, idx, options, env, self) => {
	const token = tokens[idx];
	const src = token.attrGet('src');
	if (src && !/^([a-z]+:|\/\/)/i.test(src)) token.attrSet('src', githubUrl(joinPath(env.path, src), 'raw'));
	return defaultImage(tokens, idx, options, env, self);
};

function stripFrontmatter(text) {
	const m = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(text);
	return m ? text.slice(m[0].length) : text;
}

/** Fetch and render a repo doc. Resolves to null when the path is not on the allow-list. */
export async function loadRepoDoc(path) {
	const key = normalize(path);
	const loader = byPath.get(key);
	if (!loader) return null;
	const raw = await loader();
	return md.render(stripFrontmatter(raw), { path: key });
}
