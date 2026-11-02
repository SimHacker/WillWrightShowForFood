// Combination: how one layer's value combines with what is below it; flavors.ts folds many.
// The name is Flavors' method combination, applied to values at a path.
//
// Maps merge key by key (RFC 7386 JSON Merge Patch): the patch's value wins,
// nested maps merge, and null deletes the key. Arrays and scalars replace.
// A rule changes that for the paths it names.

export type Plain = null | boolean | number | string | Plain[] | { [key: string]: Plain };
export type PlainMap = { [key: string]: Plain };

export type Combination =
	| "merge" // maps merge key by key; the default
	| "replace" // the patch's value replaces the base's whole, maps included
	| "append" // arrays: the base's items, then the patch's items not already there
	| Keyed; // arrays of maps matched by one field

export interface Keyed {
	key: string; // the field that names an entry, e.g. "path" or "id"
	remove?: string; // a field that, set to true, drops the entry; default "remove"
	entries?: "merge" | "replace"; // how a matched entry combines; default "merge"
}

// path is dotted keys; "*" matches any one key. Keyed array entries are one
// key each, written [name]: "resources.*.lang" matches "resources[a.fs].lang".
export interface Rule {
	path: string;
	combine: Combination;
}

export type Provenance = Map<string, string[]>; // path -> who set the value it has now

// Everything every layer did at a path, in order, including what was later overridden.
export interface Change {
	by: string;
	set?: Plain; // a scalar or array written here
	added?: Plain[]; // items an append or keyed list gained
	deleted?: true; // a null, or a keyed entry's remove
	replaced?: true; // a replace rule, or a type change, dropped what was here
}
export type History = Map<string, Change[]>;

export interface MergeContext {
	rules?: readonly Rule[] | undefined;
	origin?: string | undefined; // recorded in provenance for every value this patch sets
	provenance?: Provenance | undefined;
	history?: History | undefined;
}

function log(ctx: MergeContext, path: readonly string[], change: Omit<Change, "by">): void {
	if (!ctx.history || ctx.origin === undefined) return;
	const k = pathKey(path);
	const list = ctx.history.get(k) ?? [];
	list.push({ by: ctx.origin, ...change });
	ctx.history.set(k, list);
}

export function isMap(v: unknown): v is PlainMap {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function clone<T extends Plain>(v: T): T {
	return v === null || typeof v !== "object" ? v : (JSON.parse(JSON.stringify(v)) as T);
}

export function pathKey(path: readonly string[]): string {
	let out = "";
	for (const seg of path) out += out === "" || seg.startsWith("[") ? seg : "." + seg;
	return out;
}

function matches(pattern: string, path: readonly string[]): boolean {
	const segs = splitPattern(pattern);
	if (segs.length !== path.length) return false;
	return segs.every((s, i) => s === "*" || s === path[i]);
}

function splitPattern(pattern: string): string[] {
	const segs: string[] = [];
	for (const part of pattern.split(".")) {
		for (const m of part.matchAll(/[^[\]]+|\[[^\]]*\]/g)) segs.push(m[0]);
	}
	return segs;
}

export function combinationAt(rules: readonly Rule[] | undefined, path: readonly string[]): Combination {
	if (rules) for (const r of rules) if (matches(r.path, path)) return r.combine;
	return "merge";
}

function forget(ctx: MergeContext, path: readonly string[]): void {
	const p = ctx.provenance;
	if (!p) return;
	const k = pathKey(path);
	for (const key of [...p.keys()]) {
		if (key === k || k === "" || key.startsWith(k + ".") || key.startsWith(k + "[")) p.delete(key);
	}
}

function record(ctx: MergeContext, path: readonly string[], append = false): void {
	if (!ctx.provenance || ctx.origin === undefined) return;
	const k = pathKey(path);
	const prior = append ? ctx.provenance.get(k) ?? [] : [];
	ctx.provenance.set(k, prior.includes(ctx.origin) ? prior : [...prior, ctx.origin]);
}

// Returns the merged value, or undefined when the patch deleted it.
export function merge(
	base: Plain | undefined,
	patch: Plain,
	ctx: MergeContext = {},
	path: readonly string[] = [],
): Plain | undefined {
	if (patch === null) {
		if (base !== undefined) log(ctx, path, { deleted: true });
		forget(ctx, path);
		return undefined;
	}
	const how = combinationAt(ctx.rules, path);
	if (isMap(patch)) {
		let into: PlainMap;
		if (how === "replace" || !isMap(base)) {
			if (base !== undefined) log(ctx, path, { replaced: true });
			forget(ctx, path);
			into = {};
		} else {
			into = { ...base };
		}
		for (const [k, v] of Object.entries(patch)) {
			const r = merge(into[k], v, ctx, [...path, k]);
			if (r === undefined) delete into[k];
			else into[k] = r;
		}
		return into;
	}
	if (Array.isArray(patch) && Array.isArray(base)) {
		if (how === "append") {
			const out = [...base];
			const seen = new Set(out.map((x) => JSON.stringify(x)));
			const added: Plain[] = [];
			for (const item of patch) {
				const s = JSON.stringify(item);
				if (!seen.has(s)) {
					seen.add(s);
					out.push(clone(item));
					added.push(clone(item));
				}
			}
			if (added.length) log(ctx, path, { added });
			record(ctx, path, true);
			return out;
		}
		if (typeof how === "object") return mergeKeyed(base, patch, how, ctx, path);
	}
	if (Array.isArray(patch) && typeof how === "object") return mergeKeyed([], patch, how, ctx, path);
	forget(ctx, path);
	record(ctx, path);
	log(ctx, path, { set: clone(patch) });
	return clone(patch);
}

export function entryName(v: Plain, key: string): string | undefined {
	if (!isMap(v)) return undefined;
	const k = v[key];
	return k === undefined || k === null || typeof k === "object" ? undefined : String(k);
}

function mergeKeyed(base: Plain[], patch: Plain[], rule: Keyed, ctx: MergeContext, path: readonly string[]): Plain[] {
	const removeField = rule.remove ?? "remove";
	const out = [...base];
	for (const item of patch) {
		const name = entryName(item, rule.key);
		if (name === undefined || !isMap(item)) {
			out.push(clone(item));
			record(ctx, path, true);
			log(ctx, path, { added: [clone(item)] });
			continue;
		}
		const at = [...path, `[${name}]`];
		const i = out.findIndex((x) => entryName(x, rule.key) === name);
		const { [removeField]: removing, ...entry } = item;
		if (removing === true) {
			if (i >= 0) {
				out.splice(i, 1);
				log(ctx, at, { deleted: true });
			}
			forget(ctx, at);
			continue;
		}
		const prior = i >= 0 && rule.entries !== "replace" ? out[i] : undefined;
		if (i >= 0 && prior === undefined) log(ctx, at, { replaced: true });
		if (prior === undefined) forget(ctx, at);
		const merged = merge(prior ?? {}, entry, ctx, at) as PlainMap;
		if (i >= 0) out[i] = merged;
		else out.push(merged);
	}
	return out;
}
