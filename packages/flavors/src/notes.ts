// Comments, carried beside values. A syntax reads them into Notes keyed by path, with array
// items as [#i]; the resolver renames keyed entries to [name] so a comment follows its entry
// when a child reorders or merges the list.

import { combinationAt, entryName, isMap, pathKey, type Plain, type Provenance, type Rule } from "./merge.js";

export interface Note {
	before?: string; // comment lines above the key; text after each '#', lines joined by \n
	after?: string; // comment at the end of the value's line
}

export type Notes = Map<string, Note>;

export interface Site {
	key: string; // named path: keyed entries as [name]
	indexed: string; // the path a syntax uses: array items as [#i]
	parent?: string; // named path of the container
	value: Plain;
}

export function sites(value: Plain, rules?: readonly Rule[]): Site[] {
	const out: Site[] = [{ key: "", indexed: "", value }];
	const walk = (v: Plain, named: string[], indexed: string[]): void => {
		const parent = pathKey(named);
		if (Array.isArray(v)) {
			const s = combinationAt(rules, named);
			v.forEach((x, i) => {
				const name = typeof s === "object" ? entryName(x, s.key) : undefined;
				const n = [...named, name === undefined ? `[#${i}]` : `[${name}]`];
				const ix = [...indexed, `[#${i}]`];
				out.push({ key: pathKey(n), indexed: pathKey(ix), parent, value: x });
				walk(x, n, ix);
			});
		} else if (isMap(v)) {
			for (const [k, x] of Object.entries(v)) {
				const n = [...named, k];
				const ix = [...indexed, k];
				out.push({ key: pathKey(n), indexed: pathKey(ix), parent, value: x });
				walk(x, n, ix);
			}
		}
	};
	walk(value, [], []);
	return out;
}

interface Held {
	before?: string;
	beforeFrom?: string;
	after?: string;
	afterFrom?: string;
}

// A comment that survived, with who wrote it, keyed by named path.
export interface KeptNote extends Note {
	beforeBy?: string;
	afterBy?: string;
}

// Notes from every layer, latest wins per path and per kind.
export class NoteFold {
	private held = new Map<string, Held>();

	constructor(private rules?: readonly Rule[]) {}

	add(value: Plain, notes: Notes | undefined, origin: string): void {
		if (!notes?.size) return;
		const named = new Map(sites(value, this.rules).map((s) => [s.indexed, s.key]));
		for (const [ix, n] of notes) {
			const k = named.get(ix);
			if (k === undefined) continue;
			const h: Held = { ...this.held.get(k) };
			if (n.before !== undefined) {
				h.before = n.before;
				h.beforeFrom = origin;
			}
			if (n.after !== undefined) {
				h.after = n.after;
				h.afterFrom = origin;
			}
			this.held.set(k, h);
		}
	}

	// A comment above a key stays while the key exists. A comment at the end of a value's line
	// describes that value, so it stays only while the layer that wrote it still owns the value.
	finish(value: Plain, provenance: Provenance): Notes {
		const all = sites(value, this.rules);
		const byKey = new Map(all.map((s) => [s.key, s]));
		const owner = (k: string): string[] | undefined => {
			for (let s = byKey.get(k); s; s = s.parent === undefined ? undefined : byKey.get(s.parent)) {
				const p = provenance.get(s.key);
				if (p) return p;
			}
			return undefined;
		};
		const out: Notes = new Map();
		this.kept = new Map();
		for (const [k, h] of this.held) {
			const s = byKey.get(k);
			if (!s) continue;
			const n: Note = {};
			const kept: KeptNote = {};
			if (h.before !== undefined) {
				n.before = kept.before = h.before;
				if (h.beforeFrom !== undefined) kept.beforeBy = h.beforeFrom;
			}
			if (h.after !== undefined && h.afterFrom !== undefined) {
				const o = owner(k);
				if (!o || o.includes(h.afterFrom)) {
					n.after = kept.after = h.after;
					kept.afterBy = h.afterFrom;
				}
			}
			if (n.before !== undefined || n.after !== undefined) {
				out.set(s.indexed, n);
				this.kept.set(k, kept);
			}
		}
		return out;
	}

	kept = new Map<string, KeptNote>(); // filled by finish
}
