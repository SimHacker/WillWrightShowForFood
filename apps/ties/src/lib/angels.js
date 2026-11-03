/**
 * Screen angels (packages/cabinet/angels/<app>/ANGEL.yml and the PNG looks beside it), loaded
 * by the repo-root path an app's `angel:` names. Fetched on first use, not bundled into pages.
 */
import { Angel, loadLooks, parseAngel } from '@wwsff/cabinet/angel';

const ROOT = '../../../../';

const specs = import.meta.glob('../../../../packages/cabinet/angels/**/ANGEL.yml', { query: '?raw', import: 'default' });
const pngs = import.meta.glob('../../../../packages/cabinet/angels/**/*.png', { query: '?url', import: 'default' });

/** @param {string} path a repo-root path */
const local = (path) => ROOT + path.replace(/^\/+/, '');

/** A fresh Angel for the ANGEL.yml at a repo-root path. @param {string} path */
export async function loadAngel(path) {
	const key = local(path);
	const text = specs[key];
	if (!text) throw new Error(`no screen angel ${path}`);
	const spec = parseAngel(/** @type {string} */ (await text()));
	const dir = key.slice(0, key.lastIndexOf('/') + 1);
	const looks = await loadLooks(spec.looks, async (png) => {
		const url = pngs[dir + png];
		if (!url) throw new Error(`${path}: no look ${png}`);
		const response = await fetch(/** @type {string} */ (await url()));
		return new Uint8Array(await response.arrayBuffer());
	});
	return new Angel(spec, looks);
}
