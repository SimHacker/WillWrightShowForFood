// The full form: an instance with everything instantiating knew, as one plain tree, written as
// YAML with comments that say what each part is. Every value path with its value now, who set
// it, everything every layer did there (overridden values and deletions included), and its
// comments with their authors; every file with where it came from.
//
// It is one more output format, `full`, written when a recipe asks for it
// ({ step: output, format: full, to: flavor.full.yml }). Run time never needs it.

import { isMap, type History, type Plain, type PlainMap, type Provenance, type Rule } from "./merge.js";
import { sites, type KeptNote, type Notes } from "./notes.js";
import { yaml } from "./yaml.js";

export const FULL = "full";

export function valueTable(
	value: Plain,
	rules: readonly Rule[] | undefined,
	provenance: Provenance,
	history: History,
	kept: Map<string, KeptNote>,
): PlainMap {
	const now = new Map(sites(value, rules).map((s) => [s.key, s.value]));
	const keys = [...now.keys()].filter((k) => k !== "");
	for (const k of [...history.keys(), ...kept.keys()]) if (!now.has(k) && !keys.includes(k)) keys.push(k);
	const out: PlainMap = {};
	for (const k of keys) {
		const entry: PlainMap = {};
		const v = now.get(k);
		const set = provenance.get(k);
		const changes = history.get(k);
		const note = kept.get(k);
		if (!now.has(k)) entry.gone = true;
		else if (!isMap(v) && (set || changes)) entry.value = v ?? null;
		if (set) entry.set_by = set;
		if (changes && (changes.length > 1 || !set || changes[0]!.set === undefined)) {
			entry.history = changes.map((c) => {
				const h: PlainMap = { by: c.by };
				if (c.set !== undefined) h.set = c.set;
				if (c.added) h.added = c.added;
				if (c.deleted) h.deleted = true;
				if (c.replaced) h.replaced = true;
				return h;
			});
		}
		if (note) {
			const c: PlainMap = {};
			if (note.before !== undefined) c.before = note.before;
			if (note.beforeBy !== undefined) c.before_by = note.beforeBy;
			if (note.after !== undefined) c.after = note.after;
			if (note.afterBy !== undefined) c.after_by = note.afterBy;
			entry.comment = c;
		}
		if (Object.keys(entry).length) out[k] = entry;
	}
	return out;
}

const notes: Notes = new Map([
	["", { before: " The full form of a flavor instance, from @wwsff/flavors. Run time reads the composed files, not this." }],
	["precedence", { before: " Most specific first. Of two parents, the later wins." }],
	["markers", { before: " The marker file each flavor was read from." }],
	["values", { before: " Every value path: its value now, who set it, every change any layer made, its comments and their authors." }],
	["files", { before: " Every file in the image: where it sits, which flavor it came from, what was read, and whether its bytes are copied, combined or rendered." }],
]);

export function fullText(tree: PlainMap): string {
	return yaml.stringify(tree, notes);
}
