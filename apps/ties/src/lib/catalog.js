/**
 * The catalog the page browses (packages/cabinet/CARTRIDGES.md §7a): every catalog.yml under
 * packages/cabinet, and an entry per Apple app in APPS.yml. Only the entries load with the
 * page; a disk image is a URL fetched when it goes in a drive, and each machine is imported
 * when an entry needs it (machines.js).
 */
import { load as loadYaml } from 'js-yaml';
import { Catalog } from '@wwsff/catalog';
import { appEntries } from '@wwsff/cabinet/disk-catalog';
import disksYaml from '../../../../packages/cabinet/disks/apple2/DISKS.yml?raw';
import appsYaml from '../../../../packages/cabinet/disks/apple2/APPS.yml?raw';

/** Where the catalog is served; an entry's URL is this plus its path. */
export const CATALOG_BASE = '/cabinet/';

const files = import.meta.glob(['../../../../packages/cabinet/**/catalog.yml', '!**/node_modules/**', '!**/dist/**'], {
	query: '?raw',
	import: 'default',
	eager: true
});

const DISK_ROOT = '../../../../packages/cabinet/disks/apple2/';
const images = import.meta.glob(['../../../../packages/cabinet/disks/apple2/**/*.{dsk,do,po,nib,woz,2mg,hdv}'], {
	query: '?url',
	import: 'default'
});

/** @param {string} path */
const sourceOf = (path) => path.replace(/^(\.\.\/)+/, '');

const built = appEntries(
	/** @type {any} */ (loadYaml(appsYaml)),
	/** @type {any} */ (loadYaml(disksYaml))
);

function build() {
	const catalog = new Catalog();
	for (const [path, text] of Object.entries(files)) {
		try {
			catalog.add(loadYaml(/** @type {string} */ (text)), sourceOf(path));
		} catch (e) {
			catalog.problems.push({ source: sourceOf(path), message: e instanceof Error ? e.message : String(e) });
		}
	}
	catalog.add({ entries: built.entries }, 'packages/cabinet/disks/apple2/APPS.yml');
	for (const message of built.problems) catalog.problems.push({ source: 'packages/cabinet/disks/apple2/APPS.yml', message });
	return catalog;
}

export const catalog = build();

/** @typedef {import('@wwsff/cabinet/disk-catalog').AppleApp} AppleApp */

/** The Apple apps by id. */
export const appleApps = new Map(built.apps.map((a) => [a.id, a]));

/** The URL of a disk image, by its DISKS.yml path, fetched only when asked. */
export async function diskUrl(/** @type {string} */ file) {
	const load = images[DISK_ROOT + file];
	if (!load) throw new Error(`no disk image ${file}`);
	return String(await load());
}

/**
 * Every app's disks as MicroM8.svelte lists them, named by app and label.
 * @type {{ name: string, label: string, profile: string, url: () => Promise<string> }[]}
 */
export const appleDisks = built.apps.flatMap((app) =>
	Object.values(app.disks).map((d) => ({
		name: d.file,
		label: `${app.title}: ${d.label}`,
		profile: app.profile ?? '',
		url: () => diskUrl(d.file)
	}))
);

/** The entry that runs an Apple app. */
export function entryForApp(/** @type {string} */ id) {
	return catalog.entry(`apple2:${id}`);
}

/** The entry that runs a PDP-7 program, by its id in cabinet-programs.js. */
export function entryForProgram(/** @type {string} */ id) {
	return catalog.entries.find((e) => e.runs?.machine === 'pdp7' && e.runs.program === id);
}

/** The entry the bare /cabinet/ address runs, as it always has. */
export const DEFAULT_ENTRY = 'symelec';
