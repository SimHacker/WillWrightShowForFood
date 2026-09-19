/**
 * Markdown -> segments. Prose becomes HTML; each ```target block becomes a segment the
 * reader renders as a live applet, because {@html} cannot host a Svelte component.
 *
 * ~name~ is handled by a markdown-it INLINE RULE rather than a regex over the output,
 * so a tilde inside a code span stays a tilde. The article documenting link syntax
 * prints `.~` literally, and would be mangled by the naive approach.
 */
import MarkdownIt from 'markdown-it';
import { load as parseYaml } from 'js-yaml';

/** `~name~` -> link token. Leaves `~~strikethrough~~` alone. */
function tiesLinks(md) {
	md.inline.ruler.before('emphasis', 'ties_link', (state, silent) => {
		const start = state.pos;
		if (state.src.charCodeAt(start) !== 0x7e /* ~ */) return false;
		if (state.src.charCodeAt(start + 1) === 0x7e) return false; // strikethrough
		const end = state.src.indexOf('~', start + 1);
		if (end < 0) return false;
		const name = state.src.slice(start + 1, end);
		if (!name.trim() || name.includes('\n')) return false;

		if (!silent) {
			const open = state.push('link_open', 'a', 1);
			open.attrSet('href', '#');
			open.attrSet('class', 'ties-link');
			open.attrSet('data-ties-name', name.trim());
			const text = state.push('text', '', 0);
			text.content = name.trim();
			state.push('link_close', 'a', -1);
		}
		state.pos = end + 1;
		return true;
	});
}

const md = new MarkdownIt({ html: false, linkify: false, typographer: false }).use(tiesLinks);

const TARGET_BLOCK = /^```target\r?\n([\s\S]*?)\r?\n?```$/m;

/** Must stay in step with PAGE_BREAK in scripts/st0_to_md.py. */
const PAGE_BREAK = /^<!-- page -->[ \t]*\r?\n?/m;

/**
 * A body -> its stack of pages. A pile holds pages, `.page` pushes one, and _zap_pages
 * empties the stack when a new article arrives. Always at least one page, so that
 * pages[pile.page] is safe and the page verbs simply come out disabled.
 */
export function paginate(body) {
	return String(body ?? '').split(PAGE_BREAK);
}

/** Must stay in step with ROW_BREAK in scripts/st0_to_md.py. */
const ROW_BREAK = /^<!-- row -->[ \t]*\r?\n?/m;

/**
 * A control panel body -> its rows. control.st0 spaces buttons apart within a row and
 * breaks rows with `.nl .nl`, so the panel's shape is the storyboard's to state.
 */
export function splitRows(body) {
	return String(body ?? '')
		.split(ROW_BREAK)
		.filter((row) => row.trim());
}

/**
 * @returns {Array<{kind:'html', html:string} | {kind:'target', spec:object}>}
 */
export function parseArticle(body) {
	const segments = [];
	let rest = body ?? '';

	while (rest.length) {
		const m = TARGET_BLOCK.exec(rest);
		if (!m) break;
		const before = rest.slice(0, m.index);
		if (before.trim()) segments.push({ kind: 'html', html: md.render(before) });
		let spec = {};
		try {
			spec = parseYaml(m[1]) ?? {};
		} catch {
			// A malformed block is shown as what it is, not swallowed.
			spec = { error: m[1] };
		}
		segments.push({ kind: 'target', spec });
		rest = rest.slice(m.index + m[0].length);
	}
	if (rest.trim()) segments.push({ kind: 'html', html: md.render(rest) });
	return segments;
}

export function renderInline(text) {
	return md.renderInline(text ?? '');
}
