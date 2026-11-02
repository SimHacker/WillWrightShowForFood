// Flavors: directories that inherit from other directories.
//
// A flavor is a directory holding a marker file (flavor.yml, flavor.json, or the marker
// in any registered syntax) and any other files. Its id is the directory's path. `parents`
// is an ordered list of references to the flavors it is built on: names in a file, Flavor
// objects in memory (parentFlavors).
//
// The first parent is the base, what the flavor is; the rest are mixins, one capability
// each. Instantiating applies every ancestor once, in C3 order (see precedence), then the
// flavor itself. Of two parents, the later one wins where they disagree.
//
// Three keys are about the flavor, not data, and are not inherited, as in Lisp Machine
// Flavors: `parents`; `abstract: true` (:abstract-flavor), a mixin or base never instantiated
// alone; and `requires: { flavors, keys }` (:required-flavors, :required-instance-variables),
// what an instance must also have, checked when it is made.
//
// A flavor's files keep their path: apple2/serial-slot4/acia.fs is at that path in the source
// and in the image, so a value can name a file beside its own marker. Files a rule marks
// `overlay` are laid over their ancestors' files instead, by path inside the flavor, and land
// once at the image's root: a file in a known syntax is merged key by key with its ancestors'
// file of the same path, whatever syntax each is written in (video.yml and video.cfg are one
// file); other overlay files replace whole. A file nobody else has keeps its bytes.
//
// A file named for a template engine (acia.fs.liquid) is rendered with the instance's values
// and written without the engine's extension (template.ts).

import { clone, isMap, merge, type History, type Plain, type PlainMap, type Provenance, type Rule } from "./merge.js";
import { NoteFold, sites, type KeptNote, type Notes } from "./notes.js";
import { json, syntaxFor, syntaxNamed, text, type Syntax } from "./syntax.js";
import { yaml } from "./yaml.js";
import { glob } from "./glob.js";
import { FULL, fullText, valueTable } from "./full.js";
import { liquid, templateFor, type TemplateEngine } from "./template.js";

export type Content = string | Uint8Array;

export interface Source {
	paths(): readonly string[]; // every file, relative, with '/' separators
	read(path: string): Content;
}

export interface FileRule {
	match: string; // glob over the file's path inside its flavor: "micropak/*", "**/*.dsk"
	overlay?: boolean; // laid over ancestors' files by path and written at the image's root
	rules?: readonly Rule[]; // combination rules for an overlay file's values
	as?: string; // syntax to write a combined overlay file in
	opaque?: boolean; // an overlay file never parsed; a child's replaces the parent's whole
}

export interface FlavorsOptions {
	marker?: string; // marker file name without extension; default "flavor"
	syntaxes?: readonly Syntax[]; // default yaml and json
	templates?: readonly TemplateEngine[]; // default liquid
	rules?: readonly Rule[]; // combination rules for the marker's values; recipe is keyed by id
	files?: readonly FileRule[]; // first match wins
	strip?: readonly string[]; // keys not inherited; default ["id"]
}

export interface Flavor {
	id: string;
	marker: string; // path of the marker file
	syntax: string; // the marker's syntax
	parents: string[]; // references as written
	abstract: boolean;
	requires: Requires;
	data: PlainMap; // the marker's values, without parents, abstract, requires and stripped keys
	notes: Notes;
	files: string[]; // paths relative to the flavor, marker excluded
}

export interface InstanceFile {
	name: string; // what files are matched by: an overlay's path inside its flavor, without a syntax's extension; otherwise the path
	path: string; // path to write it at, relative to the image
	placement: "own" | "overlay";
	flavor: string; // the flavor of the file written
	template?: string; // the engine it is rendered by
	syntax?: string; // the syntax it will be written in
	origins: string[]; // flavors that contributed, in order
	sources: string[]; // the files read, in order, as paths in the source
	value?: Plain;
	notes?: Notes;
	kept?: Map<string, KeptNote>; // the comments, by named path, with who wrote them
	provenance?: Provenance;
	history?: History;
	bytes: "original" | "composed" | "rendered"; // original: copied from the last source unchanged
	table?: PlainMap; // the value table for the full form
	load(): Content; // the resolved bytes
	render(syntax: string): string; // the resolved value in another syntax
}

export interface Instance {
	id: string;
	precedence: string[]; // most specific first; an overlay is first
	order: string[]; // flavors applied, in order; an overlay is last
	data: PlainMap;
	notes: Notes;
	kept: Map<string, KeptNote>; // the comments, by named path, with who wrote them
	provenance: Provenance; // value path -> flavors that set the value it has now
	history: History; // value path -> everything every layer did there
	markers: Record<string, string>; // flavor -> its marker file
	files: InstanceFile[];
	render(syntax?: string): string; // the values in a syntax, or "full": the full form as YAML
	full(): PlainMap; // everything above as one plain tree; see full.ts
}

export interface Requires {
	flavors: string[]; // references, as in parents
	keys: string[]; // value paths, as in rules: "slots.4", "machine.memory"
}

export type Overlay = string | PlainMap;

export const OVERLAY = "(overlay)";

export class FlavorError extends Error {}

interface FileAcc {
	name: string;
	overlay: boolean;
	structured: boolean;
	rule: FileRule | undefined;
	origins: string[];
	sources: string[];
	last: { flavor: string; path: string; out: string; syntax?: Syntax; template?: TemplateEngine };
	value?: Plain;
	notes?: NoteFold;
	provenance?: Provenance;
	history?: History;
}

export class Flavors {
	readonly marker: string;
	readonly syntaxes: readonly Syntax[];
	readonly templates: readonly TemplateEngine[];
	private byId = new Map<string, Flavor>();
	private options: FlavorsOptions;

	constructor(
		private source: Source,
		options: FlavorsOptions = {},
	) {
		this.options = { ...options, rules: [...(options.rules ?? []), { path: "recipe", combine: { key: "id" } }] };
		this.marker = options.marker ?? "flavor";
		this.syntaxes = options.syntaxes ?? [yaml, json];
		this.templates = options.templates ?? [liquid()];
		this.index();
	}

	ids(): string[] {
		return [...this.byId.keys()].sort();
	}

	get(id: string): Flavor {
		const f = this.byId.get(id);
		if (!f) throw new FlavorError(`no flavor ${id}`);
		return f;
	}

	// The flavor a parent reference means, seen from `from`. An exact id wins; otherwise the
	// flavor whose last path segments match, nearest to `from` in the tree.
	find(ref: string, from?: string): string {
		if (this.byId.has(ref)) return ref;
		const candidates = this.ids().filter((id) => id.endsWith("/" + ref));
		if (candidates.length === 0) throw new FlavorError(`${from ?? "overlay"}: no flavor ${ref}`);
		if (candidates.length === 1) return candidates[0]!;
		const shared = (id: string): number => {
			const a = id.split("/");
			const b = (from ?? "").split("/");
			let n = 0;
			while (n < a.length && n < b.length && a[n] === b[n]) n++;
			return n;
		};
		const ranked = candidates.map((id) => ({ id, n: shared(id) })).sort((x, y) => y.n - x.n);
		if (ranked[0]!.n === ranked[1]!.n) {
			throw new FlavorError(`${from ?? "overlay"}: ${ref} could be ${candidates.join(" or ")}`);
		}
		return ranked[0]!.id;
	}

	parentsOf(id: string): string[] {
		return this.get(id).parents.map((p) => this.find(p, id));
	}

	parentFlavors(id: string): Flavor[] {
		return this.parentsOf(id).map((p) => this.get(p));
	}

	// The precedence list, most specific first: the flavor, then its ancestors, each once.
	// It is C3 (Dylan, Python) with the later parent the more specific, so a flavor comes
	// before all its parents, a flavor's parents keep their order, and every ancestor's own
	// list is kept. Parents that disagree on an order are an error, never a silent choice.
	precedence(id: string): string[] {
		return [...this.mro(id, [])];
	}

	// The order layers are applied in: the precedence list, least specific first.
	order(id: string): string[] {
		return this.precedence(id).reverse();
	}

	private mros = new Map<string, readonly string[]>();

	private mro(id: string, visiting: readonly string[]): readonly string[] {
		const known = this.mros.get(id);
		if (known) return known;
		if (visiting.includes(id)) throw new FlavorError(`cycle: ${[...visiting, id].join(" > ")}`);
		const parents = this.parentsOf(id);
		const list = c3(id, parents, parents.map((p) => this.mro(p, [...visiting, id])));
		this.mros.set(id, list);
		return list;
	}

	// The flavors no one names as a parent, abstract ones left out: what a menu offers.
	leaves(): string[] {
		const named = new Set<string>();
		for (const id of this.byId.keys()) for (const p of this.parentsOf(id)) named.add(p);
		return this.ids().filter((id) => !named.has(id) && !this.get(id).abstract);
	}

	// Composes a flavor into an instance: its values, its files, and the record of both.
	// Abstract flavors refuse, and every ancestor's requires must be met.
	instantiate(id: string, options: { overlay?: Overlay | readonly Overlay[] } = {}): Instance {
		if (this.get(id).abstract) throw new FlavorError(`${id} is abstract; mix it into a flavor and instantiate that`);
		// Pass one is the flavor and its ancestors. Pass two is the overlays. Each overlay is
		// one more subclass of everything so far, with its own parents after it; a parent
		// already in the list is already applied and is left out.
		let mro: readonly string[] = this.mro(id, []);
		const overlayData = new Map<string, PlainMap>();
		const overlays = options.overlay === undefined ? [] : Array.isArray(options.overlay) ? options.overlay : [options.overlay];
		(overlays as Overlay[]).forEach((o, i) => {
			const name = `\u0000overlay ${i}`;
			const { data, parents } = typeof o === "string" ? { data: undefined, parents: [o] } : this.split(o, OVERLAY);
			const fresh = parents.map((p) => this.find(p)).filter((p) => !mro.includes(p));
			mro = c3(name, [mro[0]!, ...fresh], [mro, ...fresh.map((p) => this.mro(p, []))]);
			if (data) overlayData.set(name, data);
		});
		const order: string[] = [];
		const markers: Record<string, string> = {};
		const layers: { origin: string; data: PlainMap; notes?: Notes; files: string[] }[] = [];
		for (const f of [...mro].reverse()) {
			const data = overlayData.get(f);
			if (data) {
				order.push(OVERLAY);
				layers.push({ origin: OVERLAY, data, files: [] });
			} else if (!f.startsWith("\u0000")) {
				const flavor = this.get(f);
				order.push(f);
				markers[f] = flavor.marker;
				layers.push({ origin: f, data: flavor.data, notes: flavor.notes, files: flavor.files });
			}
		}

		const rules = this.options.rules;
		const provenance: Provenance = new Map();
		const history: History = new Map();
		const notes = new NoteFold(rules);
		let data: PlainMap = {};
		const files = new Map<string, FileAcc>();
		for (const layer of layers) {
			data = (merge(data, layer.data, { rules, origin: layer.origin, provenance, history }) as PlainMap | undefined) ?? {};
			notes.add(layer.data, layer.notes, layer.origin);
			for (const path of layer.files) this.layFile(files, layer.origin, path);
		}
		this.checkRequires(id, order, data);
		const finalNotes = notes.finish(data, provenance);
		const syntaxes = this.syntaxes;
		const resolvedFiles = [...files.values()].map((acc) => this.finishFile(acc, data, id));
		const taken = new Map<string, string>();
		for (const f of resolvedFiles) {
			const prior = taken.get(f.path);
			if (prior) throw new FlavorError(`${id}: ${prior} and ${f.sources.at(-1)} would both be written at ${f.path}`);
			taken.set(f.path, f.sources.at(-1)!);
		}
		const full = (): PlainMap => ({
			instance: id,
			precedence: [...order].reverse(),
			markers,
			values: valueTable(data, rules, provenance, history, notes.kept),
			files: Object.fromEntries(
				resolvedFiles.map((f) => {
					const e: PlainMap = { placement: f.placement, flavor: f.flavor, sources: f.sources, bytes: f.bytes };
					if (f.placement === "overlay") e.origins = f.origins;
					if (f.template) e.template = f.template;
					if (f.syntax) e.syntax = f.syntax;
					if (f.table) e.values = f.table;
					return [f.path, e];
				}),
			),
		});
		return {
			id,
			precedence: [...order].reverse(),
			order,
			data,
			notes: finalNotes,
			kept: notes.kept,
			provenance,
			history,
			markers,
			files: resolvedFiles,
			render: (syntax = "yaml") => (syntax === FULL ? fullText(full()) : syntaxNamed(syntax, syntaxes).stringify(data, finalNotes)),
			full,
		};
	}

	private checkRequires(id: string, order: readonly string[], data: PlainMap): void {
		const present = new Set(sites(data, this.options.rules).map((s) => s.key));
		const missing: string[] = [];
		for (const f of order) {
			if (f === OVERLAY) continue;
			const { flavors, keys } = this.get(f).requires;
			for (const r of flavors) {
				let ref: string | undefined;
				try {
					ref = this.find(r, f);
				} catch {
					ref = undefined;
				}
				if (!ref || !order.includes(ref)) missing.push(`${f} requires flavor ${r}`);
			}
			for (const k of keys) if (!present.has(k)) missing.push(`${f} requires key ${k}`);
		}
		if (missing.length) throw new FlavorError(`${id}: ${missing.join("; ")}`);
	}

	// `parents` is a list of references; a single name is read as a list of one.
	private split(raw: PlainMap, where: string): { data: PlainMap; parents: string[]; abstract: boolean; requires: Requires } {
		const strip = this.options.strip ?? ["id"];
		const names = (key: string, v: Plain): string[] =>
			(typeof v === "string" ? [v] : Array.isArray(v) ? v : v === null ? [] : [v]).map((p) => {
				if (typeof p !== "string" || !p.trim()) throw new FlavorError(`${where}: ${key} holds ${JSON.stringify(p)}, not a name`);
				return p.trim();
			});
		let parents: string[] = [];
		let abstract = false;
		const requires: Requires = { flavors: [], keys: [] };
		const data: PlainMap = {};
		for (const [k, v] of Object.entries(raw)) {
			if (k === "parents") parents = names("parents", v);
			else if (k === "abstract") abstract = v === true;
			else if (k === "requires") {
				if (!isMap(v)) throw new FlavorError(`${where}: requires is { flavors: [...], keys: [...] }`);
				requires.flavors = names("requires.flavors", v.flavors ?? null);
				requires.keys = names("requires.keys", v.keys ?? null);
			} else if (!strip.includes(k)) data[k] = v;
		}
		return { data, parents, abstract, requires };
	}

	private index(): void {
		const markers = new Map<string, string>();
		for (const path of this.source.paths()) {
			const slash = path.lastIndexOf("/");
			const base = path.slice(slash + 1);
			const hit = syntaxFor(base, this.syntaxes);
			if (!hit || hit.stem !== this.marker) continue;
			const dir = slash < 0 ? "." : path.slice(0, slash);
			const prior = markers.get(dir);
			if (prior) throw new FlavorError(`${dir}: two markers, ${prior} and ${path}`);
			markers.set(dir, path);
		}
		const owned = new Map<string, string[]>([...markers.keys()].map((d) => [d, []]));
		for (const path of this.source.paths()) {
			if ([...markers.values()].includes(path)) continue;
			let dir = path;
			let owner: string | undefined;
			while (owner === undefined) {
				const slash = dir.lastIndexOf("/");
				dir = slash < 0 ? "." : dir.slice(0, slash);
				if (markers.has(dir)) owner = dir;
				else if (dir === ".") break;
			}
			if (owner !== undefined) owned.get(owner)!.push(owner === "." ? path : path.slice(owner.length + 1));
		}
		for (const [dir, marker] of markers) {
			const syntax = syntaxFor(marker, this.syntaxes)!.syntax;
			let parsed;
			try {
				parsed = syntax.parse(text(this.source.read(marker)));
			} catch (e) {
				throw new FlavorError(`${marker}: ${(e as Error).message}`);
			}
			if (!isMap(parsed.value)) throw new FlavorError(`${marker}: not a map`);
			const { data, parents, abstract, requires } = this.split(parsed.value, marker);
			this.byId.set(dir, {
				id: dir,
				marker,
				syntax: syntax.name,
				parents,
				abstract,
				requires,
				data,
				notes: parsed.notes ?? new Map(),
				files: owned.get(dir)!.sort(),
			});
		}
	}

	private fileRule(path: string): FileRule | undefined {
		return this.options.files?.find((r) => glob(r.match, path));
	}

	private full(flavor: string, path: string): string {
		return flavor === "." ? path : `${flavor}/${path}`;
	}

	private layFile(files: Map<string, FileAcc>, flavor: string, path: string): void {
		const rule = this.fileRule(path);
		const overlay = rule?.overlay === true;
		const tpl = templateFor(path, this.templates);
		const hit = !overlay || rule?.opaque || tpl ? undefined : syntaxFor(path, this.syntaxes);
		const inside = tpl ? tpl.out : path;
		const out = overlay ? inside : this.full(flavor, inside);
		const name = hit ? hit.stem : out;
		const last: FileAcc["last"] = { flavor, path, out };
		if (hit) last.syntax = hit.syntax;
		if (tpl) last.template = tpl.engine;
		let acc = files.get(name);
		if (!acc || acc.structured !== Boolean(hit)) {
			acc = { name, overlay, structured: Boolean(hit), rule, origins: [], sources: [], last };
			if (hit) {
				acc.value = {};
				acc.notes = new NoteFold(rule?.rules);
				acc.provenance = new Map();
				acc.history = new Map();
			}
			files.set(name, acc);
		}
		acc.origins.push(flavor);
		acc.sources.push(this.full(flavor, path));
		acc.last = last;
		if (!hit) return;
		let parsed;
		try {
			parsed = hit.syntax.parse(text(this.source.read(this.full(flavor, path))));
		} catch (e) {
			throw new FlavorError(`${this.full(flavor, path)}: ${(e as Error).message}`);
		}
		const ctx = { origin: flavor, provenance: acc.provenance!, history: acc.history!, rules: acc.rule?.rules };
		acc.value = merge(acc.value, parsed.value, ctx) ?? {};
		acc.notes!.add(parsed.value, parsed.notes, flavor);
	}

	private finishFile(acc: FileAcc, values: PlainMap, instance: string): InstanceFile {
		const source = this.source;
		const raw = this.full(acc.last.flavor, acc.last.path);
		const placement = acc.overlay ? "overlay" : "own";
		const flavor = acc.last.flavor;
		if (!acc.structured) {
			const engine = acc.last.template;
			const path = acc.last.out;
			let rendered: string | undefined;
			const renderTemplate = (): string => {
				const read = (p: string): string => text(source.read(p));
				try {
					return engine!.render(read(raw), { values: clone(values) as PlainMap, flavor, instance, path }, read);
				} catch (e) {
					throw new FlavorError(`${raw}: ${(e as Error).message}`);
				}
			};
			const f: InstanceFile = {
				name: acc.name,
				path,
				placement,
				flavor,
				origins: acc.origins,
				sources: acc.sources,
				bytes: engine ? "rendered" : "original",
				load: () => (engine ? (rendered ??= renderTemplate()) : source.read(raw)),
				render: () => {
					throw new FlavorError(`${acc.name} is not in a known syntax`);
				},
			};
			if (engine) f.template = engine.name;
			return f;
		}
		const value = acc.value!;
		const notes = acc.notes!.finish(value, acc.provenance!);
		const inSyntax = acc.last.syntax!;
		const outSyntax = acc.rule?.as ? syntaxNamed(acc.rule.as, this.syntaxes) : inSyntax;
		const lastExt = acc.last.path.slice(acc.name.length);
		const ext = outSyntax.extensions.some((e) => e.toLowerCase() === lastExt.toLowerCase()) ? lastExt : outSyntax.extensions[0]!;
		const untouched = acc.origins.length === 1 && outSyntax === inSyntax;
		let rendered: string | undefined;
		return {
			name: acc.name,
			path: acc.name + ext,
			placement,
			flavor,
			syntax: outSyntax.name,
			origins: acc.origins,
			sources: acc.sources,
			value,
			notes,
			kept: acc.notes!.kept,
			provenance: acc.provenance!,
			history: acc.history!,
			bytes: untouched ? "original" : "composed",
			table: valueTable(value, acc.rule?.rules, acc.provenance!, acc.history!, acc.notes!.kept),
			load: () => (untouched ? source.read(raw) : (rendered ??= outSyntax.stringify(clone(value), notes))),
			render: (syntax) => syntaxNamed(syntax, this.syntaxes).stringify(clone(value), notes),
		};
	}
}

// C3 linearization. `parents` are in the order written, the last the most specific, so they
// are read in reverse; `lists` are the parents' own precedence lists, in the same order.
export function c3(id: string, parents: readonly string[], lists: readonly (readonly string[])[]): string[] {
	const seqs = [...lists].reverse().map((l) => [...l]);
	seqs.push([...parents].reverse());
	const out = [id];
	for (;;) {
		const live = seqs.filter((s) => s.length > 0);
		if (live.length === 0) return out;
		const head = live.map((s) => s[0]!).find((h) => !live.some((s) => s.indexOf(h) > 0));
		if (head === undefined) {
			const heads = [...new Set(live.map((s) => s[0]!))];
			throw new FlavorError(`${id}: its ancestors disagree on the order of ${heads.join(" and ")}`);
		}
		out.push(head);
		for (const s of live) if (s[0] === head) s.shift();
	}
}

// A Source over files already in memory: a bundler's glob, a zip, a test.
export function memorySource(files: Record<string, Content> | Map<string, Content | (() => Content)>): Source {
	const map = files instanceof Map ? files : new Map(Object.entries(files));
	return {
		paths: () => [...map.keys()],
		read(path) {
			const v = map.get(path);
			if (v === undefined) throw new FlavorError(`no file ${path}`);
			return typeof v === "function" ? v() : v;
		},
	};
}
