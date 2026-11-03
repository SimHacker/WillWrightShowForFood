/**
 * The Apple apps of disks/apple2/APPS.yml as catalog entries, one per app, for
 * @wwsff/catalog's `add`. An app names its disks, what goes in each drive to start, and the
 * moves a player makes mid-program; the page reads the app itself through `apps`.
 */

export const DISK_IMAGE = /\.(dsk|do|po|nib|woz|2mg|hdv)$/i;

export interface AppDisk {
	/** A DISKS.yml path. */
	file: string;
	/** What the disk is for, in the words a player would use. */
	label: string;
}

export interface AppStart {
	label: string;
	/** Disk ids for drive 1 and drive 2. */
	drives: string[];
}

export interface AppAction {
	label: string;
	/** The screen text that asks for this move, copied from the screen. */
	prompt?: string;
	/** Disk ids by drive: { drive1: "house" }. */
	insert?: Record<string, string>;
	/** Typed after the disks go in. */
	keys?: string;
}

export interface AppleApp {
	id: string;
	title: string;
	path: string;
	description?: string;
	order?: number;
	/** A markdown guide, by its path from the repo root. */
	guide?: string;
	/** A screen angel's ANGEL.yml, by its path from the repo root. */
	angel?: string;
	tags?: Record<string, unknown>;
	profile?: string;
	/** How many drives the app uses, 1 or 2; the panel offers only those. 2 by default. */
	drives?: number;
	disks: Record<string, AppDisk>;
	starts: AppStart[];
	actions?: AppAction[];
	people?: { bridge: string; disks: string[] };
}

export interface AppEntries {
	apps: AppleApp[];
	entries: Record<string, unknown>[];
	/** Disk ids that name no disk, files DISKS.yml does not list. */
	problems: string[];
}

/** The drive index an action's `drive1` / `drive2` key names: 0 or 1. */
export const driveIndex = (key: string) => Number(key.replace(/^drive/, "")) - 1;

export function appEntries(catalog: { apps?: AppleApp[] }, disks: { disks?: { file: string }[] }): AppEntries {
	const listed = new Set((disks.disks ?? []).map((d) => d.file));
	const apps = catalog.apps ?? [];
	const entries: Record<string, unknown>[] = [];
	const problems: string[] = [];
	for (const app of apps) {
		const need = (id: string, where: string) => {
			if (!app.disks[id]) problems.push(`${app.id}: ${where} names no disk ${id}`);
		};
		for (const [id, d] of Object.entries(app.disks)) if (!listed.has(d.file)) problems.push(`${app.id}: ${id} is ${d.file}, not in DISKS.yml`);
		if (!app.starts?.length) problems.push(`${app.id}: no start`);
		for (const s of app.starts ?? []) for (const id of s.drives) need(id, `start ${s.label}`);
		for (const a of app.actions ?? []) {
			for (const [drive, id] of Object.entries(a.insert ?? {})) {
				if (![0, 1].includes(driveIndex(drive))) problems.push(`${app.id}: action ${a.label} names ${drive}`);
				need(id, `action ${a.label}`);
			}
		}
		for (const id of app.people?.disks ?? []) need(id, "people");
		const entry: Record<string, unknown> = {
			id: `apple2:${app.id}`,
			title: app.title,
			path: app.path,
			tags: { machine: "apple2", ...app.tags },
			runs: { machine: "apple2", app: app.id, ...(app.profile && { profile: app.profile }) },
		};
		if (app.description) entry.description = app.description;
		if (typeof app.order === "number") entry.order = app.order;
		if (typeof app.guide === "string") entry.guide = app.guide;
		entries.push(entry);
	}
	return { apps, entries, problems };
}
