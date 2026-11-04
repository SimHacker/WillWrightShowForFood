/**
 * A catalog of what can run: entries that declare where they appear in one browsable tree,
 * wherever their files live. The tree comes from the entries' paths, not from the disk.
 *
 *   entry    a thing in the catalog; runnable when it has `runs`, a container when it has not
 *   folder   a place in the tree; implied by any path through it, declared only to add a title,
 *            a description, an order, a `query` (a saved filter), or `featured` (entries
 *            picked out at the top, by id or path, wherever they live)
 *   root     the folder above everything, declared in a file's `root:`: the welcome
 *   path     slugs, one per level: games/simulations/little-computer-people. Its URL too.
 *   also     folders the entry is also listed in; its URL stays its path
 *   was      old paths, which resolve to the entry's path
 *   order    where the entry or folder sits among its siblings: lowest first, then by title
 *   guide    a markdown file in the repo, shown with the entry: how to play, what it is
 *   tags     facets, each a list of values: { machine: [apple2], year: ["1985"] }
 *   mixins   what a URL may add to the entry at run time (names, or a prefix ending in *)
 *   inputs   the values a URL may set, each with a type, a value path and a default
 *
 * Input is liberal: a path may be written as titles ("Games/Little Computer People"), tags as a
 * map or as "facet:value" strings, a list as a single value. What is stored is the normal form.
 * Nothing throws on a bad entry: it is left out and named in `problems`.
 */

export type InputType = "string" | "integer" | "number" | "boolean";

export interface Input {
	/** Where the value goes, as a dotted path into the composed configuration. */
	path: string;
	type: InputType;
	default?: unknown;
	min?: number;
	max?: number;
	/** The allowed values, for a choice. */
	values?: string[];
	title?: string;
}

export interface Entry {
	id: string;
	title: string;
	path: string;
	also: string[];
	was: string[];
	tags: Record<string, string[]>;
	description?: string;
	order?: number;
	/** A markdown file, by its path from the repo root. */
	guide?: string;
	/** What to boot: the machine and whatever its adapter reads. Absent: a container. */
	runs?: Record<string, unknown>;
	mixins: string[];
	inputs: Record<string, Input>;
	/** The file or source the entry came from. */
	source?: string;
}

export interface Query {
	text?: string;
	tags?: Record<string, string | string[]>;
	runnable?: boolean;
}

export interface Folder {
	path: string;
	title: string;
	description?: string;
	order?: number;
	query?: Query;
	/** Entries picked out at the top of the folder, by id or path. */
	featured?: string[];
	source?: string | undefined;
}

export interface CatalogNode {
	path: string;
	slug: string;
	title: string;
	folder?: Folder;
	entry?: Entry;
	/** Listed here by `also` or a query; the entry's own path is elsewhere. */
	link?: boolean;
	children: CatalogNode[];
}

export interface Problem {
	source?: string | undefined;
	message: string;
}

export interface Resolved {
	path: string;
	entry?: Entry;
	folder?: Folder | undefined;
	/** The entry's own path, when `path` was an old path or an `also` listing. */
	redirect?: string;
}

/** "Little Computer People" → "little-computer-people"; "Apple ][" → "apple". */
export function slug(text: string): string {
	return String(text)
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/['’]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** Any path, with titles or slugs, slashes at either end or none → slug/slug/slug. */
export function slugPath(path: string): string {
	return String(path)
		.split("/")
		.map(slug)
		.filter(Boolean)
		.join("/");
}

/** "little-computer-people" → "Little Computer People", for a folder nobody titled. */
export function titleCase(s: string): string {
	return s
		.split("-")
		.filter(Boolean)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

const lastSegment = (path: string) => path.slice(path.lastIndexOf("/") + 1);
const parentOf = (path: string) => (path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "");
const list = (v: unknown): unknown[] => (v == null ? [] : Array.isArray(v) ? v : [v]);
const isMap = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** Tags as a map ({ machine: apple2, by: [a, b] }) or a list ("machine:apple2", "forth"). */
export function normalizeTags(raw: unknown): Record<string, string[]> {
	const tags: Record<string, string[]> = {};
	const add = (facet: string, value: unknown) => {
		const f = slug(facet) || "tag";
		for (const v of list(value)) {
			if (v == null || v === "") continue;
			const s = String(v);
			(tags[f] ??= []).includes(s) || tags[f].push(s);
		}
	};
	if (isMap(raw)) for (const [k, v] of Object.entries(raw)) add(k, v);
	else
		for (const t of list(raw)) {
			const s = String(t);
			const m = /^([^:]+)::?(.+)$/.exec(s);
			if (m) add(m[1] ?? "tag", (m[2] ?? "").trim());
			else add("tag", s);
		}
	return tags;
}

function mergeTags(a: Record<string, string[]>, b: Record<string, string[]>): Record<string, string[]> {
	const out: Record<string, string[]> = {};
	for (const [k, v] of Object.entries(a)) out[k] = [...v];
	for (const [k, v] of Object.entries(b)) for (const s of v) (out[k] ??= []).includes(s) || out[k].push(s);
	return out;
}

const INPUT_TYPES = new Set<InputType>(["string", "integer", "number", "boolean"]);

/** `{ baud: integer }`, `{ baud: { path: serial.baud, type: integer, default: 9600 } }`. */
export function normalizeInputs(raw: unknown): Record<string, Input> {
	const inputs: Record<string, Input> = {};
	if (!isMap(raw)) return inputs;
	for (const [name, spec] of Object.entries(raw)) {
		const s: Record<string, unknown> = isMap(spec) ? spec : { type: spec };
		const given = typeof s.type === "string" ? (s.type as InputType) : undefined;
		const inferred: InputType =
			typeof s.default === "boolean" ? "boolean" : typeof s.default === "number" ? (Number.isInteger(s.default) ? "integer" : "number") : "string";
		const input: Input = {
			path: typeof s.path === "string" && s.path ? s.path : name,
			type: given && INPUT_TYPES.has(given) ? given : Array.isArray(s.values) ? "string" : inferred
		};
		if (s.default !== undefined) input.default = s.default;
		if (typeof s.min === "number") input.min = s.min;
		if (typeof s.max === "number") input.max = s.max;
		if (Array.isArray(s.values)) input.values = s.values.map(String);
		if (typeof s.title === "string") input.title = s.title;
		inputs[name] = input;
	}
	return inputs;
}

function normalizeQuery(raw: unknown): Query | undefined {
	if (!isMap(raw)) return undefined;
	const q: Query = {};
	if (typeof raw.text === "string") q.text = raw.text;
	if (isMap(raw.tags)) q.tags = Object.fromEntries(Object.entries(normalizeTags(raw.tags)));
	if (typeof raw.runnable === "boolean") q.runnable = raw.runnable;
	return q;
}

/** What a catalog file may hold: one entry, or `entries`, `folders` and `defaults`. */
export interface CatalogFile {
	entries?: unknown[];
	folders?: unknown[];
	/** The folder above everything: a title, a description, `featured`. No path. */
	root?: unknown;
	/** Merged under every entry of this file: tags, mixins, inputs, and runs for runnable entries. */
	defaults?: unknown;
}

export class Catalog {
	readonly problems: Problem[] = [];
	#entries: Entry[] = [];
	#byPath = new Map<string, Entry>();
	#byId = new Map<string, Entry>();
	#was = new Map<string, Entry>();
	#also = new Map<string, Entry[]>();
	#folders = new Map<string, Folder>();
	/** Every path that is a folder, declared or implied, with its child paths. */
	#children = new Map<string, Set<string>>();

	/** Add a catalog file's contents: an entry, or { entries, folders, defaults }. */
	add(file: unknown, source?: string): this {
		if (!isMap(file)) {
			this.problems.push({ source, message: "not a map" });
			return this;
		}
		if ("entries" in file || "folders" in file || "defaults" in file || "root" in file) {
			const defaults = isMap(file.defaults) ? file.defaults : {};
			if (isMap(file.root)) this.addFolder({ ...file.root, path: "" }, source);
			for (const f of list(file.folders)) this.addFolder(f, source);
			for (const e of list(file.entries)) this.addEntry(e, source, defaults);
		} else this.addEntry(file, source, {});
		return this;
	}

	addFolder(raw: unknown, source?: string): Folder | null {
		if (!isMap(raw) || typeof raw.path !== "string") {
			this.problems.push({ source, message: `folder without a path: ${JSON.stringify(raw)}` });
			return null;
		}
		const path = slugPath(raw.path);
		if (!path && raw.path !== "") {
			this.problems.push({ source, message: `folder path has no slugs: ${raw.path}` });
			return null;
		}
		const prior = this.#folders.get(path);
		const folder: Folder = {
			path,
			title: typeof raw.title === "string" ? raw.title : prior?.title ?? (path ? titleCase(lastSegment(path)) : ""),
			source
		};
		const featured = raw.featured === undefined ? prior?.featured : list(raw.featured).map(String).filter(Boolean);
		if (featured?.length) folder.featured = featured;
		const description = typeof raw.description === "string" ? raw.description : prior?.description;
		if (description) folder.description = description;
		const order = typeof raw.order === "number" ? raw.order : prior?.order;
		if (order !== undefined) folder.order = order;
		const query = normalizeQuery(raw.query) ?? prior?.query;
		if (query) folder.query = query;
		this.#folders.set(path, folder);
		if (path) this.#link(path);
		return folder;
	}

	addEntry(raw: unknown, source?: string, defaults: Record<string, unknown> = {}): Entry | null {
		if (!isMap(raw)) {
			this.problems.push({ source, message: `entry is not a map: ${JSON.stringify(raw)}` });
			return null;
		}
		const path = slugPath(typeof raw.path === "string" ? raw.path : "");
		if (!path) {
			this.problems.push({ source, message: `entry without a path: ${String(raw.id ?? raw.title ?? "?")}` });
			return null;
		}
		const id = typeof raw.id === "string" && raw.id ? raw.id : lastSegment(path);
		if (this.#byId.has(id)) {
			this.problems.push({ source, message: `duplicate id ${id} (first from ${this.#byId.get(id)?.source ?? "?"})` });
			return null;
		}
		if (this.#byPath.has(path)) {
			this.problems.push({ source, message: `duplicate path ${path}: ${id} and ${this.#byPath.get(path)?.id}` });
			return null;
		}
		// Default runs fill in an entry's own runs; they never make a container runnable.
		const runs = isMap(raw.runs) ? { ...(isMap(defaults.runs) ? defaults.runs : {}), ...raw.runs } : undefined;
		const entry: Entry = {
			id,
			title: typeof raw.title === "string" ? raw.title : titleCase(lastSegment(path)),
			path,
			also: list(raw.also).map((p) => slugPath(String(p))).filter((p) => p && p !== parentOf(path)),
			was: list(raw.was).map((p) => slugPath(String(p))).filter((p) => p && p !== path),
			tags: mergeTags(normalizeTags(defaults.tags), normalizeTags(raw.tags)),
			mixins: [...new Set([...list(defaults.mixins), ...list(raw.mixins)].map(String))],
			inputs: { ...normalizeInputs(defaults.inputs), ...normalizeInputs(raw.inputs) }
		};
		if (runs) entry.runs = runs;
		if (typeof raw.description === "string") entry.description = raw.description;
		if (typeof raw.order === "number") entry.order = raw.order;
		if (typeof raw.guide === "string" && raw.guide) entry.guide = raw.guide.replace(/^\/+/, "");
		if (source) entry.source = source;
		this.#entries.push(entry);
		this.#byId.set(id, entry);
		this.#byPath.set(path, entry);
		this.#link(path);
		for (const p of entry.also) {
			const at = this.#also.get(p) ?? [];
			at.push(entry);
			this.#also.set(p, at);
			this.#link(p);
		}
		for (const p of entry.was) {
			if (this.#was.has(p)) this.problems.push({ source, message: `old path ${p} claimed by ${this.#was.get(p)?.id} and ${id}` });
			else this.#was.set(p, entry);
		}
		return entry;
	}

	/** Record path as a child of its parent, and so on up to the root. */
	#link(path: string): void {
		for (let p = path; p; p = parentOf(p)) {
			const up = parentOf(p);
			const kids = this.#children.get(up) ?? new Set<string>();
			kids.add(p);
			this.#children.set(up, kids);
		}
	}

	get entries(): readonly Entry[] {
		return this.#entries;
	}

	get folders(): readonly Folder[] {
		return [...this.#folders.values()];
	}

	/** An entry by id, or by its own path. */
	entry(idOrPath: string): Entry | undefined {
		return this.#byId.get(idOrPath) ?? this.#byPath.get(slugPath(idOrPath));
	}

	/** What a path names: an entry, a folder, or an old or `also` path of an entry. */
	resolve(path: string): Resolved | undefined {
		const p = slugPath(path);
		const own = this.#byPath.get(p);
		const folder = this.#folder(p);
		if (own || folder) return { path: p, ...(own && { entry: own }), ...(folder && { folder }) };
		const listed = this.#also.get(parentOf(p))?.find((e) => lastSegment(e.path) === lastSegment(p));
		const moved = this.#was.get(p) ?? listed;
		if (moved) return { path: moved.path, entry: moved, folder: this.#folder(moved.path), redirect: moved.path };
		return undefined;
	}

	/** The declared folder at a path, or an implied one when anything sits below it. */
	#folder(path: string): Folder | undefined {
		const declared = this.#folders.get(path);
		if (declared) return declared;
		if (path === "") return { path, title: "" };
		if (!(this.#children.has(path) || this.#also.has(path))) return undefined;
		return { path, title: titleCase(lastSegment(path)) };
	}

	/** A folder's `featured` entries, in its order; any that name nothing go to `problems` once. */
	featured(folder: Folder | undefined): Entry[] {
		const found: Entry[] = [];
		for (const name of folder?.featured ?? []) {
			const e = this.entry(name);
			if (e) found.push(e);
			else if (!this.problems.some((p) => p.message === `featured ${name} in ${folder?.path || "root"}: no such entry`))
				this.problems.push({ source: folder?.source, message: `featured ${name} in ${folder?.path || "root"}: no such entry` });
		}
		return found;
	}

	/** The tree from a path down; the root by default. */
	tree(path = ""): CatalogNode | undefined {
		const p = slugPath(path);
		if (p && !this.#byPath.has(p) && !this.#folder(p)) return undefined;
		return this.#node(p, false, undefined);
	}

	#node(path: string, link: boolean, entry: Entry | undefined): CatalogNode {
		const own = entry ?? this.#byPath.get(path);
		const folder = this.#folder(path);
		const node: CatalogNode = {
			path,
			slug: lastSegment(path),
			title: folder && this.#folders.has(path) ? folder.title : own?.title ?? folder?.title ?? "",
			children: []
		};
		if (folder) node.folder = folder;
		if (own) node.entry = own;
		if (link) node.link = true;
		if (link) return node;
		if (folder?.query) {
			node.children = this.find(folder.query)
				.map((e) => ({ path: e.path, slug: lastSegment(e.path), title: e.title, entry: e, link: true, children: [] }))
				.sort(byHome(this.#folders));
			return node;
		}
		for (const child of this.#children.get(path) ?? []) node.children.push(this.#node(child, false, undefined));
		for (const e of this.#also.get(path) ?? []) node.children.push(this.#node(e.path, true, e));
		node.children.sort(byOrder(this.#folders));
		return node;
	}

	/** Entries matching every facet in `tags` (any of a facet's values), and the text if given. */
	find(query: Query = {}): Entry[] {
		const text = query.text?.trim().toLowerCase();
		const want = Object.entries(normalizeTags(query.tags ?? {}));
		return this.#entries.filter((e) => {
			if (query.runnable !== undefined && !!e.runs !== query.runnable) return false;
			for (const [facet, values] of want) {
				const have = (e.tags[facet] ?? []).map((v) => v.toLowerCase());
				if (!values.some((v) => have.includes(v.toLowerCase()))) return false;
			}
			if (!text) return true;
			const hay = [e.id, e.title, e.path, e.description ?? "", ...Object.values(e.tags).flat()].join(" ").toLowerCase();
			return text.split(/\s+/).every((w) => hay.includes(w));
		});
	}

	/** Each facet's values and how many entries carry them. */
	facets(entries: readonly Entry[] = this.#entries): Record<string, Record<string, number>> {
		const out: Record<string, Record<string, number>> = {};
		for (const e of entries)
			for (const [facet, values] of Object.entries(e.tags)) {
				const counts = (out[facet] ??= {});
				for (const v of values) counts[v] = (counts[v] ?? 0) + 1;
			}
		return out;
	}

	/** A tree by one facet: a folder per value, the entries carrying it under each, as links. */
	byFacet(facet: string, entries: readonly Entry[] = this.#entries): CatalogNode {
		const f = slug(facet);
		const groups = new Map<string, Entry[]>();
		for (const e of entries) for (const v of e.tags[f] ?? []) groups.set(v, [...(groups.get(v) ?? []), e]);
		const children = [...groups.entries()]
			.sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
			.map(([value, es]) => ({
				path: `${f}/${slug(value)}`,
				slug: slug(value),
				title: value,
				children: es
					.map((e) => ({ path: e.path, slug: lastSegment(e.path), title: e.title, entry: e, link: true, children: [] }))
					.sort((a, b) => a.title.localeCompare(b.title))
			}));
		return { path: f, slug: f, title: titleCase(f), children };
	}
}

/** Siblings by `order`, a folder's or an entry's, lowest first; then by title. */
function byOrder(folders: Map<string, Folder>) {
	return (a: CatalogNode, b: CatalogNode) => {
		const oa = folders.get(a.path)?.order ?? a.entry?.order ?? Infinity;
		const ob = folders.get(b.path)?.order ?? b.entry?.order ?? Infinity;
		if (oa !== ob) return oa - ob;
		return a.title.localeCompare(b.title, undefined, { numeric: true });
	};
}

/** A saved filter's entries grouped by the folders they live in, each group in its own order. */
function byHome(folders: Map<string, Folder>) {
	const siblings = byOrder(folders);
	const homes = (path: string) => {
		const up: string[] = [];
		for (let p = parentOf(path); p; p = parentOf(p)) up.unshift(p);
		return up;
	};
	return (a: CatalogNode, b: CatalogNode) => {
		const ha = homes(a.path);
		const hb = homes(b.path);
		for (let i = 0; i < Math.min(ha.length, hb.length); i++) {
			if (ha[i] === hb[i]) continue;
			const fa = folders.get(ha[i]!)?.order ?? Infinity;
			const fb = folders.get(hb[i]!)?.order ?? Infinity;
			return fa !== fb ? fa - fb : ha[i]!.localeCompare(hb[i]!);
		}
		return ha.length !== hb.length ? ha.length - hb.length : siblings(a, b);
	};
}
