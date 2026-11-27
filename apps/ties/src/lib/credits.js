/**
 * packages/cabinet/CREDITS.yml as a tree for the About panel (AboutPanel.svelte): the root is
 * the About node, its sections under it, and their entries under them, to any depth.
 */
import { load } from 'js-yaml';
import creditsYaml from '../../../../packages/cabinet/CREDITS.yml?raw';

/**
 * @typedef {{ id: string, name: string, url: string, kind: string, for: string, about: string[], entries: CreditNode[] }} CreditNode
 */

/** @param {any} raw @param {string} fallbackId @returns {CreditNode} */
function node(raw, fallbackId) {
	const about = raw?.about === undefined ? [] : Array.isArray(raw.about) ? raw.about.map(String) : [String(raw.about)];
	const id = String(raw?.id ?? fallbackId);
	return {
		id,
		name: String(raw?.name ?? raw?.title ?? id),
		url: typeof raw?.url === 'string' ? raw.url : '',
		kind: String(raw?.kind ?? 'section'),
		for: typeof raw?.for === 'string' ? raw.for : '',
		about,
		entries: (raw?.entries ?? raw?.sections ?? []).map((/** @type {any} */ e, /** @type {number} */ i) => node(e, `${id}-${i}`))
	};
}

const parsed = /** @type {any} */ (load(creditsYaml));

/** The About tree. */
export const credits = node({ ...parsed, id: 'about', name: 'About' }, 'about');

/** Every node of `n`'s tree with the outline nodes above it, top down. @param {CreditNode} n @param {string[]} above @param {(id: string) => string} outlineId */
export function flatten(n, above, outlineId) {
	/** @type {{ node: CreditNode, home: string[] }[]} */
	const out = [{ node: n, home: above }];
	for (const e of n.entries) out.push(...flatten(e, [...above, outlineId(n.id)], outlineId));
	return out;
}
